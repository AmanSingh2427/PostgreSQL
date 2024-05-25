const insertData = async () => {
    try {
      const client = await pool.connect();
      
      const insertQuery = `
        INSERT INTO example_table (name, age, birthdate, is_active, balance, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      
      const values = ['John Doe', 28, '1995-05-01', true, 5000.00, '{"department": "IT"}'];
      
      const res = await client.query(insertQuery, values);
      console.log('Inserted Data:', res.rows[0]);
      
      client.release();
    } catch (err) {
      console.error('Error inserting data:', err.stack);
    }
  };
  
  insertData();
  