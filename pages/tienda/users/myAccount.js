import React from 'react';
import { withRouter } from 'next/router';
import PersonalData from '../../../client/components/templates/myAccount/personalData';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
  return (
    <parentContext.Consumer>
      {({ data }) => (
        <React.Fragment>
          <PersonalData data={data} />
        </React.Fragment>
      )}
    </parentContext.Consumer>
  );
});

