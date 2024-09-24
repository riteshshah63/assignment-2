//Import mysql2 module
const mysql = require('mysql2');

//Connection to the database using MySQL information.
const connection = mysql.createConnection({
  host: 'localhost',              //Database host
  user: 'root',                   //Root User
  password: 'Ritesh@2024',        //Root Password
  database: 'Crowdfunding_db'     //Database Name
});

connection.connect((err) => {
  if (err) throw err;       //Any error, throw it
  console.log('Connected to the crowdfunding_db database!'); //Success message
});

// Example query to test the connection
connection.query('SELECT * FROM FUNDRAISER', (err, results) => {
  if (err) throw err; //Fail Query , throw it.
  console.log(results); //log querry results to the console
});

//close connection to database
connection.end();
