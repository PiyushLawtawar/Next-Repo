/**
	* Module Name : Page
	* Functionality : Component used to show checkout shipping page.
	* @exports : Page
	* @requires : module:React
	* @requires : module:next/router
	* @requires : module:/client/components/templates/CheckoutShippingPage
	* @requires : module: /client/helpers/utilities/utility
	* @requires : module: /client/helpers/config/config
    * Team : Checkout Team
	* Other information : This is the initial page of checkout shipping page.
	* 
	*/
import { withRouter } from 'next/router'
import Router from 'next/router';
import CheckoutShippingPage from '../../client/components/templates/CheckoutShippingPage'
import { Utility, GetCookie } from '../../client/helpers/utilities/utility';
import { Path } from '../../client/helpers/config/config';


/**
* @class Page
* @classdesc Main function which will get exported and will get imported in other JS
*/
const Page = (props) => <CheckoutShippingPage {...props}/>;

    /**
	* Method will call on before component load
	* @function getInitialProps
	* @author dondapati.kumar@zensar.com
	* @desc setting intial properties to the component
    * @param {object} req
    * @return {object} initialPropsData
	* 
	*/
Page.getInitialProps = async ({ req }) => {

    const initialPropsData = {

    };

    if(!req){
        // const pageName ="?pageName=pwa-shippingPage";
        // const labelsRes = await Utility(Path.staticLabelsFetch+pageName,'GET'/*, { "pageName": [ "pwa-shippingPage" ] }*/);
        // if (labelsRes.data && labelsRes.data.status && labelsRes.data.status.status === "success") {
        //   initialPropsData.staticLabels = labelsRes.data          
        // }
        const shipping_address_events_items = await Utility(Path.get_shipping_address_events_items,'POST',{ "pageName": "shippingPage" });
        if(shipping_address_events_items && shipping_address_events_items.data){
            const { address } = shipping_address_events_items.data;
            if(address && (address.errorCode === '1003' || address.errorCode === '1002')){
                const LoggedInSession = GetCookie("LoggedInSession");
                // const KeepMeSignIn = GetCookie('KeepMeSignIn');
                // if(LoggedInSession && !KeepMeSignIn){
                //     Router.push('/tienda/login' + "?pageName=cart");
                // }else if(LoggedInSession){
                //     Router.push('/tienda/cart');
                // }else{
                //     Router.push('/tienda/cart');
                // }
                if(LoggedInSession){
                    if(address.errorCode === '1002'){
                        Router.push('/tienda/login' + "?pageName=cart");
                    }else if(address.errorCode === '1003'){
                        Router.push('/tienda/cart');
                    }
                }else{
                    Router.push('/tienda/cart');
                }
            }else{
                initialPropsData.shipping_address_events_items = shipping_address_events_items.data;
            }
        }
        // const getConfigurationInfo = await Utility(Path.fetchConfiguration,'GET');
        // let guatemalaFlag = true;
        // let cncDriveFlag = true;
        // let cncFlag = true;
        // if(getConfigurationInfo && getConfigurationInfo.data && getConfigurationInfo.data.configuration && getConfigurationInfo.data.configuration.flagConfiguration){
        //     const flag = getConfigurationInfo.data.configuration.flagConfiguration['enableGuatemala'];            
        //     guatemalaFlag= (flag && (flag.indexOf("false") >-1 || flag ==='false' )?false:true );
        //     const cflag = getConfigurationInfo.data.configuration.flagConfiguration['enableCnCDriveThru'];
        //     cncDriveFlag= (cflag && (cflag.indexOf("false") >-1 || cflag ==='false' )?false:true );
        //     const ccflag = getConfigurationInfo.data.configuration.flagConfiguration['enableclickandcollect'];
        //     cncFlag= (ccflag && (ccflag.indexOf("false") >-1 || ccflag ==='false' )?false:true );
        //     initialPropsData.GuatemalaEnableFlag=guatemalaFlag
        //     initialPropsData.CncDriveEnableFlag=cncDriveFlag
        //     initialPropsData.enableclickandcollect=cncFlag
        // }
        // const cartHeaderDetailsResp = await Utility(Path.getCartHeaderDetails, 'POST', {} );
        // if(cartHeaderDetailsResp.data.status.status === "SUCCESS"){
        //   initialPropsData.cartHeader = cartHeaderDetailsResp.data;
        // }
    }
    return initialPropsData;

}

export default withRouter(Page)
