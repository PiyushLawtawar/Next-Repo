import React from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../headerFooter/headerFooter';
import { parentContext } from '../../../contexts/parentContext';


class staticPages extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const _mainContent = this.props.mainContent;
        const htmlData = _mainContent && _mainContent.mainContent && _mainContent.mainContent.staticContent && _mainContent.mainContent.staticContent[0].content;
        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide }) => (
                    <React.Fragment>
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="homepage"
                        />
                        {htmlData &&
                            <div className="a-product__paragraphProductDescription" dangerouslySetInnerHTML={{ __html: htmlData }}></div>
                        }

                        <Footer loginDetails={loginDetails} />
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
export default staticPages;
