const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');
var sqlite3 = require('sqlite3').verbose();
var dbName = "shed_database";

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
      handleTemperatureUpdate(topic, message);
    break;
    case 'shed/room1/sensor1/pressure':
      handlePressureUpdate(topic, message);
    break;
    case 'shed/room1/sensor1/state':
      handleStateUpdate(message);
    break;
    default:
      console.log('No handler for topic %s', topic);
  }
})

function handleTemperatureUpdate(topic, message){
  console.log('Temperature is: %s', message);
  //putOnDB(topicToDB(topic));
  putOnDB('room1_sensor1_temperature');
}

function handlePressureUpdate(topic, message){
  console.log('Pressure is: %s', message);
  //putOnDB(topicToDB(topic));
  putOnDB('room1_sensor1_pressure');
}

function handleStateUpdate(message){
    console.log('State is: %s', message);
}

function putOnDB(table){
  var db = new sqlite3.Database(dbName);
  db.exec(`INSERT INTO ${table} (col1,col2) VALUES ("2017-06-07 23:57:23.555", 20.5)`);
  db.all(`SELECT col1, col2 FROM ${table}`, function(err, rows){
    rows.forEach(function(row){
      console.log(row.col1, row.col2);
    })
  })
  db.close();
}

/*function topicToDB(topic){
  String result = topic - 'shed/';
  result = result.split('/').join('_');
  console.log(`topicToDB: ${result}`);
  return result;
}*/

