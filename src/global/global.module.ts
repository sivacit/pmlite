import type { DynamicModule, MiddlewareConsumer, ModuleMetadata, NestModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { DbProvider } from '../db-provider/db.provider';
import { AuthGuard } from '../auth/guard/auth.guard';
import { KnexModule } from './knex';

const globalModules = {
  imports: [
    // ConfigModule.register(),    
    // CacheModule.register({ global: true }),
    KnexModule.register(),
    PrismaModule,        
  ],
  // for overriding the default TablePermissionService, FieldPermissionService, RecordPermissionService, and ViewPermissionService
  providers: [
    DbProvider,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }    
  ],
  exports: [DbProvider],
};

@Global()
@Module(globalModules)
export class GlobalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes('*');
  }

  static register(moduleMetadata: ModuleMetadata): DynamicModule {
    return {
      module: GlobalModule,
      global: true,
      imports: [...globalModules.imports, ...(moduleMetadata.imports || [])],
      providers: [...globalModules.providers, ...(moduleMetadata.providers || [])],
      exports: [...globalModules.exports, ...(moduleMetadata.exports || [])],
    };
  }
}
