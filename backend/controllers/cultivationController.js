const pool = require('../config/database');

const cultivationController = {
    // เพิ่มข้อมูลวิธีการปลูก
    insertCultivation: async (req, res) => {
        try {
            const cultivationData = [
                [1, 1, 'ปลูกแบบขั้นบันไดตามแนวระดับ', 'ดินร่วนปนทรายภูเขา', 'ระบบน้ำหยดอัตโนมัติ', 'ปุ๋ยอินทรีย์จากมูลสัตว์', 'ตัดแต่งกิ่งปีละ 2 ครั้ง ควบคุมศัตรูพืชแบบชีวภาพ', 'เช้า 06:00-10:00 น.', 'ได้มาตรฐานออร์แกนิกส์'],
                [2, 3, 'ปลูกใต้ร่มเงาต้นไม้ใหญ่', 'ดินร่วนภูเขาไฟ', 'น้ำฝนธรรมชาติ', 'ปุ๋ยคอกจากใบไม้', 'ดูแลวัชพืชทุก 2 เดือน', 'ช่วงบ่าย 13:00-16:00 น.', 'ระบบวนเกษตร'],
                [3, 4, 'ปลูกแบบแถวในหุบเขา', 'ดินร่วนลุ่มน้ำ', 'ระบบสปริงเกอร์', 'ปุ๋ยอินทรีย์ผสม', 'ตัดแต่งทรงพุ่มปีละครั้ง', 'ตลอดวันตามความเหมาะสม', 'ควบคุมอุณหภูมิในหุบเขา'],
                [4, 5, 'ปลูกแบบขั้นบันได', 'ดินเหนียวปนทราย', 'น้ำจากแหล่งน้ำธรรมชาติ', 'ปุ๋ยชีวภาพ', 'ดูแลอย่างใกล้ชิดทุกสัปดาห์', 'เฉพาะช่วงเช้า', 'พื้นที่สูงระดับ 1,000 เมตร'],
                [5, 6, 'ปลูกริมแม่น้ำ', 'ดินร่วนปนทรายลุ่มน้ำ', 'ระบบน้ำจากแม่น้ำ', 'ปุ๋ยอินทรีย์และเคมี', 'ป้องกันน้ำท่วมและดูแลดิน', 'ตามระดับน้ำในแม่น้ำ', 'ได้ผลผลิตสม่ำเสมอ']
            ];

            const sql = `
                INSERT INTO cultivation_method
                (farm_id, coffee_id, planting_method, soil_type, water_system, fertilizer_type, maintenance, harvest_period, note)
                VALUES ?
                ON DUPLICATE KEY UPDATE
                planting_method = VALUES(planting_method),
                soil_type = VALUES(soil_type),
                water_system = VALUES(water_system),
                fertilizer_type = VALUES(fertilizer_type),
                maintenance = VALUES(maintenance),
                harvest_period = VALUES(harvest_period),
                note = VALUES(note)
            `;

            const [result] = await pool.query(sql, [cultivationData]);
            
            res.json({ 
                success: true,
                message: 'เพิ่ม/อัพเดทข้อมูลวิธีการปลูกสำเร็จ', 
                inserted: result.affectedRows 
            });
            
        } catch (error) {
            console.error('Insert cultivation error:', error);
            res.status(500).json({ 
                success: false,
                error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลวิธีการปลูก' 
            });
        }
    },

    // ดึงข้อมูลวิธีการปลูกทั้งหมด
    getAllCultivation: async (req, res) => {
        try {
            const [methods] = await pool.execute(`
                SELECT 
                    cm.*,
                    f.farm_name,
                    f.district,
                    ct.coffee_name
                FROM cultivation_method cm
                JOIN coffee_farm f ON cm.farm_id = f.farm_id
                JOIN coffee_type ct ON cm.coffee_id = ct.coffee_id
                ORDER BY cm.created_at DESC
            `);

            res.json({
                success: true,
                data: methods,
                count: methods.length
            });

        } catch (error) {
            console.error('Get all cultivation error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิธีการปลูก'
            });
        }
    },

    // ดึงข้อมูลวิธีการปลูกตาม farm_id
    getCultivationByFarmId: async (req, res) => {
        try {
            const { farmId } = req.params;
            
            const [methods] = await pool.execute(`
                SELECT 
                    cm.*,
                    f.farm_name,
                    ct.coffee_name
                FROM cultivation_method cm
                JOIN coffee_farm f ON cm.farm_id = f.farm_id
                JOIN coffee_type ct ON cm.coffee_id = ct.coffee_id
                WHERE cm.farm_id = ?
                ORDER BY cm.created_at DESC
            `, [farmId]);

            res.json({
                success: true,
                data: methods,
                count: methods.length
            });

        } catch (error) {
            console.error('Get cultivation by farm error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิธีการปลูก'
            });
        }
    },

    // ดึงข้อมูลวิธีการปลูกตาม coffee_id
    getCultivationByCoffeeId: async (req, res) => {
        try {
            const { coffeeId } = req.params;
            
            const [methods] = await pool.execute(`
                SELECT 
                    cm.*,
                    f.farm_name,
                    ct.coffee_name
                FROM cultivation_method cm
                JOIN coffee_farm f ON cm.farm_id = f.farm_id
                JOIN coffee_type ct ON cm.coffee_id = ct.coffee_id
                WHERE cm.coffee_id = ?
                ORDER BY cm.created_at DESC
            `, [coffeeId]);

            res.json({
                success: true,
                data: methods,
                count: methods.length
            });

        } catch (error) {
            console.error('Get cultivation by coffee error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิธีการปลูก'
            });
        }
    },

    // ดึงข้อมูลวิธีการปลูกโดยละเอียด
    getCultivationDetail: async (req, res) => {
        try {
            const { methodId } = req.params;
            
            const [methods] = await pool.execute(`
                SELECT 
                    cm.*,
                    f.farm_name,
                    f.district,
                    f.area_size,
                    ct.coffee_name,
                    ct.process_type,
                    ct.harvest_season
                FROM cultivation_method cm
                JOIN coffee_farm f ON cm.farm_id = f.farm_id
                JOIN coffee_type ct ON cm.coffee_id = ct.coffee_id
                WHERE cm.method_id = ?
            `, [methodId]);

            if (methods.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'ไม่พบข้อมูลวิธีการปลูก'
                });
            }

            res.json({
                success: true,
                data: methods[0]
            });

        } catch (error) {
            console.error('Get cultivation detail error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิธีการปลูก'
            });
        }
    },

    // อัพเดทข้อมูลวิธีการปลูก
    updateCultivation: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const fields = [];
            const values = [];
            
            Object.entries(updateData).forEach(([key, value]) => {
                if (value !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            });
            
            if (fields.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ไม่มีข้อมูลที่จะอัพเดท'
                });
            }
            
            values.push(id);
            
            await pool.execute(
                `UPDATE cultivation_method SET ${fields.join(', ')} WHERE method_id = ?`,
                values
            );
            
            res.json({
                success: true,
                message: 'อัพเดทข้อมูลวิธีการปลูกสำเร็จ'
            });

        } catch (error) {
            console.error('Update cultivation error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูลวิธีการปลูก'
            });
        }
    },

    // ลบข้อมูลวิธีการปลูก
    deleteCultivation: async (req, res) => {
        try {
            const { id } = req.params;
            
            await pool.execute('DELETE FROM cultivation_method WHERE method_id = ?', [id]);
            
            res.json({
                success: true,
                message: 'ลบข้อมูลวิธีการปลูกสำเร็จ'
            });

        } catch (error) {
            console.error('Delete cultivation error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการลบข้อมูลวิธีการปลูก'
            });
        }
    }
};

module.exports = cultivationController;