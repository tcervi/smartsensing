const async = require('async')
const sqlite3 = require('sqlite3').verbose();
const dbName = "dataBaseSS";
//Array to hold Assync Tasks
var asyncTasks = [];


this.checkSensorExists = function(code, callback){
  var db = new sqlite3.Database(dbName);
  db.get("SELECT count(*) FROM sensor WHERE code=?", [code], function(err, search){
    if(err) {
      console.log("Error while doing query: " + err);
    } else {
      var sensorExists = false;
      var qtdeElements = search[Object.keys(search)[0]];
      if(qtdeElements > 0) {
        sensorExists = true;
        console.log("Achou elementos com o code: " + code);
      } else {
        sensorExists = false;
        console.log("Não achou elementos com o code: " + code);
      }
      db.close();
      return callback(sensorExists);
    }
  });
}

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
  var db = new sqlite3.Database(dbName);
  //It's not working already.
  async.parallel({
    result: queryRows(sel, table, db)
  },
  function(result){
	console.log(`Returning: ${result}`);
    db.close();
    return result;
  });
}

function queryRows(sel, table, db){
  return function(cb){
     var rows = [];
     db.exec(`SELECT ${sel} FROM ${table}`)
	   .on('row', function(r){
		 console.log(`Row: ${r}`);
	     rows.push(r)
	   })
	   .on('result', function(){
	     cb(rows)
	   })
  }
}
