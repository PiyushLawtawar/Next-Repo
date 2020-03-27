/**
	* Module Name : CheckoutHeaderFooter
	* Functionality : Component used to show the header for the checkout pages shipping, billing and promtion pages.
                      This is get called from   \pages\tienda\checkoutPromotion.js
                                                \pages\tienda\checkoutOrderConfirmationAirTime.js
                                                \pages\tienda\checkoutOrderConfirmation.js
                                                \client\components\templates\sendEmail\sendEmail.js
                                                \client\components\templates\password_recovery\passwordRecover.js
                                                \client\components\templates\Login\Login.js
                                                \client\components\templates\errorPage\NoProducts.js
                                                \client\components\templates\CheckoutShippingPage.js
                                                \client\components\templates\CheckoutPage.js
                                                \client\components\templates\CheckoutBillingPage.js
	* @exports : CheckoutHeaderFooter
	* @requires : module:React
	* @requires : module:/atoms/Link/Link
	* @requires : module:/atoms/Label/Label
	* @requires : module:/atoms/Paragraph/Paragraph
	* @requires : module:lodash/isEmpty
	* @requires : module:/helpers/utilities/utility
	* @requires : module:/helpers/config/config
	* @requires : module:/molecules/MixinMolecules/MixinMolecules
	* @requires : module:/contexts/parentContext
	* @requires : module:/atoms/Tagimage/Image
	* @requires : module:react-event-listener
	* @requires : module:/atoms/Loader/atom-loader
	* Team : Checkout Team
	* Other information : showing header and footer for the checkout pages.
	* 
	*/
import Router from 'next/router';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { parentContext } from '../../../contexts/parentContext';
import { ParagraphAnchor } from '../../molecules/MixinMolecules/MixinMolecules';
//import './Header.styl'
import { Utility, UserAgentDetails, logError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Image from "../../atoms/Tagimage/Image";
import isEmpty from 'lodash/isEmpty';
import EventListener from 'react-event-listener';
import Loader from '../../atoms/Loader/atom-loader'

const left_link_urls = ["/tienda/checkoutShipping", "/tienda/checkoutBilling", "/tienda/checkoutPromotion"];

/**
* @class CommonShippingPage
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class CheckoutHeaderFooter extends React.Component {
    /**
     * constructor
     * @author dondapati.kumar@zensar.com
     * @desc receiving prop values from the parent module. And adding state values.
     * @param {object} props
     * 
     */
    constructor(props) {
        super(props);
        this.state = {
            getheader: this.props.headerData,
            getFooter: this.props.footerData,
            isShipping: this.props.isShipping,
            isBilling: this.props.isBilling,
            isPromotion: this.props.isPromotion,
            isDesktop: false,
            offset: {},
            window: {}
        }
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */    
    componentDidMount() {
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
        const { headerData, footerData } = this.props;
        let { isShipping, isBilling, isPromotion } = this.state;
        if (!(headerData && headerData.headerContent && headerData.headerContent[0]) && (isShipping || isBilling || isPromotion)) {
            this.getHeaderData();
        }
        if (!(footerData && footerData.footerContent && footerData.footerContent[0])) {
            this.getFooterData();
        }

        if (this.props.checkoutHeaderFooterData && typeof this.props.checkoutHeaderFooterData.footerContent === 'undefined') {
            if (this.props.setCheckoutHeaderFooterData) {
                this.props.setCheckoutHeaderFooterData('footerData', footerData)
            }
        }

        const agentDetails = UserAgentDetails(window);
        const isDesktop = agentDetails && agentDetails.isDesktop
        let offset = {};
        const rightPanel = document.getElementById('scroll-right-pane');
        if (isDesktop && rightPanel) {
            rightPanel.style.marginTop = 0 + "px";
            offset = rightPanel.getBoundingClientRect();
        }
        this.setAlertPostion()
        this.setState({ isDesktop, offset }, () => {
            this.setAlertPostion(500);
        });
        const windowObj = window || {};
        this.setState({
            window: windowObj
        });
        window.addEventListener('resize', this.resetFooterPosition);
        setTimeout(() => { this.resetFooterPosition(); }, 1500);
    }

    /**
	* Resetting footer postion. 
	* @function resetFooterPosition
	* @author dondapati.kumar@zensar.com
	* @desc Dynamically setting the postion of checkout footer.
	* 
	*/
    resetFooterPosition() {
        if (typeof window !== 'undefined') {
            var footer = document.querySelector(`footer`);
            var bodyElem = document.querySelector(`#__next`);
            var footerDetails = footer.getBoundingClientRect();
            var bodydetails = bodyElem.getBoundingClientRect();
            var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
            var bodyDiff = 0;
            if (viewportHeight > bodydetails.height) {
                bodyDiff = (viewportHeight - bodydetails.height);
                footer.style.top = viewportHeight - footerDetails.height + 'px';
                bodyElem.style.height = parseInt(window.getComputedStyle(bodyElem).height.replace(/px/g, ''), 10) + bodyDiff + 'px'; //bodyElem.style.height + (viewportHeight - footerDetails.height) + 'px';
            } else {
                footer.style.removeProperty('top');
                bodyElem.style.removeProperty('height');
            }
        }

    }

    /**
	* Method will set the alert postion.
	* @function setAlertPostion
	* @author dondapati.kumar@zensar.com
	* @desc Method will set the alert postion based on the scrool position
    * @param {number} time
	* 
	*/
    setAlertPostion = (time) => {
        const agentDetails = UserAgentDetails(window);
        const isDesktop = agentDetails && agentDetails.isDesktop
        setTimeout(() => {
            const oHeaderEle = document.getElementsByClassName('o-header')[0];
            const mdcSnackbar = document.getElementsByClassName('mdc-snackbar')[0];
            if (oHeaderEle && mdcSnackbar && (mdcSnackbar.className && mdcSnackbar.className.indexOf("recovery-password") === -1) ) {
                const height = isDesktop ? oHeaderEle.offsetHeight - 8 : oHeaderEle.offsetHeight;
                mdcSnackbar.style.top = height + 'px';
            }
        }, time || 0);
    }
    /**
	* Method will call as part of adjust alert postion.
	* @function handleResize
	* @author dondapati.kumar@zensar.com
	* @desc Method will call as part of adjust alert postion.
	* 
	*/
    handleResize = () => {
        this.setAlertPostion()
    }
    /**
	* Method will call to get checkout header data
	* @function getHeaderData
	* @author dondapati.kumar@zensar.com
	* @desc Making RESTful service call to get checkout header data.
	* 
	*/
    getHeaderData = async () => {
        const headerRes = await Utility(Path.headerInfo + "?page=checkout", 'GET');
        if (headerRes && headerRes.data && headerRes.data.status && headerRes.data.status.status === "0") {
            this.setState({
                getheader: headerRes.data
            }, () => {
                this.setAlertPostion(500);
            })
        }
    }

    /**
	* Method will call to get checkout footer data
	* @function getFooterData
	* @author dondapati.kumar@zensar.com
	* @desc Making RESTful service call to get checkout footer data.
	* 
	*/
    getFooterData = async () => {
        const footerRes = await Utility(Path.footerInfo + "?page=checkout", 'GET');
        if (footerRes && footerRes.data && footerRes.data.status && footerRes.data.status.status === "0") {
            this.setState({
                getFooter: footerRes.data
            })
        }
    }

    /**
	* Method will call on switch tab
	* @function switchTab
	* @author dondapati.kumar@zensar.com
	* @desc Updating active css styles while switching checkout tabs.
    * @param {boolean} index
	* 
	*/
    switchTab = (index) => {
        const { isShipping, isBilling, isPromotion } = this.state;
        if ((index === 0 && isShipping && !this.props.showGiftInfoMsg) || index === 1 && isBilling || index === 2 && isPromotion) {
            let url = left_link_urls[index];
            Router.push(url, url);
        }
    }

    /**
	* Method will call to check given link is enable or not.
	* @function isLinkEnable
	* @author dondapati.kumar@zensar.com
	* @desc Dynamically showing active tab based on the tab status.
    * @param {string} name
	* 
	*/
    isLinkEnable = (name) => {
        const { isBilling, isShipping, isPromotion } = this.state;
        switch (name) {
            case 'Entrega': return !isShipping; break;
            case 'Forma de Pago': return !isBilling; break;
            case 'Pago': return !isBilling; break;
            case 'Promociones': return !isPromotion; break;
            default: false;
        }
    }

    /**
	* Method will call to page redirect
	* @function redirectToUrl
	* @author dondapati.kumar@zensar.com
	* @desc Redirecting page when clicks on mobile back view button.
    * @param {string} url
	* 
	*/
    redirectToUrl = (url) => {
        //console.log("IMP log ::: redirect Url .... ::: ",url);
        if (this.props.childRef && this.props.childRef.current && this.props.childRef.current.mobileViewBackButton) {
            this.props.childRef.current.mobileViewBackButton(url);
        } else if (!isEmpty(url)) {
            Router.push({ pathname: url });
        } else {
            Router.push('/tienda/home');
        }
    }

    /**
	* Method will call to page redirect
	* @function redirectToUrl
	* @author dondapati.kumar@zensar.com
	* @desc Redirecting page when clicks on mobile back view button.
	* 
	*/
    goBack = () => {
        const { isBilling, isShipping, isPromotion } = this.state;
        if (isPromotion) {
            this.redirectToUrl('/tienda/checkoutBilling');
        } else if (isBilling) {
            this.redirectToUrl('/tienda/checkoutShipping');
        } else if (isShipping) {
            this.redirectToUrl('/tienda/cart');
        } else {
            Router.back();
        }
    }

    /**
	* Method will call on page scroll
	* @function handleScroll
	* @author dondapati.kumar@zensar.com
	* @desc Based on the page scroll making product summery panel allways be visible in shipping, billing and promotion pages.
    * @param {object}
	* 
	*/
    handleScroll = () => {
        const { offset, isDesktop } = this.state;
        if (isDesktop) {
            var leftParentPanel = document.getElementById('leftParentPanel');
            var rightPanel = document.getElementById('scroll-right-pane');
            if (leftParentPanel && rightPanel) {
                var stopValue = leftParentPanel.offsetHeight - rightPanel.offsetHeight + 100;
                if (window.pageYOffset > offset.top) {
                    // console.log("-- -- ",window.pageYOffset, leftParentPanel.offsetHeight , stopValue);
                    if (window.pageYOffset > stopValue) {
                        // console.log('stopPropagation')
                    } else {
                        rightPanel.style.marginTop = window.pageYOffset - offset.top + 15 + "px"
                    }
                } else {
                    rightPanel.style.marginTop = 0 + "px";
                }
            }
        }
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {

        const { isShipping, isBilling, isPromotion, getheader, getFooter, isDesktop } = this.state;

        const headerContent = (getheader && getheader.headerContent) ? getheader.headerContent[0] : {};

        // important log
        //console.log("===========headerContent============== ::: ",headerContent);

        const headerLogo = headerContent.headerLogo || [];
        const leftLinks = (headerContent && headerContent.leftLinks && headerContent.leftLinksWap) ? (isDesktop ? headerContent.leftLinks : headerContent.leftLinksWap) : [];

        // important log
        //  console.log(" ...............leftLinks.............. ::: ", leftLinks);

        const rightLinks = headerContent.rightLinks || [];
        const topBanner = headerContent.topBanner || [];
        const footerContent = (getFooter && getFooter.footerContent) ? getFooter.footerContent[0] : {};

        const horizontalLink1 = footerContent.horizontalLink1 || [];
        const horizontalLink2 = footerContent.horizontalLink2 || [];
        const horizontalLink3 = footerContent.horizontalLink3 || [];
        const bottomHTML = footerContent.bottomHTML || [];
       // const domainNameURL = this.state.window && this.state.window.location && this.state.window.location.host || '';
        let domainNameURL = this.state.window && this.state.window.location && this.state.window.location.host || '';
        if((!domainNameURL || typeof domainNameURL ==='undefined' || domainNameURL ==='') &&typeof window !== 'undefined'){
            domainNameURL = window && window.location && window.location.hostname && window.location.hostname.toLowerCase() || "";
        }
        if(!domainNameURL || typeof domainNameURL ==='undefined' || domainNameURL ===''){
            domainNameURL= this.props.router && this.props.router.query && this.props.router.query.data && this.props.router.query.data.hostname ||"";
        }

        return (
            <React.Fragment>
                {/*{
                    !(isShipping && isBilling && isPromotion) &&
                    <div className="a-overlay overlay d-lg-none"></div>
                }*/}
                <EventListener
                    target="window"
                    onResize={this.handleResize}
                    onScroll={this.handleScroll}
                />
                <Loader className={'loader'} domainNameURL={domainNameURL}></Loader>
                {!this.props.isOrderConfirmation && !this.props.onlyFooter &&
                    <div className="o-header">
                        <div className="o-container__fluid container-fluid">
                            <div className="o-checkout__header o-row row pt-2 pb-0 pb-lg-2 align-items-center">
                                <div className="o-col col-lg-2 col text-center pb-2 pb-lg-0">
                                    <Link className="m-menuBack d-lg-none d-block" onClick={this.goBack} style={{ cursor: 'pointer', top: 7 }}>
                                        <Icons className="icon-back a-menuBack__icon" />
                                    </Link>
                                    <Link>
                                        <Image className="a-header__logo" id="promotions__banner" src={headerLogo[0] && headerLogo[0].url} onClick={() => this.redirectToUrl(topBanner[0] && topBanner[0].url)} />
                                        {/*onClick={() => this.redirectToUrl(topBanner[0] && topBanner[0].url)}*/}
                                    </Link>
                                </div>
                                <div className="o-col col-lg-8 col-12 text-center p-0 -bgWhite">
                                    <div className="o-row row align-items-center justify-content-center no-gutters">
                                        {
                                            leftLinks.map((payLink, index) => {
                                                return (
                                                    <div className="o-col col-lg-3 col-4" key={index} onClick={() => this.switchTab(index)}>
                                                        {/*onClick={() => this.switchTab(index)}*/}
                                                        <Link className="o-checkoutSteps">
                                                            <Label className={"a-checkoutSteps__text " + (this.isLinkEnable(payLink.name) ? "-disabled d-md-inline-block" : "")}>{(!this.state.isDesktop && payLink && payLink.text === "Forma de Pago") ? 'Pago' : payLink.text}</Label>
                                                            <div className={"progress m-checkoutSteps " + (this.isLinkEnable(payLink.name) ? "-disabled" : "")}>
                                                                <div className={"a-checkoutSteps__bar progress-bar " + (!this.isLinkEnable(payLink.name) ? "-progressColor" : "")} role="progressbar" style={{ width: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="o-col col-lg-2 d-lg-block d-none">
                                    <Link className="m-checkoutHelp" href={rightLinks[0] && rightLinks[0].url}>
                                        <Label className="a-checkoutHelp__text">{rightLinks[0] && rightLinks[0].text}</Label>
                                        <Icons className="icon-help a-checkoutHelp__icon" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {this.props.children}

                <parentContext.Consumer>
                    {({ showModal }) => (
                        <div className={showModal['PromotionModal'] ? 'modal-backdrop show' : ''}></div>
                    )}
                </parentContext.Consumer>
                <footer className="mt-5" style={{ position: 'sticky', width: '100%' }}>
                    <div className="container">
                        <nav className="row align-items-center justify-content-between pt-4 pb-4">
                            <div className="col-12 col-lg-auto text-center mb-4 mb-lg-0">
                                {
                                    horizontalLink1.map(obj => <Link key={obj.text} href={obj.url || '#'} target="_blank" className="a-footer__contact -checkout pb-3 pb-lg-0">{obj.text}</Link>)
                                }

                            </div>
                            <div className="col-12 col-lg-auto text-center mb-4 mb-lg-0">
                                {
                                    horizontalLink2.map(obj => <Link key={obj.text} href={obj.url || '#'} target="_blank" className="a-footer__contact -checkout pb-3 pb-lg-0">{obj.text}</Link>)
                                }
                            </div>
                            <div className="col-12 col-lg-auto text-center">
                                <ParagraphAnchor
                                    key={horizontalLink3[1] && horizontalLink3[1].text}
                                    classParagraph="a-footer__contact -checkout d-lg-inline-block d-block"
                                    classAnchor="a-footer__contact -checkout"
                                    textParagraph={horizontalLink3[0] && horizontalLink3[0].text + ((horizontalLink3[1] && horizontalLink3[1].displayStyle === "Text" || isDesktop) ? horizontalLink3[1] && horizontalLink3[1].text : "")}
                                    href={(horizontalLink3[1] && horizontalLink3[1].displayStyle === "Link" && !isDesktop) ? horizontalLink3[1] && horizontalLink3[1].url : ""}
                                    textAnchor={(horizontalLink3[1] && horizontalLink3[1].displayStyle === "Link" && !isDesktop) ? horizontalLink3[1] && horizontalLink3[1].text : ""} />
                                <ParagraphAnchor
                                    key={horizontalLink3[3] && horizontalLink3[3].text}
                                    classParagraph="a-footer__contact -checkout d-lg-inline-block d-block"
                                    classAnchor="a-footer__contact -checkout"
                                    textParagraph={horizontalLink3[3] && " / " + horizontalLink3[2] && horizontalLink3[2].text + ((horizontalLink3[3] && horizontalLink3[3].displayStyle === "Text" || isDesktop) ? horizontalLink3[3] && horizontalLink3[3].text : "")}
                                    href={(horizontalLink3[3] && horizontalLink3[3].displayStyle === "Link" && !isDesktop) ? horizontalLink3[2] && horizontalLink3[2].url : ""}
                                    textAnchor={(horizontalLink3[3] && horizontalLink3[3].displayStyle === "Link" && !isDesktop) ? horizontalLink3[3] && horizontalLink3[3].text : ""} />
                            </div>
                        </nav>
                    </div>
                    <div className="container-fluid m-footer__misc">
                        <div className="col-12 col-lg-12 text-center">
                            {
                                bottomHTML.map(obj => <Paragraph className="a-footer__misc" key={obj.text}>{obj.text}</Paragraph>)
                            }
                        </div>
                    </div>
                </footer>
            </React.Fragment>
        );
    }
}
