const { ApolloServer } = require('apollo-server');
const schema = require('./schema');
const resolvers = require('./resolvers');
const passport = require('passport');

class GraphServer {
  constructor() {
    this.server = new ApolloServer({
       typeDefs: schema,
       context: async({ req }) => {
         passport.authenticate('local');
       },
       resolvers
      });
  }

  async run() {
    await this.server.listen();
    console.log('graph server listening...');
  }
}

module.exports = GraphServer;
