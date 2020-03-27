import React from 'react';
import { withRouter } from 'next/router';
import { Utility, GTMallPages, GetCookie } from '../../../client/helpers/utilities/utility';
import { parentContext } from '../../../client/contexts/parentContext';
import TrackOrderPage from '../../../client/components/templates/MyOrders/trackOrderPage';

class trackOrders extends React.Component {


  render() {

    const pageParameterTmp = this.props.router && this.props.router.query || {};
    // console.log('pageParameterTmp', labelDatza)

    return (
      <parentContext.Consumer>
        {({ data }) => (
          <React.Fragment>
            <TrackOrderPage pageParameterTmp={pageParameterTmp} data={data}/>
          </React.Fragment>
        )
        }
      </parentContext.Consumer>
    )
  }
}
export default withRouter(trackOrders);
