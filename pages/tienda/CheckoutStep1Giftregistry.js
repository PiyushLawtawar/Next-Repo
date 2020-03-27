/**
* Module Name : CheckoutPage
* Functionality : Component used to show the billing page. This is get called from \pages\tienda\checkoutBilling.js
* @exports : CheckoutPage
* @requires : module:React
* @requires : module:next/router
* @requires : module:/client/components/templates/CheckoutPage
* Team : Checkout Team
* Other information : Showing the billing page
* 
*/
import React from 'react';
import { withRouter } from 'next/router'
// import '../../assets/stylus/global.styl';
// import HomePage from '../../client/components/templates/Pdp/Pdp';
import CheckoutPage from '../../client/components/templates/CheckoutPage'

// import { parentContext } from '../../client/contexts/parentContext';
// import Header from '../../client/components/organisms/Header/Header';
// import get from 'lodash/get';


/**
 * @class withRouter
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default withRouter((props) => {
  const site = (props.router && props.router.query && props.router.query.site) || 'lp';
  const data = (props.router && props.router.query && props.router.query.data) || 'lp';
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  const articleDetails = {
    text: "Home Page",
    headerStyle: "a-paragraph__primary"
  };

  return (
    <React.Fragment>
      <CheckoutPage oneColumnData={props.router.query.data}/>
    </React.Fragment>
  );
});