var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var dbName = "shed_database";
//Array to hold Assync Tasks
var asyncTasks = [];

this.putOnDB = function(table){
  var db = new sqlite3.Database(dbName);
  db.all(`SELECT col1, col2 FROM ${table}`, function(err, rows){
    rows.forEach(function(row){
      console.log(row.col1, row.col2);
    })
  })
  db.close();
}

this.insert = function(value, table, pos){
  var position = typeof pos !== 'undefined' ? pos:" ";
  var db = new sqlite3.Database(dbName);
  db.exec(`INSERT INTO ${table} ${position} VALUES (${value})`);
  db.close();
}

this.select = function(table, selection){
  var sel = typeof selection !== 'undefined' ? selection: "*";
  var result;
  var db = new sqlite3.Database(dbName);
  //Blocking DB query
  result = db.all(`SELECT ${sel} FROM ${table}`);  
  console.log(`${result}`);
  //It's not working already.
  /*result.forEach(function(row){
    console.log(row.col1, row.col2);
  })*/
  db.close();
  return result;
}