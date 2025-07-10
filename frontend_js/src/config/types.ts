export type ItemType =
  | "MASTERDATA"
  | "TRANSACTIONDATA"
  | "REPORT"
  | "PROCESS"
  | "LEDGER"
  | "JOURNAL"
  | "APPLICATOIN";

export type FormType =
  | "default"
  | "customList"
  | "customItem"
  | "customBoth"
  | "customOther";

export interface SubTable {
  code: string;
  name: string;
  name_ua: string;
  description: string;
  description_ua: string;
  showInSidebar: boolean;
  showInMenu: boolean;
  allowedRoles: string[];       // <<< ДОДАЛИ
  autoload?: boolean;
  type: string;
}

export interface PrintForm {
  code: string;
  name: string;
  name_ua: string;
  description?: string;
  description_ua?: string;
  custom: boolean;
  template?: string;
  allowedRoles?: string[];     // тут теж може бути
}

export interface SectionItem {
  type: ItemType;
  code: string;
  name: string;
  name_ua: string;
  description: string;
  description_ua: string;
  icon: string;
  hierarchy: boolean;
  formType: FormType;
  subtables: SubTable[];
  showInSidebar: boolean;
  showInMenu: boolean;
  allowedRoles: string[];      // <<< ДОДАЛИ
  printForms: PrintForm[];
}

export interface SubGroup {
  code: string;
  subgroupName: string;
  subgroupName_ua: string;
  description: string;
  description_ua: string;
  showInSidebar: boolean;
  showInMenu: boolean;
  allowedRoles: string[];      // <<< ДОДАЛИ
  items: SectionItem[];
}

export interface Group {
  code: string;
  groupName: string;
  groupName_ua: string;
  description: string;
  description_ua: string;
  showInSidebar: boolean;
  showInMenu: boolean;
  allowedRoles: string[];      // <<< ДОДАЛИ
  subgroups: SubGroup[];
}

export interface Section {
  code: string;
  name: string;
  name_ua: string;
  description: string;
  description_ua: string;
  showInSidebar: boolean;
  showInMenu: boolean;
  allowedRoles: string[];      // <<< ДОДАЛИ
  icon: string;
  groups: Group[];
}
