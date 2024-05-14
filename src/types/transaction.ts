import { Database } from "./database"

export type TransactionTableRow = Database["transaction_schema"]["Tables"]["transaction_table"]["Row"];
export type TransactionTableInsert = Database["transaction_schema"]["Tables"]["transaction_table"]["Insert"];
export type TransactionTableUpdate = Database["transaction_schema"]["Tables"]["transaction_table"]["Update"];

export type CreateTransactionRecord = {
    transactionData: TransactionTableInsert; 
    supabaseUrl: string;
    supabaseAnonKey: string;
}

export type UpdateTransactionRecord = {
    transactionData: TransactionTableUpdate; 
    supabaseUrl: string;
    supabaseAnonKey: string;
}

export type GetTransactionList = {
    pagination: {
        from: number;
        to: number;
    },
    filter?: {
        status?: string;
        appSourceUserId?: string;
        appSource?: string;
        serviceName?: string;
    },
    orderByDateAscending?: boolean;
    supabaseUrl: string; 
    supabaseAnonKey: string;
}

export type GetTransactionRecord = {
    transactionReferenceId: string; 
    supabaseUrl: string;
    supabaseAnonKey: string;
}