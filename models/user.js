const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const passwordComplexity = require("joi-password-complexity");


const userSchema = new mongoose.Schema({
    username: { type: String, require: true, minlength: 1, maxlength: 255, trim: true, unique: true },
    email: { type: String, require: true, minlength: 3, maxlength: 255, trim: true, unique: true },
    password: { type: String, require: true, minlength: 8, maxlength: 255, trim: true }
})

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY)
    return token
}

const User = new mongoose.model('User', userSchema)

const complexityOptions = {
    min: 8,
    max: 255,
};


async function validatePost(user) {
    const schema = Joi.object({
        username: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    })

    const validation = schema.validate(user);
    const passwordValidation = passwordComplexity(complexityOptions).validate(user.password);
    const userWithUsername = await User.findOne({ username: user.username });
    const userWithEmail = await User.findOne({ email: user.email });

    if (validation.error) return validation
    if (passwordValidation.error) return passwordValidation
    if (userWithUsername) return { error: { message: 'Username already exists' } };
    if (userWithEmail) return { error: { message: 'Email already exists' } };
    return true
}

async function validatePut(user) {
    const schema = Joi.object({
        username: Joi.string().min(1).max(255),
        email: Joi.string().min(3).max(255).email(),
        password: Joi.string().min(8).max(255)
    })

    const validation = schema.validate(user);
    const passwordValidation = passwordComplexity(complexityOptions).validate(user.password);
    if (validation.error) return validation
    if (passwordValidation.error) return passwordValidation

    if (user.username) {
        const userWithUsername = await User.findOne({ username: user.username });
        if (userWithUsername) return { error: { message: 'Username already exists' } };
    }

    if (user.email) {
        const userWithEmail = await User.findOne({ email: user.email });
        if (userWithEmail) return { error: { message: 'Email already exists' } };
    }

    return true
}




module.exports = { User, validatePost, validatePut }