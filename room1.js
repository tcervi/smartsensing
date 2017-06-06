const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

var temperature = '13.4';
var pressure = '2.5';
var state = 'wake';

function publishTemperatureUpdate(temperature){
    client.publish('shed/room1/sensor1/temperature', temperature);
}

function publishPressureUpdate(pressure){
    client.publish('shed/room1/sensor1/pressure', pressure);
}

function publishStateUpdate(state){
    client.publish('shed/room1/sensor1/state', state);
}

function updateStatus(){
  if(state === 'wake'){
	console.log('Going sleep...');
    state = 'sleeping';
  }
  else if(state === 'sleeping'){
	console.log('Waking up...');
    state = 'wake';
  }
}

setTimeout(() => {
  console.log('Publishing current state %s ...', state);
  publishStateUpdate(state);
}, 2000);

setTimeout(() => {
  if(state === 'wake'){
	console.log('Publishing temperature %s ...', temperature);
    publishTemperatureUpdate(temperature);
  }  
}, 4000);

setTimeout(() => {
  if(state === 'wake'){
	console.log('Publishing pressure %s ...', pressure);
    publishPressureUpdate(pressure);
  }  
}, 8000);

setTimeout(() => {
  updateStatus();
}, 16000);

