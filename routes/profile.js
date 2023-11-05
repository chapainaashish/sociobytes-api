const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { User } = require('../models/user')
const { Profile, validateProfile } = require('../models/profile')
router.use(express.json())

router.get('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(404).json({ error: "User Not Found" })
    const profile = await Profile.findOne({ user: user._id })
    return res.send(profile)
})

router.put('/:username', auth, async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    const req_user_id = req.user._id
    if (req_user_id != user._id) return res.status(400).json({ error: "Bad request" })
    const result = await validateProfile(req.body)
    if (result.error) return res.status(400).json({ error: result.error.message })
    const profile = await Profile.updateOne({ user: req_user_id }, { $set: req.body })
    return res.send(profile)
})

module.exports = router