import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export interface RmqModuleOptions {
  name: string;
  queue: string;
}

export interface RmqOptionsFactory {
  createRmqOptions(): Promise<RmqModuleOptions> | RmqModuleOptions;
}

export interface RmqModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<RmqOptionsFactory>;
  useClass?: Type<RmqOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RmqModuleOptions> | RmqModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export const RMQ_MODULE_OPTIONS = 'RmqModuleOptions';
