/**
* Module Name :OrderTotalBlock
* Functionality : Showing order information template.
* @exports :OrderTotalBlock as functional component
* @requires : module:React
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/HrTag/HrTag
* @requires : module:/helpers/utilities/utility
* Team : Checkout Team
* Other information : Showing Total order information.
* 
*/
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import HrTag from '../../atoms/HrTag/HrTag';
import {  GetWithDecimal } from '../../../helpers/utilities/utility';

export default (props) => {
   // console.log("props ================== ::: ",props);
    const {  orderSuccessTotal, orderSuccess, staticLabels } = props;
    // console.log('orderSuccessTotal=========',props);
    const data = (orderSuccess && orderSuccess.ItemDetails && orderSuccess.ItemDetails.success && orderSuccess.ItemDetails.success[0]) || {};
    const shippingCost = data.shippingCost || '';
    const packedList = (data.deliveryInfo && data.deliveryInfo[0] && data.deliveryInfo[0].packedList && data.deliveryInfo[0].packedList[0]) || {};
    const totalProductCount = orderSuccessTotal && orderSuccessTotal.totalCommerceItemCount ? orderSuccessTotal.totalCommerceItemCount :0;
    const paymentMethod = (orderSuccessTotal && orderSuccessTotal.payemntMethod === 'CIEBancomer') || (orderSuccessTotal && orderSuccessTotal.payemntMethod === 'Efectivo') || (orderSuccessTotal && orderSuccessTotal.payemntMethod === 'Transferencia')? true :false;
    return (

        <div className="m-box mb-4">
            <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                    <H5 headLineClass="a-box__heading" headLineText="Resumen de mi bolsa" />
                    {/*Not find proper static label key for "Resumen de mi bolsa"*/}
                </div>
            </div>
            <HrTag hrClass="mb-3" />
            <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                    <Label className="a-box__resume">{staticLabels["pwa.checkoutBagPage.subtotal.text"]} ({totalProductCount} {staticLabels["pwa.checkoutBagPage.productos.text"]}):</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume">
    {` $ ${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.subTotal, '2').val}`}.{`${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.subTotal, '2').decimal}`}

                    </Label>
                </div>
            </div>
            { 
            <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                    <Label className="a-box__resume">{staticLabels["pwa.orderConfirmationPage.Descuento.text"]}:</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume"> 

                         {` $ ${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.institutionalPromotionDiscount, '2').val}`}.{`${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.institutionalPromotionDiscount, '2').decimal}`}
                    </Label>
                </div>
            </div>
            }
            
            {orderSuccessTotal && orderSuccessTotal.institutionalPromotionDiscount ?
            <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                    <Label className="a-box__resume">Código de promoción:</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume">
  {` $ ${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.couponDiscount, '2').val}`}.{`${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.couponDiscount, '2').decimal}`}
                   
                    </Label>
                </div>
            </div>
            :null
            }
              
            <div className="row no-gutters align-items-center justify-content-between mb-2">
                <div className="col-auto">
                    <Label className="a-box__resume">{staticLabels["pwa.checkoutBagPage.cdl.shippingcost.label"]}:</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume">
                         {` $ ${GetWithDecimal(shippingCost, '2').val}`}.{`${GetWithDecimal(shippingCost, '2').decimal}`}
   
                    </Label>
                </div>
            </div>
            <div className="row no-gutters align-items-center justify-content-between mb-3">
                <div className="col-auto">
                    <Label className="a-box__resume -totalLabel">{staticLabels["pwa.checkoutBagPage.total.text"]}:</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume -totalPrice">
        {` $ ${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.orderTotal, '2').val}`}.{`${GetWithDecimal(orderSuccessTotal && orderSuccessTotal.orderTotal, '2').decimal}`}
   
                    </Label>
                </div>
            </div>
        </div>
    )
}