
/**
* Module Name : AddNewCardLogin
* Functionality : Showing Add new card component to add new card.
* @exports : AddNewCardLogin
* @requires : module:React
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Input/Input
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/UserCardInformation/UserCardInformation
* @requires : module:/molecules/MaterialInputRadio/MaterialInputRadio
* @requires : module:/molecules/RequestedCardInformation/RequestedCardInformation
* @requires : module:/molecules/DeliveryMethodInfo/DeliveryMethodInfo
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/molecules/PaymentSectionHeader/PaymentSectionHeader
* @requires : module:/organisms/CheckoutAddNewCard/CheckoutAddNewCard
* @requires : module:/molecules/TermsAndConditions/TermsAndConditions
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* Team : Checkout Team
* Other information : Showing Add new card component to add new card.
* 
*/

import Label from '../../atoms/Label/Label';
import Icons from '../../atoms/Icons/Icons';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import Input from "../../atoms/Input/Input";
import Span from '../../atoms/Span/Span';
import {H4,H5} from '../../atoms/HeadLines/Headlines';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import UserCardInformation from '../../molecules/UserCardInformation/UserCardInformation';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import RequestedCardInformation from '../../molecules/RequestedCardInformation/RequestedCardInformation';
import DeliveryMethodInfo from '../../molecules/DeliveryMethodInfo/DeliveryMethodInfo';
import {InputText,InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import PaymentSectionHeader from '../../molecules/PaymentSectionHeader/PaymentSectionHeader';
import CheckoutAddNewCard from '../../organisms/CheckoutAddNewCard/CheckoutAddNewCard';
import TermsAndConditions from '../../molecules/TermsAndConditions/TermsAndConditions';
import { Utility, getPriceInFormat, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
/**
 * @class AddNewCardLogin
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class AddNewCardLogin extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props) {
        super(props);
        this.state = {
          isMobile: true
        }
    }
  componentDidMount() {
    const { isMobile } = UserAgentDetails(window);
    this.setState({ isMobile });       
  }

  /**
  * Method will call to validate form.
  * @function subValidateForm
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating request card information form fields.
  * @return {object} *
  * 
  */
ValidateForm = () =>{
    return this.refs.addNewCardRef.validateForm()
}

/**
 * REACT life cycle Event. This will get fire on load and on state update.
 * @event render 
 * 
 */
render(){
   const { staticLabelValues } = this.props;
   const { priceInfo, totalCommerceItemCount, shippingAddress } = this.props.mainContent;
return(

<main>
    <div className="container">
          <div className="row">
          <div className="col-12">
               <H4 headLineClass="a-checkout__heading -headingMargin" headLineText={(this.props.editCardTextMessage)? staticLabelValues["pwa.checkoutPageBilling.editar.tarjeta.text"] : staticLabelValues["pwa.checkoutPageBilling.agregar.tarjeta.text"]}/>
          </div>
          </div>
         <div className="row">
            <div className="col-lg-8 col-12 order-1 col-xl-9">
                <div id="leftParentPanel">
               <CheckoutAddNewCard toTop={this.props.toTop} ref="addNewCardRef" editCardInfoDetails= {this.props.editCardInfoDetails} editCardTextMessage={this.props.editCardTextMessage} {...this.props}/>
               <TermsAndConditions  {...this.props} 
                  termsAndConditionsLinkUrl={staticLabelValues['pwa.checkout.termsandconditions.linkUrl']}
                  termsAndConditionsTCText={staticLabelValues['pwa.checkout.termsandconditions.tcText']}
                  termsAndConditionsAgreeText={staticLabelValues['pwa.checkout.termsandconditions.agreeText']}
               />
               </div>
            </div>
            <div className="col-12 order-3 mb-2 d-lg-none mt-4">
              {
                (this.props.ctclassName)?
                   <Button className="a-btn a-btn--primary" handleClick={this.props.handleContinueFromBillingCIEPage}>{staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                   : (this.props.ppclassName)?
                      <Button className="a-btn a-btn--primary" handleClick={this.props.handleContinueFromBillingPPPage}>{staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                   :
                      <Button className="a-btn a-btn--primary" handleClick={this.props.handleContinueFromBillingCCPPage}>{staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
              }
                        
            </div>

            <div className="col-lg-4 col-12 order-2 d-block mt-2 mt-lg-0 col-xl-3 BillLeftPanel ">
                <div id="scroll-right-pane">
                    <div className="m-bagResumeBox lg-4 mb-4">
                            <div className="row no-gutters align-items-center justify-content-between">
                                <div className="col-12">
                                    <H5 headLineClass="a-box__heading" headLineText={staticLabelValues['pwa.checkoutBagPage.heading.text']}/>
                                </div>
                            </div>
                            <hr className="mb-3" />
                            <div className="row no-gutters align-items-center justify-content-between">
                                <div className="col-auto">
                                            <Label className="a-box__resume" for="">{staticLabelValues['pwa.checkoutBagPage.subtotal.text']} ({totalCommerceItemCount} {staticLabelValues['pwa.checkoutBagPage.productos.text']}):</Label>
                                </div>
                                <div className="col-auto">
                                            <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.Subtotal)}</Label>
                                </div>
                            </div>
                            <div className="row no-gutters align-items-center justify-content-between">
                                <div className="col-auto">
                                            <Label className="a-box__resume" for="">{staticLabelValues['pwa.checkoutBagPage.descuento.text']}</Label>
                                </div>
                                <div className="col-auto">
                                            <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.institutionalPromotionDiscount)}</Label>
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
                                            <Label className="a-box__resume" for="">$ {getPriceInFormat(priceInfo.shippingCost)}</Label>
                                </div>
                            </div>
                            <div className="row no-gutters align-items-center justify-content-between mb-3">
                                <div className="col-auto">
                                            <Label className="a-box__resume -totalLabel" for="">{staticLabelValues['pwa.checkoutBagPage.total.text']}:</Label>
                                </div>
                                <div className="col-auto">
                                            <Label className="a-box__resume -totalPrice" for="">$ {getPriceInFormat(priceInfo.Total)}</Label>
                                </div>
                            </div>
                    </div>
                    <DeliveryMethodInfo {...this.props}/>
                </div>
          </div>
          </div>
          
        

      </div>
</main>

);
}
}