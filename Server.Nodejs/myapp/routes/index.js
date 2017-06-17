var express = require('express');
var router = express.Router();
const dbHandler = require('./../../api/databaseHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'SmartSensing'});
});

router.get('/configureMonitorSensor', function(req, res, next) {
  dbHandler.getAllSensorsOnDB(function(sensors) {
    var nMeasures = [5, 10, 15, 20, 25];
    res.render('configureMonitorSensor', {title: 'SmartSensing', sensors: sensors, nMeasures: nMeasures});
  });
});

router.post('/monitoring', function(req, res, next) {
  var maxValue = req.body.maxValue;
  var minValue = req.body.minValue;
  var nMeasures = parseInt(req.body.nMeasures);
  var sensor = req.body.sensor;
  array = sensor.split('-');
  var code = array[0];
  dbHandler.getLastMeasuresOnDB(code, nMeasures, function(measures, timeLogs) {
    res.render('monitoring', {title: 'SmartSensing', sensor: code, measures: measures, nMeasures: nMeasures, timeLogs: timeLogs, maxValue: maxValue, minValue: minValue});
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
