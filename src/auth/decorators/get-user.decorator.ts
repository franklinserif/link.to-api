import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (data && user?.id) {
      return user[data];
    }

    return user;
  },
);
