import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import { CityService } from '../city/city.service';
import { ConflictException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationFrequency } from '../constants/enums/subscription';

describe('SubscriptionService', () => {
  let service: SubscriptionService;

  const mockPrismaService = {
    subscription: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockTokenService = {
    createConfirmToken: jest.fn(),
    getValidToken: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  const mockCityService = {
    validateCity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: EmailService, useValue: mockEmailService },
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
      mockPrismaService.subscription.findFirst.mockResolvedValue({ id: 1 });

      await expect(service.subscribe(dto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.subscription.findFirst).toHaveBeenCalledWith({
        where: { email: dto.email, city: dto.city },
      });
    });

    it('should create subscription and send confirmation email', async () => {
      mockPrismaService.subscription.findFirst.mockResolvedValue(null);
      mockCityService.validateCity.mockResolvedValue('Kyiv');
      mockPrismaService.subscription.create.mockResolvedValue({ id: 1 });
      mockTokenService.createConfirmToken.mockResolvedValue('token123');

      const result = await service.subscribe(dto);

      expect(mockCityService.validateCity).toHaveBeenCalledWith('Kyiv');
      expect(mockPrismaService.subscription.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          city: 'Kyiv',
          frequency: dto.frequency,
        },
      });
      expect(mockTokenService.createConfirmToken).toHaveBeenCalledWith(1);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'token123',
      );
      expect(result).toEqual({
        message: 'Subscription successful. Confirmation email sent.',
      });
    });
  });

  describe('confirm', () => {
    it('should confirm subscription with valid token', async () => {
      mockTokenService.getValidToken.mockResolvedValue({ subscriptionId: 42 });

      const result = await service.confirm('valid_token');

      expect(mockTokenService.getValidToken).toHaveBeenCalledWith(
        'valid_token',
      );
      expect(mockPrismaService.subscription.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { confirmed: true },
      });
      expect(result).toEqual({
        message: 'Subscription confirmed successfully',
      });
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription with valid token', async () => {
      mockTokenService.getValidToken.mockResolvedValue({ subscriptionId: 99 });

      const result = await service.unsubscribe('valid_token');

      expect(mockTokenService.getValidToken).toHaveBeenCalledWith(
        'valid_token',
      );
      expect(mockPrismaService.subscription.delete).toHaveBeenCalledWith({
        where: { id: 99 },
      });
      expect(result).toEqual({ message: 'Unsubscribed successfully' });
    });
  });
});
