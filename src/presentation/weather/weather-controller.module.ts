import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [WeatherModule],
  controllers: [WeatherController],
})
export class WeatherControllerModule {}
