


import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { H2 } from "../../atoms/HeadLines/Headlines";
import { parentContext } from '../../../contexts/parentContext';
import CheckoutHeaderFooter from '../../organisms/Header/CheckoutHeaderFooter';
import LoginHeader from '../../organisms/Header/LoginHeader'
import MoleculeEmailSend from '../../molecules/EmailSend/moleculeEmailSend'
import './moleculeemailSend.styl';


class SendEmailPage extends React.Component {

  render() {

    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, checkoutHeaderFooterData, setCheckoutHeaderFooterData }) => (
          <CheckoutHeaderFooter onlyFooter={true}>
            <div>
              <LoginHeader headerData={headerData} />
              <MoleculeEmailSend emailId={this.props.emailId} />
            </div>
          </CheckoutHeaderFooter>
        )
        }
      </parentContext.Consumer>
    )

  }
}

export default SendEmailPage;






