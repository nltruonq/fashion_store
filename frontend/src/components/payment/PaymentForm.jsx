import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function PaymentForm({ handleBuyOrder, open, setOpen }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsProcessing(true);

        const data = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                // return_url: `${window.location.origin}/completion`,
            },
            redirect: "if_required",
        });

        if (data.paymentIntent.status == "succeeded") {
            await handleBuyOrder();
        }
        setOpen(false);
        setIsProcessing(false);
    };

    return (
        <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="relative h-[700px]"
            style={{ position: "relative", height: "300px", marginTop: "5rem" }}
        >
            <PaymentElement id="payment-element" />
            <button
                disabled={isProcessing || !stripe || !elements}
                className="btn"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "2rem",
                }}
            >
                <span id="button-text">
                    {isProcessing ? "Loading ... " : "THANH TOÁN"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}
