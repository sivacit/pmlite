/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/naming-convention */
import knex from 'knex';
import { getDriverName } from '../../utils/db-helpers';

try {
  knex.QueryBuilder.extend('columnList', function (tableName: string) {
    const driverClient = getDriverName(this);

    const [schema, name] = tableName.split('.');
    this.select({
      name: 'column_name',
      type: 'data_type',
      dflt_value: 'column_default',
      notnull: 'is_nullable',
    })
      .from('information_schema.columns')
      .where('table_name', name)
      .where('table_schema', schema);
    return this;
  });
} catch (e) {
  console.error(e);
}

declare module 'knex' {
  namespace Knex {
    interface QueryBuilder {
      columnList(tableName: string): Knex.QueryBuilder;
    }
  }
}

export { knex };
