const { connect } = require("http2");
const mysql = require("mysql2");

let config =  { 
    host: "localhost",
    user: "student",
    password: "blackshima-01",
    database: "todolistDB"  
};

connection = mysql.createConnection(config).promise();

connection.query("SELECT 1")
.then(() => console.log("Connected to MySQL database"))
.catch((err) => console.error("Error connecting to MySQL database:", err)); 

module.exports = mysql.createConnection(config);
