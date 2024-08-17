const viewRoute = require('./view.route');
const apiRoute = require('./api/index')
module.exports = (app) => {
    app.use('/v1', viewRoute);
    app.use('/v1/api',apiRoute)
}   