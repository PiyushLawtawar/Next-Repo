import React from 'react';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { parentContext } from '../../../contexts/parentContext';
import Pagination from '../../molecules/Pagination/Pagination';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import Icons from '../../atoms/Icons/Icons';
import Alert from "../../molecules/Alert/Alert";
import AsideMyAccount from '../../organisms/Aside/AsideMyAccount';
import Router from 'next/router'
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import { H1, H4 } from "../../atoms/HeadLines/Headlines";
import Organismordersearch from '../../organisms/OrderSearch/organism-order-search';
import { PRICEFILTER_VALIDATION } from '../../../../client/config/constants';
import MyOrderssearch from '../../templates/MyOrders/myOrders-search'
import ContainerBlock from '../../organisms/Container/ContainerBlock'


class MyOrdreOrganismContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            orderSearched: '',
            alert_status: false,
            alert_message: '',
        };
    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message) => {
        this.setState({ alert_status: true, alert_message });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }

    redirectToSearchData = (e) => {
        const { searchTerm } = this.state;
        this.setState({ searchTerm });
        const SearchOrderDetails = this.props.pageParameterTmp && this.props.pageParameterTmp.SearchOrderDetails;
        const SearchOrder = this.props.pageParameterTmp && this.props.pageParameterTmp.SearchOrder;
        const LoggedInSession = this.props.loginDetails && this.props.loginDetails.LoggedInSession;
        // console.log('SearchOrder=>',emailData)
        if (searchTerm) {
            const ctl = e.currentTarget;
            if (ctl) {
                ctl.setAttribute("style", "visibility:hidden");
            }
            const payload = {
                "trackingNumber": searchTerm
            }
            //  console.log("this is service call");                                           
            Utility(Path.orderSearch, 'POST', payload).then(response => {
                if (ctl) {
                    (ctl).setAttribute("style", "visibility:visible");
                }
                // console.log('response-----',response);       
                if (response && response.data && response.data.code == 500 || response.data.s == 1) {
                    window.scrollTo(0, 0);
                    this.show_alert(response.data.err)
                     this.setState({ orderSearched: '' });
                } else if (response.data.s == 0) {
                    const orderDetails = response.data || {};

                    // console.log("SearchOrderDetails ===>", SearchOrderDetails)
                    this.setState({ orderSearched: orderDetails, searchTerm });
                    if (SearchOrderDetails) {
                        let url = '/tienda/users/orderHistory?SearchOrderDetails=' + true + '&TrackingNo=' + searchTerm;
                        Router.push(url)
                        this.setState({ searchTerm: '' });
                    } else {
                        let url = '/tienda/users/orderHistory?SearchOrder=' + true + '&TrackingNo=' + searchTerm;
                        Router.push(url)
                        this.setState({ searchTerm: '' });
                    }
                }
            }, (error) => {
                if (ctl) {
                    ctl.setAttribute("style", "visibility:visible");
                }
                window.scrollTo(0, 0);
                this.show_alert('Internal server error')
                console.error(error);
            });
        } else if (LoggedInSession) {
            Router.push('/tienda/users/orderHistory')
            window.scrollTo(0, 0);
            this.show_alert('Por el  momento no puede ser procesada tu transacción, por favor inténtalo más tarde.')
            this.setState({ orderSearched: '' });
        } else {
            Router.push('/tienda/users/orderHistory?SearchOrder=' + true)
            window.scrollTo(0, 0);
            this.show_alert('Por el  momento no puede ser procesada tu transacción, por favor inténtalo más tarde.')
            this.setState({ orderSearched: '' });
        }
    }

    onChangePage(pager) {
        const currentPage = pager.currentPage || 1;
        let url = '/tienda/users/orderHistory';
        if (currentPage > 1) {
            url = url + '?page=' + currentPage;
        }
        Router.push(url)
    }

    onKeypress = (event) => {
        const { searchTerm } = this.state;
        const code = event.keyCode || event.which;
        const { value } = event.target;
        if (code === 13 && value.length <= 20) {
            this.redirectToSearchData(value);
        }
    }

    onChangeSearch = (e) => {

        let text = e.target.value;
        if (text.match(PRICEFILTER_VALIDATION)) {
            text = text.replace(PRICEFILTER_VALIDATION, '');
        }
        this.setState({ searchTerm: text });
    }

    componentDidMount() {
        const searchTerm = this.props.pageParameterTmp && this.props.pageParameterTmp.TrackingNo || '';
        // console.log('componentDidMount', searchTerm)

        if (searchTerm) {
            const payload = {
                "trackingNumber": searchTerm
            }
            Utility(Path.orderSearch, 'POST', payload).then(response => {
                 if (response && response.data && response.data.code == 500 || response.data.s == 1) {
                    window.scrollTo(0, 0);
                    this.show_alert(response.data.err)
                } else if (response.data.s == 0) {
                const orderDetails = response.data || {};
                this.setState({ orderSearched: orderDetails, searchTerm: '' });
                }
            }, (error) => {
                console.error(error);
            });
        }
    }


    render() {


        const staticLabels = this.props.staticLabels;
        // console.log('staticLabels---',staticLabels && staticLabels["pwa.OrderHistoryPage.noOrder.lebel"])
        const { searchTerm, orderSearched, alert_status, alert_message } = this.state;
        const pageParameterTmp = this.props.pageParameterTmp;
        const productDetails = pageParameterTmp.TrackingNo;
        const SearchOrder = pageParameterTmp.SearchOrder;
        const orderDetails = this.props.orderDetails;
        const emailData = pageParameterTmp &&  pageParameterTmp.TrackingNo;
        
        // const labels = orderDetails && orderDetails.staticLabels && orderDetails.staticLabels.staticLabelValues[0] && orderDetails.staticLabels.staticLabelValues[0].keyValues;
        // console.log('pageParameterTmp---', pageParameterTmp)
        // console.log('email---', emailData)
        
        
        const loginDetails = this.props.loginDetails;

        const paginationClass = {
            UL: "pagination justify-content-md-center justify-content-lg-end m-pagination",
            LI: "page-item",
            aLink: "page-link"
        };

        let productList = [];
        let totalNumRecords = 0;
        let recordsPerPage = 0;
        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData }) => (
                    <React.Fragment>
                        <div className={loginDetails && loginDetails.LoggedInSession ? "row mt-lg-3 m-row-bootstrap" : "row m-0"}>
                            {loginDetails && loginDetails.LoggedInSession ?
                                <aside className="col-lg-3 pr-4 m-aside__content">
                                    <AsideMyAccount handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.OrderHistoryPage.myorder.lable"]} />
                                </aside>
                                : <div className="o-content no-shadow -section-title d-none d-lg-block">
                                    <H1 className="a-orders__title" headLineText={staticLabels && staticLabels["pwa.OrderHistoryPage.myorder.lable"]}>
                                    </H1>
                                </div>
                            }
                            {loginDetails && loginDetails.LoggedInSession ?
                                <React.Fragment>
                                    <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                                    <div className="col-lg-9 m-column_mainContent">
                                        <div className="col-lg-9 p-0" />
                                        <div className="o-order__search">
                                            <div className="o-order__search__title">
                                                <Paragraph className="a-order__search__title">{staticLabels && staticLabels["pwa.OrderHistoryPage.orderNumHeader.lable"]}</Paragraph>
                                            </div>
                                            <Organismordersearch searchTerm={this.state.searchTerm}  onChangeSearch={this.onChangeSearch} redirectToSearchData={(e) => this.redirectToSearchData(e)} onKeypress={this.onKeypress} staticLabels={staticLabels} />
                                            <div className="o-order__search__separator" />
                                        </div>
                                        <H4 className="a-order__title" headLineText={(orderDetails && orderDetails.orderDetails) || orderSearched ? staticLabels && staticLabels["pwa.OrderHistoryPage.sixmnths.lable"] : staticLabels && staticLabels["pwa.OrderHistoryPage.noOrder.lebel"]}>
                                        </H4>
                                        <ContainerBlock productDetails={productDetails} emailData={emailData} searchTerm={this.state.searchTerm} loginDetails={this.props.loginDetails} orderDetails={this.props.orderDetails} orderSearched={orderSearched} staticLabels={staticLabels} />
                                        {pageParameterTmp.SearchOrder ? '' : !isEmpty(orderDetails && orderDetails.orderDetails) ? <Pagination currentPage={Number(orderDetails.currentPage)} totalRecords={Number(orderDetails.totalOrders)} recordsPerPage={Number(orderDetails.itemsPerpage)} paginationClass={paginationClass} onChangePage={this.onChangePage} /> : ''}
                                    </div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                                    <div className="o-order__search">
                                        <div className="o-order__search__title">
                                            <Paragraph className="a-order__search__title">{staticLabels && staticLabels["pwa.OrderHistoryPage.orderNumHeader.lable"]}</Paragraph>
                                        </div>
                                        <Organismordersearch searchTerm={this.state.searchTerm} onChangeSearch={this.onChangeSearch} redirectToSearchData={(e) => this.redirectToSearchData(e)} onKeypress={this.onKeypress} staticLabels={staticLabels}/>
                                        <div className="o-order__search__separator" />
                                    </div>
                                    <ContainerBlock productDetails={productDetails} emailData={emailData} searchTerm={this.state.searchTerm} loginDetails={this.props.loginDetails} orderDetails={this.props.orderDetails} orderSearched={orderSearched} staticLabels={staticLabels} />
                                    {!isEmpty(orderDetails && orderDetails.orderDetails) ? <Pagination currentPage={orderDetails.currentPage} totalRecords={Number(orderDetails.totalOrders)} recordsPerPage={Number(orderDetails.itemsPerpage)} paginationClass={paginationClass} onChangePage={this.onChangePage} /> : ''}
                                </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                )
                }
            </parentContext.Consumer>
        )

    }
}

export default MyOrdreOrganismContainer;

