const browserBunyan = require('browser-bunyan');

const clientloggersettings = {
  name: 'browser-bunyan',
  appName: 'PWAWebClient',
  level: process && process.env && process.env.ENVIRONMENT === 'prod' ? 'info' : 'debug', // 'trace',   // this level will change on higher version of deployment
};

let clientInstance = null;
const moduleExport = {};

/**
 *
 * @param {string} subModuleName
 * @returns {logger}
 */
const getBrowserBunyanInstance = function (subModuleName) {
  // console.log('In getBrowserBunyanInstance');
  if (!clientInstance) {
    clientInstance = browserBunyan.createLogger({
      name: clientloggersettings.appName + ':' + subModuleName,
      streams: [{
        level: clientloggersettings.level,
        stream: new browserBunyan.ConsoleFormattedStream(),
      }],
      serializers: browserBunyan.stdSerializers,
      src: false, // true
    });
  }

  return clientInstance.child({
    submodule: subModuleName,
  });
};

// loggerHandler.info('I am here............',loggerHandler.fields.submodule);
moduleExport.getBrowserBunyanInstance = getBrowserBunyanInstance;
module.exports = getBrowserBunyanInstance;


/* level Info
fatal (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
error (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
warn (40): A note on something that should probably be looked at by an operator eventually.
info (30): Detail on regular operation.
debug (20): Anything else, i.e. too verbose to be included in "info" level.
trace (10): Logging from external libraries used by your app or very detailed application logging.
*/