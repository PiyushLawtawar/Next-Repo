import React from 'react';
import { withRouter } from 'next/router';
import InvoiceConfirmationPage from '../../../client/components/templates/invoice/invoiceConfirmation';

export default withRouter((props) => {
  const invoiceData = (props.router && props.router.query && props.router.query.data) || {};
  return (
    <React.Fragment>
      <InvoiceConfirmationPage />
    </React.Fragment>
  );
});
