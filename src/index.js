const express = require('express');
const movies = require ('./movies');
const path = require('path');

const app = express();
const root = path.join(__dirname, '..');

app.get('/', async (req, res) =>
  res.sendFile('./src/public/index.html', { root })
);

app.get('/styles/bulma.css', (req, res) =>
  res.sendFile('./node_modules/bulma/css/bulma.css', { root })
);

app.get('/scripts/highland.js', (req, res) =>
  res.sendFile('./node_modules/highland/dist/highland.js', { root })
);

app.get('/scripts/plots.js', (req, res) =>
  res.sendFile('./src/public/plots.js', { root })
);

app.get('/api/movies/:id', async (req, res, next) =>
  res.json(await movies.find(req.params.id).catch(next))
);

app.get('/api/movies/search/:term', async (req, res, next) => {
  const term = req.params.term.replace(/\s+/g, ' & ');
  res.json(await movies.search(term).catch(next));
});

app.use('*', (req, res) =>
  res.sendStatus(404)
);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const { method, url, route } = req;
  const error = err.stack || err.toString();
  console.error(error);
  res.status(500).json({ method, url, route, error });
});


app.listen(8889, () => console.log('Now listening on 8889'));
