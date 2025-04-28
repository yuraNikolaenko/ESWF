import { ItemType } from './itemTypes';

// Schema version to track changes
export const schemaVersion = '1.0.1'; // Оновили версію схеми

const sections = [
  {
    code: "transport",
    name: "Transport",
    name_ua: "Транспорт",
    showInSidebar: true,  // ➡️ Додано
    showInMenu: true,     // ➡️ Додано
    groups: [
      {
        groupName: "Master Data",
        groupName_ua: "Довідники",
        items: [
          {
            type: ItemType.MASTERDATA,
            code: "vehicles",
            name: "Vehicles",
            name_ua: "Автомобілі",
            hierarchy: true,
            customForm: true
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
    showInSidebar: true,  // ➡️ Додано
    showInMenu: true,     // ➡️ Додано
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
  },
  {
    code: "service",
    name: "Service",
    name_ua: "Сервіс",
    showInSidebar: false,   // ➡️ В Sidebar не показуємо
    showInMenu: true,       // ➡️ В меню показуємо
    groups: [
      {
        groupName: "Processes",
        groupName_ua: "Обробки",
        items: [
          {
            type: ItemType.CUSTOM,  // ➡️ Новий тип custom
            code: "deleteMarkedObjects",
            name: "Delete Marked Objects",
            name_ua: "Видалення помічених об'єктів"
          },
          {
            type: ItemType.CUSTOM,
            code: "exchangeBAF",
            name: "Exchange with BAF",
            name_ua: "Обмін з BAF"
          }
        ]
      },
      {
        groupName: "Settings",
        groupName_ua: "Налаштування",
        items: [
          {
            type: ItemType.CUSTOM,
            code: "applicationSettings",
            name: "Application Settings",
            name_ua: "Налаштування застосунку"
          }
        ]
      }
    ]
  }
];

export default sections;
