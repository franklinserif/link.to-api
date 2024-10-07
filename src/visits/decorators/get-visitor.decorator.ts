import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getVisitorInformation } from '@libs/visitor';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';

export const GetVisitor = createParamDecorator(
  async (_: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    try {
      const visitor = await getVisitorInformation(req);
      return visitor;
    } catch (error) {
      throw new ErrorManager(error, 'cannot get visitor information');
    }
  },
);
