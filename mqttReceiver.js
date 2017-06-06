const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  client.subscribe('shed/room1/sensor1/temperature');
  client.subscribe('shed/room1/sensor1/pressure');
  client.subscribe('shed/room1/sensor1/state');
  //Inform nodes that receiver is connected
  //client.publish('shed/connected', 'true');
  //sendStateUpdate();
})

client.on('message', (topic,message) => {
  console.log('received message %s %s', topic , message);
  switch(topic){
    case 'shed/room1/sensor1/temperature':
      handleTemperatureUpdate(message);
    break;
    case 'shed/room1/sensor1/pressure':
      handlePressureUpdate(message);
    break;
    case 'shed/room1/sensor1/state':
      handleStateUpdate(message);
    break;
    default:
      console.log('No handler for topic %s', topic);
  }
})

function handleTemperatureUpdate(message){
    console.log('Temperature is: %s', message);
}

function handlePressureUpdate(message){
    console.log('Pressure is: %s', message);
}

function handleStateUpdate(message){
    console.log('State is: %s', message);
}

