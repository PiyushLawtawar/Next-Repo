/**
 * Module Name : B&S Module
 * Functionality : This is Common Template Component will help for reder Header, Footer and any one of PDP / Collection / PdpOfferList / Marketplace Profile Pages.
 *                <Header> - will render Header content,
 *                <Footer> - will render Footer Content,
 *                <PDP> - will render Middle content of PDP page,
 *                <Collection> will render Middle content of Collection page,
 *                <PdpOfferList> - will render Middle content of Pdp Offer Listing page.
 *                <MarketplaceProfile> - will render Middle content of Marketplace Profile page.
 * 
 * @exports  : OneColumnPage Page Template.
 * @requires : module:React
 * @requires : module:next/dynamic
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/get
 * 
 * @requires : module:headerFooter/headerFooter#Footer
 * @requires : module:Pdp/Pdp#Pdp
 * @requires : module:organisms/Header/Header#Header
 * @requires : module:contexts/parentContext#parentContext
 * @requires : module:Pdp/PdpOfferList#PdpOfferList
 * @requires : module:Pdp/MarketplaceProfile#MarketplaceProfile
 * @requires : module:Pdp/Collection#Collection
 * Team : B&S Team
 * 
 */
import React from 'react';
import dynamic from 'next/dynamic';
import { Utility } from '../../helpers/utilities/utility';
import { Path } from '../../helpers/config/config';
const Footer = dynamic(() => import('./headerFooter/headerFooter'));
//import Footer from './headerFooter/headerFooter';
const Pdp = dynamic(() => import('./Pdp/Pdp'));
//import Pdp from './Pdp/Pdp'
const ErrorPage = dynamic(() => import('./ErrorPage'));
//import ErrorPage from './ErrorPage';
const Header = dynamic(() => import('../organisms/Header/Header'));
//import Header from '../organisms/Header/Header';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { parentContext } from '../../contexts/parentContext';
const PdpOfferList = dynamic(() => import('./Pdp/PdpOfferList'));
//import PdpOfferList from './Pdp/PdpOfferList';
const MarketplaceProfile = dynamic(() => import('./Pdp/MarketplaceProfile'));
//import MarketplaceProfile from './Pdp/MarketplaceProfile';
const Collection = dynamic(() => import('./Pdp/Collection'));
//import Collection from './Pdp/Collection';
import { GTMallPages } from '../../helpers/utilities/utility';

/**
 * @class OneColumnPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class OneColumnPage extends React.Component {
    constructor(props) {
        super(props);

        const oneColumnData = (props.oneColumnData) || {};
        const headerContent = (props.oneColumnData && props.oneColumnData.headerContent) || {};
        this.state = {
            mainContent: oneColumnData.mainContent,
            pdpType: oneColumnData.mainContent && oneColumnData.mainContent.pdpType || '',
            hostname: oneColumnData.hostname || '',
            url: oneColumnData.url || ''

        };
    }

    /* Production observation 4 fix start  */
    getGTMOnload = () => {
        const data = {
            "actPageTitle": decodeURI(document && document.title || 'Liverpool es parte de Mi vida'),
            "actURL": decodeURI(window.location.href)
        };
        Utility(Path.gtmServiceCall, 'POST', data).then(response => {
            GTMallPages(response.data);
        });
    }
    /* Production observation 4 fix end  */

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps
     * @param {*} nextProps 
     * 
     */
    componentWillReceiveProps(newProps) {
        const currentProductId = this.state.mainContent && this.state.mainContent.productId || '';
        const newPropsProductId = get(newProps, 'oneColumnData.mainContent.productId', '');
        if (currentProductId !== newPropsProductId) {
            /* Production observation 4 fix start  */
            if (!isEmpty(newPropsProductId)) {
                setTimeout(() => { this.getGTMOnload() }, 10)
            }
            /* Production observation 4 fix end  */
            this.setState({
                mainContent: get(newProps, 'oneColumnData.mainContent', {}),
                pdpType: get(newProps, 'oneColumnData.mainContent.pdpType', ''),
                hostname: get(newProps, 'oneColumnData.hostname', ''),
                url: get(newProps, 'oneColumnData.url', '')
            });
        }
    }

    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {
        const pdpType = this.state.pdpType;
        const isCollection = this.props.isCollection || "";
        //const mainContent = this.state.oneColumnData.mainContent; 

        //const pageType = mainContent.contentItem && mainContent.contentItem.contents && mainContent.contentItem.contents[0] && mainContent.contentItem.contents[0]["@type"] || '';

        return (
            <React.Fragment>
                <parentContext.Consumer>
                    {({ handleMobileMenu, headerData, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, updateCartHeaderDetails, backEvent, searchbarClicked, handleSearchBarShow, handleSearchBarHide, labelData, departmentData, configurationData }) => (
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            pageName="pdp"
                            headerData={headerData}
                            labelData={labelData}
                            backEvent={backEvent}
                            searchbarClicked={searchbarClicked}
                            handleSearchBarShow={handleSearchBarShow}
                            handleSearchBarHide={handleSearchBarHide}
                            mainContent={this.state.mainContent}
                            departmentData={departmentData}
                            configurationData={configurationData}
                        />
                    )}
                </parentContext.Consumer>

                <parentContext.Consumer>
                    {({ handleTypeheadHide, loginDetails, showModal, setFooterData, snbfooterData }) => (
                        <div onClick={handleTypeheadHide} className={(pdpType === "default" || pdpType === "hybrid" || pdpType === "optic" || (!isEmpty(isCollection) && isCollection === "true")) ? 'alert-top-defult' : ''}>
                            {pdpType && pdpType === "pdpOfferList" && loginDetails.cartHeaderProcessCompleted &&  //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                <parentContext.Consumer>
                                    {({ updateCartHeaderDetails }) => (
                                        <PdpOfferList mainContent={this.state.mainContent} updateCartHeaderDetails={updateCartHeaderDetails} />
                                    )}
                                </parentContext.Consumer>
                            }

                            {pdpType && pdpType === "MarketplaceProfile" && loginDetails.cartHeaderProcessCompleted && //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                <parentContext.Consumer>
                                    {({ updateCartHeaderDetails }) => (
                                        <MarketplaceProfile mainContent={this.state.mainContent} updateCartHeaderDetails={updateCartHeaderDetails} hostName={this.state.hostname} url={this.state.url} />
                                    )}
                                </parentContext.Consumer>
                            }

                            {/*{pdpType && pdpType === "MarketplaceProfile" &&
                    <MarketplaceProfile mainContent={this.state.mainContent} />
                }*/}


                 
                     { pdpType  &&  (pdpType === "default" || pdpType === "hybrid" || pdpType === "optic") && loginDetails.cartHeaderProcessCompleted && //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                                <parentContext.Consumer>
                                    {({ updateCartHeaderDetails, loginDetails, backEvent, limitedPiecesSkusData, configurationData, closeModal,snbfooterData }) => (
                                        <Pdp mainContent={this.state.mainContent} closeModal={closeModal} updateCartHeaderDetails={updateCartHeaderDetails} loginDetails={loginDetails} backEvent={backEvent} 
                                        hostname={this.state.hostname} url={this.state.url} 
                                        limitedPiecesSkusData={this.props.limitedPiecesSkusData?this.props.limitedPiecesSkusData:limitedPiecesSkusData} configurationData={configurationData}
                                         donotLoad={isEmpty(snbfooterData) } cartHeaderProcessCompleted={loginDetails.cartHeaderProcessCompleted}/>
                                    )}
                                </parentContext.Consumer>
                            
                     }
                
                {!isEmpty(isCollection) && isCollection === "true" && loginDetails.cartHeaderProcessCompleted &&  //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                    <parentContext.Consumer> 
                        {({ updateCartHeaderDetails, loginDetails, backEvent, limitedPiecesSkusData, configurationData }) => (
                            <Collection mainContent={this.state.mainContent} hostname={this.state.hostname} url={this.state.url} updateCartHeaderDetails={updateCartHeaderDetails} loginDetails={loginDetails} backEvent={backEvent} limitedPiecesSkusData={limitedPiecesSkusData} configurationData={configurationData} />
                        )}
                    </parentContext.Consumer>
                }

               
                        <React.Fragment>
                            {
                               loginDetails.cartHeaderProcessCompleted && 
                               <Footer setFooterData={setFooterData} snbfooterData={snbfooterData} loginDetails={loginDetails} />
                               //execute after header to avoid multiple jsession id [Sequence of AJAX Calls performance fix]
                            } 
                            
                            <div className={Object.values(showModal).includes(true) === true ? 'modal-backdrop show' : ''}></div>
                        </React.Fragment>
                    
                 </div>
                  )}
                </parentContext.Consumer>
            </React.Fragment>

        )
    }
}

