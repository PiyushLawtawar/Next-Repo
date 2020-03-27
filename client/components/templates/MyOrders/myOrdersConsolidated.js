
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Header from '../../organisms/Header/Header';
import Router from 'next/router';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { parentContext } from '../../../contexts/parentContext';
import Footer from '../headerFooter/headerFooter';
import OrganismOrdersConsolidated from '../../organisms/OrderCards/organism-order-consolidated';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";


class MyOrdersConsolidated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetails: this.props.orderDetails,
            currentPage: 1
        };
    }

    getCookie = (name) => {
        var cookieArr = document.cookie.split(";");

        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            if (name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }



    componentDidMount() {

        let logged = this.getCookie('LoggedInSession')
        if (logged === 'TRUE' && this.props && this.props.orderDetails && this.props.orderDetails.errorCode === '1002') {
            Router.push('/tienda/login')
        }
        if (this.props.orderDetails === '') {
            const queryParam = this.props.pageParameterTmp || {};
            const currentPage = (queryParam.page || 1).toString();
            const SearchOrderDetails = queryParam.SearchOrderDetails;
            const SearchOrder = queryParam.SearchOrder;
                    // console.log('SearchOrder is called', SearchOrder)
            
           if(!SearchOrderDetails && !SearchOrder){
                let payload = {
                    "currentPage": currentPage,
                    "noOfItemsPerPage": "5"
                };
                Utility(Path.orderHistory, 'POST', payload).then(response => {
                    const orderDetails = response.data || '';
                    let logged = this.getCookie('LoggedInSession')
                    if (logged === 'TRUE' && orderDetails.errorCode === '1002') {
                        Router.push('/tienda/login')
                    }
                    if (orderDetails) {
                        window.scrollTo(0, 0);
                    }
                    this.setState({ orderDetails, currentPage });
                    // console.log('service is called', orderDetails)

                }, (error) => {
                    //console.log(error);
                });
            
        }
        }
    }
    render() {
        const orderDetails = this.props.orderDetails || this.state.orderDetails;
        // console.log('orderDetails----->', this.props.labelData)

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
                            pageName="OrderHistroy"
                        />

                        <OrganismOrdersConsolidated data={this.props.data} loginDetails={loginDetails} currentPage={this.state.currentPage} orderDetails={orderDetails} pageParameterTmp={this.props.pageParameterTmp} />

                        <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
                    </React.Fragment>
                )
                }
            </parentContext.Consumer>
        )

    }
}

export default MyOrdersConsolidated;


