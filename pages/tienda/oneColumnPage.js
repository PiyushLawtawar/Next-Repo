/**
 * Module Name : oneColumnPage Module.
 * Functionality : This Component will help to render OneColumnPage Component for PDP page.
 * @exports  : oneColumnPage Page
 * @requires : module:React
 * @requires : module:next/router#withRouter
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/get
 * @requires : module:client/helpers/utilities/utility#Utility, #getAssetsPath
 * @requires : module:client/helpers/config/config#Path
 * @requires : module:client/components/templates/OneColumnPage#OneColumnPage
 * Team : B&S Team.
 * 
 */
import React from 'react';
import { withRouter } from 'next/router'
import { Utility, getAssetsPath } from '../../client/helpers/utilities/utility';
import { Path } from '../../client/helpers/config/config';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import OneColumnTemplate from '../../client/components/templates/OneColumnPage';
import { parentContext } from '../../client/contexts/parentContext';

class OneColumnPage extends React.Component {

  /**
   * Next JS function. This will get fired first when OneColumnPage component gets render.
   * @event getInitialProps
   * @param {*} req
   * @param {*} query 
   */
  static async getInitialProps({ req, query }) {
    let myData = {};

    if (!req) {

      try {
        let payload = '';
        let pdpType = query.pdpTypeForSPA || '';
        let productId = query.productId || '';

        // payload.productId = productId;
        // payload.pdpType = pdpType;
        payload = payload + "?productId=" + productId;
        payload = payload + "&pdpType=" + pdpType;
        //console.log("", query.pdpTypeForSPA)
        let pagePath = Path.oneColumnPageData;
        switch (query.pdpTypeForSPA) {
          case "default":
            pagePath = Path.oneColumnPageData;
            // myData = await Utility(Path.oneColumnPageData + payload, 'GET');
            break
          case "collection":
            pagePath = Path.collectionSPAData;
            // myData = await Utility(Path.oneColumnPageData + payload, 'GET');
            break
        }


        myData = await Utility(pagePath + payload, 'GET');

        /* Start: Redirect to Changepassword page */
        let statusErrorCode = get(myData, 'data.mainContent.errorCode', '');
        let statusCode = get(myData, 'data.mainContent.code', '');
        //console.log("statusErrorCode", statusErrorCode)
        //console.log("statusCode", statusCode)

        if (statusCode == 600 || statusCode == '600' || statusErrorCode == 1001 || statusErrorCode == '1001') {
          Router.push('/tienda/users/changePassword?isredirect=true');
        }
        /* End: Redirect to Changepassword page */


        // switch (query.pdpTypeForSPA) {
        //   case "default":
        //     myData = await Utility(Path.oneColumnPageData + payload, 'GET');
        //    // myData = await Utility(Path.oneColumnPageData + payload, 'GET');
        //     break
        //   case "collection":
        //     console.log("iam here ")
        //     myData = await Utility(Path.collectionSPAData + payload, 'GET');
        //    // myData = await Utility(Path.oneColumnPageData + payload, 'GET');
        //     break
        // }

      } catch (e) { console.log("Error: OnecolumnPage: getInit: ", e) }
    }
    return { initialPropsData: myData.data }
  }

  /**
   * Custom function. It is used to get the Path of the ratings related CSS file.
   * @event getRatingCssFile
   * @param {*} hostname
   */
  getRatingCssFile = (hostname) => {
    let ratingcss = '';

    /* if (typeof hostname === 'undefined' || !hostname) {
      hostname = 'www.liverpool.com.mx';
    } */
    try {
      let AssetsPath = '';
      AssetsPath = getAssetsPath((typeof window !== 'undefined' ? window : undefined), (typeof hostname !== 'undefined' ? hostname : undefined), (typeof window !== 'undefined' ? undefined : process));

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
    } catch (e) { }

    return ratingcss;
  }

  componentDidMount() {
    const { closeModal, showModal } = this.context
    if (typeof showModal['showModal13'] !== 'undefined' && showModal['showModal13']) {
      closeModal('showModal13');
    }
  }

  /**
   * default render method to render html in REACT
   * @returns REACT HTML
   */
  render() {
    const initialData = this.props.initialPropsData || {};

    let oneColumnData = {};
    let hostname = '';
    let flags = '';
    let limitedPiecesSkusData = [];
    if (!isEmpty(initialData)) {
      oneColumnData = initialData;
      hostname = get(initialData, 'hostname', '');
      flags = get(initialData, 'mainContent.flags', '');
      limitedPiecesSkusData = get(initialData, 'limitedPiecesSkusData', '');

    } else {
      oneColumnData = get(this.props, 'router.query.data', '')
      hostname = get(this.props, 'router.query.data.hostname', '');
      flags = get(this.props, 'router.query.data.mainContent.flags', '');
      limitedPiecesSkusData = get(initialData, 'limitedPiecesSkusData', '');
    }
    const pdpType = get(oneColumnData, 'mainContent.pdpType', '');
    const ratingCssPath = this.getRatingCssFile(hostname);

    return (
      <React.Fragment>
        {pdpType === 'default' &&
          <React.Fragment>
            {flags && !flags['turntoflag'] ? "" : <link href={ratingCssPath} rel="stylesheet" type="text/css" />}
            <OneColumnTemplate oneColumnData={oneColumnData} limitedPiecesSkusData={limitedPiecesSkusData} />
          </React.Fragment>
        }
        {pdpType !== 'default' &&
          <React.Fragment>
            {flags && !flags['turntoflag'] ? "" : <link href={ratingCssPath} rel="stylesheet" type="text/css" />}
            <OneColumnTemplate oneColumnData={oneColumnData} limitedPiecesSkusData={limitedPiecesSkusData} isCollection={pdpType === "collection" ? "true" : "false"} />
          </React.Fragment>
        }
        <div id="loading" className="preciosWrapper fnfnone">
          <div className="loading"></div>
          <div className="content">
          </div>
        </div>
      </React.Fragment>
    )
  };
}
OneColumnPage.contextType = parentContext;
export default withRouter(OneColumnPage);