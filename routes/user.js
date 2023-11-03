const { User, validatePost, validatePut } = require('../models/user')
const express = require('express')
const _ = require('lodash')
const router = express.Router()
router.use(express.json())



router.get('/', async (req, res) => {
    const user = await User.find({}, 'username email -_id').sort({ _id: -1 })
    return res.send(user)
})

router.post('/', async (req, res) => {
    const result = await validatePost(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    const user = new User(_.pick(req.body, ['username', 'email', 'password']))
    const createdUser = await user.save()
    return res.send(_.pick(createdUser, ['username', 'email']))
})

router.get('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    return res.send(_.pick(user, ['username', 'email']))
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    const result = await validatePut(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    const updateUser = await User.updateOne({ username: req.params.username }, { $set: req.body })
    res.send(updateUser)
})

router.delete('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    const deleteUser = await User.findOneAndDelete({ username: req.params.username })
    return res.send(_.pick(deleteUser, ['username', 'email']))
})

module.exports = router