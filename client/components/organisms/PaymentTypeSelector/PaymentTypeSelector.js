//import './PaymentTypeSelector.styl';

/**
* Module Name : PaymentTypeSelector
* Functionality : Payment options showing as Tab view.
* @exports : PaymentTypeSelector as functional component
* @requires : module:React
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/helpers/utilities/utility
* Team : Checkout Team
* Other information : Showing Credit / Debit Cards, Paypal, Cash and Transfers tabs
* 
*/

import Span from '../../atoms/Span/Span';
import Image from '../../atoms/Tagimage/Image';
import {  getAssetsPath } from '../../../helpers/utilities/utility';


export default (props) => {
    const { ccclassName, ppclassName, ctclassName, staticLabelValues} = props;
    let  AssetsPath = '../../..';
    if (typeof window !== 'undefined') {
      const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..'; 
    }else{
      const path = getAssetsPath(undefined,props.hostname,process);
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';    
  }
    return (
      <div className="o-paymentBox">
        <div className="row align-items-start">
          <div className="m-paymentOptionContainer col-4 pr-0 pl-0" id="creditCard" onClick={()=>{props.selectedPaymentTab('creditCard')}}>
            <div className={(ccclassName) ? "m-paymentOptionContainer__selector m-paymentOptionContainer__selector--selected" : 'm-paymentOptionContainer__selector'} id="creditCardContainer" >
              <Span className={(ccclassName) ? "a-paymentOptionContainer__optionText--selected" : "a-paymentOptionContainer__optionText"} id="creditCardText">{staticLabelValues['pwa.checkoutBillingPage.external.creditandDebitCards.text']}</Span>
              <Span className="a-paymentOptionContainer__tooltip"></Span>
            </div>
          </div>
          <div className="m-paymentOptionContainer col-4 pr-0 pl-0" id="paypal" onClick={()=>{props.selectedPaymentTab('paypal')}}>
            <div className={(ppclassName) ? "m-paymentOptionContainer__selector m-paymentOptionContainer__selector--selected" : 'm-paymentOptionContainer__selector'} id="paypalContainer">
              <Image className={"a-paymentOptionContainer__logo"+(ppclassName ? "zoomOut" : "zoomIn")}  src={(ppclassName) ? (AssetsPath + "/static/images/atomo-icono-paypal-blanco.svg") : (AssetsPath + "/static/images/atomo-icono-paypal.svg")} alt="Logo PayPal" id="paypalImage" />
              <Span className="a-paymentOptionContainer__tooltip"></Span>
            </div>
          </div>
          <div className="m-paymentOptionContainer col-4 pr-0 pl-0" id="cash" onClick={()=>{props.selectedPaymentTab("cash")}}>
            <div className={(ctclassName) ? "m-paymentOptionContainer__selector m-paymentOptionContainer__selector--selected" : 'm-paymentOptionContainer__selector'} id="cashContainer">
              <Span className={(ctclassName) ? "a-paymentOptionContainer__optionText--selected" : "a-paymentOptionContainer__optionText"} id="cashText">{staticLabelValues['pwa.checkoutBillingPage.cieBancomer.payment.text']}</Span>
              <Span className="a-paymentOptionContainer__tooltip"></Span>
            </div>
          </div>
        </div>
      </div>
    );
}