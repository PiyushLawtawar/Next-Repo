import React from 'react';
import { withRouter } from 'next/router';
import CellPhoneEdit from '../../../client/components/templates/myAccount/cellPhoneEdit';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <CellPhoneEdit data={data} />
        </React.Fragment>
      )}
    </parentContext.Consumer>
  );
});
