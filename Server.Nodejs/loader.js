const server = require('./config/server')
require('./config/routes')(server)
const mqttReceiver = require('./config/mqttReceiver')

