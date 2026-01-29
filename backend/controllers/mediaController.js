const pool = require('../config/database');

const mediaController = {
    // เพิ่มข้อมูลสื่อ
    insertMedia: async (req, res) => {
        try {
            const mediaData = [
                ['farm', 1, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop', 'image/jpeg'],
                ['farm', 2, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop', 'image/jpeg'],
                ['farm', 3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', 'image/jpeg'],
                ['farm', 4, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop', 'image/jpeg'],
                ['coffee', 1, 'https://images.unsplash.com/photo-1587734195657-d5d462384c3a?w=800&auto=format&fit=crop', 'image/jpeg'],
                ['coffee', 3, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop', 'image/jpeg']
            ];

            const sql = `
                INSERT INTO media (ref_type, ref_id, file_path, file_type)
                VALUES ?
                ON DUPLICATE KEY UPDATE
                file_path = VALUES(file_path),
                file_type = VALUES(file_type)
            `;

            const [result] = await pool.query(sql, [mediaData]);
            
            res.json({ 
                success: true,
                message: 'เพิ่ม/อัพเดทข้อมูลสื่อสำเร็จ', 
                inserted: result.affectedRows 
            });
            
        } catch (error) {
            console.error('Insert media error:', error);
            res.status(500).json({ 
                success: false,
                error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลสื่อ' 
            });
        }
    },

    // ดึงข้อมูลสื่อทั้งหมด
    getAllMedia: async (req, res) => {
        try {
            const [media] = await pool.execute(`
                SELECT 
                    m.*,
                    CASE m.ref_type
                        WHEN 'farm' THEN f.farm_name
                        WHEN 'coffee' THEN ct.coffee_name
                        ELSE 'Unknown'
                    END as ref_name,
                    CASE m.ref_type
                        WHEN 'farm' THEN f.district
                        WHEN 'coffee' THEN f2.district
                        ELSE ''
                    END as location
                FROM media m
                LEFT JOIN coffee_farm f ON m.ref_type = 'farm' AND m.ref_id = f.farm_id
                LEFT JOIN coffee_type ct ON m.ref_type = 'coffee' AND m.ref_id = ct.coffee_id
                LEFT JOIN coffee_farm f2 ON ct.farm_id = f2.farm_id
                ORDER BY m.created_at DESC
            `);

            res.json({
                success: true,
                data: media,
                count: media.length
            });

        } catch (error) {
            console.error('Get all media error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสื่อ'
            });
        }
    },

    // ดึงข้อมูลสื่อตาม farm_id
    getMediaByFarmId: async (req, res) => {
        try {
            const { farmId } = req.params;
            
            const [media] = await pool.execute(`
                SELECT 
                    m.*,
                    'farm' as ref_type,
                    f.farm_name as ref_name
                FROM media m
                JOIN coffee_farm f ON m.ref_id = f.farm_id
                WHERE m.ref_type = 'farm' AND m.ref_id = ?
                
                UNION ALL
                
                SELECT 
                    m.*,
                    'coffee' as ref_type,
                    ct.coffee_name as ref_name
                FROM media m
                JOIN coffee_type ct ON m.ref_id = ct.coffee_id
                JOIN coffee_farm f ON ct.farm_id = f.farm_id
                WHERE m.ref_type = 'coffee' AND f.farm_id = ?
                
                ORDER BY created_at DESC
            `, [farmId, farmId]);

            res.json({
                success: true,
                data: media,
                count: media.length
            });

        } catch (error) {
            console.error('Get media by farm error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสื่อ'
            });
        }
    },

    // ดึงข้อมูลสื่อตาม coffee_id
    getMediaByCoffeeId: async (req, res) => {
        try {
            const { coffeeId } = req.params;
            
            const [media] = await pool.execute(`
                SELECT 
                    m.*,
                    ct.coffee_name as ref_name
                FROM media m
                JOIN coffee_type ct ON m.ref_id = ct.coffee_id
                WHERE m.ref_type = 'coffee' AND m.ref_id = ?
                ORDER BY m.created_at DESC
            `, [coffeeId]);

            res.json({
                success: true,
                data: media,
                count: media.length
            });

        } catch (error) {
            console.error('Get media by coffee error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสื่อ'
            });
        }
    },

    // ลบข้อมูลสื่อ
    deleteMedia: async (req, res) => {
        try {
            const { id } = req.params;
            
            await pool.execute('DELETE FROM media WHERE media_id = ?', [id]);
            
            res.json({
                success: true,
                message: 'ลบข้อมูลสื่อสำเร็จ'
            });

        } catch (error) {
            console.error('Delete media error:', error);
            res.status(500).json({
                success: false,
                error: 'เกิดข้อผิดพลาดในการลบข้อมูลสื่อ'
            });
        }
    }
};

module.exports = mediaController;