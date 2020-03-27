import React from 'react';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import NotificationPreferences from '../../client/components/templates/myAccount/myAccountNotificationPreferences/myAccountNotificationPreferences';

export default withRouter((props) => {
  const addressData = props && props.router.query.data && props.router.query.data.userData;
  
  return (  
    <React.Fragment> 
        <NotificationPreferences />
    </React.Fragment>
  );
});