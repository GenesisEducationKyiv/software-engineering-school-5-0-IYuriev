export enum WEATHER_METRICS_NAMES {
  WEATHER_SUCCESS_TOTAL = 'weather_success_total',
  WEATHER_SUCCESS_TOTAL_HELP = 'Total successful weather responses',
  WEATHER_ERROR_TOTAL = 'weather_error_total',
  WEATHER_ERROR_TOTAL_HELP = 'Total weather errors',
}

export const WEATHER_REQUEST_DURATION = {
  name: 'weather_request_duration',
  help: 'Duration of weather requests in ms',
  labelNames: ['city', 'success'],
};
