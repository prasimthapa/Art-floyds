// @ts-expect-error xxx
import KhaltiCheckout from "khalti-checkout-web";

const apiKey = process.env.NEXT_PUBLIC_KHALTI_API_KEY ?? ''

export const showCheckout = ({ amount, onSuccess, onError }: { amount: number, onSuccess?: () => void, onError?: (err: unknown) => void }) => {
  onSuccess ??= () => console.log('payment success')
  onError ??= () => console.log('payment failed')
  const config = {
    "publicKey": apiKey,
    "productIdentity": "1234567890",
    "productName": "Drogon",
    "productUrl": "http://gameofthrones.com/buy/Dragons",
    "eventHandler": {
      onSuccess,
      onError,
    },
    paymentPreference: [
      // "MOBILE_BANKING",
      "KHALTI",
      // "EBANKING",
      // "CONNECT_IPS",
      // "SCT",
    ],
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const checkout = new KhaltiCheckout(config)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  checkout.show({ amount: amount * 100 })
}

type KhaltiPaymentConfirmation = {
  public_key: string,
  transaction_pin: string,
  token: string,
  confirmation_code: string,
}

export type KhaltiPaymentInitiation = {
  // amount: number
  // mobile: string
  // product_identity: string
  // product_name: string
  // product_url: string
  // public_key: string
  // transaction_pin: string
  return_url: string
  website_url: string
  purchase_order_id: string
  purchase_order_name: string
  customer_info?: { name: string, email: string, phone: string }
  amount_breakdown?: { label: string, amount: number }[]
  product_details?: { identity: string, name: string, total_price: number, quantity: number, unit_price: number }[]
}

export type KhaltiPaymentInitiationResponse = {
  pidx: string
  payment_url: string
  expires_at: string
  expires_in: number
} | (Partial<{ [K in keyof KhaltiPaymentInitiation]: string[] }> & { error_key: string });

type KhaltiPaymentInitiationRequest = Omit<KhaltiPaymentInitiation, "website_url">
export const initiatePayment = async (body: KhaltiPaymentInitiationRequest) => {
  const paymentaBaseUrl = true || apiKey.includes('test') ? 'https://a.khalti.com/api/v2' : 'https://khalti.com/api/v2'
  const res = await fetch(`${paymentaBaseUrl}/epayment/initiate/`, {
    method: 'POST',
    headers: {
      // Origin: "https://khalti.s3.ap-south-1.amazonaws.com"
      Authorization: `key ${apiKey}`,
    },
    body: JSON.stringify({
      ...body,
      website_url: window.location.origin,
      // public_key: "test_public_key_12c2d568c03840cbae65ba9a318b5199",
    }),
  })
  return res.json() as Promise<KhaltiPaymentInitiationResponse>
}
