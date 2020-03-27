"use strict";
import Icons from "../../atoms/Icons/Icons";
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from '../../atoms/Link/Link';
import Span from "../../atoms/Span/Span";
import Image from "../../atoms/Tagimage/Image";
import Popover from "../../molecules/Popover/Popover";
import dynamic from 'next/dynamic';
const Searchbar = dynamic(() => import('../../molecules/Searchbar/Searchbar'));
//import Searchbar from "../../molecules/Searchbar/Searchbar";
import { Anchorimage, Buttonicon, ButtonSpanIcon } from "../../molecules/MixinMolecules/MixinMolecules";
// const Typeahead = dynamic(() => import('../../molecules/Typeahead/Typeahead'));  /* Change done for RTC 23586  */
import Typeahead from "../../molecules/Typeahead/Typeahead";                        /* Change done for RTC 23586   */
const DepartmentMenu = dynamic(() => import('../../templates/headerFooter/megaMenu/department'));
//import DepartmentMenu from '../../templates/headerFooter/megaMenu/department';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import { Utility, UserAgentDetails, getBrandName } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
const LeftMegamenu = dynamic(() => import('../../molecules/LeftMegamenu/LeftMegamenu'));
//import LeftMegamenu from '../../molecules/LeftMegamenu/LeftMegamenu';
import { withRouter } from 'next/router';
import Router from 'next/router';
import { MIN_TYPEHEAD_LENGTH, MAX_TYPEHEAD_LENGTH, TYPEHEAD_VALIDATION } from '../../../config/constants';
import { parentContext } from '../../../contexts/parentContext';
const MultisiteHeader = dynamic(() => import('../../organisms/Header/MultisiteHeader'));
//import MultisiteHeader from '../../organisms/Header/MultisiteHeader';
//const SeoText = dynamic(() => import('../../organisms/SeoText/SeoText'));
import SeoText from '../../organisms/SeoText/SeoText';
import { GetCookie, SetCookie, logDebug, logError, enableClientLogs, getAssetsPath } from '../../../helpers/utilities/utility';
const SmartBanner = dynamic(() => import('../../organisms/SmartBanner/smartBanner'));
//import SmartBanner from '../../organisms/SmartBanner/smartBanner';
import Loader from '../../atoms/Loader/atom-loader'
import { GTMallPages } from '../../../helpers/utilities/utility';
const Menu = dynamic(() => import('../../templates/headerFooter/megaMenu/menu'));

const getHostName = (searchTerm, title) => {
    let str = title || '';
    title = title && title.toLowerCase() || '';
    searchTerm = searchTerm.toLowerCase();
    if (title.indexOf(searchTerm) !== -1) {
        const startIndex = title.indexOf(searchTerm);
        const len = str.length;
        return str.substring(startIndex+1, len)
    }
    return title;
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
            typeheadResponse: {},
            showMobileDeptMenu: false,
            searchTerm: '',
            dynamic_popover_status_obj: {},
            window: {},
            agentDetails: {},
            showPromotionBanner: true,
            cartHeaderResponse: props.loginDetails.cartHeaderResponse || {},
            deptMenuData: {},
            loader: false,
            pdpData: {},
            scriptInitalized : false,
            isLoggedIn: '',
        }

        this.initScript = this.initScript.bind(this);
    }
    // handleRouteChange = async (url) => {
    //     console.log('App is changing to: ', url);
    //     await this.getCartHeaderDetails();
    // }

    componentDidMount = () => {
        let logged = this.getCookie('LoggedInSession')
        if (logged === 'TRUE' && Router.router.route === '/tienda/users/trackOrders') {
            Router.push('/tienda/users/orderHistory')
        }
        const { departmentData, setDepartmentData } = this.props;
        const windowObj = window || {};
        const agentDetails = UserAgentDetails(windowObj);
        if (isEmpty(departmentData)) {
             if (!(agentDetails.isMobile || agentDetails.isPortrait)) {
            Utility(Path.getCategories, 'GET').then(response => {
                setDepartmentData(response.data);
                    const scriptInitalized = this.initScriptforMobileLoad();              
                this.setState({
                    deptMenuData:response.data,agentDetails,
                    window: windowObj,
                    scriptInitalized
                });
                    /*this.setState({
                        deptMenuData: response.data
                    });*/
            });
             }
        } else {
            this.setState({
                deptMenuData: departmentData,
                agentDetails,
                    window: windowObj
            });
        }
        
        
        /*this.setState({
            agentDetails,
            window: windowObj
        });*/

        windowObj.enableClientLogs = enableClientLogs.bind(this);

        if (agentDetails.isMobile || agentDetails.isPortrait) {
            const { isMobile, isPortrait } = UserAgentDetails(windowObj);
           /* this.setState({
                bannerVisible: isEmpty(GetCookie('showBanner')) ? true : false
            })*/
            if (isMobile || isPortrait) {
                const { handleTypeheadHide, showTypehead, showMobileMenu, handleMobileMenu } = this.props;
                if (showTypehead) {
                    handleTypeheadHide();
                }
                if (showMobileMenu) {
                    handleMobileMenu();
                }
            } else {
                /*if (this.state.showDropdown) {
                    this.setState({ showDropdown: false });
                }*/
                }
            //this.getStaticMetaTagsLabelPage();
            const pageName = "?pageName=PWA-HOME-PAGE";
            Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
                if (response && response.data && response.data.staticLabelValues) {
                    var tempData = response.data.staticLabelValues;
                     const scriptInitalized = this.initScriptforMobileLoad();  
                    if(departmentData){
                        Utility(Path.getCategories, 'GET').then(response => {
                            setDepartmentData(response.data);
                            this.setState({ smartBanner: tempData,
                                bannerVisible: isEmpty(GetCookie('showBanner')) ? true : false,
                                deptMenuData:response.data,agentDetails,
                                window: windowObj ,
                                showDropdown:this.state.showDropdown?  false :true,
                                scriptInitalized
                            });
                        });
                    }else{
                       this.setState({ smartBanner: tempData,
                        bannerVisible: isEmpty(GetCookie('showBanner')) ? true : false,
                         deptMenuData:departmentData,agentDetails,
                         window: windowObj ,
                         showDropdown:this.state.showDropdown?  false :true,
                         scriptInitalized
                     });
            }
                   
                }
            });
        }
        // this.getCartHeaderDetails();
        //this.initScript();

    }
    goToHome = () => {
        window.location.href = '/tienda/home';
    }

    getCookie = (name) => {
        var cookieArr = document.cookie.split(";");

        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            if (name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (this.state.cartHeaderResponse != (nextProps.loginDetails && nextProps.loginDetails.cartHeaderResponse)) {
            let pdpFlag = nextProps.loginDetails && nextProps.loginDetails.cartHeaderResponse && nextProps.loginDetails.cartHeaderResponse.fromPdpAddToCart || false
            let offerListingFlag = get(nextProps, 'loginDetails.cartHeaderResponse.fromOfferListingPage', false);
            if (pdpFlag === true || this.props.pageName === 'comparator' || offerListingFlag) {
                let cartheaderRes = this.state.cartHeaderResponse;
                cartheaderRes.cartHeaderDetails.cartCount = nextProps.loginDetails && nextProps.loginDetails.cartHeaderResponse && nextProps.loginDetails.cartHeaderResponse.quantity
                this.setState({ cartHeaderResponse: cartheaderRes })
            }
            else {
                this.setState({ cartHeaderResponse: nextProps.loginDetails.cartHeaderResponse })

            }
            this.initScript()
        }
        if (nextProps.mainContent !== this.props.mainContent) {
            const { isMobile, isPortrait } = UserAgentDetails(this.state.window);
            const { showMobileMenu, handleMobileMenu } = this.props;
            if (isMobile || isPortrait) {
                const { handleTypeheadHide, showTypehead } = this.props;
                if (showTypehead) {
                    handleTypeheadHide();
                }
                if (showMobileMenu) {
                    handleMobileMenu();
                }
            } else {
                if (this.state.showDropdown) {
                    this.setState({ showDropdown: false });
                }
            }
            this.initScript()
        }
    }

    getPdpDetail = (data) => {
        this.setState({ pdpData: data });
    }

    handlelogout = () => {
        let brandName = 'LP'
        if (window) {
            brandName = getBrandName(window).brand;
        }
        let payload = {
            "channel": "WEB",
            "brandName": brandName
        };
        Utility(Path.logout, 'POST', payload).then(response => {
            if (response.data && response.data.status && response.data.status.status === "failure") {
                this.show_alert(response.data.status.errorMessage);
            } else if (response.status === 200) {
                window.sessionStorage.removeItem("gtm");
                 window.sessionStorage.removeItem("orderHistory");
                if (window) {
                    window.location.href = '/';
                }
            }
        }, (error) => {
            logError("Header", "Error ==== :: ", error);
        });
    }
    initScriptforMobileLoad() {
            const hostName = getHostName('.', window.location.hostname);
            if (this.state.scriptInitalized || (typeof window !== "undefined" && window.myOnloadFunction)) return false;
            const impressionScript = document.createElement('script');
            impressionScript.src = 'https://assetspwa.' + hostName + '/assets/digital/analytics/analytics.js';
            impressionScript.id = 'impression-script';
            impressionScript.onload = () => { };

            const container = document.getElementById('impression-script-container');
            if (this.impressionScript && container) {
                container.appendChild(impressionScript);
            }
            return true;
    }
    initScript() {
            const hostName = getHostName('.', window.location.hostname);
            if (this.state.scriptInitalized || (typeof window !== "undefined" && window.myOnloadFunction)) return;
            const impressionScript = document.createElement('script');
            impressionScript.src = 'https://assetspwa.' + hostName + '/assets/digital/analytics/analytics.js';
            impressionScript.id = 'impression-script';
            impressionScript.onload = () => { };

            const container = document.getElementById('impression-script-container');

            if (this.impressionScript && container) {
                container.appendChild(impressionScript);
            }

             this.setState({
                scriptInitalized: true
            });
    }

    getGTMOnload = (login_status, gtmUserId) => {
        if (window && window.myOnloadFunction) {
            let decodeURIPath = decodeURI(window.location.pathname)
            window.myOnloadFunction(decodeURIPath)
        } else {
            //console.log('Function not found');
        }
        const data = {
            "actPageTitle": decodeURI(document && document.title || 'Liverpool es parte de Mi vida'),
            "actURL": decodeURI(window.location.href),
            "loginStatus": login_status ? 'Y' : 'N',
            "userID": gtmUserId
        };
        Utility(Path.gtmServiceCall, 'POST', data).then(response => {
            GTMallPages(response.data);
        });
    }

    getCartHeaderDetails = async () => {
        logDebug('Header', ' in getCartHeaderDetails start');
        // this.setState({ loader: true })
        // if header calls from change password
        let userHeaders = {};
        if (Router && Router.router && Router.router.query && Router.router.query.isredirect) {
            userHeaders = { 'request_from': 'changePassword' }
        }

        try {
            logDebug('Header', ' in getCartHeaderDetails :: Calling getCartHeaderDetails');
            this.props.loginDetails.start_login_status();
            const response = await Utility(Path.getCartHeaderDetails, 'POST', {}, userHeaders);
            logDebug('Header', ' in getCartHeaderDetails :: called getCartHeaderDetails');
            logDebug('Header', ' in getCartHeaderDetails :: print response', response);


            if (response.status === 200) {
                if (response.data && response.data.status && response.data.status.status === "SUCCESS") {
                    const login_status = get(response.data, 'cartHeaderDetails.isLoggedIn', false);
                    const gtmUserId = get(response.data, 'cartHeaderDetails.gtmUserId', '');
                    setTimeout(() => {
                        this.getGTMOnload(login_status, gtmUserId)
                    }, 10)
                    this.setState({
                        cartHeaderResponse: response.data || {},
                        loader: false,
                        isLoggedIn: login_status ? 'Yes' : 'No'
                    });

                    logDebug('Header', ' in getCartHeaderDetails login_status :: ', login_status);
                    logDebug('Header', ' in getCartHeaderDetails this.state.isLoggedIn  :: ', this.state.isLoggedIn);



                    this.props.loginDetails.check_login_status(response.data)
                    const myAccountURL = ['/tienda/AirTime', '/tienda/users/myAccount', '/tienda/users/creditCards', '/tienda/users/updateProfile', '/tienda/checkout/airtimeTicket', '/tienda/users/viewPhones',
                        '/tienda/users/updateProfile', '/tienda/users/subscription', '/tienda/users/newCreditCard', '/tienda/users/addPhone', '/tienda/users/addressBook', '/tienda/users/creditCards',
                        , '/tienda/users/editCreditCard', '/tienda/users/changePassword', '/tienda/users/addAddress', '/tienda/users/editAddress', '/tienda/users/editPhone'];
                    const currentURL = Router.router.route || window.location.pathname;

                    logDebug('Header', ' in getCartHeaderDetails currentURL :: ', currentURL);
                    logDebug('Header', ' in getCartHeaderDetails is Login URL :: ', myAccountURL.includes(currentURL));


                    if (myAccountURL.includes(currentURL) === true && this.state.isLoggedIn === 'No') {
                        Router.push('/tienda/login')
                        // window.location = '/tienda/login';
                    }
                    if (this.state.isLoggedIn === 'Yes' && Router.router.route === '/tienda/users/createAccount') {
                        Router.push('/tienda/home')
                    }
                }
                if (response.data && response.data.status === "FAILURE" && response.data.errorCode === '1001') {
                    Router.push('/tienda/users/changePassword?isredirect=true')
                }
            } else {
                this.setState({ loader: false, isLoggedIn: 'No' });
                // console.log("GET CART HEADER DETAILS RESPONSE..............: ", response);
            }


        } catch (ex) {
            this.setState({ loader: false, isLoggedIn: 'No' });
        }


        // Utility(Path.getCartHeaderDetails, 'POST', {}, userHeaders).then(response => {
        //     if (response.status === 200) {

        //         if (response.data && response.data.status && response.data.status.status === "SUCCESS") {
        //             const login_status = get(response.data, 'cartHeaderDetails.isLoggedIn', false);
        //             this.setState({
        //                 cartHeaderResponse: response.data || {},
        //                 loader: false,
        //                 isLoggedIn: login_status ? 'Yes' : 'No'
        //             });
        //             this.props.loginDetails.check_login_status(response.data)
        //             const myAccountURL = ['/tienda/users/myAccount', '/tienda/users/creditCards', '/tienda/users/updateProfile', '/tienda/checkout/airtimeTicket', '/tienda/users/viewPhones',
        //                 '/tienda/users/updateProfile', '/tienda/users/subscription', '/tienda/users/newCreditCard', '/tienda/users/addPhone', '/tienda/users/addressBook', '/tienda/users/creditCards',
        //                 , '/tienda/users/editCreditCard', '/tienda/users/changePassword', '/tienda/users/addAddress', '/tienda/users/editAddress', '/tienda/users/editPhone']
        //             if (myAccountURL.includes(Router.router.route) === true && this.state.isLoggedIn === 'No') {
        //                 Router.push('/tienda/login')
        //             }
        //         }
        //         if (response.data && response.data.status === "FAILURE" && response.data.errorCode === '1001') {
        //             Router.push('/tienda/users/changePassword?isredirect=true')
        //         }
        //         // else {
        //         //     const cartHeaderResponse = {
        //         //         cartHeaderDetails: { firstName: 'Guest User', isLoggedIn: 'No' }
        //         //     }
        //         //     this.setState({ cartHeaderResponse, loader: false })
        //         //     this.props.loginDetails.check_login_status(cartHeaderResponse)
        //         //     // console.log("GET CART HEADER DETAILS GUEST USER CASE..............: ", response);
        //         // }
        //     } else {
        //         this.setState({ loader: false, isLoggedIn: 'No' });
        //         // console.log("GET CART HEADER DETAILS RESPONSE..............: ", response);
        //     }

        // }, (error) => {
        //     this.setState({ loader: false, isLoggedIn: 'No' });
        //     // console.log("GET CART HEADER DETAILS ERROR..............: ",error);
        // });
    }

    mouseOver = () => {
        this.props.handleTypeheadHide();
        this.setState({
            showDropdown: true
        });
    }

    mouseOut = () => {
        this.setState({
            showDropdown: false
        });
    }

    mouseOverOnSubcat = (id) => {
        document.getElementById(id).style.display = 'block';
    }

    mouseOutOnSubcat = (id) => {
        document.getElementById(id).style.display = 'none';
    }

    mouseOverLinks = (key) => {
        const { dynamic_popover_status_obj } = this.state;
        dynamic_popover_status_obj[key] = true;
        this.setState({ dynamic_popover_status_obj })
    }

    mouseOutLinks = (key) => {
        const { dynamic_popover_status_obj } = this.state;
        dynamic_popover_status_obj[key] = false;
        this.setState({ dynamic_popover_status_obj })
    }

    stopPopoverClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    onKeypress = (event) => {
        const code = event.keyCode || event.which;
        const { value } = event.target;
        const { pdpData } = this.state;
        //23609-defect, allow for 2 character only for "enter" key
        //if (code === 13 && value.length >= MIN_TYPEHEAD_LENGTH) {
        if (code === 13 && value.length >= 2) {
            //23609-defect, allow for 2 character only for "enter" key
            let asInfo = `/tienda?s=${value.split(" ").join("+").toLowerCase()}`;
            let href = `/tienda/twoColumnCategoryPage?s=${value}`;
            if (!isEmpty(pdpData)) {
                asInfo = pdpData.url;
                href = pdpData.url;
            }
            Router.push(href, asInfo);
        }
    }

    GtmCall = (href) => {
        const { searchTerm } = this.state;
        //    GTM for search
        dataLayer.push({
            'searchTerm': searchTerm,
            'searchResults': 1,
            'event': 'siteSearch',//variable estática
            "loginStatus": this.props.loginDetails.LoggedInSession,
            "userID": this.props.loginDetails && this.props.loginDetails.cartHeaderResponse && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails.gtmUserId || ''
        });
        // window.location.href = href;
    }

    redirectToSearchPage = () => {
        const { searchTerm, pdpData } = this.state;
        if (searchTerm.length >= MIN_TYPEHEAD_LENGTH) {
            let asInfo = `/tienda?s=${searchTerm.split(" ").join("+").toLowerCase()}`;
            let href = `/tienda/twoColumnCategoryPage?s=${searchTerm}`;
            if (!isEmpty(pdpData)) {
                asInfo = pdpData.url;
                href = pdpData.url;
            }
            Router.push(href, asInfo);
            // const { handleTypeheadHide } = this.props;
            // handleTypeheadHide();
        }
    }

    redirectCart = () => {
        Router.push({ pathname: '/tienda/cart' });
    }
    redirectToLogin = () => {
        Router.push({ pathname: '/tienda/login' });
    }

    onChangeSearchbar = (event) => {
        const { searchTerm } = this.state;
        let text = event.target.value;
        if (text.match(TYPEHEAD_VALIDATION)) {
            text = text.replace(TYPEHEAD_VALIDATION, '');
        }
        const { handleTypeheadShow } = this.props;
        if (text.length <= MAX_TYPEHEAD_LENGTH) {
            this.setState({ searchTerm: text });
        }
        if (text.length >= MIN_TYPEHEAD_LENGTH && text.length <= MAX_TYPEHEAD_LENGTH && searchTerm !== text) {
            // getTypeheadData service convert to GET from POST :: Start
            let payLoad = "?Ntt=" + text
            Utility(Path.getTypeheadData + payLoad, 'GET').then(response => {
                this.setState({
                    typeheadResponse: response.data
                });
            });
            // getTypeheadData service convert to GET from POST :: End

        }
        handleTypeheadShow();
    }

    handleMobileDeptMenu = (e) => {
        e.stopPropagation();
        this.setState({
            showMobileDeptMenu: !this.state.showMobileDeptMenu
        });
    }

    handlePromotionBanner = () => {
        this.setState({
            showPromotionBanner: !this.state.showPromotionBanner
        });
    }

    categoryLinkAjax = (event, href, asUrl, device = 'web') => {
        const { handleMobileMenu } = this.props;
        const { isMobile, isIpad, isPortrait, isLandscape } = UserAgentDetails(this.state.window);
        
        let isIpadPro = false;
        let innerWidth = this.state.window && this.state.window.innerWidth || 0;
        if (innerWidth > 990) {
            isIpadPro = true;
        }
        event.preventDefault();
        // if ((isIpad && isLandscape)) {
            event.stopPropagation();
        // }
        if (!isEmpty(href) && !isEmpty(asUrl)) {
            if (!isIpadPro && (isMobile || (isIpad && isPortrait)) ) {
                const { showMobileMenu, handleMobileMenu } = this.props;
                if (this.state.showMobileDeptMenu) {
                    this.setState({
                        showMobileDeptMenu: false
                    }, () => {
                        if (showMobileMenu) {
                            handleMobileMenu();
                            //Router.push(href, asUrl);
                        }
                    });
                }
            } else {
                if (this.state.showDropdown) {
                    this.setState({ showDropdown: false }, () => {
                        
                    });
                }
            }
            // 22571 Start
            setTimeout(() => {
                            Router.push(href, asUrl);
                        }, 350)
            // 22571 End
        }
    }

    handleLogin = () => {
        // Router.push("/tienda/login", Router.router.asPath);
        try {
            const currentUrl = get(window, 'location.href', '');
            if (currentUrl.indexOf('/pdp/') > 0) {
                window.location.href = '/tienda/login';
            } else {
                Router.push("/tienda/login", "/tienda/login");
            }
        } catch (e) { }
    }

    goBack = () => {
        if (this.props.backEvent && this.props.backEvent.data && this.props.backEvent.breadCrumbs) {
            const { breadCrumbs } = this.props.backEvent.data || {};
            if (breadCrumbs && breadCrumbs.length > 0 && breadCrumbs[breadCrumbs.length - 1].categoryUrl) {
                const url = '/tienda' + breadCrumbs[breadCrumbs.length - 1].categoryUrl;
                Router.push(url, url)
            }
        } else {
            Router.back();
        }
    }

    redirectToUrl = (e, href, asPath = href) => {
        if (!isEmpty(e)) {
            e.preventDefault();
        }
        // const { handleTypeheadHide } = this.props;
        // handleTypeheadHide();
        if (!isEmpty(href)) {
            Router.push(href, asPath);
        }
    }

    clearSearchbar = () => {
        const { handleTypeheadHide } = this.props;
        this.setState({ searchTerm: '' });
        // handleTypeheadHide();
    }

    orderHistory = (url) => {
        let logged = this.getCookie('LoggedInSession')
        if (logged === null) {
            Router.push('/tienda/login')
        } else {
            this.personalData(url);
        }

    }
    personalData = (url) => {
        var EnglishNameMyAccount = url.split('/')[3];
        Utility(Path.validateUpdateProfile, 'POST', {}).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login' + "?pageName=" + EnglishNameMyAccount)
            } else if (response && response.data && response.data.s === '0') {
              Router.push(url);
            }
        }, (error) => {
        });
    }
    redirectToURL = (url, name) => {
        const pageName = url.split('/')[3];
        let logged = this.getCookie('LoggedInSession')
        if ((name === 'Mis pedidos' || name === 'Mi cuenta' || name === 'Tiempo aire') && logged === null) {
            if(name === 'Tiempo aire') {
                Router.push('/tienda/login'+'?pageName='+pageName);
            } else {
                Router.push('/tienda/login');
            }            
        } else if (name === 'Mis pedidos' || name === 'Mi cuenta' || name === 'Tiempo aire') {
            this.personalData(url);
        }
    }

    getStaticMetaTagsLabelPage = async () => {
        const pageName = "?pageName=PWA-HOME-PAGE";
        /*{
            "pageName": [
                "PWA-HOME-PAGE"
            ]
        } */
        Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
            if (response && response.data && response.data.staticLabelValues) {
                var tempData = response.data.staticLabelValues;
                this.setState({ smartBanner: tempData });
            }
        });
    }
    getConfiguration = async () => {
        try {
            let clientConfig = GetCookie('clientConfig');

            let tEnableNodeLog = '';
            let tEnableNodeReqResLog = '';

            let timeoutBS = 0;
            let timeoutCart = 0;
            let timeoutCheckout = 0;
            let timeoutAccount = 0;

            // if (tEnableNodeLog.trim() === '' || tEnableNodeReqResLog.trim() === '') {
            if (clientConfig.trim() === '') {
                let response = { data: {} };
                //console.log("this.props.configurationData", this.props.configurationData);
                response.data = this.props.configurationData; //await Utility(Path.getConfiguration, 'POST', {});
                if (response && response.data && false) {
                    tEnableNodeLog = response.data.configuration && response.data.configuration.coherencecacheconfiguration && response.data.configuration.coherencecacheconfiguration.enableNodeLog || true;
                    tEnableNodeReqResLog = response.data.configuration && response.data.configuration.coherencecacheconfiguration && response.data.configuration.coherencecacheconfiguration.enableNodeReqResLog || false;

                    timeoutBS = response.data.configuration && response.data.configuration.coherencecacheconfiguration && response.data.configuration.coherencecacheconfiguration.timeoutBS || 0;
                    timeoutCart = response.data.configuration && response.data.configuration.coherencecacheconfiguration && response.data.configuration.coherencecacheconfiguration.timeoutCart || 0;
                    timeoutCheckout = response.data.configuration && response.data.configuration.coherencecacheconfiguration && response.data.configuration.coherencecacheconfiguration.timeoutCheckout || 0;
                    timeoutAccount = response.data.configuration && response.data.configuration.coherencecacheconfiguration && response.data.configuration.coherencecacheconfiguration.timeoutAccount || 0;
                    // tEnableNodeLog = true;
                    let config = {};
                    config.EnableNodeLog = tEnableNodeLog;
                    config.EnableNodeReqResLog = tEnableNodeReqResLog;
                    config.TimeoutBS = timeoutBS;
                    config.TimeoutCart = timeoutCart;
                    config.TimeoutCheckout = timeoutCheckout;
                    config.TimeoutAccount = timeoutAccount;

                    let tempClientConfig = JSON.stringify(config)
                    tempClientConfig = tempClientConfig.replace(/\"/g, "'").replace(/\,/g, "|").replace("{", "").replace("}", "")

                    SetCookie('clientConfig', tempClientConfig, 3600 * 1000 * 2, '/');

                    // SetCookie('clientConfig', JSON.stringify(config), 3600 * 1000 * 2, '/');
                }
            } else {
                // console.log('data is avaiable');
            }
        } catch (ex) {
            logError('Header', 'not able to call getConfiguration', ex);
        }
    }

    componentWillMount = async () => {
        if (typeof window !== "undefined") {
            logDebug('Header', ' in componentWillMount :: Calling getConfiguration');
            await this.getConfiguration();
            logDebug('Header', ' in componentWillMount :: called getConfiguration');

            logDebug('Header', ' in componentWillMount :: Calling getCartHeaderDetails');
            if(!(this.props.cartHeaderResponse && this.props.cartHeaderResponse.cartHeaderDetails)){
                 await this.getCartHeaderDetails();
            }
            else{
                let dataSave = this.props.cartHeaderResponse
                this.props.loginDetails.start_login_status(dataSave);
                const login_status = get(dataSave, 'cartHeaderDetails.isLoggedIn', false);
                const gtmUserId = get(dataSave, 'cartHeaderDetails.gtmUserId', '');
                        this.getGTMOnload(login_status, gtmUserId)
                this.setState({
                        cartHeaderResponse: dataSave || {},
                        loader: false,
                        isLoggedIn: dataSave.cartHeaderDetails.isLoggedIn ? 'Yes' : 'No'
                    });
            }

            logDebug('Header', ' in componentWillMount :: called getCartHeaderDetails');
        }
    }
    componentWillUnmount = () => {
        // console.log('I am in componentWillUnmount');
    }
    render() {
        let  AssetsPath = '';
        if (typeof window !== 'undefined') {
            AssetsPath = getAssetsPath(window,undefined,process);  
        }else{
            const hostName = get(this.props, 'router.query.data.hostname', '');
            AssetsPath = getAssetsPath(undefined, hostName, process); 
            //console.log("headerrrrrrrrrrrrrrrrr window is not available",AssetsPath,this.props)
        }
        const staticMetaTagsLabelPage = this.props.staticMetaTagsLabelPage;
        // Router && Router.events.off('routeChangeStart', this.handleRouteChange)
        // Router && Router.events.on('routeChangeStart', this.handleRouteChange)


        const { typeheadResponse, searchTerm, dynamic_popover_status_obj, showPromotionBanner, cartHeaderResponse, deptMenuData, loader, isLoggedIn, bannerVisible } = this.state;
        const abc = {
            cardclass: "card-img-top",
            mtypeahead: "m-typeahead",
            spanClassname: "a-header__topLink popover-session",
        }

        //console.log('this.props in head ==================>>>>', this.props);
        const { pageName, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleFilterModalHide, loginDetails, searchbarClicked, handleSearchBarShow, handleSearchBarHide, mainContent, showBackIcon, labelData, configurationData } = this.props;
        const leftLinksData = get(headerData, 'leftLinks', '');
        const topLeftLinks = get(headerData, 'topLeftLinks', '');
        const topRightLinks = get(headerData, 'topRightLinks', '');
        const rightLinksData = get(headerData, 'rightLinks', '');
        const userLinks = get(headerData, 'userLinks', '');
        const megaMenuTitleName = get(headerData, 'megaMenu', '');
        const headerLogo = get(headerData, 'headerLogo', '');
        const LoggedInSession = loginDetails && loginDetails.LoggedInSession;
        const wapLinksLoggedIn = get(headerData, 'wapLinksLoggedin', []);
        const wapLinksGuest = get(headerData, 'wapLinksGuest', []);
        const wapLinks = LoggedInSession ? wapLinksLoggedIn : wapLinksGuest;
        const topBanner = get(headerData, 'topBanner', '');
        const { isDesktop, isMobile, isAndroid, isPortrait, isLandscape, isIpad } = UserAgentDetails(this.state.window);
        const header_userlinks = (!isEmpty(userLinks) && !isEmpty(userLinks[0].contents) && userLinks[0].contents[0].links) || {};

        const { my_orders_object = {}, my_account_object = {}, my_bag_object = {} } = getUserLinksByType(header_userlinks);

        let domainNameURL = this.state.window && this.state.window.location && this.state.window.location.host || '';
        if((!domainNameURL || typeof domainNameURL ==='undefined' || domainNameURL ==='') &&typeof window !== 'undefined'){
            domainNameURL = window && window.location && window.location.hostname && window.location.hostname.toLowerCase() || "";
        }
        if(!domainNameURL || typeof domainNameURL ==='undefined' || domainNameURL ===''){
            domainNameURL= this.props.router && this.props.router.query && this.props.router.query.data && this.props.router.query.data.hostname ||"";
        }
       // console.log("domainNameURLdomainNameURLdomainNameURLdomainNameURL----",domainNameURL,this.props.router.query.data.hostname)
        const showBanner = isAndroid && bannerVisible && (domainNameURL.indexOf('liverpool') !== -1) ? true : false;
        const smartBanner = this.state.smartBanner && this.state.smartBanner;


        // let  count = 0;
        //
        // if(cartHeaderResponse.cartHeaderDetails != undefined && cartHeaderResponse.cartHeaderDetails.cartCount != undefined){
        //     count = cartHeaderResponse.cartHeaderDetails && cartHeaderResponse.cartHeaderDetails.cartCount
        // }else{
        //     count = cartHeaderResponse.itemDetailsInfo && cartHeaderResponse.itemDetailsInfo.addedItemCount
        // }
        let count = cartHeaderResponse.cartHeaderDetails != undefined ? cartHeaderResponse.cartHeaderDetails.cartCount : cartHeaderResponse.quantity;
        let firstName = '';
        let firstName_extra = '';
        if (LoggedInSession) {
            if (cartHeaderResponse && cartHeaderResponse.cartHeaderDetails && typeof cartHeaderResponse.cartHeaderDetails.firstName !== 'undefined') {
                firstName = get(cartHeaderResponse, 'cartHeaderDetails.firstName', '');
            }
            if (cartHeaderResponse && cartHeaderResponse.cartHeaderDetails && typeof cartHeaderResponse.cartHeaderDetails.firstName_xtra !== 'undefined') {
                firstName_extra = get(cartHeaderResponse, 'cartHeaderDetails.firstName_xtra', '');
            }
            if (!isEmpty(firstName_extra)) {
                firstName = `${firstName}${firstName_extra}`;
            }
        }
        return (
            <header>
                <div className={showMobileMenu ? 'overlay' : 'a-overlay d-lg-none'} onClick={handleMobileMenu}></div>
                {
                    showBanner && smartBanner && <SmartBanner smartBannerText={smartBanner} />
                }
                <Loader className={'loader'} domainNameURL={domainNameURL}></Loader>
                {/*<SeoText pageName="home" mainPageName={pageName} mainContent={mainContent} > </SeoText>*/}

                <parentContext.Consumer>
                    {({ domainName, configurationData, setConfigurationData, labelData, router }) => (
                        <React.Fragment>
                            <SeoText configurationData={configurationData} setConfigurationData={setConfigurationData} pageName="home" mainPageName={pageName} mainContent={mainContent} labelData={labelData} router={this.props.router} domainNameURL={domainNameURL}> </SeoText>
                            {
                                (pageName === 'homepage' && !isMobile && isLoggedIn === 'No') ?
                                    <div className="m-promotions text-center d-none d-lg-block">
                                        {
                                            showPromotionBanner && !isEmpty(topBanner) && !isEmpty(topBanner[0]) ?
                                                // <div dangerouslySetInnerHTML={{ __html: !isEmpty(topBanner[0]) ? topBanner[0].text : '' }}></div>
                                                <Image className="a-promotions__banner" id="promotions__banner" src={topBanner[0].imgUrl} onClick={(e) => this.redirectToUrl(e, topBanner[0].url)} />
                                                : null
                                        }
                                        {/*<Link className="a-promotions__btn" id="promotions__btn" href="#" onClick={this.handlePromotionBanner}>
                                            <Icons className="a-promotions__icon icon-draghandle" />
                                        </Link>*/}
                                    </div> : null
                            }



                            {/*<div className={domainName === 'liverpool' ? (pageName !== 'homepage' ? 'o-header noSearchBar d-flex align-items-center d-lg-block' : 'o-header') : (pageName !== 'homepage' ? 'o-header' : 'o-header  noSearchBar d-flex align-items-center d-lg-block')}>*/}
                            <div className={pageName !== 'homepage' ? 'o-header noSearchBar d-flex align-items-center d-lg-block' : 'o-header'}>
                                {
                                    (pageName === 'homepage' && !isMobile) ?
                                        <MultisiteHeader showPromotionBanner={showPromotionBanner} topBanner={topBanner} isLoggedIn={isLoggedIn} handlePromotionBanner={this.handlePromotionBanner} TopRightLink={topRightLinks} TopLeftLinks={topLeftLinks} /> : null
                                }
                                <div className="o-container__fluid container-fluid">
                                    <div className="o-container container p-0">
                                        <div className="m-searchBar">
                                            < div className = {
                                                pageName !== 'homepage' ? 'o-checkout__header o-row row align-items-center no-gutters ' + (domainName === 'liverpool' ? 'pt-2 pt-lg-2 pb-lg-2' : 'pt-2 pb-2') : 'o-checkout__header o-row row align-items-center no-gutters ' + (domainName === 'liverpool' ? 'py-3 py-lg-2' : 'py-lg-2 py-3')
                                            } >
                                                <div className="o-col col-3 order-1 d-lg-none d-flex">

                                                    {
                                                        pageName === 'pdp' || pageName === 'myAccount' || showBackIcon ?
                                                            <Link className="m-menuBack d-lg-none d-block" href="#" onClick={this.goBack}><Icons className="icon-back a-menuBack__icon" /></Link> :
                                                            <Buttonicon classButton="a-header__hamburger mobile-menu-action p-0" classIcon="icon-hammenu" handleClick={handleMobileMenu} />

                                                    }
                                                    <LeftMegamenu
                                                        showMobileMenu={showMobileMenu}
                                                        deptMenuData={deptMenuData}
                                                        showMobileDeptMenu={this.state.showMobileDeptMenu}
                                                        handleMobileDeptMenu={this.handleMobileDeptMenu}
                                                        megaMenuTitleName={megaMenuTitleName}
                                                        categoryLinkAjax={this.categoryLinkAjax}
                                                        loginDetails={loginDetails}
                                                        wapLinks={wapLinks}
                                                        handlelogout={this.handlelogout}
                                                        handleMobileMenu={handleMobileMenu}
                                                        redirectToURL={this.redirectToURL}
                                                    />
                                                </div>
                                                <div className="o-col col-lg-auto col-6 order-2 order-lg-1 text-center">
                                                    {this.props.pageName === 'pdp' &&
                                                        <Anchorimage handleClick={this.goToHome} headerlogo="a-header__logo" src={headerLogo && headerLogo[0] && headerLogo[0].imgUrl ? headerLogo[0].imgUrl : ""} />
                                                    }
                                                    {this.props.pageName !== 'pdp' &&
                                                        <Anchorimage href="/tienda/home" headerlogo="a-header__logo" src={headerLogo && headerLogo[0] && headerLogo[0].imgUrl ? headerLogo[0].imgUrl : ""} />
                                                    }
                                                </div>
                                                <div className={pageName === 'homepage' ? "o-col col-lg order-4 order-lg-2 pt-3 pt-lg-0" : "o-col col-lg order-4 order-lg-2 pt-lg-0"}>
                                                    {pageName && (pageName == "homepage") &&
                                                        <Searchbar placeholder="Buscar..." searchclass="m-header__searchBar" searchbarClicked={searchbarClicked} handleSearchBarShow={handleSearchBarShow} redirectToSearchPage={this.redirectToSearchPage} searchTerm={searchTerm} onKeypress={this.onKeypress} onChangeSearchbar={this.onChangeSearchbar} data={abc} />
                                                    }
                                                    {pageName && (pageName != "homepage") &&
                                                        <Searchbar placeholder="Buscar..." searchclass="m-header__searchBar d-none d-lg-block" searchbarClicked={searchbarClicked} handleSearchBarShow={handleSearchBarShow} redirectToSearchPage={this.redirectToSearchPage} searchTerm={searchTerm} onKeypress={this.onKeypress} onChangeSearchbar={this.onChangeSearchbar} data={abc} />
                                                    }


                                                    {
                                                        (!isEmpty(searchTerm) && searchTerm.length >= MIN_TYPEHEAD_LENGTH && showTypehead && isDesktop) ?
                                                            <Typeahead GtmCall={this.GtmCall} clearSearchbar={this.clearSearchbar} getPdpDetail={this.getPdpDetail} onKeypress={this.onKeypress} handleTypeheadHide={handleTypeheadHide} handleTypeheadShow={handleTypeheadShow} onChangeSearchbar={this.onChangeSearchbar} searchTerm={searchTerm} typeheadResponse={typeheadResponse} redirectToUrl={this.redirectToUrl} />
                                                            : null
                                                    }
                                                    {
                                                        (!isEmpty(searchTerm) && searchTerm.length >= MIN_TYPEHEAD_LENGTH && showTypehead && (isIpad && isLandscape)) ?
                                                            <Typeahead GtmCall={this.GtmCall} clearSearchbar={this.clearSearchbar} getPdpDetail={this.getPdpDetail} onKeypress={this.onKeypress} handleTypeheadHide={handleTypeheadHide} handleTypeheadShow={handleTypeheadShow} onChangeSearchbar={this.onChangeSearchbar} searchTerm={searchTerm} typeheadResponse={typeheadResponse} redirectToUrl={this.redirectToUrl} />
                                                            : null
                                                    }
                                                    {
                                                        (showTypehead && (isMobile || isPortrait)) ?
                                                            <Typeahead GtmCall={this.GtmCall} clearSearchbar={this.clearSearchbar} getPdpDetail={this.getPdpDetail} onKeypress={this.onKeypress} handleTypeheadHide={handleTypeheadHide} handleTypeheadShow={handleTypeheadShow} onChangeSearchbar={this.onChangeSearchbar} searchTerm={searchTerm} typeheadResponse={typeheadResponse} redirectToUrl={this.redirectToUrl} />
                                                            : null
                                                    }
                                                </div>

                                                <div className="o-col col-lg-auto d-none d-lg-flex text-center order-lg-3">

                                                    <Link className="a-header__topLink" onClick={() => this.orderHistory(my_orders_object.url)}>{my_orders_object.name}</Link>

                                                </div>

                                                {loader ?
                                                    (<div className="o-col col-lg-auto d-none d-lg-flex text-center order-lg-3">

                                                        <img src={AssetsPath + "/static/images/imageLoading.svg"} width="37" height="46" alt="shop" style={{ verticalAlign: "middle" }} />

                                                    </div>)
                                                    :
                                                    (LoggedInSession ?
                                                        <div className="o-col col-lg-auto d-none d-lg-flex text-center order-lg-4" onMouseOver={() => this.mouseOverLinks('session_panel')} onMouseOut={() => this.mouseOutLinks('session_panel')}>
                                                            <Span className="a-header__topLink popover-session">{`Hola ${firstName}`}<Icons className="icon-arrow_down" />
                                                            </Span>
                                                            <Popover loginDropdown showPopoverList={dynamic_popover_status_obj['session_panel']} items={my_account_object} loginDetails={loginDetails} arrowAling="align-arrow" />
                                                            <div className="d-none" id="m-sessionPanel">
                                                                <div className="popover-body">
                                                                    <div className="m-session__popover">
                                                                        <Ul>
                                                                            {
                                                                                !isEmpty(my_account_object.links) ? map(my_account_object.links, (item, key) => {
                                                                                    return <List key={key}>
                                                                                        <Link className="a-header__sessionLink" rel="noreferrer" href={item.url} prefetch={false}>{item.name}</Link>
                                                                                    </List>
                                                                                }) : null
                                                                            }
                                                                        </Ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="o-col col-lg-auto d-none d-lg-flex text-center order-lg-4">

                                                            <Span className="a-header__topLink" onClick={this.handleLogin}>{my_account_object.name}</Span>

                                                        </div>

                                                    )
                                                }
                                                <div className="o-col col-lg-auto col-3 text-lg-center text-right order-3 order-lg-5">
                                                    <div className="d-inline-block d-lg-none">
                                                        {pageName && pageName === "homepage" && isLoggedIn === 'No' ?
                                                            <Buttonicon handleClick={this.redirectToLogin} classButton="a-header__profile" classIcon="icon-profile" />
                                                            :
                                                            pageName && pageName !== "homepage" && (isLoggedIn === 'Yes' || isLoggedIn === 'No') ? <Buttonicon handleClick={handleTypeheadShow} classButton="a-header__zoom zoomsearch" classIcon="icon-zoom" /> : null
                                                        }
                                                    </div>
                                                    <ButtonSpanIcon bagclass="icon-bolsa" btnclass={count > 99 ? 'a-header__bag a-header__bag_large_count' : 'a-header__bag'} spanText={count} handleClick={this.redirectCart} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="o-container__fluid container-fluid wrap-megamenu d-none d-lg-block" onClick={handleTypeheadHide}>
                                    <div className="o-container container p-0">
                                        <nav className="m-megamenu">
                                            <div className="o-row row align-items-center">
                                                <div className="o-col col-lg-8 text-left">
                                                    <div className="o-navDesktop">
                                                        <Ul className="m-navDesktop__menuList">
                                                            <List className="m-navDesktop__section pt-2 pb-2" onClick={() => this.mouseOver()} onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                                                                <Span className={this.state.showDropdown ? 'a-header__strongLink nav-desktop-menu-action pr-3 pb-3 m-megamenu_dropdown_show' : 'a-header__strongLink nav-desktop-menu-action pr-3 pb-3'} >
                                                                    {!isEmpty(megaMenuTitleName[0]) ? megaMenuTitleName[0].title : ''}<Icons className="icon-arrow_down" />
                                                                </Span>
                                                                {
                                                                    !isEmpty(deptMenuData) && !isEmpty(deptMenuData.l1Categories) && !isMobile &&
                                                                    <Menu
                                                                        className={this.state.showDropdown ? 'menu-aim m-megamenu__dropdown m-megamenu_dropdown_open' : 'dropdown-menu menu-aim m-megamenu_dropdown_close'}
                                                                        closeDepartmetMenu={this.mouseOut}
                                                                        categoryLinkAjax={this.categoryLinkAjax}
                                                                        headerData={headerData}
                                                                        mouseOverOnSubcat={this.mouseOverOnSubcat}
                                                                        mouseOutOnSubcat={this.mouseOutOnSubcat}
                                                                        deptMenuData={deptMenuData}
                                                                        agentDetails={this.state.agentDetails}
                                                                    />
                                                                }
                                                                {/* <Ul className={this.state.showDropdown ? 'dropdown-menu m-megamenu__dropdown m-megamenu_dropdown_open' : 'dropdown-menu m-megamenu__dropdown m-megamenu_dropdown_close'} role="menu">
                                                                    {
                                                                        (!isEmpty(deptMenuData) && !isEmpty(deptMenuData.l1Categories) && !isMobile) ?
                                                                            <DepartmentMenu closeDepartmetMenu={this.mouseOut} agentDetails={this.state.agentDetails} categoryLinkAjax={this.categoryLinkAjax} headerData={headerData} mouseOverOnSubcat={this.mouseOverOnSubcat} mouseOutOnSubcat={this.mouseOutOnSubcat} deptMenuData={deptMenuData} />
                                                                            : null
                                                                    }
                                                                </Ul> */}
                                                            </List>
                                                            {
                                                                !isEmpty(leftLinksData) ? map(leftLinksData[0].links, (items, index) => {
                                                                    if (isEmpty(items.links)) {
                                                                        return <List className="m-navDesktop__section pl-6 pt-2 pb-2" key={index}>
                                                                            <Link className="a-header__strongLink pr-4" rel="noreferrer" href={items.url}>{items.name}</Link>
                                                                        </List>
                                                                    } else {
                                                                        return <List className="m-navDesktop__section pl-2 pt-2 pb-2" key={index} onClick={() => this.mouseOverLinks(`panel${index}`)} onMouseOver={() => this.mouseOverLinks(`panel${index}`)} onMouseOut={() => this.mouseOutLinks(`panel${index}`)}>
                                                                            <Link className="a-header__strongLink pr-3" rel="noreferrer" href={items.url || "#"} prefetch={false}>
                                                                                <Span className="a-header__strongLink popover-session pr-2">{items.name}<Icons className="icon-arrow_down" /></Span>
                                                                            </Link>
                                                                            <Popover showPopoverList={dynamic_popover_status_obj[`panel${index}`]} items={items} />
                                                                            <div className="d-none" id={`m-panel${index}`}>
                                                                                <div className="popover-body">
                                                                                    <div className="m-session__popover">
                                                                                        <Ul>
                                                                                            {
                                                                                                map(items.links, (item, key) => {
                                                                                                    return <List key={key}>
                                                                                                        <Link className="a-header__sessionLink" rel="noreferrer" href={item.url} prefetch={false}>{item.name}</Link>
                                                                                                    </List>
                                                                                                })
                                                                                            }
                                                                                        </Ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </List>
                                                                    }
                                                                }) : null
                                                            }
                                                        </Ul>
                                                    </div>
                                                </div>
                                                <div className="o-col col-lg-4 text-right">
                                                    <div className="o-nav-desktop-menu">
                                                        <Ul className="m-navDesktop__menuList">
                                                            {
                                                                !isEmpty(rightLinksData) ? map(rightLinksData[0].links, (item, key) => {
                                                                    return <List key={key} className="m-navDesktop__section pt-2 pb-2">
                                                                        <Link className="a-header__strongLink pr-3" rel="noreferrer" href={item.url} prefetch={false}>{item.name}</Link>
                                                                    </List>
                                                                }) : null
                                                            }
                                                        </Ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </parentContext.Consumer>
                <span style={{ "display" : "none" }} id="impression-script-container" />
            </header>
        );
    }


}

Header.defaultProps = {
    setDepartmentData: () => { },
    departmentData: {},
    showBackIcon: false
}
export default withRouter(Header);

const getUserLinksByType = (header_userlinks) => {
    const userlinks = {};
    for (var i in header_userlinks)
        switch (header_userlinks[i].displayStyle) {
            case 'text': userlinks.my_orders_object = header_userlinks[i]; break;
            case 'megaMenu': userlinks.my_account_object = header_userlinks[i]; break;
            case 'image': userlinks.my_bag_object = header_userlinks[i]; break;
        }
    return userlinks
}