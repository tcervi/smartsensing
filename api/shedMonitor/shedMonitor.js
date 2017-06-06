const restful = require('node-restful')
const mongoose = restful.mongoose


const sensorMeasureSchema = new mongoose.Schema({
  name: { type: String, required: true},
  temperature: { type: Number, min:0, required: true},
  pressure: { type: Number, min:0, required: true},
  status: { type: String, required:false, uppercase: true,
		  enum:['ONLINE', 'OFFLINE']}                                          
})

const roomMeasureSchema = new mongoose.Schema({
  name: { type: String, required: true},
  sensors: [sensorMeasureSchema]
})

//Expondo o shedMeasureSchema para ser usado por requires em outros modulos
module.exports = restful.model('ShedMonitor', roomMeasureSchema)
