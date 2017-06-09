const port = 3005

//Parser das requisições do browser
const bodyParser = require('body-parser') 
const express = require('express')
const server = express()

//server.use => Middleware usado em todas as requisições
server.use(bodyParser.urlencoded({ extended : true}))
server.use(bodyParser.json())

server.listen(port, function(){
  console.log(`BACKEND is running on port ${port}.`)
})

module.exports = server