export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export enum EMAIL_EVENTS {
  SEND_FORECAST_EMAIL = 'send-forecast-email',
}
