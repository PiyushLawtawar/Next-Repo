
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Header from '../../organisms/Header/Header';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";
import { parentContext } from '../../../contexts/parentContext';
import Footer from '../headerFooter/headerFooter';
import Router from 'next/router';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import SearchOrderDetails from '../../organisms/OrderCards/searchOrderDetails';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";



class TrackOrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetails: '',
            currentPage: 1
        };
    }

    componentDidMount() {
        this.staticLabels();
    }


    staticLabels = () => {

        let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-trackOrderPage");
        // console.log('labels',labels)
        const pageName = "?pageName=pwa-trackOrderPage";

        if (typeof labels === 'undefined' || labels.length === 0) {
            Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
                labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
                this.setState({ data: labels })
            }, (error) => {
            });
        } else {
            let _tdata = labels && labels[0].keyValues;
            this.setState({
                data: _tdata
            });
        }
    }

    render() {
        const { searchTerm, orderSearched, showUserHistory, alert_status, alert_message, data } = this.state;

        // const orderDetails = this.state;
        const staticLabels = data && data;
        // console.log('data', Data)



        let breadcrumbAnonomus = {
            label: staticLabels && staticLabels["pwa.OrderHistoryPage.orderHistoryPage.lebel"],
            isMyAccount: true
        };

        return (

            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, setFooterData, snbfooterData, departmentData }) => (
                    <React.Fragment>
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            departmentData={departmentData}
                            pageName="myAccount"
                        />
                        <div className="o-content no-shadow -section-title d-flex d-lg-none">
                            <H1 className="a-orders__title" headLineText={staticLabels && staticLabels["pwa.OrderHistoryPage.orderHistoryPage.lebel"]}></H1>
                        </div>
                        <div className="organism container-fluid o-main-container o-one-column">
                            <div className="container p-0">
                                <div className="row d-none d-lg-block">
                                    <Breadcrumb breadcrumbInfo={breadcrumbAnonomus} />
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                <div className="row m-0">

                                    <div className="o-content no-shadow -section-title d-none d-lg-block">
                                        <H1 className="a-orders__title" headLineText={staticLabels && staticLabels["pwa.OrderHistoryPage.orderHistoryPage.lebel"]}>
                                        </H1>
                                    </div>
                                    <SearchOrderDetails loginDetails={loginDetails} currentPage={this.state.currentPage} pageParameterTmp={this.props.pageParameterTmp} staticLabels={staticLabels} />
                                </div>
                            </div>
                        </div>

                        <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
                    </React.Fragment>
                )
                }
            </parentContext.Consumer>
        )

    }
}

export default TrackOrderPage;


