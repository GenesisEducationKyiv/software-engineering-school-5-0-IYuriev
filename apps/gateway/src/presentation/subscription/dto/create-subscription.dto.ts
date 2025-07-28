import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email input' })
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  frequency: number;
}
