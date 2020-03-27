/**
* Module Name : CommonShippingPage
* Functionality : Component used to show the store, home delivery and summery products components This is get called from \client\components\templates\CheckoutShippingPage.js
* @exports : CommonShippingPage
* @requires : module:React
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/molecules/MaterialInputRadio/MaterialInputRadio
* @requires : module:/molecules/MenuMotion/molecule-menu-motion
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/HrTag/HrTag
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/GuestUserPersonalDetailsForm
* @requires : module:/SummeryMyProducts
* @requires : module:/PickUpInStore
* @requires : module:/HomeDelivery'
* @requires : module:/ShippingAddressForm
* @requires : module:/AddNewShippingAddress
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:/helpers/utilities/Validate
* @requires : module:/molecules/TermsAndConditions/Common_Terms_And_Conditions
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* @requires : module:/molecules/Alert/Alert
* @requires : module:/molecules/Modals/RemoveAddressAlertModal
* @requires : module:/helpers/modal/modal
* @requires : module:lodash/isEmpty
* Team : Checkout Team
* Other information : Based on the login status showing dynamic forms.
* 
*/
import Router from 'next/router';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
// import TermsAndConditions from '../../molecules/TermsAndConditions/TermsAndConditions';
import { Menumotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import Button from '../../atoms/Button/Button';
import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import HrTag from '../../atoms/HrTag/HrTag';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import GuestUserPersonalDetailsForm from './GuestUserPersonalDetailsForm';
import SummeryMyProducts from './SummeryMyProducts';
import PickUpInStore from './PickUpInStore';
import HomeDelivery from './HomeDelivery';
import ShippingAddressForm from './ShippingAddressForm';
import AddNewShippingAddress from './AddNewShippingAddress';
import { Utility, GTMallPages, UserAgentDetails, logError, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { Validate } from '../../../helpers/utilities/Validate';
import TermsAndConditions from '../../molecules/TermsAndConditions/Common_Terms_And_Conditions'
import { ParagraphWithBlockNew } from '../../molecules/MixinMolecules/MixinMolecules';
import Alert from "../../molecules/Alert/Alert";
import RemoveAddressAlertModal from '../../molecules/Modals/RemoveAddressAlertModal';
import Modal from '../../../helpers/modal/modal';
import isEmpty from 'lodash/isEmpty';

/**
* @class CommonShippingPage
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class CommonShippingPage extends React.Component {
    /**
     * constructor
     * @author dondapati.kumar@zensar.com
     * @desc receiving prop values from the parent module. And adding state values.
     * @param {object} props
     * 
     */
    constructor(props) {
        
        super(props);
        const loginStatus = (props.cartHeaderResponse && props.cartHeaderResponse.cartHeaderDetails && props.cartHeaderResponse.cartHeaderDetails.isLoggedIn) || false;
        // const statesInfo = props.collectInStoreData ? getStateArray(props.collectInStoreData.statesInfo) : [];
        this.state = {
            isMobile: true,
            loggedInUser: loginStatus,
            addressform_visibility: false,
            deliveryTypeSelection: {
                pickUpInStore: false,
                homeDelivery: loginStatus
            },
            deliverySelectionPayLoad: {},
            states: [],
            checkoutItemsDetail: {},
            editAddress: {},
            storeEventDetails: this.props.shipping_address_events_items && this.props.shipping_address_events_items.events,
            alert_status: false,
            alert_message: '',
            alert_Type: 'alert',
            user: {
                firstName: '',
                lastName: '',
                mothersLastName: '',
                email: '',
                phone: '',
                LADA: ''
            },
            focused: {

            },
            errors: {

            },
            labels: props.labels,
            pickup_userSelection: {},
            homeDelivery_userSelection: {},
            previousSelection: {},
            manualClick: true,
            addressRecords: [],
            cartHaveOnlyDigitalItems: false,
            cartHaveOnlyGRItems: false,
            cartHaveGRItem: true,
            cartHaveNormalItem: true,
            cartHaveAtLeasetOneDigitalItem: false,
            defaultShippingAddressId: "",
            editButtonVisibility: false,
            deleteAddressIndex: '',
            cartHave: {},
            removeAddressAlertModal: false,
            address_records: {
                addresses : this.props.shipping_address_events_items && this.props.shipping_address_events_items.address
            },
            disableButtonFields: false,
            guest_hide_telephone_lada: false,
            carryAddress: {},
            toTop: '',
            GuatemalaEnableFlag: this.props.GuatemalaEnableFlag,
            CncDriveEnableFlag: this.props.CncDriveEnableFlag,
            enableclickandcollect: this.props.enableclickandcollect,
            pdpSelection: {},
            enableEditAddress: this.props.enableEditAddress
        };
        this.alertTimeoutSession = '';
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        const e = document.getElementById("nds-chat-launcher-container");
        // logError("IMPORTANT LOG : Regarding Chatbox issue : ________________ ",e);
        if (e) {
            e.style.display = 'none';
        }
        if (Object.keys(this.props.cartHeaderResponse).length === 0) {
            this.getCartHeaderDetails();
        }
        //SWOGO disable
        if (window && window.swogoDependencies) {
            window.swogoDependencies = null;
        }
        let pdpSelection = {}
        try{
            if(Object.keys(Router.router.components).indexOf('/tienda/checkoutBilling') === -1 && Object.keys(Router.router.components).indexOf('/tienda/checkoutPromotion') === -1){
                const EddAddressCookie = GetCookie("EddAddressCookie");
                var a = EddAddressCookie.split('|');
                a.map(str=>{
                    if(str && str.length>1){
                        str = str.split(":");
                        pdpSelection[str[0]] = str[1];
                    }
                })
            }
        }catch(error){
            
        }
        let { deliveryTypeSelection } = this.state;
        if(pdpSelection && pdpSelection.deliveryMethod === "store"){
            deliveryTypeSelection = {
                pickUpInStore: true,
                homeDelivery: false
            }
        }
        const { isMobile } = UserAgentDetails(window);
        
        window.scrollTo(0, 0);
        this.set_GTMallPages();
        this.collectinstore();
        if(!this.state.storeEventDetails){
            this.getshiptostoreeventdetails();
        }
        this.setState({ docwindow: window, isMobile, pdpSelection, deliveryTypeSelection },()=>{
            if(this.props.shipping_address_events_items && this.props.shipping_address_events_items.items){
                this.handle_checkoutItemsDetail_data(this.props.shipping_address_events_items.items);
            }else{
            this.getCheckoutItemsDetail(); 
            }
        });

        // try {
        //     var $sidebar = document.querySelectorAll(".col-lg-4.col-12.order-2  .m-box.mb-4.shipping-sticky")[0];
        //     var $window = document.body
        //     var offset = $sidebar.getBoundingClientRect()
        //     document.addEventListener('scroll', (e)=>this.handleDocumentScroll(e,$sidebar,offset), false);
        // }
        // catch(error){
        //     // logError(error)
        // }
        document.addEventListener('scroll',this.handleDocumentScroll, false);

        const getConfigurationInfo = this.props.configurationData;
        const labelData = this.props.labelData;
        let labels = {};
        if(labelData && labelData.staticLabelValues){
            for(var i in labelData.staticLabelValues){
                if(labelData.staticLabelValues[i].pageName==="pwa-shippingPage"){
                    labels = labelData.staticLabelValues[i].keyValues;
                }
            }
            this.setState({labels});
        }
        let guatemalaFlag = true;
        let cncDriveFlag = true;
        let cncFlag = true;
        if(getConfigurationInfo && getConfigurationInfo.configuration && getConfigurationInfo.configuration.flagConfiguration){
            const flag = getConfigurationInfo.configuration.flagConfiguration['enableGuatemala'];
            guatemalaFlag= (flag && (flag.indexOf("false") >-1 || flag ==='false' )?false:true );
            const cflag = getConfigurationInfo.configuration.flagConfiguration['enableCnCDriveThru'];
            cncDriveFlag= (cflag && (cflag.indexOf("false") >-1 || cflag ==='false' )?false:true );
            const ccflag = getConfigurationInfo.configuration.flagConfiguration['enableclickandcollect'];
            cncFlag= (ccflag && (ccflag.indexOf("false") >-1 || ccflag ==='false' )?false:true );
            const editAddrEnable = getConfigurationInfo.configuration.flagConfiguration['enableEditAddress'];
            const enableEditAdd = (editAddrEnable && (editAddrEnable.indexOf("false") >-1 || editAddrEnable ==='false' )?false:true );
            this.setState({
                GuatemalaEnableFlag: guatemalaFlag,
                CncDriveEnableFlag:cncDriveFlag,
                enableclickandcollect: cncFlag,
                enableEditAddress: enableEditAdd
            })
        }
    }

    /**
    * Method will call on document scroll
    * @function handleDocumentScroll
    * @author dondapati.kumar@zensar.com
    * @desc Dynamicall adding toTop class to stick alert panel at the top of the page on document scroll
    * 
    */
    handleDocumentScroll = () => {
        const { toTop } = this.state;
        if (toTop === '' && window.pageYOffset > 70) {
            this.setState({ toTop: '-toTop' })
        } else if (toTop !== '' && window.pageYOffset < 70) {
            this.setState({ toTop: '' })
        }
    }

    // handleDocumentScroll = (e, $sidebar, offset) => {
    //     // var termsElm = document.querySelectorAll('.common_terms_and_conditions')[0]
    //     // var stopValue = termsElm.getBoundingClientRect().top;
    //     const { toTop } = this.state;
    //     if(toTop==='' && window.pageYOffset>70){
    //         this.setState({toTop: '-toTop'})
    //     }else if(toTop!=='' && window.pageYOffset<70){
    //         this.setState({toTop: ''})
    //     }
    //     var leftParentPanel = document.getElementById('leftParentPanel');
    //     var rightPanel = document.getElementById('scroll-right-pane');
    //     var buttons = document.getElementsByClassName('termsAndConditions__container')[0];
    //     if(leftParentPanel && rightPanel && window.location.pathname === "/tienda/checkoutShipping"){
    //         var stopValue = leftParentPanel.offsetHeight - rightPanel.offsetHeight - buttons.offsetHeight;
    //         if(stopValue){
    //             console.log(window.pageYOffset ,stopValue)
    //             // console.log("window.pageYOffset :",window.pageYOffset,", offset.height: ",offset.height,", offset.top: ",offset.top," ====>",window.pageYOffset>offset.top," ---- (((",offset.bottom," - ",offset.top,") + ",window.pageYOffset,") > ",stopValue,") ::: ",(((offset.bottom - offset.top) + window.pageYOffset) > stopValue));
    //             if (window.pageYOffset > offset.top){
    //                 if ( window.pageYOffset > stopValue) {
    //                     // console.log('stopPropagation')
    //                 } else {
    //                     $sidebar.style.marginTop = window.pageYOffset - offset.top + 15 + "px"
    //                 }
    //             }else{
    //                 $sidebar.style.marginTop = 0 + "px";
    //             }
    //         }
    //     }
    // }


    /**
     * REACT life cycle Event. Method will call before component removes from the DOM.
     * @event componentWillUnmount 
     * 
     */
    componentWillUnmount(){
        document.removeEventListener('scroll', this.handleDocumentScroll, false);
    }

    /**
	* Method will call on country change
	* @function handleOnCountryChange
	* @author dondapati.kumar@zensar.com
	* @desc Hiding telephone LADA field if the selected country is Guatemala.
	* @param {string} value 
	* 
	*/

    handleOnCountryChange = (value) => {
        this.setState({ guest_hide_telephone_lada: value === 'GT' ? true : false });
    }

    /**
	* Method will call on delivery type changed to pickup store.
	* @function userSelectPickpuInStore
	* @author dondapati.kumar@zensar.com
	* @desc Unhiding telephone LADA field if delivery type changed to pickup store.
	* 
	*/
    userSelectPickpuInStore = () => {
        this.setState({ guest_hide_telephone_lada: false })
    }

    /**
	* Method will call on selection of delivery address
	* @function saveAddresses
	* @author dondapati.kumar@zensar.com
	* @desc Saving selected address details to persist on toggle accordian of pickup store / home delivery.
    * @param {object} address_records
	* 
	*/
    saveAddresses = (address_records) => {
        this.setState({ address_records })
    }

    /**
	* Method will call if API goes to error case
	* @function error_scenario
	* @author dondapati.kumar@zensar.com
	* @desc Based on the error response, showing error message or redirecting to proper page if session expires.
	* @param {object} response
	*/
    error_scenario = (response) => {
        if (response && response.data && (response.data.errorCode === '1003' || response.data.errorCode === '1002')) {
            const LoggedInSession = GetCookie("LoggedInSession");
            // const KeepMeSignIn = GetCookie('KeepMeSignIn');
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
	* Method will call to fetch cart header details
	* @function getCartHeaderDetails
	* @author dondapati.kumar@zensar.com
	* @desc Making RESTfull service call to get logged in status of the the current user.
	*/
    getCartHeaderDetails = () => {
        Utility(Path.getCartHeaderDetails, 'POST', {}).then(response => {
            if (response.status === 200) {
                if (response.data && response.data.status && response.data.status.status === "SUCCESS") {
                    const loggedInUser = (response.data && response.data.cartHeaderDetails) ? response.data.cartHeaderDetails.isLoggedIn : false;
                    let { deliveryTypeSelection, pdpSelection } = this.state;
                    if(pdpSelection && pdpSelection.deliveryMethod === "store"){
                        deliveryTypeSelection = {
                            pickUpInStore: true,
                            homeDelivery: false
                        }
                    }else{
                        deliveryTypeSelection = {
                            pickUpInStore: false,
                            homeDelivery: loggedInUser
                        }
                    }
                    this.setState({
                        loggedInUser,
                        deliveryTypeSelection
                    });
                    this.props.loginDetails.check_login_status(response.data);
                } else {
                    this.error_scenario(response);
                }
            } else {
                this.error_scenario(response);
            }
        }, (error) => {

        });
    }

    /**
	* Calling GTMallPages method to sett gtm object data.
	* @function set_GTMallPages
	* @author dondapati.kumar@zensar.com
	* @desc Creating gtm Object with all the required data to call GTMallPages method.
	*/
    set_GTMallPages = () => {
        const gtmObjectData = {
            actURL: window.location.href,
            actPageTitle: document.title
        }
        const data = this.props.cartHeaderResponse || {}
        if (data && data.cartHeaderDetails) {
            gtmObjectData.loginStatus = data.cartHeaderDetails.isLoggedIn ? 'Y' : 'N';
            gtmObjectData.userID =  data.cartHeaderDetails.gtmUserId || '';
        }
        GTMallPages(gtmObjectData);
    }

    /**
	* Method will call to close the alert
	* @function dismiss_alert
	* @author dondapati.kumar@zensar.com
	* @desc Setting alert status false to close the alert if user clicks on close button.
	*/
    dismiss_alert = () => {
        clearTimeout(this.alertTimeoutSession);
        this.setState({ alert_status: false })
    }

    /**
	* Method will call to show the alert
	* @function show_alert
	* @author dondapati.kumar@zensar.com
	* @desc Setting alert status true to show the alert.
    * @param {string} alert_message
    * @param {string} alert_Type
    * @param {number} time
	*/
    show_alert = (alert_message, alert_Type = "alert", time) => {
        clearTimeout(this.alertTimeoutSession);
        this.setState({ alert_status: true, alert_message, alert_Type });
        if (alert_Type !== "warning" && alert_Type !== "alert") {
            this.alertTimeoutSession = setTimeout(() => {
                this.setState({ alert_status: false });
            }, time || 5000);
        }
    }

    /**
	* Redirecting to cart page
	* @function show_alert
	* @author dondapati.kumar@zensar.com
	* @desc By clicking on the back button page redirecting to the cart page.
    * @param {string} query
	*/
    moveToCartPage = (query) => {
        // isSessionExpires=true
        const path = '/tienda/cart';
        Router.push(path);
    }


    /**
	* Handling checkout item details response
	* @function handle_checkoutItemsDetail_data
	* @author dondapati.kumar@zensar.com
	* @desc Based on checkout item details response, showing cart items list in cart summary and dynamically showing message based on the item type.
    * @param {object} data
	*/
    handle_checkoutItemsDetail_data = (data) => {
        const checkoutItemsDetail = data;
        let cartHaveAtLeasetOneDigitalItem = false;
        let cartHaveGRItem = false;
        let cartHaveNormalItem = false;
        let cartHaveOnlyDigitalItems = checkoutItemsDetail.itemInfo && Object.keys(checkoutItemsDetail.itemInfo).length > 1 ? true : false;
        let cartHaveOnlyGRItems = cartHaveOnlyDigitalItems;
        const dataLayerProducts = [];
        const cartHave = {};
        if (checkoutItemsDetail.itemInfo) {
            for (var i in checkoutItemsDetail.itemInfo) {
                const item = checkoutItemsDetail.itemInfo[i];
                if (item.productId) {
                    if (!this.state.loggedInUser) {
                        item.estimatedDeliveryDate =checkoutItemsDetail.itemInfo[i].estimatedDeliveryDate !== undefined ?checkoutItemsDetail.itemInfo[i].estimatedDeliveryDate: checkoutItemsDetail.itemInfo && checkoutItemsDetail.itemInfo.EDDErrorMessages && checkoutItemsDetail.itemInfo.EDDErrorMessages[item.productId];
                    }
                    if (item.commerceItemType === 'Digital') {
                        cartHaveAtLeasetOneDigitalItem = true;
                    } else {
                        cartHaveOnlyDigitalItems = false;
                        if (item.commerceItemType === "Big Ticket") {
                            cartHave.bigTicketItem = true;
                        } else if (item.commerceItemType === "Soft Line") {
                            cartHave.softLineItem = true;
                        }
                    }

                    if(item.itemType==="giftRegistryCommerceItem"){
                        cartHaveGRItem = true;
                    }else{
                         cartHaveOnlyGRItems = false;
                        if(item.itemType!=="giftRegistryCommerceItem" && item.commerceItemType !== 'Digital'){
                            cartHaveNormalItem = true;
                        }
                    }
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

                    dataLayerProducts.push({
                        name: item.displayName || "",
                        id: item.productId || "",
                        price: item.finalDiscountedUnitPrice&&item.finalDiscountedUnitPrice.toString() || "",
                        brand: item.brand || "",
                        category: item.L1Category || "",
                        dimension36: item.sellerName || "",
                        quantity: item.quantity || "",
                        variant: 'N/A',
                        dimension27: item.size ||item.dimensions || "",
                        dimension28: item.color || "",
                        dimension36: item.sellerName ? 'Market Place - ' + item.sellerName : sellerNameHardCode,
                        dimension40: item.sellerSkuId ? item.sellerSkuId : item.skuId ? item.skuId : "",
                        dimension41: item.material || "",
                        dimension42: item.texture || "",
                        dimension43: "N",
                        metric2: item.listPrice && item.listPrice.toString() || "",
                        metric3: item.finalDiscountedUnitPrice&&item.finalDiscountedUnitPrice.toString() || "",

                    })
                }
            }
        }

        const dataLayerCheckout = {
            event: 'checkout',
            ecommerce: {
                checkout: {
                    actionField: { step: 1 },
                    products: dataLayerProducts
                }
            }
        }

        dataLayer.push(dataLayerCheckout);

        let previousSelection = {};
        if (Router && Router.router && Router.router.components) {
            if (Object.keys(Router.router.components).indexOf('/tienda/checkoutBilling') !== -1 || Object.keys(Router.router.components).indexOf('/tienda/checkoutPromotion') !== -1) {
                previousSelection = data && data.shippingAddress && data.shippingAddress.shippingAddressDetail || {};
            }
        }

        let { deliveryTypeSelection, pickup_userSelection, homeDelivery_userSelection, pdpSelection } = this.state;
        if (previousSelection.storePickup) {
            pickup_userSelection.state = previousSelection.storeStateId;
            pickup_userSelection.locationId = previousSelection.storeLocationId;
            if(previousSelection.eventNumber){
                pickup_userSelection.event = previousSelection.eventNumber;
                pickup_userSelection.eventNumber = previousSelection.eventNumber;
            }
            if(previousSelection.eventId){
                pickup_userSelection.eventId = previousSelection.eventId;
            }
            deliveryTypeSelection = {
                pickUpInStore: true,
                homeDelivery: false
            }
        } else if (previousSelection.nickName) {
            homeDelivery_userSelection = previousSelection;
        } else if (!previousSelection.nickName && previousSelection.eventNumber) {
            pickup_userSelection = {
                event: previousSelection.eventNumber,
                eventNumber: previousSelection.eventNumber,
                eventId: previousSelection.eventId
            };
            deliveryTypeSelection = {
                pickUpInStore: true,
                homeDelivery: false
            }
        } else if (previousSelection.firstName) {
            deliveryTypeSelection = {
                pickUpInStore: false,
                homeDelivery: true
            }
        }

        if(pdpSelection && pdpSelection.deliveryMethod === "store"){
            deliveryTypeSelection = {
                pickUpInStore: true,
                homeDelivery: false
            }
        }

        if (previousSelection.country === 'GT') {
            previousSelection.country = "Guatemala";
        }

        this.setState({
            cartHave,
            checkoutItemsDetail,
            previousSelection,
            deliveryTypeSelection,
            pickup_userSelection,
            homeDelivery_userSelection,
            cartHaveAtLeasetOneDigitalItem,
            cartHaveOnlyDigitalItems,
            cartHaveOnlyGRItems,
            cartHaveGRItem,
            cartHaveNormalItem
        }, () => {
            if(deliveryTypeSelection && deliveryTypeSelection.homeDelivery){
                this.setMaxHeightForAnimation('shipToAddress');
            }
            if(deliveryTypeSelection && deliveryTypeSelection.pickUpInStore){
                this.setMaxHeightForAnimation('shipToStore');
            }
            // console.log("cartHave ............... ::: ",this.state.cartHave);
            if (this.state.loggedInUser === false && previousSelection.firstName) {
                //Guest saved address persistence
                const phoneNum = previousSelection.storePickup === true ? (previousSelection.storePhoneNumber || "") : (previousSelection.phoneNumber || "")
                const user = {
                    firstName: previousSelection.firstName,
                    lastName: previousSelection.lastName,
                    mothersLastName: previousSelection.maternalName,
                    email: previousSelection.email,
                    // LADA: (previousSelection.phoneNumber && (previousSelection.storePickup === true ? previousSelection.phoneNumber.substring(0, 2) : previousSelection.phoneNumber.split('-')[0])),
                    // phone: (previousSelection.phoneNumber &&  (previousSelection.storePickup === true ? previousSelection.phoneNumber.substring(2) : previousSelection.phoneNumber.split('-')[1]))
                    LADA: phoneNum.split('-')[0] || "",
                    phone: phoneNum.split('-')[1] || "",
                }

                // phone: previousSelection.storePickup === false && (previousSelection.phoneNumber && previousSelection.phoneNumber.split('-')[0] + '' + previousSelection.phoneNumber.split('-')[1]) || previousSelection.phoneNumber || ""
                this.setState({
                    editButtonVisibility: previousSelection.storePickup === false ? true : false,
                    user,
                    manualClick: false,
                    guest_hide_telephone_lada: previousSelection.country === "Guatemala" ? true : false
                })
            }
        });
    }


    /**
	* Fetching checkout items details
	* @function getCheckoutItemsDetail
	* @author dondapati.kumar@zensar.com
	* @desc Making restfull service call to fetch checkout item details and handling the response.
	*/
    getCheckoutItemsDetail = () => {
        Utility(Path.checkoutItemsDetail, 'POST', { "pageName": "shippingPage" }).then(response => {
            if (response && response.data && response.data.itemInfo) {
                const data = (response && response.data) || {};
                this.handle_checkoutItemsDetail_data(data);
            } else {
                this.error_scenario(response);
            }
        }, (error) => {
            // logError("Error ==== :: ", error);
        });
    }


    /**
	* Showing address form fields if guest user clicks on edit address.
	* @function editGuestAddress
	* @author dondapati.kumar@zensar.com
	* @desc Changing the state value to show the address form fields to guest edit address.
	*/
    editGuestAddress = () => {
        var $sidebar = document.querySelectorAll(".col-lg-4.col-12.order-2  .m-box.mb-4.shipping-sticky")[0];
        $sidebar.style.marginTop = 0 + "px";
        this.setState({
            addressform_visibility: true
        });
    }

    /**
	* Fetching stores states list.
	* @function collectinstore
	* @author dondapati.kumar@zensar.com
	* @desc Making a RESTfull service call to fetch store states list and converting those to array formate and setting up to state.
	*/
    collectinstore = () => {
        Utility(Path.collectinstore, 'GET').then(response => {
            if (response && response.data && response.data.s === '0') {
                const states = (response.data && response.data.statesInfo) ? getStateArray(response.data.statesInfo) : []
                this.setState({ states });
            } else {
                this.error_scenario(response);
            }
        }).catch(error => {
            //logError(" catch Error ==== :: ", error);
        });
    }

    /**
	* Fetching stores event list.
	* @function collectinstore
	* @author dondapati.kumar@zensar.com
	* @desc Making a RESTfull service call to fetch store event list and updating state.
	*/
    getshiptostoreeventdetails = () => {
        if (this.state.loggedInUser) {
            Utility(Path.getshiptostoreeventdetails, 'POST').then(response => {
                if (response && response.data && response.data.status && response.data.status.status === "success") {
                    this.setState({
                        storeEventDetails: response.data
                    })
                } else {
                    this.error_scenario(response);
                }
            }, (error) => {
                // logError("Error ==== :: ", error);
            });
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.LoggedInSession !== this.state.loggedInUser) {
    //         this.setState({ loggedInUser: nextProps.loginDetails.LoggedInSession }, () => {
    //             if (this.state.loggedInUser) {
    //                 this.getshiptostoreeventdetails();
    //                 this.getCheckoutItemsDetail();
    //             }
    //         });
    //     }
    // }


    /**
	* Showing address form fields to add new address.
	* @function editGuestAddress
	* @author dondapati.kumar@zensar.com
	* @desc Showing empty address form to add new shipping address.
	*/
    addNewAddress = () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        let addressRecords = [];
        if (this.refs.homeDeliveryRef) {
            this.refs.homeDeliveryRef.resetValues()
            addressRecords = this.refs.homeDeliveryRef.state.addresses ? this.refs.homeDeliveryRef.state.addresses.records : []
        }
        if (this.refs.pickUpInStoreRef) {
            this.refs.pickUpInStoreRef.resetValues()
        }
        var $sidebar = document.querySelectorAll(".col-lg-4.col-12.order-2  .m-box.mb-4.shipping-sticky")[0];
        $sidebar.style.marginTop = 0 + "px";
        this.setState({ addressform_visibility: true, manualClick: true, editAddress: {}, deliverySelectionPayLoad: {}, addressRecords });
    }

    /**
	* Method will call on delivery type change
	* @function toggleDeliveryTypeSelection
	* @author dondapati.kumar@zensar.com
	* @desc Showing / Hiding delivery type accordion to show the selected delivery method.
    * @param {string} type
    * @param {string} id
	*/
    toggleDeliveryTypeSelection = (type,id) => {
        let { deliveryTypeSelection } = this.state;
        if((type==='pickUpInStore' && deliveryTypeSelection.pickUpInStore) || (type==='homeDelivery' && deliveryTypeSelection.homeDelivery)){
            document.getElementById('shipToStore').style.overflow = 'hidden';
            this.animateAccordion(id);
            setTimeout(()=>{
                this.setState(prevState => {
                    deliveryTypeSelection[type] = !prevState.deliveryTypeSelection[type];
                    return { deliveryTypeSelection, alert_status: false }
                })
            },400)
        }else{
            this.setState(prevState => {
                deliveryTypeSelection[type] = !prevState.deliveryTypeSelection[type];
                return { deliveryTypeSelection, alert_status: false }
            },()=>{
                this.animateAccordion(id);
                setTimeout(()=>{
                    deliveryTypeSelection = {};
                    deliveryTypeSelection[type] = true;
                    this.setState({deliveryTypeSelection});
                },400)
            })
        }
    }


    /**
	* Method will call to add animation to the accordion.
	* @function animateAccordion
	* @author dondapati.kumar@zensar.com
	* @desc Adding animation while showing/hiding delivery type accordion.
    * @param {string} id
	*/
    animateAccordion = (id) => {
        let { deliveryTypeSelection } = this.state;
        let ele = document.getElementById(id);
        let height = ele.scrollHeight;
        if(id === "shipToStore"){
            this.setZeroHeightForAnimation('shipToAddress');
        }else{
            this.setZeroHeightForAnimation('shipToStore');
        }
        if(ele.style.maxHeight === '0px'){
            ele.style.maxHeight = height + 'px';
        }else{
            ele.style.maxHeight = '0px'
        }
    }

    /**
	* Method will call as part of accordion animation.
	* @function setMaxHeightForAnimation
	* @author dondapati.kumar@zensar.com
	* @desc Setting maximum hight for the accordion to show with animation.
    * @param {string} id
	*/
    setMaxHeightForAnimation = (id) =>{
        let ele = document.getElementById(id);
        if(ele){
            ele.style.maxHeight = ele.scrollHeight + 'px';
        }
    }

    /**
	* Method will call as part of accordion animation.
	* @function setZeroHeightForAnimation
	* @author dondapati.kumar@zensar.com
	* @desc Setting hight 0 for the accordion to hide with animation.
	*/
    setZeroHeightForAnimation = (id) =>{
        let ele = document.getElementById(id);
        if(ele){
            ele.style.maxHeight = '0px'
        }
    }
    /**
	* Method will call on selection of delivery address
	* @function set_pickup_userSelection
	* @author dondapati.kumar@zensar.com
	* @desc Saving selected address details to persist on toggle accordian of pickup store.
    * @param {object} pickup_userSelection
	* 
	*/
    set_pickup_userSelection = (pickup_userSelection) => {
        this.setState({ pickup_userSelection })
    }

    /**
	* Method will call on delivery type selection change
	* @function userDeliveryTypeSelection
	* @author dondapati.kumar@zensar.com
	* @desc Based on the delevery type selection setting up the requred payload to the state.
    * @param {string} type
    * @param {object} data
	* 
	*/
    userDeliveryTypeSelection = (type, data) => {
        if(type==='store' || type==='homeDelivery'){
            let id = type === 'store' ? 'shipToStore' : 'shipToAddress';
            this.setMaxHeightForAnimation(id);
        }
        let deliverySelectionPayLoad = data;
        if (type === 'store') {
            if (this.refs.homeDeliveryRef) {
                this.refs.homeDeliveryRef.resetValues()
            }
            this.setState({ deliverySelectionPayLoad });
        } else if (type === 'homeDelivery') {
            if (this.refs.pickUpInStoreRef) {
                this.refs.pickUpInStoreRef.resetValues();
            }
            this.setState({ pickup_userSelection: {}, deliverySelectionPayLoad, homeDelivery_userSelection: {} });
        } else if (type === 'clear-homeDelivery') {
            deliverySelectionPayLoad = {};
            if (this.refs.homeDeliveryRef) {
                this.refs.homeDeliveryRef.resetValues()
            }
            this.setState({ deliverySelectionPayLoad });
        }
    }

    /**
	* Method will call on clicks on continue button to go to shipping to billing
	* @function proceedshiptobill
	* @author dondapati.kumar@zensar.com
	* @desc Making Restfull service all with the selected payload to got shipping page to billing page
    * @param {object} payLoad
	* 
	*/
    proceedshiptobill = (payLoad) => {
        this.setState({ disableButtonFields: true }, () => {
            Utility(Path.proceedshiptobill, 'POST', payLoad).then(response => {
                logError(" IMP LOG : proceedshiptobill response --------- ",response);
                if (response.status === 200 && response.data && response.data.s === "0") {
                    this.gotoBllingPage();
                } else {
                    this.error_scenario(response);
                    this.setState({ disableButtonFields: false })
                }
            }, (error) => {
                this.setState({ disableButtonFields: false })
            });
        })
    }

    /**
	* Method will call on success of proceedshiptobill API
	* @function gotoBllingPage
	* @author dondapati.kumar@zensar.com
	* @desc Redirecting page to shipping to billing by pushing route.
	* 
	*/
    gotoBllingPage = () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera        
        Router.push('/tienda/checkoutBilling', '/tienda/checkoutBilling');
    }

    /**
	* Method will call on clics on continue button
	* @function handleContinueFromShippingPage
	* @author dondapati.kumar@zensar.com
	* @desc Creating dynamica payload based on login status to make restfull service call to proceed shipping to billing page.
	* 
	*/
    // continue method from shipping page
    handleContinueFromShippingPage = () => {
        let { loggedInUser, deliverySelectionPayLoad, cartHaveOnlyDigitalItems, cartHaveAtLeasetOneDigitalItem, cartHaveGRItem, cartHaveNormalItem, deliveryTypeSelection } = this.state;
        if (loggedInUser) { // Logged in case
            if (Object.keys(deliverySelectionPayLoad).length > 0) {
                if (deliverySelectionPayLoad.eventCount > 0 && !deliverySelectionPayLoad.eventId) {
                    if ((deliverySelectionPayLoad.type === 'homeDelivery' || deliveryTypeSelection.homeDelivery) && this.refs.homeDeliveryRef) {
                        // this.show_alert('Selecciona Campos obligatorios');
                        this.refs.homeDeliveryRef.warningSelectGiftEvent()
                    } else if ((deliverySelectionPayLoad.type === 'store' || deliveryTypeSelection.pickUpInStore) && this.refs.pickUpInStoreRef) {
                        // this.show_alert('Selecciona Campos obligatorios');
                        window.scrollTo(0, 0);
                        this.refs.pickUpInStoreRef.warningSelectGiftEvent();
                    } else {
                        deliveryTypeSelection = {
                            pickUpInStore: true,
                            homeDelivery: false
                        }
                        this.setState({ deliveryTypeSelection }, () => {
                            this.refs.pickUpInStoreRef.warningSelectGiftEvent();
                        });
                    }
                } else if (deliveryTypeSelection.pickUpInStore && !deliverySelectionPayLoad.locationId) {
                    // this.show_alert('Selecciona Campos obligatorios');
                    if (this.refs.pickUpInStoreRef) {
                        this.refs.pickUpInStoreRef.warningSelectGiftEvent()
                    }
                } else if (deliveryTypeSelection.homeDelivery && !deliverySelectionPayLoad.shipToAddressName) {
                    // this.show_alert('Selecciona Campos obligatorios');
                    if (this.refs.homeDeliveryRef) {
                        this.refs.homeDeliveryRef.warningSelectGiftEvent()
                    }
                } else {
                    delete deliverySelectionPayLoad.eventCount;
                    delete deliverySelectionPayLoad.selectedStatevalue;
                    delete deliverySelectionPayLoad.type;
                    this.proceedshiptobill(deliverySelectionPayLoad);
                }
            } else {
                // this.show_alert('Selecciona Campos obligatorios');
                deliveryTypeSelection = {
                    pickUpInStore: true,
                    homeDelivery: false
                }
                this.setState({ deliveryTypeSelection }, () => {
                    this.refs.pickUpInStoreRef.warningSelectGiftEvent();
                });
            }
        } else { // Guest User Case (Store Selection)
            const promiseGuestDetails = this.validateForm();
            promiseGuestDetails.then((data) => {
                if (Object.keys(deliverySelectionPayLoad).length > 0) {
                    const payload = {
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "phoneNumberLada": data.LADA,
                        "phoneNumber": data.phone,
                        "maternalName": data.mothersLastName,
                        "email": data.email,
                        "shipToStore": 'true',
                        "selectedLocationId": deliverySelectionPayLoad.locationId,
                        "selectedStateId": deliverySelectionPayLoad.selectedStateId,
                        "selectedStatevalue": deliverySelectionPayLoad.selectedStatevalue,
                        "shipToNewAddress": 'false'
                    }
                    this.shippingaddressforcheckoutguest(payload)
                } else if (this.state.editButtonVisibility && deliveryTypeSelection.homeDelivery) {
                    var input = {
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "phoneNumberLada": data.LADA,
                        "phoneNumber": data.phone,
                        "maternalName": data.mothersLastName,
                        "email": data.email,
                    }
                    const { previousSelection } = this.state;
                    if (previousSelection.postalCode) {
                        this.addresssearch(previousSelection.postalCode, input);
                    }
                } else if (cartHaveOnlyDigitalItems || (cartHaveAtLeasetOneDigitalItem===true && cartHaveGRItem===true && cartHaveNormalItem===false)) {
                    var input = {
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "phoneNumberLada": data.LADA,
                        "phoneNumber": data.phone,
                        "maternalName": data.mothersLastName,
                        "email": data.email,
                        "shipToStore": 'false',
                        "shipToNewAddress": 'false'
                    }
                    this.shippingaddressforcheckoutguest(input)
                } else {
                    deliveryTypeSelection = {
                        pickUpInStore: true,
                        homeDelivery: false
                    }
                    this.setState({ deliveryTypeSelection }, () => {
                        // if(this.refs.homeDeliveryRef)
                        // this.refs.homeDeliveryRef.warningSelectGiftEvent()
                        if (this.refs.pickUpInStoreRef){
                            this.refs.pickUpInStoreRef.warningSelectGiftEvent()
                        }
                    });
                    // this.show_alert('Selecciona Campos obligatorios');
                }
            }, (error) => {
                deliveryTypeSelection = {
                    pickUpInStore: true,
                    homeDelivery: false
                }
                this.setState({ deliveryTypeSelection }, () => {
                    // if(this.refs.homeDeliveryRef)
                    // this.refs.homeDeliveryRef.warningSelectGiftEvent()
                    if (this.refs.pickUpInStoreRef){
                        this.refs.pickUpInStoreRef.warningSelectGiftEvent()
                    }
                });
                // this.show_alert('Selecciona Campos obligatorios');
            })
        }
    }

    /**
	* Method will call to address search by postal code.
	* @function addresssearch
	* @author dondapati.kumar@zensar.com
	* @desc Making RESTfull service call based on given postal code number.
    * @param {string} PostalCode
    * @param {object} input
	* 
	*/
    addresssearch = (PostalCode, input) => {
        // service addresssearch change GET from POST method :: Start
        let payLoad = '?action=EMA&cp=' + PostalCode;
        Utility(Path.addresssearch + payLoad, 'GET').then(response => {
        // service addresssearch change GET from POST method :: End    
            if (response && response.data && response.data.s === '0') {
                this.check_estimateddeliverydate(PostalCode);
                this.constructGuestUserAddAddressPayload(response, input);
            } else {
                // this.error_scenario(response);
                this.constructGuestUserAddAddressPayload({}, input);
            }
        }, (error) => {
            // logError("Error ==== :: ", error);
        });
    }

    /**
	* Method will call on add address for guest user
	* @function constructGuestUserAddAddressPayload
	* @author dondapati.kumar@zensar.com
	* @desc Creating payload when address added by guest user.
    * @param {object} response
    * @param {object} input
	* 
	*/
    constructGuestUserAddAddressPayload = (response, input) => {
        const { municipality, neighbourhood, settlement, state } = (response && response.data && response.data.addrSearchResponse) || {};
        const { previousSelection, states } = this.state;
        let stateList = state && state.map(str => {
            str = str.split(':');
            return { name: str[1], value: str[0] };
        }) || [];
        stateList = stateList.length > 0 ? stateList : states;
        const selectedState = stateList.filter(obj => obj.name === previousSelection.state);
        const stateId = (selectedState && selectedState[0]) ? selectedState[0].value : "-2";
        const payload = {
            ...input,
            "country": previousSelection.country,
            "shipToStore": "false",
            "selectedLocationId": " ",
            "selectedStateId": " ",
            "selectedStatevalue": " ",
            "postalCode": previousSelection.postalCode,
            "stateId": stateId,
            "state": previousSelection.state,
            "city": previousSelection.city,
            "delegationMunicipality": previousSelection.deligation,
            "delegationMunicipalityId": previousSelection.delegationMunicipalityId || "-1",
            "neighborhood": previousSelection.colony,
            "address1": previousSelection.street,
            "exteriorNumber": previousSelection.exteriorNumber,
            "interiorNumber": previousSelection.interiorNumber,
            "building": previousSelection.building,
            "address2": previousSelection.address2,
            "address3": previousSelection.address3,
            "mobilePhoneNumber": previousSelection.mobilePhoneNumber,
            "shipToNewAddress": "true",
            "neighborhoodId": previousSelection.colonyId || "-1"
        }
        this.shippingaddressforcheckoutguest(payload);
    }

    /**
	* Method will call on continue guest shipping to billing
	* @function shippingaddressforcheckoutguest
	* @author dondapati.kumar@zensar.com
	* @desc Making Restfull service call for guest user continue to shipping page to billing page.
    * @param {object} payload
	* 
	*/
    // GUEST ... Saving Guest User store Selection / Address
    shippingaddressforcheckoutguest = (payload) => {
        this.setState({ disableButtonFields: true }, () => {
            Utility(Path.shippingaddressforcheckoutguest, 'POST', payload).then(response => {
                if (response && response.data && response.data.status && response.data.status.status === "success") {
                    this.gotoBllingPage();
                } else {
                    this.error_scenario(response);
                    this.setState({ disableButtonFields: false });
                }
            }, (error) => {
                this.setState({ disableButtonFields: false });
            });
        });
    }

    /**
	* Method will call on click continue button for the guest user
	* @function guestUserContinueFromShippingPage
	* @author dondapati.kumar@zensar.com
	* @desc After successfull form validation of guest user entries, creating payload to make service call.
	* 
	*/
    // GUEST ... Guest user add address form submit method
    guestUserContinueFromShippingPage = () => {
        const { loggedInUser } = this.state;
        if (!loggedInUser && this.refs.shippingAddressFormRef) {
            const promiseShippingAddres = this.refs.shippingAddressFormRef.validateForm();
            promiseShippingAddres.then((address) => {
                const promiseGuestDetails = this.validateForm();
                promiseGuestDetails.then((guestData) => {
                    this.setPayloadForSaveAddressAsGuest(guestData, address);
                }).catch(error => {
                    const carryAddress = this.refs.shippingAddressFormRef.carryAddressMethod();
                    this.setState({ addressform_visibility: false, carryAddress });
                })
            }).catch(error => {
                // logError("============== ::: ", error);
            })
        }
    }

    /**
	* Creating payload for the guest address.
	* @function setPayloadForSaveAddressAsGuest
	* @author dondapati.kumar@zensar.com
	* @desc creating dynamic payload from the two forms user basic info and the added address.
    * @param {object} guestData
    * @param {object} address
	* 
	*/
    setPayloadForSaveAddressAsGuest = (guestData, address) => {
        const data = { ...guestData, ...address };
        const payload = {
            "firstName": data.firstName,
            "lastName": data.lastName,
            "phoneNumberLada": data.country === 'GT' ? '01' : guestData.LADA,
            "phoneNumber": data.country === 'GT' ? data.cellphone : guestData.phone,
            "email": data.email,
            "maternalName": data.mothersLastName,
            "shipToStore": "false",
            "selectedLocationId": " ",
            "selectedStateId": " ",
            "selectedStatevalue": " ",
            "postalCode": data.postalCode,
            "stateId": data.stateId,
            "state": data.stateName,
            "city": data.city,
            "delegationMunicipality": data.delegationMunicipality,
            "delegationMunicipalityId": data.delegationMunicipalityId || "-1",
            "neighborhood": data.colonyName,
            "address1": data.street,
            "exteriorNumber": data.country !== 'GT' ? data.noExt : data.guatemalanumber,
            "interiorNumber": data.noInt || " ",
            "building": data.building || " ",
            "address2": data.andStreet || " ",
            "address3": data.betweenStreet || " ",
            "mobilePhoneNumber": data.cellphone || " ",
            "shipToNewAddress": "true"
        }
        if (data.country === "GT") {
            payload.neighborhoodId = data.neighborhoodId;
            payload.country = 'GT';
            payload.mobilePhoneNumber = " "
        } else if (data.colonyName === 'OTRA COLONIA') {
            payload.otherNeighborhood = data.otherColony;
            payload.neighborhoodId = "-2";
        } else {
            payload.neighborhoodId = data.colony || "-1"
        }
        this.shippingaddressforcheckoutguest(payload)
    }

    /**
	* For the loggedinuser when clicks on continue after delivery info selection.
	* @function loggedInUserContinueFromShippingPage
	* @author dondapati.kumar@zensar.com
	* @desc creating dynamic payload for the logged in user with the delivery information selection.
	* 
	*/
    loggedInUserContinueFromShippingPage = () => {
        const { loggedInUser, editAddress } = this.state;
        if (loggedInUser && this.refs.addNewShippingAddressRef) {
            const promise = this.refs.addNewShippingAddressRef.validateForm();
            promise.then(data => {
                const input = {
                    "firstName": data.firstName,
                    "lastName": data.lastName,
                    "country": data.country,
                    "city": data.city || (data.country === 'GT' ? "Guatemala Ciudad" : " "),
                    "stateId": data.stateId || data.stateName,
                    "state": data.stateName,
                    "delegationMunicipality": data.delegationMunicipality,
                    "building": data.building || " ",
                    "postalCode": data.postalCode,
                    "neighbourhood": data.colonyName,
                    "address1": data.street,
                    "address2": data.andStreet || " ",
                    "address3": data.betweenStreet || " ",
                    "exteriorNumber": data.country !== 'GT' ? data.noExt : data.guatemalanumber,
                    "interiorNumber": data.noInt || " ",
                    "isDefault": data.isDefault ? data.isDefault.toString() : 'false'
                }

                // "particularPhoneCode": data.businessPhoneCode,
                // "phoneNumber": data.businessPhoneNumber,
                // "cellular": data.country !== 'GT' ? (data.cellphone || " ") : " ",

                // "businessPhoneCode": "123",
                // "businessPhoneNumber": "1234567",
                if (data.colonyName === 'OTRA COLONIA') {
                    input.otherColony = data.otherColony;
                    input.neighborhoodId = "-2"
                } else if (input.country !== 'GT') {
                    input.neighborhoodId = data.colony;
                    input.delegationMunicipalityId = data.municipality;
                }

                if (input.country === 'GT') {
                    input.cellular = data.cellphone;
                } else {
                    input.particularPhoneCode = data.businessPhoneCode;
                    input.phoneNumber = data.businessPhoneNumber;
                    input.cellular = data.cellphone || " ";
                }

                if (editAddress.addressId) {
                    if(data.mothersLastName)
                    input.maternalName = data.mothersLastName;
                    input.newNickname = data.shortName;
                    input.oldNickname = editAddress.nickName;
                    this.saveUpdatedAddressForLoggedInUser(input)
                } else {
                    input.nickname = data.shortName;
                    // if(input.country === 'GT'){
                    //     // input.neighborhoodId = "-2";
                    //     input.neighborhoodId = "";
                    //     input.delegationMunicipalityId = "-2";
                    // }
                    this.saveNewAddressForLoggedInUser(input);
                }
            }, (error) => {
                // logError(error);
            })
        }
    }

    /**
	* Method will call as part of creating payload
	* @function saveNewAddressForLoggedInUser
	* @author dondapati.kumar@zensar.com
	* @desc Added requited parameters to the payload for the new address of logged in user.
    * @param {object} input
	* 
	*/
    saveNewAddressForLoggedInUser = (input) => {
        const payload = {
            "shipToStore": "false",
            "profileAddress": "false",
            ...input
        }
        this.proceedshiptobill(payload)
    }

    /**
	* Method will call on update saved address.
	* @function saveUpdatedAddressForLoggedInUser
	* @author dondapati.kumar@zensar.com
	* @desc Making a restfull service all to update the modified address from the addresses list.
    * @param {object} payload
	* 
	*/
    saveUpdatedAddressForLoggedInUser = (payload) => {
        this.setState({ disableButtonFields: true }, () => {
            Utility(Path.updateaddress, 'POST', payload).then(response => {
                if (response && response.data && response.data.s === "0") {
                    this.setState({ editAddress: {}, addressform_visibility: false }, () => {
                        if (this.refs.homeDeliveryRef) {
                            this.refs.homeDeliveryRef.getShippingAddresses();
                        }
                    })
                } else {
                    this.error_scenario(response);
                }
                this.setState({ disableButtonFields: false })
            }, (error) => {
                // logError(error);
                this.setState({ disableButtonFields: false })
            });
        });
    }

    /**
	* Method will call on cliks on edit address
	* @function updateAddress
	* @author dondapati.kumar@zensar.com
	* @desc creating required payload as part of update address saving.
    * @param {object} editAddress
    * @param {string} defaultShippingAddressId
	* 
	*/
    updateAddress = (editAddress, defaultShippingAddressId) => {
        if(editAddress.country === "Mexico"){
            editAddress.country = "MX";
        }else if(editAddress.country === "Guatemala"){
            editAddress.country = "GT";
        }
        let addressRecords = [];
        if (this.refs.homeDeliveryRef) {
            addressRecords = this.refs.homeDeliveryRef.state.addresses ? this.refs.homeDeliveryRef.state.addresses.records : []
        }
        window.scrollTo(0, 0);
        this.setState({ editAddress, addressform_visibility: true, addressRecords, defaultShippingAddressId },()=>{
            var $sidebar = document.querySelectorAll(".col-lg-4.col-12.order-2  .m-box.mb-4.shipping-sticky")[0];
            $sidebar.style.marginTop = 0 + "px";
        })
    }

    /**
	* Guest user basic information form validation
	* @function validateForm
	* @author dondapati.kumar@zensar.com
	* @desc Handling validation of basic user information added by the guest user.
	* 
	*/
    validateForm = () => {
        return new Promise((resolve, reject) => {
            const { user, guest_hide_telephone_lada } = this.state;
            var errors = {};

            if (!user.firstName) { errors.firstName = true; }
            if (!user.lastName) { errors.lastName = true; }
            if (!user.email || !Validate.isValidEmail(user.email)) { errors.email = true; }
            if (!guest_hide_telephone_lada) {

                if (!user.phone || user.phone.length < 7) { errors.phone = true; }
                if (!user.LADA || user.LADA.length < 2 ) { errors.LADA = true; }
                if((user.phone.length === 8 || user.phone.length === 7) && !Validate.testLength(user.LADA, (user.phone.length===8 ? 2 : 3))){
                    errors.LADA = true;
                }
                if((user.LADA.length === 2 || user.LADA.length === 3) && !Validate.testLength(user.phone, (user.LADA.length===3 ? 7 : 8))){
                    errors.phone = true;
                }

                // if (!user.phone || !Validate.testLength(user.phone, user.LADA.length===3 ? 7 : 8)) { errors.phone = true; }
                // if (!user.LADA || !Validate.testLength(user.LADA, user.phone.length===7 ? 3 : 2)) { errors.LADA = true; }
            }
            if (Object.keys(errors).length === 0) {
                return resolve(user);
            } else {
                this.setState({ errors });
                return reject({ guestForm: false })
            }

        });
    }

    /**
	* Common on changed method
	* @function handleOnChange
	* @author dondapati.kumar@zensar.com
	* @desc handling changed value setting to the state.
    * @param {object} e
	* 
	*/
    handleOnChange = (e) => {
        const { user } = this.state;
        e.persist();
        this.setState(function (prevState) {
            const pre_value = prevState.user[e.target.name];
            user[e.target.name] = Validate.validation(e, pre_value);
            return { user }
        })
    }

    /**
	* Method will call on focus of the form field.
	* @function handleOnFocus
	* @author dondapati.kumar@zensar.com
	* @desc Updating focus state to update dynamic classes for style update.
    * @param {object} e
	* 
	*/
    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }

    /**
	* Method will call on blur of the form field.
	* @function handleBlur
	* @author dondapati.kumar@zensar.com
	* @desc Updating focus state to update dynamic classes for style update.
    * @param {object} e
	* 
	*/
    handleBlur = (e) => {
        const { focused, user, errors } = this.state;
        focused[e.target.name] = false;
        if (!user[e.target.name]) {
            errors[e.target.name] = true;
        } else if (e.target.name === 'email') {
            errors.email = !Validate.isValidEmail(e.target.value);
        } else if (e.target.name === 'LADA' || e.target.name === 'phone') {
            if(user.phone.length === 8 || user.phone.length === 7){
                errors.LADA = !Validate.testLength(user.LADA, (user.phone.length===8 ? 2 : 3));
            }else{
                errors.LADA = user.LADA.length < 2 ? true : false
            }
            // errors.LADA = !Validate.testLength(e.target.value, (user.phone.length===8 ? 2 : (user.phone.length===7 ? 3 : 2)));
            if(user.LADA.length === 2 || user.LADA.length === 3){
                errors.phone = !Validate.testLength(user.phone, (user.LADA.length===3 ? 7 : 8));
            }else{
                errors.phone = user.phone.length < 7 ? true : false
            }
            // errors.phone = !Validate.testLength(e.target.value, (user.LADA.length===3 ? 7 : 8));
        } else {
            errors[e.target.name] = false;
        }
        this.setState({ focused, errors });
    }

    /**
	* Method will call on clicks of removed addres button in hamburger menu.
	* @function removeAddress
	* @author dondapati.kumar@zensar.com
	* @desc Closing hamburger menu after clicks on option in that.
    * @param {number} index
	* 
	*/
    removeAddress = (index) => {
        this.setState({ deleteAddressIndex: index, removeAddressAlertModal: true }, () => {
            if (this.refs.homeDeliveryRef) {
                this.refs.homeDeliveryRef.clearAllAddressOptions();
            }
            // this.props.OpenModal('removeAddressAlertModal');
        })
    }

    /**
	* Method will call on confirmation of remove address.
	* @function confirmRemoveAddress
	* @author dondapati.kumar@zensar.com
	* @desc Calling remove address function after taking confirmation to delete the selected address.
	* 
	*/
    confirmRemoveAddress = () => {
        const { deleteAddressIndex } = this.state;
        if (this.refs.homeDeliveryRef) {
            // this.props.closeModal('removeAddressAlertModal');
            this.refs.homeDeliveryRef.removeAddress(deleteAddressIndex);
            this.setState({ removeAddressAlertModal: false })
        }
    }

    /**
	* Checking estimated delivery date.
	* @function check_estimateddeliverydate
	* @author dondapati.kumar@zensar.com
	* @desc Makinge restfull service call to check estimate delivery date for the cart items.
    * @param {string} postalCode
    * @param {string} storeNumber
	* 
	*/
    check_estimateddeliverydate = (postalCode, storeNumber) => {
        const payload = {
            "pageName": "shippingpage"
        }
        if (postalCode) {
            payload.zipCode = postalCode;
        }
        if (storeNumber) {
            payload.storeNumber = storeNumber;
        }
        Utility(Path.estimatedDeliveryDate, 'POST', payload).then(response => {
            if (response && response.data && response.data.s === "0") {
                if (response.data.eddChangeAlert) {
                    let name = response.data.eddChangeAlert;
                    name = name.toLowerCase();
                    const alertMsg = name.charAt(0).toUpperCase() + name.slice(1);
                    this.show_alert(alertMsg, 'warning', 15000);

                }
                if (response.data && response.data.eddskusMap) {
                    const eddskusMap = response.data.eddskusMap;
                    const { checkoutItemsDetail } = this.state;
                    const { itemInfo } = checkoutItemsDetail || {};
                    for (var i in eddskusMap) {
                        for (var j in itemInfo) {
                            if(itemInfo[j].itemType === "miraklCommerceItem" && eddskusMap[i].skuId === itemInfo[j].sellerSkuId){
                                itemInfo[j].estimatedDeliveryDate = eddskusMap[i].value;
                            }else if (eddskusMap[i].skuId === itemInfo[j].skuId) {
                                itemInfo[j].estimatedDeliveryDate = eddskusMap[i].value;
                            }
                        }
                    }
                    checkoutItemsDetail.itemInfo = itemInfo;
                    this.setState({ checkoutItemsDetail });
                }
            } else {
                this.error_scenario(response);
            }
        }, (error) => {
            // logError(error);
        });
    }

    /**
	* Method will call on guest user adding address
	* @function returnToShippingView
	* @author dondapati.kumar@zensar.com
	* @desc Saving given address and hiding address form if it is a valid form.
	* 
	*/
    returnToShippingView = () => {
        const carryAddress = this.refs.shippingAddressFormRef.carryAddressMethod();
        this.setState({ addressform_visibility: false, carryAddress })
    }

    /**
	* Hiding add address form
	* @function addressFormVisibilityFalse
	* @author dondapati.kumar@zensar.com
	* @desc Hiding add address form after successfull validation and updating toggle animation related styles.
	* 
	*/
    addressFormVisibilityFalse = () => {
        this.setState({ addressform_visibility: false },()=>{
            let { deliveryTypeSelection } = this.state;
            deliveryTypeSelection.homeDelivery
            if(deliveryTypeSelection && deliveryTypeSelection.homeDelivery){
                this.setMaxHeightForAnimation('shipToAddress');
            }
        });
        var $sidebar = document.querySelectorAll(".col-lg-4.col-12.order-2  .m-box.mb-4.shipping-sticky")[0];
        $sidebar.style.marginTop = 0 + "px";
    }

    /**
	* Method will call on clicks on back button in mobile view.
	* @function mobileViewBackButton
	* @author dondapati.kumar@zensar.com
	* @desc Showing the previous page when user cliks on back button in mobile view.
    * @param {string} url
	* 
	*/
    mobileViewBackButton = (url) => {
        const { addressform_visibility } = this.state;
        if(addressform_visibility){
            this.setState({ addressform_visibility: false },()=>{
                this.setMaxHeightForAnimation('shipToAddress');
            });
        }else if(!isEmpty(url)) {
            Router.push({ pathname: url });
        } else {
            Router.push('/tienda/home');
        }
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {

        const {
            loggedInUser,
            deliveryTypeSelection,
            states,
            addressform_visibility,
            checkoutItemsDetail,
            deliverySelectionPayLoad,
            editAddress,
            user,
            errors,
            focused,
            storeEventDetails,
            alert_message,
            alert_status,
            alert_Type,
            labels,
            pickup_userSelection,
            homeDelivery_userSelection,
            previousSelection,
            manualClick,
            addressRecords,
            cartHaveAtLeasetOneDigitalItem,
            cartHaveNormalItem,
            defaultShippingAddressId,
            cartHaveOnlyDigitalItems,
            editButtonVisibility,
            deleteAddressIndex,
            removeAddressAlertModal,
            address_records,
            disableButtonFields,
            isMobile,
            guest_hide_telephone_lada,
            carryAddress,
            toTop,
            pdpSelection,
            enableEditAddress
        } = this.state;
        const { showModal } = this.props;

        const terms = {
            bType: 'anchor',
            pText: labels['pwa.checkout.termsandconditions.agreeText'],
            pClass: 'a-checkout__termsAndConditions ' + (!isMobile && "mb-4"),
            bText: labels['pwa.checkout.termsandconditions.tcText'],
            bClass: 'a-checkout__termsLink',
            bUrl: labels['pwa.checkout.termsandconditions.linkUrl'],
            targetType: '_blank'
        };

        let handleContinueMethod = () => { };
        if (addressform_visibility === false) {
            handleContinueMethod = this.handleContinueFromShippingPage;
        } else if (!loggedInUser && addressform_visibility) {
            handleContinueMethod = this.guestUserContinueFromShippingPage;
        } else if (loggedInUser && addressform_visibility) {
            handleContinueMethod = this.loggedInUserContinueFromShippingPage;
        }
        var mobileControlStyle = {};
        if (isMobile) {
            mobileControlStyle = { 'paddingBottom': '5px' };
        }
        return (
            <main>
                <Alert {...this.props}
                    alertTopClass={toTop + " shipping-alert m-alert__container mdc-snackbar -alertCheckout -step1 -" + alert_Type}
                    iconType={"a-alert__icon icon-" + alert_Type}
                    text={alert_message}
                    alert_status={alert_status}
                    dismiss_alert={this.dismiss_alert}
                    airTimeStyle="68px"
                />
                <div className="container">

                    <div className={removeAddressAlertModal ? 'modal-backdrop show' : ''}></div>
                    {removeAddressAlertModal === true ?
                        <RemoveAddressAlertModal labels={labels} onClick={() => { this.setState({ removeAddressAlertModal: false }) }} showModalpopUp={"removeAddressAlertModal"} ModalpopUp={"removeAddressAlertModal"} confirmRemoveAddress={this.confirmRemoveAddress} />
                        : null
                    }


                    <div className="row">
                        <div className="col-12">
                            <H4 headLineClass="a-checkout__heading -headingMargin" headLineText={addressform_visibility === true ? (editAddress.country ? (labels["pwa.checkoutShippingPage.editShippingAddress.label"] || "Editar dirección de envío") : (labels["pwa.checkoutShippingPage.newShippingAddress.label"] || "Ingresa una nueva dirección de envío")) : (labels["pwa.checkoutShippingPage.deliveryPreference.label"] || "Selecciona el tipo de entrega de tu preferencia")} />
                        </div>
                    </div>

                    <div className="row checkoutPage_">
                        <div className="col-lg-8 col-12 order-1">
                            <div id="leftParentPanel">
                                {!loggedInUser && !addressform_visibility &&
                                    <div className="m-box mb-4">
                                        <form autoComplete="off">
                                            <GuestUserPersonalDetailsForm
                                                cartHaveAtLeasetOneDigitalItem={cartHaveAtLeasetOneDigitalItem}
                                                handleOnChange={this.handleOnChange}
                                                handleOnFocus={this.handleOnFocus}
                                                handleBlur={this.handleBlur}
                                                previousSelection={previousSelection}
                                                user={user}
                                                errors={errors}
                                                focused={focused}
                                                labels={labels}
                                                guest_hide_telephone_lada={guest_hide_telephone_lada}
                                            />
                                        </form>
                                    </div>
                                }
                                {addressform_visibility === false &&
                                    <React.Fragment>
                                        {((!loggedInUser && cartHaveOnlyDigitalItems === false && cartHaveNormalItem) || loggedInUser) &&
                                            <div className="m-box mb-4" id="store-section">
                                                <div className="row no-gutters align-items-center justify-content-between">
                                                    <Link className={"m-box__accordionHeading "+(deliveryTypeSelection.pickUpInStore===false ? 'collapsed' : '')}  aria-expanded={deliveryTypeSelection.pickUpInStore} onClick={() => this.toggleDeliveryTypeSelection('pickUpInStore','shipToStore')}>
                                                        <div className="m-box_accordionText" style={{transition: '0.4s'}}>
                                                            <H5 headLineClass="a-box__heading" headLineText={labels["pwa.checkoutShippingPage.pickupinstore.label"] || "Recoge en tienda"} />
                                                            <Label className="a-box__subHeading">{labels["pwa.checkoutShippingPage.selectienda.text"]}</Label>
                                                            {/*{ loggedInUser && storeEventDetails.eventCount>0 &&
                                                                        <div className="m-flag">
                                                                            <div className="m-flag-item -primaryFlag -mesa">
                                                                                <Span>{labels["pwa.checkoutShippingPage.selectGiftTableMessage.text"]} {storeEventDetails.eventCount}</Span>
                                                                                <Icons className="icon-gift" />
                                                                            </div>
                                                                        </div>
                                                                    }*/}
                                                        </div>
                                                        <div className="a-box__accordionIcon">
                                                            <Icons className={"icon-arrow_down"} />
                                                        </div>
                                                    </Link>
                                                    {/*(deliveryTypeSelection.pickUpInStore===true ? '' : '')*/}
                                                    <div className={"w-100 collapse show"} id="shipToStore" style={{'maxHeight': '0px', overflow: 'hidden',transition: 'max-height 0.4s ease-out'}}>
                                                            {deliveryTypeSelection.pickUpInStore===true &&  <HrTag hrClass="a-box__horizontalSeparator" />}
                                                            {deliveryTypeSelection.pickUpInStore===true && 
                                                                <PickUpInStore
                                                                    states={states}
                                                                    storeEventDetails={storeEventDetails}
                                                                    loggedInUser={loggedInUser}
                                                                    ref="pickUpInStoreRef"
                                                                    userDeliveryTypeSelection={this.userDeliveryTypeSelection}
                                                                    labels={labels}
                                                                    deliverySelectionPayLoad={deliverySelectionPayLoad}
                                                                    pickup_userSelection={pickup_userSelection}
                                                                    set_pickup_userSelection={this.set_pickup_userSelection}
                                                                    check_estimateddeliverydate={this.check_estimateddeliverydate}
                                                                    show_alert={this.show_alert}
                                                                    error_scenario={this.error_scenario}
                                                                    CncDriveEnableFlag={this.state.CncDriveEnableFlag}
                                                                    enableclickandcollect={this.state.enableclickandcollect}
                                                                    userSelectPickpuInStore={this.userSelectPickpuInStore}
                                                                    handleContinueMethod={handleContinueMethod}
                                                                    pdpSelection={pdpSelection}
                                                                    setMaxHeightForAnimation={this.setMaxHeightForAnimation}
                                                                    setZeroHeightForAnimation={this.setZeroHeightForAnimation}
                                                                />
                                                            }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {((!loggedInUser && cartHaveOnlyDigitalItems === false && cartHaveNormalItem) || loggedInUser) &&
                                            <div className="m-box" id="delivery-section">
                                                <div className="row no-gutters align-items-center justify-content-between">
                                                    <Link className={"m-box__accordionHeading "+(deliveryTypeSelection.homeDelivery===false ? 'collapsed' : '')} aria-expanded={deliveryTypeSelection.homeDelivery} onClick={() => this.toggleDeliveryTypeSelection('homeDelivery','shipToAddress')}>
                                                        <div className="m-box_accordionText" style={{transition: '0.4s'}}>
                                                            <H5 headLineClass="a-box__heading" headLineText={loggedInUser ? (labels["pwa.checkoutShippingPage.deliveryatyourhome.label"] || "Entrega en tu domicilio") : (labels["pwa.checkoutShippingPage.entershippingaddress.label"] || "Ingresa una dirección de envío")} />
                                                            {/*labels["pwa.checkoutShippingPage.selectanaddress.label"]*/}
                                                            <Label className="a-box__subHeading">{labels["pwa.checkoutShippingPage.selectanaddress.label"] || "Selecciona una dirección"}</Label>
                                                        </div>
                                                        <div className="a-box__accordionIcon">
                                                            <Icons className={"icon-arrow_down"} />
                                                        </div>
                                                    </Link>
                                                    {/*(deliveryTypeSelection.homeDelivery===true ? '' : '')*/}
                                                    <div className={"w-100 collapse show "} id="shipToAddress" style={{'max-height': '0px', overflow: 'hidden',transition: 'max-height 0.4s ease-out'}}>

                                                        {/*HOME DELIVERY FOR LOGGED IN USER*/}
                                                        {/*deliveryTypeSelection.homeDelivery===true &&*/}
                                                        { deliveryTypeSelection.homeDelivery===true && loggedInUser &&
                                                            <HomeDelivery
                                                                ref="homeDeliveryRef"
                                                                userDeliveryTypeSelection={this.userDeliveryTypeSelection}
                                                                saveUpdatedAddressForLoggedInUser={this.saveUpdatedAddressForLoggedInUser}
                                                                updateAddress={this.updateAddress}
                                                                labels={labels}
                                                                deliverySelectionPayLoad={deliverySelectionPayLoad}
                                                                homeDelivery_userSelection={homeDelivery_userSelection}
                                                                show_alert={this.show_alert}
                                                                removeAddress={this.removeAddress}
                                                                deleteAddressIndex={deleteAddressIndex}
                                                                check_estimateddeliverydate={this.check_estimateddeliverydate}
                                                                storeEventDetails={storeEventDetails}
                                                                address_records={address_records}
                                                                saveAddresses={this.saveAddresses}
                                                                error_scenario={this.error_scenario}
                                                                shipping_address_events_items={this.props.shipping_address_events_items}
                                                                isMobile={isMobile}
                                                                pdpSelection={pdpSelection}
                                                                enableEditAddress={enableEditAddress}
                                                                setMaxHeightForAnimation={this.setMaxHeightForAnimation}
                                                                setZeroHeightForAnimation={this.setZeroHeightForAnimation}
                                                            />
                                                        }
                                                        {deliveryTypeSelection.homeDelivery===true &&
                                                        <div className="row align-items-center mt-3">
                                                            
                                                                {!editButtonVisibility &&
                                                                <div className="col-lg-4 col-12 col-xl-3">
                                                                    <Button className="a-btn a-btn--tertiary -ml-45 -btnCheckout mb-lg-4" ripple="" handleClick={this.addNewAddress}>{labels["pwa.checkoutShippingPage.AddAddress.text"]}
                                                                        <Icons className="icon-arrow_right d-lg-none d-block" />
                                                                    </Button>
                                                                        </div>
                                                                }
                                                                {editButtonVisibility &&
                                                                    <div className="col-12">
                                                                    <Button className="a-btn a-btn--tertiary -ml-45 -btnCheckout mb-lg-4" ripple="" handleClick={this.editGuestAddress}>{labels["pwa.addressFormPage.editShippingAddress.text"]}
                                                                        <Icons className="icon-arrow_right d-lg-none d-block" />
                                                                    </Button>
                                                                    </div>
                                                                }
                                                            
                                                        </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <TermsAndConditions
                                            labels={labels}
                                            Regresar={labels["pwa.checkoutShippingPage.backButton.label"]}
                                            Continuar={labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}
                                            onReturn={() => { Router.push('/tienda/cart', '/tienda/cart') }}
                                            onContinue={this.handleContinueFromShippingPage}
                                            termsAndConditionsLinkUrl={labels['pwa.checkout.termsandconditions.linkUrl']}
                                            termsAndConditionsTCText={labels['pwa.checkout.termsandconditions.tcText']}
                                            termsAndConditionsAgreeText={labels['pwa.checkout.termsandconditions.agreeText']}
                                            disabled={disableButtonFields}
                                        />
                                    </React.Fragment>
                                }

                                {/*HOME DELIVERY FOR GUEST USER*/}
                                {!loggedInUser && addressform_visibility &&
                                    <React.Fragment>
                                        <div className="m-box">
                                            <form autoComplete="off">
                                                {/*<GuestUserPersonalDetailsForm
                                                    handleOnChange={this.handleOnChange}
                                                    handleOnFocus={this.handleOnFocus}
                                                    handleBlur={this.handleBlur}
                                                    user={user}
                                                    errors={errors}
                                                    focused={focused}
                                                    labels={labels}
                                                    previousSelection={previousSelection}
                                                />*/}
                                                <div className="row no-gutters align-items-center justify-content-between mb-3">
                                                    <div className="col-lg-4 col-7">
                                                        <H5 headLineClass="a-box__heading" headLineText="Dirección de envío" />
                                                    </div>
                                                    <div className="col-lg-4 col-5 text-right">
                                                        <Paragraph className="a-box__requiredMessage">{labels["pwa.checkoutShippingPage.requiredfields.text"] || "*Campos obligatorios"}</Paragraph>
                                                    </div>
                                                </div>
                                                <ShippingAddressForm
                                                    ref="shippingAddressFormRef"
                                                    loggedInUser={loggedInUser}
                                                    previousSelection={previousSelection}
                                                    manualClick={manualClick}
                                                    labels={labels}
                                                    show_alert={this.show_alert}
                                                    states={states}
                                                    check_estimateddeliverydate={this.check_estimateddeliverydate}
                                                    error_scenario={this.error_scenario}
                                                    GuatemalaEnableFlag={this.state.GuatemalaEnableFlag}
                                                    handleOnCountryChange={this.handleOnCountryChange}
                                                    guest_hide_telephone_lada={guest_hide_telephone_lada}
                                                    carryAddress={carryAddress}
                                                />
                                            </form>
                                        </div>
                                        <TermsAndConditions
                                            Regresar={labels["pwa.checkoutShippingPage.backButton.label"]}
                                            Continuar={labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}
                                            onReturn={this.addressFormVisibilityFalse}
                                            onContinue={this.guestUserContinueFromShippingPage}
                                            termsAndConditionsLinkUrl={labels['pwa.checkout.termsandconditions.linkUrl']}
                                            termsAndConditionsTCText={labels['pwa.checkout.termsandconditions.tcText']}
                                            termsAndConditionsAgreeText={labels['pwa.checkout.termsandconditions.agreeText']}
                                            disabled={disableButtonFields}
                                            labels={labels}
                                        />
                                    </React.Fragment>

                                }

                                {loggedInUser && addressform_visibility &&
                                    <React.Fragment>
                                        <div className="m-box">
                                            <AddNewShippingAddress
                                                ref="addNewShippingAddressRef"
                                                editAddress={editAddress}
                                                loggedInUser={loggedInUser}
                                                labels={labels}
                                                addressRecords={addressRecords}
                                                defaultShippingAddressId={defaultShippingAddressId}
                                                show_alert={this.show_alert}
                                                states={states}
                                                check_estimateddeliverydate={this.check_estimateddeliverydate}
                                                error_scenario={this.error_scenario}
                                                GuatemalaEnableFlag={this.state.GuatemalaEnableFlag}
                                                handleOnCountryChange={this.handleOnCountryChange}
                                            />
                                        </div>
                                        <TermsAndConditions
                                            Regresar={labels["pwa.checkoutShippingPage.backButton.label"]}
                                            Continuar={labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}
                                            onReturn={this.addressFormVisibilityFalse}
                                            onContinue={this.loggedInUserContinueFromShippingPage}
                                            termsAndConditionsLinkUrl={labels['pwa.checkout.termsandconditions.linkUrl']}
                                            termsAndConditionsTCText={labels['pwa.checkout.termsandconditions.tcText']}
                                            termsAndConditionsAgreeText={labels['pwa.checkout.termsandconditions.agreeText']}
                                            labels={labels}
                                            disabled={disableButtonFields}
                                        />
                                    </React.Fragment>
                                }

                                <div className="d-lg-none">
                                    {/*<div className="row align-items-center justify-content-end">
                                        <div className="col-lg-auto col-12 pt-3 pb-3">
                                            <ParagraphWithBlockNew options={terms} />
                                        </div>
                                    </div>*/}
                                    <div className="row align-items-center justify-content-end checkout_shipping_buttons pt-3 pb-3">
                                        <div className="col-lg-3 col-12">
                                            {addressform_visibility === false &&
                                                <Button className="a-btn a-btn--primary" disabled={disableButtonFields} handleClick={(e) => { window.scrollTo(0, 0); this.handleContinueFromShippingPage(e); }}>{labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}</Button>
                                            }
                                            {!loggedInUser && addressform_visibility &&
                                                <Button className="a-btn a-btn--primary" disabled={disableButtonFields} handleClick={(e) => { window.scrollTo(0, 0); this.guestUserContinueFromShippingPage(e); }}>{labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}</Button>
                                            }
                                            {loggedInUser && addressform_visibility &&
                                                <Button className="a-btn a-btn--primary" disabled={disableButtonFields} handleClick={(e) => { window.scrollTo(0, 0); this.loggedInUserContinueFromShippingPage(e); }}>{labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}</Button>
                                            }
                                        </div>
                                        <div className="col-lg-3 col-12 mt-3 mt-lg-0">
                                            <Button className="a-btn a-btn--secondary" ripple="" disabled={disableButtonFields} handleClick={(e) => {
                                                if (addressform_visibility) {
                                                    window.scrollTo(0, 0);
                                                    this.setState({ addressform_visibility: false },()=>{
                                                        this.setMaxHeightForAnimation('shipToAddress');
                                                    });
                                                } else {
                                                    Router.push('/tienda/cart', '/tienda/cart');
                                                }
                                            }}>{labels["pwa.checkoutShippingPage.backButton.label"]}</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-12 order-2 d-none d-lg-block">
                            <div id="scroll-right-pane">
                                <SummeryMyProducts
                                    {...this.props}
                                    checkoutItemsDetail={checkoutItemsDetail}
                                    labels={labels}
                                />
                            </div>
                        </div>

                    </div>
                </div>



            </main>
        );
    }
}

    /**
	* Conveting object to array format.
	* @function getStateArray
	* @author dondapati.kumar@zensar.com
	* @desc Converting state which are in object format to array format to show the list of states.
    * @param {object} obj
    * @return {array} states
	* 
	*/
const getStateArray = (obj) => {
    const states = []
    Object.keys(obj).map((key) => {
        states.push({
            name: obj[key].stateName,
            value: obj[key].stateId
        })
    });
    return states;
}