import React from 'react';
import { withRouter } from 'next/router';
import { parentContext } from '../../../client/contexts/parentContext';
import Invoice from '../../../client/components/templates/invoice/invoice';

export default withRouter((props) => {
  const invoiceData = (props.router && props.router.query && props.router.query.data) || {};
  const emailId = props && props.router.query.emailID;
  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <Invoice data={data}/>
        </React.Fragment>
      )
      }
    </parentContext.Consumer>
  );
});
