import React from 'react';
import { withRouter } from 'next/router';
import InvoiceRequirements from '../../../client/components/templates/invoice/invoiceRequirements';
import { parentContext } from '../../../client/contexts/parentContext';

export default withRouter((props) => {
    const invoiceData = (props.router && props.router.query && props.router.query.data) || {};
    const emailId = props && props.router.query.emailID;
    //console.log('ddddddddddddddddddddddddddddddd')
    return (
        <React.Fragment>
            <parentContext.Consumer>
                {({ configurationData }) => {
                   return <InvoiceRequirements configurationData={configurationData} />
                    {/*<h2>sdfsdfsfs</h2>*/ }
                }}
            </parentContext.Consumer>
        </React.Fragment>

    );
});
