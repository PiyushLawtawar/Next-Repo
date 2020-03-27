import React from 'react';
import get from 'lodash/get';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import isEmpty from 'lodash/isEmpty';

class orderDetailsAddress extends React.Component {
    constructor(props) {
        super(props);
    }

    nullCheck = (data) => {
        return data || ''
    }
    render() {
        const staticLabels = this.props.staticLabels;
        const address = this.props.address;
        const giftRegistryEventNumber = get(address, 'shippingDetails[0].commerceItems[0].giftRegistryEventNumber', '');
        // console.log('shippingAddress',giftRegistryEventNumber)
        const shippingAddress = address && address.orderDetails && address.orderDetails.shippingAddress;
        const paymentDetails = address && address.orderDetails && address.orderDetails.paymentDetails;

        // console.log('shippingAddress',shippingAddress)

        return (
            <div className="m-orderDetail__address m-orderDetail__card">
                <div className="row m-row">
                    {giftRegistryEventNumber ? ''
                        : shippingAddress &&
                        <div className="col-12 m-col col-lg-6">
                            <Paragraph className="a-orderDetail__addressTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.direction.lable"]}</Paragraph>
                            <Paragraph className="a-orderDetail__addressName">{shippingAddress.FirstName}</Paragraph>
                            <Paragraph className="a-orderDetail__addressValue">
                                {/*bug 24315 removed FirstName*/}
                                {shippingAddress && shippingAddress.FirstName ?  shippingAddress.address1 + ', ' 
                                + shippingAddress.exteriorNumber + ', ' + shippingAddress.neighborhood  + ', ' + shippingAddress.postalCode + ', ' + shippingAddress.delegationMunicipality + ', ' + shippingAddress.city 
                                 + ', ' + ((this.nullCheck(shippingAddress.phoneNumber) ? this.nullCheck(shippingAddress.phoneNumber) + ', ' : '' ) + "Tel.") + this.nullCheck(shippingAddress.phoneNumber).replace(/-/g, "")
                                 : ''}
                                </Paragraph>
                        </div>
                    }
                    <div className="col-12 m-col m-orderDetail__payment col-lg-6">
                        <Paragraph className="a-orderDetail__paymentTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.formadepago.lable"]}</Paragraph>
                        {address && address.paymentGroupMethod === "creditCard" && paymentDetails ?
                            <React.Fragment>
                                <Paragraph className="a-orderDetail__paymentValue">{'Tarjeta ' + (this.nullCheck(paymentDetails && paymentDetails.cardType)) + (paymentDetails.cardType == "masterCard" || paymentDetails.cardType == "visa" ? '' :' Departamental')}</Paragraph>
                                <Paragraph className="a-orderDetail__paymentValueDetail">*{paymentDetails && (this.nullCheck(paymentDetails.creditCardNumber.substr(paymentDetails.creditCardNumber.length - 4)))}</Paragraph>
                            </React.Fragment>
                            :
                            address && address.paymentGroupMethod === "CIEBancomer" && address && address.paymentGrpType === "CIEBancomer" ?
                            <Paragraph className="a-orderDetail__paymentValue">{(address && address.paymentGroupMethod) || (paymentDetails && paymentDetails.paymentGroupMethod)}</Paragraph>
                            :
                            <Paragraph className="a-orderDetail__paymentValue">{(address && address.paymentGroupMethod) || (paymentDetails && paymentDetails.paymentGroupMethod)}</Paragraph>}
                    </div>
                </div>
            </div> //{(address && address.paymentGroupMethod) || (paymentDetails && paymentDetails.paymentGroupMethod) ?
        )
    }
}
export default orderDetailsAddress;
