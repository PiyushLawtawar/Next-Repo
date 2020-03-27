const { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } = require('../../server/nextwrapper');
const utilities = require('../helpers/Utility.js'),
    cacheUtils = require('../helpers/cacheUtils.js');
const appProperties = require('../../client/config/appProperties.js')
// const pdf = require('../../json/pdf.json');
module.exports = {
    login: async (req, reply, app) => {
        try {
            let loginURL = utilities.getFinalServiceURL(appProperties.login, req);
            const loginResponse = await utilities.serviceReq(req, loginURL, 'POST', req.payload);
            let turntokey = utilities.getturntokey(req.info.hostname);
            //#rating issue in PRODUCTION
            loginResponse.data.turntokey = turntokey;
            //#rating issue in PRODUCTION
            return reply.response(loginResponse.data).header('set-cookie', loginResponse.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    logout: async (req, reply, app) => {
        try {
            let logoutURL = utilities.getFinalServiceURL(appProperties.logout, req);
            const logoutResponse = await utilities.serviceReq(req, logoutURL, 'POST', req.payload);
            return reply.response(logoutResponse.data).header('set-cookie', logoutResponse.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    addToCache: async (req, h) => {
        try {
            const cacheSer = await cacheUtils.getCacheServer('lp_EA_HTML_Content');
            const res = await cacheUtils.push(cacheSer, req.payload.key, req.payload.val);
            return res;
        } catch (e) {
            //console.log(e);
            return e;
        }

    },
    getCache: async (req, h) => {
        try {
            const cacheSer = await cacheUtils.getCacheServer('lp_EA_HTML_Content');
            const res = await cacheUtils.get(cacheSer, req.payload.key);
            return res;
        } catch (e) {
            //console.log(e);
            return e;
        }

    },
    getCartHeaderDetails: async (req, reply, app) => {
        try {
            let CartHeaderDetailsURL = utilities.getFinalServiceURL(appProperties.getCartHeaderDetails, req);
            const cartHeaderResponse = await utilities.serviceReq(req, CartHeaderDetailsURL, 'POST', req.payload);
            return reply.response(cartHeaderResponse.data).header('set-cookie', cartHeaderResponse.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },


    personalData: async (req, reply, app) => {
        try {
            let personalDataURL = utilities.getFinalServiceURL(appProperties.summary, req);
            const personalDataResponse = await utilities.serviceReq(req, personalDataURL, 'POST', undefined);
            //console.log(personalDataResponse, 'personalDataResponse-------------------')
            return personalDataResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    updatePersonalData: async (req, reply, app) => {
        try {
            let updatePersonalDataURL = utilities.getFinalServiceURL(appProperties.updateUser, req);
            const updatePersonalInfoDataResponse = await utilities.serviceReq(req, updatePersonalDataURL, 'POST', req.payload);
            return updatePersonalInfoDataResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    cellPhone: async (req, reply, app) => {
        try {
            let cellPhoneURL = utilities.getFinalServiceURL(appProperties.getPhoneNumber, req);
            const cellPhoneResponse = await utilities.serviceReq(req, cellPhoneURL, 'POST', req.payload);
            return cellPhoneResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    phoneServiceSearch: async (req, reply, app) => {
        try {
            let phoneServiceSearchURL = utilities.getFinalServiceURL(appProperties.phoneServiceSearch, req);
            const phoneServiceSearchResponse = await utilities.serviceReq(req, phoneServiceSearchURL, 'POST', req.payload);
            return phoneServiceSearchResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    airtimeAmountSearch: async (req, reply, app) => {
        try {
            let airtimeAmountSearchURL = utilities.getFinalServiceURL(appProperties.airtimeAmountSearch, req);
            const airtimeAmountSearchResponse = await utilities.serviceReq(req, airtimeAmountSearchURL, 'POST', req.payload);
            return airtimeAmountSearchResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    //airtime Checkout Landing
    airtimeCheckoutLand: async (req, reply, app) => {
        try {
            let airtimeCheckoutLandURL = utilities.getFinalServiceURL(appProperties.airtimecheckoutland, req);
            const airtimeCheckoutLandResponse = await utilities.serviceReq(req, airtimeCheckoutLandURL, 'POST', req.payload);
            return airtimeCheckoutLandResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    //air time checkout
    airtimeCheckout: async (req, reply, app) => {
        try {
            let airtimeCheckoutURL = utilities.getFinalServiceURL(appProperties.airtimecheckout, req);
            const airtimeCheckoutResponse = await utilities.serviceReq(req, airtimeCheckoutURL, 'POST', req.payload);
            return airtimeCheckoutResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    //get notification
    getPreferences: async (req, reply, app) => {
        try {
            let notificationURL = utilities.getFinalServiceURL(appProperties.getPreferences, req);
            const userPreferencesInfo = await utilities.serviceReq(req, notificationURL, 'GET', undefined);
            return reply.response(userPreferencesInfo.data);

        } catch (e) {
            return reply.response(e.message);
        }
    },
    //update Notification Preferences
    updateNotificationPreferences: async (req, reply, app) => {
        try {
            let notificationURL = utilities.getFinalServiceURL(appProperties.updatePreferences, req);
            const updateUserPreferencesInfo = await utilities.serviceReq(req, notificationURL, 'POST', req.payload);
            return reply.response(updateUserPreferencesInfo.data);

        } catch (e) {
            return reply.response(e.message);
        }
    },
    addNewPhoneNumber: async (req, reply, app) => {
        try {
            let addNewPhoneNumberURL = utilities.getFinalServiceURL(appProperties.addNewPhoneNumber, req);
            const addNewPhoneNumberResponse = await utilities.serviceReq(req, addNewPhoneNumberURL, 'POST', req.payload);
            return addNewPhoneNumberResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },
    removePhoneNumber: async (req, reply, app) => {
        try {
            let removePhoneNumberURL = utilities.getFinalServiceURL(appProperties.removePhoneNumber, req);
            const removePhoneNumberResponse = await utilities.serviceReq(req, removePhoneNumberURL, 'POST', req.payload);
            return removePhoneNumberResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },


    cellPhoneEdit: async (req, reply, app) => {
        try {
            let cellPhoneEditURL = utilities.getFinalServiceURL(appProperties.editPhoneNumber, req);
            const cellPhoneEditResponse = await utilities.serviceReq(req, cellPhoneEditURL, 'POST', req.payload);
            return cellPhoneEditResponse.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },



    cellPhoneEmpty: async (req, reply, app) => {
        try {
            let cellPhoneEmptyURL = utilities.getFinalServiceURL(appProperties, req);
            const cellPhoneEmptyResponse = await utilities.serviceReq(req, cellPhoneEmptyURL, 'POST', req.payload);
            return reply.response(cellPhoneEmptyResponse.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    resetPasswordInfo: async (req, reply, app) => {
        try {
            let resetPasswordURL = utilities.getFinalServiceURL(appProperties.resetPassword, req);
            const resetPasswordResponse = await utilities.serviceReq(req, resetPasswordURL, 'POST', req.payload);
            return reply.response(resetPasswordResponse.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    changePasswordInfo: async (req, reply, app) => {
        try {
            let changePasswordURL = utilities.getFinalServiceURL(appProperties.changePassword, req);
            const changePasswordResponse = await utilities.serviceReq(req, changePasswordURL, 'POST', req.payload);
            return reply.response(changePasswordResponse.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    createAccountInfo: async (req, reply, app) => {
        try {
            let createAccountURL = utilities.getFinalServiceURL(appProperties.createAccount, req);
            const createAccountResponse = await utilities.serviceReq(req, createAccountURL, 'POST', req.payload);
            return reply.response(createAccountResponse.data).header('set-cookie', createAccountResponse.headers['set-cookie']);
            return reply.response(createAccountResponse.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    createNewCard: async (req, reply, app) => {
        try {
            let createNewCardURL = utilities.getFinalServiceURL(appProperties.createNewCard, req);
            const createNewCardResponse = await utilities.serviceReq(req, createNewCardURL, 'POST', req.payload);
            return reply.response(createNewCardResponse.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    cardSearch: async (req, reply, app) => {
        try {
            let cardSearchURL = utilities.getFinalServiceURL(appProperties.cardSearch, req);
            const cardSearchResponse = await utilities.serviceReq(req, cardSearchURL, 'POST', req.payload);
            return reply.response(cardSearchResponse.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getHeaderDetailsOLD: async (req, reply, app) => {
        try {
            const headerFooter = await utilities.getHeaderFooter(req);
            let turntokey = utilities.getturntokey(req.info.hostname);
            headerFooter.turntokeys = turntokey;
            let headerFooterRes = await defaultHandlerWrapper(app, { headerContent: headerFooter.header, turntokeys: turntokey, hostname: req.info.hostname })(req);
            return reply.response(headerFooterRes);
        } catch (e) {
            // console.error(e);
            return reply.response(e.message);
        }
    },
    getHeaderDetails: async (req, reply, app) => {
        try {
            let { headerFooter, footerData, labelsData, configurationData, departmentData, checkoutFooterData } = await utilities.getInitialDataOnStartUp(req, app);
            // const headerFooter = await utilities.getHeaderFooter(req);
            // const footerRes = await utilities(Path.footerInfo + "?page=checkout", 'GET');
            // let footerResURL = utilities.getFinalServiceURL(appProperties.footerInfo, req);
            // const footerRes = await utilities.serviceReq(req, footerResURL + "?page=checkout", 'GET', undefined);
            let turntokey = utilities.getturntokey(req.info.hostname);
            headerFooter.turntokeys = turntokey;
            let headerFooterRes = await defaultHandlerWrapper(app, { checkoutFooterData: checkoutFooterData, headerContent: headerFooter, turntokeys: turntokey, hostname: req.info.hostname, labelData: labelsData, staticLabelValues: labelsData, configurationData: configurationData, departmentData: departmentData })(req);
            return reply.response(headerFooterRes);
        } catch (e) {
            // console.error(e);
            return reply.response(e.message);
        }
    },
    //MyAccount getAddress
    getMyAccountLeftNav: async (req, reply, app) => {
        try {
            let pageId = req.query.page;
            let url = utilities.getFinalServiceURL(appProperties.getMyAccountLeftNav + pageId, req);
            const response = await utilities.serviceReq(req, url, 'GET');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    orderDetailService: async (req, reply, app) => {
        try {
            let url = utilities.getFinalServiceURL(appProperties.orderDetailService, req);
            const response = await utilities.serviceReq(req, url, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },

    orderHistory: async (req, reply, app) => {
        try {
            let orderHistoryPath = utilities.getFinalServiceURL(appProperties.orderHistory, req);
            const resData = await utilities.serviceReq(req, orderHistoryPath, 'POST', req.payload);
            return resData.data;
        }
        catch (e) {

            return reply.response(e.message);
        }
    },
    // MyOrder
    getMyOrdersConsolidated: async (req, reply, app) => {
        try {

            return defaultHandlerWrapper(app, {})(req, '/tienda/users/orderHistory');

        } catch (e) {
            return reply.response(e.message);
        }
    },
    orderSearch: async (req, reply, app) => {
        try {
            let orderSearchPath = utilities.getFinalServiceURL(appProperties.orderSearch, req);
            const resData = await utilities.serviceReq(req, orderSearchPath, 'POST', req.payload);
            return resData.data;
        }
        catch (e) {

            return reply.response(e.message);
        }
    },
    orderLineItemStatus: async (req, reply, app) => {
        try {
            let orderLineItemStatusPath = utilities.getFinalServiceURL(appProperties.orderLineItemStatus, req);
            const orderLineItemStatusPathData = await utilities.serviceReq(req, orderLineItemStatusPath, 'POST', req.payload);
            return orderLineItemStatusPathData.data;
        }
        catch (e) {

            return reply.response(e.message);
        }
    },
    getdownloadTicketF: async (req, reply, app) => {
        let data = null; //downloadTicket
        // console.log('req', req);
        try {
            let Path = utilities.getFinalServiceURL(appProperties.downloadTicket, req);
            const response = await utilities.serviceReq(req, Path, 'POST', req.payload);
            data = response.data;
            // console.log("data = " + JSON.stringify(data))
        }
        catch (e) {
            return reply.response(e.message);
        }
        return data
    },
    updateAbandonedEmailPreference: async (req, reply, app) => {
        try {
            //const headerFooter = await utilities.getHeaderFooter(req);
            let Path = utilities.getFinalServiceURL(appProperties.updateAbandonedEmailPreference, req);
            const response = await utilities.serviceReq(req, Path, 'POST', req.payload);
            return response.data;
        }
        catch (e) {
            return reply.response(e.message);
        }
    },
    evaluation: async (req, reply, app) => {
        try {
            //const headerFooter = await utilities.getHeaderFooter(req);
            let Path = utilities.getFinalServiceURL(appProperties.evaluation, req);
            const response = await utilities.serviceReq(req, Path, 'POST', req.payload);
            return response.data;
        }
        catch (e) {
            return reply.response(e.message);
        }
    },
    validateUpdateProfile: async (req, reply, app) => {
        try {
            //const headerFooter = await utilities.getHeaderFooter(req);
            let Path = utilities.getFinalServiceURL(appProperties.validateUpdateProfile, req);
            const response = await utilities.serviceReq(req, Path, 'POST', req.payload);
            return response.data;
        }
        catch (e) {
            return reply.response(e.message);
        }
    }

}