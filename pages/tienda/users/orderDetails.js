import React from 'react';
import Router from 'next/router';
import OrderDetailPage from '../../../client/components/templates/orderDetails/loginBillingGroup';
import { Utility, GTMallPages,  GetCookie  } from '../../../client/helpers/utilities/utility';
import { Path } from '../../../client/helpers/config/config';

class orderDetails extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      orderData: {},

    };
    this.searchTerm = '',
    this.Router = '',
    this.IsSomsOrder = ''
  }


  componentDidMount() {
    // let logged = this.getCookie('LoggedInSession')
    // console.log('logged',logged,this.props)
    // if (logged === 'TRUE' && this.props && this.props.orderDetails && this.props.orderDetails.errorCode === '1002') {
    //   Router.push('/tienda/login')
    // }

    let orderId = ''
    let isCieOrders = ''

    if (Router && Router.router && Router.router.query && Router.router.query.orderId) {
      this.Router = Router.router.query;
      orderId = Router.router.query.orderId.split('?')[0];
      isCieOrders = Router.router.query.orderId.split('?')[1];
      this.searchTerm = Router.router.query.TrackingNo;
    } else if (Router && Router.router && Router.router.query && Router.router.query.IsSomsOrder) {
      this.IsSomsOrder = Router.router.query.IsSomsOrder;
      this.searchTerm = Router.router.query.TrackingNo;
    }
    if (!(this.IsSomsOrder)) {
    this.orderRecord(orderId, isCieOrders);
    }

    if (this.IsSomsOrder) {
      const payload = {
        "trackingNumber": this.searchTerm
      }

      Utility(Path.orderSearch, 'POST', payload).then(response => {
        if (response && response.data && response.data.code == 500 || response.data.s == 1) {
          window.scrollTo(0, 0);
          this.show_alert(response.data.err)
        } else if (response.data.s == 0) {
          const orderDetails = response.data || {};
          // console.log('orderDetails kkk', orderDetails)
          this.setState({ orderData: orderDetails});
        }
      }, (error) => {
        console.error(error);
      });
    }
  }

  orderRecord = (orderId, isCieOrders) => {
    let payload = {
      "orderId": orderId ? orderId : "",
      "isCieOrders": isCieOrders ? isCieOrders : "false"
    }
    Utility(Path.orderDetailService, 'POST', payload).then(response => {
      if (response && response.data && response.data.s === '0') {
        this.setState({ orderData: response.data })
      }
      if(response && response.data && response.data.errorCode === '1002'){
        Router.push('/tienda/login')
      }
    }, (error) => {
      console.error("Error ==== :: ", error);
    });
  }

  render() {
    const { orderData } = this.state;
    const searchTerm = this.searchTerm;
    const IsSomsOrder = this.IsSomsOrder;

    return (
      <React.Fragment>
        <OrderDetailPage orderData={orderData} searchTerm={this.searchTerm} Router={this.Router} IsSomsOrder={this.IsSomsOrder} />
      </React.Fragment>
      
    );

  }


}

export default orderDetails;


