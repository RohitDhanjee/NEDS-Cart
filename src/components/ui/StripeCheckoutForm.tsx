// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useState } from "react";

// interface StripeCheckoutFormProps {
//   total: number; // Ensure the prop is correctly typed
// }

// const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ total }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) {
//       console.error("CardElement not found");
//       setLoading(false);
//       return;
//     }

//     console.log(`Processing payment of $${total}`); // Debugging
//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <p>Total Amount: ${total}</p>
//       <CardElement />
//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? "Processing..." : "Pay Now"}
//       </button>
//     </form>
//   );
// };


import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "react-day-picker";

interface StripeCheckoutFormProps {
  total: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ 
    total, 
    onSuccess,
    onError 
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

    setLoading(true);
    
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100 })
      });

      const { clientSecret } = await response.json();
      
      // Confirm card payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (error) throw error;
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Payment failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded-lg" />
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
};
export default StripeCheckoutForm;