
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import Ordersearch from "../../organisms/OrderCards/Ordersearch"


class MyOrdersSearch extends React.Component {


    render() {



        return (

           <Ordersearch searchTerm={this.props.searchTerm} onKeypress={this.props.onKeypress} onChangeSearch={this.props.onChangeSearch} redirectToSearchData={this.props.redirectToSearchData} orderSearched={this.props.orderSearched} staticLabels={this.props.staticLabels}/>
        )

    }
}

export default MyOrdersSearch;


