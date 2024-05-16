import { createClient } from "@supabase/supabase-js";
import { CreateMayaCheckout } from "./types/maya";
import {
  CreateTransactionRecord,
  GetTransactionList,
  GetTransactionRecord,
  UpdateTransactionRecord,
} from "./types/transaction";
import { handleError } from "./utils/errorHandler";

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
  transactionData,
  supabaseUrl,
  supabaseAnonKey,
}: CreateTransactionRecord) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "transaction_schema" },
    });
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
  transactionData,
  supabaseUrl,
  supabaseAnonKey,
}: UpdateTransactionRecord) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "transaction_schema" },
    });
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
  pagination: { from, to },
  filter,
  orderByDateAscending = false,
  supabaseUrl,
  supabaseAnonKey,
}: GetTransactionList) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "transaction_schema" },
    });
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
  transactionReferenceId,
  supabaseUrl,
  supabaseAnonKey,
}: GetTransactionRecord) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
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
  supabaseUrl,
  supabaseAnonKey,
}: GetTransactionRecord) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
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
  publicKey,
  paymentDetails,
  isSandbox = true,
  transactionData,
  supabaseUrl,
  supabaseAnonKey,
}: CreateMayaCheckout & CreateTransactionRecord) => {
  try {
    const mayaCheckout = await createMayaCheckout({
      publicKey,
      paymentDetails,
      isSandbox,
    });
    await createTransactionRecord({
      transactionData,
      supabaseUrl,
      supabaseAnonKey,
    });
    window.location.href = mayaCheckout.data.redirectUrl;
  } catch (error) {
    handleError(
      error,
      "Failed to create maya checkout with transaction - error"
    );
    return { data: null, error: error };
  }
};

export const getRegion = async ({
  supabaseUrl,
  supabaseAnonKey,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
}) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "address_schema" },
    });
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
  supabaseUrl,
  supabaseAnonKey,
  regionId,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  regionId: string;
}) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "address_schema" },
    });
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
  supabaseUrl,
  supabaseAnonKey,
  provinceId,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  provinceId: string;
}) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "address_schema" },
    });
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
  supabaseUrl,
  supabaseAnonKey,
  cityId,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  cityId: string;
}) => {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: "address_schema" },
    });
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
