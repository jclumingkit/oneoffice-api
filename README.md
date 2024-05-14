# oneoffice-api

The standardized OneOffice API.


### Supported Payment Channels

At the moment, only Maya Payment is supported. See their documentation here: https://developers.maya.ph/

### Installation and Usage

Install the library using `npm install oneoffice-api` 

**Use Maya Checkout**
```
import { createMayaCheckout } from "oneoffice-api";

const {data, error} = await createMayaCheckout({
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
import { getTransactionList } from "oneoffice-api";

const {data, count, error} = await getTransactionList({
  pagination: { from: 0, to: 10 },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});

// add filters
const {data, count, error} = await getTransactionList({
  pagination: {
    from: 0,
    to: 10,
  },
  filter: {
    appSourceUserId: "f69933b2-fe12-4fc4-bb56-63f370e40a45",
    appSource: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca",
    status: "COMPLETED_PAYMENT",
    serviceName: "mailroom",
  },
  supabaseUrl: `${process.env.NEXT_PUBLIC_TRANSACTION_SUPABASE_URL}`,
  supabaseAnonKey: `${process.env.NEXT_PUBLIC_TRANSACTION_SUPABASE_ANON_KEY}`,
});

// order by date ascending
const {data, count, error} = await getTransactionList({
  pagination: {
    from: 0,
    to: 10,
  },
  orderByDateAscending: true,
  supabaseUrl: `${process.env.NEXT_PUBLIC_TRANSACTION_SUPABASE_URL}`,
  supabaseAnonKey: `${process.env.NEXT_PUBLIC_TRANSACTION_SUPABASE_ANON_KEY}`,
});
```

**Get Transaction Record**
```
import { getTransactionRecord } from "oneoffice-api";

const {data, error} = await getTransactionRecord({
  transactionReferenceId: "23c210c4-6193-4896-a829-73a1dfc99bf9",
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Create Transaction**
```
import { createTransactionRecord } from "oneoffice-api";

const {data, error} = await createTransactionRecord({
  transactionData: {
    transaction_reference_id: "23c210c4-6193-4896-a829-73a1dfc99bf9",
    transaction_service_name: "Buy n Sell",
    transaction_payment_channel: "paymaya",
    transaction_total_amount: 100,
    transaction_app_source_user_id: "88274006-487f-49ba-b82e-99a2b2387d19",
    transaction_app_source: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca", // app_source_id
  },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Update Transaction**
```
import { updateTransactionRecord } from "oneoffice-api";

const {data, error} = await updateTransactionRecord({
  transactionData: {
    transaction_id: "1a1a1394-81aa-490f-8a94-4cb64b0f5b86",
    transaction_reference_id: "23c210c4-6193-4896-a829-73a1dfc99bf9",
    transaction_service_name: "Buy n Sell",
    transaction_payment_channel: "paymaya",
    transaction_total_amount: 100,
    transaction_app_source_user_id: "88274006-487f-49ba-b82e-99a2b2387d19",
    transaction_app_source: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca", // app_source_id
  },
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Use Maya Checkout With Transaction**
```
import { createMayaCheckoutWithTransaction } from "oneoffice-api";

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
  transaction_app_source_user_id: "88274006-487f-49ba-b82e-99a2b2387d19",
  transaction_app_source: "ba9e641e-d7fe-4d61-b9ee-85c919f457ca", // app_source_id
}

// will create maya checkout and transaction record
// then redirect user to maya checkout page
await createMayaCheckoutWithTransaction({
  publicKey: "pk-NCLk7JeDbX1m22ZRMDYO9bEPowNWT5J4aNIKIbcTy2a",
  paymentDetails,
  transactionData,
  supabaseUrl: "<yoursupabaseurl>",
  supabaseAnonKey: "<yoursupabaseanonkey>",
});
```

**Fetch All App Source**
```
import { getAppSourceList } from "oneoffice-api";

const {data, error} = await getAppSourceList({
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
