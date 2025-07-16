import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Email } from 'src/constants/enums/email';
import { EmailPayload } from 'src/constants/types/email';
import { EmailTransportToken } from 'src/email/src/application/interfaces/email-transport.interface';
import { EmailService } from 'src/email/src/application/use-case/email.service';

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
      const email = 'user@example.com';
      const token = 'sometoken';

      await service.sendConfirmationEmail(email, token);

      expect(mockEmailTransport.sendMail).toHaveBeenCalledWith({
        from: config.get<string>('EMAIL_USER'),
        to: email,
        subject: Email.SUBJECT,
        text: `${Email.TEXT}${config.get<string>('CONFIRMATION_URL')}/${token}`,
      });
    });

    it('should propagate errors from emailTransport', async () => {
      mockEmailTransport.sendMail.mockRejectedValueOnce(new Error('fail'));
      await expect(
        service.sendConfirmationEmail('fail@example.com', 'token'),
      ).rejects.toThrow('fail');
    });
  });

  describe('sendForecastEmail', () => {
    it('should send forecast email with correct payload', async () => {
      const payload: EmailPayload = {
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
