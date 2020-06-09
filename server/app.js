const express = require('express')
const path = require('path')
const loggerMiddleware = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const config = require('./config')
const { log, logErr } = require('./logger')

const mongoController = require('./controllers/mongo')

const app = express()

const DEV = process.env.NODE_ENV === 'development'
const DIST = path.join(__dirname, '../../dist')

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))

app.use(cookieParser())

if (config.dev) {
  app.use(loggerMiddleware('dev'))
  app.use(cors({ credentials: true, origin: true }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



console.log(config.dev ?
  'Running in development mode' : 'Running in production mode')


// routes
app.use(express.static(DIST))
app.use('/', mongoController)

app.get('/api/ping', function(req, res) {
  res.status(200).send('pong!')
})

// treat 404 as index.html
app.get('*', (req, res) => {
  res.sendFile(DIST + '/index.html', err => {
    if (err) {
      return res.status(500).end()
    }
  })
})

app.use((req, res, next) => {
  res.status(404).end()
})

// error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if (DEV) console.log(err)
  logErr(err)
  return res.status(err.status || 500).end()
})

module.exports = app
