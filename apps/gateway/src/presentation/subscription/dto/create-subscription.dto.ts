import { Frequency } from '../../../../../subscription/src/domain/subscription/subscription.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
