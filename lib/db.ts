import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'admin_panel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
console.log(pool)
// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  const [results] = await pool.execute(sql, params);
  return results;
}
