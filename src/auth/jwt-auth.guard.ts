import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AUTH_EXCHANGE, AUTH_VALIDATE_USER_ROUTING_KEY } from './services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const authentication = this.getAuthentication(context);
      const response: any = await this.amqpConnection.request({
        exchange: AUTH_EXCHANGE,
        routingKey: AUTH_VALIDATE_USER_ROUTING_KEY,
        payload: {
          message: {
            Authentication: authentication,
          },
        },
      });

      if ('error' === response.status) {
        throw new UnauthorizedException();
      }

      this.addUser(response, context);

      return true;
    } catch (error: any) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string = '';

    if (['rpc', 'rmq'].includes(context.getType())) {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.header('Authorization');
      if (authHeader) {
        authentication = authHeader.split(' ')[1] ?? '';
      }
    } // @ts-expect-error graphql not in context types yet
    else if (context.getType() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      authentication = ctx.getContext().req.headers['authorization'];
    }

    if (!authentication) {
      throw new UnauthorizedException(
        'No value was provided for Authentication',
      );
    }
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (['rpc', 'rmq'].includes(context.getType())) {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    } // @ts-expect-error graphql not in context types yet
    else if (context.getType() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      ctx.getContext().req.user = user;
    }
  }
}
