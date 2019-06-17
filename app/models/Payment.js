const knex = require('../db');

class Payment {
  static async getPayments(idUser, from, count) {
    if (!from) {
      from = (await knex('payment')
        .where('id_user', idUser)
        .max('id')
        .first())['max(`id`)'];
    }
    const idsPayment = (await knex('payment')
      .select('id')
      .where('id_user', idUser)
      .where('id', '<=', from)
      .orderBy('id', 'desc')
      .limit(count + 1))
      .map(row => row.id);
    const rows = await knex('payment')
      .join('service_check', {
        'service_check.id_payment': 'payment.id',
      })
      .join('service', {
        'service.id': 'service_check.id_service',
      })
      .leftOuterJoin('cost', {
        'cost.id_payment': 'payment.id',
        'cost.id_service': 'service_check.id_service',
      })
      .leftOuterJoin('initial_values', {
        'initial_values.id_payment': 'payment.id',
        'initial_values.id_service': 'service_check.id_service',
      })
      .select('payment.id as idPayment', 'payment.time as time', 'service_check.id_service as idService', 'service.name as nameService',
        'service_check.value', 'cost.value as cost', 'initial_values.value as initialValue')
      .whereIn('payment.id', idsPayment)
      .orderBy('payment.id', 'desc');
    const payments = {};
    rows.forEach((row) => {
      if (typeof payments[row.idPayment] === 'undefined') {
        payments[row.idPayment] = {
          id: row.idPayment,
          date: row.time,
          serviceChecks: [],
        };
      }
      const serviceCheck = {
        idService: row.idService,
        name: row.nameService,
        curValue: row.value,
      };
      if (row.cost) serviceCheck.cost = row.cost;
      if (row.initialValue) serviceCheck.prevValue = row.initialValue;
      payments[row.idPayment].serviceChecks.push(serviceCheck);
    });
    for (let i = idsPayment.length - 2; i >= 0; i--) {
      const idPayment = idsPayment[i];
      const prevPayment = payments[idsPayment[i + 1]];
      if (!prevPayment) continue;
      payments[idPayment].serviceChecks.forEach((serviceCheck) => {
        const prevService = prevPayment.serviceChecks.filter(({ idService }) => idService === serviceCheck.idService);
        if (!prevService) return;
        if (!serviceCheck.prevValue) serviceCheck.prevValue = prevService.curValue;
        if (!serviceCheck.cost) serviceCheck.cost = prevPayment.cost;
      });
    }
    return Object.values(payments);
    // TODO добавить недостающие косты
  }

  static async createPayment(idUser, serviceChecks) {
    const idNewPayment = (await knex('payment').insert({
      id_user: idUser,
    }))[0];
    for (const serviceCheck of serviceChecks) {
      await knex('service_check').insert({
        id_payment: idNewPayment,
        id_service: serviceCheck.idService,
        value: serviceCheck.curValue,
      });
      if (serviceCheck.newCost) {
        await knex('cost').insert({
          id_payment: idNewPayment,
          id_service: serviceCheck.idService,
          value: serviceCheck.newCost,
        });
      }
      if (serviceCheck.initialValue) {
        await knex('initial_values').insert({
          id_payment: idNewPayment,
          id_service: serviceCheck.idService,
          value: serviceCheck.initialValue,
        });
      }
    }
    return (await Payment.getPayments(idUser, undefined, 1))[0];
  }
}

module.exports = Payment;
