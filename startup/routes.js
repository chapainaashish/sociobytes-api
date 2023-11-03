const user = require('../routes/user')

function routerConfig(app) {
    app.use('/api/user', user)
}

module.exports = routerConfig