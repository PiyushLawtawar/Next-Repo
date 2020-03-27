import { parentContext } from '../../client/contexts/parentContext';
import React from 'react';
import { withRouter } from 'next/router'
import MyBag from '../../client/components/templates/myBag/myBag';
import EmptyBag from '../../client/components/templates/myBag/EmptyBag';
import Footer from '../../client/components/templates/headerFooter/headerFooter';
import ParentBag from '../../client/components/templates/myBag/parentBag';
import { Utility } from '../../client/helpers/utilities/utility';
import { Path } from '../../client/helpers/config/config';
import Header from '../../client/components/organisms/Header/Header';

const getCards = (commerceItems) => {

    let listData = [];
    let sortedList=[];
    for (var i in commerceItems) {
        if(typeof commerceItems[i] === 'object'){
           listData.push(commerceItems[i]);
        }
    }
     sortedList= listData.sort(function(a, b){
                return a.sequenceNumber-b.sequenceNumber;
       })  
    return sortedList;
}

const Page = (props) => {
      const site = (props.router && props.router.query && props.router.query.site) || 'myBag';
      let hostname = "";
    //  console.log('props.router.query*****************************',props.router.query)
    //   const dataFromAPICall = require('../../lib/config/datasource/header.json');
      const articleDetails = {
          text: "MyBag Page",
          headerStyle: "a-paragraph__primary"
      };
         let myBag,staticLables,myBagHeaderData,limitedPiecesSkus,configurationData,snbfooterData,departmentData,cartHeaderResponse;
     if(Object.keys(props.myBag).length >0 ){
         myBag = props.myBag;
           myBag.commerceItems = getCards(myBag.commerceItems);
         staticLables = props.staticLables;
         myBagHeaderData = props.myBagHeaderData
         limitedPiecesSkus = props.limitedPiecesSkus
         configurationData = props.configurationData
         snbfooterData = props.snbfooterData
         departmentData = props.departmentData
         cartHeaderResponse=props.cartHeaderResponse
         hostname = props.hostname ||""
     }else{
        myBag = props.router && props.router.query && props.router.query.data && props.router.query.data.cartPageContent || {};
        myBag.commerceItems = getCards(myBag.commerceItems);
        staticLables = myBag && myBag.staticLabels && myBag.staticLabels.staticLabelValues.length ? myBag.staticLabels.staticLabelValues[0].keyValues : {};
        myBagHeaderData = props.router.query && props.router.query.data;
        limitedPiecesSkus = props.router.query && props.router.query.data && props.router.query.data.limitedPiecesSkus || {}
        configurationData = props.router.query && props.router.query.data && props.router.query.data.configurationData || {}
        snbfooterData = props.router.query.data&&props.router.query.data.footerContent&&props.router.query.data.footerContent[0] || {}
        departmentData = props.router.query.data&&props.router.query.data.departmentData || {}
        cartHeaderResponse = props.router.query.data&&props.router.query.data.cartHeader || {}
        hostname = props.router.query.data.hostname || ""
     }
      return (

          <React.Fragment>
                <parentContext.Consumer>
                    {({ handleMobileMenu, headerData, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, updateCartCount }) => (
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="cartPage"
                            departmentData={departmentData}
                            cartHeaderResponse={cartHeaderResponse}
                            updateCartCount={updateCartCount}
                        />
                    )}
                </parentContext.Consumer>
                        <React.Fragment>
                                <parentContext.Consumer>
                                   {({ loginDetails, updateCartCount, onDropdownToggle, dropdownMenu,showModal,activeTab}) => (
                                       <ParentBag showModal={showModal} dropdownMenu={dropdownMenu} onDropdownToggle={onDropdownToggle} headerData={myBagHeaderData}
                                        MyBag={myBag} getCards={getCards} loginDetails={loginDetails} updateCartCount={updateCartCount} staticLables = {staticLables}
                                        limitedPiecesSkus={limitedPiecesSkus}
                                        configurationData={configurationData} hostname ={hostname}
                                        activeTab={activeTab}/>
                                   )}
                                </parentContext.Consumer>

                                {/*{
                                (myBag && (myBag.commerceItems && myBag.commerceItems.length>0) || (myBag.wishlistItem && myBag.wishlistItem.length>0))?
                                    <parentContext.Consumer>
                                        {({ loginDetails, updateCartCount, onDropdownToggle, dropdownMenu,showModal}) => (
                                <MyBag showModal={showModal} dropdownMenu={dropdownMenu} onDropdownToggle={onDropdownToggle} headerData={myBagHeaderData} MyBag={myBag} getCards={getCards} loginDetails={loginDetails} updateCartCount={updateCartCount}/>
                                        )}
                                    </parentContext.Consumer>
                                :<parentContext.Consumer>
                                {({ loginDetails, updateCartCount }) => (
                                <EmptyBag loginDetails={loginDetails} headerData={myBagHeaderData} staticLables = {staticLables} isShow={true} MyBag={myBag}/>
                                )}
                                </parentContext.Consumer>
                                }*/}
                                <parentContext.Consumer>
                                    {({ loginDetails, updateCartCount }) => (
                                        <Footer loginDetails={loginDetails} snbfooterData={snbfooterData}/>
                                    )}
                                </parentContext.Consumer>
                    </React.Fragment>
      </React.Fragment>
      )};

Page.getInitialProps = async ({ req }) => {
   // console.log('initial props')
    const initialPropsData = {
      myBag: {},
      staticLables:{},
      myBagHeaderData:{},
         limitedPiecesSkus:{},
         configurationData:{},
         snbfooterData:{},
         departmentData:{},
         cartHeaderResponse:{}
    };
    if(!req){
       // console.log('initial props 2',cartDetail)
        const cartDetail = await Utility('/tienda/getCartDetails','GET');
        let myBag = cartDetail.data.cartPageContent || {};
        initialPropsData.myBag = myBag
        initialPropsData.staticLables = myBag && myBag.staticLabels && myBag.staticLabels.staticLabelValues.length ? myBag.staticLabels.staticLabelValues[0].keyValues : {};
        initialPropsData.myBagHeaderData = cartDetail.data
            initialPropsData.limitedPiecesSkus = cartDetail.data.limitedPiecesSkus
            initialPropsData.configurationData = cartDetail.data.configurationData
            initialPropsData.snbfooterData = cartDetail.data&&cartDetail.data.footerContent&&cartDetail.data.footerContent[0]
            initialPropsData.departmentData = cartDetail.data.departmentData
            initialPropsData.cartHeaderResponse = cartDetail.data.cartHeaderResponse    
    }
    return initialPropsData;

}

export default withRouter(Page)
