require('dotenv').config();
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const GraphServer = require('./app/GraphServer');

const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./app/schema');
const resolvers = require('./app/resolvers');

const User = require('./app/User.js');

const app = express();
app.use('/', express.static('dist'));

const auth = ejwt({
      secret: process.env.JWT_SECRET,
      credentialsRequired: false
});

const getMe = async req => {
  const token = req.headers['authorization'];
  if (!token) return;
  try {
    const data = (await jwt.verify(token, process.env.JWT_SECRET));
    return await User.getUserById(data.id);
  } catch (e) {
    throw new Error('Invalid token');
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, res }) => {
    const me = await getMe(req);
    return {
      me,
      req,
      res
    };
  }
});

server.applyMiddleware({ app, path: '/graphql'});
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const PORT = 3001;
var options = {
    key  : fs.readFileSync('key.pem'),
    ca   : fs.readFileSync('csr.pem'),
    cert : fs.readFileSync('cert.pem')
}

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/api`)
});
