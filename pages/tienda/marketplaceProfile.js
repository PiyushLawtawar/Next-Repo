/**
 * Module Name : Marketplace Profile Module.
 * Functionality : This Component will help to render OneColumnPage Component for Marketplace Profile.
 * @exports  : Marketplace Profile Page
 * @requires : module:React
 * @requires : module:next/router#withRouter
 * @requires : module:client/components/templates/OneColumnPage#OneColumnPage
 * Team : B&S Team.
 * 
 */
import React from 'react';
import { withRouter } from 'next/router'
import OneColumnPage from '../../client/components/templates/OneColumnPage'
import TechnicalSeo from '../../client/components/organisms/technicalseo/TechnicalSeo';

export default withRouter((props) => {
  // Get site query parameter, default is lp
  const site = (props.router && props.router.query && props.router.query.site) || 'lp';
  const data = (props.router && props.router.query && props.router.query.data) || 'lp';
  // Header API Call
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  const articleDetails = {
    text: "Home Page",
    headerStyle: "a-paragraph__primary"
  };

  return (
    <React.Fragment>
    
      {/*<parentContext.Consumer>
        {({ handleMobileMenu, headerData, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails }) => (
            <Header
                loginDetails={loginDetails}
                handleTypeheadHide={handleTypeheadHide}
                handleTypeheadShow={handleTypeheadShow}
                handleMobileMenu={handleMobileMenu}
                showMobileMenu={showMobileMenu}
                showTypehead={showTypehead}
                data={header}
                headerData={headerData}
                deptMenuData={data}  
            />
        )}
      </parentContext.Consumer>*/}
      {/*<HomePage headerData={props.router.query.data} />*/}
      {/*<TechnicalSeo pageName="vendedor" contentItem={props.router.query.data.mainContent}  staticLabelValues ={props.router.query.data.mainContent.staticLabels} hostName ={props.router.query.data.hostName} relativePath={props.router.query.data.url}/>*/}
      <OneColumnPage oneColumnData={props.router.query.data}/>
    </React.Fragment>
  );
});
