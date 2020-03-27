//
// "use strict";

const fs = require('fs');
const https = require('https');
const http = require('http');
const Agent = require('agentkeepalive');
const logger = require('../helpers/logUtils');
const cacheUtils = require('../helpers/cacheUtils');
const settings = require('../../client/config/settings');
const getBrowserBunyanInstance = require('../../client/helpers/clientLoggerHandler');
const loggerHandler = getBrowserBunyanInstance('staticFile');
// const { browseAndShop, cart, myAccount, checkout, defaultTimeOut } = require('../../client/config/appconfig');
let enableNodeLog = true;
let enableNodeReqResLog = true;
const pm2 = require('pm2');

const axios = require('axios'),
    uuid = require('uuid/v4'),
    appProperties = require('../../client/config/appProperties.js'),
    {
        pathWrapper,
        defaultHandlerWrapper,
        nextHandlerWrapper
    } = require('../../server/nextwrapper'),
    MobileDetect = require('mobile-detect')

let axiosInstance;


_serviceReq = async (req, path, type, payload, avoidCookies) => {
        let headerDetails = _getHeaderDetails(req);
        let getChannel = _getChannel(req);
        const _correlationID = headerDetails.brand + '-' + getChannel + '-' + uuid(new Date().getTime());
        const correlationID = req.headers["user-correlation-id"] || _correlationID;

        const request_from = req.headers["request_from"] || ''

        let headersCookie = req.headers.cookie || '';
        if (typeof avoidCookies !== 'undefined' && avoidCookies === 'true') {
            headersCookie = '';
        }

        /// Get config setting from Cookie ==> getConfiguration services
        // console.log('clientConfig', _getCookieValueByName(req, 'clientConfig'));
        let _clientConfig = _getCookieValueByName(req, 'clientConfig') || ''; // config.data.configuration.coherencecacheconfiguration.enableNodeLog;

        // Default settings 
        let clientConfig = {};
        clientConfig.EnableNodeLog = false;
        clientConfig.EnableNodeReqResLog = false;
        // clientConfig.TimeoutBS = browseAndShop.timeout;
        // clientConfig.TimeoutCart = cart.timeout;
        // clientConfig.TimeoutCheckout = checkout.timeout;
        // clientConfig.TimeoutAccount = myAccount.timeout;
        // clientConfig.TimeoutDefault = defaultTimeOut;

        if (_clientConfig.length > 0) {
            try {
                _clientConfig = '{' + _clientConfig.replace(/\'/g, '"').replace(/\|/g, ',') + '}'

                _clientConfig = JSON.parse(_clientConfig);
                clientConfig.EnableNodeLog = _clientConfig.EnableNodeLog;
                clientConfig.EnableNodeReqResLog = _clientConfig.EnableNodeReqResLog;
                // clientConfig.TimeoutCart = _clientConfig.TimeoutCart || cart.timeout;
                // clientConfig.TimeoutCheckout = _clientConfig.TimeoutCheckout || checkout.timeout;
                // clientConfig.TimeoutAccount = _clientConfig.TimeoutAccount || myAccount.timeout;
                // clientConfig.TimeoutDefault = _clientConfig.TimeoutDefault || defaultTimeOut;

            } catch (ex) {
                _clientConfig = {};
            }
            Object.assign(clientConfig, _clientConfig);
        }

        // let serviceTimeOut = _getServiceTimeout(path, clientConfig) || 45000; // 45 sec default time out
        enableNodeLog = (clientConfig.EnableNodeLog && clientConfig.EnableNodeLog.toString().toLocaleLowerCase() === "true") ? true : false;
        enableNodeReqResLog = (clientConfig.EnableNodeReqResLog && clientConfig.EnableNodeReqResLog.toString().toLocaleLowerCase() === "true") ? true : false;

        // enableNodeLog = true;
        // enableNodeReqResLog = true;

        let jSessionID = '';
        let reqCookie = req && req.headers && req.headers.cookie;
        if (reqCookie) {
            jSessionID = reqCookie.split(";").find(p => {
                if (p.indexOf('JSESSIONID') >= 0) {
                    return p;
                }
            });
        }

        jSessionID = jSessionID || ''
        // /req.url.href
        const applicationQueryString = req.query;
        const reqReferrer = _getQueryString(req.info.referrer);
        if ((Object.keys(applicationQueryString).indexOf('showkey') >= 0 || reqReferrer.showkey !== undefined) && type === 'POST') {
            let showkeyValue = applicationQueryString && applicationQueryString.showkey || reqReferrer.showkey;
            if (applicationQueryString && Object.keys(applicationQueryString).length > 0) {
                path = path + "&showkey='" + showkeyValue + "'"
            } else {
                path = path + "?showkey='" + showkeyValue + "'"
            }
        }

        Object.keys(applicationQueryString).map((p => {
            if (typeof applicationQueryString[p] !== 'boolean') {
                let newVal = unEntity(applicationQueryString[p]);
                if (newVal.trim().length === 0) {
                    newVal = ' ';
                }
                applicationQueryString[p] = newVal;
            }
        }))
        path = unEntity(path);

        enableNodeLog && enableNodeReqResLog && logger.info('EA Calling AA serviceReq :: correlationID [' + correlationID + '] :: for browser URL :: ' + req.info.referrer + ' :: for Service [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] ');

        if (payload) {
            enableNodeLog && enableNodeReqResLog && logger.info('EA Calling AA serviceReq :: correlationID [' + correlationID + '] :: payload [' + JSON.stringify(payload) + ']');
        }

        let userHeaders = {}
        if (request_from === 'updateProfile') {
            if (request_from.length > 0) {
                userHeaders = {
                    'request_from': 'updateProfile'
                }
            }
        } else {
            if (request_from.length > 0) {
                userHeaders = {
                    'request_from': 'changePassword'
                }
            }
        }

        let headers = {
            'x-correlation-id': correlationID,
            'user-correlation-id': correlationID,
            "brand": headerDetails.brand || 'LP',
            "channel": getChannel,
            "lp-correlation-id": process.env.COR_ID,
            "lp-auth-header": process.env.AUTH_KEY || '0DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
            "requested-header": req.info.hostname || "",
            "cookie": headersCookie
        }


        Object.assign(headers, userHeaders);

        // pass all headers to ATG service :: Start
        // Start bug 22979 
        // let reqHeaders = req.headers;
        //  Object.assign(headers, reqHeaders);
        //   End bug 22979 
        // pass all headers to ATG service :: End


        let socketTimeout = parseInt(process.env.SOCKET_TIMEOUT || 10000); // Convert timeout in int & default 10sec
        // updated  Keep Alive setting :: Start 
        const keepAliveConfig = {
            keepAlive: JSON.parse((process.env.KEEP_ALIVE || 'true').toLowerCase()),
            maxSockets: parseInt(process.env.CONNECTION_MAXSOCKETS || '1'),
            keepAliveMsecs: parseInt(process.env.CONNECTION_KEEPALIVEMSECS || '100000'),
            maxFreeSockets: parseInt(process.env.CONNECTION_MAXFREESOCKETS || '1'), // adding maxFreeSockets 
            timeout: socketTimeout
        }
        // updated  Keep Alive setting :: End 

        let enableAgentKeepAlive = JSON.parse((process.env.ENABLEAGENTKEEPALIVE || 'false').toLowerCase());
        let freeSocketTimeout = parseInt(process.env.FREESOCKETTIMEOUT || '15000')
        let socketActiveTTL = process.env.SOCKETACTIVETTL ? parseInt(process.env.SOCKETACTIVETTL) : null

        let httpAgent = new http.Agent(keepAliveConfig)
        let httpsAgent = new https.Agent(keepAliveConfig)

        if (enableAgentKeepAlive) {
            httpAgent = new Agent({
                maxSockets: parseInt(process.env.CONNECTION_MAXSOCKETS || '1'),
                maxFreeSockets: parseInt(process.env.CONNECTION_MAXFREESOCKETS || '1'), // adding maxFreeSockets ,
                timeout: socketTimeout,
                freeSocketTimeout: freeSocketTimeout,
                socketActiveTTL: socketActiveTTL
            });
            httpsAgent = new Agent({
                maxSockets: parseInt(process.env.CONNECTION_MAXSOCKETS || '1'),
                maxFreeSockets: parseInt(process.env.CONNECTION_MAXFREESOCKETS || '1'), // adding maxFreeSockets ,
                timeout: socketTimeout,
                freeSocketTimeout: freeSocketTimeout,
                socketActiveTTL: socketActiveTTL
            });
        }

        let response

        if (axiosInstance == undefined) {
            console.log('axiosInstance is not exist :: Creating axiosInstance ');
            axiosInstance = axios.create({
                host: 'jsonplaceholder.typicode.com',
                responseType: 'json',
                httpAgent: httpAgent,
                httpsAgent: httpsAgent,
            });
        } else {
            console.log('Singleton ======================= axiosInstance');
        }
        axiosInstance.defaults.headers = headers;

        try {
            response = await axiosInstance({
                method: type,
                url: path,
                data: payload
            });
            // logger.info('EA Calling AA serviceReq Success :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] ');

        } catch (ex) {
            response = {};
            response.headers = {};
            response.status = 404;
            console.error('Opps Error in Axios call.......')
            logger.error('EA Calling AA serviceReq Error :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] ' + 'for browser URL :: ' + req.info.referrer);
            /* Change done for RTC 22576 :Start */
            let errorObj = ex;
            if (path.lastIndexOf('/login')) {
                try {
                    let data = JSON.parse(errorObj.config.data);
                    data.password ? data.password = '***************' : ''
                    errorObj.config.data = JSON.stringify(data);

                    data = JSON.parse(errorObj.response.config.data);
                    data.password ? data.password = '***************' : ''
                    errorObj.response.config.data = JSON.stringify(data);
                } catch (ex) {

                }
            }
        }

        return response;

        // try {
        //     response = await axios({
        //         method: type,
        //         host: 'jsonplaceholder.typicode.com',
        //         url: path,
        //         responseType: 'json',
        //         // timeout: serviceTimeOut,   /// This is move to AA layer.
        //         httpsAgent: httpsAgent,   // updated  Keep Alive setting
        //         httpAgent: httpAgent,     // updated  Keep Alive setting
        //         data: payload,
        //         headers: headers
        //     });
        //     // logger.info('EA Calling AA serviceReq Success :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] ');

        // } catch (ex) {
        //     response = {};
        //     response.headers = {};
        //     response.status = 404;
        //     console.error('Opps Error in Axios call.......')
        //     logger.error('EA Calling AA serviceReq Error :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] ' + 'for browser URL :: ' + req.info.referrer);
        //     /* Change done for RTC 22576 :Start */
        //     let errorObj = ex;
        //     if (path.lastIndexOf('/login')) {
        //         try {
        //             let data = JSON.parse(errorObj.config.data);
        //             data.password ? data.password = '***************' : ''
        //             errorObj.config.data = JSON.stringify(data);

        //             data = JSON.parse(errorObj.response.config.data);
        //             data.password ? data.password = '***************' : ''
        //             errorObj.response.config.data = JSON.stringify(data);
        //         } catch (ex) {

        //         }
        //     }
        //     console.error('error=======>>>', errorObj);
        //     /* Change done for RTC 22576 :End */

        // }

        // return response;

        // return axios({
        //     method: type,
        //     host: 'jsonplaceholder.typicode.com',
        //     url: path,
        //     responseType: 'json',
        //     timeout: serviceTimeOut,
        //     data: payload,
        //     headers: {
        //         'x-correlation-id': correlationID,
        //         'user-correlation-id': correlationID,
        //         "brand": headerDetails.brand || 'LP',
        //         "channel": getChannel,
        //         "lp-correlation-id": process.env.COR_ID,
        //         "lp-auth-header": process.env.AUTH_KEY || '0DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
        //         "requested-header": req.info.hostname || "",
        //         "Cookie": headersCookie
        //     }
        // }).then(function (response) {
        //     return response;
        //   })
        //   .catch(function (error) {
        //     const response = {};
        //     response.headers = {};
        //     response.status = 404;
        //     return response;
        //   })
    },
    _getServiceTimeout = (serviceURL, configuration) => {
        // console.log('browseAndShop =============>',browseAndShop);
        // console.log('defaultTimeOut =============>',defaultTimeOut);

        // ser service name in lower case 
        let bServiceName = browseAndShop.serviceName.join('|').toLowerCase().split('|');
        let cServiceName = cart.serviceName.join('|').toLowerCase().split('|');
        let myServiceName = myAccount.serviceName.join('|').toLowerCase().split('|');
        let coServiceName = checkout.serviceName.join('|').toLowerCase().split('|');


        let serviceTimeout = defaultTimeOut;
        const serviceName = serviceURL.substr(serviceURL.lastIndexOf("/") + 1).toLowerCase();
        if (bServiceName.indexOf(serviceName) >= 0) {
            serviceTimeout = configuration.TimeoutBS == 0 ? browseAndShop.timeout : configuration.TimeoutBS
        } else if (cServiceName.indexOf(serviceName) >= 0) {
            serviceTimeout = configuration.TimeoutCart == 0 ? cart.timeout : configuration.TimeoutCart
        } else if (myServiceName.indexOf(serviceName) >= 0) {
            serviceTimeout = configuration.TimeoutAccount == 0 ? myAccount.timeout : configuration.TimeoutAccount
        } else if (coServiceName.indexOf(serviceName) >= 0) {
            serviceTimeout = configuration.TimeoutCheckout == 0 ? checkout.timeout : configuration.TimeoutCheckout
        } else {
            serviceTimeout = configuration.TimeoutDefault == 0 ? defaultTimeOut : configuration.TimeoutDefault
        }
        return serviceTimeout;
    },
    _getChannel = (req) => {
        const userAgent = req.headers['user-agent'].toLowerCase();
        if (userAgent != '') {
            if (userAgent.indexOf('iphone') > 0 || userAgent.indexOf('android') > 0) {
                return "WAP";
            } else if (userAgent.indexOf('ipad') > 0 || userAgent.indexOf('ipod') > 0) {
                return "WAP";
            } else {
                return "WEB";
            }
        }

        return agentDetails;
    },
    // _getFinalServiceURL = function (requiredPath) {
    //     return process.env.SERVICE_PATH + requiredPath;
    // },
    _getFinalServiceURL = (requiredPath, req) => {
        logger.debug('requiredPath: ' + requiredPath + " req: " + req);
        //Gopi told that not to add sit & QA condition
        /*if(!req || !process.env.ENVIRONMENT || typeof process.env.ENVIRONMENT ==='undefined'
            || process.env.ENVIRONMENT ==='sit' || process.env.ENVIRONMENT ==='qa'){
            return process.env.SERVICE_PATH + requiredPath;
        }*/
        let servicePath = null;
        if (req) {
            try {
                let previewInstance = false;
                if (!req.info.hostname) {
                    console.error('Hostname null. Req info: ' + req.info);
                }
                let domainName = req.info.hostname.replace(/.+?\./, '');
                previewInstance = (process.env.INSTANCE_NAME && typeof process.env.INSTANCE_NAME !== 'undefined' &&
                    JSON.stringify(process.env.INSTANCE_NAME).indexOf("preview") > -1);

                logger.debug('domainName: ' + domainName + " previewInstance: " + previewInstance);
                switch (domainName) {
                    case 'liverpool.com.mx':
                        servicePath = previewInstance ? process.env.PREVIEW_LP_REST : process.env.LP_REST;
                        break;
                    case 'williams-sonoma.com.mx':
                        servicePath = previewInstance ? process.env.PREVIEW_MS_WS_REST : process.env.MS_WS_REST;
                        break;
                    case 'potterybarn.com.mx':
                        servicePath = previewInstance ? process.env.PREVIEW_MS_PB_REST : process.env.MS_PB_REST;
                        break;
                    case 'potterybarnkids.com.mx':
                        servicePath = previewInstance ? process.env.PREVIEW_MS_PB_KIDS_RE : process.env.MS_PB_KIDS_REST;
                        break;
                    case 'pbteen.com.mx':
                        servicePath = previewInstance ? process.env.PREVIEW_MS_PB_TEEN_REST : process.env.MS_PB_TEEN_REST;
                        break;
                    case 'westelm.com.mx':
                        servicePath = previewInstance ? process.env.PREVIEW_MS_WELM_REST : process.env.MS_WELM_REST;
                        break;
                    default:
                        servicePath = previewInstance ? process.env.PREVIEW_LP_REST : process.env.LP_REST;
                        console.error('Unknown domainName request: ' + domainName);
                }
            } catch (e) {}
        }
        if (!servicePath) {
            servicePath = process.env.SERVICE_PATH
        }
        return servicePath + requiredPath;
    },
    _getQueryString = function (url) {
        var obj = {};

        if (url) {
            var queryString = url.split('?')[1];

            // if query string exists
            if (queryString) {

                // stuff after # is not part of query string, so get rid of it
                queryString = queryString.split('#')[0];

                // split our query string into its component parts
                var arr = queryString.split('&');

                for (var i = 0; i < arr.length; i++) {
                    // separate the keys and the values
                    var a = arr[i].split('=');

                    // set parameter name and value (use 'true' if empty)
                    var paramName = a[0];
                    var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                    // (optional) keep case consistent
                    paramName = paramName.toLowerCase();
                    if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                    // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                    if (paramName.match(/\[(\d+)?\]$/)) {

                        // create key if it doesn't exist
                        var key = paramName.replace(/\[(\d+)?\]/, '');
                        if (!obj[key]) obj[key] = [];

                        // if it's an indexed array e.g. colors[2]
                        if (paramName.match(/\[\d+\]$/)) {
                            // get the index value and add the entry at the appropriate position
                            var index = /\[(\d+)\]/.exec(paramName)[1];
                            obj[key][index] = paramValue;
                        } else {
                            // otherwise add the value to the end of the array
                            obj[key].push(paramValue);
                        }
                    } else {
                        // we're dealing with a string
                        if (!obj[paramName]) {
                            // if it doesn't exist, create property
                            obj[paramName] = paramValue;
                        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                            // if property does exist and it's a string, convert it to an array
                            obj[paramName] = [obj[paramName]];
                            obj[paramName].push(paramValue);
                        } else {
                            // otherwise add the property
                            obj[paramName].push(paramValue);
                        }
                    }
                }
            }
        }
        return obj;
    },
    _getHeaderFooter = async (req, skip) => {
            try {
                let defaultPageName = '?page=BS';
                let loginParam = "&isguest=true";
                let key = "page_bs_guest";
                const checkoutSearchKeywordInURLs = ["checkoutShipping", "checkoutBillingPage", "billing", "CheckoutStep4"];
                checkoutSearchKeywordInURLs.forEach((curVal, index) => {
                    if (req.path.indexOf(curVal) > -1) {
                        defaultPageName = '?page=CHECKOUT';
                        key = "page_checkout_guest";
                    }
                });
                if (req.headers && req.headers.cookie && req.headers.cookie.indexOf("LoggedInSession") > -1) {
                    loginParam = "&isguest=false";
                    key = key + '_false';
                }
                let header = _getFinalServiceURL(appProperties.headerInfo, req);
                let footer = _getFinalServiceURL(appProperties.footerInfo, req);
                header = header + defaultPageName;
                footer = footer + defaultPageName + loginParam;
                let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                if (typeof services === 'undefined' || !services) {
                    services = settings['sit']['listofServicesForCoherence'];
                }
                let headerCohFlag = services['header'];
                let footerCohFlag = services['footer'];
                let headerInfo = null;
                let footerInfo = null;
                let resp = null;
                let hkey = null;
                let fkey = null;
                if (headerCohFlag) {
                    hkey = cacheUtils.getDynamicCacheKey(req, "header_", key);
                    resp = await cacheUtils.retrieveCoherenceData(req, hkey);
                    if (resp && resp.response && typeof resp.response !== 'undefined') {
                        headerInfo = resp.response;
                    } else {
                        headerInfo = await _serviceReq(req, header, 'GET');
                        if (headerInfo && headerInfo.data) {
                            const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], hkey, headerInfo.data, resp['flag']);
                        }
                    }
                } else {
                    headerInfo = await _serviceReq(req, header, 'GET');
                    if (headerInfo && headerInfo.data) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], hkey, headerInfo.data, resp['flag']);
                    }

                }
                if (footerCohFlag) {
                    fkey = cacheUtils.getDynamicCacheKey(req, "footer_", key);
                    resp = await cacheUtils.retrieveCoherenceData(req, fkey);
                    if (resp && resp.response && typeof resp.response !== 'undefined') {
                        footerInfo = resp.response;
                    } else {
                        footerInfo = await (typeof skip !== 'undefined' && skip) ? {
                            "data": {}
                        } : _serviceReq(req, footer, 'GET');
                        if (footerInfo && typeof skip === 'undefined' && footerInfo.data) {
                            const ss = await cacheUtils.pushCoherenceData(resp['cacheName'], fkey, footerInfo.data, resp['flag']);
                        }
                    }

                } else {
                    footerInfo = await (typeof skip !== 'undefined' && skip) ? {
                        "data": {}
                    } : _serviceReq(req, footer, 'GET');
                    if (footerInfo && typeof skip === 'undefined' && footerInfo.data) {
                        const ss = await cacheUtils.pushCoherenceData(resp['cacheName'], fkey, footerInfo.data, resp['flag']);
                    }
                }
                const headerFooter = Object.assign({}, headerInfo.data ? headerInfo.data : headerInfo, footerInfo.data ? footerInfo.data : footerInfo);
                return {
                    "header": headerFooter.headerContent,
                    "hostname": req.info.hostname,
                    "footer": headerFooter.footerContent
                };

            } catch (e) {
                return e;
            }
        },
        _getHeaderDetails = (req) => {
            if (req) {
                let domainName, headerDetails = {
                    brand: 'LP'
                };
                if (req.info.hostname) {
                    domainName = req.info.hostname.replace(/.+?\./, ''), servicePath = '';
                    domainName = domainName.split(":")[0];
                    switch (domainName) {
                        case 'williams-sonoma.com.mx':
                            headerDetails.brand = 'WS';
                            break;
                        case 'potterybarn.com.mx':
                            headerDetails.brand = 'PB';
                            break;
                        case 'potterybarnkids.com.mx':
                            headerDetails.brand = 'PBK';
                            break;
                        case 'pbteen.com.mx':
                            headerDetails.brand = 'PBT';
                            break;
                        case 'westelm.com.mx':
                            headerDetails.brand = 'WLM';
                            break;
                        default:
                            headerDetails.brand = 'LP';
                    }
                }
                // console.log("getHeader Details method domainName = "+domainName +"  headerDetails.brand = "+headerDetails.brand);
                return headerDetails;
            } else {
                return headerDetails;
            }
        },
        _getturntokey = (hostname) => {
            let Turntokey = '';
            if (hostname.indexOf('williams') != -1) {
                Turntokey = process.env.TRUNTO_KEY_WS;
            } else if (hostname.indexOf('potterybarnkids') != -1) {
                Turntokey = process.env.TRUNTO_KEY_PBK;
            } else if (hostname.indexOf('potterybarn') != -1) {
                Turntokey = process.env.TRUNTO_KEY_PB;
            } else if (hostname.indexOf('pbteen') != -1) {
                Turntokey = process.env.TRUNTO_KEY_PBT;
            } else if (hostname.indexOf('westelm') != -1) {
                Turntokey = process.env.TRUNTO_KEY_WST;
            } else {
                Turntokey = process.env.TRUNTO_KEY_LP;
            }

            return Turntokey;
        },
        _dummyTest = (req) => {
            if (req) {

            }
        },
        _getCookieValueByName = (req, name) => {
            let cookieValue = '',
                cookies;
            if (req.headers && req.headers.cookie && req.headers.cookie.constructor !== Array) {
                cookies = req.headers.cookie.split(';')
                cookies.forEach(function (cookie) {
                    if (cookie.indexOf(name) > -1) {
                        var parts = cookie.match(/(.*?)=(.*)$/)
                        cookieValue = (parts[2] || '').trim();
                    }
                });
            }

            return cookieValue;
        },
        _getHeaderNewApproach = async (req, onlyCoherence) => {
                try {
                    let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                    if (typeof services === 'undefined' || !services) {
                        services = settings['sit']['listofServicesForCoherence'];
                    }
                    let headerCohFlag = services['header'];
                    let key = null;
                    let resp = null;
                    let response = {};
                    const pageName = (req.query.page && typeof req.query.page !== 'string') ? req.query.page : "BS";
                    /*if (req.headers && req.headers.cookie && req.headers.cookie.indexOf("LoggedInSession") > -1) {
                        loginParam = "_false";
                    }else{
                        loginParam = "_true";
                    }*/
                    if (headerCohFlag) {
                        key = cacheUtils.getDynamicCacheKey(req, "header_", pageName);
                        resp = await cacheUtils.retrieveCoherenceData(req, key);
                        if (resp && resp.response && typeof resp.response !== 'undefined') {
                            response = resp.response;
                        } else {
                            if (typeof onlyCoherence !== 'undefined' && !onlyCoherence) {
                                const getheaderAPI = _getFinalServiceURL(appProperties.headerInfo, req);
                                response = await _serviceReq(req, getheaderAPI + '?page=BS', 'GET');
                                if (response && response.data) {
                                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                                }
                            }
                        }
                    } else {
                        if (typeof onlyCoherence !== 'undefined' && !onlyCoherence) {
                            const getheaderAPI = _getFinalServiceURL(appProperties.headerInfo, req);
                            response = await _serviceReq(req, getheaderAPI + '?page=' + req.query.page, 'GET');
                            if (response && response.data) {
                                const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                            }
                        }

                    }
                    return ((response.data && response.data.headerContent) ? response.data.headerContent : (response.data ? response.data : response));
                } catch (e) {
                    return null;
                }
            },
            _getFooterNewApproach = async (req) => {

                    try {
                        let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                        if (typeof services === 'undefined' || !services) {
                            services = settings['sit']['listofServicesForCoherence'];
                        }
                        let headerCohFlag = services['header'];
                        let key = null;
                        let resp = null;
                        let footerInfoData = {};

                        if (req.headers && req.headers.cookie && req.headers.cookie.indexOf("LoggedInSession") > -1) {
                            loginParam = "false";
                        } else {
                            loginParam = "true";
                        }
                        if (headerCohFlag) {
                            key = cacheUtils.getDynamicCacheKey(req, "footer_", "BS_" + loginParam);
                            resp = await cacheUtils.retrieveCoherenceData(req, key);
                            if (resp && resp.response && typeof resp.response !== 'undefined') {
                                footerInfoData = resp.response;
                            } else {
                                let footerInfo = _getFinalServiceURL(appProperties.footerInfo, req);
                                footerInfo = footerInfo + '?page=BS&isguest=' + loginParam;
                                footerInfoData = await _serviceReq(req, footerInfo, 'GET');
                                if (footerInfoData && footerInfoData.data) {
                                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, footerInfoData.data, resp['flag']);
                                }
                            }
                        } else {
                            let footerInfo = _getFinalServiceURL(appProperties.footerInfo, req);
                            footerInfo = footerInfo + '?page=BS&isguest=' + loginParam;
                            footerInfoData = await _serviceReq(req, footerInfo, 'GET');
                            if (footerInfoData && footerInfoData.data) {
                                const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, footerInfoData.data, resp['flag']);
                            }

                        }
                        return (footerInfoData.data ? footerInfoData.data : footerInfoData);
                    } catch (e) {
                        return null;
                    }
                },
                _departmentNewApproach = async (req) => {

                        try {
                            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                            if (typeof services === 'undefined' || !services) {
                                services = settings['sit']['listofServicesForCoherence'];
                            }
                            let departCohFlag = services['departments'];
                            let key = null;
                            let categoryInfo = {};
                            if (departCohFlag) {
                                key = cacheUtils.getDynamicCacheKey(req, "categories_");
                                resp = await cacheUtils.retrieveCoherenceData(req, key);
                                if (resp && resp.response && typeof resp.response !== 'undefined') {
                                    categoryInfo = resp.response;
                                } else {
                                    let category = _getFinalServiceURL(appProperties.getCategories, req);
                                    categoryInfo = await _serviceReq(req, category, 'GET');
                                    if (categoryInfo && categoryInfo.data) {
                                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, categoryInfo.data, resp['flag']);
                                    }
                                }
                            } else {
                                let category = _getFinalServiceURL(appProperties.getCategories, req);
                                categoryInfo = await _serviceReq(req, category, 'GET');
                                if (categoryInfo && categoryInfo.data) {
                                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, categoryInfo.data, resp['flag']);
                                }

                            }
                            return (categoryInfo.data ? categoryInfo.data : categoryInfo);
                        } catch (e) {
                            return null;
                        }
                    },
                    _fetchFlags = async (req, app) => {
                            let flags = {};
                            try {
                                let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                                if (typeof services === 'undefined') {
                                    services = settings['sit']['listofServicesForCoherence'];
                                }
                                let allFlag = services['allFlags'];
                                let resp = null;
                                let key = null;
                                if (allFlag) {
                                    key = cacheUtils.getDynamicCacheKey(req, "allThirdPartyFlags_");
                                    resp = await cacheUtils.retrieveCoherenceData(req, key);
                                    if (resp && resp.response && typeof resp.response !== 'undefined') {
                                        flags = resp.response;
                                    }

                                    if (!flags || Object.keys(flags).length <= 0) {
                                        let {
                                            headerFooter,
                                            footerData,
                                            labelsData,
                                            configurationData,
                                            departmentData
                                        } = await _getInitialDataOnStartUp(req, app);
                                        if (configurationData) {
                                            flags = await _getThirdPartyIntegrationFlags(req, configurationData);
                                        }
                                    }
                                }


                            } catch (e) {

                            }
                            return flags;
                        },
                        _getThirdPartyIntegrationFlags = async (req, configurationData) => {
                                const brand = req.headers['brand'] || 'LP';
                                const config = configurationData;
                                let flags = {
                                    "chatbotflag": true,
                                    "turntoflag": true,
                                    "swogoflag": true,
                                    "mouseflag": true,
                                    "gtmflag": true,
                                    "guatemala": true, //enableGuatemala
                                    "cnCDriveThru": true //enableCnCDriveThru
                                };
                                if (config && config.configuration && config.configuration.flagConfiguration) {
                                    const localConf = config.configuration.flagConfiguration;
                                    switch (brand) {
                                        case 'WS':
                                            flags['chatbotflag'] = (localConf.enableWSChatBot && (localConf.enableWSChatBot.indexOf("false") > -1 || localConf.enableWSChatBot === 'false') ? false : true);
                                            flags['turntoflag'] = (localConf.enableWSTurnTo && (localConf.enableWSTurnTo.indexOf("false") > -1 || localConf.enableWSTurnTo === 'false') ? false : true);
                                            flags['swogoflag'] = (localConf.enableWSSwogo && (localConf.enableWSSwogo.indexOf("false") > -1 || localConf.enableWSSwogo === 'false') ? false : true);
                                            flags['mouseflag'] = (localConf.enableWSMouseFlow && (localConf.enableWSMouseFlow.indexOf("false") > -1 || localConf.enableWSMouseFlow === 'false') ? false : true);
                                            flags['gtmflag'] = (localConf.enableWSGTM && (localConf.enableWSGTM.indexOf("false") > -1 || localConf.enableWSGTM === 'false') ? false : true);

                                            break;
                                        case 'PB':
                                            flags['chatbotflag'] = (localConf.enablePBChatBot && (localConf.enablePBChatBot.indexOf("false") > -1 || localConf.enablePBChatBot === 'false') ? false : true);
                                            flags['turntoflag'] = (localConf.enablePBTurnTo && (localConf.enablePBTurnTo.indexOf("false") > -1 || localConf.enablePBTurnTo === 'false') ? false : true);
                                            flags['swogoflag'] = (localConf.enablePBSwogo && (localConf.enablePBSwogo.indexOf("false") > -1 || localConf.enablePBSwogo === 'false') ? false : true);
                                            flags['mouseflag'] = (localConf.enablePBMouseFlow && (localConf.enablePBMouseFlow.indexOf("false") > -1 || localConf.enablePBMouseFlow === 'false') ? false : true);
                                            flags['gtmflag'] = (localConf.enablePBGTM && (localConf.enablePBGTM.indexOf("false") > -1 || localConf.enablePBGTM === 'false') ? false : true);

                                            break;
                                        case 'PBK':
                                            flags['chatbotflag'] = (localConf.enablePBKChatBot && (localConf.enablePBKChatBot.indexOf("false") > -1 || localConf.enablePBKChatBot === 'false') ? false : true);
                                            flags['turntoflag'] = (localConf.enablePBKTurnTo && (localConf.enablePBKTurnTo.indexOf("false") > -1 || localConf.enablePBKTurnTo === 'false') ? false : true);
                                            flags['swogoflag'] = (localConf.enablePBKSwogo && (localConf.enablePBKSwogo.indexOf("false") > -1 || localConf.enablePBKSwogo === 'false') ? false : true);
                                            flags['mouseflag'] = (localConf.enablePBKMouseFlow && (localConf.enablePBKMouseFlow.indexOf("false") > -1 || localConf.enablePBKMouseFlow === 'false') ? false : true);
                                            flags['gtmflag'] = (localConf.enablePBKGTM && (localConf.enablePBKGTM.indexOf("false") > -1 || localConf.enablePBKGTM === 'false') ? false : true);

                                            break;
                                        case 'PBT':
                                            flags['chatbotflag'] = (localConf.enablePBTChatBot && (localConf.enablePBTChatBot.indexOf("false") > -1 || localConf.enablePBTChatBot === 'false') ? false : true);
                                            flags['turntoflag'] = (localConf.enablePBTTurnTo && (localConf.enablePBTTurnTo.indexOf("false") > -1 || localConf.enablePBTTurnTo === 'false') ? false : true);
                                            flags['swogoflag'] = (localConf.enablePBTSwogo && (localConf.enablePBTSwogo.indexOf("false") > -1 || localConf.enablePBTSwogo === 'false') ? false : true);
                                            flags['mouseflag'] = (localConf.enablePBTMouseFlow && (localConf.enablePBTMouseFlow.indexOf("false") > -1 || localConf.enablePBTMouseFlow === 'false') ? false : true);
                                            flags['gtmflag'] = (localConf.enablePBTGTM && (localConf.enablePBTGTM.indexOf("false") > -1 || localConf.enablePBTGTM === 'false') ? false : true);

                                            break;
                                        case 'WLM':
                                            flags['chatbotflag'] = (localConf.enableWEChatBot && (localConf.enableWEChatBot.indexOf("false") > -1 || localConf.enableWEChatBot === 'false') ? false : true);
                                            flags['turntoflag'] = (localConf.enableWETurnTo && (localConf.enableWETurnTo.indexOf("false") > -1 || localConf.enableWETurnTo === 'false') ? false : true);
                                            flags['swogoflag'] = (localConf.enableWESwogo && (localConf.enableWESwogo.indexOf("false") > -1 || localConf.enableWESwogo === 'false') ? false : true);
                                            flags['mouseflag'] = (localConf.enableWEMouseFlow && (localConf.enableWEMouseFlow.indexOf("false") > -1 || localConf.enableWEMouseFlow === 'false') ? false : true);
                                            flags['gtmflag'] = (localConf.enableWEGTM && (localConf.enableWEGTM.indexOf("false") > -1 || localConf.enableWEGTM === 'false') ? false : true);

                                            break;
                                        default:
                                            flags['chatbotflag'] = (localConf.enableLPChatBot && (localConf.enableLPChatBot.indexOf("false") > -1 || localConf.enableLPChatBot === 'false') ? false : true);
                                            flags['turntoflag'] = (localConf.enableLPTurnTo && (localConf.enableLPTurnTo.indexOf("false") > -1 || localConf.enableLPTurnTo === 'false') ? false : true);
                                            flags['swogoflag'] = (localConf.enableLPSwogo && (localConf.enableLPSwogo.indexOf("false") > -1 || localConf.enableLPSwogo === 'false') ? false : true);
                                            flags['mouseflag'] = (localConf.enableLPMouseFlow && (localConf.enableLPMouseFlow.indexOf("false") > -1 || localConf.enableLPMouseFlow === 'false') ? false : true);
                                            flags['gtmflag'] = (localConf.enableLPGTM && (localConf.enableLPGTM.indexOf("false") > -1 || localConf.enableLPGTM === 'false') ? false : true);

                                    }
                                    flags['cnCDriveThru'] = (localConf.enableCnCDriveThru && (localConf.enableCnCDriveThru.indexOf("false") > -1 || localConf.enableCnCDriveThru === 'false') ? false : true);
                                    flags['guatemala'] = (localConf.enableGuatemala && (localConf.enableGuatemala.indexOf("false") > -1 || localConf.enableGuatemala === 'false') ? false : true);
                                    flags['enableeddforbigticket'] = (localConf.enableeddforbigticket && (localConf.enableeddforbigticket.indexOf("false") > -1 || localConf.enableeddforbigticket === 'false') ? false : true);
                                    flags['enableMinimalPiecesShopping'] = (localConf.enableMinimalPiecesShopping && (localConf.enableMinimalPiecesShopping.indexOf("false") > -1 || localConf.enableMinimalPiecesShopping === 'false') ? false : true);
                                    flags['enableclickandcollect'] = (localConf.enableclickandcollect && (localConf.enableclickandcollect.indexOf("false") > -1 || localConf.enableclickandcollect === 'false') ? false : true);
                                    flags['disablecomparisonfeature'] = (localConf.disablecomparisonfeature && (localConf.disablecomparisonfeature.indexOf("false") > -1 || localConf.disablecomparisonfeature === 'false') ? false : true);
                                    flags['enableSmooshesPDP'] = (localConf.enableSmooshesPDP && (localConf.enableSmooshesPDP.indexOf("false") > -1 || localConf.enableSmooshesPDP === 'false') ? false : true);
                                    flags['enableSmooshesPLP'] = (localConf.enableSmooshesPLP && (localConf.enableSmooshesPLP.indexOf("false") > -1 || localConf.enableSmooshesPLP === 'false') ? false : true);
                                    flags['giftWrapEnabled'] = (localConf.giftWrapEnabled && (localConf.giftWrapEnabled.indexOf("false") > -1 || localConf.giftWrapEnabled === 'false') ? false : true);
                                    flags['enableclicktobuy'] = (localConf.enableclicktobuy && (localConf.enableclicktobuy.indexOf("false") > -1 || localConf.enableclicktobuy === 'false') ? false : true);
                                    flags['enableeddforsoftline'] = (localConf.enableeddforsoftline && (localConf.enableeddforsoftline.indexOf("false") > -1 || localConf.enableeddforsoftline === 'false') ? false : true);


                                }
                                return flags;

                            },
                            _pushFlagsToCoherence = async (req, flags) => {
                                    try {
                                        let cacheNames = settings[process.env.ENVIRONMENT]['cacheNames'];
                                        if (!cacheNames || typeof cacheNames === 'undefined') {
                                            cacheNames = settings['sit']['cacheNames'];
                                        }
                                        let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                                        if (typeof services === 'undefined') {
                                            services = settings['sit']['listofServicesForCoherence'];
                                        }
                                        let allFlag = services['allFlags'];
                                        let resp = null;
                                        let key = null;
                                        if (allFlag) {
                                            key = cacheUtils.getDynamicCacheKey(req, "allThirdPartyFlags_");
                                            resp = await cacheUtils.pushCoherenceData(cacheNames['LP_BCC'], key, flags);
                                            if (resp && resp.response && typeof resp.response !== 'undefined') {
                                                flags = resp.response;
                                            }
                                        }


                                    } catch (e) {

                                    }
                                    return flags;
                                },
                                _fetchPDPDynamicContent = async (req, data) => {
                                        let local = {
                                            "productId": "",
                                            "skuList": "",
                                            "isMarketPlace": "false",
                                            "skuId": "",
                                            "type": "dummy"
                                        };
                                        try {
                                            if (data) {
                                                if (data && (data.endecaProductInfo || data.productVarientsInfo)) {
                                                    const mainContent = (data.endecaProductInfo) ? data.endecaProductInfo.contents[0].mainContent : null;
                                                    local['skuId'] = data.productVarientsInfo && data.productVarientsInfo.skuAttributeMap ? Object.keys(data.productVarientsInfo.skuAttributeMap)[0] : '';
                                                    // Object.keys(data.productVarientsInfo.skuAttributeMap).map((sku) => {
                                                    //     local['skuList'] = local['skuList'] + sku;
                                                    // })
                                                    local['skuList'] = data.productVarientsInfo && data.productVarientsInfo.skuAttributeMap ? Object.keys(data.productVarientsInfo.skuAttributeMap)[0] : '';

                                                    if (mainContent && Object.keys(mainContent).length > 0) {
                                                        let record = null;
                                                        mainContent.map(mainRecord => {
                                                            if (mainRecord['@type'] === 'ProductDetail') {
                                                                record = (mainRecord.record && mainRecord.record.attributes) ? mainRecord.record.attributes : mainRecord.record;
                                                                //console.log("mainRecord.record==",record)
                                                                local['productId'] = record['productId'] ? record['productId'][0] : record['product.repositoryId'][0];
                                                                if (record['productType'] && record['productType'][0]) {
                                                                    local['type'] = record['productType'][0];
                                                                }
                                                                if (record['isMarketPlace'] && record['isMarketPlace'][0]) {
                                                                    local['isMarketPlace'] = record['isMarketPlace'][0];
                                                                }
                                                                if (!local['skuId'] && record['sku.repositoryId'] && record['sku.repositoryId'][0]) {
                                                                    local['skuId'] = record['sku.repositoryId'][0];
                                                                    local['skuList'] = record['sku.repositoryId'][0]
                                                                }

                                                            }
                                                        });
                                                    }

                                                }
                                                if (data && data.collectionProductInfo && data.collectionProductInfo['product.repositoryId'] && data.collectionProductInfo['sku.repositoryId']) {
                                                    local['productId'] = data.collectionProductInfo['product.repositoryId'] ? data.collectionProductInfo['product.repositoryId'][0] : '';
                                                    local['skuId'] = data.collectionProductInfo['sku.repositoryId'] ? data.collectionProductInfo['sku.repositoryId'][0] : '';
                                                    local['type'] = data.collectionProductInfo['productType'] ? data.collectionProductInfo['productType'][0] : '';
                                                    local['skuList'] = local['skuId'];
                                                }
                                                let localpayload = local;
                                                if (localpayload && (!localpayload["type"] || typeof localpayload["type"] === 'undefined' ||
                                                        localpayload["type"].trim() === '')) {
                                                    localpayload["type"] = 'dummy';
                                                }
                                                // console.log("localpayloadlocalpayload", localpayload)
                                                let URL = _getFinalServiceURL(appProperties.getPDPUncachedData, req);
                                                const resp = await _serviceReq(req, URL, 'POST', localpayload);
                                                return resp;
                                            }
                                        } catch (e) {
                                            console.error("getpdp un cached data errror", e)
                                        }
                                    },
                                    _fileNotFound = async (req, reply, app) => {
                                            try {
                                                const PageNotFound = '/pages/404error';
                                                let EndecaStaticContentURL = _getFinalServiceURL(appProperties.getEndecaStaticContent, req);
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
                                                    let headerDetails = _getHeaderDetails(req);
                                                    let port = process.env.PORT;
                                                    if (port === "80" || port === '443') {
                                                        port = '';
                                                    } else {
                                                        port = ':' + port
                                                    }

                                                    const brandName = headerDetails && headerDetails.brand || 'LP';


                                                    // loggerHandler.debug('404 page path & Name :: [', __dirname + '/../../static/404' + brandName.toLowerCase() + '.html]');

                                                    const _data = fs.readFileSync(__dirname + '/../../static/404' + brandName.toLowerCase() + '.html', 'utf8')

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
                                        _FetchStaticPagesFromCoherence = async (req, pageName, Pagekey) => {
                                                try {
                                                    const EndecaStaticContentURL = _getFinalServiceURL(appProperties.getEndecaStaticContent, req);
                                                    let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
                                                    if (typeof services === 'undefined' || !services) {
                                                        services = settings['sit']['listofServicesForCoherence'];
                                                    }
                                                    let staticPageCohFlag = services['staticPages'];
                                                    let EndecaStaticContentResponse = {};
                                                    let key = cacheUtils.getDynamicCacheKey(req, "staticPage_" + Pagekey + "_");
                                                    if (staticPageCohFlag) {
                                                        resp = await cacheUtils.retrieveCoherenceData(req, key);
                                                        if (resp && resp.response && typeof resp.response !== 'undefined') {
                                                            EndecaStaticContentResponse = resp.response;
                                                        } else {
                                                            EndecaStaticContentResponse = await _serviceReq(req, EndecaStaticContentURL + pageName, 'GET', undefined);
                                                            if (EndecaStaticContentResponse && EndecaStaticContentResponse.data && EndecaStaticContentResponse.data.status && EndecaStaticContentResponse.data.status.status === '0') {
                                                                const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, EndecaStaticContentResponse.data, resp['flag']);
                                                            }
                                                        }
                                                    } else {
                                                        EndecaStaticContentResponse = await _serviceReq(req, EndecaStaticContentURL + pageName, 'GET', undefined);
                                                        if (EndecaStaticContentResponse && EndecaStaticContentResponse.data && EndecaStaticContentResponse.data.status && EndecaStaticContentResponse.data.status.status === '0') {
                                                            const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, EndecaStaticContentResponse.data, resp['flag']);
                                                        }

                                                    }
                                                    return (EndecaStaticContentResponse.data ? EndecaStaticContentResponse.data : EndecaStaticContentResponse);
                                                } catch (e) {
                                                    //console.log("eeeeeeeeeee", e)
                                                    return {};
                                                }

                                            },
                                            _isMultisite = (req) => {
                                                const headerDetails = _getHeaderDetails(req);
                                                const brandName = headerDetails && headerDetails.brand || 'LP';
                                                if (brandName === 'LP') {
                                                    return false;
                                                } else {
                                                    return true;
                                                }
                                            };

unEntity = (str) => {
    return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
_getInitialDataOnStartUp = async (req, app) => {
    //console.log('_getInitialDataOnStartUp', req.headers.host)
    let SiteData = [];
    let brandName = '';
    let str = req.headers.host;
    if (str.search("westelm.com") !== -1) {
        SiteData = app.siteData.WLMData;
        brandName = 'WLM';
    } else if (str.search("williams-sonoma.com") !== -1) {
        SiteData = app.siteData.WSData;
        brandName = 'WS';
    } else if (str.search("potterybarn.com") !== -1) {
        SiteData = app.siteData.PBData;
        brandName = 'PB';
    } else if (str.search("potterybarnkids.com") !== -1) {
        SiteData = app.siteData.PBKData;
        brandName = 'PBK';
    } else if (str.search("pbteen.com") !== -1) {
        SiteData = app.siteData.PBTData;
        brandName = 'PBT';
    } else {
        SiteData = app.siteData.LPData;
        brandName = 'LP';
    }
    //console.log(' checking :::: ', brandName);

    if (typeof SiteData === 'undefined') {
        //console.log(' SiteData is null :::: ', brandName);
        const {
            error,
            siteData
        } = await _siteDatabyNameAndBrand('all', brandName);
        if (siteData && siteData[brandName + 'Data']) {
            SiteData = siteData[brandName + 'Data']
            app.siteData[brandName + 'Data'] = SiteData;
        }
    }

    let departmentData = SiteData && SiteData.departments || null,
        headerFooter = SiteData && SiteData.header && SiteData.header.headerContent || null,
        footerData = SiteData && SiteData.footer && SiteData.footer.footerContent || null,
        checkoutHeaderData = SiteData && SiteData.checkoutheader || null,
        checkoutFooterData = SiteData && SiteData.checkoutfooter || null,
        labelsData = SiteData && SiteData.static || null,
        configurationData = SiteData && SiteData.config || null,
        limitedPiecesSkusData = SiteData && SiteData.limitedpiecesskus || null;

    enableNodeLog && console.log(`Cache Data version =====> process id is ${process.env.pm_id} `, app.siteData.version);
    // pageProps optimization change Start
    return {
        headerFooter,
        footerData: undefined, // pageProps optimization change Start
        checkoutHeaderData,
        checkoutFooterData: undefined, // pageProps optimization change Start
        labelsData,
        configurationData,
        limitedPiecesSkusData,
        departmentData: undefined // pageProps optimization change Start
    }
    // pageProps optimization change End
};

_invalidateSiteInitialData = async (req, app) => {
    if (req.query.cacheNames && req.query.brand) {
        // process.send({msgType: 'message', message: 'Hello send me a msg'});
        let listofProcessIDs = [];
        const {
            error,
            siteData
        } = await _siteDatabyNameAndBrand(req.query.cacheNames, req.query.brand);

        /**
         * IF its running in development mode for testing purpose
         */
        if (process.env.NODE_ENV === 'development') {
            app.siteData = siteData;
            enableNodeLog && console.log("Cache Data version =====>", app.siteData.version);
        }

        if (siteData === null) {
            return {
                error: error,
                siteData: 'invalid parameters'
            };
        }

        pm2.list(function (err, processDescriptionList) {
            processDescriptionList.forEach(function (list) {
                listofProcessIDs.push(list.pm_id);
                pm2.sendDataToProcessId(list.pm_id, {
                        type: 'process:msg',
                        data: siteData,
                        topic: "updateInitialDataOnStartUp"
                    },
                    function (err, res) {
                        console.error(err);
                    }
                );
            });
        });
        pm2.disconnect();
        return {
            error: false,
            siteData
        }
    }
    return {
        error: true,
        siteData: 'cache not flushed'
    }
};

_siteDatabyNameAndBrand = async (cacheNames, brand) => {
        /**
         * Listing all the sites and respective brands
         */
        let multi_sites = [{
                host: 'liverpool.com.mx',
                brand: 'LP'
            },
            {
                host: 'williams-sonoma.com.mx',
                brand: 'WS'
            },
            {
                host: 'potterybarn.com.mx',
                brand: 'PB'
            },
            {
                host: 'potterybarnkids.com.mx',
                brand: 'PBK'
            },
            {
                host: 'pbteen.com.mx',
                brand: 'PBT'
            },
            {
                host: 'westelm.com.mx',
                brand: 'WLM'
            }
        ];

        /**
         * If brand is MS then get all sites except liverpool
         * if brand is LP then get only liverpool site. 
         * if brand is All then get all sites including LP and Multi sites.
         */
        if (brand.toLowerCase() === 'ms') {
            multi_sites.shift();
        } else if (brand.toLowerCase() === 'lp') {
            multi_sites = [multi_sites[0]];
        } else if (brand.toLowerCase() === 'all') {
            multi_sites = multi_sites;
        } else if (brand.trim().length > 0) {
            multi_sites = multi_sites.filter(p => p.brand.toLocaleUpperCase() === brand.toLocaleUpperCase());
        } else {
            return null;
        }

        /**
         * Passing header information to api calls
         */
        let localheaders = {
            "brand": 'LP',
            "channel": 'web',
            "lp-correlation-id": process.env.COR_ID,
            "lp-auth-header": process.env.AUTH_KEY || '0DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
            "requested-header": "",
            "Cookie": '',
            "Host": ''
        }

        /**
         * Caching service names
         */
        let promises = {},
            defaultCacheNames = ["departments", "header", "footer", "static", "config", "limitedpiecesskus", "checkoutheader", "checkoutfooter"];
        cacheNames = cacheNames.split(",");
        if (cacheNames.includes("all")) {
            cacheNames = defaultCacheNames;
        } else {
            /**
             * Action item is pending need to trigger particular call
             */
            cacheNames = defaultCacheNames;
            /*cacheNames = cacheNames.filter(function(item) {
                return defaultCacheNames.includes(item);
            });*/
        }
        handleNetErr = function (e) {
            return e
        };

        multi_sites.forEach(function (site, index) {
            let headers = Object.assign({}, localheaders);
            headers['Host'] = process.env.HOST_PREFIX ? process.env.HOST_PREFIX + '.' + site.host : 'pwasit' + '.' + site.host;
            headers['brand'] = site.brand;
            headers['requested-header'] = process.env.HOST_PREFIX ? process.env.HOST_PREFIX + '.' + site.host : 'pwasit' + '.' + site.host;
            promises[site.brand] = [];
            cacheNames.forEach(function (name) {
                if (name.trim().toLowerCase() === 'config') {
                    promises[site.brand].push(
                        axios.post(process.env.SERVICE_PATH + '/getConfiguration', {}, {
                            headers: headers
                        }),
                    );
                }
                if (name.trim().toLowerCase() === 'static') {
                    promises[site.brand].push(

                        axios.post(process.env.SERVICE_PATH + '/staticLabels', {
                            pageName: ["PWA-META-TAGS-PAGE", "PWA-TECH-SEO-EVERY-PAGE", "PWA-HOME-PAGE", "PWA-CLP-PAGE", "PWA-PLP-PAGE", "PWA-PDP-PAGE", "PWA-SL-PAGE", "PWA-BLP-PAGE", "PWA-TECH-SEO-HOME-PAGE", "PWA-COMPARE-PAGE", "sellerDetailPage", "pwa-shippingPage", "pwa-billingPage", "pwa-promotionPage", "pwa-shoppingCartPage", "pwa-loginPage", "pwa-myAccountPage", "pwa-updateProfilePage", "pwa-creditCardsPage", "pwa-addressPage", "pwa-phonePage", "pwa-changePasswordPage", "pwa-forgotPasswordPage", "pwa-registerPage", "pwa-trackOrderPage", "pwa-orderHistoryPage", "pwa-createInvoicePage", "pwa-subscriptionPage", "pwa-airtimeCheckoutPage", "pwa-orderConfirmationPage"]
                        }, {
                            headers: headers
                        })

                    );
                }
                if (name.trim().toLowerCase() === 'limitedpiecesskus') {
                    promises[site.brand].push(
                        axios.get(process.env.SERVICE_PATH + '/limitedPiecesSkus', {
                            headers: headers
                        })
                    );
                }
                if (name.trim().toLowerCase() === 'checkoutheader') {
                    promises[site.brand].push(
                        axios.get(process.env.SERVICE_PATH + '/getheader', {
                            params: {
                                page: "checkout"
                            },
                            headers: headers
                        })
                    );
                }
                if (name.trim().toLowerCase() === 'checkoutfooter') {
                    promises[site.brand].push(
                        axios.get(process.env.SERVICE_PATH + '/getFooter', {
                            params: {
                                page: "checkout"
                            },
                            headers: headers
                        })
                    );
                }
                if (name.trim().toLowerCase() === 'header') {
                    promises[site.brand].push(
                        axios.get(process.env.SERVICE_PATH + '/getheader', {
                            params: {
                                page: "bs"
                            },
                            headers: headers
                        })
                    );
                }
                if (name.trim().toLowerCase() === 'footer') {
                    promises[site.brand].push(
                        axios.get(process.env.SERVICE_PATH + '/getFooter', {
                            params: {
                                page: "bs"
                            },
                            headers: headers
                        })
                    );
                }
                if (name.trim().toLowerCase() === 'departments') {
                    promises[site.brand].push(
                        axios.get(process.env.SERVICE_PATH + '/getDepartments', {
                            headers: headers
                        })
                    );
                }
            });

        });

        let finalBrands = [];
        multi_sites.forEach(function (site, index) {
            finalBrands.push(axios.all(promises[site.brand]));
        });

        let siteDataStatus = [];

        try {
            let siteData = {};
            siteData['version'] = new Date();
            // console.log(`Load SiteData`);    

            return Promise.all(finalBrands).then(function (response) {
                multi_sites.forEach(function (site, multiIndex) {
                    // console.log('site.brand ===>>>', site.brand);
                    siteData[site.brand + 'Data'] = {};
                    cacheNames.forEach(function (name, index) {
                        if (response[multiIndex][index].data) {
                            siteData[site.brand + 'Data'][name.trim().toLowerCase()] = response[multiIndex][index].data;
                            siteDataStatus.push({
                                brand: site.brand,
                                serviceName: response[multiIndex][index].config.url,
                                status: 'Success'
                            });
                            // siteDataStatus.push({ error: { status: false, msg: '' }, brand: site.brand, status: 'Success' });
                            // logger.info(`Called service for brand :: ${site.brand} for service :: ${name}`);
                        } else {
                            // siteDataStatus.push({ error: { status: true, msg: response[multiIndex][index].config }, brand: site.brand, status: 'fail' });
                            siteDataStatus.push({
                                brand: site.brand,
                                serviceName: response[multiIndex][index].config.url,
                                status: 'Fail'
                            });
                            // logger.error(`Failed to called service for brand :: ${site.brand} :: for service :: ${name}`);
                        }
                    });
                });
                // return { error: { status: false, msg: '' }, siteData };

                return {
                    siteDataStatus: siteDataStatus,
                    error: {
                        status: false,
                        msg: ''
                    },
                    siteData
                };
            }).catch(function (err) {

                logger.error(`Failed to called service for brand :: ${err.config.headers.brand} :: for service :: ${err.config.url}`);
                // siteDataStatus.push({ error: { status: true, msg: err }, brand: err.config.headers.brand, status: 'fail' });
                return {
                    error: {
                        status: true,
                        msg: err
                    },
                    siteData: null
                };
            });
        } catch (e) {
            return {
                error: {
                    status: true,
                    msg: e
                },
                siteData: null
            };
        }
    },
    _getOnlySpecificStaticKeyData = async (labelsData, pageName, onlyPageName) => {
            const array = ['PWA-META-TAGS-PAGE', 'PWA-TECH-SEO-EVERY-PAGE', (typeof pageName === 'string' ? pageName : '')];
            let staticArray = [];
            if (labelsData && labelsData.staticLabelValues) {
                if (typeof onlyPageName === 'boolean' && !onlyPageName) {
                    for (let k in labelsData.staticLabelValues) {
                        if (labelsData.staticLabelValues[k].pageName == array[0]) {
                            staticArray.push(labelsData.staticLabelValues[k]);
                        }
                    }
                    for (let k in labelsData.staticLabelValues) {
                        if (labelsData.staticLabelValues[k].pageName == array[1]) {
                            staticArray.push(labelsData.staticLabelValues[k]);
                        }
                    }
                }
                for (let k in labelsData.staticLabelValues) {
                    if (labelsData.staticLabelValues[k].pageName == array[2]) {
                        staticArray.push(labelsData.staticLabelValues[k]);
                    }
                }
            }
            //console.log("_getOnlySpecificStaticKeyData ",staticArray)
            return staticArray;
        },
        _getOnlyRequiredLimitedData = async (limitedPiecesSkusData, skuArray) => {
            let validList = [];
            //console.log("request for skus",skuArray)
            if (limitedPiecesSkusData && limitedPiecesSkusData.length && limitedPiecesSkusData.length > 0 && skuArray && skuArray.length) {
                validList.push(limitedPiecesSkusData[0]);
                for (let k in limitedPiecesSkusData) {
                    for (let s in skuArray) {
                        if (limitedPiecesSkusData[k].sku === skuArray[s]) {
                            validList.push(limitedPiecesSkusData[k]);
                        }
                    }

                }
            }
            //console.log("request for validList",validList)
            return validList;
        }

module.exports = {
    serviceReq: _serviceReq,
    getFinalServiceURL: _getFinalServiceURL,
    getHeaderFooter: _getHeaderFooter,
    getturntokey: _getturntokey,
    getHeaderDetails: _getHeaderDetails,
    getCookieValueByName: _getCookieValueByName,
    getHeaderNewApproach: _getHeaderNewApproach,
    fetchFlags: _fetchFlags,
    pushFlagsToCoherence: _pushFlagsToCoherence,
    fetchPDPDynamicContent: _fetchPDPDynamicContent,
    fileNotFound: _fileNotFound,
    FetchStaticPagesFromCoherence: _FetchStaticPagesFromCoherence,
    isMultisite: _isMultisite,
    getInitialDataOnStartUp: _getInitialDataOnStartUp,
    getFooterNewApproach: _getFooterNewApproach,
    departmentNewApproach: _departmentNewApproach,
    invalidateSiteInitialData: _invalidateSiteInitialData,
    siteDatabyNameAndBrand: _siteDatabyNameAndBrand,
    getOnlySpecificStaticKeyData: _getOnlySpecificStaticKeyData,
    getOnlyRequiredLimitedData: _getOnlyRequiredLimitedData
};