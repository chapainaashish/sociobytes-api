const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const router = express.Router()
router.use(express.json())


router.post('/', async (req, res) => {
    const result = await validate(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })

    let user = await User.findOne({ 'email': req.body.email })
    if (!user) return res.status(400).json({ error: "Account doesn't exist with this email" })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({ error: "Password didn't match" })

    return res.send("Success")
})


async function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    })
    const result = schema.validate(user);
    if (result.error) return result
    return true
}

module.exports = router