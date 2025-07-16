import { Controller, Post, Body } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfirmationDto, ForecastDto } from './dto/create-email.dto';
import {
  EmailProvider,
  EmailServiceToken,
} from '../domain/email-service.interface';

@Controller('email')
export class EmailController {
  constructor(
    @Inject(EmailServiceToken)
    private readonly emailService: EmailProvider,
  ) {}

  @Post('confirmation')
  async sendConfirmationEmail(
    @Body() { email, token }: ConfirmationDto,
  ): Promise<{ message: string }> {
    await this.emailService.sendConfirmationEmail(email, token);
    return { message: 'Confirmation email sent' };
  }

  @Post('forecast')
  async sendForecastEmail(
    @Body() dto: ForecastDto,
  ): Promise<{ message: string }> {
    await this.emailService.sendForecastEmail(dto.payload);
    return { message: 'Forecast email sent' };
  }
}
