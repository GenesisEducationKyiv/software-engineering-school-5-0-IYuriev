import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Email } from '../../../libs/constants/enums/email';
import {
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../libs/constants/types/email';
import { EmailTransportToken } from '../src/application/interfaces/email-transport.interface';
import { EmailService } from '../src/application/use-case/email.service';

describe('EmailService', () => {
  let service: EmailService;
  let mockEmailTransport: { sendMail: jest.Mock };
  let config: ConfigService;

  beforeEach(async () => {
    mockEmailTransport = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: EmailTransportToken, useValue: mockEmailTransport },
        ConfigService,
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendConfirmationEmail', () => {
    it('should send confirmation email with correct params', async () => {
      const payload: EmailConfirmationPayload = {
        email: 'user@example.com',
        token: 'sometoken',
      };

      await service.sendConfirmationEmail(payload);

      expect(mockEmailTransport.sendMail).toHaveBeenCalledWith({
        from: config.get<string>('EMAIL_USER'),
        to: payload.email,
        subject: Email.SUBJECT,
        text: `${Email.TEXT}${config.get<string>('CONFIRMATION_URL')}/${payload.token}`,
      });
    });

    it('should propagate errors from emailTransport', async () => {
      mockEmailTransport.sendMail.mockRejectedValueOnce(new Error('fail'));
      await expect(
        service.sendConfirmationEmail({
          email: 'fail@example.com',
          token: 'token',
        }),
      ).rejects.toThrow('fail');
    });
  });

  describe('sendForecastEmail', () => {
    it('should send forecast email with correct payload', async () => {
      const payload: EmailForecastPayload = {
        to: 'forecast@example.com',
        subject: 'Weather Update',
        text: 'Today is sunny!',
      };

      await service.sendForecastEmail(payload);

      expect(mockEmailTransport.sendMail).toHaveBeenCalledWith({
        from: config.get<string>('EMAIL_USER'),
        ...payload,
      });
    });

    it('should propagate errors from emailTransport', async () => {
      mockEmailTransport.sendMail.mockRejectedValueOnce(
        new Error('send error'),
      );
      await expect(
        service.sendForecastEmail({
          to: 'fail@example.com',
          subject: 'fail',
          text: 'fail',
        }),
      ).rejects.toThrow('send error');
    });
  });
});
