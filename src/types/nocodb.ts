// Generated types based on NoCodeDB API discovery
export interface NoCodeDBProject {
  id: string;
  title: string;
  prefix: string;
  meta: {
    iconColor: string;
  };
  sources: NoCodeDBSource[];
}

export interface NoCodeDBSource {
  id: string;
  base_id: string;
  type: string;
  enabled: number;
}

export interface NoCodeDBTable {
  id: string;
  source_id: string;
  base_id: string;
  table_name: string;
  title: string;
  type: string;
  enabled: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface NoCodeDBColumn {
  id: string;
  title: string;
  column_name: string;
  uidt: string; // UI Data Type
  dt: string;   // Data Type
  pk: number;   // Primary Key
  rqd: number;  // Required
  system: number | null;
  order: number;
}

// Features Collection (rebranded from Features table)
export interface Feature {
  Id: number;
  Title: string;
  CreatedAt: string;
  UpdatedAt: string;
  nc_created_by: string;
  nc_updated_by: string;
  nc_order: number;
}

// Receipt Log Collection (rebranded from Receipt Log table)
export interface Receipt {
  Id: number;
  ncRecordId: string;
  ncRecordHash: string;
  'Short Description': string;
  'Receipt Photo': string; // Attachment
  Total: number; // Currency
  Notes: string; // LongText
  'Date & Time': string; // DateTime
  Category: string; // SingleSelect
  'Who Paid?': string; // SingleSelect
  'Item Photo': string; // Attachment
  CreatedAt: string;
  UpdatedAt: string;
  nc_created_by: string;
  nc_updated_by: string;
  nc_order: number;
}

export interface NoCodeDBResponse<T> {
  list: T[];
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export interface NoCodeDBError {
  msg: string;
}