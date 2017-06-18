const async = require('async')
const sqlite3 = require('sqlite3').verbose();
const dbName = "dataBaseSS";

this.checkSensorExists = function(code, callback){
  var db = new sqlite3.Database(dbName);
  db.get("SELECT count(*) FROM sensor WHERE code=?", [code], function(err, search){
    db.close();
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
    }
    return callback(sensorExists);
  });
}

this.deleteSensorFromNonRegisteredOnDB = function(code, callback){
  var db = new sqlite3.Database(dbName);
  db.get("DELETE FROM nonRegisteredSensor WHERE code=?", [code], function(err){
    db.close();
    if(err) {
      console.log("Error while doing query on function deleteSensorFromNonRegisteredOnDB: " + err);
    } else {
      console.log("Sensor with code <" + code + "> was deleted from the non-registered sensor table!!!");
    }
    callback();
  });
}

this.insertSensorOnDB = function(code, sensorDescription, room, callback){
  var db = new sqlite3.Database(dbName);
  db.get("INSERT INTO sensor SELECT NULL, ?, ?, roomID FROM room WHERE name=?", [code, sensorDescription, room], function(err){
    db.close();
    if(err) {
      console.log("Error while doing query on function insertSensorOnDB: " + err);
    } else {
      console.log("Sensor with code <" + code + "> was added to the sensor table!!!");
    }
    callback();
  });
}

this.insertRoomOnDB = function(room, roomDescription, shed, callback){
  var db = new sqlite3.Database(dbName);
  db.get("INSERT INTO room SELECT NULL, ?, ?, shedID FROM shed WHERE name=?", [room, roomDescription, shed], function(err){
    db.close();
    if(err) {
      console.log("Error while doing query on function insertRoomOnDB: " + err);
    } else {
      console.log("Room with name '" + room + "' and description '" + roomDescription + "' was added to the room table!!!");
    }
    callback();
  });
}

this.insertShedOnDB = function(shed, shedDescription, callback){
  var db = new sqlite3.Database(dbName);
  db.get("INSERT INTO shed VALUES (NULL, ?, ?)", [shed, shedDescription], function(err){
    db.close();
    if(err) {
      console.log("Error while doing query on function insertShedOnDB: " + err);
    } else {
      console.log("Shed with name '" + shed + "' and description '" + shedDescription + "' was added to the shed table!!!");
    }
    callback();
  });
}

this.insertMeasureOnDB = function(code, dataType, measure, callback){
  var db = new sqlite3.Database(dbName);
  db.get("INSERT INTO measure SELECT NULL, ?, (SELECT dateTime('now', 'localtime')), sensorID, (SELECT dataTypeID FROM dataType WHERE name =?) FROM sensor WHERE code=?", [measure, dataType, code], function(err){
    db.close();
    if(err) {
      console.log("Error while doing query on function insertMeasureOnDB: " + err);
    } else {
      console.log("Measure <" + measure + "> with data type <" + dataType + "> was inserted successfully on sensor with code <" + code + ">!!!");
    }
    callback();
  });
}

this.insertNonRegisteredSensor = function(code, callback){
  var db = new sqlite3.Database(dbName);
  db.get("INSERT INTO nonRegisteredSensor VALUES (NULL, ?, (SELECT dateTime('now', 'localtime')))", [code], function(err){
    db.close();
    if(err) {
      console.log("Error while doing query on function insertMeasureOnDB: " + err);
    } else {
      console.log("Sensor with code <" + code + "> was inserted to the non-registered sensor table!!!");
    }
    callback();
  });
}

this.getAllTableInfoOnDB = function(table, callback){
  var db = new sqlite3.Database(dbName);
  db.all(`SELECT * FROM ${table}`, function(err, rows){
    db.close();
    if(err) {
      console.log("Error while doing query on function getAllTableInfoOnDB with table '"+ table +"': " + err);
    }
    callback(rows);
  });
}

this.getAllMeasuresOnDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT measureID, data, timeLog, sensor.code, dataType.name FROM measure INNER JOIN sensor ON sensor.sensorID=measure.sensorID INNER JOIN dataType ON measure.dataTypeID=dataType.dataTypeID", function(err, rows){
    db.close();
    if(err) {
      console.log("Error while doing query on function getAllMeasuresOnDB: " + err);
    }
    callback(rows);
  });
}

this.getMeasuresFilteredByDateOnDB = function(code, initialDate, finalDate, callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT measureID, data, timeLog, dataType.name FROM measure INNER JOIN sensor ON sensor.code=? INNER JOIN dataType ON measure.dataTypeID=dataType.dataTypeID WHERE timeLog BETWEEN ? AND ?", [code, initialDate, finalDate], function(err, rows) {
    db.close();
    if(err) {
      console.log("Error while doing query on function getMeasuresFilteredByDateOnDB: " + err);
    }
    callback(rows);
  });
}

this.getAllSensorsOnDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT (a.code || '-' || b.name || '-' || c.name) FROM sensor a INNER JOIN room b ON a.roomID=b.roomID INNER JOIN shed c ON b.shedID=c.shedID", function(err, elements){
    db.close();
    if(err) {
      console.log("Error while doing query on function getAllSensorsOnDB: " + err);
    } else {
      var sensors = [];
      elements.forEach(function(element){
        sensors.push(element[Object.keys(element)[0]]);
      });
    }
    callback(sensors);
  });
}

this.getAllRoomsOnDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT  (a.name || '-' || b.name) FROM room a INNER JOIN shed b ON a.shedID=b.shedID", function(err, elements){
      db.close();
    if(err) {
      console.log("Error while doing query on function getAllRoomsOnDB: " + err);
    } else {
      var rooms = [];
      elements.forEach(function(element){
        rooms.push(element[Object.keys(element)[0]]);
      });
    }
    callback(rooms);
  });
}

this.getAllShedsOnDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT name FROM shed", function(err, elements){
    db.close();
    if(err) {
      console.log("Error while doing query on function getAllShedsOnDB: " + err);
    } else {
      var sheds = [];
      elements.forEach(function(element){
        sheds.push(element[Object.keys(element)[0]]);
      });
    }
    callback(sheds);
  });
}

this.getAllNonRegisteredSensorsOnDB = function(callback){
  var db = new sqlite3.Database(dbName);
  db.all("SELECT (code || '-' || '\"' || timeReport || '\"') FROM nonRegisteredSensor", function(err, elements){
    db.close();
    if(err) {
      console.log("Error while doing query on function getAllNonRegisteredSensorsOnDB: " + err);
    } else {
      var nonRegisteredSensor = [];
      elements.forEach(function(element){
        nonRegisteredSensor.push(element[Object.keys(element)[0]]);
      });
    }
    callback(nonRegisteredSensor);
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
