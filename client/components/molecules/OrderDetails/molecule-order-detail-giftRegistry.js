import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import get from 'lodash/get';
import Span from '../../atoms/Span/Span';

class orderDetailsGift extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const staticLabels = this.props.staticLabels;
        const beneficiaryName = this.props.beneficiaryName;
        const giftEvent = this.props.giftEvent;
        // console.log('gift',shippingDetails)

        return (
            <div className="m-orderDetail__giftRegistry">
                <Paragraph className="a-orderDetail__giftRegistryTitle">Mesa de regalos</Paragraph>
                <Paragraph className="m-orderDetail__giftRegistryEvent">{staticLabels && staticLabels["pwa.orderConfirmationPage.giftregistryevent.label"]}
                     <Span className="a-orderDetail__giftRegistryEventValue">{giftEvent}</Span>
                </Paragraph>
                <Paragraph className="m-orderDetail__giftRegistryCelebrated">{staticLabels && staticLabels["pwa.orderConfirmationPage.giftrecipientname.label"]}
                    {/*<Span className="a-orderDetail__giftRegistryEventCelebratedValue">{giftEvent.eventOwnerName}</Span>*/}
                    <Span className="a-orderDetail__giftRegistryEventCelebratedValue">{beneficiaryName}</Span>                    
                </Paragraph>
                
            </div>
        )
    }
}
export default orderDetailsGift;

