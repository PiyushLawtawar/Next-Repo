/**
	* Module Name : CommonShippingPage
	* Functionality : Showing checkout billing page
	* @exports : CheckoutBilling
	* @requires : module:React
	* @requires : module:next/router
	* @requires : module:/client/components/templates/Pdp/Pdp
	* @requires : module:/client/components/templates/CheckoutBillingPage
	* @requires : module:/client/contexts/parentContext
	* @requires : module:/client/components/organisms/Header/Header
	* @requires : module:lodash/get
	* @requires : module:/client/helpers/utilities/utility
	* @requires : module:/client/helpers/config/config
	* Team : Checkout Team
	* Other information : Based on the login status showing dynamic forms.
	* 
	*/
import React from 'react';
import { withRouter } from 'next/router'
// import '../../assets/stylus/global.styl';
import HomePage from '../../client/components/templates/Pdp/Pdp';
import CheckoutBillingPage from '../../client/components/templates/CheckoutBillingPage'

import { parentContext } from '../../client/contexts/parentContext';
import Header from '../../client/components/organisms/Header/Header';
import get from 'lodash/get';
import { Utility } from '../../client/helpers/utilities/utility';
import { Path } from '../../client/helpers/config/config';

/**
* @class CheckoutBilling
* @classdesc Main function which will get exported and will get imported in other JS
*/
class CheckoutBilling extends React.Component {

  static async getInitialProps ({ req, query  }) {
      let myData = {};
      let staticLablesData = {};
      if(!req){
        // const pageName ="?pageName=pwa-billingPage";
        myData = await Utility(Path.checkoutItemsDetail, 'POST', { "pageName": "billingPage" });
        // staticLablesData = await Utility(Path.staticLabelsFetch+pageName, 'GET'/*, {pageName: ['pwa-billingPage']}*/)
      }
      return {initialPropsData:myData.data }
      // return {initialPropsData:myData.data,staticLablesData: staticLablesData.data}
  }

/**
 * REACT life cycle Event. This will get fire on load and on state update.
 * @event render 
 * 
 */
render(){
  const mainContent = this.props.initialPropsData || (this.props.router && this.props.router.query && this.props.router.query.data && this.props.router.query.data.mainContent) || {};
  const staticLables = (this.props.router && this.props.router.query && this.props.router.query.data && this.props.router.query.data.staticLabelValues) || '';
  const cartHeader = (this.props.router && this.props.router.query && this.props.router.query.data && this.props.router.query.data.cartHeader) || {};
  const site = (this.props.router && this.props.router.query && this.props.router.query.site) || 'lp';
  const data = (this.props.router && this.props.router.query && this.props.router.query.data) || 'lp';
  const hostname = (this.props.initialPropsData && this.props.initialPropsData.hostname) || (this.props.router && this.props.router.query && this.props.router.query.data && this.props.router.query.data.hostname) || 'pwa.liverpool.com.mx';
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  const articleDetails = {
    text: "Home Page",
    headerStyle: "a-paragraph__primary"
  };
  let getheader = '';
  let getFooter = '';
  if(this.props && this.props.router && this.props.router.query && this.props.router.query.data){
    getheader = this.props.router.query.data.checkoutHeaderData;
    getFooter = this.props.router.query.data.checkoutFooterData;
  }
  // start defect 23406 again commented for 23622
  // if(mainContent && mainContent.creditCards && mainContent.creditCards.records && mainContent.creditCards.records.length>0){
  //   mainContent.creditCards.records = mainContent.creditCards.records.map((record,key)=>{
  //     if(record && record.creditCardNumber){
  //       record.creditCardNumber = record.creditCardNumber.slice(-4);
  //     }
  //     return record;
  //   })
  // }
  // end defect 23406
  return (
    <React.Fragment>
      <CheckoutBillingPage getheader={getheader} getFooter={getFooter} oneColumnData={this.props.router.query.data} mainContent={mainContent} staticLables={staticLables} cartHeader={cartHeader} hostname={hostname}/>
    </React.Fragment>
  );
}
};
export default withRouter(CheckoutBilling);