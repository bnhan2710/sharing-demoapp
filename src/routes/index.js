const apiRoute = require('./api/index')
module.exports = (app) => {
    app.use('/api',apiRoute)
}   