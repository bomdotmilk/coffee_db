const express = require('express');
const {
    insertMedia,
    getAllMedia,
    getMediaByFarmId,
    getMediaByCoffeeId,
    deleteMedia
} = require('../controllers/mediaController');

const router = express.Router();

// POST /api/media/insert - เพิ่มข้อมูลสื่อ
router.post('/insert', insertMedia);

// GET /api/media - ดึงข้อมูลสื่อทั้งหมด
router.get('/', getAllMedia);

// GET /api/media/farm/:farmId - ดึงข้อมูลสื่อตาม farm_id
router.get('/farm/:farmId', getMediaByFarmId);

// GET /api/media/coffee/:coffeeId - ดึงข้อมูลสื่อตาม coffee_id
router.get('/coffee/:coffeeId', getMediaByCoffeeId);

// DELETE /api/media/:id - ลบข้อมูลสื่อ
router.delete('/:id', deleteMedia);

module.exports = router;