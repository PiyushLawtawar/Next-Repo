import React from 'react';
import { withRouter } from 'next/router';
import { Utility } from '../../../client/helpers/utilities/utility';
import { Path } from '../../../client/helpers/config/config';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import MyAddress from '../../../client/components/templates/myAccount/my-address';
import Router from 'next/router';
import { parentContext } from '../../../client/contexts/parentContext';

class MyAccount extends React.Component {


  static async getInitialProps({ req, query }) {
    try {
      let myData = {};
      if (!req) {
        myData = await Utility(Path.getAddressesMyAccount, 'POST', {});
        if (myData && myData.data && myData.data.errorCode === '1002') {
          Router.push('/tienda/login')
        }
      }
      return { initialPropsData: myData.data }
    } catch (e) {
      console.error(e, "error");
    }
  }

  render() {
    const addressIdVal = this.props.initialPropsData && this.props.initialPropsData.addressId || '';
    const addressData = this.props.initialPropsData || get(this.props, 'router.query.data.userData', {}); //this.props && props.router.query.data && props.router.query.data.userData;
    const addressId = addressIdVal || get(this.props, 'router.query.addressId', {}); // props && props.router.query.addressId;\\
    return (
      <parentContext.Consumer>
       {({ data}) => (
        <React.Fragment>
          <MyAddress userAddress={addressData} addressId={addressId} data={data} />
        </React.Fragment>
       )}
       </parentContext.Consumer>
    );
  }
}

export default withRouter(MyAccount);
