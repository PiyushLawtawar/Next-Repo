const getBrowserBunyanInstance = require('../../client/helpers/clientLoggerHandler');
const loggerHandler = getBrowserBunyanInstance('staticFile');

const { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } = require('../../server/nextwrapper');
const utilities = require('../helpers/Utility.js');
const cacheUtils = require('../helpers/cacheUtils.js');
const appProperties = require('../../client/config/appProperties.js'),
settings = require('../../client/config/settings');
const logger = require('../helpers/logUtils');
const fs = require('fs');


module.exports = {
  /**
 * file Not Found controller 
 * @author mvaity@zensar.com
 * @desc this function will return file Not Found HTML to browser
 * @param {object} req
 * @param {object} reply
 * @param {object} app
 * @returns meta tag Array
 */
  fileNotFound: async (req, reply, app) => {
    try {
      const PageNotFound = '/pages/404error';
      let EndecaStaticContentURL = utilities.getFinalServiceURL(appProperties.getEndecaStaticContent,req);
      // const EndecaStaticContentResponse = await utilities.serviceReq(req, EndecaStaticContentURL + PageNotFound, 'GET', undefined);

      // loggerHandler.info(EndecaStaticContentResponse.data.staticContent);
      const EndecaStaticContentResponse = {};
      const _d = EndecaStaticContentResponse && EndecaStaticContentResponse.data && EndecaStaticContentResponse.data.staticContent || {}

      const result = {
        data: _d
      };
      if (_d && _d[0] && _d[0].content) {
        return reply.response(_d[0].content).code(404);
      } else {
        let headerDetails = utilities.getHeaderDetails(req);
        let port = process.env.PORT;
        if (port === "80" || port === '443') {
          port = '';
        } else {
          port = ':' + port
        }
        
        const brandName = headerDetails && headerDetails.brand || 'LP';
        
        
        // loggerHandler.debug('404 page path & Name :: [', __dirname + '/../../static/404'+ brandName.toLowerCase() + '.html]' );

        const _data = fs.readFileSync(__dirname + '/../../static/404'+ brandName.toLowerCase() + '.html', 'utf8')

        // let pageNotFountURL = req.server.info.uri + '/404' + headerDetails.brand.toLowerCase();

        // const EndecaStaticContentResponse = await utilities.serviceReq(req, pageNotFountURL, 'GET', undefined);
        // loggerHandler.debug('Enable to get error page.......');
        return reply.response(_data).code(404);
      }

    } catch (e) {
      loggerHandler.error(e);
      return reply.response(e.message).code(404);
    }
  },

  /**
* get Static Page controller
* @author mvaity@zensar.com
* @desc this function will return static page HTML to browser
* @param {object} req
* @param {object} reply
* @param {object} app
* @returns meta tag Array
*/
  getStaticPage: async (req, reply, app) => {
    try {
      loggerHandler.info("req.params ===>", req.params);
      let pageName = req.params && req.params["pageName"];
      let key = pageName;      
      pageName = '/paginas/' + pageName
      // loggerHandler.info("pageName :: ", pageName)
      // console.log("key -- pageName",key,pageName)
      
     // const EndecaStaticContentURL = utilities.getFinalServiceURL(appProperties.getEndecaStaticContent,req);
      //const EndecaStaticContentResponse = await utilities.serviceReq(req, EndecaStaticContentURL + pageName, 'GET', undefined);
      const EndecaStaticContentResponse = await utilities.FetchStaticPagesFromCoherence(req,pageName,key);
      let staticPageData = "";
      let statusCode = 200;
      const _d = EndecaStaticContentResponse  && EndecaStaticContentResponse.status && EndecaStaticContentResponse.staticContent || {}
     
      let result = {};
      if (_d.length > 0 && typeof _d[0].content !== 'undefined') {
        staticPageData = _d[0].content;

        if (staticPageData.trim().indexOf('<!DOCTYPE html>') === -1) {
          let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
          
          // Load hader & Footer
         // const headerFooter = await utilities.getHeaderFooter(req);
         //const headerFooter = await utilities.getHeaderFooter(req, true);
         //const footerData = footerData;

          result = {
            hostname: req.headers.host,
            footerContent: footerData ,
            headerContent: headerFooter,
            mainContent: EndecaStaticContentResponse
          };

          let PageRes = await defaultHandlerWrapper(app, result)(req, "/tienda/staticPage");

          return reply.response(PageRes);
        }

      } else if (EndecaStaticContentResponse  && EndecaStaticContentResponse.status && EndecaStaticContentResponse.status.status === '1') {
        pageName = '/pages/404error';
        // loggerHandler.info("pageName", pageName)
        key = "404error";
        //const EndecaStaticContentURL = utilities.getFinalServiceURL(appProperties.getEndecaStaticContent,req);
        //const EndecaStaticContentResponse = await utilities.serviceReq(req, EndecaStaticContentURL + pageName, 'GET', undefined);
        //const _error = EndecaStaticContentResponse && EndecaStaticContentResponse.data && EndecaStaticContentResponse.data.status && EndecaStaticContentResponse.data.staticContent || {}
        const responseData = await FetchFromCoherence(req,pageName,key);
        const _error = responseData && responseData.status && responseData.staticContent || {};
        staticPageData = _error[0].content;
        statusCode = 404;
      } else {
        staticPageData = "Error"
        statusCode = 404;
      }

      return reply.response(staticPageData).code(statusCode);
    } catch (e) {
      // return reply.response(e.message);
      return utilities.fileNotFound(req, reply, app);
    }

  }
  

};
