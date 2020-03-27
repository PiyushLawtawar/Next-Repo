import React from 'react';
import Router from 'next/router';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { parentContext } from '../../../contexts/parentContext';
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import { H1 } from '../../atoms/HeadLines/Headlines';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";

import OrganismInvoiceTabs from '../../organisms/Billing/organism-billing';

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceSuccessErrorMsg: '',
      alert_status: '',
      alert_message: '',
      buttonDisabled: false,
      showTrackingNumber: '',
      labelsData: ''
    }
  }

  multipleClicksAvoid = (val) => {
    this.setState({ buttonDisabled: val })
  }
  componentDidMount() {
    // this.getAllPageEvent();
    this.staticLabels();
    const trackingNumber = document.location.search.split('=')
    this.setState({ showTrackingNumber: trackingNumber && trackingNumber[1] })
    const e = document.getElementById("nds-chat-launcher-container");
    if (e) {
      e.style.display = 'none';
    }

  }
  // getAllPageEvent = () => {
  //     let logged = GetCookie('LoggedInSession')
  //     let payload = {
  //         "actPageTitle": document.title ? document.title : '',
  //         "loginStatus": logged ? 'Y' : 'N',
  //         "actURL": window.location.href,
  //         "userID": ''
  //     }
  //     GTMallPages(payload);
  // }
  invoiceSubmit = (payload) => {
    try {
      Utility(Path.invoiceRequest, 'POST', payload).then(response => {
        this.multipleClicksAvoid(true);
        if (response.data && response.data.s !== undefined && response.data.s === "0") {
          this.setState({ invoiceSuccessErrorMsg: response.data.successMsg })
          localStorage.setItem('myDataKey', this.state.invoiceSuccessErrorMsg);
          // this.requestButton.style.visibility = "hidden"
          Router.push('/tienda/users/invoiceConfirmation' + '?trackingNumber=' + this.state.showTrackingNumber)
        } else if (response.data && response.data.s === "1" && response.data && response.data.errorMessages) {
          // this.multipleClicksAvoid(false);
          if (response.data.errorMessages.error) {
            this.setState({ invoiceSuccessErrorMsg: (<div dangerouslySetInnerHTML={{ __html: response.data.errorMessages.error }} />) })
          } else if (response.data.errorMessages.trackingNumber) {
            this.setState({ invoiceSuccessErrorMsg: response.data.errorMessages.trackingNumber })
          } else if (response.data.errorMessages.rfc3 || response.data.errorMessages.rfc2) {
            this.setState({ invoiceSuccessErrorMsg: response.data.errorMessages.rfc3 ? response.data.errorMessages.rfc3 : '' + response.data.errorMessages.rfc2 ? response.data.errorMessages.rfc2 : '' })
          } else if (response.data.errorMessages.rfc2 || response.data.errorMessages.rfc1) {
            this.setState({ invoiceSuccessErrorMsg: response.data.errorMessages.rfc2 ? response.data.errorMessages.rfc2 : '' + response.data.errorMessages.rfc1 ? response.data.errorMessages.rfc1 : '' })
          } else if (response.data.errorMessages.rfc1 || response.data.errorMessages.rfc3) {
            this.setState({ invoiceSuccessErrorMsg: response.data.errorMessages.rfc1 ? response.data.errorMessages.rfc1 : '' + response.data.errorMessages.rfc3 ? response.data.errorMessages.rfc3 : '' })
          }
          this.show_alert(this.state.invoiceSuccessErrorMsg);
          this.scrollUp();

        }
      }, );
    } catch (e) {
      console.error(e, "error");
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
  scrollUp = () => {
    window.scrollTo(0, 0);
  }
  staticLabels = () => {
    let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-createInvoicePage");
    const pageName = "?pageName=pwa-createInvoicePage";

    if (typeof labels === 'undefined' || labels.length === 0) {
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues && response.data.staticLabelValues[0].keyValues;
        this.setState({
          labelsData: labels
        })
      }, (error) => {
      });
    } else {
      let _tdata = labels && labels[0].keyValues;
      this.setState({
        labelsData: _tdata
      });
    }
  }
  render() {

    const staticLabels = this.state.labelsData;

    // console.log('fffffffffffaa', staticLabels)
    const { alert_status, alert_message } = this.state;
    let breadcrumbInfo = {
      label: staticLabels && staticLabels["pwa.createInvoiceForm.invoiceRequest.label"],
      breadcrumbData: [
        {
          "navigationState": staticLabels && staticLabels["pwa.orderConfirmationPage.ElectronicInvoiceLink.text"],
          "label": staticLabels && staticLabels["pwa.createInvoiceForm.invoice.label"]
        }

      ],
      Invoice: true
    };
    var error = {
      type: '-alert',
      text: 'La factura no pudo ser generada. Por favor, inténtalo más tarde. (key)',
      class: 'a-alert__text',
      iconType: 'a-alert__icon icon-error'
    }

    var options = {
      classBtns: 'o-invoiceOptionContainer',
      Idbtn1: 'personTypeBtn',
      Idbtn2: 'foreignBtn',
      Idbtn3: 'ownershipBtn',
      classContainers: 'o-invoice__tabs',
      classContainer1: 'o-invoiceOptionContainer__selector--selected',
      classContainer2: 'o-invoiceOptionContainer__selector',
      classContainer3: 'o-invoiceOptionContainer__selector',
      spanText1: 'Persona Física o Moral',
      spanClass1: 'a-invoiceOptionContainer__optionText--selected',
      spanText2: 'Extranjero',
      spanClass2: 'a-invoiceOptionContainer__optionText',
      spanText3: 'Acreditar propiedad',
      spanClass3: 'a-invoiceOptionContainer__optionText',
      classTooltips: 'a-invoiceOptionContainer__tooltip',
      classGeneralCol: 'o-invoice__tabs--horizontal'
    }
    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, invoiceTrackingNumber, handleMobileMenu, showMobileMenu, selectInvoiceTab, showTypehead, handleTypeheadShow, handleTypeheadHide, showCreditPropertyFields, showPhysicalOrMoralPersonFields, showForeignFields, invoiceConfirmationData, invoiceResponseCon, setFooterData, snbfooterData, departmentData }) => (
          <React.Fragment>
            <Header
              loginDetails={loginDetails}
              handleTypeheadHide={handleTypeheadHide}
              handleTypeheadShow={handleTypeheadShow}
              handleMobileMenu={handleMobileMenu}
              showMobileMenu={showMobileMenu}
              showTypehead={showTypehead}
              headerData={headerData}
              departmentData={departmentData}
              pageName="myAccount"
            />
            <div>
              <div>
                <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
              </div>
            </div>
            <main>
              <div id="BoxTitleMobile" className="">
                <BoxTitle texto="Solicitud de factura" icon={false} className="m-0 a-box-title--login" />
              </div>
              <div className="o-content__columnCenter--fluid container-fluid p-0 d-none d-lg-block">
                <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
              </div>
              <div className="container p-0 mt-lg-3">
                <H1 className="a-myAccount-aside--title d-none d-lg-block" headLineText='Solicitud de factura' />
              </div>
              <div className="o-container__columnCenter container d-lg-flex justify-content-center p-0">
                <div className="o-main-content col-12 col-lg-11 col-xl-9 d-lg-flex justify-content-center t-billing__main">
                  <OrganismInvoiceTabs invoiceTrackingNumber={invoiceTrackingNumber} showTrackingNumber={this.state.showTrackingNumber} staticLabels={staticLabels} options={options} invoiceSubmit={this.invoiceSubmit} successInvoiceRequest={this.successInvoiceRequest} selectInvoiceTab={selectInvoiceTab} showCreditPropertyFields={showCreditPropertyFields} showPhysicalOrMoralPersonFields={showPhysicalOrMoralPersonFields} showForeignFields={showForeignFields} invoiceConfirmationData={invoiceConfirmationData} invoiceResponseCon={invoiceResponseCon} />
                </div>
              </div>
            </main>
            <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
          </React.Fragment>
        )}
      </parentContext.Consumer>
    )
  }
}
export default Billing; 