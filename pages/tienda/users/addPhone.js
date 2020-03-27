import React from 'react';
import { withRouter } from 'next/router';
import CellPhoneAdd from '../../../client/components/templates/myAccount/cellPhoneAdd';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <CellPhoneAdd data={data} />
        </React.Fragment>
      )}
    </parentContext.Consumer>
  );
});
