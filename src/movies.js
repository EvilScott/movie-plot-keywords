const { Pool } = require('pg');
const QueryStream = require('pg-query-stream');

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'plots',
  password: 'plots',
});

const query = async (sql, ...params) => (await pool.query(sql, params)).rows;
const stream = (sql, ...params) => pool.query(new QueryStream(sql, params));

module.exports = {
  list: () => query('SELECT * FROM movies LIMIT 10'),
};
