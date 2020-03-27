require('dotenv').config({ path: './config/.env' });
const Hapi = require('hapi')
const next = require("next");
const Path = require('path');
const Inert = require('inert');
const fs = require('fs');
const tls = require('tls');
var axios = require('axios');
const logger = require('./helpers/logUtils');
const utilities = require('./helpers/Utility.js');
const { defaultHandlerWrapper, nextHandlerWrapper, pathWrapper } = require('./nextwrapper');

const heapdump = require('heapdump');
const DYNATRACE_JS_PATH = process.env.DYNATRACE_JS_PATH;
const DYNATRACE_SERVER_URL = process.env.DYNATRACE_SERVER_URL;
const DYNATRACE_AGENTNAME = process.env.DYNATRACE_AGENTNAME;
const DYNATRACE_FLAG = process.env.DYNATRACE_FLAG;
const previewInstance = (process.env.INSTANCE_NAME && typeof process.env.INSTANCE_NAME !== 'undefined'
  && JSON.stringify(process.env.INSTANCE_NAME).indexOf("preview") > -1);

logger.info(`DYNATRACE VARIABLES FLAG ..${DYNATRACE_FLAG} JS_PATH:: ${DYNATRACE_JS_PATH} SERVER_URL:: ${DYNATRACE_SERVER_URL} AGENT_NAME:: ${DYNATRACE_AGENTNAME}`);
if (!previewInstance && ((!(process.env.DYNATRACE_FLAG == 'undefined' || process.env.DYNATRACE_FLAG == null)) && DYNATRACE_FLAG === 'true')) {
  if ((!(process.env.DYNATRACE_JS_PATH == 'undefined' || process.env.DYNATRACE_JS_PATH == null)) && (!(process.env.DYNATRACE_SERVER_URL == 'undefined' || process.env.DYNATRACE_SERVER_URL == null)) && (!(process.env.DYNATRACE_AGENTNAME == 'undefined' || process.env.DYNATRACE_AGENTNAME == null))) {
    logger.info(`Setting DYNATRACE.. ${DYNATRACE_JS_PATH} :: ${DYNATRACE_SERVER_URL} :: ${DYNATRACE_AGENTNAME}`);

    try {
      require(DYNATRACE_JS_PATH)({
        server: DYNATRACE_SERVER_URL,
        agentName: DYNATRACE_AGENTNAME,
      });
    } catch (err) {
      logger.error(err.toString());
    }
  }
} else {
  logger.info("Dyna trace is not loading now");
}

const dev = process.env.NODE_ENV !== "production";
var app = next({ dev });
const Routes = require("../server/routes/routes")(app);
let options = {
  state: {
    // If your cookie format is not RFC 6265, set this param to false.
    strictHeader: false
  },
  host: process.env.APP_HOST || 'localhost',
  port: parseInt(process.env.PORT, 10),
  router: {
    stripTrailingSlash: true
  }
};
process.on('message', function (data) {
  if (data.topic === 'updateInitialDataOnStartUp') {
    console.log(`your old ${process.env.pm_id}`);
    let copy = Object.assign(app.siteData ? app.siteData : {}, data.data);
    app.siteData = Object.assign(app.siteData ? app.siteData : {}, copy);
  }
});

if (process.env.TLS_ENABLE == 'true') {
  var secureContext = {
    'liverpool.com.mx': tls.createSecureContext({
      key: fs.readFileSync(process.env.TLS_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.TLS_CERT, 'utf8'),
      ca: fs.readFileSync(process.env.TLS_CA, 'utf8'),
    }),
    'williams-sonoma.com.mx': tls.createSecureContext({
      key: fs.readFileSync(process.env.WS_TLS_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.WS_TLS_CERT, 'utf8'),
      ca: fs.readFileSync(process.env.WS_TLS_CA, 'utf8'),
    }),
    'potterybarn.com.mx': tls.createSecureContext({
      key: fs.readFileSync(process.env.PB_TLS_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.PB_TLS_CERT, 'utf8'),
      ca: fs.readFileSync(process.env.PB_TLS_CA, 'utf8'),
    }),
    'potterybarnkids.com.mx': tls.createSecureContext({
      key: fs.readFileSync(process.env.PBK_TLS_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.PBK_TLS_CERT, 'utf8'),
      ca: fs.readFileSync(process.env.PBK_TLS_CA, 'utf8'),
    }),
    'pbteen.com.mx': tls.createSecureContext({
      key: fs.readFileSync(process.env.PBT_TLS_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.PBT_TLS_CERT, 'utf8'),
      ca: fs.readFileSync(process.env.PBT_TLS_CA, 'utf8'),
    }),
    'westelm.com.mx': tls.createSecureContext({
      key: fs.readFileSync(process.env.WE_TLS_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.WE_TLS_CERT, 'utf8'),
      ca: fs.readFileSync(process.env.WE_TLS_CA, 'utf8'),
    }),
  }
  options = {
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.SECURE_PORT, 10),
    tls: {
      SNICallback: function (domain, cb) {
        subDomainName = domain.replace(/.+?\./, '');
        logger.info("server requested domain is " + domain + " &  sub domain logic value is " + subDomainName);

        if (secureContext[subDomainName]) {
          logger.info('  --TLS_KEY = ' + secureContext[subDomainName].key + ' -- TLS_CERT = ' + secureContext[subDomainName].cert + '   TLS_CA = ' + secureContext[subDomainName].ca);
          if (cb) {
            logger.info("cb is true and sub-domain is " + subDomainName);
            cb(null, secureContext[subDomainName]);
          } else {
            // compatibility for older versions of node
            logger.info("cb is false and sub-domain is " + subDomainName);
            return secureContext[subDomainName];
          }
        } else {
          console.error("No keys/certificates for domain requested, domain = " + domain);
          // Never add throw new error here 
        }
      },
      key: fs.readFileSync(process.env.TLS_KEY, 'utf8'),//default
      cert: fs.readFileSync(process.env.TLS_CERT, 'utf8'), //default
      ca: fs.readFileSync(process.env.TLS_CA, 'utf8'), //default

    }
  }

}



const server = new Hapi.Server(options);
// /**
//  *  This event is added to remove last "/" from URL 
//  *  @author mvaity@zensar.com
//  *  @desc This event is added to remove last "/" from URL 
//  *  @param {requestObject} request
//  *   @param {replyObject} next
//  *  @returns replyObject continue
//  */
// server.ext('onRequest', function (request, next) {
//   let path = request.path;
//   while (path.length == path.lastIndexOf("/") + 1){
//     path = path.replace(/\/$/, '');
//   }
//   request.setUrl(path);
//   // logger.info("onRequest", path);
//   return next.continue;
// });

const startServer = () => {
  app.prepare().then(async () => {
    await server.register(Inert);
    server.ext('onRequest', async function (request, next) {
      let CDNUrl = ''
      const hostname = request.headers.host;
     // console.log('request==============>>>>>', request.path);
      if (hostname && typeof hostname !== 'undefined' && process.env.NODE_ENV.toLocaleLowerCase() !== 'development1') {   /// for development pickup NEXT files from local only.
        if (hostname.indexOf('liverpool') > -1) {  /* Next-js always prefix with "/_next/" so hence removed the next folder */
          app.setAssetPrefix(process.env.STATICASSETSLP && process.env.STATICASSETSLP  || '') //https://assetspwa.liverpool.com.mx/_next/.....
          CDNUrl = process.env.STATICASSETSLP && process.env.STATICASSETSLP  || '';
        } else if (hostname.indexOf('williams-sonoma') > -1) {
          app.setAssetPrefix(process.env.STATICASSETSWS && process.env.STATICASSETSWS  || '')//https://assetspwa.williams-sonoma.com.mx/_next/.....
          CDNUrl = process.env.STATICASSETSWS && process.env.STATICASSETSWS  || '';
        } else if (hostname.indexOf('potterybarnkids') > -1) {
          app.setAssetPrefix(process.env.STATICASSETSPBK && process.env.STATICASSETSPBK  || '') //https://assetspwa.potterybarn.com.mx/_next/.....
          CDNUrl = process.env.STATICASSETSPBk && process.env.STATICASSETSPBk  || '';
        } else if (hostname.indexOf('pbteen') > -1) {
          app.setAssetPrefix(process.env.STATICASSETSPBT && process.env.STATICASSETSPBT  || '')//https://assetspwa.pbteen.com.mx/_next/.....
          CDNUrl = process.env.STATICASSETSPBT && process.env.STATICASSETSPBT  || '';
        } else if (hostname.indexOf('potterybarn') > -1) {
          app.setAssetPrefix(process.env.STATICASSETSPB && process.env.STATICASSETSPB  || '')//https://assetspwa.potterybarnkids.com.mx/_next/.....
          CDNUrl = process.env.STATICASSETSPB && process.env.STATICASSETSPB  || '';
        } else if (hostname.indexOf('westelm') > -1) {
          app.setAssetPrefix(process.env.STATICASSETSWEL && process.env.STATICASSETSWEL  || '')//https://assetspwa.westelm.com.mx/_next/.....
          CDNUrl = process.env.STATICASSETSWEL && process.env.STATICASSETSWEL  || '';
        } else {
          app.setAssetPrefix('')
          CDNUrl = '';
        }
        if (request.path.endsWith('.woff') && request.path.startsWith('/static/fonts/')){
          let path = CDNUrl + request.path;
         // console.log(request.path);
          //console.log(path);
          next.redirect(path);
          // request.setUrl(path);
        }

      } else {
        app.setAssetPrefix('')
      }
      return next.continue;
    });
    server.route(Routes);
    try {
      await server.start();
      console.info("==============================================");
      console.info("testing the log error and process.env.NODE_ENV = " + process.env.NODE_ENV + '   SERVICE_PATH : ' + process.env.SERVICE_PATH + "  const dev value is " + dev + " server.info.uri =  " + server.info.uri);
      console.info("==============================================");

      console.info("==============================================");

      console.info('secure port is ' + process.env.SECURE_PORT + ' http port is ' + process.env.PORT + '   TLS_ENABLE = ' + process.env.TLS_ENABLE + " environment variables " + JSON.stringify(process.env));
      console.info("==============================================");

    } catch (error) {
      console.info('Error starting server')
      console.info(error);
    }
  }).catch(error => console.info(error))
};

const getInitialData = async (app) => {
  let cacheNames = 'all', brand = 'lp';
  const { error, siteData } = await utilities.siteDatabyNameAndBrand(cacheNames, brand);
  if (error.status) {
    console.log("=============== SERVER STARTUP FAILED ======================");
    console.log(error.msg.config.headers);
  } else if (!error.status && siteData !== null) {
    app.siteData = siteData;
    console.log("=============== SERVER STARTUP SUCCESS ======================");
    startServer();
  }
};

getInitialData(app);
