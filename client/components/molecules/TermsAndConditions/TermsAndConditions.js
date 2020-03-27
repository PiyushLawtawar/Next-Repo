//import './TermsAndConditions.styl'

/*
include ../../atoms/Paragraph/atom-paragraph.pug
include ../../atoms/Buttons/atom-buttons
include ../../molecules/MixinMolecules/mixin-molecules.pug

-
  var optionsTerms = {
    pText: 'He leído y acepto ',
    pclassName: 'a-checkout__termsAndConditions mb-4',
    bType: 'anchor',
    bclassName: 'a-checkout__termsLink',
    bText: 'Términos, Condiciones y Aviso de Privacidad',
    bUrl: '#'
  }

.m-termsAndConditions.d-none.d-lg-flex.col-lg-12
  .row.no-gutters
    +molecule-paragraph-with-block(optionsTerms)
  .termsAndConditions__container
    +atom-button("Regresar","a-btn a-btn--primary termsAndConditions__btn--back")(id="backButton")
    +atom-button("Continuar","a-btn a-btn--primary termsAndConditions__btn--continue")*/

import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import {ParagraphWithBlockNew} from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {
   const terms = {
            bType: 'anchor',
            pText: props.termsAndConditionsAgreeText || 'pwa.checkout.termsandconditions.agreeText',
            pClass: 'a-checkout__termsAndConditions mb-4',
            bText: props.termsAndConditionsTCText || 'pwa.checkout.termsandconditions.tcText',
            bClass: 'a-checkout__termsLink',
            bUrl:  props.termsAndConditionsLinkUrl || 'pwa.checkout.termsandconditions.linkUrl',
            targetType:'_blank'
        };
return(
<div className="m-termsAndConditions d-none d-lg-flex col-lg-12">
              <div className="row no-gutters pb-3">
                                   <ParagraphWithBlockNew options={terms} />
              </div>
              <div className="col-lg-6 termsAndConditions__container">
                            {
                              (props.isAddNewCard)?
                                  <Button className="a-btn a-btn--secondary" id="backButton" handleClick={props.returnFromAddNewCardToBillingPage}>{props.staticLabelValues['pwa.checkoutPageBilling.backbutton.text']}</Button>
                              : 
                                  <Button className="a-btn a-btn--secondary" id="backButton" handleClick={props.returnToShippingPage}>{props.staticLabelValues['pwa.checkoutPageBilling.backbutton.text']}</Button>
                            }
                            
                            {
                              (props.ctclassName)?
                                  <Button className="a-btn a-btn--primary termsAndConditions__btn--continue" disabled={props.buttonDisabled} handleClick={props.handleContinueFromBillingCIEPage}>{props.staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                              : (props.ccclassName  || (props.ppclassName && !props.paypalAvailable && !props.digitalInfo) || (props.ppclassName && props.paypalAvailable && props.isGiftCertificate))?
                                  <Button className="a-btn a-btn--primary termsAndConditions__btn--continue" disabled={props.buttonDisabled} handleClick={props.handleContinueFromBillingCCPPage}>{props.staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                              :
                                  <Button className="a-btn a-btn--primary termsAndConditions__btn--continue" disabled={props.buttonDisabled} handleClick={props.handleContinueFromBillingPPPage}>{props.staticLabelValues['pwa.checkoutBillingPage.continueBill.label']}</Button>
                            }
                            
              </div>
            </div>
);
}

