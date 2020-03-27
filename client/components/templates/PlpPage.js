import React from 'react';
import { withRouter } from 'next/router';
import Router from 'next/router';
import { OnImgError, urlConstruction, Utility, UserAgentDetails, logError, logDebug } from '../../helpers/utilities/utility';
import { Path } from '../../helpers/config/config';
import NavPlp from '../organisms/NavPlp/NavPlp';
import BodyPlp from '../organisms/BodyPlp/BodyPlp';
import Aside from '../organisms/Aside/Aside';
import Carousel from '../organisms/Carousel/Carousel';
import Breadcrumb from '../molecules/Breadcrumb/Breadcrumb';
import { parentContext } from '../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import NoResult from '../organisms/NoResult/NoResult';
import ButtonGoTop from '../molecules/ButtonToTop/ButtonGoTop';
import { PRICEFILTER_VALIDATION, MIN_TALLA_COUNT, MIN_MARCAS_COUNT } from '../../config/constants';
import Alert from '../molecules/Alert/Alert';
import { GTMallPages, GetPrice } from '../../helpers/utilities/utility';

class PlpPage extends React.Component {
    constructor(props) {
        super(props);
        const bodyContent = props.plpContent;
        const queryString = props.queryString;
        this.state = {
            bodyContent: bodyContent,
            sortSelected: "",
            listView: false,
            categoryLabelId: '',
            categoryName: '',
            window: {},
            userInput: '',
            filterIds: [],
            price: "price",
            filterLables: [],
            maxPriceFilter: '',
            minPriceFilter: '',
            minTxtBox: false,
            maxTxtBox: false,
            categoryId: '',
            sortLabelId: '',
            page: 1,
            categoryAncestor: {},
            searchTerm: !isEmpty(queryString['s']) ? queryString['s'] : null,
            productComparatorObj: {},
            limited_Pieces: {},
            minTallaCount: MIN_TALLA_COUNT,
            showTallaViewMore: true,
            suggestedSearch: [],
            adjustedSearch: [],
            alert_status: false,
            alert_message: props.staticLabels && props.staticLabels['pwa.plp.warning.text'] || 'pwa.plp.warning.text',
            categoryNameGTM: '',
            showMarcasViewMore: true,
            minMarcasCount: MIN_MARCAS_COUNT,
            departmentoId: {},
            productId: '',
            productName: '',
            agentDetails: {},
            showPriceErrorAlert: false,
            carouselsData: props.carouselsData,
            isSellerPage: false,
            sellerId: '',
            sellerName: '',
            showDynamicFacetOptions: [],
            departmentoFilterChanged: false,
            showCardImage: true
        };

        this.onSortSelect = this.onSortSelect.bind(this);
        this.showGridView = this.showGridView.bind(this);
        this.showListView = this.showListView.bind(this);
        this.changeGridView = this.changeGridView.bind(this);

        this.onChangeColor = this.onChangeColor.bind(this);
        this.onPlusIconOver = this.onPlusIconOver.bind(this);
        this.onColorSectionOut = this.onColorSectionOut.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.onImgError = this.onImgError.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleMinMaxPriceClick = this.handleMinMaxPriceClick.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.onChangeMarcas = this.onChangeMarcas.bind(this);
        this.handleMarcasViewMoreLink = this.handleMarcasViewMoreLink.bind(this);
        this.handleTallaViewMoreLink = this.handleTallaViewMoreLink.bind(this);
        this.setMinMaxPrice = this.setMinMaxPrice.bind(this);
        this.redirectToUrl = this.redirectToUrl.bind(this);
        this.handleCheckboxWap = this.handleCheckboxWap.bind(this);
        this.removeAllFilters = this.removeAllFilters.bind(this);
        this.handleGoToTop = this.handleGoToTop.bind(this);
        this.executeCount = 0;
        this.GTMTrigger = false;
    }

    onChangeColor(e, imgId, imgUrl, pdpUrl) {
        e.stopPropagation();
        const { isDesktop, isIpad, isMobile, isPortrait } = this.state.agentDetails || {};
        if (isMobile || (isIpad && isPortrait)) {
            this.redirectToPdp(pdpUrl);
        } else {
            document.getElementById(imgId).src = imgUrl;
            document.getElementById(imgId + "_").src = imgUrl;
        }
    }

    onPlusIconOver(e) {
        /* e.preventDefault();
        e.stopPropagation();

        try {

            let parentNode = e && e.target && e.target.parentNode || {};

            if (!isEmpty(parentNode) && parentNode.className) {
                if (parentNode.className.indexOf('color-section') == -1) {
                    parentNode = e.target.parentNode.parentNode;
                }
            }
            parentNode.className += ' scroll-left';

        } catch (e) { //console.log(e); } */
    }

    onColorSectionOut(e) {
        /* e.preventDefault();
        e.stopPropagation();

        try {

            let parentNode = e && e.target && e.target.parentNode || {};

            if (!isEmpty(parentNode) && parentNode.className) {
                if (parentNode.className.indexOf('color-section') == -1) {
                    parentNode = e.target.parentNode.parentNode;
                }
            }
            parentNode.classList.remove('scroll-left');

        } catch (e) { //console.log(e); } */

    }

    componentWillReceiveProps(nextProps) {
        this.executeCount = this.executeCount + 1;
        const bodyString = JSON.stringify(this.props.body);
        const SPACase = (bodyString.indexOf('label') > -1 || bodyString.indexOf('s') > -1 || bodyString.indexOf('category') > -1) ? true : false;
        if (!SPACase && this.executeCount === 3) {
            this.getUpdatedData()
        }
        if (nextProps.plpContent !== this.props.plpContent) {
            this.setState({ showCardImage: false });
            this.setState({ bodyContent: nextProps.plpContent }, () => { this.getUpdatedData(), this.gtmDataCollect() });
        }
        if (nextProps.carouselsData !== this.props.carouselsData) {
            this.setState({ carouselsData: nextProps.carouselsData });
        }
    }

    componentDidMount() {
        this.getUpdatedData();
        this.gtmDataCollect();
    }

    gtmDataCollect = () => {
        let totalNumRecords = 0;
        const mainContent = this.state.bodyContent.contentItem && this.state.bodyContent.contentItem.contents && this.state.bodyContent.contentItem.contents[0] && this.state.bodyContent.contentItem.contents[0]['mainContent'] || {};
        const secondaryData = this.state.bodyContent;
        var display_Cat_name = get(secondaryData, 'contentItem.contents[0].secondaryContent[0].refinementCrumbs[0].properties.["category.displayName"]', '');
        this.setState({ categoryNameGTM: display_Cat_name });
        let productsGTM = [];
        !isEmpty(mainContent) && map(mainContent, (mainItem, index) => {
            if (mainItem['@type'] === 'ContentSlotMain' && mainItem.contents.length > 0 && mainItem.contents[0]['@type'] === 'ResultsList') {
                if (productsGTM.length == 0) {
                    productsGTM = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records || [];
                }
            }
        });

        this.productListcompare = productsGTM;
        const enableGtmFlag = (this.props.plpContent && this.props.plpContent.flags) ? this.props.plpContent.flags['gtmflag'] : true;
        if (enableGtmFlag) {
            // if(this.props.loginDetails.cartHeaderProcessCompleted && !this.GTMTrigger){
            //     this.GTMTrigger = true;
            this.gtmConfig('onload', productsGTM, display_Cat_name, totalNumRecords)
            // }

        }
    }

    getUpdatedData = () => {
        this.Limited_pieces_skus();
        let categoryLabelId = "";
        let categoryName = "";
        let minPriceFilter = 0;
        let maxPriceFilter = 0;
        let categoryId = '';
        const filterIds = [];
        const filterLables = [];
        let sortLabelId = '';
        let categoryAncestor = this.state.categoryAncestor;
        let searchTerm = this.state.searchTerm;
        let sortSelected = '';
        let suggestedSearch = this.state.suggestedSearch;
        let adjustedSearch = this.state.adjustedSearch;
        let departmentoId = {};
        let totalNumRecords = 0;
        let productId = '';
        let productName = '';
        let isSellerPage = false;
        let sellerId = '';
        let sellerName = '';
        !isEmpty(this.state.bodyContent) && this.state.bodyContent.contentItem && this.state.bodyContent.contentItem.contents && this.state.bodyContent.contentItem.contents[0] ?
            map(this.state.bodyContent.contentItem.contents[0].secondaryContent, (items) => {
                if (items['@type'] === 'Breadcrumbs' && !isEmpty(items.refinementCrumbs)) {
                    if (isEmpty(searchTerm)) {
                        categoryLabelId = items.refinementCrumbs[0].properties.dimensionValueId;
                        categoryName = items.refinementCrumbs[0].label;
                        categoryId = items.refinementCrumbs[0].properties['category.repositoryId'];
                        filterIds.push(categoryLabelId);
                        departmentoId['categoryId'] = categoryId;
                    }
                    map(items.refinementCrumbs, (crumbsItem) => {
                        if (!isEmpty(crumbsItem.ancestors)) {
                            const ancestors = crumbsItem.ancestors
                            const ancestorLen = ancestors.length;
                            categoryAncestor['label'] = ancestors[ancestorLen - 1].label;
                            categoryAncestor['id'] = ancestors[ancestorLen - 1]['properties']['category.repositoryId'];
                        }
                    });
                }
                if (items['@type'] === 'GuidedNavigation') {
                    map(items.navigation, (item) => {
                        map(item.refinements, (refinement) => {
                            if (!isEmpty(refinement.properties.selected) && refinement.properties.selected) {
                                filterIds.push(refinement.properties.dimensionValueId);
                                filterLables.push({ label: refinement.label, id: refinement.properties.dimensionValueId, dimensionName: item.dimensionName, facetName: item.name, count: refinement.count });
                            }
                        })
                    })
                }
            }) : null;
        !isEmpty(this.state.bodyContent) && this.state.bodyContent.contentItem && this.state.bodyContent.contentItem.contents && this.state.bodyContent.contentItem.contents[0] ?
            map(this.state.bodyContent.contentItem.contents[0].mainContent, (item) => {
                if (item['@type'] === 'ContentSlotMain' && item.contents.length > 0 && item.contents[0]['@type'] === 'ResultsList') {
                    maxPriceFilter = Math.round(Number(item.contents[0].maximumResultListPrice)).toString();
                    minPriceFilter = Math.round(Number(item.contents[0].minimumResultListPrice)).toString();
                    map(item.contents[0].sortOptions, (sortOption) => {
                        if (sortOption.selected) {
                            let navState = sortOption.navigationState;
                            navState = navState.split('Ns=')[1].split('&')[0];
                            sortLabelId = navState;
                            sortSelected = sortOption.label;
                        }
                    })
                }
                if (item['@type'] === 'SearchAdjustments') {
                    searchTerm = item.originalTerms && item.originalTerms[0] || '';
                    suggestedSearch = !isEmpty(item.suggestedSearches) ? get(item.suggestedSearches, searchTerm, '') : '';
                    adjustedSearch = !isEmpty(item.adjustedSearches) ? get(item.adjustedSearches, searchTerm, '') : '';
                }
            }) : null;
        const mainContent = this.state.bodyContent.contentItem && this.state.bodyContent.contentItem.contents && this.state.bodyContent.contentItem.contents[0] && this.state.bodyContent.contentItem.contents[0]['mainContent'] || {};
        let recordsPerpage = 0;
        let firstRecNum = 0;
        let page = this.state.page;
        !isEmpty(mainContent) && map(mainContent, (mainItem) => {
            if (mainItem['@type'] === 'ContentSlotMain' && mainItem.contents.length > 0 && mainItem.contents[0]['@type'] === 'ResultsList') {
                isSellerPage = get(mainItem, 'contents[0].isSellerListing', false);
                sellerId = get(mainItem, 'contents[0].sellerId', '');
                sellerName = get(mainItem, 'contents[0].plpSellerName', '');
                if (isSellerPage === 'true' || isSellerPage === true) {
                    isSellerPage = true
                } else {
                    isSellerPage = false;
                }
                recordsPerpage = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].recsPerPage || recordsPerpage;
                firstRecNum = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].firstRecNum || firstRecNum;
                totalNumRecords = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].totalNumRecs || totalNumRecords;
                // if (totalNumRecords === 1) {
                productId = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].productId && mainItem.contents[0].records[0].productId[0] || "";
                productName = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records && mainItem.contents[0].records && mainItem.contents[0].records[0] && mainItem.contents[0].records[0].productDisplayName && mainItem.contents[0].records[0].productDisplayName[0] || "";
                if (!isEmpty(productName) && !isEmpty(productId)) {
                    productName = productName.toLowerCase();
                    productName = productName.replace(/ /g, '-');
                }
                // }
                page = Math.ceil(firstRecNum / recordsPerpage);
            }
        });
        this.setState({ categoryLabelId, categoryName, filterIds, filterLables, maxPriceFilter, minPriceFilter, categoryId, sortLabelId, page, categoryAncestor, searchTerm, sortSelected, suggestedSearch, adjustedSearch, departmentoId, productName, productId, isSellerPage, sellerId, sellerName, showCardImage: true });
        this.props.setMinMaxPriceInPlp(minPriceFilter, 'min-price-filter');
        this.props.setMinMaxPriceInPlp(maxPriceFilter, 'max-price-filter');
        const agentDetails = UserAgentDetails(window);
        this.setState({
            window: window,
            agentDetails
        });
        const { isDesktop } = UserAgentDetails(window);
        if (isDesktop) {
            this.goToTop();
        }
    }
    gtmConfig = (triggerPoint, products, display_Cat_name, totalNumRecords) => {
        const enableGtmFlag = (this.props.bodyContent && this.props.bodyContent.flags) ? this.props.bodyContent.flags['gtmflag'] : true;
        let splitVariable = [];
        let gtmObject = {
            "productImpression": null,
            "moreProductImpression": null,
            "searchTerm": null,
            "productClick": null,
            "user": null
        }
        let search = '';
        let list = '';
        if (window) {
            search = window.location.search.toString();
        };

        list = this.catName ? display_Cat_name : '';
        const { queryString } = this.props;
        if (search.indexOf("?s=") > -1) {
            list = 'searchResults-' + queryString['s'];
            this.catName = queryString['s'];
        }
        // else if(this.catName){
        //     list = display_Cat_name;
        // }

        let getSellerName = window && window.location && window.location.host;
        let sellerNameHardCode = '';
        if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'Liverpool'; // production observation#22
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteen') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'Liverpool'; // production observation#22
            }
        }

        if (triggerPoint === 'onload') {
            this.productListDataForGTM = [];
            this.productListDataForGTMBatch2 = [];
            let productCount = 0;
            if (products.length < 15) {
                productCount = products.length;
            } else {
                productCount = 15;
            }

            if (products) {
                for (var i = 0; i < products.length; i++) {
                    let numRecords = products[i] && products[i].numRecords || 0;
                    const groupType = products[i] && products[i]["groupType"] && products[i]["groupType"][0] || "";
                    if (groupType === 'Collection' || groupType === 'MAC Collection') {
                        numRecords = 2;
                    }
                    const priceData = {
                        list: (products[i]["sku.listPrice"] && products[i]["sku.listPrice"][0]) || "",
                        sale: (products[i]["sku.salePrice"] && products[i]["sku.salePrice"][0]) || "",
                        promo: (products[i]["promoPrice"] && products[i]["promoPrice"][0]) || "",
                        minList: (products[i]["minimumListPrice"] && products[i]["minimumListPrice"][0]) || "",
                        maxList: (products[i]["maximumListPrice"] && products[i]["maximumListPrice"][0]) || "",
                        minPromo: (products[i]["minimumPromoPrice"] && products[i]["minimumPromoPrice"][0]) || "",
                        maxPromo: (products[i]["maximumPromoPrice"] && products[i]["maximumPromoPrice"][0]) || "",
                        numRecords: numRecords
                    };
                    const priceToShow = GetPrice(priceData);
                    let metric2 = '';
                    let showPrice='';
                    if(priceToShow.discount && priceToShow.discount.val && priceToShow.discount.decimal){
                        showPrice =priceToShow.discount.val +'.'+ priceToShow.discount.decimal;
                        metric2 = showPrice;
                    }
                    else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange){
                        showPrice = priceToShow.rangeDiscount.noRange.val +'.'+ priceToShow.rangeDiscount.noRange.decimal;
                        metric2 = showPrice;
                    }
                    else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.min){
                        showPrice = priceToShow.rangeDiscount.min.val +'.'+priceToShow.rangeDiscount.min.decimal;
                        metric2 = showPrice;
                    }
                    else if(priceToShow.price){
                        showPrice = priceToShow.price.val +'.'+priceToShow.price.decimal;
                    }
                    else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
                        showPrice = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
                    }
                    else if(priceToShow.rangePrice && priceToShow.rangePrice.min){
                        showPrice = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
                    }                
                    if(priceToShow.price){
                        metric2 = priceToShow.price.val +'.'+priceToShow.price.decimal;
                    }
                    else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
                        metric2 = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
                    }
                    else if(priceToShow.rangePrice && priceToShow.rangePrice.min){
                        metric2 = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
                    }                                
                    var objProduct = {};
                    objProduct.brand = products[i] && products[i]["product.brand"] && products[i]["product.brand"][0] ? products[i]["product.brand"][0] : "";
                    objProduct.category = this.catName || "";
                    objProduct.dimension36 = products[i] && products[i].sellerName && products[i].sellerName[0] && products[i].isMarketPlace && products[i].isMarketPlace[0] === 'true' ? 'Market Place -' + products[i].sellerName[0] : sellerNameHardCode;
                    objProduct.id = products[i] && products[i].productId && products[i].productId[0] || "";
                    objProduct.list = list + '|principal';
                    objProduct.name = products[i] && products[i].productDisplayName && products[i].productDisplayName[0];
                    objProduct.position = i + 1;
                    objProduct.price = showPrice && showPrice.toString().replace(/,/g,'') || '';
                    objProduct.variant = "N/A";
                    objProduct.metric3 = products[i] && products[i].promoPrice && products[i] && products[i].promoPrice[0].toString() || '';
                    objProduct.metric2 = metric2 && metric2.toString().replace(/,/g,'') || '';
                    this.productListDataForGTM.push(objProduct);
                }

                do {
                    splitVariable.push(this.productListDataForGTM.splice(0, 15))
                } while (this.productListDataForGTM.length > 0);

            }

            if (enableGtmFlag) {
                for (var i = 0; i < splitVariable.length; i++) {
                    dataLayer.push({
                        event: "productImpression",
                        ecommerce: {
                            impressions: splitVariable[i]
                        }
                    });
                }
            }


        } else if (triggerPoint === 'click') {
            const result = this.productListcompare.filter(p => p.productId[0] === products);
            /*// production observation#22 */
            let resultDimension36 = result && result[0] && result[0].sellerName && result[0].sellerName[0] || '';
            if(result && result[0] && result[0].sellerName &&  result[0].sellerName.length > 1  ){
                  resultDimension36 = sellerNameHardCode;
            }else{
                resultDimension36 = result && result[0] && result[0].sellerName && result[0].sellerName[0] || ''
            }
            /*// production observation#22 */
            let clickedProductIndex = 0;
            if (products) {
                for (var i = 0; i < this.productListcompare.length; i++) {
                    if (this.productListcompare[i].productId[0] === products) {
                        clickedProductIndex = i + 1;
                    }
                }
            }
            let numRecords = result[0] && result[0].numRecords || 0;
            const groupType = result[0] && result[0]["groupType"] && result[0]["groupType"][0] || "";
            if (groupType === 'Collection' || groupType === 'MAC Collection') {
                numRecords = 2;
            }
            const priceData = {
                list: (result[0]["sku.listPrice"] && result[0]["sku.listPrice"][0]) || "",
                sale: (result[0]["sku.salePrice"] && result[0]["sku.salePrice"][0]) || "",
                promo: (result[0]["promoPrice"] && result[0]["promoPrice"][0]) || "",
                minList: (result[0]["minimumListPrice"] && result[0]["minimumListPrice"][0]) || "",
                maxList: (result[0]["maximumListPrice"] && result[0]["maximumListPrice"][0]) || "",
                minPromo: (result[0]["minimumPromoPrice"] && result[0]["minimumPromoPrice"][0]) || "",
                maxPromo: (result[0]["maximumPromoPrice"] && result[0]["maximumPromoPrice"][0]) || "",
                numRecords: numRecords
            };
            const priceToShow = GetPrice(priceData);
            let metric2 = '';
            let showPrice='';
            if(priceToShow.discount && priceToShow.discount.val && priceToShow.discount.decimal){
                showPrice =priceToShow.discount.val +'.'+ priceToShow.discount.decimal;
                metric2 = showPrice;
            }
            else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange){
                showPrice = priceToShow.rangeDiscount.noRange.val +'.'+ priceToShow.rangeDiscount.noRange.decimal;
                metric2 = showPrice;
            }
            else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.min){
                showPrice = priceToShow.rangeDiscount.min.val +'.'+priceToShow.rangeDiscount.min.decimal;
                metric2 = showPrice;
            }
            else if(priceToShow.price){
                showPrice = priceToShow.price.val +'.'+priceToShow.price.decimal;
            }
            else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
                showPrice = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
            }
            else if(priceToShow.rangePrice && priceToShow.rangePrice.min){
                showPrice = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
            }                
            if(priceToShow.price){
                metric2 = priceToShow.price.val +'.'+priceToShow.price.decimal;
            }
            else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
                metric2 = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
            }
            else if(priceToShow.rangePrice && priceToShow.rangePrice.min){
                metric2 = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
            }                                
            let clickEventOnGTM = {
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'actionField': {
                            'list': list + '|principal'
                        },
                        'products': [{
                            name: result && result[0] && result[0].productDisplayName && result[0].productDisplayName[0] || '',
                            id: result && result[0] && result[0].productId && result[0].productId[0] || '',
                            category: this.catName || "",
                            variant: 'N/A',
                            brand: result && result[0] && result[0]['product.brand'] && result[0]['product.brand'][0] || '',
                            price: showPrice && showPrice.toString().replace(/,/g,'') || '',
                            position: clickedProductIndex || '',
                            dimension36: (result && result[0] && result[0].isMarketPlace && result[0].isMarketPlace[0] === 'true' ? 'Market Place -' + resultDimension36 : resultDimension36) || sellerNameHardCode, //CD 36
                            metric2: metric2 && metric2.toString().replace(/,/g,'') || '', //M2
                            metric3: result && result[0] && result[0].promoPrice && result[0].promoPrice[0] || '',//M3
                        }]
                    }
                }
            };

            dataLayer.push(clickEventOnGTM);
        }

    }


    goToTop = () => {
        window.onscroll = () => {
            if (document.getElementById("goToTop") !== null && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
                document.getElementById("goToTop").style.display = "block";
            } else {
                if (document.getElementById("goToTop") !== null) {
                    document.getElementById("goToTop").style.display = "none";
                }
            }
        }
    }

    handleGoToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    onSortSelect(selectedVal, navState = null) {
        const { categoryName, filterIds, minPriceFilter, maxPriceFilter, searchTerm, isSellerPage, sellerId, sellerName } = this.state;
        const { queryString, onDropdownToggle } = this.props;
        if (navState !== null) {
            if (navState.indexOf('?') !== -1) {
                const param = navState.split('Ns=')[1].split('&')[0];
                const pageNum = !isEmpty(queryString['page']) ? queryString['page'] : null;
                if (!isEmpty(queryString['Nf'])) {
                    if (!isEmpty(queryString['s'])) {
                        const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, pageNum, minPriceFilter, maxPriceFilter, null, param, searchTerm);
                        Router.push(href, asInfo);
                    } else {
                        const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, pageNum, minPriceFilter, maxPriceFilter, null, param);
                        Router.push(href, asInfo);
                    }
                } else {
                    if (!isEmpty(queryString['s'])) {
                        const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, pageNum, null, null, null, param, searchTerm);
                        Router.push(href, asInfo);
                    } else {
                        const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, pageNum, null, null, null, param);
                        Router.push(href, asInfo);
                    }
                }
                onDropdownToggle();
                this.setState({ sortLabelId: param });
            }
            this.getGTMforSorting(selectedVal);
        }
        this.setState({
            sortSelected: selectedVal
        })
    }

    showGridView() {
        const { togglePlpListView } = this.props;
        this.setState({
            listView: false
        })
        togglePlpListView(false);
    }

    showListView() {
        const { togglePlpListView } = this.props;
        this.setState({
            listView: true
        })
        togglePlpListView(true);
    }

    changeGridView() {
        const { togglePlpListView, plpListView } = this.props;
        if (plpListView) {
            this.setState({
                listView: false
            })
            togglePlpListView(false);
        } else {
            this.setState({
                listView: true
            })
            togglePlpListView(true);
        }
    }

    onChangeMarcas = e => {
        const userInput = e.currentTarget.value;
        this.setState({
            userInput
        });
    };

    handleOptions = (event, filterBy, channel = 'web') => {
        let showDynamicFacetOptions = this.state.showDynamicFacetOptions;
        if (channel === 'wap') {
            if (showDynamicFacetOptions.indexOf(filterBy) === -1) {
                showDynamicFacetOptions = [];
                showDynamicFacetOptions.push(filterBy);
            } else {
                showDynamicFacetOptions = [];
            }
        } else {
            if (showDynamicFacetOptions.indexOf(filterBy) === -1) {
                showDynamicFacetOptions.push(filterBy);
            } else if (showDynamicFacetOptions.indexOf(filterBy) !== -1) {
                showDynamicFacetOptions = showDynamicFacetOptions.filter(item => item !== filterBy);
            }
        }
        this.setState({ showDynamicFacetOptions });
    }

    redirectToUrl(page = null) {
        const { filterIds, categoryName, minPriceFilter, maxPriceFilter, categoryId, sortLabelId,  isSellerPage, sellerId, sellerName } = this.state; //fixes for bug id 24450
        const { queryString } = this.props;
        let searchTerm = queryString && !isEmpty(queryString['s']) && queryString['s'] || this.state.searchTerm || ""; // fixes for bug id 24450
        if (!isEmpty(queryString['Nf']) && !isEmpty(queryString['Ns'])) {
            if (!isEmpty(queryString['s'])) {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, page, minPriceFilter, maxPriceFilter, null, sortLabelId, searchTerm);
                Router.push(href, asInfo);
            } else {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, page, minPriceFilter, maxPriceFilter, null, sortLabelId);
                Router.push(href, asInfo);
            }
        } else if (!isEmpty(queryString['Nf'])) {
            if (!isEmpty(queryString['s'])) {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, page, minPriceFilter, maxPriceFilter, null, null, searchTerm);
                Router.push(href, asInfo);
            } else {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, page, minPriceFilter, maxPriceFilter, null);
                Router.push(href, asInfo);
            }
        } else if (!isEmpty(queryString['Ns'])) {
            if (!isEmpty(queryString['s'])) {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, page, null, null, null, sortLabelId, searchTerm);
                Router.push(href, asInfo);
            } else {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, page, null, null, null, sortLabelId);
                Router.push(href, asInfo);
            }
        } else if (!isEmpty(sortLabelId)) {
            if (!isEmpty(queryString['s'])) {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, page, null, null, null, sortLabelId, searchTerm);
                Router.push(href, asInfo);
            } else {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, page, null, null, null, sortLabelId);
                Router.push(href, asInfo);
            }
        } else {
            if (!isEmpty(queryString['s'])) {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, page, null, null, null, null, searchTerm)
                Router.push(href, asInfo);
            } else {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, page);
                Router.push(href, asInfo);
            }
        }
    }

    handleCheckboxWap(items) {
        let { filterIds, filterLables, searchTerm, productId, productName } = this.state;
        let id = 'mobile-' + items.id;
        let labelName = items.label;
        let dimensionName = items.dimensionName;
        let count = items.count;
        const facetName = items.facetName;
        let goToPdp = false;
        const element = document.getElementById(id);
        if (!isEmpty(searchTerm)) {
            if (filterIds.length > 0) {
                goToPdp = false;
            } else {
                goToPdp = true;
            }
        } else {
            if (filterIds.length > 1) {
                goToPdp = false;
            } else {
                goToPdp = true;
            }
        }
        if (id.indexOf('mobile-') !== -1) {
            id = id.replace('mobile-', '');
        }
        if (element && filterIds.indexOf(id) === -1) {
            filterIds.push(id);
            filterLables.push(items);
        } else {
            filterIds = filterIds.filter(item => item !== id);
            filterLables = filterLables.filter(item => item.label !== labelName);
        }
        // if(goToPdp && count == 1 && !isEmpty(productId) && !isEmpty(productName)) {
        //     const url = `/tienda/pdp/${productName}/${productId}`;
        //     this.setState({ filterIds, filterLables });
        //     Router.push(url);
        // } else {
        //     this.setState({ filterIds, filterLables }, this.redirectToUrl); 
        // }
        this.handleGoToTop(); //observation 21 fix
        const gtmData = { 'dimensionName': dimensionName, 'param': null, 'filterLables': filterLables, 'facetName': facetName };
        this.getGtMforFacets(gtmData);
        this.setState({ filterIds, filterLables }, this.redirectToUrl);
    }

    handleCheckbox(items) {
        let { filterIds, categoryName, minPriceFilter, maxPriceFilter, categoryId, sortLabelId, productId, productName, searchTerm } = this.state;
        let { filterLables } = this.state;
        let id = items.id;
        let labelName = items.label;
        let dimensionName = items.dimensionName;
        let count = items.count;
        const facetName = items.facetName;
        const element = document.getElementById(id);
        let goToPdp = false;
        if (!isEmpty(searchTerm)) {
            if (filterIds.length > 0) {
                goToPdp = false;
            } else {
                goToPdp = true;
            }
        } else {
            if (filterIds.length > 1) {
                goToPdp = false;
            } else {
                goToPdp = true;
            }
        }
        if (element && filterIds.indexOf(id) === -1) {
            filterIds.push(id);
            filterLables.push(items);
        } else {
            filterIds = filterIds.filter(item => item !== id);
            filterLables = filterLables.filter(item => item.label !== labelName);
        }
        // if(goToPdp && count == 1 && !isEmpty(productId) && !isEmpty(productName)) {
        //     const url = `/tienda/pdp/${productName}/${productId}`;
        //     this.setState({ filterIds, filterLables });
        //     Router.push(url);
        // } else {
        //     this.setState({ filterIds, filterLables }, this.redirectToUrl);
        // }
        this.handleGoToTop(); //observation 21 fix
        this.setState({ filterIds, filterLables }, this.redirectToUrl);
        const gtmData = { 'dimensionName': dimensionName, 'param': null, 'filterLables': filterLables, 'facetName': facetName };
        this.getGtMforFacets(gtmData);
    }

    removeAllFilters(e) {
        e.preventDefault();
        const { categoryName, categoryId, searchTerm, filterIds, isSellerPage, sellerId, sellerName } = this.state;
        const clearFilter = !isEmpty(searchTerm) ? filterIds.length > 0 ? true : false : filterIds.length > 1 ? true : false;
        if (clearFilter) {
            if (isEmpty(searchTerm)) {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, null, null, null, null, categoryId);
                Router.push(href, asInfo);
            } else {
                const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, null, null, null, null, null, null, searchTerm);
                Router.push(href, asInfo);
            }
        }
    }

    handleButton(items) {

        let { filterIds, categoryName, minPriceFilter, maxPriceFilter, categoryId, sortLabelId, categoryLabelId, categoryAncestor, productId, productName, searchTerm, isSellerPage, sellerId, sellerName } = this.state;
        let { filterLables } = this.state;
        let id = items.id;
        let labelName = items.label;
        let dimensionName = items.dimensionName;
        const facetName = items.facetName;
        let count = items.count;
        const element = document.getElementById(id);
        let goToPdp = false;
        if (!isEmpty(searchTerm)) {
            if (filterIds.length > 0) {
                goToPdp = false;
            } else {
                goToPdp = true;
            }
        } else {
            if (filterIds.length > 1) {
                goToPdp = false;
            } else {
                goToPdp = true;
            }
        }
        if (element && filterIds.indexOf(id) === -1) {
            filterIds.push(id);
            filterLables.push(items);
        } else {
            filterIds = filterIds.filter(item => item !== id);
            filterLables = filterLables.filter(item => item.label !== labelName);
        }
        // if(goToPdp && count == 1 && !isEmpty(productId) && !isEmpty(productName)) {
        //     const url = `/tienda/pdp/${productName}/${productId}`;
        //     this.setState({ filterIds, filterLables });
        //     Router.push(url);
        // }
        this.handleGoToTop(); //observation 21 fix
        if (categoryLabelId !== id) {
            this.setState({ filterIds, filterLables }, this.redirectToUrl);
        } else {
            const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryAncestor.label, null, null, null, null, categoryAncestor.id);
            Router.push(href, asInfo);
        }
        const gtmData = { 'dimensionName': dimensionName, 'param': null, 'filterLables': filterLables, 'facetName': facetName };
        this.getGtMforFacets(gtmData);
    }

    getGtMforFacets = (gtmData) => {
        const { searchTerm, categoryName } = this.state;
        const { facetName, dimensionName, param, filterLables } = gtmData;
        let gtmLabels = '';
        map(filterLables, (item) => {
            if (item.dimensionName === dimensionName) {
                gtmLabels = gtmLabels + '_' + item.label;
            }
        })
        gtmLabels = gtmLabels.substr(1, gtmLabels.length);
        let dimension = '';
        if (!isEmpty(searchTerm)) {
            dimension = `Búsqueda: ${searchTerm}`;
        } else {
            dimension = `Categoría: ${categoryName}`;
        }
        if (dimensionName === 'PriceRange') {
            dataLayer.push({
                'event': 'filtroPLP',
                'filtroUsado': dimensionName,
                'valorFiltro': param,
                'dimension39': dimension
            });
        } else {
            dataLayer.push({
                'event': 'filtroPLP',
                'filtroUsado': facetName,
                'valorFiltro': gtmLabels,
                'dimension39': dimension
            });
        }
    }

    getGTMforSorting = (sortName) => {
        const { searchTerm, categoryName } = this.state;
        let dimension = '';
        if (!isEmpty(searchTerm)) {
            dimension = `Búsqueda: ${searchTerm}`;
        } else {
            dimension = `Categoría: ${categoryName}`;
        }

        dataLayer.push({
            'event': 'ordenPLP',
            '‘sortUsado’': sortName,
            'dimension39': dimension
        });

    }

    handleMarcasViewMoreLink() {
        this.setState({
            showMarcasViewMore: !this.state.showMarcasViewMore
        });
    }
    handleTallaViewMoreLink() {
        this.setState({
            showTallaViewMore: !this.state.showTallaViewMore
        });
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }
    setMinMaxPrice(event) {
        const { setMinMaxPriceInPlp } = this.props;
        const id = event.target.id;
        let value = event.target.value;
        if (value.match(PRICEFILTER_VALIDATION)) {
            value = value.replace(PRICEFILTER_VALIDATION, '');
        }
        if (id === 'min-price-filter') {
            setMinMaxPriceInPlp(value, 'min-price-filter');
            this.setState({ minPriceFilter: value, minTxtBox: true });
        } else {
            setMinMaxPriceInPlp(value, 'max-price-filter');
            this.setState({ maxPriceFilter: value, maxTxtBox: true });
        }
    }

    handleMinMaxPriceClick() {
        const { minPriceFilter, maxPriceFilter, categoryName, filterIds, categoryId, sortLabelId, searchTerm, isSellerPage, sellerId, sellerName } = this.state;
        const { queryString, minPrice, maxPrice } = this.props;
        const gtmData = { 'dimensionName': 'PriceRange', 'param': `${minPrice}-${maxPrice}`, 'filterLables': null };
        this.getGtMforFacets(gtmData);
        const mminPrice = minPrice === '' ? minPriceFilter : minPrice;
        const mmaxPrice = maxPrice === '' ? maxPriceFilter : maxPrice;
        if (!isEmpty(mminPrice) && !isEmpty(mmaxPrice) && Number(mminPrice) < Number(mmaxPrice)) {
            this.handleGoToTop(); //observation 21 fix
            this.setState({ showPriceErrorAlert: false });
            if (!isEmpty(queryString['Ns'])) {
                if (!isEmpty(queryString['s'])) {
                    const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, filterIds, null, mminPrice, mmaxPrice, null, sortLabelId, searchTerm);
                    Router.push(href, asInfo);
                } else {
                    const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, null, mminPrice, mmaxPrice, null, sortLabelId);
                    Router.push(href, asInfo);
                }
            } else {
                if (!isEmpty(queryString['s'])) {
                    const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, null, null, null, mminPrice, mmaxPrice, null, null, searchTerm);
                    Router.push(href, asInfo);
                } else {
                    const { href, asInfo } = urlConstruction(isSellerPage, sellerId, sellerName, categoryName, filterIds, null, mminPrice, mmaxPrice);
                    Router.push(href, asInfo);
                }
            }
        } else {
            this.setState({ showPriceErrorAlert: true });
        }
    }

    onChangePage(pager) {
        this.redirectToUrl(pager.currentPage);
        this.handleGoToTop();
    }

    onImgError(e) {
        const errImgElement = e.target;
        OnImgError(errImgElement, Path.onImgError);
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }
    handleToggleProductCompare = (e, key, productID, status) => {
        e.stopPropagation();
        if (!status) {
            const { productComparatorObj } = this.state;
            productComparatorObj[key] = e.target.checked;
            this.setState(productComparatorObj);
            if (e.target.checked) {
                this.add_product_to_compare(productID);
            } else {
                this.delete_product_from_compare(productID);
            }
        } else {
            e.target.checked = false
            try {
                document.documentElement.scrollTop = 0;
            } catch (e) { }
            this.setState({ alert_status: true })
        }
    }

    gotToComparePage = (e) => {
        e.stopPropagation();
        Router.push("/tienda/comparator", "/tienda/comparator");
    }

    add_product_to_compare = (productID) => {
        Utility(Path.lpaddproduct, 'POST', { productID }).then(response => {
            if (response.status === 200) {
                logDebug("response :::: ", response);
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });
    }
    Limited_pieces_skus = () => {
        let objectres = {};
        if (isEmpty(this.props.limitedPiecesSkusData)) {
            Utility(Path.limitedPiecesSkus, 'GET').then(response => {
                if (response.status === 200) {
                    !isEmpty(response) && map(response.data, (item, i) => {
                        objectres[item.sku] = item.piezas;
                    });
                    this.setState({ limited_pieces: objectres || {} })
                }
            }, (error) => {
                logError("Error ==== :: ", error);
            });
        } else {
            !isEmpty(this.props.limitedPiecesSkusData) && map(this.props.limitedPiecesSkusData, (item, i) => {
                objectres[item.sku] = item.piezas;
            });
            this.setState({ limited_pieces: objectres || {} })
        }
    }

    delete_product_from_compare = (productID) => {
        Utility(Path.lpdeleteproduct, 'POST', { productID }).then(response => {
            if (response.status === 200) {
                logDebug("response :::: ", response);
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });
    }

    redirectToPdp = (url, asInfo, pdpTypeForSPA, productId) => {
        // GTM start-------------------------------------------------------------------------
        // var urlProductId = url.toString().split('/')[4];
        var categoryNAme = this.state.categoryNameGTM || "";
        this.gtmConfig('click', productId, categoryNAme);

        // GTM End--------------------------------------------------------------------------------

        // Router.push({ pathname: url }); // Commented for to avoid extra calls until SPA imlementation complete.
        if(pdpTypeForSPA === 'default' || pdpTypeForSPA === 'collection') {
            Router.push(url, asInfo);
        } else {
            window.location.href = asInfo;
        }
        //window.location.href = url;
    }

    handleDepartmento = (e, catId, catName = '', noshowPLP) => {
        if (!isEmpty(catId)) {
            let asInfo = `/tienda/${catName}/${catId}?showPLP`;
            let href = `/tienda/twoColumnCategoryPage?categoryId=${catId}&always=PLP`;
            if (noshowPLP) {
                asInfo = `/tienda/${catName}/${catId}`;
                href = `/tienda/twoColumnCategoryPage?categoryId=${catId}`;
            }

            const departmentoId = {};
            departmentoId['categoryId'] = catId;
            this.setState({ departmentoId: departmentoId, departmentoFilterChanged: true });
            Router.push(href, asInfo);
        }
    }

    render() {
        const bodyContent = this.state.bodyContent;
        const { page, window, searchTerm, suggestedSearch } = this.state;
        const {
            filterIds,
            minPriceFilter,
            maxPriceFilter,
            filterLables,
            userInput,
            categoryName,
            minTallaCount,
            showTallaViewMore,
            adjustedSearch,
            alert_status,
            alert_message,
            minMarcasCount,
            showMarcasViewMore,
            departmentoId,
            showPriceErrorAlert,
            showDynamicFacetOptions,
            departmentoFilterChanged
        } = this.state;
        const { maxPrice, minPrice, dropdownMenu, onDropdownToggle, plpListView } = this.props;

        const mainContent = bodyContent.contentItem && bodyContent.contentItem.contents && bodyContent.contentItem.contents[0] && bodyContent.contentItem.contents[0]['mainContent'] || {};
        let productList = [];
        let sortData = [];
        let totalNumRecords = 0;
        let recordsPerPage = 0;
        let sellerInfoObj = {};
        let plpBannerContent = {};
        this.catName = '';
        let termFromService = ''; /*// production observation#158 */

        !isEmpty(mainContent) && map(mainContent, (mainItem, index) => {
            if (mainItem['@type'] === 'ContentSlotMain' && mainItem.contents.length > 0 && mainItem.contents[0]['@type'] === 'ResultsList') {
                if (productList.length == 0) {
                    productList = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].records || [];
                    sortData = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].sortOptions || [];
                }
                if (productList.length > 0 && isEmpty(sellerInfoObj)) {
                    sellerInfoObj = mainItem;
                }
                totalNumRecords = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].totalNumRecs || totalNumRecords;
                recordsPerPage = mainItem.contents && mainItem.contents[0] && mainItem.contents[0].recsPerPage || recordsPerPage;
            }
            if (mainItem['@type'] === 'ContentSlotMain' && mainItem.contents.length > 0) {
                if (mainItem.contents[0]['@type'] === 'LPStaticPage' && !isEmpty(mainItem.contents[0].content)) {
                    plpBannerContent.htmlContent = get(mainItem, 'contents[0].content', '');
                }
                if (mainItem.contents[0]['@type'] === 'MediaBanner') {
                    plpBannerContent.imgUrl = get(mainItem, 'contents[0].imageURL', '');
                    plpBannerContent.altName = get(mainItem, 'contents[0].name', '');
                }
            }
        });
        const isSellerListing = (get(productList, '[0].isMarketPlace[0]') === "true") ? true : false;
        const plpSellerName = get(sellerInfoObj, 'contents[0].plpSellerName');
        const sellerLocation = get(sellerInfoObj, 'contents[0].sellerLocation');

        const cardEvents = {
            showCardElements: this.showCardElements,
            hideCardElements: this.hideCardElements,
            listView: this.state.listView,
            onChangeColor: this.onChangeColor,
            onPlusIconOver: this.onPlusIconOver,
            onColorSectionOut: this.onColorSectionOut,
            onImgError: this.onImgError
        };

        const productListDetails = {
            productList: productList,
            totalNumRecords: totalNumRecords,
            recordsPerPage: recordsPerPage,
            onChangePage: this.onChangePage,
            cardEvents: cardEvents,
            limitedPiecesSkus: this.state.limited_pieces,
            staticLabels: this.props.staticLabels,
            plpSellerInfo: {
                isSellerListing: isSellerListing,
                plpSellerName: plpSellerName,
                sellerLocation: sellerLocation
            },
            showCardImage: this.state.showCardImage
        };

        //const { isDesktop, isMobile, isLandscape, isIpad } = UserAgentDetails(this.state.window); 
        const agentDetails = UserAgentDetails(this.state.window);
        const resolution = (agentDetails.isDesktop) ? "desktop" : "mobile";

        const dropdownDetails = {
            dropdownText: "Ordenar",
            dropdownTextDesktop: "Ordenar por:",
            menuID: "sortby",
            typeOf: "buttons",
            classNameIconExtra: "prevent-events",
            dropdownData: sortData,
            dropdownMenu: dropdownMenu,
            onDropdownToggle: onDropdownToggle,
            onSortSelect: this.onSortSelect,
            sortSelected: this.state.sortSelected,
            resolution: resolution
        };

        const viewModeDetails = {
            listView: this.state.listView,
            showGridView: this.showGridView,
            showListView: this.showListView,
            changeGridView: this.changeGridView
        };

        const navData = {
            dropdownDetails: dropdownDetails,
            viewModeDetails: viewModeDetails,
            productComparatorDetails: {
                handleToggleProductCompare: this.handleToggleProductCompare,
                productComparatorObj: this.state.productComparatorObj,
                UserAgentDetails: UserAgentDetails(this.state.window),
                gotToComparePage: this.gotToComparePage
            }
        };
        let refinementAncestors = [];
        let navCategoryInfo = {};
        let refinementCrumbs = {};
        const secondaryData = bodyContent && bodyContent.contentItem && bodyContent.contentItem.contents && bodyContent.contentItem.contents[0] && bodyContent.contentItem.contents[0]['secondaryContent'] || [];
        let navigations = [];
        map(secondaryData, (data, index) => {
            if (data['@type'] === 'GuidedNavigation') {
                navigations = data.navigation;
            }
        })
        let breadcrumbInfo = {
            label: '',
            breadcrumbData: {},
            searchTerm: this.state.searchTerm
        };
        map(secondaryData, (item, index) => {
            if (item['@type'] && item['@type'] === 'Breadcrumbs') {
                refinementCrumbs = (item.refinementCrumbs && item.refinementCrumbs[0]) || {};
                breadcrumbInfo.label = (item.refinementCrumbs && item.refinementCrumbs[0] && item.refinementCrumbs[0].label) || '';
                breadcrumbInfo.breadcrumbData = (item.refinementCrumbs && item.refinementCrumbs[0] && item.refinementCrumbs[0].ancestors && item.refinementCrumbs[0].ancestors.length > 0 && item.refinementCrumbs[0].ancestors) || [];
                termFromService = item.searchCrumbs && item.searchCrumbs[0] && item.searchCrumbs[0].terms || '';/*// production observation#158 */
                breadcrumbInfo.termFromService = termFromService;/*// production observation#158 */
            }
        });
        this.catName = breadcrumbInfo && breadcrumbInfo.breadcrumbData && breadcrumbInfo.breadcrumbData[0] && breadcrumbInfo.breadcrumbData[0].label || '';
        this.breadCrum = breadcrumbInfo && breadcrumbInfo.breadcrumbData;
        //console.log('breadCrum::::++',this.breadCrum);
        if (!isEmpty(refinementCrumbs)) {
            const ancestors = refinementCrumbs.ancestors || [];
            refinementAncestors = ancestors;
            navCategoryInfo.categoryL1 = {
                name: ancestors[0] && ancestors[0].label || '',
                url: ancestors[0] && ancestors[0]['navigationState'] && ancestors[0].label && ancestors[0]['properties'] && `/${ancestors[0].label}/${ancestors[0]['properties']['category.repositoryId']}`,
            };
            navCategoryInfo.categoryL2 = {
                name: ancestors[1] && ancestors[1].label || '',
                url: ancestors[1] && ancestors[1]['navigationState'] && ancestors[1].label && ancestors[1]['properties'] && `/${ancestors[1].label}/${ancestors[1]['properties']['category.repositoryId']}`,
            };
            navCategoryInfo.categoryNameCurrent = refinementCrumbs.label || '';
        }

        if (totalNumRecords === 0) {
            return (
                <parentContext.Consumer>
                    {({ handleSearchBarShow, searchbarClicked, handleSearchBarHide }) => {
                        return <NoResult handleSearchBarShow={handleSearchBarShow} handleSearchBarHide={handleSearchBarHide} searchbarClicked={searchbarClicked} searchTerm={searchTerm} suggestedSearch={suggestedSearch} breadcrumbInfo={breadcrumbInfo} />
                    }}
                </parentContext.Consumer>
            )
        } else {
            return (
                <parentContext.Consumer>
                    {({ handleTypeheadHide, showModal, domainName }) => {
                        if (showModal && showModal['showModal13']) {
                            if (window && window.document) {
                                window.document.getElementsByTagName('body')[0].setAttribute('style', 'position:fixed !important;width: 100%');
                            }
                        } else {
                            if (window && window.document) {
                                window.document.getElementsByTagName('body')[0].removeAttribute('style');
                            }
                        }
                        return <React.Fragment>
                            <div className="container-fluid o-main-container p-0" onClick={handleTypeheadHide}>
                                {alert_status &&
                                    <Alert alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                                }
                                <div className="container o-container__secondary">
                                    <NavPlp
                                        navData={navData}
                                        navigations={navigations}
                                        refinementAncestors={refinementAncestors}
                                        handleOptions={this.handleOptions}
                                        handleButton={this.handleButton}
                                        handleTallaViewMoreLink={this.handleTallaViewMoreLink}
                                        onChangeMarcas={this.onChangeMarcas}
                                        userInput={userInput}
                                        handleCheckbox={this.handleCheckbox}
                                        handleMarcasViewMoreLink={this.handleMarcasViewMoreLink}
                                        setMinMaxPrice={this.setMinMaxPrice}
                                        handleMinMaxPriceClick={this.handleMinMaxPriceClick}
                                        minPriceFilter={minPriceFilter}
                                        maxPriceFilter={maxPriceFilter}
                                        filterIds={filterIds}
                                        filterLables={filterLables}
                                        handleCheckboxWap={this.handleCheckboxWap}
                                        redirectToUrl={this.redirectToUrl}
                                        totalNumRecords={totalNumRecords}
                                        removeAllFilters={this.removeAllFilters}
                                        removeAllFilters={this.removeAllFilters}
                                        searchTerm={searchTerm}
                                        navCategoryInfo={navCategoryInfo}
                                        handleDepartmento={this.handleDepartmento}
                                        departmentoId={departmentoId}
                                        plpListView={plpListView}
                                        showDynamicFacetOptions={showDynamicFacetOptions}
                                        departmentoFilterChanged={departmentoFilterChanged}
                                    />
                                    <div className="row d-none d-lg-block m-row-bootstrap">
                                        <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                    </div>
                                    {this.props.chanelBrandHTML !== 'NA' ? <div dangerouslySetInnerHTML={{ __html: this.props.chanelBrandHTML }} /> : ''}
                                    <div className="row mt-lg-3 m-row-bootstrap">
                                        <aside className="col-lg-3 pr-4 m-aside__content">
                                            <div className="m-plp-cat-container d-none d-lg-block mb-5">
                                                <Aside
                                                    navigations={navigations}
                                                    navCategoryInfo={navCategoryInfo}
                                                    handleOptions={this.handleOptions}
                                                    handleButton={this.handleButton}
                                                    handleTallaViewMoreLink={this.handleTallaViewMoreLink}
                                                    onChangeMarcas={this.onChangeMarcas}
                                                    userInput={userInput}
                                                    handleCheckbox={this.handleCheckbox}
                                                    handleMarcasViewMoreLink={this.handleMarcasViewMoreLink}
                                                    setMinMaxPrice={this.setMinMaxPrice}
                                                    handleMinMaxPriceClick={this.handleMinMaxPriceClick}
                                                    minPriceFilter={minPriceFilter}
                                                    maxPriceFilter={maxPriceFilter}
                                                    minTxtBox={this.state.minTxtBox}
                                                    maxTxtBox={this.state.maxTxtBox}
                                                    filterIds={filterIds}
                                                    filterLables={filterLables}
                                                    removeAllFilters={this.removeAllFilters}
                                                    minTallaCount={minTallaCount}
                                                    showTallaViewMore={showTallaViewMore}
                                                    searchTerm={searchTerm}
                                                    termFromService={termFromService} /*// production observation#158 */
                                                    totalNumRecords={totalNumRecords}
                                                    adjustedSearch={adjustedSearch}
                                                    minPrice={(typeof minPrice !== 'undefined' && minPrice !== '') ? minPrice : this.state.minPriceFilter}
                                                    maxPrice={maxPrice || this.state.maxPriceFilter}
                                                    minMarcasCount={minMarcasCount}
                                                    showMarcasViewMore={showMarcasViewMore}
                                                    showPriceErrorAlert={showPriceErrorAlert}
                                                    showDynamicFacetOptions={showDynamicFacetOptions}
                                                />
                                            </div>
                                        </aside>
                                        <BodyPlp domainName={domainName} plpListView={plpListView} agentDetails={agentDetails} plpSellerInfo={productListDetails.plpSellerInfo} page={Number(page)} productListDetails={productListDetails} plpBannerContent={plpBannerContent} navData={navData} redirectToPdp={this.redirectToPdp} chanelBrandJSON={this.props.chanelBrandJSON} flags={this.props.plpContent.flags} />
                                        <ButtonGoTop handleGoToTop={this.handleGoToTop} chanelBrandJSON={this.props.chanelBrandJSON} />
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid o-carousel-container">
                                <div className="container p-0">
                                    <div className="row">
                                        <div className="col-12">
                                            <Carousel carouselsData={this.state.carouselsData} chanelBrandCss={this.props.chanelBrandJSON} sendCurrentL1Name={this.catName} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    }
                </parentContext.Consumer>
            )
        }
    }

}

export default withRouter(PlpPage);

const getFacetName = {
    'product.brand': 'Marcas',
    'sku.size': 'Talla',
    'Price': 'Precios',
    'sku.color': 'Color',
    'Rating': 'Rating',
    'Seller': 'Vendedores',
    'sku.normalizedColor': 'Color',
    'sku.normalizedSize': 'Talla',
    'product.firstLevelCategory': 'Categorías',
    'Author': 'Author',
    'Editorial': 'Editorial',
    'Language': 'Idioma',
    'sku.material': 'Material'
}
