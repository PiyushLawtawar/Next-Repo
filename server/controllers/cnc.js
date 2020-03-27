// const pdf = require('../../json/pdf.json');
const { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } = require('../../server/nextwrapper');
const utilities = require('../helpers/Utility.js');
const appProperties = require('../../client/config/appProperties.js'),
    cacheUtils = require('../helpers/cacheUtils'),
    settings = require('../../client/config/settings');

module.exports = {
    getMyBagNewApproach: async (req, reply, app, isAjax) => {
        try {
            let cartDetailsApi = utilities.getFinalServiceURL(appProperties.getCartDetailsNewApproach, req);
            let cartsData = await utilities.serviceReq(req, cartDetailsApi, 'POST', { "cartResponseFormat": "true" });
            let cartPageRes;
            const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData } = await utilities.getInitialDataOnStartUp(req, app);

            if (cartsData && cartsData.data) {
                cartsData.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
                let allThirdPartyFlags = await utilities.fetchFlags(req, app);
                if (labelsData) {//pwa-shoppingCartPage
                    let cartStaticLabel = { "staticLabelValues": [], "showKey": labelsData.showKey };
                    const sData = labelsData.staticLabelValues ? labelsData.staticLabelValues : labelsData;
                    if (sData && sData.length > 0) {
                        sData.map(staticLabel => {
                            if (staticLabel && staticLabel.pageName && staticLabel.pageName === 'pwa-shoppingCartPage') {
                                data = staticLabel.keyValues;
                                cartStaticLabel.staticLabelValues.push(staticLabel);
                            }

                        });
                    }
                    cartsData.data.staticLabels = cartStaticLabel;
                    cartsData.data.flags = allThirdPartyFlags;

                }
            }
            if (isAjax) {
                //staticLabelValues:labelsData  checkoutHeaderData, checkoutFooterData are removed in the below statement as pages are using the above "cartsData.data.staticLabels" and to avoid the performance issue i.e page size
                cartPageRes = { cartHeader: cartsData && cartsData.data && cartsData.data.cartHeaderResponse, cartPageContent: cartsData.data, headerContent: headerFooter, footerContent: footerData, hostname: req.info.hostname, url: req.path, configurationData: configurationData, departmentData: departmentData, limitedPiecesSkus: limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData, staticLabelValues: labelsData };
            } else {
                //staticLabelValues:labelsData  checkoutHeaderData, checkoutFooterData are removed in the below statement as pages are using the above "cartsData.data.staticLabels" and to avoid the performance issue i.e page size
                cartPageRes = await defaultHandlerWrapper(app, { cartHeader: cartsData && cartsData.data && cartsData.data.cartHeaderResponse, cartPageContent: cartsData.data, headerContent: headerFooter, footerContent: footerData, hostname: req.info.hostname, url: req.path, configurationData: configurationData, departmentData: departmentData, limitedPiecesSkus: limitedPiecesSkusData, checkoutHeaderData, checkoutFooterData, staticLabelValues: labelsData })(req, "/tienda/myBag");
            }

            return reply.response(cartPageRes).header('set-cookie', cartsData.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getMyBag: async (req, reply, app, isAjax) => { // this method is depreacted now and not using currently. it is kept for future reference until code is stablized
        try {
            //  const headerFooter = await utilities.getHeaderFooter(req);

            //  let limitedPiecesApi = utilities.getFinalServiceURL(appProperties.limitedPiecesSkus, req);
            //  let limitedPieces = await utilities.serviceReq(req, limitedPiecesApi, 'GET');

            let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
            const wishListCountData = await utilities.serviceReq(req, wishListCountApi, 'GET');

            let giftWrapperDisplayServiceApi = utilities.getFinalServiceURL(appProperties.giftWrapperDisplayService, req);
            const giftWrapperDisplayServiceData = await utilities.serviceReq(req, giftWrapperDisplayServiceApi, 'POST');

            let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
            const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');

            let cartDetailsApi = utilities.getFinalServiceURL(appProperties.cartDetails, req);
            let cartsData = await utilities.serviceReq(req, cartDetailsApi, 'POST', { "cartResponseFormat": "true" });

            if (cartsData && cartsData.data) {
                cartsData.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
                //   cartsData.data.limitedPieces = limitedPieces.data;
                cartsData.data.wishListCount = wishListCountData && wishListCountData.data && wishListCountData.data.quantity || 0;
                cartsData.data.myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
                cartsData.data.giftWrapperDisplayServiceData = giftWrapperDisplayServiceData && giftWrapperDisplayServiceData.data || 0;

            }
            let cartPageRes;
            const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData } = await utilities.getInitialDataOnStartUp(req, app);

            if (isAjax) {
                cartPageRes = { cartPageContent: cartsData.data, headerContent: headerFooter, footerContent: footerData, hostname: req.info.hostname, url: req.path, checkoutHeaderData, checkoutFooterData, staticLabelValues: labelsData, configurationData: configurationData, departmentData: departmentData, limitedPiecesSkus: limitedPiecesSkusData };
            } else {
                cartPageRes = await defaultHandlerWrapper(app, { cartPageContent: cartsData.data, headerContent: headerFooter, footerContent: footerData, hostname: req.info.hostname, url: req.path, checkoutHeaderData, checkoutFooterData, staticLabelValues: labelsData, configurationData: configurationData, departmentData: departmentData, limitedPiecesSkus: limitedPiecesSkusData })(req, "/tienda/myBag");
                // cartPageRes = await defaultHandlerWrapper(app, { cartPageContent: cartsData.data,headerContent: headerFooter.header, hostname: req.info.hostname, url: req.path, })(req, "/tienda/myBag");
            }

            return reply.response(cartPageRes).header('set-cookie', cartsData.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    addToBag: async (req, reply, app) => {
        try {
            let addItemToCartApi = utilities.getFinalServiceURL(appProperties.addItemToCartFromWishlist, req);
            const addToCartRes = await utilities.serviceReq(req, addItemToCartApi, 'POST', req.payload);
            /* let displayWishListDetailsURL = utilities.getFinalServiceURL(appProperties.displayWishListDetails, req);
             const wishListData = await utilities.serviceReq(req, displayWishListDetailsURL, 'GET');
                 let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
                  const wishListCountData = await utilities.serviceReq(req, wishListCountApi, 'GET');
                  let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
                 const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
                  const wishListCount = wishListCountData && wishListCountData.data && wishListCountData.data.quantity || 0;
                 const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
                  addToCartRes.data.wishListCount = wishListCount;
                  addToCartRes.data.myBagCount = myBagCount;
                  addToCartRes.data.wishlistItem=wishListData.data.wishlistItem || [];;*/
            //Already wishlist items, wishlist count, my bag count values are coming from AA node services and hence above code is commented
            return reply.response(addToCartRes.data).header('set-cookie', addToCartRes.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    addMultipleItemsToBag: async (req, reply, app) => {
        try {
            let addMultipleItemsToCartApi = utilities.getFinalServiceURL(appProperties.addmultipleitemstoorder, req);
            const addToCartRes = await utilities.serviceReq(req, addMultipleItemsToCartApi, 'POST', req.payload);
            return reply.response(addToCartRes.data).header('set-cookie', addToCartRes.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getCollectionProductDetails: async (req, reply, app) => {
        try {
            let getCollectionProductDetailsAPi = utilities.getFinalServiceURL(appProperties.pdpBody, req);
            const getCollectionProductDetailsRes = await utilities.serviceReq(req, getCollectionProductDetailsAPi, 'POST', req.payload);
            return reply.response(getCollectionProductDetailsRes.data).header('set-cookie', getCollectionProductDetailsRes.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    removeitemfromcart: async (req, reply, app) => {
        try {
            let removeCartApi = utilities.getFinalServiceURL(appProperties.removeitemfromcart, req);
            const response = await utilities.serviceReq(req, removeCartApi, 'POST', req.payload);
            //let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
            //const wishListCountData = await utilities.serviceReq(req, wishListCountApi, 'GET');
            //let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
            //const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
            //const wishListCount = wishListCountData && wishListCountData.data && wishListCountData.data.quantity || 0;
            //const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
            // response.data.wishListCount = wishListCount;
            // response.data.myBagCount = myBagCount;
            /**
             * wishlist count and my bag count is taken care in AA node service it self
             */
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    additemtowishlist: async (req, reply, app) => {
        try {
            let additemtowishlistApi = utilities.getFinalServiceURL(appProperties.removeitemfromcart, req);
            const response = await utilities.serviceReq(req, additemtowishlistApi, 'POST', req.payload);
            //let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
            //const wishListCountData = await utilities.serviceReq(req, wishListCountApi, 'GET');
            // let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
            //const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
            //const wishListCount = wishListCountData && wishListCountData.data && wishListCountData.data.quantity || 0;
            //const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
            //response.data.wishListCount = wishListCount;
            //response.data.myBagCount = myBagCount;
            /**
             * wishlist count and my bag count is taken care in AA node service it self
             */
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    updateitemquantity: async (req, reply, app) => {
        try {
            let updateitemquantityApi = utilities.getFinalServiceURL(appProperties.updateitemquantity, req);
            let response = await utilities.serviceReq(req, updateitemquantityApi, 'POST', req.payload);
            let err;
            if (response.data && response.data.s && response.data.s == 1) {
                err = response.data && response.data[0] && response.data[0].err
                let cartDetailsApi = utilities.getFinalServiceURL(appProperties.getCartDetailsNewApproach, req);
                response = await utilities.serviceReq(req, cartDetailsApi, 'POST', { "cartResponseFormat": "true" });
                //let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
                //const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');                
                //const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
                //response.data.myBagCount = myBagCount;
                /**
                 * Already myBagCount value is coming from cart details new approach so above code is commented
                 */
            }
            else {
                // let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
                //const wishListCountData = await utilities.serviceReq(req, wishListCountApi, 'GET');
                //let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
                //const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
                //const wishListCount = wishListCountData && wishListCountData.data && wishListCountData.data.quantity || 0;
                // const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
                //response.data.wishListCount = wishListCount;
                //response.data.myBagCount = myBagCount;
                /**
                 * Already wishListCount value and myBagcount are coming from updateitemquantity AA node service and so above code is commented.
                 */

            }
            response.data.err = err;
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    updateitem: async (req, reply, app) => {
        if (req.payload) {
            req.payload.PageName = 'checkout';
        }
        try {
            let updateitemApi = utilities.getFinalServiceURL(appProperties.updateitem, req);
            const response = await utilities.serviceReq(req, updateitemApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    updatepromotion: async (req, reply, app) => {
        try {
            let updatepromotionApi = utilities.getFinalServiceURL(appProperties.updatepromotion, req);

            const response = await utilities.serviceReq(req, updatepromotionApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    processPayPalDropletActor: async (req, reply, app) => {
        let token = req.query.token
        let PayerID = req.query.PayerID
        payload = {
            "PayerID": PayerID,
            "act": "Submit",
            "token": token
        }
        try {
            const processPayPalDropletActorUrl = utilities.getFinalServiceURL(appProperties.processPayPalDropletActor, req);
            const processPayPalDropletActorInfo = await utilities.serviceReq(req, processPayPalDropletActorUrl, 'POST', payload);
            return reply.redirect('/tienda/checkoutOrderConfirmation');
        } catch (e) {
            console.error(e);
            return reply.response(e.message);
        }
    },
    gettokenidforpaypal: async (req, reply, app) => {
        try {
            let gettokenidforpaypalApi = utilities.getFinalServiceURL(appProperties.gettokenidforpaypal, req);
            const response = await utilities.serviceReq(req, gettokenidforpaypalApi, 'POST', req.payload);
            return reply.response(response.data).header('set-cookie', response.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    commitOrderMethodDecider: async (req, reply, app) => {
        try {
            let commitOrderMethodDeciderApi = utilities.getFinalServiceURL(appProperties.commitOrderMethodDecider, req);
            const response = await utilities.serviceReq(req, commitOrderMethodDeciderApi, 'POST', req.payload);
            return reply.response(response.data).header('set-cookie', response.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    displaywishlistdetails: async (req, reply, app) => {
        try {
            let displayWishListDetailsUrl = utilities.getFinalServiceURL(appProperties.displayWishListDetails, req);
            const response = await utilities.serviceReq(req, displayWishListDetailsUrl, 'GET');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getShoppingCartCount: async (req, reply, app) => {
        try {
            let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
            const response = await utilities.serviceReq(req, mybagListCountApi, 'GET');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    displaySavedListCount: async (req, reply, app) => {
        try {
            let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
            const response = await utilities.serviceReq(req, wishListCountApi, 'GET');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    applyCoupon: async (req, reply, app) => {
        try {
            let applyCouponApi = utilities.getFinalServiceURL(appProperties.applyCoupon, req);
            const response = await utilities.serviceReq(req, applyCouponApi, 'POST', req.payload);
            const data = Object.assign({ commerceItems: response.data });
            return reply.response(data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    removeItemFromSavedCart: async (req, reply, app) => {
        try {
            let removeItemFromSavedCartApi = utilities.getFinalServiceURL(appProperties.removeItemFromSavedCart, req);
            removeItemFromSavedCartApi = removeItemFromSavedCartApi + "?giftitemId=" + req.payload.giftListid
            const response = await utilities.serviceReq(req, removeItemFromSavedCartApi, 'GET');
            // let wishListCountApi = utilities.getFinalServiceURL(appProperties.displaySavedListCount, req);
            //const wishListCountData = await utilities.serviceReq(req, wishListCountApi, 'GET');
            //let mybagListCountApi = utilities.getFinalServiceURL(appProperties.getShoppingCartCount, req);
            //const shoppCartCountData = await utilities.serviceReq(req, mybagListCountApi, 'GET');
            //const wishListCount = wishListCountData && wishListCountData.data && wishListCountData.data.quantity || 0;
            //const myBagCount = shoppCartCountData && shoppCartCountData.data && shoppCartCountData.data.quantity || 0;
            //response.data.wishListCount = wishListCount;
            //response.data.myBagCount = myBagCount;
            /**
             * Already wishListCount value and myBagcount are coming from updateitemquantity AA node service and so above code is commented.
             */

            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    eventBySearchForGiftRegistry: async (req, reply, app) => {
        try {
            let eventBySearchForGiftRegistryApi = utilities.getFinalServiceURL(appProperties.eventBySearchForGiftRegistryApi, req);
            const response = await utilities.serviceReq(req, eventBySearchForGiftRegistryApi, 'POST');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    convertToGiftRegistryItem: async (req, reply, app) => {
        try {
            let messageFalse = true
            let convertToGiftRegistryItemApi = utilities.getFinalServiceURL(appProperties.convertToGiftRegistryItemApi, req);
            if (req.payload.message) {
                delete req.payload.message;
                messageFalse = false
            }
            var response = await utilities.serviceReq(req, convertToGiftRegistryItemApi, 'POST', req.payload);
            if (response && response.data && response.data.status && response.data.status.status == "failure" || response && response.data && response.data.status && response.data.status && response.data.status.errorCode == "002") {
                return reply.response(response.data);
            }
            if (messageFalse) {
                let cartDetailsApi = utilities.getFinalServiceURL(appProperties.getCartDetailsNewApproach, req);
                response = await utilities.serviceReq(req, cartDetailsApi, 'POST', { "cartResponseFormat": "true" });
                if (response && response.data) {
                    response.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
                }
                return reply.response(response.data);
            }
            if (response && response.data) {
                response.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
            }
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },


    setGiftWrapService: async (req, reply, app) => {
        try {
            let setGiftWrapServiceApi = utilities.getFinalServiceURL(appProperties.setGiftWrapService, req);
            var response = await utilities.serviceReq(req, setGiftWrapServiceApi, 'POST', req.payload);

            let cartDetailsApi = utilities.getFinalServiceURL(appProperties.getCartDetailsNewApproach, req);
            response = await utilities.serviceReq(req, cartDetailsApi, 'POST', { "cartResponseFormat": "true" });
            if (response && response.data) {
                response.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
            }

            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    setGrGiftMessage: async (req, reply, app) => {
        try {
            let setGrGiftMessage = utilities.getFinalServiceURL(appProperties.setGrGiftMessage, req);
            var response = await utilities.serviceReq(req, setGrGiftMessage, 'POST', req.payload);

            let cartDetailsApi = utilities.getFinalServiceURL(appProperties.getCartDetailsNewApproach, req);
            response = await utilities.serviceReq(req, cartDetailsApi, 'POST', { "cartResponseFormat": "true" });
            if (response && response.data) {
                response.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
            }

            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getstoreaddress: async (req, reply, app) => {
        try {
            let getstoresAPI = utilities.getFinalServiceURL(appProperties.getstoreaddress, req);
            const response = await utilities.serviceReq(req, getstoresAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    shippingaddressforcheckout: async (req, reply, app) => {
        try {
            let shippingaddressforcheckoutAPI = utilities.getFinalServiceURL(appProperties.shippingaddressforcheckout, req);
            const response = await utilities.serviceReq(req, shippingaddressforcheckoutAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    proceedshiptobill: async (req, reply, app) => {
        try {
            let proceedshiptobillAPI = utilities.getFinalServiceURL(appProperties.proceedshiptobill, req);
            const response = await utilities.serviceReq(req, proceedshiptobillAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    shippingaddressforcheckoutguest: async (req, reply, app) => {
        try {
            let shippingaddressforcheckoutguestAPI = utilities.getFinalServiceURL(appProperties.shippingaddressforcheckoutguest, req);
            const response = await utilities.serviceReq(req, shippingaddressforcheckoutguestAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getshiptostoreeventdetails: async (req, reply, app) => {
        try {
            let getshiptostoreeventdetailsAPI = utilities.getFinalServiceURL(appProperties.getshiptostoreeventdetails, req);
            const response = await utilities.serviceReq(req, getshiptostoreeventdetailsAPI, 'POST', {});
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getshippingaddresses: async (req, reply, app) => {
        try {
            let getShippingAddressesAPI = utilities.getFinalServiceURL(appProperties.getshippingaddresses, req);
            const response = await utilities.serviceReq(req, getShippingAddressesAPI, 'POST', {});
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    get_shipping_address_events_items: async (req, reply, app) => {
        try {
            let get_shipping_address_events_items_API = utilities.getFinalServiceURL(appProperties.get_shipping_address_events_items, req);
            const response = await utilities.serviceReq(req, get_shipping_address_events_items_API, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    addnewaddress: async (req, reply, app) => {
        try {
            let addNewAddressAPI = utilities.getFinalServiceURL(appProperties.addnewaddress, req);
            const response = await utilities.serviceReq(req, addNewAddressAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    updateaddress: async (req, reply, app) => {
        try {
            let updateAddressAPI = utilities.getFinalServiceURL(appProperties.updateaddress, req);
            const response = await utilities.serviceReq(req, updateAddressAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    setDefaultAddress: async (req, reply, app) => {
        try {
            let setDefaultAddressAPI = utilities.getFinalServiceURL(appProperties.setDefaultAddress, req);
            const response = await utilities.serviceReq(req, setDefaultAddressAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    removeaddress: async (req, reply, app) => {
        try {
            let removeAddressAPI = utilities.getFinalServiceURL(appProperties.removeaddress, req);
            const response = await utilities.serviceReq(req, removeAddressAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    addresssearch: async (req, reply, app) => {
        try {
    		// service addresssearch change GET from POST method :: Start
            let payload = {}
            payload.action = req.query.action;
            payload.cp = req.query.cp;
            let addressSearchAPI = utilities.getFinalServiceURL(appProperties.addresssearch, req);
            const response = await utilities.serviceReq(req, addressSearchAPI, 'POST', payload);
    		// service addresssearch change GET from POST method :: End
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getcountry: async (req, reply, app) => {
        try {
            let getcountryAPI = utilities.getFinalServiceURL(appProperties.getcountry, req);
            const response = await utilities.serviceReq(req, getcountryAPI, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    guatemalaStates: async (req, reply, app) => {
        try {
            let guatemalaStatesAPI = utilities.getFinalServiceURL(appProperties.guatemalaStates, req);
            const response = await utilities.serviceReq(req, guatemalaStatesAPI, 'GET');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    checkoutItemsDetail: async (req, reply, app) => {
        try {
            let checkoutItemsDetailAPI = utilities.getFinalServiceURL(appProperties.checkoutItemsDetail, req);
            let response = await utilities.serviceReq(req, checkoutItemsDetailAPI, 'POST', req.payload);
            response.data.hostname = req.info.hostname;
            return reply.response(response.data).header('set-cookie', response.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    collectinstore: async (req, reply, app) => {
        try {
            let collectinstoreAPI = utilities.getFinalServiceURL(appProperties.collectinstore, req);
            const response = await utilities.serviceReq(req, collectinstoreAPI, 'POST', req.payload);
            return reply.response(response.data).header('set-cookie', response.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    checkoutToShippingPage: async (req, reply, app) => {
        try {
            const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData } = await utilities.getInitialDataOnStartUp(req, app);
            let keyValues = '';
            if (labelsData && labelsData.staticLabelValues) {
                for (var i in labelsData.staticLabelValues) {
                    if (labelsData.staticLabelValues[i].pageName === "pwa-shippingPage") {
                        keyValues = labelsData.staticLabelValues[i].keyValues;
                    }
                }
            }

            if (!keyValues) {
                const staticLabelsAPI = utilities.getFinalServiceURL(appProperties.staticLabels, req);
                const staticLabels = await utilities.serviceReq(req, staticLabelsAPI, 'POST', { "pageName": ["pwa-shippingPage"] });
                keyValues = staticLabels && staticLabels.staticLabelValues && staticLabels.staticLabelValues.length > 0 && staticLabels.staticLabelValues[0].keyValues;
            }

            const getCartHeaderDetailsAPI = utilities.getFinalServiceURL(appProperties.getCartHeaderDetails, req);
            const cartHeader = await utilities.serviceReq(req, getCartHeaderDetailsAPI, 'POST', {});

            const get_shipping_address_events_items_API = utilities.getFinalServiceURL(appProperties.get_shipping_address_events_items, req);
            const shipping_address_events_items = await utilities.serviceReq(req, get_shipping_address_events_items_API, 'POST', { "pageName": "shippingPage" });

            if (shipping_address_events_items &&
                shipping_address_events_items.data &&
                shipping_address_events_items.data.address &&
                (shipping_address_events_items.data.address.errorCode === '1003' || shipping_address_events_items.data.address.errorCode === '1002')) {

                    let LoggedInSession = utilities.getCookieValueByName(req, 'LoggedInSession');
                    let KeepMeSignIn = utilities.getCookieValueByName(req, 'KeepMeSignIn');
                    if(LoggedInSession && !KeepMeSignIn){
                        return reply.redirect('/tienda/login' + "?pageName=cart");
                    }else if(LoggedInSession){
                        return reply.redirect('/tienda/cart');
                    }else{
                        return reply.redirect('/tienda/cart');
                    }

            }

            let configData = configurationData || {};
            if (!configData.configuration) {
                const getConfigurationURL = utilities.getFinalServiceURL(appProperties.getConfiguration, req);
                const getConfigurationInfo = await utilities.serviceReq(req, getConfigurationURL, 'POST');
                configData = (getConfigurationInfo && getConfigurationInfo.data && getConfigurationInfo.data) || {}
            }
            let guatemalaFlag = true;
            let cncDriveThroughFlag = true;
            let enableclickandcollect = true;
            let enableEditAddress = true;
            if (configData.configuration && configData.configuration.flagConfiguration) {
                const flag = configData.configuration.flagConfiguration['enableGuatemala'];
                const cflag = configData.configuration.flagConfiguration['enableCnCDriveThru'];
                const ccflag = configData.configuration.flagConfiguration['enableclickandcollect'];
                const editflag = configData.configuration.flagConfiguration['enableEditAddress'];
                guatemalaFlag = (flag && (flag.indexOf("false") > -1 || flag === 'false') ? false : true);
                cncDriveThroughFlag = (cflag && (cflag.indexOf("false") > -1 || cflag === 'false') ? false : true);
                enableclickandcollect = (ccflag && (ccflag.indexOf("false") > -1 || ccflag === 'false') ? false : true);
                enableEditAddress = (editflag && (editflag.indexOf("false") > -1 || editflag === 'false') ? false : true);
            }
            const data = {
                keyValues: keyValues,
                cartHeader: shipping_address_events_items.data && shipping_address_events_items.data.cartHeader,
                shipping_address_events_items: shipping_address_events_items.data,
                GuatemalaEnableFlag: guatemalaFlag,
                cncDriveEnableFlag: cncDriveThroughFlag,
                enableclickandcollect: enableclickandcollect,
                enableEditAddress: enableEditAddress,
                checkoutHeaderData,
                checkoutFooterData,
                headerFooter,
                footerData,
                staticLabelValues: labelsData,
                configurationData,
                departmentData,
                hostname: req.info.hostname
            }
            const shippingPageRes = await defaultHandlerWrapper(app, data)(req, '/tienda/checkoutShipping');
            return reply.response(shippingPageRes).header('set-cookie', cartHeader.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    checkoutFirstStep: async (req, reply, app, pdpType) => {
        try {
            const headerFooter = await utilities.getHeaderFooter(req);
            let statePath = utilities.getFinalServiceURL(appProperties.checkoutItemsDetail, req);
            const mainBodyInfo = await utilities.serviceReq(req, statePath, 'POST', { "pageName": "billingPage" });
            let cartPageRes = await defaultHandlerWrapper(app, { footerContent: headerFooter.footer, headerContent: headerFooter.header, mainContent: mainBodyInfo.data, hostname: req.info.hostname })(req, '/tienda/checkoutBillingPage');
            return reply.response(cartPageRes).header('set-cookie', mainBodyInfo.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    gREventsbysearch: async (req, reply, app) => {
        try {
            let gREventsbysearchApi = utilities.getFinalServiceURL(appProperties.gREventsbysearch, req);
            const response = await utilities.serviceReq(req, gREventsbysearchApi, 'POST', req.payload, 'true');
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    paymentMethodSelection: async (req, reply, app) => {
        try {
            let paymentMethodSelectionApi = utilities.getFinalServiceURL(appProperties.paymentMethodSelection, req);
            const response = await utilities.serviceReq(req, paymentMethodSelectionApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    checkNightBoxAvailabilityStatus: async (req, reply, app) => {
        try {
            let checkNightBoxAvailabilityStatusApi = utilities.getFinalServiceURL(appProperties.checkNightBoxAvailabilityStatus, req);
            const response = await utilities.serviceReq(req, checkNightBoxAvailabilityStatusApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    guestCheckOutBillingInfo: async (req, reply, app) => {
        try {
            let guestCheckOutBillingInfoApi = utilities.getFinalServiceURL(appProperties.guestCheckOutBillingInfo, req);
            let payload = req.payload;
            const response = await utilities.serviceReq(req, guestCheckOutBillingInfoApi, 'POST', payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    removeitem: async (req, reply, app) => {
        try {
            let getremoveitemApi = utilities.getFinalServiceURL(appProperties.removeitem, req);
            const response = await utilities.serviceReq(req, getremoveitemApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getCountrys: async (req, reply, app) => {
        try {
            let getCountrysApi = utilities.getFinalServiceURL(appProperties.getCountry, req);
            const response = await utilities.serviceReq(req, getCountrysApi, 'POST', {});
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    addNewCardForRegisteredUser: async (req, reply, app) => {

        try {
            let proceedbillingtopromotionApi = utilities.getFinalServiceURL(appProperties.proceedbillingtopromotion, req);
            let payload = req.payload;
            const response = await utilities.serviceReq(req, proceedbillingtopromotionApi, 'POST', payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    promotion: async (req, reply, app, pdpType) => {
        const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData } = await utilities.getInitialDataOnStartUp(req, app);
        try {
            let statePath = utilities.getFinalServiceURL(appProperties.ordersummaryNewApproach, req);
            let promoStaticLabel = { "staticLabelValues": [], "showKey": labelsData.showKey };
            if (labelsData) {//pwa-promotionPage               
                const sData = labelsData.staticLabelValues ? labelsData.staticLabelValues : labelsData;
                if (sData && sData.length > 0) {
                    sData.map(staticLabel => {
                        if (staticLabel && staticLabel.pageName && staticLabel.pageName === 'pwa-promotionPage') {
                            data = staticLabel.keyValues;
                            promoStaticLabel.staticLabelValues.push(staticLabel);
                        }

                    });
                }

            }
            let payloadOrdersummery = {};
            if (req.query.isPackageSelected) {
                payloadOrdersummery.isPackageSelected = req.query.isPackageSelected;
            }
            const mainBodyInfo = await utilities.serviceReq(req, statePath, 'POST', payloadOrdersummery);
            let FPSessionId = '', orgId = '', fingerPrintEndPoint = '';
            if (configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration) {
                //  let JsessionId = utilities.getCookieValueByName(req, 'JSESSIONID')
                FPSessionId = configurationData.configuration.liverpoolconfiguration.cybersourcemerchantid.concat(mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.orderSummary && mainBodyInfo.data.orderSummary.pageSessionId) || {};
                orgId = configurationData.configuration.liverpoolconfiguration.orgid;
                fingerPrintEndPoint = configurationData.configuration.liverpoolconfiguration.cybfpurl;
            }

            if (mainBodyInfo && mainBodyInfo.data) {
                mainBodyInfo.data.orderSummary.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
                mainBodyInfo.data.orderSummary.staticLabels = promoStaticLabel;
                mainBodyInfo.data.orderSummary.limitedPieces = limitedPiecesSkusData;
                mainBodyInfo.data.orderSummary.fingerPrintEndPoint = fingerPrintEndPoint;
                mainBodyInfo.data.orderSummary.orgId = orgId;
                mainBodyInfo.data.orderSummary.FPSessionId = FPSessionId;
            }
            const promotionPageContent = {
                mainContent: mainBodyInfo.data.orderSummary, hostname: req.info.hostname, promotionInfo: mainBodyInfo.data.promotion, cartHeader: mainBodyInfo.data.cartHeader,
                checkoutHeaderData,
                checkoutFooterData,

                headerFooter,
                footerData,
                staticLabelValues: labelsData,
                configurationData,
                departmentData
            };

            if (req.query.isajax) {
                return reply.response(promotionPageContent);
            }
            let promotionPageRes = await defaultHandlerWrapper(app, promotionPageContent)(req, '/tienda/checkoutPromotion');

            return reply.response(promotionPageRes).header('set-cookie', mainBodyInfo.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    /*
    promotion: async (req, reply, app, pdpType) => {
        const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData } = await utilities.getInitialDataOnStartUp(req, app);
        try {
           // const headerFooter = await utilities.getHeaderFooter(req);
            let statePath = utilities.getFinalServiceURL(appProperties.orderSummary, req);

            let promotionPath = utilities.getFinalServiceURL(appProperties.displaylpbestpromotion, req);
            const promotionInfo = await utilities.serviceReq(req, promotionPath, 'POST');

            let limitedPiecesApi = utilities.getFinalServiceURL(appProperties.limitedPiecesSkus, req);
            let limitedPieces = await utilities.serviceReq(req, limitedPiecesApi, 'GET');

            const staticLabelsAPI = utilities.getFinalServiceURL(appProperties.staticLabels, req);
            const staticLabels = await utilities.serviceReq(req, staticLabelsAPI, 'POST', { "pageName": ["pwa-promotionPage"] });

            let getConfigurationURL = utilities.getFinalServiceURL(appProperties.getConfiguration, req);
            const getConfigurationInfo = await utilities.serviceReq(req, getConfigurationURL, 'POST');

            const getCartHeaderDetailsAPI = utilities.getFinalServiceURL(appProperties.getCartHeaderDetails, req);
            const cartHeader = await utilities.serviceReq(req, getCartHeaderDetailsAPI, 'POST', {});

            let payloadOrdersummery = {};
            if (req.query.isPackageSelected) {
                payloadOrdersummery.isPackageSelected = req.query.isPackageSelected;
            }
            const mainBodyInfo = await utilities.serviceReq(req, statePath, 'POST', payloadOrdersummery);
            let FPSessionId = '', orgId = '', fingerPrintEndPoint = '';
                        if (getConfigurationInfo.data && getConfigurationInfo.data.configuration && getConfigurationInfo.data.configuration.liverpoolconfiguration) {
                //  let JsessionId = utilities.getCookieValueByName(req, 'JSESSIONID')
                FPSessionId =getConfigurationInfo.data.configuration.liverpoolconfiguration.cybersourcemerchantid.concat(mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.pageSessionId) || {};
                orgId = getConfigurationInfo.data.configuration.liverpoolconfiguration.orgid;
                fingerPrintEndPoint = getConfigurationInfo.data.configuration.liverpoolconfiguration.cybfpurl;
            }

            if (mainBodyInfo && mainBodyInfo.data) {
                mainBodyInfo.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
                mainBodyInfo.data.staticLabels = staticLabels.data;
                mainBodyInfo.data.limitedPieces = limitedPieces.data;
                mainBodyInfo.data.fingerPrintEndPoint = fingerPrintEndPoint;
                mainBodyInfo.data.orgId = orgId;
                mainBodyInfo.data.FPSessionId = FPSessionId;
            }
            const promotionPageContent = {
                mainContent: mainBodyInfo.data, hostname: req.info.hostname, promotionInfo: promotionInfo.data, cartHeader: cartHeader.data,
                checkoutHeaderData,
                checkoutFooterData,
                headerFooter,
                footerData,
                staticLabelValues: labelsData,
                configurationData,
                departmentData
            };

            if (req.query.isajax) {
                return reply.response(promotionPageContent);
            }
            let promotionPageRes = await defaultHandlerWrapper(app, promotionPageContent)(req, '/tienda/checkoutPromotion');

            return reply.response(promotionPageRes).header('set-cookie', mainBodyInfo.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    */
    checkoutBillingPage: async (req, reply, app, pdpType) => {
        let { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData, limitedPiecesSkusData } = await utilities.getInitialDataOnStartUp(req, app);
        try {
            const getHeaderFooter = await utilities.getHeaderFooter(req);
            let statePath = utilities.getFinalServiceURL(appProperties.checkoutItemsDetail, req);
            // const getCartHeaderDetailsAPI = utilities.getFinalServiceURL(appProperties.getCartHeaderDetails, req);
            // const cartHeader = await utilities.serviceReq(req, getCartHeaderDetailsAPI, 'POST', {});
            const mainBodyInfo = await utilities.serviceReq(req, statePath, 'POST', { "pageName": "billingPage" });
            const cartHeader = (mainBodyInfo && mainBodyInfo.data && mainBodyInfo.data.cartHeader) || {};
            let cartPageRes = await defaultHandlerWrapper(app, {
                cartHeader: cartHeader,
                footerContent: getHeaderFooter.footer,
                headerContent: getHeaderFooter.header,
                mainContent: mainBodyInfo.data,
                hostname: req.info.hostname,
                checkoutHeaderData,
                checkoutFooterData,

                headerFooter,
                footerData,
                staticLabelValues: labelsData,
                configurationData,
                departmentData,
                limitedPiecesSkusData
            })(req, '/tienda/checkoutBilling');
            return reply.response(cartPageRes).header('set-cookie', mainBodyInfo.headers['cookie']);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    updateCreditCard: async (req, reply, app, pdpType) => {
        try {
            const headerFooter = await utilities.getHeaderFooter(req);
            let updateCreditCardApi = utilities.getFinalServiceURL(appProperties.updateCreditCard, req);
            const response = await utilities.serviceReq(req, updateCreditCardApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    billingWithCIEBancomer: async (req, reply, app) => {
        try {
            let billingWithCIEBancomerApi = utilities.getFinalServiceURL(appProperties.billingWithCIEBancomer, req);
            const response = await utilities.serviceReq(req, billingWithCIEBancomerApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getCIEPaymentTypeInfo: async (req, reply, app) => {
        try {
            let getciepaymenttypeiInfoApi = utilities.getFinalServiceURL(appProperties.getciepaymenttypesinfo, req);
            const response = await utilities.serviceReq(req, getciepaymenttypeiInfoApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getConfiguration: async (req, reply, app) => {
        // pageProps optimization change Start
        try{
            let headerDetails = utilities.getHeaderDetails(req)
            const brandName = headerDetails && headerDetails.brand || 'LP';
            
            const siteData = app.siteData && app.siteData[brandName + 'Data'];
            let configData = siteData && siteData.config || undefined;
            if (configData){
                configData.brand = brandName;
                configData.siteData = 'True';
                return configData;
            }
            
        } catch (ex){

        }
        // pageProps optimization change end

        try {

            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined') {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let configurationFlag = services['configuration'];
            let resp = null;
            let response = null;
            let key = null;
            if (configurationFlag) {
                key = cacheUtils.getDynamicCacheKey(req, "configuration_");
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    response = resp.response;
                } else {
                    let getConfigurationApi = utilities.getFinalServiceURL(appProperties.getConfiguration, req);
                    response = await utilities.serviceReq(req, getConfigurationApi, 'POST', {});
                    if (response) {
                        const ss = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                    }
                }
            } else {
                let getConfigurationApi = utilities.getFinalServiceURL(appProperties.getConfiguration, req);
                response = await utilities.serviceReq(req, getConfigurationApi, 'POST', {});
                if (response && (resp && resp['flag'] && resp['flag'] === 'true')) {
                    const ss = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                }
            }
            return reply.response((response && response.data) ? response.data : response);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    checkoutstep4: async (req, reply, app) => {
        try {
            //const headerFooter = await utilities.getHeaderFooter(req);
            //const staticLabelsAPI = utilities.getFinalServiceURL(appProperties.staticLabels, req);
            //const staticLabels = await utilities.serviceReq(req, staticLabelsAPI, 'POST', { "pageName": ["pwa-orderConfirmationPage"] });
            let route = utilities.getFinalServiceURL(appProperties.getconfirmorder, req);
            let data = await utilities.serviceReq(req, route, 'POST', undefined);
            if (data && typeof data.data === 'undefined') {
                data.data = {};   // set balnk data object in case of error;
            }
            if (data && data.data) {
                data.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
            }
            if (data && data.data) {
                const DRIVETHRU = process.env.DRIVETHRU || 'https://us-central1-clickcollectbycarqa.cloudfunctions.net/addTicket/'
                data.data.DRIVETHRU = DRIVETHRU;
            }
            const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData } = await utilities.getInitialDataOnStartUp(req, app);
            if (labelsData) {//pwa-orderConfirmationPage
                const sData = labelsData.staticLabelValues ? labelsData.staticLabelValues : labelsData;
                if (sData && sData.length > 0) {
                    sData.map(staticLabel => {
                        if (staticLabel && staticLabel.pageName && staticLabel.pageName === 'pwa-orderConfirmationPage') {
                            data.data.staticLabels = staticLabel.keyValues;
                        }

                    });
                }
            }
            /* if (staticLabels && staticLabels.data && staticLabels.data.staticLabelValues[0] && staticLabels.data.staticLabelValues[0].keyValues) {
                 data.data.staticLabels = staticLabels.data.staticLabelValues[0].keyValues;
             }*/
            // console.log('data==================>>>>', data);
            return defaultHandlerWrapper(app, { orderData: data.data, footerContent: footerData, headerContent: headerFooter, checkoutHeaderData, checkoutFooterData, labelsData, configurationData, departmentData, hostname: req.info.hostname })(req, '/tienda/checkoutOrderConfirmation');


            //return defaultHandlerWrapper(app, { orderData: data.data,footerContent: headerFooter.footer, headerContent: headerFooter.header })(req, '/tienda/checkoutOrderConfirmation');

            // let page = await defaultHandlerWrapper(app, {})(req, '/tienda/checkoutOrderConfirmation');
            // return reply.response(page);

        } catch (e) {
            return reply.response(e.message);
        }
    },
    getconfirmorder: async (req, reply, app) => {
        try {
            // const headerFooter = await utilities.getHeaderFooter(req);

            let route = utilities.getFinalServiceURL(appProperties.getconfirmorder, req);
            let data = await utilities.serviceReq(req, route, 'POST', undefined);
            if (data && data.data) {
                data.data.swogoEndPoint = settings[process.env.ENVIRONMENT]['swogoEndPoint'];
                data.data.hostname = req.info.hostname;
            }
            if (data && data.data) {
                const DRIVETHRU = process.env.DRIVETHRU || 'https://us-central1-clickcollectbycarqa.cloudfunctions.net/addTicket/'
                data.data.DRIVETHRU = DRIVETHRU;
            }
            return data.data;

        } catch (e) {
            return reply.response(e.message);
        }
    },
    getStaticLabels: async (req, reply, app) => {
        var url = req.headers.referer;

        var queryString = url.split('?')[1];

        var obj = {};

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
        let showKeyAvail = "";
        if (obj.showkey) {
            var showKeyData = obj.showkey;
            showKeyAvail = "?showkey" + '=' + showKeyData;
        }

        try {
            let staticLabelsApi = utilities.getFinalServiceURL(appProperties.staticLabels, req);
            staticLabelsApi = staticLabelsApi + showKeyAvail;
            const response = await utilities.serviceReq(req, staticLabelsApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getStaticLabelsFetch: async (req, reply, app) => {
        var url = req.headers.referer;

        var queryString = url.split('?')[1];

        var obj = {};

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
        let showKeyAvail = "";
        if (obj.showkey) {
            var showKeyData = obj.showkey;
            showKeyAvail = "?showkey" + '=' + showKeyData;
        }
        let payload = req.query;
        let postPayload = { "pageName": [] }
        if (payload && typeof payload !== 'undefined' && payload['pageName'] && typeof payload['pageName'] !== 'undefined') {
            if (payload['pageName'].indexOf("#") <= -1) {
                postPayload['pageName'].push(payload['pageName'].trim());
            } else {
                let val = payload['pageName'].split("#");
                if (val && val.length) {
                    for (let k in val) {
                        postPayload['pageName'].push(k.trim());
                    }
                }
            }

        }
        if((showKeyAvail.trim() === '') || (showKeyAvail.trim() === 'false') ){
            try{
                let headerDetails = utilities.getHeaderDetails(req)
                const brandName = headerDetails && headerDetails.brand || 'LP';
                const siteData = app.siteData && app.siteData[brandName + 'Data'];
                const payloadStringFormat = JSON.stringify(postPayload);
                const staticLabels = (siteData && siteData.static &&  siteData.static.staticLabelValues) ? siteData.static.staticLabelValues.filter(function (currentValue) { return (payloadStringFormat.indexOf(currentValue.pageName) > -1 ) }) : null;                 
                 return reply.response({ 'staticLabelValues': staticLabels,"brand":brandName,"siteData":"true" });
            }catch(ex){

            }
        }
        try {
            let services = settings[process.env.ENVIRONMENT]['listofServicesForCoherence'];
            if (typeof services === 'undefined') {
                services = settings['sit']['listofServicesForCoherence'];
            }
            let staticlabelFlag = services['staticlabel'];
            let response = null;
            let resp = null;
            let key = null;
            if (staticlabelFlag) {
                key = cacheUtils.getDynamicCacheKey(req, "staticlabel_", req.query.pageName ? req.query.pageName.trim() : '_' + '_showkey_' + (showKeyAvail.trim() === '') ? 'false' : 'true');
                resp = await cacheUtils.retrieveCoherenceData(req, key);
                if (resp && resp.response && typeof resp.response !== 'undefined') {
                    response = resp.response;
                } else {
                    let staticLabelsApi = utilities.getFinalServiceURL(appProperties.staticLabels, req);
                    staticLabelsApi = staticLabelsApi + showKeyAvail;
                    response = await utilities.serviceReq(req, staticLabelsApi, 'POST', postPayload);
                    if (response) {
                        const ss = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                    }
                }
            } else {
                let staticLabelsApi = utilities.getFinalServiceURL(appProperties.staticLabels, req);
                staticLabelsApi = staticLabelsApi + showKeyAvail;
                response = await utilities.serviceReq(req, staticLabelsApi, 'POST', postPayload);
                if (response && (resp && resp['flag'] && resp['flag'] === 'true')) {
                    const ss = await cacheUtils.pushCoherenceData(resp['cacheName'], key, response.data, resp['flag']);
                }
            }
            return reply.response((response && response.data) ? response.data : response);
        } catch (e) {
            return reply.response(e.message);
        }
    }
    ,
    process3DSResponse: async (req, reply, app) => {
        let payload = {};
        if (req.query && req.query.merchantOrderNumber) {
            let data = utilities.getFinalServiceURL(appProperties.getconfirmorder, req);
            payload.dsMerchantOrder = req.query.merchantOrderNumber;
            const response = await utilities.serviceReq(req, data, 'POST', payload);
             if (response && response.data && response.data.orderSuccess) {
             const { checkoutHeaderData, checkoutFooterData, headerFooter, footerData, labelsData, configurationData, departmentData } = await utilities.getInitialDataOnStartUp(req, app);
            if (labelsData) {//pwa-orderConfirmationPage
                const sData = labelsData.staticLabelValues ? labelsData.staticLabelValues : labelsData;
                if (sData && sData.length > 0) {
                    sData.map(staticLabel => {
                        if (staticLabel && staticLabel.pageName && staticLabel.pageName === 'pwa-orderConfirmationPage') {
                            response.data.staticLabels = staticLabel.keyValues;
                        }

                    });
                }
            }
             return defaultHandlerWrapper(app, { orderData: response.data, footerContent: footerData, headerContent: headerFooter, checkoutHeaderData, checkoutFooterData, labelsData, configurationData, departmentData, hostname: req.info.hostname })(req, '/tienda/checkoutOrderConfirmation');

           

             
        } else if (response && response.data && response.data.displayRefresh) { 

                let PageRes = await defaultHandlerWrapper(app, {})(req, '/tienda/process3DSResponse')
                return reply.response(PageRes).header('set-cookie', response.headers['set-cookie']);
                // reply.response(response.data).header('set-cookie', response.data.headers['set-cookie']);
                // return defaultHandlerWrapper(app, {})(req, '/tienda/process3DSResponse')
            } else if (response && response.data && response.data['3DSErrorRidirect']) {
                return reply.redirect('/tienda/home');
            } else if (response && response.data && response.data['3DSErrorMessage']) {
                return defaultHandlerWrapper(app, { DSErrorMessage: response.data })(req, '/tienda/process3DSResponse')
            } else {
                return reply.redirect('/tienda/home');
            }
        }

    },
    getOrderConfirmationPDF: async (req, reply, app) => {
        try {
            let getorderconfirmationpdfApi = utilities.getFinalServiceURL(appProperties.downloadTicket, req);
            const { data } = await utilities.serviceReq(req, getorderconfirmationpdfApi, 'POST', req.payload);
            return data
        } catch (e) {
            console.error(e);
        }
        //.header('Content-Disposition', 'attachment; filename=payments.pdf');
    },

    addMultipleItemsToWishlist: async (req, reply, app) => {
        try {
            let route = utilities.getFinalServiceURL(appProperties.addMultipleItemsToWishlist, req);
            const data = await utilities.serviceReq(req, route, 'POST', req.payload);
            return data.data;
        } catch (e) {
            return reply.response(e.message);
        }
    },

    stateSearch: async (req, reply, app) => {
        try {
            let stateSearchApi = utilities.getFinalServiceURL(appProperties.stateSearch, req);
            const response = await utilities.serviceReq(req, stateSearchApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    getCreditCards: async (req, reply, app, pdpType) => {
        try {
            let getCreditCardsdApi = utilities.getFinalServiceURL(appProperties.getCreditCards, req);
            const response = await utilities.serviceReq(req, getCreditCardsdApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    },
    //neha
    clickAndCollectDriveThru: async (req, reply, app, pdpType) => {
        try {
            let clickAndCollectDriveThruApi = utilities.getFinalServiceURL(appProperties.clickAndCollectDriveThru, req);
            const response = await utilities.serviceReq(req, clickAndCollectDriveThruApi, 'POST', req.payload);
            return reply.response(response.data);
        } catch (e) {
            return reply.response(e.message);
        }
    }
}
