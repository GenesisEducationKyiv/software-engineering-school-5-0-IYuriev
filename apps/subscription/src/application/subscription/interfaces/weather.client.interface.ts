export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');

export interface WeatherClient {
  validateCity(data: { city: string }): Promise<string>;
}
