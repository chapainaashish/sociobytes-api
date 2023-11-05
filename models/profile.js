const mongoose = require('mongoose')
const Joi = require('joi')

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, require: true, minlength: 1, maxlength: 255, trim: true },
    bio: { type: String, maxlength: 255 },
    phone: { type: String, maxlength: 255, trim: true },
    email: { type: String, minlength: 3, maxlength: 255, trim: true },
    facebook: { type: String, maxlength: 255, trim: true },
    instagram: { type: String, maxlength: 255, trim: true },
    tiktok: { type: String, maxlength: 255, trim: true },
    snapchat: { type: String, maxlength: 255, trim: true },
    twitter: { type: String, maxlength: 255, trim: true },
    linkedin: { type: String, maxlength: 255, trim: true },
    pinterest: { type: String, maxlength: 255, trim: true },
    github: { type: String, maxlength: 255, trim: true },
    youtube: { type: String, maxlength: 255, trim: true },
    whatsapp: { type: String, maxlength: 255, trim: true }
})

const Profile = new mongoose.model('Profile', profileSchema)

function validateProfile(profile) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255),
        bio: Joi.string().max(255),
        phone: Joi.string().max(255),
        email: Joi.string().email().max(255),
        facebook: Joi.string().max(255),
        instagram: Joi.string().max(255),
        tiktok: Joi.string().max(255),
        snapchat: Joi.string().max(255),
        twitter: Joi.string().max(255),
        linkedin: Joi.string().max(255),
        pinterest: Joi.string().max(255),
        github: Joi.string().max(255),
        youtube: Joi.string().max(255),
        whatsapp: Joi.string().max(255),
    })
    const validation = schema.validate(profile)
    if (validation.error) return validation
    return true
}

module.exports = { Profile, validateProfile }