import React from 'react';

import ServiceCheck from '../service_check/ServiceCheck';

const PaymentCheck = ({ check }) => (
  <section>
    {
      check.serviceChecks.map(service =>
         <ServiceCheck
            prevValue = {service.prevValue}
            curValue = {service.curValue}
            cost = {service.cost}
          />)
    }
  </section>
);

export default PaymentCheck;
