const express = require('express');
const {
    insertCultivation,
    getAllCultivation,
    getCultivationByFarmId,
    getCultivationByCoffeeId,
    getCultivationDetail,
    updateCultivation,
    deleteCultivation
} = require('../controllers/cultivationController');

const router = express.Router();

// POST /api/cultivation/insert - เพิ่มข้อมูลวิธีการปลูก
router.post('/insert', insertCultivation);

// GET /api/cultivation - ดึงข้อมูลวิธีการปลูกทั้งหมด
router.get('/', getAllCultivation);

// GET /api/cultivation/farm/:farmId - ดึงข้อมูลตาม farm_id
router.get('/farm/:farmId', getCultivationByFarmId);

// GET /api/cultivation/coffee/:coffeeId - ดึงข้อมูลตาม coffee_id
router.get('/coffee/:coffeeId', getCultivationByCoffeeId);

// GET /api/cultivation/:methodId - ดึงข้อมูลโดยละเอียด
router.get('/:methodId', getCultivationDetail);

// PUT /api/cultivation/:id - อัพเดทข้อมูล
router.put('/:id', updateCultivation);

// DELETE /api/cultivation/:id - ลบข้อมูล
router.delete('/:id', deleteCultivation);

module.exports = router;