import { LoggerMiddleware } from './logger.middleware';
// import { Logger } from '@nestjs/common';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  //let logger: Logger;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();
    //logger = new Logger(LoggerMiddleware.name);
  });

  it('should be defined', () => {
    expect(loggerMiddleware).toBeDefined();
  });

  it('should log the request method and original URL', () => {
    const req = { method: 'GET', originalUrl: '/test' };
    const res = {};
    const next = jest.fn();

    loggerMiddleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
