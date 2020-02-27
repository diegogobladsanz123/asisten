let mysql = require('mysql');
let { database } = require('./keys');
let pool = mysql.createPool(database);
const { promisify } = require('util');

pool.getConnection((err, con) => {
    if (err) throw err;
    console.log(`-> db state: ${con.state}!`);
    con.release();
    return;
})
pool.query = promisify(pool.query);
module.exports = pool;
