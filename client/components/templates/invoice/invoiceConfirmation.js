import Header from '../../organisms/Header/Header';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Alert from "../../molecules/Alert/Alert";
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import { parentContext } from '../../../contexts/parentContext';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Footer from '../headerFooter/headerFooter';
import BillingConfirmation from '../../organisms/Billing/organism-billing-confirmation';

class BillingConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceSuccessErrorMsg: '',
      alert_status: '',
      alert_message: '',
      labelsData: ''
    }
  }
  componentDidMount() {
    // this.getAllPageEvent();
    this.staticLabels();
    var data = localStorage.getItem('myDataKey');
    this.show_alert(data)
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
    const staticLabels = this.state.labelsData
    //console.log('staticLabelsstaticLabels', staticLabels)
    const { alert_status, alert_message } = this.state;
    // let breadcrumbInfo = {
    //   label: ,
    //   breadcrumbData: {}
    // };

    let breadcrumbInfo = {
      label: "confirmación de factura",
      breadcrumbData: [
        {
          "navigationState": staticLabels && staticLabels["pwa.orderConfirmationPage.ElectronicInvoiceLink.text"],
          "label": staticLabels && staticLabels["pwa.createInvoiceForm.invoice.label"]
        }
      ],
      Invoice: true
    };
    const success = {
      type: '-success',
      text: 'Tu factura se encuentra en proceso de envío en las siguientes 72 hrs al correo que proporcionaste.',
      class: 'a-alert__text',
      iconType: 'a-alert__icon icon-done'
    }
    const options = {
      type: 'person'
    }
    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, invoiceTrackingNumberData, showMobileMenu, selectInvoiceTab, showTypehead, handleTypeheadShow, handleTypeheadHide, showCreditPropertyFields, showPhysicalOrMoralPersonFields, showForeignFields, invoiceSubmitData, invoiceResponse }) => (
          <React.Fragment>
            <Header
              loginDetails={loginDetails}
              handleTypeheadHide={handleTypeheadHide}
              handleTypeheadShow={handleTypeheadShow}
              handleMobileMenu={handleMobileMenu}
              showMobileMenu={showMobileMenu}
              showTypehead={showTypehead}
              headerData={headerData}
              pageName="homepage"
            />
            <div>
              <div>
                <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -success" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
              </div>
            </div>
            <main>

              <div className="o-content__columnCenter--fluid container-fluid p-0 d-none d-lg-block">
                <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
              </div>
              <div className="o-container__columnCenter container d-lg-flex justify-content-center p-0">

                <BillingConfirmation staticLabels={staticLabels} options={options} invoiceTrackingNumberData={invoiceTrackingNumberData} invoiceResponse={invoiceResponse} invoiceSubmitData={invoiceSubmitData} selectInvoiceTab={selectInvoiceTab} showCreditPropertyFields={showCreditPropertyFields} showPhysicalOrMoralPersonFields={showPhysicalOrMoralPersonFields} showForeignFields={showForeignFields} />

              </div>
            </main>
            <Footer loginDetails={loginDetails} />
          </React.Fragment>
        )}
      </parentContext.Consumer>
    )
  }
}
export default BillingConfirmationPage;