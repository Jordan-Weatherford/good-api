const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const apiRoutes = require('./routes/api')
const { PORT } = require('./variables')


// connect to database
const mongoose = require('mongoose')
const DB_URL = require('./variables').DB_URL


mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended : true}))
    app.use(cors())
    app.use('/api', apiRoutes)
    app.use('/', (req, res) => {
        res.send('Goods API')
    })
    app.listen(PORT)    
})

