const mysql = require("mysql2");

let config =  { 
    host: "localhost",
    user: "root",
    password: "root",
    database: "todolisDB"



    
};




module.exports = mysql.createConnection(config);

