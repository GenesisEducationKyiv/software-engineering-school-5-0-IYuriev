export interface ICityService {
  validateCity(city: string): Promise<string>;
}
