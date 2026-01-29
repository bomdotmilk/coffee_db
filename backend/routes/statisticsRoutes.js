const express = require('express');
const {
    getAllStatistics,
    getChartData,
    getAllImages,
    getMapData
} = require('../controllers/statisticsController');

const router = express.Router();

// GET /api/statistics - ดึงข้อมูลสถิติทั้งหมด
router.get('/', getAllStatistics);

// GET /api/statistics/chart/:type - ดึงข้อมูลสำหรับกราฟ
router.get('/chart/:type', getChartData);

// GET /api/statistics/images - ดึงข้อมูลภาพทั้งหมด
router.get('/images', getAllImages);

// GET /api/statistics/map - ดึงข้อมูลแผนที่
router.get('/map', getMapData);

module.exports = router;