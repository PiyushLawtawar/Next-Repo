import React from 'react';
import { withRouter } from 'next/router';
import NotificationPreferences from '../../../client/components/templates/myAccount/myAccountNotificationPreferences/myAccountNotificationPreferences';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <NotificationPreferences data={data}/>
        </React.Fragment>
      )}
    </parentContext.Consumer>
  );
});