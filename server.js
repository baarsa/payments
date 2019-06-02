require('dotenv').config();
const GraphServer = require('./app/GraphServer');
const ExpressServer = require('./app/ExpressServer');


(new ExpressServer(new GraphServer())).listen();
