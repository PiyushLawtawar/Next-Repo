import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import React from 'react';
import Router from 'next/router';

//import head from '../../commons/head';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import ChannelHeader from '../../../components/molecules/ChannelHeader/molecule-channelHeader';

import Alert from '../../molecules/Alert/Alert';
import uniq from 'lodash/uniq';
//import CarouselPdp from '../../organisms/Carousel/CarouselPdp';
import StickyBar from '../../organisms/StickyBar/StickyBar';
import PdpProductDetail from '../../organisms/ProductPdp/PdpProductDetail';
import ProductSpecs from '../../organisms/ProductSpecs/ProductSpecs';
import ProductExtraInfo from '../../organisms/ProductSpecs/ProductExtraInfo';
import PdpProductComment from '../../organisms/ProductSpecs/PdpProductComment';
import PdpAccordion from '../../molecules/Accordion/PdpAccordion';
import Carousel from '../../organisms/Carousel/Carousel';
import { Utility, GetPrice, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { TRUNTO_KEY, locale, localRegistrationUrl, PDPLoadScript } from '../../../../client/config/constants';
import Modal from '../../../helpers/modal/modal'
import { parentContext } from '../../../contexts/parentContext';
import ProductDownloadCode from '../../molecules/Modals/ProductDownloadCode';
import { debug } from 'util';


export default class PdpChannel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            carouselsData: {},
            stickyVisbility: "",
            breadcrumbData: {},
            sizeApiRecord: {},
            sizeRecords: props.mainContent.productVarientsInfo || {},
            productId: props.mainContent.productId,
            skuAttributeMap: (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) || {},
            productSizeId: (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) ? Object.keys(props.mainContent.productVarientsInfo.skuAttributeMap)[0] : {},
            productType: checkForProductType(props),
            colorText: '',
            productSizeName: '',
            colorStyle: '',
            finalPrices: {},
            anySizeSelected: false,
            hybridPdpData: '',
            pdpQty: '1',
            showQtyDropdown: false,
            activeGiftItemIndex: -1,
            GWPSelectedProductId: '',
            GWPSelectedProductType: '',
            GWPSelectedAssociatedSkuId: '',
            carouselData: {},
            uniqueColorList: {},
            activeColorIndex: 0,
            finalSortedSize: [],
            activeSizeIndex: null,
            materials: [],
            selectedMaterial: null,
            textures: [],
            selectedTexture: null,
            imageBreakFlag: false,
            endecaProductRecord: this.props.mainContent.endecaProductInfo ? this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {},
            alert_status: false,
            alert_message: '',
            storeNumber: "",
            postalZipCode: "",
            alloffers: {},
            Hostname: '',
            window: '',
            limited_Pieces: 0,
            chanelBrandCss: 'NA',
            globalConfigData: '',
            classCarousel: ''
        }

        this.getHybridPDPData = this.getHybridPDPData.bind(this);
        this.imageBreak = this.imageBreak.bind(this);
        global.TurnToItemSku = props.mainContent.productId
    }

    handleScroll = (event) => {
        let userAgent = (UserAgentDetails(window))
        if (userAgent.isDesktop) {
            if (window.scrollY >= 330) {
                this.setState({
                    stickyVisbility: "show",
                });
            }
            else {
                this.setState({ stickyVisbility: "" });
            }
        }

    }

    toggleQtyDropdown = () => {
        if (this.state.showQtyDropdown) {
            this.setState({ showQtyDropdown: false });
        } else {
            this.setState({ showQtyDropdown: true });
        }
    }
    limitedqty = (qty) => {
        if (this.state.limited_Pieces > qty) {
            return false;
        } else {
            return true;
        }
    }
    onSelectDropdownQty = (qty) => {

        if (!this.limitedqty(qty)) { return false; }
        else {
            if (qty === '6+' && this.state.pdpQty !== '') {
                this.setState({ pdpQty: '' });
                const qtyInput = document.getElementById('a-ProductQty__inputDesktop');
                qtyInput && qtyInput.focus();
            } else if (qty !== '' && qty !== this.state.pdpQty) {
                this.setState({ pdpQty: qty });
            }
            this.setState({ showQtyDropdown: false });
        }

    }

    onSelectModalQty = (qty) => {
        if (qty === '6+' && this.state.pdpQty !== '') {
            this.setState({ pdpQty: '' });
            const qtyInput = document.getElementById('a-ProductQty__inputMobile');
            qtyInput && qtyInput.focus();
        } else if (qty !== '' && qty !== this.state.pdpQty) {
            this.setState({ pdpQty: qty });
        }
    }

    onChangeQty = (qty) => {

        if (qty != "") {
            if (!this.limitedqty(qty)) { return false; }
            else {
                //qty = qty.replace(/^0+/, '');
                //let qtyLength = typeof qty == "number"
                if (!isNaN(qty) && qty.length <= 3) {

                    this.setState({ pdpQty: qty });
                }
                // qty = qty.replace(/\s+/g,'').replace(/^0+/,'').match(/[1-9][0-9]*/)
                // qty = qty != null ? qty.join("") : "";


            }
        }
        else {
            this.setState({ pdpQty: qty });
        }

    }

    onAddItemToEvent = ({ modeOfDelivery, eventId, departmentId, selectedSkuId, thumbnailImage, closeModal, showAlert }) => {

        try {

            const GRContext = get(this.state.globalConfigData, 'configuration.siteConfigurations.giftRegistryContext', '');
            const payload = {
                "eventId": eventId,
                "skuId": selectedSkuId,
                "skuName": "lp",
                "departmentId": departmentId,
                "quantity": this.state.pdpQty,
                "imageURL": thumbnailImage,
                "GRDomain": GRContext,
                "channel": "WEB",
                "brand": "LP"
            };

            Utility(Path.addItemToEvent, 'POST', payload).then(response => {

                const responseData = response.data || {};
                const status = get(responseData, 'status');

                if (status === "success") {
                    const giftItemId = get(responseData, 'itemInfo.giftItemId');
                    let giftItemIds = [];
                    giftItemIds.push(giftItemId);

                    Utility(Path.changeDeliveryMode, 'POST', {
                        "eventId": eventId,
                        "modeOfDelivery": modeOfDelivery,
                        "giftItemIds": giftItemIds,
                        "GRDomain": GRContext,
                        "channel": "WEB",
                        "brand": "LP"
                    }).then(response => {
                        const res = response.data || {};
                        if (res.status === "success") {
                            closeModal('showModal15');
                        } else {
                            const alertInfo = {
                                type: 'error',
                                text: get(res, 'errorMessage', 'Somthing not correct while change delivery mode. please try again.')
                            };
                            showAlert(alertInfo);
                        }
                    });

                } else {
                    const alertInfo = {
                        type: 'error',
                        text: get(responseData, 'errorMessage', 'Somthing not correct while add item to event. please try again.')
                    };
                    showAlert(alertInfo);
                }

            });

        } catch (e) { /*console.log("Error: ", e) */}

    }

    getConfiguration = () => {
        const productId = this.state.productId;
        const Hostname = window.location.hostname;

        Utility(Path.fetchConfiguration, 'GET').then(response => {
            if (response && response.data) {
                let globalConfigData = response.data || {};
                this.setState({ globalConfigData: globalConfigData })
                let defectiveProducts = response.data.configuration.defectiveProducts || {};
                !isEmpty(defectiveProducts) && map(defectiveProducts, (item, i) => {
                    let lowercase = i.toLowerCase();
                    if (Hostname.lastIndexOf(lowercase) != -1) {
                        !isEmpty(item) && map(item, (productitem, k) => {
                            if (productitem == productId) {
                                Router.push("/tienda/home", "/tienda/home");

                            }
                        });
                    }


                });

            }


        });

    }


    closeQtyDropdown = (e) => {
        try {
            const qtyClassNames = e && e.target && e.target.className || '';
            if (qtyClassNames.indexOf("pdpDropdwonToClose") === -1 && this.state.showQtyDropdown) {
                this.setState({ showQtyDropdown: false })
            }
        } catch (e) { /*console.log(e); */ }
    }

    onSelectGiftItem = (index, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType) => {
        if (this.state.activeGiftItemIndex !== index) {
            this.setState({ activeGiftItemIndex: index, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType });
        }
    }

    componentWillReceiveProps(newProps, state) {
        if (this.props.carouselsData !== newProps.carouselsData) {
            this.setState({ carouselData: newProps.carouselsData })
        }
        if (this.props.productId !== newProps.productId) {
            this.setState({ productId: newProps.productId })
        }
    }

    last(array, n) {
        let temp;
        if (array == null) {
            return void 0;
        }
        if (n == null) {
            temp = array[array.length - 1];
            if (!temp) {
                return void 0;
            }
            return temp.categoryId;
        }
    }
    //Required for chanel brand display
    getchanelBrandHTML = () => {
        if (this.state.endecaProductRecord && this.state.endecaProductRecord.brandCssConfig) {
            const config = JSON.parse(this.state.endecaProductRecord.brandCssConfig);
            if (config && config.PDP_Banner_html) {
                return config.PDP_Banner_html;
            }
        } else {
            return 'NA';
        }
    }
    getchanelBrandButtonCss() {
        if (this.state.endecaProductRecord && this.state.endecaProductRecord.brandCssConfig) {
            const config = JSON.parse(this.state.endecaProductRecord.brandCssConfig);
            if (config.PDP_Button_css_class) {
                return config.PDP_Button_css_class
            }
        } else {
            return 'NA';
        }
    }
    //Required for sWOGO functionalities
    getSWOGOPageIdentifier = () => {
        const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
        if (isMobile) {
            return "mobilePdp-0";
        }
        return "pdp-0";
    }
    //Required for sWOGO functionalities
    getSkusInfoForSWOGO = () => {  // shared the current selected varient SKU
        const { productSizeId, productType, productId, pdpQty } = this.state;
        let listPrice = 0;
        let salePrice = 0;
        let promoPrice = 0;
        let imageURL = null;
        let size = null;
        let color = null;
        let inventory = false;
        const currentDateInSeconds = Math.round(+new Date() / 1000);
        let eddZipCode = this.state.postalZipCode ? this.state.postalZipCode : '';
        let storeNumber = this.state.storeNumber ? this.state.storeNumber : '';
        let title = '';
        let isPreSale = 'false';
        let presaleEndDate = 0;
        let presaleStartDate = 0;
        let isLimitedPieces = 'false';
        let limitedPiecesEndDate = 0;
        let limitedPiecesStartDate = 0;
        let specialSale = false;
        if (this.state.endecaProductRecord && this.state.endecaProductRecord.records) {
            this.state.endecaProductRecord.records.map((record) => {
                if ((record['sku.repositoryId'][0] === productSizeId) || (record['sku.repositoryId'].indexOf(productSizeId) > -1)) {
                    listPrice = (record['listPrice'] instanceof Array) ? record['listPrice'][0] : record['listPrice'];
                    salePrice = (record['salePrice'] instanceof Array) ? record['salePrice'][0] : record['salePrice'];
                    promoPrice = (record['promoPrice'] instanceof Array) ? record['promoPrice'][0] : record['promoPrice'];
                    imageURL = (record['sku.thumbnailImage'] instanceof Array) ? record['sku.thumbnailImage'][0] : record['sku.thumbnailImage'];
                    size = (record['sku.size'] instanceof Array) ? record['sku.size'][0] : record['sku.size'];
                    color = (record['sku.color'] instanceof Array) ? record['sku.color'][0] : record['sku.color'];
                    title = (record['skuDisplayName'] instanceof Array) ? record['skuDisplayName'][0] : record['skuDisplayName'];
                    var inv = (record['InventoryStatus'] instanceof Array) ? record['InventoryStatus'][0] : record['InventoryStatus'];
                    inventory = (!inv || typeof inv === 'undefined' || inv === '1001') ? false : true;
                    let temp = (record['isPreSale'] instanceof Array) ? record['isPreSale'][0] : record['isPreSale'];
                    isPreSale = typeof temp === 'undefined' ? 'false' : temp;
                    temp = (record['presaleEndDate'] instanceof Array) ? record['presaleEndDate'][0] : record['presaleEndDate'];
                    presaleEndDate = typeof temp === 'undefined' ? 0 : Number(temp);
                    temp = (record['presaleStartDate'] instanceof Array) ? record['presaleStartDate'][0] : record['presaleStartDate'];
                    presaleStartDate = typeof temp === 'undefined' ? 0 : Number(temp);
                    temp = (record['isLimitedPieces'] instanceof Array) ? record['isLimitedPieces'][0] : record['isLimitedPieces'];
                    isLimitedPieces = typeof temp === 'undefined' ? 'false' : temp;
                    temp = (record['limitedPiecesStartDate'] instanceof Array) ? record['limitedPiecesStartDate'][0] : record['limitedPiecesStartDate'];
                    limitedPiecesStartDate = typeof temp === 'undefined' ? 0 : Number(temp);
                    temp = (record['limitedPiecesEndDate'] instanceof Array) ? record['limitedPiecesEndDate'][0] : record['limitedPiecesEndDate'];
                    limitedPiecesEndDate = typeof temp === 'undefined' ? 0 : Number(temp);
                    if ((isPreSale !== 'false' && currentDateInSeconds >= presaleStartDate && currentDateInSeconds <= presaleEndDate) ||
                        (isLimitedPieces !== 'false' && currentDateInSeconds >= limitedPiecesStartDate && currentDateInSeconds <= limitedPiecesEndDate)) {
                        specialSale = true;
                    }

                    if (listPrice && typeof listPrice !== 'undefined') {
                        listPrice = Number(listPrice);
                    }
                    if (salePrice && typeof salePrice !== 'undefined') {
                        salePrice = Number(salePrice);
                    }
                    if (promoPrice && typeof promoPrice !== 'undefined') {
                        promoPrice = Number(promoPrice);
                    }
                }
            });
        }
        let payload = [{
            "active": inventory,
            "quantity": Number(pdpQty) || 1,
            "productId": productId,
            "sku": productSizeId,
            "productType": productType,
            "title": title,
            "isSpecialSale": specialSale,
            "imageURL": imageURL,
            "size": size,
            "color": color,
            "price": (promoPrice > 0 ? promoPrice : (salePrice > 0 ? salePrice : listPrice)),
            "listPrice": listPrice,
            "salePrice": salePrice,
            "promoPrice": promoPrice,
            "eddZipCode": eddZipCode,
            "storeNumber": storeNumber
        }]
        return payload;
    }
    //Required for sWOGO functionalities
    addToCartBySWOGO = (bundle, callBack) => {
        const { productSizeId, productType, productId, pdpQty, storeNumber, postalZipCode, hybridPdpData, opticData } = this.state;
        let productList = [];
        let currentProduct = null;
        let gwpProductId = null;
        let gwpskuId = null;
        let gwpProductType = null;
        let gwpImageURL = null;
        let promoMsg = null;
        var productObj = {
            "productId": "", "catalogRefId": "", "productType": "Soft Line", "quantity": "", "storeNumber": "", "eddZipCode": "",
            "parentGWPProduct": "", "promotionalGiftMessage": "", "isSpecialSale": "", "estimatedDeliveryDate": "", "imageURL": "", "displayName": "",
            "size": "", "color": "", "listPrice": "", "salePrice": "", "bestPromoAmount": "", "bestPromoType": "",
            "sellerSkuId": "", "sellerId": "", "sellerOperatorId": "", "sellerName": "", "offerId": ""
        };
        var index = this.state.activeGiftItemIndex;
        if (!index || typeof index !== 'undefined' || index === -1) {
            index = 0;
        }
        if (this.state.sizeRecords.gwpPromotions
            && this.state.sizeRecords.gwpPromotions.giftItems
            && this.state.sizeRecords.gwpPromotions.giftItems[index]) {
            promoMsg = this.state.sizeRecords.gwpPromotions.promotionalGiftMessage;
            const gItem = this.state.sizeRecords.gwpPromotions.giftItems[index];
            if (gItem && typeof gItem !== 'undefined') {
                gwpProductId = gItem.productId;
                gwpskuId = gItem.associatedSkuId;
                gwpProductType = gItem.productType;
                gwpImageURL = gItem.promoXLImageURL;
            }

        }
        //console.log("productId = " + productId + " gwpProductId = " + gwpProductId + "  gwpskuId= " + gwpskuId + "  gwpProductType= " + gwpProductType + "  gwpImageURL=" + gwpImageURL + "promoMsg = " + promoMsg);
        if (!bundle || typeof bundle === 'undefined') {
            callBack("Provided data is not available", null);
        } else {
            bundle.map(item => {
                currentProduct = Object.assign({}, productObj);
                if (item.productId === productId) {
                    currentProduct['productId'] = (gwpProductId ? item.productId + "," + gwpProductId : item.productId);
                    currentProduct['catalogRefId'] = (gwpskuId ? item.sku + "," + gwpskuId : item.sku);
                    currentProduct['productType'] = (gwpProductType ? item.productType + "," + gwpProductType : item.productType);
                    currentProduct['parentGWPProduct'] = gwpskuId ? item.sku : "";
                    currentProduct['promotionalGiftMessage'] = gwpskuId ? promoMsg : "";
                    currentProduct['giftProductId'] = gwpProductId ? gwpProductId : "";
                    currentProduct['giftSku'] = gwpskuId ? gwpskuId : "";
                    currentProduct['giftProductType'] = gwpProductType ? gwpProductType : "";

                } else {
                    currentProduct['productId'] = item.productId;
                    currentProduct['catalogRefId'] = item.sku;
                    currentProduct['productType'] = item.productType;
                    currentProduct['parentGWPProduct'] = "";
                    currentProduct['promotionalGiftMessage'] = "";
                }
                currentProduct['quantity'] = JSON.stringify(item.quantity);
                currentProduct['imageURL'] = item.imageURL;
                currentProduct['displayName'] = item.title;
                currentProduct['size'] = item.size;
                currentProduct['color'] = item.color;
                var appliedPrice = item.price;
                var lPrice = item.listPrice;
                var sPrice = item.salePrice;
                var pPrice = item.promoPrice;
                if (appliedPrice && appliedPrice > 0 && (lPrice && lPrice <= 0)) {
                    lPrice = appliedPrice;
                }
                if (appliedPrice && appliedPrice > 0 && (sPrice && sPrice <= 0)) {
                    sPrice = appliedPrice;
                }
                if (appliedPrice && appliedPrice > 0 && (pPrice && pPrice <= 0)) {
                    pPrice = appliedPrice;
                }
                currentProduct['listPrice'] = JSON.stringify(lPrice);
                currentProduct['salePrice'] = JSON.stringify((pPrice > 0) ? pPrice : sPrice);
                currentProduct['bestPromoAmount'] = JSON.stringify(pPrice);
                currentProduct['storeNumber'] = storeNumber;
                currentProduct['eddZipCode'] = postalZipCode;
                currentProduct['isSpecialSale'] = "false";
                currentProduct['sellerId'] = "";
                currentProduct['sellerSkuId'] = "";
                currentProduct['sellerName'] = "";
                currentProduct['sellerOperatorId'] = "";
                currentProduct['offerId'] = "";
                productList.push(currentProduct);
            });
            this.addMultipleItemToCart({ "products": { "productList": productList } }, callBack);
        }
    }

    componentDidMount() {

        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};
        const uniqueColorList = this.getHexaColorCodeByColorName('', colorList)

        const windowObj = window || {};

        this.setState({ uniqueColorList }, () => {
            this.getVariantsByColor('', Object.keys(colorList)[0], 0);
        })
        this.getPdpDynamicContent();
        let userAgent = (UserAgentDetails(window))
        userAgent.isDesktop ? window.addEventListener('scroll', this.handleScroll) : null;
        document.body.addEventListener('click', this.closeQtyDropdown);
        window.TRUNTO_KEY = TRUNTO_KEY;
        window.locale = locale;
        window.PageName = 'PDP';
        window.localRegistrationUrl = localRegistrationUrl;
        //Required for sWOGO functionalities
        window.swogoDependencies = { getSkus: this.getSkusInfoForSWOGO, getPage: this.getSWOGOPageIdentifier, addToCart: this.addToCartBySWOGO };
        this.setState({ Hostname: window.location.hostname, chanelBrandCss: this.getchanelBrandButtonCss() });
        this.setState({ window: windowObj });
        this.Limited_pieces_skus();
        this.getConfiguration();
        screen.width <= 768
        this.setState({ classCarousel: screen.width <= 768 ? "p-0" : "container p-0" });
        this.getOffers();
    }

    getHexaColorCodeByColorName = (colorName, colorList = {}) => {
        let colorHexaCodeValue = {};
        if (!isEmpty(colorList)) {
            let colorNameList = !isEmpty(colorList) && Object.keys(colorList);

            colorNameList.map(color => {
                if (colorName != "") {
                    if (color === colorName) {
                        colorHexaCodeValue[color] = colorList[color] && colorList[color] != "" && colorList[color] != null ? colorList[color] : [];
                    }
                }
                else {
                    colorHexaCodeValue[color] = colorList[color] && colorList[color] != "" && colorList[color] != null ? colorList[color] : [];
                }
            });
        }
        return colorHexaCodeValue;
    }

    getOffers = () => {
        try {
            const productId = this.state.productId;
            Utility(Path.alloffers + productId, 'GET', {
                "channel": "WEB",
                "brandName": "LP"
            }).then(response => {
                this.setState({
                    alloffers: response.data
                })
            });
        } catch (e) { }

    }
    Limited_pieces_skus = () => {

        let objectres = {};
        const productId = this.state.productId;
        let getqty = 0;

        Utility(Path.limitedPiecesSkus, 'GET').then(response => {
            if (response.status === 200) {
                !isEmpty(response) && map(response.data, (item, i) => {
                    objectres[item.sku] = item.piezas;
                });
                getqty = objectres[productId] || "1";
                this.setState({ pdpQty: getqty, limited_Pieces: getqty })
            }
        }, (error) => {
            //console.log("Error ==== :: ", error);
        });
    }

    changeDeliveryMode = () => {
        try {
            Utility(Path.changeDeliveryMode, 'GET', {
                "channel": "WEB",
                "brandName": "LP",
                "eventId": "100000639",
                "modeOfDelivery": "radioGR1",
                "giftItemIds": [
                    "string"
                ]
            }).then(response => {
            });
        } catch (e) { /*console.log("ChangeDeliveryMode - Error: " + e)*/ }

    }

    getPdpDynamicContent = () => {
        const productId = this.state.productId;
        const { productSizeId, productType } = this.state;

        Utility(Path.getPdpDynamicContent, 'POST', {
            "productId": productId,
            "skuList": productSizeId,
            "isMarketPlace": "false",
            "skuId": productSizeId,
            "pType": productType
        }).then(response => {
            this.setState({
                breadcrumbData: response.data
            }, () => {
                if (this.props.backEvent && this.props.backEvent.setBreadCrumbData) {
                    this.props.backEvent.setBreadCrumbData(response.data)
                }
                //window.authToken = JSON.parse(response.data.authToken)
                const breadCrumbData = this.state.breadcrumbData
                const categoryId = this.last(breadCrumbData && breadCrumbData.breadCrumbs)
                const auth = this.state.breadcrumbData && this.state.breadcrumbData.authToken;
                window.authToken = auth;
                let guest = '';
                let LoggedInSession = this.props.loginDetails && this.props.loginDetails.LoggedInSession || "";
                    if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
                        LoggedInSession = false;
                    }
                    if(!LoggedInSession){
                        guest = "&isguest=true";
                    }else{
                        guest = "&isguest=false";
                    }
                Utility(Path.getCarousels + '?page=PDP&categoryId=' + categoryId+guest, 'GET').then(response => {
                    this.setState({
                        carouselsData: response.data
                    });
                });
            })
        });
    }

    getHybridPDPData(productId) {

        Utility(Path.getHybridproductdetails + productId, 'GET', {
            "channel": "WEB",
            "brandName": "LP"
        }).then(response => {

            let recordExists = get(response.data, "mainContent.endecaProductInfo.contents[0].mainContent[0].record.attributes", {})
            if (!isEmpty(recordExists)) {
                this.setState({
                    hybridPdpData: response.data
                });
            }

        });
    }

    componentWillUnmount() {

        window.removeEventListener('scroll', this.handleScroll);
        document.body.removeEventListener('click', this.closeQtyDropdown);
    }

    getVariantsByColor = (e, val, index, hexaColorCode, colorId) => {

        const { productSizeId, productId, colorText, endecaProductRecord } = this.state;
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};

        if (colorText !== val) {
            let query =  "?variantType="+ 'color' +"&variantValue="+ val+ "&productId="+productId;
            Utility(Path.getVariants+query, 'GET'/*, {
                "variantType": 'color',
                "variantValue": val,
                "productId": productId
            }*/).then(response => {
                let responseData = response.data;
                let finalSortedSize = get_FinalSortedSize({ sizeApiRecord: responseData });
                var selectedSku = colorId;
                //when only colors are available and on selection of different color
                if ((!finalSortedSize || finalSortedSize.length === 0) && this.state.sizeRecords.colorMap && this.state.sizeRecords.colorMap.color
                    && this.state.sizeRecords.colorMap.color[val]) {

                    var temp = this.state.sizeRecords.colorMap.color[val].split("|");
                    selectedSku = temp[temp.length - 1];
                    //calling swogo bundle reload function soon after the size selection
                    if (window && window.swogoBundles) {
                        window.swogoBundles.reload();
                    }
                } else {
                }
                this.setState({
                    sizeApiRecord: responseData,
                    finalSortedSize,
                    colorText: val,
                    activeColorIndex: index,
                    activeSizeIndex: null,
                    productSizeName: "", //finalSortedSize.length && finalSortedSize[0].size,
                    anySizeSelected: false,
                    productSizeId: colorId === undefined ? productSizeId : colorId,
                    colorStyle: hexaColorCode ? hexaColorCode : Object.values(this.getHexaColorCodeByColorName(val, colorList))
                }, () => {
                    let enabledSortedSize = [];
                    enabledSortedSize = finalSortedSize && finalSortedSize.length > 0 && finalSortedSize.filter(size => {
                        if (size.disable === false) {
                            return size;
                        }
                    });

                    if (enabledSortedSize.length === 1) {
                        let index = 0;
                        for (var i in finalSortedSize) {
                            if (enabledSortedSize[0].sizeid === finalSortedSize[i].sizeid) {
                                index = i;
                                break;
                            }
                        }
                        this.getMaterialsBySize(index, enabledSortedSize[0], this.state.productSizeId)
                    }
                })
            });
        }
    }

    getMaterialsBySize = async (index, sizeObj, productSizeId) => {
        if (sizeObj.sizeid !== 'NONELIGIBLESIZE') {
            const { skuAttributeMap } = this.state;
            const materials = await materialBySize(sizeObj.size, this.state.sizeApiRecord);
            const finalPrices = {
                list: skuAttributeMap[sizeObj.sizeid].listPrice,
                sale: skuAttributeMap[sizeObj.sizeid].salePrice,
                promo: skuAttributeMap[sizeObj.sizeid].promoPrice,
                numRecords: 1
            };
            this.setState({
                materials: materials.length > 1 ? materials : [],
                textures: [],
                activeSizeIndex: index,
                // productSizeId: sizeObj.sizeid,
                productSizeName: productSizeId === undefined ? sizeObj.size : productSizeId,
                selectedMaterial: null,
                selectedTexture: null,
                finalPrices,
                anySizeSelected: true
            });
        }
        //calling swogo bundle reload function soon after the size selection
        if (window && window.swogoBundles) {
            window.swogoBundles.reload();
        }
    }

    getTexturesByMaterial = async (value) => {
        if (value) {
            let { materials } = this.state;
            const filterdMaterials = materials.filter(obj => obj.value === value);
            const textures = await texturesByMaterail(filterdMaterials[0], this.state.sizeApiRecord);
            if (Object.keys(materials[0]).length === 0) {
                materials.splice(0, 1);
            }
            this.setState({
                textures: textures.length > 1 ? [{ name: '- Seleccionar textura -', value: '' }, ...textures] : [],
                productSizeId: value,
                selectedMaterial: value,
                materials
            })
        }
        //calling swogo bundle reload function soon after the material selection
        if (window && window.swogoBundles) {
            window.swogoBundles.reload();
        }
    }

    getSelectedTexture = (value) => {
        if (value) {
            let { textures } = this.state;
            if (Object.keys(textures[0]).length === 0) {
                textures.splice(0, 1);
            }
            this.setState({
                selectedTexture: value,
                productSizeId: value,
                textures
            });
        }
        //calling swogo bundle reload function soon after the texture selection
        if (window && window.swogoBundles) {
            window.swogoBundles.reload();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.stickyVisbility == this.state.stickyVisbility &&
            nextState.hybridPdpData == this.state.hybridPdpData &&
            nextState.activeSizeIndex == this.state.activeSizeIndex &&
            nextState.activeColorIndex == this.state.activeColorIndex &&
            nextState.GWPSelectedProductId == this.state.GWPSelectedProductId &&
            nextState.GWPSelectedAssociatedSkuId == this.state.GWPSelectedAssociatedSkuId &&
            nextState.GWPSelectedProductType == this.state.GWPSelectedProductType &&
            nextState.showQtyDropdown == this.state.showQtyDropdown &&
            nextState.activeGiftItemIndex == this.state.activeGiftItemIndex &&
            nextState.alloffers == this.state.alloffers &&
            nextState.pdpQty == this.state.pdpQty &&
            nextState.colorText == this.state.colorText &&
            nextState.breadcrumbData == this.state.breadcrumbData &&
            nextState.selectedMaterial == this.state.selectedMaterial &&
            nextState.alert_status == this.state.alert_status &&
            nextState.Hostname == this.state.Hostname &&
            nextState.opticData == this.state.opticData &&
            nextState.limited_Pieces == this.state.limited_Pieces &&
            nextState.globalConfigData == this.state.globalConfigData
        ) {
            return false
        }
        else {
            return true
        }
    }
    onQtyChanged(modifiedQty) {
        this.setState({ productQty: modifiedQty })
    }

    set_store_number = (storeNumber) => {
        this.setState({ storeNumber });
    }

    set_postal_zip_code = (postalZipCode) => {
        this.setState({ postalZipCode })
    }

    imageBreak() {
        this.setState({
            imageBreakFlag: true
        })
    }

    check_product_sku_selection = () => {

        let promise = new Promise((resolve, reject) => {
            const { finalSortedSize,
                activeSizeIndex,
                materials,
                selectedMaterial,
                textures,
                selectedTexture } = this.state;

            const validationText = finalSortedSize.length ? (
                activeSizeIndex === null ? "Selecciona una talla!" : (
                    materials.length ? (
                        selectedMaterial === null ? "Selecciona una Material!" : (
                            textures.length ? (
                                selectedTexture === null ? "Selecciona una Textura!" : true
                            ) : false
                        )
                    ) : false
                )
            ) : false;

            if (validationText) {
                this.show_alert(validationText);
            } else {
                resolve()
            }
        });
        return promise;
    }

    handleAddToMyBag = () => {
        this.check_product_sku_selection().then(() => {
            if (this.props.mainContent.pdpType == "optic") {

                const { opticData } = this.state;
                const { SkuPriceLft = {}, SkuPriceRgt = {} } = opticData

                if (Object.keys(SkuPriceLft).length > 0 && Object.keys(SkuPriceRgt).length > 0) {
                    this.addMultipleItemToCart();

                }
                else {
                    this.show_alert("Select optic spec")
                }
            }
            else {
                this.addItemToCart();
            }

        })
    }

    createAddToCartPayload = () => {
        const { productSizeId, productType, productId, pdpQty, storeNumber, postalZipCode, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType } = this.state;


        let payload = {
            "quantity": pdpQty,
            "catalogRefIds": productSizeId,
            "itemToGift": "false",
            "specailSaleItem": "false",
            "skipInventory": "false"
        }

        if (postalZipCode) payload.zipCode = postalZipCode;
        if (storeNumber) payload.storeNumber = storeNumber;

        if (GWPSelectedProductId === '') {
            payload.productId = productId;
            payload.productType = productType;
        }
        if (GWPSelectedProductId !== '') {
            if (payload.catalogRefIds === '') {
                payload.catalogRefIds = GWPSelectedAssociatedSkuId;
            } else {
                payload.catalogRefIds = payload.catalogRefIds + ',' + GWPSelectedAssociatedSkuId;
            }

            payload.parentGWPProduct = productSizeId;
            payload.productIds = productId + ',' + GWPSelectedProductId;
            payload.productTypes = productType + ',' + GWPSelectedProductType;
            payload.tmpGWPQtys = {};
            payload.tmpGWPQtys[productSizeId] = pdpQty;
            payload.tmpGWPQtys[GWPSelectedProductId] = pdpQty;


            payload.promotionalGiftMessage = "gwp.regaloExclusiveOnline.text";
        }

        if (this.props.mainContent.pdpType == "hybrid") {

            // {hybridPdpData:{mainContent:{endecaProductInfo:{contents:[{mainContent:[{record:{records:[{attributes:{skurepositoryId}= {}}]}}]}]}}}
            payload["catalogRefIds"] = hybridPdpData && hybridPdpData.mainContent && hybridPdpData.mainContent.endecaProductInfo && hybridPdpData.mainContent.endecaProductInfo.contents && hybridPdpData.mainContent.endecaProductInfo.contents[0] && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent[0] && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent[0].record && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0] && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes["sku.repositoryId"] && hybridPdpData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes["sku.repositoryId"][0] || "";
            payload.productType = "Digital";
            payload["sourcePage"] = "hybrid";
        }
        if (this.props.mainContent.pdpType == "optic") {
            let params = []
            const { SkuPriceLft = {}, SkuPriceRgt = {} } = opticData
            let OpticSkus = [SkuPriceLft, SkuPriceRgt];
            OpticSkus.map((sides) => {

                let payloadObj = JSON.parse(JSON.stringify(payload))
                payloadObj.catalogRefId = sides.skuid;
                delete payloadObj.catalogRefIds;
                params.push(payloadObj)
            })

            let opticPayload = { products: { productList: params } }
            payload = opticPayload;
        }
        return payload;

    }

    addItemToCart = () => {

        const payload = this.createAddToCartPayload();
        let cartresposedate = {};
        Utility(Path.addItemToCart, 'POST', payload).then(response => {

            if (response.status === 200 && response.data && response.data.s === '0') {
                cartresposedate = response.data
                Utility(Path.mybagListCount, 'GET').then(response => {
                    if (response.status === 200) {
                        if (response && response.data && response.data.s === '0') {
                            if (response.data.quantity) {
                                response.data["cartHeaderDetails"] = cartresposedate.cartCount.cartHeaderDetails;
                                this.props.updateCartHeaderDetails(response.data);
                            }
                            this.show_alert("Agregaste un producto a tu bolsa", "success")
                        }
                    }
                    else {
                       // console.log(response.data.error, response.data.message)
                    }
                });

            }
            else {
                if (response.status === 200) {
                    if (response && response.data && response.data["0"]) {
                        this.show_alert(response.data["0"].err)
                    }
                }
                else {
                   // console.log(response.data.error, response.data.message)
                }

            }

        }, (error) => {
        });
    }
    //Required for sWOGO functionalities added extra parameters like pay load  and swogo call back function. Other functionalities can ignore the call back & payload
    addMultipleItemToCart = (swogo, callback) => {
        let payload = null;
        if (swogo) {
            payload = swogo;
        } else {
            payload = this.createAddToCartPayload();
        }
        let errorMessage = null;
        Utility(Path.addmultipleitemstoorder, 'POST', payload).then(response => {
            if (response.status === 200 && response.data && response.data.s === '0') {
                Utility(Path.mybagListCount, 'GET').then(response => {
                    const res = response.data || {};
                    if (response && response.data && response.data.s === '0') {

                        if (response.data.quantity) {
                            this.props.updateCartHeaderDetails(response.data);
                        }
                        if (callback) {
                            callback(null, "Successfully added");
                        }
                        this.show_alert("Agregaste un producto a tu bolsa", "success")
                    }
                });
            }
            else {

                if (response.status === 200) {
                    if (response && response.data && response.data["0"]) {
                        errorMessage = "error response came as " + JSON.stringify(response.data["0"].err);
                        this.show_alert(response.data["0"].err)
                        if (callback) {
                            callback(errorMessage, null);
                        }
                    }

                }
                else {
                   // console.log(response.data.error, response.data.message)
                    errorMessage = "Some error occured error = " + JSON.stringify(response.data.error) + " msg = " + JSON.stringify(response.data.message);
                    if (callback) {
                        callback(errorMessage, null);
                    }
                }
            }
        }, (error) => {
            errorMessage = JSON.stringify(error);
            if (callback) {
                callback(errorMessage, null);
            }
        });
    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert") => {
        this.setState({ alert_status: true, alert_message, alert_Type });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }
    updateOpticData = (opticData) => {

        const { SkuPriceLft = {}, SkuPriceRgt = {} } = opticData
        let SkuPrice = {};
        if (isEmpty(SkuPriceRgt)) {

            if (isEmpty(SkuPriceLft)) {

                SkuPrice = {};
            }
            else {
                SkuPrice = SkuPriceLft;
            }
        }
        else {

            SkuPrice = SkuPriceRgt;
        }


        this.setState({ opticData, finalPrices: SkuPrice })
    }

    render() {

        const { productId, materials, textures, hybridPdpData, sizeApiRecord, sizeRecords, uniqueColorList, finalSortedSize, alert_message, alert_status, alert_Type, finalPrices, productSizeId } = this.state;

        let contentsRecords = hybridPdpData ? hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let pdpType = hybridPdpData ? 'hybrid' : this.props.mainContent && this.props.mainContent.pdpType || '';
        const carouselRecords = (this.props.mainContent && this.props.mainContent.akamaiSkuImagesInfo && this.props.mainContent.akamaiSkuImagesInfo.skuImageMap) || {};
        const staticLabel = this.props.mainContent.staticLabels && this.props.mainContent.staticLabels.staticLabelValues && this.props.mainContent.staticLabels.staticLabelValues[0] && this.props.mainContent.staticLabels.staticLabelValues[0].keyValues;
        const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
        const productInfo = (contentsRecords && contentsRecords.endecaProductInfo &&
            contentsRecords.endecaProductInfo.contents && contentsRecords.endecaProductInfo.contents[0] &&
            contentsRecords.endecaProductInfo.contents[0].mainContent && contentsRecords.endecaProductInfo.contents[0].mainContent[0] &&
            contentsRecords.endecaProductInfo.contents[0].mainContent[0].record) || {};

        if (pdpType == "hybrid") {

            let skuattrMap = contentsRecords && contentsRecords.productVarientsInfo && contentsRecords.productVarientsInfo.skuAttributeMap || {}
            let hybridProductId = (contentsRecords && contentsRecords.productId) || productId

            if (!isEmpty(skuattrMap)) {
                for (let skuKey in skuattrMap) {

                    if (skuKey === hybridProductId) {

                        let skuDetail = skuattrMap[skuKey]
                        finalPrices.list = skuDetail.listPrice;
                        finalPrices.sale = skuDetail.salePrice;
                        finalPrices.promo = skuDetail.promoPrice;
                        finalPrices.numRecords = 1;


                    }
                }
            }
        }
        const priceData = !isEmpty(finalPrices) ? finalPrices : getPriceData(productInfo)

        const priceToShow = GetPrice(priceData);
        const staticLabels = contentsRecords && contentsRecords.staticLabels && contentsRecords.staticLabels.staticLabelValues && contentsRecords.staticLabels.staticLabelValues[0] && contentsRecords.staticLabels.staticLabelValues[0]['keyValues'] || {};
        const modalDatas = getModalDatas(productInfo, staticLabels);
        const qtyDropdownInfo = {
            pdpQty: this.state.pdpQty,
            showQtyDropdown: this.state.showQtyDropdown,
            toggleQtyDropdown: this.toggleQtyDropdown,
            onSelectDropdownQty: this.onSelectDropdownQty,
            onChangeQty: this.onChangeQty,
            closeQtyDropdown: this.closeQtyDropdown
        };
        const qtyModalInfo = {
            onSelectModalQty: this.onSelectModalQty
        };
        const skuImageMap = contentsRecords && contentsRecords.akamaiSkuImagesInfo && contentsRecords.akamaiSkuImagesInfo.skuImageMap || {};
        let stickyThumbImg = skuImageMap && skuImageMap[productSizeId + '_th'] || '';
        if (stickyThumbImg === '') {
            const defaultSkuId = productVarientsInfo.defaultSkuId || '';
            stickyThumbImg = skuImageMap && skuImageMap[defaultSkuId + '_th'] || '';
        }
        const stickyBarInfo = {
            priceToShow: priceToShow,
            stickyThumbImg: stickyThumbImg
        }

        const breadCrumbs = this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs || {};
        let breadcrumbInfo = {
            label: '',
            breadcrumbData: breadCrumbs,
            isPdp: true
        };

        const gwpInfo = {
            gwpData: productVarientsInfo.gwpPromotions || {},
            onSelectGiftItem: this.onSelectGiftItem,
            activeGiftItemIndex: this.state.activeGiftItemIndex
        };
        const giftRegistryInfo = {
            eventListMap: get(this.state.breadcrumbData, 'pdpDynamicContent.eventListMap'),
            isLoggedIn: get(this.props.loginDetails, 'LoggedInSession'),
            pdpQty: this.state.pdpQty,
            selectedSkuId: this.state.productSizeId,
            onAddItemToEvent: this.onAddItemToEvent,
            departmentId: get(productInfo, 'records[0].department[0]'),
            thumbnailImage: get(productInfo, 'thumbnailImage[0]'),
            checkSkuSelection: this.check_product_sku_selection
        };
        const isMarketPlace = productInfo.isMarketPlace && productInfo.isMarketPlace[0] || "false";
        const alloffers = this.state.alloffers;
        const marketPlaceInfo = {
            isMarketPlace: isMarketPlace,
            skuAttributeMapSize: productVarientsInfo.mapSize || 0,
            productId: productInfo.productId && productInfo.productId[0] || '',
            alloffers,
            anySizeSelected: this.state.anySizeSelected
        };
        let promotionInfo = {};
        if (isMarketPlace === "true") {
            promotionInfo.lpPromotions = get(alloffers, 'skuOffers.liverpoolPromotions');
            promotionInfo.otherPromotions = get(alloffers, 'skuOffers.otherPromotions');
        } else {
            promotionInfo.lpPromotions = get(productInfo, 'lpPromotions_pwa');
            promotionInfo.otherPromotions = get(productInfo, 'otherPromotions_pwa');
        }
        const extraInfoDetails = {
            extraInformationWeb: get(productInfo, ['product.extraInformationWeb']),
            extraInformationWap: get(productInfo, ['product.extraInformationWap'])
        }

        const swogoScript = contentsRecords.swogoEndPoint || '';
        const ratingScript = "//static.www.turnto.com/sitedata/" + TRUNTO_KEY + "/v4_3/" + this.state.productId + "/d/itemjs";
        //const ratingcss = "//" + this.state.Hostname + "/static/css/turnTo.css";
        const noOfPieces = this.state.breadcrumbData
        let stockAvailability = {};
        if (this.state && this.state.breadcrumbData && this.state.breadcrumbData != null && this.state.breadcrumbData.stockAvailability) {
            stockAvailability = this.state.breadcrumbData.stockAvailability
        }
        else {
            stockAvailability = {}
        }

        const stockAvailabilityMessage = stockAvailability && Object.values(stockAvailability) || "";

        const downloadPopup = {
            modalId: "productDownload-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "edd-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const pageUrl = get(this.state.window, 'document.location.href', '');
        const productSocialEmailData = {
            productDescription: get(productInfo, 'productDescription[0]', ''),
            productId: get(productInfo, 'productId[0]', ''),
            skuLargeImage: (productInfo["sku.largeImage"] && productInfo["sku.largeImage"][0]) || '',
            pageUrl
        };

        return (
            <React.Fragment>
                <script defer="" type="text/javascript" src={swogoScript}></script>
                <script defer="" type="text/javascript" src={ratingScript}></script>
                {/* <link rel="stylesheet" href="/static/css/tra-es_LA.css" /> */}
                <link href={ratingcss} rel="stylesheet" type="text/css" />
                <Alert {...this.props} alertTopClass={alert_Type == "success" || alert_message === 'Se ha copiado el link del artículo' ? "m-alert__container mdc-snackbar -success" : "m-alert__container mdc-snackbar -alert"} iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />

                <div className="modal-open">
                    {pdpType != 'hybrid' &&
                        <StickyBar
                            onChangeQty={this.onChangeQty}
                            qty={this.state.pdpQty}
                            spanText={this.state.spanText}
                            productSizeId={this.state.productSizeId}
                            visibility={this.state.stickyVisbility}
                            stickyBarInfo={stickyBarInfo}
                            mainContent={contentsRecords.endecaProductInfo && contentsRecords.endecaProductInfo.contents}
                            stickyData={this.props.mainContent}
                            filteredData={this.props.mainContent}
                            productSizeName={this.state.productSizeName}
                            colorStyle={this.state.colorStyle}
                            handleAddToMyBag={this.handleAddToMyBag}
                            pdpType={pdpType}
                            opticData={this.state.opticData}
                            show_alert={this.show_alert}
                            limitedqty={this.limitedqty}
                        />
                    }
                    <div className="d-none d-lg-block m-product__BreadCrumb">
                        <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                    </div>
                    {this.getchanelBrandHTML() !== 'NA' ? <div dangerouslySetInnerHTML={{ __html: this.getchanelBrandHTML() }} /> : ''}



                    <div className="m-pdpChanel-header">
                        <div className="container-fluid">
                            <div className="container">
                                {/*<ChannelHeader />*/}
                                <h1>jvlflbkflkk
                                     </h1>
                            </div>
                        </div>
                    </div>


                    <PdpProductDetail
                        set_store_number={this.set_store_number}
                        set_postal_zip_code={this.set_postal_zip_code}
                        check_product_sku_selection={this.check_product_sku_selection}
                        handleAddToMyBag={this.handleAddToMyBag}
                        getHexaColorCodeByColorName={this.getHexaColorCodeByColorName}
                        uniqueColorList={uniqueColorList}
                        finalSortedSize={finalSortedSize}
                        pdpType={pdpType}
                        qtyDropdownInfo={qtyDropdownInfo}
                        qtyModalInfo={qtyModalInfo}
                        gwpInfo={gwpInfo}
                        marketPlaceInfo={marketPlaceInfo}
                        productQty={this.state.productQty}
                        priceToShow={priceToShow}
                        giftRegistryInfo={giftRegistryInfo}
                        mainContent={contentsRecords}
                        carouselRecords={carouselRecords}
                        activeSizeIndex={this.state.activeSizeIndex}
                        activeColorIndex={this.state.activeColorIndex}
                        getMaterialsBySize={this.getMaterialsBySize}
                        getTexturesByMaterial={this.getTexturesByMaterial}
                        getVariantsByColor={this.getVariantsByColor}
                        getSelectedTexture={this.getSelectedTexture}
                        colorText={this.state.colorText}
                        getHybridPDPData={this.getHybridPDPData}
                        productSizeId={this.state.productSizeId}
                        productId={productId}
                        materials={materials}
                        textures={textures}
                        staticLabel={staticLabel}
                        imageBreak={this.imageBreak}
                        productSizeName={this.state.productSizeName}
                        colorStyle={this.state.colorStyle}
                        updateOpticData={this.updateOpticData}
                        stockAvailability={stockAvailabilityMessage}
                        pdpQty={this.state.pdpQty}
                        productType={this.state.productType}
                        handleScroll={this.handleScroll}
                        chanelBrandButtonCss={this.state.chanelBrandCss}
                        stickyThumbImg={stickyThumbImg}
                        limited={this.state.limited_Pieces}
                    />
                    <parentContext.Consumer>
                        {({ showModal, updateSelectedState }) => (showModal.productDownloadCode === true ? <Modal modalDetails={downloadPopup} showModalpopUp={"productDownloadCode"}>
                            <ProductDownloadCode ModalpopUp={"productDownloadCode"} />
                        </Modal> : null
                        )}
                    </parentContext.Consumer>

                    <section className="pt-lg-5 pb-lg-5">
                        <div className="container-fluid">
                            <div className="container p-0">
                                <div className="row">
                                    <div className="col-12 pr-lg-3 pl-lg-3">
                                        <ProductSpecs mainContent={contentsRecords} productSocialEmailData={productSocialEmailData} isMobile={isMobile} promotionInfo={promotionInfo} modalDatas={modalDatas} productSizeId={this.state.productSizeId} imageBreakFlag={this.state.imageBreakFlag} staticLabel={staticLabel} show_alert={this.show_alert}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </section>






                    <section className="o-carousel-section">
                        <div className="container-fluid o-carousel-container">

                            <div className={this.state && this.state.classCarousel}>
                                <Carousel carouselsData={this.state.carouselsData} />



                            </div>
                        </div>
                    </section>

                    <section className="d-none d-lg-block extra-info">
                        {(!isEmpty(extraInfoDetails.extraInformationWeb) || !isEmpty(extraInfoDetails.extraInformationWap)) &&
                            <div className="container-fluid">
                                <div className="container p-0">
                                    <div className="row">
                                        <div className="col-12 mt-5 mb-5">
                                            <div className="o-product__productExtraInfo" >
                                                <PdpAccordion headText={staticLabels['pdpPage.extraInformation.label']} isopenStatus="show">
                                                    <ProductExtraInfo extraInfoDetails={extraInfoDetails} />
                                                </PdpAccordion>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        }
                    </section>

                    <section className="d-none d-lg-block">
                        <div className="container-fluid">
                            <div className="container p-0">
                                <div className="row">
                                    <div className="col-12 mt-5 mb-5">
                                        <div className="o-product__comment">
                                            <PdpAccordion headText={"Opiniones del artículo"} isopenStatus="show">
                                                {(isDesktop) &&
                                                    <div id="TurnToReviewsContent"></div>
                                                }

                                            </PdpAccordion>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="o-carousel-section">
                        <div className="container-fluid o-carousel-container">
                            <div className={this.state && this.state.classCarousel}>
                                <Carousel carouselsData={this.state.carouselsData} PdpSecond={true} />
                            </div>
                        </div>
                    </section>



                </div>

            </React.Fragment>

        );


    }

}

const get_UniqueColorList = (props) => {
    let colorList = props.mainContent && props.mainContent.endecaProductInfo && props.mainContent.endecaProductInfo.contents &&
        props.mainContent.endecaProductInfo.contents[0] && props.mainContent.endecaProductInfo.contents[0].mainContent &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0] && props.mainContent.endecaProductInfo.contents[0].mainContent[0].record &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.colorList || [];
    let uniqueColorList = uniq(colorList)
    return uniqueColorList.reverse();
}

const get_FinalSortedSize = (props) => {
    let sizeList = (props.sizeApiRecord && props.sizeApiRecord.variantsData && props.sizeApiRecord.variantsData.colorMap && props.sizeApiRecord.variantsData.colorMap.size) || {};
    var finalSortedSize = [];
    Object.keys(sizeList).forEach(key => {
        let size = sizeList[key];
        finalSortedSize.push({
            size: key,
            disable: (size.split('|'))[0] === 'FALSE' ? true : false,
            sizeid: (size.split('|'))[1]
        })
    });
    return finalSortedSize;
}
const getPriceData = (productInfo) => {

    return {
        list: (productInfo["listPrice"] && productInfo["listPrice"][0]) || "",
        sale: (productInfo["salePrice"] && productInfo["salePrice"][0]) || "",
        promo: (productInfo["promoPrice"] && productInfo["promoPrice"][0]) || "",
        minList: (productInfo["minimumListPrice"] && productInfo["minimumListPrice"][0]) || "",
        maxList: (productInfo["maximumListPrice"] && productInfo["maximumListPrice"][0]) || "",
        minPromo: (productInfo["minimumPromoPrice"] && productInfo["minimumPromoPrice"][0]) || "",
        maxPromo: (productInfo["maximumPromoPrice"] && productInfo["maximumPromoPrice"][0]) || "",
        numRecords: productInfo["numRecords"] || 0
    };
}
const getModalDatas = (productInfo, staticLabels) => {
    return {
        productPolicies: (productInfo["product.refundPolicy"] && productInfo["product.refundPolicy"][0]) || '',
        productLongDescription: (productInfo["product.longDescription"] && productInfo["product.longDescription"][0]) || '',
        productFeatures: (productInfo["product.dynamicAttribute"] && productInfo["product.dynamicAttribute"][0]) || '',
        productPromotion: {
            lpPromotions: productInfo["lpPromotions"] || [],
            otherPromotions: productInfo["otherPromotions"] || [],
        },
        productSocialShare: {
            txtFacebook: staticLabels["pwa.facebook.text"] || 'pwa.facebook.text',
            txtTwitter: staticLabels["pwa.twitter.text"] || 'pwa.twitter.text',
            txtEmail: staticLabels["pwa.email.text"] || 'pwa.email.text',
            txtCopy: staticLabels["pwa.copiar.text"] || 'pwa.copiar.text',
            txtWhatsapp: staticLabels["pwa.whatsapp.text"] || 'pwa.whatsapp.text',
        }
    }
}
const materialBySize = (size, sizeApiRecord = {}) => {
    const materialList = (sizeApiRecord.variantsData && sizeApiRecord.variantsData.colorMap) ? sizeApiRecord.variantsData.colorMap.material : {}
    var matched_sizes = [];
    for (var materialName in materialList) {
        var m_value = materialList[materialName];
        if (m_value.indexOf(size) !== -1) {
            var sku_id = m_value.split('|')[1]
            matched_sizes.push({ name: materialName, size, value: sku_id })
        }
    }
    return matched_sizes;
}
const texturesByMaterail = (material, sizeApiRecord) => {
    const textureList = (sizeApiRecord.variantsData && sizeApiRecord.variantsData.colorMap) ? sizeApiRecord.variantsData.colorMap.texture : {}
    var matched_materials = [];
    for (var textureName in textureList) {
        var t_value = textureList[textureName];
        if (t_value.indexOf(material.name) !== -1 && t_value.indexOf(material.size) !== -1) {
            var sku_id = t_value.split('|')[1]
            matched_materials.push({
                name: textureName,
                value: sku_id,
                material
            })
        }
    }
    return matched_materials;
}
const checkForProductType = (props = {}) => {
    return (props.mainContent && props.mainContent.endecaProductInfo &&
        props.mainContent.endecaProductInfo.contents && props.mainContent.endecaProductInfo.contents[0] &&
        props.mainContent.endecaProductInfo.contents[0].mainContent && props.mainContent.endecaProductInfo.contents[0].mainContent[0] &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record && props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.productType &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.productType[0]) || ""
}
