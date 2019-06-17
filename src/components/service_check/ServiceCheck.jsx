import React from 'react';
import ServiceSelect from './service_select/ServiceSelect';

const ServiceCheck = ({
  name,
  prevValue = 0,
   curValue = 0,
    cost = 0,
     onPrevValueChange, onCurValueChange, onCostChange, editable = 0,
     idNewService,
     setIdNewService,
     addNewService,
    }) => (
  <section>    
    { editable < 2 ? name : <ServiceSelect value={idNewService} setValue={setIdNewService} /> }
    <input value={prevValue} onChange={e => onPrevValueChange(e.target.value)} disabled={editable < 2} />
    <input value={curValue} onChange={e => onCurValueChange(e.target.value)} disabled={editable < 1} />
    <input value={cost} onChange={e => onCostChange(e.target.value)} disabled={editable < 1} />
    <div>{ cost * (curValue - prevValue) }</div>
    { (editable === 2) && <button onClick={addNewService}>Добавить</button> }
  </section>
);

export default ServiceCheck;
