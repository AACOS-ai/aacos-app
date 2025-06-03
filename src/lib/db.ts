import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aacos',
  password: '2810',
  port: 5432,
});