require('dotenv').config()
const express = require('express')
const app = express()


require('./startup/db')();
require('./startup/routes')(app)


const PORT = process.env.PORT | 3000
const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = server

