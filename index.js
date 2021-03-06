import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import routes from './routes/api'
import seedData from './seedData'
import config from './config'

const port = process.env.PORT || 4500
const app = express()

mongoose
    .connect(`${config.MONGO_URI}`, {
        useNewUrlParser: true
    }, (err, db) => {
        if (err) throw err
        console.log("We are connected!")

        db.collection('tutors').countDocuments((err, count) => {
            if (err) throw err
            if (count === 0) seedData()
        })
    })

mongoose.Promise = global.Promise

app.use(express.static('public'))

app.use(bodyParser.json())

app.use('/api', routes)

app.use((err, req, res, next) => {
    res.status(422).send({
        error: err.message
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})