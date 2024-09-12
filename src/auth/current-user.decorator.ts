import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().user;
    }
    if (ctx.getType() === 'rpc') {
      return ctx.switchToRpc().getData().user;
    }
  },
);
