// export default {
//     defaultSite: 'lp'
// }

// const envBDTimeout =  process.env.TIMEOUTBS || 180
// process.env.TIMEOUTCART
// process.env.TIMEOUTCHECKOUT
// process.env.TIMEOUTMYACCOUNT
// process.env.TIMEOUTDEFAULT


const _BSTimeOut = (process.env.TIMEOUTBS || 3 * 60) * 1000;  // time out in ms  3 Mins
const _CartTimeOut = (process.env.TIMEOUTCART || 4 * 60) * 1000;  // time out in ms 4 Mins 
const _checkoutTimeOut = (process.env.TIMEOUTCHECKOUT || 7 * 60) * 1000;  // time out in mm 5 mins 
const _myAccountTimeOut = (process.env.TIMEOUTMYACCOUNT || 1 * 60) * 1000;  // time out in ms 1 mins
const _defaultTimeOut = (process.env.TIMEOUTDEFAULT || 5 * 60) * 1000;  // time out in ms 5 mins


// staticLabels

const _browseAndShop = {
    serviceName: [
        'getPlp',
        'categoryBody',
        'pdpBody',
        'allCategoryInfo',
        'collectionBody',
        'getListOfStates',
        'footerInfo',
        'sellers',
        'getVariants',
        'allOffers',
        'estimatedDeliveryDate',
        'getPDPDynamicContent',
        'lpAddProduct',
        'lpCompareSummary',
        'lpDeleteProduct',
        'offers',
        'hybridBody',
        'allCategoryInfo'
    ],
    timeout: _BSTimeOut
}

const _cart = {
    serviceName: [
        'addItemToCart',
        'cartDetails',
        'getCartHeaderDetails',
        'addMultipleItemsToWishlist',
        'displaySavedListCount',
        'removeItemFromCart',
        'applyCoupon',
        'addMultipleItemsToOrder',
        'convertToGiftRegistryItemApi',
        'setGiftWrapService',
        'giftWrapperDisplayService',
        'addpdpitemtocart'
    ],
    timeout: _CartTimeOut
}

const _checkout = {
    serviceName: [
        'getCIEPaymentTypesInfo',
        'createNewCreditCard',
        'checkNightBoxAvailabilityStatus',
        'collectInStore',
        'checkOutLpBillingInfoDetail',
        'getConfirmOrder',
        'orderSummary',
        'checkoutItemsDetail',
        'commitOrderMethodDecider',
        'billingWithCIEBancomer',
        'getShipToStoreEventDetails',
        'paymentMethodSelection',
        'getTokenIDForPaypal',
        'shippingAddressForCheckout',
        'getStoreAddress',
        'getShippingAddresses',
        'get_shipping_address_events_items',
        'getCreditCards',
        'removeitem',
        'updateItem',
        'updatePromotion',
        'displayLPBestPromotion',
        'shippingAddressForCheckoutGuest',
        'getCountry',
        'getOrderConfirmationPDF',
        'processPayPalDropletActor',
        'createNewCard',
        'guestCheckOutBillingInfo',
        'addNewCardForRegisteredUser'
    ],
    timeout: _checkoutTimeOut
}

const _myAccount = {
    serviceName: [
        'createAccount',
        'restLogin',
        'login',
        'logout',
        'getPhoneNumbers',
        'resetPassword',
        'updatePreferences',
        'airtimeAmountSearch',
        'cardSearch',
        'stateSearch',
        'removePhoneNumber',
        'getPreferences',
        'addNewPhoneNumber',
        'phoneServiceSearch',
        'editPhoneNumber',
        'updateAddress',
        'addressSearch',
        'removeAddress',
        'getCreditCards',
        'updateCreditCard',
        'removeCreditCard',
        'updateUser',
        'updateAbandonedEmailPreference',
        'createNewCard',
        'setDefaultCreditCard',
        'changePassword',
        'addNewAddress',
        'getAddresses',
        'setDefaultAddress',
        'getPreferences',
        'getStaticPromotions',
        'removeItemFromCart',
        'applyCoupon',
        'addMultipleItemsToOrder',
        'setGiftWrapService',
        'giftWrapperDisplayService',
        'convertToGiftRegistryItemApi',
        'gREventsbysearch',
        'addItemToCart',
        'orderHistory',
        'orderDetailService',
        'orderLineItemStatus',
        'downloadTicket'
        ],
    timeout: _myAccountTimeOut
}

module.exports = {
    browseAndShop: _browseAndShop,
    cart: _cart,
    myAccount: _myAccount,
    checkout: _checkout,
    defaultTimeOut: _defaultTimeOut
}