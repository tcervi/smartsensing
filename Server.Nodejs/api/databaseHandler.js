const async = require('async')
const sqlite3 = require('sqlite3').verbose();
const dbName = "dataBaseSS";

this.checkSensorExists = function(code, callback){
  var db = new sqlite3.Database(dbName);
  db.get("SELECT count(*) FROM sensor WHERE code=?", [code], function(err, search){
    if(err) {
      console.log("Error while doing query on function checkSensorExists: " + err);
    } else {
      var sensorExists = false;
      var qtdeElements = search[Object.keys(search)[0]];
      if(qtdeElements > 0) {
        sensorExists = true;
        console.log("There is a sensor with code <" + code + ">");
      } else {
        sensorExists = false;
        console.log("There isn't a sensor with code <" + code + ">");
      }
      db.close();
      return callback(sensorExists);
    }
  });
}

this.insertMeasureOnDB = function(code, dataType, measure, callback){
  var db = new sqlite3.Database(dbName);
  db.get("INSERT INTO measure SELECT NULL, ?, (SELECT dateTime('now', 'localtime')), sensorID, (SELECT dataTypeID FROM dataType WHERE name =?) FROM sensor WHERE code=?", [measure, dataType, code], function(err){
    if(err) {
      console.log("Error while doing query on function insertMeasureOnDB: " + err);
    } else {
      console.log("Measure <" + measure + "> with data type <" + dataType + "> was inserted successfully on sensor with code <" + code + ">!!!");
    }
      db.close();
      callback();
  });
}

this.showMeasuresOfDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT * FROM measure", function(err, rows){
    if(err) {
      console.log("Error while doing query on function showMeasuresOfDB: " + err);
    } else {
      rows.forEach(function(row){
        console.log(row);
      })
    }
      db.close();
      callback();
  });
}

this.getAllSensorsOnDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT (a.code || '-' || b.name || '-' || c.name) FROM sensor a INNER JOIN room b ON a.roomID=b.roomID INNER JOIN shed c ON b.shedID=c.shedID", function(err, elements){
    if(err) {
      console.log("Error while doing query on function getAllSensorsOnDB: " + err);
    } else {
      var sensors = [];
      elements.forEach(function(element){
        sensors.push(element[Object.keys(element)[0]]);
      });
    }
      db.close();
      callback(sensors);
  });
}

this.getLastMeasuresOnDB = function(code, limit, callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT (data || '/' || timeLog) FROM ( SELECT data,timeLog FROM measure INNER JOIN sensor ON sensor.sensorID=measure.sensorID WHERE sensor.code=? ORDER BY measure.timeLog DESC LIMIT ?) ORDER BY timeLog", [code, limit], function(err, elements){
    if(err) {
      console.log("Error while doing query on function getLastMeasuresOnDB: " + err);
    } else {
      var measures = [];
      var timeLogs = [];
      elements.forEach(function(element){
        measures.push(element[Object.keys(element)[0]].split('/')[0]);
        timeLogs.push(element[Object.keys(element)[0]].split('/')[1]);
      })
    }
      db.close();
      callback(measures, timeLogs);
  });
}
