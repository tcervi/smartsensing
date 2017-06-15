const dbHandler = require('./../api/databaseHandler');
const async = require('async');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  client.subscribe('#');
  //Inform nodes that receiver is connected
  //client.publish('shed/connected', 'true');
  //sendStateUpdate();
})

client.on('message', (topic,message) => {
  console.log('Received message <%s> on topic <%s>', message, topic);
  var array = topic.split('/'); //array[0] has the sensor code and array[1] the dataType
  dbHandler.checkSensorExists(array[0], function(sensorExists) {
    if(sensorExists) {
      console.log("Sensor com o code <" + array[0] + "> existe");
    } else {
      console.log("Sensor com o code <" + array[0] + "> NÃO existe");
    }
  });
  //handleTemperatureUpdate(topic, message);
  //handlePressureUpdate(topic, message);
  //handleStateUpdate(message);
})

function handleTemperatureUpdate(topic, message){
  console.log('Temperature is: %s', message);
  dbHandler.insert('"2017-06-07 23:57:23.555", 20.5','room1_sensor1_temperature', '(col1,col2)');
}

function handlePressureUpdate(topic, message){
  console.log('Pressure is: %s', message);
  dbHandler.insert('"2017-06-07 23:57:23.555", 20.5','room1_sensor1_pressure', '(col1,col2)');
}

function handleStateUpdate(message){
    console.log('State is: %s', message);
}

/*function topicToDB(topic){
  String result = topic - 'shed/';
  result = result.split('/').join('_');
  console.log(`topicToDB: ${result}`);
  return result;
}*/

