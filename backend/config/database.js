const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('Database Configuration:');
console.log('- Host:', process.env.DB_HOST);
console.log('- User:', process.env.DB_USER);
console.log('- Database:', process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database successfully!');
        
        // Test query
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('✅ Test query result:', rows[0].result);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('❌ Error details:', error);
        return false;
    }
}

// Initialize connection
testConnection();

module.exports = pool;