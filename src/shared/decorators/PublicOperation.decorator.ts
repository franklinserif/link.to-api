import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function PublicOperation(summary: string, responses: any[] = []) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 201, description: 'Success' }),
    ApiResponse({ status: 400, description: 'Invalid input' }),
    ...responses,
  );
}
