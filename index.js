require('dotenv').config()
const cors = require('cors')
const express = require('express')

const app = express();

const PORT = process.env.port || 4000

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
