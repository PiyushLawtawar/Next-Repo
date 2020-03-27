import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import React from 'react';
import Router from 'next/router';
import EventListener from 'react-event-listener';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Alert from '../../molecules/Alert/Alert';
import uniq from 'lodash/uniq';
import StickyBar from '../../organisms/StickyBar/StickyBar';
import PdpProductDetail from '../../organisms/ProductPdp/PdpProductDetail';
import ProductSpecs from '../../organisms/ProductSpecs/ProductSpecs';
import ProductExtraInfo from '../../organisms/ProductSpecs/ProductExtraInfo';
import PdpAccordion from '../../molecules/Accordion/PdpAccordion';
import Carousel from '../../organisms/Carousel/Carousel';
import { Utility, GetPrice, UserAgentDetails, getBrandName, logError, GTMallPages, logDebug, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { locale, localRegistrationUrl, PDPLoadScript } from '../../../../client/config/constants';
import Modal from '../../../helpers/modal/modal'
import { parentContext } from '../../../contexts/parentContext';
import ProductDownloadCode from '../../molecules/Modals/ProductDownloadCode';
import TechnicalSeo from '../../organisms/technicalseo/TechnicalSeo'

export default class Pdp extends React.Component {
    constructor(props) {
        super(props)
        let staticLabelKeyValues = {};
        if (props.mainContent && props.mainContent.staticLabels) {
            for (let k in props.mainContent.staticLabels.staticLabelValues) {
                //console.log("----------------------",k,props.mainContent.staticLabels.staticLabelValues[k])
                if (props.mainContent.staticLabels.staticLabelValues[k].pageName === 'PWA-PDP-PAGE') {
                    staticLabelKeyValues = props.mainContent.staticLabels.staticLabelValues[k].keyValues;
                }
            }

        }
        this.staticKeyValues = staticLabelKeyValues;//get(props, 'mainContent.staticLabels.staticLabelValues[0].keyValues', {});

        const varientColorMap = get(props, 'mainContent.productVarientsInfo.colorMap.size', {});
        const varientColors = get(props, 'mainContent.productVarientsInfo.colorMap.color', {});
        const defaultSkuId = get(props, 'mainContent.productVarientsInfo.defaultSkuId', {});
        const varientSizeArr = Object.keys(varientColorMap);

        let productSizeIdVal = '';
        let productSizeIdValTmp = '';
        this.specsRef = React.createRef();
        try {
            if (varientSizeArr.length === 1) {
                const sizeVal = Object.values(varientColorMap)[0];
                const sizeInfoArr = sizeVal.split('|');
                if (sizeInfoArr.length > 0 && sizeInfoArr[0] === 'TRUE') {
                    productSizeIdValTmp = sizeInfoArr[1] || '';
                }
            } else if (varientSizeArr.length > 1) {
                const varientSizeArrTmp = [];
                !isEmpty(varientColorMap) && map(varientColorMap, (item, index) => {
                    const sizeInfoArr = item.split('|');
                    if (sizeInfoArr.length > 0 && sizeInfoArr[0] === 'TRUE') {
                        varientSizeArrTmp.push((sizeInfoArr[1] || ''));
                    }
                });
                if (varientSizeArrTmp.length === 1) {
                    productSizeIdValTmp = varientSizeArrTmp[0];
                }
            }
            //const productSizeId = (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) ? Object.keys(props.mainContent.productVarientsInfo.skuAttributeMap)[0] : '';
            const productSizeId = !isEmpty(varientColors) && Object.keys(varientColors) && Object.keys(varientColors)[0] && varientColors[Object.keys(varientColors)[0]] && varientColors[Object.keys(varientColors)[0]] != "" && varientColors[Object.keys(varientColors)[0]].split("|")[2] || defaultSkuId || (props.mainContent && props.mainContent.productId) || ""
            productSizeIdVal = productSizeIdValTmp || productSizeId;
        } catch (e) { logDebug("Onload single size finding error: ", e); }
        this.funChangeTabs = this.funChangeTabs.bind(this);
        this.isScrolled = false;
        this.state = {
            carouselsData: {},
            stickyVisbility: false,
            alertToTopSticky: '',
            alertToTop: '',
            breadcrumbData: this.props.mainContent && this.props.mainContent.breadcrumbData || {}, // changes for 23389 breadcrumb null check
            sizeApiRecord: {},
            sizeRecords: props.mainContent.productVarientsInfo || {},
            productId: props.mainContent.productId,
            skuAttributeMap: (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) || {},
            // productSizeId: (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) ? Object.keys(props.mainContent.productVarientsInfo.skuAttributeMap)[0] : {},
            productSizeId: productSizeIdVal,
            productType: checkForProductType(props),
            colorText: '',
            hoverColorText: '',
            productSizeName: '',
            colorStyle: '',
            colorImage: '', /*changes for color image implementation */
            finalPrices: {},
            anySizeSelected: false,
            sortedSizeActive: [],
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
            noInventoryText: (this.staticKeyValues && this.staticKeyValues["pdpPage.out_of_stock.errormsg"] || "pdpPage.out_of_stock.errormsg"),
            alert_status: false,
            alert_message: '',
            storeNumber: "",
            selectedStoreStateId: "",
            postalZipCode: "",
            selectedAddressInfo: {},
            alloffers: this.props.mainContent.alloffers || {},
            Hostname: '',
            window: '',
            chanelVal: '',
            brandVal: '',
            limited_Pieces: '0',
            chanelBrandCss: 'NA',
            globalConfigData: this.props.configurationData,
            contentItem: this.props.mainContent,
            hostName: props.hostname,
            relativePath: props.url,
            ENV: props.mainContent.ENV,
            turntokey: props.mainContent.turntokey || '',
            changeTabs: "",
            skuStockAvailability: {},
            opticData: {},
            resetQty: "1",
            orientation: 0 /* addedd for bug 23061 */

        }
        this.stockAvailabilityMessage = "";
        this.getHybridPDPData = this.getHybridPDPData.bind(this);
        this.imageBreak = this.imageBreak.bind(this);
        global.TurnToItemSku = props.mainContent.productId
        this.allOffers = [];
        this.GTMTrigger = false;

    }

    funChangeTabs = (targetedTab) => {

        this.specsRef.current.specsOptionRef.current.onClickTabItem(targetedTab)
        // this.setState({ changeTabs: targetedTab })
    }

    // event to show and hide sticky bar on pdp page scroll

    /* modified function condition for bug id 23601 start*/
    handleScroll = (event) => {
        let orientation = window.orientation;
        let padHeigth = window.innerHeight;
        let padWidth = window.innerWidth;
        let elem = document.getElementsByClassName("o-stickyBar__container");
        //console.log("stickyelem", elem);
        const { isDesktop, isMobile, isIpad } = UserAgentDetails(window);
        if (elem.length > 0) {
            if (isDesktop || (isIpad && (Math.abs(orientation) === 90 || Math.abs(window.orientation) === 90 || padWidth > padHeigth || padWidth > 990))) {
                if (window.scrollY >= 330) {

                    if (this.state.stickyVisbility != true) {
                        this.setState({
                            stickyVisbility: true,
                            alertToTopSticky: '-toTopSticky',
                            alertToTop: ''
                        });
                    }
                }
                else {
                    if (this.state.stickyVisbility != false) {
                        this.setState({ stickyVisbility: false, alertToTopSticky: '', alertToTop: window.scrollY >= 117 ? '-toTop' : '' });
                    }
                    else {
                        if (this.state.alert_status === true) {
                            this.setState({ alertToTopSticky: '', alertToTop: window.scrollY >= 117 ? '-toTop' : '' });
                        }
                    }
                }
            }
            else {
                if (this.state.alert_status === true) {
                    this.setState({ alertToTopSticky: '', alertToTop: window.scrollY >= 117 ? '-toTop' : '' });
                }
            }
        }
    }
    /* modified function condition for bug id 23601 end*/

    toggleQtyDropdown = () => {
        
        if (this.state.showQtyDropdown) {
            this.setState({ showQtyDropdown: false, resetQty: '', pdpQty:this.state.resetQty });// this.state.limited_Pieces != 0 ? this.state.limited_Pieces : '' });
        } else {
            this.setState({ showQtyDropdown: true, resetQty: '' });// this.state.limited_Pieces != 0 ? this.state.limited_Pieces : '' });
        }
    }
    limitedqty = (qty) => {

        qty = qty == "" ? "1" : qty;
        if (this.state.limited_Pieces > qty) {
            return false;
        } else {
            return true;
        }
    }
    onColorHover = (hoveredColor) => {

        this.setState({ hoverColorText: hoveredColor })
    }
    onSelectDropdownQty = (qty) => {
        
        if (!this.limitedqty(qty)) { this.setState({ pdpQty: this.state.limited_Pieces }); return false; }
        else {
            if (qty === '6+') {
                if (this.state.pdpQty !== '') {
                    this.setState({ resetQty: "1", pdpQty: '' });
                }
                const qtyInput = document.getElementById('a-ProductQty__inputDesktop');
                qtyInput && qtyInput.focus();
            } else if (qty !== '' ) {
                this.setState({ resetQty: "1", pdpQty: qty });
            }
            this.setState({ showQtyDropdown: false });
        }

    }

    onSelectModalQty = (qty) => {

        if (!this.limitedqty(qty)) { return false; }
        else {
            if (qty === '6+') {
                this.setState({ resetQty: "1", pdpQty: '' });
                const qtyInput = document.getElementById('a-ProductQty__inputMobile');
                qtyInput && qtyInput.focus();
            } else if (qty !== '' && qty !== this.state.pdpQty) {
                this.setState({ resetQty: "1", pdpQty: qty });
            }
        }
    }
    onClickQtyReset = (qty) => {
        this.setState({ resetQty: "" });
    }

    onChangeQty = (qty, src) => {
        
        if (qty != "") {
            if (!isNaN(qty) && qty.length <= 3) {
                this.setState({ resetQty: "1", pdpQty: qty });
            }
        }
        else {
            this.setState({ resetQty: "1", pdpQty: qty });
        }

    }
    onBlurQty = (e, stky) => {

        // console.log("qty" , this.state.pdpQty)
        // console.log("oldQty", this.state.oldQty)
        let crtstateQty = this.state.pdpQty
        //console.log("crtstateQty", crtstateQty)
        let qty = ''
        if (stky != 'undefined' && stky == 'stickbar') {
            qty = e;
        } else qty = e.target.value
        let limqty = this.state.limited_Pieces
        limqty = limqty.toString();
        if (qty != "") {
            if (!this.limitedqty(qty)) {
                this.setState({ resetQty: "1", pdpQty: limqty }); qty = this.state.limited_Pieces
            }

        }
        else {
            //console.log("id log", e.target.id)
            // if(e.target.id == "a-ProductQty__inputMobile"){
            this.setState({ resetQty: "1", pdpQty: stky != 'undefined' && stky == 'stickbar' ? e : !this.limitedqty(qty) ? this.state.limited_Pieces : crtstateQty == "" ? '1' : crtstateQty })
            // }
        }
    }





    onAddItemToEvent = ({ modeOfDelivery, eventId, departmentId, selectedSkuId, thumbnailImage, closeModal, showAlert }) => {

        try {

            const GRContext = get(this.state.globalConfigData, 'configuration.siteConfigurations.giftRegistryContext', '');
            const errorMsg = this.staticKeyValues['pdpPage.addItemToEvent.error.text'] || '';
            const { isDesktop, isMobile, isIpad } = UserAgentDetails(this.state.window);
            let chanel = "";
            (isIpad || isMobile) ? chanel = "wap" : chanel = "web";
            const BrandName = getBrandName(this.state.window);
            let brand = BrandName && BrandName.brand
            const payload = {
                "eventId": eventId,
                "skuId": selectedSkuId,
                "skuName": "lp",
                "departmentId": departmentId,
                "quantity": this.state.pdpQty,
                "imageURL": thumbnailImage,
                "GRDomain": GRContext,
                "channel": chanel,
                "brand": brand
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
                        "channel": chanel,
                        "brand": brand
                    }).then(response => {
                        const res = response.data || {};
                        if (res.status === "success") {
                            closeModal('showModal15');
                            let message = this.staticKeyValues['pdpPage.addItemToEvent.success.text'] || '';
                            this.show_alert(message, "success");
                            //window.scrollTo(0, 0);
                        } else {
                            const alertInfo = {
                                type: 'error',
                                text: get(res, 'errorMessage', errorMsg)
                            };
                            showAlert(alertInfo);
                            //window.scrollTo(0, 0);
                        }
                    });

                } else {
                    const alertInfo = {
                        type: 'error',
                        text: get(responseData, 'errorMessage', errorMsg)
                    };
                    showAlert(alertInfo);
                    //window.scrollTo(0, 0);
                }

            });

        } catch (e) { logError("Error: ", e) }

    }

    getConfiguration = () => {
        const productId = this.state.productId;
        const Hostname = window.location.hostname;
        if (!this.state.globalConfigData || typeof this.state.globalConfigData === 'undefined') {
            Utility(Path.fetchConfiguration, 'GET').then(response => {
                if (response && response.data) {
                    let globalConfigData = response.data || {};
                    this.setState({ globalConfigData: globalConfigData })
                    let defectiveProducts = response && response.data && response.data.configuration && response.data.configuration.defectiveProducts || {};
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
        } else {
            let defectiveProducts = this.state.globalConfigData && this.state.globalConfigData.configuration && this.state.globalConfigData.configuration.defectiveProducts || {};
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

    }


    closeQtyDropdown = (e) => {
        //

        try {
            const qtyClassNames = e && e.target && e.target.className || '';
            if (qtyClassNames.indexOf("pdpDropdwonToClose") === -1 && this.state.showQtyDropdown) {
                this.setState({ showQtyDropdown: false, pdpQty: this.state.limited_Pieces > "1" ? this.state.limited_Pieces : this.state.pdpQty == "" ? '1' : this.state.pdpQty }) /*added empty condition to fix 22120 */
            }
        } catch (e) { logError(e); }
    }

    onSelectGiftItem = (index, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType) => {
        if (this.state.activeGiftItemIndex !== index) {
            this.setState({ activeGiftItemIndex: index, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType });
        }
    }

    componentWillReceiveProps(newProps, state) {
        this.loadData('WillReceiveProps', newProps);
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
    replaceBrandCssConfig(brandCssConfig) {
        let everyPageStatic = null;
        const staticLabelsArray = this.props.mainContent.staticLabels ? this.props.mainContent.staticLabels.staticLabelValues : null;
        if (staticLabelsArray) {
            staticLabelsArray.map(page => {
                logDebug("page name is " + page['pageName']);
                if (page['pageName'] && page['pageName'] === 'PWA-TECH-SEO-EVERY-PAGE') {
                    everyPageStatic = page['keyValues'];
                }
            })
        }

        let json = {
            "PDP_Desc_css_class": "",
            "PDP_Price_css_class": "",
            "PDP_DiscountPrice_css_class": "",
            "PDP_Desc_style": "",
            "PDP_Price_style": "",
            "PDP_DiscountPrice_style": "",
            "carousel_Desc_css_class": "",
            "carousel_Price_css_class": "",
            "carousel_DiscountPrice_css_class": "",
            "carousel_Desc_style": "",
            "carousel_Price_style": "",
            "carousel_DiscountPrice_style": ""
        };
        if (brandCssConfig && everyPageStatic) {
            const key = brandCssConfig.trim();

            json['PDP_Button_css_class'] = everyPageStatic[key + '_PDP_Button_css_class'];
            json['PDP_Button_style'] = everyPageStatic[key + '_PDP_Button_style'];
            json['PDP_Desc_css_class'] = everyPageStatic[key + '_PDP_Desc_css_class'];
            json['PDP_Price_css_class'] = everyPageStatic[key + '_PDP_Price_css_class'];
            json['PDP_DiscountPrice_css_class'] = everyPageStatic[key + '_PDP_DiscountPrice_css_class'];
            json['PDP_Desc_style'] = everyPageStatic[key + '_PDP_Desc_style'];
            json['PDP_Price_style'] = everyPageStatic[key + '_PDP_Desc_css_class'];
            json['PDP_DiscountPrice_style'] = everyPageStatic[key + '_PDP_DiscountPrice_style'];
            json['carousel_Desc_css_class'] = everyPageStatic[key + '_carousel_Desc_css_class'];
            json['carousel_Price_css_class'] = everyPageStatic[key + '_carousel_Price_css_class'];
            json['carousel_DiscountPrice_css_class'] = everyPageStatic[key + '_carousel_DiscountPrice_css_class'];
            json['carousel_Desc_style'] = everyPageStatic[key + '_carousel_Desc_style'];
            json['carousel_Price_style'] = everyPageStatic[key + '_carousel_Price_style'];
            json['carousel_DiscountPrice_style'] = everyPageStatic[key + '_carousel_DiscountPrice_style'];
        }
        return json;
    }
    getchanelBrandHTML = () => {
        let everyPageStatic = null;
        const staticLabelsArray = this.props.mainContent.staticLabels ? this.props.mainContent.staticLabels.staticLabelValues : null;
        if (staticLabelsArray) {
            staticLabelsArray.map(page => {
                if (page['pageName'] && page['pageName'] === 'PWA-TECH-SEO-EVERY-PAGE') {
                    everyPageStatic = page['keyValues'];
                }
            })
        }

        if (everyPageStatic && this.state.endecaProductRecord && this.state.endecaProductRecord.brandCssConfig) {
            const config = this.state.endecaProductRecord.brandCssConfig;
            const key = config[0].trim() + '_PDP_Banner_html';
            if (config && typeof config !== 'undefined' && config[0] && everyPageStatic && everyPageStatic[key]) {
                return everyPageStatic[key];
            }
        } else {
            return 'NA';
        }
    }
    getchanelBrandCss() {
        if (this.state.endecaProductRecord && this.state.endecaProductRecord.brandCssConfig) {
            const config = this.state.endecaProductRecord.brandCssConfig;
            if (config && typeof config !== 'undefined' && config[0]) {
                return this.replaceBrandCssConfig(config[0].trim());
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
                if (record.attributes && typeof record.attributes === 'object') {
                    record = record.attributes;
                }
                if ((record['sku.repositoryId'][0] === productSizeId) || (record['sku.repositoryId'].indexOf(productSizeId) > -1)) {
                    listPrice = (record['listPrice'] instanceof Array) ? record['listPrice'][0] : record['listPrice'];
                    if (typeof listPrice === 'undefined') {
                        listPrice = (record['sku.list_Price'] instanceof Array) ? record['sku.list_Price'][0] : record['sku.list_Price'];
                    }
                    salePrice = (record['salePrice'] instanceof Array) ? record['salePrice'][0] : record['salePrice'];
                    if (typeof salePrice === 'undefined') {
                        salePrice = (record['sku.sale_Price'] instanceof Array) ? record['sku.sale_Price'][0] : record['sku.sale_Price'];
                    }
                    promoPrice = (record['promoPrice'] instanceof Array) ? record['promoPrice'][0] : record['promoPrice'];
                    if (typeof promoPrice === 'undefined') {
                        promoPrice = (record['sku.promoPrice'] instanceof Array) ? record['sku.promoPrice'][0] : record['sku.promoPrice'];
                    }
                    imageURL = (record['sku.thumbnailImage'] instanceof Array) ? record['sku.thumbnailImage'][0] : record['sku.thumbnailImage'];
                    size = (record['sku.size'] instanceof Array) ? record['sku.size'][0] : record['sku.size'];
                    color = (record['sku.color'] instanceof Array) ? record['sku.color'][0] : record['sku.color'];
                    title = (record['skuDisplayName'] instanceof Array) ? record['skuDisplayName'][0] : record['skuDisplayName'];
                    if (typeof title === 'undefined') {
                        title = (record['product.displayName'] instanceof Array) ? record['product.displayName'][0] : record['product.displayName'];
                    }
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
    addToCartNewBySWOGO = (bundle, callBack) => {
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
        const skuOffers = this.state.alloffers && this.state.alloffers.skuOffers && this.state.alloffers.skuOffers[0] || {};
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
        if (!bundle || typeof bundle === 'undefined') {
            callBack("Provided data is not available", null);
        } else {
            let localSkuAttribute = JSON.stringify(this.state.sizeRecords.skuAttributeMap ? this.state.sizeRecords.skuAttributeMap : "");
            bundle.map(item => {
                currentProduct = Object.assign({}, productObj);
                if (localSkuAttribute.indexOf(item.sku) > -1) {
                    currentProduct['productId'] = (gwpProductId ? productId + "," + gwpProductId : productId);
                    currentProduct['catalogRefId'] = (gwpskuId ? item.sku + "," + gwpskuId : item.sku);
                    currentProduct['productType'] = (gwpProductType ? productType + "," + gwpProductType : productType);
                    currentProduct['parentGWPProduct'] = gwpskuId ? item.sku : "";
                    currentProduct['promotionalGiftMessage'] = gwpskuId ? promoMsg : "";
                    currentProduct['giftProductId'] = gwpProductId ? gwpProductId : "";
                    currentProduct['giftSku'] = gwpskuId ? gwpskuId : "";
                    currentProduct['giftProductType'] = gwpProductType ? gwpProductType : "";

                } else {
                    currentProduct['productId'] = "SWOGO";
                    currentProduct['catalogRefId'] = item.sku;
                    currentProduct['productType'] = "SWOGO";
                    currentProduct['parentGWPProduct'] = "";
                    currentProduct['promotionalGiftMessage'] = "";
                }
                currentProduct['quantity'] = JSON.stringify(item.quantity);
                currentProduct['imageURL'] = "SWOGO";
                currentProduct['displayName'] = "SWOGO";
                currentProduct['size'] = "SWOGO";
                currentProduct['color'] = "SWOGO";
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
                currentProduct['listPrice'] = "0";
                currentProduct['salePrice'] = "0";
                currentProduct['bestPromoAmount'] = "0";
                /*  if (!isEmpty(this.state.postalZipCode)) {
                      currentProduct['zipCode'] = this.state.postalZipCode;
                      currentProduct['eddZipCode'] = this.state.postalZipCode;
                      currentProduct['deliveryMethod'] = 'home';
                  }
                  if (!isEmpty(this.state.storeNumber)) {
                      currentProduct['deliveryMethod']  = 'store';
                      currentProduct['storeNumber'] = this.state.storeNumber;
                      currentProduct['stateId'] = this.state.selectedStoreStateId;
                  }
                  if (!isEmpty(this.state.selectedAddressInfo)) {
                      currentProduct['deliveryMethod']  = 'home';
                      currentProduct['zipCode'] = (this.state.selectedAddressInfo && this.state.selectedAddressInfo['postalCode'] || '');
                      currentProduct['eddZipCode'] = (this.state.selectedAddressInfo && this.state.selectedAddressInfo['postalCode'] || '');
                      currentProduct['addressId'] = (this.state.selectedAddressInfo && this.state.selectedAddressInfo['addressId'] || '');
                  }*/
                currentProduct['storeNumber'] = this.state.storeNumber ? this.state.storeNumber : '';
                currentProduct['eddZipCode'] = this.state.postalZipCode ? this.state.postalZipCode : '';
                currentProduct['isSpecialSale'] = typeof this.props.mainContent.isSpecialSale !== 'undefined' ? this.props.mainContent.isSpecialSale : "false";
                if (!isEmpty(skuOffers)) {
                    const { bestSeller = '', sellerId, sellerSkuId, sellerOperatorId, offerId } = skuOffers;
                    currentProduct['sellerId'] = sellerId;
                    currentProduct['sellerSkuId'] = sellerSkuId;
                    currentProduct['sellerName'] = bestSeller;
                    currentProduct['sellerOperatorId'] = sellerOperatorId;
                    currentProduct['offerId'] = offerId;
                } else {
                    currentProduct['sellerId'] = "";
                    currentProduct['sellerSkuId'] = "";
                    currentProduct['sellerName'] = "";
                    currentProduct['sellerOperatorId'] = "";
                    currentProduct['offerId'] = "";
                }
                productList.push(currentProduct);
            });
            this.addMultipleItemToCart({ "products": { "productList": productList } }, callBack);
        }

    }
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
    //--------------Gtm PDP------------------
    onLoadPdpGtm = (data, payload, selectedSku) => {

        //console.log('this.state.colorText', this.state.colorText, this.state.finalPrices);
        // console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeee',this.state && this.state.alloffers && this.state.alloffers.finalPriceMax && this.state.alloffers.listPriceMax)
        let gtmObject = null;
        let listPrice = '';
        let salePrice = '';
        let promoPrice = '';
        let catName = this.state && this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs && this.state.breadcrumbData.breadCrumbs[0] && this.state.breadcrumbData.breadCrumbs[0].categoryName; // changes for 23389 breadcrumb null check
        let listName = this.state && this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs && this.state.breadcrumbData.breadCrumbs;
        let listProperty = '';
        let checkLength = 0;

        if (listName !== undefined) {
            checkLength = listName.length;
            listProperty = listName[checkLength - 1];
            listProperty = listProperty && listProperty.categoryName ? listProperty.categoryName + '|principal' : '';
        }

        // let checkLength = listName.length;
        // listProperty = listName[checkLength-1];
        // listProperty = listProperty &&  listProperty.categoryName ? listProperty.categoryName +'|principal' :'' ;
        let MKPflag = false;
        // console.log(' this.state.alloffers', this.state.alloffers,Object.entries(this.state.alloffers).length === 0 , this.state.alloffers.constructor === Object)
        if (Object.entries(this.state.alloffers).length === 0 && this.state.alloffers.constructor === Object) {
            MKPflag = false;
        } else {
            MKPflag = true;
        }
        // console.log('MKPflag',MKPflag);
        if (this.state && this.state.alloffers && this.state.alloffers.finalPriceMax && this.state.alloffers.listPriceMax) {
            promoPrice = salePrice = this.state.alloffers.finalPriceMax;
            listPrice = this.state.alloffers.listPriceMax;
        }

        if (Object.entries(this.state.finalPrices).length !== 0) {
            MKPflag = true
            promoPrice = this.state.finalPrices.promo;
            salePrice = this.state.finalPrices.sale;
            listPrice = this.state.finalPrices.list;
            /*23378 starts in some cases final prices data is becoming empty and when it is empty extract from sku attribute map*/
            let recordData = this.state.endecaProductRecord;
            if ((typeof listPrice === 'undefined' || (typeof listPrice === 'string' && listPrice.trim().length <= 0)) && this.state.skuAttributeMap && Object.entries(this.state.skuAttributeMap).length > 0) {
                const currentSku = selectedSku || recordData['sku.repositoryId'] && recordData['sku.repositoryId'][0] || '';
                Object.keys(this.state.skuAttributeMap).map(sku => {
                    if (sku === currentSku) {
                        promoPrice = this.state.skuAttributeMap[sku]['promoPrice'];
                        salePrice = this.state.skuAttributeMap[sku]['salePrice'];
                        listPrice = this.state.skuAttributeMap[sku]['listPrice'];
                    }
                });
            }
            //incase if sku attribute map do not have data then get from normal pdp object
            if (typeof listPrice === 'undefined' || (typeof listPrice === 'string' && listPrice.trim().length <= 0)) {
                listPrice = recordData.maximumListPrice && recordData.maximumListPrice[0] && recordData.maximumListPrice[0].toString();
                promoPrice = recordData.promoPrice && recordData.promoPrice[0] && recordData.promoPrice[0].toString();
            }
            /*23378 ends*/
        }
        let dataAvailable = this.state.endecaProductRecord;

        if (!dataAvailable || !dataAvailable.productDisplayName) {
            return false;
        }

        let getSellerName = window && window.location && window.location.host;
        let sellerNameHardCode = '';
        if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'liverpool';
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteens') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'liverpool';
            }
        }

        let sizeKeys = get(this.state.sizeRecords, 'colorMap.size', {});
        let sizeKeyActive = sizeKeys;
        let activeKeyForCart = this.state.productSizeName || '';
        let bestSeller = this.state && this.state.alloffers && this.state.alloffers.skuOffers && this.state.alloffers.skuOffers[0] && this.state.alloffers.skuOffers[0].bestSeller;
        let getSellerNameForAll = ';'
        if (bestSeller) {
            getSellerNameForAll = bestSeller;
        } else {
            getSellerNameForAll = sellerNameHardCode;
        }
        /* Defec id 23367:Start */
        if (data === 'onload') {
            sizeKeys = Object.keys(sizeKeys);
            gtmObject = {
                "event": "productDetail",
                'ecommerce': {
                    "detail": {
                        'actionField': {
                            'list': listProperty || ''
                        },
                        'products': [{
                            'name': dataAvailable.productDisplayName[0] || '',
                            'id': dataAvailable.productId[0] || '', //Generic SKU
                            'category': catName || '',
                            'variant': 'N/A',
                            'price': MKPflag === true ? (promoPrice != '0.0' ? promoPrice && promoPrice.toString() : (salePrice != '0.0' ? salePrice && salePrice.toString() : listPrice && listPrice.toString())) : (dataAvailable.promoPrice && dataAvailable.promoPrice[0] !== '0.0' ? dataAvailable.promoPrice && dataAvailable.promoPrice[0] && dataAvailable.promoPrice[0].toString() : dataAvailable.listPrice && dataAvailable.listPrice[0] && dataAvailable.listPrice[0].toString() || ''),
                            'brand': dataAvailable && dataAvailable['product.brand'] && dataAvailable['product.brand'][0] || '',
                            'dimension27': payload ? payload : sizeKeys || '', //CD 27 If doesn`t apply, the value must be empty “”
                            'dimension28': this.state.colorText || '',
                            // 'dimension28': dataAvailable['sku.color'] && dataAvailable['sku.color'][0] || '', //CD 27 If doesn`t apply, the value must be empty  “”
                            'dimension36': bestSeller ? 'Market Place-' + bestSeller : sellerNameHardCode, //CD 36
                            'dimension40': selectedSku || dataAvailable['sku.repositoryId'] && dataAvailable['sku.repositoryId'][0] || '', //CD 40
                            'dimension41': dataAvailable['sku.material'] && dataAvailable['sku.material'][0] || '', //CD 41 If doesn`t apply, the value must be  empty “”
                            'dimension42': dataAvailable['sku.texture'] && dataAvailable['sku.texture'][0] || '', //CD 42 If doesn`t apply, the value must be empty  “”
                            'dimension43': 'N',
                            'metric2': MKPflag ? listPrice && listPrice.toString() : dataAvailable.maximumListPrice && dataAvailable.maximumListPrice[0] && dataAvailable.maximumListPrice[0].toString(), //M2
                            'metric3': MKPflag ? promoPrice && promoPrice.toString() : dataAvailable.promoPrice && dataAvailable.promoPrice[0] && dataAvailable.promoPrice[0].toString() //M3
                        }]
                    }
                }
            }
        } else if (data === "click") {

            gtmObject = {
                'event': 'addToCart',
                'ecommerce': {
                    'add': {
                        'products': [{
                            'name': dataAvailable.productDisplayName[0] || '',
                            'id': dataAvailable.productId[0] || '', //Generic SKU
                            'category': catName || '',
                            'variant': 'N/A',
                            // 'price': MKPflag === true ? promoPrice != '0.0' ? promoPrice : listPrice : dataAvailable.promoPrice && dataAvailable.promoPrice[0] !== '0.0' ? dataAvailable.promoPrice && dataAvailable.promoPrice[0] : dataAvailable.listPrice && dataAvailable.listPrice[0] || '',
                            //'price': payload['listPriceWithDiscount'] && payload['listPriceWithDiscount'].toString(),
                            'price': MKPflag === true ? (promoPrice != '0.0' ? promoPrice && promoPrice.toString() : (salePrice != '0.0' ? salePrice && salePrice.toString() : listPrice && listPrice.toString())) : payload['listPriceWithDiscount'] && payload['listPriceWithDiscount'].toString(), /*modified for bug id 23285  */

                            'brand': dataAvailable && dataAvailable['product.brand'] && dataAvailable['product.brand'][0] || '',
                            'quantity': payload.quantity ? payload.quantity * 1 : '',
                            'dimension27': dataAvailable['sku.size'] && dataAvailable['sku.size'][0] || '', //CD 27 If doesn`t apply, the value must be empty “”
                            'dimension27': activeKeyForCart || '',
                            'dimension28': this.state.colorText || '',
                            // 'dimension28': dataAvailable['sku.color'] && dataAvailable['sku.color'][0] || '', //CD 27 If doesn`t apply, the value must be empty  “”
                            'dimension36': bestSeller ? 'Market Place-' + bestSeller : getSellerNameForAll, //CD 36
                            'dimension40': selectedSku || '', //CD 40
                            'dimension41': dataAvailable['sku.material'] && dataAvailable['sku.material'][0] || '', //CD 41 If doesn`t apply, the value must be  empty “”
                            'dimension42': dataAvailable['sku.texture'] && dataAvailable['sku.texture'][0] || '', //CD 42 If doesn`t apply, the value must be empty  “”
                            'dimension43': 'N',
                            //'metric2': MKPflag ? listPrice : dataAvailable.maximumListPrice && dataAvailable.maximumListPrice[0], //M2
                            //'metric3': MKPflag ? promoPrice : dataAvailable.promoPrice && dataAvailable.promoPrice[0] //M3
                            //'metric2': payload['listPrice'] && payload['listPrice'].toString(),
                            'metric2': MKPflag === true ? listPrice && listPrice.toString() : payload['listPrice'] && payload['listPrice'].toString(), /*fix for bug id 23285 end , removed the promo price and sale price on 04-sep */
                            'metric3': payload['listPriceWithDiscount'] && payload['listPriceWithDiscount'].toString()
                        }]
                    }
                }
            };
        }
        /* Defec id 23367:End */
        if (gtmObject) {
            Utility(Path.gtmServiceCall, 'POST', gtmObject).then(response => {
                let payload = response.data;
                dataLayer.push(payload);
                //22904## added for this defect and please do not change this code. Please check with siva before making changes
                if (window && window.swogoAPI) {
                    window.swogoAPI.reset();
                }
            })
        }
    }
    //--------------Gtm PDP------------------
    componentDidUpdate() {

        const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
        if (enableGtmFlag) {
            if (this.props.loginDetails.cartHeaderProcessCompleted && !this.GTMTrigger) {
                this.GTMTrigger = true;
                this.onLoadPdpGtm('onload');
            }
        }
        if (!this.isScrolled) {
            try {
                this.isScrolled = true;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                window.scrollTo(0, 0);
            } catch (e) { }
        }
    }
    updatePdpData = () => {
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        logDebug('GTM dataLayer::on PDP', contentsRecords);
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};
        const uniqueColorList = this.getHexaColorCodeByColorName('', colorList)
        const GetENV = this.state.ENV || '';
        const Truntokey = this.state.turntokey;

        const windowObj = window || {};
        // window.addEventListener('scroll', this.handleScroll);

        this.setState({ uniqueColorList }, () => {
            // this.getVariantsByColor('', Object.keys(colorList)[0], 0);
            let variantsData = { "colorMap": get(this.props.mainContent, 'productVarientsInfo.colorMap', {}) };
            let responseData = { variantsData };
            this.forColorAndSize(responseData, { e: '', val: Object.keys(colorList)[0], index: 0 });
        })
        /* added for bug id  23285 - start */
        const isMarketPlace = get(contentsRecords, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
        if (isEmpty(uniqueColorList)) {
            let productInfo = get(contentsRecords, 'endecaProductInfo.contents[0].mainContent[0].record', {});
            this.setState({ finalPrices: ((typeof isMarketPlace === "boolean" && isMarketPlace) || (typeof isMarketPlace === "string" && isMarketPlace === 'true')) ? this.marketPlaceBestPrice(this.state.productSizeId) : getPriceData(productInfo) })
        }
        /* added for bug id  23285 - end */
        this.getPdpDynamicContent();
        // let stkAvlblty = this.props.mainContent && this.props.mainContent.breadcrumbData && this.props.mainContent.breadcrumbData.stockAvailability || ""
        let stkAvlblty = this.state.skuStockAvailability || ""
        if (stkAvlblty != "") {
            this.setState({ skuStockAvailability: stkAvlblty })
        } else {

            let variantsData = { "colorMap": get(this.props.mainContent, 'productVarientsInfo.colorMap', {}) };
            let responseData = { variantsData };
            let finalSortedSize = get_FinalSortedSize({ sizeApiRecord: responseData });
            let finalSortedSizeActive = [];
            map(finalSortedSize, (item, i) => {
                if (!item.disable) {
                    finalSortedSizeActive.push(item);
                }
            });
            finalSortedSizeActive.length < 2 && this.getstockAvailability();
        }
        let userAgent = (UserAgentDetails(window))
        //window.addEventListener('scroll', this.handleScroll);
        //window.addEventListener('scroll', this.handleScrollAlert);
        //document.body.addEventListener('click', this.closeQtyDropdown);

        const chanelVal = (userAgent.isIpad || userAgent.isMobile) ? "wap" : "web";
        const { brand = '' } = getBrandName(window);
        const brandVal = brand;
        const productType = checkForProductType(this.props);

        window.TRUNTO_KEY = Truntokey;
        window.locale = locale;
        window.PageName = 'PDP';
        window.localRegistrationUrl = localRegistrationUrl;
        //Required for sWOGO functionalities
        window.swogoDependencies = { getSkus: this.getSkusInfoForSWOGO, getPage: this.getSWOGOPageIdentifier, addToCart: this.addToCartNewBySWOGO };
        this.setState({ Hostname: window.location.hostname, chanelBrandCss: this.getchanelBrandCss(), chanelVal, brandVal, productType });
        /* if (window && window.swogoAPI) {
             window.swogoAPI.reset();
         }*/
        const gwpFirstItem = get(productVarientsInfo, 'gwpPromotions.giftItems[0]', {});
        if (!isEmpty(gwpFirstItem)) {
            const GWPSelectedProductId = get(gwpFirstItem, 'productId', '');
            const GWPSelectedProductType = get(gwpFirstItem, 'productType', '');
            const GWPSelectedAssociatedSkuId = get(gwpFirstItem, 'associatedSkuId', '');
            this.setState({ activeGiftItemIndex: 0, GWPSelectedProductId, GWPSelectedProductType, GWPSelectedAssociatedSkuId }); //defect id 23621
        }
        this.setState({ window: windowObj });
        this.Limited_pieces_skus();
        this.getConfiguration();
        screen.width <= 768
        //this.setState({ classCarousel: screen.width <= 768 ? "p-0" : "container p-0" });
        // recently viewed is not required at last in PDP page
        //window.sessionStorage.setItem("productId", this.getRecentlyViewed(this.state.productId));
        if ((typeof isMarketPlace === "boolean" && isMarketPlace) || (typeof isMarketPlace === "string" && isMarketPlace === 'true')) {
            this.getOffers();
        }
        this.state.changeTabs = "";
        this.loadScript();
    }

    loadData = (calledFrom, newProps) => {
        if (calledFrom === 'DidMount') {
            this.updatePdpData();

        } else if (calledFrom === 'WillReceiveProps') {

            const newVarientColorMap = get(newProps, 'mainContent.productVarientsInfo.colorMap.size', {});
            const newVarientColors = get(newProps, 'mainContent.productVarientsInfo.colorMap.color', {});
            const newDefaultSkuId = get(newProps, 'mainContent.productVarientsInfo.defaultSkuId', {});
            const newVarientSizeArr = Object.keys(newVarientColorMap);

            let newProductSizeIdVal = '';
            let newProductSizeIdValTmp = '';
            try {
                if (newVarientSizeArr.length === 1) {
                    const sizeVal = Object.values(newVarientColorMap)[0];
                    const sizeInfoArr = sizeVal.split('|');
                    if (sizeInfoArr.length > 0 && sizeInfoArr[0] === 'TRUE') {
                        newProductSizeIdValTmp = sizeInfoArr[1] || '';
                    }
                } else if (newVarientSizeArr.length > 1) {
                    const varientSizeArrTmp = [];
                    !isEmpty(newVarientColorMap) && map(newVarientColorMap, (item, index) => {
                        const sizeInfoArr = item.split('|');
                        if (sizeInfoArr.length > 0 && sizeInfoArr[0] === 'TRUE') {
                            varientSizeArrTmp.push((sizeInfoArr[1] || ''));
                        }
                    });
                    if (varientSizeArrTmp.length === 1) {
                        newProductSizeIdValTmp = varientSizeArrTmp[0];
                    }
                }
                //const productSizeId = (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) ? Object.keys(props.mainContent.productVarientsInfo.skuAttributeMap)[0] : '';
                const newProductSizeId = !isEmpty(newVarientColors) && Object.keys(newVarientColors) && Object.keys(newVarientColors)[0] && newVarientColors[Object.keys(newVarientColors)[0]] && newVarientColors[Object.keys(newVarientColors)[0]] != "" && newVarientColors[Object.keys(newVarientColors)[0]].split("|")[2] || newDefaultSkuId || (props.mainContent && props.mainContent.productId) || ""
                newProductSizeIdVal = newProductSizeIdValTmp || newProductSizeId;
            } catch (e) { logDebug("Onload(SPA) single size finding error: ", e); }

            const currentProductId = this.state.productId;
            const newPropsProductId = get(newProps, 'mainContent.productId', {});
            const currentHybridPdpData = this.state.hybridPdpData || {}; // Defect 23525
            if (currentProductId !== newPropsProductId && isEmpty(currentHybridPdpData)) {
                const newBreadcrumbData = get(newProps, 'mainContent.breadcrumbData', {});
                const newSizeRecords = get(newProps, 'mainContent.productVarientsInfo', {});
                const newProductId = get(newProps, 'mainContent.productId', '');
                const newSkuAttributeMap = get(newProps, 'mainContent.productVarientsInfo.skuAttributeMap', {});
                const newEndecaProductRecord = get(newProps, 'mainContent.endecaProductInfo.contents[0].mainContent[0].record', {});
                const newAlloffers = this.state.alloffers;//get(newProps, 'mainContent.alloffers', {});
                const newGlobalConfigData = get(newProps, 'configurationData', {});
                const newContentItem = get(newProps, 'mainContent', {});
                const newHostName = get(newProps, 'hostname', '');
                const newRelativePath = get(newProps, 'url', '');
                const newENV = get(newProps, 'mainContent.ENV', '');
                const newTurntokey = get(newProps, 'mainContent.turntokey', '');
                this.isScrolled = false;
                this.setState({
                    carouselsData: {},
                    stickyVisbility: false,
                    alertToTopSticky: '',
                    alertToTop: '',
                    breadcrumbData: newBreadcrumbData,
                    sizeApiRecord: {},
                    sizeRecords: newSizeRecords,
                    productId: newProductId,
                    skuAttributeMap: newSkuAttributeMap,
                    productSizeId: newProductSizeIdVal,
                    productType: checkForProductType(newProps),
                    colorText: '',
                    hoverColorText: '',
                    productSizeName: '',
                    colorStyle: '',
                    finalPrices: {},
                    anySizeSelected: false,
                    sortedSizeActive: [],
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
                    endecaProductRecord: newEndecaProductRecord,
                    alert_status: false,
                    alert_message: '',
                    storeNumber: "",
                    selectedStoreStateId: "",
                    postalZipCode: "",
                    selectedAddressInfo: {},
                    alloffers: newAlloffers,
                    Hostname: '',
                    window: '',
                    chanelVal: '',
                    brandVal: '',
                    limited_Pieces: '0',
                    chanelBrandCss: 'NA',
                    globalConfigData: newGlobalConfigData,
                    contentItem: newContentItem,
                    hostName: newHostName,
                    relativePath: newRelativePath,
                    ENV: newENV,
                    turntokey: newTurntokey,
                    changeTabs: "",
                    skuStockAvailability: {},
                    opticData: {}

                }, () => {
                    this.stockAvailabilityMessage = "";
                    global.TurnToItemSku = newProductId;
                    this.allOffers = [];
                    this.GTMTrigger = false;
                    this.updatePdpData();
                });

            }
        }
    }
    /* Start: Defect 24002 */
    clearRatings = () => {
        try {
            let TurnToReviews = document.getElementsByClassName('TurnToReviewsTeaser');
            if (typeof TurnToReviews[0] !== "undefined") {
                TurnToReviews[0].innerHTML = '';
            }
        } catch (e) { }

        try {
            if (typeof window.TurnToLoaded !== "undefined") {
                delete window.TurnToLoaded;
            }
        } catch (e) { }
    }
    loadScript = () => {
        this.clearRatings();
        const flags = this.props.mainContent && this.props.mainContent.flags;
        //console.log("flags===",typeof flags['turntoflag']);
        if (flags['turntoflag']) {  //console.log("flags2===",flags['turntoflag']);
            let externalScript = document.getElementsByClassName('external_script');
            const ratingScript = "//static.www.turnto.com/sitedata/" + this.state.turntokey + "/v4_3/" + this.state.productId + "/d/itemjs";
            try {
                if (externalScript && externalScript.length > 0) {
                    for (let i = 0; i < externalScript.length; i++) {
                        externalScript[i].remove();
                    }
                }
            } catch (e) { }
            let sitedata = document.createElement('script');
            sitedata.type = "text/javascript";
            sitedata.src = ratingScript
            sitedata.className += 'external_script';
            document.body.appendChild(sitedata);
            let Sctipt = document.createElement('script');
            Sctipt.type = "text/javascript";
            Sctipt.className += 'external_script';
            let AssetsPath = getAssetsPath(undefined, window.location.hostname, undefined);
            Sctipt.src = AssetsPath + PDPLoadScript
            document.body.appendChild(Sctipt);
            setTimeout(function () {
                try {
                    let TurnToReviewsTeaser = document.getElementsByClassName('TurnToReviewsTeaser');
                    if (typeof TurnToReviewsTeaser[0] !== "undefined") {
                        let ratingConent = TurnToReviewsTeaser[0].innerHTML;
                        if (ratingConent.trim() === "") {
                            window.customReviewsTeaserDisplay();
                        }
                    }
                } catch (e) { }
            }, 1500);
        }
    }
    /* End: Defect 24002 */
    componentDidMount() {
        this.loadData('DidMount');
    }
    getRecentlyViewed = (productId) => {
        let viewedPorduct = window.sessionStorage.getItem("productId") || [];
        let allPorducts = [viewedPorduct]

        if (viewedPorduct && viewedPorduct.length == 0) {
            allPorducts.push(productId);
        }
        else if (allPorducts && (allPorducts.indexOf(productId) == -1)) {
            allPorducts.push(productId);
        }
        let str = allPorducts && allPorducts.slice(',');
        return str && str.join('/');
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

    getOffers = (skuProductId) => {
        try {
            const productId = skuProductId || this.state.productId;
            //if (!this.state.alloffers || typeof this.state.alloffers === 'undefined') {
            Utility(Path.alloffers + productId, 'GET', {
                "channel": "WEB",
                "brandName": "LP"
            }).then(response => {
                this.allOffers = response.data;
                if (isEmpty(skuProductId)) {
                    const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
                    if (enableGtmFlag) { // not required GTM in offers
                        // this.onLoadPdpGtm('onload');
                    }
                }
                this.setState({
                    alloffers: response.data
                });

            });
            //}

        } catch (e) { }

    }
    Limited_pieces_skus = () => {

        let objectres = {};
        const productId = this.state.productId;
        let getqty = 0;
        if (isEmpty(this.props.limitedPiecesSkusData)) {
            Utility(Path.limitedPiecesSkus, 'GET').then(response => {
                if (response.status === 200) {
                    !isEmpty(response) && map(response.data, (item, i) => {
                        objectres[item.sku] = item.piezas;
                    });
                    getqty = objectres[productId] || "1";
                    this.setState({ pdpQty: getqty.toString(), limited_Pieces: getqty })
                }
            }, (error) => {
                logError("Error ==== :: ", error);
            });
        } else {
            !isEmpty(this.props.limitedPiecesSkusData) && map(this.props.limitedPiecesSkusData, (item, i) => {
                objectres[item.sku] = item.piezas;
            });
            getqty = objectres[productId] || "1";
            this.setState({ pdpQty: getqty.toString(), limited_Pieces: getqty })
        }
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
        } catch (e) { logError("ChangeDeliveryMode - Error: " + e) }

    }
    // getstockAvailability = () => {
    //     //removed for performance related problems
    //     const productId = this.state.productId;
    //     const { productSizeId, productType } = this.state;
    //     const isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
    //     let skuAttributeMap = this.state.skuAttributeMap
    //     let skuList = Object.keys(skuAttributeMap)
    //     logDebug("skuList", skuList)

    //     Utility(Path.getPdpDynamicContent, 'POST', {
    //         "productId": productId,
    //         "skuList": productSizeId, //skuList.length > 0 ? skuList.join(",") : productSizeId,
    //         "isMarketPlace": isMarketPlace,
    //         "skuId": productSizeId,
    //         "pType": productType
    //     }).then(response => {

    //         logDebug("getPdpDynamicContent response", response.data)
    //         let skuStockAvailability = response && response.data && response.data.stockAvailability || {}
    //         this.setState({ skuStockAvailability })
    //     });
    // }

    getstockAvailability = () => {

        /*const { productSizeId, productType } = this.state;
        Utility(Path.getRealTimeStock, 'POST', {
            "skuList": productSizeId,
            "pType": productType,
            "isMarketPlace": get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
        }).then(response => {

            //console.log("getstock", response.data)
            let skuStockAvailability = response && response.data && response.data.stockAvailability || {}

            if (skuStockAvailability && !isEmpty(skuStockAvailability)) {
                for (let noStockSku in skuStockAvailability) {
                    if (noStockSku && noStockSku.split('|')[0] == productSizeId) {*/
        /* commented for bug id 23517 - start*/
        // if (noStockSku.split('|')[1] === "1001") {
        //     this.show_alert("Este producto no tiene el inventario", "alert")
        // } else {
        // this.setState({ skuStockAvailability: skuStockAvailability })
        // }
        /* commented for bug id 23517 - end*/
        //this.setState({skuStockAvailability:""})
        /* }
     }
 }
});*/

    }

    getPdpDynamicContent = () => {
        const productId = this.state.productId;
        const { productSizeId, productType } = this.state;
        const isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
        let skuAttributeMap = this.state.skuAttributeMap
        //let skuList = Object.keys(skuAttributeMap)
        let skuList = "";        
        Object.keys(skuAttributeMap).map(sku => {
            skuList = skuList !== "" ? skuList + "," + sku : skuList + sku;
        })
        /* start of 24421  */
        if(skuList ===""){ 
            skuList = productSizeId; 
        }
        /* end of 24421  */
        let skuStockAvailability = {}
        //already bread crumb data is fetched in SSR only execute when it is empty
        // if (isEmpty(this.state.breadcrumbData) || !this.state.breadcrumbData || typeof this.state.breadcrumbData === 'undefined') {
        Utility(Path.getPdpDynamicContent, 'POST', {
            "productId": productId,
            "skuList": skuList,
            "isMarketPlace": isMarketPlace,
            "skuId": productSizeId,
            "pType": productType
        }).then(response => {
            logDebug("getPdpDynamicContent response", response.data)

            this.setState({
                breadcrumbData: response.data,
                skuStockAvailability: response && response.data && response.data.stockAvailability || {}
            }, () => {
                if (this.props.backEvent && this.props.backEvent.setBreadCrumbData) {
                    this.props.backEvent.setBreadCrumbData(response.data)
                }
                const breadCrumbData = this.state.breadcrumbData
                const categoryId = this.last(breadCrumbData && breadCrumbData.breadCrumbs)
                const associatedSkuId = breadCrumbData && breadCrumbData.pdpDynamicContent && breadCrumbData.pdpDynamicContent.associatedProductId || '';
                const auth = this.state.breadcrumbData && this.state.breadcrumbData.authToken;
                window.authToken = auth;
                let guest = '';
                let LoggedInSession = this.props.loginDetails && this.props.loginDetails.LoggedInSession || "";
                if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
                    LoggedInSession = false;
                }
                if (!LoggedInSession) {
                    guest = "&isguest=true";
                } else {
                    guest = "&isguest=false";
                }
                Utility(Path.getCarousels + '?page=PDP&categoryId=' + categoryId + guest, 'GET').then(response => {

                    this.setState({
                        associatedSkuId: associatedSkuId,
                        carouselsData: response.data
                    });
                });
                const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
                if (enableGtmFlag) {
                    //this.onLoadPdpGtm('onload');
                }
            })
        });
        /*}  else {
            if (this.props.backEvent && this.props.backEvent.setBreadCrumbData) {
                this.props.backEvent.setBreadCrumbData(this.props.mainContent.breadcrumbData)
            }
            const breadCrumbData = this.state.breadcrumbData
            const associatedSkuId = breadCrumbData.pdpDynamicContent && breadCrumbData.pdpDynamicContent.associatedProductId || '';
            const skuStockAvailability = breadCrumbData.stockAvailability || {}
            const categoryId = this.last(breadCrumbData && breadCrumbData.breadCrumbs)
            const auth = this.state.breadcrumbData && this.state.breadcrumbData.authToken;
            window.authToken = auth;
            let guest = '';
            let LoggedInSession = this.props.loginDetails && this.props.loginDetails.LoggedInSession || "";
            if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
                LoggedInSession = false;
            }
            if (!LoggedInSession) {
                guest = "&isguest=true";
            } else {
                guest = "&isguest=false";
            }
            Utility(Path.getCarousels + '?page=PDP&categoryId=' + categoryId + guest, 'GET').then(response => {

                this.setState({
                    skuStockAvailability: skuStockAvailability,
                    associatedSkuId: associatedSkuId,
                    carouselsData: response.data
                });
            });
            const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
            if (enableGtmFlag) {
                // this.onLoadPdpGtm('onload');
            }
        } */

    }



    getHybridPDPData(productId) {
        let loadder = document.querySelector('#loading') || '';
        loadder.style.display = 'block'
        Utility(Path.getHybridproductdetails + productId, 'GET', {
            "channel": this.state.chanelVal,
            "brandName": this.state.brandVal
        }).then(response => {

            let recordExists = get(response.data, "mainContent.endecaProductInfo.contents[0].mainContent[0].record.attributes", {})
            if (!isEmpty(recordExists)) {
                this.setState({
                    hybridPdpData: response.data,
                    productId: get(response.data, 'mainContent.productId', ''),
                    productSizeId: productId,
                    productType: get(response.data, 'mainContent.endecaProductInfo.contents[0].mainContent[0].record.records.productType[0]', get(response.data, 'mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes.productType[0]', ''))

                });
                loadder.style.display = 'none'
            }

        });
    }

    componentWillUnmount() {
        this.props.closeModal();
        window.authToken = '';
        try {
            if (typeof window.TurnToLoaded !== "undefined") {
                delete window.TurnToLoaded;
            }
        } catch (e) { }
    }

    getVariantsByColor = (e, val, index, hexaColorCode, colorId) => {

        const { productSizeId, productId, colorText, endecaProductRecord, productType } = this.state;
        const isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};
        let skuAttributeMap = this.state.skuAttributeMap
        let skuList = Object.keys(skuAttributeMap)
        let associatedSkuId = null;
        let skuStockAvailability = null;
        if (colorText !== val) {
            let loadder = document.querySelector('.loading') || ''; // Immediate analysis and fix required for PDP issue(Sandeep sent mail: Issue 2)
            loadder.style.display = 'block'
            Utility(Path.getPdpDynamicContent, 'POST', {
                "productId": productId,
                "skuList": productSizeId, //skuList.toString(),
                "isMarketPlace": isMarketPlace,
                "skuId": productSizeId,
                "pType": productType
            }).then(response => {

                associatedSkuId = get(response, 'data.pdpDynamicContent.associatedProductId', ''); // response.data.pdpDynamicContent.associatedProductId || '';
                this.setState({ associatedSkuId: associatedSkuId })  //defect id 23621
                skuStockAvailability = get(response, 'data.stockAvailability', {}); // response && response.data && response.data.stockAvailability || {}
            });
            let query = "?variantType=" + 'color' + "&variantValue=" + val + "&productId=" + productId;
            Utility(Path.getVariants + query, 'GET' /*, {
                "variantType": 'color',
                "variantValue": val,
                "productId": productId
            }*/
            ).then(response => {
                if (contentsRecords && contentsRecords.endecaProductInfo && contentsRecords.endecaProductInfo.contents &&
                    contentsRecords.endecaProductInfo.contents[0] && contentsRecords.endecaProductInfo.contents[0].mainContent &&
                    contentsRecords.endecaProductInfo.contents[0].mainContent[0] && contentsRecords.endecaProductInfo.contents[0].mainContent[0].record
                    && contentsRecords.endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace &&
                    typeof contentsRecords.endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace !== 'undefined' &&
                    contentsRecords.endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0] &&
                    contentsRecords.endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0] === 'true') {
                    // this.getOffers(productId);
                }

                let responseData = response.data;

                this.forColorAndSize(responseData, { e, val, index, hexaColorCode, colorId, associatedSkuId, skuStockAvailability });
                const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
                if (enableGtmFlag) {
                    this.onLoadPdpGtm('onload', '', colorId);
                }
                //loadder.style.display = 'none'
            });
        }
    }

    forColorAndSize = (responseData, { e, val, index, hexaColorCode, colorId, associatedSkuId, skuStockAvailability }) => {
        let loadder = document.querySelector('.loading') || '';
        loadder.style.display = 'block'
        const { productSizeId, productId, colorText, endecaProductRecord } = this.state;
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};

        let finalSortedSize = get_FinalSortedSize({ sizeApiRecord: responseData });
        let finalSortedSizeActive = [];
        map(finalSortedSize, (item, i) => {
            if (!item.disable) {
                finalSortedSizeActive.push(item);
            }
        });
        var selectedSku = colorId;
        let finalPricesTmp = {};
        let productSizeIdTmp = (colorId === undefined ? productSizeId : colorId);
        let isAnySkuSelected = false;
        let activeSizeIndex = null;
        const isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false") /*Added for bug id 23285 */
        if ((finalSortedSizeActive.length < 2) && this.state.sizeRecords.colorMap && this.state.sizeRecords.colorMap.color
            && this.state.sizeRecords.colorMap.color[val]) {

            isAnySkuSelected = true;
            var temp = this.state.sizeRecords.colorMap.color[val].split("|");
            selectedSku = temp[temp.length - 1];
            try {
                const colorArr = Object.keys(colorList);
                // if (colorArr.length === 1) { // Commenting for 22848
                /*fixes for bug id 23285 start */
                if (isMarketPlace === true || isMarketPlace === "true") {
                    finalPricesTmp = this.marketPlaceBestPrice(selectedSku)
                }
                else {
                    const skuAttMap = get(productVarientsInfo, 'skuAttributeMap', {});
                    if (finalSortedSizeActive.length > 0 || finalSortedSize.length === 0) { // Defect 23403: added if condition. /* Go-Live Observations: price range don't update the price in pdp when select a variant(added "finalSortedSize.length === 0" condition check) */
                        finalPricesTmp = {
                            list: skuAttMap[selectedSku].listPrice,
                            sale: skuAttMap[selectedSku].salePrice,
                            promo: skuAttMap[selectedSku].promoPrice,
                            numRecords: 1
                        };
                    } // Defect 23403: added if condition
                }
                /*fixes for bug id 23285 end */
                productSizeIdTmp = selectedSku;
                // }
            } catch (e) { }

            if (window && window.swogoBundles) {
                window.swogoBundles.reload();
            }
        } else {

            const colors = get(this.state.sizeRecords, "colorMap.color", []);
            if (colors.length === 0 && finalSortedSizeActive.length > 0) {
                isAnySkuSelected = true;
                activeSizeIndex = 0;
                try {
                    /*fixes for bug id 23285 start */
                    selectedSku = finalSortedSizeActive[0].sizeid;
                    if (isMarketPlace === true || isMarketPlace === "true") {
                        finalPricesTmp = this.marketPlaceBestPrice(selectedSku)
                    }
                    else {
                        let skuAttMaptmp = get(productVarientsInfo, 'skuAttributeMap', {});
                        if (finalSortedSizeActive.length > 0) { // Defect 23403: added if condition
                            finalPricesTmp = {
                                list: skuAttMaptmp[selectedSku].listPrice,
                                sale: skuAttMaptmp[selectedSku].salePrice,
                                promo: skuAttMaptmp[selectedSku].promoPrice,
                                numRecords: 1
                            };
                        } // Defect 23403: added if condition
                    }
                    /*fixes for bug id 23285 end */
                    /*commented for 23285 start */
                    // const skuAttMap = get(productVarientsInfo, "skuAttributeMap", {});
                    // finalPricesTmp = {
                    //     list: skuAttMap[selectedSku].listPrice,
                    //     sale: skuAttMap[selectedSku].salePrice,
                    //     promo: skuAttMap[selectedSku].promoPrice,
                    //     numRecords: 1
                    // };
                    /*commented for 23285 end */
                    productSizeIdTmp = selectedSku;
                } catch (e) { }
                if (window && window.swogoBundles) {
                    window.swogoBundles.reload();
                }
            }
        }
        this.setState({
            sizeApiRecord: responseData,
            finalSortedSize,
            colorText: val,
            finalPrices: finalPricesTmp,
            activeColorIndex: index,
            activeSizeIndex: activeSizeIndex,
            productSizeName: "", //finalSortedSize.length && finalSortedSize[0].size,
            anySizeSelected: isAnySkuSelected,
            sortedSizeActive: finalSortedSizeActive,
            productSizeId: productSizeIdTmp,
            associatedSkuId: associatedSkuId,
            skuStockAvailability: skuStockAvailability,
            colorStyle: hexaColorCode ? hexaColorCode : Object.values(this.getHexaColorCodeByColorName(val, colorList)),
            colorImage: this.getColorImage(val, colorList) /*changes for color image implementation */
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
                this.getMaterialsBySize(index, enabledSortedSize[0], this.state.productSizeId);
            }
            /* commented for bug id 23517 - start*/
            // if (finalSortedSizeActive.length === 0 && skuStockAvailability && skuStockAvailability[this.state.productSizeId + "|" + "1001"]) {
            //     this.show_alert("Este producto no tiene el inventario", "alert")
            // }
            /* commented for bug id 23517 - end*/
            // if (this.state.sortedSizeActive.length < 2) {
            //     this.getstockAvailability()
            // }
        })
    }

    getMaterialsBySize = async (index, sizeObj, productSizeId) => {
        this.state.alert_status == true && this.dismiss_alert()
        //let allNoStockSku = this.state.skuStockAvailability;
        //this.state.skuStockAvailability
        //
        if (sizeObj.sizeid !== 'NONELIGIBLESIZE') {
            // if (!isEmpty(allNoStockSku)) {
            //     for (let noStockSku in allNoStockSku) {

            //         if (noStockSku == sizeObj.sizeid) {
            //             this.show_alert("Este producto no tiene el inventario", "alert")
            //         }
            //     }
            // }
            const { skuAttributeMap } = this.state;
            const materials = await materialBySize(sizeObj.size, this.state.sizeApiRecord);
            /*fixes for bug id 23285 start */
            let finalPrices = {};
            const isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")

            if (isMarketPlace === true || isMarketPlace === "true") {
                finalPrices = this.marketPlaceBestPrice(productSizeId)
            }
            else {
                finalPrices = {
                    list: skuAttributeMap[sizeObj.sizeid].listPrice,
                    sale: skuAttributeMap[sizeObj.sizeid].salePrice,
                    promo: skuAttributeMap[sizeObj.sizeid].promoPrice,
                    numRecords: 1
                };
            }
            /*fixes for bug id 23285 end */
            this.setState({
                materials: materials.length > 0 ? materials : [],
                textures: [],
                activeSizeIndex: index,
                productSizeName: sizeObj.size || 0, // productSizeId === undefined ? sizeObj.size : productSizeId,
                selectedMaterial: null,
                productSizeId: sizeObj.sizeid || this.state.productSizeId,
                selectedTexture: null,
                finalPrices,
                anySizeSelected: true
            }, () => {
                if (this.state.materials.length < 2) {
                    this.getstockAvailability();
                }
                if (materials.length === 1) {
                    this.getTexturesByMaterial(materials[0].value)
                }
                this.onLoadPdpGtm('onload', this.state.productSizeName, sizeObj.sizeid);
            });
        }
        //calling swogo bundle reload function soon after the size selection
        if (window && window.swogoBundles) {
            window.swogoBundles.reload();
        }
    }

    getTexturesByMaterial = async (value) => {
        if (value && value != '0') {
            this.state.alert_status == true && this.dismiss_alert()
            let { materials } = this.state;
            const filterdMaterials = materials.filter(obj => obj.value === value);
            const textures = await texturesByMaterail(filterdMaterials[0], this.state.sizeApiRecord);

            let sizeId = materials.length >= 2 ? value : this.state.productSizeId
            this.setState({
                textures: textures.length > 0 ? textures : [],
                productSizeId: sizeId,
                selectedMaterial: value,
                selectedTexture: textures.length === 1 ? textures[0].value : null,
                materials
            }, () => {
                if (this.state.textures.length < 2) {
                    this.getstockAvailability();
                }
            })
        }
        //calling swogo bundle reload function soon after the material selection
        if (window && window.swogoBundles) {
            window.swogoBundles.reload();
        }
    }

    getSelectedTexture = (value) => {

        if (value && value != '0') {
            this.state.alert_status == true && this.dismiss_alert()
            let { textures } = this.state;
            if (Object.keys(textures[0]).length === 0) {
                textures.splice(0, 1);
            }
            this.setState({
                selectedTexture: value,
                productSizeId: value,
                textures
            }, () => {
                this.getstockAvailability();
            });
        }
        //calling swogo bundle reload function soon after the texture selection
        if (window && window.swogoBundles) {
            window.swogoBundles.reload();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.stickyVisbility == this.state.stickyVisbility &&
            nextState.alertToTopSticky == this.state.alertToTopSticky &&
            nextState.alertToTop == this.state.alertToTop &&
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
            nextState.storeNumber == this.state.storeNumber &&
            nextState.selectedStoreStateId == this.state.selectedStoreStateId &&
            nextState.postalZipCode == this.state.postalZipCode &&
            nextState.selectedAddressInfo.addressId == this.state.selectedAddressInfo.addressId &&
            nextState.alert_status == this.state.alert_status &&
            nextState.Hostname == this.state.Hostname &&
            nextState.opticData == this.state.opticData &&
            nextState.limited_Pieces == this.state.limited_Pieces &&
            nextState.globalConfigData == this.state.globalConfigData &&
            nextState.Truntokey_state == this.state.Truntokey_state &&
            nextState.hoverColorText == this.state.hoverColorText &&
            nextState.carouselsData == this.state.carouselsData &&
            nextState.changeTabs != this.state.changeTabs


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

    set_store_number = (storeNumber, selectedStoreStateId) => {
        this.setState({ storeNumber, selectedStoreStateId, postalZipCode: '', selectedAddressInfo: {} });
    }

    set_postal_zip_code = (postalZipCode) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode, selectedAddressInfo: {} })
    }

    setSelectedAddressInfo = (selectedAddressInfo) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode: '', selectedAddressInfo })
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
                sortedSizeActive,
                noInventoryText,
                materials,
                selectedMaterial,
                textures,
                selectedTexture } = this.state;


            const validationText = (finalSortedSize.length > 0 && sortedSizeActive.length === 0) ? noInventoryText :
                finalSortedSize.length ? (
                    activeSizeIndex === null ? "Selecciona una talla" : (
                        materials.length ? (
                            selectedMaterial === null ? "Selecciona una Material" : (
                                textures.length ? (
                                    selectedTexture === null ? "Selecciona una Textura" : false
                                ) : false
                            )
                        ) : false
                    )
                ) : false;

            if (validationText) {
                this.show_alert(validationText, "alert");
            } else {
                resolve()
            }
        });
        return promise;
    }

    // Custom Products functionality START
    isCustomProduct = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].sku === this.state.productId) {
                return true;
            }
        }
    }
    // Custom Products functionality END

    handleAddToMyBag = (eventName) => {
        this.check_product_sku_selection().then(() => {

            const { opticData } = this.state;
            const { SkuPriceLft = {}, SkuPriceRgt = {} } = opticData;

            if (!isEmpty(SkuPriceLft) && !isEmpty(SkuPriceRgt)) {
                if (Object.keys(SkuPriceLft).length > 0 && Object.keys(SkuPriceRgt).length > 0) {
                    this.addMultipleItemToCart();
                }
                else {
                    this.show_alert("Seleccionar todas las especificaciones ópticas", "alert")
                    //window.scrollTo(0, 0);
                }
            } else {
                // Custom Products functionality START
                if (eventName == "buyNow") {
                    if (!isEmpty(this.state.customProductId)) {
                        const data = JSON.parse(localStorage.getItem('customProduct'));
                        if (!isEmpty(data)) {
                            if (this.isCustomProduct(data)) {
                                this.addItemToCart(eventName);
                            } else {
                                this.show_alert("Por favor, personaliza tu bota navideña", "alert");
                            }
                        } else {
                            this.show_alert("Por favor, personaliza tu bota navideña", "alert");
                        }
                    } else {
                        this.addItemToCart(eventName);
                    }
                }
                else {
                    if (!isEmpty(this.state.customProductId)) {
                        const data = JSON.parse(localStorage.getItem('customProduct'));
                        if (!isEmpty(data)) {
                            if (this.isCustomProduct(data)) {
                                this.addItemToCart();
                            } else {
                                this.show_alert("Por favor, personaliza tu bota navideña", "alert");
                            }
                        } else {
                            this.show_alert("Por favor, personaliza tu bota navideña", "alert");
                        }
                    } else {
                        this.addItemToCart();
                    }

                }
                // Custom Products functionality END
            }
        })
    }
    getBestPrice = (offer) => {
        let priceToDisplay = 0.00;
        const list = Number(offer.bestListPrice) || 0;
        const sale = Number(offer.bestSalePrice) || 0;
        const promo = Number(offer.bestPromoPrice) || 0;
        if ((list === sale && promo === 0) || (list === sale && list === promo && promo != 0)) {
            priceToDisplay = list;

        } else if (list === sale && promo > 0) {
            priceToDisplay = promo;

        } else if (list > sale && promo == 0) {
            priceToDisplay = sale;

        } else if (list > sale && promo > 0) {
            priceToDisplay = promo;

        }
        return priceToDisplay;
    }

    createAddToCartPayload = () => {

        const { productSizeId, productType, productId, anySizeSelected, activeSizeIndex, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType } = this.state;


        let isPresale = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isPresale[0]', "false");
        let specialSale = false;
        if (typeof this.props.mainContent.isSpecialSale !== 'undefined' && this.props.mainContent.isSpecialSale === 'true') {
            specialSale = true;
        }
        let specialItem = 'false';
        if (specialSale || isPresale === 'true') {
            specialItem = 'true';
        }

        let payload = {
            "quantity": !isNaN(pdpQty) ? parseInt(pdpQty) : pdpQty,
            "catalogRefIds": productSizeId,
            "itemToGift": "false",
            "isSpecialSaleItem": specialItem,
            "skipInventory": "false"
        }

        /*commmented for 21902 color and sku id going wrong*/
        // let skuAttributeIds = Object.keys(this.state.skuAttributeMap);
        // let finalSortedSize = this.state.finalSortedSize;
        // if (anySizeSelected && finalSortedSize.length > 1) {
        //     if (activeSizeIndex < skuAttributeIds.length) {
        //         payload.catalogRefIds = skuAttributeIds[activeSizeIndex];
        //     }
        // }

        let isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
        if (isMarketPlace == "true") {
            const skuOffers = get(this.state.alloffers, 'skuOffers', {});
            let selectedSkuOffer = {};
            let bestPromoPrice = -1;
            map(skuOffers, (item, index) => {
                if (item.skuId === payload.catalogRefIds) {
                    if (bestPromoPrice == -1) {
                        selectedSkuOffer = item;
                        bestPromoPrice = this.getBestPrice(item);
                    } else {

                        if (this.getBestPrice(item) < bestPromoPrice) {
                            selectedSkuOffer = item;
                            bestPromoPrice = this.getBestPrice(item);
                        }
                    }

                }
            })
            if (!isEmpty(selectedSkuOffer)) {
                const { bestSeller = '', sellerId, sellerSkuId, sellerOperatorId, offerId } = selectedSkuOffer;
                if (isMarketPlace == "true") {
                    payload.sellerId = sellerId;
                    payload.sellerSkuId = sellerSkuId;
                    payload.sellerName = bestSeller;
                    payload.sellerOperatorId = sellerOperatorId;
                    payload.offerId = offerId;
                }
            }
        }

        if (!isEmpty(postalZipCode)) {
            payload.zipCode = postalZipCode;
            payload.eddZipCode = postalZipCode;
            payload.deliveryMethod = 'home';
        }
        if (!isEmpty(storeNumber)) {
            payload.deliveryMethod = 'store';
            payload.storeNumber = storeNumber;
            payload.stateId = selectedStoreStateId;
        }
        if (!isEmpty(selectedAddressInfo)) {
            payload.deliveryMethod = 'home';
            payload.zipCode = (selectedAddressInfo && selectedAddressInfo['postalCode'] || '');
            payload.eddZipCode = (selectedAddressInfo && selectedAddressInfo['postalCode'] || '');
            payload.addressId = (selectedAddressInfo && selectedAddressInfo['addressId'] || '');
        }

        //if (GWPSelectedProductId === '') {
        payload.productId = productId;
        payload.productType = productType;
        //}
        if (this.props.mainContent.pdpType !== "hybrid" && GWPSelectedProductId !== '') {
            if (payload.catalogRefIds === '') {
                payload.catalogRefIds = GWPSelectedAssociatedSkuId;
            } else {
                // payload.catalogRefIds = payload.catalogRefIds  +','+  GWPSelectedAssociatedSkuId;
                payload.catalogRefIds = productSizeId + ',' + GWPSelectedAssociatedSkuId;
                this.setState({ associatedSkuId: GWPSelectedAssociatedSkuId })  //defect id 23621
            }

            payload.parentGWPProduct = productSizeId;
            payload.productIds = productId + ',' + GWPSelectedProductId;
            payload.productTypes = productType + ',' + GWPSelectedProductType;
            payload.tmpGWPQtys = {};
            payload.tmpGWPQtys[productSizeId] = pdpQty;
            payload.tmpGWPQtys[GWPSelectedProductId] = pdpQty;


            payload.promotionalGiftMessage = "gwp.regaloExclusiveOnline.text";
            delete payload.productId;
            delete payload.productType;
        }

        if (this.props.mainContent.pdpType == "hybrid") {
            let hybridData = (hybridPdpData == "" || hybridPdpData == undefined) ? this.props : hybridPdpData;


            // {hybridPdpData:{mainContent:{endecaProductInfo:{contents:[{mainContent:[{record:{records:[{attributes:{skurepositoryId}= {}}]}}]}]}}}
            payload["catalogRefIds"] = hybridData && hybridData.mainContent && hybridData.mainContent.endecaProductInfo && hybridData.mainContent.endecaProductInfo.contents && hybridData.mainContent.endecaProductInfo.contents[0] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes["sku.repositoryId"] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes["sku.repositoryId"][0] || "";
            payload.productType = get(hybridData, 'mainContent.endecaProductInfo.contents[0].mainContent[0].record.attributes.productType[0]', '');
            payload["sourcePage"] = "hybrid";
            if (payload.productType === 'Digital') {
                delete payload.zipCode;
                delete payload.eddZipCode;
                delete payload.deliveryMethod;
                delete payload.addressId;
                delete payload.storeNumber;
                delete payload.stateId;
            }
        }

        // if (this.props.mainContent.pdpType == "optic") {
        let params = []
        const { SkuPriceLft = {}, SkuPriceRgt = {} } = opticData
        if (!isEmpty(SkuPriceLft) && !isEmpty(SkuPriceRgt)) {

            let OpticSkus = [SkuPriceLft, SkuPriceRgt];
            OpticSkus.map((sides) => {
                let payloadObj = JSON.parse(JSON.stringify(payload))
                payloadObj.catalogRefId = sides.skuid;
                payloadObj.quantity = payloadObj.quantity.toString()
                delete payloadObj.catalogRefIds;
                params.push(payloadObj)
            })

            let opticPayload = { products: { productList: params } }
            payload = opticPayload;
        }

        // }

        return payload;
    }

    addItemToCart = (eventName) => {

        const payload = this.createAddToCartPayload();
        let selectedSKU = payload.catalogRefIds;
        let cartresposedate = {};
        Utility(Path.addpdpitemtocart, 'POST', payload).then(response => {

            if (response.status === 200 && response.data && response.data.s === '0') {
                cartresposedate = response.data


                if (response.data.quantity) {

                    //response.data["cartHeaderDetails"] = response.data.cartHeaderDetails;
                    response.data["fromPdpAddToCart"] = true;
                    this.props.updateCartHeaderDetails(response.data);
                    if (eventName == "buyNow") {
                        Router.push("/tienda/cart", "/tienda/cart");
                    }
                }
                if (eventName !== "buyNow") {
                    let alertMessage = this.staticKeyValues && this.staticKeyValues["PDPPage.AddToCart.SingleProduct.alert.Success"] || "PDPPage.AddToCart.SingleProduct.alert.Success"
                    const warningMsg = get(response, 'data.warning', '');
                    if (warningMsg !== '') {
                        this.show_alert(warningMsg, "warning")
                    } else {
                        this.show_alert(alertMessage, "success")
                    }

                }
                //window.scrollTo(0, 0);
                const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
                if (enableGtmFlag) {
                    if (cartresposedate) {

                        for (let k in cartresposedate) {

                            if (k.indexOf("ci") > -1 && !payload['listPrice']) {
                                if (cartresposedate[k]['listPrice'] > 1 && (selectedSKU && selectedSKU.indexOf(cartresposedate[k]['catalogRefId']) > -1)) {
                                    payload['listPrice'] = cartresposedate[k]['listPrice'];
                                    payload['listPriceWithDiscount'] = cartresposedate[k]['listPriceWithDiscount'];
                                }
                            }
                            /* fix for bug id 23285 start */
                            else if (k === "itemDetailsInfo") {
                                let itemDetails = cartresposedate[k] && cartresposedate[k].itemDetails;
                                itemDetails.map((product) => {
                                    if (product.catalogRefId === this.state.productSizeId) { /* modified for bug id 23285*/
                                        payload['listPrice'] = product['listPrice'];
                                        payload['listPriceWithDiscount'] = product['listPriceWithDiscount'];
                                    }
                                })

                            }
                            /*fix for bug id 23285 end */

                        }
                    }

                    this.onLoadPdpGtm('click', payload, selectedSKU);
                }
                // Utility(Path.mybagListCount, 'GET').then(response => {
                //     if (response.status === 200) {
                //         if (response && response.data && response.data.s === '0') {

                //             if (response.data.quantity) {

                //                 //response.data["cartHeaderDetails"] = response.data.cartHeaderDetails;
                //                 response.data["fromPdpAddToCart"] = true;
                //                 this.props.updateCartHeaderDetails(response.data);
                //                 if (eventName == "buyNow") {
                //                     Router.push("/tienda/cart", "/tienda/cart");
                //                 }
                //             }
                //             if (eventName !== "buyNow") {
                //                 let alertMessage = this.staticKeyValues && this.staticKeyValues["PDPPage.AddToCart.SingleProduct.alert.Success"] || "PDPPage.AddToCart.SingleProduct.alert.Success"
                //                 this.show_alert(alertMessage, "success")
                //             }
                //             //window.scrollTo(0, 0);
                //             const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
                //             if (enableGtmFlag) {
                //                 this.onLoadPdpGtm('click', payload, selectedSKU);
                //             }

                //         }
                //     }
                //     else {
                //         logError(response.data.error, response.data.message)
                //     }
                // });

            }
            else {
                if (response.status === 200) {
                    if (response && response.data && response.data["0"]) {
                        this.show_alert(response.data["0"].err)
                        // window.scrollTo(0, 0);
                    }
                }
                else {
                    logError(response.data.error, response.data.message)
                }

            }
        }, (error) => {
        });
    }

    //Required for sWOGO functionalities added extra parameters like pay load  and swogo call back function. Other functionalities can ignore the call back & payload
    addMultipleItemToCart = (swogo, callback) => {

        let itemCount = 0;
        let payload = null;
        if (swogo) {
            if (swogo.products && typeof swogo.products !== 'undefined') {
                for (var i = 0; i < swogo.products.productList.length; i++) {
                    itemCount++;
                }
            }

            payload = swogo;
            logDebug("swogo add multiple item to cart " + JSON.stringify(payload));
            const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
            var arraySwogo = []
            var objProduct = {};
            if (swogo && swogo.products && typeof swogo.products !== 'undefined' && enableGtmFlag) {
                for (var i = 0; i < swogo.products.productList.length; i++) {
                    objProduct = {};
                    objProduct.name = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].displayName ? swogo.products.productList[i].displayName : '';
                    objProduct.id = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].productId ? swogo.products.productList[i].productId : ''; //Generic SKU
                    if (objProduct.id === 'SWOGO' && swogo.products && swogo.products.productList[i] && swogo.products.productList[i].catalogRefId) {
                        objProduct.id = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].catalogRefId;
                    }
                    objProduct.category = ''; // NOT AVAILABLE
                    objProduct.variant = 'N/A';
                    objProduct.price = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].salePrice ? swogo.products.productList[i].salePrice.toString() : '';
                    objProduct.brand = ''; // NOT AVAILABLE
                    objProduct.quantity = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].quantity ? swogo.products.productList[i].quantity : '';
                    objProduct.dimension27 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].size ? swogo.products.productList[i].size : '';
                    objProduct.dimension28 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].color ? swogo.products.productList[i].color : ''; //CD 27 If doesn`t apply, the value must be empty “”
                    objProduct.dimension36 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].sellerName ? swogo.products.productList[i].sellerName : ''; // CD 36
                    objProduct.dimension40 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].sellerSkuId ? swogo.products.productList[i].sellerSkuId : ''; //CD 40
                    objProduct.dimension41 = ''; // This variable has to contain the material of the product, if material product does not apply in the product, the value of this variable must be empty ‘’.
                    objProduct.dimension42 = ''; // This variable has to contain the texture of the product, if texture product does not apply in the product, the value of this variable must be empty ‘’.
                    objProduct.dimension43 = 'Y';
                    objProduct.metric2 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].listPrice ? swogo.products.productList[i].listPrice.toString() : ''; //M2
                    objProduct.metric3 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].salePrice ? swogo.products.productList[i].salePrice.toString() : ''; //M3

                    arraySwogo.push(objProduct);
                }
                /* dataLayer.push({
                     'event': 'addToCart',
                     'ecommerce': {
                         'add': {
                             'products': arraySwogo
                         }
                     }
                 })*/
                Utility(Path.gtmServiceCall, 'POST',
                    {
                        'event': 'addToCart',
                        'ecommerce': {
                            'add': {
                                'products': arraySwogo
                            }
                        }
                    }
                ).then(response => {
                    let payload = response.data;
                    dataLayer.push(payload);
                })
            }
        } else {
            payload = this.createAddToCartPayload();
        }
        let errorMessage = null;
        Utility(Path.addmultipleitemstoorder, 'POST', payload).then(response => {
            if (response.status === 200 && response.data && response.data.s === '0') {
                const res = response.data || {};
                Utility(Path.mybagListCount, 'GET').then(response => {
                    if (response && response.data && response.data.s === '0') {

                        if (response.data.quantity) {
                            response.data["fromPdpAddToCart"] = true;
                            this.props.updateCartHeaderDetails(response.data);
                        }
                        if (callback) {
                            const count = (res.itemDetailsInfo && typeof res.itemDetailsInfo.addedItemCount === 'number') ?
                                res.itemDetailsInfo.addedItemCount : 0;
                            if (count === itemCount) {
                                callback(null, "Successfully added");
                            } else {
                                callback("Unable to add " + (itemCount - count) + " number of items to Cart either due to lack of inventory or other product relation issues", null);
                            }

                        }
                        let alertMessage = this.staticKeyValues && this.staticKeyValues["PDPPage.AddToCart.MultipleProducts.alert.Success"] || "PDPPage.AddToCart.MultipleProduct.alert.Success"
                        this.show_alert(alertMessage, "success")
                        // window.scrollTo(0, 0);
                    }
                });
            }
            else {

                if (response.status === 200) {
                    if (response && response.data && response.data["0"]) {
                        errorMessage = "error response came as " + JSON.stringify(response.data["0"].err);
                        this.show_alert(response.data["0"].err)
                        //window.scrollTo(0, 0);
                        if (callback) {
                            callback(errorMessage, null);
                        }
                    }

                }
                else {
                    logDebug(response.data.error, response.data.message)
                    errorMessage = "Some error occured error = " + JSON.stringify(response.data.error) + " msg = " + JSON.stringify(response.data.message);
                    if (callback) {
                        callback(errorMessage, null);
                    }
                }
            }
        }, (error) => {
            logError(error);
            errorMessage = JSON.stringify(error);
            if (callback) {
                callback(errorMessage, null);
            }
        });

    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert", alertTimeOut) => {

        let alertToTopSticky = ""
        let alertToTop = ""
        if (window.scrollY >= 330) {
            alertToTopSticky = '-toTopSticky'
        }
        else if (window.scrollY >= 117) {
            alertToTop = '-toTop'
        }
        // else {
        //     this.setState({ alertToTopSticky: '', alertToTop: '' });
        // }
        this.setState({ alert_status: true, alert_message, alert_Type, alertToTopSticky, alertToTop });
        if (alert_Type === 'success') {
            setTimeout(() => {
                this.setState({ alert_status: false });
            }, 3000) /*modified for 22419 */
        }
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

    handleWindowScroll = (e) => {
        this.handleScroll(e);
        //this.handleScrollAlert(e);
    }

    handleBodyClick = (e) => {
        this.closeQtyDropdown(e);
    }
    /*added for bug id 23285 start */
    marketPlaceBestPrice = (productSkuid) => {
        const { alloffers } = this.state;
        let marketPlacePrices = {};
        if (alloffers && alloffers.skuOffers && alloffers.skuOffers.length) {
            let bestOffer = null;
            let requiredSkuOffers = [];
            let currentBestPrice = 0.0;
            let bestPrice = 0.0;
            // productSizeId need to set default sku id from skuattribute map
            for (let soffer in alloffers.skuOffers) {
                if (alloffers.skuOffers[soffer] && alloffers.skuOffers[soffer].skuId && alloffers.skuOffers[soffer].skuId === productSkuid) {
                    requiredSkuOffers.push(alloffers.skuOffers[soffer]);
                }
            }
            if (requiredSkuOffers && requiredSkuOffers.length > 0) {
                for (let offer in requiredSkuOffers) {
                    if (!bestOffer) {
                        bestOffer = requiredSkuOffers[offer];
                    } else {
                        currentBestPrice = this.getBestPrice(requiredSkuOffers[offer]);
                        bestPrice = this.getBestPrice(bestOffer);
                        if (currentBestPrice < bestPrice) {
                            bestOffer = requiredSkuOffers[offer];
                        }
                    }
                }
                /* commented for bug id  23285 - start */
                // /*changes made for bug id 23429 starts */
                // if (bestOffer && bestOffer.lpPromotions_pwa) {
                //     promotionInfo.lpPromotions = bestOffer.lpPromotions_pwa;
                // }
                // if (bestOffer && bestOffer.otherPromotions_pwa) {
                //     promotionInfo.otherPromotions = bestOffer.otherPromotions_pwa;
                // }
                // /*changes made for bug id 23429 ends */
                /* commented for bug id  23285 - end */
                if (bestOffer && bestOffer.bestListPrice) {
                    marketPlacePrices = {
                        list: bestOffer.bestListPrice || 0,
                        sale: bestOffer.bestSalePrice || 0,
                        promo: bestOffer.bestPromoPrice || 0,
                        numRecords: 1
                    };
                }
            }
        }
        //console.log("marketplacePrice in custom", marketPlacePrices)
        return marketPlacePrices
    }
    /*added for bug id 23285 end */
    /* addedd for bug 23061 -- start */
    onOrientationChange = (orientation) => {

        this.setState({ orientation: window.orientation })
    }
    /* addedd for bug 23061 - end */

    // Custom Products functionality START
    handleCustomProduct = (customProduct) => {
        if (customProduct) {
            this.show_alert("Gracias por personalizar tu bota navideña, ya puedes agregarla a tu bolsa.", "success");
        }
        return null;
    }

    handleGetCustomSkus = (skusCustom) => {
        const productIdPdp = this.props.mainContent.productId;

        if (skusCustom.length > 0) {
            skusCustom.map(customProduct => {
                if (customProduct.sku === productIdPdp) {
                    this.setState({
                        customProductId: customProduct.sku
                    })
                }
            })
        }
        return null;
    }
    // Custom Products functionality END


    /*changes for color image implementation - start */
    getColorImage = (selectedColor, listOfColors) => {

        let colorImage = ""
        for (let color in listOfColors) {
            if (color === selectedColor) {
                let colorValue = listOfColors[color] || ""
                let splittedArrayValue = colorValue && colorValue != "" && colorValue.split('|') || "";
                colorImage = splittedArrayValue && splittedArrayValue != "" && splittedArrayValue.length > 2 && splittedArrayValue[1] || ""
            }
        }
        return colorImage
    }
    /*changes for color image implementation - end */
    render() {


        const { productId, materials, textures, hybridPdpData, sizeApiRecord, sizeRecords, uniqueColorList, finalSortedSize, alert_message, alert_status, alert_Type, finalPrices, productSizeId, selectedMaterial, selectedTexture } = this.state;
        let contentsRecords = hybridPdpData ? hybridPdpData.mainContent : this.props.mainContent;


        let getturntokey = this.state.turntokey;
        let hybridProductId = '';
        const flags = this.props.mainContent.flags;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        const isLensePage = contentsRecords && contentsRecords.productVarientsInfo && contentsRecords.productVarientsInfo.isLensePage || '';
        let pdpType = hybridPdpData ? 'hybrid' : this.props.mainContent && this.props.mainContent.pdpType || '';
        let carouselRecords = (this.props.mainContent && this.props.mainContent.akamaiSkuImagesInfo && this.props.mainContent.akamaiSkuImagesInfo.skuImageMap) || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};
        let firstImage = !isEmpty(colorList) && Object.values(colorList)[0] || "";
        let colorIDforImage = firstImage != "" && firstImage.split("|")[2] || "";
        const L1CategoryForCarousal = this.state && this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs && this.state.breadcrumbData.breadCrumbs[0] && this.state.breadcrumbData.breadCrumbs[0].categoryName; // changes for 23389 breadcrumb null check
        /*if (this.state.productSizeId && this.state.productSizeId != "") {
            colorIDforImage = this.state.productSizeId
        }
        let newcarouselRecords = {}
        if (colorIDforImage && colorIDforImage != "") {
            if (!isEmpty(carouselRecords)) {
                for (let eachImage in carouselRecords) {
                    if (eachImage.includes(colorIDforImage)) {
                        newcarouselRecords[eachImage] = carouselRecords[eachImage]
                    }
                }
            }
            carouselRecords = newcarouselRecords;
        }*/
        /*changes made for Pdp staticlabel issue start --  modified staticlabel for unique  */
        //const staticLabels = this.staticLabelKeyValues;//this.props.mainContent.staticLabels && this.props.mainContent.staticLabels.staticLabelValues && this.props.mainContent.staticLabels.staticLabelValues[0] && this.props.mainContent.staticLabels.staticLabelValues[0].keyValues;

        let staticLabels = {};
        if (contentsRecords && contentsRecords.staticLabels && contentsRecords.staticLabels.staticLabelValues) {
            for (let k in contentsRecords.staticLabels.staticLabelValues) {
                //console.log("----------------------",k,contentsRecords.staticLabels.staticLabelValues[k])
                if (contentsRecords.staticLabels.staticLabelValues[k].pageName === 'PWA-PDP-PAGE') {
                    staticLabels = contentsRecords.staticLabels.staticLabelValues[k].keyValues;
                }
            }

        }
        /*changes made for Pdp staticlabel issue start --  modified staticlabel for unique  */


        const { isDesktop, isMobile, isIpad } = UserAgentDetails(this.state.window);
        const vedioLinks = this.props && this.props.mainContent && this.props.mainContent.endecaProductInfo && this.props.mainContent.endecaProductInfo.contents && this.props.mainContent.endecaProductInfo.contents.length > 0 && this.props.mainContent.endecaProductInfo.contents[0].mainContent && this.props.mainContent.endecaProductInfo.contents[0].mainContent.length > 0 && this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record && this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record['product.videoLinks'] && this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record['product.videoLinks'][0] || '';

        let isdektophashId = '';
        isDesktop ? isdektophashId = 'ratings' : isdektophashId = ''
        const productInfo = (contentsRecords && contentsRecords.endecaProductInfo &&
            contentsRecords.endecaProductInfo.contents && contentsRecords.endecaProductInfo.contents[0] &&
            contentsRecords.endecaProductInfo.contents[0].mainContent && contentsRecords.endecaProductInfo.contents[0].mainContent[0] &&
            contentsRecords.endecaProductInfo.contents[0].mainContent[0].record) || {};
        let ifSize = productInfo && !isEmpty(productInfo) && productInfo["sku.size"] || "";
        let ifDimension = productInfo && !isEmpty(productInfo) && productInfo["sku.dimensions"] || "";

        //console.log("ifSize", ifSize);
        if (pdpType == "hybrid") {

            let skuattrMap = contentsRecords && contentsRecords.productVarientsInfo && contentsRecords.productVarientsInfo.skuAttributeMap || {}
            hybridProductId = (contentsRecords && contentsRecords.productId) || productId
            carouselRecords = contentsRecords && contentsRecords.akamaiSkuImagesInfo && contentsRecords.akamaiSkuImagesInfo.skuImageMap;
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

        const isMarketPlace = productInfo.isMarketPlace && productInfo.isMarketPlace[0] || "false";
        const alloffers = this.state.alloffers;
        const marketPlaceInfo = {
            isMarketPlace: isMarketPlace,
            skuAttributeMapSize: productVarientsInfo.mapSize || 0,
            productId: productInfo.productId && productInfo.productId[0] || '',
            alloffers,
            sortedSizeActive: this.state.sortedSizeActive,
            anySizeSelected: this.state.anySizeSelected
        };
        let promotionInfo = { "lpPromotions": [], "otherPromotions": [] };
        let marketPlacePrices = {};
        if (isMarketPlace === "true") {

            if (alloffers && alloffers.skuOffers && alloffers.skuOffers.length) {
                let bestOffer = null;
                let requiredSkuOffers = [];
                let currentBestPrice = 0.0;
                let bestPrice = 0.0;
                // productSizeId need to set default sku id from skuattribute map
                for (let soffer in alloffers.skuOffers) {
                    if (alloffers.skuOffers[soffer] && alloffers.skuOffers[soffer].skuId && alloffers.skuOffers[soffer].skuId === productSizeId) {
                        requiredSkuOffers.push(alloffers.skuOffers[soffer]);
                    }
                }
                if (requiredSkuOffers && requiredSkuOffers.length > 0) {
                    for (let offer in requiredSkuOffers) {
                        if (!bestOffer) {
                            bestOffer = requiredSkuOffers[offer];
                        } else {
                            currentBestPrice = this.getBestPrice(requiredSkuOffers[offer]);
                            bestPrice = this.getBestPrice(bestOffer);
                            if (currentBestPrice < bestPrice) {
                                bestOffer = requiredSkuOffers[offer];
                            }
                        }
                    }
                    /*changes made for bug id 23429 starts */
                    if (bestOffer && bestOffer.lpPromotions_pwa) {
                        promotionInfo.lpPromotions = bestOffer.lpPromotions_pwa;
                    }
                    if (bestOffer && bestOffer.otherPromotions_pwa) {
                        promotionInfo.otherPromotions = bestOffer.otherPromotions_pwa;
                    }
                    /*changes made for bug id 23429 ends */
                    if (bestOffer && bestOffer.bestListPrice) {
                        marketPlacePrices = {
                            list: bestOffer.bestListPrice || 0,
                            sale: bestOffer.bestSalePrice || 0,
                            promo: bestOffer.bestPromoPrice || 0,
                            numRecords: 1
                        };
                    }
                }
            }
        } else {
            if (pdpType == "hybrid") { /* Defect 24229 - If block added */
                const hybridData = get(contentsRecords, 'endecaProductInfo.contents[0].mainContent[0].record.attributes', {});
                promotionInfo.lpPromotions = get(hybridData, 'lpPromotions_pwa');
                promotionInfo.otherPromotions = get(hybridData, 'otherPromotions_pwa');
            } else {
                promotionInfo.lpPromotions = get(productInfo, 'lpPromotions_pwa');
                promotionInfo.otherPromotions = get(productInfo, 'otherPromotions_pwa');
            }

        }
        const priceData = !isEmpty(marketPlacePrices) ? marketPlacePrices : (!isEmpty(finalPrices) ? finalPrices : getPriceData(productInfo))

        const priceToShow = GetPrice(priceData);
        //const staticLabels = contentsRecords && contentsRecords.staticLabels && contentsRecords.staticLabels.staticLabelValues && contentsRecords.staticLabels.staticLabelValues[0] && contentsRecords.staticLabels.staticLabelValues[0]['keyValues'] || {};

        const qtyDropdownInfo = {
            pdpQty: this.state.pdpQty,
            resetQty: this.state.resetQty,
            showQtyDropdown: this.state.showQtyDropdown,
            toggleQtyDropdown: this.toggleQtyDropdown,
            onSelectDropdownQty: this.onSelectDropdownQty,
            onChangeQty: this.onChangeQty,
            onBlurQty: this.onBlurQty,
            closeQtyDropdown: this.closeQtyDropdown,
            onClickQtyReset: this.onClickQtyReset
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
        let promotions = productVarientsInfo.gwpPromotions && productVarientsInfo.gwpPromotions || {};
        if (promotions.giftItems && promotions.giftItems.length > 0) {
            const selected = !isEmpty(this.state.associatedSkuId)
            for (let k in promotions.giftItems) {
                if (selected) {
                    if (promotions.giftItems[k].associatedSkuId === this.state.associatedSkuId) {
                        promotions.giftItems[k].isChecked = true;
                    } else {
                        promotions.giftItems[k].isDisabled = true;
                    }
                } else {
                    promotions.giftItems[k].isChecked = false;  //defect id 23621
                    promotions.giftItems[k].isDisabled = false;  //defect id 23621
                }
            }
            if (!selected) {
                promotions.giftItems[0].isChecked = true;  //defect id 23621
            }
        }
        const gwpInfo = {
            //gwpData: productVarientsInfo.gwpPromotions || {},
            gwpData: promotions,
            associatedProductId: this.state.associatedSkuId,
            onSelectGiftItem: this.onSelectGiftItem,
            activeGiftItemIndex: this.state.activeGiftItemIndex
        };

        const giftRegistryInfo = {
            eventListMap: get(this.state.breadcrumbData, 'pdpDynamicContent.eventListMap'),
            isLoggedIn: get(this.props.loginDetails, 'LoggedInSession'),
            pdpQty: this.state.pdpQty,
            selectedSkuId: this.state.productSizeId,
            onAddItemToEvent: this.onAddItemToEvent,
            departmentId: get(productInfo, 'records[0].department[0]', get(productInfo, 'attributes.department[0]', '')), // Defect 23525 - added one more get() method in default parameter.
            thumbnailImage: get(productInfo, 'thumbnailImage[0]'),
            checkSkuSelection: this.check_product_sku_selection
        };
        const extraInfoDetails = {
            extraInformationWeb: get(productInfo, ['product.extraInformationWeb']),
            extraInformationWap: get(productInfo, ['product.extraInformationWap'])
        }
        let Enableswogo = staticLabels && staticLabels['pdpPage.Enableswogo'] || "true"
        const swogoScript = contentsRecords.swogoEndPoint || '';
        //console.log( Enableswogo);
        const ratingScript = "//static.www.turnto.com/sitedata/" + getturntokey + "/v4_3/" + this.state.productId + "/d/itemjs";
        const noOfPieces = this.state.breadcrumbData
        let stockAvailability = {};
        if (this.state && this.state.breadcrumbData && this.state.breadcrumbData != null && this.state.breadcrumbData.stockAvailability) {
            stockAvailability = this.state.stockAvailability
        }
        else {
            stockAvailability = {}
        }

        //let stockAvailabilityMessage = stockAvailability && Object.values(stockAvailability) || "";

        this.stockAvailabilityMessage = '';
        if (!isEmpty(this.state.skuStockAvailability)) {
            try {
                for (let ultimasPcs in this.state.skuStockAvailability) {
                    let ultimasProductId = ultimasPcs.split('|')[0] || '';
                    if (ultimasProductId == productSizeId && this.state.skuStockAvailability[ultimasPcs] == "Últimas piezas") {
                        this.stockAvailabilityMessage = this.state.skuStockAvailability[ultimasPcs]
                    }
                }
            } catch (e) { }
        }

        const downloadPopup = {
            modalId: "productDownload-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "edd-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const pageUrl = get(this.state.window, 'document.location.href', '');

        let productDescription = '';
        let shareProductId = '';
        let shareSkuLargeImage = '';
        if (pdpType === 'hybrid') {
            productDescription = get(productInfo, 'attributes["product.displayName"][0]', '');
            shareProductId = get(productInfo, 'attributes["product.collectionProductId"][0]', '');
            shareSkuLargeImage = get(productInfo, 'attributes["sku.largeImage"][0]', '');
        } else {
            productDescription = get(productInfo, 'productDisplayName[0]', '');
            shareProductId = get(productInfo, 'productId[0]', '');
            shareSkuLargeImage = (productInfo["sku.largeImage"] && productInfo["sku.largeImage"][0]) || '';
        }
        /* Change done for 23287:Start */
        let modalDatas = getModalDatas(productInfo, staticLabels, pageUrl, productDescription);
        if (isMarketPlace === "true" || pdpType == "hybrid") { /* Defect 24229 - additionally checking pdpType == "hybrid" */
            modalDatas.productPromotion = promotionInfo;
        }
        /* Change done for 23287:End */
        const productSocialEmailData = {
            productDescription,
            productId: shareProductId,
            skuLargeImage: shareSkuLargeImage,
            pageUrl,
            hostName: this.state.hostName
        };

        const EDD_Eligibility = this.props.mainContent.enableEDD || ""
        const ITR_Eligibility = this.props.mainContent.ITR_Eligibility || ""
        const specialSaleMessage = this.props.mainContent.specialSaleMessage || ""
        const carouselsContent = get(this.state, 'carouselsData.carouselContent', []);


        let skuattrMap = contentsRecords && contentsRecords.productVarientsInfo && contentsRecords.productVarientsInfo.skuAttributeMap || {}
        let opticProp = "";
        let keyArray = Object.keys(skuattrMap);
        if (skuattrMap && keyArray && keyArray[0]) {
            opticProp = ((skuattrMap[keyArray[0]]["ListingPage.opticsBaseCurve.label"] || skuattrMap[keyArray[0]]["ListingPage.opticsColor.label"] || skuattrMap[keyArray[0]]["ListingPage.opticsCylinder.label"] || skuattrMap[keyArray[0]]["ListingPage.opticsDiameter.label || ListingPage.opticsPower.label"]) || "");
        }
        //let opticProp = skuattrMap && (skuattrMap[Object.keys(skuattrMap)[0]]["ListingPage.opticsBaseCurve.label"] || skuattrMap[Object.keys(skuattrMap)[0]]["ListingPage.opticsColor.label"] || skuattrMap[Object.keys(skuattrMap)[0]]["ListingPage.opticsCylinder.label"] || skuattrMap[Object.keys(skuattrMap)[0]]["ListingPage.opticsDiameter.label || ListingPage.opticsPower.label"]) || "";
        if (opticProp && opticProp != "") {
            pdpType = "optic"
        }

        let alertClassNames = `m-alert__container mdc-snackbar ${this.state.alertToTop} ${this.state.alertToTopSticky} `;
        let alertIconType = '';
        if (alert_Type == "success" || alert_message === 'Se ha copiado el link del artículo') {
            alertClassNames = alertClassNames + ' -success';
            alertIconType = 'a-alert__icon icon-done';
        } else if (alert_Type == "warning") {
            alertClassNames = alertClassNames + ' -warning';
            alertIconType = 'a-alert__icon icon-warning';
        } else {
            alertClassNames = alertClassNames + ' -alert';
            alertIconType = 'a-alert__icon icon-error';
        }

        return (
            <React.Fragment>
                {/*<Head>*/}

                {(Enableswogo == "true") && (flags && !flags['swogoflag'] ? "" : <script defer type="text/javascript" src={swogoScript}></script>)}

                {/*</Head>*/}
                {/*(flags && !flags['turntoflag'] ? "" : <script defer type="text/javascript" src={ratingScript}></script>)*/}

                <EventListener target="document" onScroll={this.handleWindowScroll} /> {/* modified function condition for bug id 23601*/}
                {/* <EventListener target="document" onClick={this.handleBodyClick} /> */}
                <EventListener target="window" onResize={this.onOrientationChange} /> {/* addedd for bug 23061 */}
                <Alert {...this.props}
                    alertTopClass={alertClassNames}
                    iconType={alertIconType} text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert}
                    fromPDP="true"
                />


                { !this.props.donotLoad && this.props.cartHeaderProcessCompleted && 
                <StickyBar
                    onChangeQty={this.onChangeQty}
                    onBlurQty={this.onBlurQty}
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
                    funChangeTabs={this.funChangeTabs}
                    staticLabels={staticLabels}
                    productType={this.state.productType}
                    colorImage={this.state.colorImage} /*changes for color image implementation */
                    getModalDatas={modalDatas} /*changes for showing policies in stickybar  */
                />
                }
                <div className="d-none d-lg-block m-product__BreadCrumb">
                     { !this.props.donotLoad && this.props.cartHeaderProcessCompleted && 
                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} removeIconAtLast={true} />
                     }
                </div>
                {(this.getchanelBrandHTML() !== 'NA' && !this.props.donotLoad && this.props.cartHeaderProcessCompleted) ? <div dangerouslySetInnerHTML={{ __html: this.getchanelBrandHTML() }} /> : ''}
                {(pdpType !== 'undefined' )? <TechnicalSeo pageName="PDP" contentItem={this.state.contentItem} breadcrumbData={this.state.breadcrumbData} offers={this.state.alloffers} staticLabelValues={this.props.mainContent.staticLabels} hostName={this.state.hostName} relativePath={this.state.relativePath} mouseFlag={(flags && !flags['mouseflag']) ? false : true} /> : ''}
                 { !this.props.donotLoad && this.props.cartHeaderProcessCompleted && 
                <PdpProductDetail
                    selectedMaterial={selectedMaterial}
                    selectedTexture={selectedTexture}
                    set_store_number={this.set_store_number}
                    set_postal_zip_code={this.set_postal_zip_code}
                    selectedAddressInfo={this.state.selectedAddressInfo}
                    setSelectedAddressInfo={this.setSelectedAddressInfo}
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
                    staticLabels={staticLabels}  /*changes made for Pdp staticlabel issue start --  addedd s to staticlabel*/
                    imageBreak={this.imageBreak}
                    productSizeName={this.state.productSizeName}
                    colorStyle={this.state.colorStyle}
                    updateOpticData={this.updateOpticData}
                    stockAvailability={this.stockAvailabilityMessage}
                    pdpQty={this.state.pdpQty}
                    productType={this.state.productType}
                    handleScroll={this.handleScroll}
                    chanelBrandCss={this.state.chanelBrandCss}
                    stickyThumbImg={stickyThumbImg}
                    limited={this.state.limited_Pieces}
                    EDD_Eligibility={EDD_Eligibility}
                    ITR_Eligibility={ITR_Eligibility}
                    isMarketPlace={isMarketPlace}
                    vedioLinks={vedioLinks}
                    specialSaleMessage={specialSaleMessage}
                    hybridProductId={hybridProductId}
                    swogoFlag={(flags && !flags['swogoflag'] ? false : true)}
                    isLensePage={isLensePage}
                    onColorHover={this.onColorHover}
                    hoverColorText={this.state.hoverColorText}
                    isMobile={isMobile}
                    isIpad={isIpad}
                    isDesktop={isDesktop}
                    skuStockAvailability={this.state.skuStockAvailability}
                    colorIDforImage={colorIDforImage}
                    Enableswogo={Enableswogo}
                    ifSize={ifSize}
                    // Custom Products functionality START
                    handleCustomProduct={this.handleCustomProduct}
                    handleGetCustomSkus={this.handleGetCustomSkus}
                    window={this.state.window}
                // Custom Products functionality END
                />
                 }
                 { !this.props.donotLoad && this.props.cartHeaderProcessCompleted &&
                <parentContext.Consumer>
                    {({ showModal, updateSelectedState }) => (showModal.productDownloadCode === true ? <Modal modalDetails={downloadPopup} showModalpopUp={"productDownloadCode"}>
                        <ProductDownloadCode ModalpopUp={"productDownloadCode"} />
                    </Modal> : null
                    )}
                </parentContext.Consumer>
                 }
                 { !this.props.donotLoad && this.props.cartHeaderProcessCompleted &&
                <section className="pt-lg-5 pb-lg-5">
                    <div className="container-fluid">
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-12 pr-lg-3 pl-lg-3">
                                    <ProductSpecs orientation={this.state.orientation} forcePadding={true} ref={this.specsRef} isDesktop={isDesktop} windowProp={this.state.window} funChangeTabs={this.funChangeTabs} changeTabs={this.state.changeTabs} mainContent={contentsRecords} productSocialEmailData={productSocialEmailData} isMobile={isMobile} isIpad={isIpad} promotionInfo={promotionInfo} modalDatas={modalDatas} productSizeId={this.state.productSizeId} imageBreakFlag={this.state.imageBreakFlag} staticLabels={staticLabels} show_alert={this.show_alert}   /*changes made for Pdp staticlabel issue start --  addedd s to staticlabel , modified  for bug id 23601 -- added prop is desktop and window state , added orientation props - bug 23061 */
                                        padWidth={(this.state.window && typeof this.state.window !== 'string') ? this.state.window.innerWidth : 0} padHeigth={(this.state.window && typeof this.state.window !== 'string') ? this.state.window.innerHeight : 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </section>
                 }

                {  !this.props.donotLoad && this.props.cartHeaderProcessCompleted && <section className="o-carousel-section">
                    <div className="container-fluid o-carousel-container">
                        <div className="container p-0" >
                            <div className="row">
                                <div className="col-12">
                                    <Carousel carouselsData={this.state.carouselsData} chanelBrandCss={this.state.chanelBrandCss} loginDetails={this.props.loginDetails} sendCurrentL1Name={L1CategoryForCarousal} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
                {/* Change made for 22275 order of opinion and extra info changed Start */}
                { !this.props.donotLoad && this.props.cartHeaderProcessCompleted &&
                <section className="d-none d-lg-block">
                    <div className="container-fluid">
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-12 mt-5 mb-5">
                                    {isDesktop || (isIpad && (Math.abs(this.state.window.orientation) === 90 || this.state.window.innerWidth > this.state.window.innerHeight || this.state.window.innerWidth > 990)) ? /*fixes for 23601 */
                                        <div className="o-product__comment" id={isdektophashId}>
                                            <PdpAccordion headText={"Opiniones del artículo"} isopenStatus="show">
                                                <div id="TurnToReviewsContent"></div>
                                            </PdpAccordion>
                                        </div> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                }
                { !this.props.donotLoad && this.props.cartHeaderProcessCompleted &&
                <section className="d-none d-lg-block extra-info">
                    {!isMobile ? (!isEmpty(extraInfoDetails.extraInformationWeb) || !isEmpty(extraInfoDetails.extraInformationWap)) &&
                        <div className="container-fluid">
                            <div className="container p-0">
                                <div className="row">
                                    <div className="col-12 mt-5 mb-5">
                                        <div className="o-product__productExtraInfo" >
                                            <PdpAccordion headText={staticLabels && staticLabels['pdpPage.extraInformation.label']} isopenStatus="show">
                                                <ProductExtraInfo extraInfoDetails={extraInfoDetails} />
                                            </PdpAccordion>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div> : null
                    }
                </section>
                }
                {/* Change made for 22275 order of opinion and extra info changed End */}
                
                { !this.props.donotLoad && this.props.cartHeaderProcessCompleted && <section className="o-carousel-section">
                    <div className="container-fluid o-carousel-container">
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-12">
                                    <Carousel carouselsData={this.state.carouselsData} PdpSecond={true} chanelBrandCss={this.state.chanelBrandCss} loginDetails={this.props.loginDetails} sendCurrentL1Name={L1CategoryForCarousal} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}




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
        let sizeSequence = 9999;
        try {
            let sizeArr = size.split('|');
            if (sizeArr.length > 2) {
                sizeSequence = (!isNaN(sizeArr[2])) ? Number(sizeArr[2]) : 9999;
            }
        } catch (e) { }
        finalSortedSize.push({
            size: key,
            sizeSequence,
            disable: (size.split('|'))[0] === 'FALSE' ? true : false,
            sizeid: (size.split('|'))[1]
        })
    });
    try {
        finalSortedSize.sort(function (a, b) {
            return a.sizeSequence - b.sizeSequence;
        });
    } catch (e) { }
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
const getModalDatas = (productInfo, staticLabels, pageUrl = '', productDescription = '') => {
    return {
        productPolicies: (productInfo["product.refundPolicy"] && productInfo["product.refundPolicy"][0]) || '',
        productLongDescription: (productInfo["product.longDescription"] && productInfo["product.longDescription"][0]) || '',
        productFeatures: productInfo["product.dynamicAttribute"] || '',

        productPromotion: {
            lpPromotions: productInfo["lpPromotions_pwa"] || [],
            otherPromotions: productInfo["otherPromotions_pwa"] || [],
        },
        productSocialShare: {
            txtFacebook: staticLabels && staticLabels["pwa.facebook.text"] || 'pwa.facebook.text',
            txtTwitter: staticLabels && staticLabels["pwa.twitter.text"] || 'pwa.twitter.text',
            txtEmail: staticLabels && staticLabels["pwa.email.text"] || 'pwa.email.text',
            txtCopy: staticLabels && staticLabels["pwa.copiar.text"] || 'pwa.copiar.text',
            txtWhatsapp: staticLabels && staticLabels["pwa.whatsapp.text"] || 'pwa.whatsapp.text',
            pageUrl,
            productDescription
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
    let prodType = get(props.mainContent, "endecaProductInfo.contents[0].mainContent[0].record.attributes.productType[0]", "")
    return (props.mainContent && props.mainContent.endecaProductInfo &&
        props.mainContent.endecaProductInfo.contents && props.mainContent.endecaProductInfo.contents[0] &&
        props.mainContent.endecaProductInfo.contents[0].mainContent && props.mainContent.endecaProductInfo.contents[0].mainContent[0] &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record && props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.productType &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.productType[0]) || prodType || ""
}