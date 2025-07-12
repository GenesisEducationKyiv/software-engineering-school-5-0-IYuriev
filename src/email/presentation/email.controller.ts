import { Controller, Post, Body } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { EmailServiceToken } from 'src/email/domain/email-service.interface';
import { EmailProvider } from 'src/email/domain/email-service.interface';
import { ConfirmationDto, ForecastDto } from './dto/create-email.dto';

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
    await this.emailService.sendForecastEmail(dto);
    return { message: 'Forecast email sent' };
  }
}
