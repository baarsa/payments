import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import PaymentCheck from '../payment_check/PaymentCheck';

const PAYMENT_CHECKS = gql`
  query checks {
    paymentChecks(start: 0, amount: 3) {
    paymentChecks {
      id
      serviceChecks {
        service,
        curValue
      }
    }
  }
  }
`;

const SERVICES_COSTS = gql`
  query costs {
    costs {
      value,
      service,
      sincePayment
    }
  }
`;

const PaymentChecks = () => (
  <Query query={PAYMENT_CHECKS}>
  {
    ({loading, error, data}) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div>error</div>;
      const paymentChecks = data.paymentChecks.paymentChecks;
      return [
        ...(paymentChecks
          .filter((_, index) => index < paymentChecks.length - 1)
          .map(check => <PaymentCheck check={getFullCheckData(paymentChecks, check.id)} />))
      ];
    }
  }
  </Query>
);

const getFullCheckData = (checks, idPayment = null) => {
  const curCheck = checks.filter(check => check.id === idPayment)[0];
  const prevCheck = checks.filter(check => check.id === idPayment - 1)[0];
  return {
    id: idPayment,
    serviceChecks: curCheck.serviceChecks.map(check => ({
      ...check,
      prevValue: prevCheck
      .serviceChecks
      .filter(prevCheck => prevCheck.service === check.service)[0].curValue,
      cost: 3
    }))
  };
}

export default PaymentChecks;
