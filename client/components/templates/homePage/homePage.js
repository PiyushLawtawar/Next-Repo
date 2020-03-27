/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Home page content.
 *                <Header> - will render Header content,
 *                <Footer> - will render Footer Content,
 *                <TechnicalSeo> - will render SEO content for Home page,
 *                <HomeBody> will render Middle content of Home page.
 * 
 * @exports  : HomePage.
 * @requires : module:React
 * @requires : module:next/router
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/map
 * @requires : module:lodash/get
 * @requires : module:contexts/parentContext#parentContext
 * @requires : module:helpers/utilities/utility#Utility, #UserAgentDetails, #GetCookie
 * @requires : module:helpers/config/config#Path
 * @requires : module:headerFooter/headerFooter#Footer
 * @requires : module:homeBody/homeBody#HomeBody
 * @requires : module:organisms/Header/Header#Header
 * @requires : module:organisms/technicalseo/TechnicalSeo#TechnicalSeo
 * Team : B&S Team
 * 
 */
import React from 'react';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Footer from '../headerFooter/headerFooter';
import HomeBody from './homeBody/homeBody';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import TechnicalSeo from '../../organisms/technicalseo/TechnicalSeo';
import { UserAgentDetails } from '../../../helpers/utilities/utility';
import get from 'lodash/get';
import { GetCookie } from '../../../helpers/utilities/utility';

/**
 * @class HomePage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carouselsData: {},
            homePageContent: props.homePageContent,
            staticMetaTags: props.seoContent,
            staticMetaTagsLabelPage:{},
            hostName:props.hostName,
            relativePath:props.relativePath,
            recentlyViewed:{},
            window: {},
            bannerVisible: false,
            isLoggedIn: '',
            flags:props.flags,
            pageTitle:''
        };
            this.aaHomeGTM=true;
           // this.pageTitle = document ? document.title :'';
    }

    /**
     * @function getStaticMetaTags
     * @desc this function is use to call service to get static MetaTags data.
     * @param ** no parameters ** 
     * @returns null.
     * 
     */
    getStaticMetaTags = async () => {
        let { staticMetaTags } = this.state;
         const pageName ="?pageName=PWA-META-TAGS-PAGE";
        Utility(Path.staticLabelsFetch+pageName, 'GET' /*, {
            "pageName": [
                "PWA-META-TAGS-PAGE"
            ]
        }*/).then(response => {
            staticMetaTags = response.data;
            this.setState({
                staticMetaTags,
                pageTitle:document.title
            });
        });
    }

    /**
     * @function getCarouselAPI
     * @desc this function is use to get contentPaths.
     * @param {Object} homePageContent
     * @returns {Array} clr
     * 
     */
    getCarouselAPI = (homePageContent) => {
        var clr = [];
        !isEmpty(homePageContent) && map(homePageContent, (items) => {
            if (items['@type'] === "LPContentSlotMain" && items.contentPaths && items.contentPaths[0]) {
                return clr.push(items.contentPaths[0]);
            }
        });
        return clr.join();
    }

    /**
     * @function getProductId
     * @desc this function is use to get product ID.
     * @param ** no parameters ** 
     * @returns {String} expectedValue
     * 
     */
    getProductId = () => {
        let expectedValue = null;
        var cookieArr = document.cookie.split(";");
        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            if (cookiePair[0].trim() === 'recentlyViewed') {
                if(!expectedValue){
                    expectedValue = cookiePair[1].trim();
                }else{
                    if(expectedValue && expectedValue.length < cookiePair[1].trim().length){
                        expectedValue = cookiePair[1].trim();
                    }
                }

            }
        }
        if(expectedValue){
            let array = expectedValue && expectedValue.indexOf('/') > -1 ?expectedValue.split('/'):[];
            if(!array ||  (array.length && array.length <5)){
                expectedValue = null;
            }
        }
        return expectedValue;
    }

    /**
     * @function getStaticMetaTagsLabelPage
     * @desc this function is use to get labelData from parent props and set into the state as staticMetaTagsLabelPage.
     * @param ** no parameters ** 
     * @returns null.
     * 
     */
    getStaticMetaTagsLabelPage = async () => {
        /*const pageName ="?pageName=PWA-HOME-PAGE#PWA-TECH-SEO-EVERY-PAGE#PWA-TECH-SEO-HOME-PAGE#WAPalertMessagePage";
        Utility(Path.staticLabelsFetch+pageName, 'GET', {
            "pageName": [
                "PWA-HOME-PAGE",
                "PWA-TECH-SEO-EVERY-PAGE",
                "PWA-TECH-SEO-HOME-PAGE",
                "WAPalertMessagePage"
            ]
        }).then(response => {
            if(response && response.data && response.data.staticLabelValues){
                var tempData = response.data.staticLabelValues;
                this.setState({staticMetaTagsLabelPage:tempData});
            }
        });*/
        var tempData = this.props.labelData;
        this.setState({staticMetaTagsLabelPage:this.props.labelData});
    }

    /**
     * REACT life cycle event. It will be called once after the render function is completed.
     * @event componentDidUpdate 
     * 
     */
    componentDidUpdate() {
        window.sessionStorage.removeItem('orderHistory') //remove this item when landed on home page /* production observation#93 */
        //SWOGO disable
        if(window && window.swogoDependencies){
            window.swogoDependencies = null;
        }
    try{
        let loginDetails = this.props.loginDetails;
        //console.log("homePageContent",this.props.flags)
         /*if(loginDetails && loginDetails.LoggedInSession && this.aaHomeGTM){
             this.aaHomeGTM = false;


        let URL=window.location.href
        let gtmObjectData =  {
            loginStatus: loginDetails.LoggedInSession || '',
            actURL: URL,
            actPageTitle : document.title,
            userID: loginDetails && loginDetails.cartHeaderResponse && loginDetails.cartHeaderResponse.cartHeaderDetails && loginDetails.cartHeaderResponse.cartHeaderDetails.gtmUserId || '',
        }
        GTMallPages(gtmObjectData);
     }*/
    } catch(e) {
        //console.log(e);
    }
    }

    /**
     * @function getCorouselData
     * @desc this function is use to call "getCarouselHome" service to get the carousel data.
     * @param {Object} loginDetails
     * @returns null.
     * 
     */
    getCorouselData = (loginDetails) => {
        try {
            if(!isEmpty(this.state.homePageContent)) {
                let guest = '';
                let LoggedInSession = loginDetails && loginDetails.LoggedInSession || "";
                if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
                    LoggedInSession = false;
                }
                if(!LoggedInSession){
                    guest = "&isguest=true";
                }else{
                    guest = "&isguest=false";
                }
                var carouselPaths = this.getCarouselAPI(this.state.homePageContent)
                Utility(Path.getCarouselsHome + '?carouselPaths=' + carouselPaths+guest, 'GET').then(response => {
                    this.setState({
                        carouselsData: response.data
                    });
                });

                 let id = this.getProductId()
                 if(id && typeof id ==='string' && loginDetails.LoggedInSession){
                    Utility(Path.recentlyViewed + '?recentlyViewed=' + id, 'GET').then(response => {
                        this.setState({
                            recentlyViewed: response.data
                        });
                    });
              }
            }
        }  catch (e) {
            return e.message;
        }
    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps
     * @param {*} nextProps
     * 
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.loginDetails.cartHeaderResponse !== nextProps.loginDetails.cartHeaderResponse) {
            if(!isEmpty(nextProps.loginDetails.cartHeaderResponse)) {
                const isLoggedIn = get(nextProps.loginDetails, 'cartHeaderResponse.cartHeaderDetails.isLoggedIn', false);
                if(isLoggedIn) {
                    this.setState({ isLoggedIn: 'Yes' });
                } else {
                    this.setState({ isLoggedIn: 'No' });
                }
            }
            this.getCorouselData(nextProps.loginDetails);
        }
        // if( isEmpty(this.state.carouselsData) && (this.props.loginDetails.cartHeaderProcessCompleted || nextProps.loginDetails.cartHeaderProcessCompleted ) ){
        //     this.getCorouselData(this.props.loginDetails);
        // }

    }

    /**
     * REACT life cycle event
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        this.getStaticMetaTagsLabelPage();
        try {
                if(isEmpty(this.state.homePageContent)) {
                   Utility('/tienda/home?isajax=true', 'GET').then(response => {
                        const homePageContent = response.data && response.data.homePageContent && response.data.homePageContent.contentItem && response.data.homePageContent.contentItem.contents && response.data.homePageContent.contentItem.contents[0] && response.data.homePageContent.contentItem.contents[0].mainContent || {}
                        this.setState({
                            homePageContent: homePageContent
                        });
                    });
                }
        } catch (e) {
            return e.message;
        }
        this.setState({
            window:window,
            bannerVisible: isEmpty(GetCookie('showBanner')) ? true: false
        })
    }

    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {
        const donotLoadMainBody = isEmpty(this.props.departmentData)
        const staticMetaTags = this.state.staticMetaTags;
        const flags = (this.state.homePageContent && this.state.homePageContent.flags)?this.state.homePageContent.flags:null;
        // const staticMetaTags = this.getStaticMetaTags();
        const { loginDetails, staticLabels, domainName } = this.props;
        const smartBannerText = this.state.staticMetaTagsLabelPage && this.state.staticMetaTagsLabelPage;
        const LoggedInSession = get(loginDetails, 'LoggedInSession', false);
        const { window, bannerVisible, isLoggedIn } = this.state;
        const { isAndroid } = UserAgentDetails(window);
        const showBanner = (isLoggedIn === 'No' || isLoggedIn === '') && isAndroid && bannerVisible && (domainName.indexOf('liverpool') !== -1) ? true : false;
        if (isEmpty(this.state.homePageContent)) {
            //console.log("Home page: homePageContent is empty ", this.state.homePageContent)
        }
        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, updateState, searchbarClicked, handleSearchBarShow, handleSearchBarHide, setFooterData, snbfooterData, setDepartmentData, departmentData}) => (
                    <React.Fragment>
                        {/* {(!isEmpty(staticMetaTags)) && updateState('metaTag', staticMetaTags)} */}

                        {/* {(!isEmpty(staticMetaTags)) &&
                            <SeoText staticMetaTags={staticMetaTags} pageName="home" > </SeoText>
                        } */}
                        {/* {
                            showBanner && smartBannerText && <SmartBanner staticLabels={staticLabels} smartBannerText={smartBannerText}/>
                            // showBanner && staticLabels && <SmartBanner staticLabels={staticLabels} />
                        } */}
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="homepage"
                            staticMetaTagsLabelPage={this.state.staticMetaTagsLabelPage}
                            searchbarClicked={searchbarClicked}
                            handleSearchBarShow={handleSearchBarShow}
                            handleSearchBarHide={handleSearchBarHide}
                            setDepartmentData={setDepartmentData}
                            departmentData={departmentData}
                        />
                        <React.Fragment>
                                <TechnicalSeo pageName="home" staticLabelValues ={this.state.staticMetaTags} hostName ={this.state.hostName} relativePath={this.state.relativePath}  mouseFlag ={(flags && !flags['mouseflag'])?false:true}/>                                
                            </React.Fragment>
                        {
                        !isEmpty(this.state.homePageContent) && !donotLoadMainBody &&  loginDetails.cartHeaderProcessCompleted &&
                            <React.Fragment>
                                <HomeBody homePageContent={this.state.homePageContent} getCarouselsData={this.state.carouselsData} recentlyViewed={this.state.recentlyViewed}/>
                            </React.Fragment> //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                        }
                         {
                          loginDetails.cartHeaderProcessCompleted && 
                        <Footer loginDetails={loginDetails} staticMetaTagsLabelPage={this.state.staticMetaTagsLabelPage} setFooterData={setFooterData} snbfooterData={snbfooterData} />
                        //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                         }
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}

export default HomePage;
