const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const apiRoutes = require('./routes/api')
const { PORT } = require('./variables')


// connect to database
const mongoose = require('mongoose')
const { DB_URL } = require('./variables')



const path = __dirname + '/build/'


mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.use(express.static(path))
    app.get('/', function (req,res) {
        res.sendFile(path + "index.html");
      });



    app.use(cors({origin: '*'}))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended : true}))
    app.use('/api', apiRoutes)
    app.use('/', (req, res) => {
        res.send("You shouldn't be here. Error!")
    })
    app.listen(PORT)    
})

