import Footer from '../headerFooter/headerFooter';
import Router from 'next/router';
import Header from '../../organisms/Header/Header';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import CreateAccountContainer from '../../organisms/CreateAccountContainer/organism-createAccount-container';
import { parentContext } from '../../../contexts/parentContext';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";

const getBrowserBunyanInstance = require('../../../helpers/clientLoggerHandler');

const loggerHandler = getBrowserBunyanInstance('CreateAccount');


class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_status: '',
      alert_message: '',

    };
  }

  scrollUp = () => {
    window.scrollTo(0, 0);
  }


  createAccount = (payload) => {
    Utility(Path.createAccount, 'POST', payload).then(response => {
      if (response.data && response.data.s === "0") {
        dataLayer.push({
          event: 'evRegistration', //variable estática
          bool: 'Exito',  //variable estática
          userID: response && response.data && response.data.gtmUserId ? response.data.gtmUserId : '',  //CD 11
        });
        if (Router && Router.router && Router.router.query && Router.router.query.checkoutRegister) {
          Router.push('/tienda/checkoutShipping');
        } else if (Router && Router.router && Router.router.asPath === '/tienda/users/createAccount') {
          Router.push("/tienda/home");
        }
        this.show.showRegistrationButton();
      } else {
        if (response.data && response.data.err) {
          this.scrollUp();
          this.show_alert(response.data.err);
        }
        this.show.showRegistrationButton();
        dataLayer.push({
          event: 'evRegistration',  //variable estática
          bool: 'Error',  //variable estática
        });
      }
    }, (error) => {
      loggerHandler.error("Error ==== :: ", error);
    });
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

  componentDidMount() {
    this.staticLabels();
  }


  staticLabels = () => {
    let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-registerPage");
    const pageName = "?pageName=pwa-registerPage";

    if (typeof labels === 'undefined' || labels.length === 0) {
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0] && response.data.staticLabelValues[0].keyValues || '';
        loggerHandler.debug(labels, 'labels')
        this.setState({ data: labels })
      }, (error) => {
      });
    } else {
      let _tdata = labels && labels[0].keyValues;
      this.setState({
        data: _tdata
      });
    }
  }

  render() {
    loggerHandler.debug(Router, 'router')
    const data = this.state;
    const staticLabels = data && data.data;

    const { alert_status, alert_message } = this.state;
    let breadcrumbInfo = {
      label: staticLabels && staticLabels["pwa.registerPage.crearcuenta.label"],
      breadcrumbData: {},
      isMyAccount: true
    };
    return (
      <parentContext.Consumer>
        {/* //  change for getConfigration service Calls : Start */}
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, setDepartmentData, departmentData, setFooterData, snbfooterData, configurationData, setConfigurationData }) => (
          <React.Fragment>
            <main classname="o-main t-columnCenter">
              <Header
                loginDetails={loginDetails}
                handleTypeheadHide={handleTypeheadHide}
                handleTypeheadShow={handleTypeheadShow}
                handleMobileMenu={handleMobileMenu}
                showMobileMenu={showMobileMenu}
                showTypehead={showTypehead}
                headerData={headerData}
                pageName="homepage"
                setDepartmentData={setDepartmentData}
                departmentData={departmentData}
              />

              <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />


              <div className="organism container-fluid o-main-container o-one-column">
                <div className="container p-0">
                  <div className="row d-none d-lg-block">
                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                  </div>
                  <div className="row m-0">
                    <div className="col offset-lg-1 col-lg-10 p-0">
                      {/* change for getConfigration service Calls : Start */}
                      <CreateAccountContainer staticLabels={staticLabels} show_alert={this.show_alert} createAccount={this.createAccount} ref={show => this.show = show} configurationData={configurationData} setConfigurationData={setConfigurationData} />  
                      {/* change for getConfigration service Calls : End */}
                    </div>
                  </div>
                </div>
              </div>
              <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
            </main>
          </React.Fragment>
        )}
        {/* //  change for getConfigration service Calls : Start */}
      </parentContext.Consumer>

    )
  }
}

export default CreateAccount;
