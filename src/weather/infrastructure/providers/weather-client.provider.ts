import { NotFoundException } from '@nestjs/common';
import { Weather } from 'src/weather/domain/weather.entity';

export abstract class WeatherProvider {
  private nextHandler: WeatherProvider;

  setNext(handler: WeatherProvider): WeatherProvider {
    this.nextHandler = handler;
    return handler;
  }

  async handle(city: string): Promise<Weather> {
    try {
      return await this.getWeather(city);
    } catch {
      if (this.nextHandler) {
        return this.nextHandler.handle(city);
      }
      throw new NotFoundException("Providers can't handle the request");
    }
  }

  async checkCity(city: string): Promise<string> {
    try {
      return await this.validateCity(city);
    } catch {
      if (this.nextHandler) {
        return this.nextHandler.checkCity(city);
      }
      throw new NotFoundException('City not found in any provider');
    }
  }

  protected abstract getWeather(city: string): Promise<Weather>;
  protected abstract validateCity(city: string): Promise<string>;
}
