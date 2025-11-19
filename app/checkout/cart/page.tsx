// app/checkout/cart/page.tsx
import CheckoutCartClient from "./CheckoutCartClient";

export const dynamic = "force-dynamic";

export default function CartCheckoutPage() {
  return <CheckoutCartClient />;
}
