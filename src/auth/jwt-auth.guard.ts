import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { catchError, Observable, tap, timeout } from 'rxjs';
import { AUTH_SERVICE } from './services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    return this.authClient
      .send('validate-user', {
        Authentication: authentication,
      })
      .pipe(
        tap((res) => {
          if (res.error) {
            throw new UnauthorizedException();
          }

          this.addUser(res, context);
        }),
        timeout(5000),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string = '';

    if (context.getType() === 'rpc') {
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
    if (context.getType() === 'rpc') {
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
