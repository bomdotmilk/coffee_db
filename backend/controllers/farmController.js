// const farmController = {
//     // ดึงข้อมูลไร่กาแฟทั้งหมด
//     getAllFarms: async (req, res) => {
//         try {
//             const [farms] = await pool.execute(`
//                 SELECT 
//                     cf.*,
//                     fo.fullname as owner_name,
//                     fo.phone as owner_phone,
//                     fo.email as owner_email,
//                     fo.status as owner_status
//                 FROM coffee_farm cf
//                 LEFT JOIN farm_owner fo ON cf.owner_id = fo.owner_id
//                 ORDER BY cf.created_at DESC
//             `);
            
//             // ตรวจสอบว่า farms เป็น array
//             if (!Array.isArray(farms)) {
//                 console.warn('Farms data is not an array:', farms);
//                 return res.json({
//                     success: true,
//                     data: []
//                 });
//             }
            
//             res.json({
//                 success: true,
//                 data: farms,
//                 count: farms.length
//             });
            
//         } catch (error) {
//             console.error('Get all farms error:', error);
//             res.status(500).json({ 
//                 error: 'เกิดข้อผิดพลาดในการดึงข้อมูลไร่กาแฟ' 
//             });
//         }
//     },
    
//     // ดึงข้อมูลไร่กาแฟตาม ID
//     getFarmById: async (req, res) => {
//         try {
//             const { id } = req.params;
            
//             const [farms] = await pool.execute(`
//                 SELECT 
//                     cf.*,
//                     fo.fullname as owner_name,
//                     fo.phone as owner_phone,
//                     fo.email as owner_email,
//                     fo.address as owner_address,
//                     fo.status as owner_status
//                 FROM coffee_farm cf
//                 LEFT JOIN farm_owner fo ON cf.owner_id = fo.owner_id
//                 WHERE cf.farm_id = ?
//             `, [id]);
            
//             if (farms.length === 0) {
//                 return res.status(404).json({ 
//                     error: 'ไม่พบข้อมูลไร่กาแฟ' 
//                 });
//             }
            
//             const farm = farms[0];
            
//             // ดึงข้อมูลประเภทกาแฟ
//             const [coffeeTypes] = await pool.execute(
//                 'SELECT * FROM coffee_type WHERE farm_id = ?',
//                 [id]
//             );
            
//             // ดึงข้อมูลการผลิต
//             let productions = [];
//             if (coffeeTypes.length > 0) {
//                 const coffeeIds = coffeeTypes.map(c => c.coffee_id);
//                 const [productionData] = await pool.execute(
//                     `SELECT * FROM production WHERE coffee_id IN (${coffeeIds.join(',')})`
//                 );
//                 productions = productionData;
//             }
            
//             // ดึงข้อมูลสื่อ
//             const [media] = await pool.execute(
//                 'SELECT * FROM media WHERE ref_type = "farm" AND ref_id = ?',
//                 [id]
//             );
            
//             res.json({
//                 success: true,
//                 data: {
//                     ...farm,
//                     coffee_types: coffeeTypes,
//                     productions: productions,
//                     media: media
//                 }
//             });
            
//         } catch (error) {
//             console.error('Get farm by ID error:', error);
//             res.status(500).json({ 
//                 error: 'เกิดข้อผิดพลาดในการดึงข้อมูลไร่กาแฟ' 
//             });
//         }
//     },
    
//     // สร้างไร่กาแฟใหม่
//     createFarm: async (req, res) => {
//         try {
//             const {
//                 owner_id,
//                 farm_name,
//                 house_no,
//                 village,
//                 sub_district,
//                 district,
//                 postal_code,
//                 area_size,
//                 latitude,
//                 longitude,
//                 description
//             } = req.body;
            
//             // ตรวจสอบข้อมูลที่จำเป็น
//             if (!farm_name || !owner_id || !district) {
//                 return res.status(400).json({ 
//                     error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' 
//                 });
//             }
            
//             // ตรวจสอบว่า owner_id มีอยู่จริง
//             const [owners] = await pool.execute(
//                 'SELECT * FROM farm_owner WHERE owner_id = ?',
//                 [owner_id]
//             );
            
//             if (owners.length === 0) {
//                 return res.status(400).json({ 
//                     error: 'ไม่พบข้อมูลเจ้าของไร่' 
//                 });
//             }
            
//             // สร้างไร่กาแฟใหม่
//             const [result] = await pool.execute(
//                 `INSERT INTO coffee_farm 
//                 (owner_id, farm_name, house_no, village, sub_district, district, 
//                  postal_code, area_size, latitude, longitude, description)
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                 [
//                     owner_id,
//                     farm_name,
//                     house_no || '',
//                     village || '',
//                     sub_district || '',
//                     district,
//                     postal_code || '',
//                     area_size || 0,
//                     latitude || null,
//                     longitude || null,
//                     description || ''
//                 ]
//             );
            
//             res.status(201).json({
//                 success: true,
//                 message: 'สร้างไร่กาแฟสำเร็จ',
//                 farm_id: result.insertId
//             });
            
//         } catch (error) {
//             console.error('Create farm error:', error);
//             res.status(500).json({ 
//                 error: 'เกิดข้อผิดพลาดในการสร้างไร่กาแฟ' 
//             });
//         }
//     },
    
//     // อัปเดตข้อมูลไร่กาแฟ
//     updateFarm: async (req, res) => {
//         try {
//             const { id } = req.params;
//             const updateData = req.body;
            
//             // ตรวจสอบว่าไร่กาแฟมีอยู่จริง
//             const [farms] = await pool.execute(
//                 'SELECT * FROM coffee_farm WHERE farm_id = ?',
//                 [id]
//             );
            
//             if (farms.length === 0) {
//                 return res.status(404).json({ 
//                     error: 'ไม่พบข้อมูลไร่กาแฟ' 
//                 });
//             }
            
//             // สร้างคำสั่ง UPDATE
//             const updateFields = [];
//             const updateValues = [];
            
//             Object.entries(updateData).forEach(([key, value]) => {
//                 if (value !== undefined) {
//                     updateFields.push(`${key} = ?`);
//                     updateValues.push(value);
//                 }
//             });
            
//             if (updateFields.length === 0) {
//                 return res.status(400).json({ 
//                     error: 'ไม่มีข้อมูลที่จะอัปเดต' 
//                 });
//             }
            
//             updateValues.push(id);
            
//             await pool.execute(
//                 `UPDATE coffee_farm SET ${updateFields.join(', ')} WHERE farm_id = ?`,
//                 updateValues
//             );
            
//             res.json({
//                 success: true,
//                 message: 'อัปเดตข้อมูลสำเร็จ'
//             });
            
//         } catch (error) {
//             console.error('Update farm error:', error);
//             res.status(500).json({ 
//                 error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' 
//             });
//         }
//     },
    
//     // ลบไร่กาแฟ
//     deleteFarm: async (req, res) => {
//         try {
//             const { id } = req.params;
            
//             // ตรวจสอบว่าไร่กาแฟมีอยู่จริง
//             const [farms] = await pool.execute(
//                 'SELECT * FROM coffee_farm WHERE farm_id = ?',
//                 [id]
//             );
            
//             if (farms.length === 0) {
//                 return res.status(404).json({ 
//                     error: 'ไม่พบข้อมูลไร่กาแฟ' 
//                 });
//             }
            
//             // ลบไร่กาแฟ
//             await pool.execute('DELETE FROM coffee_farm WHERE farm_id = ?', [id]);
            
//             res.json({
//                 success: true,
//                 message: 'ลบข้อมูลไร่กาแฟสำเร็จ'
//             });
            
//         } catch (error) {
//             console.error('Delete farm error:', error);
//             res.status(500).json({ 
//                 error: 'เกิดข้อผิดพลาดในการลบข้อมูล' 
//             });
//         }
//     }
// };

// module.exports = farmController;

const pool = require('../config/database');

const farmController = {

    // =========================
    // ดึงข้อมูลไร่กาแฟทั้งหมด
    // =========================
    getAllFarms: async (req, res) => {
        try {
            const [farms] = await pool.execute(`
                SELECT 
                    cf.*,
                    fo.fullname AS owner_name,
                    fo.phone AS owner_phone,
                    fo.email AS owner_email,
                    fo.status AS owner_status
                FROM coffee_farm cf
                LEFT JOIN farm_owner fo ON cf.owner_id = fo.owner_id
                ORDER BY cf.created_at DESC
            `);

            res.json({
                success: true,
                count: farms.length,
                data: farms
            });

        } catch (error) {
            console.error('Get all farms error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลไร่กาแฟ'
            });
        }
    },

    // =========================
    // ดึงข้อมูลไร่กาแฟตาม ID
    // =========================
    getFarmById: async (req, res) => {
        try {
            const { id } = req.params;

            const [farms] = await pool.execute(`
                SELECT 
                    cf.*,
                    fo.fullname AS owner_name,
                    fo.phone AS owner_phone,
                    fo.email AS owner_email,
                    fo.address AS owner_address,
                    fo.status AS owner_status
                FROM coffee_farm cf
                LEFT JOIN farm_owner fo ON cf.owner_id = fo.owner_id
                WHERE cf.farm_id = ?
            `, [id]);

            if (farms.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'ไม่พบข้อมูลไร่กาแฟ'
                });
            }

            const farm = farms[0];

            // ประเภทกาแฟ
            const [coffeeTypes] = await pool.execute(
                'SELECT * FROM coffee_type WHERE farm_id = ?',
                [id]
            );

            // การผลิต (แก้ SQL Injection)
            let productions = [];
            if (coffeeTypes.length > 0) {
                const coffeeIds = coffeeTypes.map(c => c.coffee_id);
                const [productionData] = await pool.execute(
                    'SELECT * FROM production WHERE coffee_id IN (?)',
                    [coffeeIds]
                );
                productions = productionData;
            }

            // สื่อ
            const [media] = await pool.execute(
                'SELECT * FROM media WHERE ref_type = "farm" AND ref_id = ?',
                [id]
            );

            res.json({
                success: true,
                data: {
                    ...farm,
                    coffee_types: coffeeTypes,
                    productions,
                    media
                }
            });

        } catch (error) {
            console.error('Get farm by ID error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลไร่กาแฟ'
            });
        }
    },

    // =========================
    // สร้างไร่กาแฟใหม่
    // =========================
    createFarm: async (req, res) => {
        try {
            const {
                owner_id,
                farm_name,
                house_no = '',
                village = '',
                sub_district = '',
                district,
                postal_code = '',
                area_size = 0,
                latitude = null,
                longitude = null,
                description = ''
            } = req.body;

            if (!owner_id || !farm_name || !district) {
                return res.status(400).json({
                    success: false,
                    error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'
                });
            }

            const [owners] = await pool.execute(
                'SELECT owner_id FROM farm_owner WHERE owner_id = ?',
                [owner_id]
            );

            if (owners.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ไม่พบข้อมูลเจ้าของไร่'
                });
            }

            const [result] = await pool.execute(
                `INSERT INTO coffee_farm
                (owner_id, farm_name, house_no, village, sub_district, district,
                 postal_code, area_size, latitude, longitude, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    owner_id, farm_name, house_no, village, sub_district,
                    district, postal_code, area_size, latitude, longitude, description
                ]
            );

            res.status(201).json({
                success: true,
                message: 'สร้างสวนกาแฟสำเร็จ',
                farm_id: result.insertId
            });

        } catch (error) {
            console.error('Create farm error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการสร้างสวนกาแฟ'
            });
        }
    },

    // =========================
    // อัปเดตไร่กาแฟ
    // =========================
    updateFarm: async (req, res) => {
        try {
            const { id } = req.params;
            const allowedFields = [
                'farm_name', 'house_no', 'village', 'sub_district',
                'district', 'postal_code', 'area_size',
                'latitude', 'longitude', 'description'
            ];

            const updateFields = [];
            const updateValues = [];

            for (const key of allowedFields) {
                if (req.body[key] !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(req.body[key]);
                }
            }

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ไม่มีข้อมูลที่จะอัปเดต'
                });
            }

            updateValues.push(id);

            const [result] = await pool.execute(
                `UPDATE coffee_farm SET ${updateFields.join(', ')} WHERE farm_id = ?`,
                updateValues
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'ไม่พบข้อมูลสวนกาแฟ'
                });
            }

            res.json({
                success: true,
                message: 'อัปเดตข้อมูลสวนกาแฟสำเร็จ'
            });

        } catch (error) {
            console.error('Update farm error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
            });
        }
    },

    // =========================
    // ลบไร่กาแฟ
    // =========================
    deleteFarm: async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await pool.execute(
                'DELETE FROM coffee_farm WHERE farm_id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'ไม่พบข้อมูลสวนกาแฟ'
                });
            }

            res.json({
                success: true,
                message: 'ลบข้อมูลสวนกาแฟสำเร็จ'
            });

        } catch (error) {
            console.error('Delete farm error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการลบข้อมูล'
            });
        }
    }
};

module.exports = farmController;
