# formsly-payment-gateway

The standardized Formsly payment gateway.


# Supported Payment Channels

At the moment, only Maya Payment is supported. See their documentation here: https://developers.maya.ph/

## Installation and Usage

Install the library using `npm install formsly-payment-gateway`

**Use Maya Checkout**
```
import { createMayaCheckout } from "formsly-payment-gateway";

const response = await createMayaCheckout({
    publicKey: "pk-NCLk7JeDbX1m22ZRMDYO9bEPowNWT5J4aNIKIbcTy2a",
    paymentDetails: {
      totalAmount: 100,
      items: [
        {
          name: "Foo Item",
          quantity: 1,
          description: "Foo item from General Store.",
          totalAmount: {
             value: 100,
          },
        },
      ],
      redirectUrl: {
         success: "http://yourapp.com/payment/success",
         failure: "http://yourapp.com/payment/fail",
         cancel: "http://yourapp.com/payment/cancel"
      },
      requestReferenceNumber: "23c210c4-6193-4896-a829-73a1dfc99bf9",
      metadata: {},
    },
    isSandbox: true // optional, default true, set to false in production
});
```

**The following methods require a Supabase project with a transaction_table. Please see `src/types/transaction` for further reference.**

**Get Transaction List**
```
import { getTransactionList } from "formsly-payment-gateway";

const {success, data} = await getTransactionList({
  pagination: { from: 0, to: 10 },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});

// add status filter
const {success, data} = await getTransactionList({
  status: "PENDING",
  pagination: { from: 0, to: 10 },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Get Transaction Record**
```
import { getTransactionRecord } from "formsly-payment-gateway";

const {success, data} = await getTransactionRecord({
  transactionReferenceId: "23c210c4-6193-4896-a829-73a1dfc99bf9",
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Create Transaction**
```
import { createTransactionRecord } from "formsly-payment-gateway";

const {success, data} = await createTransactionRecord({
  transactionData: {
    transaction_reference_id: "23c210c4-6193-4896-a829-73a1dfc99bf9",
    transaction_service_name: "Buy n Sell",
    transaction_payment_channel: "paymaya",
    transaction_total_amount: 100,
    transaction_app_source: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca", // app_source_id
  },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Update Transaction**
```
import { updateTransactionRecord } from "formsly-payment-gateway";

const {success, data} = await updateTransactionRecord({
  transactionData: {
    transaction_id: "1a1a1394-81aa-490f-8a94-4cb64b0f5b86",
    transaction_reference_id: "23c210c4-6193-4896-a829-73a1dfc99bf9",
    transaction_service_name: "Buy n Sell",
    transaction_payment_channel: "paymaya",
    transaction_total_amount: 100,
    transaction_app_source: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca", // app_source_id
  },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Use Maya Checkout With Transaction**
```
import { createMayaCheckoutWithTransaction } from "formsly-payment-gateway";

const referenceNumber = "23c210c4-6193-4896-a829-73a1dfc99bf9";

const paymentDetails = {
  totalAmount: 100,
  items: [
    {
      name: "Foo Item",
      quantity: 1,
      description: "Foo item from General Store.",
      totalAmount: {
          value: 100,
      },
    },
  ],
  redirectUrl: {
      success: "http://yourapp.com/payment/success",
      failure: "http://yourapp.com/payment/fail",
      cancel: "http://yourapp.com/payment/cancel"
  },
  requestReferenceNumber: referenceNumber,
  metadata: {},
};

const transactionData = {
  transaction_reference_id: referenceNumber,
  transaction_service_name: "Buy n Sell",
  transaction_payment_channel: "paymaya",
  transaction_total_amount: 100,
  transaction_app_source: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca", // app_source_id
}

const response = await createMayaCheckoutWithTransaction({
  publicKey: "pk-NCLk7JeDbX1m22ZRMDYO9bEPowNWT5J4aNIKIbcTy2a",
  paymentDetails,
  transactionData,
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Fetch All App Source**
```
import { getAppSourceList } from "formsly-payment-gateway";

const {success, data} = await getAppSourceList({
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

## Typescript

Typescript supported. Import types from `src/types`.

## License

ISC License

Copyright (c) 2024  Juan Carlos Lumingkit <juancarloslumingkit@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
