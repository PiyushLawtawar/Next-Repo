
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Icons from '../../atoms/Icons/Icons';
import Link from "../../atoms/Link/Link";
import get from 'lodash/get';
import Organismordersearch from '../../organisms/OrderSearch/organism-order-search';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";


import './organism-order.styl';

class Ordersearch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //     const orderSearched=this.props.orderSearched;
        //     const orderSearchedstaticLabels = get(orderSearched, 'staticLabels.staticLabelValues[0].keyValues', '');
        //    console.log('orderSearched',orderSearchedstaticLabels)

        const staticLabels = this.props.staticLabels;

        return (

            <div className="o-content white-container o-order__searchContainer bordered">
                <div className="m-order__search__title"><span className="a-order__search__title">{staticLabels && staticLabels["pwa.OrderHistoryPage.trackingInput.text"]}</span>
                    <Link className="m-order__search__help" href={staticLabels && staticLabels["pwa.trackOrderPage.condition.text"]}>
                        <Icons className="icon-help" style={{ color: "#333" }} /></Link>
                </div>
                <p className="a-order__search__label">{staticLabels && staticLabels["pwa.OrderHistoryPage.buscar.lable"]}
                </p>
                <Organismordersearch searchTerm={this.props.searchTerm} onKeypress={this.props.onKeypress} onChangeSearch={this.props.onChangeSearch} redirectToSearchData={this.props.redirectToSearchData} staticLabels={staticLabels} />
                <p className="a-order__search__searchBar__error">{staticLabels && staticLabels["pwa.OrderHistoryPage.searchBoxmessage.label"]}</p>
                <p className="a-order__search__label -help">{staticLabels && staticLabels["pwa.OrderHistoryPage.Necesitas.label"]}
                </p>
                <p className="a-order__search__label -light">{staticLabels && staticLabels["pwa.OrderHistoryPage.infotext.label"]}
                </p>
            </div>
        )

    }
}

export default Ordersearch;


