const { User, validate } = require('../models/user')
const express = require('express')
const _ = require('lodash')
const router = express.Router()
router.use(express.json())

async function usernameOrEmailExists(username, email) {
    const userWithUsername = await User.findOne({ username: username });
    const userWithEmail = await User.findOne({ email: email });
    if (userWithUsername) return { exists: true, message: 'Username already exists' };
    if (userWithEmail) return { exists: true, message: 'Email already exists' };
    return { exists: false, message: 'Username and email available' };
}

router.get('/', async (req, res) => {
    const user = await User.find({}, 'username email -_id').sort({ _id: -1 })
    return res.send(user)
})

router.post('/', async (req, res) => {
    let result = validate(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    result = await usernameOrEmailExists(req.body.username, req.body.email)
    if (result.exists) return res.status(400).json({ error: result.message })
    const user = new User(_.pick(req.body, ['username', 'email', 'password']))
    const createdUser = await user.save()
    return res.send(_.pick(createdUser, ['username', 'email']))
})

module.exports = router