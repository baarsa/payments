import React from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './apolloClient';

import PaymentChecks from './components/payment_checks/PaymentChecks';

const App = () => (
  <ApolloProvider client={client}>
    <PaymentChecks />
  </ApolloProvider>
);

export default App ;
