const { Pool } = require('pg');

// Create a new pool instance with your database configuration
const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.6',
  database: 'php_training',
  password: 'mawai123',
  schema: 'aman',
  port: 5432, // Default port for PostgreSQL
});

// Function to test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connected to the database. Server Time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
  }
};

// Function to list tables in the aman schema
const listTables = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='aman'");
    console.log('Tables in the aman schema:', res.rows);
    client.release();
  } catch (err) {
    console.error('Error listing tables:', err.stack);
  }
};

// Function to insert data into the database
const insertData = async () => {
  try {
    const client = await pool.connect();
    const insertQuery = `
      INSERT INTO aman.example_table (name, age, birthdate, is_active, balance, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = ['Rahul Kumar', 27, '1997-10-27', true, 5000.00, '{"department": "TERMS"}'];
    const res = await client.query(insertQuery, values);
    console.log('Inserted Data:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error inserting data:', err.stack);
  }
};

// Function to fetch data from the database
const fetchData = async () => {
  try {
    const client = await pool.connect();
    const selectQuery = 'SELECT * FROM aman.example_table WHERE is_active = $1';
    const res = await client.query(selectQuery, [true]);
    console.log('Active Employees:', res.rows);
    client.release();
  } catch (err) {
    console.error('Error fetching data:', err.stack);
  }
};

// Function to update data in the database
const updateData = async () => {
  try {
    const client = await pool.connect();
    const updateQuery = `
      UPDATE aman.example_table
      SET balance = $1
      WHERE name = $2
      RETURNING *;
    `;
    const res = await client.query(updateQuery, [7500.00, 'Rahul Kumar']);
    if (res.rowCount > 0) {
      console.log('Updated Data:', res.rows[0]);
    } else {
      console.log('No rows were updated.');
    }
    client.release();
  } catch (err) {
    console.error('Error updating data:', err.stack);
  }
};


// Function to delete data from the database
const deleteData = async () => {
  try {
    const client = await pool.connect();
    const deleteQuery = 'DELETE FROM aman.example_table WHERE name = $1 RETURNING *';
    const res = await client.query(deleteQuery, ['Aman Singh']);
    console.log('Deleted Data:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error deleting data:', err.stack);
  }
};

// Execute the functions
const main = async () => {
  await testConnection(); // Test the database connection
  await listTables();
  // await insertData();
  // await fetchData();
  // await updateData();
  // await fetchData();
  // await deleteData();
  await fetchData();

  // End the pool to close all connections
  pool.end();
};

main();
