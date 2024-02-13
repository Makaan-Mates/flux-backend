const express = require('express')
const app = express()
const { databaseConnection } = require('./config/database')
const cors = require('cors')
const createFluxRouter = require('./api/routes/createflux.route')

app.use(express.json());
app.use(cors())

require('dotenv').config()
databaseConnection(process.env.URL, () => {
  console.log("mongodb connected....")
})

app.use('/api',createFluxRouter)

app.listen(4000, () => {
  console.log("server listening on 4000")
})
