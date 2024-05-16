import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database";

export type TransactionTableRow =
  Database["transaction_schema"]["Tables"]["transaction_table"]["Row"];
export type TransactionTableInsert =
  Database["transaction_schema"]["Tables"]["transaction_table"]["Insert"];
export type TransactionTableUpdate =
  Database["transaction_schema"]["Tables"]["transaction_table"]["Update"];

export type CreateTransactionRecord = {
  supabaseClient: SupabaseClient;
  transactionData: TransactionTableInsert;
};

export type UpdateTransactionRecord = {
  supabaseClient: SupabaseClient;
  transactionData: TransactionTableUpdate;
};

export type GetTransactionList = {
  supabaseClient: SupabaseClient;
  pagination: {
    from: number;
    to: number;
  };
  filter?: {
    status?: string;
    appSourceUserId?: string;
    appSource?: string;
    serviceName?: string;
  };
  orderByDateAscending?: boolean;
};

export type GetTransactionRecord = {
  supabaseClient: SupabaseClient;
  transactionReferenceId: string;
};
