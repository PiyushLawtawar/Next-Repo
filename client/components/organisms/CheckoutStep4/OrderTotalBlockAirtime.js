import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import HrTag from '../../atoms/HrTag/HrTag';
import { GetWithDecimal } from '../../../helpers/utilities/utility';

export default (props) => {
    const { orderSuccessTotal, quantity, orderSuccess, staticLabels } = props;
    const data = (orderSuccess && orderSuccess.ItemDetails && orderSuccess.ItemDetails.success && orderSuccess.ItemDetails.success[0]) || {};
    const shippingCost = data.shippingCost || '';
    const packedList = (data.deliveryInfo && data.deliveryInfo[0] && data.deliveryInfo[0].packedList && data.deliveryInfo[0].packedList[0]) || {};
    const totalProductCount = quantity.toString();
    return (

        <div className="m-box mb-4">
            <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                    <H5 headLineClass="a-box__heading" headLineText="Resumen de mi recarga" />
                </div>
            </div>
            <HrTag hrClass="mb-3" />
            <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                    <Label className="a-box__resume">{staticLabels["pwa.checkoutBagPage.subtotal.text"]} ({totalProductCount} {"recargas"}):</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume">
                        {` $ ${GetWithDecimal(orderSuccessTotal.subTotal, '2').val}`}.{`${GetWithDecimal(orderSuccessTotal.subTotal, '2').decimal}`}

                    </Label>
                </div>
            </div>
            <div className="row no-gutters align-items-center justify-content-between mb-3">
                <div className="col-auto">
                    <Label className="a-box__resume -totalLabel">{staticLabels["pwa.checkoutBagPage.total.text"]}:</Label>
                </div>
                <div className="col-auto">
                    <Label className="a-box__resume -totalPrice">
                        {` $ ${GetWithDecimal(orderSuccessTotal.orderTotal, '2').val}`}.{`${GetWithDecimal(orderSuccessTotal.orderTotal, '2').decimal}`}

                    </Label>
                </div>
            </div>
        </div>
    )
}