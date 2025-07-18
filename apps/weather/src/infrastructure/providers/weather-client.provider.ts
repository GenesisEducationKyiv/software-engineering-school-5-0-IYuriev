import { Weather } from '../../domain/weather.entity';
import { RpcException } from '@nestjs/microservices';

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
      throw new RpcException("Providers can't handle the request");
    }
  }

  async checkCity(city: string): Promise<string> {
    try {
      return await this.validateCity(city);
    } catch {
      if (this.nextHandler) {
        return this.nextHandler.checkCity(city);
      }
      throw new RpcException({
        code: 5,
        message: 'City not found in any provider',
      });
    }
  }

  protected abstract getWeather(city: string): Promise<Weather>;
  protected abstract validateCity(city: string): Promise<string>;
}
