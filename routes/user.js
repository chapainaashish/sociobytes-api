const { User, validatePost, validatePut } = require('../models/user')
const { Profile } = require("../models/profile")
const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')
const auth_plus = require('../middlewares/auth_plus')
const router = express.Router()
router.use(express.json())

router.post('/', async (req, res) => {
    const result = await validatePost(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    const user = new User(_.pick(req.body, ['username', 'email', 'password']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.save()
    const profile = new Profile({ user: user._id, name: user.username })
    profile.save()
    const token = user.generateToken()
    return res.header('x-auth-token', token).send(_.pick(user, ['username', 'email']))
})

router.get('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    return res.send(_.pick(user, ['username', 'email']))
})

router.put('/:username', [auth, auth_plus], async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    const result = await validatePut(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    const updateUser = await User.updateOne({ username: req.params.username }, { $set: req.body })
    return res.send(updateUser)
})

router.delete('/:username', [auth, auth_plus], async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    const deleteUser = await User.findOneAndDelete({ username: req.params.username })
    const deleteProfile = await Profile.findOneAndDelete({ user: user._id })
    return res.send(_.pick(deleteUser, ['username', 'email']))
})

module.exports = router