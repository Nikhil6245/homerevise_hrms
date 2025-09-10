import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT, 10) || 10,
  queueLimit: 0,
});

export default pool;

// Test DB connection at startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL (XAMPP) connected successfully.');
    conn.release();
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
})();