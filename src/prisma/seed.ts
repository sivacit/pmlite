/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParseArgsConfig } from 'node:util';
import { parseArgs } from 'node:util';
import type { parseDsnOrThrow } from '@httpx/dsn-parser';
import { parseDsn as parse } from '@httpx/dsn-parser';
import { PrismaClient } from '@prisma/client';
import { ProjectSeeds } from '../seeds/e2e/projects-seeds';  
import { UserSeeds } from '../seeds/e2e/users-seeds';

export type IDsn = ReturnType<typeof parseDsnOrThrow>;

export function parseDsn(dsn: string): IDsn {
  const parsedDsn = parse(dsn);
  if (dsn.startsWith('file:')) {
    return {
      host: 'localhost',
      driver: 'sqlite3',
    };
  }

  if (!parsedDsn.success) {
    throw new Error(`DATABASE_URL ${parsedDsn}`);
  }
  if (!parsedDsn.value.port) {
    throw new Error(`DATABASE_URL must provide a port`);
  }

  return parsedDsn.value;
}

let prisma: PrismaClient | undefined;

const options: ParseArgsConfig['options'] = {
  e2e: { type: 'boolean', default: false },
  log: { type: 'boolean', default: false },
};

async function main() {
  const {
    values: { e2e, log },
  } = parseArgs({ options });
  const databaseUrl = process.env.DATABASE_URL!;
  const { driver } = parseDsn(databaseUrl);

  console.log('🌱         Seed E2E: ', e2e);
  console.log('🌱      Environment: ', process.env.NODE_ENV);
  console.log('🌱     Database Url: ', databaseUrl);
  console.log('🌱  Database Driver: ', driver);

  prisma = new PrismaClient();
  
  const userSeeds = new UserSeeds(prisma, driver as any, Boolean(log));
  await userSeeds.execute();

  const ps = new ProjectSeeds(prisma, driver as any, Boolean(log));
  await ps.execute();

  // if (e2e) {
  //   const userSeeds = new UserSeeds(prisma, driver as any, Boolean(log));
  //   await userSeeds.execute();

  //   const ps = new ProjectSeeds(prisma, driver as any, Boolean(log));
  //   await ps.execute();
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
