import { Injectable, OnModuleInit } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from './knexfile';  // Use default import

@Injectable()
export class KnexService implements OnModuleInit {
  private knexInstance: Knex;

  async onModuleInit() {
    this.knexInstance = knex(knexConfig);
  }

  getKnex() {
    return this.knexInstance;
  }
}
