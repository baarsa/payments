const { gql } = require('apollo-server');

const schema = gql`
  type Query {
    latestPaymentChecks: [PaymentCheck]!
    paymentCheck(id: ID!): PaymentCheck    
  }
  type Mutation {
    pay(check: Int): String
  }
  type PaymentCheck {
    id: ID
    serviceChecks: [ServiceCheck]!
  }
  type ServiceCheck {
    service: String!
    prevValue: Int!
    curValue: Int!
    cost: Float!
  }
`;

module.exports = schema;
