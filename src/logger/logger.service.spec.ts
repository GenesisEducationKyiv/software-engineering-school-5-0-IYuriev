import { WinstonLogger } from './logger.service';
import * as winston from 'winston';

jest.mock('winston', () => {
  const mLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  return {
    format: {
      combine: jest.fn(),
      colorize: jest.fn(),
      simple: jest.fn(),
      timestamp: jest.fn(() => jest.fn()),
      printf: jest.fn(
        (fn: (info: winston.Logform.TransformableInfo) => string) => fn,
      ),
    },
    transports: {
      Console: jest.fn(),
      DailyRotateFile: jest.fn(),
      File: jest.fn(),
    },
    createLogger: jest.fn(() => mLogger),
  };
});

describe('WinstonLogger', () => {
  let logger: WinstonLogger;
  let mockLogger: jest.Mocked<winston.Logger>;

  beforeEach(() => {
    logger = new WinstonLogger();
    mockLogger = (winston.createLogger as jest.Mock).mock.results[0]
      .value as jest.Mocked<winston.Logger>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call info on log()', () => {
    logger.log('Test log', { some: 'data' });
    expect(mockLogger.info).toHaveBeenCalledWith('Test log', { some: 'data' });
  });

  it('should call error on error()', () => {
    logger.error('Test error', { error: 'details' });
    expect(mockLogger.error).toHaveBeenCalledWith('Test error', {
      error: 'details',
    });
  });

  it('should call warn on warn()', () => {
    logger.warn('Test warn', { warn: 'context' });
    expect(mockLogger.warn).toHaveBeenCalledWith('Test warn', {
      warn: 'context',
    });
  });

  it('should call debug on debug()', () => {
    logger.debug?.('Test debug', { debug: 'payload' });
    expect(mockLogger.debug).toHaveBeenCalledWith('Test debug', {
      debug: 'payload',
    });
  });

  it('should call verbose on verbose()', () => {
    logger.verbose?.('Test verbose', { verbose: 'info' });
    expect(mockLogger.verbose).toHaveBeenCalledWith('Test verbose', {
      verbose: 'info',
    });
  });
});
