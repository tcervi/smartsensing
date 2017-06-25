const dbHandler = require('./../api/databaseHandler');
const async = require('async');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');
//var nonExistentSensors = []; //must delete sensor from array after creating it


client.on('connect', () => {
  client.subscribe('#');
  //Inform nodes that receiver is connected
})

client.on('message', (topic,message) => {
  console.log('Received message <%s> on topic <%s>', message, topic);
  var measure = parseFloat(message)/100;
  var array = topic.split('/');
  var code = array[0];
  var dataType = array[1];
  dbHandler.checkSensorExists("sensor", code, function(sensorExists) {
    if(sensorExists) {
      console.log("Adding measure <" + measure + "> on sensor with code <" + code +"> to database...");
      dbHandler.insertMeasureOnDB(code, dataType, measure, function() {});
    } else {
      console.log("Searching sensor with code <" + code +"> on nonregisteredsensor table...");
      dbHandler.checkSensorExists("nonregisteredsensor", code, function(sensorExists){
        if(!sensorExists){
          dbHandler.insertNonRegisteredSensor(code, function() {});
        }
      });
    }
  });
})
