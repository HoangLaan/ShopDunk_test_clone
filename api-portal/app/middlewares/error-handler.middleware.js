const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');
const errorService = require('../modules/error/error.service');

function logError(error, req) {
  let errorName = '';
  let errorContent = '';

  switch (typeof error) {
    case 'string':
      errorName = error;
      errorContent = error;
      break;
    case 'object':
      errorName = error.constructor.name;
      errorContent = error.message;
      break;
  }

  const user = req.auth;
  // If user is login
  if (user) {
    errorService.createError({
      'business_id': '',
      'user_name': user && user.user_name,
      'error_name': errorName,
      'content': errorContent,
      'error_time': new Date(),
      'event': '',
      'module_name': '',
      'user_agent': JSON.stringify(req.useragent),
      'parameter_content': JSON.stringify({
        'body': req.body,
        'query': req.query,
        'params': req.params,
        'error': error,
      }),
      'created_user': user && user.user_id,
    });
  }
}

module.exports = function () {
  return function (error, req, res, next) {
    // Write log system
    logError(error, req);

    // Error is object
    if (error instanceof Object && !(error instanceof ValidationError)) {
      switch (error.constructor.name) {
        case 'NotFoundResponse':
        case 'ErrorResponse':
          return res.status(error.status).json(error);
        case 'ServiceResponse':
          error.status = httpStatus.BAD_REQUEST;
          return res.status(error.status).json({
            status: error.getStatus(),
            message: error.getMessage(),
            data: error.getData(),
            errors: error.getErrors(),
          });
        case 'Error':
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            errors: error.errors || null,
          });
        default:
          if (!error.message) {
            error.message = 'Our app has encountered an unforeseen issue. We will have this addressed shortly.';
          }
          if (!error.status) {
            error.status = httpStatus.BAD_REQUEST;
          }
          return res.status(error.status).json(error);
      }
    }
    // Error is express ValidationError
    else if (error instanceof ValidationError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: error.errors[0]?.messages[0]?.replace(/['"]/g, ''),
        errors: error.errors || null,
      });
    }
    // Error is string
    else if (typeof (error) === 'string' || error instanceof String) {
      return res.status(httpStatus.BAD_REQUEST).json({
        'message': error,
        'status': httpStatus.BAD_REQUEST,
      });
    }

    // Error unknown
    return res.status(error.status || httpStatus.BAD_REQUEST).json(error);
  };
};