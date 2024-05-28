const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.6',
    database: 'php_training',
    password: 'mawai123',
    port: 5432,
});

const createTable1 = async () => {
    try {
        const client = await pool.connect();
        const createQuery = `
            CREATE TABLE IF NOT EXISTS aman.employeejoin (
                emp_id VARCHAR(20),
                emp_name VARCHAR(100),
                salary INTEGER,
                dept_id VARCHAR(20),
                manager_id VARCHAR(20)
            );
        `;
        await client.query(createQuery);
        console.log('employeejoin created successfully.');
        client.release();
    } catch (err) {
        console.error('Error creating table:', err.stack);
    }
};
const fetchData1 = async () => {
    try {
        const client = await pool.connect();
        const selectQuery = 'SELECT * FROM aman.employeejoin';
        const res = await client.query(selectQuery);
        console.log('Fetched Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching data:', err.stack);
    }
};

const createTable2 = async () => {
    try {
        const client = await pool.connect();
        const createQuery = `
            CREATE TABLE IF NOT EXISTS aman.departmentjoin (
                dept_id VARCHAR(20),
                dept_name VARCHAR(20)
            );
        `;
        await client.query(createQuery);
        console.log('employeejoin created successfully.');
        client.release();
    } catch (err) {
        console.error('Error creating table:', err.stack);
    }
};

const fetchData2 = async () => {
    try {
        const client = await pool.connect();
        const selectQuery = 'SELECT * FROM aman.departmentjoin';
        const res = await client.query(selectQuery);
        console.log('Fetched Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching data:', err.stack);
    }
};

const createTable3 = async () => {
    try {
        const client = await pool.connect();
        const createQuery = `
            CREATE TABLE IF NOT EXISTS aman.managerjoin (
                manager_id VARCHAR(20),
                manager_name VARCHAR(20),
                dept_id VARCHAR(20)
            );
        `;
        await client.query(createQuery);
        console.log('employeejoin created successfully.');
        client.release();
    } catch (err) {
        console.error('Error creating table:', err.stack);
    }
};

const fetchData3 = async () => {
    try {
        const client = await pool.connect();
        const selectQuery = 'SELECT * FROM aman.managerjoin';
        const res = await client.query(selectQuery);
        console.log('Fetched Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching data:', err.stack);
    }
};

const createTable4 = async () => {
    try {
        const client = await pool.connect();
        const createQuery = `
            CREATE TABLE IF NOT EXISTS aman.projectsjoin (
                project_id VARCHAR(20),
                project_name VARCHAR(20),
                team_member_id VARCHAR(20)
            );
        `;
        await client.query(createQuery);
        console.log('employeejoin created successfully.');
        client.release();
    } catch (err) {
        console.error('Error creating table:', err.stack);
    }
};

const fetchData4 = async () => {
    try {
        const client = await pool.connect();
        const selectQuery = 'SELECT * FROM aman.projectsjoin';
        const res = await client.query(selectQuery);
        console.log('Fetched Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching data:', err.stack);
    }
};


// const insertData = async () => {
//     try {
//         const client = await pool.connect();
//         const insertQuery = `
//             INSERT INTO aman.projectsjoin (project_id,project_name,team_member_id)
//             VALUES ($1, $2, $3)
//             RETURNING *;
//         `;
//         const values = ['P1', 'Data Migration','E1'];
//         const res = await client.query(insertQuery, values);
//         console.log('Inserted Data:', res.rows[0]);
//         client.release();
//     } catch (err) {
//         console.error('Error inserting data:', err.stack);
//     }
// };
const fetchInnerJoinData = async () => {
    try {
        const client = await pool.connect();
        const joinQuery = `
            SELECT  e.emp_name,d.dept_name
            FROM aman.employeejoin e
            INNER JOIN aman.departmentjoin d
            ON e.dept_id = d.dept_id;
        `;
        const res = await client.query(joinQuery);
        console.log('Joined Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching joined data:', err.stack);
    }
};

const fetchLeftJoinData = async () => {
    try {
        const client = await pool.connect();
        const joinQuery = `
            select e.emp_name,d.dept_name from aman.employeejoin e left join aman.departmentjoin d on e.dept_id =d.dept_id ;
        `;
        const res = await client.query(joinQuery);
        console.log('Joined Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching joined data:', err.stack);
    }
};

const fetchRightJoinData = async () => {
    try {
        const client = await pool.connect();
        const joinQuery = `
        select e.manager_id, d.dept_name from aman.employeejoin e right join aman.departmentjoin d on e.dept_id =d.dept_id ;
        `;
        const res = await client.query(joinQuery);
        console.log('Joined Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching joined data:', err.stack);
    }
};

// --Fetch details of ALL emp, their manager, their department and the project they work on.

const fetchAllTableData = async () => {
    try {
        const client = await pool.connect();
        const joinQuery = `
        select e.emp_name,d.dept_name, m.manager_name, p.project_name 
        from aman.employeejoin e
        left join aman.departmentjoin d on e.dept_id =d.dept_id
        inner join aman.managerjoin m  on m.manager_id =e.manager_id
        left join aman.projectsjoin p on p.team_member_id =e.emp_id ; ;
        `;
        const res = await client.query(joinQuery);
        console.log('Joined Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching joined data:', err.stack);
    }
};

const fetchCrossJoinData = async () => {
    try {
        const client = await pool.connect();
        const joinQuery = `
            SELECT e.emp_id, e.emp_name, e.salary, e.dept_id AS emp_dept_id, e.manager_id, d.dept_id AS dept_dept_id, d.dept_name
            FROM aman.employeejoin e
            CROSS JOIN aman.departmentjoin d;
        `;
        const res = await client.query(joinQuery);
        console.log('Cross Joined Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching cross joined data:', err.stack);
    }
};

const fetchNaturalJoinData = async () => {
    try {
        const client = await pool.connect();
        const joinQuery = `
            SELECT *
            FROM aman.employeejoin
            NATURAL JOIN aman.departmentjoin;
        `;
        const res = await client.query(joinQuery);
        console.log('Natural Joined Data:', res.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching natural joined data:', err.stack);
    }
};

const main = async () => {
    // await createTable1();
    // await fetchData1();

    // await createTable2();
    // await fetchData2();

    // await createTable3();
    // await fetchData3();

    // await createTable4();
    // await fetchData4();

    // await fetchInnerJoinData();
    // await fetchLeftJoinData();
    // await fetchRightJoinData();
    // await fetchAllTableData();
    // await fetchCrossJoinData();
    await fetchNaturalJoinData();

    pool.end();
};

main();
