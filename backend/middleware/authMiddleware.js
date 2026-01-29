const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                error: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' 
            });
        }
        
        // ตรวจสอบ token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ตรวจสอบว่าผู้ใช้ยังมีอยู่ในฐานข้อมูลหรือไม่
        let tableName;
        let userField;
        
        switch(decoded.type) {
            case 'general':
                tableName = 'general_user';
                userField = 'user_id';
                break;
            case 'admin':
                tableName = 'admin';
                userField = 'admin_id';
                break;
            case 'owner':
                tableName = 'farm_owner';
                userField = 'owner_id';
                break;
            default:
                return res.status(401).json({ 
                    error: 'ประเภทผู้ใช้ไม่ถูกต้อง' 
                });
        }
        
        const [users] = await pool.execute(
            `SELECT * FROM ${tableName} WHERE ${userField} = ?`,
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'ผู้ใช้ไม่พบในระบบ' 
            });
        }
        
        // เพิ่มข้อมูลผู้ใช้ใน request
        req.user = {
            ...decoded,
            dbRecord: users[0]
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Token ไม่ถูกต้อง' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่' 
            });
        }
        
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' 
        });
    }
};

module.exports = authMiddleware;