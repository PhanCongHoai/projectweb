const express = require('express');
const router = express.Router();
const {
    sendResetRequest,
    validateResetToken,
    resetPassword,
    verifyOTP
} = require('../controllers/forgotPasswordController');

// POST /api/forgot-password/send-reset-request
router.post('/send-reset-request', sendResetRequest);

// GET /api/forgot-password/validate-token/:token  
router.get('/validate-token/:token', validateResetToken);

// POST /api/forgot-password/reset-password
router.post('/reset-password', resetPassword);

// POST /api/forgot-password/verify-otp
router.post('/verify-otp', verifyOTP);

module.exports = router;