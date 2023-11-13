const mongoose = require('mongoose')
const logger = require('./logger')

function connectDB() {
    mongoose.connect('mongodb://localhost/sociobytes_test')
        .then(() => logger.info("MongoDB Connected Successfully"))
        .catch((err) => logger.error(err.message, err))
}

module.exports = connectDB