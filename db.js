const mongoose = require('mongoose')
require('dotenv').config()


const dbUrl = process.env.uriDb

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('connected', () => {
    console.log('Database connection successful')
})

db.on('error', (err) => {
    console.error('Database connection error:', err)
    process.exit(1) 
})

module.exports = db