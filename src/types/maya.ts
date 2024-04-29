

export type CreateMayaCheckout = {
    publicKey: string;
    paymentDetails: {
        totalAmount: TotalAmount;
        buyer?: Buyer;
        items: Item[];
        redirectUrl?: RedirectUrls;
        requestReferenceNumber: string;
        metadata: {};
    }
    isSandbox?: boolean;
}

type TotalAmount = {
    value: number;
    currency: string;
    details?: Details;
}

type Buyer = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    birthday?: string;
    customerSince?: string;
    sex?: string;
    contact?: {
        phone?: string;
        email?: string;
    };
    shippingAddress?: ShippingAddress;
    billingAddress?: BillingAddress;
}

type ShippingAddress = {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    shippingType: ShippingType;
}

export enum ShippingType {
    ST = 'ST',
    SD = 'SD',
}

type BillingAddress = {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    countryCode?: string;
}

type Item = {
    name: string;
    quantity?: number;
    code?: string;
    description?: string;
    amount?: Amount;
    totalAmount: Amount;
}

type Amount = {
    value: number;
    details?: Details;
}

type Details = {
    discount?: number;
    serviceCharge?: number;
    shippingFee?: number;
    tax?: number;
    subtotal?: number;
}

type RedirectUrls = {
    success?: string;
    failure?: string;
    cancel?: string;
}