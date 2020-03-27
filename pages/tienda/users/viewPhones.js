import React from 'react';
import { withRouter } from 'next/router';
import CellPhone from '../../../client/components/templates/myAccount/cellPhone';
import { parentContext } from '../../../client/contexts/parentContext';  

export default withRouter((props) => {
  return (
    <parentContext.Consumer>
       {({ data}) => (
        <React.Fragment>
          <CellPhone data={data} />
        </React.Fragment>
    )}
    </parentContext.Consumer>
  );
});
