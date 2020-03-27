import React from 'react';
import { withRouter } from 'next/router';
import PLPChannel from '../../client/components/templates/plp/chanel';

export default withRouter((props) => {
  return (
    <React.Fragment>
      <PLPChannel />
    </React.Fragment>
  );
});
