import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import Input from '../../atoms/Input/Input';
import Label from '../../atoms/Label/Label';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';

import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import {Menumotion} from '../../molecules/MenuMotion/molecule-menu-motion';
import UserCardInformation from '../../molecules/UserCardInformation/UserCardInformation';
import RequestedCardInformation from '../../molecules/RequestedCardInformation/RequestedCardInformation';
import DeliveryMethodInfo from '../../molecules/DeliveryMethodInfo/DeliveryMethodInfo';
import PaymentSectionHeader from '../../molecules/PaymentSectionHeader/PaymentSectionHeader';
//include ../../molecules/Modals/molecule-checkout-establishment
//include ../../molecules/Modals/molecule-checkout-establishment2
//include ../../organism/header/organism-header.pug
import PaymentTypeSelector from '../../organisms/PaymentTypeSelector/PaymentTypeSelector';
import CheckoutAddNewCard from '../../organisms/CheckoutAddNewCard/CheckoutAddNewCard';
import CheckoutCash from '../../organisms/CheckoutCash/CheckoutCash';
import CheckoutCie from '../../organisms/CheckoutCie/CheckoutCie';
import CheckoutSpei from '../../organisms/CheckoutSpei/CheckoutSpei';
import TermsAndConditions from '../../molecules/TermsAndConditions/TermsAndConditions';
import BillingAddressForm from './BillingAddressForm';
import BillingPagePersonalInfo from './BillingPagePersonalInfo';
import Tab from '../../molecules/Tabs/Tab';
import BillingCardHolderDetails from './BillingCardHolderDetails';
import { Utility, getPriceInFormat, UserAgentDetails,getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
/**
 * @class CheckoutPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class billingGuestPage extends React.Component {

  /**
 * REACT life cycle Event. This will get fire on component load
 * @event constructor 
 * @param {*} props
 */
 constructor(props) {
    super(props);
    this.state = {
      loggedInUser: props.cartHeaderDetails.isLoggedIn,
      deliveryTypeSelection:{
          pickUpInStore: false,
          homeDelivery: false
      },
      isSeeMoreEstablishmentsEnabled : false,
      isSeeNearByEstablishmentsEnabled: false,
      windowWidth: '450px',
      isMobile: true
    }
  }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */  
  componentDidMount() {
    // var guestBillLeftPanel = document.querySelector('#guestBillLeftPanel');
    // if(guestBillLeftPanel){
    //   const windowWidth = guestBillLeftPanel.offsetWidth -30;
    //   this.setState({windowWidth})
    // }
    const { isMobile } = UserAgentDetails(window);
    this.setState({ isMobile });    
    // try {
        // var $sidebar = document.querySelectorAll(".m-bagResumeBox")[0];
        // var $window = document.body
        // var offset = $sidebar.getBoundingClientRect()
        // window.addEventListener('scroll', function (e) {
        //     var stop = document.querySelectorAll('.m-termsAndConditions')[0]
        //     if(stop){
        //       stop = stop.getBoundingClientRect().top
        //       // console.log("window.pageYOffset :",window.pageYOffset,", offset.top: ",offset.top," ====>",window.pageYOffset>offset.top," ---- (((",offset.bottom," - ",offset.top,") + ",window.pageYOffset,") > ",stop,") ::: ",(((offset.bottom - offset.top) + window.pageYOffset) > stop));
        //       if (window.pageYOffset > offset.top){
        //           if (((offset.bottom - offset.top) + window.pageYOffset) > stop) {
        //               // console.log('stopPropagation')
        //           } else {
        //               $sidebar.style.marginTop = window.pageYOffset - offset.top + 15 + "px"
        //           }
        //       }else{
        //           $sidebar.style.marginTop = 0 + "px";
        //       }
        //     }
        // });
    // }
    // catch(error){
        // console.log(error)
    // }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.alert_status !== this.state.alert_status) {
      this.setState({ alert_status: nextProps.alert_status })
    }
    if (nextProps.aleretMessage !== this.state.aleretMessage) {
      this.setState({ aleretMessage: nextProps.aleretMessage })
    }
  }

  /**
  * Method will call on click of continue button to proceed billing to promotion page.
  * @function handleContinueFromBillingCCPPage
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTfull service call to guest checkout billing information
  * 
  */
 handleContinueFromBillingCCPPage = () => {
   const { loggedInUser } = this.state;
   if (!loggedInUser && this.refs.billingAddressFormRef && this.refs.cardInformationRef && this.refs.billingPersonalFormRef) {
     this.props.multipleClicksAvoid(true);
     const cardInformationAddress = this.refs.cardInformationRef.validateForm();
     const billingCardHolderAddress = this.refs.billingPersonalFormRef.validateForm();
     const promiseShippingAddres = this.refs.billingAddressFormRef.validateForm();
     Promise.all([cardInformationAddress, billingCardHolderAddress, promiseShippingAddres]).then((data) => {
       var payload = { ...data[0], ...data[1], ...data[2] };
        let obj = {
                "phoneNumber": payload.businessPhoneNumber,
                "phoneNumberLada": payload.businessPhoneCode,
                "postalCode": payload.postalCode,
                "stateId": payload.stateId,
                "state": payload.stateName,
                "city": payload.city,
                "delegationMunicipalityId": payload.municipality || '-1',
                "delegationMunicipality": payload.delegationMunicipality || payload.municipalityText,
                "neighborhood": payload.colonyName || payload.colonyText,
                "neighborhoodId": payload.colony || '-1',
                "address1": payload.street,
                "exteriorNumber": payload.noExt,
                "creditCardType": payload.Typeofcard,
                "creditCardNumber": payload.cardNumber,
                "cardVerificationNumber": payload.cvv,
                "firstName": payload.firstName,
                "lastName": payload.lastName,
                "country": payload.country
            }

            if (payload && payload.Month) {
                obj.expirationMonth = payload.Month;
            }
            if (payload && payload.Year) {
                obj.expirationYear = payload.Year;
            }
            if (payload && payload.email) {
                obj.email = payload.email;
            }
            if (payload && payload.otherNeighborhood) {
                obj.otherNeighborhood = payload.otherNeighborhood
            }
            if (payload && payload.showGiftInfo) {
                obj.showGiftInfo = payload.showGiftInfo;
                obj.email = payload.email
            } else {
                obj.showGiftInfo = "false";
            }
            if (payload && payload.noInt && payload.noInt !== " ") {
                obj.interiorNumber = payload.noInt;
            }
            if (payload && payload.building && payload.building !== " ") {
                obj.building = payload.building;
            }
            if (payload && payload.betweenStreet && payload.betweenStreet !== " ") {
                obj.address2 = payload.betweenStreet;
            }
            if (payload && payload.andStreet && payload.andStreet !== " ") {
                obj.address3 = payload.andStreet;
            }
            if (payload && payload.motherLastName && payload.motherLastName !== " ") {
                obj.maternalName = payload.motherLastName;
            }
            if (payload && payload.cellphone && payload.cellphone !== " ") {
                obj.mobilePhoneNumber = payload.cellphone;
            }
            if(payload.otherColony){
               obj.otherNeighborhood = payload.otherColony;
               obj.neighborhoodId = '-2';
            }
       Utility(Path.guestcheckoutbillinginfo, 'POST', obj).then(response => {
         if(response && response.data && (response.data.s === '0' || (response.data.status && response.data.status.status === 'success'))){
           this.props.gotoPromotionPage();
         }else {
            this.props.multipleClicksAvoid(false);
            this.props.finalErrorHandling(response)
         }
       });
     }, (error) => {
       this.props.multipleClicksAvoid(false);
      //  console.log("BILLING Invalid guest SUBMIT========================= ", error);
     })
   }
 } 
 
  /**
  * Method will call on click of modify shipping address link.
  * @function modifyShippingAddress
  * @author srinivasa.gorantla@zensar.com
  * @desc Redirecting page to checkout shipping page to modify the delivery selection.
  * 
  */
    modifyShippingAddress = () =>{
        window.scrollTo(0, 0);
        Router.push('/tienda/checkoutShipping')
   }

  /**
  * Method will call to validate form.
  * @function subValidateForm
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating request card information form fields.
  * @return {object} *
  * 
  */
  ValidateForm = () => {
     return this.refs.billingPersonalFormRef.validateForm();
  }
  /**
  * Method will call to update the more establishment status.
  * @function seeMoreEstablishments
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating state value to showing the more establishments.
  * 
  */
  seeMoreEstablishments = () =>{
      this.setState({
        isSeeMoreEstablishmentsEnabled: true
      })
   }
  /**
  * Method will call to update near by establishment status.
  * @function seeNearByEstablishments
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating state value to show the near bt establishments.
  * @param {object}
  * 
  */
  seeNearByEstablishments = () =>{
      this.setState({
        isSeeNearByEstablishmentsEnabled: true
      })
   }

  /**
  * Method will call on click of mobile view back button.
  * @function mobileViewBackButton
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating page dynamicaly on click on mobile view back button in header.
  * @param {object}
  * 
  */
  mobileViewBackButton = (url) => {
      const { isAddNewCard, editCardTextMessage } = this.state;
      if(editCardTextMessage){
        this.setState({ editCardTextMessage: false, isAddNewCard: false });
      }else if(isAddNewCard){
          this.setState({ isAddNewCard: false });
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
render(){
    let alert = {
      type: '-alert',
      text: 'La tarjeta de crédito ha vencido, actualiza la información o selecciona otro método de pago',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-error'
    }

    let warning = {
      type: '-warning',
      text: 'Este método de pago no está disponible con la opción de entrega "Click and Collect Drive Thru" Si deseas continuar, deberás recoger tu pedido en la tienda seleccionada',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-warning'
    }
    let colonia = {
      labelText: "colonia",
      labelId: 'colonia',
      selected: 'selectCardType',
      optionList: [
        {
          name: "",
          value: ""
        },
        {
          name: "1",
          value: "1"
        }

      ]
    }


    const checkLoginRadio = { "active": "false", "amount": "20", "inputId": "itemArray[5]", "nameInput": "delivery", "radioId": 'delivery' }
    const { ccclassName, ppclassName, ctclassName, staticLabelValues, clickandcollect, paypalAvailable, isGiftCertificate } = this.props;
    const { priceInfo, totalCommerceItemCount, shippingAddress } = this.props.mainContent;
    const { shippingAddressDetail } = this.props.mainContent && this.props.mainContent.shippingAddress || {};
    const { isSeeMoreEstablishmentsEnabled, isSeeNearByEstablishmentsEnabled } = this.state;
    const {digitalInfo} = shippingAddressDetail || '';
    let  AssetsPath = '../../..';
    if (typeof window !== 'undefined') {
      const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';
    }else{
      const path = getAssetsPath(undefined,this.props.hostname,process);
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../../';    
  }
    
    return (

      <main>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <H4 headLineClass="a-checkout__heading -headingMargin" headLineText={staticLabelValues['pwa.checkoutPageBilling.choose.text']} />
            </div>
          </div>
          <div className="row">
            {/*<Alert alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -alertCheckout -step1 -alert"} />*/}
            {/*<Alert alertTopClass="m-alert__container mdc-snackbar -warning" id="" />*/}
            {/*{
              (clickandcollect === 'ccd' && ctclassName)?
                  <Alert {...this.props} alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -step1 -warning"} iconType="close" text={staticLabelValues["pwa.checkoutPageBilling.clickAndCollectDriveThru.alert.message"]} alert_status={this.props.alert_status} />
              : (this.props.alert_status)?
                  <Alert {...this.props} alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -step1 -"+ this.props.alertColorType} iconType="close" text={this.props.aleretMessage} alert_status={this.props.alert_status} dismiss_alert={this.props.dismiss_alert}/>
              : null

            }*/}
            
          
            <div className="col-lg-8 col-12 order-1 col-xl-9">
              <div id="leftParentPanel">
              <PaymentTypeSelector {...this.props}/>
              <div className={(ccclassName)?"o-addNewCardForm--guest d-block": ((!this.props.paypalAvailable && !digitalInfo && !ctclassName || (this.props.paypalAvailable && isGiftCertificate && !ctclassName))? "o-addNewCardForm--guest d-block" : "o-addNewCardForm--guest d-none")} id="creditCardOrganism">
                <div className="m-sectionHeader no-gutters">
                  <PaymentSectionHeader sectionHeaderClass="a-sectionHeader__title" sectionHeaderText={staticLabelValues['pwa.checkoutPageBilling.addNewCardHead.text'] || 'pwa.checkoutPageBilling.addNewCardHead.text'} secondaryTextClass="a-box__requiredMessage" secondaryText={staticLabelValues['pwa.checkoutPageBilling.requiredData.text']} />
                </div>
   

                <RequestedCardInformation ref="cardInformationRef" isFull={true} isGuest={true} {...this.props}/>


                <div className="m-sectionHeader no-gutters">
                  <Paragraph className="a-sectionHeader__title">{staticLabelValues['pwa.checkoutPageBilling.cardholderdata.text']}
                    </Paragraph>
                </div>

                <BillingPagePersonalInfo ref="billingPersonalFormRef" {...this.props}/>

                <div className="m-addressSectionHeader no-gutters">
                  <Paragraph className="a-sectionHeader__title">{staticLabelValues['pwa.checkoutBillingPage.direction.text']}
                    </Paragraph>
                </div>
                
                <div className="m-predefinedAddress m-checkout-wrapper">
                     <BillingAddressForm  colonia={colonia} ref="billingAddressFormRef" staticLabelValues={staticLabelValues} shippingAddressDetail={shippingAddressDetail} {...this.props}/>
                </div>
                  {/*<BillingAddressForm  colonia={colonia} ref="billingAddressFormRef" staticLabelValues={staticLabelValues} shippingAddressDetail={shippingAddressDetail}/>*/}
                
                

              </div>



              
              <div className="o-cashTransferenceInfo d-block" id="cashTransferenceOrganism">
                {
                ((this.props.mainContent && this.props.mainContent.showGiftInfoMsg && !ccclassName && paypalAvailable && !isGiftCertificate) || (!paypalAvailable && this.props.mainContent.showGiftInfoMsg &&  ctclassName) || (paypalAvailable && isGiftCertificate && ctclassName))?
                  <div className={(ctclassName || ppclassName)?"o-personalInfo mb-2 mb-lg-4 d-block": "o-personalInfo mb-2 mb-lg-4 d-none"}>
                      <div className="m-sectionHeader no-gutters">
                        <H5 headLineClass="a-cashInfo__heading" headLineText={staticLabelValues['pwa.checkoutBillingPage.personalInformation.text']} />
                        <Paragraph className="a-box__requiredMessage">{staticLabelValues['pwa.checkoutBillingPage.requiredFields.text']}</Paragraph>
                      </div>
                      <BillingPagePersonalInfo ref="billingPersonalFormRef" {...this.props}/>
                  </div>
                : null
              }
               

                {
                  ((paypalAvailable && !isGiftCertificate) || (!paypalAvailable && digitalInfo))?

                    <div className={(ppclassName)?"o-paypalInfo d-block": "o-paypalInfo d-none"} id="paypalOrganism">
                      <div className="col-12 d-flex justify-content-center justify-content-md-start p-0 flex-column">
                        <Paragraph className="a-paypalInfo__heading">{staticLabelValues['pwa.checkoutBillingPage.newPaymentMethod.service.message']}
                        </Paragraph>
                        <Image className="a-paypalInfo__logo" src={AssetsPath+"/static/images/atomo-icono-paypal.svg"} alt="Logo PayPal" id="paypalLogoBig" />
                        <Paragraph className="a-paypalInfo__description">{staticLabelValues['pwa.checkoutBillingPage.newPaymentMethod.paypal.message1']}
                        </Paragraph>
                      </div>
                  </div>

                  : null
                }
                

                <div className={(ctclassName)?"o-cashTransferenceInfo d-block": "o-cashTransferenceInfo d-none"} id="cashTransferenceOrganism">
                    <CheckoutCash {...this.props} 
                        seeMoreEstablishments = {this.seeMoreEstablishments}
                        isSeeMoreEstablishmentsEnabled = {isSeeMoreEstablishmentsEnabled}
                        isSeeNearByEstablishmentsEnabled = {isSeeNearByEstablishmentsEnabled}
                        seeNearByEstablishments = {this.seeNearByEstablishments}
                        /*  Custom Products functionality  START */
                        customProduct={this.props.customProduct}
                        /*  Custom Products functionality  START */
                    />
                    <CheckoutSpei 
                      {...this.props} 
                      /*  Custom Products functionality  START */
                      customProduct={this.props.customProduct} 
                      /*  Custom Products functionality  START */
                    /> 
                    {
                      /*  Custom Products functionality  START */
                      (this.props.displayPayInfo && this.props.displayPayInfo.cieInfo && this.props.displayPayInfo.cieInfo.enabled)?  <CheckoutCie {...this.props} customProduct={this.props.customProduct} /> : null
                      /*  Custom Products functionality  START */
                    }
                </div>


              </div>


              <TermsAndConditions 
                handleContinueFromBillingCCPPage={this.handleContinueFromBillingCCPPage}
                handleContinueFromBillingPPPage={this.props.handleContinueFromBillingPPPage}
                handleContinueFromBillingCIEPage={this.props.handleContinueFromBillingCIEPage}
                termsAndConditionsLinkUrl={staticLabelValues['pwa.checkout.termsandconditions.linkUrl']}
                termsAndConditionsTCText={staticLabelValues['pwa.checkout.termsandconditions.tcText']}
                termsAndConditionsAgreeText={staticLabelValues['pwa.checkout.termsandconditions.agreeText']}
                digitalInfo={digitalInfo}
                {...this.props}/> 


              {/*end of col-lg-8*/}

            </div>
            </div>

            <div className="col-12 order-3 mb-2 d-lg-none">
              {
                (ctclassName)?
                   <Button className="a-btn a-btn--primary" disabled={this.props.buttonDisabled} handleClick={this.props.handleContinueFromBillingCIEPage}>{staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                   : (ccclassName || (ppclassName && !paypalAvailable && !digitalInfo) || (ppclassName && paypalAvailable && isGiftCertificate))?
                      <Button className="a-btn a-btn--primary" handleClick={this.handleContinueFromBillingCCPPage}>{staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                   :
                      <Button className="a-btn a-btn--primary" handleClick={this.props.handleContinueFromBillingPPPage}>{staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
              }
              
            </div>


            <div className="col-lg-4 col-12 order-2 d-block mt-2 mt-lg-0 col-xl-3 BillLeftPanel ">
              <div id="scroll-right-pane">
              <div className="m-bagResumeBox mb-4">
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-12">
                    <H5 headLineClass="a-box__heading" headLineText={staticLabelValues['pwa.checkoutBagPage.heading.text']} />
                  </div>
                </div>
                <hr className="mb-3" />
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto">
                    <Label className="a-box__resume" for="">{staticLabelValues['pwa.checkoutBagPage.subtotal.text']} ({totalCommerceItemCount} {staticLabelValues['pwa.checkoutBagPage.productos.text']}):</Label>
                  </div>
                  <div className="col-auto">
                    {
                      (priceInfo && priceInfo.Subtotal)? <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.Subtotal)}</Label>: null
                    }
                   
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto">
                    <Label className="a-box__resume" for="">{staticLabelValues['pwa.checkoutBagPage.descuento.text']}</Label>
                  </div>
                  <div className="col-auto">
                    {
                      (priceInfo && priceInfo.institutionalPromotionDiscount)?<Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.institutionalPromotionDiscount)}</Label>: null
                    }
                    
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto">
                        <Label className="a-box__resume"> {staticLabelValues["pwa.checkoutBagPage.codigoPromocion.text"]} </Label>
                  </div>
                  <div className="col-auto">
                    {
                      (priceInfo && priceInfo.couponDiscount)?
                        <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.couponDiscount)}</Label> : null
                    }
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between mb-2">
                  <div className="col-auto">
                    <Label className="a-box__resume" for="">{staticLabelValues['pwa.checkoutBagPage.cdl.shippingcost.label']}</Label>
                  </div>
                  <div className="col-auto">
                    {
                      (priceInfo && priceInfo.shippingCost)?<Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.shippingCost)}</Label>: null
                    }
                    
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between mb-3">
                  <div className="col-auto">
                    <Label className="a-box__resume -totalLabel" for="">{staticLabelValues['pwa.checkoutBagPage.total.text']}:</Label>
                  </div>
                  <div className="col-auto">
                    {
                      (priceInfo && priceInfo.Total)?  <Label className="a-box__resume -totalPrice" for="">$ {getPriceInFormat(priceInfo.Total)}</Label>: null
                    }
                  
                  </div>
                </div>
              </div>
              <DeliveryMethodInfo shippingAddressDetail={shippingAddressDetail} modifyShippingAddress={this.modifyShippingAddress} {...this.props}/>




            </div>
            </div>

          </div>
        </div>
      </main>

    );
}
  }
