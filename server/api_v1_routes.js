const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('api-error-handler');

const api = new express.Router();

api.use(bodyParser.json());

api.get('/cells/compute', (req, res) => {
  res.send({ placeholder: true });
});

api.use(errorHandler());

module.exports = api;
