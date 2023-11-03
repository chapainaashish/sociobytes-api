const express = require('express')
const app = express()


require('./startup/db')();
require('./startup/routes')(app)


const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:3000`);
});
