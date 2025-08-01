/* eslint-disable @typescript-eslint/unbound-method */
import { SubscriptionService } from '../src/application/subscription/use-cases/subscription.service';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionRepo } from '../src/application/subscription/interfaces/subscription-repoository.interface';
import { TokenProvider } from '../src/domain/token/token-service.interface';
import { SubscriptionPayload } from '../src/domain/subscription/subscription-service.interface';
import { Frequency } from '../src/domain/subscription/subscription.entity';
import { EmailPublisher } from '../src/application/subscription/interfaces/email.publisher.interface';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let emailPublisher: jest.Mocked<EmailPublisher>;
  let subscriptionRepo: jest.Mocked<SubscriptionRepo>;
  let tokenService: jest.Mocked<TokenProvider>;

  const payload: SubscriptionPayload = {
    email: 'test@mail.com',
    city: 'Kyiv',
    frequency: Frequency.DAILY,
  };

  beforeEach(() => {
    emailPublisher = {
      sendConfirmationEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailPublisher>;
    subscriptionRepo = {
      findSubscription: jest.fn(),
      create: jest.fn(),
      confirm: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionRepo>;
    tokenService = {
      createConfirmToken: jest.fn(),
      getValidToken: jest.fn(),
    } as unknown as jest.Mocked<TokenProvider>;
    service = new SubscriptionService(
      emailPublisher,
      subscriptionRepo,
      tokenService,
    );
  });

  describe('subscribe', () => {
    it('should throw if already subscribed', async () => {
      subscriptionRepo.findSubscription.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.DAILY,
        confirmed: false,
        tokens: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await expect(service.subscribe(payload)).rejects.toThrow(RpcException);
    });

    it('should create subscription and send confirmation email', async () => {
      subscriptionRepo.findSubscription.mockResolvedValue(null);
      subscriptionRepo.create.mockResolvedValue({
        id: 2,
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.DAILY,
        confirmed: false,
        tokens: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      tokenService.createConfirmToken.mockResolvedValue('token123');
      await service.subscribe(payload);
      expect(subscriptionRepo.create.mock.calls.length).toBe(1);
      expect(subscriptionRepo.create.mock.calls[0][0]).toEqual(payload);
      expect(tokenService.createConfirmToken.mock.calls.length).toBe(1);
      expect(tokenService.createConfirmToken.mock.calls[0][0]).toEqual(2);
      expect(emailPublisher.sendConfirmationEmail).toHaveBeenCalledTimes(1);
      expect(emailPublisher.sendConfirmationEmail).toHaveBeenCalledWith({
        email: 'test@mail.com',
        token: 'token123',
      });
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      tokenService.getValidToken.mockResolvedValue({
        id: 101,
        subscriptionId: 3,
        token: 'token456',
        createdAt: new Date(),
      });
      await service.confirm('token456');
      expect(tokenService.getValidToken.mock.calls.length).toBe(1);
      expect(tokenService.getValidToken.mock.calls[0][0]).toEqual('token456');
      expect(subscriptionRepo.confirm.mock.calls.length).toBe(1);
      expect(subscriptionRepo.confirm.mock.calls[0][0]).toEqual(3);
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription', async () => {
      tokenService.getValidToken.mockResolvedValue({
        id: 102,
        subscriptionId: 4,
        token: 'token789',
        createdAt: new Date(),
      });
      await service.unsubscribe('token789');
      expect(tokenService.getValidToken.mock.calls.length).toBe(1);
      expect(tokenService.getValidToken.mock.calls[0][0]).toEqual('token789');
      expect(tokenService.getValidToken.mock.calls.length).toBe(1);
      expect(tokenService.getValidToken.mock.calls[0][0]).toEqual('token789');
      expect(subscriptionRepo.delete.mock.calls.length).toBe(1);
      expect(subscriptionRepo.delete.mock.calls[0][0]).toEqual(4);
    });
  });
});
