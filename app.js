const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys') 
const userAuth = require('./routes/api/userAuth')

// Initialize the app
const app = express()

app.use(passport.initialize())
require('./config/passport')(passport)

// Add body parser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
) 
app.use(bodyParser.json())

// Establish a database connection 
const db = keys.mongoURI
mongoose.connect(
    db, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(res => {
    console.log('Database connected successfully!')
})
.catch(error => {
    console.log(error)
})

app.use('/api/userAuth/', userAuth)

// Start the server
const PORT = process.env.PORT || 5006
app.listen(PORT, () => {
    console.log(`App is listening on the port ${PORT}`)
})

module.exports = app 