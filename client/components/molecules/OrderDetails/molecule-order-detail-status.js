import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';

class orderDetailsStatus extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const paymentGroupMethod =
            (this.props.orderDetails && this.props.orderDetails.paymentGroupMethod) || (this.props.orderDetails && this.props.orderDetails.orderDetails.paymentDetails && this.props.orderDetails.orderDetails.paymentDetails.paymentGroupMethod);
        const status = this.props.status;
        const paymentDetails = this.props.orderDetails && this.props.orderDetails.orderDetails.paymentDetails;
        const staticLabels = this.props.staticLabels;

        return (
            <React.Fragment>
                <div className="m-orderDetail__status m-orderDetail__card">
                    <div className="row m-row">
                        {paymentGroupMethod == 'paypal' ?
                            <React.Fragment>
                                {status && status.BallotNumber && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__orderTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Boleta.label"]}
                                    <Span className="a-orderDetail__orderValue"> {status.BallotNumber}</Span></Paragraph>
                                </div>}
                                {status && status.terminal && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__terminalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.terminal.text"]}
                                    <Span className="a-orderDetail__terminalValue"> {status.terminal}</Span></Paragraph>
                                </div>}
                                {status && status.tienda && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.tienda.lable"]}
                                    <Span className="a-orderDetail__storeValue"> {status.tienda}</Span></Paragraph>
                                </div>}
                                {paymentDetails && paymentDetails.folioPago && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__folioTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Foliodepago.label"]}
                                    <Span className="a-orderDetail__folioValue"> {paymentDetails.folioPago}</Span></Paragraph>
                                </div>}
                                {paymentDetails && paymentDetails.folioPaypal && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__foliopaypalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Foliopaypal.label"]}
                                    <Span className="a-orderDetail__foliopaypalValue"> {paymentDetails.folioPaypal}</Span></Paragraph>
                                </div>}
                            </React.Fragment>
                            : ''}

                        {paymentGroupMethod == 'Efectivo' || paymentGroupMethod == "pagoEffectivo" ?
                            <React.Fragment>
                                {paymentDetails && paymentDetails.estatus && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__statusTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.estatus.lable"]}
                                    {(paymentDetails.estatus == 'Cancelado' || paymentDetails.estatus == 'Vencido') && <Span className="a-orderDetail__statusValue -cancelled"> {paymentDetails.estatus}</Span> /*23896 */}
                                    {paymentDetails.estatus == "Pago pendiente" && <Span className="a-orderDetail__statusValue -pending"> {paymentDetails.estatus}</Span>}
                                    {paymentDetails.estatus == 'Pagado' && <Span className="a-orderDetail__statusValue -approved"> {paymentDetails.estatus}</Span>}</Paragraph>
                                </div>}
                                {paymentDetails && paymentDetails.cieBancomerReference && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__terminalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.referencia.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {paymentDetails.cieBancomerReference}</Span></Paragraph>
                                </div>}
                                {paymentDetails && paymentDetails.openPayExpiryDateAndTime && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.vence.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {paymentDetails.openPayExpiryDateAndTime}</Span></Paragraph>
                                </div>}
                                {status &&  status.tienda && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.tienda.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {status.tienda}</Span></Paragraph>
                                </div>}
                            </React.Fragment>
                            : ''}

                        {paymentGroupMethod == 'Transferencia' ?
                            <React.Fragment>
                                {paymentDetails && paymentDetails.estatus && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__statusTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.estatus.lable"]}
                                    {(paymentDetails.estatus == 'Cancelado' || paymentDetails.estatus == 'Vencido') && <Span className="a-orderDetail__statusValue -cancelled"> {paymentDetails.estatus}</Span> /*23896 */}
                                    {paymentDetails.estatus == "Pago pendiente" && <Span className="a-orderDetail__statusValue -pending"> {paymentDetails.estatus}</Span>}
                                    {paymentDetails.estatus == 'Pagado' && <Span className="a-orderDetail__statusValue -approved"> {paymentDetails.estatus}</Span>}</Paragraph>
                                </div>}
                                {paymentDetails && paymentDetails.cieBancomerReference && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__terminalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.referencia.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {paymentDetails.cieBancomerReference}</Span></Paragraph>
                                </div>}
                                {paymentDetails && paymentDetails.openPayExpiryDateAndTime && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.vence.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {paymentDetails.openPayExpiryDateAndTime}</Span></Paragraph>
                                </div>}
                                {status && status.tienda && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.tienda.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {status.tienda}</Span></Paragraph>
                                </div>}
                            </React.Fragment>
                            : ''}

                        {paymentGroupMethod == 'creditCard' ?
                            <React.Fragment>
                                {status &&  status.BallotNumber && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__ticketTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Boleta.label"]}
                                    <Span className="a-orderDetail__bankValue"> {status.BallotNumber}</Span></Paragraph>
                                </div>}
                                {status &&  status.terminal && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__terminalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.terminal.text"]}
                                    <Span className="a-orderDetail__bankValue"> {status.terminal}</Span></Paragraph>
                                </div>}
                                {status &&  status.tienda && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.tienda.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {status.tienda}</Span></Paragraph>
                                </div>}
                                {status &&  status.CCAuthorization && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.autoriz.bacaria.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {status.CCAuthorization}</Span></Paragraph>
                                </div>}
                            </React.Fragment>
                            : ''}

                        {paymentGroupMethod == 'CIEBancomer' ? 
                        <React.Fragment>
                                {status &&  status.BallotNumber && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__ticketTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Boleta.label"]}
                                    <Span className="a-orderDetail__bankValue"> {status.BallotNumber}</Span></Paragraph>
                                </div>}
                                {status &&  status.terminal && <div className="col-12 m-col col-lg-3">
                                    <Paragraph className="m-orderDetail__terminalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.terminal.text"]}
                                    <Span className="a-orderDetail__bankValue"> {status.terminal}</Span></Paragraph>
                                </div>}
                                {status &&  status.tienda && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.tienda.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {status.tienda}</Span></Paragraph>
                                </div>}
                                {status &&  status.CCAuthorization && <div className="col-12 m-col col-lg-2">
                                    <Paragraph className="m-orderDetail__storeTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.autoriz.bacaria.lable"]}
                                    <Span className="a-orderDetail__bankValue"> {status.CCAuthorization}</Span></Paragraph>
                                </div>}
                            </React.Fragment>
                            : '' }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default orderDetailsStatus;