import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ReactSwipe from 'react-swipe';

import PaymentCheck from '../payment_check/PaymentCheck';

const PAYMENT_CHECKS = gql`
  query checks {
    payments(count: 3) {    
      id
      date
      serviceChecks {
        idService,
        curValue,
        prevValue,
        cost,          
        name,  
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
      const paymentChecks = data.payments;
      let reactSwipeEl;
      return <>
      <ReactSwipe swipeOptions={{ continuous: false }} ref={el => (reactSwipeEl = el)}>
        {paymentChecks
          .filter((_, index) => index < paymentChecks.length - 1)
          .map(check => <PaymentCheck check={check} />)
        }
          <PaymentCheck check={newCheck} editable={1} />      
      </ReactSwipe>
      <button onClick={() => reactSwipeEl.next()}>Next</button>
      <button onClick={() => reactSwipeEl.prev()}>Previous</button>
      </>
    }
  }
  </Query>
);

const newCheck = {
  serviceChecks: [], //todo copy from last
};

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
