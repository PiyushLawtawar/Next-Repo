import React from 'react';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import PasswordRecover from '../../../client/components/templates/password_recovery/passwordRecover';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {

  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <PasswordRecover data={data}/>
        </React.Fragment>
      )}
    </parentContext.Consumer>
  );
});