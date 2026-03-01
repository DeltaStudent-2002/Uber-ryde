const paymentService = require('../services/payment.service');

module.exports.createPayment = async (req, res, next) => {
    try {
        const { amount, currency } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const payment = await paymentService.createPaymentIntent(amount, currency);
        
        res.status(200).json({
            clientSecret: payment.clientSecret,
            paymentIntentId: payment.paymentIntentId
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ message: error.message || 'Payment failed' });
    }
}

module.exports.confirmPayment = async (req, res, next) => {
    try {
        const { paymentIntentId } = req.body;
        
        const result = await paymentService.confirmPayment(paymentIntentId);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ message: error.message || 'Payment confirmation failed' });
    }
}

module.exports.createRefund = async (req, res, next) => {
    try {
        const { paymentIntentId, amount } = req.body;
        
        const result = await paymentService.createRefund(paymentIntentId, amount);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({ message: error.message || 'Refund failed' });
    }
}
