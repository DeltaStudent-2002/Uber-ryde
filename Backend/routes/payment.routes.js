const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-payment', authMiddleware.authUser, paymentController.createPayment);
router.post('/confirm-payment', authMiddleware.authUser, paymentController.confirmPayment);
router.post('/refund', authMiddleware.authUser, paymentController.createRefund);

module.exports = router;
