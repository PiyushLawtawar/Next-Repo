import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import AsideMyAccount from '../../organisms/Aside/AsideMyAccount';
import ChangePasswordPage from '../../organisms/ChangePassword/organism-changePassword';
import { parentContext } from '../../../contexts/parentContext';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";
import Router from 'next/router';


class ChangePassword extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      data: '',
      alert_status: '',
      alert_message: '',

    };
  }
  componentDidMount() {
    this.staticLabels();
    if (Router && Router.router && Router.router.query && Router.router.query.isredirect) {
      this.setState({ alert_status: true, alert_message: "Tu contraseña ha caducado, por favor cámbiala" })
    }

  }
  staticLabels = () => {
    const pageName = "?pageName=pwa-changePasswordPage";
    /*const payload = {
      "pageName": [
        "pwa-changePasswordPage"
      ]
    }*/
    let userHeaders = {};
    if (Router && Router.router && Router.router.query && Router.router.query.isredirect) {
      userHeaders = { 'request_from': 'changePassword' }
    }
    Utility(Path.staticLabelsFetch + pageName, 'GET', {}, userHeaders).then(response => {
      const labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
      this.setState({ data: labels })
    }, (error) => {
    });
  }

  changePassword = (payload) => {
    let userHeaders = {};
    if (Router && Router.router && Router.router.query && Router.router.query.isredirect) {
      userHeaders = { 'request_from': 'changePassword' }
    }
    Utility(Path.changePassword, 'POST', payload, userHeaders).then(response => {
      if (response && response.data && response.data.errorCode === '1002') {
        Router.push('/tienda/login')
      } else if (response && response.data && response.data.s === '0') {
        window.sessionStorage.removeItem('forgetPassword');
        Router.push("/tienda/users/myAccount?change=" + true)
      } else if (response.data && response.data.err) {
        this.show_alert(response.data.err);
      }
    }, (error) => {
      console.error("Error ==== :: ", error);
    });
  }


  dismiss_alert = () => {
    this.setState({ alert_status: false })
  }

  show_alert = (alert_message) => {
    this.setState({ alert_status: true, alert_message });
    setTimeout(() => {
      this.setState({ alert_status: false });
    }, 9000)
  }

  render() {

    const { alert_status, alert_message } = this.state;

    const data = this.state;
    const staticLabels = data && data.data;
    let breadcrumbInfo = {
      label: 'Cambiar contraseña',
      breadcrumbData: [
        {
          "navigationState": "/users/myAccount",
          "label": staticLabels && staticLabels["pwa.changePassword.breadCrumbMyAccount.text"],
        }],
      isMyAccount: true
    };


    var options = {
      type: '-alert',
      text: 'cambia tu contraseña',
      iconType: "a-alert__icon icon-error"//- icon-warning or icon-done
    }
    var options3 = {
      type: '-success',
      text: 'Su contraseña ha cambiado',
      iconType: "a-alert__icon icon-done"//- icon-warning or icon-done
    }

    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData, setDepartmentData, departmentData, setFooterData, snbfooterData  }) => (
          <React.Fragment>
            <Header
              loginDetails={loginDetails}
              handleTypeheadHide={handleTypeheadHide}
              handleTypeheadShow={handleTypeheadShow}
              handleMobileMenu={handleMobileMenu}
              showMobileMenu={showMobileMenu}
              showTypehead={showTypehead}
              headerData={headerData}
              pageName="myAccount"
              setDepartmentData={setDepartmentData}
              departmentData={departmentData}
            />
            <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
            <div className="container-fluid o-main-container p-0">
              <div className="container o-container__secondary">
                <div className="row d-none d-lg-block m-row-bootstrap">
                  <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                </div>
                <div className="row m-row-bootstrap">
                </div>
                <div className="row mt-lg-3 m-row-bootstrap">
                  <aside className="col-lg-3 pr-4 m-aside__content">
                    <AsideMyAccount handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.changePassword.title.text"]} />
                  </aside>
                  <ChangePasswordPage staticLabels={staticLabels} loginDetails={loginDetails} show_alert={this.show_alert} changePassword={this.changePassword} />
                </div>
              </div>
            </div>
            <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData}/>
          </React.Fragment>
        )}
      </parentContext.Consumer>

    )
  }
}

export default ChangePassword;