/* eslint-disable @typescript-eslint/naming-convention */
import path from 'path';
import type { DynamicModule } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { baseConfig } from './base.config';
import { cacheConfig } from './cache.config';
import { registerAs } from '@nestjs/config';


export const nextJsConfig = registerAs('nextJs', () => ({
  dir: process.env.NEXTJS_DIR ?? '../../pmlite',
}));

const configurations = [
  baseConfig,
  cacheConfig,
];

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return BaseConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: configurations,
      envFilePath: ['.env.development.local', '.env.development', '.env'].map((str) => {
        const nextJsDir = nextJsConfig().dir;
        const envDir = nextJsDir ? path.join(process.cwd(), nextJsDir, str) : str;

        Logger.attachBuffer();
        Logger.log(`[Env File Path]: ${envDir}`);
        Logger.detachBuffer();
        return envDir;
      }),
    });
  }
}
