/**
 * Module Name : Client Helper Utility
 * Functionality : This is general client helper Utitlty. This have all common functions which will get use in application.
 * @exports : we have multiple exports {getPriceInFormat, toNumber, GetLinkData, urlConstruction, getBrandName, savePDF, UserAgentDetails, GTMallPages, SetCookie, GetCookie, loaderShow, logDebug, logError, enableClientLogs, getAssetsPath }
 * @requires : module:lodash/map
 * @requires : module:lodash/isEmpty
 * @requires : module:file-saver
 * @requires : module:config/constants
 * @requires : module:clientLoggerHandler
 * @requires : module:axios
 * requires : module:uuid
 * Team : SNB Team
 * 
 */

import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
const FileSaver = require('file-saver');

import { DECIMAL_DIGITS } from '../../config/constants';
const getBrowserBunyanInstance = require('../clientLoggerHandler');
const loggerHandler = getBrowserBunyanInstance('Logs');

const axios = require('axios'),
    uuid = require('uuid/v4');
let count = 0;

/**
 * Utility method is use for AXIOS call
 * @function Utility
 * @author 
 * @desc Utility method is use for AXIOS call.
 * @param {string} path 
 * @param {string} type 
 * @param {string} payload 
 * @param {object} userHeaders 
 * @returns promise
 */
export const Utility = (path, type, payload, userHeaders) => {
    let windowOBJ = undefined;
    if (typeof window !== 'undefined') {
        windowOBJ = window;
    }
    const brandName = getBrandName(windowOBJ);
    const agentDetails = UserAgentDetails(windowOBJ);
    const UserAgent = agentDetails.isDesktop ? 'WEB' : agentDetails.isIpad ? 'APP' : 'APP';
    const correlationID = brandName.brand + '-' + UserAgent + '-' + uuid(new Date().getTime());
    userHeaders = userHeaders || {}

    let headers = {
        'user-correlation-id': correlationID,
        'x-correlation-id': correlationID
    }

    Object.assign(headers, userHeaders);
    loaderShow(true, path);

    return axios({
        method: type,
        host: 'jsonplaceholder.typicode.com',
        url: path,
        responseType: 'json',
        data: payload,
        headers: headers
    }).finally(function () {
        loaderShow(false, '');
    });

}

/**
 * UtilityTypeText  method is use for AXIOS call
 * @function UtilityTypeText
 * @author 
 * @desc UtilityTypeText method is use for AXIOS call.
 * @param {string} path 
 * @param {string} type 
 * @param {string} payload 
 * @returns promise
 */
export const UtilityTypeText = (path, type, payload) => {
    const brandName = getBrandName(window);
    const agentDetails = UserAgentDetails(window);
    const UserAgent = agentDetails.isDesktop ? 'WEB' : agentDetails.isIpad ? 'APP' : 'APP';
    const correlationID = brandName.brand + '-' + UserAgent + '-' + uuid(new Date().getTime());

    return axios({
        method: type,
        host: 'jsonplaceholder.typicode.com',
        url: path,
        responseType: 'text',
        data: payload,
        headers: {
            'user-correlation-id': correlationID,
            'x-correlation-id': correlationID
        }
    })
}

/**
 * OnImgError method is use for image is not loaded
 * @function OnImgError
 * @author 
 * @desc OnImgError method is use for image is not loaded
 * @param {string} errImgElement 
 * @param {string} noImgPath 
 */
export const OnImgError = (errImgElement, noImgPath) => {
    if (errImgElement.src) {
        errImgElement.src = noImgPath;
    }
}

/**
 * GetPrice method will calculate price which will get display on UI
 * @function GetPrice
 * @author 
 * @desc GetPrice method will calculate price which will get display on UI
 * @param {array} priceInfo 
 * @returns displayPrice
 */
export const GetPrice = (priceInfo) => {

    let price = toNumber(priceInfo);
    let displayPrice = {};

    if (price.numRecords > 1) {

        if (price.minList == price.maxList && price.minPromo == price.maxPromo && price.minPromo == price.minList && price.minList != 0 ||
            price.minList == price.maxList && price.minPromo == price.maxPromo && price.minPromo == 0) {

            displayPrice.rangeDiscount = {};

            displayPrice.rangeDiscount.noRange = GetWithDecimal(price.minList, DECIMAL_DIGITS);

        } else if (price.minList == price.maxList && price.minPromo == price.maxPromo && price.minPromo != 0) {

            displayPrice.rangePrice = {};

            displayPrice.rangePrice.noRange = GetWithDecimal(price.minList, DECIMAL_DIGITS);

            displayPrice.rangeDiscount = {};
            displayPrice.rangeDiscount.noRange = GetWithDecimal(price.minPromo, DECIMAL_DIGITS);

        } else if (price.minList == price.maxList && price.minPromo < price.maxPromo) {

            displayPrice.rangePrice = {};

            displayPrice.rangePrice.noRange = GetWithDecimal(price.minList, DECIMAL_DIGITS);

            displayPrice.rangeDiscount = {};
            displayPrice.rangeDiscount.min = GetWithDecimal(price.minPromo, DECIMAL_DIGITS);
            displayPrice.rangeDiscount.max = GetWithDecimal(price.maxPromo, DECIMAL_DIGITS);

        } else if (price.minList < price.maxList && price.minPromo == price.maxPromo && price.minPromo == 0) {

            displayPrice.rangeDiscount = {};

            displayPrice.rangeDiscount.min = GetWithDecimal(price.minList, DECIMAL_DIGITS);
            displayPrice.rangeDiscount.max = GetWithDecimal(price.maxList, DECIMAL_DIGITS);

        } else if (price.minList < price.maxList && price.minPromo == price.maxPromo && price.minPromo != 0) {

            displayPrice.rangePrice = {};

            displayPrice.rangePrice.min = GetWithDecimal(price.minList, DECIMAL_DIGITS);
            displayPrice.rangePrice.max = GetWithDecimal(price.maxList, DECIMAL_DIGITS);

            displayPrice.rangeDiscount = {};
            displayPrice.rangeDiscount.noRange = GetWithDecimal(price.minPromo, DECIMAL_DIGITS);

        } else if (price.minList < price.maxList && price.minPromo < price.maxPromo && price.minList === price.minPromo && price.maxList === price.maxPromo) {

            displayPrice.rangeDiscount = {};

            displayPrice.rangeDiscount.min = GetWithDecimal(price.minList, DECIMAL_DIGITS);
            displayPrice.rangeDiscount.max = GetWithDecimal(price.maxList, DECIMAL_DIGITS);

        } else if (price.minList < price.maxList && price.minPromo < price.maxPromo) {

            displayPrice.rangePrice = {};

            displayPrice.rangePrice.min = GetWithDecimal(price.minList, DECIMAL_DIGITS);
            displayPrice.rangePrice.max = GetWithDecimal(price.maxList, DECIMAL_DIGITS);

            displayPrice.rangeDiscount = {};
            displayPrice.rangeDiscount.min = GetWithDecimal(price.minPromo, DECIMAL_DIGITS);
            displayPrice.rangeDiscount.max = GetWithDecimal(price.maxPromo, DECIMAL_DIGITS);
        }

    } else {

        if (price.list == price.sale && price.promo == 0 ||
            price.list == price.sale && price.promo == price.list && price.promo != 0) {

            displayPrice.discount = GetWithDecimal(price.list, DECIMAL_DIGITS);

        } else if (price.list == price.sale && price.promo > 0) {

            displayPrice.price = GetWithDecimal(price.list, DECIMAL_DIGITS);
            displayPrice.discount = GetWithDecimal(price.promo, DECIMAL_DIGITS);

        } else if (price.list > price.sale && price.promo == 0) {

            displayPrice.price = GetWithDecimal(price.list, DECIMAL_DIGITS);
            displayPrice.discount = GetWithDecimal(price.sale, DECIMAL_DIGITS);

        } else if (price.list > price.sale && price.promo > 0) {

            displayPrice.price = GetWithDecimal(price.list, DECIMAL_DIGITS);
            displayPrice.discount = GetWithDecimal(price.promo, DECIMAL_DIGITS);

        }

    }

    return displayPrice;
}

export const setPrice = (caroudalData) => {
    const priceData = {
               list: caroudalData['sku.list_Price'] || "",
               sale: caroudalData['sku.sale_Price'] || "",
               promo: caroudalData['sku.promoPrice'] || "",
               minList: caroudalData['minimumListPrice'] || "",
               maxList: caroudalData['maximumListPrice'] || "",
               minPromo: caroudalData['minimumPromoPrice'] || "",
               maxPromo: caroudalData['maximumPromoPrice'] || "",
               numRecords:  caroudalData['numRecords'] || 0
           };

    const priceToShow = GetPrice(priceData);
    let showPrice='';
    let metric2 = '';
    if(priceToShow.discount && priceToShow.discount.val && priceToShow.discount.decimal){
        showPrice =priceToShow.discount.val +'.'+ priceToShow.discount.decimal;
    }
    else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange){
        showPrice = priceToShow.rangeDiscount.noRange.val +'.'+ priceToShow.rangeDiscount.noRange.decimal;
    }
    else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.min){
        showPrice = priceToShow.rangeDiscount.min.val +'.'+priceToShow.rangeDiscount.min.decimal;
        metric2 = showPrice;
    }
    else if(priceToShow.price){
        showPrice = priceToShow.price.val +'.'+priceToShow.price.decimal;
    }
    else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
        showPrice = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
    }
    else if(priceToShow.rangePrice && priceToShow.rangePrice.min){
        showPrice = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
    }
    if(priceToShow.price){
        metric2 = priceToShow.price.val +'.'+priceToShow.price.decimal;
    }
    else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
        metric2 = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
    }
    else if(priceToShow.rangePrice && priceToShow.rangePrice.min){
        metric2 = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
    }

    return { 'showPrice': showPrice, 'metric2': metric2 };
}


export const GetWithDecimal = (price, decimalDigits) => {


    if (decimalDigits < 1) {
        decimalDigits = 1;
    }

    let withDecimal = {
        val: "0",
        decimal: "00"
    };

    if (!isNaN(price)) {

        let ourPrice = Number(price).toFixed(decimalDigits).split('.');

        withDecimal.val = ourPrice[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        if (ourPrice.length > 0) {
            withDecimal.decimal = ourPrice[1];
        }
    }

    return withDecimal;
}

export const getPriceInFormat = (price, decimalDigits = 2) => {
    const obj = GetWithDecimal(price, decimalDigits);
    return obj.val + '.' + obj.decimal;
}

export const toNumber = (priceObj) => {

    let ourPrice = {};
    !isEmpty(priceObj) && map(priceObj, (item, key) => {
        ourPrice[key] = (!isNaN(item)) ? Number(item) : item;
    })
    return ourPrice;
}

export const GetLinkData = (inputData) => {

    let linkData = {
        href: '/',
        asInfo: '/'
    };

    const { pageName = '' } = inputData || {};

    if (pageName === 'CLP') {
        const { catId = '', catName = '', always = '' } = inputData || {};
        linkData.href = `/tienda/twoColumnCategoryPage?categoryId=${catId}&always=${always}`;
        linkData.asInfo = `/tienda/${catName}/${catId}`;
        if (always !== '') {
            linkData.asInfo = linkData.asInfo + `?showPLP`;
        }
        
    } else  if (pageName === 'productDetails') {

        const { productId    = '',
                productName = '',
                typeahead   = '',
                pdpTypeForSPA = '' } = inputData || {};
        
        linkData.href = `/tienda/oneColumnPage?productName=${productName}&productId=${productId}&pdpTypeForSPA=${pdpTypeForSPA}`;

        if(pdpTypeForSPA === 'default') {
            linkData.asInfo = `/tienda/pdp/${productName}/${productId}`;

        } else if(pdpTypeForSPA === 'hybrid') {
            linkData.asInfo = `/tienda/pdp/hp/${productName}/${productId}`;

        } else if(pdpTypeForSPA === 'collection') {
            linkData.asInfo = `/tienda/group/${productName}/${productId}`;

        }

        if(typeahead === 'yes') {
            linkData.href = linkData.href + `&typeahead=yes`;
            linkData.asInfo = linkData.asInfo + `?typeahead=yes`;
        }

    }

    return linkData;

}

export const getFilteredString = (value) => {
    let str = value;
    if(!isEmpty(str)) {
        str = str.toLowerCase().replace(/-/g, ' ').replace(/<[^>]*>/g, ' ').replace(/\s\s+/g, ' ').trim().replace(/ /g, '-').replace(/#/g, '');
        return str;
    }
    return str;
}

export const urlConstruction = (isSellerPage = false, sellerId = '', sellerName = '', categoryName = null, id_arr = null, page = null, minPrice = null, maxPrice = null, categoryId = null, sortOrder = null, searchTerm = null) => {
    //console.log('urlConstructionurlConstructionurlConstructionurlConstruction===========')
    let asInfo = '/tienda';
    if (isSellerPage) {
        sellerName = sellerName.split(" ").join("-").toLowerCase();
        asInfo = `${asInfo}/sp/${sellerName}/${sellerId}`;
    }
    let href = '/tienda/twoColumnCategoryPage?';
    const params = {
        'categoryId': '',
        'label': '',
        'page': '',
        'Ns': '',
        's': '',
        'Nf': '',
        'sellerId': ''
    };
    if (categoryName != null && !isSellerPage) {
        categoryName = categoryName.split(" ").join("-").toLowerCase();
        asInfo = `${asInfo}/${categoryName}`;
    }
    if (categoryId !== null) {
        asInfo = `${asInfo}/${categoryId}`;
        params['categoryId'] = categoryId;
    } else {
        if (id_arr !== null && Array.isArray(id_arr) && id_arr.length > 0) {
            asInfo = `${asInfo}/N-${id_arr.join("Z")}`;
            params['label'] = `N-${id_arr.join("Z")}`
        }
    }
    if (page !== null) {
        asInfo = `${asInfo}/page-${page}`;
        params['page'] = `${page}`;
    }
    if (minPrice !== null && maxPrice !== null) {
        asInfo = `${asInfo}?Nf=sortPrice|BTWN+${minPrice}+${maxPrice}`;
        params['Nf'] = `sortPrice|BTWN+${minPrice}+${maxPrice}`;
    }
    if (sortOrder !== null) {
        if (minPrice !== null && maxPrice !== null) {
            asInfo = `${asInfo}&Ns=${sortOrder}`;
        } else {
            asInfo = `${asInfo}?Ns=${sortOrder}`;
        }
        params['Ns'] = sortOrder;
    }
    if (searchTerm != null) {
        if (minPrice === null && sortOrder === null) {
            asInfo = `${asInfo}?s=${searchTerm}`;
        } else {
            asInfo = `${asInfo}&s=${searchTerm}`;
        }
        params['s'] = searchTerm;
    }
    if (isSellerPage) {
        params['sellerId'] = sellerId;
    }
    for (let k in params) {
        href = `${href}${k}=${params[k]}&`;
    }
    href = href.slice(0, -1);
    return { 'href': href, 'asInfo': asInfo };
}

export const getBrandName = (windowObj) => {
    const window = windowObj || {};
    const URL = window && window.location && window.location.hostname && window.location.hostname.toLowerCase() || "";
    let domainName, brandName = { brand: 'LP' };

    if (URL) {

        switch (true) {
            case URL.indexOf('williams-sonoma.com.mx') >= 0:
                brandName.brand = 'WS';
                break;
            case URL.indexOf('potterybarn.com.mx') >= 0:
                brandName.brand = 'PB';
                break;
            case URL.indexOf('potterybarnkids.com.mx') >= 0:
                brandName.brand = 'PBK';
                break;
            case URL.indexOf('pbteen.com.mx') >= 0:
                brandName.brand = 'PBT';
                break;
            case URL.indexOf('westelm.com.mx') >= 0:
                brandName.brand = 'WLM';
                break;
            default:
                brandName.brand = 'LP';
        }
        return brandName;
    } else {
        return brandName;
    }
}

export const savePDF = (blobData,fileName) =>{
    const blob = new Blob(blobData, { type: "application/pdf" });
    const fileURL = URL.createObjectURL(blob);
    const isIOSDevice = !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
    if (isIOSDevice){
        window.open(fileURL, '_blank');
    } else {
        // window.open(fileURL, '_blank');
        FileSaver.saveAs(blob, fileName);
    }
}

export const UserAgentDetails = (windowObj) => {
    const window = windowObj || {};

    const userAgent = window && window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase() || "";
    // added for defect #21350
    let innerWidth = '';
    let innerHeight = '';
    if (typeof window !== 'undefined' && window) {
        if (typeof window.innerWidth !== 'undefined' && window.innerWidth) {
            innerWidth = window.innerWidth;
        }
        if (typeof window.innerHeight !== 'undefined' && window.innerHeight) {
            innerHeight = window.innerHeight;
        }
    }

    let agentDetails = {
        isDesktop: false,
        isIpad: false,
        isMobile: false,
        isAndroid: false,
        isLandscape: false,
        isPortrait: false
    };

    if (userAgent != '') {
        if (userAgent.indexOf('iphone') > 0 || userAgent.indexOf('android') > 0) {
            agentDetails.isMobile = true;
            if (userAgent.indexOf('android') > 0) {
                agentDetails.isAndroid = true;
            }
        } else if (userAgent.indexOf('ipad') > 0 || userAgent.indexOf('ipod') > 0) {
            agentDetails.isIpad = true;
        } else {
            agentDetails.isDesktop = true;
        }

        // Temporary code
        if (innerWidth > innerHeight) {
            agentDetails.isLandscape = true;
            agentDetails.isPortrait = false;
        } else {
            agentDetails.isLandscape = false;
            agentDetails.isPortrait = true;
        }
    }

    return agentDetails;
}

export const GTMallPages = (windowObj) => {
    //console.log('nextprops', this)
    let window = windowObj || {};
    // added for defect #21350
    let loginStatus = '';
    let actURL = '';
    let actPageTitle = '';
    let userID = '';
    if (typeof window !== 'undefined' && window) {
        if (typeof window.loginStatus !== 'undefined' && window.loginStatus) {
            loginStatus = window.loginStatus;
        }
        if (typeof window.actURL !== 'undefined' && window.actURL) {
            actURL = window.actURL;
        }
        if (typeof window.actPageTitle !== 'undefined' && window.actPageTitle) {
            actPageTitle = window.actPageTitle;
        }
        if (typeof window.userID !== 'undefined' && window.userID) {
            userID = window.userID;
        }
    }
    let ClientID = GetCookie("_ga").substring(6);
    let siteName = GetCookie("ActiveDataCenterCookie");
    let GTM_USER_ID = sessionStorage.getItem('gtm')
    let flagChangeForLogin = GTM_USER_ID && GTM_USER_ID !== '' ? 'Y' : 'N';

    let gtmObjectData = {
        event: 'vPageView',                 //Static Data
        loginStatus: loginStatus || flagChangeForLogin || '',                              //Dynamic Data
        actURL: decodeURI(actURL || ''),               //Dynamic Data
        actPageTitle: decodeURI(actPageTitle || ''),   //Dynamic Data
        userID: userID || GTM_USER_ID || '',                      //CD 11
        clientID: ClientID,                   //CD 37
        siteName:siteName || ''
    }


    dataLayer.push(gtmObjectData);
    return GTMallPages;
}

export const SetCookie = (cName, cValue, expiryTime, path) => {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + Number(expiryTime));
    const expires = "expires=" + currentDate.toUTCString();
    document.cookie = `${cName}=${cValue};${expires};path=${path}`;
}

export const GetCookie = (cName) => {
    // console.log('here inside cookie',cName);
    if (typeof window !== 'undefined') {
        const name = cName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const arr = decodedCookie && decodedCookie.split(';');
        for (let i = 0; i < arr.length; i++) {
            let str = arr[i];
            while (str.charAt(0) == ' ') {
                str = str.substring(1);
            }
            if (str.indexOf(name) == 0) {
                // console.log('here inside cookie str================', str);
                return str.substring(name.length, str.length);
            }
        }
        // console.log('here inside cookie not found');
    }
    return "";
}

export const loaderShow = (status, path) => {
    let hideLoaderServiceWeb = []
    let hideLoaderServiceWap = []

    hideLoaderServiceWeb.push('/typeaheadservice');
    hideLoaderServiceWeb.push('/tienda/browse/getvariantdetails');
    hideLoaderServiceWeb.push('/getpdpdynamiccontent');
    hideLoaderServiceWeb.push('/airtimeamountsearch');
    hideLoaderServiceWeb.push('/tienda/browse/getcarouselcontent');
    hideLoaderServiceWeb.push('/fetchconfiguration');
    hideLoaderServiceWeb.push('/gtmservicecall');
    hideLoaderServiceWeb.push('/tienda/browse/getlistofstates');
    // hideLoaderServiceWeb.push('/estimateddeliverydate'); /*commented for  23416 */
    hideLoaderServiceWeb.push('/realtimeinventorycheckservice');
    hideLoaderServiceWeb.push('/getcarouselhome');
    hideLoaderServiceWeb.push('/getshippingaddresses');
    hideLoaderServiceWeb.push('/getRealTimeStock');// 22421 fix try
    hideLoaderServiceWeb.push('/staticLabelsFetch');

    


    hideLoaderServiceWap.push('/typeaheadservice');
    hideLoaderServiceWap.push('/tienda/browse/getvariantdetails');
    hideLoaderServiceWap.push('/getpdpdynamiccontent');
    hideLoaderServiceWap.push('/endecasearchservice?label=');
    hideLoaderServiceWap.push('/airtimeamountsearch');
    hideLoaderServiceWap.push('/tienda/browse/getcarouselcontent');
    hideLoaderServiceWap.push('/fetchconfiguration');
    hideLoaderServiceWap.push('/gtmservicecall');
    hideLoaderServiceWap.push('/tienda/browse/getlistofstates');
    hideLoaderServiceWap.push('/limitedpiecesskus');
    // hideLoaderServiceWap.push('/estimateddeliverydate'); /*commented for  23416 */
    hideLoaderServiceWap.push('/getstoreaddress');
    hideLoaderServiceWap.push('/getcarouselhome');
    hideLoaderServiceWap.push('/getshippingaddresses');
    hideLoaderServiceWap.push('/realtimeinventorycheckservice');
    hideLoaderServiceWap.push('/staticLabelsFetch');
    hideLoaderServiceWap.push('/getCartHeaderDetails');
    hideLoaderServiceWap.push('/gtmServiceCall');
    hideLoaderServiceWap.push('/getRealTimeStock');

    

    

    

    if (typeof window !== 'undefined') {
        const agentDetails = UserAgentDetails(window);

        if ((hideLoaderServiceWeb.find(p => path.toLowerCase().indexOf(p) >= 0) === undefined && agentDetails.isDesktop) || (hideLoaderServiceWap.find(p => path.toLowerCase().indexOf(p) >= 0) === undefined && !agentDetails.isDesktop)) {
            if (document && document.getElementsByClassName('loading') && document.getElementsByClassName('loading')[0]) {
                if (status) {
                    count = count + 1
                    document.getElementsByClassName('loading')[0].setAttribute("style", "display:block");
                } else {
                    count = count - 1;
                    count <= 1 && document.getElementsByClassName('loading')[0].setAttribute("style", "display:none");
                }
            }
            // console.log("count============>", count)
        } else {
            // console.log("count============>", count)
        }
    }
}
export const logDebugOld = (moduleName, ...prpos) => {
    if (typeof window !== 'undefined' && window) {

        const showLog = window.showLog || GetCookie('showLog') || false;

        let clientConfig = GetCookie('clientConfig');

        if (clientConfig.trim().length > 0) {
            try {

                clientConfig = '{' + clientConfig.replace(/\'/g, '"').replace(/\|/g, ',') + '}'
                clientConfig = JSON.parse(clientConfig);
            } catch (ex) {
                clientConfig = {};
            }
        }
        let EnableNodeLog = (clientConfig.EnableNodeLog && clientConfig.EnableNodeLog.toString().toLocaleLowerCase() === "true") ? true : false;

        if (showLog === true || EnableNodeLog === true) {
            loggerHandler.debug('::' + moduleName + '::', ...prpos);
            SetCookie('showLog', true, 10000 * 60, '/');
        } else {
            SetCookie('showLog', false, 10, '/');
        }
    }
}

export const logDebug = (moduleName, ...prpos) => {

    if (typeof window !== 'undefined' && window) {

        const showLog = window.showLog || GetCookie('showLog').toLocaleLowerCase() === "true" ? true : false || false;
        if (showLog === true) {
            loggerHandler.debug('::' + moduleName + '::', ...prpos);
        }
    }
}

export const logError = (moduleName, ...prpos) => {
    loggerHandler.error('::' + moduleName + '::', ...prpos);
}

export const enableClientLogs = (isenable) => {
    window.showLog = isenable;
    let ttl = 10;
    if (isenable) {
        ttl = 10000 * 60;
    } else {
        ttl = 10;
    }
    SetCookie('showLog', isenable, ttl, '/');
    logDebug('Utility', 'enableClientLogs ' + (isenable ? ' Started...' : ' Stop...'));
}

/**
 * getAssetsPath function will calculate assets path depend on URL
 * @function getAssetsPath
 * @author mvaity@zensar.com
 * @desc getAssetsPath function will calculate assets path depend on URL, This function will pickup assets URL from process.env variables.
 * @param {object} windowObj 
 * @param {string} domainName 
 * @param {object} appProcess 
 * @returns string
 * 
 */
export const getAssetsPath = (windowObj, domainName, appProcess) => {
    let assetFullPath = ''

    var process = appProcess;
    if (process === undefined || process.env === undefined ||  (Object.keys(process.env).length === 0 && process.env.constructor === Object)) {
        process = process || {};
        try {
            process.env = JSON.parse(document.getElementById("envVar").value);
        } catch (ex) {
            process.env = {};
        }
    }
    const windows = windowObj || {};
    let URL = windows && windows.location && windows.location.hostname && windows.location.hostname.toLowerCase() || "";
    if (domainName && domainName.trim().length > 0) {
        URL = domainName;
    }


    if (URL && process.env.NODE_ENV.toLocaleLowerCase() !== 'development1' ) {   /// for development pickup assets from local only.
        switch (true) {
            case URL.indexOf('williams-sonoma') >= 0 || URL.indexOf('williamssonoma') >= 0:
                assetFullPath = process && process.env && process.env.STATICASSETSWS || '';
                break;
            case URL.indexOf('potterybarn') >= 0:
                assetFullPath = process && process.env && process.env.STATICASSETSPB || '';
                break;
            case URL.indexOf('potterybarnkids') >= 0:
                assetFullPath = process && process.env && process.env.STATICASSETSPBK || '';
                break;
            case URL.indexOf('pbteen') >= 0:
                assetFullPath = process && process.env && process.env.STATICASSETSPBT || '';
                break;
            case URL.indexOf('westelm') >= 0:
                assetFullPath = process && process.env && process.env.STATICASSETSWEL || '';
                break;
            default:
                assetFullPath = process && process.env && process.env.STATICASSETSLP || '';
        }
        //console.log('assetFullPath===>>>>', assetFullPath)
        return assetFullPath;
    } else {
        //console.log('ELSE assetFullPath===>>>>', assetFullPath)
        return assetFullPath;
    }
}

