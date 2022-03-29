const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const coordinates = require('parse-coords')
const { Base64 } = require('js-base64')
const { Octokit } = require('@octokit/rest')

const app = express()

const GITHUB_OWNER = 'myarcane'
const GITHUB_REPO = 'park-and-climb-06'
const JSON_PATH = 'crag-parking-06-83-geo-last.json'

const GITHUB_TOKEN = process.env.PARK_AND_CLIMB_GITHUB_TOKEN
const GITHUB_EMAIL = process.env.GITHUB_EMAIL

// setup http server
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.use(bodyParser.json({ limit: '800kb' }))
app.use('/static', express.static(path.join(__dirname, '../static')))
app.listen(process.env.PORT || 8080)

// serves the homepage
app.get('/', (req, res) => {
    readParkingsFromGithub(res)
})

// posts a new coordinate
app.post('/newgeo', (req, res) => {
    const { parking, geo, crags } = req.body
    const newGeo = coordinates(geo)

    if (newGeo && newGeo.lat && newGeo.lng) {
        writeParkingsToGithub({ parking, geo: newGeo, crags }, res)
    } else {
        res.status(500).send({ error: 'Can not convert these coordinates' })
    }
})

const readParkingsFromGithub = async (res) => {
    try {
        const octokit = new Octokit({
            auth: GITHUB_TOKEN,
        })

        const {
            data: { content },
        } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: JSON_PATH,
        })

        const cragParkingCoordinates = JSON.parse(Base64.decode(content))
        res.status(200).render('home', { coordinates: cragParkingCoordinates })
    } catch (error) {
        res.status(500).send({ error: 'Can not read parkings from github' })
    }
}

const writeParkingsToGithub = async (newParkingInfo, res) => {
    try {
        const octokit = new Octokit({
            auth: GITHUB_TOKEN,
        })

        const {
            data: { sha, content },
        } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: JSON_PATH,
        })

        const cragParkingCoordinates = JSON.parse(Base64.decode(content))
        cragParkingCoordinates.push(newParkingInfo)

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: JSON_PATH,
            sha,
            message: 'Update crags parking list programatically',
            content: Base64.encode(JSON.stringify(cragParkingCoordinates)),
            committer: {
                name: 'Octokit Bot',
                email: GITHUB_EMAIL,
            },
            author: {
                name: 'Octokit Bot',
                email: GITHUB_EMAIL,
            },
        })

        res.status(200).send('OK')
    } catch (err) {
        res.status(500).send({ error: 'Can not write new parking to github' })
    }
}
