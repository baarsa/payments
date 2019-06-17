const { gql } = require('apollo-server');

const schema = gql`
scalar Date
  type Query {    
    allPayments: [PaymentCheck]!
    payments(from: Int, count: Int!): [PaymentCheck]!
    allCosts: [Cost]!
    allInitialValues: [InitialValue]!
    allServices: [SimpleItem]
  }
  type Mutation {
    pay(check: Int): String
    authFacebook(input: AuthInput!): AuthResponse
    createUser(email: String!): String!
    loginWithEmail(email: String!, password: String): String!
    createPayment(date: Date!, serviceChecks: [inServiceCheck]!): PaymentCheck!
    createService(serviceName: String): SimpleItem
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
    date: Date!
    serviceChecks: [ServiceCheck]!
  }
  type ServiceCheck {
    idService: Int!
    name: String!
    curValue: Int!,
    prevValue: Int!,
    cost: Int!
  }
  input inServiceCheck {
    idService: Int!    
    curValue: Int!
    newCost: Int
    initialValue: Int
  }
  input ServicePayment {
    idService: Int!
    curValue: Int!
  }
  type SimpleItem {
    id: Int!
    name: String!
  }
  type Cost {
    value: Float!
    idService: Int!
    sincePayment: Int!
  }
  input InputCost {
    value: Float!
    idService: Int!    
  }
  type InitialValue {
    idService: Int!
    value: Int!    
  }
  input InputInitialValue {
    idService: Int!
    value: Int!
    sincePayment: Int!
  }
  
`;

module.exports = schema;
