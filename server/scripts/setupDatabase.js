const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

const DB_NAME = process.env.DB_NAME || 'fish_farm_db';

async function setupDatabase() {
  let connection;

  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);

    // Create database if it doesn't exist
    console.log(`Creating database ${DB_NAME}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await connection.query(`USE ${DB_NAME}`);

    // Create users table
    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create farm_settings table
    console.log('Creating farm_settings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS farm_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        farm_name VARCHAR(255) DEFAULT 'Fish Farm Management',
        logo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_settings (user_id)
      )
    `);

    // Create batches table
    console.log('Creating batches table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        batch_id VARCHAR(255) NOT NULL,
        section VARCHAR(100) NOT NULL,
        species VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        start_date DATE,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create hatchery_records table
    console.log('Creating hatchery_records table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hatchery_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE,
        species VARCHAR(255),
        eggs_count INT,
        hatching_rate DECIMAL(5,2),
        water_temp DECIMAL(5,2),
        ph_level DECIMAL(4,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create pre_grow_out_records table
    console.log('Creating pre_grow_out_records table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pre_grow_out_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE,
        batch_id VARCHAR(255),
        species VARCHAR(255),
        quantity INT,
        avg_weight DECIMAL(10,2),
        feed_amount DECIMAL(10,2),
        water_quality VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create grow_out_records table
    console.log('Creating grow_out_records table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS grow_out_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE,
        batch_id VARCHAR(255),
        species VARCHAR(255),
        quantity INT,
        avg_weight DECIMAL(10,2),
        feed_amount DECIMAL(10,2),
        mortality INT,
        water_temp DECIMAL(5,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create puddling_records table
    console.log('Creating puddling_records table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS puddling_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE,
        batch_id VARCHAR(255),
        species VARCHAR(255),
        quantity INT,
        pond_number VARCHAR(255),
        water_level DECIMAL(10,2),
        ph_level DECIMAL(4,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create quarantine_records table
    console.log('Creating quarantine_records table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quarantine_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE,
        batch_id VARCHAR(255),
        species VARCHAR(255),
        quantity INT,
        reason VARCHAR(255),
        health_status VARCHAR(255),
        treatment TEXT,
        quarantine_days INT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database setup completed successfully!');
    console.log(`Database: ${DB_NAME}`);
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - farm_settings');
    console.log('  - batches');
    console.log('  - hatchery_records');
    console.log('  - pre_grow_out_records');
    console.log('  - grow_out_records');
    console.log('  - puddling_records');
    console.log('  - quarantine_records');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
