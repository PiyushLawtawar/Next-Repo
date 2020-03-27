import React from 'react';
import { withRouter } from 'next/router';
import PDPChannel from '../../client/components/templates/Pdp/chanel';
import { parentContext } from '../../client/contexts/parentContext';

export default withRouter((props) => {
  return (
    <React.Fragment>
      <parentContext.Consumer>
        {({ updateCartHeaderDetails, loginDetails, backEvent }) => (
          <PDPChannel mainContent={props.router.query.data} updateCartHeaderDetails={updateCartHeaderDetails} loginDetails={loginDetails} backEvent={backEvent} />
        )}
      </parentContext.Consumer>

    </React.Fragment>
  );
});
