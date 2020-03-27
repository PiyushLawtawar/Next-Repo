/**
* Module Name : PaymentLoginPage
* Functionality : Component used to show the payment page for the loggedin user. This is get called from \client\components\templates\checkout\BillingCommonPage.js
* @exports : PaymentLoginPage
* @requires : module:React
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Input/Input
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/molecules/Alert/Alert
* @requires : module:/molecules/MaterialInputRadio/MaterialInputRadio
* @requires : module:/molecules/MenuMotion/molecule-menu-motion
* @requires : module:/molecules/UserCardInformation/UserCardInformation
* @requires : module:/molecules/RequestedCardInformation/RequestedCardInformation
* @requires : module:/molecules/DeliveryMethodInfo/DeliveryMethodInfo
* @requires : module:/molecules/PaymentSectionHeader/PaymentSectionHeader
* @requires : module:/organisms/PaymentTypeSelector/PaymentTypeSelector
* @requires : module:/organisms/CheckoutCreditCard/CheckoutCreditCard
* @requires : module:/organisms/CheckoutPaypal/CheckoutPaypal
* @requires : module:/organisms/CheckoutCash/CheckoutCash
* @requires : module:/organisms/CheckoutSpei/CheckoutSpei
* @requires : module:/organisms/CheckoutCie/CheckoutCie
* @requires : module:/molecules/TermsAndConditions/TermsAndConditions
* @requires : module:/CheckoutStep2AddNewCardLogin
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:next/router
* @requires : module:/organisms/CheckoutAddNewCard/CheckoutAddNewCard
* @requires : module:lodash/isEmpty
* Team : Checkout Team
* Other information : Showing the payment page for the loggedin user
* 
*/
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
import Alert from '../../molecules/Alert/Alert';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import { Menumotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import UserCardInformation from '../../molecules/UserCardInformation/UserCardInformation';
import RequestedCardInformation from '../../molecules/RequestedCardInformation/RequestedCardInformation';
import DeliveryMethodInfo from '../../molecules/DeliveryMethodInfo/DeliveryMethodInfo';
import PaymentSectionHeader from '../../molecules/PaymentSectionHeader/PaymentSectionHeader';
//include ../../molecules/Modals/molecule-checkout-establishment
//include ../../molecules/Modals/molecule-checkout-establishment2
import PaymentTypeSelector from '../../organisms/PaymentTypeSelector/PaymentTypeSelector';
import CheckoutCreditCard from '../../organisms/CheckoutCreditCard/CheckoutCreditCard';
import CheckoutPaypal from '../../organisms/CheckoutPaypal/CheckoutPaypal';
import CheckoutCash from '../../organisms/CheckoutCash/CheckoutCash';
import CheckoutSpei from '../../organisms/CheckoutSpei/CheckoutSpei';
import CheckoutCie from '../../organisms/CheckoutCie/CheckoutCie';
import TermsAndConditions from '../../molecules/TermsAndConditions/TermsAndConditions';
import CheckoutStep2AddNewCardLogin from './CheckoutStep2AddNewCardLogin';
import { Utility, getPriceInFormat, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import CheckoutAddNewCard from '../../organisms/CheckoutAddNewCard/CheckoutAddNewCard';
import isEmpty from 'lodash/isEmpty';

/**
* Method will call to get the nickName of the selected record.
* @function getDefaultNickName
* @author srinivasa.gorantla@zensar.com
* @desc returning the nickName of the selected record.
* @param {string} nickName
* 
*/
const getDefaultNickName = (records,defaultCreditCardId) => {
    let nickName = "";
    for(var i in records){
      if(records[i].repositoryId === defaultCreditCardId){
         nickName = records[i].nickName;
      }
    }

  return nickName;
}

/**
 * @class CheckoutPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class PaymentLoginPage extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props) {
      const { defaultCreditCardId , records } = props.mainContent.creditCards || {};
        super(props);
        this.state = {
          isAddNewCard : false,
          summaryClass : 'd-block',
          selectedRepositoryId: defaultCreditCardId,
          nickName: getDefaultNickName(records,defaultCreditCardId) || '',
          loggedInUser: this.props.cartHeaderDetails.isLoggedIn,
          creditCards: this.props.mainContent.creditCards,
          editCardTextMessage: false,
          editCardInfoDetails: {},
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
    const { isMobile } = UserAgentDetails(window);
    this.setState({ isMobile });    
  }

/**
* Method will call on click on add new card button.
* @function addNewCard
* @author srinivasa.gorantla@zensar.com
* @desc Showing add new card form by updating isAddNewCard state value.
* @param {object}
* 
*/
addNewCard = () =>{
  window.scrollTo(0, 0);
  this.setState({
    isAddNewCard: true,
    summaryClass: 'd-none',
    editCardInfoDetails: {},
    editCardTextMessage: false
  })
    
}

/**
* Method will call to hide the add new card form.
* @function returnFromAddNewCardToBillingPage
* @author srinivasa.gorantla@zensar.com
* @desc Hiding add new card form by updating add new card value.
* 
*/
returnFromAddNewCardToBillingPage = () =>{
  window.scrollTo(0, 0);
  const { isAddNewCard } = this.state;
   this.setState({
    isAddNewCard: false,
    summaryClass: 'd-block'
  })
}

/**
* Method will call on click on credit card item.
* @function onBillingCreditCardChange
* @author srinivasa.gorantla@zensar.com
* @desc Updating credit card to hilight the selection based on the click
* @param {object} e
* @param {string} nickName
* 
*/
onBillingCreditCardChange = (e, nickName) => {
    this.setState({
      selectedRepositoryId : e.target.value,
      nickName: nickName
    })
  } 

/**
* Method will call on click of continue button after credit card selection.
* @function handleContinueFromBillingCCPPage
* @author srinivasa.gorantla@zensar.com
* @desc Making RESTfull service call with selected credit card to proceed promotion page from the Billing page.
* 
*/
handleContinueFromBillingCCPPage = () => {
        const { loggedInUser } = this.state;
        if(loggedInUser && (this.refs.checkoutStep2AddNewCardLoginRef || this.refs.addNewCardRef)){
          let promiseGuestDetails = {};
          if(this.refs.checkoutStep2AddNewCardLoginRef){
             promiseGuestDetails = this.refs.checkoutStep2AddNewCardLoginRef.ValidateForm();
          }else{
            promiseGuestDetails = this.refs.addNewCardRef.validateForm();
          }
            if(this.state.editCardTextMessage){
                promiseGuestDetails.then((formsData)=>{
                    this.props.multipleClicksAvoid(true);
                    var formData = {...formsData.data,...formsData.address};
                        formData.businessPhoneNumber = formData.businessPhoneNumber.replace('-', '')
                    let payload =
                      {
                          "lastName": formData.lastName,
                          "country": formData.country,
                          "city": formData.city,
                          "postalCode": formData.postalCode,
                          "creditCardType": formData.Typeofcard,
                          "neighbourhood": formData.colonyName || formData.colonyText,
                          "neighborhoodId": formData.colony || '-1',
                          "nickname": this.state.nickName,
                          "state": formData.state,
                          "address1": formData.street,
                          "stateId": formData.stateId,
                          "state": formData.stateName,
                          "firstName": formData.firstName,
                          "particularPhoneCode": formData.businessPhoneCode,
                          "delegationMunicipality": formData.municipality || formData.delegationMunicipality || formData.municipalityText,
                          "creditCardNumber": formData.cardNumber,
                          "exteriorNumber": formData.noExt,
                          "phoneNumber": formData.businessPhoneNumber
                      };
                        if(formData.building){
                            payload.building= formData.building
                        }
                        if(formData.andStreet){
                            payload.address3= formData.andStreet
                        }
                         if(formData.betweenStreet){
                             payload.address2= formData.betweenStreet
                         }
                         if(formData.otherColony){
                            payload.otherColony= formData.colonyName
                         } 

                         if(formData.shortName){
                             payload.newNickname= formData.shortName
                         }
                         if(formData.noInt){
                             payload.interiorNumber= formData.noInt
                         }
                         if(formData.cellular){
                             payload.cellular= formData.cellular
                         }
                          if(formData.motherLastName){
                             payload.maternalName= formData.motherLastName
                         }
                         if(formData.middleName){
                            payload.middleName= formData.middleName
                        }
                        if(formData.delegationMunicipalityId){
                           payload.delegationMunicipalityId= formData.delegationMunicipalityId
                        }else{
                          payload.delegationMunicipalityId = "-1"
                        }
                        if (formData && formData.setAsDefault) {
                            payload.isDefault = formData.setAsDefault;
                        }
                        if(formData.otherColony){
                            payload.otherColony = formData.otherColony;
                            payload.neighborhoodId = '-2';
                        }
                        
                    Utility(Path.proceedtopromotionaftereditcard, 'POST', payload).then(response => { 
                      if(response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')){
                         Utility(Path.getCreditCards, 'POST', {}).then(response1 => { 
                             if(response1 && response1.data && ((response1.data.status && response1.data.status.status === "success") || response1.data.s==='0')){
                               this.props.multipleClicksAvoid(false);
                                this.setState({
                                    isAddNewCard: false,
                                    creditCards:response1.data,
                                    selectedRepositoryId: response1.data.defaultCreditCardId
                                })
                             }
                         })
                         
                      }else {
                        this.props.multipleClicksAvoid(false);
                        this.props.finalErrorHandling(response)
                        this.setState({ 
                            isAddNewCard: true
                        })
                      }

                    });
                })
            }else{
                promiseGuestDetails.then((formsData)=>{
                    this.props.multipleClicksAvoid(true);
                    var payload = {...formsData.data,...formsData.address};
                    let obj = {};
                    if (payload && payload.postalCode) {
                        obj = {
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
                            "country": payload.country,
                            "cardNickName": payload.shortName

                        }
                        if (payload && payload.Month) {
                            obj.expirationMonth = payload.Month;
                        }
                        if (payload && payload.Year) {
                            obj.expirationYear = payload.Year;
                        }
                    }
                    if (payload && payload.setAsDefault) {
                        obj.defaultBillingAddressChecked = payload.setAsDefault;
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
                    Utility(Path.proceedbillingtopromotion, 'POST', obj).then(response => {
                      if(response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')){ 
                         this.props.gotoPromotionPage();
                      }else {
                        this.props.multipleClicksAvoid(false);
                        this.props.finalErrorHandling(response)
                      }
                    });
                })
            }

        }else if(loggedInUser && this.refs.checkoutCreditCardRef && this.refs.checkoutCreditCardRef.refs && this.refs.checkoutCreditCardRef.refs.requestedCardInformationRef){
            const promise = this.refs.checkoutCreditCardRef.ValidateForm();
            promise.then(data=>{
                this.props.multipleClicksAvoid(true);
                data.nickName = this.state.nickName;
                let obj = {};
                if (data.nickName) {
                    obj.nickName = data.nickName
                }
                if (data.cvv) {
                    obj.ccVerNo = data.cvv
                }
                if (data.Year) {
                    obj.yearCard = data.Year
                }
                if (data.Month) {
                    obj.monthCard = data.Month
                }   
                Utility(Path.proceedbillingtopromotion, 'POST', obj).then(response => {
                  if(response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')){
                    this.props.gotoPromotionPage();
                  }else {
                    this.props.multipleClicksAvoid(false);
                    this.props.finalErrorHandling(response)
                  }
                });
            },(error)=>{
                this.props.multipleClicksAvoid(false);
                // console.log("Invalid loggedInUser SUBMIT========================= ",error);
            })
        }else{
            this.props.multipleClicksAvoid(true);
            let obj = {};
            obj.nickName = this.state.nickName;
            Utility(Path.proceedbillingtopromotion, 'POST', obj).then(response => {
                  if(response && response.data && ((response.data.status && response.data.status.status === "success") || response.data.s==='0')){
                    this.props.gotoPromotionPage();
                  }else {
                    this.props.multipleClicksAvoid(false);
                    this.props.finalErrorHandling(response)
                  }
            });
        }
    }



  /**
  * Method will call to showing the hamburger menu on click on three dots.
  * @function isShowMotionFun
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating state value to show the hamburger menu.
  * @param {boolean} index
  * 
  */
  isShowMotionFun = (index) => {
    const { creditCards } = this.state;
    creditCards.records = creditCards.records.map((record,key)=>{
      if(key===index){
        creditCards.records[key].isShowMotion = true;
      }else{
        creditCards.records[key].isShowMotion = false;
      }
      return record;
    })
    this.setState({creditCards});
  }

  /**
  * Method will call on click of edit credit card option.
  * @function editCardInfo
  * @author srinivasa.gorantla@zensar.com
  * @desc Showing edit card form to update the selected card info.
  * @param {object} editCardInfo
  * 
  */
  editCardInfo = (editCardInfo) =>{
   window.scrollTo(0, 0);
   let {editCardInfoDetails} = this.state;
   this.setState({
      editCardTextMessage: true,
      editCardInfoDetails : editCardInfo,
      isAddNewCard: true,
      summaryClass: 'd-block',
      nickName: editCardInfo.nickName
   })
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
      iconType: 'a-alert__icon icon-error',
      id: 'editCardAlert'
    }

    let alert2 = {
      type: '-alert',
      text: 'El pago con PayPal sólo está disponible de 07:00 a 23:00 hrs. Por favor elige otra forma de pago',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-error',
      id: 'papyalInvalidSchedule'
    }

    let warning = {
      type: '-warning',
      text: 'Este método de pago no está disponible con la opción de entrega "Click and Collect Drive Thru" Si deseas continuar, deberás recoger tu pedido en la tienda seleccionada',
      className: 'a-alert__text',
      iconType: 'a-alert__icon icon-warning'
    }
    const { priceInfo, totalCommerceItemCount, shippingAddress } = this.props.mainContent;
    const { shippingAddressDetail } = this.props.mainContent.shippingAddress || {};
    const { ccclassName, ppclassName, ctclassName, paypalAvailable, staticLabelValues, clickandcollect, isGiftCertificate } = this.props;
    const { selectedRepositoryId, creditCards,editCardInfoDetails,editCardTextMessage,cashData,cieData,spieData, isAddNewCard, isSeeMoreEstablishmentsEnabled,isSeeNearByEstablishmentsEnabled, staticLabelKeyValues } = this.state;
    const {digitalInfo} = shippingAddressDetail || ''

    return (
      <main>
        {
              ( isAddNewCard)?
              <React.Fragment>
                 <CheckoutStep2AddNewCardLogin 
                    ref="checkoutStep2AddNewCardLoginRef" 
                    returnFromAddNewCardToBillingPage = {this.returnFromAddNewCardToBillingPage} 
                    handleContinueFromBillingPage={this.handleContinueFromBillingPage}
                    editCardTextMessage = {editCardTextMessage}
                    editCardInfoDetails = {editCardInfoDetails}
                    shippingAddressDetail = {shippingAddressDetail}
                    handleContinueFromBillingCCPPage={this.handleContinueFromBillingCCPPage}
                    handleContinueFromBillingPPPage={this.props.handleContinueFromBillingPPPage}
                    handleContinueFromBillingCIEPage={this.props.handleContinueFromBillingCIEPage}
                    isAddNewCard={isAddNewCard}
                    modifyShippingAddress={this.modifyShippingAddress}
                    {...this.props} 
                 /> 
                    {/*<div className="alertContainer">
                      {
                        (clickandcollect === 'ccd' && ctclassName)?
                            <Alert {...this.props} alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -alertCheckout -step1 -warning"} iconType="close" text={staticLabelValues["pwa.checkoutPageBilling.clickAndCollectDriveThru.alert.message"]} alert_status={this.props.alert_status} />
                        :
                        (this.props.alert_status)?
                          <Alert {...this.props} alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -alertCheckout -step1 -"+this.props.alertColorType} iconType="close" text={this.props.aleretMessage} alert_status={this.props.alert_status} dismiss_alert={this.props.dismiss_alert}/>
                        : null
                      }
                       
                  </div>*/}
                </React.Fragment>
              : 
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <H4 headLineClass="a-checkout__heading -headingMargin" headLineText={staticLabelValues["pwa.checkoutPageBilling.choose.text"]} />
                    </div>
                  </div>

                  <div className="row">
                    {/*<div className="alertContainer">
                      {
                        (clickandcollect === 'ccd' && ctclassName)?
                            <Alert {...this.props} alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -alertCheckout -step1 -warning"} iconType="close" text={staticLabelValues["pwa.checkoutPageBilling.clickAndCollectDriveThru.alert.message"]} alert_status={this.props.alert_status} />
                        :
                        (this.props.alert_status)?
                          <Alert {...this.props} alertTopClass={this.props.toTop +" m-alert__container mdc-snackbar -alertCheckout -step1 -"+this.props.alertColorType} iconType="close" text={this.props.aleretMessage} alert_status={this.props.alert_status} dismiss_alert={this.props.dismiss_alert}/>
                        : null
                      }
                       
                    </div>*/}
                    <div className="col-lg-8 col-12 order-1 col-xl-9">
                      <div id="leftParentPanel">
                            <PaymentTypeSelector  {...this.props}  />
                            
                          {
                              (this.state.nickName || (ctclassName || ppclassName))?
                                <CheckoutCreditCard  
                                    ref="checkoutCreditCardRef" 
                                    isAddNewCard={this.state.isAddNewCard} 
                                    addNewCard={this.addNewCard}
                                    selectedRepositoryId={selectedRepositoryId}
                                    creditCards={creditCards}
                                    isShowMotionFun={this.isShowMotionFun}
                                    onBillingCreditCardChange={this.onBillingCreditCardChange} 
                                    editCardInfo = {this.editCardInfo}
                                    digitalInfo = {digitalInfo}
                                    {...this.props} 
                                />
                            :
                              <CheckoutAddNewCard ref="addNewCardRef" editCardInfoDetails= {this.props.editCardInfoDetails} editCardTextMessage={this.props.editCardTextMessage} {...this.props}/>
                          }

                      {
                        ((paypalAvailable && !isGiftCertificate) || (!paypalAvailable && digitalInfo))? <CheckoutPaypal ppclassName={ppclassName} {...this.props}/> : null
                        
                      }

                      <div className={(ctclassName) ? "o-cashTransferenceInfo d-block" : "o-cashTransferenceInfo d-none"} id="cashTransferenceOrganism">
                         <CheckoutCash  
                            seeMoreEstablishments = {this.seeMoreEstablishments}
                            isSeeMoreEstablishmentsEnabled = {isSeeMoreEstablishmentsEnabled}
                            isSeeNearByEstablishmentsEnabled = {isSeeNearByEstablishmentsEnabled}
                            seeNearByEstablishments = {this.seeNearByEstablishments}
                            /*  Custom Products functionality  START */
                            customProduct={this.props.customProduct}
                            /*  Custom Products functionality  START */
                            {...this.props}
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
                            // Custom Products functionality START
                          }

                    </div>

                    {
                      (!this.state.isAddNewCard)?<TermsAndConditions 
                            handleContinueFromBillingCCPPage={this.handleContinueFromBillingCCPPage}
                            handleContinueFromBillingPPPage={this.props.handleContinueFromBillingPPPage}
                            handleContinueFromBillingCIEPage={this.props.handleContinueFromBillingCIEPage}
                            termsAndConditionsLinkUrl={staticLabelValues['pwa.checkout.termsandconditions.linkUrl']}
                            termsAndConditionsTCText={staticLabelValues['pwa.checkout.termsandconditions.tcText']}
                            termsAndConditionsAgreeText={staticLabelValues['pwa.checkout.termsandconditions.agreeText']}
                            digitalInfo={digitalInfo}
                            {...this.props}/> 
                      
                      : null
                    }
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
                    </div>

                    <div className={"col-lg-4 col-12 order-2 BillLeftPanel "+this.state.summaryClass+ " mt-2 mt-lg-0 col-xl-3"}>
                      <div id="scroll-right-pane">
                        <div className="m-bagResumeBox mb-4">
                        <div className="row no-gutters align-items-center justify-content-between">
                          <div className="col-12" id="maxPriceControl">
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
                                (priceInfo && priceInfo.Subtotal)?
                                <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.Subtotal)}</Label>
                                : null
                             }
                          </div>
                        </div>
                        <div className="row no-gutters align-items-center justify-content-between">
                          <div className="col-auto">
                            <Label className="a-box__resume" for="">{staticLabelValues['pwa.checkoutBagPage.descuento.text']}</Label>
                          </div>
                          <div className="col-auto">
                            {
                              (priceInfo && priceInfo.institutionalPromotionDiscount)?
                              <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.institutionalPromotionDiscount)}</Label>
                              : null  
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
                                (priceInfo && priceInfo.shippingCost)?
                              <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.shippingCost)}</Label>
                              : null
                            }
                          </div>
                        </div>
                        <div className="row no-gutters align-items-center justify-content-between mb-3" id="maxPriceExceededControl">
                          <div className="col-auto">
                            <Label className="a-box__resume -totalLabel" for="">{staticLabelValues['pwa.checkoutBagPage.total.text']}:</Label>
                          </div>
                          <div className="col-auto">
                            {
                              (priceInfo && priceInfo.Total)?
                              <Label className="a-box__resume -totalPrice" for="">$ {getPriceInFormat(priceInfo.Total)}</Label>
                              : null
                            }
                          </div>
                        </div>
                      </div>
                     <DeliveryMethodInfo shippingAddressDetail={shippingAddressDetail} modifyShippingAddress={this.modifyShippingAddress} {...this.props}/>
                     </div>
                    </div>

                </div>
              </div>
        }
      </main>

    );
  }
}




