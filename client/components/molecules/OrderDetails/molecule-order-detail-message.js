import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';

class orderDetailsMessage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const staticLabels = this.props.staticLabels;
        const paymentDetails = this.props.paymentDetails;
        // console.log("paymentDetails", paymentDe?tails)

        return (
            <React.Fragment>
                {paymentDetails.estatus == "Cancelado" ?

                    <div className="m-orderDetail__message m-orderDetail__card">
                        <div className="row m-row">
                            <div className="col-12 m-col">
                                <p className="a-orderDetail__message">{staticLabels && staticLabels["pwa.orderDetailsPage.canceledItems.info.bigText"]}
                                </p>
                            </div>
                        </div>
                    </div>

                    :
                    paymentDetails.estatus == "Pago pendiente" && paymentDetails.paymentGroupMethod == "Efectivo" ?
                     <div className="m-orderDetail__message m-orderDetail__card">
                        <div className="col-12 m-col">
                            {/*<div dangerouslySetInnerHTML={{ __html: staticLabels && staticLabels["pwa.orderDetailsPage.makeYourPayment.openPayStoreMessage.web.bigText"]}} />*/}
                            <p className="a-orderDetail__cashTitle">¿Cómo realizar tu pago?
                                                      </p>
                            <ul className="m-orderDetail__cashList">
                                <li className="m-orderDetail__cashElement">
                                    <p className="a-orderDetail__cashStep"><b>1.</b> Acude a cualquier tienda afiliada, puedes consultar tu tienda más cercana <a className="a-orderDetail__cashStepLink" href="#" target="_blank">aquí</a>
                                    </p>
                                </li>
                                <li className="m-orderDetail__cashElement">
                                    <p className="a-orderDetail__cashStep"><b>2.</b> Comunica al cajero que realizaras un pago de servicio Paynet.
                                                          </p>
                                </li>
                                <li className="m-orderDetail__cashElement">
                                    <p className="a-orderDetail__cashStep"><b>3.</b> Menciona la cantidad a pagar y tu código de referencia.
                                                          </p>
                                </li>
                                <li className="m-orderDetail__cashElement">
                                    <p className="a-orderDetail__cashStep"><b>4.</b> Te recordamos que es necesario conservar el comprobante de pago original, el cual deberá coincidir con el monto total de tu compra, en caso contrario, DISTRIBUIDORA LIVERPOOL, S.A. DE C.V. se reserva el derecho de realizar la entrega hasta en tanto no le sea acreditado el pago correspondiente.
                                                          </p>
                                </li>
                            </ul>
                        </div>
                        </div>
                        :
                        <div className="m-orderDetail__message m-orderDetail__card">
                            <div className="row m-row">
                                <div className="col-12 m-col">
                                 {/*<div dangerouslySetInnerHTML={{ __html: staticLabels && staticLabels["pwa.orderDetailsPage.makeYourPayment.openPayOnlineMessage.web.bigText"]}} />*/}
                                
                                    <Paragraph className="a-orderDetail__speiTitle">¿Cómo realizar tu pago?</Paragraph>
                                    <ul className="m-orderDetail__speiList">
                                        <li className="m-orderDetail__speiElement">
                                            <Paragraph className="a-orderDetail__speiStep"><b>1. SPEI®</b> es un sistema de transferencias electrónicas, a través de la banca por internet o de la banca móvil. Para realizar tu pago es necesario utilizar la CLABE informada para dar de alta de la Cuenta Destino.</Paragraph>
                                        </li>
                                        <li className="m-orderDetail__speiElement">
                                            <Paragraph className="a-orderDetail__speiStep"><b>2.</b> Si al dar de alta la cuenta necesitas un nombre de banco destino, puedes ingresar: <b>BBVA Bancomer</b>.</Paragraph>
                                        </li>
                                        <li className="m-orderDetail__speiElement">
                                            <Paragraph className="a-orderDetail__speiStep"><b>3.</b> Los datos de este ticket solo son válidos para este pedido y podrá ser utilizada una sola vez, por lo que el pago debe efectuarse por el monto exacto de la compra. Si se efectúa por un monto diferente al indicado, éste será rechazado de manera automática.</Paragraph>
                                        </li>
                                        <li className="m-orderDetail__speiElement">
                                            <Paragraph className="a-orderDetail__speiStep"><b>4.</b> Tienes hasta la fecha de vencimiento indicada para realizar el pago.</Paragraph>
                                        </li>
                                        <li className="m-orderDetail__speiElement">
                                            <Paragraph className="a-orderDetail__speiStep"><b>5.</b> Te recordamos que es necesario conservar el comprobante de pago original, el cual deberá coincidir con el monto total de tu compra, en caso contrario, DISTRIBUIDORA LIVERPOOL, S.A. DE C.V. se reserva el derecho de realizar la entrega hasta en tanto no le sea acreditado el pago correspondiente.</Paragraph>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                }
            </React.Fragment>
        )
    }
}
export default orderDetailsMessage;
