const express = require('express')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const reqPromise = require('request-promise')
const path = require('path')

const app = express()

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

let searchObj = {}

app.use(express.static('public'))

app.post('/theaters', urlencodedParser, (req, res) => {
    console.log(req.body.zipcode)
    searchObj = { 
        zipcode: req.body.zipcode,
        date: req.body.date,
        radius: req.body.radius
    }
    res.sendFile(path.join(__dirname, 'public', 'theaters.html'))
})

app.get('/location', (req, res) => res.json(searchObj))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
