var express = require('express');
var router = express.Router();
const dbHandler = require('./../../api/databaseHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'SmartSensing'});
});

router.get('/configureMonitorSensor', function(req, res, next) {
  dbHandler.getAllSensorsOnDB(function(sensors) {
    res.render('configureMonitorSensor', {title: 'SmartSensing', sensors: sensors});
  });
});

router.post('/monitoring', function(req, res, next) {
  var sensor = req.body.sensor;
  array = sensor.split('-');
  var code = array[0];
  dbHandler.getLastMeasuresOnDB(code, 15, function(measures, timeLogs) {
    var timeLogsTxt = timeLogs.toString().split(',');
    res.render('monitoring', {title: 'SmartSensing', sensor: code, measures: measures, timeLogs: timeLogs});
  });
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
