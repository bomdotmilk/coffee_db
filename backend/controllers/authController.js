const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authController = {
    // ลงทะเบียนผู้ใช้
    register: async (req, res) => {
        console.log('📝 Register request received:', req.body);
        
        try {
            const { username, password, email, user_type, fullname, phone, address } = req.body;
            
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!username || !password || !email || !user_type) {
                console.log('❌ Missing required fields');
                return res.status(400).json({ 
                    success: false,
                    error: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
                });
            }
            
            // ตรวจสอบความยาวรหัสผ่าน
            if (password.length < 6) {
                console.log('❌ Password too short');
                return res.status(400).json({ 
                    success: false,
                    error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' 
                });
            }
            
            let tableName;
            let userField;
            let fields = [];
            let placeholders = [];
            let values = [];
            
            // กำหนดตารางและฟิลด์ตามประเภทผู้ใช้
            switch(user_type) {
                case 'general':
                    tableName = 'general_user';
                    userField = 'user_id';
                    fields = ['username', 'password', 'email'];
                    placeholders = ['?', '?', '?'];
                    values = [username];
                    break;
                case 'admin':
                    tableName = 'admin';
                    userField = 'admin_id';
                    fields = ['username', 'password', 'email', 'fullname', 'role'];
                    placeholders = ['?', '?', '?', '?', '?'];
                    values = [username];
                    break;
                case 'owner':
                    tableName = 'farm_owner';
                    userField = 'owner_id';
                    fields = ['username', 'password', 'email', 'fullname', 'phone', 'address', 'status'];
                    placeholders = ['?', '?', '?', '?', '?', '?', '?'];
                    values = [username];
                    break;
                default:
                    console.log('❌ Invalid user type:', user_type);
                    return res.status(400).json({ 
                        success: false,
                        error: 'ประเภทผู้ใช้ไม่ถูกต้อง' 
                    });
            }
            
            // ตรวจสอบว่ามี username นี้แล้วหรือไม่
            console.log(`🔍 Checking if username exists in ${tableName}`);
            const [existingUser] = await pool.execute(
                `SELECT * FROM ${tableName} WHERE username = ?`,
                [username]
            );
            
            if (existingUser.length > 0) {
                console.log('❌ Username already exists');
                return res.status(400).json({ 
                    success: false,
                    error: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' 
                });
            }
            
            // ตรวจสอบว่ามี email นี้แล้วหรือไม่
            const [existingEmail] = await pool.execute(
                `SELECT * FROM ${tableName} WHERE email = ?`,
                [email]
            );
            
            if (existingEmail.length > 0) {
                console.log('❌ Email already exists');
                return res.status(400).json({ 
                    success: false,
                    error: 'อีเมลนี้มีอยู่ในระบบแล้ว' 
                });
            }
            
            // Hash password
            console.log('🔐 Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // เตรียมข้อมูลสำหรับบันทึก
            if (user_type === 'general') {
                values = [username, hashedPassword, email];
            } else if (user_type === 'admin') {
                values = [username, hashedPassword, email, fullname || 'ผู้ดูแลระบบ', 'staff'];
            } else if (user_type === 'owner') {
                values = [username, hashedPassword, email, fullname || 'เจ้าของไร่', phone || '', address || '', 'pending'];
            }
            
            // บันทึกลงฐานข้อมูล
            const query = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
            console.log('💾 Executing query:', query);
            console.log('📊 With params:', values);
            
            const [result] = await pool.execute(query, values);
            
            console.log('✅ Registration successful, inserted ID:', result.insertId);
            
            // สร้าง JWT token สำหรับล็อกอินอัตโนมัติหลังลงทะเบียน
            const token = jwt.sign(
                {
                    id: result.insertId,
                    username: username,
                    type: user_type,
                    email: email,
                    ...(user_type === 'admin' && { role: 'staff' }),
                    ...(user_type === 'owner' && { 
                        fullname: fullname || 'เจ้าของไร่',
                        status: 'pending' 
                    })
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // ข้อมูลผู้ใช้ที่จะส่งกลับ
            const userData = {
                id: result.insertId,
                username: username,
                email: email,
                type: user_type,
                ...(user_type === 'admin' && { 
                    fullname: fullname || 'ผู้ดูแลระบบ',
                    role: 'staff' 
                }),
                ...(user_type === 'owner' && { 
                    fullname: fullname || 'เจ้าของไร่',
                    phone: phone || '',
                    address: address || '',
                    status: 'pending'
                })
            };
            
            res.status(201).json({ 
                success: true,
                message: 'ลงทะเบียนสำเร็จ!',
                token: token,
                user: userData
            });
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            console.error('❌ Error stack:', error.stack);
            res.status(500).json({ 
                success: false,
                error: 'เกิดข้อผิดพลาดในการลงทะเบียน: ' + error.message 
            });
        }
    },
    
    // เข้าสู่ระบบ
    login: async (req, res) => {
        console.log('🔑 Login request received:', req.body);
        
        try {
            const { username, password, user_type } = req.body;
            
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!username || !password || !user_type) {
                console.log('❌ Missing required fields');
                return res.status(400).json({ 
                    success: false,
                    error: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
                });
            }
            
            let tableName;
            let userField;
            
            switch(user_type) {
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
                    console.log('❌ Invalid user type:', user_type);
                    return res.status(400).json({ 
                        success: false,
                        error: 'ประเภทผู้ใช้ไม่ถูกต้อง' 
                    });
            }
            
            // ค้นหาผู้ใช้
            console.log(`🔍 Searching user in ${tableName}`);
            const [users] = await pool.execute(
                `SELECT * FROM ${tableName} WHERE username = ?`,
                [username]
            );
            
            console.log(`🔍 Found ${users.length} users`);
            
            if (users.length === 0) {
                console.log('❌ User not found');
                return res.status(401).json({ 
                    success: false,
                    error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
                });
            }
            
            const user = users[0];
            
            // ตรวจสอบรหัสผ่าน
            console.log('🔐 Comparing password...');
            
            // สำหรับการทดสอบ: ถ้ารหัสผ่านตรงกับ password123 ให้ผ่าน
            if (password === 'password123') {
                console.log('✅ Using test password');
            } else {
                // ตรวจสอบว่า user มี password หรือไม่
                if (!user.password) {
                    console.log('❌ No password stored for user');
                    return res.status(401).json({ 
                        success: false,
                        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
                    });
                }
                
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    console.log('❌ Password incorrect');
                    return res.status(401).json({ 
                        success: false,
                        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
                    });
                }
            }
            
            // สร้าง JWT token
            console.log('🎫 Creating JWT token...');
            const tokenPayload = {
                id: user[userField],
                username: user.username,
                type: user_type,
                email: user.email
            };
            
            // เพิ่มข้อมูลเพิ่มเติมตามประเภทผู้ใช้
            if (user_type === 'admin') {
                tokenPayload.fullname = user.fullname;
                tokenPayload.role = user.role || 'staff';
            } else if (user_type === 'owner') {
                tokenPayload.fullname = user.fullname;
                tokenPayload.phone = user.phone;
                tokenPayload.address = user.address;
                tokenPayload.status = user.status || 'pending';
            }
            
            const token = jwt.sign(
                tokenPayload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // ข้อมูลผู้ใช้ที่จะส่งกลับ
            const userData = {
                id: user[userField],
                username: user.username,
                email: user.email,
                type: user_type
            };
            
            // เพิ่มข้อมูลเพิ่มเติมตามประเภทผู้ใช้
            if (user_type === 'admin') {
                userData.fullname = user.fullname;
                userData.role = user.role || 'staff';
            } else if (user_type === 'owner') {
                userData.fullname = user.fullname;
                userData.phone = user.phone;
                userData.address = user.address;
                userData.status = user.status || 'pending';
            }
            
            console.log('✅ Login successful for user:', user.username);
            
            res.json({
                success: true,
                message: 'เข้าสู่ระบบสำเร็จ',
                token,
                user: userData
            });
            
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('❌ Error stack:', error.stack);
            res.status(500).json({ 
                success: false,
                error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message 
            });
        }
    }
};

module.exports = authController;