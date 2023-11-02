const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect('mongodb://localhost/sociobytes')
        .then(() => console.log("MongoDB Connected Successfully"))
        .catch((err) => console.error(err.message, err))
}

module.exports = connectDB