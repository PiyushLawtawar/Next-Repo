import React from 'react';
import Header from '../../organisms/Header/Header';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Footer from '../headerFooter/headerFooter';
import { parentContext } from '../../../contexts/parentContext';
import SiteMap from '../../organisms/SiteMap/siteMap';


class SiteMapPage extends React.Component {
       constructor(props) {
        super(props);
    }
    render() {

        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, setFooterData, snbfooterData }) => (
                    <React.Fragment>                                            
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="sitemap"
                        />                        
                            <SiteMap siteMapData={this.props.siteMapData}/>
                        <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
export default SiteMapPage;