import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid input' })
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ForecastDto {
  @IsNotEmpty()
  payload: {
    to: string;
    subject: string;
    text: string;
  };
}
