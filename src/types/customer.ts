import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database";

export type CustomerTableInsert =  Database["customer_schema"]["Tables"]["customer_table"]["Insert"];
export type CustomerTableRow =  Database["customer_schema"]["Tables"]["customer_table"]["Row"];
export type CustomerTableUpdate =  Database["customer_schema"]["Tables"]["customer_table"]["Update"];

export type CustomerCardTableInsert =  Database["customer_schema"]["Tables"]["customer_card_table"]["Insert"];
export type CustomerCardTableRow =  Database["customer_schema"]["Tables"]["customer_card_table"]["Row"];
export type CustomerCardTableUpdate =  Database["customer_schema"]["Tables"]["customer_card_table"]["Update"];

export type GetInvoice = {
    supabaseClient: SupabaseClient<Database>;
    userId: string;
    isSandbox: boolean;
    secretKey: string;
    referenceNumber: string;
};