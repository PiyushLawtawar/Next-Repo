import React from 'react';
import LoginPage from '../../client/components/templates/Login/Login';
import { withRouter } from 'next/router';
import { parentContext } from '../../client/contexts/parentContext';

export default withRouter((props) => {
  // Get site query parameter, default is lp
  const site = (props.router && props.router.query && props.router.query.site) || 'lp';
  let getturntokey = props.router.query.data && props.router.query.data.turntokeys || '';
  let labelData = props.router.query.data && props.router.query.data.labelData || {};
  let checkoutFooterData = props.router.query.data && props.router.query.data.checkoutFooterData || {};
  // Header API Call
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  return (
    <React.Fragment>
      <parentContext.Consumer>
        {({ loginDetails, headerData, data }) => {
          return <LoginPage headerData={headerData} loginDetails={loginDetails} getturntokey={getturntokey} labelData={labelData} footerData={checkoutFooterData.footerContent ? checkoutFooterData : data.checkoutFooterData} data={data} />
        }}
      </parentContext.Consumer>
    </React.Fragment>
  );
});
