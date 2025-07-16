import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { WeatherHttpClient } from '../../infrastructure/clients/weather-http.client';

@Module({
  imports: [HttpModule],
  providers: [WeatherHttpClient],
  controllers: [WeatherController],
})
export class WeatherControllerModule {}
