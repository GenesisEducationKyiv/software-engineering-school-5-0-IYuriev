import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSubscriptionDto } from 'src/application/subscription/dto/create-subscription.dto';
import { SubscriptionService } from 'src/application/subscription/use-cases/subscription.service';
import { EmailServiceToken } from 'src/core/email/email-service.interface';
import { SubscriptionRepositoryToken } from 'src/core/subscription/subscription-repoository.interface';
import { Frequency } from 'src/core/subscription/subscription.entity';
import { TokenServiceToken } from 'src/core/token/token-service.interface';

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionRepositoryToken,
          useValue: mockSubscriptionRepo,
        },
        { provide: TokenServiceToken, useValue: mockTokenService },
        { provide: EmailServiceToken, useValue: mockEmailService },
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
      frequency: Frequency.DAILY,
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

      await service.subscribe(dto);

      expect(mockSubscriptionRepo.create).toHaveBeenCalledWith(dto);
      expect(mockTokenService.createConfirmToken).toHaveBeenCalledWith(1);
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@example.com',
        'token123',
      );
    });

    describe('confirm', () => {
      it('should confirm subscription with valid token', async () => {
        mockTokenService.getValidToken.mockResolvedValue({
          subscriptionId: 42,
        });

        await service.confirm('valid_token');

        expect(mockTokenService.getValidToken).toHaveBeenCalledWith(
          'valid_token',
        );
        expect(mockSubscriptionRepo.confirm).toHaveBeenCalledWith(42);
      });
    });

    describe('unsubscribe', () => {
      it('should delete subscription with valid token', async () => {
        mockTokenService.getValidToken.mockResolvedValue({
          subscriptionId: 99,
        });

        await service.unsubscribe('valid_token');

        expect(mockTokenService.getValidToken).toHaveBeenCalledWith(
          'valid_token',
        );
        expect(mockSubscriptionRepo.delete).toHaveBeenCalledWith(99);
      });
    });
  });
});
