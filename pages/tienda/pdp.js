/**
 * Module Name : Pdp Module.
 * Functionality : This Component will help to render OneColumnPage Component.
 * @exports  : PDP Page
 * @requires : module:React
 * @requires : module:next/router#withRouter
 * @requires : module:client/helpers/utilities/utility#getAssetsPath
 * @requires : module:client/components/templates/OneColumnPage#OneColumnPage
 * Team : B&S Team.
 * 
 */
import React from 'react';
import { withRouter } from 'next/router'
import OneColumnPage from '../../client/components/templates/OneColumnPage'
import { getAssetsPath } from '../../client/helpers/utilities/utility';

export default withRouter((props) => {
  // Get site query parameter, default is lp
  const site = (props.router && props.router.query && props.router.query.site) || 'lp';
  const data = (props.router && props.router.query && props.router.query.data) || 'lp';
  const flags = (props.router && props.router.query && props.router.query.data && props.router.query.data.mainContent && props.router.query.data.mainContent.flags) ? props.router.query.data.mainContent.flags : null;
  // Header API Call
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  const articleDetails = {
    text: "Home Page",
    headerStyle: "a-paragraph__primary"
  };

  let ratingcss;
  let hostname = props.router.query.data.hostname;
  
  /*if (typeof hostname === 'undefined' || !hostname) {
    hostname = 'www.liverpool.com.mx';
  }*/
  let  AssetsPath = '';
  AssetsPath = getAssetsPath(( typeof window !=='undefined' ?window :undefined),(typeof hostname !=='undefined'?hostname:undefined),(typeof window !=='undefined'?undefined:process)); 
    
  switch (hostname.split('.')[1]) {
    case 'liverpool':
      ratingcss = AssetsPath + "/static/css/turnTo-liverpool.css";
      break;
    case 'williams-sonoma':
      ratingcss = AssetsPath + "/static/css/turnTo-williamssonoma.css";
      break;
    case 'westelm':
      ratingcss = AssetsPath + "/static/css/turnTo-westelm.css";
      break;
    case 'potterybarn':
      ratingcss = AssetsPath + "/static/css/turnTo-potterybarn.css";
      break;
    case 'potterybarnkids':
      ratingcss = AssetsPath + "/static/css/turnTo-potterybarnkids.css";
      break;
    case 'pbteen':
      ratingcss = AssetsPath + "/static/css/turnTo-potterybarnteens.css";
      break;
  }
  //console.log("ratingcss", ratingcss);

  return (
    <React.Fragment>
      {/* {flags && !flags['turntoflag'] ?"":<link href='/static/css/turnTo.css' rel="stylesheet" type="text/css" />} */}
      {flags && !flags['turntoflag'] ? "" : <link href={ratingcss} rel="stylesheet" type="text/css" />}
      <OneColumnPage oneColumnData={props.router.query.data} />
      <div id="loading" className="preciosWrapper fnfnone">
        <div className="loading"></div>
        <div className="content">
        </div>
      </div>
    </React.Fragment>

  );
});
