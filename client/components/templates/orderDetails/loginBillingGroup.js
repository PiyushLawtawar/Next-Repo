import React from 'react';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import Alert from "../../molecules/Alert/Alert";
import { parentContext } from '../../../contexts/parentContext';
import { H1 } from "../../atoms/HeadLines/Headlines";
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import OrganismLoginBilling from '../../organisms/OrderDetails/organismLoginBillingGroup';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import MoleculeTitleMenuMyAccount from '../../molecules/TitleMenuMyAccount/moleculeTitleMenuMyAccount';

class loginBillingGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alert_status: false,
            alert_message: '',
            alert_Type: "warning",
        };
    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "warning") => {
        this.setState({ alert_status: true, alert_message, alert_Type });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }

    render() {
        const { alert_status, alert_message, alert_Type } = this.state;
        const TrackingNo = this.props.Router && this.props.Router.TrackingNo;IsSomsOrder
        const IsSomsOrder = this.props.IsSomsOrder;
        const searchTerm = this.props.searchTerm;

        const orderDetails = this.props.orderData;
        const staticLabels = orderDetails && orderDetails.staticLabels && orderDetails.staticLabels.staticLabelValues[0] && orderDetails.staticLabels.staticLabelValues[0].keyValues;
        const somsstaticLabels = orderDetails && orderDetails.staticLabels && orderDetails.staticLabels.staticLabelValues[1] && orderDetails.staticLabels.staticLabelValues[1].keyValues
        // console.log('Router',  searchTerm)
        

        let url = searchTerm ? '/users/orderHistory?SearchOrderDetails=' + true + '&TrackingNo=' + searchTerm : '/users/orderHistory?SearchOrderDetails=' + true + '&TrackingNo=' + TrackingNo;

        let breadcrumbInfo = {
            label: IsSomsOrder ? somsstaticLabels && somsstaticLabels["pwa.orderDetailsPage.orderDetailheader.lbl"] : staticLabels && staticLabels["pwa.orderDetailsPage.orderDetailheader.lbl"],
            breadcrumbData: [
                {
                    "navigationState": url,
                    "label": staticLabels && staticLabels["pwa.OrderHistoryPage.myorder.lable"],
                }
            ],
            isMyAccount: true
        };

        let breadcrumbIoggedIn = {
            label: staticLabels && staticLabels["pwa.orderDetailsPage.orderDetailheader.lbl"],
            breadcrumbData: [
                {
                    "navigationState": "/users/myAccount",
                    "label": 'Mi cuenta',
                },
                {
                    "navigationState": "/users/orderHistory",
                    "label": staticLabels && staticLabels["pwa.OrderHistoryPage.myorder.lable"],
                }
            ],
            isMyAccount: true
        };

        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData, setFooterData, snbfooterData, departmentData}) => (
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

                        <div className="container-fluid o-main-container p-0">
                            <div className="container o-container__secondary">
                                <div className="row d-none d-lg-block m-row-bootstrap">
                                    {loginDetails && loginDetails.LoggedInSession ? <Breadcrumb breadcrumbInfo={breadcrumbIoggedIn} /> : <Breadcrumb breadcrumbInfo={breadcrumbInfo} />}
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                <MoleculeTitleMenuMyAccount title={"Detalle de Compra"} />
                                <div className={loginDetails && loginDetails.LoggedInSession ? "row mt-lg-3 m-row-bootstrap" : "row m-0"}>
                                    {loginDetails && loginDetails.LoggedInSession ?
                                        <aside className="col-lg-3 pr-4 m-aside__content">
                                            <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={"Detalle de compra"} />
                                        </aside>
                                        :
                                        <div className="mt-lg-3">
                                            <H1 className="a-myAccount-aside--title d-none d-lg-block" headLineText="Detalle de compra">
                                            </H1>
                                        </div>}
                                    <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -warning" iconType={"a-alert__icon icon-" + alert_Type} text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                                    <div className={loginDetails && loginDetails.LoggedInSession ? "col-lg-9 m-column_mainContent" : "col col-lg-12 p-0"}>
                                        <OrganismLoginBilling staticLabels={staticLabels} Router={this.props.Router} orderData={this.props.orderData} loginDetails={loginDetails} show_alert={this.show_alert} searchTerm={this.props.searchTerm} IsSomsOrder={this.props.IsSomsOrder} />
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
export default loginBillingGroup;