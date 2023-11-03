const { User, validate } = require('../models/user')
const express = require('express')
const _ = require('lodash')
const router = express.Router()
router.use(express.json())


router.get('/', async (req, res) => {
    const user = await User.find({}, 'username email -_id').sort({ _id: -1 })
    return res.send(user)
})

router.post('/', async (req, res) => {
    const result = validate(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    const user = new User(_.pick(req.body, ['username', 'email', 'password']))
    const createdUser = await user.save()
    return res.send(_.pick(createdUser, ['username', 'email']))
})

module.exports = router