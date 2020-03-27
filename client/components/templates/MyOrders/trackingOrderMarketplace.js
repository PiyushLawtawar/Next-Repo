import React from 'react';
import Router from 'next/router';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import Footer from '../headerFooter/headerFooter';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import Alert from '../../molecules/Alert/Alert';
import OrganismTrackingOrder from '../../../components/organisms/TrackingOrder/organismTrackingOrder';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { H1 } from "../../atoms/HeadLines/Headlines";

class TrackingOrderMarketplace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alert_status: '',
            alert_message: '',
            success: true,
            alert_Type: '',
        };
        this.searchTerm = ''
    }
    componentDidMount() {
        const router = this.props && this.props.router;

        this.searchTerm = router.TrackingNo;

        this.getTrackingDetails(router);
    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type) => {
        this.setState({ alert_status: true, alert_message, alert_Type });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }

    getTrackingDetails = (router) => {
        let payload = {};
        if (router.packageNumber != null) {
            payload = {
                "skuID": router.skuID,
                "isCieOrders": router.cie,
                "isSinglePackage": router.cie ? true : false,
                "shippingGrpId": router.shippingId,
                "packageNumber": router.packageNumber
            }
        } else {
            payload = {
                "skuID": router.skuID,
                "isCieOrders": router.cie,
                "isSinglePackage": router.cie ? true : false,
                "shippingGrpId": router.shippingId,
            }
        }

        Utility(Path.orderLineItemStatus, 'POST', payload).then(response => {
            // console.log('k--------',response)
            if (response && response.data && response.data.s === '0') {
                const orderLineItemStatus = response.data || {};
                this.setState({ orderSearched: orderLineItemStatus });
            }

            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            }
        }, (error) => {
            console.error(error);
        });
    }

    showMobileTracking = () => {
        const router = this.props && this.props.router;
        if (router.packageNumber != null) {
            Router.push('/tienda/users/trackingOrder?skuID=' + router.skuID + '&cie=' + router.cie + '&shippingId=' + router.shippingId + '&packageNumber=' + router.packageNumber + '&orderId=' + router.orderId + '&mobile');
        } else {
            Router.push('/tienda/users/trackingOrder?skuID=' + router.skuID + '&cie=' + router.cie + '&shippingId=' + router.shippingId + '&orderId=' + router.orderId + '&mobile');

        }
    }

    onCustomerRating = (payload) => {
        const router = this.props && this.props.router;
        Utility(Path.evaluation, 'POST', payload).then(response => {
            if (response && response.data && response.data.s === '0') {
                window.scrollTo(0, 0);
                this.setState({ success: true });
                this.show_alert(response.data.message, "success");
                this.getTrackingDetails(router);
            } else if (response.data && response.data.errorMessage) {
                window.scrollTo(0, 0);
                this.setState({ success: false });
                this.show_alert(response.data.errorMessage, "error");
                this.getTrackingDetails(router);
            }

        }, (error) => {
            console.error("Error ==== :: ", error);
        });
    }

    render() {
        const { alert_status, alert_message, alert_Type } = this.state;
        const TrackingNo = this.props.router && this.props.router.TrackingNo;
        const SomsTrackingNo = this.props.router && this.props.router.shippingId;
        const commerceItems = this.state.orderSearched;
        const staticLabels = commerceItems && commerceItems.staticLabels && commerceItems.staticLabels.staticLabelValues[0] && commerceItems.staticLabels.staticLabelValues[0].keyValues;
        // console.log("TrackingNo==>", staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"])

        let url = TrackingNo ? '/users/orderHistory?SearchOrderDetails=' + true + '&TrackingNo=' + TrackingNo : '/users/orderHistory?SearchOrderDetails=' + true + '&TrackingNo=0' + SomsTrackingNo;



        let breadcrumbInfo = {
            label: staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"],
            breadcrumbData: [
                {
                    "navigationState": url,
                    "label": 'Mis pedidos',
                }
            ],
            isMyAccount: true
        };

        let breadcrumbIoggedIn = {
            label: staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"],
            breadcrumbData: [
                {
                    "navigationState": "/users/myAccount",
                    "label": 'Mi cuenta',
                },
                {
                    "navigationState": "/users/orderHistory",
                    "label": 'Mis pedidos',
                }
            ],
            isMyAccount: true
        };


        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData, setFooterData, snbfooterData, departmentData }) => (
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
                        <main>
                            <Alert {...this.props} alertTopClass={`m-alert__container mdc-snackbar ${this.state.success ? '-success' : '-alert'}`} iconType={"a-alert__icon icon-" + alert_Type} text={this.state.alert_message} alert_status={this.state.alert_status} dismiss_alert={this.dismiss_alert} />
                            <div className="container-fluid o-main-container p-0">
                                <div className="container o-container__secondary">
                                    <div className="row d-none d-lg-block m-row-bootstrap">
                                        {loginDetails && loginDetails.LoggedInSession ? <Breadcrumb breadcrumbInfo={breadcrumbIoggedIn} /> : <Breadcrumb breadcrumbInfo={breadcrumbInfo} />}
                                    </div>
                                    <div className="row m-row-bootstrap">
                                    </div>
                                    <div className={loginDetails && loginDetails.LoggedInSession ? "row mt-lg-3 m-row-bootstrap" : "row m-0"}>
                                        {loginDetails && loginDetails.LoggedInSession ?
                                            <aside className="col-lg-3 pr-4 m-aside__content">
                                                <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"]} />
                                            </aside>
                                            :
                                            <div className="mt-lg-3">
                                                <H1 className="a-myAccount-aside--title d-none d-lg-block" headLineText={staticLabels && staticLabels["pwa.OrderHistoryPage.lineItem.btnLable"]}>
                                                </H1>
                                            </div>}
                                        <OrganismTrackingOrder showMobileTracking={this.showMobileTracking} onCustomerRating={this.onCustomerRating} loginDetails={loginDetails} searchTerm={this.searchTerm} staticLabels={staticLabels} orderSearched={this.state.orderSearched} router={this.props.router} />
                                    </div>
                                </div>
                            </div>
                        </main>
                        <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
                    </React.Fragment>
                )
                }
            </parentContext.Consumer>
        )
    }
}
export default TrackingOrderMarketplace;