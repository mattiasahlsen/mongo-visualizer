const express = require('express')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()


router.post('/connect', async (req, res, next) => {
  const connectionString = req.body.connectionString

  if (typeof connectionString !== 'string') {
    return res.status(400).send('Bad connection string')
  }

  try {
    const client = new MongoClient(connectionString, { useNewUrlParser: true })
    await client.connect()

    const admin = client.db().admin()
    const dbs = await admin.listDatabases()
    console.log(dbs)

    return res.send('Success')
  } catch (err) {
    return next(err)
  }
})

module.exports = router
