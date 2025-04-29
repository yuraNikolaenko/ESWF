import { ItemType } from './itemTypes';

// Schema version
export const schemaVersion = '1.0.3';

const sections = [
  {
    code: "transport",
    name: "Transport",
    name_ua: "Транспорт",
    showInSidebar: true,
    showInMenu: true,
    icon: "CarOutlined",
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
            icon: "CarOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "drivers",
            name: "Drivers",
            name_ua: "Водії",
            hierarchy: false,
            icon: "UserOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "routes",
            name: "Routes",
            name_ua: "Маршрути",
            hierarchy: false,
            icon: "EnvironmentOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "destinations",
            name: "Destinations",
            name_ua: "Пункти призначення",
            hierarchy: false,
            icon: "FlagOutlined"
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
            icon: "FileTextOutlined"
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "maintenanceRecords",
            name: "Maintenance Records",
            name_ua: "Ремонтні відомості",
            customForm: false,
            icon: "ToolOutlined"
          }
        ]
      },
      {
        groupName: "Analytics",
        groupName_ua: "Аналітика",
        items: [
          {
            type: ItemType.REPORT,
            code: "fuelMovement",
            name: "Fuel Movement Report",
            name_ua: "Відомість руху пального",
            icon: "BarChartOutlined"
          },
          {
            type: ItemType.REPORT,
            code: "transportStatistics",
            name: "Transport Statistics",
            name_ua: "Статистика роботи транспорту",
            icon: "LineChartOutlined"
          }
        ]
      },
      {
        groupName: "Processes",
        groupName_ua: "Процеси",
        items: [
          {
            type: ItemType.PROCESS,
            code: "kanbanBoard",
            name: "Kanban Board",
            name_ua: "Канбан-дошка",
            icon: "AppstoreOutlined"
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
    icon: "DollarOutlined",
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
            icon: "TeamOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "businessOperations",
            name: "Business Operations",
            name_ua: "Господарські операції",
            hierarchy: false,
            icon: "AuditOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "chartOfAccounts",
            name: "Chart of Accounts",
            name_ua: "План рахунків",
            hierarchy: true,
            icon: "BookOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "currencies",
            name: "Currencies",
            name_ua: "Валюти",
            hierarchy: false,
            icon: "GlobalOutlined"
          },
          {
            type: ItemType.MASTERDATA,
            code: "organizations",
            name: "Organizations",
            name_ua: "Організації",
            hierarchy: false,
            icon: "ApartmentOutlined"
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
            icon: "ProfileOutlined"
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "incomingPayments",
            name: "Incoming Payments",
            name_ua: "Надходження платежів",
            hierarchy: false,
            icon: "WalletOutlined"
          },
          {
            type: ItemType.TRANSACTIONDATA,
            code: "documentOperations",
            name: "Document Operations",
            name_ua: "Документ операція",
            hierarchy: false,
            icon: "FileProtectOutlined"
          }
        ]
      },
      {
        groupName: "Analytics",
        groupName_ua: "Аналітика",
        items: [
          {
            type: ItemType.REPORT,
            code: "profitAndLoss",
            name: "P&L",
            name_ua: "Звіт про прибутки та збитки",
            icon: "BarChartOutlined"
          },
          {
            type: ItemType.REPORT,
            code: "cashFlow",
            name: "Cash Flow",
            name_ua: "Звіт про рух грошових коштів",
            icon: "LineChartOutlined"
          },
          {
            type: ItemType.REPORT,
            code: "balanceSheet",
            name: "Balance Sheet",
            name_ua: "Баланс",
            icon: "PieChartOutlined"
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
    icon: "SettingOutlined",
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
            icon: "DeleteOutlined"
          },
          {
            type: ItemType.CUSTOM,
            code: "exchangeBAF",
            name: "Exchange with BAF",
            name_ua: "Обмін з BAF",
            icon: "SwapOutlined"
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
            icon: "SettingOutlined"
          }
        ]
      }
    ]
  },
  {
    code: "registers",
    name: "Registers",
    name_ua: "Реєстри",
    showInSidebar: true,
    showInMenu: true,
    icon: "DatabaseOutlined",
    groups: [
      {
        groupName: "Ledgers",
        groupName_ua: "Леджери",
        items: [
          {
            type: ItemType.LEDGER,
            code: "cashLedger",
            name: "Cash Ledger",
            name_ua: "Грошовий леджер",
            icon: "WalletOutlined"
          },
          {
            type: ItemType.LEDGER,
            code: "inventoryLedger",
            name: "Inventory Ledger",
            name_ua: "Леджер запасів",
            icon: "DropboxOutlined"
          }
        ]
      },
      {
        groupName: "Journals",
        groupName_ua: "Журнали",
        items: [
          {
            type: ItemType.JOURNAL,
            code: "cashJournal",
            name: "Cash Journal",
            name_ua: "Грошовий журнал",
            icon: "WalletOutlined"
          },
          {
            type: ItemType.JOURNAL,
            code: "inventoryJournal",
            name: "Inventory Journal",
            name_ua: "Журнал товарів",
            icon: "DropboxOutlined"
          }
        ]
      }
    ]
  }
];

export default sections;