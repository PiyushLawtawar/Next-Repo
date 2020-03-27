
import React from 'react';
import isEmpty from 'lodash/isEmpty';
// import { Utility } from './../../../../helpers/utilities/utility';
// import { Path } from './../../../helpers/config/config';
import { parentContext } from '../../../contexts/parentContext';
import CheckoutHeaderFooter from '../../organisms/Header/CheckoutHeaderFooter';
import ForgetPasswordHeader from '../../organisms/Header/ForgetPasswordHeader';
//import LoginHeader from '../../organisms/Header/LoginHeader'
import RecoveryPassword from '../../organisms/Recovery_Password/RecoveryPassword';

//import './myAddressPage.styl';

class passwordRecover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, checkoutHeaderFooterData, setCheckoutHeaderFooterData }) => (
                    <CheckoutHeaderFooter onlyFooter={true}>
                        <div>
                            <ForgetPasswordHeader headerData={headerData} />
                            <RecoveryPassword data={this.props.data}/>
                        </div>
                    </CheckoutHeaderFooter>
                )
                }
            </parentContext.Consumer>
        )
    }
}

export default passwordRecover;


