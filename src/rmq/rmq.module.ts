import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
  exchanges: {
    name: string;
    type: string;
  }[];
}

@Module({})
export class RmqModule {
  static register({ exchanges }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            exchanges,
            uri: configService.get<string>('rmq.uri'),
            connectionInitOptions: { wait: false },
            enableControllerDiscovery: false,
          }),
        }),
      ],
      exports: [RabbitMQModule],
    };
  }
}
