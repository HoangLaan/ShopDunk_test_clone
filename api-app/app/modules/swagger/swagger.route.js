const {swagger_json} = require('./swagger-v1.js');
const express = require('express');
const routes = express.Router();
//const swaggerJSDoc = require('swagger-jsdoc');;
const swaggerUi = require('swagger-ui-express');
const requireContext = require('require-context');
const path = require('path');
const prefix = '/swagger';

let swaggerJson = swagger_json(process.env.SWAGGER_PATH);

const swaggerFiles = requireContext(path.join(__dirname, '..'), true, /(?!swagger)\.swagger\.js$/);
swaggerFiles.keys().forEach(swaggerFile => {
    const swaggerJson_ = require('../' + swaggerFile);
    swaggerJson.tags.push(swaggerJson_.tags);
    swaggerJson.paths = {...swaggerJson.paths, ...swaggerJson_.paths};
});

console.log(process.env.SWAGGER_PATH);
routes.use('/api-docs', swaggerUi.serve);
routes.route('/api-docs').get(swaggerUi.setup(swaggerJson));
// routes.route('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// console.log('API Documentation: http://localhost:3002/api-docs');
module.exports = {
    prefix,
    routes,
};
