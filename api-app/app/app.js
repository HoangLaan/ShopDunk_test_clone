const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const config = require('../config/config');
const routes = require('./index.routes');
const pageNotFoundMiddleware = require('./middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware');
const useragent = require('express-useragent');
const express = require('express');
const path = require('path');
require('util').inspect.defaultOptions.depth = null;
// require("./common/helpers/mqtt.helper");

const mongo = require('./models/mongo');

const ev = require('express-validation');
ev.options({
    status: 422,
    statusText: 'Unprocessable Entity',
});

const init = app => {
    if (config.env === 'development') {
        app.use(logger('dev'));
    }
    // parse body params and attache them to req.body
    app.use(bodyParser.json({ limit: '500mb' }));
    app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    // parse information user agent
    app.use(useragent.express());
    //require('./swagger')(app);
    // Static file
    app.use(express.static(path.join(__dirname, '../storage'), { index: false }));

    // parse validation error nicely
    if (!config.testing) {
        app.use(require('./middlewares/checkToken.middleware'));
        app.use(require('./middlewares/validationError.middleware'));
    }

    // app.use((req, res, next) => {
    //     // don't count /metrics request
    //     if (req.path != '/api/metrics') {
    //         countRequest.inc({
    //             method: req.method,
    //             path: req.path
    //         });
    //     }
    //     next();
    // });

    // mount all routes on /api path
    app.use('/api', routes);

    // app.get('/api/metrics', async (req, res) => {
    //     res.setHeader('Content-Type', register.contentType);
    //     res.end(await register.metrics());
    // })

    // catch 404 and forward to error handler
    app.use(pageNotFoundMiddleware());

    // error handler
    app.use(errorHandlerMiddleware());

    if (config.runLocal) {
        app.listen(config.port, () => {
            //mongo.connect();
            console.info(`API server started on port ${config.port} (${config.env})`);
        });
    }

    console.log('Finished initialize app.');
    return app;
};

module.exports = init;
