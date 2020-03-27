/**
* Module Name : CheckoutPage
* Functionality : Component used to show the billing page. This is get called from \pages\tienda\checkoutBilling.js
* @exports : CheckoutPage
* @requires : module:React
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:/headerFooter/headerFooter
* @requires : module:/organisms/Header/Header
* @requires : module:lodash/get
* @requires : module:/contexts/parentContext
* @requires : module:/checkout/BillingCommonPage
* @requires : module:/organisms/Header/CheckoutHeaderFooter
* Team : Checkout Team
* Other information : Showing the billing page
* 
*/
import React from 'react';
import { Utility } from '../../helpers/utilities/utility';
import { Path } from '../../helpers/config/config';
import Footer from './headerFooter/headerFooter';

import Header from '../organisms/Header/Header';
import get from 'lodash/get';
import { parentContext } from '../../contexts/parentContext';

// import CheckoutStep1PreselectedAddressLogin from './checkout/CheckoutStep1PreselectedAddressLogin';
// import CheckoutStep1AddressGuatemala from './checkout/CheckoutStep1AddressGuatemala';
// import CheckoutStep1Giftregistry from './checkout/CheckoutStep1Giftregistry';
// import CommonShippingPage from './checkout/CommonShippingPage';
import BillingCommonPage from './checkout/BillingCommonPage';
import CheckoutHeaderFooter from '../organisms/Header/CheckoutHeaderFooter';

export default class CheckoutPage extends React.Component {
    constructor(props) {
        super(props);

        const mainContent = (props.mainContent) || {};
        const headerContent = (props.oneColumnData && props.oneColumnData.headerContent) || {};
        this.state = {
            mainContent: mainContent
        };

    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
        const pageType = this.state.pageType;
        const headerContent = get(this.props.oneColumnData, 'headerContent', '');
        const headerData = headerContent[0];
        const header = {
            pageName:"pageName",
            downarrow: "icon-arrow_down"
        }
        
        return (
            <parentContext.Consumer>
                {({ handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails }) => (

                    <React.Fragment>

                        {/*<Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            data={header}
                            headerData={headerData}
                            />*/}




                        {/*<CheckoutStep1AddressGuatemala mainContent={this.state.mainContent}/>*/}
                        <CheckoutHeaderFooter>
                           <BillingCommonPage mainContent={this.state.mainContent} loginDetails={loginDetails}/>
                            <parentContext.Consumer>
                                {({ showModal }) => (
                                        <div className={showModal['billingmodel'] ? 'modal-backdrop show' : ''}></div>
                                )}
                            </parentContext.Consumer>
                            <parentContext.Consumer>
                                {({ showModal }) => (
                                        <div className={showModal['billingInnerModel'] ? 'modal-backdrop show' : ''}></div>
                                )}
                            </parentContext.Consumer>
                        </CheckoutHeaderFooter>
                        {/*<CheckoutStep1AddressGuatemala mainContent={this.state.mainContent} />*/}
                    </React.Fragment>

                )}
            </parentContext.Consumer>


        )
    }
}


