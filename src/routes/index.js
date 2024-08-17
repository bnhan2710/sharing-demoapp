const apiRoute = require('./api/index')
const viewRoute = require('./view/index')
module.exports = (app) => {
    app.use('/api',apiRoute)
    app.use('/', viewRoute)
}   