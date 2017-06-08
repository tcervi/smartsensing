const express = require('express')

module.exports = function(server){
  
  //API Routes
  const router = express.Router()
  
  // Toda  requisição de URL .../api será encaminhada para esse Router router
  server.use('/api', router)
  
  //const shedMonitorService = require('../api/shedMonitor/shedMonitorService')
  //shedMonitorService.register(router, '/shedMonitor')  
}