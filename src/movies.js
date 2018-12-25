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

  stream: async (sql, ...params) => {
    const client = await pool.connect();
    const stream = client.query(new QueryStream(sql, params));
    stream.on('end', client.release);
    return stream;
  },
};

module.exports = {
  list: () => {
    const sql = `SELECT * FROM movies WHERE origin = 'American' ORDER BY year, title LIMIT 50`;
    return db.stream(sql);
  },

  find: (id) => {
    const sql = `SELECT * FROM movies WHERE movie_id = $1 AND origin = 'American'`;
    return db.find(sql, id);
  },

  search: async (term) => {
    const sql = `SELECT * FROM movies WHERE origin = 'American' AND plot @@ to_tsquery($1) LIMIT 50`;
    return db.stream(sql, term);
  },
};
