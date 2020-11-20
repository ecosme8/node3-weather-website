const request = require('request')

const forecast = (latitude, longitude, callback) => {
    // query to coordinates: longitude, latitude
    const url = 'http://api.weatherstack.com/current?access_key=197bcae4d9823288eabf5893750780ab&query=' + latitude +',' + longitude + '&units=f'

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location forecast. Try another search.', undefined)
        } else {
            const weatherDescription = body.current.weather_descriptions[0]
            const degrees = body.current.temperature
            const feelsLike = body.current.feelslike
            const message = weatherDescription + '. It is currently ' + degrees + ' degrees out. It feels like ' + feelsLike + ' degress out.'

            // Return value
            callback(undefined, message)
        }
    })
}

module.exports = forecast