import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function AuthGuardedOperation(summary: string, responses: any = {}) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(AuthGuard()),
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Success' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Not found' }),
    ...responses,
  );
}
