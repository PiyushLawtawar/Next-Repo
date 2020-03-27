
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import Ul from '../../atoms/Ul/Ul';
import { Popover } from "../../molecules/Popover/Popover";
import { Utility, UserAgentDetails, savePDF } from '../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import map from 'lodash/map';
import Span from '../../atoms/Span/Span';
import Label from "../../atoms/Label/Label";
import get from 'lodash/get';
import Icons from '../../atoms/Icons/Icons';
import Router from 'next/router';
import Button from '../../atoms/Button/Button';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import DeliveryInfo from './DeliveryInfo'
import PopoverHelpingText from '../../molecules/Popover/PopoverHelpingText'
const FileSaver = require('file-saver');


class ContainerBlockBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetails: this.props.orderDetails,
            window: {}
        }
        this.show = React.createRef();
        this.close = React.createRef();
    }

    componentDidMount = (e) => {
        const windowObj = window || {};
        this.setState({
            window: windowObj
        });
    }
    SomsOrderDetailPage = (productSearchTerm, IsSomsOrder) => {
        if (IsSomsOrder && productSearchTerm) {
            Router.push('/tienda/users/orderDetails?IsSomsOrder=' + IsSomsOrder + '&TrackingNo=' + productSearchTerm);
        }
    }

    OrderDetailPage = (orderId, cie, productSearchTerm) => {
        if (productSearchTerm) {
            Router.push('/tienda/users/orderDetails?orderId=' + orderId + '?' + cie + '&TrackingNo=' + productSearchTerm);
        } else {
            Router.push('/tienda/users/orderDetails?orderId=' + orderId + '?' + cie);
        }
    }

    /**
     * Method will call on click of download pdf icon
     * @function downloadPDFfromIcon
     * @author shreyansh.khare@zensar.com
     * @desc Creating pdf data on click of icon and calling downlaodPDFHandler function.
     * @param {object}
     *
     */

    downloadPDFfromIcon = (orderId, email, cieReferenceNumber, cashPaymentType) => {
        let pdfDataForPrePayment = {
            "orderId": orderId,
            "email": email,
            "cieReferenceNum": cieReferenceNumber,
            "paymentMethod": cashPaymentType
        }
        this.downloadPDFHandler(pdfDataForPrePayment);
    }

    /**
     * Method will download the pdf file.
     * @function downloadPDFHandler
     * @author shreyansh.khare@zensar.com
     * @desc Downloading pdf data by using savePDF (iOS) module.
     * @param {object} pdfData
     *
     */

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
            //var blob = new Blob([view], { type: "data:application/octet-stream" });
            //FileSaver.saveAs(blob, pdfData.orderId + '.pdf');
    // 24124 End
        }
    }

    showPopover = (e, id) => {
        if (id === 'show') {
            this.show.current.classList.add('show');
        } else {
            this.show.current.classList.remove('show');
        }
        e.stopPropagation();
    }

    render() {
        const IsSomsOrder = this.props && this.props.IsSomsOrder;
        const productSearchTerm = this.props.productDetails;
        const loginDetails = this.props.loginDetails;
        const orderDetails = this.props.orderDetails;
        const addressInfo = orderDetails.deliveryAddress;
        const deliveryInfo = orderDetails.deliveryInfo;
        const staticLabels = this.props.staticLabels || this.props.searchedLabels;
        const searchedLabels = this.props.searchedLabels;
        const Email = get(loginDetails, 'cartHeaderResponse.cartHeaderDetails.email', '');
        const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
        // console.log('staticLabels-----kkk',orderDetails)

        // console.log('searchedLabels-----',orderDetails)

        const optionsRow = {
            rows: 2,
            rowsContent: [
                //- head of the container
                {
                    title: 'header',
                    row: [
                        //- Cell
                        {
                            title: 'Fecha de compra'
                        },
                        //- Cell
                        {
                            title: 'Dirección de envío:',
                            subtitle: 'Guadalupe Villaobos'
                        },
                        //- Cell
                        {
                            title: 'Detalle de compra'
                        }
                    ]
                },
                //- products
                {
                    title: 'products',
                    products: [
                        {
                            title: 'product-consolidated',
                            quantity: 2
                        }
                    ]
                }
            ]
        }



        return (
            <React.Fragment>
                {IsSomsOrder ?
                    <div className="o-content white-container bordered mb-4">
                        <div className="o-order__container">
                            <div className="o-order__container__header g-3">
                                <div className="o-order__container__header__cell">
                                    <p className="a-order__container__header--title">{staticLabels && staticLabels["pwa.OrderHistoryPage.purchase.cancelled.label"]}</p>
                                    <p className="a-order__container__header--subtitle">{orderDetails.dateOfPurchase}</p>
                                </div>
                                {/*<div className="o-order__container__header__cell">
                                    <p className="a-order__container__header--title">Total:</p>
                                    <p className="a-order__container__header--subtitle">{orderDetails.total}</p>
                                </div>*/}
                                <div className="o-order__container__header__cell">
                                    <p className="a-order__container__header--title">Total:</p>
                                    <p id="statusPayment" className="a-order__footer__statusPayment --expired normal">{orderDetails.total}</p>
                                </div>
                                <div className="o-order__container__header__cell">
                                    <Span className="a-order__container__header--title" onClick={() => this.SomsOrderDetailPage(productSearchTerm, IsSomsOrder)} >{optionsRow.rowsContent[0].row[2].title}</Span></div>
                            </div>
                            <div className="o-order__container__products">
                                {IsSomsOrder && (orderDetails && orderDetails.commerceItems && orderDetails.commerceItems.length) ?
                                    orderDetails.commerceItems.map((data, index) => <DeliveryInfo key={index} IsSomsOrder={IsSomsOrder} productDetails={productSearchTerm} deliveryInfo={data} orderDetails={orderDetails} staticLabels={staticLabels} />)
                                    : null
                                }
                            </div>
                            {orderDetails && orderDetails.cieOrders ?
                                <div className={orderDetails.estatus === "Vencido" || orderDetails.estatus === "Cancelado" ? "o-order__container__footer -expired" : "o-order__container__footer"}>
                                    <div className="o-order__footer__cell"> <span className="a-order__footer__status light">{staticLabels && staticLabels["pwa.orderSuccessPage.estatus.label"]}</span>
                                        {orderDetails.estatus === "Pago pendiente" ? <Label className="a-order__footer__statusPayment --pending normal">{orderDetails.estatus} </Label>
                                            : orderDetails.estatus === "Pagado" ? <Label className="a-order__footer__statusPayment --paid normal">{orderDetails.estatus} </Label>
                                                : <Label className="a-order__footer__statusPayment --expired normal">{orderDetails.estatus}
                                                </Label>}
                                    </div>
                                    <div className="o-order__footer__cell"> <span className="a-order__footer__reference light">{staticLabels && staticLabels["pwa.OrderHistoryPage.referencia.txtlable"]} </span>
                                        <Label className="a-order__footer__referenceNumber normal">{orderDetails.cieReferenceNumber}
                                        </Label>
                                    </div>
                                    <div className="o-order__footer__cell"> <span className="a-order__footer__validity light">{staticLabels && staticLabels["pwa.orderDetailsPage.vence.label"]}: </span>
                                        <Label className="a-order__footer__validityDate normal">{orderDetails.cashExpDate}
                                        </Label>
                                    </div>
                                    {isDesktop && orderDetails.estatus === "Pago pendiente" ? <div className="o-order__footer__cell">
                                        <Button onClick={() => this.downloadPDFfromIcon(orderDetails.orderId, Email, orderDetails.cieReferenceNumber, orderDetails.cashPaymentType)} className="a-btn a-btn--primary a-order__footer__downloadTicket ripple">{staticLabels && staticLabels["pwa.openpay.ticket.download.text"]}
                                        </Button>
                                    </div> : <div className="o-order__footer__cell"></div>}
                                </div> : ''}
                        </div>
                        <div className="m-orders__detail__mobile d-flex d-lg-none" onClick={() => this.SomsOrderDetailPage(productSearchTerm, IsSomsOrder)}><span>{optionsRow.rowsContent[0].row[2].title}</span><i className="icon-arrow_right"></i>
                        </div>
                    </div>

                    :
                    <div className={loginDetails && loginDetails.LoggedInSession ? "o-content white-container bordered mb-4" : "o-content white-container bordered guest"}>
                        <div className="o-order__container">
                            <div className="o-order__container__header g-3">
                                <div className="o-order__container__header__cell">
                                    <p className="a-order__container__header--title">{staticLabels && staticLabels["pwa.OrderHistoryPage.purchase.cancelled.label"]}</p>
                                    <p className="a-order__container__header--subtitle">{orderDetails.dateOfPurchase}</p>
                                </div>
                                <div className="o-order__container__header__cell">
                                    {addressInfo ?
                                        <div className="o-order__container__header--subtitle">
                                            <p className="a-order__container__header--title">{deliveryInfo[0].eventNumber ? staticLabels && staticLabels["pwa.OrderHistoryPage.enviar.txtlable"] : staticLabels && staticLabels["pwa.OrderHistoryPage.shping.addrLable"]}</p> </div> : ''}
                                    {deliveryInfo[0].eventNumber ?
                                        <p className="a-order__container__header--subtitle">{addressInfo.firstName + ' ' + addressInfo.lastName}</p>
                                        :
                                        <div className="o-order__container__header--subtitle" onClick={(e) => this.showPopover(e, 'show')}>
                                            <p className="a-order__container__header--subtitle">{deliveryInfo[0].eventNumber ? (addressInfo.firstName + ' ' + addressInfo.lastName) : addressInfo && addressInfo.nickName}</p>
                                            <div className="o-order__container__header__tooltip">
                                                {addressInfo ?
                                                    <React.Fragment>
                                                        <i className="icon-arrow_down" />
                                                        <div className="o-order__container__header__tooltip__container" ref={this.show}>
                                                            <div className="m-order__container__header__tooltip__container__text">
                                                                <p className="a-order__container__header__tooltip__container__text">
                                                                    {addressInfo ? (addressInfo.nickName ? addressInfo.nickName + ', ' : '') + addressInfo.address1 + ', ' + addressInfo.exteriorNumber + ', ' + (addressInfo.interiorNumber ? addressInfo.interiorNumber + ', ' : '') + addressInfo.city + ', '
                                                                        + addressInfo.state + ', ' + addressInfo.neighborhood + ', ' + addressInfo.delegationMunicipality + ', ' + addressInfo.postalCode + ', ' + addressInfo.country + ', ' + (addressInfo.extension ? addressInfo.extension : '') : ''}</p>
                                                            </div>
                                                            <div className="m-order__container__header__tooltip__container__close" ><i className="icon-close" onClick={(e) => this.showPopover(e, 'remove')} /></div>
                                                            <div className="a-order__container__header__tooltip__container__indicator" />
                                                        </div>
                                                    </React.Fragment>
                                                    : ''}
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="o-order__container__header__cell">
                                    <Span className="a-order__container__header--title" onClick={() => this.OrderDetailPage(orderDetails.orderId, orderDetails.cieOrders, productSearchTerm)} >{optionsRow.rowsContent[0].row[2].title}</Span></div>
                            </div>
                            <div className="o-order__container__products">

                                {deliveryInfo && deliveryInfo.length ? deliveryInfo.map((data, index) => <DeliveryInfo key={index} staticLabels={staticLabels} productDetails={productSearchTerm} deliveryInfo={data} orderDetails={this.props.orderDetails} />) : null}
                            </div>
                            {orderDetails && orderDetails.cieOrders ?
                                <div className={orderDetails.estatus === "Vencido" ? "o-order__container__footer -expired" : "o-order__container__footer"}>
                                    <div className="o-order__footer__cell"> <span className="a-order__footer__status light">{staticLabels && staticLabels["pwa.orderSuccessPage.estatus.label"]}</span>
                                        {orderDetails.estatus === "Pago pendiente" ? <Label className="a-order__footer__statusPayment --pending normal">{orderDetails.estatus} </Label>
                                            : orderDetails.estatus === "Pagado" ? <Label className="a-order__footer__statusPayment --paid normal">{orderDetails.estatus} </Label>
                                                : <Label className="a-order__footer__statusPayment --expired normal">{orderDetails.estatus}
                                                </Label>}
                                    </div>
                                    {orderDetails.estatus === "Cancelado" ? '' : <div className="o-order__footer__cell"> <span className="a-order__footer__reference light">{staticLabels && staticLabels["pwa.OrderHistoryPage.referencia.txtlable"]} </span>
                                        <Label className="a-order__footer__referenceNumber normal">{orderDetails.cieReferenceNumber}
                                        </Label>
                                    </div>}
                                    <div className="o-order__footer__cell"> <span className="a-order__footer__validity light">{staticLabels && staticLabels["pwa.orderDetailsPage.vence.label"]}: </span>
                                        <Label className="a-order__footer__validityDate normal">{orderDetails.cashExpDate}
                                        </Label>
                                    </div>
                                    {isDesktop && orderDetails.estatus === "Pago pendiente" ? <div className="o-order__footer__cell">
                                        <Button onClick={() => this.downloadPDFfromIcon(orderDetails.orderId, Email, orderDetails.cieReferenceNumber, orderDetails.cashPaymentType)} className="a-btn a-btn--primary a-order__footer__downloadTicket ripple">{staticLabels && staticLabels["pwa.openpay.ticket.download.text"]}
                                        </Button>
                                    </div> : <div className="o-order__footer__cell"></div>}
                                </div> : ''}
                        </div>
                        <div className="m-orders__detail__mobile d-flex d-lg-none" onClick={() => this.OrderDetailPage(orderDetails.orderId, orderDetails.cieOrders, productSearchTerm)}><span>{optionsRow.rowsContent[0].row[2].title}</span><i className="icon-arrow_right"></i>
                        </div>
                    </div>
                }
            </React.Fragment>

        )

    }
}

export default ContainerBlockBody;


