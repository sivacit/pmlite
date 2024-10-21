import type { Knex } from 'knex';
import { get } from 'lodash';
const dsn_parser_1 = require("@httpx/dsn-parser");


export enum DriverClient {
  Pg = 'postgresql',
  Sqlite = 'sqlite3',
}

export function getDriverName(knex: Knex | Knex.QueryBuilder) {
  return get(knex, 'client.config.client', '') as DriverClient;
}

export function isPostgreSQL(knex: Knex) {
  return getDriverName(knex) === 'postgresql';
}

export function isSQLite(knex: Knex) {
  return getDriverName(knex) === DriverClient.Sqlite;
}

export function parseDsn(dsn) {
  const parsedDsn = (0, dsn_parser_1.parseDsn)(dsn);
  if (dsn.startsWith('file:')) {
      return {
          host: 'localhost',
          driver: 'sqlite3',
      };
  }
  if (!parsedDsn.success) {
      throw new Error(`DATABASE_URL ${parsedDsn.reason}`);
  }
  if (!parsedDsn.value.port) {
      throw new Error(`DATABASE_URL must provide a port`);
  }
  return parsedDsn.value;
}

export function getRandomInt(min, max) {
  [min, max].forEach((v, idx) => {
      if (!Number.isSafeInteger(v)) {
          throw new Error(`${idx === 0 ? 'min' : 'max'} is not a valid integer`);
      }
  });
  if (max < min) {
      throw new Error('Min cannot be greater than max');
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}