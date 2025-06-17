import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { ConflictException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationFrequency } from '../constants/enums/subscription';
import { SubscriptionRepositoryToken } from './interfaces/subscription-repoository.interface';
import { EmailServiceToken } from '../email/interfaces/email-service.interface';
import { TokenServiceToken } from '../token/interfaces/token-service.interface';
import { CityService } from '../city/city.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let mockSubscriptionRepo: {
    findSubscription: jest.Mock;
    create: jest.Mock;
    confirm: jest.Mock;
    delete: jest.Mock;
  };
  let mockTokenService: {
    createConfirmToken: jest.Mock;
    getValidToken: jest.Mock;
  };
  let mockEmailService: {
    sendEmail: jest.Mock;
    sendConfirmationEmail: jest.Mock;
  };
  let mockCityService: { validateCity: jest.Mock };

  beforeEach(async () => {
    mockSubscriptionRepo = {
      findSubscription: jest.fn(),
      create: jest.fn(),
      confirm: jest.fn(),
      delete: jest.fn(),
    };
    mockTokenService = {
      createConfirmToken: jest.fn(),
      getValidToken: jest.fn(),
    };
    mockEmailService = {
      sendEmail: jest.fn(),
      sendConfirmationEmail: jest.fn(),
    };
    mockCityService = {
      validateCity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionRepositoryToken,
          useValue: mockSubscriptionRepo,
        },
        { provide: TokenServiceToken, useValue: mockTokenService },
        { provide: EmailServiceToken, useValue: mockEmailService },
        { provide: CityService, useValue: mockCityService },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: NotificationFrequency.DAILY,
    };

    it('should throw if subscription already exists', async () => {
      mockSubscriptionRepo.findSubscription.mockResolvedValue({ id: 1 });

      await expect(service.subscribe(dto)).rejects.toThrow(ConflictException);
      expect(mockSubscriptionRepo.findSubscription).toHaveBeenCalledWith(dto);
    });

    it('should create subscription and send confirmation email', async () => {
      mockSubscriptionRepo.findSubscription.mockResolvedValue(null);
      mockSubscriptionRepo.create.mockResolvedValue({ id: 1 });
      mockTokenService.createConfirmToken.mockResolvedValue('token123');

      const result = await service.subscribe(dto);

      expect(mockSubscriptionRepo.create).toHaveBeenCalledWith(dto);
      expect(mockTokenService.createConfirmToken).toHaveBeenCalledWith(1);
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@example.com',
        'token123',
      );
      expect(result).toEqual({
        message: 'Subscription successful. Confirmation email sent.',
      });
    });

    describe('confirm', () => {
      it('should confirm subscription with valid token', async () => {
        mockTokenService.getValidToken.mockResolvedValue({
          subscriptionId: 42,
        });

        const result = await service.confirm('valid_token');

        expect(mockTokenService.getValidToken).toHaveBeenCalledWith(
          'valid_token',
        );
        expect(mockSubscriptionRepo.confirm).toHaveBeenCalledWith(42);
        expect(result).toEqual({
          message: 'Subscription confirmed successfully',
        });
      });
    });

    describe('unsubscribe', () => {
      it('should delete subscription with valid token', async () => {
        mockTokenService.getValidToken.mockResolvedValue({
          subscriptionId: 99,
        });

        const result = await service.unsubscribe('valid_token');

        expect(mockTokenService.getValidToken).toHaveBeenCalledWith(
          'valid_token',
        );
        expect(mockSubscriptionRepo.delete).toHaveBeenCalledWith(99);
        expect(result).toEqual({ message: 'Unsubscribed successfully' });
      });
    });
  });
});
