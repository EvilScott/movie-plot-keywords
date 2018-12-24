const { Pool } = require('pg');
const QueryStream = require('pg-query-stream');

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'plots',
  password: 'plots',
});

const db = {
  find: async (sql, ...params) =>
    (await db.query(sql, ...params))[0],

  query: async (sql, ...params) =>
    (await pool.query(sql, params)).rows,

  stream: (sql, ...params) =>
    pool.query(new QueryStream(sql, params))
};

module.exports = {
  list: () =>
    db.query(`SELECT * FROM movies WHERE origin = 'American' ORDER BY year, title LIMIT 50`),

  find: (id) =>
    db.find(`SELECT * FROM movies WHERE movie_id = $1 AND origin = 'American'`, id),

  search: (term) =>
    db.query(`SELECT * FROM movies WHERE origin = 'American' AND plot @@ to_tsquery($1) LIMIT 50`, term),
};
