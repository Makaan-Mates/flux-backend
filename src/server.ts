const express = require('express')
const app = express()
const { databaseConnection } = require('./config/database')

require('dotenv').config()
databaseConnection(process.env.URL, () => {
  console.log("mongodb connected....")
})

app.listen(4000, () => {
  console.log("server listening on 4000")
})
