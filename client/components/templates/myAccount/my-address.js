
import React from 'react';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import Header from '../../organisms/Header/Header';
import { Utility, GTMallPages, GetCookie } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import { parentContext } from '../../../contexts/parentContext';
import AsideMyAccount from '../../organisms/Aside/AsideMyAccount';
import AddressPageBody from '../../organisms/AddressAccount/my-address-body';
import MyAddressEmpty from '../../organisms/AddressAccount/my-address-empty';
import MyAddressEdit from '../../organisms/AddressAccount/my-address-edit';
import Footer from '../headerFooter/headerFooter';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import AddressAddPage from '../../organisms/AddressAccount/my-address-add';
import Alert from "../../molecules/Alert/Alert";
// import './myAddressPage.styl';


class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: this.props.userAddress,
      addressAction: '',
      data: '',
      deleteModalData: '',
      alert_status: '',
      alert_message: '',
    };
  }

  componentDidMount() {
    // const userAddress = this.state.userAddress;
    this.staticLabels();
    // console.log('userAddress',userAddress)
    //      Utility(Path.getAddressesMyAccount, 'POST', {}).then(response => {
    //                 const userAddress = response.data || '';
    //                 this.setState({ userAddress });
    //                 console.log('service is called', userAddress)

    //             }, (error) => {
    //                 console.log(error);
    //             });
  }

  setAddressData = (userAddress, addressAction = '') => {
    if (addressAction !== '') {
      this.setState({ userAddress, addressAction })
    } else {
      this.setState({ userAddress })
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

  staticLabels = () => {
    // let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-addressPage");
    // let credictcardlabels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-creditCardsPage");
    const pageName = "?pageName=pwa-addressPage";
    const pageName2 = "?pageName=pwa-creditCardsPage";
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        let labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
        //const credictcardlabels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[1].keyValues;
        this.setState({ data: labels })
      }, (error) => {
      });
      Utility(Path.staticLabelsFetch + pageName2, 'GET').then(response => {
        //const labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
        let credictcardlabels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
        this.setState({ deleteModalData: credictcardlabels })
      }, (error) => {
      });
    
  }

  addAddress = (payload) => {
    try {
      Utility(Path.addnewaddress, 'POST', payload).then(response => {
        if (response && response.data && response.data.errorCode === '1002') {
          Router.push('/tienda/login')
        } else if (response && response.data && response.data.s !== undefined && response.data.s === "0") {
          // Router.push('/tienda/users/addressBook');
           window.location.href = '/tienda/users/addressBook';          
        } else if (response.data && response.data.err) {
          window.scrollTo(0, 0);
          this.show_alert(response.data.err);
        }
      },
        (error) => {
          //console.log("Error ==== :: ", error);
        });
    } catch (e) {
      console.error(e, "error");
    }
  }

  editAddress = (payload) => {
    try {
      Utility(Path.updateaddress, 'POST', payload).then(response => {
        if (response && response.data && response.data.errorCode === '1002') {
          Router.push('/tienda/login')
        } else if (response.data && response.data.s !== undefined && response.data.s === "0") {
          // Router.push('/tienda/users/addressBook');
           window.location.href = '/tienda/users/addressBook';
        } else if (response.data && response.data.err) {
          window.scrollTo(0, 0);
          this.show_alert(response.data.err);
        }
      }, (error) => {
      });
    } catch (e) {
      console.error(e, "error");
    }
  }

  render() {
    const { alert_status, alert_message, deleteModalData } = this.state;
    const data = this.state;
    const staticLabels = data && data.data;
    const DataOfUser = this.state.userAddress;
    // console.log('DataOfUser',DataOfUser)
    // const userAddress = get(this.props, 'userAddress', {});
    const userAddress = (this.props.userAddress && this.props.userAddress.myAddressContent) ? this.props.userAddress.myAddressContent : this.props.userAddress;
    // console.log('userAddress------------',userAddress)    
    const myAddressContent = get(this.props, 'userAddress.myAddressContent', {});    
    const addressAction = get(this.props, 'userAddress.addressAction', 'ShowList');

    const flag = get(this.props, 'data.configurationData.configuration.flagConfiguration')

    let breadcrumbInfo = {}

    let headingText = ''
    if (addressAction === 'ShowList') {
      headingText = staticLabels && staticLabels["pwa.addressPage.breadCrumbAddress.text"];

    } else if (addressAction === 'Edit') {
      headingText = staticLabels && staticLabels["pwa.addressPage.direccion2.label"];

    } else if (addressAction === 'Add') {
      headingText = staticLabels && staticLabels["pwa.addressPage.direccion1.label"];
    }

    if (addressAction === 'ShowList') {
      breadcrumbInfo = {
        label: staticLabels && staticLabels["pwa.addressPage.breadCrumbAddress.text"],
        breadcrumbData: [
          {
            "navigationState": "/users/myAccount",
            "label": staticLabels && staticLabels["pwa.addressPage.breadCrumbAccount.text"],
          }
        ],
        isMyAccount: true
      };
    } else if (addressAction === 'Edit') {
      breadcrumbInfo = {
        label: staticLabels && staticLabels["pwa.addressPage.direccion2.label"],
        breadcrumbData: [
          {
            "navigationState": "/users/myAccount",
            "label": staticLabels && staticLabels["pwa.addressPage.breadCrumbAccount.text"],
          }, {
            "navigationState": "/users/addressBook",
            "label": staticLabels && staticLabels["pwa.addressPage.breadCrumbAddress.text"],
          }
        ],
        isMyAccount: true
      };
    } else if (addressAction === 'Add') {
      breadcrumbInfo = {
        label: staticLabels && staticLabels["pwa.addressPage.direccion1.label"],
        breadcrumbData: [
          {
            "navigationState": "/users/myAccount",
            "label": staticLabels && staticLabels["pwa.addressPage.breadCrumbAccount.text"],
          },
          {
            "navigationState": "/users/addressBook",
            "label": staticLabels && staticLabels["pwa.addressPage.breadCrumbAddress.text"],
          }
        ],
        isMyAccount: true

      };
    }
    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData, setDepartmentData, departmentData, setFooterData, snbfooterData, configurationData, setConfigurationData }) => (
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


                <div className="row d-lg-none m-myAccount-aside-title--mobile">
                  <div className="col-12">
                    <H1 headLineText={headingText}>
                    </H1>
                  </div>
                </div>

                <div className="row m-row-bootstrap">
                </div>
                <div className="row mt-lg-3 m-row-bootstrap">
                  <aside className="col-lg-3 pr-4 m-aside__content">
                    <AsideMyAccount handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={headingText} />
                  </aside>

                  <div className="col-lg-9">
                    {!isEmpty(addressAction) && addressAction === 'Edit' &&
                      <MyAddressEdit deleteModalData={deleteModalData} show_alert={this.show_alert} dismiss_alert={this.dismiss_alert} staticLabels={staticLabels} editAddress={this.editAddress} getAddresses={this.getAddresses} setAddressData={this.setAddressData} userAddress={userAddress} setAddressAction={this.setAddressAction} addressId={this.props.addressId} />
                    }
                    {!isEmpty(addressAction) && addressAction === 'ShowList' &&
                      <React.Fragment>

                        {userAddress && userAddress.records && userAddress.records.length > 0 ?
                        //  change for getConfigration service Calls
                          <AddressPageBody flag={flag} staticLabels={staticLabels} deleteModalData={deleteModalData} getAddresses={this.getAddresses} setAddressData={this.setAddressData} userAddress={userAddress} setAddressAction={this.setAddressAction} configurationData={configurationData} setConfigurationData={setConfigurationData}  />    

                          :
                          <MyAddressEmpty staticLabels={staticLabels} />
                        }
                      </React.Fragment>
                    }
                    {!isEmpty(addressAction) && addressAction === 'Add' &&

                      <AddressAddPage deleteModalData={deleteModalData} show_alert={this.show_alert} dismiss_alert={this.dismiss_alert} staticLabels={staticLabels} setAddressAction={this.setAddressAction} addAddress={this.addAddress} userAddress={userAddress} />
                    }
                  </div>
                </div>
              </div>
            </div>

            <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
          </React.Fragment>
        )
        }
      </parentContext.Consumer>
    )

  }
}

export default AccountPage;








