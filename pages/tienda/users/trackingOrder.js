import React from 'react';
import Router from 'next/router';
import { Utility,  GTMallPages,  GetCookie } from '../../../client/helpers/utilities/utility';
import { withRouter } from 'next/router';
import TrackingOrderMarketplace from '../../../client/components/templates/MyOrders/trackingOrderMarketplace';


class trackingOrder extends React.Component {


  render() {
    const router = Router && Router.router && Router.router.query;
    // console.log('router', router)

    return (
      <React.Fragment>
        <TrackingOrderMarketplace router={router} />
      </React.Fragment>
    )
  }
}
export default withRouter(trackingOrder);
