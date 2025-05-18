import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Email } from '../constants/enums/email';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;

  const sendMailMock = jest.fn().mockResolvedValue(undefined);
  const createTransportMock = jest.fn().mockReturnValue({
    sendMail: sendMailMock,
  });

  beforeAll(() => {
    (nodemailer.createTransport as jest.Mock) = createTransportMock;
  });

  beforeEach(async () => {
    jest.clearAllMocks(); // Сначала очищаем моки

    const config = {
      EMAIL_USER: 'test@example.com',
      EMAIL_PASS: 'pass123',
      CONFIRMATION_URL: 'https://confirm.url',
    };

    const mockConfigService = {
      get: jest.fn((key: keyof typeof config) => config[key]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should create transporter with correct config', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: Email.SERVICE,
      auth: {
        user: 'test@example.com',
        pass: 'pass123',
      },
    });
  });

  describe('sendEmail', () => {
    it('should send email with correct params', async () => {
      const email = 'recipient@example.com';
      const token = 'some-token';
      const expectedLink = `https://confirm.url/${token}`;

      await service.sendEmail(email, token);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: email,
        subject: Email.SUBJECT,
        text: `${Email.TEXT}${expectedLink}`,
      });
    });
  });

  describe('sendForecastEmail', () => {
    it('should send forecast email with given subject and text', async () => {
      const email = 'recipient@example.com';
      const subject = 'Weather Forecast';
      const text = 'Sunny with chance of rain';

      await service.sendForecastEmail(email, subject, text);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: email,
        subject,
        text,
      });
    });
  });
});
