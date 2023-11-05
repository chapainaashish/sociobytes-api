const { User } = require('../models/user')

async function is_auth(req, res, next) {
    const req_user_id = req.user._id
    if (!req_user_id) return res.status(400).json({ error: "Bad Request, Invalid token" })
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User Not Found" })
    if (req_user_id != user._id) return res.status(400).json({ error: "Bad Request" })
    next()
}

module.exports = is_auth