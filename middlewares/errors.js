function error_handler(error, request, response, next) {
    response.status(500).json({ error: "Server Error" })
    next(error);
}

module.exports = error_handler