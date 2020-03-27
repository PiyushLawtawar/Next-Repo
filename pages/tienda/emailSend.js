import React from 'react';
import { withRouter } from 'next/router';
import SendEmailPage from '../../client/components/templates/sendEmail/sendEmail';

export default withRouter((props) => {
const emailId = props && props.router.query.emailID;
  return (
    <React.Fragment>
        <SendEmailPage emailId={emailId} />
    </React.Fragment>
  );
});
