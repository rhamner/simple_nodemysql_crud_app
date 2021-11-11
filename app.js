const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql');
const async = require('async');
const port = process.env.PORT || 3000;
const dir = `${__dirname}/public/`;

//routes
const numberRouter = require('./routes/numbers');
app.use('/numbers', numberRouter);
app.get('/history', numberRouter.getNumbers);
app.post('/new', numberRouter.addNumber);

//starting the server
app.listen( port , () => console.log(`Server started, listening port: ${port}`));

//connect to your db
var db = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.MYSQL_DB
});

app.set('connection', db);

async.series(
    [
        function connect(callback) {
            db.connect(callback);
        },
        function create_db(callback) {
            db.query('CREATE DATABASE if not exists ' + process.env.MYSQL_DB, callback);
        },
        function use_db(callback) {
            db.query('USE ' + process.env.MYSQL_DB, callback);
        },
        function create_table(callback) {
            db.query('CREATE TABLE if not exists numbers (' +
                                'id int primary key auto_increment,' + 
                                'val int not null)', callback);
        }
    ], function (err, results) {
    if (err) {
      console.log('Exception initializing database.');
      throw err;
    } else {
      console.log('Database initialization complete.');
    }
  });

//send default page
app.get("/", (req, res) => {
    res.sendfile(dir + "index.html");
});