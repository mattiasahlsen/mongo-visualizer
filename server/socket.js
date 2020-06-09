const MongoClient = require('mongodb').MongoClient
const { log, logErr } = require('./logger')

const listen = socket => {
  socket.on('connectMongo', async (uri, ack) => {
    try {
      if (!uri) return
      console.log(uri)
      const client = new MongoClient(uri, { useNewUrlParser: true })
      console.log(client)
      await client.connect()

      const admin = client.db().admin()
      const dbs = await admin.listDatabases()
      ack(dbs)
      console.log(dbs)
    } catch (err) {
      socket.emit('error', err)
      logErr(err)
    }
  })

  socket.on('disconnect', reason => {
  })
}

module.exports = listen
