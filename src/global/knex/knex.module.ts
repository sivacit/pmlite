import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModule as BaseKnexModule } from 'nest-knexjs';
import { parseDsn } from '../../utils/db-helpers';

@Module({})
export class KnexModule {
  static register(): DynamicModule {
    return BaseKnexModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const databaseUrl = config.getOrThrow<string>('PRISMA_DATABASE_URL');
          const { driver } = parseDsn(databaseUrl);

          return {
            config: {
              client: driver,
              useNullAsDefault: true,
            },
            name: 'CUSTOM_KNEX',
          };
        },
      },
      'CUSTOM_KNEX'
    );
  }
}
