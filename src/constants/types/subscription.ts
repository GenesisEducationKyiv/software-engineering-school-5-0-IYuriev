export type Subscription = {
  id: number;
  email: string;
  city: string;
  confirmed?: boolean;
  token?: string;
};
