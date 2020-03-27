
import React from 'react';
import PackedListInfo from '../../organisms/Container/PackedListInfo';
import Span from '../../atoms/Span/Span';
import Icons from '../../atoms/Icons/Icons';
import Label from "../../atoms/Label/Label";
import Button from "../../atoms/Button/Button";
import Router from 'next/router';

class DeliveryInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    orderTrackingButtonForSoms = (skuID, shippingGroupId, IsSomsOrder) => {
        Router.push('/tienda/users/trackingOrder?skuID=' + skuID + '&cie=' + false + '&shippingId=' + shippingGroupId + '&isSomsOrder=' + IsSomsOrder);
    }


    orderTrackingButton = (skuID, cieOrders, shippingGroupId, packageNumber, orderId, productSearchTerm) => {
        if (productSearchTerm) {
            if (packageNumber != null) {
                Router.push('/tienda/users/trackingOrder?skuID=' + skuID + '&cie=' + cieOrders + '&shippingId=' + shippingGroupId + '&packageNumber=' + packageNumber + '&orderId=' + orderId + '&TrackingNo=' + productSearchTerm);
            } else {
                Router.push('/tienda/users/trackingOrder?skuID=' + skuID + '&cie=' + cieOrders + '&shippingId=' + shippingGroupId + '&orderId=' + orderId + '&TrackingNo=' + productSearchTerm);

            }
        } else {
            if (packageNumber != null) {
                Router.push('/tienda/users/trackingOrder?skuID=' + skuID + '&cie=' + cieOrders + '&shippingId=' + shippingGroupId + '&packageNumber=' + packageNumber + '&orderId=' + orderId);
            } else {
                Router.push('/tienda/users/trackingOrder?skuID=' + skuID + '&cie=' + cieOrders + '&shippingId=' + shippingGroupId + '&orderId=' + orderId);

            }
        }
    }

    render() {
        const IsSomsOrder = this.props && this.props.IsSomsOrder;
        const productSearchTerm = this.props.productDetails;
        const deliveryInfo = this.props.deliveryInfo;
        const orderDetails = this.props && this.props.orderDetails;
        const packedList = deliveryInfo && deliveryInfo.packedList;
        const cieorders = orderDetails.cieOrders;
        const staticLabels = this.props.staticLabels;
        const SomsData = deliveryInfo && deliveryInfo;
        // console.log('deliveryInfo on deliveryInfo', staticLabels)


        return (
            <React.Fragment>

                {IsSomsOrder ?

                    <React.Fragment>
                        <div className="o-order__product__header">
                            <div className="o-order__header__details">
                                {orderDetails && orderDetails.eventNumber ?
                                    <React.Fragment>
                                        <Span className="a-order__orderNumber normal">{staticLabels && staticLabels["pwa.OrderHistoryPage.Mesaderegalos.label"]}</Span>
                                        {SomsData.packageApplied === true || SomsData.pedidoNumber ? <Span className="a-order__separator light"> | </Span> : ''}
                                    </React.Fragment> : ''}
                                {orderDetails.OrderId ?
                                    <React.Fragment>
                                        <Span className="a-order__order light">{SomsData.productType === 'Digital' ? 'Referencia Digital:' : staticLabels && staticLabels["pwa.OrderHistoryPage.orderNum.lable"]} </Span>
                                        <Label className="a-order__orderNumber normal">{orderDetails.OrderId}
                                        </Label>
                                    </React.Fragment>
                                    : ''}

                                {orderDetails.productType === 'Digital' ?
                                    <div className="m-order__header__edd"><span className="a-order__order__status light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Descarga.label"]} </span>
                                        <Label className="a-order__edd__date normal">{SomsData.digitalErrorMessage}
                                        </Label>
                                    </div>
                                    :
                                    orderDetails && orderDetails.eventNumber ? <div className="m-order__header__edd">
                                        <Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Númerodeevento.label"]}</Span>
                                        <Label className="a-order__orderNumber normal">{orderDetails.eventNumber}
                                        </Label><Span className="a-order__separator light"> | </Span><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.festejado.label"]}</Span>
                                        <Label className="a-order__orderNumber normal">{SomsData.beneficiaryName}
                                        </Label>
                                    </div>
                                        :
                                        <div className={deliveryInfo.packageApplied === false ?
                                            ((SomsData.estimatedDeliveryDate === undefined || SomsData.estimatedDeliveryDate === null) ? "m-order__header__edd" : "m-order__header__consolidated") : "m-order__header__consolidated"}>
                                            {SomsData.itemStatus && 
                                                
                                                <React.Fragment>
                                                    {SomsData.itemStatus === "Cancelado" ? 
                                                    <Label className="a-order__footer__statusPayment --expired normal" id="statusPayment">El envío de este producto se canceló</Label>
                                                    : <Span className="a-order__order__status light">{SomsData.itemStatus} </Span>}
                                                    {SomsData.itemStatus === "Cancelado" ? '' : 
                                                    <React.Fragment>
                                                    <Span className="a-order__separator light"> | </Span> 
                                                    <Span className="a-order__edd light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Fecha.label"]}</Span>
                                                    </React.Fragment>}
                                                </React.Fragment>
                                            }
                                             
                                            {SomsData.estimatedDeliveryDate ?
                                                 SomsData.itemStatus === "Cancelado" ? '' :
                                                <Label className="a-order__edd__date normal">{SomsData.estimatedDeliveryDate}</Label>
                                                : <Label className="a-order__edd__msg normal">{SomsData.EDDErrorCode}</Label>
                                             }

                                        </div>
                                }
                            </div>

                            {(orderDetails.commerceItems && orderDetails.commerceItems[0] && orderDetails.commerceItems[0].itemStatus !== "Cancelado") ?
                                <React.Fragment>
                                    <div className="m-order__header__delivery">
                                        <Button className="a-btn a-btn--primary ripple" onClick={() => this.orderTrackingButtonForSoms(SomsData.SkuId, orderDetails.OrderId, IsSomsOrder)}>{staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"]}
                                        </Button>
                                    </div><Icons className="icon-arrow_right d-flex d-lg-none" onClick={() => this.orderTrackingButtonForSoms(SomsData.SkuId, orderDetails.OrderId, IsSomsOrder)} />
                                </React.Fragment> : null
                            }

                        </div>
                        <PackedListInfo packedList={SomsData} IsSomsOrder={IsSomsOrder} deliveryInfo={deliveryInfo} orderDetails={orderDetails} staticLabels={staticLabels} />
                    </React.Fragment>

                    :
                    <React.Fragment>
                        {
                            packedList[0].isRemovedFromPackage === false && (!(cieorders) || (cieorders && orderDetails.status === "PENDING_PAYMENT") || (orderDetails.status === "SUBMITTED"))
                                ?
                                <div className="o-order__product__header">
                                    <div className="o-order__header__details">
                                        {orderDetails && orderDetails.eventNumber || deliveryInfo && deliveryInfo.eventNumber ?
                                            <React.Fragment>
                                                {deliveryInfo && deliveryInfo.eventOwnerName?<Span className="a-order__orderNumber normal">{staticLabels && staticLabels["pwa.OrderHistoryPage.Mesaderegalos.label"]}</Span>:null}
                                                {deliveryInfo.packageApplied === true || packedList[0].pedidoNumber ? <Span className="a-order__separator light"> | </Span> : ''}
                                            </React.Fragment> : ''}
                                        {orderDetails.status === "SUBMITTED"
                                            ? deliveryInfo.packageApplied === true || packedList[0].pedidoNumber ?
                                                <React.Fragment>
                                                    <Span className="a-order__order light">{deliveryInfo.productType === 'Digital' ? staticLabels && staticLabels["pwa.OrderHistoryPage.ReferenciaDigital.label"] : staticLabels && staticLabels["pwa.OrderHistoryPage.orderNum.lable"]} </Span>
                                                    <Label className="a-order__orderNumber normal">{deliveryInfo.packageApplied === true && deliveryInfo.packageNumber ? deliveryInfo.packageNumber : packedList[0].pedidoNumber}
                                                    </Label>
                                                </React.Fragment>
                                                : '' : ''}

                                        {deliveryInfo.productType === 'Digital' ?
                                            <div className="m-order__header__edd"><span className="a-order__order__status light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Descarga.label"]}</span>
                                                <Label className="a-order__edd__date normal">{packedList[0].digitalErrorMessage}
                                                </Label>
                                            </div>
                                            :
                                            deliveryInfo && deliveryInfo.eventNumber ? <div className="m-order__header__edd">
                                                <Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Númerodeevento.label"]}</Span>
                                                <Label className="a-order__orderNumber normal">{deliveryInfo.eventNumber}
                                                </Label><Span className="a-order__separator light"> | </Span><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.festejado.label"]}</Span>
                                                <Label className="a-order__orderNumber normal">{packedList[0].beneficiaryName}
                                                </Label>
                                            </div>
                                                :
                                                <div className={deliveryInfo.packageApplied === false ?
                                                    ((packedList[0].estimatedDeliveryDate === undefined || packedList[0].estimatedDeliveryDate === null) ? "m-order__header__edd" : "m-order__header__consolidated")
                                                    : deliveryInfo.packageDeliveryDate ? "m-order__header__consolidated" : "m-order__header__edd"}>
                                                    {(packedList[0].itemStatus === "Cancelado" /* updated for 23431*/ || (packedList[0] &&  packedList[0].itemStatus && packedList[0].itemStatus.indexOf("cancelo") > -1)) ?  <Label className="a-order__footer__statusPayment --expired normal" id="statusPayment">El envío de este producto se canceló</Label>
                                                    : packedList[0].itemStatus &&
                                                        <React.Fragment>
                                                            <Span className="a-order__order__status light">{packedList[0].itemStatus} </Span>
                                                            <Span className="a-order__separator light"> | </Span> <Span className="a-order__edd light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Fecha.label"]}</Span>
                                                        </React.Fragment>
                                                    }
                                                    {deliveryInfo.packageApplied === false ?
                                                        (packedList[0].estimatedDeliveryDate === undefined || packedList[0].estimatedDeliveryDate === null) ?
                                                            <Label className="a-order__edd__msg normal">{packedList[0].EDDErrorCode}</Label>
                                                            :(
                                                                <React.Fragment>
                                                                    <Label className="a-order__edd__date normal">{packedList[0].estimatedDeliveryDate}</Label>
                                                                    <Label className="a-order__edd__date normal">{packedList[0].paymentValidityMessage}</Label>
                                                                </React.Fragment>
                                                            ) 
                                                        : deliveryInfo.packageDeliveryDate ? <Label className="a-order__edd__date normal">{deliveryInfo.packageDeliveryDate}</Label> :
                                                            <Label className="a-order__edd__msg normal">{packedList[0].EDDErrorCode}</Label>
                                                    }
                                                </div>
                                        }

                                    </div>

                                    {packedList[0].itemStatus === "Cancelado" || (packedList[0] && packedList[0].itemStatus && packedList[0].itemStatus.indexOf("cancelo") > -1) ? ''  // updated for 23431
                                        :
                                        !(orderDetails.cieOrders) || (orderDetails.cieOrders && orderDetails.status === "SUBMITTED") ?
                                            deliveryInfo.productType != "Digital" ?
                                                <React.Fragment>
                                                    <div className="m-order__header__delivery">
                                                        <Button className="a-btn a-btn--primary ripple" onClick={() => this.orderTrackingButton(packedList[0].skuID, orderDetails.cieOrders, packedList[0].shippingGroupId, deliveryInfo.packageNumber, orderDetails.orderId, productSearchTerm)}>{staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"]}
                                                        </Button>
                                                    </div><Icons className="icon-arrow_right d-flex d-lg-none" onClick={() => this.orderTrackingButton(packedList[0].skuID, orderDetails.cieOrders, packedList[0].shippingGroupId, deliveryInfo.packageNumber, orderDetails.orderId)} />
                                                </React.Fragment>
                                                : '' : ''}

                                </div> : ''}
                        {packedList && packedList.map((data, index) => { return <PackedListInfo key={index} packedList={data} deliveryInfo={deliveryInfo} orderDetails={orderDetails} staticLabels={staticLabels} /> })}
                    </React.Fragment>
                }
            </React.Fragment>

        )

    }
}

export default DeliveryInfo;


