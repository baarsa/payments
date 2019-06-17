const { GraphQLDate } = require('graphql-iso-date');
const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');
const { authenticateFacebook } = require('./auth.js');
const User = require('./User.js');
const Payment = require('./models/Payment');
const knex = require('./db');

module.exports = {
  Date: GraphQLDate,
  Query: {    
    allServices: async (_, __, { idUser }) => {
      const rows = await knex('service')        
        .select('id', 'name')
        .whereIn('service.id_user', [idUser, 0]);
      return rows;  
    },
    allPayments: async (_, __, { idUser }) => {
      const rows = await knex('payment')
        .join('service_check', { 'service_check.id_payment': 'payment.id' })
        .join('service', { 'service.id': 'service_check.id_service' })
        .select('payment.id', 'time', 'id_service', 'value', 'name')
        .where('payment.id_user', idUser);
      const payments = {};
      rows.forEach((row) => {
        if (typeof payments[row.id] === 'undefined') {
          payments[row.id] = {
            id: row.id,
            date: row.time,
            serviceChecks: [],
          };
        }
        payments[row.id].serviceChecks.push({
          idService: row.id_service,
          name: row.name,
          curValue: row.value,
        });
      });
      return Object.values(payments);
    },
    payments: async (_, { from, count }, { idUser }) => {
      return Payment.getPayments(idUser, from, count);
    }
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
      console.log('body parsing', req.body);
      req.body.email = email;
      req.body.password = password;
      const { err, user } = await new Promise((res, rej) => passport.authenticate('local', (err, user) => {
        res({ err, user });
      })(req, res));
      if (err) return '';
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
    createService: async (_, { serviceName }, { idUser }) => {
      const idService = (await knex('service').insert({
        name: serviceName,
        id_user: idUser,
      }, 'id'))[0];
      return { id: idService, name: serviceName };
    },
    createPayment: async (_, {
      serviceChecks
    }, { idUser }) => {
      // create payment
      return Payment.createPayment(idUser, serviceChecks);
    },

  },
};
