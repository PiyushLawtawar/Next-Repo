/**
 * Module Name : Pdp Offer List Module.
 * Functionality : This Component will help to render OneColumnPage Component for PDP Offer Listing Page.
 * @exports  : PDP Offer Listing Page
 * @requires : module:React
 * @requires : module:next/router#withRouter
 * @requires : module:client/components/templates/OneColumnPage#OneColumnPage
 * Team : B&S Team.
 * 
 */
import React from 'react';
import { withRouter } from 'next/router'
import OneColumnPage from '../../client/components/templates/OneColumnPage'

export default withRouter((props) => {
  // Get site query parameter, default is lp
  const site = (props.router && props.router.query && props.router.query.site) || 'lp';
  const data = (props.router && props.router.query && props.router.query.data) || 'lp';
  // Header API Call
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  const articleDetails = {
    text: "Home Page",
    headerStyle: "a-paragraph__primary"
  };

  return (
    <React.Fragment>
      <OneColumnPage oneColumnData={props.router.query.data}/>
    </React.Fragment>
  );
});
