const express = require('express');

const app = express();

app.get('/', (req, res) => res.json({ hello: 'world' }));

app.use('*', (req, res) => res.sendStatus(404));

app.listen(8889, () => console.log('Now listening on 8889'));
