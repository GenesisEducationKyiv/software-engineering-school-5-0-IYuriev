import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

export enum EMAIL_METRICS_NAMES {
  CONFIRMATION_SUCCESS_TOTAL = 'email_confirmation_success_total',
  CONFIRMATION_SUCCESS_TOTAL_HELP = 'Total successful confirmation emails',
  CONFIRMATION_ERROR_TOTAL = 'email_confirmation_error_total',
  CONFIRMATION_ERROR_TOTAL_HELP = 'Total confirmation email errors',

  FORECAST_SUCCESS_TOTAL = 'email_forecast_success_total',
  FORECAST_SUCCESS_TOTAL_HELP = 'Total successful forecast emails',
  FORECAST_ERROR_TOTAL = 'email_forecast_error_total',
  FORECAST_ERROR_TOTAL_HELP = 'Total forecast email errors',
}

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric(EMAIL_METRICS_NAMES.CONFIRMATION_SUCCESS_TOTAL)
    private readonly confirmationSuccessCounter: Counter<string>,
    @InjectMetric(EMAIL_METRICS_NAMES.CONFIRMATION_ERROR_TOTAL)
    private readonly confirmationErrorCounter: Counter<string>,

    @InjectMetric(EMAIL_METRICS_NAMES.FORECAST_SUCCESS_TOTAL)
    private readonly forecastSuccessCounter: Counter<string>,
    @InjectMetric(EMAIL_METRICS_NAMES.FORECAST_ERROR_TOTAL)
    private readonly forecastErrorCounter: Counter<string>,
  ) {}

  incConfirmationSuccess() {
    this.confirmationSuccessCounter.inc();
  }
  incConfirmationError() {
    this.confirmationErrorCounter.inc();
  }

  incForecastSuccess() {
    this.forecastSuccessCounter.inc();
  }
  incForecastError() {
    this.forecastErrorCounter.inc();
  }
}
