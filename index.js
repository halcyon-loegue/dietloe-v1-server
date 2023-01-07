require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const app = express();

const PORT = process.env.port || 4000

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use(express.json())
app.use(bodyParser.json({ limit:'50mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb',
    parameterLimit: 50000
}));
app.use('/api/auth', require('./router/auth'))
app.use('/api/user', require('./router/user'))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
