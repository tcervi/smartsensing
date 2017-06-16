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
  res.send("Not implemented yet")
});

router.get('/configureReport', function(req, res, next) {
  res.send("Not implemented yet")
  //res.render('configureReport', { title: 'SmartSensing', sheds: [1, 2, 3], rooms: ["A", "B", "C"], sensors: [1, 2, 3, 4], dataTypes: ["Temperature", "Pressure", "Humidity"]});
});

router.get('/dataRequested/:shed/:room/:sensor/:dataType', function(req, res, next) {
  res.render('dataRequested', {title: 'SmartSensing', shed: req.params.shed, room: req.params.room, sensor: req.params.sensor, dataType: req.params.dataType});
});

router.post('/dataRequested/submit/', function(req, res, next) {
  console.log(req.body)
  var shed = req.body.shed;
  var room = req.body.room;
  var sensor = req.body.sensor;
  var dataType = req.body.dataType;
  res.redirect('/dataRequested/' + shed + '/' + room + '/' + sensor + '/' + dataType);
});

module.exports = router;
