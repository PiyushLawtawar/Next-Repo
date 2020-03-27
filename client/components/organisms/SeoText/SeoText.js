/**
 * Module Name : SEO Module
 * Functionality : SEO implimentation on each page. This Component will help for reder SEO in pages. This is get called from /Header/Header.js & /CheckoutStep4/Header.js
 * @see : {https://docs.google.com/document/d/1tv6T6qBsRssI-tV1fnWkqwzsHIZN48SsROCYqFe0VF4/edit}
 * @exports : SeoText
 * @requires : module:React
 * @requires : module:react-helmet
 * @requires : module:helpers/utilities/utility#Utility
 * @requires : module:helpers/config/config#Path
 * @requires : module:lodash/isEmpty
 * Team : My Account Team 
 * Other information : htmlSEOBigText is from staticLabels ==> pageName = PWA-META-TAGS-PAGE ==> pwa.seo.header.generic.metatags.bigtext
 * 
 */

import React from 'react';
import { Helmet } from 'react-helmet';
// import Head from 'next/head';
import isEmpty from 'lodash/isEmpty';
// import map from 'lodash/map';
//import './SeoText.styl';
// const utilities = require('../../../helpers/utilities/utility')
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
const { parse } = require("url");


/**
 * This are component level global values and will accessible  in all methods
 * 
 */
let _myMainPageName = ''
let _myPageTitle = ''
let _displayName = '';
let _FinalTitle = '';
let _rootCategory = ''
let _ImageName = '';
let _lognDescription = '';
let lastRecNum = 0;
let totalNumRecs = 0;
let firstRecNum = 0;
let recsPerPage = 0;
let currentPageNumber = 0;
let categoryId = '';
let categoryURLDisplayName = '';
let mainCategoryId = '';
let paginationURL = null;
let metaCategroey = {}
let dominName = '';

/**
 * @class SeoText
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class SeoText extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageName: this.props.pageName,
      mainPageName: this.props.mainPageName,
      staticMetaTags: this.props.labelData,
      configuration: {},
      categoryName: this.props.categoryName,
      mainContent: this.props.mainContent,
      searchKeyword: this.props.searchKeyword,
      router: this.props.router,

      // mainCategoryId: '',
    };
  }

  /**
   * Create string html element  To html Component
   * @function _helmetToComponent
   * @author mvaity@zensar.com
   * @desc this function is use to convert html string in to meta tag html array.
   * @param {string} str 
   * @returns meta tag html array.
   * 
   */
  _helmetToComponent(str) {
    let Components = [];
    if (!str.length) {
      return;
    }


    try {

      _myPageTitle = '';
      _rootCategory = '';
      _FinalTitle = '';
      _lognDescription = '';
      const mainContent = this.props.mainContent;
      // console.log("MainContent fdfgf", mainContent);
      const mainPageName = this.state.mainPageName;
      _myMainPageName = mainPageName;
      const checkUndefined = this.props.mainContent && this.props.mainContent.recommendation && this.props.mainContent.recommendation && this.props.mainContent.recommendation.contents && this.props.mainContent.recommendation.contents[0] || '';
      // /LPDynamicBrandLandingPage

      const domainNameURL = (typeof this.props.domainNameURL !== 'undefined' && this.props.domainNameURL.length > 0) ? this.props.domainNameURL : '';
      dominName = this.getDomainName(domainNameURL);

      // console.log('mainPageName', mainPageName);

      if (mainPageName === 'pdp') {
        if (this.props.mainContent && this.props.mainContent.endecaProductInfo && this.props.mainContent.endecaProductInfo.contents[0] && this.props.mainContent.endecaProductInfo.contents[0].mainContent && this.props.mainContent.pdpType !== "hybrid") {
          const pDetails = this.props.mainContent.endecaProductInfo.contents[0].mainContent.filter(p => p.name === "Product Detail")[0];
          _displayName = pDetails && pDetails.record.productDisplayName && pDetails.record.productDisplayName[0] || '';
          _ImageName = pDetails && pDetails.record["product.largeImage"] && pDetails.record["product.largeImage"][0] || pDetails.record["sku.largeImage"] && pDetails.record["sku.largeImage"][0] || '';
          _lognDescription = pDetails && pDetails.record && pDetails.record["product.longDescription"] && pDetails.record["product.longDescription"][0] || '';
          // console.log('_lognDescription', _lognDescription);
        } else if (this.props.mainContent && this.props.mainContent.endecaProductInfo && this.props.mainContent.endecaProductInfo.contents[0] && this.props.mainContent.endecaProductInfo.contents[0].mainContent && this.props.mainContent.pdpType == "hybrid") {
          const pDetails = this.props.mainContent.endecaProductInfo.contents[0].mainContent.filter(p => p.name === "Product Detail")[0];
          _displayName = pDetails && pDetails.record && pDetails.record.records && pDetails.record.records[0] && pDetails.record.records[0].attributes && pDetails.record.records[0].attributes["product.displayName"] && pDetails.record.records[0].attributes["product.displayName"][0] || ''
          _ImageName = pDetails && pDetails.record && pDetails.record.records && pDetails.record.records[0] && pDetails.record.records[0].attributes && pDetails.record.records[0].attributes["product.largeImage"] && pDetails.record.records[0].attributes["product.largeImage"][0] || ''
          _lognDescription = pDetails && pDetails.record && pDetails.record.records && pDetails.record.records[0] && pDetails.record.records[0].attributes && pDetails.record.records[0].attributes["product.longDescription"] && pDetails.record.records[0].attributes["product.longDescription"][0] || ''
          // console.log('_lognDescription', _lognDescription);
        } else if (this.props.mainContent && this.props.mainContent.collectionProductInfo) {
          const pDetails = this.props.mainContent.collectionProductInfo
          _displayName = pDetails && pDetails["product.displayName"] && pDetails["product.displayName"][0] || '';
          _ImageName = pDetails && pDetails["product.largeImage"] && pDetails["product.largeImage"][0] || pDetails["sku.largeImage"] && pDetails["sku.largeImage"][0] || '';
          _lognDescription = pDetails && pDetails["product.longDescription"] && pDetails["product.longDescription"][0] || '';
        } else if (this.props.mainContent && this.props.mainContent.sellerName) { // seller page
          _displayName = this.props.mainContent.sellerName;
          _lognDescription = this.props.mainContent.sellerDesc ? this.props.mainContent.sellerDesc : "";
          _ImageName = "";

        } else if (checkUndefined) {
          const pDetails = []
          if (checkUndefined.name === 'Articulos del vendedor') {
            let checkUndefinedRecords = checkUndefined.records;
            for (var i = 0; i < checkUndefinedRecords.length; i++) {
              // console.log('checkUndefinedRecords', checkUndefinedRecords[i].attributes)
              _displayName = checkUndefinedRecords[i].attributes['product.displayName'][0] || '';
              _ImageName = checkUndefinedRecords[i].attributes['product.largeImage'][0] || checkUndefinedRecords[i].attributes['sku.largeImage'][0] || '';
              _lognDescription = checkUndefinedRecords[i].attributes['product.longDescription'][0] || '';
            }
          };

        } else {
          // console.log("Product details not found ", mainContent);
        }
      } else if (mainPageName === 'twocolumnpage') {
        if (this.props.mainContent && this.props.mainContent.contentItem && this.props.mainContent.contentItem.contents && this.props.mainContent.contentItem.contents["0"].secondaryContent && this.props.mainContent.contentItem.contents["0"]["@type"] != "Two-Column Page") {
          let _contents = this.props.mainContent.contentItem.contents[0];
          let pDetails = _contents && _contents.secondaryContent && _contents.secondaryContent.filter(p => p.name === "Breadcrumbs")[0];
          _lognDescription = _contents && _contents.metaDescription || ''
          if (pDetails && pDetails.searchCrumbs && pDetails.searchCrumbs[0] && pDetails.searchCrumbs[0].terms) {
            _displayName = pDetails.searchCrumbs[0].terms;
          } else if (pDetails && pDetails.refinementCrumbs && pDetails.refinementCrumbs[0] && pDetails.refinementCrumbs[0].properties) {
            _rootCategory = pDetails.refinementCrumbs[0].ancestors && pDetails.refinementCrumbs[0].ancestors[0] && pDetails.refinementCrumbs[0].ancestors[0].label || ''
            // _lognDescription = pDetails.refinementCrumbs[0].properties["category.longDescription"] || '';
            const pName = typeof window !== 'undefined' ? window.location.pathname.replace('/tienda/', '') : '';
            categoryId = pDetails.refinementCrumbs[0].properties["category.repositoryId"] || decodeURI(pName) || '';
            mainCategoryId = categoryId;
            categoryURLDisplayName = decodeURI(pDetails.refinementCrumbs[0].properties["category.displayName"] || '');
            metaCategroey = this.state.configuration && this.state.configuration.configuration && this.state.configuration.configuration.metadetails.seoInformation[categoryId];

            _displayName = metaCategroey && metaCategroey.title || pDetails.refinementCrumbs[0].properties["category.displayName"] || '';  // /* Change done for RTC 23336 */ 
            _lognDescription = metaCategroey && metaCategroey.description || pDetails.refinementCrumbs[0].properties["category.longDescription"] || '';

            _FinalTitle = metaCategroey && metaCategroey.title || '';  // /* Change done for RTC 23336 */ 

          }

          let _tempPageName = typeof window !== 'undefined' ? window.location.href.split("?") : this.state.router ? this.state.router.asPath.split("?") : [];
          if (_tempPageName.length > 1 && !_tempPageName.find(p => p.indexOf('s=') >= 0)) {
            let queryString = _tempPageName[1];
            try {
              let queryObj = JSON.parse('{"' + queryString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
              _displayName = queryObj.s || _displayName;
            } catch (ex) {

            }
          }
          //const _temp = this.props.mainContent.contentItem.contents[0].mainContent.length - 1 ;
          let resultList = null;
          this.props.mainContent.contentItem.contents[0].mainContent.map((item) => {
            if (item['name'] === 'Results List Collection') {
              resultList = item;
            }
          })

          _ImageName = this.props.mainContent.contentItem.imageUrl || '';
          // firstRecNum = this.props.mainContent.contentItem.contents[0].mainContent[_temp].contents[0].firstRecNum;
          //lastRecNum = this.props.mainContent.contentItem.contents[0].mainContent[_temp].contents[0].lastRecNum;
          //totalNumRecs = this.props.mainContent.contentItem.contents[0].mainContent[_temp].contents[0].totalNumRecs;
          //recsPerPage = this.props.mainContent.contentItem.contents[0].mainContent[_temp].contents[0].recsPerPage;
          if (resultList) {
            firstRecNum = resultList.contents[0].firstRecNum;
            lastRecNum = resultList.contents[0].lastRecNum;
            totalNumRecs = resultList.contents[0].totalNumRecs;
            recsPerPage = resultList.contents[0].recsPerPage;
            let array = resultList.contents[0].pagingActionTemplate.navigationState.split("/");
            let array1 = resultList.contents[0].pagingActionTemplate.navigationState.split("?");
            categoryURLDisplayName = decodeURI(array[1]);
            paginationURL = array1[0];
          }

        } else if (this.props.mainContent && this.props.mainContent.contentItem && this.props.mainContent.contentItem.contents && (this.props.mainContent.contentItem.contents["0"]["@type"] === "categoryLandingPage" || this.props.mainContent.contentItem.contents["0"]["@type"] === "LPDynamicBrandLandingPage")) {
          let _contents = this.props.mainContent.contentItem
          _lognDescription = _contents && _contents.metaDescription || ''
          // let _contents = this.props.mainContent.contentItem.contents[0];
          let _pDetails = _contents && _contents.secondaryContent && _contents.secondaryContent.filter(p => p.name === "Breadcrumbs")[0];
          let _tempDetails = _pDetails && _pDetails.refinementCrumbs && _pDetails.refinementCrumbs[0] && _pDetails.refinementCrumbs[0].properties["category.displayName"] || ''
          _displayName = this.props.mainContent.contentItem.categoryName || _tempDetails || '';

          _lognDescription = _pDetails && _pDetails.refinementCrumbs && _pDetails.refinementCrumbs[0] && _pDetails.refinementCrumbs[0].properties["category.longDescription"] || this.props.mainContent.contentItem.longDescription || '';

          let _tempPageName = typeof window !== 'undefined' ? window.location.href.split("?") : [];
          if (_tempPageName.length > 1) {
            let queryString = _tempPageName[1];
            try {
              let queryObj = JSON.parse('{"' + queryString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
              _displayName = queryObj.s || _displayName;
            } catch (ex) {

            }

          }

          _tempPageName = typeof window !== 'undefined' ? window.location.href : '';
          _ImageName = this.props.mainContent.contentItem.imageUrl || '';
          // const pName = window.location.pathname.replace('/tienda/', '');
          categoryId = this.props.mainContent.contentItem.categoryId || _tempPageName.substr(_tempPageName.lastIndexOf("/") + 1)
          metaCategroey = this.state.configuration && this.state.configuration.configuration && this.state.configuration.configuration.metadetails.seoInformation[categoryId];
          _displayName = metaCategroey && metaCategroey.title || _displayName || '';
          _lognDescription = _lognDescription || metaCategroey && metaCategroey.description || '';
        }
      } else if (mainPageName === 'homepage') {
        const _pageName = this.props.router && this.props.router.asPath ? this.props.router.asPath : window.location.href;
        _displayName = '';
        if (_pageName.indexOf('users/orderDetails') >= 0) {
          _displayName = 'Detalle de compra ' + dominName;
          _FinalTitle = _displayName
          /* Change done for RTC 23747 :Start */
        } else {
          const pName = typeof window !== 'undefined' ? window.location.pathname.replace('/tienda/', '') : '';
          metaCategroey = this.state.configuration && this.state.configuration.configuration && this.state.configuration.configuration.metadetails.seoInformation[pName];
          _displayName = metaCategroey && metaCategroey.title || '';
          _lognDescription = metaCategroey && metaCategroey.description || '';
          _FinalTitle = _displayName;
        }
        /* Change done for RTC 23747 :Start */
      } else if (mainPageName === 'AccountLandingPage' || mainPageName === 'myAccount') {
        _lognDescription = '';
        const _pageName = this.props.router && this.props.router.asPath ? this.props.router.asPath : window.location.href;
        _displayName = 'Mi cuenta ' + dominName;
        if (_pageName.indexOf('/users/orderHistory') >= 0) {
          _displayName = 'Mis pedidos ' + dominName;
        } else if (_pageName.indexOf('/checkout/airtimeTicket') >= 0) {
          /* Change done for RTC 23747 :Start */
          // _displayName = 'Recarga tiempo aire ' + dominName;
          const pName = typeof window !== 'undefined' ? window.location.pathname.replace('/tienda/', '') : '';
          metaCategroey = this.state.configuration && this.state.configuration.configuration && this.state.configuration.configuration.metadetails.seoInformation[pName];
          _displayName = metaCategroey && metaCategroey.title || 'Recarga tiempo aire ';
          _displayName = _displayName + ' ' + dominName
          _lognDescription = metaCategroey && metaCategroey.description || '';
          _FinalTitle = _displayName;
          /* Change done for RTC 23747 :End */

        } else if (_pageName.indexOf('/users/creditCards') >= 0) {
          _displayName = 'Mis tarjetas ' + dominName;
        }

        _FinalTitle = _displayName
      } else if (mainPageName === 'cartPage') {
        _displayName = 'Mi bolsa ' + dominName;
        _FinalTitle = _displayName
      } else {
        const pName = typeof window !== 'undefined' ? window.location.pathname.replace('/tienda/', '') : '';
        metaCategroey = this.state.configuration && this.state.configuration.configuration && this.state.configuration.configuration.metadetails.seoInformation[pName];
        _displayName = metaCategroey && metaCategroey.title || '';
        _lognDescription = metaCategroey && metaCategroey.description || '';
      }
      if (typeof window !== "undefined") {
        document.querySelector(".a-header__logo").alt = dominName + ' Logo'
        document.querySelector(".a-header__logo").title = dominName + ' Logo'
      }

    } catch (ex) {
      console.error("error in mainContent..........", ex);
    }

    str = str.replace(/\r/g, '\n')   // Replace \r with \n 
    str.split(/\n/).forEach((node, i) => {
      // extrapolate node type
      let nodeType = str.match(/[a-z]+/)[0];
      let _meta = [];

      _meta.push('key');
      _meta.push(i);

      node = node.replace(/ =/g, '=').replace(/= /g, '=');
      let nodeMatch = node.match(/([a-z\-]+=".*?")/g);
      nodeMatch && nodeMatch.forEach((attr) => {
        let matches = attr.match(/([a-z\-]+)="(.*?)"/);
        _meta.push(matches[1]);
        _meta.push(matches[2]);
      });

      let abc = ''
      // create and save the component
      if (_meta.length > 2) {
        let meta
        // console.log(_meta[2].toLowerCase() + " " + JSON.stringify(_meta));
        /* Change done for RTC 23727 :Start */
        if (_meta[2].toLowerCase() === 'property') {
          meta = <meta property={_meta[3]} content={_meta[5]} />
        } else if (_meta[2].toLowerCase() === 'name') {
          meta = <meta name={_meta[3]} content={_meta[5]} />
        } else if (_meta[2].toLowerCase() === 'http-equiv') {
          meta = <meta http-equiv={_meta[3]} content={_meta[5]} />
        } else if (_meta[2].toLowerCase() === 'src') {
          meta = <script src={_meta[3]} />
        } else if (_meta.length === 6 && _meta[2].toLowerCase() === 'rel' && _meta[4].toLowerCase() === 'href') {
          meta = <link rel={_meta[3]} href={_meta[5]} />
        } else if (_meta.length === 8 && _meta[2].toLowerCase() === 'rel' && _meta[4].toLowerCase() === 'href' && _meta[6].toLowerCase() === 'type') {
          // meta = <link rel={_meta[3]}  href={_meta[5]} type={_meta[7]}/>
        } else if (_meta.length === 8 && _meta[2].toLowerCase() === 'rel' && _meta[6].toLowerCase() === 'href' && _meta[4].toLowerCase() === 'sizes') {
          meta = <link rel={_meta[3]} sizes={_meta[5]} href={_meta[7]} />
        } else if (_meta.length === 8 && _meta[2].toLowerCase() === 'rel' && _meta[4].toLowerCase() === 'href' && _meta[6].toLowerCase() === 'sizes') {
          meta = <link rel={_meta[3]} sizes={_meta[7]} href={_meta[4]} />
        } else if (_meta.length === 8 && _meta[2].toLowerCase() === 'href' && _meta[4].toLowerCase() === 'media' && _meta[6].toLowerCase() === 'rel') {
          meta = <link rel={_meta[7]} media={_meta[5]} href={_meta[3]} />
        }
        /* Change done for RTC 23727 :End */
        Components.push(meta);
      }
    });
    return Components;
  }

  /**
   * REACT life cycle Event. This will get fire when ever component Will Receive Props
   * @event componentWillReceiveProps 
   * @param {*} nextProps 
   * @param {*} nextState 
   */
  componentWillReceiveProps(nextProps, nextState) {
    // if (!(JSON.stringify(nextProps.mainContent) === JSON.stringify(this.state.mainContent) && JSON.stringify(this.state.router) === JSON.stringify(nextProps.router))) {
    if (!JSON.stringify(this.state.router) === JSON.stringify(nextProps.router)) {
      this.loadMetaTags();
    }
  }
  // // // Do not use this event....
  // static getDerivedStateFromProps(nextProps, prevState) {
  //     //
  //     // console.log('I am hereeeeeeeeeeeeeeee getDerivedStateFromProps');

  // }

  /**
   * REACT life cycle event
   * @event componentDidMount 
   * 
   */

  componentDidMount() {
    if (typeof window !== "undefined") {
      try {
        const domainNameURL = (typeof this.props.domainNameURL !== 'undefined' && this.props.domainNameURL.length > 0) ? this.props.domainNameURL : '';
        const dominName = this.getDomainName(domainNameURL);

        // document.querySelector(".a-header__logo").alt = dominName + ' Logo'
        // document.querySelector(".a-header__logo").title = dominName + ' Logo'

        let bodyMetaTags = document.getElementsByTagName('body')[0].querySelectorAll('[data-react-helmet]')
        for (var i = bodyMetaTags.length - 1; i >= 0; i--) {
          bodyMetaTags[i].remove()
        }
        bodyMetaTags = document.getElementsByTagName('body')[0].querySelectorAll('[type="application/ld+json"]')
        for (var i = bodyMetaTags.length - 1; i >= 0; i--) {
          bodyMetaTags[i].remove()
        }

        document.title === '' ? document.title = '  ' : document.title

        var target = document.querySelector('head > title');
        var observer = new window.WebKitMutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            // console.log('new title:', mutation.target.textContent);
            if (document.title === '' && _myMainPageName === 'pdp') {
              document.title = _myPageTitle;
            }
          });
        });
        observer.observe(target, { subtree: true, characterData: true, childList: true })


      } catch (e) { }
    }

    this.loadMetaTags();
  }

  /**
   * load Meta Tags
   * @author mvaity@zensar.com
   * @function loadMetaTags
   * @desc This function will get static keys information &  configuration Data from PROPS and if data is not avaialbe in PROPS call service.
   * Also set data in state
   * @returns 
   */
  async loadMetaTags() {
    const pageName = "?pageName=PWA-META-TAGS-PAGE";
    const { configurationData, setConfigurationData } = this.props;
    /* let categoryId = null;
     if (this.state.mainPageName === 'twocolumnpage') {
       let array = (window.location.href).split('/');
       if (array && array.length && array.length > 0) {
         categoryId = array[array.length - 1]
         categoryId = (categoryId.indexOf('?') ? categoryId.split('?')[0] : categoryId)
       }
       if (this.state.mainCategoryId && categoryId && categoryId.indexOf('cat') > -1 && categoryId.indexOf("N-") >= -1 && categoryId.indexOf("page") >= -1
         && categoryId === this.state.mainCategoryId) {
         categoryId = this.state.mainCategoryId;
       }
     }*/
    let LoginStatusCheck = this.state && this.state.staticMetaTags && this.state.staticMetaTags.staticLabelValues;
    if (!LoginStatusCheck) {
      // console.log("Static Meta Data ===>", this.props.labelData);
      let staticMetaLabelData = this.props.labelData; // await Utility(Path.staticLabelsFetch + pageName, 'GET' /*, { pageName: ['PWA-META-TAGS-PAGE'] }*/);
      const staticLabels = (this.props.labelData && this.props.labelData.staticLabelValues) ? this.props.labelData.staticLabelValues.filter(function (currentValue) { return (currentValue.pageName === 'PWA-META-TAGS-PAGE') }) : null;
      // mainBody.staticLabels = {'staticLabelValues':staticLabels};

      if (isEmpty(staticMetaLabelData)) {
        staticMetaLabelData = await Utility(Path.staticLabelsFetch + pageName, 'GET' /*, { pageName: ['PWA-META-TAGS-PAGE'] }*/);
      }
      // const staticMetaLabelData = this.props.labelData;
      if (!staticMetaLabelData.staticLabelValues) {
        staticMetaLabelData.staticLabelValues = staticMetaLabelData;
      }
      this.setState({
        staticMetaTags: staticMetaLabelData,
        // mainCategoryId: categoryId
      });
      // console.log('staticMetaLabelData', staticMetaLabelData);
    }
    if (isEmpty(configurationData)) {
      const configuration = await Utility(Path.fetchConfiguration, 'GET');
      setConfigurationData(configuration.data);
      this.setState({
        configuration: configuration.data
      });
    } else {
      this.setState({ configuration: configurationData });
    }

  }
  /**
   * update Metatags in HTML
   * @author mvaity@zensar.com
   * @function updateMetatags
   * @desc this function will update meta tags in HTML with help of REACT Helmat
   * @param {string} htmlMetaTags 
   * @returns meta tag Array
   */
  updateMetatags(htmlMetaTags) {
    try {

      const pageName = this.state.pageName || 'home';
      const mainPageName = this.state.mainPageName;

      const staticPagePath = '/tienda/paginas/'
      let robotsIngnorList = ['/tienda/checkout', '/tienda/users', '/tienda/login', '/tienda/checkoutOrderConfirmation'];

      let htmlSEOBigText = "";

      if (htmlMetaTags && htmlMetaTags.staticLabelValues && htmlMetaTags.staticLabelValues[0] && htmlMetaTags.staticLabelValues[0].keyValues) {
        htmlSEOBigText = htmlMetaTags.staticLabelValues[0].keyValues["pwa.seo.header.generic.metatags.bigtext"] || "";
      }



      let meta = this._helmetToComponent(htmlSEOBigText);
      const router = this.props.router;
      if (htmlMetaTags && htmlMetaTags.staticLabelValues && router) {
        const pageURL = router && router.asPath ? router.asPath : window.location.href;
        let otherMetaTags = []
        let isRobotoNoIndex = false;
        let isStaticPage = false;

        let ogIMG = htmlMetaTags && htmlMetaTags.staticLabelValues && htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.OG.default.image"] || '';
        let pageTitle = htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.home.title"];
        let ogCallProduct = htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.OG.Call.Product"];

        let searchTitle = htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.plp.Search.title"] || '';
        let searchPLPTitle = htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.plp.title"] || '';
        let plpDescription = htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.plp.description"] || '';
        let pPageName = router && router.asPath ? decodeURI(router.asPath) : decodeURI(window.location.href);
        let nPageName = router && router.asPath ? decodeURI(router.asPath) : decodeURI(window.location.href);
        let cPageName = router && router.asPath ? decodeURI(router.asPath) : decodeURI(window.location.href);



        // console.log(pageURL);

        if (pageURL.indexOf(staticPagePath) >= 0) {
          isStaticPage = true;
        }

        robotsIngnorList.forEach(pName => {
          if (pageURL.indexOf(pName) >= 0) {
            isRobotoNoIndex = true
          }
        })

        if (isRobotoNoIndex) {
          otherMetaTags.push(<meta key={otherMetaTags.length} name="Robots" content="NOINDEX,NOFOLLOW"></meta>)
        } else if (isStaticPage) {
          otherMetaTags.push(<meta key={otherMetaTags.length} name="Robots" content="NOINDEX"></meta>)
        } else {
          otherMetaTags.push(<meta key={otherMetaTags.length} name="Robots" content="INDEX,FOLLOW"></meta>)
        }

        let _tPageName = router.asPath ? decodeURI(router.asPath) : decodeURI(window.location.href);
        _tPageName = ((typeof this.props.domainNameURL !== 'undefined' && this.props.domainNameURL.length > 0) ? ("https://" + this.props.domainNameURL) : '') + _tPageName;
        let _tPageNameUrl = _tPageName.split('tienda')
        let _tPageUrl = this.props.mainContent && this.props.mainContent.contentItem && this.props.mainContent.contentItem.contents && this.props.mainContent.contentItem.contents[0] && this.props.mainContent.contentItem.contents[0].secondaryContent && this.props.mainContent.contentItem.contents[0].secondaryContent[0] && this.props.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs && this.props.mainContent.contentItem.contents[0].secondaryContent[0].refinementCrumbs[0]
        otherMetaTags.push(<meta key={otherMetaTags.length} name="apple-mobile-web-app-status-bar-style" content="#4285f4" />)
        otherMetaTags.push(<meta key={otherMetaTags.length} name="apple-mobile-web-app-capable" content="yes" />)

        if (_ImageName.length > 0) {
          ogIMG = _ImageName;
        }

        if (ogIMG.indexOf('//') === 0) {
          ogIMG = typeof window !== "undefined" ? window.location.protocol + ogIMG : 'https' + ogIMG; /// Add http protocol if missing in string
        }

        if (_displayName.length > 0) {
          pageTitle = _displayName;
        }
        let tSearch = this.props && this.props.mainContent && this.props.mainContent.contentItem && this.props.mainContent.contentItem.contents[0] && this.props.mainContent.contentItem.contents[0].mainContent && this.props.mainContent.contentItem.contents[0].mainContent.find(p => p["@type"] === "SearchAdjustments");
        tSearch = tSearch && tSearch.originalTerms && tSearch.originalTerms && tSearch.originalTerms[0] || '';
        if (mainPageName === 'twocolumnpage' && this.props.mainContent && this.props.mainContent.contentItem && this.props.mainContent.contentItem.contents && this.props.mainContent.contentItem.contents[0]['@type'] === 'TwoColumnPage') {

          pageTitle = searchTitle.replace('{CURRENTSEARCH.DISPLAY_NAME}', _displayName);
          if (_rootCategory && _rootCategory.length >= 1) {
            pageTitle = searchPLPTitle.replace('{`CATEGORY.FIRST_LEVEL.DISPLAY_NAME`}', _rootCategory).replace('{CATEGORY.DISPLAY_NAME}', _displayName)
          }

          if (tSearch.length > 0) {  /// for search Title
            const searchlognDescription = 'Compra {Search_term} en ' + dominName + '. Envío Gratis - Click & Collect - Garantía'
            _lognDescription = searchlognDescription.replace('{Search_term}', _displayName);
          }

          // Prev & Next URL logic 
          let currentPage = 1;
          let queryString = null;
          let showPLP = false;
          if (cPageName.split("?")[1]) {
            queryString = "?" + cPageName.split("?")[1];
          }
          if (queryString && queryString.indexOf('showPLP') > -1) {
            showPLP = true;
          }

          let totalPages = Math.ceil(totalNumRecs / recsPerPage);
          let paginationFullURL = _tPageNameUrl && _tPageNameUrl[0] + "tienda" + paginationURL + "/page-";
          if (queryString && !showPLP) {
            paginationFullURL = _tPageNameUrl && _tPageNameUrl[0] + "tienda";
          }

          if (recsPerPage < totalNumRecs) {
            if (queryString && !showPLP) {
              if (currentPage == 1) {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="canonical" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda" + queryString}></link>);
              } else {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="canonical" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/page-" + currentPage + queryString}></link>);
              }

            } else {
              otherMetaTags.push(<link key={otherMetaTags.length} rel="canonical" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/" + categoryURLDisplayName + "/" + mainCategoryId + (showPLP ? queryString : '')}></link>);
            }
          } else {
            if (queryString && !showPLP) {
              otherMetaTags.push(<link key={otherMetaTags.length} rel="canonical" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda" + queryString}></link>);
            } else {
              otherMetaTags.push(<link key={otherMetaTags.length} rel="canonical" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/" + categoryURLDisplayName + "/" + mainCategoryId + (showPLP ? queryString : '')}></link>);
            }
          }
          if (!(firstRecNum === 1 && lastRecNum === totalNumRecs)) {
            if (firstRecNum === 1) {
              if (queryString && !showPLP) {

                otherMetaTags.push(<link key={otherMetaTags.length} rel="next" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/page-2" + queryString}></link>);
              } else {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="next" href={paginationFullURL + '2' + (showPLP ? queryString : '')} />);
              }

            } else if (lastRecNum === totalNumRecs) {
              currentPage = totalPages - 1;
              if (queryString && !showPLP) {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="prev" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/page-" + (totalPages - 1) + queryString}></link>);
              } else {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="prev" href={paginationFullURL + (totalPages - 1) + (showPLP ? queryString : '')} />);
              }
            } else {

              let currentPage = Math.ceil(firstRecNum / recsPerPage);
              if (queryString && !showPLP) {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="prev" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/page-" + (currentPage - 1) + queryString}></link>);
                otherMetaTags.push(<link key={otherMetaTags.length} rel="next" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/page-" + (currentPage + 1) + queryString}></link>);
              } else {
                otherMetaTags.push(<link key={otherMetaTags.length} rel="prev" href={paginationFullURL + (currentPage - 1) + (showPLP ? queryString : '')} />);
                otherMetaTags.push(<link key={otherMetaTags.length} rel="next" href={paginationFullURL + (currentPage + 1) + (showPLP ? queryString : '')} />);
              }
            }

          }

          /*if (recsPerPage < totalNumRecs) {
            if (cPageName.toLocaleLowerCase().indexOf('page-') < 0) { // first page
              let queryString = cPageName.split("?")[1]
              if (queryString) {
                queryString = "?" + cPageName.split("?")[1]
              } else {
                queryString = '';
              }
              nPageName = cPageName.split("?")[0] + '/page-2' + queryString;
              _tPageName = cPageName.split("?")[0] + queryString;
            } else if (cPageName.toLocaleLowerCase().indexOf('page-') >= 0) { // second page
              let _pageName = cPageName.split("?")[0];
              currentPageNumber = parseInt(_pageName.substr(_pageName.lastIndexOf("/") + 6));
              // let currentPageNumber = Math.ceil(lastRecNum / recsPerPage)
              nPageName = cPageName.replace('page-' + currentPageNumber, 'page-' + (currentPageNumber + 1));
              pPageName = cPageName.replace('page-' + currentPageNumber, 'page-' + (currentPageNumber - 1));
              _tPageName = cPageName.replace('page-' + currentPageNumber, '');
              _tPageName = _tPageName.replace('/?', '?');
            }

            // Prev & Next URL logic
            //  cPageName = 
            if (currentPageNumber > 1 && lastRecNum <= totalNumRecs) {
              otherMetaTags.push(<link rel="prev" href={pPageName} />);
            }
            if (lastRecNum < totalNumRecs) {
              otherMetaTags.push(<link rel="next" href={nPageName} />);
            }
            if (_tPageUrl && _tPageUrl.properties && _tPageUrl.properties["category.displayName"]) {
              _tPageName = _tPageNameUrl && _tPageNameUrl[0] + "tienda/" + _tPageUrl.properties["category.displayName"] + "/" + _tPageUrl.properties["category.repositoryId"];
            }
            // otherMetaTags.push(<link rel="canonical" href={_tPageNameUrl && _tPageNameUrl[0] + "tienda/" + _tPageUrl.properties["category.displayName"] + "/" + _tPageUrl.properties["category.repositoryId"]}></link>);
            // Prev & Next URL logic End 
          }*/
        } else {
          otherMetaTags.push(<link key={otherMetaTags.length} rel="canonical" href={decodeURI(_tPageName)}></link>);
        }


        // otherMetaTags.push(<meta key={otherMetaTags.length} property="og:url" content={router.asPath ? decodeURI(router.asPath) : decodeURI(window.location.href)}></meta>);
        otherMetaTags.push(<meta key={otherMetaTags.length} property="og:url" content={_tPageName}></meta>);
        otherMetaTags.push(<meta key={otherMetaTags.length} property="og:image" content={ogIMG}></meta>)
        otherMetaTags.push(<meta key={otherMetaTags.length} property="og:title" content={pageTitle}></meta>)

        otherMetaTags.push(<meta key={otherMetaTags.length} property="twitter:image:alt" content={pageTitle}></meta>);
        otherMetaTags.push(<meta key={otherMetaTags.length} property="twitter:image" content={ogIMG}></meta>)
        otherMetaTags.push(<meta key={otherMetaTags.length} property="twitter:title" content={pageTitle}></meta>)

        if (_lognDescription.length > 0) {
          _lognDescription = _lognDescription.replace(/<\/?[^>]+(>|$)/g, "");
        } else {
          // _lognDescription = ''; // when endeca or BCC do not have description value then put empty, business told not to take from static key
          _lognDescription = htmlMetaTags && htmlMetaTags.staticLabelValues && htmlMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.home.description"] || '';

        }
        otherMetaTags.push(<meta key={otherMetaTags.length} name="description" content={_lognDescription}></meta>)
        otherMetaTags.push(<meta key={otherMetaTags.length} property="og:description" content={ogCallProduct + ' ' + _lognDescription}></meta>)
        otherMetaTags.push(<meta key={otherMetaTags.length} property="twitter:description" content={ogCallProduct + ' ' + _lognDescription}></meta>)
        if (meta) {
          meta = [...meta, ...otherMetaTags]
        }
      }
      return (meta);

      // meta = [...meta,
      // ...[
      // ]]
      // meta = [...meta]
    } catch (ex) {
      console.error('Error in SEO.................', ex)
      return undefined;
    }
  }

  /**
  * update Meta tags
  * @author mvaity@zensar.com
  * @function _updateMetatags
  * @desc update meta tags, This function is no more in use.
  * @param {string} htmlMetaTags 
  * @returns meta tag Array
  */
  async _updateMetatags(htmlMetaTags) {
    const pageName = this.state.pageName || 'home';

    let htmlSEOBigText = "";
    if (htmlMetaTags && htmlMetaTags.staticLabelValues && htmlMetaTags.staticLabelValues[0] && htmlMetaTags.staticLabelValues[0].keyValues) {
      htmlSEOBigText = htmlMetaTags.staticLabelValues[0].keyValues["pwa.seo.header.generic.metatags.bigtext"] || "";
    }

    let _meta = htmlSEOBigText;
    // meta = [...meta,
    // ...[
    // ]]
    // meta = [...meta]

    return (_meta);
  }

  /**
     * get Domain Name
     * @function getDomainName
     * @author mvaity@zensar.com
     * @desc This will give domain from URL.
     * @param {string} domainURL 
     * @returns string
     */
  getDomainName = (domainURL) => {
    const URL = domainURL.toLowerCase() || "";
    let domainName = 'Liverpool'

    if (URL) {

      switch (true) {
        case URL.indexOf('williams-sonoma.com.mx') >= 0:
          domainName = 'Williams Sonoma';
          break;
        case URL.indexOf('potterybarn.com.mx') >= 0:
          domainName = 'Pottery Barn';
          break;
        case URL.indexOf('potterybarnkids.com.mx') >= 0:
          domainName = 'Pottery Barn Kids';
          break;
        case URL.indexOf('pbteen.com.mx') >= 0:
          domainName = 'Pottery Barn Teen';
          break;
        case URL.indexOf('westelm.com.mx') >= 0:
          domainName = 'West Elm';
          break;
        default:
          domainName = 'Liverpool';
      }
      return domainName;
    } else {
      return domainName;
    }
  }

  /**
   * default render method to render html in REACT
   * @returns REACT HTML
   */
  render() {
    const categoryName = this.state.extraTag || '';
    // const staticMetaTags = this.state.staticMetaTags || this.props.labelData;
    const staticMetaTags = this.state && this.state.staticMetaTags && this.state.staticMetaTags.data || this.props.labelData;   // Enjoy data structures change  :) :)  
    const pageName = this.state.pageName || 'home';
    const meta = this.updateMetatags(staticMetaTags);
    // const meta = this._updateMetatags(staticMetaTags);

    let pageTitle = ''
    if (staticMetaTags && staticMetaTags.staticLabelValues && staticMetaTags.staticLabelValues[0] && staticMetaTags.staticLabelValues[0].keyValues) {

      if (pageName === 'home') {
        pageTitle = staticMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.home.title"];
      }

      if (_displayName.length > 0) {
        const _t = staticMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.pdp.title"];
        pageTitle = _t && _t.replace('{PRODUCT.DISPLAY_NAME}', _displayName) || ''

        if (_rootCategory.length >= 1) {
          let searchPLPTitle = staticMetaTags.staticLabelValues[0].keyValues["Liverpool.SEO.plp.title"] || '';
          pageTitle = searchPLPTitle.replace('{`CATEGORY.FIRST_LEVEL.DISPLAY_NAME`}', _rootCategory).replace('{CATEGORY.DISPLAY_NAME}', _displayName)
        }
      }

      // let tSearch = this.props && this.props.mainContent && this.props.mainContent.contentItem && this.props.mainContent.contentItem.contents[0] && this.props.mainContent.contentItem.contents[0].mainContent && this.props.mainContent.contentItem.contents[0].mainContent.find(p => p["@type"] === "SearchAdjustments");
      // tSearch = tSearch && tSearch.originalTerms && tSearch.originalTerms && tSearch.originalTerms[0] || '';
      // if (tSearch.length > 0) {  /// for search Title
      //   let searchTitle = 'Compra {Search_term} en Liverpool. Envío Gratis - Click & Collect - Garantía'
      //   pageTitle = searchTitle.replace('{Search_term}', _displayName);
      // }
      if (_FinalTitle.trim().length > 0) {
        pageTitle = _FinalTitle;
      }
      if (typeof window === 'undefined') {
        // pageTitle = ''; //  // RTC 23539 hotfix
      }
    }
    pageTitle = pageTitle && pageTitle.replace(/<[^>]*>?/gm, ' ') || '';   /* Change done for RTC 23809 :Start */
    _myPageTitle = pageTitle;

    return (
      <div className="row">
        <Helmet>
          <title>{pageTitle}</title>
          {meta}
        </Helmet>
      </div>

    )
  }
}

SeoText.defaultProps = {
  setConfigurationData: () => { },
  configurationData: {}
}

export default SeoText; 