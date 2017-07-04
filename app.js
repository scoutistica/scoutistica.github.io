'use strict';

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const winston = require('winston')

const app = express();

//log file
winston.add(winston.transports.File, { filename: 'errors.log' });

//log requests
app.use(logger('dev'));

//parse requests in middleware before the handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

const update = require('./server/utils/update');

require('./server/routes')(app);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

process.on('uncaughtException', function(error){
	winston.log('error', error);
});

module.exports = app;