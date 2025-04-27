import { ItemType } from './itemTypes';

// Schema version to track changes
export const schemaVersion = '1.0.0';

const sections = [
  {
    // Section: logical block in the system (Transport, Accounting, etc.)
    code: "transport", // Unique system code of the section
    name: "Transport", // English name
    name_ua: "Транспорт", // Ukrainian name
    groups: [
      {
        // Group inside the section (will be shown as separate Card)
        groupName: "Master Data", // English group name
        groupName_ua: "Довідники", // Ukrainian group name
        items: [
          {
            type: ItemType.MASTERDATA, // Type: masterdata (directory)
            code: "vehicles", // Unique code
            name: "Vehicles", // English name
            name_ua: "Автомобілі", // Ukrainian name
            hierarchy: true, // Is hierarchical? (true/false)
            customForm: true // Has custom form? (true/false)
          },
          {
            type: ItemType.MASTERDATA,
            code: "drivers",
            name: "Drivers",
            name_ua: "Водії",
            hierarchy: false
          },
          {
            type: ItemType.MASTERDATA,
            code: "routes",
            name: "Routes",
            name_ua: "Маршрути",
            hierarchy: false
          }
        ]
      },
      {
        groupName: "Transactions",
        groupName_ua: "Операції",
        items: [
          {
            type: ItemType.TRANSACTIONDATA,
            code: "waybills",
            name: "Waybills",
            name_ua: "Путеві листи",
            customForm: true
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "maintenanceRecords",
            name: "Maintenance Records",
            name_ua: "Ремонтні відомості",
            customForm: false
          }
        ]
      }
    ]
  },
  {
    code: "accounting",
    name: "Accounting",
    name_ua: "Бухгалтерія",
    groups: [
      {
        groupName: "Master Data",
        groupName_ua: "Довідники",
        items: [
          {
            type: ItemType.MASTERDATA,
            code: "clients",
            name: "Clients",
            name_ua: "Клієнти",
            hierarchy: false
          }
        ]
      },
      {
        groupName: "Transactions",
        groupName_ua: "Операції",
        items: [
          {
            type: ItemType.TRANSACTIONDATA,
            code: "invoices",
            name: "Invoices",
            name_ua: "Рахунки",
            hierarchy: false
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "incomingPayments",
            name: "Incoming Payments",
            name_ua: "Надходження платежів",
            hierarchy: false
          }
        ]
      }
    ]
  }
];

export default sections;
