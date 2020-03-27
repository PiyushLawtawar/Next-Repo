
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import { H4 } from "../../atoms/HeadLines/Headlines";
import ContainerBlockBody from './ContainerBlockBody'



class ContainerBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const searchTerm = this.props.searchTerm;
        const emailData = this.props.emailData;
        const loginDetails = this.props.loginDetails;
        const orderDetails = this.props.orderDetails.orderDetails;
        const orderSearched = this.props.orderSearched.order;
        const staticLabels = get(this.props.staticLabels, 'staticLabels.staticLabelValues[0].keyValues', '');
        const SearchedCompare = get(orderSearched, 'deliveryInfo[0].packedList[0].pedidoNumber', '');
        const packageNumber = get(orderSearched, 'deliveryInfo[0].packageNumber', '');
        const SomsSearchedCompare = get(this.props.orderSearched, 'somsOrder.OrderId', '');
        const searchedLabels = get(this.props.orderSearched, 'staticLabels.staticLabelValues[0].keyValues', '');
        // const searchedLabels = this.props.orderSearched.staticLabels.staticLabelValues;        
        const SOMSOrders = this.props && this.props.orderSearched && this.props.orderSearched.somsOrder;
        // console.log('orderDetails--------- before map', this.props.emailData);
        // console.log('kopal--------- before map',  this.props.productDetails);
        
        const IsSomsOrder = SOMSOrders && SOMSOrders.IsSomsOrder;
 
        return (
            <React.Fragment>
                {(loginDetails && loginDetails.LoggedInSession === false) &&  SOMSOrders === '' && (this.props.productDetails === '' || 'undefined')  ?
                    <H4 className="a-order__title" headLineText="Sin pedido realizado">
                    </H4> :
                    IsSomsOrder ? <ContainerBlockBody productDetails={this.props.productDetails}  searchedLabels={searchedLabels} orderDetails={SOMSOrders} loginDetails={this.props.loginDetails} IsSomsOrder={IsSomsOrder} staticLabels={this.props.staticLabels}/>
                        :
                        orderSearched && !IsSomsOrder && ((SearchedCompare === this.props.productDetails) || (orderSearched && orderSearched.cieReferenceNumber === this.props.productDetails) || (packageNumber === this.props.productDetails) || (emailData === this.props.productDetails))? <ContainerBlockBody productDetails={this.props.productDetails} searchedLabels={searchedLabels} orderDetails={orderSearched} loginDetails={this.props.loginDetails} staticLabels={this.props.staticLabels} />
                            :
                            orderDetails && orderDetails.length && orderDetails.map((data, index) => {
                                return <ContainerBlockBody key={index} productDetails={this.props.productDetails} orderDetails={data} loginDetails={this.props.loginDetails} staticLabels={this.props.staticLabels} />
                            })
                }

            </React.Fragment>

        )

    }
}

export default ContainerBlock;


