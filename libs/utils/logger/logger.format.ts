import * as winston from 'winston';

export const getWinstonFormat = () => {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${String(timestamp)} [${level.toUpperCase()}]: ${String(message)} ${metaString}`;
    }),
  );
};
