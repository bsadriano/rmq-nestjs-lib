import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqModuleOptions } from './interfaces';
import { RmqService } from './rmq.service';

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name, queue }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: `${name}`,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rmq.uri')!],
                queue: configService.get<string>(`rmq.${queue}_queue`),
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
