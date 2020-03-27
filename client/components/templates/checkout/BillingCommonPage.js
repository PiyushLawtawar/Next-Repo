/**
* Module Name : billingCommonPage
* Functionality : Component is used to show the all the billing components. This is get called from client\components\templates\CheckoutBillingPage.js, client\components\templates\CheckoutPage.js
* @exports : billingCommonPage
* @requires : module:React
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Button/Button
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/molecules/MaterialInputRadio/MaterialInputRadio
* @requires : module:/CheckoutStep1Giftregistry
* @requires : module:/CheckoutStep1PreselectedAddressLogin
* @requires : module:/CheckoutStep2AddNewCardLogin
* @requires : module:/CheckoutStep2PaymentGuest
* @requires : module:/CheckoutStep2PaymentLogin
* @requires : module:/CheckoutStep3
* @requires : module:/CheckoutBundle
* @requires : module:/SummeryMyProducts
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:next/router
* @requires : module:/molecules/Alert/Alert
* Team : Checkout Team
* Other information : Showing the billing page
* 
*/

import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Link from '../../atoms/Link/Link';
import Label from '../../atoms/Label/Label';
import Icons from '../../atoms/Icons/Icons';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import { ParagraphWithBlockNew } from '../../molecules/MixinMolecules/MixinMolecules';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import CheckoutStep1Giftregistry from './CheckoutStep1Giftregistry';
import CheckoutStep1PreselectedAddressLogin from './CheckoutStep1PreselectedAddressLogin';
import CheckoutStep2AddNewCardLogin from './CheckoutStep2AddNewCardLogin';
import CheckoutStep2PaymentGuest from './CheckoutStep2PaymentGuest';
import CheckoutStep2PaymentLogin from './CheckoutStep2PaymentLogin';
import CheckoutStep3 from './CheckoutStep3';
import CheckoutBundle from './CheckoutBundle';
import SummeryMyProducts from './SummeryMyProducts';
import { Utility,GTMallPages, GetCookie, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import Alert from '../../molecules/Alert/Alert';
// Custom Products functionality START
import isEmpty from 'lodash/isEmpty';
// Custom Products functionality START

  /**
	* Method will call to check gift certification
	* @function checkGiftCertificateOrNot
	* @author srinivasa.gorantla@zensar.com
	* @desc checking given item commerce item type is gift certification or not
  * @param {object}
	* 
	*/

const checkGiftCertificateOrNot = (items) =>{
     let isGiftCertificate = false;
    for (var i in items) {
        if (items[i]['commerceItemType'] && items[i]['commerceItemType'] === 'Gift Certificate') {
           isGiftCertificate = true;
        }
    }

    return isGiftCertificate;
}
/**
 * @class billingCommonPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class billingCommonPage extends React.Component {
   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
  constructor(props) {
    //console.log('...props.mainContent....>',props.mainContent)
    const { shippingAddressDetail } = props.mainContent.shippingAddress || {}; 
    const { digitalInfo } = shippingAddressDetail || '';
    super(props);
    this.state = {
      mainContent: props.mainContent,
      staticLabelValues: {},
      showDropdown: false,
      typeheadResponse: {},
      showMobileDeptMenu: false,
      searchTerm: '',
      dynamic_popover_status_obj: {},
      showPromotionBanner: true,
      deptMenuData: {},
      loader: false,
      loggedInUser: props.cartHeaderDetails.isLoggedIn,
      cartHeaderDetails: props.cartHeaderDetails,
      paymentTypeSelection: {
        cashType: false,
        speiType: false,
        cieType: false
      },
      paypalAvailable: true,
      displayPayInfo: {},
      globalConfigData: {},
      alert_status: false,
      aleretMessage: '',
      digitalInfo: digitalInfo,
      isGiftCertificate : checkGiftCertificateOrNot(props.mainContent.itemInfo),
      months: [{
          name: "",
          value: ""
        }],
      clickandcollect: 'cc',
      americanExpressCvv: false,
      monthYearShowOrHide: true,
      buttonDisabled: false,
      toTop: '',
      alertColorType: 'warning',
      isDesktop: false,
      shippingAddressDetail: shippingAddressDetail || {},
      // Custom Products functionality START
      customProduct: false,
      cashIsAvailable: true,
      noCustomProduct: false,
      myCustomProductLength: 0
      // Custom Products functionality START
    }
    this.step2PaymentLoginRef = React.createRef();
  }

  /**
   * REACT life cycle Event. Method will call on component load.
   * @event componentDidMount 
   * 
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    if(this.props.ctclassName){
      this.paymentMethodSelection('CIEBancomer');
    }else if(this.props.ccclassName){
      this.paymentMethodSelection('creditCard');
    }
    this.checkNightBoxAvailabilityStatus();
    if(Object.keys(this.props.cartHeaderDetails).length===0){
      this.getCartHeaderDetails();
    }
    //this.getConfiguration();
    if(this.state.shippingAddressDetail && this.state.shippingAddressDetail.country == 'GT'){
      this.show_alert_message('Para saber el tipo de cambio aplicable te invitamos a contactar al emisor de tu tarjeta. El envio de productos fuera de la república mexicana puede estar sujeto a los montos máximos establecidos por la legislación de tu localidad','warning')
    }
    this.setState({ clickandcollect: window.sessionStorage.getItem('ClickAndCollect') });
    this.gtmObjectData();
    // try {
    //     var $sidebar = document.querySelectorAll(".BillLeftPanel > div")[0];
    //     $sidebar.style.marginTop = 0 + "px";
    //     var offset = $sidebar.getBoundingClientRect();
    //     document.addEventListener('scroll', (e)=>this.billingDocumentScroll(e,offset), false);
    // }
    // catch(error){
    //     // logError(error)
    // }
    document.addEventListener('scroll',this.billingDocumentScroll, false);

      const getConfigurationInfo = this.props.configurationData;
      const labelData = this.props.labelData;
      let staticLabelValues = {};
      if(labelData && labelData.staticLabelValues){
          for(var i in labelData.staticLabelValues){
              if(labelData.staticLabelValues[i].pageName==="pwa-billingPage"){
                  staticLabelValues = labelData.staticLabelValues[i].keyValues;
              }
          }
          this.setState({staticLabelValues});
      }
      const agentDetails = UserAgentDetails(window);
      const isDesktop = agentDetails && agentDetails.isDesktop;
      // Custom Products functionality START
      this.setState({isDesktop, noCustomProduct: false});
      this.isCustomProduct();
      // Custom Products functionality START
  }

  /**
   * REACT life cycle Event. Method will call on component load.
   * @event componentWillUnmount 
   * 
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.billingDocumentScroll, false);
     if(this.props.showModal && (this.props.showModal.billingmodel || this.props.showModal.billingInnerModel)){
           let modelName = this.props.showModal.billingmodel ? 'billingmodel' : 'billingInnerModel'
           this.props.closeModal(modelName);      
      }
  }

  /**
  * Method will call on document scroll
  * @function billingDocumentScroll
  * @author srinivasa.gorantla@zensar.com
  * @desc Adding removing toTop class dynamicall based on scroll postion.
  * 
  */
  billingDocumentScroll = () => {
      const { toTop } = this.state;
      if(toTop==='' && window.pageYOffset>70){
          this.setState({toTop: '-toTop'})
      }else if(toTop!=='' && window.pageYOffset<70){
          this.setState({toTop: ''})
      }
  }


  // billingDocumentScroll = (e, offset) => {
  //     const { toTop } = this.state;
  //     if(toTop==='' && window.pageYOffset>70){
  //         this.setState({toTop: '-toTop'})
  //     }else if(toTop!=='' && window.pageYOffset<70){
  //         this.setState({toTop: ''})
  //     }
  //     var leftParentPanel = document.querySelectorAll(".col-lg-8.col-12.order-1.col-xl-9")[0];
  //     var rightPanel = document.querySelectorAll(".BillLeftPanel > div")[0];
  //     if(leftParentPanel && rightPanel && window.location.pathname === "/tienda/checkoutBilling"){
  //       console.log("leftParentPanel.offsetHeight............ ::: ",leftParentPanel.offsetHeight);
  //         var stopValue = leftParentPanel.offsetHeight - rightPanel.offsetHeight +40;
  //         if(stopValue){
  //             if (window.pageYOffset > offset.top){
  //                 if ( window.pageYOffset > stopValue) {
  //                     // console.log('stopPropagation')
  //                 } else {
  //                     rightPanel.style.marginTop = window.pageYOffset - offset.top + 15 + "px"
  //                 }
  //             }else{
  //                 rightPanel.style.marginTop = 0 + "px";
  //             }
  //         }
  //     }
  // }

  /**
  * Method will call to dismiss_alert
  * @function dismiss_alert
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating alert status to false
  * 
  */
  dismiss_alert = () => {
      this.setState({ alert_status: false })
  }

  /**
  * Method will used to disable button to avoid multiple clicks
  * @function multipleClicksAvoid
  * @author srinivasa.gorantla@zensar.com
  * @desc  Used to disable button to avoid multiple clicks
  * @param {string} val
  * 
  */
  multipleClicksAvoid = (val) => {
      this.setState({ buttonDisabled: val })
  }

  /**
  * Method will call to show alert message.
  * @function show_alert_message
  * @author srinivasa.gorantla@zensar.com
  * @desc Showing alert message based on alet status.
  * @param {string} message
  * @param {string} type
  * 
  */
  show_alert_message = (message, type) =>{
     this.setState({
       alert_status: true,
       aleretMessage: message,
       alertColorType: type
     })
  }

  /**
  * Method will be called to set gtm data
  * @function gtmObjectData
  * @author srinivasa.gorantla@zensar.com
  * @desc Calling GTmall pages
  * 
  */
 gtmObjectData = () =>{
  let gtmObjectData =  
      {
          loginStatus: this.state.loggedInUser ? 'Y' : 'N',     
          actURL: window.location.href,  
          actPageTitle : this.state.staticLabelValues['pwa.openPay.transferencia.billing.text'] || 'pwa.openPay.transferencia.billing.text', 
          userID : this.state.cartHeaderDetails && this.state.cartHeaderDetails.gtmUserId || ''
      }
  GTMallPages(gtmObjectData)
 }

  /**
  * Fetching configuration data
  * @function getConfiguration
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTful service all to fetch configuration data.
  * 
  */
  getConfiguration = () => {
    Utility(Path.getConfiguration, 'GET').then(response => {
        if (response.data && response.data.status && response.data.status.status === "SUCCESS") {
            let {months} = this.state;
            let confgMonths = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.expirationmonth || [];
            months = Object.keys(confgMonths).map(key=>{
                const obj = confgMonths[key];
                const value = Object.keys(obj)[0];
                const name = obj[value];
                return {name,value}
            })
            this.setState({
               months
            });
        }
      }); 
   
  }
  

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.LoggedInSession !== this.state.loggedInUser) {
  //     this.setState({ loggedInUser: nextProps.cartHeaderDetails.isLoggedIn }, () => {
  //     })
  //   }
  // }

  /**
  * Method will call to fetch cart header details
  * @function getCartHeaderDetails
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTfull service call to fetch cart header details.
  * 
  */
  getCartHeaderDetails = () => {
    Utility(Path.getCartHeaderDetails, 'POST', {}).then(response => {
      if (response.status === 200) {
        if (response.data && response.data.status && response.data.status.status === "SUCCESS") {
          const cartHeaderResponse = response.data || {}
          this.setState({
            cartHeaderDetails: cartHeaderResponse.cartHeaderDetails || {},
            loggedInUser: cartHeaderResponse.cartHeaderDetails.isLoggedIn
          });
          this.props.loginDetails.check_login_status(response.data);
        }
      }
    }, (error) => {
      //  console.log("GET CART HEADER DETAILS ERROR..............: ",error);

    });
  }

  /**
  * Method will call to checkout night box availability status.
  * @function checkNightBoxAvailabilityStatus
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTfull service all to fetch night box availability status.
  * 
  */
  checkNightBoxAvailabilityStatus = () => {
    Utility(Path.checknightboxavailabilitystatus, 'POST', {}).then(response => {
      if(response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')){
          let data = response.data;
          const paypalAvailable = data.backendAvailable;
          if(!paypalAvailable && this.state.digitalInfo && !this.state.mainContent.showGiftInfoMsg) {
            this.setState({
              paypalAvailable: false
            });
          }else if(!paypalAvailable){
            const aleretMessage = this.state.staticLabelValues['pwa.payPal.nightBoxEnabled.alert.message'] || "pwa.payPal.nightBoxEnabled.alert.message"
            this.show_alert_message(aleretMessage, 'warning')
             this.setState({
              paypalAvailable: false
            });
          }
      }else {
         this.finalErrorHandling(response)
      }

    });
  }

  /**
  * Method will call to get payment methods
  * @function paymentMethodSelection
  * @author srinivasa.gorantla@zensar.com
  * @desc Making resfulservice all to fetch payment methods
  * @param {string} paymentType
  * 
  */
  paymentMethodSelection = (paymentType) => {
    Utility(Path.paymentmethodselection, 'POST',
      {
        "paymentMethod": paymentType
      }).then(response => {
        if (response && response.data && ((response.data.status && response.data.status.status==='success') || response.data.s === '0') && paymentType === 'CIEBancomer') {
          let data = {
            orderTotal: this.props.mainContent && this.props.mainContent.priceInfo && this.props.mainContent.priceInfo.Total || 0
          }
          Utility(Path.getCIEPaymentTypesInfo, 'POST', data).then(response1 => {
             if (response1 && response1.data && ((response1.data.status && response1.data.status.status==='success') || response1.data.s === '0')) {
              let { pagoEffectivo } = (response1.data && response1.data.openPayInfo) || {}
                    pagoEffectivo = pagoEffectivo || {}

              if (!pagoEffectivo.eligibleForTotal) {
                   const { onChangeBillingCTPayment } = this.props;
                   onChangeBillingCTPayment('spei')
              }
              if(response1 && response1.data) {
                  this.setState({
                    displayPayInfo: response1.data
                  })
              }
            }else {
               this.finalErrorHandling(response1)
            }
          });
        }else if(response && response.data && ((response.data.status && response.data.status.status==='success') || response.data.s === '0')){
   
        }else {
           this.finalErrorHandling(response)
        }
      });
  }

  // Custom Products functionality START
  isCustomProduct = () => {
    let customProducts = JSON.parse(localStorage.getItem('customProduct'));
    let skuIds = this.props.mainContent.itemInfo;

    if (!isEmpty(customProducts) && !isEmpty(skuIds)) {
      for (const e1 in skuIds) {
        if (e1 !== 's' || e1 !== 'EDDErrorMessages') {
          customProducts.forEach(e2 => {
            let myBagLength = this.props.mainContent.totalProductsCount;
            if (skuIds[e1].skuId === e2.sku) {
              this.setState(prevState => {
                return {
                  customProduct: true,
                  myCustomProductLength: prevState.myCustomProductLength + 1
                }
              }, () => {
                if ( myBagLength > this.state.myCustomProductLength ) {
                  this.setState({
                    noCustomProduct: true
                  })
                }
              })
            }
          })
        }
      }
    }
  }
  // Custom Products functionality START

  /**
  * Method will call on selection on payment tab
  * @function selectedPaymentTab
  * @author srinivasa.gorantla@zensar.com
  * @desc Showing alerty message dynamically based on the tab type. And updating tab selection.
  * @param {string} tabType
  * 
  */
  selectedPaymentTab = (tabType) => {
    const { selectedPaymentMethod } = this.props;
    this.setState({ 
        alert_status: false
    });
    this.multipleClicksAvoid(false)
    if (tabType === 'creditCard') {
      selectedPaymentMethod('creditCard');
      this.paymentMethodSelection('creditCard');
    }
    if (tabType === 'paypal') {
      if(this.state.paypalAvailable && this.state.isGiftCertificate){
        const aleretMessage= this.state.staticLabelValues["pwa.checkout.ebook_item_not_allowed.error.message"] || "pwa.checkout.ebook_item_not_allowed.error.message";
        this.show_alert_message(aleretMessage, 'warning')
      }
      selectedPaymentMethod('paypal');
      if(!this.state.paypalAvailable && !this.state.digitalInfo) {
          const aleretMessage = this.state.staticLabelValues['pwa.payPal.nightBoxEnabled.alert.message'] || "pwa.payPal.nightBoxEnabled.alert.message"
          this.show_alert_message(aleretMessage, 'warning')
      }
    }
    if (tabType === 'cash') {
      if(this.state.clickandcollect === 'ccd'){
        const aleretMessage = this.state.staticLabelValues['pwa.checkoutPageBilling.clickAndCollectDriveThru.alert.message'];
        this.show_alert_message(aleretMessage, 'warning')
        // Custom Products functionality START
      } else if(this.state.shippingAddressDetail && this.state.shippingAddressDetail.country == 'GT'){
        // Custom Products functionality START
        this.multipleClicksAvoid(true)
        var guatemala_error_message = this.state.staticLabelValues['pwa.checkoutPageBilling.guatemala.openpay.errorMsg'] ? this.state.staticLabelValues['pwa.checkoutPageBilling.guatemala.openpay.errorMsg'] : 'pwa.checkoutPageBilling.guatemala.openpay.errorMsg'
        this.show_alert_message(guatemala_error_message,'alert')
        // Custom Products functionality START
      } else if (this.state.customProduct) {
          if (this.state.noCustomProduct) {
            this.show_alert_message('Si deseas utilizar la forma de pago en efectivo, te solicitamos remover los artículos personalizados de tu bolsa..','alert')
          } else {
            this.show_alert_message('El pago en efectivo no está disponible con productos personalizados, para poder realizar esta compra, selecciona otro método de pago.','warning')
          }
          this.setState({
            cashIsAvailable: false
          });
          selectedPaymentMethod('cash');
      } else {
        // Custom Products functionality START
        selectedPaymentMethod('cash');
        this.paymentMethodSelection('CIEBancomer');
      }
    }
  }

  /**
  * Method will call on toggle checkout cash option
  * @function toggleCheckoutCash
  * @author srinivasa.gorantla@zensar.com
  * @desc On click on checkout cash tab, updating state with the values.
  * @param {object}
  * 
  */
  toggleCheckoutCash = (paymentType, id) => {
    const { paymentTypeSelection } = this.state;
    this.setState(prevState => {
      paymentTypeSelection[paymentType] = !prevState.paymentTypeSelection[paymentType]
      return { paymentTypeSelection }
    },()=>{
      this.toggleAnimation(id);
    });
  }

  /**
  * Method will call to show animation while switching tabs.
  * @function toggleAnimation
  * @author srinivasa.gorantla@zensar.com
  * @desc Dynamically adding and remove animation related css styles on switching tabs.
  * @param {string} id
  * 
  */
  toggleAnimation = (id) => {
      let ele = document.getElementById(id);
      if(ele){
        if(ele.style.maxHeight === '0px'){
            ele.style.maxHeight = ele.scrollHeight + 'px';
        }else{
            ele.style.maxHeight = '0px'
        }
      }
  }


  /**
  * Method will call when user clicks on CT payment radio button.
  * @function selectCTPaymentRadioButton
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating billing CT payment based on the selected payment type.
  * @param {string} paymentType
  * 
  */
  selectCTPaymentRadioButton = (paymentType) => {
    const { onChangeBillingCTPayment } = this.props;
    if (paymentType === 'spei') {
        onChangeBillingCTPayment('spei')
    } else if (paymentType === 'cash') {
        onChangeBillingCTPayment('cash')
    } else {
        onChangeBillingCTPayment('cie')

    }

  }

  /**
  * Method will call on click on continue button.
  * @function handleContinueFromBillingPPPage
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating all the user selection and Making RESTful service call to update payment method selection.
  * 
  */
  handleContinueFromBillingPPPage = () => {
    if (this.state.mainContent.showGiftInfoMsg && !this.state.loggedInUser) {
      if(!this.state.paypalAvailable && this.state.mainContent.showGiftInfoMsg){
        const aleretMessage= this.state.staticLabelValues["pwa.checkout.ebook_item_not_allowed.error.message"] || "pwa.checkout.ebook_item_not_allowed.error.message";
        this.show_alert_message(aleretMessage, 'warning')
      }else{
          const promise = this.refs.guestUserPersonalInfo.ValidateForm();
          promise.then(data => {
            this.multipleClicksAvoid(true);
            data.paymentMethod = 'paypal';
            if (data.mothersLastName === "") {
              delete data.mothersLastName;
            }else{
              data.maternalName = data.mothersLastName;
              delete data.mothersLastName;
            }
            if(data.selectedPaymentMethod){
              delete data.selectedPaymentMethod;
            }
            Utility(Path.paymentmethodselection, 'POST', data).then(response => {
              if (response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')) {
                this.gotoPromotionPage();
              }else{
                 this.multipleClicksAvoid(false);
                 this.finalErrorHandling(response)
              }
            })
          }, (error) => {
            this.multipleClicksAvoid(false);
            // console.log("Invalid loggedInUser SUBMIT========================= ", error);
          })
        }
    } else {
      if(!this.state.paypalAvailable && this.state.mainContent.showGiftInfoMsg){
        const aleretMessage= this.state.staticLabelValues["pwa.checkout.ebook_item_not_allowed.error.message"] || "pwa.checkout.ebook_item_not_allowed.error.message";
        this.show_alert_message(aleretMessage, 'warning')
      }else{
      //this.gotoPromotionPage();
        let data = {};
        data.paymentMethod = 'paypal';
        Utility(Path.paymentmethodselection, 'POST', data).then(response => {
          if (response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')) {
             this.gotoPromotionPage();
          }else {
             this.multipleClicksAvoid(false);
             this.finalErrorHandling(response)
          }
        })
    }
    }
  }
  /**
  * Method will call on click on continue button.
  * @function handleContinueFromBillingCIEPage
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating all the user selection and Making RESTful service call to update payment method selection.
  * 
  */
  handleContinueFromBillingCIEPage = () => {
    // Custom Products functionality START
    if (this.state.customProduct) {
      if (this.state.noCustomProduct) {
        this.show_alert_message('Si deseas utilizar la forma de pago en efectivo, te solicitamos remover los artículos personalizados de tu bolsa..','alert')
        return;
      } else {
        this.show_alert_message('El pago en efectivo no está disponible con productos personalizados, para poder realizar esta compra, selecciona otro método de pago.','warning')
        return;
      }
    }
    // Custom Products functionality START
    if (this.state.mainContent.showGiftInfoMsg && !this.state.loggedInUser) {
      const promise = this.refs.guestUserPersonalInfo.ValidateForm();
      promise.then(data => {
        this.multipleClicksAvoid(true);
        if (this.props.selectedPaymentType === 'spei') {
          data.selectedPaymentMethod = "Transferencia"
        } else if (this.props.selectedPaymentType === 'cash') {
          data.selectedPaymentMethod = "Efectivo";
        }
        if (data.mothersLastName === "") {
          delete data.mothersLastName;
        }else{
          data.maternalName = data.mothersLastName;
          delete data.mothersLastName;
        }
        Utility(Path.billingWithCIEBancomer, 'POST', data).then(response => {
          if (response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')) {
            this.gotoPromotionPage();
          }else {
             this.multipleClicksAvoid(false);
             this.finalErrorHandling(response)
          }
        })
      }, (error) => {
        // console.log("Invalid loggedInUser SUBMIT========================= ", error);
      })
    } else {
        this.multipleClicksAvoid(true);
        const {clickandcollect , ctclassName} = this.state;
            if(clickandcollect === 'ccd'){
               window.sessionStorage.setItem('ClickAndCollect','cc');
            }
            let data = {}
            if (this.props.selectedPaymentType === 'spei') {
              data.selectedPaymentMethod = "Transferencia"
            } else if (this.props.selectedPaymentType === 'cash') {
              data.selectedPaymentMethod = "Efectivo";
            } 
              Utility(Path.billingWithCIEBancomer, 'POST', data).then(response => {
                if(response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')){
                  this.gotoPromotionPage();
                }else {
                  this.multipleClicksAvoid(false);
                  this.finalErrorHandling(response)
                }
              });
    }

  }

  /**
  * Method will call on click on return button.
  * @function handleContinueFromBillingCIEPage
  * @author srinivasa.gorantla@zensar.com
  * @desc Dynamically redirecting page to cart/shipping page.
  * 
  */
  returnToShippingPage = () =>{
    if((this.state.digitalInfo && this.state.loggedInUser) || this.state.mainContent.showGiftInfoMsg){
        window.scrollTo(0, 0);
        const cameFromCart =  window.sessionStorage.getItem('cameFromCart');
        if(cameFromCart){
          window.sessionStorage.removeItem('cameFromCart');
          Router.push('/tienda/cart','/tienda/cart');
        }else{
          Router.push('/tienda/checkoutShipping','/tienda/checkoutShipping');
        }
    }else{
        window.scrollTo(0, 0);
        Router.push('/tienda/checkoutShipping','/tienda/checkoutShipping');
    }
  }

  /**
  * Method will call on success of payment API.
  * @function gotoPromotionPage
  * @author srinivasa.gorantla@zensar.com
  * @desc Redirecting from billing page to promotion page.
  * 
  */
  gotoPromotionPage = () => {
    window.scrollTo(0, 0);
    Router.push('/tienda/checkoutPromotion','/tienda/checkoutPromotion');
  }

  /**
  * Method will call to validate cvv max length
  * @function cvvMaxLengthHandleByCardType
  * @author srinivasa.gorantla@zensar.com
  * @desc Based on selected card type validating cvv max length. And updating month, year visibility status dynamically.
  * @param {string} value
  * @param {object} e
  * 
  */
  cvvMaxLengthHandleByCardType = (value, e) => {
    if(e.target.value === 'liverpool' || e.target.value === 'fabricasDeFrancia'){
        this.setState({ 
            monthYearShowOrHide: false
        })
    }else{
      if(e.target.value === 'americanExpress' || e.target.value === 'masterCard' || e.target.value === 'LPC' || e.target.value === 'visa'){
        this.setState({ 
            monthYearShowOrHide: true
        })
      }
    }
    if(e.target.value === 'liverpool' || e.target.value === 'fabricasDeFrancia' || e.target.value === 'americanExpress' || e.target.value === 'masterCard' || e.target.value === 'LPC' || e.target.value === 'visa'){
      this.setState({ 
          americanExpressCvv: value
      })
    }
  }

  /**
  * Method will call on click on mobile view back button
  * @function mobileViewBackButton
  * @author srinivasa.gorantla@zensar.com
  * @desc Handling mobile view back button and dynamically redirecting to proper page.
  * @param {string} url
  * 
  */
  mobileViewBackButton = (url) => {
    if(this.step2PaymentLoginRef && this.step2PaymentLoginRef.current && this.step2PaymentLoginRef.current.mobileViewBackButton){
      this.step2PaymentLoginRef.current.mobileViewBackButton(url)
    }else if(this.refs && this.refs.guestUserPersonalInfo && this.refs.guestUserPersonalInfo.mobileViewBackButton){
      this.refs.guestUserPersonalInfo.mobileViewBackButton(url);
    }
  }

  /**
  * Method will call to handle error scenario of API service
  * @function finalErrorHandling
  * @author srinivasa.gorantla@zensar.com
  * @desc Handling error scenario of RESTfull service call and redirecting page if session expires.
  * @param {object} response
  * 
  */
  finalErrorHandling = (response) =>{
      if (response && response.data && (response.data.errorCode === '1002' || response.data.errorCode === '1003')) {
        let logged = GetCookie('LoggedInSession');
        // let KeepMeSignIn = GetCookie('KeepMeSignIn');
        // if(logged && !KeepMeSignIn){
        //   Router.push('/tienda/login' + "?pageName=cart");
        // }else if(logged){
        //   Router.push('/tienda/cart');
        // }else{
        //   Router.push('/tienda/cart');
        // }
        if(logged){
            if(response.data.errorCode === '1002'){
                Router.push('/tienda/login' + "?pageName=cart");
            }else if(response.data.errorCode === '1003'){
                Router.push('/tienda/cart');
            }
        }else{
            Router.push('/tienda/cart');
        }
      }else if(response && response.data && (response.data.s === '1' || (response.data.status && response.data.status.status === 'failure'))){
          const aleretMessage= (response.data && response.data.s === '1')? response.data.err : (response.data && response.data.status && response.data.status.errorMessage)
          this.show_alert_message(aleretMessage, 'warning');
      }else{
          const aleretMessage= this.state.staticLabelValues['pwa.checkoutPageBilling.genericErrorMessage'] || "pwa.checkoutPageBilling.genericErrorMessage";
          this.show_alert_message(aleretMessage, 'warning');
      }
      
  }

  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */
  render() {
    const { pageName, ccclassName, ppclassName, ctclassName, isCashSelected, isCieSelected, isSpieSelected, cartHeaderDetails } = this.props;
    const { loggedInUser, paymentTypeSelection, paypalAvailable, displayPayInfo, window, alert_status, months,aleretMessage,alertColorType, isDesktop, clickandcollect, americanExpressCvv,monthYearShowOrHide, buttonDisabled, staticLabelValues, isGiftCertificate, toTop } = this.state;
    //const clickandcollect = window.sessionStorage && window.sessionStorage.getItem('ClickAndCollect') || 'cc';
    return (

      <React.Fragment>
          <Alert {...this.props}
              alertTopClass={toTop +" m-alert__container mdc-snackbar -alertCheckout -step1 -" + alertColorType}
              iconType={"a-alert__icon icon-" + alertColorType}
              text={aleretMessage}
              alert_status={alert_status}
              dismiss_alert={this.dismiss_alert}
              airTimeStyle="68px"
          />
        {
          (loggedInUser) ?

            <CheckoutStep2PaymentLogin
              ref={this.step2PaymentLoginRef}
              mainContent={this.state.mainContent}
              selectedPaymentTab={this.selectedPaymentTab}
              ccclassName={ccclassName}
              ppclassName={ppclassName}
              ctclassName={ctclassName}
              toggleCheckoutCash={this.toggleCheckoutCash}
              paymentTypeSelection={paymentTypeSelection}
              paypalAvailable={paypalAvailable}
              isCashSelected={isCashSelected}
              isCieSelected={isCieSelected}
              isSpieSelected={isSpieSelected}
              selectCTPaymentRadioButton={this.selectCTPaymentRadioButton}
              handleContinueFromBillingPPPage={this.handleContinueFromBillingPPPage}
              handleContinueFromBillingCIEPage={this.handleContinueFromBillingCIEPage}
              displayPayInfo={displayPayInfo}
              staticLabelValues={staticLabelValues}
              clickandcollect = {clickandcollect}
              dismiss_alert={this.dismiss_alert}
              alert_status={alert_status}
              months = {months}
              aleretMessage = {aleretMessage}
              returnToShippingPage = {this.returnToShippingPage}
              americanExpressCvv= {americanExpressCvv}
              cvvMaxLengthHandleByCardType = {this.cvvMaxLengthHandleByCardType}
              monthYearShowOrHide = {monthYearShowOrHide}
              multipleClicksAvoid = {this.multipleClicksAvoid}
              buttonDisabled = {buttonDisabled}
              gotoPromotionPage = {this.gotoPromotionPage}
              show_alert_message = {this.show_alert_message}
              cartHeaderDetails={cartHeaderDetails || {}}
              isGiftCertificate = {isGiftCertificate}
              toTop={toTop}
              alertColorType={this.state.alertColorType}
              finalErrorHandling={this.finalErrorHandling}
              isDesktop={isDesktop}
              // Custom Products functionality START
              cashIsAvailable={this.state.cashIsAvailable}
              customProduct={this.state.customProduct}
              // Custom Products functionality START
              {...this.props} />

            :

            <CheckoutStep2PaymentGuest ref="guestUserPersonalInfo"
              mainContent={this.state.mainContent}
              selectedPaymentTab={this.selectedPaymentTab}
              ccclassName={ccclassName}
              ppclassName={ppclassName}
              ctclassName={ctclassName}
              toggleCheckoutCash={this.toggleCheckoutCash}
              paymentTypeSelection={paymentTypeSelection}
              paypalAvailable={paypalAvailable}
              isCashSelected={isCashSelected}
              isCieSelected={isCieSelected}
              isSpieSelected={isSpieSelected}
              selectCTPaymentRadioButton={this.selectCTPaymentRadioButton}
              handleContinueFromBillingPPPage={this.handleContinueFromBillingPPPage}
              handleContinueFromBillingCIEPage={this.handleContinueFromBillingCIEPage}
              displayPayInfo={displayPayInfo}
              staticLabelValues={staticLabelValues}
              clickandcollect = {clickandcollect}
              dismiss_alert={this.dismiss_alert}
              alert_status={alert_status}
              months = {months}
              aleretMessage = {aleretMessage}
              returnToShippingPage = {this.returnToShippingPage}
              americanExpressCvv= {americanExpressCvv}
              cvvMaxLengthHandleByCardType = {this.cvvMaxLengthHandleByCardType}
              monthYearShowOrHide = {monthYearShowOrHide}
              multipleClicksAvoid = {this.multipleClicksAvoid}
              buttonDisabled = {buttonDisabled}
              gotoPromotionPage = {this.gotoPromotionPage}
              show_alert_message = {this.show_alert_message}
              cartHeaderDetails={cartHeaderDetails || {}}
              isGiftCertificate = {isGiftCertificate}
              toTop={toTop}
              alertColorType={this.state.alertColorType}
              finalErrorHandling={this.finalErrorHandling}
              isDesktop={isDesktop}
              // Custom Products functionality START
              cashIsAvailable={this.state.cashIsAvailable}
              customProduct={this.state.customProduct}
              // Custom Products functionality START
              {...this.props} />

        }




      </React.Fragment>
    );
  }
}

export default billingCommonPage;