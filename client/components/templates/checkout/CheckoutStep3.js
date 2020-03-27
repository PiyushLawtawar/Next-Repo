/*include ../../molecules/MaterialInputText/molecule-inputText
include ../../molecules/MaterialInputCheckbox/molecule-inputCheckbox
include ../../molecules/MaterialSelect/molecule-select
include ../../molecules/MixinMolecules/mixin-molecules.pug
include ../../atoms/Buttons/atom-buttons
include ../../atoms/TagImage/atom-image
include ../../atoms/Anchor/atom-anchor
include ../../molecules/Alerts/molecule-alert
include ../../organism/Checkout/organism-checkout-stepThree*/

/**
* Module Name : CheckoutStep3
* Functionality : Component used to show the billing page. This is get called from \pages\tienda\checkoutBilling.js
* @exports : CheckoutStep3
* @requires : module:React
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/molecules/Alert/Alerts
* @requires : module:/organisms/CheckoutStepThree/CheckoutStepThree
* @requires : module:react-event-listener
* @requires : module:lodash/map
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:next/router
* @requires : module:lodash/isEmpty
* @requires : module:/molecules/Alert/Alert
* Team : Checkout Team
* Other information : Showing the billing page
* 
*/
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Button from '../../atoms/Button/Button';
import Link from '../../atoms/Link/Link';
import Image from '../../atoms/Tagimage/Image';
import Alerts from '../../molecules/Alert/Alerts';
import CheckoutStepThree from '../../organisms/CheckoutStepThree/CheckoutStepThree';
import EventListener from 'react-event-listener';
import map from 'lodash/map';
import { Utility, GetPrice, UserAgentDetails, GetWithDecimal, GTMallPages, logDebug, GetCookie } from '../../../helpers/utilities/utility';
import { Path, } from '../../../helpers/config/config';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import Alert from '../../molecules/Alert/Alert';

/**
 * @class CheckoutStep3
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props) {
        super(props)
        this.state = {
            itemInfo: props.mainContent.defaultSinglePackageSelection && props.mainContent.isPackageEligible ? ((props.mainContent && props.mainContent.itemInfo && props.mainContent.itemInfo.deliveryInfo) || {}) : getItemInfoFromProductGroup((props.mainContent && props.mainContent.itemInfo && props.mainContent.itemInfo.itemDetails) || {}),
            // giftRegistryData: props.mainContent.defaultSinglePackageSelection && props.mainContent.isPackageEligible ? ((props.mainContent && props.mainContent.itemInfo && props.mainContent.itemInfo.deliveryInfo) || {}) : getGiftRegistryData((props.mainContent && props.mainContent.itemInfo && props.mainContent.itemInfo.itemDetails) || {}),
            priceInfo: (props.mainContent && props.mainContent.priceInfo) || {},
            shippingAddress: (props.mainContent && props.mainContent.shippingAddress && props.mainContent.shippingAddress.shippingAddressDetail) || {},
            paymentDetail: (props.mainContent && props.mainContent.paymentDetail) || {},
            defaultSinglePackageSelection: props.mainContent && props.mainContent.defaultSinglePackageSelection,
            isPackageEligible: (props.mainContent && props.mainContent.isPackageEligible),
            allPromotionalData: props && props.promotionInfo || '',
            DSParams: {},
            window: '',
            objectres: props.mainContent && props.mainContent.limitedPieces,
            staticLabels: props.mainContent && props.mainContent.staticLabels && props.mainContent.staticLabels.staticLabelValues[0].keyValues || {},
            alert_status: false,
            alert_message: '',
            loggedInUser: props.loginDetails.LoggedInSession,
            EDDErrorMessages: props.mainContent.EDDErrorMessages !== undefined ? props.mainContent.EDDErrorMessages : {},
            isMobile: false,            
            alertToTop: '',
        }
        this.removeProduct = this.removeProduct.bind(this);
        this.updateItemQuantity = this.updateItemQuantity.bind(this)
        this.finalSubmit = this.finalSubmit.bind(this)
        this.finalSubmitForPaypal = this.finalSubmitForPaypal.bind(this)
        this.ChangeIsPackageEligible = this.ChangeIsPackageEligible.bind(this)
        this.promotionClick = this.promotionClick.bind(this)

    }

    /**
	* Method will call if API goes to error case
	* @function error_scenario
	* @author prinshu.singh@zensar.com
	* @desc Based on the error response, showing error message or redirecting to proper page if session expires.
	* @param {object} response
	*/    
    error_scenario = (response) => {
        if (response && response.data && (response.data.errorCode === '1003' || response.data.errorCode === '1002')) {
            const LoggedInSession = GetCookie("LoggedInSession");
            // const KeepMeSignIn = GetCookie("KeepMeSignIn");
            // if(LoggedInSession && !KeepMeSignIn){
            //     Router.push('/tienda/login' + "?pageName=cart");
            // }else if(LoggedInSession){
            //     Router.push('/tienda/cart');
            // }else{
            //     Router.push('/tienda/cart');
            // }
            if(LoggedInSession){
                if(response.data.errorCode === '1002'){
                    Router.push('/tienda/login' + "?pageName=cart");
                }else if(response.data.errorCode === '1003'){
                    Router.push('/tienda/cart');
                }
            }else{
                Router.push('/tienda/cart');
            }            
        } else if (response && response.data && response.data.s === '1' && response.data.err) {
            this.show_alert(response.data.err);
        } else if (response && response.data && response.data.status && response.data.status.errorMessage) {
            this.show_alert(response.data.status.errorMessage);
        } else if (response && response.data && response.data.redirect === "true" && response.data.redirectPage === "Login") {
            Router.push('/tienda/login');
        } else if (response && response.data && response.data.redirect === "true" && response.data.redirectPage === "Cart") {
            Router.push('/tienda/cart');
        } else if (response && response.data && response.data.redirect === "true" && response.data.redirectPage === "Home") {
            Router.push('/tienda/home');
        }
    }


    /**
    * Method will call to remove product
    * @function removeProduct
    * @author prinshu.singh@zensar.com
    * @desc Removing selected cart item, By making RESTfull service call
    * @param {object} item
    * 
    */
    removeProduct(item) {
        logDebug("Regarding 23486 - item Checking Category Name ---------- ::: ",item);
        this.gtmRemoveFromCart(item)
        Utility(Path.removeitem, 'POST', {
            "removalCommerceIds": item.commerceItemId,
            "removalCatalogRefIds": item.sku

        }).then(response => {
            if (response.data && response.data.s == "0") {
                Utility('/tienda/checkoutPromotion?isajax=true&isPackageSelected=' + this.state.isPackageEligible, 'GET').then(response => {
                    this.setState({
                        itemInfo: response.data.mainContent.defaultSinglePackageSelection && response.data.mainContent.isPackageEligible ? ((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.deliveryInfo) || {}) : getItemInfoFromProductGroup((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.itemDetails) || {}),
                        priceInfo: (response.data.mainContent && response.data.mainContent.priceInfo) || {},
                        shippingAddress: (response.data.mainContent && response.data.mainContent.shippingAddress && response.data.mainContent.shippingAddress.shippingAddressDetail) || {},
                        paymentDetail: (response.data.mainContent && response.data.mainContent.paymentDetail) || {},
                        defaultSinglePackageSelection: (response.data.mainContent && response.data.mainContent.defaultSinglePackageSelection),
                        isPackageEligible: (response.data.mainContent && response.data.mainContent.isPackageEligible),
                        allPromotionalData: response.data && response.data.promotionInfo || ''
                    }, () => {
                        if(this.state.itemInfo.length > 0){
                            const staticLabels = this.state.staticLabels || {};
                            if(response.data&&response.data.openPayThresholdWarning){
                                this.show_alert(response.data&&response.data.openPayThresholdWarning);
                                document.querySelector('#submitForOther').disabled = true;
                            }
                            else{
                                this.show_alert(staticLabels['pwa.checkout.eddmodified.label'] || 'La fecha estimada de entrega de tus productos fue actualizada conforme a la dirección y/o número de productos seleccionados.',"warning");
                                document.querySelector('#submitForOther').disabled = false;
                            }
                        }
                        if (this.state.defaultSinglePackageSelection === true && this.state.isPackageEligible === true) {

                        } else if (this.state.itemInfo.length < 1) {
                            Router.push('/tienda/home', '/tienda/home');
                        }
                    })

                });
            } else {
                this.error_scenario(response);
            }
        });
    }


    /**
    * Method will call to update item quantity
    * @function updateItemQuantity
    * @author prinshu.singh@zensar.com
    * @desc Making RESTfull service call to update item quantity given by the user.
    * @param {string} CommerceId
    * @param {string} quantity
    * @param {string} prevQuantity
    * 
    */
    updateItemQuantity = (CommerceId, quantity, prevQuantity) => {
        var obj = { [CommerceId]: quantity };
        var obj1 = {};
        obj1.commerceId = CommerceId || '';
        obj1.quantity = quantity;
        var lastQuantity = prevQuantity;
        if (quantity != lastQuantity) {
        Utility(Path.updateitem, 'POST', obj).then(response => {
            if (quantity < lastQuantity) {
                let updatedQuantity=lastQuantity - quantity
                if (response && response.data) { this.gtmRemoveFromCart(response.data[obj1.commerceId],updatedQuantity) };
            }
            else if (quantity > lastQuantity) {
                                let updatedQuantity=quantity - lastQuantity
                if (response.data && response.data.s == "0") {  this.gtmAddToCartMyBag(response.data[obj1.commerceId],updatedQuantity) };
            }
            if (response.data&&response.data.warning) {
                this.show_alert(response.data.warning,"warning");
            }else{
                const staticLabels = this.state.staticLabels || {};
                if(response.data&&response.data.openPayThresholdWarning){
                     this.show_alert(response.data&&response.data.openPayThresholdWarning);
                     if(document.querySelector('#submitForOther'))
                     document.querySelector('#submitForOther').disabled = true;
                }
                else{
                     this.show_alert(staticLabels['pwa.checkout.eddmodified.label'] || 'La fecha estimada de entrega de tus productos fue actualizada conforme a la dirección y/o número de productos seleccionados.',"warning");
                     if(document.querySelector('#submitForOther'))
                     document.querySelector('#submitForOther').disabled = false;
                }
               
            }
            if (response.data && response.data.s == "0") {
                Utility('/tienda/checkoutPromotion?isajax=true&isPackageSelected=' + this.state.isPackageEligible, 'GET').then(response => {
                    this.setState({
                        itemInfo: response.data.mainContent.defaultSinglePackageSelection && response.data.mainContent.isPackageEligible ? ((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.deliveryInfo) || {}) : getItemInfoFromProductGroup((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.itemDetails) || {}),
                        priceInfo: (response.data.mainContent && response.data.mainContent.priceInfo) || {},
                        shippingAddress: (response.data.mainContent && response.data.mainContent.shippingAddress && response.data.mainContent.shippingAddress.shippingAddressDetail) || {},
                        paymentDetail: (response.data.mainContent && response.data.mainContent.paymentDetail) || {},
                        defaultSinglePackageSelection: (response.data.mainContent && response.data.mainContent.defaultSinglePackageSelection),
                        isPackageEligible: (response.data.mainContent && response.data.mainContent.isPackageEligible),
                        allPromotionalData: response.data && response.data.promotionInfo || ''
                    })

                });
            } else if (response.data && response.data.s == "1") {
                this.show_alert(response.data[0].err);
            } else {
                this.error_scenario(response);
            }
        });
      }
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {      
            // this.show_alert('shippingAddress.guatemalaMessage).toLowerCase()', 'warning', 7000);

        window.scrollTo(0, 0);
        window.swogoDependencies = { getSkus: this.getSkusInfoForSWOGO, getPage: this.getSWOGOPageIdentifier, getOrderId: this.getOrderId };
        const { isMobile } = UserAgentDetails(window);
        this.gtmCheckoutDetail();
        this.globleGTM();
        this.shippingAddressAlert();
        this.setState({
            clickandcollect: window.sessionStorage.getItem('ClickAndCollect'),
            isMobile
        });
        try {
            var $sidebar = document.querySelectorAll("div.row.m-0.mt-3.mt-lg-0 > div.leftPanel .row")[0];
            $sidebar.style.marginTop = 0 + "px";
            // setTimeout(() => {
                var $window = document.body
                var offset = $sidebar.getBoundingClientRect()
                var stop = document.querySelectorAll('.a-checkout__termsAndConditions')[0]
                if (stop && window.location.pathname === "/tienda/checkoutPromotion") {
                    stop = stop.getBoundingClientRect().top
                    window.addEventListener('scroll', (e)=> {

                        if(this.state.alertToTop==='' && window.pageYOffset>70){
                                this.setState({alertToTop: '-toTop'})
                            }else if(this.state.alertToTop!=='' && window.pageYOffset<70){
                                this.setState({alertToTop: ''})
                            } 

                        if (window.pageYOffset > offset.top) {
                            if (((offset.bottom - offset.top) + window.pageYOffset) > stop) {
                                // console.log('stopPropagation')
                            } else {
                                $sidebar.style.marginTop = window.pageYOffset - offset.top + 15 + "px"
                            }
                        } else {
                            $sidebar.style.marginTop = 0 + "px";
                        }
                    });
                }
            // }, 1000)
        }

        catch (error) {
            // console.log(error)
        }

    }

    /**
    * Method will call to make the word camel case.
    * @function camelize
    * @author prinshu.singh@zensar.com
    * @desc Taking a string and converting the first letter of the word to uppercase
    * @param {string} str
    * 
    */
    camelize = (str) => {
        return str ? str[0].toUpperCase() + str.substring(1).toLowerCase() : "";
    }

    /**
    * Method will call to the alert
    * @function shippingAddressAlert
    * @author prinshu.singh@zensar.com
    * @desc Showing shipping address alert for night box or guatemal dynamically.
    * 
    */
    shippingAddressAlert = () => {
        let {shippingAddress} = this.state
        if (this.props.mainContent && this.props.mainContent.msg !== undefined) {              //for night box
            this.show_alert(this.camelize(this.props.mainContent.msg));
        }
        if (shippingAddress && shippingAddress.guatemalaMessage !== undefined)           //for gwatemala
            this.show_alert((shippingAddress.guatemalaMessage).toLowerCase(), 'warning', 7000);
    }

    /**
    * Method will call on calling GTMallPages function with payload.
    * @function globleGTM
    * @author prinshu.singh@zensar.com
    * @desc Creating gtmObjectData payload with current href and document title and login status.
    * 
    */
    globleGTM = () => {
        const gtmObjectData = {
            actURL: window.location.href,
            actPageTitle: document.title
        }
        const data = this.props.cartHeaderResponse || {};
        if (data && data.cartHeaderDetails) {
            gtmObjectData.loginStatus = data.cartHeaderDetails.isLoggedIn ? 'Y' : 'N';
        }
        GTMallPages(gtmObjectData)
    }

    /**
    * Method will call to set datalayer payload.
    * @function gtmCheckoutDetail
    * @author prinshu.singh@zensar.com
    * @desc Pushing datalayer payload dynamically.
    * 
    */
    gtmCheckoutDetail = () => {
        let products = [];
        let {itemInfo} = this.state;

        let getSellerName = window.location.host;
        let sellerNameHardCode = '';
        if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'liverpool';
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteens') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'liverpool';
            }
        }
        // let getSellerNameForAll = ';'
        // if (sellerName) {
        //     getSellerNameForAll = sellerName;
        // } else {
        //     getSellerNameForAll = sellerNameHardCode;
        // }

        if (this.state.defaultSinglePackageSelection && this.state.isPackageEligible) {
            map(itemInfo, (item, key) => {
                var cart = {}
                let size = null;
                if (item.packedList && item.packedList.length > 1) {
                    map(item.packedList, (itemInfo, key) => {
                        cart.name = itemInfo.displayItemName;
                        cart.id =  itemInfo.productId || '';
                        cart.variant = 'N/A';
                        cart.quantity = itemInfo.quantity;
                        cart.price = itemInfo.salePrice&&itemInfo.salePrice.toString();
                        cart.brand = itemInfo.brand || "";
                        cart.category = itemInfo.category || '';
                        size = (itemInfo.clothingSize !== undefined ? itemInfo.clothingSize:   itemInfo.dimensions);
                        (size != null && size !== undefined) ? cart.dimension27 = size : cart.dimension27 = '';
                        itemInfo.clothingColor !== undefined ? cart.dimension28 = itemInfo.clothingColor : cart.dimension28 = '';
                        cart.dimension36 = itemInfo.sellerName && 'Market Place - ' + itemInfo.sellerName || 'Market Place - ' +sellerNameHardCode,
                        cart.dimension40 = itemInfo.sellerSkuId ? itemInfo.sellerSkuId : itemInfo.sku;
                        itemInfo.material !== undefined ? cart.dimension41 = itemInfo.material : cart.dimension41 = '';
                        itemInfo.texture !== undefined ? cart.dimension42 = itemInfo.texture : cart.dimension42 = '';
                        this.state.isPackageEligible ? cart.dimension43 = 'Y' : cart.dimension43 = 'N';
                        itemInfo.listPrice !== undefined ? cart.metric2 = itemInfo.listPrice && itemInfo.listPrice.toString() : cart.metric2 = itemInfo.salePrice && itemInfo.salePrice.toString();
                        itemInfo.salePrice !== undefined && itemInfo.salePrice !== itemInfo.listPrice ? cart.metric3 = itemInfo.salePrice && itemInfo.salePrice.toString() : cart.metric3 = '';
                        products.push(cart);
                    })
                } else if (item.packedList.length == 1 && item.packedList[0][0] == undefined) {
                    map(item.packedList, (itemInfo, key) => {
                        //  cart = {};
                        cart.name = itemInfo.displayItemName;
                        cart.id =  itemInfo.productId || '';
                        cart.variant = 'N/A';
                        cart.quantity = itemInfo.quantity;
                        cart.price = itemInfo.salePrice&&itemInfo.salePrice.toString();
                        cart.brand = itemInfo.brand || "";
                        cart.category = itemInfo.category || '';
                        size = (itemInfo.clothingSize !== undefined ? itemInfo.clothingSize:   itemInfo.dimensions);
                        (size != null && size !== undefined) ? cart.dimension27 = size : cart.dimension27 = '';
                        itemInfo.clothingColor !== undefined ? cart.dimension28 = itemInfo.clothingColor : cart.dimension28 = '';
                        cart.dimension36 = itemInfo.sellerName && 'Market Place - ' + itemInfo.sellerName || 'Market Place - ' +sellerNameHardCode,
                        cart.dimension40 = itemInfo.sellerSkuId ? itemInfo.sellerSkuId : itemInfo.sku;
                        itemInfo.material !== undefined ? cart.dimension41 = itemInfo.material : cart.dimension41 = '';
                        itemInfo.texture !== undefined ? cart.dimension42 = itemInfo.texture : cart.dimension42 = '';
                        this.state.isPackageEligible ? cart.dimension43 = 'Y' : cart.dimension43 = 'N';
                        itemInfo.listPrice !== undefined ? cart.metric2 = itemInfo.listPrice && itemInfo.listPrice.toString() : cart.metric2 = itemInfo.salePrice && itemInfo.salePrice.toString();
                        itemInfo.salePrice !== undefined && itemInfo.salePrice !== itemInfo.listPrice ? cart.metric3 = itemInfo.salePrice && itemInfo.salePrice.toString() : cart.metric3 = '';
                        products.push(cart);
                    })
                } else if (item.packedList.length == 1 && item.packedList[0].isBundle == true) {
                    cart.name = item.packedList[0].displayItemName;
                    cart.id = item.packedList[0].productId;
                    cart.variant = 'N/A';
                    cart.quantity = item.packedList[0].quantity;
                    cart.price = item.packedList[0].salePrice && item.packedList[0].salePrice.toString();
                    cart.brand = item.packedList[0].brand || "";
                    cart.category = item.packedList[0].category;
                    size = (item.packedList[0].clothingSize !== undefined ? item.packedList[0].clothingSize:   item.packedList[0].dimensions);
                    (size != null && size !== undefined) ? cart.dimension27 = size : cart.dimension27 = '';
                    item.packedList[0].clothingColor !== undefined ? cart.dimension28 = item.packedList[0].clothingColor : cart.dimension28 = '';
                    cart.dimension36 = item.packedList[0].sellerName && 'Market Place - ' + item.packedList[0].sellerName || 'Market Place - ' +sellerNameHardCode;
                    item.packedList[0].productId !== undefined ? cart.dimension40 = item.packedList[0].sellerSkuId ? item.packedList[0].sellerSkuId : item.packedList[0].sku : cart.dimension40 = '';
                    item.packedList[0].material !== undefined ? cart.dimension41 = item.packedList[0].material : cart.dimension41 = '';
                    item.packedList[0].texture !== undefined ? cart.dimension42 = item.packedList[0].texture : cart.dimension42 = '';
                    this.state.isPackageEligible ? cart.dimension43 = 'Y' : cart.dimension43 = 'N';
                    item.packedList[0].listPrice !== undefined ? cart.metric2 = item.packedList[0].listPrice && item.packedList[0].listPrice.toString() : cart.metric2 = item.packedList[0].salePrice && item.packedList[0].salePrice.toString();
                    item.packedList[0].salePrice !== undefined && itemInfo.salePrice !== itemInfo.listPrice ? cart.metric3 = item.packedList[0].salePrice && item.packedList[0].salePrice.toString() : cart.metric3 = '';
                    products.push(cart)
                }
            })



        } else {
            map(itemInfo, (itemInfo) => {
                let cart = {};
                let size = null;
                cart.name = itemInfo.displayItemName;
                cart.id = itemInfo.productId;
                cart.variant = 'N/A';
                cart.quantity = itemInfo.quantity;
                cart.price = itemInfo.salePrice && itemInfo.salePrice.toString();
                cart.brand = itemInfo.brand || "";
                cart.category = itemInfo && itemInfo.L1Category || '';
                size = (itemInfo.clothingSize !== undefined ? itemInfo.clothingSize:   itemInfo.dimensions);
                (size != null && size !== undefined)  ? cart.dimension27 = size : cart.dimension27 = '';
                itemInfo.clothingColor !== undefined ? cart.dimension28 = itemInfo.clothingColor : cart.dimension28 = '';
                cart.dimension36 = itemInfo.sellerName && 'Market Place - ' + itemInfo.sellerName || sellerNameHardCode,
                    itemInfo.productId !== undefined ? cart.dimension40 = itemInfo.sellerSkuId ? itemInfo.sellerSkuId : itemInfo.sku : cart.dimension40 = '';
                itemInfo.material !== undefined ? cart.dimension41 = itemInfo.material : cart.dimension41 = '';
                itemInfo.texture !== undefined ? cart.dimension42 = itemInfo.texture : cart.dimension42 = '';
                this.state.isPackageEligible ? cart.dimension43 = 'Y' : cart.dimension43 = 'N';
                itemInfo.listPrice !== undefined ? cart.metric2 = itemInfo.listPrice && itemInfo.listPrice.toString() : cart.metric2 = itemInfo.salePrice&&itemInfo.salePrice.toString();
                itemInfo.salePrice !== undefined && itemInfo.salePrice !== itemInfo.listPrice ? cart.metric3 = itemInfo.salePrice&&itemInfo.salePrice.toString() : cart.metric3 = '';
                products.push(cart);
            })
        }


        try {
            dataLayer.push({
                'ecommerce': {
                    'checkout': {
                        'actionField': {
                            'step': 3
                        },
                        'products': products
                    }
                },
                "event": "Checkout",


            });
        } catch (t) {
        }

    }


    /**
    * Method will send current orderId
    * @function getOrderId
    * @author prinshu.singh@zensar.com
    * @desc Returning current orderId by calling of this function.
    * @return {string} orderId
    * 
    */
    getOrderId = () => {
        return this.props.mainContent.orderId;
    }

    /**
    * Method will return dynamic class based on the device type.
    * @function getSWOGOPageIdentifier
    * @author prinshu.singh@zensar.com
    * @desc Checking current device type and returning string dynamically.
    * @param {string} *
    * 
    */
    getSWOGOPageIdentifier = () => {
        const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
        if (isMobile) {
            return "mobileBasket-0";
        }
        return "basket-0";
    }

    /**
    * Method will return list of items from the packed list
    * @function getSkusInfoForSWOGO
    * @author prinshu.singh@zensar.com
    * @desc Returning all the commerce items from the packed list.
    * @return {object} items
    * 
    */
    getSkusInfoForSWOGO = () => {  // shared the cart all commerce items


        let inventory = true;
        let items = [];
        let currentItem = {};

        this.state.defaultSinglePackageSelection && this.state.isPackageEligible ?
            map(this.state.itemInfo, (item, key) => {
                item.packedList && item.packedList.length > 1 ? (map(item.packedList, (record, key) => {
                    currentItem = {};
                    currentItem["active"] = inventory;
                    currentItem["quantity"] = Number(record['quantity']) || 1;
                    currentItem["productId"] = record['productId'];
                    currentItem["sku"] = record['sku'];
                    currentItem["productType"] = record['ItemType'];
                    currentItem["title"] = record['displayItemName'];
                    currentItem["isSpecialSale"] = "false";
                    currentItem["imageURL"] = record['imageURL'];
                    currentItem["eddZipCode"] = this.state.shippingAddress.postalCode;
                    currentItem["storeNumber"] = this.props.mainContent.storeNumber;
                    let lprice = record['listPrice'] && typeof record['listPrice'] !== 'undefined' ? Number(record['listPrice']) : 0;
                    let sprice = record['salePrice'] && typeof record['salePrice'] !== 'undefined' ? Number(record['salePrice']) : 0;
                    let pprice = record['promoPrice'] && typeof record['promoPrice'] !== 'undefined' ? Number(record['promoPrice']) : 0;
                    currentItem["listPrice"] = lprice;
                    currentItem["salePrice"] = sprice;
                    currentItem["promoPrice"] = pprice;
                    currentItem["price"] = pprice > 0 ? pprice : (sprice > 0 ? sprice : lprice);
                    items.push(currentItem);
                })) :

                    item.packedList.length == 1 && item.packedList[0][0] == undefined ? (map(item.packedList, (record, key) => {
                        currentItem = {};
                        currentItem["active"] = inventory;
                        currentItem["quantity"] = Number(record['quantity']) || 1;
                        currentItem["productId"] = record['productId'];
                        currentItem["sku"] = record['sku'];
                        currentItem["productType"] = record['ItemType'];
                        currentItem["title"] = record['displayItemName'];
                        currentItem["isSpecialSale"] = "false";
                        currentItem["imageURL"] = record['imageURL'];
                        currentItem["eddZipCode"] = this.state.shippingAddress.postalCode;
                        currentItem["storeNumber"] = this.props.mainContent.storeNumber;
                        let lprice = record['listPrice'] && typeof record['listPrice'] !== 'undefined' ? Number(record['listPrice']) : 0;
                        let sprice = record['salePrice'] && typeof record['salePrice'] !== 'undefined' ? Number(record['salePrice']) : 0;
                        let pprice = record['promoPrice'] && typeof record['promoPrice'] !== 'undefined' ? Number(record['promoPrice']) : 0;
                        currentItem["listPrice"] = lprice;
                        currentItem["salePrice"] = sprice;
                        currentItem["promoPrice"] = pprice;
                        currentItem["price"] = pprice > 0 ? pprice : (sprice > 0 ? sprice : lprice);
                        items.push(currentItem);

                    })) :

                        (item.packedList.length == 1 && item.packedList[0].isBundle == true) ? (

                            currentItem = {},
                            currentItem["active"] = inventory,
                            currentItem["quantity"] = Number(item.packedList[0]['quantity']) || 1,
                            currentItem["productId"] = item.packedList[0]['productId'],
                            currentItem["sku"] = item.packedList[0]['sku'],
                            currentItem["productType"] = item.packedList[0]['ItemType'],
                            currentItem["title"] = item.packedList[0]['displayItemName'],
                            currentItem["isSpecialSale"] = "false",
                            currentItem["imageURL"] = item.packedList[0]['imageURL'],
                            currentItem["eddZipCode"] = this.state.shippingAddress.postalCode,
                            currentItem["storeNumber"] = this.props.mainContent.storeNumber,
                            currentItem["listPrice"] = item.packedList[0]['listPrice'] && typeof item.packedList[0]['listPrice'] !== 'undefined' ? Number(item.packedList[0]['listPrice']) : 0,
                            currentItem["salePrice"] = item.packedList[0]['salePrice'] && typeof item.packedList[0]['salePrice'] !== 'undefined' ? Number(item.packedList[0]['salePrice']) : 0,
                            currentItem["promoPrice"] = item.packedList[0]['promoPrice'] && typeof item.packedList[0]['promoPrice'] !== 'undefined' ? Number(item.packedList[0]['promoPrice']) : 0,
                            currentItem["price"] = pprice > 0 ? pprice : (sprice > 0 ? sprice : lprice),
                            items.push(currentItem)

                        )
                            : null


            }) :
            this.state.itemInfo.map((record) => {
                currentItem = {};
                currentItem["active"] = inventory;
                currentItem["quantity"] = Number(record['quantity']) || 1;
                currentItem["productId"] = record['productId'];
                currentItem["sku"] = record['sku'];
                currentItem["productType"] = record['ItemType'];
                currentItem["title"] = record['displayItemName'];
                currentItem["isSpecialSale"] = "false";
                currentItem["imageURL"] = record['imageURL'];
                currentItem["eddZipCode"] = this.state.shippingAddress.postalCode;
                currentItem["storeNumber"] = this.props.mainContent.storeNumber;
                let lprice = record['listPrice'] && typeof record['listPrice'] !== 'undefined' ? Number(record['listPrice']) : 0;
                let sprice = record['salePrice'] && typeof record['salePrice'] !== 'undefined' ? Number(record['salePrice']) : 0;
                let pprice = record['promoPrice'] && typeof record['promoPrice'] !== 'undefined' ? Number(record['promoPrice']) : 0;
                currentItem["listPrice"] = lprice;
                currentItem["salePrice"] = sprice;
                currentItem["promoPrice"] = pprice;
                currentItem["price"] = pprice > 0 ? pprice : (sprice > 0 ? sprice : lprice);
                items.push(currentItem);


            })


        return items


    }

    /**
    * Method will call on select modal quantity
    * @function onSelectModalQty
    * @author prinshu.singh@zensar.com
    * @desc Making RESTfull service call to update promotion based on the quantity.
    * @param {string} qty
    * @param {string} commerceItemId
    * 
    */
    onSelectModalQty = (qty, commerceItemId) => {
        let paylod = {
            [`promoCode_${commerceItemId}`]: qty.promotionItemId,
            "commerceItemId": commerceItemId
        }
        Utility(Path.updatepromotion, 'POST', paylod).then(response => {
            if (response.data && response.data.promotionDetails.s == "0") {
                Utility('/tienda/checkoutPromotion?isajax=true&isPackageSelected=' + this.state.isPackageEligible, 'GET').then(response => {
                    this.setState({
                        itemInfo: (response.data.mainContent && response.data.mainContent.defaultSinglePackageSelection) && response.data.mainContent.isPackageEligible ? ((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.deliveryInfo) || {}) : getItemInfoFromProductGroup((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.itemDetails) || {}),
                        priceInfo: (response.data.mainContent && response.data.mainContent.priceInfo) || {},
                        shippingAddress: (response.data.mainContent && response.data.mainContent.shippingAddress && response.data.mainContent.shippingAddress.shippingAddressDetail) || {},
                        paymentDetail: (response.data.mainContent && response.data.mainContent.paymentDetail) || {},
                        defaultSinglePackageSelection: (response.data.mainContent && response.data.mainContent.defaultSinglePackageSelection),
                        isPackageEligible: (response.data.mainContent && response.data.mainContent.isPackageEligible),
                        allPromotionalData: response.data && response.data.promotionInfo || ''
                    })
                });
            } else {
                this.error_scenario(response);
            }
        })
    }

    /**
    * Method will call on clicks continue button.
    * @function finalSubmit
    * @author prinshu.singh@zensar.com
    * @desc Making RESTful service call commit order method decider with given status of package applied.
    * @param {boolean} val
    * 
    */
    finalSubmit(val) {
        let paylod = {
            "isPackageApplied": val
        }
        document.getElementById("submitForOther").disabled = true;
        Utility(Path.commitOrderMethodDecider, 'POST', paylod).then(response => {
            if (response && response.data && response.data.redirectTo3Dsecure === 'true') {
                let DSParams = response.data['3DSParams'];
                this.setState({ DSParams }, () => {
                    document.getElementById("lp3DSecureForm").submit();
                })
            } else {
                if (response && response.data && response.data.s === '0') {
                    // Router.push('/tienda/checkoutOrderConfirmation', '/tienda/checkoutOrderConfirmation');
                    window.location.href = '/tienda/checkoutOrderConfirmation'; 
                } else if (response && response.data && response.data.s === '1') {
                    document.getElementById("submitForOther").disabled = false;
                    this.show_alert(response.data.err)
                } else if(response && !response.data){
                   Router.push('/tienda/cart','/tienda/cart');
                }else{
                    document.getElementById("submitForOther").disabled = false;
                    this.error_scenario(response);
                }
            }

        })
    }

    /**
    * Method will call on clicks of continue while payment type is paypal.
    * @function finalSubmitForPaypal
    * @author prinshu.singh@zensar.com
    * @desc Making a RESTful service call to get token id for paypal.
    * 
    */
    finalSubmitForPaypal() {
        let paylod = {
            "isPackageApplied": this.state.isPackageEligible
        }
        document.getElementById("submitForPaypal").disabled = true;
        Utility(Path.gettokenidforpaypal, 'POST', paylod).then(response => {
            if (response.data.s === "0") {
                window.location.href = response.data.PAYPAL_LOGIN_URL + '&token=' + response.data.token
            } else if (response.data.s == "1") {
                document.getElementById("submitForPaypal").disabled = false;

                this.show_alert(response.data.err)

            } else {
                this.error_scenario(response);
            }

        })

    }

    /**
    * Method will call to get package selected status response.
    * @function ChangeIsPackageEligible
    * @author prinshu.singh@zensar.com
    * @desc Making a RESTfull service call to get package selected status response.
    * @param {boolean} val
    * 
    */
    ChangeIsPackageEligible(val) {
        Utility('/tienda/checkoutPromotion?isajax=true&isPackageSelected=' + !val, 'GET').then(response => {
            this.setState({
                itemInfo: !val ? ((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.deliveryInfo) || {}) : getItemInfoFromProductGroup((response.data.mainContent && response.data.mainContent.itemInfo && response.data.mainContent.itemInfo.itemDetails) || {}),
                priceInfo: (response.data.mainContent && response.data.mainContent.priceInfo) || {},
                shippingAddress: (response.data.mainContent && response.data.mainContent.shippingAddress && response.data.mainContent.shippingAddress.shippingAddressDetail) || {},
                paymentDetail: (response.data.mainContent && response.data.mainContent.paymentDetail) || {},
                //  defaultSinglePackageSelection: (response.data.mainContent && response.data.mainContent.defaultSinglePackageSelection),
                allPromotionalData: response.data && response.data.promotionInfo || '',
                defaultSinglePackageSelection: !val,
            })
        });

    }

    /**
    * Method will call on click on item promotion.
    * @function promotionClick
    * @author prinshu.singh@zensar.com
    * @desc Creating all the promotion data and updating the state value.
    * @param {string} skuId
    * @param {string} commerceItemId
    * 
    */
    promotionClick = (skuId, commerceItemId) => {
        let PromotionalData = []
        let length = Object.keys(this.state.allPromotionalData).length
        let value = this.state.allPromotionalData
        for (let i = 0; i < length - 1; i++) {
            if (value[i].catalogRefId == skuId) {
                PromotionalData.push(value[i])
            }
        }
        this.setState({
            PromotionalData: PromotionalData,
            commerceItemId: commerceItemId
        })

    }

    /**
    * Method will call on click of item options.
    * @function isShowMotionFun
    * @author prinshu.singh@zensar.com
    * @desc Dynamically opening and closing hamburger menu of item when clicks on three dots.
    * @param {number} itemIndex
    * @param {number} index
    * 
    */
    isShowMotionFun = (itemIndex, index) => {      
        if (this.state.defaultSinglePackageSelection === true && this.state.isPackageEligible === true) {
            let { itemInfo } = this.state;
            document.removeEventListener('click', this.handleOutsideClick, false);
            document.removeEventListener('touchend', this.listenTouch, false);
            this.setState(prevState => {
                if (itemInfo[itemIndex] && itemInfo[itemIndex].packedList && itemInfo[itemIndex].packedList[index]) {
                    itemInfo[itemIndex].packedList[index].isShowMotion = (prevState.itemInfo && prevState.itemInfo[itemIndex] && prevState.itemInfo[itemIndex].packedList && prevState.itemInfo[itemIndex].packedList[index]) ? !prevState.itemInfo[itemIndex].packedList[index].isShowMotion : true;
                    for (var i in itemInfo) {
                        for (var j in itemInfo[i].packedList) {
                            if (!(itemIndex === parseInt(i) && index === parseInt(j))) {
                                itemInfo[i].packedList[j].isShowMotion = false
                            }
                        }
                    }
                }
                return { itemInfo }
            }, () => {
                if (itemInfo[itemIndex] && itemInfo[itemIndex].packedList && itemInfo[itemIndex].packedList[index] && itemInfo[itemIndex].packedList[index].isShowMotion) {
                    document.addEventListener('click', this.handleOutsideClick, false);
                    document.addEventListener('touchend', this.listenTouch, false);
                }
            })
        } else {
            let { itemInfo } = this.state;
            document.removeEventListener('click', this.handleOutsideClick, false);
            document.removeEventListener('touchend', this.listenTouch, false);
            this.setState(prevState => {
                if (itemInfo[itemIndex]) {
                    itemInfo[itemIndex].isShowMotion = (prevState.itemInfo && prevState.itemInfo[itemIndex]) ? !prevState.itemInfo[itemIndex].isShowMotion : true;
                    for (var i in itemInfo) {
                        if (!(itemIndex === parseInt(i))) {
                            itemInfo[i].isShowMotion = false
                        }
                    }
                }
                return { itemInfo }
            }, () => {
                if (itemInfo[itemIndex] && itemInfo[itemIndex] && itemInfo[itemIndex].isShowMotion) {
                    document.addEventListener('click', this.handleOutsideClick, false);
                    document.addEventListener('touchend', this.listenTouch, false);
                }
            })
        }
    }

    /**
    * Method will call on click on outside when hamburger open.
    * @function handleOutsideClick
    * @author prinshu.singh@zensar.com
    * @desc Calling a function to close the hambuger menus which is open.
    * @param {object} e
    * @param {boolean} status
    */
    handleOutsideClick = (e, status) => {
        this.clearAllAddressOptions();
    }

    /**
    * Method will call on touch on outside when hamburger open.
    * @function listenTouch
    * @author prinshu.singh@zensar.com
    * @desc Calling a function to close the hambuger menus which is open.
    */
    listenTouch = () => {
        this.clearAllAddressOptions();        
    }

    /**
    * Method will call to clear all the hamburger menus.
    * @function clearAllAddressOptions
    * @author prinshu.singh@zensar.com
    * @desc Closing all the hamburger menus.
    * 
    */
    clearAllAddressOptions = () => {
        document.removeEventListener('click', this.handleOutsideClick, false);
        document.removeEventListener('touchend', this.listenTouch, false);
        let { itemInfo } = this.state;
        for (var i in itemInfo) {
            itemInfo[i].isShowMotion = false
            for (var j in itemInfo[i].packedList) {
                itemInfo[i].packedList[j].isShowMotion = false
            }
            itemInfo[i].isShowMotion = false
        }
        this.setState({ itemInfo });
    }


    /**
     * REACT life cycle Event. Method will call on component removes from the DOM.
     * @event componentWillUnmount 
     * 
     */
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
        document.removeEventListener('touchend', this.listenTouch, false);
    }

    /**
    * Method will call to close the alert
    * @function dismiss_alert
    * @author prinshu.singh@zensar.com
    * @desc Updating alert status of state value to close the alert.
    * 
    */
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    /**
    * Method will call to show the alert.
    * @function show_alert
    * @author prinshu.singh@zensar.com
    * @desc Showing alert dynamically based on the alert type.
    * @param {string} alert_message
    * @param {string} alert_Type
    * 
    */
    show_alert = (alert_message, alert_Type = "alert") => {

           let iconType='a-alert__icon icon-error'

        if(alert_Type == "warning"){
            iconType='a-alert__icon icon-warning'
        }else if(alert_Type == "success"){
            iconType='a-alert__icon icon-done' 
        }

        

        this.setState({ alert_status: true, alert_message, alert_Type ,iconType});
        if(alert_Type == "success"){
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 5000)
        }
    }

    /**
    * Method will call to remove gtm from the cart.
    * @function gtmRemoveFromCart
    * @author prinshu.singh@zensar.com
    * @desc removing gtm from the cart.
    * @param {object} data
    * @param {string} updatedQuantity
    * 
    */
    gtmRemoveFromCart = (data,updatedQuantity) => {
        const { listPriceWithDiscount,associatedGiftItems,itemDisplayName,displayItemName, productId, listPrice, salePrice, brand, categoryId,category, parentSkuId, sellerSkuId, catalogRefId, subcategory, clothingColor, promoPrice, quantity, clothingSize, texture, dimension8, material, sellerName, categoryName, sku,dimensions, L1Category} = data || ''
        let price =listPriceWithDiscount?listPriceWithDiscount:salePrice?salePrice:listPrice;
        let getSellerName = window.location.host;
        let dimension40 = parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : sku ? sku : (catalogRefId ? catalogRefId : productId)) ? parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : sku ? sku : (catalogRefId ? catalogRefId : productId)) : '';
        if(associatedGiftItems){
            dimension40 += ','+ associatedGiftItems[0]
        }
        let sellerNameHardCode = '';
        if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'liverpool';
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteens') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'liverpool';
            }
        }
        let getSellerNameForAll = ';'
        if (sellerName) {
            getSellerNameForAll = sellerName;
        } else {
            getSellerNameForAll = sellerNameHardCode;
        }
        dataLayer.push({

            'event': 'removeFromCart',
            'ecommerce': {
                'remove': {
                    'products': [{
                        'name': itemDisplayName ? itemDisplayName : displayItemName?displayItemName: "",
                        'id':  productId ? productId : '', //CD 40
                        'category': L1Category ? L1Category : (categoryName ? categoryName :(category?category: "")),
                        'variant': "N/A",
                        'price': price?price.toString():'',
                        'brand': brand ? brand : "",
                        'quantity': updatedQuantity ? updatedQuantity.toString() :quantity?quantity.toString():'' ,
                        //'dimension8': dimension8 ? dimension8 : "",
                        'dimension27': (clothingSize ? clothingSize : (dimensions ? dimensions : '')),
                        'dimension28': clothingColor ? clothingColor:'',
                        'dimension36': sellerName ? 'Market Place-' + sellerName: getSellerNameForAll?getSellerNameForAll : '',
                        'dimension40': dimension40?dimension40 : '',
                        'dimension41': material ? material : '', //CD 41 If doesn`t apply, the value must be  empty â€œâ€
                        'dimension42': texture ? texture : '', //CD 42 If doesn`t apply, the value must be empty  â€œâ€
                        'dimension43': 'N',
                        'metric2': listPrice ? listPrice.toString() : '', //M2
                        'metric3':  promoPrice ? promoPrice&&promoPrice.toString() :listPrice!=listPriceWithDiscount?listPriceWithDiscount!== undefined?listPriceWithDiscount.toString():'': '' //M3
                    }]
                }
            }
        });
    }

    /**
    * Method will call to add gtm to the cart.
    * @function gtmAddToCartMyBag
    * @author prinshu.singh@zensar.com
    * @desc adding gtm to the cart.
    * @param {object} cartItemData
    * @param {string} updatedQuantity
    * 
    */
    gtmAddToCartMyBag = (cartItemData,updatedQuantity) => {
        const { listPriceWithDiscount,associatedGiftItems,itemDisplayName,displayItemName, listPrice, promoPrice, clothingSize, texture, productId, material,category, catalogRefId, parentSkuId, sellerSkuId, salePrice, brand, categoryId, subcategory, clothingColor, quantity, sellerName, categoryName, sku,dimensions} = cartItemData || ''
        let getSellerName = window.location.host;
        let sellerNameHardCode = '';
        let price =listPriceWithDiscount?listPriceWithDiscount:salePrice?salePrice:listPrice;
        let dimension40 = parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : (catalogRefId ? catalogRefId : productId)) ? parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : (catalogRefId ? catalogRefId : productId)) : '';
        if(associatedGiftItems){
            dimension40 += ','+ associatedGiftItems[0]
        }
        if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'liverpool';
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteens') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'liverpool';
            }
        }
        let getSellerNameForAll = ';'
        if (sellerName) {
            getSellerNameForAll = sellerName;
        } else {
            getSellerNameForAll = sellerNameHardCode;
        }
        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'add': {
                    'products': [{
                        'name': itemDisplayName ? itemDisplayName : displayItemName?displayItemName:'',
                        'id':  productId ? productId : '', //CD 40
                        'category': categoryName ? categoryName :category?category: '',
                        'variant': 'N/A',
                        'price': price?price.toString():'',
                        'brand': brand ? brand : '',
                        'quantity': updatedQuantity.toString() ? updatedQuantity.toString() : '',
                        'dimension27': (clothingSize ? clothingSize : (dimensions ? dimensions : '')), //CD 27 If doesn`t apply, the value must be empty â€œâ€
                        //   'dimension27':  || '',
                        'dimension28': clothingColor ? clothingColor : '',
                        // 'dimension28': dataAvailable['sku.color'] && dataAvailable['sku.color'][0] || '', //CD 27 If doesn`t apply, the value must be empty  â€œâ€
                        'dimension36': sellerName ? 'Market Place-' + sellerName: getSellerNameForAll?getSellerNameForAll : '', //CD 36
                        'dimension40':dimension40?dimension40 : '', //Generic SKU
                        'dimension41': material ? material : '', //CD 41 If doesn`t apply, the value must be  empty â€œâ€
                        'dimension42': texture ? texture : '', //CD 42 If doesn`t apply, the value must be empty  â€œâ€
                        'dimension43': 'N',
                        'metric2': listPrice ? listPrice.toString() : '', //M2
                        'metric3':  promoPrice ? promoPrice&&promoPrice.toString() :listPrice!=listPriceWithDiscount?listPriceWithDiscount !== undefined?listPriceWithDiscount.toString(): '':'' //M3
                    }]
                }
            }
        });

    }
    //   handleScrollAlert = () => {
    //     try {
    //         if (window.scrollY >= 117) {
    //             this.setState({ alertToTop: '-toTop' });
    //         }
    //         else {
    //             this.setState({ alertToTop: '' });
    //         }
    //     } catch (e) { }
    // }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
        let {itemInfo, priceInfo, shippingAddress, paymentDetail, defaultSinglePackageSelection, isPackageEligible, PromotionalData, commerceItemId, DSParams, objectres, staticLabels, alert_message, alert_status, alert_Type,  clickandcollect, EDDErrorMessages, isMobile,alertToTop} = this.state;
        

        const qtyModalInfo = {
            onSelectModalQty: this.onSelectModalQty
        };
        // let alert = {
        //     type: '-alert',
        //     text: 'Este es un mensaje de alerta',
        //     class: 'a-alert__text',
        //     iconType: 'a-alert__icon icon-error'
        // }
        // let warning = {
        //     type: '-warning',
        //     text: 'Este es un mensaje de warning',
        //     class: 'a-alert__text',
        //     iconType: 'a-alert__icon icon-warning'
        // }
        // let success = {
        //     type: '-success',
        //     text: 'Se ha copiado el link del artÃ­culo',
        //     class: 'a-alert__text',
        //     iconType: 'a-alert__icon icon-done'
        // }
        const swogoScript = this.props.mainContent.swogoEndPoint || '';
        const fingerPrintEndPoint = this.props.mainContent.fingerPrintEndPoint || '';
        const orgId = this.props.mainContent.orgId || '';
        const FPSessionId = this.props.mainContent.FPSessionId || '';

        return (
            <React.Fragment>
                <script async="" type="text/javascript" src={swogoScript}></script>

                <p Style={"background:url(" + fingerPrintEndPoint+"/clear.png?org_id="+orgId+"&session_id="+FPSessionId+"&m=1);display:none"} ></p>
                <img src={fingerPrintEndPoint+"/clear.png?org_id="+orgId+"&session_id="+FPSessionId+"&m=2"} alt="" />
                <script src={fingerPrintEndPoint+"/check.js?org_id="+orgId +"&session_id="+FPSessionId} type="text/javascript"></script>
                <object type="application/x-shockwave-flash" data={fingerPrintEndPoint + ".swf?org_id="+orgId+"&session_id="+FPSessionId} width="1" height="1" id="thm_fp">
                    <param name="movie" value={fingerPrintEndPoint+".swf?org_id="+orgId+"&session_id="+FPSessionId} />
                </object>

                {/*<EventListener target="window" onScroll={this.handleScrollAlert} />*/}
                <Alert {...this.props}
                    alertTopClass={ `m-alert__container mdc-snackbar -alertContainer  -step1 ${alertToTop}  -${alert_Type}`}
                    iconType={this.state.iconType}
                    text={alert_message}
                    alert_status={alert_status}
                    dismiss_alert={this.dismiss_alert}
                    airTimeStyle={ isMobile ? "98px" : "68px"} /> 
                                                    
                {/*<div>
                </div>*/}
                <main>
                    <CheckoutStepThree
                        isShowMotionFun={this.isShowMotionFun}
                        itemInfo={itemInfo}
                        priceInfo={priceInfo}
                        shippingAddress={shippingAddress}
                        removeProduct={this.removeProduct}
                        updateItemQuantity={this.updateItemQuantity}
                        paymentDetail={paymentDetail}
                        qtyModalInfo={qtyModalInfo}
                        finalSubmit={this.finalSubmit}
                        finalSubmitForPaypal={this.finalSubmitForPaypal}
                        defaultSinglePackageSelection={defaultSinglePackageSelection}
                        ChangeIsPackageEligible={this.ChangeIsPackageEligible}
                        isPackageEligible={this.state.isPackageEligible}
                        promotionClick={this.promotionClick}
                        PromotionalData={PromotionalData}
                        commerceItemId={commerceItemId}
                        onChangeQty={this.onChangeQty}
                        updateItemQuantityMore={this.updateItemQuantityMore}
                        objectres={objectres}
                        staticLabels={staticLabels}
                        clickandcollect={clickandcollect}
                        EDDErrorMessages={EDDErrorMessages}
                        isMobile={isMobile}
                        configurationData={this.props.configurationData} // defect 23300
                    />
                </main>
                <form name="lp3DSecureForm" action={DSParams.Ds_3DSecureService_URL} id="lp3DSecureForm" method="POST">
                    <input type="hidden" name="Ds_Merchant_Amount" value={DSParams.Ds_Merchant_Amount} />
                    <input type="hidden" name="Ds_Merchant_Currency" value={DSParams.Ds_Merchant_Currency} />
                    <input type="hidden" name="Ds_Merchant_ProductDescription" value={DSParams.Ds_Merchant_ProductDescription} />
                    <input type="hidden" name="Ds_Merchant_MerchantCode" value={DSParams.DS_MERCHANT_MERCHANTCODE} />
                    <input type="hidden" name="Ds_Merchant_MerchantName" value={DSParams.Ds_Merchant_MerchantName} />
                    <input type="hidden" name="Ds_Merchant_Terminal" value={DSParams.Ds_Merchant_Terminal} />
                    <input type="hidden" name="Ds_Merchant_TransactionType" value={DSParams.Ds_Merchant_TransactionType} />
                    <input type="hidden" name="Ds_Promo_Parcializacion" value={DSParams.Ds_Promo_Parcializacion} />
                    <input type="hidden" name="Ds_Promo_TipoPlan" value={DSParams.Ds_Promo_TipoPlan} />
                    <input type="hidden" name="Ds_CompraConPuntos" value={DSParams.Ds_CompraConPuntos} />
                    <input type="hidden" name="Ds_Merchant_Order" value={DSParams.Ds_Merchant_Order} />
                    <input type="hidden" name="Ds_Merchant_MerchantURL" value={DSParams.Ds_Merchant_MerchantURL} />
                    <input type="hidden" name="Ds_Merchant_UrlOK" value={DSParams.Ds_Merchant_UrlOK + DSParams.Ds_Encrypted_Merchant_Order} />
                    <input type="hidden" name="Ds_Merchant_UrlKO" value={DSParams.Ds_Merchant_UrlOK + DSParams.Ds_Encrypted_Merchant_Order} />
                    <input type="hidden" name="Ds_Merchant_MerchantSignature" value={DSParams.Ds_Merchant_MerchantSignature} />
                    <input type="hidden" name="Ds_Merchant_Pan" value={DSParams.Ds_Merchant_Pan} />
                    <input type="hidden" name="Ds_Merchant_ExpiryDate" value={DSParams.Ds_Merchant_ExpiryDate} />
                    <input type="hidden" name="Ds_Merchant_SecurityCode" value={DSParams.Ds_Merchant_SecurityCode} />

                </form>
            </React.Fragment>
        );
    }
}

const getItemInfoFromProductGroup = (props) => {
    let allProducts = []
    for (let i = 0; i < props.length; i++) {
        let sippingGroup = Object.keys(props[i])
        let ItemType = Object.values(props[i])[0].ItemType
        let products = Object.values(props[i])[0].CommerceItems
        let eventNbr = Object.values(props[i])[0].eventNbr
        map(products, (item, key) => {
            item['ItemType'] = ItemType
            item['eventNbr'] = eventNbr
            item['sippingGroup'] = sippingGroup[0]
            allProducts.push(item)
        })
    }
    return allProducts
}


// const getGiftRegistryData = (props) => {
//     let giftRegistryData = {};
//     giftRegistryData.isOnlyGrItem = false;
//     for (let i = 0; i < props.length; i++) {
//         giftRegistryData.eventNumber = Object.values(props[i])[0].eventNbr || '';
//         if (Object.values(props[i])[0].shoppingType === "Gift Registry") {
//             giftRegistryData.isOnlyGrItem = true;
//         }
//     }
//     return giftRegistryData
// }


