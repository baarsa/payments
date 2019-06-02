const { gql } = require('apollo-server');

const schema = gql`
  type Query {
    paymentChecks(start: Int!, amount: Int!): PaymentCheckConnection!
    costs: [Cost]!
  }
  type Mutation {
    pay(check: Int): String
    authFacebook(input: AuthInput!): AuthResponse
    createUser(email: String!): String!
    loginWithEmail(email: String!, password: String): String!
  }
  type AuthResponse {
    token: String
    name: String
  }
  input AuthInput {
    accessToken: String!
  }
  type PaymentCheckConnection {
    cursor: Int!
    hasMore: Boolean!
    paymentChecks: [PaymentCheck]!
  }
  type PaymentCheck {
    id: Int!
    serviceChecks: [ServiceCheck]!
  }
  type ServiceCheck {
    service: String!
    curValue: Int!
  }
  type Cost {
    value: Float!
    service: String!
    sincePayment: Int!
  }
`;

module.exports = schema;
