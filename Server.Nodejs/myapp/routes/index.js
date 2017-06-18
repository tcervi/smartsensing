var express = require('express');
var router = express.Router();
const dbHandler = require('./../../api/databaseHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'SmartSensing'});
});

router.get('/checkDB', function(req, res, next) {
  dbHandler.getAllTableInfoOnDB("sensor", function(sensors) {
    dbHandler.getAllTableInfoOnDB("room", function(rooms) {
      dbHandler.getAllTableInfoOnDB("shed", function(sheds) {
        dbHandler.getAllTableInfoOnDB("dataType", function(dataTypes) {
          res.render('checkDB', {title: 'SmartSensing', sensors: sensors, rooms: rooms, sheds: sheds, dataTypes: dataTypes});
        });
      });
    });
  });
});

router.get('/configureMonitorSensor', function(req, res, next) {
  dbHandler.getAllSensorsOnDB(function(sensors) {
    var nMeasures = [5, 10, 15, 20, 25];
    res.render('configureMonitorSensor', {title: 'SmartSensing', sensors: sensors, nMeasures: nMeasures});
  });
});

router.post('/monitoring', function(req, res, next) {
  var nMeasures = parseInt(req.body.nMeasures);
  var code = req.body.sensor.split('-')[0];
  dbHandler.getLastMeasuresOnDB(code, nMeasures, function(measures, timeLogs) {
    res.render('monitoring', {title: 'SmartSensing', sensor: code, measures: measures, nMeasures: nMeasures, timeLogs: timeLogs, maxValue: req.body.maxValue, minValue: req.body.minValue});
  });
});

router.get('/setupDB', function(req, res, next) {
  dbHandler.getAllSensorsOnDB(function(sensors) {
    dbHandler.getAllRoomsOnDB(function(rooms) {
      dbHandler.getAllShedsOnDB(function(sheds) {
        dbHandler.getAllNonRegisteredSensorsOnDB(function(nonRegisteredSensors) {
          res.render('setupDB', {title: 'SmartSensing', sensors: sensors, rooms: rooms, sheds: sheds, nonRegisteredSensors: nonRegisteredSensors});
        });
      });
    });
  });
});

router.post('/insertSensor', function(req, res, next) {
  if((req.body.sensor != null) && (req.body.sensorRoom != null)){
    var code = req.body.sensor.split('-')[0];
    var room = req.body.sensorRoom.split('-')[0];
    dbHandler.insertSensorOnDB(code, req.body.sensorDescription, room, function() {
      dbHandler.deleteSensorFromNonRegisteredOnDB(code, function() {
        var msg = "Sensor with code <" + code + "> and description '" + req.body.sensorDescription + "' was successfully added to the Database!" ;
        res.render('successSetupDB', {title: 'SmartSensing', msg: msg});
      });
    });
  } else {
    res.redirect('/setupDB');
  }
});

router.post('/insertRoom', function(req, res, next) {
  if((req.body.room != '') && (req.body.roomShed != null)){
    dbHandler.insertRoomOnDB(req.body.room, req.body.roomDescription, req.body.roomShed, function() {
      var msg = "Room with name '" + req.body.room + "' and description '" + req.body.roomDescription + "' was successfully added to the Database!" ;
      res.render('successSetupDB', {title: 'SmartSensing', msg: msg});
    });
  } else {
    res.redirect('/setupDB');
  }
});

router.post('/insertShed', function(req, res, next) {
  if(req.body.shed != ''){
    dbHandler.insertShedOnDB(req.body.shed, req.body.shedDescription, function() {
      var msg = "Shed with name '" + req.body.shed + "' and description '" + req.body.shedDescription + "' was successfully added to the Database!" ;
      res.render('successSetupDB', {title: 'SmartSensing', msg: msg});
    });
  } else {
    res.redirect('/setupDB');
  }
});

router.get('/configureReport', function(req, res, next) {
  var hours = [];
  for (var i = 0; i <= 23; i++) {
     hours.push(i);
  }
  dbHandler.getAllSensorsOnDB(function(sensors) {
    res.render('configureReport', {title: 'SmartSensing', sensors: sensors, hours: hours});
  });
});

router.post('/report', function(req, res, next) {
  var sensor = req.body.sensor;
  var initialDate = req.body.initialDate;
  var initialHour = req.body.initialHour;
  var finalDate = req.body.finalDate;
  var finalHour = req.body.finalHour;
  res.send("Not implemented yet")
});

module.exports = router;
