import React from 'react';
import { withRouter } from 'next/router';
import CreateAccount from '../../../client/components/templates/CreateAccount/CreateAccount';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
    return (
        <parentContext.Consumer>
            {({ data }) => (
                <React.Fragment>
                    <CreateAccount data={data} />
                </React.Fragment>
            )}
        </parentContext.Consumer>
    );
});