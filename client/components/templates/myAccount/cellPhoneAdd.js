import React from 'react';
import MoleculeTitleMenuMyAccount from '../../molecules/TitleMenuMyAccount/moleculeTitleMenuMyAccount';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import OrganismCellPhoneAdd from '../../organisms/CellPhone/organismCellPhoneAdd';

class CellPhoneAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  componentDidMount() {
    this.staticLabels();
  }

  staticLabels = () => {
    let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-phonePage");
    const pageName = "?pageName=pwa-phonePage";

    if (typeof labels === 'undefined' || labels.length === 0) {
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
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

    const data = this.state;
    const staticLabels = data && data.data;

    let breadcrumbInfo = {
      label: staticLabels && staticLabels["pwa.breadcrum.addPhone.label"],
      breadcrumbData: [
        {
          "navigationState": "/users/myAccount",
          "label": staticLabels && staticLabels["pwa.breadcrum.myAccount.label"],
        },
        {
          "navigationState": "/users/viewPhones",
          "label": staticLabels && staticLabels["pwa.breadcrum.cellPhone.label"],
        }
      ],
      isMyAccount: true
    };

    return (

      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData,setDepartmentData, departmentData, setFooterData, snbfooterData }) => (
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

            <div className="container-fluid o-main-container p-0">
              <div className="container o-container__secondary">
                <div className="row d-none d-lg-block m-row-bootstrap">
                  <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                </div>
                <div className="row m-row-bootstrap">
                </div>

                <div className="row mt-lg-3 m-row-bootstrap">
                  <aside className="col-lg-3 pr-4 m-aside__content">
                    <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.breadcrum.addPhone.label"]} />
                  </aside>
                  <OrganismCellPhoneAdd staticLabels={staticLabels} />
                </div>
              </div>
            </div>

            <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
          </React.Fragment>
        )}
      </parentContext.Consumer>
    )
  }
}
export default CellPhoneAdd;

