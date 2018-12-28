const express = require('express');
const hl = require('highland');
const movies = require ('./movies');
const { addKeywords } = require('./nlp');
const { join } = require('path');

const app = express();
const root = join(__dirname, '..');

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

app.get('/api/movies/search/:term', async (req, res, next) => {
  const term = req.params.term.replace(/\s+/g, ' & ');
  try {
    const stream = await movies.search(term);
    hl(stream)
      .flatMap(movie => hl(addKeywords(movie)))
      .map(JSON.stringify)
      .intersperse('\n')
      .each(json => res.write(json))
      .done(() => res.end());
  } catch (err) {
    next(err);
  }
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
