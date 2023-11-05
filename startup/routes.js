const user = require('../routes/user')
const auth = require('../routes/auth')
const profile = require('../routes/profile')

function routerConfig(app) {
    app.use('/api/user', user)
    app.use('/api/auth', auth)
    app.use('/api/profile', profile)
}

module.exports = routerConfig