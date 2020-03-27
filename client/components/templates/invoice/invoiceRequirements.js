import React from 'react';
import Router from 'next/router';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { parentContext } from '../../../contexts/parentContext';
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import { H1 } from '../../atoms/HeadLines/Headlines';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";

import OrganismCreateInvoice from '../../organisms/Billing/organism-billing-requirements';

class createInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createInvoiceResponce: '',
      labelsData: ''
    }
  }

  multipleClicksAvoid = (val) => {
    this.setState({ buttonDisabled: val })
  }
  componentDidMount() {
    this.getConfiguration();
    this.staticLabels();
    const e = document.getElementById("nds-chat-launcher-container");
    if (e) {
      e.style.display = 'none';
    }

  }
  getConfiguration = async () => {
    //  change for getConfigration service Calls : Start
    let response = {};
    response.data = this.props.configurationData;
    if (typeof response.data === 'undefined') {
      response = await Utility(Path.getConfiguration, 'POST');  //.then(response => {
    }
    if (response && response.data) {
      let invoice = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration
      this.setState({
        createInvoiceResponce: invoice,
      });
      // this.props.invoiceResponseCon(this.state.invoiceResponce);
      // console.log("invoice=============>>>>>>>>>>>>>>", invoice);
    }

    // });
    //  change for getConfigration service Calls : End
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
  scrollUp = () => {
    window.scrollTo(0, 0);
  }
  staticLabels = () => {
    const pageName = "?pageName=pwa-createInvoicePage";
    Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
      let labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues && response.data.staticLabelValues[0].keyValues;
      this.setState({
        labelsData: labels
      })
    }, (error) => {
    });
  }
  render() {
    const staticLabels = this.state.labelsData;
    //console.log('fffffffffffaa', this.state.createInvoiceResponce)
    const { alert_status, alert_message } = this.state;
    let breadcrumbInfo = {
      label: "Solicitud de factura",
      breadcrumbData: [
        {
          "navigationState": staticLabels && staticLabels["pwa.orderConfirmationPage.ElectronicInvoiceLink.text"],
          "label": staticLabels && staticLabels["pwa.createInvoiceForm.invoice.label"]
        }
      ],
      isMyAccount: true
    };
    var success = {
      type: '-success',
      text: 'Tu factura se encuentra en proceso de envío en las siguientes 72 hrs al correo que proporcionaste.',
      class: 'a-alert__text',
      iconType: 'a-alert__icon icon-done'
    }
    var options = {
      type: 'person'
    }
    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, selectInvoiceTab, showTypehead, handleTypeheadShow, handleTypeheadHide, showCreditPropertyFields, showPhysicalOrMoralPersonFields, showForeignFields, invoiceConfirmationData, invoiceResponseCon }) => (
          <React.Fragment>
            <Header
              loginDetails={loginDetails}
              handleTypeheadHide={handleTypeheadHide}
              handleTypeheadShow={handleTypeheadShow}
              handleMobileMenu={handleMobileMenu}
              showMobileMenu={showMobileMenu}
              showTypehead={showTypehead}
              headerData={headerData}
              pageName="inVoiceCreate"
            />
            <div>
              <div>
                <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -succes" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
              </div>
            </div>
            <main>
              <div id="BoxTitleMobile" className=".o-box">
                <BoxTitle texto="Facturación electrónica" icon={false} className="m-0 a-box-title--login" />
              </div>
              <div className="o-content__columnCenter--fluid container-fluid p-0 d-none d-lg-block">
                <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
              </div>
              <div className="container p-0 mt-lg-3">
                <H1 id="invoiceTitle" className="a-myAccount-aside--title d-none d-lg-block" headLineText='Facturación electrónica' />
              </div>
              <div className="o-container__columnCenter container d-lg-flex justify-content-center p-0">
                <div className="o-main-content col-12 col-lg-11 col-xl-9 d-lg-flex justify-content-center t-billing__main">
                  <OrganismCreateInvoice staticLabels={staticLabels} options={options} invoiceSubmit={this.invoiceSubmit} successInvoiceRequest={this.successInvoiceRequest} selectInvoiceTab={selectInvoiceTab} showCreditPropertyFields={showCreditPropertyFields} showPhysicalOrMoralPersonFields={showPhysicalOrMoralPersonFields} showForeignFields={showForeignFields} invoiceConfirmationData={invoiceConfirmationData} invoiceResponseCon={invoiceResponseCon} />
                </div>
              </div>
            </main>
            <Footer loginDetails={loginDetails} />
          </React.Fragment>
        )}
      </parentContext.Consumer>
    )
  }
}
export default createInvoice;