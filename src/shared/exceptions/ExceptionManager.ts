import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

export class ErrorManager extends HttpException {
  constructor(error: any, message?: string) {
    super(
      ErrorManager.handleError(error, message),
      ErrorManager.getStatusCode(error),
    );
  }

  private static handleError(error: any, message?: string): string {
    if (message) return message;
    if (error instanceof HttpException) {
      return error.message ? error.message : message;
    }
    if (error instanceof QueryFailedError) return 'Database query failed';
    if (error instanceof EntityNotFoundError) return 'Entity not found';
    return 'Internal server error';
  }

  private static getStatusCode(error: any): HttpStatus {
    if (error instanceof HttpException) return error.getStatus();
    if (error instanceof QueryFailedError) return HttpStatus.BAD_REQUEST;
    if (error instanceof EntityNotFoundError) return HttpStatus.NOT_FOUND;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
