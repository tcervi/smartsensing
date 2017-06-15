const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

var temperature = '13.4';
var pressure = '9000100';
var topic1 = "bd96/temperature"
var topic2 = "cc25/pressure"

function publish(topic, data){
    client.publish(topic, data);
}

console.log('Publishing <' + temperature + "> on topic <" + topic1 + ">");
publish(topic1, temperature);

console.log('Publishing <' + pressure + "> on topic <" + topic2 + ">");
publish(topic2, pressure);
