# formsly-payment-gateway

The standardized Formsly payment gateway.


# Supported Payment Channels

At the moment, only Maya Payment is supported. See their documentation here: https://developers.maya.ph/

## Installation and Usage

Install the library using `npm install formsly-payment-gateway`

**ES6**
```
import { createMayaCheckout } from "formsly-payment-gateway";

const response = await createMayaCheckout({
	publicKey: `pk-NCLk7JeDbX1m22ZRMDYO9bEPowNWT5J4aNIKIbcTy2a`,
	paymentDetails: {
		totalAmount: TotalAmount;
		items: [
			{
				name: 'Foo Item',
				quantity: 1,
				description: 'Foo item from Store.',
				totalAmount: {
					value: 100,
				},
			},
		],
		redirectUrl: {
			success: 'http://yourapp.com/payment/success',
			failure: 'http://yourapp.com/payment/fail',
			cancel: 'http://yourapp.com/payment/cancel'
		},
		requestReferenceNumber: '23c210c4-6193-4896-a829-73a1dfc99bf9';
		metadata: {};
	},
	isSandbox: true // optional, default value is true
});
```

## Typescript

Typescript supported. Import types from `src/types`.

## License
```
ISC License

Copyright <YEAR> <OWNER>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```