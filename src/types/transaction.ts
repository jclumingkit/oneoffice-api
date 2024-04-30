import { Database } from "./database"

export type TransactionTableRow = Database["public"]["Tables"]["transaction_table"]["Row"];
export type TransactionTableInsert = Database["public"]["Tables"]["transaction_table"]["Insert"];
export type TransactionTableUpdate = Database["public"]["Tables"]["transaction_table"]["Update"];

export type CreateTransactionRecord = {
    transactionData: TransactionTableInsert; 
    supabaseUrl: string;
    supabaseAnonKey: string
}

export type UpdateTransactionRecord = {
    transactionData: TransactionTableUpdate; 
    supabaseUrl: string;
    supabaseAnonKey: string
}

export type GetTransactionList = {
    pagination: {
        from: number;
        to: number;
    },
    status?: string;
    supabaseUrl: string, 
    supabaseAnonKey: string
}

export type GetTransactionRecord = {
    transactionReferenceId: string; 
    supabaseUrl: string;
    supabaseAnonKey: string
}