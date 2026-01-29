const express = require('express');
const { 
    getAllFarms, 
    getFarmById, 
    createFarm, 
    updateFarm, 
    deleteFarm
} = require('../controllers/farmController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ใช้ authMiddleware สำหรับทุก route
router.use(authMiddleware);

// GET /api/farms - ดึงข้อมูลไร่ทั้งหมด
router.get('/', getAllFarms);

// GET /api/farms/:id - ดึงข้อมูลไร่ตาม ID
router.get('/:id', getFarmById);

// POST /api/farms - สร้างไร่ใหม่
router.post('/', createFarm);

// PUT /api/farms/:id - อัปเดตข้อมูลไร่
router.put('/:id', updateFarm);

// DELETE /api/farms/:id - ลบไร่
router.delete('/:id', deleteFarm);

module.exports = router;