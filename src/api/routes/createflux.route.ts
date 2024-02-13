const Myexpress = require('express')
// const Myexpress = require('../../server')
const router = Myexpress.Router()
const generateSummary = require('../controllers/generateSummary')

router.post('/createflux',generateSummary)

module.exports = router