import { createClient } from "@supabase/supabase-js";
import { CreateMayaCheckout } from "./types/maya";
import { CreateTransactionRecord, GetTransactionList, UpdateTransactionRecord } from "./types/transaction";


const getMayaApi = (isSandbox: boolean) => {
    let apiUrl = "";
    if (isSandbox) {
        apiUrl = 'https://pg-sandbox.paymaya.com'
    } else {
        apiUrl = 'https://pg.paymaya.com'
    }
};

export const createMayaCheckout = async ({publicKey, paymentDetails, isSandbox = true}: CreateMayaCheckout) => {
    try {
        const mayaApiUrl = getMayaApi(isSandbox);
        const response = await fetch(`${mayaApiUrl}/checkout/v1/checkouts`, {
            method: "POST",
            headers: {
            Authorization: `Basic ${Buffer.from(`${publicKey}:`).toString(
                "base64"
            )}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentDetails),
        });

        if (response.ok) {
            const responseData = await response.json();
            return {success: true, data: responseData};
        } else {
            return {success: false, data: null};
        }

    } catch (error) {
        console.log(error);
        console.log('Failed to create maya checkout - error');
        return {success: false, data: null};
    }
};

export const createTransactionRecord = async ({transactionData, supabaseUrl, supabaseAnonKey}: CreateTransactionRecord) => {
    try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabaseClient.from("transaction_table")
            .insert(transactionData)
            .select("*")
            .maybeSingle();
        if (error) throw error;
        return {success: true, data: data};
    } catch (error) {
        console.log(error);
        console.log('Failed to create transaction - error');
        return {success: false, data: null};
    }
};

export const updateTransactionRecord = async ({transactionData, supabaseUrl, supabaseAnonKey}: UpdateTransactionRecord) => {
    try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        const {data, error} = await supabaseClient.from("transaction_table")
            .update(transactionData)
            .eq("transaction_id", `${transactionData.transaction_id}`)
            .select("*")
            .maybeSingle();
        if (error) throw error;
        return {success: true, data: data};
    } catch (error) {
        console.log(error);
        console.log('Failed to update transaction - error');
        return {success: true, data: null};
    }
};

export const getTransactionList = async ({pagination: {from, to}, status, supabaseUrl, supabaseAnonKey}: GetTransactionList) => {
    try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        let query = supabaseClient.from("transaction_table")
            .select("*");
        if (status) {
            query = query.eq("transaction_status", status)
        }
        query = query.range(from, to);
        const {data, error} = await query;
        if (error) throw error;
        return {success: true, data: data};
    } catch (error) {
        console.log(error);
        console.log('Failed to fetch transaction list - error');
        return {success: true, data: null};
    }
};