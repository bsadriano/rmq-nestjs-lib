import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AUTH_QUEUE, AUTH_SERVICE } from './services';
import { RmqModule } from '../rmq/rmq.module';
import cookieParser from 'cookie-parser';

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }

  static register() {
    return {
      module: AuthModule,
      imports: [
        RmqModule.register({
          name: AUTH_SERVICE,
          queue: AUTH_QUEUE,
        }),
      ],
      exports: [RmqModule],
    };
  }
}
