import React from 'react';
import { withRouter } from 'next/router';
import UpdatePersonalData from '../../../client/components/templates/myAccount/UpdatePersonalData';
import { parentContext } from '../../../client/contexts/parentContext';  
 
export default withRouter((props) => {

  return (
    <parentContext.Consumer>
      {({ data}) => (
      <React.Fragment>                                                                   
          <UpdatePersonalData data={data}/>                     
      </React.Fragment>
        )}
    </parentContext.Consumer>
  );
});

