import React from 'react';
import { withRouter } from 'next/router';
import StoreLocator from '../../../client/components/templates/StoreLocator/StoreLocator';
import { parentContext } from '../../../client/contexts/parentContext';
import Footer from '../../../client/components/templates/headerFooter/headerFooter';
import Header from '../../../client/components/organisms/Header/Header';
import { Path } from '../../../client/helpers/config/config';
import { Utility } from '../../../client/helpers/utilities/utility';

class storeLocator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBackIcon: false
    }
  }

  changeBackIcon = () => {
    this.setState({ showBackIcon: true });
  }
  render () {
    const { showBackIcon } = this.state;
    return (
      <parentContext.Consumer>
        {({ data, loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, updateState, searchbarClicked, handleSearchBarShow, handleSearchBarHide,  setFooterData, snbfooterData, departmentData, setDepartmentData, configurationData }) => {
          const stores = data && data.StoreDataContent && data.StoreDataContent.stores || [];           
          const configData = configurationData;
          const stateList = data && data.stateList || {};
          return (
            <React.Fragment>
              <Header
                loginDetails={loginDetails}
                handleTypeheadHide={handleTypeheadHide}
                handleTypeheadShow={handleTypeheadShow}
                handleMobileMenu={handleMobileMenu}
                showMobileMenu={showMobileMenu}
                showTypehead={showTypehead}
                headerData={headerData}
                pageName="storeLocator"
                searchbarClicked={searchbarClicked}
                handleSearchBarShow={handleSearchBarShow}
                handleSearchBarHide={handleSearchBarHide}
                setDepartmentData={setDepartmentData}
                departmentData={departmentData}
                showBackIcon={showBackIcon}
              />
              <StoreLocator changeBackIcon={this.changeBackIcon} storeData={stores} configurationData={configData} stateList={stateList} />
              <Footer footerClassName="d-none d-lg-block" loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
            </React.Fragment>
          )
        }}
      </parentContext.Consumer>
    );
  }
}
export default withRouter(storeLocator);
