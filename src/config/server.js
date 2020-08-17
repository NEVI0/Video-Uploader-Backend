const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

require('dotenv').config();

const server = express();

server.use(express.static('src/public'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(morgan("dev"));

server.set('views', 'src/views');
server.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`---------------------------------`);
	console.log(`Server's Running on Port: ${port}`);
	console.log(`---------------------------------`);
});

module.exports = server;