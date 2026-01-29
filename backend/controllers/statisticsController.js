// const pool = require('../config/database');

// const statisticsController = {
//     // ดึงข้อมูลสถิติทั้งหมด
//     getAllStatistics: async (req, res) => {
//         try {
//             // จำนวนไร่ทั้งหมด
//             const [totalFarms] = await pool.execute(
//                 'SELECT COUNT(*) as count FROM coffee_farm'
//             );

//             // พื้นที่รวม
//             const [totalArea] = await pool.execute(
//                 'SELECT SUM(area_size) as total FROM coffee_farm'
//             );

//             // จำนวนเจ้าของไร่
//             const [totalOwners] = await pool.execute(
//                 'SELECT COUNT(*) as count FROM farm_owner WHERE status = "approved"'
//             );

//             // จำนวนไร่แยกตามอำเภอ
//             const [farmsByDistrict] = await pool.execute(`
//                 SELECT 
//                     district,
//                     COUNT(*) as farm_count,
//                     SUM(area_size) as total_area
//                 FROM coffee_farm
//                 GROUP BY district
//                 ORDER BY farm_count DESC
//             `);

//             // จำนวนไร่แยกตามสถานะเจ้าของ
//             const [farmsByOwnerStatus] = await pool.execute(`
//                 SELECT 
//                     fo.status,
//                     COUNT(*) as count
//                 FROM coffee_farm cf
//                 JOIN farm_owner fo ON cf.owner_id = fo.owner_id
//                 GROUP BY fo.status
//             `);

//             // ผลผลิตล่าสุด
//             const [recentProduction] = await pool.execute(`
//                 SELECT 
//                     p.harvest_year,
//                     SUM(p.quantity_kg) as total_quantity,
//                     AVG(CASE 
//                         WHEN p.quality_grade = 'Grade A' THEN 1
//                         WHEN p.quality_grade = 'Grade B' THEN 2
//                         WHEN p.quality_grade = 'Grade C' THEN 3
//                         ELSE 4 
//                     END) as avg_grade
//                 FROM production p
//                 GROUP BY p.harvest_year
//                 ORDER BY p.harvest_year DESC
//                 LIMIT 5
//             `);

//             // ประเภทกาแฟ
//             const [coffeeTypes] = await pool.execute(`
//                 SELECT 
//                     coffee_name,
//                     COUNT(*) as count
//                 FROM coffee_type
//                 GROUP BY coffee_name
//                 ORDER BY count DESC
//             `);

//             res.json({
//                 success: true,
//                 data: {
//                     total_farms: totalFarms[0].count || 0,
//                     total_area: totalArea[0].total || 0,
//                     total_owners: totalOwners[0].count || 0,
//                     farms_by_district: farmsByDistrict,
//                     farms_by_owner_status: farmsByOwnerStatus,
//                     recent_production: recentProduction,
//                     coffee_types: coffeeTypes
//                 }
//             });

//         } catch (error) {
//             console.error('Get statistics error:', error);
//             res.status(500).json({
//                 error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ'
//             });
//         }
//     },

//     // ดึงข้อมูลสำหรับกราฟ
//     getChartData: async (req, res) => {
//         try {
//             const { type } = req.params;

//             switch(type) {
//                 case 'farms-by-year':
//                     // จำนวนไร่ที่สร้างในแต่ละปี
//                     const [farmsByYear] = await pool.execute(`
//                         SELECT 
//                             YEAR(created_at) as year,
//                             COUNT(*) as count
//                         FROM coffee_farm
//                         GROUP BY YEAR(created_at)
//                         ORDER BY year
//                     `);
//                     return res.json({ success: true, data: farmsByYear });

//                 case 'production-trend':
//                     // แนวโน้มผลผลิต
//                     const [productionTrend] = await pool.execute(`
//                         SELECT 
//                             harvest_year,
//                             SUM(quantity_kg) as total_kg,
//                             COUNT(*) as farm_count
//                         FROM production
//                         GROUP BY harvest_year
//                         ORDER BY harvest_year
//                     `);
//                     return res.json({ success: true, data: productionTrend });

//                 case 'area-distribution':
//                     // การกระจายพื้นที่
//                     const [areaDistribution] = await pool.execute(`
//                         SELECT 
//                             CASE 
//                                 WHEN area_size <= 5 THEN '0-5 ไร่'
//                                 WHEN area_size <= 10 THEN '6-10 ไร่'
//                                 WHEN area_size <= 20 THEN '11-20 ไร่'
//                                 WHEN area_size <= 50 THEN '21-50 ไร่'
//                                 ELSE '50+ ไร่'
//                             END as range,
//                             COUNT(*) as farm_count,
//                             SUM(area_size) as total_area
//                         FROM coffee_farm
//                         GROUP BY range
//                         ORDER BY MIN(area_size)
//                     `);
//                     return res.json({ success: true, data: areaDistribution });

//                 default:
//                     return res.status(400).json({ error: 'ประเภทกราฟไม่ถูกต้อง' });
//             }
//         } catch (error) {
//             console.error('Get chart data error:', error);
//             res.status(500).json({
//                 error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกราฟ'
//             });
//         }
//     },

//     // ดึงข้อมูลภาพทั้งหมด
//     getAllImages: async (req, res) => {
//         try {
//             const [images] = await pool.execute(`
//                 SELECT 
//                     m.*,
//                     CASE m.ref_type
//                         WHEN 'farm' THEN cf.farm_name
//                         WHEN 'coffee' THEN ct.coffee_name
//                         ELSE 'Unknown'
//                     END as ref_name
//                 FROM media m
//                 LEFT JOIN coffee_farm cf ON m.ref_type = 'farm' AND m.ref_id = cf.farm_id
//                 LEFT JOIN coffee_type ct ON m.ref_type = 'coffee' AND m.ref_id = ct.coffee_id
//                 ORDER BY m.created_at DESC
//             `);

//             // สำหรับ development: ถ้าไม่มีรูป ให้ใช้รูปตัวอย่าง
//             if (images.length === 0) {
//                 const sampleImages = [
//                     {
//                         media_id: 1,
//                         ref_type: 'farm',
//                         ref_id: 1,
//                         file_path: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop',
//                         file_type: 'image/jpeg',
//                         created_at: new Date(),
//                         ref_name: 'ไร่กาแฟภูเลย'
//                     },
//                     {
//                         media_id: 2,
//                         ref_type: 'farm',
//                         ref_id: 2,
//                         file_path: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w-800&auto=format&fit=crop',
//                         file_type: 'image/jpeg',
//                         created_at: new Date(),
//                         ref_name: 'สวนกาแฟภูเรือ'
//                     }
//                 ];
//                 return res.json({ success: true, data: sampleImages });
//             }

//             res.json({ success: true, data: images });
//         } catch (error) {
//             console.error('Get images error:', error);
//             res.status(500).json({
//                 error: 'เกิดข้อผิดพลาดในการดึงข้อมูลภาพ'
//             });
//         }
//     },

//     // ดึงข้อมูลแผนที่
//     getMapData: async (req, res) => {
//         try {
//             const [farms] = await pool.execute(`
//                 SELECT 
//                     cf.farm_id,
//                     cf.farm_name,
//                     cf.latitude,
//                     cf.longitude,
//                     cf.area_size,
//                     cf.district,
//                     fo.fullname as owner_name,
//                     fo.status as owner_status
//                 FROM coffee_farm cf
//                 JOIN farm_owner fo ON cf.owner_id = fo.owner_id
//                 WHERE cf.latitude IS NOT NULL 
//                     AND cf.longitude IS NOT NULL
//                 ORDER BY cf.farm_name
//             `);

//             // สำหรับ development: ถ้าไม่มีข้อมูลพิกัด ให้ใช้ข้อมูลตัวอย่าง
//             if (farms.length === 0 || !farms[0].latitude) {
//                 const sampleFarms = [
//                     {
//                         farm_id: 1,
//                         farm_name: 'ไร่กาแฟภูเลย',
//                         latitude: 17.486023,
//                         longitude: 101.728145,
//                         area_size: 15.5,
//                         district: 'เมืองเลย',
//                         owner_name: 'นายสมชาย ใจดี',
//                         owner_status: 'approved'
//                     },
//                     {
//                         farm_id: 2,
//                         farm_name: 'สวนกาแฟภูเรือ',
//                         latitude: 17.453210,
//                         longitude: 101.359876,
//                         area_size: 10.0,
//                         district: 'ภูเรือ',
//                         owner_name: 'นางสาวสมพร รักษ์ป่า',
//                         owner_status: 'pending'
//                     }
//                 ];
//                 return res.json({ success: true, data: sampleFarms });
//             }

//             res.json({ success: true, data: farms });
//         } catch (error) {
//             console.error('Get map data error:', error);
//             res.status(500).json({
//                 error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนที่'
//             });
//         }
//     }
// };

// module.exports = statisticsController;

const pool = require('../config/database');

const statisticsController = {

    // ===============================
    // GET /api/statistics
    // ===============================
    getAllStatistics: async (req, res) => {
        try {
            // จำนวนไร่ทั้งหมด
            const [[totalFarms]] = await pool.execute(
                'SELECT COUNT(*) AS total_farms FROM coffee_farm'
            );

            // พื้นที่รวม
            const [[totalArea]] = await pool.execute(
                'SELECT IFNULL(SUM(area_size),0) AS total_area FROM coffee_farm'
            );

            // จำนวนเจ้าของไร่
            const [[totalOwners]] = await pool.execute(
                `SELECT COUNT(*) AS total_owners 
                 FROM farm_owner 
                 WHERE status = 'approved'`
            );

            // ไร่แยกตามอำเภอ
            const [farmsByDistrict] = await pool.execute(`
                SELECT 
                    district,
                    COUNT(*) AS farm_count,
                    IFNULL(SUM(area_size),0) AS total_area
                FROM coffee_farm
                GROUP BY district
                ORDER BY farm_count DESC
            `);

            // ประเภทกาแฟ (ผูกกับไร่จริง)
            const [coffeeTypes] = await pool.execute(`
                SELECT 
                    ct.coffee_name,
                    COUNT(cf.farm_id) AS count
                FROM coffee_farm cf
                JOIN coffee_type ct ON cf.coffee_id = ct.coffee_id
                GROUP BY ct.coffee_name
            `);

            // ผลผลิตล่าสุด (แก้ให้ Frontend ใช้ได้)
            const [recentProduction] = await pool.execute(`
                SELECT 
                    p.harvest_year,
                    SUM(p.quantity_kg) AS total_quantity,
                    COUNT(DISTINCT p.farm_id) AS farm_count,
                    AVG(
                        CASE p.quality_grade
                            WHEN 'Grade A' THEN 1
                            WHEN 'Grade B' THEN 2
                            WHEN 'Grade C' THEN 3
                            ELSE 4
                        END
                    ) AS avg_grade
                FROM production p
                GROUP BY p.harvest_year
                ORDER BY p.harvest_year DESC
                LIMIT 5
            `);

            res.json({
                success: true,
                data: {
                    total_farms: totalFarms.total_farms,
                    total_area: totalArea.total_area,
                    total_owners: totalOwners.total_owners,
                    farms_by_district: farmsByDistrict,
                    coffee_types: coffeeTypes,
                    recent_production: recentProduction
                }
            });

        } catch (error) {
            console.error('Statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ'
            });
        }
    },

    // ===============================
    // GET /api/statistics/chart/:type
    // ===============================
    getChartData: async (req, res) => {
        try {
            const { type } = req.params;

            let sql = '';

            if (type === 'district') {
                sql = `
                    SELECT district AS label, COUNT(*) AS value
                    FROM coffee_farm
                    GROUP BY district
                `;
            } 
            else if (type === 'coffee') {
                sql = `
                    SELECT ct.coffee_name AS label, COUNT(*) AS value
                    FROM coffee_farm cf
                    JOIN coffee_type ct ON cf.coffee_id = ct.coffee_id
                    GROUP BY ct.coffee_name
                `;
            } 
            else {
                return res.status(400).json({ error: 'chart type ไม่ถูกต้อง' });
            }

            const [rows] = await pool.execute(sql);
            res.json({ success: true, data: rows });

        } catch (error) {
            console.error('Chart error:', error);
            res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลกราฟ' });
        }
    },

    // ===============================
    // GET /api/statistics/images
    // ===============================
    getAllImages: async (req, res) => {
        try {
            const [images] = await pool.execute(`
                SELECT 
                    m.media_id,
                    m.file_path,
                    m.file_type,
                    m.created_at,
                    m.ref_type,
                    CASE 
                        WHEN m.ref_type = 'farm' THEN cf.farm_name
                        WHEN m.ref_type = 'coffee' THEN ct.coffee_name
                        ELSE 'Unknown'
                    END AS ref_name
                FROM media m
                LEFT JOIN coffee_farm cf 
                    ON m.ref_type = 'farm' AND m.ref_id = cf.farm_id
                LEFT JOIN coffee_type ct 
                    ON m.ref_type = 'coffee' AND m.ref_id = ct.coffee_id
                ORDER BY m.created_at DESC
            `);

            res.json({ success: true, data: images });
        } catch (error) {
            console.error('Images error:', error);
            res.status(500).json({ error: 'ดึงข้อมูลภาพไม่สำเร็จ' });
        }
    },

    // ===============================
    // GET /api/statistics/map
    // ===============================
    getMapData: async (req, res) => {
        try {
            const [farms] = await pool.execute(`
                SELECT 
                    cf.farm_id,
                    cf.farm_name,
                    cf.latitude,
                    cf.longitude,
                    cf.area_size,
                    cf.district,
                    fo.fullname AS owner_name,
                    fo.status AS owner_status
                FROM coffee_farm cf
                JOIN farm_owner fo ON cf.owner_id = fo.owner_id
                WHERE cf.latitude IS NOT NULL
                  AND cf.longitude IS NOT NULL
            `);

            res.json({ success: true, data: farms });
        } catch (error) {
            console.error('Map error:', error);
            res.status(500).json({ error: 'ดึงข้อมูลแผนที่ไม่สำเร็จ' });
        }
    }
};

module.exports = statisticsController;
