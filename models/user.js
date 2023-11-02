const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, require: true, minlength: 1, maxlength: 255, trim: true },
    email: { type: String, require: true, minlength: 3, maxlength: 255, trim: true },
    password: { type: String, require: true, minlength: 8, maxlength: 255, trim: true }
})

const User = new mongoose.model('User', userSchema)

function validateUser(user) {

}
