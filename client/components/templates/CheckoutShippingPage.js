/**
	* Module Name : CheckoutShippingPage
	* Functionality : Component used to show checkout shipping page.This is get called from \pages\tienda\checkoutShipping.js
	* @exports : CheckoutShippingPage
	* @requires : module:React
	* @requires : module: lodash/get
	* @requires : module:/organisms/Header/CheckoutHeaderFooter
	* @requires : module: /contexts/parentContext
	* @requires : module: /checkout/CommonShippingPage
    * Team : Checkout Team
	* Other information : passing  all the initial props to CommonShippingPage and CheckoutHeaderFooter components.
	* 
	*/
import React from 'react';
// import { Utility } from '../../helpers/utilities/utility';
// import { Path } from '../../helpers/config/config';
// import Footer from './headerFooter/headerFooter';

// import Header from '../organisms/Header/Header';
import CheckoutHeaderFooter from '../organisms/Header/CheckoutHeaderFooter';

import get from 'lodash/get';
import { parentContext } from '../../contexts/parentContext';

import CommonShippingPage from './checkout/CommonShippingPage';

/**
* @class CheckoutShippingPage
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {
    /**
     * constructor
     * @author dondapati.kumar@zensar.com
     * @desc receiving prop values from the parent module. And adding state values.
     * @param {object} props
     * 
     */
    constructor(props){
        super(props);
        this.childRef = React.createRef();
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render(){
        const props = this.props;
        let { GuatemalaEnableFlag, CncDriveEnableFlag, enableclickandcollect, enableEditAddress, shipping_address_events_items, staticLabels } = props;
        let cartHeaderResponse = {};
        let labels = {};
        let getheader = '';
        let getFooter = '';
        if(props && props.router && props.router.query && props.router.query.data){
            if(typeof props.router.query.data.GuatemalaEnableFlag ==='boolean'){
                GuatemalaEnableFlag = props.router.query.data.GuatemalaEnableFlag;
            }
            if(typeof props.router.query.data.CncDriveEnableFlag ==='boolean'){
                CncDriveEnableFlag = props.router.query.data.CncDriveEnableFlag;
            }
            if(typeof props.router.query.data.enableclickandcollect ==='boolean'){
                enableclickandcollect = props.router.query.data.enableclickandcollect;
            }
            if(typeof props.router.query.data.enableEditAddress ==='boolean'){
                enableEditAddress = props.router.query.data.enableEditAddress;
            }
            shipping_address_events_items = props.router.query.data.shipping_address_events_items
            cartHeaderResponse = props.router.query.data.cartHeader || {};
            labels = props.router.query.data.keyValues || {};
            getheader = props.router.query.data.checkoutHeaderData;
            getFooter = props.router.query.data.checkoutFooterData;
        }else{
            cartHeaderResponse = (props && props.cartHeader) || {};
            labels = staticLabels || {};
        }
        return (
            <parentContext.Consumer>
                {({checkoutHeaderData, checkoutFooterData, labelData, configurationData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, showModal, checkoutHeaderFooterData, setCheckoutHeaderFooterData, OpenModal, closeModal }) => {
                        return (
                            <React.Fragment>
                                <CheckoutHeaderFooter  childRef={this.childRef} headerData={getheader || checkoutHeaderData} footerData={getFooter || checkoutFooterData} isShipping={true} {...props}>
                                    <CommonShippingPage labelData={labelData} configurationData={configurationData} ref={this.childRef} OpenModal={OpenModal} closeModal={closeModal} showModal={showModal} cartHeaderResponse={cartHeaderResponse.cartHeaderDetails ? cartHeaderResponse : loginDetails.cartHeaderResponse} loginDetails={loginDetails} labels={labels} CncDriveEnableFlag={CncDriveEnableFlag} GuatemalaEnableFlag={GuatemalaEnableFlag} enableclickandcollect={enableclickandcollect} enableEditAddress={enableEditAddress} shipping_address_events_items={shipping_address_events_items}  {...props}/>
                                </CheckoutHeaderFooter>
                            </React.Fragment>
                        )
                    }
                }
            </parentContext.Consumer>
        )
    }
}