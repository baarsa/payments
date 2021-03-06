require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const schema = require('./schema');
const resolvers = require('./resolvers');

const getMe = async (req) => {
  const token = req.headers.authorization;
  if (!token) return undefined;
  try {
    const data = (await jwt.verify(token, process.env.JWT_SECRET));
    return data.id;
  } catch (e) {
    return undefined;
  }
};


class GraphServer {
  constructor() {
    this.server = new ApolloServer({
      typeDefs: schema,
      resolvers,
      context: async ({ req, res }) => {
        const idUser = await getMe(req);
        return {
          idUser,
          req,
          res,
        };
      },
    });
  }

  getServer() {
    return this.server;
  }
}

module.exports = GraphServer;
