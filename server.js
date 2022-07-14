
const express = require('express')
const pool = require('./db')
const cors = require('cors')
const app = express()



app.use(cors())
app.use(express.json())


const PORT = 3001

app.use('/api/auth', require('./routes/jwtAuth'))
app.use('/api/admin', require('./routes/admin'))
// app.use('/api/test', require('./routes/test'))


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})



