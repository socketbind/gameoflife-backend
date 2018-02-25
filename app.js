const express = require('express');
const apiV1 = require('./server/api_v1_routes');

const app = express();

app.use('/api/v1', apiV1);

app.get('/', (req, res) => res.send('Game of Life REST Backend'));

app.listen(3000, () => console.log('Application listening on port 3000.'));
