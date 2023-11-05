const user = require('../routes/user')
const auth = require('../routes/auth')
const profile = require('../routes/profile')
const error = require('../middlewares/errors')
require('express-async-errors');

function routerConfig(app) {
    app.use('/api/user', user)
    app.use('/api/auth', auth)
    app.use('/api/profile', profile)
    app.use(error)
}

module.exports = routerConfig