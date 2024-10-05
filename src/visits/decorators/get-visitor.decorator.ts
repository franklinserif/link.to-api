import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { getVisitorInformation } from '@libs/visitor';

export const GetVisitor = createParamDecorator(
  async (_: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    try {
      const visitor = await getVisitorInformation(req);
      return visitor;
    } catch (error) {
      throw new InternalServerErrorException('cannot get visitor information');
    }
  },
);
