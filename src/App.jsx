import React from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './apolloClient';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Auth from './components/auth/Auth';

import PaymentChecks from './components/payment_checks/PaymentChecks';

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Route path='/' exact component={PaymentChecks} />
      <Route path='/auth' component={Auth} />
      <PaymentChecks />
    </Router>
  </ApolloProvider>
);

export default App ;
