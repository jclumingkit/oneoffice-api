import { SupabaseClient } from "@supabase/supabase-js";
import { Buyer, Card, CreateMayaCheckout } from "./types/maya";
import {
  CreateTransactionRecord,
  GetTransactionList,
  GetTransactionRecord,
  UpdateTransactionRecord,
} from "./types/transaction";
import { handleError } from "./utils/errorHandler";
import { Database } from "./types/database";
import { CustomerCardTableInsert, CustomerTableInsert, GetInvoice } from "./types/customer";

const getMayaApi = (isSandbox: boolean) => {
  let apiUrl = "";
  if (isSandbox) {
    apiUrl = "https://pg-sandbox.paymaya.com";
  } else {
    apiUrl = "https://pg.paymaya.com";
  }
  return apiUrl;
};

export const createMayaCheckout = async ({
  publicKey,
  paymentDetails,
  isSandbox = true,
}: CreateMayaCheckout) => {
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

    return { data: responseData, error: null };
  } catch (error) {
    handleError(error, "Failed to create maya checkout - error");
    return { data: null, error: error };
  }
};

export const createTransactionRecord = async ({
  supabaseClient,
  transactionData,
}: CreateTransactionRecord) => {
  try {
    const { data, error } = await supabaseClient
      .from("transaction_table")
      .insert(transactionData)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return { data: data, error: null };
  } catch (error) {
    handleError(error, "Failed to create transaction - error");
    return { data: null, error: error };
  }
};

export const updateTransactionRecord = async ({
  supabaseClient,
  transactionData,
}: UpdateTransactionRecord) => {
  try {
    const { data, error } = await supabaseClient
      .from("transaction_table")
      .update(transactionData)
      .eq("transaction_id", `${transactionData.transaction_id}`)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return { data: data, error: null };
  } catch (error) {
    handleError(error, "Failed to update transaction - error");
    return { data: null, error: error };
  }
};

export const getTransactionList = async ({
  supabaseClient,
  pagination: { from, to },
  filter,
  orderByDateAscending = false,
}: GetTransactionList) => {
  try {
    let query = supabaseClient
      .from("transaction_table")
      .select("*", { count: "exact" });

    if (filter) {
      const { status, appSource, appSourceUserId, serviceName } = filter;

      if (status) {
        query = query.eq("transaction_status", status);
      }
      if (appSource) {
        query = query.eq("transaction_app_source", appSource);
      }
      if (appSourceUserId) {
        query = query.eq("transaction_app_source_user_id", appSourceUserId);
      }
      if (serviceName) {
        query = query.eq("transaction_service_name", serviceName);
      }
    }

    query = query.range(from, to);
    query = query.order("transaction_date", {
      ascending: orderByDateAscending,
    });
    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data, count: Number(count), error: null };
  } catch (error) {
    handleError(error, "Failed to fetch transaction list - error");
    return { data: null, count: null, error: error };
  }
};

export const getTransactionRecord = async ({
  supabaseClient,
  transactionReferenceId,
}: GetTransactionRecord) => {
  try {
    const { data, error } = await supabaseClient
      .from("transaction_table")
      .select("*")
      .eq("transaction_reference_id", transactionReferenceId);

    if (error) throw error;
    return { data: data, error: null };
  } catch (error) {
    handleError(error, "Failed to fetch transaction list - error");
    return { data: null, error: error };
  }
};

export const getAppSourceList = async ({
  supabaseClient,
}: GetTransactionRecord) => {
  try {
    const { data, error } = await supabaseClient
      .from("app_source_table")
      .select("*");
    if (error) throw error;
    return { data: data, error: null };
  } catch (error) {
    handleError(error, "Failed to fetch transaction list - error");
    return { data: null, error: error };
  }
};

export const createMayaCheckoutWithTransaction = async ({
  supabaseClient,
  publicKey,
  paymentDetails,
  isSandbox = true,
  transactionData,
}: CreateMayaCheckout & CreateTransactionRecord) => {
  try {
    const mayaCheckout = await createMayaCheckout({
      publicKey,
      paymentDetails,
      isSandbox,
    });
    await createTransactionRecord({
      supabaseClient,
      transactionData,
    });
    return {
      data: mayaCheckout.data.redirectUrl,
      error: null,
    };
  } catch (error) {
    handleError(
      error,
      "Failed to create maya checkout with transaction - error"
    );
    return { data: null, error: error };
  }
};

export const getRegion = async ({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient<Database["address_schema"]>;
}) => {
  try {
    const { data, error } = await supabaseClient
      .from("region_table")
      .select("region_id, region")
      .eq("region_is_disabled", false)
      .eq("region_is_available", true);
    if (error) throw error;
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    handleError(error, "Failed to fetch region - error");
    return { data: null, error: error };
  }
};

export const getProvince = async ({
  supabaseClient,
  regionId,
}: {
  supabaseClient: SupabaseClient<Database["address_schema"]>;
  regionId: string;
}) => {
  try {
    const { data, error } = await supabaseClient
      .from("province_table")
      .select("province_id, province")
      .eq("province_is_disabled", false)
      .eq("province_is_available", true)
      .eq("province_region_id", regionId);
    if (error) throw error;
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    handleError(error, "Failed to fetch province - error");
    return { data: null, error: error };
  }
};

export const getCity = async ({
  supabaseClient,
  provinceId,
}: {
  supabaseClient: SupabaseClient<Database["address_schema"]>;
  provinceId: string;
}) => {
  try {
    const { data, error } = await supabaseClient
      .from("city_table")
      .select("city_id, city")
      .eq("city_is_disabled", false)
      .eq("city_is_available", true)
      .eq("city_province_id", provinceId);
    if (error) throw error;
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    handleError(error, "Failed to fetch city - error");
    return { data: null, error: error };
  }
};

export const getBarangay = async ({
  supabaseClient,
  cityId,
}: {
  supabaseClient: SupabaseClient<Database["address_schema"]>;
  cityId: string;
}) => {
  try {
    const { data, error } = await supabaseClient
      .from("barangay_table")
      .select("barangay_id, barangay, barangay_zip_code")
      .eq("barangay_is_disabled", false)
      .eq("barangay_is_available", true)
      .eq("barangay_city_id", cityId);
    if (error) throw error;
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    handleError(error, "Failed to fetch barangay - error");
    return { data: null, error: error };
  }
};

export const createMayaCustomer = async ({
  buyer,
  secretKey,
  isSandbox = true
}: {buyer: Buyer, secretKey: string; isSandbox?: boolean}) => {
  try {
    const mayaApiUrl = getMayaApi(isSandbox);
    const response = await fetch(`${mayaApiUrl}/payments/v1/customers`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
          "base64"
        )}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buyer),
    });

    const responseData = await response.json();

    return { data: responseData, error: null };
  } catch (error) {
    handleError(error, "Failed to create customer - error");
    return { data: null, error: error };
  }
};

export const createMayaPaymentToken = async ({
  card,
  publicKey,
  isSandbox = true
}: {card: Card, publicKey: string; isSandbox?: boolean}) => {
  try {
    const mayaApiUrl = getMayaApi(isSandbox);
    const response = await fetch(`${mayaApiUrl}/payments/v1/payment-tokens`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${publicKey}:`).toString(
          "base64"
        )}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({card}),
    });

    const responseData = await response.json();

    return { data: responseData, error: null };
  } catch (error) {
    handleError(error, "Failed to create payment token - error");
    return { data: null, error: error };
  }
};

export const createMayaCustomerCard = async ({
  customerId,
  paymentTokenId,
  isDefault,
  secretKey,
  isSandbox = true
}: {customerId: string; paymentTokenId: string, isDefault: boolean, secretKey: string; isSandbox?: boolean}) => {
  try {
    const mayaApiUrl = getMayaApi(isSandbox);
    const response = await fetch(`${mayaApiUrl}/payments/v1/customers/${customerId}/cards`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
          "base64"
        )}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({paymentTokenId, isDefault}),
    });

    const responseData = await response.json();

    return { data: responseData, error: null };
  } catch (error) {
    handleError(error, "Failed to create customer card - error");
    return { data: null, error: error };
  }
};

export const createMayaCustomerPayment = async ({
  customerId,
  cardToken,
  paymentDetails,
  secretKey,
  isSandbox = true
}: {
  customerId: string; 
  cardToken: string; 
  paymentDetails: {
    totalAmount: {
      amount: number;
      currency: "PHP"
    };
    requestReferenceNumber: string;
    paymentTokenId: string;
    metadata: {
      teamId: string;
      transactionId: string;
      newExpiryDate: string;
      numberOfMonths: number;
      price: number;
      token: string;
      transactionServiceName: string;
    },
    redirectUrl?: {
      success: string,
      failure: string,
      cancel: string,
    },
  },
  secretKey: string; 
  isSandbox?: boolean;
}) => {
  try {
    const mayaApiUrl = getMayaApi(isSandbox);
    const response = await fetch(`${mayaApiUrl}/payments/v1/customers/${customerId}/cards/${cardToken}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
          "base64"
        )}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    });

    const responseData = await response.json();

    return { data: responseData, error: null };
  } catch (error) {
    handleError(error, "Failed to create customer card - error");
    return { data: null, error: error };
  }
};

export const createPaymentCustomer = async ({
  supabaseClient,
  customer,
}: {supabaseClient: SupabaseClient<Database>, customer: CustomerTableInsert}) => {
  try {
    const { data, error } = await supabaseClient.schema("customer_schema")
      .from("customer_table")
      .insert(customer)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return { data: data, error: null };
  } catch (error) {
    handleError(error, "Failed to create customer - error");
    return { data: null, error: error };
  }
};

export const createPaymentCustomerCard = async ({
  supabaseClient,
  card,
}: {supabaseClient: SupabaseClient<Database>, card: CustomerCardTableInsert}) => {
  try {
    const { data, error } = await supabaseClient.schema("customer_schema")
      .from("customer_card_table")
      .insert(card)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return { data: data, error: null };
  } catch (error) {
    handleError(error, "Failed to create customer card - error");
    return { data: null, error: error };
  }
};

export const getInvoice = async ({
  supabaseClient,
  referenceNumber,
  userId,
  isSandbox,
  secretKey
}: GetInvoice) => {
  try {
    // fetch customer
    const {data: customerData, error: customerError} = await supabaseClient
      .schema("customer_schema")
      .from("customer_table")
      .select("customer_provider_id, customer_id")
      .eq("customer_user_id", userId)
      .limit(1);
    if (customerError) throw customerError;

    const customerProviderId = customerData[0].customer_provider_id;
    const mayaApiUrl = getMayaApi(isSandbox);
    const mayaCustomerResponse = await fetch(`${mayaApiUrl}/payments/v1/customers/${customerProviderId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
          "base64"
        )}`,
        Accept: "application/json",
      },
    });
    const mayaCustomerResponseData = await mayaCustomerResponse.json();
    
    // fetch payment
    const paymentResponse = await fetch(`${mayaApiUrl}/payments/v1/payment-rrns/${referenceNumber}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
          "base64"
        )}`,
        Accept: "application/json",
      },
    });
    const paymentData = await paymentResponse.json();
    
    return { data: {
      customerData: mayaCustomerResponseData,
      paymentData: paymentData[0]
    }, error: null };
  } catch (error) {
    handleError(error, "Failed to fetch invoice data");
    return { data: null, count: null, error: error };
  }
};

export type { Database } from "./types/database";
