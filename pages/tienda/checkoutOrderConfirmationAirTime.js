import React from 'react';
import { withRouter } from 'next/router';
import CheckoutStep4ConfimationAirTime from '../../client/components/templates/checkout/CheckoutStep4ConfimationAirTime';
import isEmpty from 'lodash/isEmpty';
import { Utility } from '../../client/helpers/utilities/utility';
import { Path } from '../../client/helpers/config/config';
import CheckoutHeaderFooter from '../../client/components/organisms/Header/CheckoutHeaderFooter';

const CheckoutOrderComfirmation = ((props) => {
    let orderData = {};
    let staticLabels = {};
    let hostname = ""
    if (props.initialPropsData && props.initialPropsData.staticLabels && !isEmpty(props.initialPropsData.staticLabels)) {
        staticLabels = props.initialPropsData.staticLabels
    } else {
        staticLabels = props.router.query && props.router.query.data && props.router.query.data.orderData && !isEmpty(props.router.query.data.orderData) && props.router.query.data.orderData.staticLabels ? props.router.query.data.orderData.staticLabels : {};
    }
    if (props.initialPropsData && props.initialPropsData.orderData && !isEmpty(props.initialPropsData.orderData)) {
        orderData = props.initialPropsData.orderData
        hostname = props.initialPropsData.orderData.hostname //23912
    } else {
        orderData = props.router.query && props.router.query.data && props.router.query.data.orderData && !isEmpty(props.router.query.data.orderData) ? props.router.query.data.orderData : {};
        hostname = props.router.query.data.hostname; //23912
    }
    //const hostname = props.router.query.data.hostname; //23912
    return (
        <React.Fragment>
            <CheckoutHeaderFooter isOrderConfirmation={true} >
                <CheckoutStep4ConfimationAirTime orderData={orderData.orderSuccess} orderId={orderData.orderId} swogoEndPoint={orderData.swogoEndPoint} staticLabels={staticLabels}  hostname={hostname}/>
                {/*<h1>Welcome to Payment Page</h1>*/}
            </CheckoutHeaderFooter>
        </React.Fragment>
    );
});
CheckoutOrderComfirmation.getInitialProps = async ({ req }) => {

    const initialPropsData = {
        orderData: {},
        staticLabels: {}
    };
    if (!req) {
        await Utility(Path.getconfirmorder, 'POST', undefined).then(response => {
            initialPropsData.orderData = response.data
        })
        const pageName = "?pageName=pwa-orderConfirmationPage";
        let staticLabels = await Utility(Path.staticLabelsFetch + pageName, 'GET'/*, { pageName: ['pwa-orderConfirmationPage'] }*/)
        if (staticLabels && staticLabels.data && staticLabels.data.staticLabelValues[0] && staticLabels.data.staticLabelValues[0].keyValues) {
            initialPropsData.staticLabels = staticLabels.data.staticLabelValues[0].keyValues;
        }
    }
    return { initialPropsData };

}
export default withRouter(CheckoutOrderComfirmation);

