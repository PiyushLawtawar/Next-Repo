const { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } = require('../../server/nextwrapper');
const utilities = require('../helpers/Utility.js');
const logger = require('../helpers/logUtils');
const cacheUtils = require('../helpers/cacheUtils.js');
const appProperties = require('../../client/config/appProperties.js'),
    settings = require('../../client/config/settings');
const _ = require('lodash');
// import get from 'lodash/get';

const staticFiles = require('../controllers/staticFiles')
module.exports = {
    homePage: async (req, reply, app) => {
        try {

            // const headerFooter = await utilities.getHeaderFooter(req, true);
            let homePageApi = utilities.getFinalServiceURL(appProperties.homePage, req);
            const homePageData = await utilities.serviceReq(req, homePageApi, 'POST', { "appName": "homepage" })
            // const staticLabelsApi = utilities.getFinalServiceURL(appProperties.staticLabels,req);
            /* commented intensionally for performance also done unit testing */
            // const staticLabelData = await utilities.serviceReq(req, staticLabelsApi, 'POST', { pageName: ["PWA-META-TAGS-PAGE", "PWA-TECH-SEO-EVERY-PAGE", "PWA-TECH-SEO-HOME-PAGE"] });
            // const CartHeaderDetailsURL = utilities.getFinalServiceURL(appProperties.getCartHeaderDetails,req);
            const loginData = { "data": {} };//await utilities.serviceReq(req, CartHeaderDetailsURL, 'POST', {});
            const data = Object.assign({}, homePageData.data);

            if ((homePageData && homePageData.status && homePageData.status === 404) || (homePageData && homePageData.data && _.isEmpty(homePageData.data)) || (homePageData && homePageData.data.code >= 500 && homePageData.data.code <= 510) || (homePageData && homePageData.data && homePageData.data.s === "1")) {

                // console.log("Service run time Error....."); // Show 404
                return staticFiles.fileNotFound(req, reply, app);
            } else {
                // console.log("Success")
            }

            // const finalData = { homePageContent: data, footerContent: headerFooter.footer, headerContent: headerFooter.header, hostname: req.info.hostname }
            if (req.query.isajax) {
                const finalData = { homePageContent: data };
                return reply.response(finalData);
            }
            const { headerFooter, footerData, labelsData, configurationData, departmentData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const result = {
                homePageContent: data,
                footerContent: footerData,
                headerContent: headerFooter,
                hostname: req.info.hostname,
                url: req.path,
                seoContent: labelsData,
                loginData: loginData.data,
                staticLabelValues: labelsData,
                configurationData: configurationData,
                departmentData: departmentData,
                checkoutHeaderData,
                checkoutFooterData
            };

            let homePageRes = await defaultHandlerWrapper(app, result)(req);
            return reply.response(homePageRes).header('set-cookie', homePageData.headers['set-cookie']);
        } catch (e) {
            // console.error(e);
            return reply.response(e.message);
        }
    },
    homePageNewApproach: async (req, reply, app) => {

        let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
        if (typeof services === 'undefined' || !services) {
            services = settings['sit']['listofServicesForCoherence'];
        }
        let homeCohFlag = services['homePage'];
        let homePageApi = utilities.getFinalServiceURL(appProperties.homePage, req);

        let headerReq = false; // (typeof req.query.isajax ==='undefined' || !req.query.isajax)? utilities.isMultisite(req):false;
        let footerReq = false; // (typeof req.query.isajax ==='undefined' || !req.query.isajax)? utilities.isMultisite(req):false;
        let departmentReq = false; // (typeof req.query.isajax ==='undefined' || !req.query.isajax)? utilities.isMultisite(req):false;

        const appName = "web";
        let resp = null;
        let homePageData = {};
        let allThirdPartyFlags = await utilities.fetchFlags(req, app);
        const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
        const staticLabelFlag = false; //utilities.isMultisite(req);
        let header = null;
        let footer = null;
        let depart = null;
        if (headerReq) {
            header = await utilities.getHeaderNewApproach(req, true);
            if (header && typeof header !== 'undefined' && Object.keys(header).length !== 0) {
                headerReq = false;
            }
        }
        if (footerReq) {
            footer = await utilities.getFooterNewApproach(req);
        }
        if (departmentReq) {
            depart = await utilities.departmentNewApproach(req);
        }

        const homecoherenceKey = cacheUtils.getDynamicCacheKey(req, "home_" + appName + "_");
        if (homeCohFlag) {
            resp = await cacheUtils.retrieveCoherenceData(req, homecoherenceKey);
            if (resp && resp.response && typeof resp.response !== 'undefined') {
                homePageData = resp.response;
            } else {
                homePageData = await utilities.serviceReq(req, homePageApi, 'POST', { "appName": appName, "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag });
                if ((homePageData && homePageData.status && homePageData.status === 404) ||
                    (homePageData && homePageData.data && _.isEmpty(homePageData.data)) ||
                    (homePageData && homePageData.data.code >= 500 && homePageData.data.code <= 510) ||
                    (homePageData && homePageData.data && homePageData.data.s === "1")) {
                    return staticFiles.fileNotFound(req, reply, app);

                } else {
                    let localData = Object.assign({}, homePageData.data ? homePageData.data : homePageData);
                    localData.headerContent = [];
                    localData.staticLabels = {};
                    localData.flags = {};
                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], homecoherenceKey, localData, resp['flag']);
                }
            }

        } else {
            homePageData = await utilities.serviceReq(req, homePageApi, 'POST', { "appName": appName, "headerRequest": headerReq })
            if ((homePageData && homePageData.status && homePageData.status === 404) ||
                (homePageData && homePageData.data && _.isEmpty(homePageData.data)) ||
                (homePageData && homePageData.data.code >= 500 && homePageData.data.code <= 510) ||
                (homePageData && homePageData.data && homePageData.data.s === "1")) {
                return staticFiles.fileNotFound(req, reply, app);

            } else {
                let localData = Object.assign({}, homePageData.data ? homePageData.data : homePageData);
                localData.headerContent = [];
                localData.staticLabels = {};
                localData.flags = {};
                const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], homecoherenceKey, localData, resp['flag']);
            }

        }
        if (!fetchFlag) {
            if (homePageData.data) {
                homePageData.data.flags = allThirdPartyFlags;
            } else {
                homePageData.flags = allThirdPartyFlags;
            }
        } else {
            utilities.pushFlagsToCoherence(req, (homePageData.data ? homePageData.data.flags : homePageData.flags))
        }
        const loginData = { "data": {} };//await utilities.serviceReq(req, CartHeaderDetailsURL, 'POST', {});
        const data = Object.assign({}, homePageData.data ? homePageData.data : homePageData);
        if (req.query.isajax) {
            const finalData = { homePageContent: data };
            return reply.response(finalData);
        }
        if (headerReq && data.headerContent) {
            header = data.headerContent
        }
        let { headerFooter, footerData, labelsData, configurationData, departmentData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
        const staticData = await utilities.getOnlySpecificStaticKeyData(labelsData, "PWA-HOME-PAGE", false);
        const homeseo = await utilities.getOnlySpecificStaticKeyData(labelsData, "PWA-TECH-SEO-HOME-PAGE", true);
        if (staticData && homeseo && homeseo.length > 0) {
            staticData.push(homeseo[0]);
        }
        const result = {
            homePageContent: data,
            footerContent: footerData,
            headerContent: headerFooter,
            hostname: req.info.hostname,
            url: req.path,
            seoContent: staticData,
            loginData: loginData.data,
            //staticLabelValues: labelsData,
            configurationData: configurationData,
            departmentData: departmentData,
            // checkoutHeaderData,
            // checkoutFooterData
        };
        let homePageRes = await defaultHandlerWrapper(app, result)(req);
        if (homePageData.headers) {
            return reply.response(homePageRes).header('set-cookie', homePageData.headers['set-cookie']);
        } else {
            return reply.response(homePageRes)
        }


    },
    //MyAccount getAddress
    getMyAddressData: async (req, reply, app, pageType) => {
        try {
            const addressAction = (pageType || 'Add');
            const headerFooter = await utilities.getHeaderFooter(req);

            let getAddressApi = utilities.getFinalServiceURL(appProperties.getAddressesMyAccount, req);
            const getAddressData = await utilities.serviceReq(req, getAddressApi, 'POST', req.payload);

            const finalData = { myAddressContent: getAddressData.data, addressAction }
            return defaultHandlerWrapper(app, { userData: finalData, headerContent: headerFooter.header, hostname: req.info.hostname })(req, '/tienda/users/addressBook');

        } catch (e) {
            return reply.response(e.message);
        }
    },
    getAddressesMyAccount: async (req, reply, app) => {
        try {
            let getAddressApi = utilities.getFinalServiceURL(appProperties.getAddressesMyAccount, req);
            const getAddressData = await utilities.serviceReq(req, getAddressApi, 'POST');
            return getAddressData.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getStoreLocatorData: async (req, reply, app, pageType) => {
        const data = {
            name: "store",
            dep: "store"
        }
        try {
            let { headerFooter, footerData, labelsData, configurationData, departmentData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            //const headerFooter = await utilities.getHeaderFooter(req, true);
            /* let configResponse = configurationData;
             if(req.info.hostname.indexOf('liverpool.com.mx') < 0){
             let getConfigurationApi = utilities.getFinalServiceURL(appProperties.getConfiguration, req);
              configResponse = await utilities.serviceReq(req, getConfigurationApi, 'POST', {});
             }else{
                 configResponse = configurationData;
             } */
            let storeLocatorApi = utilities.getFinalServiceURL(appProperties.getallstores, req);
            const storeLocatorData = await utilities.serviceReq(req, storeLocatorApi, 'POST',{});
            let statePath = utilities.getFinalServiceURL(appProperties.getListOfStates, req);
            const stateList = await utilities.serviceReq(req, statePath, 'POST',{});
            let finalData = { StoreDataContent: storeLocatorData.data, stateList: stateList.data.estados, headerContent: headerFooter, configurationData: configurationData, hostname: req.info.hostname };
            if (req.query.isAjax) {
                finalData = { StoreDataContent: storeLocatorData.data, stateList: stateList.data.estados, configurationData: configurationData, hostname: req.info.hostname };
                return reply.response(finalData);
            }
            return defaultHandlerWrapper(app, finalData)(req, '/tienda/browse/storelocator');
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getStoreDetails: async (req, reply, app) => {
        try {
            const storeDetailApi = utilities.getFinalServiceURL(appProperties.getstoredetails, req);
            const storeDetailData = await utilities.serviceReq(req, storeDetailApi, 'POST', req.payload);
            const finalData = { storeDetails: storeDetailData.data };
            return finalData;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getStoresByType: async (req, reply, app) => {
        try {
            const storeDetailApi = utilities.getFinalServiceURL(appProperties.getstoresbytype, req);
            const storeDetailData = await utilities.serviceReq(req, storeDetailApi, 'POST', req.payload);
            const finalData = { storeDataByTypeContent: storeDetailData.data };
            return finalData;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getAllStoreDetails: async (req, reply, app) => {
        try {
            let storeLocatorApi = utilities.getFinalServiceURL(appProperties.getallstores, req);
            const storeDetailsData = await utilities.serviceReq(req, storeLocatorApi, 'POST', req.payload);
            const finalData = { StoreDetails: storeDetailsData.data };
            return finalData;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getStoreLocatorDetail: async (req, reply, app) => {
        try {
            const data = {
                name: "store",
                dep: "store"
            };
            const headerFooter = await utilities.getHeaderFooter(req);
            const finalData = { storeloc: data, footerContent: headerFooter.footer, headerContent: headerFooter.header, hostname: req.info.hostname }
            let store = await defaultHandlerWrapper(app, finalData)(req, '/tienda/storeLocatorDetails');
            return reply.response(store);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    updatePersonalData: async (req, reply, app) => {
        try {
            const headerFooter = await utilities.getHeaderFooter(req);
            let category = utilities.getFinalServiceURL(appProperties.getCategories, req);
            const categoryInfo = await utilities.serviceReq(req, category, 'GET');
            const finalData = { catData: categoryInfo.data, footerContent: headerFooter.footer, headerContent: headerFooter.header, hostname: req.info.hostname }
            let updatePersonalData = await defaultHandlerWrapper(app, finalData)(req);
            return reply.response(updatePersonalData);

            //return categoryInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    //---------E-Invoice-----------------

    getInvoice: async (req, reply, app, pageType) => {

        try {

            /** Get configurationData from siteData : start */
            // let getConfigurationURL = utilities.getFinalServiceURL(appProperties.getConfiguration, req);
            // const getConfigurationInfo = await utilities.serviceReq(req, getConfigurationURL, 'POST');
            let { headerFooter, footerData, labelsData, configurationData, departmentData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const getConfigurationInfo = configurationData;
            /** Get configurationData from siteData : End */
            return defaultHandlerWrapper(app, { getConfigurationInfo: finalData, hostname: req.info.hostname })(req, '/tienda/billing');

        } catch (e) {
            return reply.response(e.message);
        }
    },

    getInvoiceConfirmation: async (req, reply, app, pageType) => {

        try {
            let getInvoiceConfirmationURL = utilities.getFinalServiceURL(appProperties.invoiceRequest, req);
            const getInvoiceConfirmationInfo = await utilities.serviceReq(req, getInvoiceConfirmationURL, 'POST', req.payload);
            const finalData = { invoiceContent: getInvoiceConfirmationInfo.data }
            return getInvoiceConfirmationInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    //---------E-Invoice-----------------
    //get Static Promotions
    getStaticPromotion: async (req, reply, app) => {
        try {
            let payload = req.payload;
            payload['staticLabelFlag'] = true;
            let StaticpromotionsURL = utilities.getFinalServiceURL(appProperties.getStaticPromotions, req);
            const categoryInfo = await utilities.serviceReq(req, StaticpromotionsURL, 'POST', payload);
            return categoryInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    //Air Time Recharge
    getAirTimeRecharge: async (req, reply, app) => {
        const data = {
            name: "airTime"
        }
        try {
            //  change for getConfigration service Calls : Start
            let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            // const headerFooter = await utilities.getHeaderFooter(req);
            const finalData = { footerContent: headerFooter.footer, headerContent: headerFooter, hostname: req.info.hostname, configurationData: configurationData }
            //  change for getConfigration service Calls : End
            let iPageRes = await defaultHandlerWrapper(app, finalData)(req, '/tienda/AirTime');
            return reply.response(iPageRes);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getCategories: async (req, reply, app) => {
        // pageProps optimization change Start
        try {
            let headerDetails = utilities.getHeaderDetails(req)
            const brandName = headerDetails && headerDetails.brand || 'LP';

            const siteData = app.siteData && app.siteData[brandName + 'Data'];
            let departmentData = siteData && { ...siteData.departments } || undefined;
            if (departmentData) {
                departmentData.brand = brandName;
                departmentData.siteData = 'True';
                return departmentData;
            }

        } catch (ex) {

        }
        // pageProps optimization change End

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
                    let category = utilities.getFinalServiceURL(appProperties.getCategories, req);
                    categoryInfo = await utilities.serviceReq(req, category, 'GET');
                    if (categoryInfo && categoryInfo.data && Object.keys(categoryInfo.data).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, categoryInfo.data, resp['flag']);
                    }
                }
            } else {
                let category = utilities.getFinalServiceURL(appProperties.getCategories, req);
                categoryInfo = await utilities.serviceReq(req, category, 'GET');
                if (categoryInfo && categoryInfo.data && Object.keys(categoryInfo.data).length > 0) {
                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, categoryInfo.data, resp['flag']);
                }

            }
            return (categoryInfo.data ? categoryInfo.data : categoryInfo);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    alloffers: async (req, reply, app) => {
        try {
            let productId = req.query.productId
            let alloffers = utilities.getFinalServiceURL(appProperties.alloffers + productId, req);
            const alloffersInfo = await utilities.serviceReq(req, alloffers, 'GET');
            return alloffersInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    offers: async (req, reply, app) => {
        try {
            let skuId = req.query.skuId
            const staticLableQuery = "&staticLabelFlag=false";
            let offers = utilities.getFinalServiceURL(appProperties.offers + skuId + staticLableQuery, req);
            const offersInfo = await utilities.serviceReq(req, offers, 'GET');
            return offersInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    changeDeliveryMode: async (req, reply, app) => {
        try {
            const deliveryModeUrl = utilities.getFinalServiceURL(appProperties.changeDeliveryMode, req);
            const deliveryModeInfo = await utilities.serviceReq(req, deliveryModeUrl, 'POST', req.payload, "true"); // To aviod set cookies in header, 5th parameter we are passing "true".
            return deliveryModeInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    addItemToEvent: async (req, reply, app) => {
        try {
            const ItemToEventUrl = utilities.getFinalServiceURL(appProperties.addItemToEvent, req);
            const ItemToEventInfo = await utilities.serviceReq(req, ItemToEventUrl, 'POST', req.payload, "true"); // To aviod set cookies in header, 5th parameter we are passing "true".
            return ItemToEventInfo.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    comparator: async (req, reply, app) => {
        try {
            const headerFooter = await utilities.getHeaderFooter(req);
            const result = { hostname: req.info.hostname, footerContent: headerFooter.footer, headerContent: headerFooter.header };
            if (req.query.isAjax) {
                return reply.response(result);
            }
            let response = await defaultHandlerWrapper(app, result)(req);
            return reply.response(response)

        } catch (e) {
            return reply.response(e.message);
        }
    },
    categoryLandingPage: async (req, reply, app) => {

        /* commented intensionally for performance also done unit testing */
        let mainBodyInfo = {};
        let pageName = "";
        const validQueryParams = "always##categoryId##sellerId##label##page##Nf##Ns##s##showkey##isSellerPlp##headerRequest##staticLabelFlag##flags";
        let key = null;
        const keyword = req.query.s;
        let dynamicId = null;
        let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
        if (typeof services === 'undefined' || !services) {
            services = settings['sit']['listofServicesForCoherence'];
        }
        let cohFlag = services['endecaSearchService'];
        try {
            if (req && req.url && req.url.path && (req.url.path.indexOf('/null') > -1 || req.url.path.indexOf('.jsp') > -1)) {
                return staticFiles.fileNotFound(req, reply, app);
            }
            /* commented intensionally for performance also done unit testing */
            //const headerFooter = await utilities.getHeaderFooter(req, true);
            let headerReq = false; // utilities.isMultisite(req);
            let footerReq = false; // utilities.isMultisite(req);
            let departmentReq = false; // utilities.isMultisite(req);

            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = false; // utilities.isMultisite(req);
            let mainBodyApi = utilities.getFinalServiceURL(appProperties.categoryBody, req);
            const queryString = req.query;
            /* 23369 fix start*/
            // if (typeof queryString['_ga'] !== 'undefined') {
            //     delete queryString['_ga'];
            // }
            // if (typeof queryString['busqueda'] !== 'undefined') {
            //     delete queryString['busqueda'];
            // }
            /* 23369 fix end*/
            let paramDetails = '';
            if (req.params.details !== 'null' && req.params.details !== null && typeof req.params.details !== 'undefined' && req.params.details !== '') {
                paramDetails = req.params.details;
            }
            let arr = [];
            let pageDetail = '';
            let catId = '';
            let sellerId = '';
            let sellerLabelId = '';
            if (typeof paramDetails !== 'undefined' && paramDetails !== '' && paramDetails.indexOf('sp/') !== -1) {
                arr = paramDetails.split('/');
                const len = arr.length;
                if (arr[len - 1].indexOf('page-') !== -1) {
                    pageDetail = arr[len - 1];
                    sellerLabelId = arr[len - 2];
                    sellerId = arr[len - 3];
                } else if (arr[len - 1].indexOf('N-') !== -1) {
                    sellerLabelId = arr[len - 1];
                    sellerId = arr[len - 2];
                } else {
                    sellerId = arr[len - 1];
                }
            } else if (typeof paramDetails !== 'undefined' && paramDetails !== '' && typeof queryString['s'] === 'undefined') {
                arr = paramDetails.split('/');
                const len = arr.length;
                if (arr[len - 1].indexOf('page-') !== -1) {
                    pageDetail = arr[len - 1];
                    catId = arr[len - 2];
                } else {
                    catId = arr[len - 1];
                }
            } else if (typeof paramDetails !== 'undefined' && paramDetails !== '' && typeof queryString['s'] !== 'undefined') {
                arr = paramDetails.split('/');
                const len = arr.length;
                if (len > 1) {
                    if (arr[len - 1].indexOf('page-') !== -1) {
                        pageDetail = arr[len - 1];
                        catId = arr[len - 2];
                    }
                } else {
                    if (arr[len - 1].indexOf('page-') !== -1) {
                        pageDetail = arr[len - 1];
                    } else {
                        catId = arr[len - 1];
                    }
                }
            }
            let categoryId = catId;
            if (queryString.categoryId !== 'null' && queryString.categoryId !== null && typeof queryString.categoryId !== 'undefined' && queryString.categoryId !== '') {
                categoryId = req.params.details;
            }
            let header = null;
            if (headerReq) {
                header = await utilities.getHeaderNewApproach(req, true);
                if (header && typeof header !== 'undefined' && Object.keys(header).length !== 0) {
                    headerReq = false;
                }
            }
            let footer = null;
            if (footerReq) {
                footer = await utilities.getFooterNewApproach(req);
            }
            let depart = null;
            if (departmentReq) {
                depart = await utilities.departmentNewApproach(req);
            }
            let body = { "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag };
            /* 23369 fix start*/
            let redirectToHome = true;
            let appendQueryParams = '';
            if (Object.keys(queryString).length > 0) {
                appendQueryParams += '?';
                for (let key in queryString) {
                    appendQueryParams = appendQueryParams + key + '=' + queryString[key] + '&';
                    if (validQueryParams.indexOf(key) !== -1) {
                        redirectToHome = false;
                    }
                    if (key === "always" || key === "showPLP") {
                        pageName = "PWA-PLP-PAGE";
                    }
                }
                appendQueryParams = appendQueryParams.slice(0, -1);
            }
            /* 23369 fix end*/
            if (req.query.isAjax) {
                body = body;
            } else if (categoryId === '' && (Object.keys(queryString).length === 0 || redirectToHome) && sellerId === '') { /* 23369 fix */
                return reply.redirect('/tienda/home' + appendQueryParams); /* 23369 fix */
            } else if (categoryId === '' && sellerId === '' && pageDetail === '') {
                body = queryString;
            } else {
                if (typeof categoryId !== 'undefined' && categoryId !== '') {
                    if (categoryId.indexOf('N-') !== -1) {
                        body['label'] = categoryId;
                    } else {
                        body['categoryId'] = categoryId;
                    }
                    dynamicId = categoryId
                }
                if (typeof sellerId !== 'undefined' && sellerId !== '') {
                    if (sellerLabelId.indexOf('N-') !== -1) {
                        body['label'] = sellerLabelId;
                        body['sellerId'] = sellerId;
                    } else {
                        body['sellerId'] = sellerId;
                    }
                    dynamicId = sellerId;
                }
                if (typeof pageDetail !== 'undefined' && pageDetail !== '') {
                    body['page'] = pageDetail.replace('page-', '');
                }
                if (typeof queryString.showPLP !== 'undefined') {
                    body.always = "PLP";
                    delete queryString.showPLP;
                }
                if (typeof queryString.showplp !== 'undefined') {
                    delete queryString.showplp;
                }
                if (Object.keys(queryString).length > 0) {
                    body = { ...body, ...queryString };
                }
            }
            if (keyword && typeof keyword !== 'undefined') {
                key = cacheUtils.getDynamicCacheKey(req, "keyword_", keyword);
            } else {
                key = cacheUtils.getDynamicCacheKey(req, "category_", dynamicId);
            }
            //console.log('body=====================================================>', body);
            for (let k in body) {
                if (validQueryParams.indexOf(k) < 0) {
                    delete body[k]
                }
            }
            //console.log('after body=====================================================>', body);
            const testPayload = JSON.stringify(body);
            let skipCoherence = false;
            if (testPayload.indexOf('label') > -1 || testPayload.indexOf('Nf') > -1 || testPayload.indexOf('page') > -1 ||
                testPayload.indexOf('Ns') > -1 || testPayload.indexOf('always') > -1) {
                skipCoherence = true;
            }

            if (!skipCoherence && cohFlag) {
                let resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    mainBodyInfo = resp.response;
                } else {
                    mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
                    let localData = Object.assign({}, mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
                    localData.headerContent = [];
                    localData.staticLabels = {};
                    localData.flags = {};
                    if ((mainBodyInfo.data && mainBodyInfo.data.s === "0") && localData && Object.keys(localData).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, localData, resp['flag']);
                    }
                }
            } else {
                mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
            }
            //const mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
            let statusErrorCode = _.get(mainBodyInfo, 'data.errorCode', '');
            let statusCode = _.get(mainBodyInfo, 'data.code', '');
            if (mainBodyInfo && (mainBodyInfo.s === '0' || (mainBodyInfo.data && mainBodyInfo.data.s === '0'))) {

                //console.log("s==================0")
            } else if ((mainBodyInfo && mainBodyInfo.status && mainBodyInfo.status === 404) || (mainBodyInfo && mainBodyInfo.data.code >= 500 && mainBodyInfo.data.code <= 510) || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.s === "1")) {

                return staticFiles.fileNotFound(req, reply, app);
            } else if (statusCode == 600 || statusCode == '600' || statusErrorCode == 1001 || statusErrorCode == '1001') {
                return reply.redirect('/tienda/users/changePassword?isredirect=true');
            } else {
                //console.log('Data Found');
            }
            if (headerReq && mainBodyInfo.data && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent
            }
            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }

            } else {
                utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }

            let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const mainData = (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
            let pageType = "";
            if (pageName === "PWA-PLP-PAGE") {
                pageType = 'TwoColumnPage';
            } else {
                pageType = mainData.contentItem && mainData.contentItem.contents && mainData.contentItem.contents[0] && mainData.contentItem.contents[0]["@type"] || '';
            }
            //categoryLandingPage
            // TwoColumnPage
            //LPDynamicBrandLandingPage LPStaticBrandLandingPage

            let skuArray = [];//1045733374
            if (pageType) {
                if (pageType === 'TwoColumnPage') {
                    pageName = "PWA-PLP-PAGE";
                    const mainContent = mainData.contentItem.contents[0]['mainContent'] || [];
                    let productsGTM = [];

                    mainContent.map((mainItem, index) => {
                        if (mainItem['@type'] === 'ContentSlotMain' && mainItem.contents.length > 0 && mainItem.contents[0]['@type'] === 'ResultsList') {
                            if (productsGTM.length == 0) {
                                productsGTM = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records || [];
                            }
                        }
                    });
                    if (productsGTM && productsGTM.length && productsGTM.length > 0) {
                        for (let k in productsGTM) {
                            if (productsGTM[k]['productId'][0] !== productsGTM[k]['sku.repositoryId'][0]) {
                                skuArray.push(productsGTM[k]['productId'][0]);
                                skuArray.push(productsGTM[k]['sku.repositoryId'][0]);
                            } else {
                                skuArray.push(productsGTM[k]['sku.repositoryId'][0]);
                            }
                        }
                    }

                } else if (pageType === 'categoryLandingPage') {
                    pageName = "PWA-CLP-PAGE";
                } else if (pageType === 'LPDynamicBrandLandingPage') {
                    pageName = "PWA-BLP-PAGE";
                } else if (pageType === 'LPStaticBrandLandingPage') {
                    pageName = "PWA-BLP-PAGE";
                }

            }
            let sendLimitedData = (pageType && pageType === 'TwoColumnPage' ? true : false);
            const staticData = await utilities.getOnlySpecificStaticKeyData(labelsData, pageName, false);
            const limitedData = await utilities.getOnlyRequiredLimitedData(limitedPiecesSkusData, skuArray);
            const result = {
                hostname: req.info.hostname,
                url: req.path,
                footerContent: footerData,
                headerContent: headerFooter,
                mainContent: (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo),
                staticLabelValues: staticData,
                configurationData: configurationData,
                limitedPiecesSkusData: (sendLimitedData ? limitedData : []),
                departmentData: departmentData,
                // checkoutHeaderData,
                //checkoutFooterData,
                categoryId
            };

            if (req.query.isAjax) {
                return reply.response(result);
            }
            let plpPageRes = await defaultHandlerWrapper(app, result)(req, "/tienda/twoColumnCategoryPage", body);

            let setCookieData = (mainBodyInfo && mainBodyInfo.headers) ? mainBodyInfo.headers['set-cookie'] : "";
            if (typeof setCookieData === 'undefined') {
                /* Performance issue and hence comment out. first cookie itself not coming from back end and second header page 
                    already calling the same service and latest checking the cookie in that service. please talk to siva if you 
                    want to enable the code here
                const CartHeaderDetailsURL = utilities.getFinalServiceURL(appProperties.getCartHeaderDetails,req);
                const toGetCookieDetails = await utilities.serviceReq(req, CartHeaderDetailsURL, 'POST', {});                
                setCookieData = toGetCookieDetails.headers['set-cookie'];*/
            }

            return reply.response(plpPageRes).header('set-cookie', setCookieData);

        } catch (e) {
            return staticFiles.fileNotFound(req, reply, app);
            // return reply.response(e.message);
        }
    },
    pdpLandingPage: async (req, reply, app, pdpType, isApiCall) => {

        /* commented intensionally for performance also done unit testing */

        let cookieData = null;
        let mainBodyInfo = null;
        let coherencekey = null;
        let pdpDynamicContent = null;
        let mainBodyApi = '', type = '', productId, body = '';
        let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
        if (typeof services === 'undefined' || !services) {
            services = settings['sit']['listofServicesForCoherence'];
        }
        let cohFlag = services['PDP'];
        try {
            /* commented intensionally for performance also done unit testing */
            //const headerFooter = await utilities.getHeaderFooter(req, true);
            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = false; // utilities.isMultisite(req);
            // let headerReq = isApiCall ? false:true;
            let headerReq = false; //(typeof isApiCall ==='boolean' && isApiCall)?false : ( utilities.isMultisite(req));
            let footerReq = false; // (typeof isApiCall ==='boolean' && isApiCall)?false : ( utilities.isMultisite(req));
            let departmentReq = false; //(typeof isApiCall ==='boolean' && isApiCall)?false : ( utilities.isMultisite(req));
            let header = null;
            let depart = null;
            let footer = null;
            if (headerReq) {
                header = await utilities.getHeaderNewApproach(req, true);
                if (header && typeof header !== 'undefined' && Object.keys(header).length !== 0) {
                    headerReq = false;
                }
            }
            if (footerReq) {
                footer = await utilities.getFooterNewApproach(req);
            }
            if (departmentReq) {
                depart = await utilities.departmentNewApproach(req);
            }

            if (req.params['p']) {
                productId = req.params['p'].split('/').pop();
                if (productId === 'null' || _.isEmpty(productId)) {
                    console.error("Error code 404: Product ID not found.")
                    return staticFiles.fileNotFound(req, reply, app);
                }
            } else if (req.query) {
                productId = req.query['productId']
                if (productId === 'null' || _.isEmpty(productId)) {
                    console.error("Error code 404: Product IDs not found.")
                    return staticFiles.fileNotFound(req, reply, app);
                }
            }
            else {
                return staticFiles.fileNotFound(req, reply, app);
                //return "Uhh!! Ohhh URL is not correct! Please try again"
            }
            if (pdpType == 'hybrid') {
                coherencekey = cacheUtils.getDynamicCacheKey(req, "hybrid_");
                if (productId) {
                    coherencekey = cacheUtils.getDynamicCacheKey(req, "hybrid_", productId);
                }
                mainBodyApi = utilities.getFinalServiceURL(appProperties.hybridBody, req) + productId + "&headerRequest=false&staticLabelFlag=" + staticLabelFlag + "&flags=" + fetchFlag;

                type = 'GET'

            } else {
                coherencekey = cacheUtils.getDynamicCacheKey(req, "catalogendeca_");
                if (productId) {
                    coherencekey = cacheUtils.getDynamicCacheKey(req, "catalogendeca_", productId);
                }
                mainBodyApi = utilities.getFinalServiceURL(appProperties.pdpBody, req);
                type = 'POST'
                body = { "productId": productId, "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag }
            }
            if (cohFlag) {
                const resp = await cacheUtils.retrieveCoherenceData(req, coherencekey);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    mainBodyInfo = resp.response;
                    //ajax call had introduces for rating issue and hence here it is commented.
                    /* pdpDynamicContent = await utilities.fetchPDPDynamicContent(req, (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo));
                     if (pdpDynamicContent && pdpDynamicContent.headers && pdpDynamicContent.headers['set-cookie']) {
                         cookieData = pdpDynamicContent.headers['set-cookie'];
                         // console.log("cookieData from headers set cookie in Main content", cookieData)
                     } else if (pdpDynamicContent && pdpDynamicContent.config
                         && pdpDynamicContent.config.headers && pdpDynamicContent.config.headers.Cookie) {
                         cookieData = pdpDynamicContent.config.headers.Cookie;
                         //console.log("cookieData in PDP dynamic content", cookieData)
                     }
                     if (pdpDynamicContent && pdpDynamicContent.data && pdpDynamicContent.data.breadcrumbData) {
                         (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo).breadcrumbData = pdpDynamicContent.data.breadcrumbData;
                     }
                     if (pdpDynamicContent && pdpDynamicContent.data && pdpDynamicContent.data.alloffers) {
                         (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo).alloffers = pdpDynamicContent.data.alloffers;
                     }*/
                } else {
                    try {
                        mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
                        if (mainBodyInfo && mainBodyInfo.headers && mainBodyInfo.headers['set-cookie']) {
                            cookieData = mainBodyInfo.headers['set-cookie'];
                            //console.log("cookieData from headers set cookie in Main content", cookieData)
                        } else if (mainBodyInfo && mainBodyInfo.config
                            && mainBodyInfo.config.headers && mainBodyInfo.config.headers.Cookie) {
                            cookieData = mainBodyInfo.config.headers.Cookie;
                            //console.log("cookieData in Main content", cookieData)
                        }
                        const gwpFlag = await cacheUtils.checkGWPPDPRequest((mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo));
                        if (gwpFlag !== 'true') {
                            let localData = Object.assign({}, mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
                            localData.headerContent = [];
                            localData.staticLabels = {};
                            localData.flags = {};
                            localData.breadcrumbData = {};
                            localData.alloffers = {};
                            if ((mainBodyInfo.data && mainBodyInfo.data.s === "0") && localData && Object.keys(localData).length > 0) {
                                const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], coherencekey, localData, resp['flag']);
                            }
                        }

                    } catch (e) {
                        console.error("servieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", e)
                    }
                }
            } else {
                mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
                if (mainBodyInfo && mainBodyInfo.config
                    && mainBodyInfo.headers && mainBodyInfo.headers['set-cookie']) {
                    cookieData = mainBodyInfo.headers['set-cookie'];
                    // console.log("cookieData from headers set cookie in Main content", cookieData)
                } else if (mainBodyInfo && mainBodyInfo.config
                    && mainBodyInfo.config.headers && mainBodyInfo.config.headers.Cookie) {
                    cookieData = mainBodyInfo.config.headers.Cookie;
                    //console.log("cookieData in Main content", cookieData)
                }
            }

            //let mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
            //const ll = await utilities.fetchPDPDynamicContent(req,(mainBodyInfo.data?mainBodyInfo.data:mainBodyInfo));
            // if (!(pdpDynamicContent && pdpDynamicContent.data) || !(mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.breadcrumbData
            //   && mainBodyInfo.data.breadcrumbData.breadCrumbs && mainBodyInfo.data.breadcrumbData.breadCrumbs.length > 0)) {
            let statusErrorCode = _.get(mainBodyInfo, 'data.errorCode', '');
            let statusCode = _.get(mainBodyInfo, 'data.code', '');
            if (
                (mainBodyInfo && mainBodyInfo.status && mainBodyInfo.status === 404)
                || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.code >= 500 && mainBodyInfo.data.code <= 510)
                || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.s === "1")
            ) {
                return staticFiles.fileNotFound(req, reply, app);
            }
            else if (statusCode == 600 || statusCode == '600' || statusErrorCode == 1001 || statusErrorCode == '1001') {
                return reply.redirect('/tienda/users/changePassword?isredirect=true');
            }
            //}
            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }
            } else {
                utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }
            if (headerReq && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent
            }
            let mainBody = (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
            mainBody.pdpType = pdpType;
            mainBody.productId = productId;
            mainBody.ENV = process.env.ENVIRONMENT;
            let turntokey = utilities.getturntokey(req.info.hostname);
            mainBody.turntokey = turntokey;
            mainBody.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
            /*try {
                let local = {
                    "productId": "",
                    "isMarketPlace": "false",
                    "skuId": "",
                    "pType": "dummy"
                };
                if (mainBodyInfo.data) {
                    const mainContent = (mainBodyInfo.data.endecaProductInfo) ? mainBodyInfo.data.endecaProductInfo.contents[0].mainContent : null;
                    local['skuId'] = mainBodyInfo.data.productVarientsInfo && mainBodyInfo.data.productVarientsInfo.skuAttributeMap ? Object.keys(mainBodyInfo.data.productVarientsInfo.skuAttributeMap)[0] : '';
                    if (mainContent) {
                        mainContent.map(mainRecord => {
                            if (mainRecord['@type'] === 'ProductDetail') {
                                local['productId'] = mainRecord.record['productId'][0];
                                if (mainRecord.record['productType'] && mainRecord.record['productType'][0]) {
                                    local['pType'] = mainRecord.record['productType'][0];
                                }
                                if (mainRecord.record['isMarketPlace'] && mainRecord.record['isMarketPlace'][0]) {
                                    local['isMarketPlace'] = mainRecord.record['isMarketPlace'][0];
                                }
                                if (!local['skuId'] && mainRecord.record['sku.repositoryId'] && mainRecord.record['sku.repositoryId'][0]) {
                                    local['skuId'] = mainRecord.record['sku.repositoryId'][0];
                                }
                            }
                        });
                    }
                }
                let URL = utilities.getFinalServiceURL(appProperties.getPdpDynamicContent, req);
                let localpayload = local;
                if (localpayload && (!localpayload["pType"] || typeof localpayload["pType"] === 'undefined'
                    || localpayload["pType"].trim() === '')) {
                    localpayload["pType"] = 'dummy';
                }
                const pdpDynamicContent = await utilities.serviceReq(req, URL, 'POST', localpayload);
                mainBodyInfo.data.breadcrumbData = pdpDynamicContent.data;
                cookieData = pdpDynamicContent.headers['set-cookie'];
                if (local['isMarketPlace'] === 'true') {
                    let alloffers = utilities.getFinalServiceURL(appProperties.alloffers + local['productId'], req);
                    const alloffersInfo = await utilities.serviceReq(req, alloffers, 'GET');
                    mainBodyInfo.data.alloffers = alloffersInfo.data;
                }
            } catch (e) {
                //console.log("error for pdp dynamic or offer data ", e);
            }*/
            if (isApiCall) {
                return { mainContent: mainBody }
            } else {

                let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);

                const staticLabels = await utilities.getOnlySpecificStaticKeyData(labelsData, "PWA-PDP-PAGE", false);
                //const staticLabels = (labelsData && labelsData.staticLabelValues) ? labelsData.staticLabelValues.filter(function (currentValue) { return (currentValue.pageName === 'PWA-PDP-PAGE' || currentValue.pageName ==='PWA-TECH-SEO-EVERY-PAGE') }) : null;
                //logger.info("staticLabels Values PDP" + JSON.stringify(staticLabels))
                mainBody.staticLabels = { 'staticLabelValues': staticLabels };
                let skuArray = [];
                let skuAttributeMap = {};
                if (mainBody) {
                    skuArray.push(mainBody['productId']);
                    Object.keys(mainBody.productVarientsInfo).map(cur => {
                        if (cur.indexOf("ttribute") > -1) {
                            skuAttributeMap = mainBody.productVarientsInfo[cur];
                        }

                    });
                    Object.keys(skuAttributeMap).map(skuId => {
                        skuArray.push(skuId);
                    });
                }
                const limitedData = await utilities.getOnlyRequiredLimitedData(limitedPiecesSkusData, skuArray);
                const finalData = {
                    footerContent: footerData,
                    headerContent: headerFooter,
                    mainContent: mainBody,
                    staticLabelValues: staticLabels,
                    configurationData: configurationData,
                    limitedPiecesSkusData: limitedData,
                    departmentData: departmentData,
                    hostname: req.info.hostname,
                    //checkoutHeaderData,
                    //checkoutFooterData
                }

                // const finalData = { footerContent: {}, headerContent: header, mainContent: mainBodyInfo.data, hostname: req.info.hostname }
                // const finalData = { footerContent: headerFooter.footer, headerContent: headerFooter.header, mainContent: mainBodyInfo.data, hostname: req.info.hostname,   url:req.path }
                let pdpPageRes = await defaultHandlerWrapper(app, finalData)(req, '/tienda/oneColumnPage');
                // return reply.response(pdpPageRes).header('set-cookie', mainBodyInfo.headers['set-cookie']);
                return reply.response(pdpPageRes).header('set-cookie', cookieData);

            }
        } catch (e) {
            //console.log("pdp catch  ", e)
            return staticFiles.fileNotFound(req, reply, app);
            // return reply.response(e.message);
        }
    },
    getPdpData: async (req, reply, app) => {

        let mainBodyInfo = null, coherencekey = null, pdpDynamicContent = null, mainBodyApi = '', type = '', productId = '', body = '', cookieData = null, pdpType = '';

        let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
        if (typeof services === 'undefined' || !services) {
            services = settings['sit']['listofServicesForCoherence'];
        }
        let cohFlag = services['PDP'];

        try {

            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = false;

            let headerReq = false;
            //console.log("My req: ", req);
            // oneColumnPageData Call POST to GET :: Start
            if (req.query) {
                productId = req.query['productId'];
                pdpType = req.query['pdpType'];
                // oneColumnPageData Call POST to GET :: End    
                if (productId === 'null' || _.isEmpty(productId)) {
                    console.error("Error code 404: SPA: Product ID not found.")
                    return staticFiles.fileNotFound(req, reply, app);
                }
            }
            else {
                return "Oops! URL is not correct! Please try again"
            }
            if (pdpType == 'hybrid') {

                mainBodyApi = utilities.getFinalServiceURL(appProperties.hybridBody, req) + productId + "&headerRequest=false&staticLabelFlag=" + staticLabelFlag + "&flags=" + fetchFlag;
                type = 'GET'

            } else {
                coherencekey = cacheUtils.getDynamicCacheKey(req, "catalogendeca_");
                if (productId) {
                    coherencekey = cacheUtils.getDynamicCacheKey(req, "catalogendeca_", productId);
                }
                mainBodyApi = utilities.getFinalServiceURL(appProperties.pdpBody, req);
                type = 'POST'
                body = { "productId": productId, "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag }
            }

            if (cohFlag) {
                const resp = await cacheUtils.retrieveCoherenceData(req, coherencekey);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    mainBodyInfo = resp.response;
                    //ajax call had introduces for rating issue and hence here it is commented.
                    /* pdpDynamicContent = await utilities.fetchPDPDynamicContent(req, (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo));
                     if (pdpDynamicContent && pdpDynamicContent.headers && pdpDynamicContent.headers['set-cookie']) {
                         cookieData = pdpDynamicContent.headers['set-cookie'];
                         // console.log("cookieData from headers set cookie in Main content", cookieData)
                     } else if (pdpDynamicContent && pdpDynamicContent.config
                         && pdpDynamicContent.config.headers && pdpDynamicContent.config.headers.Cookie) {
                         cookieData = pdpDynamicContent.config.headers.Cookie;
                         //console.log("cookieData in PDP dynamic content", cookieData)
                     }
                     if (pdpDynamicContent && pdpDynamicContent.data && pdpDynamicContent.data.breadcrumbData) {
                         (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo).breadcrumbData = pdpDynamicContent.data.breadcrumbData;
                     }
                     if (pdpDynamicContent && pdpDynamicContent.data && pdpDynamicContent.data.alloffers) {
                         (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo).alloffers = pdpDynamicContent.data.alloffers;
                     }*/
                } else {
                    try {
                        mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
                        if (mainBodyInfo && mainBodyInfo.headers && mainBodyInfo.headers['set-cookie']) {
                            cookieData = mainBodyInfo.headers['set-cookie'];
                            //console.log("cookieData from headers set cookie in Main content", cookieData)
                        } else if (mainBodyInfo && mainBodyInfo.config
                            && mainBodyInfo.config.headers && mainBodyInfo.config.headers.Cookie) {
                            cookieData = mainBodyInfo.config.headers.Cookie;
                            //console.log("cookieData in Main content", cookieData)
                        }
                        const gwpFlag = await cacheUtils.checkGWPPDPRequest((mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo));
                        if (gwpFlag !== 'true') {
                            let localData = Object.assign({}, mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
                            localData.headerContent = [];
                            localData.staticLabels = {};
                            localData.flags = {};
                            localData.breadcrumbData = {};
                            localData.alloffers = {};
                            if ((mainBodyInfo.data && mainBodyInfo.data.s === "0") && localData && Object.keys(localData).length > 0) {
                                const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], coherencekey, localData, resp['flag']);
                            }
                        }

                    } catch (e) {
                        //console.log("servie (SPA)", e)
                    }
                }
            } else {
                mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
                if (mainBodyInfo && mainBodyInfo.config
                    && mainBodyInfo.headers && mainBodyInfo.headers['set-cookie']) {
                    cookieData = mainBodyInfo.headers['set-cookie'];
                } else if (mainBodyInfo && mainBodyInfo.config
                    && mainBodyInfo.config.headers && mainBodyInfo.config.headers.Cookie) {
                    cookieData = mainBodyInfo.config.headers.Cookie;
                }
            }

            /*  mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
             if (mainBodyInfo && mainBodyInfo.config
                 && mainBodyInfo.headers && mainBodyInfo.headers['set-cookie']) {
                 cookieData = mainBodyInfo.headers['set-cookie'];
             } else if (mainBodyInfo && mainBodyInfo.config
                 && mainBodyInfo.config.headers && mainBodyInfo.config.headers.Cookie) {
                 cookieData = mainBodyInfo.config.headers.Cookie;
             } */

            //if (!(pdpDynamicContent && pdpDynamicContent.data) || !(mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.breadcrumbData
            //   && mainBodyInfo.data.breadcrumbData.breadCrumbs && mainBodyInfo.data.breadcrumbData.breadCrumbs.length > 0)) {
            /*Changes modified for change Password redirection -- start*/
            let statusErrorCode = _.get(mainBodyInfo, 'data.errorCode', '');
            let statusCode = _.get(mainBodyInfo, 'data.code', '');
            /*Changes modified for change Password redirection -- end*/
            if (
                (mainBodyInfo && mainBodyInfo.status && mainBodyInfo.status === 404)
                || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.code >= 500 && mainBodyInfo.data.code <= 510)
                || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.s === "1")
            ) {
                return staticFiles.fileNotFound(req, reply, app);
            }
            /*Changes modified for change Password redirection -- start*/
            else if (statusCode == 600 || statusCode == '600' || statusErrorCode == 1001 || statusErrorCode == '1001') {
                return reply.redirect('/tienda/users/changePassword?isredirect=true');
            }
            /*Changes modified for change Password redirection -- end*/
            // }

            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }
            } else {
                utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }

            if (headerReq && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent
            }
            let mainBody = (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
            mainBody.pdpType = pdpType;
            mainBody.productId = productId;
            mainBody.ENV = process.env.ENVIRONMENT;
            let turntokey = utilities.getturntokey(req.info.hostname);
            mainBody.turntokey = turntokey;
            mainBody.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];


            let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const staticLabels = await utilities.getOnlySpecificStaticKeyData(labelsData, "PWA-PDP-PAGE", false);
            // const staticLabels = (labelsData && labelsData.staticLabelValues) ? labelsData.staticLabelValues.filter(function (currentValue) { return (currentValue.pageName === 'PWA-PDP-PAGE') }) : null;
            mainBody.staticLabels = { 'staticLabelValues': staticLabels };
            let skuArray = [];
            let skuAttributeMap = {};
            if (mainBody) {
                skuArray.push(mainBody['productId']);
                Object.keys(mainBody.productVarientsInfo).map(cur => {
                    if (cur.indexOf("ttribute") > -1) {
                        skuAttributeMap = mainBody.productVarientsInfo[cur];
                    }

                });
                Object.keys(skuAttributeMap).map(skuId => {
                    skuArray.push(skuId);
                });
            }
            const limitedData = await utilities.getOnlyRequiredLimitedData(limitedPiecesSkusData, skuArray);
            const finalData = {
                footerContent: footerData,
                headerContent: headerFooter,
                mainContent: mainBody,
                staticLabelValues: staticLabels,
                configurationData: configurationData,
                limitedPiecesSkusData: limitedData,
                departmentData: departmentData,
                hostname: req.info.hostname,
                // checkoutHeaderData,
                // checkoutFooterData
            }

            return reply.response(finalData).header('set-cookie', cookieData);


        } catch (e) {
            //console.log("pdp catch(SPA)  ", e)
            return staticFiles.fileNotFound(req, reply, app);
            // return reply.response(e.message);
        }

    },

    getGroupCollectionData: async (req, reply, app) => {
        console.log("req colSPA only payload ", req.payload)
        console.log("reply colSPA", reply)
        console.log("app colSPA", app)
        let mainBodyInfo = null, mainBodyApi = '', type = '', productId = '', body = '', cookieData = null, pdpType = '';

        try {

            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = false;

            let headerReq = false;
            //console.log("My req: ", req);

            // if (req.payload) {
            //     productId = req.payload['productId'];
            //     pdpType = req.payload['pdpType'];
            // }
            // else {
            //     return "Oops! URL is not correct! Please try again"
            // }
            // oneColumnPageData Call POST to GET :: Start
            if (req.query) {
                productId = req.query['productId'];
                pdpType = req.query['pdpType'];
                // oneColumnPageData Call POST to GET :: End    
                if (productId === 'null' || _.isEmpty(productId)) {
                    console.error("Error code 404: SPA: Product ID not found.")
                    return staticFiles.fileNotFound(req, reply, app);
                }
            }
            else {
                return "Oops! URL is not correct! Please try again"
            }
            if (pdpType == 'hybrid') {

                mainBodyApi = utilities.getFinalServiceURL(appProperties.hybridBody, req) + productId + "&headerRequest=false&staticLabelFlag=" + staticLabelFlag + "&flags=" + fetchFlag;
                type = 'GET'

            } else {

                mainBodyApi = utilities.getFinalServiceURL(appProperties.collectionBody, req);
                type = 'POST'
                body = { "productId": productId, "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag }
            }

            mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, type, body);
            if (mainBodyInfo && mainBodyInfo.config
                && mainBodyInfo.headers && mainBodyInfo.headers['set-cookie']) {
                cookieData = mainBodyInfo.headers['set-cookie'];
            } else if (mainBodyInfo && mainBodyInfo.config
                && mainBodyInfo.config.headers && mainBodyInfo.config.headers.Cookie) {
                cookieData = mainBodyInfo.config.headers.Cookie;
            }

            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }
            } else {
                // utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }

            if (headerReq && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent
            }
            let mainBody = (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
            mainBody.pdpType = pdpType;
            mainBody.productId = productId;
            mainBody.ENV = process.env.ENVIRONMENT;
            let turntokey = utilities.getturntokey(req.info.hostname);
            mainBody.turntokey = turntokey;
            mainBody.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];


            let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);

            const staticLabels = (labelsData && labelsData.staticLabelValues) ? labelsData.staticLabelValues.filter(function (currentValue) { return (currentValue.pageName === 'PWA-PDP-PAGE') }) : null;
            mainBody.staticLabels = { 'staticLabelValues': staticLabels };
            const finalData = {
                footerContent: footerData,
                headerContent: headerFooter,
                mainContent: mainBody,
                staticLabelValues: labelsData,
                configurationData: configurationData,
                limitedPiecesSkusData: limitedPiecesSkusData,
                departmentData: departmentData,
                hostname: req.info.hostname,
                // checkoutHeaderData,
                // checkoutFooterData
            }

            return reply.response(finalData).header('set-cookie', cookieData);


        } catch (e) {
            console.log("pdp catch  ", e)
            return staticFiles.fileNotFound(req, reply, app);
            // return reply.response(e.message);
        }

    },

    //------------siteMap-------------
    getSiteMapData: async (req, reply, app, pageType) => {
        // const data = {
        //     name: "Imran"
        // }
        const labelsData = app.labelsData;
        try {
            const staticLableQuery = "?staticLabelFlag=false";
            const headerFooter = await utilities.getHeaderFooter(req, true);
            let siteMapApi = utilities.getFinalServiceURL(appProperties.allcategoryinfo + staticLableQuery, req);
            const siteMapData = await utilities.serviceReq(req, siteMapApi, 'POST');
            siteMapData.data.staticLabels = labelsData;
            const finalData = { siteMapDataContent: siteMapData.data }
            if (req.query.isAjax) {
                const ajaxData = { SiteMapData: finalData };
                return reply.response(ajaxData);
            }
            return defaultHandlerWrapper(app, { SiteMapData: finalData, headerContent: headerFooter.header, hostname: req.info.hostname })(req, '/tienda/sitemap');

        } catch (e) {
            return reply.response(e.message);
        }
    },
    //------------siteMap-------------
    getPdpDynamicContent: async (req, reply, app) => {
        try {
            let URL = utilities.getFinalServiceURL(appProperties.getPdpDynamicContent, req);
            let localpayload = req.payload;
            if (localpayload && (!localpayload["pType"] || typeof localpayload["pType"] === 'undefined'
                || localpayload["pType"].trim() === '')) {
                localpayload["pType"] = 'dummy';
            }
            const pdpDynamicContent = await utilities.serviceReq(req, URL, 'POST', localpayload);
            return reply.response(pdpDynamicContent.data).header('set-cookie', pdpDynamicContent.headers['set-cookie']);
            //return reply.response(pdpDynamicContent.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getRealTimeStock: async (req, reply, app) => {
        try {
            let URL = utilities.getFinalServiceURL(appProperties.getRealTimeStock, req);
            let localpayload = req.payload;
            if (localpayload && (!localpayload["pType"] || typeof localpayload["pType"] === 'undefined'
                || localpayload["pType"].trim() === '')) {
                localpayload["pType"] = 'dummy';
            }
            const pdpContentStock = await utilities.serviceReq(req, URL, 'POST', localpayload);
            // console.log("pdpContentStock", pdpContentStock);
            return reply.response(pdpContentStock.data).header('set-cookie', pdpContentStock.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    pdpOfferLandingPage: async (req, reply, app, pdpType) => {
        try {
            let mainBodyInfo = null;
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined' || !services) {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let cohFlag = services['PDP'];
            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = false; // utilities.isMultisite(req);
            let headerReq = false; // utilities.isMultisite(req);
            let footerReq = false; // utilities.isMultisite(req);
            let departmentReq = false; // utilities.isMultisite(req);
            let header = null;
            let footer = null;
            let depart = null;
            if (headerReq) {
                header = await utilities.getHeaderNewApproach(req, true);
                if (header && typeof header !== 'undefined' && Object.keys(header).length > 0) {
                    headerReq = false;
                }
            }
            if (footerReq) {
                footer = await utilities.getFooterNewApproach(req);
            }
            if (departmentReq) {
                depart = await utilities.departmentNewApproach(req);
            }
            let mainBodyApi = utilities.getFinalServiceURL(appProperties.pdpBody, req);
            const productId = req.query.productId;
            const selectedSkuId = req.query.skuId;
            const body = { "productId": productId, "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag };
            if (cohFlag) {
                let coherencekey = cacheUtils.getDynamicCacheKey(req, "catalogendeca_");
                if (productId) {
                    coherencekey = cacheUtils.getDynamicCacheKey(req, "catalogendeca_", productId);
                }
                const resp = await cacheUtils.retrieveCoherenceData(req, coherencekey);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    mainBodyInfo = resp.response;
                } else {
                    mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
                    const gwpFlag = await cacheUtils.checkGWPPDPRequest((mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo));
                    if (gwpFlag !== 'true') {
                        let localData = Object.assign({}, mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
                        localData.headerContent = [];
                        localData.staticLabels = {};
                        localData.flags = {};
                        if ((mainBodyInfo.data && mainBodyInfo.data.s === "0") && localData && Object.keys(localData).length > 0) {
                            const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], coherencekey, localData, resp['flag']);
                        }
                    }
                }
            } else {
                mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
            }
            // mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', { "productId": productId,"headerRequest":headerReq,"staticLabelFlag":staticLabelFlag,"flags":fetchFlag });
            if (headerReq && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent;
            }
            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }
            } else {
                utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }
            let mainBody = (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
            mainBody.selectedSkuId = selectedSkuId;
            mainBody.productId = productId;
            mainBody.pdpType = pdpType;

            // console.log("headerFooter", headerFooter.footer)

            const { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const staticLabels = await utilities.getOnlySpecificStaticKeyData(labelsData, "", false);
            const finalData = {
                footerContent: footerData,
                headerContent: headerFooter,
                mainContent: (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo),
                staticLabelValues: staticLabels,
                configurationData: configurationData,
                limitedPiecesSkusData: [],
                departmentData: departmentData,
                hostname: req.info.hostname,
                // checkoutHeaderData,
                //checkoutFooterData
            }

            return defaultHandlerWrapper(app, finalData)(req, '/tienda/pdpOfferList');
        } catch (e) {
            return reply.response(e.message);
        }
    },
    collectionLandingPage: async (req, reply, app) => {
        try {

            /* commented intensionally for performance also done unit testing */
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined' || !services) {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let cohFlag = services['CollectionPDP'];
            let mainBodyInfo = null;
            let pdpDynamicContent = null;
            //const headerFooter = await utilities.getHeaderFooter(req);
            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = utilities.isMultisite(req);
            let headerReq = false; // utilities.isMultisite(req);
            let footerReq = false; //utilities.isMultisite(req);
            let departmentReq = false; // utilities.isMultisite(req);
            let footer = null;
            let header = null;
            if (headerReq) {
                header = await utilities.getHeaderNewApproach(req, true);
                if (header && typeof header !== 'undefined' && Object.keys(header).length > 0) {
                    headerReq = false;
                }
            }
            if (footerReq) {
                footer = await utilities.getFooterNewApproach(req);
            }
            let depart = null;
            if (departmentReq) {
                depart = await utilities.departmentNewApproach(req);
            }
            const collectionId = req.params['collectionId'];
            const body = { "productId": collectionId, "headerRequest": headerReq, "staticLabelFlag": staticLabelFlag, "flags": fetchFlag };
            const mainBodyApi = utilities.getFinalServiceURL(appProperties.collectionBody, req);
            if (cohFlag) {
                let coherencekey = cacheUtils.getDynamicCacheKey(req, "collection_");
                if (collectionId) {
                    coherencekey = cacheUtils.getDynamicCacheKey(req, "collection_", collectionId);
                }
                resp = await cacheUtils.retrieveCoherenceData(req, coherencekey);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    mainBodyInfo = resp.response;
                    pdpDynamicContent = await utilities.fetchPDPDynamicContent(req, (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo)); /*addedd for breadcrumb data 21773*/
                    if (pdpDynamicContent && pdpDynamicContent.config
                        && pdpDynamicContent.config.headers && pdpDynamicContent.config.headers.Cookie) {
                        cookieData = pdpDynamicContent.config.headers.Cookie;
                        //console.log("cookieData in PDP dynamic content", cookieData);
                    }
                    if (pdpDynamicContent && pdpDynamicContent.data && pdpDynamicContent.data.breadcrumbData) {
                        (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo).breadcrumbData = pdpDynamicContent.data.breadcrumbData;
                    }
                } else {
                    mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
                    let localData = Object.assign({}, mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
                    localData.headerContent = [];
                    localData.staticLabels = {};
                    localData.flags = {};
                    localData.breadcrumbData = {};
                    localData.alloffers = {};
                    if ((mainBodyInfo.data && mainBodyInfo.data.s === "0") && localData && Object.keys(localData).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], coherencekey, localData, resp['flag']);
                    }
                }
            } else {
                mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', body);
            }

            //const mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', { "productId": collectionId,"headerRequest":headerReq,"staticLabelFlag":staticLabelFlag,"flags":fetchFlag });
            /*Changes modified for change Password redirection -- start */
            let statusErrorCode = _.get(mainBodyInfo, 'data.errorCode', '');
            let statusCode = _.get(mainBodyInfo, 'data.code', '');
            if (
                (mainBodyInfo && mainBodyInfo.status && mainBodyInfo.status === 404)
                || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.code >= 500 && mainBodyInfo.data.code <= 510)
                || (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.s === "1")
            ) {
                return staticFiles.fileNotFound(req, reply, app);
            }
            else if (statusCode == 600 || statusCode == '600' || statusErrorCode == 1001 || statusErrorCode == '1001') {
                return reply.redirect('/tienda/users/changePassword?isredirect=true');
            }
            /*Changes modified for change Password redirection -- end */
            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }
            } else {
                utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }
            if (headerReq && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent
            }
            /*try {
                let local = {
                    "productId": "",
                    "isMarketPlace": "false",
                    "skuId": "",
                    "pType": "dummy"
                };
                if (mainBodyInfo.data) {
                    const collectionProduct = (mainBodyInfo.data.collectionProductInfo) ? mainBodyInfo.data.collectionProductInfo : null;
                    if (collectionProduct) {
                        local['productId'] = collectionProduct['product.collectionProductId'][0];
                        local['skuId'] = collectionProduct['sku.repositoryId'][0];
                    }
                }
                let URL = utilities.getFinalServiceURL(appProperties.getPdpDynamicContent, req);
                let localpayload = local;
                if (localpayload && (!localpayload["pType"] || typeof localpayload["pType"] === 'undefined'
                    || localpayload["pType"].trim() === '')) {
                    localpayload["pType"] = 'dummy';
                }
                const pdpDynamicContent = await utilities.serviceReq(req, URL, 'POST', localpayload);
                mainBodyInfo.data.breadcrumbData = pdpDynamicContent.data;
            } catch (e) {
                //console.log("error for pdp dynamic ", e);
            }*/
            const { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);

            const staticLabels = await utilities.getOnlySpecificStaticKeyData(labelsData, "PWA-PDP-PAGE", false);
            //const staticLabels = (labelsData && labelsData.staticLabelValues) ? labelsData.staticLabelValues.filter(function (currentValue) { return (currentValue.pageName === 'PWA-PDP-PAGE') }) : null;
            //logger.info("staticLabels Values PDPCollection " + JSON.stringify(staticLabels));
            (mainBodyInfo && mainBodyInfo.data) ? (mainBodyInfo.data.staticLabels = { 'staticLabelValues': staticLabels }) : (mainBodyInfo.staticLabels = { 'staticLabelValues': staticLabels });
            const finalData = {
                footerContent: footerData,
                headerContent: headerFooter,
                mainContent: (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo),
                staticLabelValues: staticLabels,
                configurationData: configurationData,
                limitedPiecesSkusData: [],
                departmentData: departmentData,
                hostname: req.info.hostname,
                // checkoutHeaderData,
                //checkoutFooterData
            }

            // const finalData = { footerContent: {}, headerContent: header, mainContent: mainBodyInfo.data, hostname: req.info.hostname, url: req.path }
            const collectionPageRes = await defaultHandlerWrapper(app, finalData)(req, '/tienda/collection');

            return reply.response(collectionPageRes);

        } catch (e) {
            return reply.response(e.message);
        }
    },
    getListOfStates: async (req, reply, app) => {
        try {
            let payload = (req.query && req.query.stateListType && req.query.stateListType === 'ITR') ? { "ITR": "ITR" } : {};
            let statePath = utilities.getFinalServiceURL(appProperties.getListOfStates, req);
            const stateList = await utilities.serviceReq(req, statePath, 'POST', payload);
            return stateList.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    pdpMarketProfileLandingPage: async (req, reply, app, pdpType) => {
        try {
            let sellerid = req.params.p;
            let headerReq = false; //utilities.isMultisite(req);
            let footerReq = false; //utilities.isMultisite(req);
            const staticLabelFlag = false; //utilities.isMultisite(req);
            let header = null;
            if (headerReq) {
                header = await utilities.getHeaderNewApproach(req, true);
                if (header && typeof header !== 'undefined' && Object.keys(header).length !== 0) {
                    headerReq = false;
                }
            }
            let footer = null;
            if (footerReq) {
                footer = await utilities.getFooterNewApproach(req);
            }
            let body = { "sellerid": sellerid }
            const extra = "&headerRequest=" + headerReq + "&staticLabelFlag=" + staticLabelFlag;
            const sellersUrl = utilities.getFinalServiceURL((appProperties.sellers + sellerid + extra), req);


            let mainBodyInfo = await utilities.serviceReq(req, sellersUrl, 'GET');
            if (headerReq && mainBodyInfo.data.headerContent) {
                header = mainBodyInfo.data.headerContent
            }

            const { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const staticLabels = await utilities.getOnlySpecificStaticKeyData(labelsData, "sellerDetailPage", false);
            mainBodyInfo.data.pdpType = pdpType;
            mainBodyInfo.data.sellerid = sellerid;
            mainBodyInfo.data.staticLabels.staticLabelValues = staticLabels;

            const finalData = {
                footerContent: footerData,
                headerContent: headerFooter,
                mainContent: (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo),
                staticLabelValues: staticLabels,
                configurationData: configurationData,
                limitedPiecesSkusData: [],
                departmentData: departmentData,
                hostname: req.info.hostname,
                // checkoutHeaderData,
                //checkoutFooterData
            };

            const marketPlace = await defaultHandlerWrapper(app, finalData)(req, '/tienda/marketplaceProfile');

            return reply.response(marketPlace).header('set-cookie', mainBodyInfo.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    getListOfStores: async (req, reply, app) => {
        try {
            let storePath = utilities.getFinalServiceURL(appProperties.realTimeInventoryCheckService, req);
            const storeList = await utilities.serviceReq(req, storePath, 'POST', req.payload);
            // {
            // "ïsStoreListforEDD": "false",
            // "onlyAvailableStore": "false",
            // "skuId": "pdp",
            // "state": "CAMPECHE",
            // "productType": "SL"
            // }

            return storeList.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getAddress: async (req, reply, app) => {
        try {
            let addressPath = utilities.getFinalServiceURL(appProperties.getAddresses, req);
            const addressList = await utilities.serviceReq(req, addressPath, 'POST', {
            });

            return addressList.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    estimatedDeliveryDate: async (req, reply, app) => {
        try {
            let eddPath = utilities.getFinalServiceURL(appProperties.estimatedDeliveryDate, req);
            const eddDate = await utilities.serviceReq(req, eddPath, 'POST', req.payload);

            return eddDate.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getVariants: async (req, reply, app) => {
        try {
            let payload = {
                "variantType": 'color',
                "variantValue": '',
                "productId": ''
            }
            if (req.query) {
                payload['variantType'] = req.query.variantType;
                payload['variantValue'] = req.query.variantValue;
                payload['productId'] = req.query.productId;
            }
            let mainBodyApi = utilities.getFinalServiceURL(appProperties.getVariants, req);
            const variantsInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', payload);
            return { variantsData: variantsInfo.data };
        } catch (e) {
            return reply.response(e.message);
        }
    },

    getPlp: async (req, reply, app) => {
        let responseStatusCode = 200;   // Change done for 404 service call
        try {
            let mainBodyInfo = {};
            let key = null;
            let pageName = "";
            const validQueryParams = "always##categoryId##sellerId##label##page##Nf##Ns##s##showkey##isSellerPlp##headerRequest##staticLabelFlag##flags";
            let payload = req.query;
            let allThirdPartyFlags = await utilities.fetchFlags(req, app);
            const fetchFlag = (allThirdPartyFlags && Object.keys(allThirdPartyFlags).length > 0) ? false : true;
            const staticLabelFlag = false; //utilities.isMultisite(req);

            payload['staticLabelFlag'] = staticLabelFlag;
            payload['headerRequest'] = false;
            payload['flags'] = fetchFlag;
            let mainBodyApi = utilities.getFinalServiceURL(appProperties.categoryBody, req);
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined' || !services) {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let cohFlag = services['endecaSearchService'];
            let showkey = req.query.showkey != null ? req.query.showkey : '';
            if (showkey && typeof showkey !== 'undefined' && (showkey.indexOf('true') || showkey.indexOf('TRUE'))) {
                showkey = 'true';
            } else {
                showkey = 'false';
            }
            const keyword = req.query.s;
            const categoryId = req.query.categoryId;
            const sellerId = req.query.sellerId;
            let dynamicId = categoryId && typeof categoryId !== 'undefined' ? categoryId : '';
            if ((typeof dynamicId === 'undefined' || dynamicId === '') && sellerId && typeof sellerId !== 'undefined') {
                dynamicId = sellerId;
            }
            if (keyword && typeof keyword !== 'undefined') {
                key = cacheUtils.getDynamicCacheKey(req, "keyword_", keyword);
            } else {
                key = cacheUtils.getDynamicCacheKey(req, "category_", dynamicId);
            }
            const testPayload = JSON.stringify(req.query);
            let skipCoherence = false;
            if (testPayload.indexOf('label') > -1 || testPayload.indexOf('Nf') > -1 || testPayload.indexOf('page') > -1 ||
                testPayload.indexOf('Ns') > -1 || testPayload.indexOf('always') > -1) {
                skipCoherence = true;
            }
            let header = null; // await utilities.getHeaderNewApproach(req,true);
            if (header && typeof header !== 'undefined' && Object.keys(header).length !== 0) {
                headerReq = false;
            }
            for (let k in payload) {
                if (validQueryParams.indexOf(k) < 0) {
                    delete payload[k]
                }
                if (key === "always" || key === "showPLP") {
                    pageName = "PWA-PLP-PAGE";
                }
            }
            if (!skipCoherence && cohFlag) {
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    mainBodyInfo = resp.response;
                } else {
                    mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', payload);
                    let localData = Object.assign({}, mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
                    localData.headerContent = [];
                    localData.staticLabels = {};
                    localData.flags = {};
                    if ((mainBodyInfo.data && mainBodyInfo.data.s === "0") && localData && Object.keys(localData).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, localData, resp['flag']);
                    }
                }
            } else {
                mainBodyInfo = await utilities.serviceReq(req, mainBodyApi, 'POST', payload);
            }
            if (!fetchFlag) {
                if (mainBodyInfo.data) {
                    mainBodyInfo.data.flags = allThirdPartyFlags;
                } else {
                    mainBodyInfo.flags = allThirdPartyFlags;
                }
            } else {
                utilities.pushFlagsToCoherence(req, (mainBodyInfo.data ? mainBodyInfo.data.flags : mainBodyInfo.flags))
            }
            let { headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            const mainData = (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo);
            let pageType = "";
            if (pageName === "PWA-PLP-PAGE") {
                pageType = 'TwoColumnPage';
            } else {
                pageType = mainData.contentItem && mainData.contentItem.contents && mainData.contentItem.contents[0] && mainData.contentItem.contents[0]["@type"] || '';
            }
            //categoryLandingPage
            // TwoColumnPage
            //LPDynamicBrandLandingPage LPStaticBrandLandingPage
            let skuArray = [];//1045733374
            if (pageType) {
                if (pageType === 'TwoColumnPage') {
                    pageName = "PWA-PLP-PAGE";
                    const mainContent = mainData.contentItem.contents[0]['mainContent'] || [];
                    let productsGTM = [];

                    mainContent.map((mainItem, index) => {
                        if (mainItem['@type'] === 'ContentSlotMain' && mainItem.contents.length > 0 && mainItem.contents[0]['@type'] === 'ResultsList') {
                            if (productsGTM.length == 0) {
                                productsGTM = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records || [];
                            }
                        }
                    });
                    if (productsGTM && productsGTM.length && productsGTM.length > 0) {
                        for (let k in productsGTM) {
                            if (productsGTM[k]['productId'][0] !== productsGTM[k]['sku.repositoryId'][0]) {
                                skuArray.push(productsGTM[k]['productId'][0]);
                                skuArray.push(productsGTM[k]['sku.repositoryId'][0]);
                            } else {
                                skuArray.push(productsGTM[k]['sku.repositoryId'][0]);
                            }
                        }
                    }

                } else if (pageType === 'categoryLandingPage') {
                    pageName = "PWA-CLP-PAGE";
                } else if (pageType === 'LPDynamicBrandLandingPage') {
                    pageName = "PWA-BLP-PAGE";
                } else if (pageType === 'LPStaticBrandLandingPage') {
                    pageName = "PWA-BLP-PAGE";
                }

            }
            let sendLimitedData = (pageType && pageType === 'TwoColumnPage' ? true : false);
            const staticData = await utilities.getOnlySpecificStaticKeyData(labelsData, pageName, false);
            const limitedData = await utilities.getOnlyRequiredLimitedData(limitedPiecesSkusData, skuArray);
            let result = {
                mainContent: (mainBodyInfo.data ? mainBodyInfo.data : mainBodyInfo),
                hostname: req.info.hostname,
                labelsData: staticData,
                configurationData
            }
            result.mainContent.staticLabels = staticData;
            result.limitedPiecesSkusData = (sendLimitedData ? limitedData : []);

            /* Change done for 404 service call:Start */
            responseStatusCode = 200;  // Success response Code
            if (result.mainContent && result.mainContent.data && ((result.mainContent.data.s && result.mainContent.data.s == "1")) || (result.mainContent.status == 404)) {
                responseStatusCode = 404  // page Not found response Code
            }
            // let plpData = []
            // try {
            //     plpData = result.mainContent.contentItem.contents[0].mainContent.filter(p => p.name === 'Results List Collection')[0].contents.filter(p => p['@type'] === 'ResultsList')[0].records
            // } catch (ex) {

            // }
            // if (plpData.length === 0) {
            //     responseStatusCode = 404  // page Not found response Code
            // }

            return reply.response(result).code(responseStatusCode);
            // return result;
            /* Change done for 404 service call:End */

        } catch (e) {
            /* Change done for 404 service call:start */
            responseStatusCode = 404  // page Not found response Code  
            return reply.response(e.message).code(responseStatusCode);
            /* Change done for 404 service call:End */

        }
    },
    getCarousels: async (req, reply, app) => {
        try {
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined' || !services) {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let carouselCohFlag = services['carousel'];
            let key = null;
            let carouselsInfo = null;
            let carousels = utilities.getFinalServiceURL(appProperties.getCarousels, req);
            if (req.query && req.query.carouselPaths) {
                carousels = carousels + "?carouselPaths=" + req.query.carouselPaths || '';
            }
            if (req.query && req.query.page && req.query.categoryId) {
                carousels = carousels + "?page=" + req.query.page + "&categoryId=" + req.query.categoryId || '';
            }
            if (req.query && req.query.page && req.query.sellerId) {
                carousels = carousels + "?page=" + req.query.page + "&sellerID=" + req.query.sellerId || '';
            }
            let guest = "_guest_false";
            if (req.query && req.query.isguest && (req.query.isguest === 'true' || JSON.stringify(req.query.isguest).indexOf('true') > -1)) {
                guest = "_guest_true";
            }
            if (req.query && req.query.carouselPaths) {
                key = cacheUtils.getDynamicCacheKey(req, "categorycarousels_", req.query.carouselPaths + guest);
            }
            else if (req.query && req.query.categoryId) {
                key = cacheUtils.getDynamicCacheKey(req, "categorycarousels_", req.query.page + '_' + req.query.categoryId + guest);
            } else if (req.query && req.query.sellerId) {
                key = cacheUtils.getDynamicCacheKey(req, "categorycarousels_", req.query.page + '_' + req.query.sellerId + guest);
            }
            if (carouselCohFlag) {
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    carouselsInfo = resp.response;
                } else {
                    carouselsInfo = await utilities.serviceReq(req, carousels, 'GET');
                    if (carouselsInfo && carouselsInfo.data && Object.keys(carouselsInfo.data).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, carouselsInfo.data, resp['flag']);
                    }
                }
            } else {
                carouselsInfo = await utilities.serviceReq(req, carousels, 'GET');
                if (carouselsInfo && carouselsInfo.data && Object.keys(carouselsInfo.data).length > 0) {
                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, carouselsInfo.data, resp['flag']);
                }

            }

            return (carouselsInfo.data ? carouselsInfo.data : carouselsInfo);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    recentlyViewed: async (req, reply, app) => {
        try {
            let path = utilities.getFinalServiceURL(appProperties.recentlyViewed, req);
            if (req.query && req.query.recentlyViewed) {
                path = path + "?recentlyViewed=" + req.query.recentlyViewed
            }
            const recentlyViewed = await utilities.serviceReq(req, path, 'GET');
            return recentlyViewed.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getHeaderInfo: async (req, reply, app) => {
        try {
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined' || !services) {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let headerCohFlag = services['header'];
            let key = null;
            let resp = null;
            let response = {};
            /*if (req.headers && req.headers.cookie && req.headers.cookie.indexOf("LoggedInSession") > -1) {
                loginParam = "_false";
            } else {
                loginParam = "_true";
            }*/
            if (headerCohFlag) {
                key = cacheUtils.getDynamicCacheKey(req, "header_", req.query.page);
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    response = resp.response;
                } else {
                    const getheaderAPI = utilities.getFinalServiceURL(appProperties.headerInfo, req);
                    response = await utilities.serviceReq(req, getheaderAPI + '?page=' + req.query.page, 'GET');
                    if (response && response.data && Object.keys(response.data).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                    }
                }
            } else {
                const getheaderAPI = utilities.getFinalServiceURL(appProperties.headerInfo, req);
                response = await utilities.serviceReq(req, getheaderAPI + '?page=' + req.query.page, 'GET');
                if (response && response.data && Object.keys(response.data).length > 0) {
                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                }

            }
            return (response.data ? response.data : response);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getFooterInfo: async (req, reply, app) => {
        // pageProps optimization change Start
        try {
            let headerDetails = utilities.getHeaderDetails(req)
            const brandName = headerDetails && headerDetails.brand || 'LP';

            const siteData = app.siteData && app.siteData[brandName + 'Data'];
            //23959 start here
            let footerContent = {};
            if (req.query.page && req.query.page === "checkout") {
                footerContent = siteData && siteData.checkoutfooter && { ...siteData.checkoutfooter } || undefined;
            } else {
                footerContent = siteData && siteData.footer && { ...siteData.footer } || undefined;
            }
            //23959 ends here
            if (footerContent) {
                footerContent.brand = brandName;
                footerContent.siteData = 'True';
                return footerContent;
            }

        } catch (ex) {

        }
        // pageProps optimization change End

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
                loginParam = "_false";
            } else {
                loginParam = "_true";
            }
            if (headerCohFlag) {
                key = cacheUtils.getDynamicCacheKey(req, "footer_", req.query.page + "_" + loginParam);
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    footerInfoData = resp.response;
                } else {
                    let footerInfo = utilities.getFinalServiceURL(appProperties.footerInfo, req);
                    if (req.query && req.query.page) {
                        footerInfo = footerInfo + '?page=' + req.query.page || '';
                    }
                    footerInfoData = await utilities.serviceReq(req, footerInfo, 'GET');
                    if (footerInfoData && footerInfoData.data && Object.keys(footerInfoData.data).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, footerInfoData.data, resp['flag']);
                    }
                }
            } else {
                let footerInfo = utilities.getFinalServiceURL(appProperties.footerInfo, req);
                if (req.query && req.query.page) {
                    footerInfo = footerInfo + '?page=' + req.query.page || '';
                }
                footerInfoData = await utilities.serviceReq(req, footerInfo, 'GET');
                if (footerInfoData && footerInfoData.data && Object.keys(footerInfoData.data).length > 0) {
                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, footerInfoData.data, resp['flag']);
                }

            }
            return (footerInfoData.data ? footerInfoData.data : footerInfoData);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getTypeheadData: async (req, reply, app) => {
        try {
            let typeHead = utilities.getFinalServiceURL(appProperties.getTypeheadData, req);
            // getTypeheadData service convert to GET from POST :: Start
            let payLoad = {};
            payLoad.Ntt = req.query.Ntt || '';
            const typeHeadRes = await utilities.serviceReq(req, typeHead, 'POST', payLoad);
            // getTypeheadData service convert to GET from POST :: Start
            return typeHeadRes.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getInstanceData: async (req, reply, app) => {
        var data = {
            NODE_ENV: process.env.NODE_ENV || '',
            PORT: process.env.PORT || '',
            INSTANCE_NAME: process.env.INSTANCE_NAME || '',
            ENVIRONMENT: process.env.ENVIRONMENT || ''
        }, cookies = '';

        try {
            let getinstancedetails = utilities.getFinalServiceURL('/getinstancedetails', req);

            const instanceDetails = await utilities.serviceReq(req, getinstancedetails, 'POST', { "page": "web" });
            if (instanceDetails.statusText == 'OK' && instanceDetails.data && instanceDetails.data.AADetails) {
                data.AADetails = instanceDetails.data.AADetails;
            }
            if (instanceDetails.statusText == 'OK' && instanceDetails.data && instanceDetails.data.profile) {
                data.profile = instanceDetails.data.profile;
                if (data.profile.isProfileTransient) {
                    data.profile['transient'] = 'true';
                } else {
                    data.profile['transient'] = 'false';
                }
            }
            if (instanceDetails.statusText == 'OK' && instanceDetails.data && instanceDetails.data.orderInfo) {
                data.orderInfo = instanceDetails.data.orderInfo;
            }
            if (instanceDetails.statusText == 'OK' && instanceDetails.data && instanceDetails.data.shippingGroupInfo) {
                data.shippingGroupInfo = JSON.stringify(instanceDetails.data.shippingGroupInfo);

            }
            if (instanceDetails.statusText == 'OK' && instanceDetails.data && instanceDetails.data.commerceItemsInfo) {
                data.commerceItemsInfo = JSON.stringify(instanceDetails.data.commerceItemsInfo);
            }

            data.globalServiceData = instanceDetails.headers;
            cookies = instanceDetails.headers['set-cookie'];
        } catch (e) {
            data.globalServiceData = e.config.headers;
            cookies = e.config.headers['set-cookie'];
        }
        let instancePage = await defaultHandlerWrapper(app, data)(req, '/tienda/instancedetails');
        return reply.response(instancePage).header('set-cookie', cookies);

    },
    lpcomparesummary: async (req, reply, app) => {
        try {
            let compareSummaryApi = utilities.getFinalServiceURL(appProperties.lpComparesummary, req);
            const comparatorProductsInfo = await utilities.serviceReq(req, compareSummaryApi, 'POST', '');
            return reply.response(comparatorProductsInfo.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    clearList: async (req, reply, app) => {
        try {
            let clearListApi = utilities.getFinalServiceURL(appProperties.clearList, req);
            const clearListApiInfo = await utilities.serviceReq(req, clearListApi, 'GET');
            return reply.response(clearListApiInfo.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    lpaddproduct: async (req, reply, app) => {
        try {
            let cartDetails = utilities.getFinalServiceURL(appProperties.lpaddproduct, req);
            const addProductToCompareRes = await utilities.serviceReq(req, cartDetails, 'POST', req.payload);
            return reply.response(addProductToCompareRes.data).header('set-cookie', addProductToCompareRes.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    lpdeleteproduct: async (req, reply, app) => {
        try {
            let cartDetails = utilities.getFinalServiceURL(appProperties.lpdeleteproduct, req);
            const deleteProductFromCompareRes = await utilities.serviceReq(req, cartDetails, 'POST', req.payload);
            return reply.response(deleteProductFromCompareRes.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getCreditCards: async (req, reply, app) => {
        try {
            let route = utilities.getFinalServiceURL(appProperties.getCreditCards, req);
            const data = await utilities.serviceReq(req, route, 'POST', undefined);
            return data.data
        } catch (e) {
            return reply.response(e.message);
        }
    },
    cardAdd: async (req, reply, app) => {
        try {
            // added or updated for 23887
            //const headerFooter = await utilities.getHeaderFooter(req);
            let { headerFooter, configurationData } = await utilities.getInitialDataOnStartUp(req, app);
            let cardLengthMap = [];
            if (configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration
                && configurationData.configuration.liverpoolconfiguration.cardlengthsmap) {
                const localArray = configurationData.configuration.liverpoolconfiguration.cardlengthsmap;
                let localMap = {};
                for (let k in localArray) {
                    localMap = localArray[k];
                    for (let kk in localMap) {
                        let splitlist = localMap[kk].split("/");
                        if (splitlist && splitlist.length > 1) {
                            cardLengthMap.push({ "key": kk, "min": splitlist[0].trim(), "max": splitlist[splitlist.length - 1].trim() })
                        } else {
                            cardLengthMap.push({ "key": kk, "min": splitlist[0].trim(), "max": splitlist[0].trim() })
                        }
                    }
                }
            }
            return defaultHandlerWrapper(app, { headerContent: headerFooter, cardLengthInfo: cardLengthMap, configurationData, hostname: req.info.hostname })(req, '/tienda/users/newCreditCard');
        } catch (e) {
            return reply.response(e.message);
        }
    },
    removeCreditCard: async (req, reply, app) => {
        try {
            let route = utilities.getFinalServiceURL(appProperties.removeCreditCard, req);
            const data = await utilities.serviceReq(req, route, 'POST', req.payload);

            return data.data
        } catch (e) {
            return reply.response(e.message);
        }
    },
    setDefaultCreditCard: async (req, reply, app) => {
        try {
            let route = utilities.getFinalServiceURL(appProperties.setDefaultCreditCard, req);
            const data = await utilities.serviceReq(req, route, 'POST', req.payload);

            return data.data
        } catch (e) {
            return reply.response(e.message);
        }
    },
    limitedPiecesSkus: async (req, reply, app) => {
        // pageProps optimization change Start
        try {
            let headerDetails = utilities.getHeaderDetails(req)
            const brandName = headerDetails && headerDetails.brand || 'LP';

            const siteData = app.siteData && app.siteData[brandName + 'Data'];
            //23959 start here
            let limitedpiecesData = {};

            limitedpiecesData = siteData && siteData.limitedpiecesskus && { ...siteData.limitedpiecesskus } || undefined;

            //23959 ends here
            if (limitedpiecesData) {
                limitedpiecesData.brand = brandName;
                limitedpiecesData.siteData = 'True';
                return limitedpiecesData;
            }

        } catch (ex) {

        }
        // pageProps optimization change End
        try {
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined' || !services) {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let limitedPieceFlag = services['limitedPiece'];
            let key = null;
            let resp = null;
            let addProductlimitedPieces = {};
            if (limitedPieceFlag) {
                key = "limitedPieces_";
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    addProductlimitedPieces = resp.response;
                } else {
                    let limitedPieces = utilities.getFinalServiceURL(appProperties.limitedPiecesSkus, req);
                    addProductlimitedPieces = await utilities.serviceReq(req, limitedPieces, 'GET');
                    if (addProductlimitedPieces && addProductlimitedPieces.data && Object.keys(addProductlimitedPieces.data).length > 0) {
                        const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, addProductlimitedPieces.data, resp['flag']);
                    }
                }
            } else {
                let limitedPieces = utilities.getFinalServiceURL(appProperties.limitedPiecesSkus, req);
                addProductlimitedPieces = await utilities.serviceReq(req, limitedPieces, 'GET');
                if (addProductlimitedPieces && addProductlimitedPieces.data && Object.keys(addProductlimitedPieces.data).length > 0) {
                    const ll = await cacheUtils.pushCoherenceData(resp['cacheName'], key, addProductlimitedPieces.data, resp['flag']);
                }

            }
            return reply.response((addProductlimitedPieces.data ? addProductlimitedPieces.data : addProductlimitedPieces));
        } catch (e) {
            return reply.response(e.message);
        }
    },

    turntomobile: async (req, reply, app) => {

        try {
            let turntokey = utilities.getturntokey(req.info.hostname);
            let page = await defaultHandlerWrapper(app, { turntokeys: turntokey, hostname: req.info.hostname })(req, '/tienda/turntomobile');
            return reply.response(page);;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    getHeader: async (req, reply, app) => {
        try {
            const headerFooter = await utilities.getHeaderFooter(req, true);
            const homePageRes = await defaultHandlerWrapper(app, { headerContent: headerFooter.header, hostname: req.info.hostname })(req);
            return reply.response(homePageRes)
        } catch (e) {
            return reply.response(e.message);
        }
    },

    addToBagPdp: async (req, reply, app) => {
        try {
            let addItemToCartApi = utilities.getFinalServiceURL(appProperties.addItemToCart, req);
            const addToCartRes = await utilities.serviceReq(req, addItemToCartApi, 'POST', req.payload);
            //let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
            //const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
            //const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
            let quantity = 0;
            if (addToCartRes && addToCartRes.data && addToCartRes.data.s == '0') {
                const itemDetails = addToCartRes.data && addToCartRes.data.itemDetailsInfo && addToCartRes.data.itemDetailsInfo.itemDetails || [];
                if (itemDetails.length > 0) {
                    const mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
                    const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
                    const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
                    quantity = myBagCount;
                } else {
                    for (var i in addToCartRes.data) {
                        if (i.indexOf('ci') > -1 && typeof addToCartRes.data[i] === 'object') {
                            quantity = quantity + addToCartRes.data[i]['quantity'];
                        }
                    }
                }
                addToCartRes.data.quantity = quantity;
                //addToCartRes.data.quantity = myBagCount;
            }
            return reply.response(addToCartRes.data).header('set-cookie', addToCartRes.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    invalidateCache: async (req, reply, app) => {
        const { error, siteData } = await utilities.invalidateSiteInitialData(req, app);
        return reply.response({ error: error, data: siteData });
    }
};
