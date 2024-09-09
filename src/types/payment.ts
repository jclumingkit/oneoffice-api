import { Database } from "./database";

export type CustomerTableInsert =  Database["payment_schema"]["Tables"]["customer_table"]["Insert"];
export type CustomerTableRow =  Database["payment_schema"]["Tables"]["customer_table"]["Row"];
export type CustomerTableUpdate =  Database["payment_schema"]["Tables"]["customer_table"]["Update"];

export type CustomerCardTableInsert =  Database["payment_schema"]["Tables"]["customer_card_table"]["Insert"];
export type CustomerCardTableRow =  Database["payment_schema"]["Tables"]["customer_card_table"]["Row"];
export type CustomerCardTableUpdate =  Database["payment_schema"]["Tables"]["customer_card_table"]["Update"];

export type PaymentTokenTableInsert =  Database["payment_schema"]["Tables"]["payment_token_table"]["Insert"];
export type PaymentTokenTableRow =  Database["payment_schema"]["Tables"]["payment_token_table"]["Row"];
export type PaymentTokenTableUpdate =  Database["payment_schema"]["Tables"]["payment_token_table"]["Update"];