/**
 * Module Name : TwoColumnCategoryPage Module.
 * Functionality : This Component will help to render TwoColumnCategoryPage Component for Category Landing, Brand Landing(Static & Dynamic) Page, Product Listing page.
 * @exports  : TwoColumnCategoryPage Page
 * @requires : module:React
 * @requires : module:next/router#withRouter, Router
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/get
 * @requires : module:lodash/map
 * @requires : module:client/helpers/utilities/utility#Utility, GetLinkData
 * @requires : module:client/helpers/config/config#Path
 * @requires : module:client/contexts/parentContext#parentContext
 * @requires : module:client/components/templates/TwoColumnPagee#TwoColumnPage
 * Team : B&S Team.
 * 
 */
import React from 'react';
import { withRouter } from 'next/router'
import { Utility,logError,logDebug, GetLinkData } from '../../client/helpers/utilities/utility';
import { Path } from '../../client/helpers/config/config';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import { parentContext } from '../../client/contexts/parentContext';
import TwoColumnPage from '../../client/components/templates/TwoColumnPage';

/**
 * Custom function. It is used to add the Search details into dataLayer GTM Object.
 * @event getGTMonSearch
 * @param {*} searchTerm
 * @param {*} totalNumRecords
 */
const getGTMonSearch = (searchTerm, totalNumRecords) => {
      const gtmUserId = sessionStorage.getItem('gtm') || '';
      const gtmObject = {
          'searchTerm': searchTerm || '',
          'searchResults': totalNumRecords || '',
          'event': 'siteSearch',
          "loginStatus": gtmUserId !== ''? true: false,
          "userID": gtmUserId,
      };
      dataLayer.push(gtmObject);
}

/**
 * @class TwoColumnCategoryPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class TwoColumnCategoryPage extends React.Component {

  /**
   * Next JS function. This will get fired first when OneColumnPage component gets render.
   * @event getInitialProps
   * @param {*} req
   * @param {*} query 
   */
  static async getInitialProps ({ req, query  }) {
      let myData = {};
      let body = {};
      let queryParams = '';
      if(!req){
        body = query;
        for(let k in query) {
          if(isEmpty(query[k])) {
            delete body[k];
          }
        }
        for(let k in body) {
          queryParams += k+'='+body[k]+'&';
        }
        queryParams = queryParams.slice(0, -1);
        queryParams = '?'+queryParams;
        /* Change done for 404 service call:Start */
        try{
          myData = await Utility(Path.getPlp+queryParams, 'GET');
        } catch (ex){
        }
        /* Change done for 404 service call:End */
        
        /* Start: Redirect to Changepassword page */
        let statusErrorCode = get(myData, 'data.mainContent.errorCode', '');
        let statusCode = get(myData, 'data.mainContent.code', '');
        if (statusCode == 600 || statusCode == '600' || statusErrorCode == 1001 || statusErrorCode == '1001') {
          Router.push('/tienda/users/changePassword?isredirect=true');
        }
        /* End: Redirect to Changepassword page */

        /* Redirect URL code start*/
        let redirectUrl = get(myData, 'data.mainContent.contentItem.redirectURL', '');
        let asInfo = redirectUrl;
        /* 23597 fix start   */
        if (!isEmpty(redirectUrl)) {
          const htmlAnchor = document.createElement('a');
          htmlAnchor.href = redirectUrl;
          const hostname = htmlAnchor.hostname;
          if(!isEmpty(window)) {
            if(!isEmpty(body['s'])) {
              setTimeout(() => { getGTMonSearch(body['s'], '') }, 10);
            }
            if(window.location.hostname === hostname)  {
              if (redirectUrl.indexOf('?') !== -1) {
                  const index =  redirectUrl.indexOf('?');
                  redirectUrl = redirectUrl.substring(0, index);
              }
              const arr = redirectUrl.split('/');
              const len = arr.length;
              const catId = arr[len - 1];
              let href = `/tienda/twoColumnCategoryPage?categoryId=${catId}`;
              if (asInfo.indexOf('showPLP') !== -1) {
                  href += '&always=PLP';
              }
              Router.push(href, asInfo);
            } else {
              window.location.replace(redirectUrl); /* 22989 fix */
            }
          }
        }
        /* 23597 fix end   */
        /* Redirect URL code end*/
        
        /* Microsite Redirection start */
        const microSiteReDirections = get(myData, 'data.configurationData.configuration.microSiteReDirectionConfiguration', {});
        if (!isEmpty(microSiteReDirections) && !isEmpty(body['categoryId'])) {
          /* 23373 fix start*/
            if (!isEmpty(microSiteReDirections[body['categoryId']])) {
                const microSiteUrl = microSiteReDirections[body['categoryId']];
                /* 23597 fix start   */
                if(microSiteUrl.indexOf(body['categoryId']) === -1) {
                  const htmlAnchor = document.createElement('a');
                  htmlAnchor.href = microSiteReDirections[body['categoryId']];
                  const hostname = htmlAnchor.hostname;
                  if(!isEmpty(window)) {
                    if(window.location.hostname === hostname)  {
                      Router.push(microSiteReDirections[body['categoryId']]);
                    } else {
                      window.location.replace(microSiteReDirections[body['categoryId']]); /* 22989 fix */
                    }
                  }                  
                }
                /* 23597 fix end   */                
            }
          /* 23373 fix end*/
        }        
        /* Microsite Redirection end */

        /* redirect to pdp page */
        const bodyContent = get(myData, 'data.mainContent.contentItem.contents[0]["mainContent"]', []);
        !isEmpty(bodyContent) && bodyContent.length > 0 && map(bodyContent, (mainItem) => {
          if (mainItem['@type'] === 'ContentSlotMain') {
            const type = mainItem.contents && mainItem.contents[0] && mainItem.contents[0]['@type'] || '';
            if (type === 'ResultsList') {
                const totalNumRecords = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].totalNumRecs || totalNumRecords;
                if (totalNumRecords === 1) {
                  if(!isEmpty(body['s'])) {
                    setTimeout(() => { getGTMonSearch(body['s'], 1) }, 10);
                  }  
                  const productId = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].productId && mainItem.contents[0].records[0].productId[0] || "";
                  let productName = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].productDisplayName && mainItem.contents[0].records[0].productDisplayName[0] || "";
                  let isHybridProduct = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].isHybridProduct && mainItem.contents[0].records[0].isHybridProduct[0] || false;
                  let isCollection = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0]["product.relProdSequence"] || null;
                  if (!isEmpty(productName)) {
                      productName = productName.toLowerCase();
                      productName = productName.replace(/ /g, '-');
                      if (isHybridProduct === "true") {
                          Router.push({ pathname: `/tienda/pdp/hp/${productName}/${productId}` });
                      }
                      else if (isCollection != null) {
                                           // Router.push({ pathname: `/tienda/group/${productName}/${productId}` });
                  let inputData = {
                    productId: productId,
                    productName: productName,
                    pageName: 'productDetails',
                    pdpTypeForSPA: 'collection',
                    typeahead: 'no'
                  }
                  const { href, asInfo } = GetLinkData(inputData);
                  Router.push(href, asInfo);  
		                      }
                      else {
                        // Router.push({ pathname: `/tienda/pdp/${productName}/${productId}` });
                        let inputData = {
                            productId: productId,
                            productName: productName,
                            pageName: 'productDetails',
                            pdpTypeForSPA: 'default',
                            typeahead: 'no'
                        }
                        const { href, asInfo } = GetLinkData(inputData);
                        Router.push(href, asInfo);
                      }
                  }
              }
            }
          }
        })
        /* redirect to pdp page end*/
      }
      return {initialPropsData:myData.data, 'body': body}
  }

  /**
   * default render method to render html in REACT
   * @returns REACT HTML
   */
  render() { 
    const twoColumnData = this.props.initialPropsData || this.props.router.query.data || {};
    const { body } = this.props;
    let queryParams = {};
    if(!isEmpty(body)) {
      queryParams = body
    } else {
      queryParams = (this.props.router && this.props.router.query && this.props.router.query) || {};
    }
  
    const params = {};
    let catId = '';
    if (!isEmpty(queryParams['Nf'])) {
      params['Nf'] = queryParams['Nf'];
    }
    if (!isEmpty(queryParams['Ns'])) {
      params['Ns'] = queryParams['Ns'];
    }
    if (!isEmpty(queryParams['s'])) {
      params['s'] = queryParams['s'];
    }
    if (!isEmpty(queryParams['page'])) {
      params['page'] = queryParams['page'];
    }
    if (!isEmpty(queryParams['label'])) {
      params['label'] = queryParams['label'];
    }
    if (!isEmpty(queryParams['categoryId'])) {
      catId = queryParams['categoryId'];
    }


    return (
      <React.Fragment>      
        <parentContext.Consumer>
          {({ handleTypeheadHide, showTypehead, loginDetails, configurationData, departmentData }) => (
            <TwoColumnPage loginDetails={loginDetails} showTypehead={showTypehead} handleTypeheadHide={handleTypeheadHide} queryString={params} twoColumnData={twoColumnData} body={body} catId={catId} configurationData={configurationData} departmentData={departmentData}/>
         )}
        </parentContext.Consumer>        
      </React.Fragment>
    );
  }
}
export default withRouter(TwoColumnCategoryPage);
