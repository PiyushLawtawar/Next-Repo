//import './CheckoutSpei.styl'


/**
* Module Name : CheckoutSpei
* Functionality : Showing Checkout SPEI panel in cash and transfer tab.
* @exports : CheckoutSpei as functional component
* @requires : module:React
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/molecules/MaterialInputRadio/Material_Input_Radio
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Label/Label
* @requires : module:/helpers/utilities/utility
* Team :Checkout Team
* Other information : Showing Payment Checkout SPEI 
* 
*/

import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import {H4,H5} from '../../atoms/HeadLines/Headlines';
import Material_Input_Radio from '../../molecules/MaterialInputRadio/Material_Input_Radio';
import Image from '../../atoms/Tagimage/Image';
import Label from '../../atoms/Label/Label';
import { getAssetsPath } from '../../../helpers/utilities/utility';

export default (props) => {
  let { expiryMessage } = (props.displayPayInfo && props.displayPayInfo.openPayInfo && props.displayPayInfo.openPayInfo.transferencia) || ""
  const checkLoginRadio={"active":"false" , "amount": "20", "inputId" : "itemArray[5]", "nameInput" : "delivery" , "radioId": 'delivery'}
  let  AssetsPath = '../../..';
	if (typeof window !== 'undefined') {
		const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
	}else{
    const path = getAssetsPath(undefined,props.hostname,process);
    AssetsPath = (path && path !='' && path.length > 9)?path:'../../../';    
}
return(
<div className="o-speiInfo">
                <div className="row no-gutters align-items-center justify-content-between">
                    <Link className="a-cashInfo__accordionHeading" data-toggle="collapse" role="button" aria-expanded={props.paymentTypeSelection.speiType? "false": "true"} aria-controls="speiOptions" onClick={()=>props.toggleCheckoutCash('speiType','speiOptions')}>
                    {/*href="#speiOptions"*/}
                        <div className="m-cashInfo_accordionText">
                            <H5 headLineClass="a-cashInfo__heading" headLineText={props.staticLabelValues['pwa.openPay.transferencia.spei.text']} />
                        </div>
                        <div className="a-cashInfo__accordionIcon">
                            {/*<Icons className={(props.paymentTypeSelection.speiType)?"icon-arrow_up":"icon-arrow_down"} />*/}
                      <Icons className="icon-arrow_down" />

                        </div>
                    </Link>
                  <div className="w-100 collapse d-block" id="speiOptions" style={{overflow: 'hidden',transition: 'max-height 0.4s ease-out'}}>
                     {/*className={(!props.paymentTypeSelection.speiType)? "w-100 collapse":"w-100 collapse"}*/}
                    <hr className="a-cashInfo__horizontalSeparator" />
                    <Label htmlFor={'billingSPEI'} style={{width:'100%'}}>
                        <div className="row no-gutters align-items-end justify-content-between mt-3 pt-2">
                          <div className="col-12">
                                <Paragraph className="a-cashInfo__Info">{props.staticLabelValues['pwa.openPay.concludePurchaseTransferencia.text']}
                                </Paragraph>
                          </div>
                          <div className="col-12">
                            <Material_Input_Radio
                                name="billingSPEI"
                                id="billingSPEI"
                                onChange={()=>props.selectCTPaymentRadioButton('spei')}
                                checked={props.isSpieSelected}
                                />
                              {/* Custom Products functionality START */}
                              <Image 
                                className="a-cashOptions__spei ml-2" 
                                src={AssetsPath + "/static/images/spei-logo.png"} 
                                alt="Ícono SPEI"
                                style={ (props.customProduct) ? {opacity:"0.3"} : null }
                              />
                              {/* Custom Products functionality START */}
                          </div>
                        </div>
                        <div className={(props.isSpieSelected)?"d-block":"d-none"} id="transferenceSelected">
                          <hr className="a-cashInfo__horizontalSeparator--alter" />
                          <div className="row no-gutters align-items-center justify-content-between">
                            <div className="col-12">
                              <Paragraph className="a-cashInfo__description">
                                  <Span className="a-cashInfo__important">{props.staticLabelValues['pwa.openPay.important.text']} </Span> 
                                  <Span className="a-cashInfo__bolded">{expiryMessage}.</Span>
                              </Paragraph>
                            </div>
                          </div>
                        </div>
                    </Label>
                  </div>
                </div>
              </div>

);
}