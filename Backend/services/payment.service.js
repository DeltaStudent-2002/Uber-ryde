const Stripe = require('stripe');

const stripe = process.env.STRIPE_SECRET_KEY 
    ? Stripe(process.env.STRIPE_SECRET_KEY) 
    : null;

module.exports.createPaymentIntent = async (amount, currency = 'inr') => {
    if (!stripe) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to paise/cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    } catch (error) {
        console.error('Stripe payment intent error:', error);
        throw new Error('Payment creation failed');
    }
}

module.exports.confirmPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return {
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency
        };
    } catch (error) {
        console.error('Stripe confirm payment error:', error);
        throw new Error('Payment confirmation failed');
    }
}

module.exports.createRefund = async (paymentIntentId, amount = null) => {
    try {
        const refundParams = {
            payment_intent: paymentIntentId,
        };
        
        if (amount) {
            refundParams.amount = amount * 100; // Partial refund in paise
        }

        const refund = await stripe.refunds.create(refundParams);
        
        return {
            refundId: refund.id,
            status: refund.status,
            amount: refund.amount / 100
        };
    } catch (error) {
        console.error('Stripe refund error:', error);
        throw new Error('Refund creation failed');
    }
}
