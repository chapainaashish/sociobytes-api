const jwt = require('jsonwebtoken')

function check_auth(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({ error: "Access Denied, No token provided" })
    try {
        const decoded_jwt_payload = jwt.verify(token, "thisprivatekeyshouldbeaddedinENVVAR")
        req.user = decoded_jwt_payload
        next()
    }
    catch (e) {
        res.status(400).json({ error: "Bad Request, Invalid token" })
    }
}



module.exports = check_auth