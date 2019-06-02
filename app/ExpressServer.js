const path = require('path');
const express = require('express');
const passport = require('passport');
require('./auth');

const PORT = 3001; // TODO to env

class ExpressServer {
  constructor(graphServer) {
    this.app = express();
    this.app.use('/', express.static('dist'));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    graphServer.getServer().applyMiddleware({
      app: this.app,
      path: '/graphql',
    });
    this.registerRoutes();
  }

  registerRoutes() {
    this.app.get('/*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  listen() {
    this.app.listen(PORT, () => {
      console.log(`The server is running on http://localhost:${PORT}`);
    });
  }
}

module.exports = ExpressServer;
