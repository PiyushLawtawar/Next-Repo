import React from 'react';
import { withRouter } from 'next/router';
import CardAdd from '../../../client/components/templates/myAccount/card-add';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {

    const creditCardId = props && props.router.query.creditCardId;
    return (
        <parentContext.Consumer>
            {({ data }) => (
                <React.Fragment>
                    <CardAdd creditCardId={creditCardId} data={data} />
                </React.Fragment>
            )}
        </parentContext.Consumer>
    );
});

