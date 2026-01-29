const express = require('express');
const { 
    register, 
    login 
} = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - ลงทะเบียน
router.post('/register', register);

// POST /api/auth/login - เข้าสู่ระบบ
router.post('/login', login);

module.exports = router;