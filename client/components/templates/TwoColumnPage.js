import React from 'react';
import dynamic from 'next/dynamic';
import { Utility, GetLinkData } from '../../helpers/utilities/utility';
import { Path } from '../../helpers/config/config';
const Footer = dynamic(() => import('./headerFooter/headerFooter'));
//import Footer from './headerFooter/headerFooter';
const BlpPage = dynamic(() => import('./BlpPage'));
const BlpStaticPage = dynamic(() => import('./BlpStaticPage'));
const PlpPage = dynamic(() => import('./PlpPage'));
const ClpPage = dynamic(() => import('./ClpPage'));

//import BlpPage from './BlpPage';
//import BlpStaticPage from './BlpStaticPage';
//import ClpPage from './ClpPage';
//import PlpPage from './PlpPage';
const ErrorPage = dynamic(() => import('./ErrorPage'));
//import ErrorPage from './ErrorPage';
const Header = dynamic(() => import('../organisms/Header/Header'));
//import Header from '../organisms/Header/Header';
import get from 'lodash/get';
import map from 'lodash/map';
import { parentContext } from '../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'next/router';
import Router from 'next/router';
import TechnicalSeo from '../organisms/technicalseo/TechnicalSeo';
import { GTMallPages } from '../../helpers/utilities/utility';
const FailOver = dynamic(() => import('../templates/errorPage/failOver'));
//import FailOver from '../templates/errorPage/failOver';
const NoProducts = dynamic(() => import('../templates/errorPage/NoProducts'));
//import NoProducts from '../templates/errorPage/NoProducts';
import Loader from '../atoms/Loader/atom-loader'

class TwoColumnPage extends React.Component {
    constructor(props) {
        super(props);

        const twoColumnData = (props.twoColumnData) || {};
        const headerContent = (props.twoColumnData && props.twoColumnData.headerContent) || {};       
        const pageType = props.twoColumnData && props.twoColumnData.mainContent && props.twoColumnData.mainContent.contentItem && props.twoColumnData.mainContent.contentItem.contents && props.twoColumnData.mainContent.contentItem.contents[0] && props.twoColumnData.mainContent.contentItem.contents[0]["@type"] || '';
        const categoryId = (pageType == "TwoColumnPage") ? (props.twoColumnData && props.twoColumnData.mainContent && props.twoColumnData.mainContent.contentItem && props.twoColumnData.mainContent.contentItem.contents && props.twoColumnData.mainContent.contentItem.contents[0] && props.twoColumnData.mainContent.contentItem.contents[0].secondaryContent && props.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0] && props.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs && props.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0] && props.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties["category.repositoryId"]) || ''
            : props.twoColumnData && props.twoColumnData.mainContent && props.twoColumnData.mainContent.contentItem && props.twoColumnData.mainContent.contentItem.categoryId || {}
        this.state = {
            carouselsData: {},
            categoryId: categoryId || '',
            twoColumnData: twoColumnData || {},
            totalNumRecords: 0,
            chanelBrandHTML: 'NA',
            chanelBrandJSON: null,
            hostName: props.twoColumnData.hostname,
            relativePath: props.twoColumnData.url,
            isLoggedIn: props.loginDetails.LoggedInSession,
            configurationData: props.configurationData || {},
            staticLabelValues:props.twoColumnData && props.twoColumnData.staticLabelValues || props.twoColumnData.labelsData || props.twoColumnData.mainContent && props.twoColumnData.mainContent.staticLabels || {},
            searchTerm: isEmpty(props.queryString['s']) ? props.queryString['s']: ''
        };        
    }

    getCarouselData = (pageType) => {
        let execute = true;
        if (this.props.body && (JSON.stringify(this.props.body).indexOf('page') > -1
            || JSON.stringify(this.props.body).indexOf('label') > -1
            || JSON.stringify(this.props.body).indexOf('Ns') > -1
            || JSON.stringify(this.props.body).indexOf('Nf') > -1)) {
            execute = false;
        }
        try {
            let guest = '';
            const { isLoggedIn } = this.state;
            let loggedInSession = false;
            if (isLoggedIn) {
                loggedInSession = true;
            }
            if (!loggedInSession) {
                guest = "&isguest=true";
            } else {
                guest = "&isguest=false";
            }
            const { categoryId } = this.state;
            /* 23404 fix start*/
            if (execute) {
                if(!isEmpty(categoryId)) {
                    let pageTypeVal = (!isEmpty(pageType) && pageType === 'categoryLandingPage') ? 'CLP' : 'PLP';
                    Utility(Path.getCarousels + '?page=' + pageTypeVal + '&categoryId=' + categoryId + guest, 'GET').then(response => {
                        this.setState({
                            carouselsData: response.data
                        });
                    });
                } else {
                    this.setState({
                        carouselsData: {}
                    });
                }
            }
            /* 23404 fix end*/
        } catch (e) {
            //console.log("TwoColumnPage: ", e.message)
        }
    }

    componentDidMount() {
        this.getUpdatedData();
        //SWOGO disable
        if (window && window.swogoDependencies) {
            window.swogoDependencies = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        const { queryString } = this.props;
        const pageType = get(nextProps.twoColumnData, 'mainContent.contentItem.contents[0]["@type"]', '');
        if (nextProps.configurationData !== this.props.configurationData) {
            this.setState({ configurationData: nextProps.configurationData }, () => { this.microSiteReDirections(); });
        }
        if ((this.props.loginDetails && this.props.loginDetails.cartHeaderResponse) !== (nextProps.loginDetails && nextProps.loginDetails.cartHeaderResponse)) {
            const isLoggedIn = nextProps.loginDetails && nextProps.loginDetails.LoggedInSession;
            if(this.props.loginDetails && this.props.loginDetails.LoggedInSession !==isLoggedIn ){
            this.setState({ isLoggedIn }, () => {
                this.getCarouselData(pageType)
            });
            }else{
                this.getCarouselData(pageType)
            }            
        }
        if (nextProps.twoColumnData !== this.props.twoColumnData) {
            const staticLabelValues = get(nextProps, 'twoColumnData.mainContent.staticLabels', this.state.staticLabelValues);
            this.setState({ searchTerm: !isEmpty(queryString['s'])? queryString['s']: '', staticLabelValues });
            this.setState({ twoColumnData: nextProps.twoColumnData }, () => { this.getUpdatedData() });
            setTimeout(() => {
                this.getGTMOnload()
            }, 10)   
            const categoryId = (pageType == "TwoColumnPage") ? get(nextProps.twoColumnData, 'mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties["category.repositoryId"]', '') : get(nextProps.twoColumnData, 'mainContent.contentItem.categoryId', '')
            this.setState({ categoryId }, () => {
                this.getCarouselData(pageType);
            });
            this.microSiteReDirections();
            const { handleTypeheadHide, showTypehead } = this.props;
            if (showTypehead) {
                handleTypeheadHide();
            }
        }
    }

    microSiteReDirections = () => {
        const { configurationData } = this.state;
        const { catId } = this.props;
        const microSiteReDirections = get(configurationData, 'configuration.microSiteReDirectionConfiguration', {});
        if (!isEmpty(microSiteReDirections)) {
            /* 23373 fix start*/
            if (!isEmpty(microSiteReDirections[catId])) {
                const microSiteUrl = microSiteReDirections[catId];
                /* 23597 fix start   */
                if(microSiteUrl.indexOf(catId) === -1) {
                    const htmlAnchor = document.createElement('a');
                    htmlAnchor.href = microSiteReDirections[catId];
                    const hostname = htmlAnchor.hostname;
                    if(!isEmpty(window)) {
                        if(window.location.hostname === hostname)  {
                            Router.push(microSiteReDirections[catId]);
                        } else {
                            window.location.replace(microSiteReDirections[catId]); /* 22989 fix */
                        }
                    }                    
                }
                /* 23597 fix end   */                
            }
            /* 23373 fix end*/
        }
    }

    getGTMOnload = () => {
        /* 21659 fix start */
        if (window && window.myOnloadFunction) {
            let decodeURIPath = decodeURI(window.location.pathname)
            window.myOnloadFunction(decodeURIPath)
        }
        /* 21659 fix start end*/   
        const data = {
            "actPageTitle": decodeURI(document && document.title || 'Liverpool es parte de Mi vida'),
            "loginStatus": this.props.loginDetails && this.props.loginDetails.LoggedInSession ? 'Y' : 'N',
            "actURL": decodeURI(window.location.href),
            "userID": this.props.loginDetails && this.props.loginDetails.cartHeaderResponse && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails.gtmUserId || ''
        };
        Utility(Path.gtmServiceCall, 'POST', data).then(response => {
            GTMallPages(response.data);
        });
    }

    getGTMonSearch = (totalNumRecords) => {
        const { queryString, loginDetails } = this.props;
        const { searchTerm } = this.state;
        if (!isEmpty(queryString['s']) && searchTerm !== queryString['s']) {
            //    GTM for search
            const gtmObject = {
                'searchTerm': queryString['s'] || '',
                'searchResults': totalNumRecords || '',
                'event': 'siteSearch',//variable estática
                "loginStatus": get(loginDetails, 'cartHeaderResponse.cartHeaderDetails.isLoggedIn', false),
                "userID": get(loginDetails, 'cartHeaderResponse.cartHeaderDetails.gtmUserId', ''),
            };
            dataLayer.push(gtmObject);
        }
    }

    getUpdatedData = () => {
        const mainContent = this.state.twoColumnData.mainContent || {};
        let redirectUrl = get(mainContent, 'contentItem.redirectURL', '');
        let asInfo = redirectUrl;
        /* 23597 fix start */
        if (!isEmpty(redirectUrl)) {
            const htmlAnchor = document.createElement('a');
            htmlAnchor.href = redirectUrl;
            const hostname = htmlAnchor.hostname;
            if(!isEmpty(window)) {
                if(window.location.hostname === hostname)  {
                    if (redirectUrl.indexOf('?') !== -1) {
                        const index =  redirectUrl.indexOf('?');
                        redirectUrl = redirectUrl.substring(0, index);
                    }
                    const arr = redirectUrl.split('/');
                    const len = arr.length;
                    const catId = arr[len - 1];
                    let href = `/tienda/twoColumnCategoryPage?categoryId=${catId}`;
                    if (asInfo.indexOf('?showPLP') !== -1) {
                        href += '&always=PLP';
                    }
                    Router.push(href, asInfo);
                    return null;
                } else {
                    window.location.replace(redirectUrl); /* 22989 fix */
                    return null;
                }
            }
        }
        /* 23597 fix end */
        this.microSiteReDirections();
        const bodyContent = mainContent.contentItem && mainContent.contentItem.contents && mainContent.contentItem.contents[0] && mainContent.contentItem.contents[0]['mainContent'] || {};
        let totalNumRecords = 0;        
        !isEmpty(bodyContent) && map(bodyContent, (mainItem) => {

            if (mainItem['@type'] === 'ContentSlotMain') {
                const type = mainItem.contents && mainItem.contents[0] && mainItem.contents[0]['@type'] || '';
                if (type === 'ResultsList') {
                    totalNumRecords = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].totalNumRecs || totalNumRecords;
                    setTimeout(() => { this.getGTMonSearch(totalNumRecords) }, 10);                    
                    if (totalNumRecords === 1) {
                        const productId = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].productId && mainItem.contents[0].records[0].productId[0] || "";
                        let productName = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].productDisplayName && mainItem.contents[0].records[0].productDisplayName[0] || "";
                        let isHybridProduct = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].isHybridProduct && mainItem.contents[0].records[0].isHybridProduct[0] || false;
                        let isCollection = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0]["product.relProdSequence"] || null;
                        if (!isEmpty(productName)) {
                            productName = productName.toLowerCase();
                            productName = productName.replace(/ /g, '-');
                            if (isHybridProduct === "true") {
                                Router.push({ pathname: `/tienda/pdp/hp/${productName}/${productId}` });
                            }
                            else if (isCollection != null) {
                                //Router.push({ pathname: `/tienda/group/${productName}/${productId}` });
                                let inputData = {
                                    productId: productId,
                                    productName: productName,
                                    pageName: 'productDetails',
                                    pdpTypeForSPA: 'collection',
                                    typeahead: 'no'
                                }
                                const { href, asInfo } = GetLinkData(inputData);
                                Router.push(href, asInfo);
                            }
                            else {
                                // Router.push({ pathname: `/tienda/pdp/${productName}/${productId}` });
                                let inputData = {
                                    productId: productId,
                                    productName: productName,
                                    pageName: 'productDetails',
                                    pdpTypeForSPA: 'default',
                                    typeahead: 'no'
                                }
                                const { href, asInfo } = GetLinkData(inputData);
                                Router.push(href, asInfo);
                            }
                        }
                    }
                }
            }
        });
        const brandHtml = this.getchanelBrandHTML();
        if(brandHtml && brandHtml !=='NA'){
        this.setState({
                chanelBrandHTML: brandHtml,
            chanelBrandJSON: this.getchanelBrandEntireJson()
        })
        }
    }

    //Required for chanel brand display
    getchanelBrandHTML() {
        let everyPageStatic = null;
        let staticLabelsArray = {};
        if (this.state.twoColumnData && this.state.twoColumnData.mainContent && this.state.twoColumnData.mainContent.staticLabels) {
            staticLabelsArray = get(this.state.twoColumnData.mainContent, 'staticLabels', {});
        }
        if (this.state.staticLabelValues) {
            staticLabelsArray = this.state.staticLabelValues;
        }
        //const staticLabelsArray = get(this.state.twoColumnData.mainContent, 'staticLabels.staticLabelValues', {});
        if (staticLabelsArray && staticLabelsArray.length > 0) {
            staticLabelsArray.map(page => {
                if (page['pageName'] && page['pageName'] === 'PWA-TECH-SEO-EVERY-PAGE') {
                    everyPageStatic = page['keyValues'];
                }
            })
        }
        const checkType = this.state.twoColumnData && this.state.twoColumnData.mainContent && this.state.twoColumnData.mainContent.contentItem
            && this.state.twoColumnData.mainContent.contentItem.contents && this.state.twoColumnData.mainContent.contentItem.contents[0]
            && this.state.twoColumnData.mainContent.contentItem.contents[0]["@type"] || '';
        if (everyPageStatic && checkType && typeof checkType !== 'undefined') {
            if (checkType === 'TwoColumnPage' || checkType === 'LPDynamicBrandLandingPage' || checkType === 'LPStaticBrandLandingPage') {
                if (this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0] &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0] &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties['brandCssConfig']) {
                    const brandCssConfig = this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties['brandCssConfig'].trim();
                    const plpkey = brandCssConfig + '_PLP_Banner_html';
                    const blpkey = brandCssConfig + '_BLP_Banner_html';
                    if (checkType === 'TwoColumnPage' && brandCssConfig && typeof brandCssConfig !== 'undefined') {
                        if (everyPageStatic && everyPageStatic[plpkey] && typeof everyPageStatic[plpkey] !== 'undefined') {
                            return everyPageStatic[plpkey];
                        }

                    }
                    if ((checkType === 'LPDynamicBrandLandingPage' || checkType === 'LPStaticBrandLandingPage') && brandCssConfig && typeof brandCssConfig !== 'undefined') {
                        if (everyPageStatic && everyPageStatic[blpkey] && typeof everyPageStatic[blpkey] !== 'undefined') {
                            return everyPageStatic[blpkey];
                        }
                    }


                }
            }
        }
        return 'NA';
    }

    replaceBrandCssConfig(brandCssConfig) {
        let everyPageStatic = null;
        let staticLabelsArray = {};
        if (this.state.twoColumnData && this.state.twoColumnData.mainContent && this.state.twoColumnData.mainContent.staticLabels) {
            staticLabelsArray = get(this.state.twoColumnData.mainContent, 'staticLabels.staticLabelValues', {});
        }
        if (this.state.staticLabelValues && this.state.staticLabelValues.staticLabelValues) {
            staticLabelsArray = this.state.staticLabelValues.staticLabelValues;
        }
        //const staticLabelsArray = get(this.state.twoColumnData.mainContent, 'staticLabels.staticLabelValues', {});
        if (staticLabelsArray && staticLabelsArray.length > 0) {
            staticLabelsArray.map(page => {
                if (page['pageName'] && page['pageName'] === 'PWA-TECH-SEO-EVERY-PAGE') {
                    everyPageStatic = page['keyValues'];
                }
            })
        }
        let json = {
            "plp_Desc_css_class": "",
            "plp_Price_css_class": "",
            "plp_DiscountPrice_css_class": "",
            "plp_Desc_style": "",
            "plp_Price_style": "",
            "plp_DiscountPrice_style": "",
            "carousel_Desc_css_class": "",
            "carousel_Price_css_class": "",
            "carousel_DiscountPrice_css_class": "",
            "carousel_Desc_style": "",
            "carousel_Price_style": "",
            "carousel_DiscountPrice_style": "",
            "buttonGoTop_css_class": "",
            "buttonGoTop_style": "",
            "iconArrowUp_css_class": "",
            "iconArrowUp_style": ""
        };
        if (brandCssConfig && everyPageStatic) {
            const key = brandCssConfig.trim();
            json['plp_Desc_css_class'] = everyPageStatic[key + '_plp_Desc_css_class'];
            json['plp_Price_css_class'] = everyPageStatic[key + '_plp_Price_css_class'];
            json['plp_DiscountPrice_css_class'] = everyPageStatic[key + '_plp_DiscountPrice_css_class'];
            json['plp_Desc_style'] = everyPageStatic[key + '_plp_Desc_style'];
            json['plp_Price_style'] = everyPageStatic[key + '_plp_Desc_css_class'];
            json['plp_DiscountPrice_style'] = everyPageStatic[key + '_plp_DiscountPrice_style'];
            json['carousel_Desc_css_class'] = everyPageStatic[key + '_carousel_Desc_css_class'];
            json['carousel_Price_css_class'] = everyPageStatic[key + '_carousel_Price_css_class'];
            json['carousel_DiscountPrice_css_class'] = everyPageStatic[key + '_carousel_DiscountPrice_css_class'];
            json['carousel_Desc_style'] = everyPageStatic[key + '_carousel_Desc_style'];
            json['carousel_Price_style'] = everyPageStatic[key + '_carousel_Price_style'];
            json['carousel_DiscountPrice_style'] = everyPageStatic[key + '_carousel_DiscountPrice_style'];
            json['buttonGoTop_css_class'] = everyPageStatic[key + '_buttonGoTop_css_class'];
            json['buttonGoTop_style'] = everyPageStatic[key + '_buttonGoTop_style'];
            json['iconArrowUp_css_class'] = everyPageStatic[key + '_iconArrowUp_css_class'];
            json['iconArrowUp_style'] = everyPageStatic[key + '_iconArrowUp_style'];
        }
        return json;
    }

    getchanelBrandEntireJson() {
        const checkType = this.state.twoColumnData && this.state.twoColumnData.mainContent && this.state.twoColumnData.mainContent.contentItem
            && this.state.twoColumnData.mainContent.contentItem.contents && this.state.twoColumnData.mainContent.contentItem.contents[0]
            && this.state.twoColumnData.mainContent.contentItem.contents[0]["@type"] || '';
        if (checkType && typeof checkType !== 'undefined') {
            if (checkType === 'TwoColumnPage' || checkType === 'LPDynamicBrandLandingPage' || checkType === 'LPStaticBrandLandingPage') {
                if (this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0] &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0] &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties &&
                    this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties['brandCssConfig']) {
                    const brandCssConfig = this.state.twoColumnData.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties['brandCssConfig'];
                    if (checkType === 'TwoColumnPage' && brandCssConfig && typeof brandCssConfig !== 'undefined') {
                        return this.replaceBrandCssConfig(brandCssConfig);
                    }
                    if ((checkType === 'LPDynamicBrandLandingPage' || checkType === 'LPStaticBrandLandingPage') && brandCssConfig && typeof brandCssConfig !== 'undefined') {
                        return this.replaceBrandCssConfig(brandCssConfig);
                    }


                }
            }
        }
        return 'NA';
    }

    render() {
        
        const donotLoadMainBody = isEmpty(this.props.departmentData)        
        const { queryString, catId } = this.props;
        const mainContent = this.props.twoColumnData.mainContent || {};
        const { configurationData } = this.state;
        const microSiteReDirections = get(configurationData, 'configuration.microSiteReDirectionConfiguration', {});
        if (!isEmpty(microSiteReDirections)) {
            /* 23373 fix start*/
            if (!isEmpty(microSiteReDirections[catId])) {
                const microSiteUrl = microSiteReDirections[catId];
                if(microSiteUrl.indexOf(catId) === -1) {
                    return <Loader className={'loader'}  domainNameURL={this.state.hostName}/>
                }                
            }
            /* 23373 fix end*/
        }
        const contentItem = get(mainContent, 'contentItem', '');

        const mainProductData = this.props.mainContent && this.props.mainContent.collectionProductInfo || {}
        // const fullCollectionData = this.props.mainContent;
        // const collectionProductList = fullCollectionData && fullCollectionData.productsInfo || {};
        // //const err = this.props.mainContent && this.props.mainContent.err || ""
        if (isEmpty(mainContent) || isEmpty(contentItem)) {
            return <NoProducts />
        }
        const redirectUrl = get(mainContent, 'contentItem.redirectURL', '');
        if (!isEmpty(redirectUrl)) {
            return <Loader className={'loader'}  domainNameURL={this.state.hostName}/>
        }
        const bodyContent = mainContent.contentItem &&
            mainContent.contentItem.contents &&
            mainContent.contentItem.contents[0] &&
            mainContent.contentItem.contents[0]['mainContent'] || {};
        let totalNumRecords = 0;
        !isEmpty(bodyContent) && map(bodyContent, (mainItem) => {
            if (mainItem['@type'] === 'ContentSlotMain') {
                const type = mainItem.contents && mainItem.contents[0] && mainItem.contents[0]['@type'] || '';
                if (type === 'ResultsList') {
                    totalNumRecords = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].totalNumRecs || totalNumRecords;
                }
            }
        });
        const staticLabelValues = this.state.staticLabelValues || {};
        //const staticLabels = get(mainContent, 'staticLabels.staticLabelValues[0].keyValues', {});        
        let CLPStaticLabel = {};
        let PLPStaticLabel = {};
        let BLPStaticLabel = {};
        if( staticLabelValues){
             map(staticLabelValues,(label,i)=>{
                 if(label.pageName ==='PWA-CLP-PAGE'){
                    CLPStaticLabel = label.keyValues;
                 }
                 if(label.pageName ==='PWA-PLP-PAGE'){
                    PLPStaticLabel = label.keyValues;
                 }
                 if(label.pageName ==='PWA-BLP-PAGE'){
                    BLPStaticLabel = label.keyValues;
                 }
             })
        }
        const flags = mainContent.flags;
        const pageType = mainContent.contentItem && mainContent.contentItem.contents && mainContent.contentItem.contents[0] && mainContent.contentItem.contents[0]["@type"] || '';
        const children = get(mainContent, 'contentItem.children', '');
        const childCategories = get(mainContent, 'contentItem.childCategories', '');

        if (totalNumRecords === 1) {
            return null;
        } else if (pageType === 'categoryLandingPage' && isEmpty(children) && isEmpty(childCategories)) {
            return <NoProducts />;
        } else {
            return (
                <React.Fragment>
                    <parentContext.Consumer>
                        {({ handleMobileMenu, headerData, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, searchbarClicked, handleSearchBarShow, handleSearchBarHide, departmentData, setDepartmentData, labelData, configurationData}) => (
                            <Header
                                loginDetails={loginDetails}
                                handleTypeheadHide={handleTypeheadHide}
                                handleTypeheadShow={handleTypeheadShow}
                                handleMobileMenu={handleMobileMenu}
                                showMobileMenu={showMobileMenu}
                                showTypehead={showTypehead}
                                pageName="twocolumnpage"
                                headerData={headerData}
                                labelData={labelData}
                                searchbarClicked={searchbarClicked}
                                handleSearchBarShow={handleSearchBarShow}
                                handleSearchBarHide={handleSearchBarHide}
                                mainContent={mainContent}
                                setDepartmentData={setDepartmentData}
                                departmentData={departmentData}
                                configurationData={configurationData}
                            />
                        )}
                    </parentContext.Consumer>
                    {
                        (pageType == "TwoColumnPage") ? <TechnicalSeo pageName="PLP" contentItem={mainContent} staticLabelValues={(typeof staticLabelValues !=='undefined')?staticLabelValues:mainContent.staticLabels} hostName={this.state.hostName} relativePath={this.state.relativePath} mouseFlag={(flags && !flags['mouseflag']) ? false : true} />
                            :
                            (pageType == "LPDynamicBrandLandingPage" || pageType == "LPStaticBrandLandingPage") ? <TechnicalSeo pageName="BLP" contentItem={mainContent} staticLabelValues={(typeof staticLabelValues !=='undefined')?staticLabelValues:mainContent.staticLabels} hostName={this.state.hostName} relativePath={this.state.relativePath} mouseFlag={(flags && !flags['mouseflag']) ? false : true} />
                                :
                                <TechnicalSeo pageName="CLP" contentItem={mainContent} staticLabelValues={(typeof staticLabelValues !=='undefined')?staticLabelValues:mainContent.staticLabels} hostName={this.state.hostName} relativePath={this.state.relativePath} mouseFlag={(flags && !flags['mouseflag']) ? false : true} />
                    }
                    {
                        (mainContent.err || donotLoadMainBody) ?
                            <ErrorPage message={mainContent.err|| " "} />
                            :
                            (pageType == "TwoColumnPage") ?
                                <parentContext.Consumer>
                                    {({ minPrice, maxPrice, setMinMaxPriceInPlp, onDropdownToggle, dropdownMenu, loginDetails, togglePlpListView, plpListView, limitedPiecesSkusData }) => (
                                       loginDetails.cartHeaderProcessCompleted &&  <PlpPage plpListView={plpListView} togglePlpListView={togglePlpListView} onDropdownToggle={onDropdownToggle} dropdownMenu={dropdownMenu} queryString={queryString} plpContent={mainContent} staticLabels={PLPStaticLabel} carouselsData={this.state.carouselsData} chanelBrandHTML={this.state.chanelBrandHTML} chanelBrandJSON={this.state.chanelBrandJSON} minPrice={minPrice} maxPrice={maxPrice} setMinMaxPriceInPlp={setMinMaxPriceInPlp} loginDetails={loginDetails} body={this.props.body} limitedPiecesSkusData={this.props.twoColumnData.limitedPiecesSkusData ? this.props.twoColumnData.limitedPiecesSkusData  : limitedPiecesSkusData} />
                                       //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                    )}
                                </parentContext.Consumer>
                                :
                                (pageType == "LPDynamicBrandLandingPage") ?
                                    <parentContext.Consumer>
                                        {({ loginDetails }) => (
                                            loginDetails.cartHeaderProcessCompleted && <BlpPage blpContent={mainContent} carouselsData={this.state.carouselsData} chanelBrandHTML={this.state.chanelBrandHTML} chanelBrandJSON={this.state.chanelBrandJSON} loginDetails={loginDetails} body={this.props.body} />
                                            //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                        )}
                                    </parentContext.Consumer>
                                    :
                                    (pageType == "LPStaticBrandLandingPage") ?
                                        <BlpStaticPage blpStaticContent={mainContent} pageType="LPStaticBrandLandingPage" chanelBrandHTML={this.state.chanelBrandHTML} chanelBrandJSON={this.state.chanelBrandJSON} />
                                        :
                                        (mainContent && mainContent.contentItem && mainContent.contentItem.children) ?
                                            <parentContext.Consumer>
                                                {({ loginDetails }) => (
                                                    loginDetails.cartHeaderProcessCompleted && <ClpPage clpContent={mainContent} carouselsData={this.state.carouselsData} staticLabels={CLPStaticLabel} loginDetails={loginDetails} />
                                                    //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                                )}
                                            </parentContext.Consumer>
                                            :
                                            <ErrorPage message="Data not available for this input. Please try again later." />
                    }
                    <parentContext.Consumer>
                        {({ loginDetails, showModal, setFooterData, snbfooterData }) => (
                            <React.Fragment>
                                <div className={showModal['showModal13'] ? 'modal-backdrop show' : ''}></div>
                                { loginDetails.cartHeaderProcessCompleted && 
                                <Footer setFooterData={setFooterData} snbfooterData={snbfooterData} loginDetails={loginDetails} /> 
                                //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                } 
                            </React.Fragment>
                        )}
                    </parentContext.Consumer>
                </React.Fragment>
            )
        }
    }
}

export default withRouter(TwoColumnPage);
