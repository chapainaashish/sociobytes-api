const mongoose = require('mongoose')
const Joi = require('joi')
const passwordComplexity = require("joi-password-complexity");


const userSchema = new mongoose.Schema({
    username: { type: String, require: true, minlength: 1, maxlength: 255, trim: true, unique: true },
    email: { type: String, require: true, minlength: 3, maxlength: 255, trim: true, unique: true },
    password: { type: String, require: true, minlength: 8, maxlength: 255, trim: true }
})

const User = new mongoose.model('User', userSchema)

function validate(user) {
    const schema = Joi.object({
        username: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    })
    const complexityOptions = {
        min: 8,
        max: 255,
        numeric: 1,
        symbol: 1,
    };

    const validation = schema.validate(user);
    const passwordValidation = passwordComplexity(complexityOptions).validate(user.password);

    if (validation.error) return validation
    if (passwordValidation.error) return passwordValidation
    return true
}


module.exports = { User, validate }