// IMP::
// winston logger is only for server side.
// This is only for server side logger. Do not use this logger for client side.
//
"use strict";

// const _ = require('lodash');
const winston = require('winston');

// const fs = require('fs');
// require('winston-daily-rotate-file');


// let logPath = process.env.LOGPFILEPATH || __dirname + '../../logs';
// const logFileName = '/LP-PWA-EA.';
// if (!fs.existsSync(logPath)) {
//   fs.mkdirSync(logPath);
// }
// logPath = logPath + logFileName;

// EN: all log level will be shown in Console, because 'info' is on the top of list with 0 value.
const winstonConsoleLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
// const winstonFileLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
const myFormat = winston.format.printf(info => {
    return `${new Date()} - ${info.level}  : ${info.message}`
  }

  );

const transportConsole = new winston.transports.Console({
  json: false,
  timestamp: () => new Date(),
  prettyPrint(object) {
    object && delete object.password;
    _.omit(object, ['password']);
    _.omit(object, ['file']);
    return JSON.stringify(object);
  },
  colorize: true,
  level: winstonConsoleLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    myFormat,
    winston.format.colorize()
  )
});

// EN: 'i' and 'db' log levels will be shown in File, because db is after i and for File transport level is 'i'

// const transportFileDebug = new (winston.transports.DailyRotateFile)({
//   filename: logPath + '-%DATE%.log',
//   datePattern: 'YYYY-MM-DD-HH',
//   timestamp: () => new Date(),
//   prepend: false,
//   colorize: true,
//   level: winstonConsoleLevel,
//   zippedArchive: true,
//   maxSize: '50m',
//   maxFiles: '14d',
//   json: true,
//   format: winston.format.combine(
//     myFormat,
//   )

// });
// const transportFileException = new (winston.transports.DailyRotateFile)({
//   filename: logPath + 'Exceptions' + '-%DATE%.log',
//   datePattern: 'YYYY-MM-DD-HH',
//   timestamp: () => new Date(),
//   zippedArchive: true,
//   maxSize: '50m',
//   maxFiles: '14d',
//   prepend: false,
//   level: winstonFileLevel,
//   json: true,
//   colorize: true,
//   format: winston.format.combine(
//     winston.format.colorize(),
//     myFormat,
//   )

// });


/* eslint-enable */

const logger = winston.createLogger({
  format: winston.format.timestamp(),
  levels: {
    debug: 6,
    info: 5,
    warn: 4,
    error: 3,
    verbose: 2,
    i: 1,
    db: 0,
  },
  transports: [
    transportConsole,
    // transportFileDebug,
  ],
  // exceptionHandlers: [
  //   transportConsole,
  //   // transportFileException,
  // ],
  exitOnError: false,
});

winston.addColors({
  debug: 'yellow',
  info: 'blue',
  warn: 'cyan',
  error: 'red',
  verbose: 'green',
  i: 'gray',
  db: 'magenta',
});

// logger.i('iiiii foobar level-ed message');
// logger.db('dbbbbb foobar level-ed message');
// logger.info('infoo foobar level-ed message');
// logger.warn('warnnnn foobar level-ed message');
// logger.error('errroor foobar level-ed message');
// logger.debug('debug foobar level-ed message');

module.exports = logger;