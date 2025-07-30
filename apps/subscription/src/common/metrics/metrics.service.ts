import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';

export enum SUBSCRIPTION_METRICS_NAMES {
  SUBSCRIBE_SUCCESS_TOTAL = 'subscribe_success_total',
  SUBSCRIBE_SUCCESS_TOTAL_HELP = 'Total successful subscribes',
  SUBSCRIBE_ERROR_TOTAL = 'subscribe_error_total',
  SUBSCRIBE_ERROR_TOTAL_HELP = 'Total subscribe errors',

  CONFIRM_SUCCESS_TOTAL = 'confirm_success_total',
  CONFIRM_SUCCESS_TOTAL_HELP = 'Total successful confirms',
  CONFIRM_ERROR_TOTAL = 'confirm_error_total',
  CONFIRM_ERROR_TOTAL_HELP = 'Total confirm errors',

  UNSUBSCRIBE_SUCCESS_TOTAL = 'unsubscribe_success_total',
  UNSUBSCRIBE_SUCCESS_TOTAL_HELP = 'Total successful unsubscribes',
  UNSUBSCRIBE_ERROR_TOTAL = 'unsubscribe_error_total',
  UNSUBSCRIBE_ERROR_TOTAL_HELP = 'Total unsubscribe errors',
}

@Injectable()
export class MetricsService {
  private subscribeDuration = new Gauge({
    name: 'subscription_request_duration',
    help: 'Duration of subscription requests in ms',
    labelNames: ['success', 'email'],
  });
  constructor(
    @InjectMetric(SUBSCRIPTION_METRICS_NAMES.SUBSCRIBE_SUCCESS_TOTAL)
    private readonly subscribeSuccessCounter: Counter<string>,
    @InjectMetric(SUBSCRIPTION_METRICS_NAMES.SUBSCRIBE_ERROR_TOTAL)
    private readonly subscribeErrorCounter: Counter<string>,

    @InjectMetric(SUBSCRIPTION_METRICS_NAMES.CONFIRM_SUCCESS_TOTAL)
    private readonly confirmSuccessCounter: Counter<string>,
    @InjectMetric(SUBSCRIPTION_METRICS_NAMES.CONFIRM_ERROR_TOTAL)
    private readonly confirmErrorCounter: Counter<string>,

    @InjectMetric(SUBSCRIPTION_METRICS_NAMES.UNSUBSCRIBE_SUCCESS_TOTAL)
    private readonly unsubscribeSuccessCounter: Counter<string>,
    @InjectMetric(SUBSCRIPTION_METRICS_NAMES.UNSUBSCRIBE_ERROR_TOTAL)
    private readonly unsubscribeErrorCounter: Counter<string>,
  ) {}

  incSubscribeSuccess() {
    this.subscribeSuccessCounter.inc();
  }
  incSubscribeError() {
    this.subscribeErrorCounter.inc();
  }
  incConfirmSuccess() {
    this.confirmSuccessCounter.inc();
  }
  incConfirmError() {
    this.confirmErrorCounter.inc();
  }
  incUnsubscribeSuccess() {
    this.unsubscribeSuccessCounter.inc();
  }
  incUnsubscribeError() {
    this.unsubscribeErrorCounter.inc();
  }

  observeSubscribeDuration(ms: number, success: boolean, email: string) {
    this.subscribeDuration.set({ success: String(success), email }, ms);
  }
}
