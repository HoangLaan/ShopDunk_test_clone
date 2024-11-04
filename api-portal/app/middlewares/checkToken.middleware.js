const RESPONSE_MSG = require('../common/const/responseMsg.const');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../../config/config');

const ErrorResponse = require('../common/responses/error.response');
const prefix = '/api';
const ROUTE_NOT_CHECK = [
    `${prefix}`,
    `${prefix}/auth/token`,
    `${prefix}/auth/refresh-token`,
    `${prefix}/auth/logout`,
    `${prefix}/task/care/sms/update-status`,
    `${prefix}/email-history/webhook/update-status`,
    `${prefix}/lazada/push-lazada`,
    `${prefix}/shopee/push-shopee`,
    `${prefix}/order/check-order-status-notify`,
];

const REGEX_ROUTE_NOT_CHECK = [
    '/api\\/swagger*.', // eslint-disable-line no-useless-escape
    '/uploads/*',
    '/pdf*',
];

module.exports = async (req, res, next) => {
    const path = req.path;

    // Exclude routes don't need check
    if (ROUTE_NOT_CHECK.includes(path)) {
        return next();
    }

    // Exclude regex routes don't need check
    for (let i = 0; i < REGEX_ROUTE_NOT_CHECK.length; i++) {
        const pattern = new RegExp(REGEX_ROUTE_NOT_CHECK[i]);
        if (pattern.test(path)) {
            return next();
        }
    }

    // Get authorization header
    const { authorization } = req.headers;

    if (authorization && /^Bearer /.test(authorization)) {
        // Remove Bearer from string
        const token = authorization.replace('Bearer ', '');
        try {
            const decoded = jwt.verify(token, config.hashSecretKey);
            // set information user to request.auth
            req.auth = decoded;
            req.body.auth_id = decoded.user_id;
            req.body.auth_name = decoded.user_name;
            req.body.full_name = decoded.full_name;
            return next();
        } catch (e) {
            return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null, e.message));
        }
    }

    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, '', RESPONSE_MSG.AUTH.LOGIN.TOKEN_REQUIRED));
};
