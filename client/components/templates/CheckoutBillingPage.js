/**
* Module Name : CheckoutPage
* Functionality : Component used to show the billing page. This is get called from \pages\tienda\checkoutBilling.js
* @exports : CheckoutPage
* @requires : module:React
* @requires : module:lodash/get
* @requires : module:/contexts/parentContext
* @requires : module:/organisms/Header/CheckoutHeaderFooter
* @requires : module:/checkout/BillingCommonPage
* @requires : module:/helpers/utilities/utility
* Team : Checkout Team
* Other information : Showing the billing page
* 
*/
import React from 'react';
import get from 'lodash/get';
import { parentContext } from '../../contexts/parentContext';
import CheckoutHeaderFooter from '../organisms/Header/CheckoutHeaderFooter';
import BillingCommonPage from './checkout/BillingCommonPage';
import { Utility, GTMallPages, UserAgentDetails, logError } from '../../helpers/utilities/utility';

/**
* Method will call to filter only object type items.
* @function 
* @author srinivasa.gorantla@zensar.com
* @desc filter only object type items to show the list of cards.
* @param {object} commerceItems
* 
*/
const getCards = (commerceItems) => {
    let listData = [];
    for (var i in commerceItems) {
        if (typeof commerceItems[i] === 'object') {
            listData.push(commerceItems[i]);
        }
    }

    return listData;
}
/**
 * @class CheckoutPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class CheckoutPage extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props) {
        super(props);
        const mainContent = (props.mainContent) || {};
        const headerContent = (props.oneColumnData && props.oneColumnData.headerContent) || {};
        const commerceItems = (props.mainContent && props.mainContent.cartsList && props.mainContent.cartsList.commerceItems) || [];

        this.state = {
            mainContent: mainContent,
            cartsList: getCards(commerceItems)
        };
        this.childRef = React.createRef();
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount = () => {
        this.gtmCheckoutDetail();
        //SWOGO disable
        if (window && window.swogoDependencies) {
            window.swogoDependencies = null;
        }
    }

    /**
	* Method will call to get cookie values
	* @function getCookies
	* @author srinivasa.gorantla@zensar.com
	* @desc Fetching cookie value from the browser
    * @param {string} c_name
    * @return {string} y
	* 
	*/
    getCookies = (c_name) => {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    /**
	* Method will call to set gtmdata
	* @function gtmCheckoutDetail
	* @author srinivasa.gorantla@zensar.com
	* @desc Setting all the required data to dataLayer.
	* 
	*/
    gtmCheckoutDetail = () => {
        let getSellerName = window.location.host;
        let sellerNameHardCode = '';
        if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'liverpool';
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteens') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'liverpool';
            }
        }
        let products = [];
        let {itemInfo} = this.state.mainContent;
        // console.log("itemInfo-----------", itemInfo)
        for (var i in itemInfo) {
            // console.log('itemInfo',itemInfo[i])
            if (i !== 's' && i !== 'EDDErrorMessages') {
                let cart = {};
                cart.name = itemInfo[i].displayName || "";
                cart.id = itemInfo[i].productId || "";
                cart.variant = 'N/A';
                cart.quantity = itemInfo[i].quantity || "";
                cart.price = itemInfo[i].finalDiscountedUnitPrice&&itemInfo[i].finalDiscountedUnitPrice.toString() || "";
                cart.brand = itemInfo[i].brand || "";
                cart.category = itemInfo[i] && itemInfo[i].L1Category || ""; // Need clarity
                cart.dimension27 = itemInfo[i].size || itemInfo[i].dimensions|| ""
                cart.dimension28 = itemInfo[i].color || "";
                cart.dimension36 = itemInfo[i].sellerName ? 'Market Place - '+itemInfo[i].sellerName :sellerNameHardCode ;
                cart.dimension40 = itemInfo[i].sellerSkuId ? itemInfo[i].sellerSkuId : itemInfo[i].skuId ? itemInfo[i].skuId :  "";
                cart.dimension41 = itemInfo[i].material || "";
                cart.dimension42 = itemInfo[i].texture || "";
                cart.dimension43 = "N";
                cart.metric2 = itemInfo[i].listPrice && itemInfo[i].listPrice.toString() || "";
                cart.metric3 = itemInfo[i].finalDiscountedUnitPrice && itemInfo[i].finalDiscountedUnitPrice.toString() || "";
                products.push(cart);
            }

        }

        try {
            dataLayer.push({
                event: 'checkout',
                'ecommerce': {
                    'checkout': {
                        'actionField': {
                            'step': 2
                        },
                        'products': products
                    }
                },
                "siteName": this.getCookies("ActiveDataCenterCookie")

            });
        } catch (e) {
            console.error(e);
     }
      /*  const gtmObjectData = {
            actURL: window.location.href,
            actPageTitle: document.title
        }
        GTMallPages(gtmObjectData); */
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
            pageName: "pageName",
            downarrow: "icon-arrow_down"
        }
        const { getheader, getFooter, staticLables } = this.props;
        return (
            <parentContext.Consumer>
                {({checkoutHeaderData, checkoutFooterData, labelData, configurationData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, ccclassName, ppclassName, ctclassName, selectedPaymentMethod, isCieSelected, isSpieSelected, isCashSelected, selectedPaymentType, onChangeBillingCTPayment, checkoutHeaderFooterData, setCheckoutHeaderFooterData, closeModal, showModal  }) => (
                    <React.Fragment>
                        <CheckoutHeaderFooter childRef={this.childRef}  headerData={getheader || checkoutHeaderData} footerData={getFooter || checkoutFooterData} isBilling={true} isShipping={true} showGiftInfoMsg={this.state.mainContent && this.state.mainContent.showGiftInfoMsg}>
                            <BillingCommonPage
                                labelData={staticLables || labelData}
                                configurationData={configurationData}
                                ref={this.childRef}
                                ccclassName={ccclassName}
                                ppclassName={ppclassName}
                                ctclassName={ctclassName}
                                selectedPaymentMethod={selectedPaymentMethod}
                                isCieSelected={isCieSelected}
                                isCashSelected={isCashSelected}
                                isSpieSelected={isSpieSelected}
                                selectedPaymentType={selectedPaymentType}
                                onChangeBillingCTPayment={onChangeBillingCTPayment}
                                mainContent={this.state.mainContent}
                                loginDetails={loginDetails}
                                cartHeaderDetails={loginDetails.cartHeaderResponse.cartHeaderDetails || (this.props.cartHeader.cartHeaderDetails || {})}
                                closeModal={closeModal}
                                showModal={showModal}
                                {...this.props}
                            />
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
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
