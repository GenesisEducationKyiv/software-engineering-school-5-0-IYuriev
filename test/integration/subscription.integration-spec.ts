import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';
import { CityService } from 'src/city/city.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationFrequency } from 'src/constants/enums/subscription';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaService;

  const mockEmailService = {
    sendEmail: jest.fn(),
  };
  const mockTokenService = {
    createConfirmToken: jest.fn().mockResolvedValue('token123'),
    getValidToken: jest.fn(),
  };
  const mockCityService = {
    validateCity: jest.fn().mockResolvedValue('Kyiv'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        SubscriptionService,
        PrismaService,
        { provide: EmailService, useValue: mockEmailService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: CityService, useValue: mockCityService },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.token.deleteMany();
    await prisma.subscription.deleteMany();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await prisma.token.deleteMany();
    await prisma.subscription.deleteMany();
  });

  it('should create a new subscription and send email', async () => {
    const dto = {
      email: 'integration@example.com',
      city: 'Kyiv',
      frequency: NotificationFrequency.DAILY,
    };

    const result = await service.subscribe(dto);

    expect(result).toEqual({
      message: 'Subscription successful. Confirmation email sent.',
    });

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city },
    });
    expect(sub).toBeDefined();
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      dto.email,
      'token123',
    );
  });

  it('should not allow duplicate subscription', async () => {
    const dto = {
      email: 'integration@example.com',
      city: 'Kyiv',
      frequency: NotificationFrequency.DAILY,
    };
    await service.subscribe(dto);

    await expect(service.subscribe(dto)).rejects.toThrow();
  });

  it('should confirm subscription', async () => {
    const dto = {
      email: 'integration@example.com',
      city: 'Kyiv',
      frequency: NotificationFrequency.DAILY,
    };
    await service.subscribe(dto);

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    if (!sub) {
      throw new Error('Subscription not found');
    }
    mockTokenService.getValidToken.mockResolvedValue({
      subscriptionId: sub.id,
    });

    const result = await service.confirm('sometoken');
    expect(result).toEqual({ message: 'Subscription confirmed successfully' });

    const updated = await prisma.subscription.findUnique({
      where: { id: sub.id },
    });
    if (!updated) {
      throw new Error('Updated subscription not found');
    }
    expect(updated.confirmed).toBe(true);
  });

  it('should unsubscribe', async () => {
    const dto = {
      email: 'integration@example.com',
      city: 'Kyiv',
      frequency: NotificationFrequency.DAILY,
    };
    await service.subscribe(dto);

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    if (!sub) {
      throw new Error('Subscription not found');
    }
    mockTokenService.getValidToken.mockResolvedValue({
      subscriptionId: sub.id,
    });

    const result = await service.unsubscribe('sometoken');
    expect(result).toEqual({ message: 'Unsubscribed successfully' });

    const deleted = await prisma.subscription.findUnique({
      where: { id: sub.id },
    });
    expect(deleted).toBeNull();
  });
});
