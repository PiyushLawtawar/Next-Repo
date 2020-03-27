
/**
* Module Name : CheckoutPromotion
* Functionality : Showing checkout promotion page
* @exports : CheckoutPromotion
* @requires : module:React
* @requires : module:next/router
* @requires : module:/client/components/templates/checkout/CheckoutStep3
* @requires : module:/client/contexts/parentContext
* @requires : module:/client/components/organisms/Header/Header
* @requires : module:/client/components/templates/headerFooter/headerFooter
* @requires : module:/client/components/organisms/Header/CheckoutHeaderFooter
* @requires : module:/client/helpers/utilities/utility
* @requires : module:lodash/get
* @requires : module:lodash/isEmpty
* Team : Checkout Team
* 
*/

import React from 'react';
import { withRouter } from 'next/router'
import CheckoutStep3 from '../../client/components/templates/checkout/CheckoutStep3'
import { parentContext } from '../../client/contexts/parentContext';
import Header from '../../client/components/organisms/Header/Header';
import Footer from '../../client/components/templates/headerFooter/headerFooter';
import CheckoutHeaderFooter from '../../client/components/organisms/Header/CheckoutHeaderFooter';
import { Utility } from '../../client/helpers/utilities/utility';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

/**
 * @class CheckoutPromotion
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class CheckoutPromotion extends React.Component {

/**
* 
* @function getInitialProps
* @author prinshu.singh@zensar.com
* @desc Setting intial props to the checkout promotion component By making RESTful service call.
* @param {object} req 
* @param {string} query 
* 
*/
    static async getInitialProps({ req, query  }) {
        let myData = {};
        let promotionInfo = {};
        if (!req) {
          myData =  await  Utility('/tienda/checkoutPromotion?isajax=true', 'GET')
        }      
       return { initialPropsData: myData && myData.data && myData.data.mainContent , promotionInfo: myData && myData.data && myData.data.promotionInfo, configurationData: myData && myData.data && myData.data.configurationData } // defect 23300
    }


    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
        const mainContent = this.props.initialPropsData || (this.props.router.query.data && this.props.router.query.data.mainContent) || {};
        const promotionInfo = this.props.promotionInfo || (this.props.router.query.data && this.props.router.query.data.promotionInfo) || {};
        const configurationData = this.props.configurationData || (this.props.router.query.data && this.props.router.query.data.configurationData) || {}; // defect 23300
        //  const site = (this.props.router && this.props.router.query && this.props.router.query.site) || 'lp';
        //  const data = (this.props.router && this.props.router.query && this.props.router.query.data) || 'lp';
        // const dataFromAPICall = require('../../lib/config/datasource/header.json');
        // const articleDetails = {
        //     text: "Home Page",
        //     headerStyle: "a-paragraph__primary"
        // };
        let cartHeaderResponse = {};
        let getheader = '';
        let getFooter = '';
        if(this.props && this.props.router && this.props.router.query && this.props.router.query.data){
            cartHeaderResponse = this.props.router.query.data.cartHeader || {};
            getheader = this.props.router.query.data.checkoutHeaderData;
            getFooter = this.props.router.query.data.checkoutFooterData;
        }else{
            cartHeaderResponse = (this.props && this.props.cartHeader) || {};
        }
        // start defect 23406
        if(mainContent && mainContent.paymentDetail && mainContent.paymentDetail.creditCardNumber){
            mainContent.paymentDetail.creditCardNumber = mainContent.paymentDetail.creditCardNumber.slice(-4);
            mainContent.paymentDetail.expirationMonth = '';
            mainContent.paymentDetail.expirationYear = '';
        }
        // end defect 23406
        return (
        <parentContext.Consumer>
            {({checkoutHeaderData, checkoutFooterData, labelData, checkoutHeaderFooterData, setCheckoutHeaderFooterData,loginDetails, showModal, closeModal }) => {
                    return (
                        <React.Fragment>
                            <CheckoutHeaderFooter headerData={getheader || checkoutHeaderData} footerData={getFooter || checkoutFooterData} isShipping={true} isBilling={true} isPromotion={true}>
                                <CheckoutStep3
                                    cartHeaderResponse={cartHeaderResponse.cartHeaderDetails ? cartHeaderResponse : loginDetails.cartHeaderResponse}
                                    //  promotionInfo={!isEmpty(this.props.router.query.data && this.props.router.query.data.promotionInfo) ? this.props.router.query.data.promotionInfo : ''} 
                                    // mainContent={!isEmpty(this.props.router.query.data && this.props.router.query.data.mainContent) ? this.props.router.query.data.mainContent : ''}
                                    promotionInfo={promotionInfo}
                                    mainContent={mainContent}
                                    loginDetails={loginDetails}
                                    closeModal={closeModal}
                                    showModal={showModal}
                                    configurationData={configurationData} // defect 23300
                                />

                            </CheckoutHeaderFooter>
                        </React.Fragment>
                    )
                }
            }
        </parentContext.Consumer>            
        );

    }
}
export default withRouter(CheckoutPromotion);