

/* let mysql = require('mysql');
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
module.exports = pool; */


let mysql = require('mysql');
database = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'colegio',
    port: 8889
}
let connection = mysql.createConnection(database);
connection.connect((err) => {
    if (err) throw err;
    console.log(`-> DB connection status: ${connection.state}!`)
})

module.exports = connection;
