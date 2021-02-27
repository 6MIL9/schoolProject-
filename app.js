const express = require('express')
const config = require('config')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require("multer");

const app = express()

app.use(express.json({ extended: true }))
app.use(cors());
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/report', require('./routes/reportRoute'))
app.use(express.static(__dirname));

const PORT = config.get('port') || 80

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()