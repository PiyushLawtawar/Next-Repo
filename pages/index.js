import React from 'react';
import { withRouter } from 'next/router'
//import '../assets/stylus/global.styl';
import HomePage from '../client/components/templates/homePage/homePage';

export default withRouter((props) => {
  // Get site query parameter, default is lp
  const site = (props.router && props.router.query && props.router.query.site) || 'lp';
  // Header API Call
  // const dataFromAPICall = require('../lib/config/datasource/header.json');
  const articleDetails = {
    text: "Home Page",
    headerStyle: "a-paragraph__primary"
  };
  return (
    <React.Fragment>
      <HomePage />
    </React.Fragment>
  );
});