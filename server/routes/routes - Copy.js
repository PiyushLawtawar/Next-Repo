const { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } = require('../server/nextwrapper');
const Snb = require('../app/controllers/snb');
const Cnc = require('../app/controllers/cnc');
const Account = require('../app/controllers/account');
const Wishlist = require('../app/controllers/wishlist');
const staticFile = require('../app/controllers/staticFiles');
module.exports = function (app) {
    return [
        {
            method: 'GET',
            path: '/service-worker.js', /* next specific routes */
            handler: nextHandlerWrapper(app)
        },
        {
            method: 'GET',
            path: '/_next/{p*}', /* next specific routes */
            handler: nextHandlerWrapper(app),
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/',
            handler: function (req, reply) {
                return reply.redirect('/tienda/home')
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/users/createAccount',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/registration',
            handler: function (req, reply) {
                return Account.createAccountInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/changePassword',
            handler: function (req, reply) {
                return Account.changePasswordInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/forgotPassword',
            handler: defaultHandlerWrapper(app)
        },
        {
            method: 'POST',
            path: '/resetPassword',
            handler: function (req, reply) {
                return Account.resetPasswordInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/emailSend',
            handler: defaultHandlerWrapper(app)
        },
        {
            method: 'GET',
            path: '/{p*}', /* called for every route */
            handler: function (req, reply) {
                return staticFile.fileNotFound(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/twoColumnCategoryPage/:categoryName/:categoryId',
            handler: function (req, reply) {
                return Snb.categoryLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/endecasearchservice',
            handler: function (req, reply) {
                return Snb.getPlp(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/getDepartments',
            handler: function (req, reply) {
                return Snb.getCategories(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getvariants',
            handler: function (req, reply) {
                return Snb.getVariants(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/browse/getCarouselContent',
            handler: function (req, reply) {
                return Snb.getCarousels(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getcarousels',
            handler: function (req, reply) {
                return Snb.getCarousels(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/getheader',
            handler: function (req, reply) {
                return Snb.getHeaderInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/getFooter',
            handler: function (req, reply) {
                return Snb.getFooterInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/typeaheadservice',
            handler: function (req, reply) {
                return Snb.getTypeheadData(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/home',
            handler: function (req, reply) {
                return Snb.homePage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        //get notification preferances
        {
            method: 'GET',
            path: '/getPreferences',
            handler: function (req, reply) {
                return Account.getPreferences(req, reply, app);

            }
        },
        //update notification preferances
        {
            method: 'POST',
            path: '/tienda/notificationPreferences',
            handler: defaultHandlerWrapper(app),

        },
        {
            method: 'POST',
            path: '/updatePreferences',
            handler: function (req, reply) {
                return Account.updateNotificationPreferences(req, reply, app);

            }
        },
        //Request invoice
        {
            method: 'GET',
            path: '/tienda/billing',
            handler: defaultHandlerWrapper(app),
        },
        {
            method: 'GET',
            path: '/getConfiguration',
            handler: function (req, reply) {
                return Snb.getInvoice(req, reply, app);
            }
        },
        {
            method: 'GET',
            path: '/tienda/invoiceConfirmation',
            handler: defaultHandlerWrapper(app),
        },
        {
            method: 'GET',
            path: '/invoiceRequest',
            handler: function (req, reply) {
                return Snb.getInvoiceConfirmation(req, reply, app);
            }
        },
        //get Static Promotions
        {
            method: 'GET',
            path: '/tienda/promotions',
            handler: defaultHandlerWrapper(app),
        },
        {
            method: 'POST',
            path: '/getStaticPromotions',
            handler: function (req, reply) {
                return Snb.getStaticPromotion(req, reply, app);
            }
        },
        //Air Time Recharge
        // {
        //     method: 'GET',
        //     path: '/tienda/AirTimeRecharge',
        //     handler: defaultHandlerWrapper(app),
        // },
        {
            method: 'GET',
            path: '/tienda/checkout/airtimeTicket',
            handler: function (req, reply) {
                return Snb.getAirTimeRecharge(req, reply, app);
            }
        },
        {
            method: 'POST',
            path: '/getConfiguration',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Cnc.getConfiguration(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/tienda/pdp/{a}/{p*}',
            handler: function (req, reply) {
                return Snb.pdpLandingPage(req, reply, app, 'default');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getlistofstates',
            handler: function (req, reply) {
                return Snb.getListOfStates(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/realtimeinventorycheckservice',
            handler: function (req, reply) {
                return Snb.getListOfStores(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/estimateddeliverydate',
            handler: function (req, reply) {
                return Snb.estimatedDeliveryDate(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },


        {
            method: 'GET',
            path: '/tienda/pdp/hp/{p*}',
            handler: function (req, reply) {
                return Snb.pdpLandingPage(req, reply, app, 'hybrid', false);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/optic/{p*}',
            handler: function (req, reply) {
                return Snb.pdpLandingPage(req, reply, app, 'optic');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/mirakl/offerListing/{q*}',
            handler: function (req, reply) {
                return Snb.pdpOfferLandingPage(req, reply, app, 'pdpOfferList');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/vendedor/{p}',
            handler: function (req, reply) {
                return Snb.pdpMarketProfileLandingPage(req, reply, app, 'MarketplaceProfile');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/alloffers',
            handler: function (req, reply) {
                return Snb.alloffers(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/offers',
            handler: function (req, reply) {
                return Snb.offers(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/changedeliverymode',
            handler: function (req, reply) {
                return Snb.changeDeliveryMode(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/additemtoevent',
            handler: function (req, reply) {
                return Snb.addItemToEvent(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/group/{collectionName}/{collectionId}',
            handler: function (req, reply) {
                return Snb.collectionLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkout/payment/paypalProcess',
            handler: function (req, reply) {
                return Cnc.processPayPalDropletActor(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkoutShipping',
            // handler: defaultHandlerWrapper(app),
            handler: function (req, reply) {
                return Cnc.checkoutToShippingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/checkoutItemsDetail',
            handler: function (req, reply, app) {
                return Cnc.checkoutItemsDetail(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/collectinstore',
            handler: function (req, reply, app) {
                return Cnc.collectinstore(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/getstoreaddress',
            handler: function (req, reply, app) {
                return Cnc.getstoreaddress(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/addnewaddress',
            handler: function (req, reply, app) {
                return Cnc.addnewaddress(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/updateaddress',
            handler: function (req, reply, app) {
                return Cnc.updateaddress(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/setDefaultAddress',
            handler: function (req, reply, app) {
                return Cnc.setDefaultAddress(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/removeaddress',
            handler: function (req, reply, app) {
                return Cnc.removeaddress(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/addresssearch',
            handler: function (req, reply, app) {
                return Cnc.addresssearch(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/getcountry',
            handler: function (req, reply, app) {
                return Cnc.getcountry(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        // {
        //     method: 'GET',
        //     path: '/guatemalaStates',
        //     handler: function (req, reply, app) {
        //         return Cnc.guatemalaStates(req, reply, app);
        //     },
        //     config: {
        //         state: {
        //             parse: false, // parse and store in request.state
        //             failAction: 'ignore' // may also be 'ignore' or 'log'
        //         }
        //     }
        // },
        {
            method: 'POST',
            path: '/get_shipping_address_events_items',
            handler: function (req, reply, app) {
                return Cnc.get_shipping_address_events_items(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/getshippingaddresses',
            handler: function (req, reply, app) {
                return Cnc.getshippingaddresses(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/shippingaddressforcheckout',
            handler: function (req, reply, app) {
                return Cnc.shippingaddressforcheckout(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/proceedshiptobill',
            handler: function (req, reply, app) {
                return Cnc.proceedshiptobill(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/shippingaddressforcheckoutguest',
            handler: function (req, reply, app) {
                return Cnc.shippingaddressforcheckoutguest(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/getshiptostoreeventdetails',
            handler: function (req, reply, app) {
                return Cnc.getshiptostoreeventdetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/checkoutStep1AddressGuatemala',
            handler: function (req, reply) {
                return Cnc.checkoutFirstStep(req, reply, app, 'checkoutStep1AddressGuatemala', false);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkoutStep1Giftregistry',
            handler: function (req, reply) {
                return Snb.checkoutFirstStep(req, reply, app, 'checkoutStep1Giftregistry');

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/tienda/checkoutstep1',
            handler: function (req, reply) {
                return Snb.checkoutFirstStep(req, reply, app, 'checkoutstep1');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/tienda/{category}/{categoryId}',
            handler: function (req, reply) {
                return Snb.categoryLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/{category}/{categoryId}/{page}',
            handler: function (req, reply) {
                return Snb.categoryLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/sp/{sellerName}/{sellerId}',
            handler: function (req, reply) {
                return Snb.categoryLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/{categoryId}',
            handler: function (req, reply) {
                return Snb.categoryLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda',
            handler: function (req, reply) {
                return Snb.categoryLandingPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/index',
            handler: function (req, reply) {
                return Snb.getInstanceData(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/tienda/browse/storelocator',
            handler: function (req, reply) {
                return Snb.getStoreLocatorData(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/storeLocatorDetails',
            handler: function (req, reply) {
                return Snb.getStoreLocatorDetail(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/tienda/getCartDetails',
            handler: function (req, reply) {
                return Cnc.getMyBag(req, reply, app,true);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/tienda/cart',
            handler: function (req, reply) {
                return Cnc.getMyBag(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/users/addressBook',
            handler: function (req, reply) {
                return Snb.getMyAddressData(req, reply, app, 'ShowList');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/editAddress',
            handler: function (req, reply) {
                return Snb.getMyAddressData(req, reply, app, 'Edit');

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/getAddresses',
            handler: function (req, reply) {
                return Snb.getAddressesMyAccount(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/addAddress',
            handler: function (req, reply) {
                return Snb.getMyAddressData(req, reply, app, 'Add');

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/orderHistory',
            handler: function (req, reply) {
                return Account.orderHistory(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/orderSearch',
            handler: function (req, reply) {
                return Account.orderSearch(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/orderLineItemStatus',
            handler: function (req, reply) {
                return Account.orderLineItemStatus(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/orderHistory',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/cartEmpty',
            handler: function (req, reply) {
                return Cnc.getMyBag(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/hybridproductdetails/{productId*}',
            handler: function (req, reply) {
                return Snb.pdpLandingPage(req, reply, app, 'hybrid', true);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getpdpdynamiccontent',
            handler: function (req, reply) {
                return Snb.getPdpDynamicContent(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'GET',
            path: '/static/{param*}',
            handler: {
                directory: {
                    path: './static/'
                }
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/users/myAccount',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/orderDetails',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {

            method: 'GET',
            path: '/tienda/users/changePassword',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/creditCards',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/updateProfile',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/viewPhones',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/users/subscription',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/getMyAccountLeftNav',
            handler: function (req, reply) {
                return Account.getMyAccountLeftNav(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/orderDetailService',
            handler: function (req, reply) {
                return Account.orderDetailService(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },

        {
            method: 'POST',
            path: '/summary',
            handler: function (req, reply) {
                return Account.personalData(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },


        {
            method: 'GET',
            path: '/tienda/updatePersonalDataMainPage',
            handler: defaultHandlerWrapper(app),
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/updateUser',
            handler: function (req, reply) {
                return Account.updatePersonalData(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },




        {
            method: 'GET',
            path: '/tienda/PDPChannel',
            handler: function (req, reply) {
                return Snb.pdpLandingPage(req, reply, app, 'PDPChannel');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/tienda/PLPChannel',
            handler: defaultHandlerWrapper(app),
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },

        {
            method: 'POST',
            path: '/getPhoneNumber',
            handler: function (req, reply) {
                return Account.cellPhone(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },


        {
            method: 'GET',
            path: '/tienda/users/addPhone',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/addNewPhoneNumber',
            handler: function (req, reply) {
                return Account.addNewPhoneNumber(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/removePhoneNumber',
            handler: function (req, reply) {
                return Account.removePhoneNumber(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/phoneServiceSearch',
            handler: function (req, reply) {
                return Account.phoneServiceSearch(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/airtimeAmountSearch',
            handler: function (req, reply) {
                return Account.airtimeAmountSearch(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        //airtime Checkout Landing
        {
            method: 'POST',
            path: '/airtimecheckoutland',
            handler: function (req, reply) {
                return Account.airtimeCheckoutLand(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        //air time Checkout
        {
            method: 'POST',
            path: '/airtimecheckout',
            handler: function (req, reply) {
                return Account.airtimeCheckout(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },

        {
            method: 'GET',
            path: '/tienda/users/editPhone',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/editPhoneNumber',
            handler: function (req, reply) {
                return Account.cellPhoneEdit(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },

        {
            method: 'GET',
            path: '/tienda/users/trackingOrder',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },

        {
            method: 'GET',
            path: '/tienda/login',
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/login',
            handler: function (req, reply) {
                return Account.login(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/logout',
            handler: function (req, reply) {
                return Account.logout(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getCartHeaderDetails',
            handler: function (req, reply) {
                return Account.getCartHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/additemtocart',
            handler: function (req, reply) {
                return Cnc.addToBag(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/addmultipleitemstoorder',
            handler: function (req, reply) {
                return Cnc.addMultipleItemsToBag(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: ['POST'],
            path: '/addtocache',
            handler: Account.addToCache,
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: ['POST'],
            path: '/getcache',
            handler: Account.getCache,
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/lpaddproduct',
            handler: function (req, reply) {
                return Snb.lpaddproduct(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/lpdeleteproduct',
            handler: function (req, reply) {
                return Snb.lpdeleteproduct(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/comparator',
            // handler: defaultHandlerWrapper(app),
            handler: function (req, reply) {
                return Snb.comparator(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/comparatorList',
            handler: function (req, reply) {
                return Snb.lpcomparesummary(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'GET',
            path: '/clearList',
            handler: function (req, reply) {
                return Snb.clearList(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/removeitemfromcart',
            handler: function (req, reply) {
                return Cnc.removeitemfromcart(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/additemtowishlist',
            handler: function (req, reply) {
                return Cnc.additemtowishlist(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/updateitemquantity',
            handler: function (req, reply) {
                return Cnc.updateitemquantity(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/updateitem',
            handler: function (req, reply) {
                return Cnc.updateitem(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/updatepromotion',
            handler: function (req, reply) {
                return Cnc.updatepromotion(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/commitordermethoddecider',
            handler: function (req, reply) {
                return Cnc.commitOrderMethodDecider(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/gettokenidforpaypal',
            handler: function (req, reply) {
                return Cnc.gettokenidforpaypal(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/getshoppingcartcount',
            handler: function (req, reply) {
                return Cnc.getShoppingCartCount(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/displaysavedlistcount',
            handler: function (req, reply) {
                return Cnc.displaySavedListCount(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/applycoupon',
            handler: function (req, reply) {
                return Cnc.applyCoupon(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        }, {
            method: ['GET'],
            path: '/jsDocumentation/{param*}',
            handler: {
                directory: {
                    path: __dirname + '/../docs/',
                    listing: true,
                    index: ['index.html']
                }
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }

        },
        {
            method: ['POST'],
            path: '/removeitemfromsavedcart',
            handler: function (req, reply) {
                return Cnc.removeItemFromSavedCart(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }

        },
        {
            method: ['POST'],
            path: '/eventbysearchforgiftregistry',
            handler: function (req, reply) {
                return Cnc.eventBySearchForGiftRegistry(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }

        },
        {
            method: ['POST'],
            path: '/converttogiftregistryitem',
            handler: function (req, reply) {
                return Cnc.convertToGiftRegistryItem(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }

        },
        {
            method: 'POST',
            path: '/setgiftwrapservice',
            handler: function (req, reply) {
                return Cnc.setGiftWrapService(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }

        },
        {
            method: 'POST',
            path: '/eventbysearhableproperties',
            handler: function (req, reply) {
                return Cnc.gREventsbysearch(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/paymentmethodselection',
            handler: function (req, reply) {
                return Cnc.paymentMethodSelection(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/checknightboxavailabilitystatus',
            handler: function (req, reply) {
                return Cnc.checkNightBoxAvailabilityStatus(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/removeitem',
            handler: function (req, reply) {
                return Cnc.removeitem(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/guestcheckoutbillinginfo',
            handler: function (req, reply) {
                return Cnc.guestCheckOutBillingInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        //---------SiteMap-----------
        {
            method: 'GET',
            path: '/tienda/siteMap',
            handler: function (req, reply) {
                return Snb.getSiteMapData(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        //---------SiteMap-----------
        {
            method: 'POST',
            path: '/proceedbillingtopromotion',
            handler: function (req, reply) {
                return Cnc.addNewCardForRegisteredUser(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkoutPromotion',
            handler: function (req, reply) {
                return Cnc.promotion(req, reply, app, 'CheckoutStep3', false);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkoutBilling',
            handler: function (req, reply) {
                return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POSt',
            path: '/updatecreditcard',
            handler: function (req, reply) {
                return Cnc.updateCreditCard(req, reply, app, 'checkoutbillingpage', false);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POSt',
            path: '/billingwithciebancomer',
            handler: function (req, reply) {
                return Cnc.billingWithCIEBancomer(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/users/newCreditCard',
            handler: function (req, reply) {
                return Snb.cardAdd(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/users/editCreditCard',
            handler: function (req, reply) {
                return Snb.cardAdd(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/cardSearch',
            handler: function (req, reply) {
                return Account.cardSearch(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/createNewCreditCard',
            handler: function (req, reply) {
                return Account.createNewCard(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POSt',
            path: '/getciepaymenttypesinfo',
            handler: function (req, reply) {
                return Cnc.getCIEPaymentTypeInfo(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/removeCreditCard',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Snb.removeCreditCard(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/wishlist/{param*}',
            handler: function (req, reply) {
                return Wishlist.displayWishlistItems(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/removeitemfromwishlist',
            handler: function (req, reply) {
                return Wishlist.removeItemFromWishlist(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/addmultiplewishlistitems',
            handler: function (req, reply) {
                return Wishlist.addmultiplewishlistitems(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/setDefaultCreditCard',
            handler: function (req, reply) {
                return Snb.setDefaultCreditCard(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getCreditCards',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Snb.getCreditCards(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkoutOrderConfirmation',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Cnc.checkoutstep4(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }


            }
        },
        {
            method: 'POST',
            path: '/getconfirmorder',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Cnc.getconfirmorder(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }


            }
        },
        {
            method: 'GET',
            path: '/tienda/turntomobile',
            handler: function (req, reply) {
                return Snb.turntomobile(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }


            }
        },
        {
            method: 'POST',
            path: '/getorderconfirmationpdf',
            handler: function (req, reply) {
                return Cnc.getOrderConfirmationPDF(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/downloadTicket',
            handler: function (req, reply) {
                return Account.getdownloadTicketF(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/limitedPiecesSkus',
            handler: function (req, reply) {
                return Snb.limitedPiecesSkus(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/staticLabels',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Cnc.getStaticLabels(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/checkout/payment/process3DSResponse',
            handler: function (req, reply) {
                return Cnc.process3DSResponse(req, reply, app);

            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/views/{param*}',
            handler: {
                directory: {
                    path: './build/'
                }
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/addMultipleItemsToWishlist',
            handler: function (req, reply) {
                return Cnc.addMultipleItemsToWishlist(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/guatemalaStates',
            handler: function (req, reply) {
                return Cnc.guatemalaStates(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },

        {
            method: 'POST',
            path: '/stateSearch',
            handler: function (req, reply) {
                return Cnc.stateSearch(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/staticPage/{pageName}',
            handler: function (req, reply) {
                return staticFile.getStaticPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/paginas/{pageName}',
            handler: function (req, reply) {
                return staticFile.getStaticPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/tienda/paginas/{pageName*}',
            handler: function (req, reply) {
                return staticFile.getStaticPage(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getstoredetails',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Snb.getStoreDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getstoresbytype',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Snb.getStoresByType(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/getallstores',
            handler: function (req, reply) {
                // return Cnc.checkoutBillingPage(req, reply, app, 'checkoutbillingpage', false);
                return Snb.getAllStoreDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/404lp',
            handler: function (req, reply) {
                return reply.file(__dirname + '/../static/404lp.html');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'GET',
            path: '/404pb',
            handler: function (req, reply) {
                return reply.file(__dirname + '/../static/404pb.html');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        }, {
            method: 'GET',
            path: '/404pbk',
            handler: function (req, reply) {
                return reply.file(__dirname + '/../static/404pbk.html');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        }, {
            method: 'GET',
            path: '/404pbt',
            handler: function (req, reply) {
                return reply.file(__dirname + '/../static/404pbt.html');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        }, {
            method: 'GET',
            path: '/404ws',
            handler: function (req, reply) {
                return reply.file(__dirname + '/../static/404ws.html');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        }, {
            method: 'GET',
            path: '/404wlm',
            handler: function (req, reply) {
                return reply.file(__dirname + '/../static/404wle.html');
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
        {
            method: 'POST',
            path: '/updateAbandonedEmailPreference',
            // handler: defaultHandlerWrapper(app),
            handler: function (req, reply) {
                return Account.updateAbandonedEmailPreference(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }

            }
        },
         {
            method: 'GET',
            path: '/tienda/users/abandonedSubscription',
            // handler: defaultHandlerWrapper(app),
            handler: function (req, reply) {
                return Account.getHeaderDetails(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        },
        {
            method: 'POST',
            path: '/getcreditcards',
            handler: function (req, reply) {
                return Cnc.getCreditCards(req, reply, app);
            },
            config: {
                state: {
                    parse: false, // parse and store in request.state
                    failAction: 'ignore' // may also be 'ignore' or 'log'
                }
            }
        }

    ]

};
