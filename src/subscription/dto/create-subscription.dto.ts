import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationFrequency } from '../../constants/enums/subscription';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid input' })
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(NotificationFrequency)
  frequency: NotificationFrequency;
}
