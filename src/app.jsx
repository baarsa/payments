import React from 'react';
import PaymentChecks from './components/payment_checks/PaymentChecks';
import Auth from './components/auth/Auth';
import { ApolloProvider } from 'react-apollo';
import client from './apolloClient';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => (
  <Router>
  <ApolloProvider client={client}>
      <Route path='/' exact component={PaymentChecks} />
      <Route path='/auth' component={Auth} />
  </ApolloProvider>
  </Router>
);

export default App;
