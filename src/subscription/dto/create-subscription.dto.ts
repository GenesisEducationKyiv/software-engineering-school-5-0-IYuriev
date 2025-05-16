import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationFrequency } from 'src/constants/enums/subscription';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(NotificationFrequency)
  frequency: NotificationFrequency;
}
