//import './CheckoutCie.styl'

/**
* Module Name : CheckoutCie
* Functionality : Showing Checkout CIE panel in cash and transfer tab.
* @exports : CheckoutCie as functional component
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
* Other information : Showing Payment Checkout CIE 
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

    const checkLoginRadio={"active":"false" , "amount": "20", "inputId" : "itemArray[5]", "nameInput" : "delivery" , "radioId": 'delivery'}
    let { cieInfo } = (props.displayPayInfo && props.displayPayInfo.cieInfo) || {}
        cieInfo = cieInfo || {};
    let {enabled} = cieInfo;
    enabled = enabled || false;
    let  AssetsPath = '../../..';
	if (typeof window !== 'undefined') {
		const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
	}else{
        const path = getAssetsPath(undefined,props.hostname,process);
        AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
    }
return(
<div className="o-cieInfo">
                <div className="row no-gutters align-items-center justify-content-between">
                    <Link className="a-cashInfo__accordionHeading" data-toggle="collapse" role="button" aria-expanded={props.paymentTypeSelection.cieType ? "false": "true"} aria-controls="cieOptions" onClick={()=>props.toggleCheckoutCash('cieType','cieOptions')}>
                    {/*href="#cieOptions"*/}
                        <div className="m-cashInfo_accordionText">
                            <H5 headLineClass="a-cashInfo__heading" headLineText="CIE" />
                        </div>
                        <div className="a-cashInfo__accordionIcon">
                            {/*<Icons className={(props.paymentTypeSelection.cieType)?"icon-arrow_up":"icon-arrow_down"} />*/}
                            <Icons className="icon-arrow_down "/>

                        </div>
                        </Link>
                    
                  <div className="w-100 collapse d-block"  id="cieOptions" style={{'max-height': '152px', overflow: 'hidden',transition: 'max-height 0.4s ease-out'}}>
                      {/*className={(!props.paymentTypeSelection.cieType)? "w-100 collapse d-block":"w-100 collapse d-block"}*/}
                    <hr className="a-cashInfo__horizontalSeparator" />
                    <Label htmlFor={'billingCIE'} style={{width: '100%'}}>
                        <div className="row no-gutters align-items-end justify-content-between mt-3 pt-2">
                        <div className="col-12">
                                <Paragraph className="a-cashInfo__Info">Concluye la compra en alguno de los siguientes establecimientos</Paragraph>
                        </div>
                        <div className="col-12">
                            <Material_Input_Radio
                                name="billingCIE"
                                id="billingCIE"
                                onChange={()=>props.selectCTPaymentRadioButton('cie')}
                                checked={props.isCieSelected}
                                />
                                {/* Custom Products functionality START */}
                                <Image className="a-cashOptions__rectangleCard" src={AssetsPath + "/static/images/bancomer-logo.png"} alt="Ícono seven-eleven" style={ (props.customProduct) ? {opacity:"0.3"} : null } />
                                <Image className="a-cashOptions__rectangleCard" src={AssetsPath + "/static/images/atomo-icono-seven.png"} alt="Ícono seven-eleven" style={ (props.customProduct) ? {opacity:"0.3"} : null } />
                                <Image className="a-cashOptions__rectangleCard" src={AssetsPath + "/static/images/spei-logo.png"} alt="Ícono seven-eleven" style={ (props.customProduct) ? {opacity:"0.3"} : null } />
                                {/* Custom Products functionality START */}
                        </div>
                        </div>
                    </Label>
                  </div>
                </div>
              </div>
);
}