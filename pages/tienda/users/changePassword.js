import React from 'react';
import { withRouter } from 'next/router';
import ChangePassword from '../../../client/components/templates/change_password/change_password';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <ChangePassword data={data} />
        </React.Fragment>
      )}
    </parentContext.Consumer>
  );
});