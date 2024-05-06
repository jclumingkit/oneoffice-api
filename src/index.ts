import { createClient } from "@supabase/supabase-js";
import { CreateMayaCheckout } from "./types/maya";
import { CreateTransactionRecord, GetTransactionList, GetTransactionRecord, UpdateTransactionRecord } from "./types/transaction";
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

        const responseData = await response.json();
        
        return {success: false, data: responseData};

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
        return {success: false, data: null};
    }
};

export const getTransactionList = async ({pagination: {from, to}, filter, orderByDateAscending = false, supabaseUrl, supabaseAnonKey}: GetTransactionList) => {
    try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        let query = supabaseClient.from("transaction_table")
            .select("*", {count: "exact"});

        if (filter) {
            const {status, appSource, appSourceUserId, serviceName} = filter;

            if (status) {
                query = query.eq("transaction_status", filter.status)
            } 
            if (appSource) {
                query = query.eq("transaction_app_source", filter.appSource)
            }
            if (appSourceUserId) {
                query = query.eq("transaction_app_source_user_id", filter.appSourceUserId)
            }
            if (serviceName) {
                query = query.eq("transaction_service_name", filter?.serviceName)
            }
        }

        query = query.range(from, to);
        query = query.order('transaction_date', {ascending: orderByDateAscending})
        const {data, count, error} = await query;
        if (error) throw error;
        return {success: true, data: data, count: Number(count)};
    } catch (error) {
        handleError(error, 'Failed to fetch transaction list - error');
        return {success: false, data: null, count: null};
    }
};

export const getTransactionRecord = async ({transactionReferenceId, supabaseUrl, supabaseAnonKey}: GetTransactionRecord) => {
    try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        const {data, error} = await supabaseClient.from("transaction_table")
            .select("*")
            .eq("transaction_reference_id", transactionReferenceId);
        
        if (error) throw error;
        return {success: true, data: data};
    } catch (error) {
        handleError(error, 'Failed to fetch transaction list - error');
        return {success: false, data: null};
    }
};

export const getAppSourceList = async ({supabaseUrl, supabaseAnonKey}: GetTransactionRecord) => {
    try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        const {data, error} = await supabaseClient.from("app_source_table")
            .select("*");
        
        if (error) throw error;
        return {success: true, data: data};
    } catch (error) {
        handleError(error, 'Failed to fetch transaction list - error');
        return {success: false, data: null};
    }
};

export const createMayaCheckoutWithTransaction = async ({publicKey, paymentDetails, isSandbox = true, transactionData, supabaseUrl, supabaseAnonKey}: (CreateMayaCheckout & CreateTransactionRecord)) => {
    try {
        const mayaCheckout = await createMayaCheckout({publicKey, paymentDetails, isSandbox});
        await createTransactionRecord({transactionData, supabaseUrl, supabaseAnonKey});
        window.location.href = mayaCheckout.data.redirectUrl
    } catch (error) {
        handleError(error, 'Failed to create maya checkout with transaction - error');
    }
};