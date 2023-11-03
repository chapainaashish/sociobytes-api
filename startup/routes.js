const user = require('../routes/user')
const auth = require('../routes/auth')

function routerConfig(app) {
    app.use('/api/user', user)
    app.use('/api/auth', auth)
}

module.exports = routerConfig