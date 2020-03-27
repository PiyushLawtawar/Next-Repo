var _cacheServers = {};
const utilities = require('./Utility.js');
const logger = require('../helpers/logUtils');
const Agent = require('agentkeepalive');
const memjs = require('memjs'),
    _ = require('lodash'),
    log = require('./logUtils'),
    appProperties = require('../../client/config/appProperties'),
    settings = require('../../client/config/settings'),
    expires = process.env.NEARCACHETTL || 21600,    // memCache configuration via environment variable 


    https = require('https'),
    http = require('http'),

    url = require('url');
let axiosInstance;
let enableNodeLog = true;
let enableNodeReqResLog = true;
_getCacheServer = (name, req) => {
    let serverName = settings[process.env.ENVIRONMENT]['coherenceEndPoints'][name] || settings['sit']['coherenceEndPoints'][name] || '';
    let ip = process.env.COH_APP_HOST;
    if (!ip || typeof ip === 'undefined') {
        ip = process.env.APP_HOST;
    }
    if (!ip || typeof ip === 'undefined') {
        ip = 'localhost';
    }
    serverName = serverName.replace('IPADDRESS', ip);
    const cacheServer = _cacheServers[name];

    if (!cacheServer) {
        _cacheServers[name] = memjs.Client.create(serverName, {
            keepAlive: true, failover: true,
            timeout: 0.5, retries: 2, retry_delay: 0.2
        });
        return _cacheServers[name];
    } else {
        return cacheServer;
    }
},
    _push = (client, key, value) => {
        if (key && value && !_.isEmpty(value)) {
            //console.log('meJS TTL ==============>>>>>>>>>>>', expires);    // memCache configuration via environment variable 
            return new Promise(function (resolve, reject) {
                client.set(key, JSON.stringify(value), { expires: expires },
                    function (error, data) {
                        if (error) {
                            //log.error('Error occured while pushing to Coherence ::: ', error);
                            if (error && error.toString().indexOf('Internal error') > -1) {
                                console.error("memcache js get method got interal error and making the stored cache servers as empty so that it will recreate the new connections")
                                _cacheServers = {};
                            }
                            resolve(undefined);
                        } else {
                            resolve(data);
                        }
                    }
                );
            });
        } else {
            return "";
        }
    },

    _get = (client, key, req) => {
        return new Promise(function (resolve, reject) {
            client.get(key, function (err, val, flags) {
                if (err) {
                    const msg = err.toString();
                    if (msg.indexOf('Internal error') > -1) {
                        console.error("memcache js get method got interal error and making the stored cache servers as empty so that it will recreate the new connections")
                        _cacheServers = {};
                    }
                    reject(err);
                }
                if (val && typeof val !== 'undefined') {
                    resolve(val);
                } else {
                    resolve("");
                }
            });
        });
    },

    _flush = (client) => {
        return new Promise(function (resolve, reject) {
            client.flush(function (error, results) {
                if (error) {
                    log.error("Coherence Flush Error ::: ", error)
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

    },

    _delete = (client, key) => {
        return new Promise(function (resolve, reject) {
            client.delete(key, function (error, hit) {
                if (error) {
                    log.error("Coherence Delete Error ::: ", error)
                    resolve(error);
                }
                if (hit) {
                    resolve(hit);
                } else {
                    resolve();
                }
            });
        });
    },

    _getConfiguration = async (req) => {
        let environment = settings[process.env.ENVIRONMENT]['cacheNames'];
        if (typeof environment === 'undefined' || !environment) {
            environment = environment['sit']['cacheNames'];
        }
        const cacheSer = await _getCacheServer(environment['LP_BCC']);
        let cacheRes = "";
        const key = _getDynamicCacheKey(req, '', "globalConfig");
        try {
            cacheRes = await _get(cacheSer, key, req);
            if (cacheRes) {
                let cacheRes11 = JSON.parse(cacheRes);
                return cacheRes11;
            } else {
                let path = _getFinalServiceURL(appProperties.getConfiguration, req);
                try {

                    const { data, status, statusText, headers } = await _serviceReq(req, path, 'POST', {});
                    try {
                        const res = await _push(cacheSer, key, data, req);
                    } catch (e) {
                    }
                    if (statusText == 'OK') {
                        return data;
                    } else {
                        return { "code": status, "message": statusText }
                    }
                } catch (e) {
                    log.error(e);
                    return {};
                }
            }
        } catch (e) {
            if (cacheRes) {
                let cacheRes1 = JSON.parse(cacheRes);
                return cacheRes1;
            } else {
                let path = _getFinalServiceURL(appProperties.getConfiguration, req);
                try {
                    const { data, status, statusText, headers } = await _serviceReq(req, path, 'POST', {});
                    try {
                        const res = await _push(cacheSer, key, data, req);
                    } catch (e) {
                    }
                    if (statusText == 'OK') {
                        return data;
                    }
                } catch (e) {
                    log.error(e);   // ATG down comes here.
                    return {};
                }
            }

        }
    },
    _getCoherenceFlagFromConfig = async (req, cacheName) => {
        var flag = 'false';
        const config = await _getConfiguration(req);
        if (config && config.configuration && config.configuration.coherencecacheconfiguration
            && config.configuration.coherencecacheconfiguration.enableGlobalCache
            && (config.configuration.coherencecacheconfiguration.enableGlobalCache == 'true'
                || config.configuration.coherencecacheconfiguration.enableGlobalCache.indexOf('true') > -1)) {
            if (cacheName && typeof cacheName !== 'undefined') {

                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_BCC']) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_CONTENT'] &&
                    config.configuration.coherencecacheconfiguration.enableLPContent &&
                    config.configuration.coherencecacheconfiguration.enableLPContent.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_NON_PDP'] &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaNonPDP &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaNonPDP.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_PDP'] &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaPDP &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaPDP.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_SEARCH'] &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaSearch &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaSearch.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_PLP'] &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaPLP &&
                    config.configuration.coherencecacheconfiguration.enableLPEndecaPLP.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_CONTENT'] &&
                    config.configuration.coherencecacheconfiguration.enableMSContent &&
                    config.configuration.coherencecacheconfiguration.enableMSContent.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_NON_PDP'] &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaNonPDP &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaNonPDP.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_PDP'] &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaPDP &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaPDP.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_SEARCH'] &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaSearch &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaSearch.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_PLP'] &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaPLP &&
                    config.configuration.coherencecacheconfiguration.enableMSEndecaPLP.indexOf('true') > -1) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_THIRDPARTY'] &&
                    config.configuration.coherencecacheconfiguration.enableLPThirdpartyContent &&
                    config.configuration.coherencecacheconfiguration.enableLPThirdpartyContent.indexOf('true') > -1) {
                    return 'true';
                }
            }
        }
        return flag;
    },

    _getCoherenceFlag = async (req, cacheName) => {

        const cacheRes = await _getCoherenceFlagFromConfig(req, cacheName);
        if (cacheRes) {

            return cacheRes.toString().toLowerCase();
        } else {

            return 'false';
        }
    },
    _getCoherenceFlagFromEnv = async (req, cacheName) => {

        if (cacheName) {
            // expecting only string data type value like true or false from environment variables
            const enableGlobalCache = (process.env.enableGlobalCache && typeof process.env.enableGlobalCache !== 'undefined'
                && (process.env.enableGlobalCache === 'false' || process.env.enableGlobalCache.indexOf('false') > -1)) ? false : true;
            const enableLPEAContentCache = (process.env.enableLPEAContentCache && typeof process.env.enableLPEAContentCache !== 'undefined'
                && (process.env.enableLPEAContentCache === 'false' || process.env.enableLPEAContentCache.indexOf('false') > -1)) ? false : true;
            const enableMSEAContentCache = (process.env.enableMSEAContentCache && typeof process.env.enableMSEAContentCache !== 'undefined'
                && (process.env.enableMSEAContentCache === 'false' || process.env.enableMSEAContentCache.indexOf('false') > -1)) ? false : true;
            const enableLPEndecaNonPDP = (process.env.enableLPEndecaNonPDP && typeof process.env.enableLPEndecaNonPDP !== 'undefined'
                && (process.env.enableLPEndecaNonPDP === 'false' || process.env.enableLPEndecaNonPDP.indexOf('false') > -1)) ? false : true;
            const enableLPEndecaPDP = (process.env.enableLPEndecaPDP && typeof process.env.enableLPEndecaPDP !== 'undefined'
                && (process.env.enableLPEndecaPDP === 'false' || process.env.enableLPEndecaPDP.indexOf('false') > -1)) ? false : true;
            const enableLPEndecaSearch = (process.env.enableLPEndecaSearch && typeof process.env.enableLPEndecaSearch !== 'undefined'
                && (process.env.enableLPEndecaSearch === 'false' || process.env.enableLPEndecaSearch.indexOf('false') > -1)) ? false : true;
            const enableLPEndecaPLP = (process.env.enableLPEndecaPLP && typeof process.env.enableLPEndecaPLP !== 'undefined'
                && (process.env.enableLPEndecaPLP === 'false' || process.env.enableLPEndecaPLP.indexOf('false') > -1)) ? false : true;
            const enableMSEndecaNonPDP = (process.env.enableMSEndecaNonPDP && typeof process.env.enableMSEndecaNonPDP !== 'undefined'
                && (process.env.enableMSEndecaNonPDP === 'false' || process.env.enableMSEndecaNonPDP.indexOf('false') > -1)) ? false : true;
            const enableMSEndecaPDP = (process.env.enableMSEndecaPDP && typeof process.env.enableMSEndecaPDP !== 'undefined'
                && (process.env.enableMSEndecaPDP === 'false' || process.env.enableMSEndecaPDP.indexOf('false') > -1)) ? false : true;
            const enableMSEndecaSearch = (process.env.enableMSEndecaSearch && typeof process.env.enableMSEndecaSearch !== 'undefined'
                && (process.env.enableMSEndecaSearch === 'false' || process.env.enableMSEndecaSearch.indexOf('false') > -1)) ? false : true;
            const enableMSEndecaPLP = (process.env.enableMSEndecaPLP && typeof process.env.enableMSEndecaPLP !== 'undefined'
                && (process.env.enableMSEndecaPLP === 'false' || process.env.enableMSEndecaPLP.indexOf('false') > -1)) ? false : true;

            if (enableGlobalCache) {
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_BCC']) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_CONTENT'] && enableLPEAContentCache) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_CONTENT'] && enableMSEAContentCache) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_NON_PDP'] && enableLPEndecaNonPDP) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_PDP'] && enableLPEndecaPDP) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_SEARCH'] && enableLPEndecaSearch) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['LP_PLP'] && enableLPEndecaPLP) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_NON_PDP'] && enableMSEndecaNonPDP) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_PDP'] && enableMSEndecaPDP) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_SEARCH'] && enableMSEndecaSearch) {
                    return 'true';
                }
                if (cacheName === settings[process.env.ENVIRONMENT]['cacheNames']['MS_PLP'] && enableMSEndecaPLP) {
                    return 'true';
                }
            } else {
                return 'false';
            }
        }
        return 'false';
    },
    _getDynamicCacheKey = (req, providedKey, dynamicId) => {
        let brand = 'LP';
        let domainName = '';
        let hostname = req.headers.host;
        if (hostname && typeof hostname !== 'undefined') {
            hostname = hostname.split(":")[0];
            domainName = hostname.replace(/.+?\./, '');
            switch (domainName) {
                case 'williams-sonoma.com.mx':
                    brand = 'WS';
                    break;
                case 'potterybarn.com.mx':
                    brand = 'PB';
                    break;
                case 'potterybarnkids.com.mx':
                    brand = 'PBK';
                    break;
                case 'pbteen.com.mx':
                    brand = 'PBT';
                    break;
                case 'westelm.com.mx':
                    brand = 'WLM';
                    break;
                default:
                    brand = 'LP';
            }
        }
        let currentKey = providedKey + brand + "_";
        if (dynamicId && typeof dynamicId !== 'undefined') {
            currentKey = currentKey + dynamicId;
        }

        return currentKey;
    },
    _getDynamicSearchCacheName = (req) => {
        let brand = 'LP';
        let domainName = '';
        let cacheNames = settings[process.env.ENVIRONMENT]['cacheNames'];
        if (!cacheNames || typeof cacheNames === 'undefined') {
            cacheNames = settings['sit']['cacheNames'];
        }
        let hostname = req.headers.host;
        if (hostname && typeof hostname !== 'undefined') {
            hostname = hostname.split(":")[0];
            domainName = hostname.replace(/.+?\./, '');
            switch (domainName) {
                case 'williams-sonoma.com.mx':
                    brand = 'WS';
                    break;
                case 'potterybarn.com.mx':
                    brand = 'PB';
                    break;
                case 'potterybarnkids.com.mx':
                    brand = 'PBK';
                    break;
                case 'pbteen.com.mx':
                    brand = 'PBT';
                    break;
                case 'westelm.com.mx':
                    brand = 'WLM';
                    break;
                default:
                    brand = 'LP';
            }
        }
        if (!brand || brand === 'LP') {
            return cacheNames['LP_SEARCH'];
        } else {
            return cacheNames['MS_SEARCH'];
        }
    }, _getDynamicPDPCacheName = (req) => {
        let brand = 'LP';
        let domainName = '';
        let cacheNames = settings[process.env.ENVIRONMENT]['cacheNames'];
        if (!cacheNames || typeof cacheNames === 'undefined') {
            cacheNames = settings['sit']['cacheNames'];
        }
        let hostname = req.headers.host;
        if (hostname && typeof hostname !== 'undefined') {
            hostname = hostname.split(":")[0];
            domainName = hostname.replace(/.+?\./, '');
            switch (domainName) {
                case 'williams-sonoma.com.mx':
                    brand = 'WS';
                    break;
                case 'potterybarn.com.mx':
                    brand = 'PB';
                    break;
                case 'potterybarnkids.com.mx':
                    brand = 'PBK';
                    break;
                case 'pbteen.com.mx':
                    brand = 'PBT';
                    break;
                case 'westelm.com.mx':
                    brand = 'WLM';
                    break;
                default:
                    brand = 'LP';
            }
        }
        if (!brand || brand === 'LP') {
            return cacheNames['LP_PDP'];
        } else {
            return cacheNames['MS_PDP'];
        }
    },
    _getDynamicPLPCacheName = (req) => {
        let brand = 'LP';
        let domainName = '';
        let cacheNames = settings[process.env.ENVIRONMENT]['cacheNames'];
        if (!cacheNames || typeof cacheNames === 'undefined') {
            cacheNames = settings['sit']['cacheNames'];
        }
        let hostname = req.headers.host;
        if (hostname && typeof hostname !== 'undefined') {
            hostname = hostname.split(":")[0];
            domainName = hostname.replace(/.+?\./, '');
            switch (domainName) {
                case 'williams-sonoma.com.mx':
                    brand = 'WS';
                    break;
                case 'potterybarn.com.mx':
                    brand = 'PB';
                    break;
                case 'potterybarnkids.com.mx':
                    brand = 'PBK';
                    break;
                case 'pbteen.com.mx':
                    brand = 'PBT';
                    break;
                case 'westelm.com.mx':
                    brand = 'WLM';
                    break;
                default:
                    brand = 'LP';
            }
        }
        if (!brand || brand === 'LP') {
            return cacheNames['LP_PLP'];
        } else {
            return cacheNames['MS_PLP'];
        }

    },
    _getDynamicNONPDPCacheName = (req) => {
        let brand = 'LP';
        let domainName = '';
        let cacheNames = settings[process.env.ENVIRONMENT]['cacheNames'];
        if (!cacheNames || typeof cacheNames === 'undefined') {
            cacheNames = settings['sit']['cacheNames'];
        }
        let hostname = req.headers.host;
        if (hostname && typeof hostname !== 'undefined') {
            hostname = hostname.split(":")[0];
            domainName = hostname.replace(/.+?\./, '');
            switch (domainName) {
                case 'williams-sonoma.com.mx':
                    brand = 'WS';
                    break;
                case 'potterybarn.com.mx':
                    brand = 'PB';
                    break;
                case 'potterybarnkids.com.mx':
                    brand = 'PBK';
                    break;
                case 'pbteen.com.mx':
                    brand = 'PBT';
                    break;
                case 'westelm.com.mx':
                    brand = 'WLM';
                    break;
                default:
                    brand = 'LP';
            }
        }
        if (!brand || brand === 'LP') {
            return cacheNames['LP_NON_PDP'];
        } else {
            return cacheNames['MS_NON_PDP'];
        }

    },
    _retrieveCoherenceData = async (req, Coherencekey) => {
        let CoherenceCacheName = '';
        let brand = 'LP';
        let domainName = '';
        let hostname = req.headers.host;
        let flag = null;
        let returnResp = { "flag": null, "cacheName": '', "response": null };
        let cacheNames = settings[process.env.ENVIRONMENT]['cacheNames'];
        if (!cacheNames || typeof cacheNames === 'undefined') {
            cacheNames = settings['sit']['cacheNames'];
        }
        if (Coherencekey.indexOf('catalogendeca') > -1) {
            CoherenceCacheName = _getDynamicPDPCacheName(req);
        } else
            if (Coherencekey.indexOf('keyword') > -1) {
                CoherenceCacheName = _getDynamicSearchCacheName(req);
            } else
                if (Coherencekey.indexOf('limitedPieces') > -1 || Coherencekey.indexOf('category') > -1 || Coherencekey.indexOf('header') > -1) {
                    CoherenceCacheName = _getDynamicNONPDPCacheName(req);
                } else
                    if (Coherencekey.indexOf('limitedPieces') > -1) {
                        CoherenceCacheName = cacheNames['LP_THIRDPARTY'];
                    } else
                        if (Coherencekey.indexOf('staticlabel') > -1 || Coherencekey.indexOf('configuration_') > -1 || Coherencekey.indexOf('ThirdPartyFlag') > -1) {
                            CoherenceCacheName = cacheNames['LP_BCC'];
                        } else if (hostname && typeof hostname !== 'undefined') {
                            hostname = hostname.split(":")[0];
                            domainName = hostname.replace(/.+?\./, '');
                            switch (domainName) {
                                case 'williams-sonoma.com.mx':
                                    brand = 'WS';
                                    CoherenceCacheName = cacheNames['MS_CONTENT'];
                                    break;
                                case 'potterybarn.com.mx':
                                    brand = 'PB';
                                    CoherenceCacheName = cacheNames['MS_CONTENT'];
                                    break;
                                case 'potterybarnkids.com.mx':
                                    brand = 'PBK';
                                    CoherenceCacheName = cacheNames['MS_CONTENT'];
                                    break;
                                case 'pbteen.com.mx':
                                    brand = 'PBT';
                                    CoherenceCacheName = cacheNames['MS_CONTENT'];
                                    break;
                                case 'westelm.com.mx':
                                    brand = 'WLM';
                                    CoherenceCacheName = cacheNames['MS_CONTENT'];
                                    break;
                                default:
                                    brand = 'LP';
                                    CoherenceCacheName = cacheNames['LP_CONTENT'];
                            }
                        }
        returnResp['cacheName'] = CoherenceCacheName;
        if (!Coherencekey || typeof Coherencekey === 'undefined') {
            return null;
        }
        try {
            flag = await _getCoherenceFlagFromEnv(req, CoherenceCacheName);
            let cacheRes = null;
            let cacheSer = null;
            //console.log("flag= ",flag,CoherenceCacheName,Coherencekey)
            if (flag && (flag === 'true' || JSON.stringify(flag).indexOf('true') > -1)) {
                try {
                    cacheSer = await _getCacheServer(CoherenceCacheName);
                    cacheRes = await _get(cacheSer, Coherencekey);
                } catch (e) { }
                if (cacheRes) {
                    // console.log('--------- data from coherence ----------------',CoherenceCacheName)
                    // _pushCoherenceData(CoherenceCacheName, Coherencekey, cacheRes, flag);
                    return { "flag": flag, "cacheName": CoherenceCacheName, "response": JSON.parse(cacheRes) };
                } else if (Coherencekey.indexOf('category') > -1 && Coherencekey.indexOf('carousels') < 0) {
                    CoherenceCacheName = _getDynamicPLPCacheName(req);
                    //console.log("flag= ",flag,CoherenceCacheName,Coherencekey)
                    try {
                        cacheSer = await _getCacheServer(CoherenceCacheName);
                        cacheRes = await _get(cacheSer, Coherencekey);
                        if (cacheRes) {
                            // console.log('--------- data from coherence ----------------',CoherenceCacheName)
                            return { "flag": flag, "cacheName": CoherenceCacheName, "response": JSON.parse(cacheRes) };
                        }
                    } catch (e) {
                        console.error(" plp coherence error", e)
                    }
                    returnResp['cacheName'] = CoherenceCacheName;
                    return returnResp;

                }
            } else {
                returnResp['flag'] = 'false';
            }
        } catch (error) {
            console.error("error when getting coherence data ", error);
        }
        return returnResp;
    },
    _pushCoherenceData = async (CoherenceCacheName, Coherencekey, data) => {
        flag = await _getCoherenceFlagFromEnv(null, CoherenceCacheName);
        if (!Coherencekey || typeof Coherencekey === 'undefined') {
            return null;
        }

        if (flag && (flag === 'true' || JSON.stringify(flag).indexOf('true') > -1) && CoherenceCacheName) {
            //console.log('--------- pushing the data to coherence ----------------',CoherenceCacheName,Coherencekey)
            cacheSer = await _getCacheServer(CoherenceCacheName);
            const res = await _push(cacheSer, Coherencekey, data);
        }
    },
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
        clientConfig.TimeoutBS = browseAndShop.timeout;
        clientConfig.TimeoutCart = cart.timeout;
        clientConfig.TimeoutCheckout = checkout.timeout;
        clientConfig.TimeoutAccount = myAccount.timeout;
        clientConfig.TimeoutDefault = defaultTimeOut;

        if (_clientConfig.length > 0) {
            try {
                _clientConfig = JSON.parse(_clientConfig);
                clientConfig.EnableNodeLog = _clientConfig.EnableNodeLog;
                clientConfig.EnableNodeReqResLog = _clientConfig.EnableNodeReqResLog;
                clientConfig.TimeoutCart = _clientConfig.TimeoutCart;
                clientConfig.TimeoutCheckout = _clientConfig.TimeoutCheckout;
                clientConfig.TimeoutCheckout = _clientConfig.TimeoutCheckout;
                clientConfig.TimeoutDefault = _clientConfig.TimeoutDefault;

            } catch (ex) {
                _clientConfig = {};
            }
            Object.assign(clientConfig, _clientConfig);
        }

        let serviceTimeOut = _getServiceTimeout(path, clientConfig);
        enableNodeLog = (clientConfig.EnableNodeLog && clientConfig.EnableNodeLog.toString().toLocaleLowerCase() === "true") ? true : false;
        enableNodeReqResLog = (clientConfig.EnableNodeReqResLog && clientConfig.EnableNodeReqResLog.toString().toLocaleLowerCase() === "true") ? true : false;

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

        enableNodeLog && enableNodeReqResLog && logger.info('EA Calling AA serviceReq :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] :: serviceTimeOut [' + serviceTimeOut / 1000 + ' in sec.]');


        if (payload) {
            enableNodeLog && enableNodeReqResLog && logger.info('EA Calling AA serviceReq :: correlationID [' + correlationID + '] :: payload [' + JSON.stringify(payload) + ']');
        }

        const applicationQueryString = req.query;

        const serviceQueryString = _getQueryString(path);

        if (Object.keys(applicationQueryString).indexOf('showkey') >= 0 && type === 'POST') {
            // if (Object.keys(applicationQueryString).indexOf('showkey') >=0){
            if (Object.keys(serviceQueryString).length > 0) {
                path = path + "&showkey='" + applicationQueryString.showkey + "'"
            } else {
                path = path + "?showkey='" + applicationQueryString.showkey + "'"
            }
        }

        let userHeaders = {}
        if (request_from.length > 0) {
            userHeaders = {
                'request_from': 'changePassword'
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
            "Cookie": headersCookie
        }

        Object.assign(headers, userHeaders);

	    let socketTimeout = parseInt(process.env.SOCKET_TIMEOUT || 10000);  // Convert timeout in int

        // updated  Keep Alive setting :: Start 
        const keepAliveConfig = {
            keepAlive: JSON.parse((process.env.KEEP_ALIVE || 'true').toLowerCase()),
            maxSockets: parseInt(process.env.CONNECTION_MAXSOCKETS || '256'),
            keepAliveMsecs: parseInt(process.env.CONNECTION_KEEPALIVEMSECS || '1000'),
            maxFreeSockets: parseInt(process.env.CONNECTION_MAXFREESOCKETS || '256'),   // adding maxFreeSockets 
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
                maxSockets: parseInt(process.env.CONNECTION_MAXSOCKETS || '256'),
                maxFreeSockets: parseInt(process.env.CONNECTION_MAXFREESOCKETS || '256'),   // adding maxFreeSockets ,
                timeout: socketTimeout,
                freeSocketTimeout: freeSocketTimeout,
                socketActiveTTL: socketActiveTTL
            });
            httpsAgent = new Agent({
                maxSockets: parseInt(process.env.CONNECTION_MAXSOCKETS || '256'),
                maxFreeSockets: parseInt(process.env.CONNECTION_MAXFREESOCKETS || '256'),   // adding maxFreeSockets ,
                timeout: socketTimeout,
                freeSocketTimeout: freeSocketTimeout,
                socketActiveTTL: socketActiveTTL
            });
        }


        let response

        if (axiosInstance == undefined) {
            console.log('cache Utils axiosInstance is not exist :: Creating axiosInstance ');
            axiosInstance = axios.create({
                host: 'jsonplaceholder.typicode.com',
                responseType: 'json',
                httpAgent: httpAgent,
                httpsAgent: httpsAgent,
            });
        } else {
            console.log('cache Utils Singleton ======================= axiosInstance');
        }
        axiosInstance.defaults.headers = headers;

        try {
            response = await axiosInstance({
                method: type,
                url: path,
                data: payload,
            });
            // logger.info('EA Calling AA serviceReq Success :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] :: serviceTimeOut [' + serviceTimeOut / 1000 + ' in sec.]');

        } catch (ex) {
            response = {};
            response.headers = {};
            response.status = 404;
            logger.error('EA Calling AA serviceReq Error :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] :: serviceTimeOut [' + serviceTimeOut / 1000 + ' in sec.]');
            console.error('error=======>>>', ex);
        }

        // try {
        //     response = await axios({
        //         method: type,
        //         host: 'jsonplaceholder.typicode.com',
        //         url: path,
        //         responseType: 'json',
        //         //timeout: serviceTimeOut,
        //         data: payload,
        //         httpsAgent: httpsAgent,   // updated  Keep Alive setting
        //         httpAgent: httpAgent,     // updated  Keep Alive setting
        //         headers: headers
        //     });
        //     // logger.info('EA Calling AA serviceReq Success :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] :: serviceTimeOut [' + serviceTimeOut / 1000 + ' in sec.]');

        // } catch (ex) {
        //     response = {};
        //     response.headers = {};
        //     response.status = 404;
        //     logger.error('EA Calling AA serviceReq Error :: correlationID [' + correlationID + '] :: Service URL [' + path + ']' + ' :: EA Domain Name [' + req.info.hostname + ']  [' + jSessionID + '] :: serviceTimeOut [' + serviceTimeOut / 1000 + ' in sec.]');
        //     console.error('error=======>>>', ex);
        // }

        return response;
    }, _getFinalServiceURL = (requiredPath, req) => {
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
                previewInstance = (process.env.INSTANCE_NAME && typeof process.env.INSTANCE_NAME !== 'undefined'
                    && JSON.stringify(process.env.INSTANCE_NAME).indexOf("preview") > -1);


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
            } catch (e) { }
        }
        if (!servicePath) {
            servicePath = process.env.SERVICE_PATH
        }
        return servicePath + requiredPath;
    },
    _checkGWPPDPRequest = async (response) => {
        let gwp = 'false';
        if (response && typeof response !== 'undefined' && response.productVarientsInfo && response.productVarientsInfo.gwpPromotions
            && response.productVarientsInfo.gwpPromotions.giftItems && typeof response.productVarientsInfo.gwpPromotions.giftItems !== 'undefined') {
            return 'true';
        }
        return gwp;
    }
    ;

module.exports = {
    getCacheServer: _getCacheServer,
    push: _push,
    get: _get,
    flush: _flush,
    delete: _delete,
    retrieveCoherenceData: _retrieveCoherenceData,
    pushCoherenceData: _pushCoherenceData,
    getDynamicCacheKey: _getDynamicCacheKey,
    // getCoherenceFlag: _getCoherenceFlag,
    getCoherenceFlag: _getCoherenceFlagFromEnv,
    getDynamicNONPDPCacheName: _getDynamicNONPDPCacheName,
    getDynamicPDPCacheName: _getDynamicPDPCacheName,
    getConfiguration: _getConfiguration,
    checkGWPPDPRequest: _checkGWPPDPRequest,
};
