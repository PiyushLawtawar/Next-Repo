


import React from 'react';
import Button from "../../atoms/Button/Button";
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Router from 'next/router';

import './moleculeemailSend.styl'

class MoleculeEmailSendBody extends React.Component {

    render() {
        const emailId = this.props.emailId;
        const staticLabels = this.props.staticLabels;

        return (

            <div className="m-emailSend-instructions__content">
                <address className="a-email-userEmail">{emailId}</address>
                <Paragraph>
                     <div dangerouslySetInnerHTML={{ __html: staticLabels && staticLabels["pwa.forgotPassword.emailSent.text"] }} />
                     </Paragraph>
                <Button className="a-btn a-btn--secondary" handleClick={() => { Router.push(`/tienda/home`) }}>{this.props.staticLabels['pwa.forgotPassword.return.text']}
                                    </Button>
            </div>

        )

    }
}

export default MoleculeEmailSendBody;






