import { createClient } from "@supabase/supabase-js";
import { CreateMayaCheckout } from "./types/maya";
import { CreateTransactionRecord, GetTransactionList, UpdateTransactionRecord } from "./types/transaction";
import { handleError } from "./utils/errorHandler";


const getMayaApi = (isSandbox: boolean) => {
    let apiUrl = "";
    if (isSandbox) {
        apiUrl = 'https://pg-sandbox.paymaya.com'
    } else {
        apiUrl = 'https://pg.paymaya.com'
    }
    return apiUrl;
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
        handleError(error, 'Failed to create maya checkout - error');
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
        handleError(error, 'Failed to create transaction - error');
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
        handleError(error, 'Failed to update transaction - error');
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
        handleError(error, 'Failed to fetch transaction list - error');
        return {success: true, data: null};
    }
};

export const createMayaCheckoutWithTransaction = async ({publicKey, paymentDetails, isSandbox = true, transactionData, supabaseUrl, supabaseAnonKey}: (CreateMayaCheckout & CreateTransactionRecord)) => {
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

        if (!response.ok) {
            console.log(await response.json());
            throw new Error('Maya checkout failed - error');
        }

        const responseData = await response.json();
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        const { data: newTransaction, error } = await supabaseClient.from("transaction_table")
            .insert({
                ...transactionData,
                transaction_status: "COMPLETE"
            })
            .select("*")
            .maybeSingle();
        if (error) throw error;

        return {
            success: true, 
            data: {
                maya: responseData,
                transaction: newTransaction
            },
        };

    } catch (error) {
        handleError(error, 'Failed to create maya checkout with transaction - error');
        return {success: false, data: null};
    }
};