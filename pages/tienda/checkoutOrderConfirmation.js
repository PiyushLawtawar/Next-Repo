/**
* Module Name :CheckoutOrderComfirmation
* Functionality :Showing order confirmation template
* @exports :CheckoutOrderComfirmation
* @requires :module:React
* @requires :module:next/router
* @requires :module:/client/components/templates/checkout/CheckoutStep4Confimation
* @requires :module:lodash/isEmpty
* @requires :module:/client/helpers/utilities/utility
* @requires :module:/client/helpers/config/config
* @requires :module:/client/components/organisms/Header/CheckoutHeaderFooter
* @requires :module:/client/contexts/parentContext
* Team : Checkout Team
* 
*/

import React from 'react';
import { withRouter } from 'next/router';
import CheckoutStep4Confimation from '../../client/components/templates/checkout/CheckoutStep4Confimation';
import isEmpty from 'lodash/isEmpty';
import { Utility } from '../../client/helpers/utilities/utility';
import { Path } from    '../../client/helpers/config/config';
import CheckoutHeaderFooter from '../../client/components/organisms/Header/CheckoutHeaderFooter';
import { parentContext } from '../../client/contexts/parentContext';

const CheckoutOrderComfirmation = ((props) => {
    let orderData = {};
    let staticLabels = {};
    let DRIVETHRU;
    let configurationData = {};
    let hostname = '';
    if (props.initialPropsData && props.initialPropsData.staticLabels && !isEmpty(props.initialPropsData.staticLabels)) {
        staticLabels = props.initialPropsData.staticLabels;
        hostname = props.initialPropsData.hostname;
    } else {
        staticLabels = props.router.query && props.router.query.data && props.router.query.data.orderData && !isEmpty(props.router.query.data.orderData) && props.router.query.data.orderData.staticLabels ? props.router.query.data.orderData.staticLabels : {};
        hostname = props.router.query.data.hostname || '';
    }
    if (props.initialPropsData && props.initialPropsData.configurationData && !isEmpty(props.initialPropsData.configurationData)) {
        configurationData = props.initialPropsData.configurationData;
    } else {
        configurationData = props.router.query.data &&props.router.query.data.orderData&&props.router.query.data.configurationData;
    }
    if (props.initialPropsData && props.initialPropsData.orderData && !isEmpty(props.initialPropsData.orderData)) {
        orderData = props.initialPropsData.orderData
        DRIVETHRU = props.initialPropsData.orderData&&props.initialPropsData.orderData.DRIVETHRU
    } else {
        orderData = props.router.query && props.router.query.data && props.router.query.data.orderData && !isEmpty(props.router.query.data.orderData) ? props.router.query.data.orderData : {};
        DRIVETHRU = props.router.query.data&&props.router.query.data.orderData&&props.router.query.data.orderData.DRIVETHRU
    }
    // start defect 23406
    //console.log('checkStaticLabel :::: ::::==',props.initialPropsData);
    if(orderData && orderData.orderSuccess && orderData.orderSuccess.paymentDetail && orderData.orderSuccess.paymentDetail.creditCardNumber){
        orderData.orderSuccess.paymentDetail.creditCardNumber = orderData.orderSuccess.paymentDetail.creditCardNumber.slice(-4);
        orderData.orderSuccess.paymentDetail.expirationMonth = '';
        orderData.orderSuccess.paymentDetail.expirationYear = '';
    }  
    // end defect 23406  
    return (
        <React.Fragment>
            <parentContext.Consumer>
             {({ data }) => {
                //  console.log('dataa',data);
                 return(
            <CheckoutHeaderFooter isOrderConfirmation={true} footerData={data.checkoutFooterData}>
                <CheckoutStep4Confimation orderData={data && data.orderData && data.orderData.orderSuccess} orderId={data && data.orderData && data.orderData.orderId} 
                swogoEndPoint={data && data.orderData && data.orderData.swogoEndPoint} staticLabels={data && data.orderData && data.orderData.staticLabels} 
                DRIVETHRU={data.DRIVETHRU} checkoutHeaderData={data && data.checkoutHeaderData} configurationData={configurationData} hostname={hostname} />
            </CheckoutHeaderFooter>
                 )
              }}
      </parentContext.Consumer>
        </React.Fragment>
    );
});

/**
* Method will call on before component load
* @function getInitialProps
* @author shreyansh.khare@zensar.com
* @desc setting intial properties to the component
* @param {object} req
* @return {object} initialPropsData
* 
*/
CheckoutOrderComfirmation.getInitialProps = async ({ req }) => {

    const initialPropsData = {
        orderData: {},
        staticLabels: {}
    };
    if (!req) {
        await Utility(Path.getconfirmorder, 'POST', undefined).then(response => {
            initialPropsData.orderData = response.data
        })
        const pageName ="?pageName=pwa-orderConfirmationPage";
        let staticLabels = await Utility(Path.staticLabelsFetch+pageName, 'GET'/*, { pageName: ['pwa-orderConfirmationPage'] }*/)
        if (staticLabels && staticLabels.data && staticLabels.data.staticLabelValues[0] && staticLabels.data.staticLabelValues[0].keyValues) {
            initialPropsData.staticLabels = staticLabels.data.staticLabelValues[0].keyValues;
        }
    }
    return { initialPropsData };

}
export default withRouter(CheckoutOrderComfirmation);
