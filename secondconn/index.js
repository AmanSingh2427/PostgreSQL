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

// Function to create the example_table2 in PostgreSQL
const createTable = async () => {
  try {
    const client = await pool.connect();
    const createQuery = `
      CREATE TABLE IF NOT EXISTS aman.example_table2 (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INTEGER,
        department VARCHAR(100),
        salary NUMERIC(10, 2),
        is_active BOOLEAN
      );
    `;
    await client.query(createQuery);
    console.log('example_table2 created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err.stack);
  }
};

// // Function to insert data into the table
// const insertData = async () => {
//   try {
//     const client = await pool.connect();
//     const insertQuery = `
//       INSERT INTO aman.example_table (name, age, department, salary, is_active)
//       VALUES ($1, $2, $3, $4, $5)
//       RETURNING *;
//     `;
//     const values = ['Devesh', 22, 'TERMS', 75000.00, true];
//     const res = await client.query(insertQuery, values);
//     console.log('Inserted Data:', res.rows[0]);
//     client.release();
//   } catch (err) {
//     console.error('Error inserting data:', err.stack);
//   }
// };

// Function to insert data into the database
const insertData = async () => {
    try {
      const client = await pool.connect();
      const insertQuery = `
      INSERT INTO aman.example_table2 (name, age, department, salary, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
      const values = ['Devesh', 22, 'TERMS', 75000.00, true];
      const res = await client.query(insertQuery, values);
      console.log('Inserted Data:', res.rows[0]);
      client.release();
    } catch (err) {
      console.error('Error inserting data:', err.stack);
    }
  };

// Function to update data in the table
const updateData = async () => {
  try {
    const client = await pool.connect();
    const updateQuery = `
      UPDATE example_table2
      SET salary = $1
      WHERE name = $2
      RETURNING *;
    `;
    const res = await client.query(updateQuery, [80000.00, 'Aman Singh']);
    console.log('Updated Data:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error updating data:', err.stack);
  }
};

// Function to delete data from the table
const deleteData = async () => {
  try {
    const client = await pool.connect();
    const deleteQuery = 'DELETE FROM example_table2 WHERE name = $1 RETURNING *';
    const res = await client.query(deleteQuery, ['Aman Singh']);
    console.log('Deleted Data:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error deleting data:', err.stack);
  }
};
const deleteTable = async () => {
    try {
      const client = await pool.connect();
      const deleteQuery = 'DROP TABLE IF EXISTS example_table2';
      await client.query(deleteQuery);
      console.log('example_table2 deleted successfully.');
      client.release();
    } catch (err) {
      console.error('Error deleting table:', err.stack);
    }
  };

// Function to fetch data from the table
const fetchData = async () => {
  try {
    const client = await pool.connect();
    const selectQuery = 'SELECT * FROM example_table2';
    const res = await client.query(selectQuery);
    console.log('Fetched Data:', res.rows);
    client.release();
  } catch (err) {
    console.error('Error fetching data:', err.stack);
  }
};

// Function to demonstrate the HAVING clause
const fetchWithHaving = async () => {
    try {
      const client = await pool.connect();
      const havingQuery = `
        SELECT department, COUNT(*) as count
        FROM example_table2
        GROUP BY department
        HAVING COUNT(*) > 1;
      `;
      const res = await client.query(havingQuery);
      console.log('Departments with more than 1 employee:', res.rows);
      client.release();
    } catch (err) {
      console.error('Error with HAVING clause:', err.stack);
    }
  };
  

// Execute the functions
const main = async () => {
  await createTable(); // Create the table if not exists
  await insertData(); // Fetch data from the table

//   await fetchData(); // Insert data into the table
//   await updateData(); // Fetch data from the table

//   await fetchData(); // Update data in the table
//   await deleteData(); // Delete data from the table
//   await fetchData(); // Fetch data from the table
    // await deleteTable(); // Delete the table
    // await fetchWithHaving();

  // End the pool to close all connections
  pool.end();
};

// Execute the main function
main();
