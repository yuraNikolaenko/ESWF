export const sections = [
    {
      code: 'transport',
      name: 'Автотранспорт',
      masterdata: [
        { code: 'vehicles', name: 'Автомобілі', customForm: true, hierarchical: false },
        { code: 'drivers', name: 'Водії', customForm: false, hierarchical: false },
        { code: 'components', name: 'Агрегати', customForm: false, hierarchical: true }
      ],
      transactiondata: [
        { code: 'waybills', name: 'Путеві листи', customForm: true, postedEnabled: true }
      ]
    }
  ];
  