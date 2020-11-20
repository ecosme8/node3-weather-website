const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Eric Cosme'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Eric Cosme'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in felis vel sapien convallis posuere. Proin vitae massa non quam cursus dapibus non nec diam.',
        title: 'Help',
        name: 'Eric Cosme'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { location, latitude, longitude } = {}) => {
        if (error) {
            return res.send({ error })
        }
        
    
        // latitude, longitude
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
    
            console.log(forecastData)
            res.send({
                forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

// Experiment with query string
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    res.send({
        products: []
    })
})

// Match any page that has not been matched so far with help
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Not found',
        message: 'Help article not found',
        name: 'Eric Cosme'
    })
})

// Add 404 page
// * wild card means match anything that has not been found, put it last
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Not found',
        message: 'Page not found',
        name: 'Eric Cosme'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})