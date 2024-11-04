const objectHelper = require('../helpers/object.helper');
const appRoot = require('app-root-path');
const winston = require('winston');
const WinstonGraylog2 = require('winston-graylog2');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, label, prettyPrint } = format;
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const logDir = path.normalize(`${appRoot}/storage/logs`);
const os = require('os');
var hostname = os.hostname();

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}


const configGrayLog = {
  name: 'Graylog',
  level: 'debug',
  silent: false,
  handleExceptions: false,
  graylog: {
    servers: [{ host: '115.78.94.109', port: 12201 }],
    hostname: hostname,
    facility: 'HHMOBILE',
    bufferSize: 1400,

  },
  staticMeta: { env: 'staging' },
}

const logger = createLogger({
  level: 'debug',
  exitOnError: false,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),

    printf((info) => {
      let errorJson = objectHelper.stringifyError(info);

      return `${info.timestamp} ${info.level}: ${info.message} \n\tStack: ${errorJson}`;

    }),
    format.errors({ stack: true }),
    format.metadata(),
    format.json()

  ),
  transports: [
    new transports.DailyRotateFile({
      filename: `${logDir}/errors-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
    }),
    new WinstonGraylog2(configGrayLog),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: `${logDir}/exceptions-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
    }),
    new WinstonGraylog2(configGrayLog),
  ],

});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: format.combine(prettyPrint()),
  }));
}

module.exports = logger;
