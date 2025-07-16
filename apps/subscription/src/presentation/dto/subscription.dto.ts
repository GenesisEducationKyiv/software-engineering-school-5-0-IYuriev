import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Frequency } from '../../../../subscription/src/domain/subscription/subscription.entity';

export class SubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
