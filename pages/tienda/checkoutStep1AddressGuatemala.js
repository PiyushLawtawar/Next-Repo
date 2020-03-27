import React from 'react';
import { withRouter } from 'next/router'
import CheckoutPage from '../../client/components/templates/CheckoutPage'

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
      <CheckoutPage oneColumnData={props.router.query.data} mainContent={props.router.query.data.mainContent}/>
    </React.Fragment>
  );
});
