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
import Header from './../../organisms/CheckoutStep4/HeaderAirtTime'
import ItemBlockAirtime from './../../organisms/CheckoutStep4/ItemBlockAirtime'
import PaymentDetailBlock from './../../organisms/CheckoutStep4/PaymentDetailBlock'
import StaticInfoBlock from './../../organisms/CheckoutStep4/StaticInfoBlockAirtime'
import OrderTotalBlock from './../../organisms/CheckoutStep4/OrderTotalBlockAirtime'
import FailureItemBox from './../../organisms/CheckoutStep4/FailureItemBox'
import Footer from './../../organisms/CheckoutStep4/Footer'
import isEmpty from 'lodash/isEmpty';
import { parentContext } from '../../../contexts/parentContext';
import Router from 'next/router';
import { Utility, logError, logDebug } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { UserAgentDetails, GTMallPages } from '../../../helpers/utilities/utility';
import CieBlock from '../../organisms/CheckoutStep4/CieBlock'
import map from 'lodash/map';
import confirmationToDashboard from "../../../helpers/confirmationToDashboard";
const FileSaver = require('file-saver');
const axios = require('axios');

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
      orderSuccessTotal: orderSuccessTotal,
      paymentDetail: paymentDetail,
      orderSuccess: orderSuccess,
      showSaveAlert: false,
      success: success,
      airTimeDataItem: [],
      airTimeDataItem2: [],
    }
    this.clickAndCollect = '';
    this.changeFlagForAddress = false;
    this.airTimeDataItem = [],
      this.airTimeDataItem2 = []
  }

  componentDidMount() {
    if (this.state.success && this.state.success.length > 0) {
      this.state.success.map((item) => {
        if (item.shippingGroupId) {
          this.airTimeDataItem.push(item)
        } else {
          this.airTimeDataItem2.push(item)

        }
      })
    }
    this.setState({ airTimeDataItem: this.airTimeDataItem, airTimeDataItem2: this.airTimeDataItem2 })

  }
  setClickAndCollect = (array) => {
    if (this.state.isClickAndCollect) {
      this.setState({ clickAndCollect: array })
    }
  }

  confirmationToDashboardFunc = () => {
    const dashboard = new confirmationToDashboard();
    dashboard.getData(this.props, window);
  }

  getOrderId = () => {
    return this.props.orderId ? this.props.orderId : '';
  }

  getAllPageEvent = () => {
    let payload = {
      "actPageTitle": 'checkoutOrderConfirmation',
      "loginStatus": this.props.orderData.loggedInUser === 'false' ? 'N' : 'Y',
      "actURL": window.location.href
    }
    GTMallPages(payload);
  }

  setSkus = (skus) => {
    this.setState({ skus })
  }
  getSkusInfoForSWOGO = () => {
    return this.state.skus;
  }
  getSWOGOPageIdentifier = () => {
    const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
    if (isMobile) {
      return "mobilePayment-0";
    }
    return "payment-0";
  }
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
  }

  downloadPDFfromIcon = () => {
    let pdfDataForPrePayment = {
      "orderId": this.props.orderId || '',
      "email": this.props.orderData.email || '',
      "paymentMethod": ' ',
      "cieReferenceNum": ' '
    }
    this.downloadPDFHandler(pdfDataForPrePayment);
  }

  downloadPDFHandler = async (pdfData) => {

    const body = await Utility(Path.downloadTicket, 'POST', pdfData);
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

      var blob = new Blob([view], { type: "data:application/pdf;base64" });
      FileSaver.saveAs(blob, pdfData.orderId + '.pdf');
    }
  }

  redirectToOrderHistory = (logInStatus) => {
    if (logInStatus === 'true') {
      Router.push('/tienda/users/orderHistory');
    } else {
      Router.push('/tienda/users/trackOrders');
    }
  }

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
      this.setState({
        showSaveAlert: true
      });
    }, (error) => {
      console.error(error);
    });
  }

  redirectToHome = () => {
    let redirectionHost = window.location.origin + '/tienda/home';
    location.assign(redirectionHost);
  }


  render() {

    const viewPort = UserAgentDetails(this.state.window);
    let saveMessage = {
      type: 'm-alert__container mdc-snackbar -success -alertCheckout mdc-snackbar--open -static',
      text: 'Se han agregado exitosamente tus productos a tu lista de',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-done',
      pClass: 'dss',
      link: this.state && this.state.window && this.state.window.location ? this.state.window.location.origin + '/tienda/cart' : ''
    }

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
      productCountForSUbtotal = '0'
    }
    const { ItemDetails, email, purchaseDate, deleveryAddressDetail, paymentDetail, orderSuccessTotal, orderSuccess } = this.props.orderData;
    const { staticLabels } = this.props;
    const logInStatus = this.props.orderData.loggedInUser || 'false';
    const itemDetails = ItemDetails;
    const facturaDetails = itemDetails.facturaDetails ? itemDetails.facturaDetails : {};
    const nightBox = this.props.orderData.nightBoxMessage;

    let warnings = {
      type: 'm-alert__container mdc-snackbar -alert -alertCheckout mdc-snackbar--open -static ',
      text: staticLabels['pwa.sfl.orderconfirmation.info.text'] ? staticLabels['pwa.sfl.orderconfirmation.info.text'] : "pwa.sfl.orderconfirmation.info.text",
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-error',
      alertToTop: this.state.alertToTop,
      step4alert: 'step4-alert'
    }

    let digitalValues = []
    !isEmpty(ItemDetails.success) && map(ItemDetails.success, (item) => {
      digitalValues.push(item.itemType)
    })
    let digitalFlag = digitalValues.every(v => v === 'Digital')

    let confirmation = {
      aHref: "#",
      aClass: "a-box__btnConfirm",
      iconClass: "icon-download pr-2",
      spanText: "Descargar confirmación"
    }
    let textHeadlineText = staticLabels['pwa.airtime.orderConfirmation.heading.recharge.details'].toLowerCase()
    let textHeadlineTextA = textHeadlineText.charAt(0).toUpperCase() + textHeadlineText.slice(1)
    const commerceairTimeItem = this.state.airTimeDataItem;
    const commerce = this.state.airTimeDataItem2;
    this.state.airTimeDataItem2.map((item, index) => { item[this.state.airTimeDataItem[index].shippingGroupId] })
    let quantity = 0;
    for (var i = 0; i < ItemDetails.success.length; i++) {
      if (Object.keys(ItemDetails.success[i]).length === 1) {
        let keyarray = Object.keys(ItemDetails.success[i]);
        let keyvalue = keyarray[0]
        quantity = quantity + ItemDetails.success[i][keyvalue].CommerceItems[0].quantity;
      }
    }
    this.state.skus
    return (
      <parentContext.Consumer>
        {({ loginDetails }) => (
          <React.Fragment>
            <script defer="" type="text/javascript" src={swogoScript}></script>
            <div>
              <Header deleveryAddressDetail={deleveryAddressDetail} itemDetails={itemDetails} email={email} paymentDetail={paymentDetail} nightBox={nightBox} orderSuccessTotal={orderSuccessTotal} staticLabels={staticLabels} downloadPdf={this.downloadPdf} />
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <HeadlineSpan headLineClass="a-checkout__purchaseDetail -headingMargin" textHeadline={textHeadlineTextA + ': '} spanClassname="-bold" text={purchaseDate} />
                  </div>
                </div>
                {itemDetails && itemDetails.success && itemDetails.success.length &&
                  <div className="row align-items-center justify-content-between mb-3">
                    <div className="col-6">
                      {itemDetails && itemDetails.success && itemDetails.success.length ?
                        <Label className="a-checkout__titleResume">{digitalFlag ? staticLabels['pwa.airtime.orderConfirmation.heading.your.recharges'] + ' digitales' : staticLabels['pwa.airtime.orderConfirmation.heading.your.recharges']}</Label>
                        : null}
                    </div>


                    <div className="col-3 text-right d-none d-lg-block">
                      <Link onClick={this.downloadPDFfromIcon} className="a-checkout__btnOptions icon-download pr-3"></Link>
                    </div>
                  </div>
                }
                <div className="m-productList">
                  {this.airTimeDataItem2 && this.airTimeDataItem2.map((item, index) => <ItemBlockAirtime quantity={quantity} commerce={commerce} skus={this.state.skus} setSkus={this.setSkus} facturaDetails={facturaDetails} commerceairTimeItem={commerceairTimeItem} staticLabels={staticLabels} itemData={item} />)} {/*itemData={item[this.airTimeDataItem[index].shippingGroupId]}*/}
                </div>
                {(itemDetails && !isEmpty(itemDetails.failure)) &&
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
                        <Label className="a-checkout__titleResume -failPayment">Artículos no cobrados</Label>
                      </div>
                    </div>
                    {itemDetails && !isEmpty(itemDetails.failure) ?
                      <div className="row">
                        <div className="col-md-12" style={{ left: '0%' }}>
                          <Alerts options={warnings} />
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
                  itemDetails.chargedAndUncollected[0]['CommerceItems'].map((data, index) => <FailureItemBox key={index} staticLabels={staticLabels} skus={this.state.skus} setSkus={this.setSkus} clickAndCollect={this.state.clickAndCollect} setClickAndCollect={this.setClickAndCollect} data={data} />)
                }


                <div className="row align-items-start mt-3">
                  <div style={{ marginTop: this.changeFlagForAddress === true ? '4.2rem' : 'none' }} className="col-lg-6 col-12">
                    <Paragraph className="pt-3 m-0 d-none d-lg-block" onClick={this.pageRedirection}>
                      <i className="icon-lock pr-2"></i><span>{staticLabels && staticLabels['pwa.orderConfirmationPage.todastext.text'] ? staticLabels['pwa.orderConfirmationPage.todastext.text'] : ''}</span>
                    </Paragraph>
                  </div>


                  <div className="col-lg-6 col-12">
                    <PaymentDetailBlock staticLabels={staticLabels} paymentDetail={paymentDetail} orderSuccessTotal={orderSuccessTotal} />
                    <OrderTotalBlock quantity={quantity} orderSuccessTotal={orderSuccessTotal} staticLabels={staticLabels || {}} orderSuccess={orderSuccess || {}} totalProductCount={productCountForSUbtotal || {}} />
                    {paymentDetail['Forma de pago'] && paymentDetail['Forma de pago'].trim().toLowerCase() === "Pago: CIE Bancomer".trim().toLowerCase() &&
                      <CieBlock orderSuccessTotal={orderSuccessTotal}  hostname={this.props.hostname}/>
                    }
                    {logInStatus === 'false' ? <SignUpBlock /> : ''}
                    <div className="m-box mb-4 -boxUnshatter p-lg-0">
                      <div className="row align-items-center justify-content-end flex-column-reverse flex-lg-row">
                        <div className="col-lg-4 col-12 text-center d-lg-none d-block"><a onClick={this.downloadPDFfromIcon} className="a-box__btnConfirm" href="#"><i className="icon-download pr-2"></i><span>Descargar confirmación</span></a>
                        </div>
                        <hr className="w-100 mt-3 mb-3 d-lg-none d-block" />
                        <div className="col-xl-4 col-lg-6 pb-3 pb-lg-0">
                          <Button onClick={this.redirectToHome} className="a-btn a-btn--primary">Continuar comprando</Button>
                        </div>
                      </div>
                    </div>
                    <StaticInfoBlock staticLabels={staticLabels} orderData={this.props.orderData} viewPort={viewPort} />
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </parentContext.Consumer>

    )
  }
}
