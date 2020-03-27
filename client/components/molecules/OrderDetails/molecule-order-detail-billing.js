import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';

class orderDetailsBilling extends React.Component {
    constructor(props) {
        super(props);
    }
    
    handleInvoiceAlert = (staticLabels)=> {
        this.props.show_alert(<div dangerouslySetInnerHTML={{ __html: staticLabels && staticLabels["pwa.orderDetailsPage.invoice.alreadygenerated"] }} />)
    }

    render() {
        const bill = this.props.bill;
        const orderDetails = this.props.orderDetails;
        const staticLabels = this.props.staticLabels;
        const invoiceGenerated = this.props.shippingDetails[0].invoiceGenerated;
        const trackingNumber = this.props.shippingDetails[0].trackingNumber
        // const giftEvent = 'ebvent';
        const facturarLink = this.props.giftEvent && this.props.giftEvent.commerceItems[0];

        // console.log('giftEvent', staticLabels)

        // const billNumber = bill && bill.shippingDetails[0] && bill.shippingDetails[0].CodigoFacturacion

        return (
            <div className="m-orderDetail__billing m-row row m-0">
                <div className="col-12 m-col col-xl-7 px-xl-0">
                    <Paragraph className="m-orderDetail__billTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.codigofactura.lable"]}
                        {bill && <Span className="a-orderDetail__billValue"> {bill} </Span>}</Paragraph>
                </div>
                <div className="col-12 m-col m-orderDetail__billingBlock col-xl-5">
                    {facturarLink.sellerName && facturarLink.sellerId ?
                        invoiceGenerated ? 
                           <Link className="m-orderDetail__billLink" href="" onClick={() => this.handleInvoiceAlert(staticLabels)}>
                                <Span className="a-orderDetail__billTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Facturar ahora.link"]}</Span>
                                <i className="icon-arrow_right a-orderDetail__billIcon"></i></Link>
                    :
                            <Link className="m-orderDetail__billLink" href={'/tienda/users/invoiceRequest' + '?trackingNumber=' + trackingNumber}>
                                <Span className="a-orderDetail__billTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Facturar ahora.link"]}</Span>
                                <i className="icon-arrow_right a-orderDetail__billIcon"></i></Link>
                        :
                        <Link className="m-orderDetail__billLink" href={staticLabels && staticLabels["pwa.orderConfirmationPage.ElectronicInvoiceLink.text"]}>
                            <Span className="a-orderDetail__billTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Facturar ahora.link"]}</Span>
                            <i className="icon-arrow_right a-orderDetail__billIcon"></i></Link>}
                </div>
            </div>
        )
    }
}
export default orderDetailsBilling;

