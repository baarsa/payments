const { ApolloServer } = require('apollo-server');
const schema = require('./schema');
const resolvers = require('./resolvers');

class GraphServer {
  constructor() {
    this.server = new ApolloServer({
       typeDefs: schema,
       resolvers
      });
  }

  async run() {
    await this.server.listen();
    console.log('graph server listening...');
  }
}

module.exports = GraphServer;
