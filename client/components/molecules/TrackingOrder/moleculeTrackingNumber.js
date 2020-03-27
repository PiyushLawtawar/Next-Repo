import React from 'react';
import Router from 'next/router';
import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';

class MoleculeTrackingNumber extends React.Component {
    constructor(props) {
        super(props);
    }

    redirectTothirdPartyLink = (url) => {
        window.open(url, '_blank');
        // Router.push(url)
    }
    render() {
        const router = this.props.router;
        const isSomsOrder = router && router.isSomsOrder;
        const SomsshippingId = router && router.shippingId;
        const commerceItems = this.props && this.props.commerceItems;
        const TrackingNumber = this.props && this.props.deliveryInfo && this.props.deliveryInfo.trackingNumber;
        const deliveryInfo = this.props && this.props.deliveryInfo;
        const orderId = deliveryInfo && deliveryInfo.orderId ? deliveryInfo.orderId : (this.props && this.props.router && this.props.router.orderId);
        const cie = deliveryInfo && deliveryInfo.isCieOrders ? deliveryInfo.isCieOrders : (this.props && this.props.router && this.props.router.cie)
        const staticLabels = this.props.staticLabels;
        // console.log('staticLabels',staticLabels && staticLabels["pwa.OrderHistoryPage.ship.guideNo"])

        return (
            <React.Fragment>

                {isSomsOrder ?
                     <div className="d-block d-lg-none pb-1">
                    <div className="o-trackingOrder__headline"><Link className="a-btn a-btn__tabs -noRadius" href={'/tienda/users/orderDetails?IsSomsOrder=' + isSomsOrder + '&TrackingNo=' + SomsshippingId}>Detalles de compra
                                                                  <div>

                        </div><i className="icon-arrow_right"></i></Link>
                    </div>
                    </div>

                    :
                    <React.Fragment>
                        <div className="container d-none d-lg-block">

                            {commerceItems && commerceItems[0].shippingCarrierType ?
                                <div className="row m-trackingNumber__row">
                                    <span className="m-trackingNumber__company">Envío {commerceItems[0].shippingCarrierType}</span>
                                    <span className="m-trackingNumber__separator">  |  </span>
                                    <span className="m-trackingNumber__company">Número de guía:</span>
                                    <Link className="m-trackingNumber__number" href={commerceItems && commerceItems[0] && commerceItems[0].thirdPartyLink} target="_blank">
                                        {commerceItems[0].thirdParty3PLNum}
                                    </Link>
                                </div>
                                :
                                ''}
                        </div>

                        <div className="d-block d-lg-none pb-1">
                            {commerceItems && commerceItems[0].shippingCarrierType ?
                                <div className="o-trackingOrder__headline"><a className="a-btn a-btn__tabs -noRadius" href="#">
                                    <div className="o-trackingOrder__headlineNumber">
                                        <div><span className="a-trackingOrder__numberSpan1">Envío {commerceItems[0].shippingCarrierType}</span>
                                        </div>
                                        <div><span className="a-trackingOrder__numberSpan2">{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.guideNo"]} </span><span className="a-trackingOrder__numberSpan3" onClick={() => this.redirectTothirdPartyLink(commerceItems[0].thirdPartyLink)}>{commerceItems[0].thirdParty3PLNum}</span>
                                        </div>
                                    </div><i className="icon-arrow_right" onClick={() => this.redirectTothirdPartyLink(commerceItems[0].thirdPartyLink)}></i></a>
                                </div>
                                : ''}

                            <div className="o-trackingOrder__headline"><Link className="a-btn a-btn__tabs -noRadius" href={'/tienda/users/orderDetails?orderId=' + orderId + '?' + cie}>Detalles de compra
                                                                  <div>

                                </div><i className="icon-arrow_right"></i></Link>
                            </div>

                        </div>
                    </React.Fragment>}
            </React.Fragment>
        )
    }
}
export default MoleculeTrackingNumber;