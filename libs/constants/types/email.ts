export type EmailForecastPayload = {
  to: string;
  subject: string;
  text: string;
};

export type EmailConfirmationPayload = {
  email: string;
  token: string;
};

export enum EMAIL_EVENTS {
  SEND_FORECAST_EMAIL = 'send-forecast-email',
  SEND_CONFIRMATION_EMAIL = 'send-confirmation-email',
}
