import React from 'react';

import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import OrganismCellPhoneEmpty from '../../organisms/CellPhone/organismCellPhoneEmpty';

class CellPhoneEmpty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {

        let breadcrumbInfo = {
            label: '',
            breadcrumbData: {}
        };

        return (

            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide,handleleftNavData,leftNavData }) => (
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

                        <div className="container-fluid o-main-container p-0">
                            <div className="container o-container__secondary">
                                <div className="row d-none d-lg-block m-row-bootstrap">
                                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                <div className="row mt-lg-3 m-row-bootstrap">
                                    <aside className="col-lg-3 pr-4 m-aside__content">
                                        <Aside  handleleftNavData={handleleftNavData} leftNavData={leftNavData}/>
                                    </aside>
                                    <OrganismCellPhoneEmpty />
                                </div>
                            </div>
                        </div>
                        <Footer loginDetails={loginDetails} />
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
export default CellPhoneEmpty;

