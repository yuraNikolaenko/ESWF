import { ItemType } from './itemTypes';

// Schema version
export const schemaVersion = '1.0.2'; // Оновили версію схеми

const sections = [
  {
    code: "transport",
    name: "Transport",
    name_ua: "Транспорт",
    showInSidebar: true,
    showInMenu: true,
    icon: "CarOutlined", // ❗ додано
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
            customForm: true,
            icon: "CarOutlined" // ❗
          },
          {
            type: ItemType.MASTERDATA,
            code: "drivers",
            name: "Drivers",
            name_ua: "Водії",
            hierarchy: false,
            icon: "UserOutlined" // ❗
          },
          {
            type: ItemType.MASTERDATA,
            code: "routes",
            name: "Routes",
            name_ua: "Маршрути",
            hierarchy: false,
            icon: "EnvironmentOutlined" // ❗
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
            customForm: true,
            icon: "FileTextOutlined" // ❗
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "maintenanceRecords",
            name: "Maintenance Records",
            name_ua: "Ремонтні відомості",
            customForm: false,
            icon: "ToolOutlined" // ❗
          }
        ]
      }
    ]
  },
  {
    code: "accounting",
    name: "Accounting",
    name_ua: "Бухгалтерія",
    showInSidebar: true,
    showInMenu: true,
    icon: "DollarOutlined", // ❗
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
            hierarchy: false,
            icon: "TeamOutlined" // ❗
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
            hierarchy: false,
            icon: "ProfileOutlined" // ❗
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "incomingPayments",
            name: "Incoming Payments",
            name_ua: "Надходження платежів",
            hierarchy: false,
            icon: "WalletOutlined" // ❗
          }
        ]
      }
    ]
  },
  {
    code: "service",
    name: "Service",
    name_ua: "Сервіс",
    showInSidebar: false,
    showInMenu: true,
    icon: "SettingOutlined", // ❗
    groups: [
      {
        groupName: "Processes",
        groupName_ua: "Процеси",
        items: [
          {
            type: ItemType.CUSTOM,
            code: "deleteMarkedObjects",
            name: "Delete Marked Objects",
            name_ua: "Видалення помічених об'єктів",
            icon: "DeleteOutlined" // ❗
          },
          {
            type: ItemType.CUSTOM,
            code: "exchangeBAF",
            name: "Exchange with BAF",
            name_ua: "Обмін з BAF",
            icon: "SwapOutlined" // ❗
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
            name_ua: "Налаштування застосунку",
            icon: "SettingOutlined" // ❗
          }
        ]
      }
    ]
  }
];

export default sections;
