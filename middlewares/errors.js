const logger = require('../startup/logger')

function error_handler(err, req, res, next) {
    logger.error(err.message, err)
    res.status(500).json({ error: "Internal Server Error" })
    next(err);
}

module.exports = error_handler