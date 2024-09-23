import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
  (_: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Most provide a valid refresh token');
    }
    return refreshToken;
  },
);
