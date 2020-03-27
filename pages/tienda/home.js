/**
 * Module Name : Home Page Module.
 * Functionality : This Component will get data from parentContext and render HomePage Component.
 * @exports  : Home Page
 * @requires : module:React
 * @requires : module:client/contexts/parentContext#parentContext
 * @requires : module:client/components/templates/homePage/homePage#HomePage
 * @requires : module:lodash/map
 * Team : B&S Team.
 * 
 */

import React from 'react';
import { parentContext } from '../../client/contexts/parentContext';
import HomePage from '../../client/components/templates/homePage/homePage';
import get from 'lodash/get';

export default () => {
  return (
    <React.Fragment>
      <parentContext.Consumer>
        {({ data,loginDetails, domainName, labelData,departmentData}) => {
          const homePageContent = data.homePageContent && data.homePageContent.contentItem && data.homePageContent.contentItem.contents && data.homePageContent.contentItem.contents[0] && data.homePageContent.contentItem.contents[0].mainContent || {}
          const seoContent = data.seoContent || {};
          let flags = data.homePageContent && data.homePageContent.flags || {};
          let staticLabels ={};
          if(homePageContent && homePageContent.staticLabels && homePageContent.staticLabels.staticLabelValues && homePageContent.staticLabels.staticLabelValues[0]
              && homePageContent.staticLabels.staticLabelValues[0].keyValues){
                staticLabels = get(data, 'homePageContent.staticLabels.staticLabelValues[0].keyValues', {});
              }
          //const staticLabels = get(data, 'homePageContent.staticLabels.staticLabelValues[0].keyValues', {});
          return <HomePage domainName={domainName} staticLabels={staticLabels} homePageContent={homePageContent} loginDetails={loginDetails}  seoContent={seoContent} hostName={data.hostname} relativePath={data.url} flags={flags} labelData={labelData} departmentData={departmentData}/>
        }}
      </parentContext.Consumer>
    </React.Fragment>
  );
};