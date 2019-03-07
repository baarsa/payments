const { ApolloServer } = require('apollo-server');
const schema = require('./schema');

class GraphServer {
  constructor() {
    this.server = new ApolloServer({ typeDefs: schema });
  }

  async run() {
    await this.server.listen();
    console.log('graph server listening...');
  }
}

module.exports = GraphServer;
