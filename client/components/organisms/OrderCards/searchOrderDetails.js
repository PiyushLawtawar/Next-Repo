
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";
import { parentContext } from '../../../contexts/parentContext';
import Router from 'next/router';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { PRICEFILTER_VALIDATION } from '../../../config/constants';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import Organismordersearch from '../../organisms/OrderSearch/organism-order-search';
import MyOrderssearch from '../../templates/MyOrders/myOrders-search';
import MyOrdreOrganismContainer from '../Container/MyOrdreOrganismContainer'
import ContainerBlock from '../../organisms/Container/ContainerBlock'



class SearchOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            orderSearched: {},
            alert_status: false,
            alert_message: '',
            showUserHistory: true,
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
        const { searchTerm, showUserHistory } = this.state;
        this.setState({ searchTerm });
        if (searchTerm) {
            const ctl = e.currentTarget;
            if(ctl){
            ctl.setAttribute("style", "visibility:hidden");
            }
            const payload = {
                "trackingNumber": searchTerm
            }

            Utility(Path.orderSearch, 'POST', payload).then(response => {
                 if(ctl){
                (ctl).setAttribute("style", "visibility:visible");
                 }
                // console.log('response',response)                
                if (response && response.data && response.data.code == 500 || response.data.s == 1) {
                    window.scrollTo(0, 0);
                    this.show_alert(response.data.err)
                } else if (response.data.s == 0) {
                    const orderDetails = response.data || {};
                    this.setState({ orderSearched: orderDetails, searchTerm });
                    if (showUserHistory) {
                        this.setState({ showUserHistory: false });
                        let url = '/tienda/users/orderHistory?SearchOrderDetails=' + true + '&TrackingNo=' + searchTerm;
                        // console.log()
                        Router.push(url)
                    }
                }
            }, (error) => {
                 if(ctl){
                ctl.setAttribute("style", "visibility:visible");
                 }
                window.scrollTo(0, 0);
                this.show_alert('Internal server error')
                console.error(error);
            });
        } else {
            Router.push('/tienda/users/trackOrders')
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


    render() {
        const { searchTerm, orderSearched, showUserHistory, alert_status, alert_message } = this.state;
        const staticLabels = this.props.staticLabels;
        const pageParameterTmp = this.props.pageParameterTmp;
        // console.log('orderSearched',pageParameterTmp)

        return (

            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide }) => (
                    <React.Fragment>
                        {/*{showUserHistory ?*/}
                            <React.Fragment>
                                <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                                <MyOrderssearch searchTerm={this.state.searchTerm} onChangeSearch={this.onChangeSearch} redirectToSearchData={(e) => this.redirectToSearchData(e)} staticLabels={staticLabels} orderSearched={orderSearched} onKeypress={this.onKeypress}/>
                            </React.Fragment>

                            {/*:
                            <MyOrdreOrganismContainer pageParameterTmp={this.props.pageParameterTmp} loginDetails={this.props.loginDetails} currentPage={this.props.currentPage} orderDetails={orderSearched} />
                        }*/}
                    </React.Fragment>

                )
                }
            </parentContext.Consumer>
        )

    }
}

export default SearchOrderDetails;


