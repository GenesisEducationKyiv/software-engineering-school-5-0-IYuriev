import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Frequency } from 'src/core/subscription/subscription.entity';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid input' })
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;
}
