import React from 'react';
import { withRouter } from 'next/router';
import StoreLocatorDetails from '../../client/components/templates/StoreLocator/StoreLocatorDetails';

export default withRouter((props) => {
  return ( 
    <React.Fragment> 
        <StoreLocatorDetails/>
    </React.Fragment>
  );
});