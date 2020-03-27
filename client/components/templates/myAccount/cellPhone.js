import React from 'react';
import MoleculeTitleMenuMyAccount from '../../molecules/TitleMenuMyAccount/moleculeTitleMenuMyAccount';
import OrganismCellPhone from '../../organisms/CellPhone/organismCellPhone';
import Head from '../../Commons/head';
import Accordian from '../../molecules/Accordion/Accordion';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import Modal from '../../../helpers/modal/modal';
import { parentContext } from '../../../contexts/parentContext';
import MoleculeModalDeleteNumber from '../../molecules/Modals/moleculeModalDeleteNumber';
import CardEmpty from '../../organisms/CardsAccount/organism-card-empty';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import { Utility, GTMallPages, GetCookie } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';


class CellPhone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: '',
      phoneData: []
    };
  }

  componentDidMount() {
    this.getPhoneNumber();
    this.staticLabels();
  }

  getPhoneNumber = () => {
    Utility(Path.getPhoneNumber, 'POST').then(response => {
      if (response && response.data && response.data.errorCode === '1002') {
        Router.push('/tienda/login')
      } else if (response && response.data && response.data.s === '0') {
        const phoneData = response && response.data && response.data.phones;
        this.setState({ phoneData: phoneData });
      }

    }, (error) => {
    });
  }

  staticLabels = () => {
    let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-phonePage");
    const pageName = "?pageName=pwa-phonePage";
    if (typeof labels === 'undefined' || labels.length === 0) {
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues || '';
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
    const { data, phoneData } = this.state;
    const staticLabels = data;
    let breadcrumbInfo = {
      label: staticLabels && staticLabels["pwa.breadcrum.cellPhone.label"],
      breadcrumbData: [
        {
          "navigationState": "/users/myAccount",
          "label": staticLabels && staticLabels["pwa.breadcrum.myAccount.label"],
        }
      ],
      isMyAccount: true
    };
    const modalProductDescription = {
      modalId: "delete-number-modal",
      modalClass: "o-product__modal modal fade o-account__modal",
      modalTabIndex: "1",
      modalAriaLabelledBy: "delete-number-modal",
      modalDialogClass: "modal-dialog modal-dialog-centered",
      modalContentClass: "modal-content"
    };
    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData,setDepartmentData,departmentData,setFooterData, snbfooterData }) => (
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
                <MoleculeTitleMenuMyAccount title={staticLabels && staticLabels["pwa.breadcrum.cellPhone.label"]} />
                <div className="row mt-lg-3 m-row-bootstrap">
                  <aside className="col-lg-3 pr-4 m-aside__content">
                    <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.viewPhone.celulares.label"]} />
                  </aside>

                  <div className="col-lg-9 m-column_mainContent">
                    <Modal modalDetails={modalProductDescription} ModalpopUp={'DeleteNumber'} >
                      <MoleculeModalDeleteNumber staticLabels={staticLabels} />
                    </Modal>
                    {phoneData && phoneData.length ? <OrganismCellPhone staticLabels={staticLabels} /> : <CardEmpty staticLabels={staticLabels} route={'cellPhone'} />}
                  </div>
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
export default CellPhone;


