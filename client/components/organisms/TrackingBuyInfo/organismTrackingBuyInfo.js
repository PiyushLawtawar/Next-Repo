
import React from 'react';
import Icons from '../../atoms/Icons/Icons';
import Link from '../../atoms/Link/Link';
import Router from 'next/router';
import Span from '../../atoms/Span/Span';
import { getPriceInFormat } from '../../../helpers/utilities/utility';
import './organismTrackingBuyInfo.styl'

class organismTrackingBuyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.show = React.createRef();
        this.close = React.createRef();
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
        const router = this.props.router;
        const isSomsOrder = router && router.isSomsOrder;
        const SomsshippingId = router && router.shippingId;
        const staticLabels = this.props.staticLabels;
        const SomscommerceItems = this.props.SomscommerceItems;
        const deliveryAddress = this.props && this.props.deliveryAddress;
        const deliveryInfo = this.props && this.props.deliveryInfo;
        const searchTerm = this.props.searchTerm;
        // console.log('deliveryInfo', SomscommerceItems)
        const orderId = deliveryInfo && deliveryInfo.orderId ? deliveryInfo.orderId : (this.props && this.props.router && this.props.router.orderId);
        const shippingGroupId = deliveryInfo && deliveryInfo.shippingGroupId ? deliveryInfo.shippingGroupId : (this.props && this.props.router && this.props.router.shippingId)
        const cie = deliveryInfo && deliveryInfo.isCieOrders ? deliveryInfo.isCieOrders : (this.props && this.props.router && this.props.router.cie)

        // console.log('date',searchTerm)
        const hasAddress = 'true';
 
        const options = {
            dropdownText: 'Liverpool Santa Fe',
            menuID: 'address',
            typeOf: 'text',
            classDropdown: 'a-tracking__addressValue a-tracking__addressValue--topPadding',
            classDiv: 'm-dropdown__tracking'
        }
        return (
            <div className="container o-trackingBuyInfo">
                <div className="row --bottomGrayLine">
                    <div className={isSomsOrder ? "col-12 col-lg-2 d-none d-lg-block p-0" : "col-12 col-lg-4 d-none d-lg-block p-0"}>
                        <div className="m-VerticalText  m-tracking__buyInfo">
                            <span className="a-tracking__buyInfoField">
                                {staticLabels && staticLabels["pwa.OrderHistoryPage.purchase.submitted.label"]}:
               <div className="m-progressBar_helper"><i data-toggle="popover" data-trigger="click hover" data-delay={150} data-container="#undefined" title=" " />
                                </div>
                            </span>
                            <span className="a-tracking__buyInfoValue">
                                {deliveryInfo ? deliveryInfo && deliveryInfo.dateOfCreation : SomscommerceItems && SomscommerceItems.dateOfPurchase}
                                <div className="m-progressBar_helper"><i data-toggle="popover" data-trigger="click hover" data-delay={150} data-container="#undefined" title=" " />
                                </div>
                            </span>
                        </div>
                    </div>

                    {isSomsOrder ?
                        <React.Fragment>
                            <div className="col-12 col-lg-6">
                                <div className="m-VerticalText  m-tracking__buyInfo">
                                    <span className="a-tracking__buyInfoField">{staticLabels && staticLabels["pwa.OrderHistoryPage.total.lable"]} </span><br />
                                    {SomscommerceItems && SomscommerceItems.Amount && <Span id="statusPayment" className="a-orderDetail__totalValue"> ${getPriceInFormat(SomscommerceItems.Amount)}</Span>}

                                </div>
                            </div>
                            <div class="col-12 col-lg-2">
                                <div class="m-VerticalText  m-tracking__buyInfo">
                                    <span class="a-tracking__buyInfoField">{staticLabels && staticLabels["pwa.OrderHistoryPage.orderNum.lable"]}</span>
                                    {SomscommerceItems && SomscommerceItems.OrderId && <Span className="a-orderDetail__dateValue"> {SomscommerceItems.OrderId}</Span>}
                                </div>
                            </div>
                        </React.Fragment>

                        :
                        <div className="col-12 col-lg-4">
                            {deliveryAddress && deliveryAddress.nickName ? <div className="m-VerticalText  m-tracking__buyInfo">

                                <span className="a-tracking__buyInfoField">{staticLabels && staticLabels["pwa.OrderHistoryPage.shping.addrLable"]}
                               <div className="m-progressBar_helper">
                                        <i data-toggle="popover" data-trigger="click hover" data-delay={150} data-container="#undefined" title=" " />
                                    </div>
                                </span>

                                <span className="a-tracking__buyInfoValue" onClick={(e) => this.showPopover(e, 'show')}>
                                    {deliveryAddress && deliveryAddress.nickName}
                                    <div className="m-progressBar_helper" id="tracking__helper1">
                                        <i className="icon-arrow_down a-tracking__classIcon m-progressBar_helper" id="tracking__popover1" data-toggle="popover" data-trigger="click hover" data-placement="bottom" data-delay={150}
                                            data-container="#tracking__helper1" title data-original-title=" " />
                                        <div className="popover fade bs-popover-bottom" role="tooltip" id="popover444379"
                                            style={{
                                                position: 'absolute', transform: 'translate3d(26px, 54px, 0px)',
                                                top: '0px', left: '0px', willChange: 'transform'
                                            }} x-placement="bottom" ref={this.show}>
                                            <div className="arrow" style={{ left: '125px' }} />
                                            <h3 className="popover-header" onClick={(e) => this.showPopover(e, 'remove')}> </h3>
                                            <div className="popover-body"> {deliveryAddress ? deliveryAddress.nickName + ', ' + deliveryAddress.address1 + ', ' + deliveryAddress.exteriorNumber + ', ' + (deliveryAddress.interiorNumber ? deliveryAddress.interiorNumber + ', ' : '') + deliveryAddress.city + ', '
                                                + deliveryAddress.state + ', ' + (deliveryAddress.neighbourhood || deliveryAddress.neighborhood) + ', ' + deliveryAddress.delegationMunicipality + ', ' + deliveryAddress.postalCode + ', ' + deliveryAddress.country + ', ' + (deliveryAddress.extension ? deliveryAddress.extension : '') : ''}</div>
                                        </div>

                                    </div>
                                </span>

                            </div> : ''}

                        </div>}
                    {isSomsOrder ?
                        <div className="col-12 col-lg-2 d-none d-lg-flex -right">
                            <Link className="a-tracking_buyDetails align-middle" href={SomsshippingId ? ('/tienda/users/orderDetails?IsSomsOrder=' + isSomsOrder  + '&TrackingNo=' + SomsshippingId) : ('/tienda/users/orderDetails?IsSomsOrder=' + isSomsOrder  + '&TrackingNo=' + searchTerm)} >Detalles de compra</Link><i className="icon-arrow_right align-middle a-tracking__arrowdetail" />
                        </div>
                        :
                        <div className="col-12 col-lg-4 d-none d-lg-flex -right">
                            <Link className="a-tracking_buyDetails align-middle" href={searchTerm ? ('/tienda/users/orderDetails?orderId=' + orderId + '?' + cie + '&shippingGroupId=' + shippingGroupId + '&TrackingNo=' + searchTerm) : ('/tienda/users/orderDetails?orderId=' + orderId + '?' + cie + '&shippingGroupId=' + shippingGroupId)} >Detalles de compra</Link><i className="icon-arrow_right align-middle a-tracking__arrowdetail" />
                        </div>
                    }
                </div>
            </div>
        )
    }
}
export default organismTrackingBuyInfo;