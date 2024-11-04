const express = require('express');
const path = require('path');
const requireContext = require('require-context');
const config = require('../config/config');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => res.send(config.appWelcome));

if (!config.testing) {
    // do not expose all routes if running unit test
    try {
        const allRoutes = requireContext(path.join(__dirname, './modules'), true, /\.route\.js$/);
        allRoutes.keys().forEach((route) => {
            const curRoute = require('./modules/' + route);
            // console.log('map route into server ===> ', curRoute.prefix);
            if (!curRoute.prefix) {
                console.log(route);
            }
            router.use(curRoute.prefix, curRoute.routes);
        });
    } catch (error) {
        console.error('map route error => ', error);
    }
}

module.exports = router;
