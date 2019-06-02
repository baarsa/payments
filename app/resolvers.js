const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');
const { authenticateFacebook } = require('./auth.js');
const User = require('./User.js');

module.exports = {
  Query: {
    paymentChecks: (_, { start, amount = 3 }, { idUser }) => {
      if (!idUser) {
        return {
          cursor: 1,
          hasMore: false,
          paymentChecks: [],
        };
      }
      return {
        cursor: 1,
        hasMore: false,
        paymentChecks: [
          {
            id: 1,
            serviceChecks: [],
          },
        ],
      };
    },
  },
  Mutation: {
    authFacebook: async (_, { input: { accessToken } }, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };
      const { data } = await authenticateFacebook(req, res);
      if (data) {
        const user = await User.findOrCreate(data);
        const token = jsonwebtoken.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
        );
        return {
          token,
          name: user.name,
        };
      }
    },
    loginWithEmail: async (_, { email, password }, { req }) => {
      const { user } = await new Promise(res => passport.authenticate('local', (err, user) => {
        res({ err, user });
      }, (err) => {
        console.log(err);
      })(req, res));
      return jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
      );
    },
    createUser: async (_, { email }) => {
      const idUser = await User.createLocalUser({ email }); // todo exceptions
      return jsonwebtoken.sign(
        { id: idUser },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
      );
    },
  },
};
