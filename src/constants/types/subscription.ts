export interface ISubscription {
  id: number;
  email: string;
  city: string;
  confirmed?: boolean;
  token?: string;
}
