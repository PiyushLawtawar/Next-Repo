import React from 'react';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Footer from './headerFooter/headerFooter';
import Pdp from './Pdp/Pdp'
import ErrorPage from './ErrorPage';
import Header from '../organisms/Header/Header';
import get from 'lodash/get';
import { parentContext } from '../../../contexts/parentContext';
import PdpOfferList from './Pdp/PdpOfferList';
import MarketplaceProfile from './Pdp/MarketplaceProfile';

export default class OneColumnPage extends React.Component {
    constructor(props) {
        super(props);

        const oneColumnData = (props.oneColumnData) || {};
        const headerContent = (props.oneColumnData && props.oneColumnData.headerContent) || {};
        this.state = {
            mainContent:oneColumnData.mainContent,
            pdpType: oneColumnData.mainContent.pdpType
        };

    }

    render() {
        const pdpType = this.state.pdpType;
        //const mainContent = this.state.oneColumnData.mainContent; 

        //const pageType = mainContent.contentItem && mainContent.contentItem.contents && mainContent.contentItem.contents[0] && mainContent.contentItem.contents[0]["@type"] || '';
        return (
            <React.Fragment>
               <parentContext.Consumer>
                    {({ handleMobileMenu, headerData, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails }) => (
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            pageName="pdp"
                            headerData={headerData}
                            />
                    )}
                </parentContext.Consumer>
                {pdpType && pdpType === "pdpOfferList" &&
                    <PdpOfferList mainContent={this.state.mainContent}/>
                }

                    {pdpType && pdpType === "MarketplaceProfile" &&
                    <MarketplaceProfile mainContent={this.state.mainContent}/>
                }

                {pdpType && (pdpType === "default" || pdpType === "hybrid") &&
                    <Pdp mainContent={this.state.mainContent}/>
                }

                <parentContext.Consumer>
                    {({ showModal,loginDetails }) => (
                        <React.Fragment>
                         <Footer loginDetails={loginDetails}/>
                         <div className={ Object.values(showModal).includes(true) === true  ? 'modal-backdrop show' : ''}></div>
                        </React.Fragment>
                    )}
                </parentContext.Consumer>
            </React.Fragment>
        )
    }
}

