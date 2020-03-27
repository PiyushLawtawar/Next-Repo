import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import ParentProvider from '../client/contexts/parentContext';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { PDPLoadScript,locale, localRegistrationUrl } from '../client/config/constants';
import { getAssetsPath } from '../client/helpers/utilities/utility';

let manifestData = "";

class LiverpoolApp extends App {
  constructor(props) {
    super(props);
    let flags = {
      "chatbotflag": false,
      "turntoflag": true,
      "swogoflag": true,
      "mouseflag": true,
      "gtmflag": true
    };
    if (props.router.query && props.router.query.data) {
      if (props.router.query.data.homePageContent && props.router.query.data.homePageContent.flags) {
        flags = props.router.query.data.homePageContent.flags;//home page
      }
      if (props.router.query.data.mainContent && props.router.query.data.mainContent.flags) {
        flags = props.router.query.data.mainContent.flags;//PDP page or PLP or CLP or BLp
      }
    }
    this.state = {
      hostName: '',
      manifestJson: '',
      enableChatbotFlag: flags['chatbotflag'],
      enableTurntoFlag: flags['turntoflag'],
      enableSwogoFlag: flags['swogoflag'],
      enableMouseFlowFlag: flags['mouseflag'],
      enableGtmFlag: flags['gtmflag'],
      avoidChatBoxRoutes: [
        '/tienda/checkoutShipping',
        '/tienda/checkoutBilling',
        '/tienda/checkoutPromotion',
        '/tienda/users/invoiceRequest',
        '/tienda/users/invoiceConfirmation',
      ],
      loadScriptFlag: false
    }
  }

  loadScript = () => {
    let Sctipt = document.createElement('script');
    Sctipt.type = "text/javascript";
    Sctipt.className += 'external_script';
    let AssetsPath = getAssetsPath(undefined, window.location.hostname, undefined);
    Sctipt.src = AssetsPath + PDPLoadScript
    document.body.appendChild(Sctipt);
  }
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

  componentDidMount = () => {
    if (!isEmpty(this.props.router) && !isEmpty(this.props.router.query.data) && !isEmpty(this.props.router.query.data.pathToModule)) {
      this.setState({ hostName: window.location.hostname, manifestJson: this.props.router.query.data.pathToModule });
      window.ChartBotFlag = this.state.enableChatbotFlag || '';
      //#rating issue in PRODUCTION
      let turntoId ="";
      if(this.props.router.query.data){
        //wap PDP of setting id
        if(this.props.router.query.data.turntokeys){
          turntoId = this.props.router.query.data.turntokeys;
          window.PageName = 'PDP';
        }
        //WEB PDP
        if(this.props.router.query.data.mainContent && this.props.router.query.data.mainContent.turntokey){
          turntoId = this.props.router.query.data.mainContent.turntokey;
          window.PageName = 'PDP';
        }
        //login
        if(this.props.router.query.data.turntokey){
          turntoId = this.props.router.query.data.turntokey;
          window.PageName = 'Login';
        }
      }
      //console.log("app ------",turntoId)
      window.TRUNTO_KEY = turntoId;
      //#rating issue in PRODUCTION
      window.localRegistrationUrl =localRegistrationUrl;
      window.locale =locale;
      let pagename = this.props.router.pathname || '';
      const { avoidChatBoxRoutes } = this.state;
      if (this.state.enableTurntoFlag) {
        if (pagename != '' && (pagename.lastIndexOf("turntomobile") == -1) && avoidChatBoxRoutes.indexOf(pagename) === -1) {
          this.loadScript();
        }
      }
    }

    // const gtmAllPage = (data) => {
    //   var loginStatus = 'N'
    //   let LoggedInSession = this.props.router.query.data && this.props.router.query.data.loginData && this.props.router.query.data.loginData.cartHeaderDetails && this.props.router.query.data.loginData.cartHeaderDetails.LoggedInSession || false;
    //   if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
    //     LoggedInSession = false;
    //   }
    //   if (LoggedInSession) {
    //     loginStatus = 'Y'
    //   }
    //   let profileID = this.props.router.query.data && this.props.router.query.data.loginData && this.props.router.query.data.loginData.cartHeaderDetails && this.props.router.query.data.loginData.cartHeaderDetails.profileId || '';
    //   var ClientID = this.getCookies("_ga") && this.getCookies("_ga").substring(6) || '';
    //   var userID = this.getCookies("DYN_USER_ID") || profileID;
    //   const location = document.location.href;
    //   const titale = document.title;

    //   dataLayer.push({
    //     event: 'vPageView',                 //Static Data
    //     loginStatus: loginStatus,            //Dynamic Data
    //     actURL: location,                    //Dynamic Data
    //     actPageTitle: titale,              //Dynamic Data
    //     userID: userID || '',
    //     clientID: ClientID || ''
    //   })
    // }
    // if (this.state.enableGtmFlag) {
    //   gtmAllPage(this)
    // }
  }

  loadGTM = (AssetsPath) => {
    if (this.state.loadScriptFlag === false) {
      this.setState({
        loadScriptFlag: true
      });
      return (
        this.state.enableGtmFlag || (typeof this.state.enableGtmFlag === 'undefined') ?
          <script src={AssetsPath+"/static/js/gtm-script.js"}></script> : ''
      )
    }
  }

  render() {
    const { Component, router, pageProps } = this.props;
    pageProps.flags = { ...this.state };
    let { hostName } = this.state;
    if (!isEmpty(router.query.data && router.query.data.hostname)) {
      hostName = router.query.data && router.query.data.hostname;
    }
    let clientProcess = {};

    Object.keys(process.env).filter(envItem => {
      if (envItem === "APP_HOST" || envItem === 'NODE_ENV' || envItem === 'ENVIRONMENT' || envItem.indexOf('GTM') > -1 || envItem.indexOf('EDD_DA') > -1 || envItem.indexOf('STATICASSETS') > -1) {
        clientProcess[envItem] = process.env[envItem]
      }
    }
    )


    let cssfileName = '';
    let favicon = '';
    let manifestpath = '';
    let mouseflowURL ='';
    //let AssetsPath = getAssetsPath(undefined, hostName, process)
    let AssetsPath = getAssetsPath(( typeof window !=='undefined' ?window :undefined), hostName, process)
    
    if (hostName && hostName.indexOf('williams-sonoma.com.mx') !== -1) {
      cssfileName = 'williamssonoma';
      favicon = AssetsPath + '/static/images/icons/favicon_WS.ico';
      manifestpath = AssetsPath +'/static/manifest/manifest-ws.json';
      mouseflowURL = (process && process.env && process.env.MOUSEFLOW_URL_WS)||'';
    }
    else if (hostName && hostName.indexOf('potterybarn.com.mx') !== -1) {
      cssfileName = 'potterybarn';
      favicon = AssetsPath + '/static/images/icons/favicon_PB.ico';
      manifestpath = AssetsPath +'/static/manifest/manifest-pb.json';
      mouseflowURL = (process && process.env && process.env.MOUSEFLOW_URL_PB)||'';
    }
    else if (hostName && hostName.indexOf('potterybarnkids.com.mx') !== -1) {
      cssfileName = 'potterybarnkids';
      favicon = AssetsPath + '/static/images/icons/favicon_pbk.ico';
      manifestpath = AssetsPath +'/static/manifest/manifest-pbk.json';
      mouseflowURL = (process && process.env && process.env.MOUSEFLOW_URL_PBK)||'';
    }
    else if (hostName && hostName.indexOf('pbteen.com.mx') !== -1) {
      cssfileName = 'pbteen';
      favicon = AssetsPath + '/static/images/icons/favicon_pbt.ico';
      manifestpath = AssetsPath + '/static/manifest/manifest-pbt.json';
      mouseflowURL = (process && process.env && process.env.MOUSEFLOW_URL_PBT)||'';
    }
    else if (hostName && hostName.indexOf('westelm.com.mx') !== -1) {
      cssfileName = 'westelm';
      favicon = AssetsPath + '/static/images/icons/favicon_elm.ico';
      manifestpath = AssetsPath + '/static/manifest/manifest-we.json';
      mouseflowURL = (process && process.env && process.env.MOUSEFLOW_URL_WLM)||'';
    }
    else {
      cssfileName = 'liverpool';
      favicon = AssetsPath + '/static/images/icons/favicon.ico';
      manifestpath = AssetsPath +'/static/manifest/manifest-lp.json';
      mouseflowURL = (process && process.env && process.env.MOUSEFLOW_URL_LP)||'//cdn.mouseflow.com/projects/ab2c90eb-0ce8-4da9-87ed-971baf81bd44.js';
    }
    //let e = require('../.next/custom-manifest.json')
    let manifestObj = (router && router.query && router.query.data && router.query.data.pathToModule) || (this.state.manifestJson && !isEmpty(this.state.manifestJson) && this.state.manifestJson)
    return (
      <Container>
        <Head>
          <link rel="shortcut icon" href={favicon} type="image/x-icon" />
          <link rel="stylesheet" as="style" type="text/css" href={AssetsPath +"/static/css/bootstrap.css"} />
          {/* <link rel="preload" as="style" type="text/css" href="/static/css/owl.css" onload="this.rel='stylesheet'" /> */}
          <link rel="stylesheet" type="text/css" href={AssetsPath +"/static/css/material-components-web.min.css"} />
          {/*<link rel="stylesheet" as="style" type="text/css" href={`/views/${manifestObj[`client/styles/${cssfileName}.css`]}`} />*/}
          <link rel="stylesheet" as="style" type="text/css" href={`${AssetsPath}/_next/${manifestObj[`client/styles/${cssfileName}.css`]}`} />
          <input type="hidden" id="envVar" value={JSON.stringify(clientProcess)} />
          <link rel="manifest" href={manifestpath} />
          {this.loadGTM(AssetsPath)}
          {/*this.state.enableMouseFlowFlag ?
            <script defer type="text/javascript" src="//cdn.mouseflow.com/projects/ab2c90eb-0ce8-4da9-87ed-971baf81bd44.js"></script> : '' */}
            {this.state.enableMouseFlowFlag ?
            <script defer type="text/javascript" src={mouseflowURL}></script> : '' }
        </Head>
        <ParentProvider domainName={cssfileName} hostName={hostName} router={this.props.router}>
          <Component {...pageProps} />
        </ParentProvider>

        <script src={AssetsPath +"/static/js/babel-polyfill.min.js"}></script>
      </Container>
    );
  }
}

export default withRouter(LiverpoolApp);
