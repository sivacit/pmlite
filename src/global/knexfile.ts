const knexConfig = {
  client: 'pg', // Use your appropriate DB client (e.g., 'mysql', 'sqlite3', etc.)
  connection: {
    host: '127.0.0.1',
    user: 'teable',
    port: 42345,
    password: 'teable',
    database: 'pmlite',
  },
  pool: { min: 0, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export default knexConfig;
