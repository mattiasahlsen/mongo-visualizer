const path = require('path')
const env = require('dotenv')

// simluate https://cli.vuejs.org/guide/mode-and-env.html#modes
// without vue-cli-service
// priority should be highest first, i.e. env.local is lowest priority
if (process.env.NODE_ENV === 'development') {
  env.config({ path: path.join(__dirname, '../.env.development.local') })
  env.config({ path: path.join(__dirname, '../.env.development') })
} else if (process.env.NODE_ENV === 'test') {
  env.config({ path: path.join(__dirname, '../.env.test.local') })
  env.config({ path: path.join(__dirname, '../.env.test') })
} else if (process.env.NODE_ENV === 'production') {
  env.config({ path: path.join(__dirname, '../.env.production.local') })
  env.config({ path: path.join(__dirname, '../.env.production') })
}
env.config({ path: path.join(__dirname, '../.env.local') })
env.config({ path: path.join(__dirname, '../.env') })


const DEV = process.env.NODE_ENV === 'development'

const conf = {
  dev: DEV,
  secret: process.env.SECRET,

  port: parseInt(process.env.PORT) || 3000,
}

module.exports = conf
