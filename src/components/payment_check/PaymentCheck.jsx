import React from "react";
import ServiceCheck from "../service_check/ServiceCheck";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SAVE_PAYMENT = gql`
  mutation savePayment($date: Date!, $serviceChecks: [inServiceCheck]!) {
    createPayment(date: $date, serviceChecks: $serviceChecks, ) {
      id
      date
    }
  }
`;

const formatServiceCheck = ({ id, curValue, cost, prevValue }, prevPayment) => {
  let check = {
    idService: id,
    curValue,
  };
  if (cost) {
    check.newCost = cost;
  }
  if (prevValue) {
    check.initialValue = prevValue;
  }
  return check;
};

class PaymentCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check: props.check,
      newService:{
        id: 0,
        name: '',
        curValue: 0,
        prevValue: 0,
        cost: 0,
        new: true,
      }
    };
  }

  changeServiceValue(id, type, newValue) {
    this.setState({
      check: {
        ...this.state.check,
        serviceChecks: this.state.check.serviceChecks
          .map(serviceCheck => serviceCheck.id === id 
            ? {...serviceCheck, [type]: newValue}
            : serviceCheck )
      }
    });
  }

  changeNewServiceValue(type, newValue) {
    this.setState({
      newService: {...this.state.newService, [type]: newValue}
    });
  }

  addNewService() {
    this.setState({
      check: {
        ...this.state.check,
        serviceChecks: [...this.state.check.serviceChecks, this.state.newService]
      },
      newService: {
        id: 0,
        curValue: 0,
        prevValue: 0,
        cost: 0
      }//todo remove duplication
    })
  }

  getNewCosts() {
    return []; //implement
  }

  getNewInitialValues() {
    return [];
  }

  render() {
    const { editable = 0, prevCheck } = this.props;
    const { check, newService } = this.state;
    return (
      <section>
        {check &&
          [<div>{check.date}</div>,
          check.serviceChecks.map(service => (
            <ServiceCheck
              key={service.id}
              name={service.name}
              prevValue={service.prevValue}
              curValue={service.curValue}
              cost={service.cost}
              onCostChange={val => this.changeServiceValue(service.id, 'cost', +val)}
              onPrevValueChange={val => this.changeServiceValue(service.id, 'prevValue', +val)}
              onCurValueChange={val => this.changeServiceValue(service.id, 'curValue', +val)}
            />
          ))]}
        {editable === 1 && <ServiceCheck
        prevValue={newService.prevValue}
        curValue={newService.curValue}
        cost={newService.cost}
        onCostChange={val => this.changeNewServiceValue('cost', +val)}
              onPrevValueChange={val => this.changeNewServiceValue('prevValue', +val)}
              onCurValueChange={val => this.changeNewServiceValue('curValue', +val)}
         editable={2} 
         idNewService={newService.id}
         setIdNewService={id => this.setState({newService: {...newService, id}})}
         addNewService={() => this.addNewService()}
         />}
         {editable === 1 && <Mutation mutation={SAVE_PAYMENT}>
           {(savePayment) => (<button onClick={() => savePayment({ variables: {
             date: '2019-01-01', //todo replace
             serviceChecks: check.serviceChecks.map(check => formatServiceCheck(check, prevCheck)), 
             }})}>Оплатить</button>)}
         </Mutation> }
      </section>
    );
  }
}

export default PaymentCheck;
