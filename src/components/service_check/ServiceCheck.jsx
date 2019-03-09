import React from 'react';

const ServiceCheck = ({prevValue, curValue, cost, onCurValueChange, onCostChange}) => (
  <section>
    <div>{prevValue}</div>
    <input value={curValue} onChange={onCurValueChange} />
    <input value={cost} onChange={onCostChange} />
    <div>{ cost * (curValue - prevValue) }</div>
  </section>
);

export default ServiceCheck;
