const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'profe_list',
  waitForConnections: true,
  connectionLimit: 10
});

async function initDB() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
  await conn.query('CREATE DATABASE IF NOT EXISTS profe_list');
  await conn.end();

  const db = await pool.getConnection();
  await db.query(`
    CREATE TABLE IF NOT EXISTS grupos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS alumnos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      grupo_id INT NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS asistencias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      alumno_id INT NOT NULL,
      fecha DATE NOT NULL,
      presente BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
      UNIQUE KEY unique_asistencia (alumno_id, fecha)
    )
  `);
  db.release();
}

module.exports = { pool, initDB };
