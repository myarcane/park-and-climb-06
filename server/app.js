const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const coordinates = require('parse-coords')

const app = express()

// setup http server
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.use(bodyParser.json({ limit: '800kb' }))
app.use('/static', express.static(path.join(__dirname, '../static')))
app.listen(process.env.PORT || 8080)

// serves the homepage
app.get('/', (req, res) => {
    const cragParkingCoordinates = JSON.parse(
        fs.readFileSync('crag-parking-06-geo.json')
    )
    res.status(200).render('home', { coordinates: cragParkingCoordinates })
})

// posts a new coordinate
app.post('/newgeo', (req, res) => {
    const { parking, geo, crags } = req.body
    const newGeo = coordinates(geo)

    if (newGeo && newGeo.lat && newGeo.lng) {
        const cragParkingCoordinates = JSON.parse(
            fs.readFileSync('crag-parking-06-geo.json')
        )
        cragParkingCoordinates.push({ parking, geo: newGeo, crags })

        fs.writeFile(
            'crag-parking-06-geo.json',
            JSON.stringify(cragParkingCoordinates),
            (err) => {
                if (err) {
                    response.status(500).send(err.message)
                }
                res.status(200).send('OK')
            }
        )
    } else {
        response
            .status(500)
            .send({ error: 'Can not convert these coordinates' })
    }
})
