//get numbers so far
exports.getNumbers = function(req, res) {
  let sql = `SELECT val FROM numbers`;
  res.app.get('connection').query(sql, function(err, data, fields) {
    if (err) {
        console.log('list numbers error');
        throw err;
    };
    res.json({
      status: 200,
      data,
      message: "Numbers retrieved successfully"
    })
  })
};

//add another number
exports.addNumber = function(req, res) {
  let sql = `INSERT INTO numbers(val) VALUES (?)`;
  console.log(req.body);
  console.log(JSON.stringify(req.body));
  req.app.get('connection').query(sql, [req.body.val], function(err, data, fields) {
    if (err) 
    { 
        console.log('insert numbers error');
        throw err;
    }
    res.json({
      status: 200,
      message: "Number inserted successfully"
    })
  })
};