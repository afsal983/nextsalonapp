// lib/mysql.ts
import { createPool } from "mysql2/promise";

// Create a MySQL connection pool
const pool = createPool({
  host: process.env.DB_HOST, // Your MySQL host
  user: process.env.DB_USER, // Your MySQL user
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME, // Your database name
});

export default pool;
