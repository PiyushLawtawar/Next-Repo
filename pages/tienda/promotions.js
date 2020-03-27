import React from 'react';
import { withRouter } from 'next/router';
import Promotions from '../../client/components/templates/promotions/promotions';

export default withRouter((props) => {
  return (
    <React.Fragment>
        <Promotions />
    </React.Fragment>
  );
});
