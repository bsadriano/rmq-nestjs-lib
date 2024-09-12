import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export interface AuthModuleOptions {
  inject?: any[];
}

export interface AuthOptionsFactory {
  createAuthOptions(): Promise<AuthModuleOptions> | AuthModuleOptions;
}

export interface AuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AuthOptionsFactory>;
  useClass?: Type<AuthOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AuthModuleOptions> | AuthModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export const AUTH_MODULE_OPTIONS = 'AuthModuleOptions';
