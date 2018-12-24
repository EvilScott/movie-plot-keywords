const express = require('express');
const movies = require ('./movies');

const app = express();

app.get('/', async (req, res) => res.json(await movies.list()));

app.use('*', (req, res) => res.sendStatus(404));

app.listen(8889, () => console.log('Now listening on 8889'));
