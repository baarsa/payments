require('dotenv').config();
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const GraphServer = require('./app/GraphServer');
const ExpressServer = require('./app/ExpressServer');

const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./app/schema');
const resolvers = require('./app/resolvers');

const User = require('./app/User.js');

(new ExpressServer(new GraphServer())).listen();

const auth = ejwt({
      secret: process.env.JWT_SECRET,
      credentialsRequired: false
});
