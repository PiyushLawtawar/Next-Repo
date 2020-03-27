import React from 'react';

import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import CardsAccount from '../../organisms/CardsAccount/organism-cards-account';
import CardEmpty from '../../organisms/CardsAccount/organism-card-empty';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from    './../../../helpers/config/config';


class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: {},
            data:''
        };
    }

    componentDidMount() {
        this.staticLabels();
    }
    setCardData = cardData => {
        this.setState({ cardData })
    }

    staticLabels = () => {
        let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-creditCardsPage");
        const pageName ="?pageName=pwa-creditCardsPage";
        if (typeof labels === 'undefined' || labels.length === 0) {
        Utility(Path.staticLabelsFetch+pageName, 'GET').then(response => {
            labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
            this.setState({ data: labels })
        }, (error) => {

        });
    }else {
        let _tdata = labels && labels[0].keyValues;
        this.setState({
            data: _tdata
        });
    }
    }
    render() {

        const data = this.state;
        const staticLabels = data && data.data;
        let breadcrumbInfo = {
            label: staticLabels && staticLabels["pwa.creditCardsPage.Tarjetas.label"],
           breadcrumbData: [            
                {
                    "navigationState": "/users/myAccount",
                    "label": staticLabels && staticLabels["pwa.newCreditCardPage.breadCrumbAccount.text"],
                }
            ],
 isMyAccount: true
        };



        const cardData = this.props.cardData;
        return (

            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide,handleleftNavData,leftNavData,setDepartmentData,departmentData,setFooterData, snbfooterData }) => (
                    <React.Fragment>
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="myAccount"
                            setDepartmentData={setDepartmentData}
                            departmentData={departmentData}
                        />

                        <div className="container-fluid o-main-container p-0">
                            <div className="container o-container__secondary">
                                <div className="row d-none d-lg-block m-row-bootstrap">
                                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                <div className="row d-lg-none m-myAccount-aside-title--mobile">
                                    <div className="col-12">
                                        <h1>{staticLabels && staticLabels["pwa.creditCardsPage.Tarjetas.label"]}</h1>
                                    </div>
                                </div>
                                <div className="row mt-lg-3 m-row-bootstrap">
                                    <aside className="col-lg-3 pr-4 m-aside__content">
                                        <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.creditCardsPage.Tarjetas.label"]}/>
                                    </aside>
                                    <div className="col-lg-9 m-column_mainContent">
                                        {cardData && cardData.records !== undefined && !cardData.creditCards ? <CardsAccount staticLabels={staticLabels}  setCardData={this.setCardData} cardData={cardData} cardRecord={this.props.cardRecord} /> : <CardEmpty staticLabels={staticLabels ? staticLabels : ''} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData}/>
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
export default Cards;

