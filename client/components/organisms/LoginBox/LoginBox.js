
import React from 'react';
import Router from 'next/router';
import { Utility, getBrandName, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { H2 } from "../../atoms/HeadLines/Headlines";
// import BoxTitle from "../../molecules/BoxTitle/BoxTitle";
import Alert from "../../molecules/Alert/Alert";
import FormLogin from "../../molecules/FormLogin/FormLogin";
import { locale, localRegistrationUrl, PDPLoadScript } from '../../../../client/config/constants';
import isEmpty from 'lodash/isEmpty';

//import './LoginBox.styl'


export default class LoginBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      alert_status: false,
      alert_message: '',
      continueAsGuestBtn: false,
      staticMetaTags: '',
      cartToCheckoutCustomRoute: ''
    };
    this.checkedValue = true;
    this.PageNameForSessionExpire = ''
  }

  componentDidMount() {
    this.getStaticMetaTags();
    let cartToCheckoutCustomRoute = ''
    if (typeof window !== 'undefined') {
      window.PageName = 'Login';
      window.TRUNTO_KEY = this.props.getturntokey || '';
      window.locale = locale;
      window.localRegistrationUrl = localRegistrationUrl;
      cartToCheckoutCustomRoute = window.sessionStorage.getItem('cartToCheckoutCustomRoute')
    }

    const continueAsGuestBtn = (Router.router && (cartToCheckoutCustomRoute === '/tienda/checkoutShipping' || cartToCheckoutCustomRoute === '/tienda/checkoutBilling'))
    this.setState({ cartToCheckoutCustomRoute, continueAsGuestBtn });
    this.getAllPageEvent();
    this.PageNameForSessionExpire = Router && Router.router && Router.router.query && Router.router.query.pageName;
  }

  getAllPageEvent = () => {
    let logged = GetCookie('LoggedInSession')
    let payload = {
      "actPageTitle": document.title ? document.title : '',
      "loginStatus": logged ? 'Y' : 'N',
      "actURL": window.location.href,
      "userID": ''
    }
    GTMallPages(payload);
  }


  dismiss_alert = () => {
    this.setState({ alert_status: false })
  }

  show_alert = (alert_message) => {
    this.setState({ alert_status: true, alert_message });
    setTimeout(() => {
      this.setState({ alert_status: false });
    }, 3000)
  }
  // static label service
  getStaticMetaTags = async () => {

    let labelData = {};
    if (this.props.labelData && this.props.labelData.staticLabelValues && this.props.labelData.staticLabelValues) {
      labelData = this.props.labelData.staticLabelValues;
    } else {
      labelData = this.props.data && this.props.data.staticLabelValues && this.props.data.staticLabelValues.staticLabelValues
    }

    let staticMetaTags = labelData && labelData.filter(p => p.pageName == "pwa-loginPage");

    // let { staticMetaTags } = this.state;
    const pageName = "?pageName=pwa-loginPage";
    /*{
      "pageName": [
        "pwa-loginPage"
      ]
    }*/

    if (typeof staticMetaTags === 'undefined' || staticMetaTags.length === 0) {
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        staticMetaTags = response.data;
        this.setState({
          staticMetaTags
        });
      });
    } else {
      let _tdata = {};
      _tdata.staticLabelValues = staticMetaTags
      this.setState({
        staticMetaTags: _tdata
      });
    }

  }

  getPdpDynamicContent = () => {
    Utility(Path.getPdpDynamicContent, 'POST', {}).then(response => {
      parent.window.authToken = response.data.authToken
      TurnTo.localAuthenticationComplete();
    }, () => {
    })

  }

  onHandleChecked = (checkedValue) => {
    this.checkedValue = checkedValue;
  }


  handle_login_API = (login, password) => {
    let alredylogin = '';
    let brandName = 'LP'
    if (window) {
      brandName = getBrandName(window).brand
    }
    Utility(Path.login, 'POST', {
      login,
      password,
      "channel": "WEB",
      "brandName": brandName,
      "autoLoginCheckbox": this.checkedValue ? 'true' : 'false'
    }).then(response => {
      if (response.data && response.data.status && response.data.status.status === "failure") {
        //  GTM error catch
        dataLayer.push({
          'event': 'evLogin',  //variable estática
          'bool': "Error"  //variable estática
        });
        this.show_alert(response.data.status.errorMessage);
        this.show.visibiliyShow(); // for show hide login button
        this.show.clearData(); // for clear user name and password
        alredylogin = response.data.status.errorMessage;
        if (alredylogin.lastIndexOf('You are already logged in') != '-1') {
          if (typeof TurnTo !== "undefined" && typeof TurnTo.localAuthenticationComplete !== "undefined") {
            try {
              this.getPdpDynamicContent()

            } catch (e) { }
          }
        }
      } else if (response.status === 200 && response.data && response.data.status && response.data.status.status === "success") {
        let cartHeaderResponse = (this.props.loginDetails && this.props.loginDetails.cartHeaderResponse) || { cartHeaderDetails: {} };
        if (!cartHeaderResponse) cartHeaderResponse = {};
        if (!cartHeaderResponse.cartHeaderDetails) cartHeaderResponse.cartHeaderDetails = {}
        cartHeaderResponse.cartHeaderDetails.isLoggedIn = true;
        this.props.loginDetails.check_login_status(cartHeaderResponse);
        window.sessionStorage.removeItem('cartToCheckoutCustomRoute');
        dataLayer.push({
          event: 'evLogin',  //variable estática
          bool: 'Exito',  //variable estática
          loginStatus: 'Y',           //variable estática
          userID: response && response.data && response.data.gtmUserId || '',                      //CD 11
        });
        const redirectToChangePassword = response && response.data && response.data.redirectToChangePassword;
        window.sessionStorage.setItem('gtm', response && response.data && response.data.gtmUserId);
        if (response.data && response.data.redirectToChangePassword.toLowerCase() === 'yes') {         // for redirection to change password page
          Router.push("/tienda/users/changePassword?isredirect=true", "/tienda/users/changePassword?isredirect=true");
        } else if (Router && Router.router && Router.router.asPath === '/tienda/login') {  // after succesfull login redirect to home page
          // Router.push("/tienda/home");
          const { cartToCheckoutCustomRoute } = this.state;
          if (cartToCheckoutCustomRoute) {
            const onlyDigitalItems = window.sessionStorage.getItem('onlyDigitalItems');
            window.sessionStorage.removeItem('onlyDigitalItems');
            if(onlyDigitalItems === 'true'){
              Router.push('/tienda/checkoutBilling');
            }else{
              Router.push(cartToCheckoutCustomRoute);
            }
          } else if (window.sessionStorage.getItem('orderHistory')){ //start of 23705
             window.sessionStorage.removeItem('orderHistory')
            Router.push('/tienda/users/orderHistory'); // end of 23705
          }else if (window) {                       
            window.history.back();
          }
        } else if (this.PageNameForSessionExpire != undefined) {
          if (this.PageNameForSessionExpire == 'airtimeTicket') {
            Router.push('/tienda/checkout/airtimeTicket');
          } else if(this.PageNameForSessionExpire === 'cart') {
            Router.push('/tienda/cart');
          } else {
            Router.push('/tienda/users/' + this.PageNameForSessionExpire);
          }
        }
        this.show.visibiliyShow();
        if (typeof TurnTo !== "undefined" && typeof TurnTo.localAuthenticationComplete !== "undefined") {
          try {
            this.getPdpDynamicContent()
          } catch (e) { }


        }

      }
    }, (error) => {
      console.error("Error ==== :: ", error);
    });
  }

  buyWithOutRegistration = () => {
    const { cartToCheckoutCustomRoute } = this.state;
    if (cartToCheckoutCustomRoute) {
      Router.push(cartToCheckoutCustomRoute);
    }
  }

  render() {
    const { alert_status, alert_message, continueAsGuestBtn, staticMetaTags } = this.state;
    const staticLabels = staticMetaTags && staticMetaTags.staticLabelValues && staticMetaTags.staticLabelValues[0] && staticMetaTags.staticLabelValues[0].keyValues;
    // this.checkedValue = staticLabels ? staticLabels['pwa.loginPage.checkboxOnAutoLogin.text'] : ''
    return (
      <div className="o-box mt-0 mb-0 my-lg-5" id="loginPage">
        <div className="m-box-title d-none d-lg-block">
          <div className="d-flex justify-content-start align-items-center">
            <H2 headLineText={staticLabels ? staticLabels['pwa.loginPage.loginNew.label'] : "INICIA SESIÓN"} className="m-0 a-box-title--login"></H2>
          </div>
        </div>
        <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
        {(!isEmpty(staticLabels)) &&

          <FormLogin loginDetails={this.props.loginDetails} domainName={this.props.domainName} show_alert={this.show_alert} handle_login_API={this.handle_login_API} continueAsGuestBtn={continueAsGuestBtn} buyWithOutRegistration={this.buyWithOutRegistration} staticLabels={staticLabels} onHandleChecked={this.onHandleChecked} ref={show => this.show = show} />

        }
      </div>
    )
  }

}
