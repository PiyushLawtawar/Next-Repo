


import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from    './../../../helpers/config/config';
import Router from 'next/router';
import Alert from "../../molecules/Alert/Alert";
import { H2 } from "../../atoms/HeadLines/Headlines";
import Icons from "../../atoms/Icons/Icons";
import MoleculeformRecovery from "../../molecules/FormRecovery/moleculeformRecovery"


class RecoveryPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_message: '',
      mailSend: false,
      statusResponse: '',
      staticMetaTags: ''
    };
  }

  componentDidMount() {
    this.getStaticMetaTags();
    this.getGTMdata()
  }

  getGTMdata = () => {
    var siteName = this.getCookies("ActiveDataCenterCookie");
    try {
    dataLayer.push({
      category: "Cuenta",
      dimension8: "Forgot Password",
      siteName: siteName
    });
  } catch(e){}
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

  dismiss_alert = () => {
    this.setState({ alert_status: false })
  }

  show_alert = (alert_message) => {
    this.setState({ alert_status: true, alert_message });
    setTimeout(() => {
     this.setState({ alert_status: false });
    }, 3000)
  }

  resetPassword = (emailId) => {
      const payload = {
        "email": emailId
      }
      Utility(Path.resetPassword, 'POST', payload).then(response => {
        if (response.data && response.data.err) {
          this.show_alert(response.data.err);
          this.show.visibiliyShow();
        }
        if (response.data && response.data.status && response.data.status.status === "failure") {
        } else if (response.status === 200) {
          if (response.data && response.data.s !== undefined && response.data.s === "0") {
            Router.push('/tienda/emailSend?emailID=' + emailId);
            this.show.visibiliyShow();
          }
        }
      }, (error) => {
      });
  }

  getStaticMetaTags = async () => {
    let { staticMetaTags } = this.state;
    let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-forgotPasswordPage");
    const pageName ="?pageName=pwa-forgotPasswordPage";

    if (typeof labels === 'undefined' || labels.length === 0) {
    Utility(Path.staticLabelsFetch+pageName, 'GET').then(response => {
      labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
      this.setState({
        staticMetaTags: labels
      });
    });
  } else {
    // console.log()
    let _tdata = labels && labels[0].keyValues;
    this.setState({
      staticMetaTags: _tdata
    });
  }
  }

  render() {

    const { alert_status, alert_message, staticMetaTags } = this.state;
    const staticLabels = staticMetaTags;

    var alertRecovery = {
      type: '-alert',
      text: 'No encontramos tu correo, por favor intenta con otro',
      class: 'a-alert__text'
    }
    return (

      <main className="o-main">
        <div className="o-content__columnCenter--fluid container-fluid p-0">
          <div className="o-content__columnCenter container p-0 d-lg-flex justify-content-center align-items-center">
            <div className="o-main-content col-12 col-lg-4 p-0 p-lg-3 d-lg-flex justify-content-center align-items-center mt-lg-4">
              <div className="o-box mt-0 mb-0 my-lg-5">
                <div className="m-box-title d-none d-lg-block -recoveryPassword">
                  <div className="d-flex justify-content-start align-items-center">
                    <Icons className="a-login-backIcon" href="" style={{ cursor: 'pointer'}} onClick={() => Router.push('/tienda/login')}/>
                    <H2 className="m-0 a-box-title--login" headLineText={staticLabels && staticLabels['pwa.forgotPassword.Recuperar.label']}>
                    </H2>
                  </div>
                </div>
                <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar recovery-password -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                {(!isEmpty(staticLabels)) &&
                  <MoleculeformRecovery show_alert={this.show_alert} resetPassword={this.resetPassword} staticLabels={staticLabels} ref={sh => this.show = sh} />
                }
              </div>
            </div>
          </div>
        </div>
      </main>

    )

  }
}

export default RecoveryPassword;






