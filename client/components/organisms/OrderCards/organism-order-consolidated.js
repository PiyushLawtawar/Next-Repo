import React from 'react';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Span from '../../atoms/Span/Span';
import Icons from '../../atoms/Icons/Icons';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import MyOrdreOrganismContainer from '../Container/MyOrdreOrganismContainer'


class OrganismOrdersConsolidated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.staticLabels();
    }


    staticLabels = () => {
  
        let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-orderHistoryPage");
        // console.log("pwa-orderHistoryPage", labels)
        const pageName = "?pageName=pwa-orderHistoryPage";

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
        const data = this.state;
        const labels = data && data.data;
        const loginDetails = this.props.loginDetails;
        const orderDetails = this.props.orderDetails;
        const staticLabels = orderDetails && orderDetails.staticLabels && orderDetails.staticLabels.staticLabelValues[0] && orderDetails.staticLabels.staticLabelValues[0].keyValues || labels;

        //  console.log('staticLabels',labels)

        let breadcrumbIoggedIn = {
            label: staticLabels && staticLabels["pwa.OrderHistoryPage.myorder.lable"],
            breadcrumbData: [
                {
                    "navigationState": "/users/myAccount",
                    "label": staticLabels && staticLabels["pwa.OrderHistoryPage.myAccount.lebel"]
                }
            ],
            isMyAccount: true
        };

        let breadcrumbAnonomus = {
            label: staticLabels && staticLabels["pwa.OrderHistoryPage.myorder.lable"],
            isMyAccount: true
        };

        return (
            <React.Fragment>

                <div className={loginDetails && loginDetails.LoggedInSession ? "container-fluid o-main-container p-0" : "organism container-fluid o-main-container o-one-column"}>
                    <div className={loginDetails && loginDetails.LoggedInSession ? "container o-container__secondary" : "container p-0"}>
                        <div className={loginDetails && loginDetails.LoggedInSession ? "row d-none d-lg-block m-row-bootstrap" : "row d-none d-lg-block"}>
                            {loginDetails && loginDetails.LoggedInSession ? <Breadcrumb breadcrumbInfo={breadcrumbIoggedIn} /> : <Breadcrumb breadcrumbInfo={breadcrumbAnonomus} />}
                        </div>
                        <div className="row m-row-bootstrap">
                        </div>
                        <MyOrdreOrganismContainer pageParameterTmp={this.props.pageParameterTmp} staticLabels={staticLabels} loginDetails={loginDetails} currentPage={this.props.currentPage} orderDetails={this.props.orderDetails} />
                    </div>
                </div>

            </React.Fragment>

        )

    }
}

export default OrganismOrdersConsolidated;

