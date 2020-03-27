/**
* Module Name : CheckoutStep4Confimation
* Functionality : Showing order confirmation templates.
* @exports : CheckoutStep4Confimation
* @requires : module:React
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/HrTag/HrTag
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Icons/Icons
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputRadio/MaterialInputRadio
* @requires : module:/molecules/Alert/Alerts
* @requires : module:/molecules/Flag/Flags
* @requires : module:/organisms/CheckoutStep4/Header
* @requires : module:/organisms/CheckoutStep4/ItemBlock
* @requires : module:/organisms/CheckoutStep4/PaymentDetailBlock
* @requires : module:/organisms/CheckoutStep4/OrderTotalBlock
* @requires : module:/organisms/CheckoutStep4/SignUpBlock
* @requires : module:/organisms/CheckoutStep4/StaticInfoBlock
* @requires : module:/organisms/CheckoutStep4/FailureItemBox
* @requires : module:/organisms/CheckoutStep4/Footer
* @requires : module:lodash/isEmpty
* @requires : module:/contexts/parentContext
* @requires : module:react-event-listener
* @requires : module:next/router
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:/organisms/CheckoutStep4/CieBlock
* @requires : module:lodash/map
* @requires : module:/helpers/confirmationToDashboard
* @requires : module:file-saver
* @requires : module:axios
* Team : Checkout Team
* Other information : The parent component which contains all checkout confirmation related files.
* 
*/
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import HrTag from '../../atoms/HrTag/HrTag';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import Alerts from '../../molecules/Alert/Alerts';
import Flags from '../../molecules/Flag/Flags';
import Header from './../../organisms/CheckoutStep4/Header'
import ItemBlock from './../../organisms/CheckoutStep4/ItemBlock'
import AddressBlock from './../../organisms/CheckoutStep4/AddressBlock'
import PaymentDetailBlock from './../../organisms/CheckoutStep4/PaymentDetailBlock'
import OrderTotalBlock from './../../organisms/CheckoutStep4/OrderTotalBlock'
import SignUpBlock from './../../organisms/CheckoutStep4/SignUpBlock'
import StaticInfoBlock from './../../organisms/CheckoutStep4/StaticInfoBlock'
import FailureItemBox from './../../organisms/CheckoutStep4/FailureItemBox'
import Footer from './../../organisms/CheckoutStep4/Footer'
import isEmpty from 'lodash/isEmpty';
import { parentContext } from '../../../contexts/parentContext';
import EventListener from 'react-event-listener';
import Router from 'next/router';
import { Utility, logError, logDebug, savePDF } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { UserAgentDetails, GTMallPages } from '../../../helpers/utilities/utility';
import CieBlock from '../../organisms/CheckoutStep4/CieBlock'
import map from 'lodash/map';
import confirmationToDashboard from "../../../helpers/confirmationToDashboard";
const FileSaver = require('file-saver');
const axios = require('axios');

/**
 * Method will call to get product list as array format.
 * @function getProducts
 * @author shreyansh.khare@zensar.com
 * @desc The product list which are coming in object, converting to array format.
 * @param {object} success
 * 
 */
  
const getProducts = (success) => {
  let listData = [];
  if (success && success.length > 0) {
    success.map((item) => {
      const packedList = item.deliveryInfo[0] ? item.deliveryInfo[0].packedList : item.deliveryInfo.packedList;
      packedList.map((packedItem) => {
        listData.push(packedItem)
      });
    })
  }
  return listData;
}

/**
* @class CheckoutStep4Confimation
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {
  constructor(props) {
    const { ItemDetails, orderSuccessTotal, orderSuccess, paymentDetail } = props.orderData || {};
    const { success } = ItemDetails || [];
    super(props);
    this.state = {
      window: '',
      skus: [],
      clickAndCollect: [],
      isClickAndCollect: null,
      itemsList: getProducts(success),
      orderSuccessTotal: orderSuccessTotal,
      paymentDetail: paymentDetail,
      orderSuccess: orderSuccess,
      showSaveAlert: false,
      alertToTop: '',
      success: success
    }
    this.clickAndCollect = '';
    this.changeFlagForAddress = false;
    this.axios_index = 0;
  }

  /**
  * Method will call to set Click and collect
  * @function setClickAndCollect
  * @author shreyansh.khare@zensar.com
  * @desc Based on the click and collect status updating state value.
  * @param {object} array
  * 
  */
  setClickAndCollect = (array) => {
    if (this.state.isClickAndCollect) {
      this.setState({ clickAndCollect: array })
    }
  }
  // sendClickAndCollectData = () => {
  //   this.state.clickAndCollect.forEach((data) => {

  //     axios.post(`https://us-central1-clickcollectbycarqa.cloudfunctions.net/addTicket/`, { data })
  //       .then(res => {
  //         console.log('res', res);
  //       })
  //   })
  // }

  /**
   * REACT life cycle Event. Method will call on component load.
   * @event componentDidMount 
   * 
   */
  componentDidMount() {
    if(Router && Router.router && Router.router.asPath && Router.router.asPath.indexOf('tienda/checkout/payment/process3DSResponse') !== -1){
        Router.push('/tienda/checkoutOrderConfirmation','/tienda/checkoutOrderConfirmation');
    }

    if(!this.props.orderData){
        Router.push('/tienda/cart','/tienda/cart');
    }

    if (typeof window !== 'undefined'){
      this.setState({ isClickAndCollect: window.sessionStorage.getItem('ClickAndCollect') });
      this.setState({ window: window });
      this.setState({ document: document });
      window.swogoDependencies = { getSkus: this.getSkusInfoForSWOGO, getPage: this.getSWOGOPageIdentifier, getOrderId: this.getOrderId };
    }

    this.clickAndCollectThirdParty()
    this.confirmationToDashboardFunc();
    this.gtmCheckoutOrderConfirmDetail();
    this.getAllPageEvent();

  }

  /**
  * Method will call on window scroll
  * @function handleWindowScroll
  * @author shreyansh.khare@zensar.com
  * @desc Handling window scroll
  * @param {object}
  * 
  */
  handleWindowScroll = (e) => {
      this.handleScrollAlert(e);
  }

  /**
  * Method will call to dynamically add styles.
  * @function handleScrollAlert
  * @author shreyansh.khare@zensar.com
  * @desc Based on the scroll position adding toTop class to the alert.
  * 
  */
  handleScrollAlert = () => {
      try {
          if (window.scrollY >= 117) {
              this.setState({ alertToTop: '-toTop' });
          }
          else {
              this.setState({ alertToTop: '' });
          }
      } catch (e) { }
  }


  /**
  * Method will use to call dash board get data function
  * @function confirmationToDashboardFunc
  * @author shreyansh.khare@zensar.com
  * @desc  To call dash board get data function
  * 
  */
  confirmationToDashboardFunc = () => {
    const dashboard = new confirmationToDashboard();
    dashboard.getData(this.props, window);
    dashboard.getDataCustomProduct(this.props, window, this.state.skus);
  }


  /**
  * Method will call on success of API call
  * @function success_apicalls
  * @author shreyansh.khare@zensar.com
  * @desc handling DRIVETHRU API success response
  * @param {object} obj
  * 
  */
  success_apicalls = (obj) => {
    const { success } = this.state;
    let item = success[this.axios_index];
    obj.s = '';
    obj.q = '';
    obj.tal = item.terminal;
    obj.bta = item.lpChargeNbr;
    obj.bia = item.CCAuthorization;
    if (item.CodigoFacturacion) {
      obj.fon = item.CodigoFacturacion;
    }
    if (item.itemType === 'Digital' && item.DigitalReference) {
      obj.po = item.DigitalReference;
    } else if (item.trackingNumber) {
      obj.po = item.trackingNumber;
    } else if (item.telcoAuthorization) {
      obj.po = item.telcoAuthorization;
    } else {
      obj.po = ''
    }
    const packedList = item.deliveryInfo[0] ? item.deliveryInfo[0].packedList : item.deliveryInfo.packedList;
    for (var i in packedList) {
      let packedItem = packedList[i];
      if (obj.s) {
        obj.s = obj.s + ',' + packedItem.sku;
      } else {
        obj.s = packedItem.sku;
      }

      if (obj.q) {
        obj.q = obj.q + ',' + packedItem.quantity;
      } else {
        obj.q = packedItem.quantity;
      }
    }
    this.serviceCall(obj, () => {
      this.success_apicalls(obj);
    })
  }

  /**
  * Method will make drive thru api calls
  * @function serviceCall
  * @author shreyansh.khare@zensar.com
  * @desc Making DRIVETHRU RESTfull service calls
  * @param {object}
  * 
  */
  serviceCall = (obj, cb) => {
    let DRIVETHRU =this.props.DRIVETHRU
    axios({
      method: 'POST',
      url: DRIVETHRU,
      headers: { 'content-type': 'text/plain' },
      data: obj
    }).then((response) => {
      const { success } = this.state;
      if (this.axios_index < success.length - 1) {
        this.axios_index++;
        cb();
      }
    }).catch((error) => {
      const { success } = this.state;
      if (this.axios_index < success.length - 1) {
        this.axios_index++;
        cb();
      }
    })
  }

  /**
  * Method will call on page load
  * @function clickAndCollectThirdParty
  * @author shreyansh.khare@zensar.com
  * @desc Receiving data from the order delivery addres details.
  * 
  */
  clickAndCollectThirdParty = () => {
    let clickAndCollectSessionValue = sessionStorage.getItem("ClickAndCollect");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (clickAndCollectSessionValue === "ccd") {

      let { itemsList, digitalOrTrackOrTelReference, success} = this.state;
      let obj = {};
      let orderSuccess = this.props.orderData && this.props.orderData.ItemDetails && this.props.orderData.ItemDetails.success;
      let street = this.props.orderData && this.props.orderData.deleveryAddressDetail && this.props.orderData.deleveryAddressDetail.address1;
      let firstName = this.props.orderData && this.props.orderData.deleveryAddressDetail && this.props.orderData.deleveryAddressDetail.firstName;
      let lastName = this.props.orderData && this.props.orderData.deleveryAddressDetail && this.props.orderData.deleveryAddressDetail.lastName;
      let customerName = firstName + " " + lastName;
      obj.ta = street;
      obj.ne = customerName;
      obj.fon = "";
      obj.s = '';
      obj.q = '';
      obj.fa = GetFormattedDate();
      // map(orderSuccess, (item, index) => {
      //   obj.tal = item.terminal;
      //   obj.bta = item.lpChargeNbr;
      //   obj.bia = item.CCAuthorization;
      // })
      if (success && success.length > 0) {
        this.success_apicalls(obj);
      }

    }

    /**
    * Method will call on
    * @function GetFormattedDate
    * @author shreyansh.khare@zensar.com
    * @desc Sending current date as string
    * @returns {string} *
    * 
    */
    function GetFormattedDate() {
      var date = new Date();
      const year = date.getFullYear();
      let month = monthNames[date.getMonth()];
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      if (month < 10) {
        month = `0${month}`;
      }
      return day + "/" + month + "/" + year;
    }
  }


  /**
	* Method will call to set gtmdata
	* @function gtmCheckoutOrderConfirmDetail
  * @author shreyansh.khare@zensar.com
	* @desc Setting all the required data to dataLayer.
	* 
	*/

  gtmCheckoutOrderConfirmDetail = () => {
    let products = [];
    let { itemsList } = this.state;
    let getSellerName = (this.state && this.state.window && this.state.window.location && this.state.window.location.host) || (window && window.location && window.location.host) || '';
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
    if (itemsList && itemsList.length > 0) {
      for (var i in itemsList) {
        let item = {};
        item.name = itemsList[i].displayName;
        item.id = itemsList[i].productId;
        item.variant = 'N/A';
        item.quantity = itemsList[i].quantity;
        item.price = itemsList[i].salePrice && itemsList[i].salePrice.toString() || '';
        item.brand = itemsList[i].brand || '';
        item.category = itemsList[i].L1Category || '';
        item.dimension27 = itemsList[i].clothingSize || itemsList[i].dimensions || '';
        item.dimension28 = itemsList[i].clothingColor || '';
        item.dimension36 = (itemsList[i].sellerName && 'Market Place - ' + itemsList[i].sellerName) || sellerNameHardCode;
        item.dimension40 = itemsList[i] && itemsList[i].sellerName && itemsList[i].sellerSkuId ? itemsList[i].sellerSkuId : itemsList[i].sku || '';
        item.dimension41 = itemsList[i].material || 'N/A';
        item.dimension42 = itemsList[i].texture || 'N/A';
        item.dimension43 = 'N';
        item.metric3 = itemsList[i].discountAmount && itemsList[i].discountAmount.toString()|| '';
        item.metric2 = itemsList[i].listPrice && itemsList[i].listPrice.toString() || ''
        products.push(item);
      }
    }

    let trackingNumber = '';
    let productCouponCode = '';
    let orderId = this.props && this.props.orderId;
    orderId = orderId && orderId.substring(1);

    if (this.props.orderData && this.props.orderData.ItemDetails && this.props.orderData.ItemDetails.success.length) {
      trackingNumber = this.props.orderData && this.props.orderData.ItemDetails && this.props.orderData.ItemDetails.success && this.props.orderData.ItemDetails.success[0].trackingNumber || '';
      productCouponCode = this.props.orderData.ItemDetails.success && this.props.orderData.ItemDetails.success[0] && this.props.orderData.ItemDetails.success[0].deliveryInfo && this.props.orderData.ItemDetails.success[0].deliveryInfo[0] && this.props.orderData.ItemDetails.success[0].deliveryInfo[0].packedList;
      let listProperty = '';
      if (productCouponCode) {
        for (var i = 0; i < productCouponCode.length; i++) {
          if (productCouponCode[i].couponName) {
            listProperty = listProperty && listProperty !== '' ? listProperty + '-' + productCouponCode[i].couponName : productCouponCode[i].couponName;
          }
        }
      }

      try {

        dataLayer.push({
          'event': 'purchase',
          'couponAmount': this.state && this.state.orderSuccessTotal && this.state.orderSuccessTotal.couponDiscount || '',
          'ecommerce': {
            'purchase': {
              'actionField': {
                'id': orderId || '',   // need clarity    // Transaction ID. Required for purchases.
                'affiliation': (this.state.paymentDetail && this.state.paymentDetail.creditCardType) || this.state.paymentDetail['Forma de pago'] || '',
                'revenue': (this.state.orderSuccessTotal && this.state.orderSuccessTotal.orderTotal) || '',    // Total transaction value (incl. tax and shipping)
                'coupon': listProperty || '' // Need clarity
              },
              'products': products
            }
          }

        });
      } catch (t) {
        logError(t);
      }

    }
  }




  /**
  * Method will return order id
  * @function getOrderId
  * @author shreyansh.khare@zensar.com
  * @desc If order id exits will return order id otherwise empty string.
  * @returns {string} orderId
  * 
  */
  getOrderId = () => {
    return this.props.orderId ? this.props.orderId : '';
  }


  /**
  * Method will call to get cookie details
  * @function getCookies
  * @author shreyansh.khare@zensar.com
  * @desc Returning cookie details
  * @returns {function} unescape
  * 
  */
  getCookies = (c_name) => {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == c_name) {
        return unescape(y);
      }
    }
  }


  /**
  * Method will call to call GTMallPages function
  * @function getAllPageEvent
  * @author shreyansh.khare@zensar.com
  * @desc Creating payload and calling GTMallPages function
  * @param {object}
  * 
  */
  getAllPageEvent = () => {
    let payload = {
      "actPageTitle": 'checkoutOrderConfirmation',
      "loginStatus": this.props.orderData && this.props.orderData.loggedInUser === 'false' ? 'N' : 'Y',
      "actURL": window.location.href
    }
    GTMallPages(payload);
  }


  /**
  * Method will call to set skus
  * @function setSkus
  * @author shreyansh.khare@zensar.com
  * @desc Update state with skus value
  * @param {object} skus
  * 
  */
  setSkus = (skus) => {
    this.setState({ skus })
  }

  /**
  * Method will return skus data
  * @function getSkusInfoForSWOGO
  * @author shreyansh.khare@zensar.com
  * @desc It will return skus data
  * 
  */
  getSkusInfoForSWOGO = () => {
    return this.state.skus;
  }

  /**
  * Method will call to return device type
  * @function getSWOGOPageIdentifier
  * @author shreyansh.khare@zensar.com
  * @desc Returning device type
  * @param {string} *
  * 
  */
  getSWOGOPageIdentifier = () => {
    const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
    //console.log("window mobile is "+isMobile +"  destop is "+isDesktop);
    if (isMobile) {
      return "mobilePayment-0";
    }
    return "payment-0";
  }

  /**
  * Method will constructt pdf data
  * @function downloadPdf
  * @author shreyansh.khare@zensar.com
  * @desc Creting pdf data from order data.
  * 
  */
  downloadPdf = () => {
    let pdfData = {
      "orderId": this.props.orderId || '',
      "email": this.props.orderData.email || '',
      "paymentMethod": '',
      "cieReferenceNum": ''
    }
    if (this.state.paymentDetail && this.state.paymentDetail['Forma de pago'] && typeof this.state.paymentDetail['Forma de pago'] !== 'undefined') {
      if (this.state.paymentDetail['Forma de pago'] === 'Transferencia') {
        pdfData.cieReferenceNum = this.state.orderSuccessTotal.cieBancomerReference;
        pdfData.paymentMethod = 'OPENPAY_TRANSFER';
      }
      if (this.state.paymentDetail['Forma de pago'] === 'Efectivo') {
        pdfData.cieReferenceNum = this.state.orderSuccessTotal.cieBancomerReference;
        pdfData.paymentMethod = 'OPENPAY_STORE';
      }
      if (JSON.stringify(this.state.paymentDetail['Forma de pago']).indexOf('CIE') > -1 &&
        JSON.stringify(this.state.paymentDetail['Forma de pago']).indexOf('Bancomer') > -1) {
        pdfData.cieReferenceNum = this.state.orderSuccessTotal.cieBancomerReference;
        pdfData.paymentMethod = 'cie';
      }

    }
    this.downloadPDFHandler(pdfData);






    // Utility(Path.downloadTicket, 'POST', pdfData).then(response => {
    //     let base64 = response.data.fileByteContent;
    //     if(base64){
    //         if (base64.charAt(base64.length - 1) === "'") {
    //             base64 = response.data.fileByteContent.substr(0, response.data.fileByteContent.length - 1);
    //         }
    //         var binary = atob(base64);
    //         var len = binary.length;
    //         var buffer = new ArrayBuffer(len);
    //         var view = new Uint8Array(buffer);
    //         for (var i = 0; i < len; i++) {
    //             view[i] = binary.charCodeAt(i);
    //         }

    //         var blob = new Blob([view], { type: "data:application/pdf;base64" });
    //         FileSaver.saveAs(blob, pdfData.orderId+'.pdf');
    //     }
    // }, (error) => {
    //     console.log(error);
    // });
  }


  /**
  * Method will call on click of download pdf icon
  * @function downloadPDFfromIcon
  * @author shreyansh.khare@zensar.com
  * @desc Creating pdf data on click of icon and calling downlaodPDFHandler function.
  * @param {object}
  * 
  */
  downloadPDFfromIcon = () => {
    let pdfDataForPrePayment = {
      "orderId": this.props.orderId || '',
      "email": this.props.orderData.email || '',
      "paymentMethod": ' ',
      "cieReferenceNum": ' '
    }
    this.downloadPDFHandler(pdfDataForPrePayment);
  }

  /**
  * Method will download the pdf file.
  * @function downloadPDFHandler
  * @author shreyansh.khare@zensar.com
  * @desc Downloading pdf data by using savePDF module.
  * @param {object} pdfData
  * 
  */
  downloadPDFHandler = async (pdfData) => {

    const body = await Utility(Path.downloadTicket, 'POST', pdfData);
    //  console.log('body',body);
    let base64 = body.data.fileByteContent;
    if (base64) {
      if (base64.charAt(base64.length - 1) === "'") {
        base64 = response.data.fileByteContent.substr(0, response.data.fileByteContent.length - 1);
      }
      var binary = atob(base64);
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }
       let fileName= Math.floor(Math.random() * 20);
       savePDF([view], pdfData.orderId+fileName + '.pdf');
      // var blob = new Blob([view], { type: "data:application/pdf;base64" });
      // var blob = new Blob([view], { type: "data:application/octet-stream" });
      // FileSaver.saveAs(blob, pdfData.orderId+fileName + '.pdf');
    }
  }

  /**
  * Method will redirect page
  * @function redirectToOrderHistory
  * @author shreyansh.khare@zensar.com
  * @desc Based on the login status dynamically redirecting page.
  * @param {object}
  * 
  */
  redirectToOrderHistory = (logInStatus) => {
    if (logInStatus === 'true') {
      Router.push('/tienda/users/orderHistory');
    } else {
      Router.push('/tienda/users/trackOrders');
    }
  }

  /**
  * Method will call to add multiple items to wish list
  * @function addMultipleItemsToWishlist
  * @author shreyansh.khare@zensar.com
  * @desc Making RESTful service call to add multiple items to wish list.
  * 
  */
  addMultipleItemsToWishlist = () => {
    this.setState({
      showSaveAlert: false
    })
    let items = []
    let failure = this.props.orderData.ItemDetails.failure;

    failure.forEach((data) => {
      for (let key in data) {
        data[key].CommerceItems.map((item) => {
          let i = {
            sku: item.sku,
            productId: item.productId
          }
          items.push(i);
        })
      }
    });

    Utility(Path.addMultipleItemsToWishlist, 'POST', { products: items }).then(response => {
      //     console.log('response', response);
      // <Alerts options={saveMessage} />
      this.setState({
        showSaveAlert: true
      });
    }, (error) => {
      logError(error);
    });
  }

  /**
  * Method will redirect to home page.
  * @function redirectToHome
  * @author shreyansh.khare@zensar.com
  * @desc Redirecting to home page
  * 
  */
  redirectToHome = () => {
    // Router.push('/tienda/home')
    let redirectionHost = window.location.origin + '/tienda/home';
    location.assign(redirectionHost);
  }

  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */
  render() {

    const viewPort = UserAgentDetails(this.state.window);
    logDebug('viewPort', viewPort);

    let saveMessage = {
      type: 'm-alert__container mdc-snackbar -success -alertCheckout mdc-snackbar--open -static',
      text: 'Se han agregado exitosamente tus productos a tu lista de guardados',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-done',
      alertToTop: this.state.alertToTop,
      pClass:'dss',
      link: this.state.window && this.state.window.location && this.state.window.location.origin + '/tienda/cart'
    }
    // const viewPort = {};
    // viewPort.isMobile = false;
    let checkSuccesssLength = this.props && this.props.orderData && this.props.orderData.ItemDetails && this.props.orderData.ItemDetails.success;
    var checkProductLength = [];
    if (checkSuccesssLength) {
      checkProductLength = checkSuccesssLength.filter(p => p.itemType === "Digital").length
    }

    if (checkSuccesssLength && checkSuccesssLength.length === checkProductLength) {
      this.changeFlagForAddress = true;
    }
    let totalProductCount; // = this.props.orderData.ItemDetails.success.length;
    let productCountForSUbtotal = 0;
    const swogoScript = this.props.swogoEndPoint || '';
    totalProductCount = this.state.skus;
    if (totalProductCount.length !== 0) {
      for (var i = 0; i < totalProductCount.length; i++) {
        productCountForSUbtotal = productCountForSUbtotal + totalProductCount[i].quantity
      }
    } else {
      productCountForSUbtotal = 0
    }
    const { ItemDetails, email, purchaseDate, deleveryAddressDetail, paymentDetail, orderSuccessTotal, orderSuccess } = this.props.orderData || {};

    const { staticLabels,configurationData } = this.props;
    const logInStatus = this.props.orderData && this.props.orderData.loggedInUser || 'false';
    const itemDetails = ItemDetails;
    const facturaDetails = ItemDetails && itemDetails.facturaDetails ? itemDetails.facturaDetails : {};
    const nightBox = this.props && this.props.orderData && this.props.orderData.nightBoxMessage;
    let openPayFlag = false;
    if (paymentDetail && paymentDetail['Forma de pago'] && typeof paymentDetail['Forma de pago'] !== 'undefined') {
      if (paymentDetail['Forma de pago'] === 'Transferencia') {
          openPayFlag = true;
      }
      if (paymentDetail['Forma de pago'] === 'Efectivo') {
         openPayFlag = true;
      }
      if (JSON.stringify(paymentDetail['Forma de pago']).indexOf('CIE') > -1 &&
        JSON.stringify(paymentDetail['Forma de pago']).indexOf('Bancomer') > -1) {
        openPayFlag = true;
      }

    }

    let grFlag = false;
    if(itemDetails && itemDetails.success){
    const resultForGRItem = itemDetails.success.filter(word => word.shoppingType === 'Gift Registry');
     if(resultForGRItem.length === itemDetails.success.length){
       grFlag = true;
     } 
    }
    // const nightOrderNumber = this.props && this.props.orderData && this.props.orderData && this.props.orderData.orderSuccessTotal && this.props.orderData.orderSuccessTotal.nightOrderReferenceNumber !== '';
    // console.log('nightOrderReferenceNumber',nightOrderNumber);
    

    let warnings = {
      type: 'm-alert__container mdc-snackbar -alert -alertCheckout mdc-snackbar--open -static ',
      text: staticLabels && staticLabels['pwa.orderConfirmationPage.unCollectedNChargedPreSaleMsg.label'] ? staticLabels['pwa.orderConfirmationPage.unCollectedNChargedPreSaleMsg.label'] : "pwa.orderConfirmationPage.unCollectedNChargedPreSaleMsg.label",
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-error',
      alertToTop: this.state.alertToTop,
      step4alert:'step4-alert'
    }

      let warningsUncollected = {
      type: 'm-alert__container mdc-snackbar -warning -alertCheckout mdc-snackbar--open -static ',
      text:'Lo sentimos, tu compra no se pudo procesar correctamente, si requieres una aclaración favor de comunicarte con nosotros.',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-warning',
      alertToTop: this.state.alertToTop,
      step4alert:'step4-alert'
    }

    let digitalValues = []
    !isEmpty(ItemDetails && ItemDetails.success) && map(ItemDetails.success, (item) => {
      digitalValues.push(item.itemType)
    })
    let digitalFlag = digitalValues.every(v => v === 'Digital')
    

    let confirmation = {
      aHref: "#",
      aClass: "a-box__btnConfirm",
      iconClass: "icon-download pr-2",
      spanText: "Descargar confirmación"
    }
    let textHeadlineText = staticLabels && staticLabels['pwa.orderSuccessPage.purchase.details.text'] ? staticLabels['pwa.orderSuccessPage.purchase.details.text'].toLowerCase() :'';
    let textHeadlineTextA = !openPayFlag ?'Detalles de tu compra':textHeadlineText.charAt(0).toUpperCase() + textHeadlineText.slice(1);
    let flag3DS = ItemDetails && itemDetails.chargedAndUncollected && itemDetails.chargedAndUncollected.length > 0 ? true : false;
    return (
      <React.Fragment>
        <EventListener target="window" onScroll={this.handleWindowScroll} />
        <parentContext.Consumer>
          {({ loginDetails }) => (
            <React.Fragment>
              <script defer="" type="text/javascript" src={swogoScript}></script>
              <div>
                <Header deleveryAddressDetail={deleveryAddressDetail} itemDetails={itemDetails} alertToTop={this.state.alertToTop} email={email} paymentDetail={paymentDetail} nightBox={nightBox} orderSuccessTotal={orderSuccessTotal} staticLabels={staticLabels} downloadPdf={this.downloadPdf} window={this.state.window} flag3DS={flag3DS} checkoutHeaderData={this.props.checkoutHeaderData}/>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <HeadlineSpan headLineClass="a-checkout__purchaseDetail -headingMargin" textHeadline={textHeadlineTextA + ': '} spanClassname="-bold" text={purchaseDate} />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between mb-3">

                
                      <div className="col-6">
                    {itemDetails && itemDetails.success && itemDetails.success.length && !grFlag?
                        <Label className="a-checkout__titleResume">{digitalFlag ? staticLabels['pwa.orderConfirmationPage.TusProctos.text'] + ' digitales':staticLabels['pwa.orderConfirmationPage.TusProctos.text']}</Label>
                    : null}
                      </div>
                      

                    <div className="col-3 text-right d-none d-lg-block">
                      <Link onClick={this.downloadPDFfromIcon} className="a-checkout__btnOptions icon-download pr-3"></Link>
                    </div>
                  </div>
                  <div className="m-productList">
                    {itemDetails && itemDetails.success && itemDetails.success.map((item, index) => <ItemBlock key={index} staticLabels={staticLabels} purchaseDate={purchaseDate} skus={this.state.skus} clickAndCollect={this.state.clickAndCollect} setClickAndCollect={this.setClickAndCollect} deleveryAddressDetail={deleveryAddressDetail} setSkus={this.setSkus} itemData={item} facturaDetails={facturaDetails} orderSuccessTotal={orderSuccessTotal} />)}
                  </div>
                  {((itemDetails && !isEmpty(itemDetails.failure)) || itemDetails && itemDetails.chargedAndUncollected && itemDetails.chargedAndUncollected.length > 0)  &&
                    <React.Fragment>
                      {this.state.showSaveAlert ?
                        <div className="row">
                          <div className="col-md-12">
                            <Alerts options={saveMessage} />
                          </div>
                        </div>
                        : ''}
                      <div className="row align-items-center justify-content-between mb-3 mt-5">
                        <div className="col-lg-6 col-12">
                          {!flag3DS ?<Label className="a-checkout__titleResume -failPayment">Artículos no cobrados</Label>:''}
                          {(itemDetails && !isEmpty(itemDetails.chargedAndUncollected) && !isEmpty(itemDetails.chargedAndUncollected[0]['CommerceItems'])) && <Label className="a-checkout__titleResume">{digitalFlag ? staticLabels['pwa.orderConfirmationPage.TusProctos.text']:''}</Label>}
                        </div>
                        {logInStatus === 'true' && !flag3DS ?
                          <div className="col-lg-3 col-12 pt-lg-0 pt-3">
                            <Button onClick={this.addMultipleItemsToWishlist} className="a-btn a-btn--tertiary">Guardar para más tarde</Button>
                          </div>
                          : null}
                      </div>
                      {(itemDetails && !isEmpty(itemDetails.failure) && !isEmpty(itemDetails.success) && logInStatus ===  'true') ?
                        <div className="row">
                          <div className="col-md-12" style={{ left: '0%' }}>
                            <Alerts options={warnings} style={{ width: '100%' ,position:'static'}} />
                          </div>
                        </div>
                        : null
                      }
                           {ItemDetails && itemDetails.chargedAndUncollected && itemDetails.chargedAndUncollected.length > 0 ?
                        <div className="row">
                          <div className="col-md-12" style={{ left: '0%' }}>
                            <Alerts options={warningsUncollected} style={{ width: '100%' ,position:'static'}} />
                          </div>
                        </div>
                        : null
                      }
                    </React.Fragment>
                  }
                  {
                    (itemDetails && !isEmpty(itemDetails.failure)) &&
                    itemDetails.failure.map((data, index) => <FailureItemBox key={index} staticLabels={staticLabels} skus={this.state.skus} setSkus={this.setSkus} clickAndCollect={this.state.clickAndCollect} setClickAndCollect={this.setClickAndCollect} data={data} />)
                  }
                  {
                    (itemDetails && !isEmpty(itemDetails.chargedAndUncollected) && !isEmpty(itemDetails.chargedAndUncollected[0]['CommerceItems'])) &&
                    itemDetails.chargedAndUncollected[0]['CommerceItems'].map((data, index) => <FailureItemBox key={index} staticLabels={staticLabels} skus={this.state.skus} setSkus={this.setSkus} clickAndCollect={this.state.clickAndCollect} setClickAndCollect={this.setClickAndCollect} data={data} chargedAndUncollected={'chargedAndUncollected'} commerceItems={itemDetails.chargedAndUncollected[0]}/>)
                  }

                  <div className="row align-items-start mt-3">
                    <div style={{ marginTop: this.changeFlagForAddress === true ? '4.2rem' : 'none' }} className="col-lg-6 col-12">
                      {!isEmpty(deleveryAddressDetail) && this.changeFlagForAddress === false ?
                        <AddressBlock staticLabels={staticLabels} isClickAndCollect={this.state.isClickAndCollect} deleveryAddressDetail={deleveryAddressDetail} paymentDetail={this.props.orderData.paymentDetail} />
                        : null}
                      {!viewPort.isMobile ? <StaticInfoBlock staticLabels={staticLabels} orderData={this.props.orderData} viewPort={viewPort} /> : null}
                    </div>
                    <div className="col-lg-6 col-12">
                      <PaymentDetailBlock staticLabels={staticLabels} paymentDetail={paymentDetail} orderSuccessTotal={orderSuccessTotal} configurationData={configurationData}/>
                      <OrderTotalBlock orderSuccessTotal={orderSuccessTotal} staticLabels={staticLabels || {}} orderSuccess={orderSuccess || {}} totalProductCount={productCountForSUbtotal || {}} />
                      {paymentDetail && paymentDetail['Forma de pago'] && paymentDetail['Forma de pago'].trim().toLowerCase() === "Pago: CIE Bancomer".trim().toLowerCase() &&
                        <CieBlock orderSuccessTotal={orderSuccessTotal}  hostname={this.props.hostname}/>
                      }
                      {logInStatus === 'false' ? <SignUpBlock staticLabels={staticLabels} orderData={this.props.orderData} /> : ''}
                      <div className="m-box mb-4 -boxUnshatter p-lg-0">
                        <div className="row align-items-center justify-content-end flex-column-reverse flex-lg-row">
                          <div className="col-lg-4 col-12 text-center d-lg-none d-block"><a onClick={this.downloadPDFfromIcon} className="a-box__btnConfirm" href="#"><i className="icon-download pr-2"></i><span>Descargar confirmación</span></a>
                          </div>
                          <hr className="w-100 mt-3 mb-3 d-lg-none d-block" />
                          <div className="col-xl-4 col-lg-6">
                            <Button className="a-btn a-btn--tertiary" onClick={() => { window.scrollTo(0, 0); this.redirectToOrderHistory(logInStatus) }}>Ir a mis pedidos</Button>
                          </div>
                          <div className="col-xl-4 col-lg-6 pb-3 pb-lg-0">
                            <Button onClick={this.redirectToHome} className="a-btn a-btn--primary">Continuar comprando</Button>
                          </div>
                        </div>
                      </div>
                      {viewPort.isMobile ? <StaticInfoBlock staticLabels={staticLabels} orderData={this.props.orderData} viewPort={viewPort} /> : null}





                    </div>
                  </div>
                </div>
              </div>

            </React.Fragment>
          )}
        </parentContext.Consumer>
      </React.Fragment>

    )
  }
}
