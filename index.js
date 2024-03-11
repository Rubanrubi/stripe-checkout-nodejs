const stripe = require('stripe')('secret_key');

async function createCheckoutSession() {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Perth Mine',
                    },
                    unit_amount: 2000, // Amount in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://127.0.0.1:5500/success',
        cancel_url: 'http://127.0.0.1:5500/failure',
    });
    return session;
}

async function getInvoicePDFURL(checkoutSessionId) {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    console.log('session', session)
    const invoiceId = session.payment_intent.invoice;
    console.log('invoiceId', invoiceId);
    const invoice = await stripe.invoices.retrieve(invoiceId);
    const pdfURL = invoice.invoice_pdf;
    return pdfURL;
}


async function main() {
    try {
        const session = await createCheckoutSession();
        console.log("Checkout Session ID:", session.id);
        const pdfURL = await getInvoicePDFURL(session.id);
        console.log("Invoice PDF URL:", pdfURL);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
