const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const apiRoutes = require('./routes/api')

// connect to database
const mongoose = require('mongoose')
const { DB_URL, PORT, STRIPE_KEY } = require('./variables')

console.log("DB URL=", DB_URL)
console.log('PORT=', PORT)
console.log('STRIPE_KEY=', STRIPE_KEY)

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    
    app.use(cors({origin: '*'}))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended : true}))
    app.use('/api', apiRoutes)



    app.use('/', (req, res) => {
        res.send({"success": false, "message": 'catchall route'})
    })

    console.log('Connected to database successfully!')
}).catch(error => app.use('/', (req, res) => {
    console.log('Error connecting to database')
    res.send(error)
}))

app.listen(PORT)    
