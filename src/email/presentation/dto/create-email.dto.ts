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
  @IsString()
  @IsEmail({}, { message: 'Invalid input' })
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
