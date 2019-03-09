module.exports = {
  Query: {
    paymentChecks: (_, {start, amount = 3} ) => ({
      paymentChecks: [
        {
          id: 3,
          serviceChecks: [
            {
              curValue: 300,
              service: 'gas'
            }
          ]
        },
        {
          id: 2,
          serviceChecks: [
            {
              curValue: 250,
              service: 'gas'
            }
          ]
        }
      ]
    }),
    costs: () => [
      {
        service: 'gas',
        value: 1.2,
        sincePayment: 1
      }
    ]
  }
};
