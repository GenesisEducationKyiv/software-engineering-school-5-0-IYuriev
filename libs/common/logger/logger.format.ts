import * as winston from 'winston';

export const getWinstonFormat = (serviceName?: string) => {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
      let svc = '';
      if (typeof service === 'string') {
        svc = service;
      } else if (serviceName) {
        svc = serviceName;
      }
      const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `[${String(level).toUpperCase()}] [${String(timestamp)}]${svc ? ` [${svc}]` : ''} ${typeof message === 'string' ? message : JSON.stringify(message)}${metaString ? ' ' + metaString : ''}`;
    }),
  );
};
