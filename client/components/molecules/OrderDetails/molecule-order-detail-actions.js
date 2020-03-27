import React from 'react';
import Button from '../../atoms/Button/Button';
import Router from 'next/router';
import get from 'lodash/get';
import Icon from '../../atoms/Icons/Icons';

class orderDetailsAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            afterOrderSearched: '',
        }
    }

    backToOrderHistory = (searchTerm,skuID,shippingGroupId,isCieOrders,orderId) => {
         window && window.history.back();
    }
    render() {
        const staticLabels = this.props.staticLabels;
        // const orderDetails = this.props.orderDetails;
        // console.log('staticLabels',staticLabels)
        const skuID = get(this.props.orderDetails, 'shippingDetails[0].commerceItems[0].skuId', '');
        const loginDetails = this.props.loginDetails;
        const searchTerm = this.props.searchTerm;
        const Router = this.props.Router;
        const orderId = Router && Router.orderId.split('?')[0];
        const isCieOrders = Router && Router.orderId.split('?')[1];
        const shippingGroupId = Router && Router.shippingGroupId;
        

        return (
            <div className="m-orderDetail__actions">
                <div className="row m-row">
                    <div className="m-col offset-lg-8 col-lg-4">

                        <Button className="a-btn a-btn--secondary" handleClick={() => this.backToOrderHistory(searchTerm,skuID,shippingGroupId,isCieOrders,orderId)}>{staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.status.regresarbtn"]}</Button>

                    </div>
                    {/*<div className="m-col col-lg-1 pt-lg-1">
                        <Icon className="a-orderDetail__print icon-print" />
                    </div>*/}
                </div>
            </div>
        )
    }
}
export default orderDetailsAction;

