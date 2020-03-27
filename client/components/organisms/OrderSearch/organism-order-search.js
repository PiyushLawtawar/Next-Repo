import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Searchbar from "../../molecules/Searchbar/Searchbar";
// import { Utility } from './../../../../helpers/utilities/utility';
import { PRICEFILTER_VALIDATION } from '../../../../client/config/constants';
// import { Path } from './../../../helpers/config/config';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";


import './organism-order-search.styl';

class OrganismOrdersSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const staticLabels = this.props.staticLabels;
        // console.log('search bar staticLabels',staticLabels)

        const abc = {
            inputId: 'name',
            nameInput: 'name',
            placeholder: staticLabels && staticLabels["pwa.OrderHistoryPage.searchbarPlaceholder.label"] || staticLabels && staticLabels["pwa.OrderHistoryPage.buscarPedido.lable"],
            cardclass: "card-img-top",
            mtypeahead: "m-typeahead",
            spanClassname: "a-header__topLink popover-session",
            maxLength: '15'
        }
        const { searchTerm } = this.props;

        return (

            <div className="o-order__search__searchBar">
                <div className="m-header__searchBar m-order__search__searchBar gray-shadow m-order__search__input" id="searchInput" className="searchInput">
                    <Searchbar searchclass="m-header__searchBar m-order__search__searchBar gray-shadow m-order__search__input"  type='tel' searchTerm={searchTerm} onChangeSearchbar={this.props.onChangeSearch} onKeypress={this.props.onKeypress} redirectToSearchPage={this.props.redirectToSearchData} placeholder={abc.placeholder} maxLength='20' data={abc} />
                </div>
            </div>
        )

    }
}

export default OrganismOrdersSearch;






