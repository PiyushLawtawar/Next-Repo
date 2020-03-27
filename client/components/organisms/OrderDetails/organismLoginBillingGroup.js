import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import get from 'lodash/get';
import Button from "../../atoms/Button/Button";
import MoleculeOrderDetailAddress from '../../molecules/OrderDetails/molecule-order-detail-address';
import MoleculeOrderDetailBilling from '../../molecules/OrderDetails/molecule-order-detail-billing';
import MoleculeOrderDetailGiftRegistry from '../../molecules/OrderDetails/molecule-order-detail-giftRegistry';
import MoleculeOrderDetailStatus from '../../molecules/OrderDetails/molecule-order-detail-status';
import MoleculeOrderDetailTotal from '../../molecules/OrderDetails/molecule-order-detail-total';
import MoleculeOrderDetailActions from '../../molecules/OrderDetails/molecule-order-detail-actions';
import MoleculeorderDetailsMessage from '../../molecules/OrderDetails/molecule-order-detail-message';
import { Span } from '../../molecules/MixinMolecules/MixinMolecules';
import OrganismOrderDetailProduct from './organismOrderDetailProduct';
import { Utility, savePDF } from '../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import './organismOrderDetail.styl';
const FileSaver = require('file-saver');



class orderLoginDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    downloadPDFfromIcon = (orderId, email, cieReferenceNumber, cashPaymentType) => {
        let pdfDataForPrePayment = {
            "orderId": orderId,
            "email": email,
            "cieReferenceNum": cieReferenceNumber,
            "paymentMethod": cashPaymentType
        }
        this.downloadPDFHandler(pdfDataForPrePayment);
    }

    downloadPDFHandler = async (pdfData) => {

        const body = await Utility(Path.downloadTicket, 'POST', pdfData);

        let base64 = body.data.fileByteContent;
        if (base64) {
            if (base64.charAt(base64.length - 1) === "'") {
                base64 = response.data.fileByteContent.substr(0, response.data.fileByteContent.length - 1);
            }
            var binary = atob(base64);
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }

            // 24124 Start
            let fileName = Math.floor(Math.random() * 20);
            savePDF([view], pdfData.orderId + fileName + '.pdf');

            // var blob = new Blob([view], { type: "data:application/pdf;base64" });
           // var blob = new Blob([view], { type: "data:application/octet-stream" });
            //FileSaver.saveAs(blob, pdfData.orderId + '.pdf');
            // 24124 End
        }
    }

    render() {
        const loginDetails = this.props.loginDetails;
        const IsSomsOrder = this.props.IsSomsOrder;
        const Email = get(loginDetails, 'cartHeaderResponse.cartHeaderDetails.email', '');
        const orderDetails = this.props.orderData;
        const somsStaticLabels = get(orderDetails, 'staticLabels.staticLabelValues[1].keyValues', '');
        const shippingDetails = orderDetails && orderDetails.shippingDetails;
        const paymentDetails = get(orderDetails, 'orderDetails.paymentDetails', '');
        const staticLabels = this.props.staticLabels;
        const giftEvent = get(orderDetails, 'shippingDetails[0].commerceItems[0].giftRegistryEventNumber', '');
        const beneficiaryName = get(orderDetails, 'shippingDetails[0].commerceItems[0].beneficiaryName', '');

        // console.log('beneficiaryName',beneficiaryName)
        // console.log('giftEvent', giftEvent)


        return (
            <React.Fragment>
                {IsSomsOrder ?
                    <div className="o-orderDetail">
                        <div className="row o-row">
                            <div className="col-12 o-col">
                                <MoleculeOrderDetailTotal staticLabels={staticLabels} somsOrderdetails={orderDetails && orderDetails.somsOrder} />
                            </div>

                            <div className="col-12 o-col">
                                <div className="row o-row o-orderDetail__card">

                                    <div className="col-12 px-lg-0">
                                        <div className="o-orderDetail__products">
                                            <div className="row o-row m-orderDetail__headers m-0">
                                                <div className="col-lg-3 m-col">
                                                    <Paragraph className="a-orderDetail__productHeader -product">{somsStaticLabels && somsStaticLabels["pwa.orderDetailsPage.Producto.lable"]}</Paragraph>
                                                </div>
                                                <div className="col-lg-9 m-col">
                                                    <div className="row m-row">
                                                        <p className="a-orderDetail__productHeader -name col-lg-3">{somsStaticLabels && somsStaticLabels["pwa.orderDetailsPage.Nombre.label"]}  </p>
                                                        <Paragraph className="a-orderDetail__productHeader -price col-lg-2">{somsStaticLabels && somsStaticLabels["pwa.orderDetailsPage.prouctunit.lable"]} </Paragraph>
                                                        <Paragraph className="a-orderDetail__productHeader -quantity col-lg-2">{somsStaticLabels && somsStaticLabels["pwa.orderDetailsPage.Cantidad.lable"]} </Paragraph>
                                                        <Paragraph className="a-orderDetail__productHeader -promo col-lg-2">{somsStaticLabels && somsStaticLabels["pwa.orderDetailsPage.promotion.lable"]} </Paragraph>
                                                        <Paragraph className="a-orderDetail__productHeader -total col-lg-2">{somsStaticLabels && somsStaticLabels["pwa.orderDetailsPage.headertotal.lable"]}</Paragraph>
                                                    </div>
                                                </div>
                                            </div>
                                            {orderDetails && orderDetails.somsOrder && orderDetails.somsOrder.commerceItems && orderDetails.somsOrder.commerceItems.length > 0 ? orderDetails.somsOrder.commerceItems.map((data, index) =>
                                                <React.Fragment key={index} >
                                                    <div className="col-12 o-col">
                                                        <OrganismOrderDetailProduct staticLabels={staticLabels} product={data} IsSomsOrder={IsSomsOrder} /> </div>
                                                </React.Fragment>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 o-col d-none d-lg-block">
                                <MoleculeOrderDetailActions Router={this.props.Router} loginDetails={loginDetails} orderDetails={orderDetails} staticLabels={somsStaticLabels} searchTerm={this.props.searchTerm} />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="o-orderDetail">
                        <div className="row o-row">
                            {paymentDetails && paymentDetails.estatus == 'Pago pendiente' &&
                                <div className="col-12 o-col col-lg-4 offset-lg-8 col-xl-3 offset-xl-9">
                                    <Button onClick={() => this.downloadPDFfromIcon(orderDetails.orderNumber, Email, paymentDetails.cieBancomerReference, paymentDetails.paymentGroupMethod)} className="a-btn a-btn--primary a-orderDetail__productDownloadTicket">{staticLabels && staticLabels["pwa.openpay.ticket.download.text"]}</Button>
                                </div>}
                            <div className="col-12 o-col">
                                <MoleculeOrderDetailTotal staticLabels={staticLabels} details={orderDetails} />
                            </div>
                            {loginDetails && loginDetails.LoggedInSession &&
                                <div className="col-12 o-col">
                                    <MoleculeOrderDetailAddress staticLabels={staticLabels} address={orderDetails} />
                                </div>}
                            {shippingDetails && shippingDetails.length > 0 ? shippingDetails.map((data, index) =>
                                <React.Fragment key={index} >
                                    <div className="col-12 o-col" key={index}>
                                        <div className="row o-row o-orderDetail__card">
                                            {paymentDetails.estatus == 'Cancelado' || paymentDetails.estatus == 'Vencido' || paymentDetails.estatus == "Pago pendiente" ? '' :
                                                <React.Fragment>
                                                    <div className="col-12 px-0 col-lg-6">
                                                        {giftEvent ? <MoleculeOrderDetailGiftRegistry staticLabels={staticLabels} giftEvent={giftEvent} beneficiaryName={beneficiaryName}/> : ''}
                                                    </div>
                                                    <div className="col-12 px-0 col-lg-6">
                                                        <MoleculeOrderDetailBilling orderDetails={orderDetails} show_alert={this.props.show_alert} shippingDetails={shippingDetails} giftEvent={data} staticLabels={staticLabels} bill={data.CodigoFacturacion} />
                                                    </div>
                                                </React.Fragment>
                                            }
                                            <div className="col-12 px-lg-0">
                                                <div className="o-orderDetail__products">
                                                    <div className="row o-row m-orderDetail__headers m-0">
                                                        <div className="col-lg-3 m-col">
                                                            <Paragraph className="a-orderDetail__productHeader -product">{staticLabels && staticLabels["pwa.orderDetailsPage.Producto.lable"]}</Paragraph>
                                                        </div>
                                                        <div className="col-lg-9 m-col">
                                                            <div className="row m-row">
                                                                <p className="a-orderDetail__productHeader -name col-lg-3">{staticLabels && staticLabels["pwa.orderDetailsPage.Nombre.label"]}  </p>
                                                                <Paragraph className="a-orderDetail__productHeader -price col-lg-2">{staticLabels && staticLabels["pwa.orderDetailsPage.prouctunit.lable"]} </Paragraph>
                                                                <Paragraph className="a-orderDetail__productHeader -quantity col-lg-2">{staticLabels && staticLabels["pwa.orderDetailsPage.Cantidad.lable"]} </Paragraph>
                                                                <Paragraph className="a-orderDetail__productHeader -promo col-lg-2">{staticLabels && staticLabels["pwa.orderDetailsPage.promotion.lable"]} </Paragraph>
                                                                <Paragraph className="a-orderDetail__productHeader -total col-lg-2">{staticLabels && staticLabels["pwa.orderDetailsPage.headertotal.lable"]}</Paragraph>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 o-col">
                                                        <OrganismOrderDetailProduct staticLabels={staticLabels} product={data} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 o-col">
                                        <MoleculeOrderDetailStatus staticLabels={staticLabels} status={data} orderDetails={orderDetails} />
                                    </div>
                                </React.Fragment>
                            ) : null}
                            {orderDetails && orderDetails.orderDetails && orderDetails.orderDetails.paymentDetails && (orderDetails.orderDetails.paymentDetails.estatus == 'Pago pendiente' || orderDetails.orderDetails.paymentDetails.estatus == "Cancelado") ?
                                <div className="col-12 o-col">
                                    <MoleculeorderDetailsMessage staticLabels={staticLabels} paymentDetails={paymentDetails} />
                                </div> : ''}
                            <div className="col-12 o-col d-none d-lg-block">
                                <MoleculeOrderDetailActions Router={this.props.Router} loginDetails={loginDetails} orderDetails={orderDetails} staticLabels={staticLabels} searchTerm={this.props.searchTerm} />
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}
export default orderLoginDetail;

