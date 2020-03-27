import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';
import Link from "../../atoms/Link/Link"; /*changes for color image implementation */
import Button from '../../atoms/Button/Button';
import Label from '../../atoms/Label/Label';
import ProductInformationCollection from '../../organisms/ProductInformation/ProductInformationCollection';
import ProductInfoCollection from '../ProductPdp/ProductInfoCollection';
import { Path } from '../../../helpers/config/config';
import { Utility, GetPrice, logDebug, logError, UserAgentDetails } from '../../../helpers/utilities/utility'; /*added logdebug and logerror for 23505 */
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Slider from 'react-slick';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import ProductSocialShareModal from '../../molecules/Modals/ProductSocialShareModal';
import get from 'lodash/get';
import ProductSocialEmail from '../../molecules/Modals/ProductSocialEmail';
import EventListener from 'react-event-listener';


import { ProductCollectionDetailData } from '../../templates/Pdp/staticConstant'


export default class ProductCollectionItem extends React.Component {
    constructor(props) {
        super(props)
        // changes for 23505 starts
        const varientColorMap = get(props, 'productData.productVarientsInfo.colorMap.size', {});
        const varientColors = get(props, 'productData.productVarientsInfo.colorMap.color', {});
        const defaultSkuId = get(props, 'productData.productVarientsInfo.defaultSkuId', {});
        let productSizeIdVal = '';
        let productSizeIdValTmp = '';
        const varientSizeArr = Object.keys(varientColorMap);
        this.onOrientationChange = this.onOrientationChange.bind(this); /*added made for 23682 */
        /*Added for Edd in collection add to cart --  start*/
        this[props.productId + "constant"] = React.createRef();
        this[props.productId + "eddData"] = {};
        /*Added for Edd in collection add to cart --  end*/
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
        // changes for 23505 ends
        this.state = {
            pdpQty: '0',
            showQtyDropdown: false,
            sizeApiRecord: {},
            finalSortedSize: [],
            colorText: '',
            hoverColorText: '',
            activeColorIndex: 0,
            activeSizeIndex: null,
            productSizeName: '',
            colorStyle: '',
            colorImage: '', /*changes for color image implementation */
            anySizeSelected: false,
            materials: [],
            textures: [],
            activeGiftItemIndex: -1,
            GWPSelectedProductId: '',
            GWPSelectedProductType: '',
            GWPSelectedAssociatedSkuId: '',
            productSizeId: productSizeIdVal, /*changed for 23505 */ //(props.productData.productVarientsInfo && props.productData.productVarientsInfo.skuAttributeMap) ? Object.keys(props.productData.productVarientsInfo.skuAttributeMap)[0] : {},
            endecaProductRecord: this.props.mainContent.endecaProductInfo ? this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {},
            selectedMaterial: null,
            selectedTexture: null,
            finalPrices: {},
            uniqueColorList: {},
            limited_Pieces: '0',
            productSelectionStatus: false,
            alloffers: {},
            slideImages: [],
            window: '',
            sizeRecords: props.productData.productVarientsInfo || {},
            productId: props.productId || "",
            /*Added for Edd in collection add to cart --  start*/
            resetQty: "1",
            storeNumber: "",
            selectedStoreStateId: "",
            postalZipCode: "",
            selectedAddressInfo: {},
            /*Added for Edd in collection add to cart --  end*/
        }

        this.myContent = React.createRef();
        this.allOffers = [];

    }

    componentDidMount() {

        let colorList = this.props.productData && this.props.productData.productVarientsInfo && this.props.productData.productVarientsInfo.colorMap && this.props.productData.productVarientsInfo.colorMap.color || {};
        const uniqueColorList = this.getHexaColorCodeByColorName('', colorList)
        //const uniqueColorList = this.get_UniqueColorList('', getHexaColorCodeFromColorMap);
        document.body.addEventListener('click', this.closeQtyDropdown);
        this.Limited_pieces_skus();
        this.setState({ uniqueColorList, slideImages: this.getSelectedSkuImages(this.props.fullCollectionData, this.props.productId, this.props.productId), colorText: Object.keys(colorList)[0], colorStyle: Object.values(uniqueColorList)[0] }, () => {
            //this.getVariantsByColor('', Object.keys(colorList)[0], 0);
            let variantsData = { "colorMap": get(this.props.productData, 'productVarientsInfo.colorMap', {}) };
            let responseData = { variantsData };
            this.forColorAndSize(responseData, { e: '', val: Object.keys(colorList)[0], index: 0 });
        })
        const gwpFirstItem = get(this.props.productData, 'productVarientsInfo.gwpPromotions.giftItems[0]', {});
        if (!isEmpty(gwpFirstItem)) {
            const GWPSelectedProductId = get(gwpFirstItem, 'productId', '');
            const GWPSelectedProductType = get(gwpFirstItem, 'productType', '');
            const GWPSelectedAssociatedSkuId = get(gwpFirstItem, 'associatedSkuId', '');
            this.setState({ GWPSelectedProductId, GWPSelectedProductType, GWPSelectedAssociatedSkuId });
        }
        const windowObj = window || {};
        this.setState({ window: windowObj });

        this.getOffers();
    }
    limitedqty = (qty) => {
        qty = qty == "" ? "1" : qty;
        if (this.state.limited_Pieces > qty) {
            return false;
        } else {
            return true;
        }
    }
    onSelectGiftItem = (index, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType) => {
        if (this.state.activeGiftItemIndex !== index) {
            this.setState({ activeGiftItemIndex: index, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType });
        }
    }
    getSelectedSkuImages = (collectionData, ProductId, Skuid) => {
        let selectedSkuData = collectionData && collectionData.productsInfo && collectionData.productsInfo[ProductId] || {}
        let productImages = selectedSkuData && selectedSkuData.akamaiSkuImagesInfo && selectedSkuData.akamaiSkuImagesInfo.skuImageMap || {}
        let thumbnailImage = !isEmpty(productImages) && this.dynamicUrl(productImages, Skuid);

        if (thumbnailImage.length == 0) {
            let defaultSkuID = selectedSkuData && selectedSkuData.productVarientsInfo && selectedSkuData.productVarientsInfo.defaultSkuId
            thumbnailImage = !isEmpty(productImages) && this.dynamicUrl(productImages, defaultSkuID);
        }
        //console.log("thumbnailImage", thumbnailImage)
        return thumbnailImage
    }
    componentWillReceiveProps(nextProps, state) {
        if (nextProps.deslectionFromSticky != undefined && nextProps.deslectionFromSticky == "removeAll") {
            this.setState({ productSelectionStatus: false, pdpQty: 0 })
        }
        else {
            if (nextProps.deslectionFromSticky != undefined && nextProps.deslectionFromSticky.productId == this.props.id) {
                this.setState({ productSelectionStatus: false, pdpQty: 0 })
            }
        }
        /*changes for color image implementation -start*/
        // if (nextProps.orientation == this.props.orientation) {
        //     this.setState({ slideImages: this.getSelectedSkuImages(state.fullCollectionData, state.productId, state.productSizeId) })
        // }
        /*changes for color image implementation - end */
    }

    check_product_sku_selection = () => {

        // let promise = new Promise((resolve, reject) => {
        //     resolve();
        // });
        // return promise;

        let promise = new Promise((resolve, reject) => {
            const { finalSortedSize,
                activeSizeIndex,
                materials,
                selectedMaterial,
                textures,
                selectedTexture } = this.state;

            const validationText = finalSortedSize.length ? (
                activeSizeIndex === null ? "Selecciona una talla" : (
                    materials.length ? (
                        selectedMaterial === null ? "Selecciona una Material" : (
                            textures.length ? (
                                selectedTexture === null ? "Selecciona una Textura" : true
                            ) : false
                        )
                    ) : false
                )
            ) : false;


            if (validationText) {
                this.props.show_alert(validationText, "alert", true);
            } else {
                resolve()
            }
        });
        return promise;
    }
    onColorHover = (hoveredColor) => {

        this.setState({ hoverColorText: hoveredColor })
    }
    validate_sku_selection = () => {

        let promise = new Promise((resolve, reject) => {
            const { finalSortedSize,
                activeSizeIndex,
                materials,
                selectedMaterial,
                textures,
                selectedTexture } = this.state;

            const validationText = finalSortedSize.length ? (
                activeSizeIndex === null ? "Selecciona una talla" : (
                    materials.length ? (
                        selectedMaterial === null ? "Selecciona una Material" : (
                            textures.length ? (
                                selectedTexture === null ? "Selecciona una Textura" : true
                            ) : false
                        )
                    ) : false
                )
            ) : false;


            if (validationText) {
                this.props.show_alert(validationText, "alert", true);
            } else {
                resolve()
            }
        });
        return promise;
    }

    set_postal_zip_code = (postalZipCode) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode, selectedAddressInfo: {} }) /*Added for Edd in collection add to cart*/
    }
    toggleQtyDropdown = () => {
        if (this.state.showQtyDropdown) {
            this.setState({ showQtyDropdown: false, resetQty: '' });
        } else {
            this.setState({ showQtyDropdown: true, resetQty: '' });
        }
    }
    closeQtyDropdown = (e) => {
        try {
            const qtyClassNames = e && e.target && e.target.className || '';
            if (qtyClassNames.indexOf("pdpDropdwonToClose") === -1 && this.state.showQtyDropdown) {
                this.setState({ showQtyDropdown: false, pdpQty: this.state.limited_Pieces > "1" ? this.state.limited_Pieces : this.state.pdpQty == "" ? '0' : this.state.pdpQty })
            }
        } catch (e) { console.error(e); }
    }
    onSelectDropdownQty = (qty) => {

        if (!this.limitedqty(qty)) { return false; }
        else {
            this.validate_sku_selection().then(() => {

                if (qty === '6+' && this.state.pdpQty !== '') {
                    this.setState({ resetQty: "1", pdpQty: '' });
                    const qtyInput = document.getElementById('a-ProductQty__inputDesktop' + this.props.productId);
                    qtyInput && qtyInput.focus();
                } else if (qty !== '' && qty !== this.state.pdpQty) {

                    //this.getImage(collectionData)
                    const { productSizeId, pdpQty, selectedStoreStateId, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, finalPrices } = this.state; /*Added for Edd in collection add to cart */
                    let productType = this.props.productData && this.props.productData.productType && this.props.productData.productType[0] || "";
                    const { productData = {} } = this.props;
                    const priceData = !isEmpty(finalPrices) ? finalPrices : this.getPriceData(productData)
                    const priceToShow = GetPrice(priceData);
                    /*Added for Edd in collection add to cart --  start*/
                    let postalZipCode = "";
                    let storeNumber = "";
                    let addressId = "";
                    let selectedState = "";
                    let zipStoreElem = document.getElementById(`eddStore${this.props.productId}`)
                    let ZipOrStore = zipStoreElem && zipStoreElem.getAttribute("name");
                    let SpecificZipOrStore = ZipOrStore && ZipOrStore !== "" && ZipOrStore.split(':') || "";
                    if (SpecificZipOrStore && SpecificZipOrStore != "" && SpecificZipOrStore[0]) {
                        if (SpecificZipOrStore[0] === "storeName") {
                            storeNumber = SpecificZipOrStore[1]
                            selectedState = SpecificZipOrStore[2]
                        }
                        else {
                            postalZipCode = SpecificZipOrStore[1]
                            addressId = SpecificZipOrStore[2] || ""
                        }
                    }
                    let selectedProductDetails = { priceToShow, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": this.props.productId, "quantity": qty, "selectedSkuColor": this.state.colorStyle, colorImage: this.state.colorImage, productImg: this.getImage(this.props.productData), productSizeId, productType, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, addressId, selectedState } /*changes for color image implementation */
                    /*Added for Edd in collection add to cart --  end*/

                    this.setState({ resetQty: "1", pdpQty: qty, productSelectionStatus: qty > 0 ? true : false });
                    // if (window.screen.width >= 990) {
                    this.props.productSelection(selectedProductDetails)
                    // }

                }
                this.setState({ showQtyDropdown: false });
            })
        }
    }
    getImage = (productData) => {
        const skuImageMap = productData.akamaiSkuImagesInfo && productData.akamaiSkuImagesInfo.skuImageMap || {};
        //const skuImageMap = contentsRecords && contentsRecords.akamaiSkuImagesInfo && contentsRecords.akamaiSkuImagesInfo.skuImageMap || {};
        let stickyThumbImg = skuImageMap && skuImageMap[this.state.productSizeId + '_th'] || ''; /*changes made for stickybar image changes for selected product  */
        if (stickyThumbImg === '') {
            const defaultSkuId = productData.productVarientsInfo.defaultSkuId || '';
            stickyThumbImg = skuImageMap && skuImageMap[defaultSkuId + '_th'] || '';
        }
        return stickyThumbImg
    }
    onSelectModalQty = (qty) => {

        qty = qty.toString();
        if (qty === '6+' && this.state.pdpQty !== '') {
            this.setState({ resetQty: "1", pdpQty: '' });
            const qtyInput = document.getElementById('a-ProductQty__inputMobile');
            qtyInput && qtyInput.focus();
        } else if (qty !== '' && qty !== this.state.pdpQty) {
            this.setState({ resetQty: "1", pdpQty: qty });
        }
    }
    onClickQtyReset = (qty) => {
        this.setState({ resetQty: "" });
    }

    onChangeQty = (qty, src) => {

        qty = qty.toString();
        console.log("this coldetails", this)
        // let ZipOrStore = document.getElementById(`eddStore${this.props.productId}`).getAttribute("name");
        // let SpecificZipOrStore = ZipOrStore && ZipOrStore !== "" && ZipOrStore.split(':') || "";
        // if (SpecificZipOrStore && SpecificZipOrStore != "" && SpecificZipOrStore[0]) {
        //     if (SpecificZipOrStore[0] === "storeName") {
        //         storeNumber = SpecificZipOrStore[1]
        //     }
        //     else {
        //         postalZipCode = SpecificZipOrStore[1]
        //     }
        // }
        if (qty.length <= 3) {
            
            this.setState({ resetQty: "1", pdpQty: qty, productSelectionStatus: qty > 0 ? true : false });
                    
            const { productSizeId, selectedStoreStateId, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, finalPrices } = this.state;   /*Added for Edd in collection add to cart */
            const { productData = {} } = this.props;
            const priceData = !isEmpty(finalPrices) ? finalPrices : this.getPriceData(productData)
            const priceToShow = GetPrice(priceData);
            let productType = this.props.productData && this.props.productData.productType && this.props.productData.productType[0] || "";
            /*Added for Edd in collection add to cart --  start*/
            let postalZipCode = "";
            let storeNumber = "";
            let addressId = "";
            let selectedState = "";
            let zipStoreElem = document.getElementById(`eddStore${this.props.productId}`)
            let ZipOrStore = zipStoreElem && zipStoreElem.getAttribute("name");
            // let ZipOrStore = document.getElementById(`eddStore${this.props.productId}`).getAttribute("name");
            let SpecificZipOrStore = ZipOrStore && ZipOrStore !== "" && ZipOrStore.split(':') || "";
            if (SpecificZipOrStore && SpecificZipOrStore != "" && SpecificZipOrStore[0]) {
                if (SpecificZipOrStore[0] === "storeName") {
                    storeNumber = SpecificZipOrStore[1]
                    selectedState = SpecificZipOrStore[2] || ""
                }
                else {
                    postalZipCode = SpecificZipOrStore[1]
                    addressId = SpecificZipOrStore[2] || ""
                }
            }
            let selectedProductDetails = { src: src, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": this.props.productId, "quantity": qty, "selectedSkuColor": this.state.colorStyle, colorImage: this.state.colorImage, productImg: this.getImage(this.props.productData), productSizeId, productType, pdpQty: qty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, priceToShow, addressId, selectedState } /*changes for color image implementation */
            /*Added for Edd in collection add to cart --  end*/
            // if (window.screen.width >= 990) {
            // if(src != undefined && src != ""){

            this.props.productSelection(selectedProductDetails)
            // }
            // }
        }
        else {
            // this.props.show_alert("only three digits allowed")
        }

    }
    getHexaColorCodeByColorName = (colorName, colorList = {}) => {

        let colorHexaCodeValue = {};
        if (!isEmpty(colorList)) {
            let colorNameList = !isEmpty(colorList) && Object.keys(colorList);

            colorNameList.map(color => {
                if (colorName != "") {
                    if (color === colorName) {
                        colorHexaCodeValue[color] = colorList[color] && colorList[color] != "" && colorList[color] != null ? colorList[color].split("|")[0] : "";
                    }
                }
                else {

                    colorHexaCodeValue[color] = colorList[color] && colorList[color] != "" && colorList[color] != null ? colorList[color].split("|")[0] : "";
                }
            });
        }

        return colorHexaCodeValue;
    }
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
                currentProduct['storeNumber'] = this.state.storeNumber ? this.state.storeNumber : '';
                currentProduct['eddZipCode'] = this.state.postalZipCode ? this.state.postalZipCode : '';
                currentProduct['isSpecialSale'] = "false";
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

    getVariantsByColor = (e, val, index, hexaColorCode, colorId) => {

        const { productSizeId, productId, colorText, endecaProductRecord } = this.state;
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};

        if (colorText !== val) {
            let query = "?variantType=" + 'color' + "&variantValue=" + val + "&productId=" + productId;
            Utility(Path.getVariants + query, 'GET'
            ).then(response => {

                this.getOffers(productId);
                let responseData = response.data;

                if (e != "") {

                    const { productSizeId, productType, productId, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, finalPrices } = this.state;
                    const { productData = {} } = this.props;
                    const priceData = !isEmpty(finalPrices) ? finalPrices : this.getPriceData(productData)
                    const priceToShow = GetPrice(priceData);
                    /*changes for color image implementation - start */
                    let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
                    const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
                    let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {}
                    /*Added for Edd in collection add to cart --  start*/
                    let addressId = "";
                    let selectedState = "";
                    let zipStoreElem = document.getElementById(`eddStore${this.props.productId}`)
                    let ZipOrStore = zipStoreElem && zipStoreElem.getAttribute("name");
                    let SpecificZipOrStore = ZipOrStore && ZipOrStore !== "" && ZipOrStore.split(':') || "";
                    if (SpecificZipOrStore && SpecificZipOrStore != "" && SpecificZipOrStore[0]) {
                        if (SpecificZipOrStore[0] === "storeName") {
                            storeNumber = SpecificZipOrStore[1]
                            selectedState = SpecificZipOrStore[2]
                        }
                        else {
                            postalZipCode = SpecificZipOrStore[1]
                            addressId = SpecificZipOrStore[2] || ""
                        }
                    }
                    let selectedProductDetails = { priceToShow, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": productId, "quantity": this.state.pdpQty, "selectedSkuColor": hexaColorCode, colorImage: this.getColorImage(val, colorList), productImg: this.getImage(this.props.productData), productSizeId, productType, productId, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, addressId, selectedState }
                    /*Added for Edd in collection add to cart --  end*/
                    /*changes for color image implementation - end */
                    this.props.productDeSelection(selectedProductDetails)
                }
                this.forColorAndSize(responseData, { e, val, index, hexaColorCode, colorId });
                this.onLoadPdpGtm('onload');
            });
        }
    }
    get_FinalSortedSize = (props) => {
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

    forColorAndSize = (responseData, { e, val, index, hexaColorCode, colorId }) => {

        const { productSizeId, productId, colorText, endecaProductRecord } = this.state;
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};

        let finalSortedSize = this.get_FinalSortedSize({ sizeApiRecord: responseData });
        var selectedSku = colorId;
        let finalPricesTmp = {};
        let productSizeIdTmp = (colorId === undefined ? productSizeId : colorId);
        if ((!finalSortedSize || finalSortedSize.length === 0) && this.state.sizeRecords.colorMap && this.state.sizeRecords.colorMap.color
            && this.state.sizeRecords.colorMap.color[val]) {

            var temp = this.state.sizeRecords.colorMap.color[val].split("|");
            selectedSku = temp[temp.length - 1];
            try {
                const colorArr = Object.keys(colorList);
                if (colorArr.length === 1) {
                    const skuAttMap = get(productVarientsInfo, 'skuAttributeMap', {});
                    finalPricesTmp = {
                        list: skuAttMap[selectedSku].listPrice,
                        sale: skuAttMap[selectedSku].salePrice,
                        promo: skuAttMap[selectedSku].promoPrice,
                        numRecords: 1
                    };
                    productSizeIdTmp = selectedSku;
                }
            } catch (e) { }

            if (window && window.swogoBundles) {
                window.swogoBundles.reload();
            }
        } else {
        }
        let skuimages = this.getSelectedSkuImages(this.props.fullCollectionData, this.props.productId, productSizeIdTmp)
        // this.setState({ slideImages: skuimages })
        this.setState({
            sizeApiRecord: responseData,
            finalSortedSize,
            colorText: val,
            finalPrices: finalPricesTmp,
            activeColorIndex: index,
            activeSizeIndex: null,
            productSizeName: "", //finalSortedSize.length && finalSortedSize[0].size,
            anySizeSelected: false,
            productSizeId: productSizeIdTmp,
            slideImages: skuimages,
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
                this.getMaterialsBySize(index, enabledSortedSize[0], this.state.productSizeId)
            }
        })
    }
    getMaterialsBySize = async (index, sizeObj, productSizeId) => {

        if (sizeObj.sizeid !== 'NONELIGIBLESIZE') {
            const { productSizeId, productType, productId, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, finalPrices: finalprice, colorStyle, colorText } = this.state;
            const { productData = {} } = this.props;
            const priceData = !isEmpty(finalprice) ? finalprice : this.getPriceData(productData)
            const priceToShow = GetPrice(priceData);
            let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
            const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
            let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {}
            let addressId = "";
            let selectedState = "";
            let zipStoreElem = document.getElementById(`eddStore${this.props.productId}`)
            let ZipOrStore = zipStoreElem && zipStoreElem.getAttribute("name");
            let SpecificZipOrStore = ZipOrStore && ZipOrStore !== "" && ZipOrStore.split(':') || "";
            if (SpecificZipOrStore && SpecificZipOrStore != "" && SpecificZipOrStore[0]) {
                if (SpecificZipOrStore[0] === "storeName") {
                    storeNumber = SpecificZipOrStore[1]
                    selectedState = SpecificZipOrStore[2]
                }
                else {
                    postalZipCode = SpecificZipOrStore[1]
                    addressId = SpecificZipOrStore[2] || ""
                }
            }
            let selectedProductDetails = { priceToShow, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": productId, "quantity": this.state.pdpQty, "selectedSkuColor": colorStyle, colorImage: this.getColorImage(colorText, colorList), productImg: this.getImage(this.props.productData), productSizeId, productType, productId, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, addressId, selectedState }
            /*Added for Edd in collection add to cart --  end*/
            /*changes for color image implementation - end */
            this.props.productDeSelection(selectedProductDetails)

            const skuAttributeMap = this.props.productData && this.props.productData.productVarientsInfo && this.props.productData.productVarientsInfo.skuAttributeMap || {};
            const materials = await this.materialBySize(sizeObj.size, this.state.sizeApiRecord);
            const finalPrices = {
                list: skuAttributeMap && !isEmpty(skuAttributeMap) && skuAttributeMap[sizeObj.sizeid].listPrice || "",
                sale: skuAttributeMap && !isEmpty(skuAttributeMap) && skuAttributeMap[sizeObj.sizeid].salePrice || "",
                promo: skuAttributeMap && !isEmpty(skuAttributeMap) && skuAttributeMap[sizeObj.sizeid].promoPrice || "",
                numRecords: 1
            };
            this.setState({
                materials: materials.length > 1 ? materials : [],
                textures: [],
                activeSizeIndex: index,
                productSizeId: sizeObj.sizeid || this.state.productSizeId, /*uncommented for 23505 */
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
    materialBySize = (size, sizeApiRecord = {}) => {
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

    getTexturesByMaterial = async (value) => {
        if (value) {
            let { materials } = this.state;
            const filterdMaterials = materials.filter(obj => obj.value === value);
            const textures = await this.texturesByMaterail(filterdMaterials[0], this.state.sizeApiRecord);
            if (Object.keys(materials[0]).length === 0) {
                materials.splice(0, 1);
            }
            this.setState({
                textures: textures.length > 1 ? textures : [],
                productSizeId: value,
                selectedMaterial: value,
                materials,
                slideImages: this.getMaterialsBySize(index, enabledSortedSize[0], value)

            })
        }
    }
    texturesByMaterail = (material, sizeApiRecord) => {
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

    getSelectedTexture = (value) => {
        if (value) {
            let { textures } = this.state;
            if (Object.keys(textures[0]).length === 0) {
                textures.splice(0, 1);
            }
            this.setState({
                selectedTexture: value,
                productSizeId: value,
                textures,
                slideImages: this.getMaterialsBySize(index, enabledSortedSize[0], value)

            });
        }
    }
    get_UniqueColorList = (props) => {

        let colorList = this.getHexaColorCodeByColorName('', props);
        let uniqueColorList = uniq(colorList)
        return uniqueColorList;
    }
    // get_FinalSortedSize = (props) => {
    //     let sizeList = (props.sizeApiRecord && props.sizeApiRecord.variantsData && props.sizeApiRecord.variantsData.colorMap && props.sizeApiRecord.variantsData.colorMap.size) || {};
    //     var finalSortedSize = [];
    //     Object.keys(sizeList).forEach(key => {
    //         let size = sizeList[key];
    //         finalSortedSize.push({
    //             size: key,
    //             disable: (size.split('|'))[0] === 'FALSE' ? true : false,
    //             sizeid: (size.split('|'))[1]
    //         })
    //     });
    //     return finalSortedSize;
    // }
    productSelection = (selectedDetails) => {

        if (selectedDetails != undefined && !isEmpty(selectedDetails)) {

            const { productSizeId, pdpQty, selectedStoreStateId, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, finalPrices } = this.state; /*Added for Edd in collection add to cart */
            let productType = this.props.productData && this.props.productData.productType && this.props.productData.productType[0] || "";
            let productId = this.props.productId || ""
            const { productData = {} } = this.props;
            const priceData = !isEmpty(finalPrices) ? finalPrices : this.getPriceData(productData)
            const priceToShow = GetPrice(priceData);
            /*Added for Edd in collection add to cart --  start*/
            let postalZipCode = "";
            let storeNumber = "";
            let addressId = "";
            let selectedState = "";
            let zipStoreElem = document.getElementById(`eddStore${this.props.productId}`)
            let ZipOrStore = zipStoreElem && zipStoreElem.getAttribute("name");
            let SpecificZipOrStore = ZipOrStore && ZipOrStore !== "" && ZipOrStore.split(':') || "";
            if (SpecificZipOrStore && SpecificZipOrStore != "" && SpecificZipOrStore[0]) {
                if (SpecificZipOrStore[0] === "storeName") {
                    storeNumber = SpecificZipOrStore[1]
                    selectedState = SpecificZipOrStore[2]
                }
                else {
                    postalZipCode = SpecificZipOrStore[1]
                    addressId = SpecificZipOrStore[2] || ""
                }
            }
            let selectedProductDetails = { priceToShow, src: selectedDetails.src, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": this.props.productId, "quantity": selectedDetails.qty, "selectedSkuColor": this.state.colorStyle, colorImage: this.state.colorImage, productImg: this.getImage(this.props.productData), productSizeId: selectedDetails.productSizeId, productType, productId, pdpQty: selectedDetails.qty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, addressId, selectedState } /*modified productsizeid for bug fix 23505 start */ /*changes for color image implementation */
            /*Added for Edd in collection add to cart --  end*/
            this.setState({ colorText: selectedDetails.colorText, colorStyle: selectedDetails.colorCode, pdpQty: selectedDetails.qty })
            this.props.productSelection(selectedProductDetails)
        }
        this.setState({ productSelectionStatus: true })
    }
    productDeSelection = (id) => {
        this.props.productDeSelection(id)
        this.setState({ productSelectionStatus: false })
    }

    getOffers = () => {
        try {
            const productId = this.state.productId;
            Utility(Path.alloffers + productId, 'GET', {
                "channel": "WEB",
                "brandName": "LP"
            }).then(response => {
                this.allOffers = response.data;
                const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
                if (enableGtmFlag) {
                    this.onLoadPdpGtm('onload');
                }
                this.setState({
                    alloffers: response.data
                });

            });
        } catch (e) { }

    }
    //--------------Gtm PDP------------------
    onLoadPdpGtm = (data, payload) => {

        let catName = this.state && this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs && this.state.breadcrumbData.breadCrumbs[0] && this.state.breadcrumbData.breadCrumbs[0].categoryName;
        let listName = this.state && this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs && this.state.breadcrumbData.breadCrumbs[0] && this.state.breadcrumbData.breadCrumbs[0].categoryName;
        let dataAvailable = this.state.endecaProductRecord;

        if (!dataAvailable || !dataAvailable.productDisplayName) {
            return false;
        }


        let sizeKeys = this.state.sizeRecords.colorMap.size || {};
        let sizeKeyActive = sizeKeys;
        let activeKeyForCart = '';
        if (sizeKeyActive) {
            for (var i in sizeKeyActive) {
                if (sizeKeyActive[i].indexOf("TRUE") > -1) {
                    activeKeyForCart = i;
                }
            }
        } let bestSeller = this.allOffers && this.allOffers.skuOffers && this.allOffers.skuOffers[0] && this.allOffers.skuOffers[0].bestSeller;
        if (data === 'onload') {
            sizeKeys = Object.keys(sizeKeys);
            dataLayer.push({
                "event": "productDetail",
                'ecommerce': {
                    "detail": {
                        'actionField': {
                            'list': listName || ''
                        },
                        'products': [{
                            'name': dataAvailable.productDisplayName[0] || '',
                            'id': dataAvailable.productId[0] || '', //Generic SKU
                            'category': catName || '',
                            'variant': 'N/A',
                            'price': dataAvailable.listPrice && dataAvailable.listPrice[0] || '',
                            'brand': dataAvailable && dataAvailable['product.brand'] && dataAvailable['product.brand'][0] || '',
                            'dimension27': sizeKeys || '', //CD 27 If doesn`t apply, the value must be empty “”
                            'dimension28': this.state.colorText || '',
                            // 'dimension28': dataAvailable['sku.color'] && dataAvailable['sku.color'][0] || '', //CD 27 If doesn`t apply, the value must be empty  “”
                            'dimension36': bestSeller || '', //CD 36
                            'dimension40': dataAvailable['sku.repositoryId'] && dataAvailable['sku.repositoryId'][0] || '', //CD 40
                            'dimension41': dataAvailable['sku.material'] && dataAvailable['sku.material'][0] || '', //CD 41 If doesn`t apply, the value must be  empty “”
                            'dimension42': dataAvailable['sku.texture'] && dataAvailable['sku.texture'][0] || '', //CD 42 If doesn`t apply, the value must be empty  “”
                            'dimension43': 'N',
                            'metric2': dataAvailable.maximumListPrice && dataAvailable.maximumListPrice[0], //M2
                            'metric3': dataAvailable.promoPrice && dataAvailable.promoPrice[0] //M3
                        }]
                    }
                }
            });
        } else if (data === "click") {
            dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'add': {
                        'products': [{
                            'name': dataAvailable.productDisplayName[0] || '',
                            'id': dataAvailable.productId[0] || '', //Generic SKU
                            'category': catName || '',
                            'variant': 'N/A',
                            'price': dataAvailable.listPrice,
                            'brand': dataAvailable && dataAvailable['product.brand'] && dataAvailable['product.brand'][0] || '',
                            'quantity': payload.quantity || '',
                            'dimension27': dataAvailable['sku.size'] && dataAvailable['sku.size'][0] || '', //CD 27 If doesn`t apply, the value must be empty “”
                            'dimension27': activeKeyForCart || '',
                            'dimension28': this.state.colorText || '',
                            // 'dimension28': dataAvailable['sku.color'] && dataAvailable['sku.color'][0] || '', //CD 27 If doesn`t apply, the value must be empty  “”
                            'dimension36': bestSeller || '', //CD 36
                            'dimension40': dataAvailable['sku.repositoryId'] && dataAvailable['sku.repositoryId'][0] || '', //CD 40
                            'dimension41': dataAvailable['sku.material'] && dataAvailable['sku.material'][0] || '', //CD 41 If doesn`t apply, the value must be  empty “”
                            'dimension42': dataAvailable['sku.texture'] && dataAvailable['sku.texture'][0] || '', //CD 42 If doesn`t apply, the value must be empty  “”
                            'dimension43': 'N',
                            'metric2': dataAvailable.maximumListPrice && dataAvailable.maximumListPrice[0] || '', //M2
                            'metric3': dataAvailable.promoPrice && dataAvailable.promoPrice[0] || '' //M3
                        }]
                    }
                }
            });
        }
    }
    //--------------Gtm PDP------------------

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
    getPriceData = (productInfo) => {

        return {
            list: (productInfo["sku.list_Price"] && productInfo["sku.list_Price"][0]) || "",
            sale: (productInfo["sku.sale_Price"] && productInfo["sku.sale_Price"][0]) || "",
            promo: (productInfo["promoPrice"] && productInfo["promoPrice"][0]) || "",
            minList: (productInfo["minimumListPrice"] && productInfo["minimumListPrice"][0]) || "",
            maxList: (productInfo["maximumListPrice"] && productInfo["maximumListPrice"][0]) || "",
            minPromo: (productInfo["minimumPromoPrice"] && productInfo["minimumPromoPrice"][0]) || "",
            maxPromo: (productInfo["maximumPromoPrice"] && productInfo["maximumPromoPrice"][0]) || "",
            numRecords: productInfo["numRecords"] || 0
        };
    }

    dynamicUrl = (carouselRecords = {}, productId) => {
        const LImg = []
        let SortedImages = this.sortingImage(carouselRecords, productId) /* added for 23682 */
        Object.keys(SortedImages).forEach(key => {
            const { isDesktop, isMobile, isIpad } = UserAgentDetails(this.props.windowObject);
            /*modified made for 23682 -- start */
            let padHeigth = window.innerHeight;
            let padWidth = window.innerWidth;

            if (isDesktop || (isIpad && (window.orientation && Math.abs(window.orientation) === 90 || window.screen.orientation && Math.abs(window.screen.orientation) === 90 || padWidth > padHeigth))) {
                /*modified  made for 23682 -- end */
                if (key.match(productId + '_th') || key.match(productId + '_gl')) {
                    let value = SortedImages[key];
                    if (value !== null) {
                        LImg.push({
                            src: value,
                            w: 1200,
                            h: 900,
                            title: ''
                        })
                    }

                }
            }
            else {
                if (key.match(productId + '_th')) {
                    let value = SortedImages[key];
                    if (value !== null) {
                        LImg.push({
                            src: value,
                            w: 1200,
                            h: 900,
                            title: ''
                        })
                    }

                }
            }

        });
        return LImg
    }
    /* added for 23682 - start */
    sortingImage = (carouselRecords, productId) => {
        let glrecords = Object.keys(carouselRecords).filter(imagekey => imagekey.match("gl")).map(eachglimages => eachglimages.split("_")[2]).sort((a, b) => a - b)
        let orderedImage = {};
        for (let image in carouselRecords) { /*modifed to make th images first 23682 */
            if (image.match(productId + '_th')) { orderedImage[image] = carouselRecords[image] }
        }
        glrecords.map(eachsortorder => { for (let image in carouselRecords) { if (image.match(productId + '_gl') && image.split("_")[1] == "gl" && image.split("_")[2] == eachsortorder) { orderedImage[image] = carouselRecords[image] } } })

        return orderedImage
    }
    /* added for 23682 - end */
    onBlurQty = (e, stky) => {

        let crtstateQty = this.state.pdpQty
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
            this.setState({ resetQty: "1", pdpQty: stky != 'undefined' && stky == 'stickbar' ? e : !this.limitedqty(qty) ? this.state.limited_Pieces : crtstateQty == "" ? '0' : crtstateQty })
        }
    }
    Limited_pieces_skus = () => {

        let objectres = {};
        const productId = this.props.productId;
        let getqty = 0;

        if (isEmpty(this.props.limitedPiecesSkusData)) {
            Utility(Path.limitedPiecesSkus, 'GET').then(response => {

                if (response.status === 200) {
                    !isEmpty(response) && map(response.data, (item, i) => {
                        objectres[item.sku] = item.piezas;
                    });
                    getqty = objectres[productId] || "0";
                    this.setState({ pdpQty: getqty.toString(), limited_Pieces: getqty })
                }
            }, (error) => {
                console.error("Error ==== :: ", error);
            });
        } else {
            !isEmpty(this.props.limitedPiecesSkusData) && map(this.props.limitedPiecesSkusData, (item, i) => {
                objectres[item.sku] = item.piezas;
            });

            getqty = objectres[productId] || "0";
            this.setState({ pdpQty: getqty.toString(), limited_Pieces: getqty })
        }
    }

    set_store_number = (storeNumber, selectedStoreStateId) => {

        this.setState({ storeNumber, selectedStoreStateId, postalZipCode: '', selectedAddressInfo: {} });
    }

    setSelectedAddressInfo = (selectedAddressInfo) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode: '', selectedAddressInfo })
    }
    /*added made for 23682 - start*/
    onOrientationChange = (orientation) => {

        this.setState({ slideImages: this.getSelectedSkuImages(this.props.fullCollectionData, this.props.productId, this.state.productSizeId) })
    }
    /*added made for 23682 - end */

    render() {

        const { productStockAvailability, classNameItem = '', productData = {}, productId = "", mainProductData, staticLabels, isMarketPlace, EDD_Eligibility, ITR_Eligibility } = this.props || {};
        const qtyDropdownInfo = {
            pdpQty: this.state.pdpQty,
            resetQty: this.state.resetQty,
            showQtyDropdown: this.state.showQtyDropdown,
            toggleQtyDropdown: this.toggleQtyDropdown,
            onSelectDropdownQty: this.onSelectDropdownQty,
            onChangeQty: this.onChangeQty,
            onBlurQty: this.onBlurQty,
            closeQtyDropdown: this.closeQtyDropdown,
            collProdId: productId,
            onClickQtyReset: this.onClickQtyReset
        };
        const gwpInfo = {
            gwpData: get(productData, 'productVarientsInfo.gwpPromotions', {}),
            onSelectGiftItem: this.onSelectGiftItem,
            activeGiftItemIndex: this.state.activeGiftItemIndex
        };
        let giftRegistryInfo = {};
        //const staticLabels = staticLabels; /* commented -- changes made for Pdp staticlabel issue */
        const { finalPrices } = this.state;


        const priceData = !isEmpty(finalPrices) ? finalPrices : this.getPriceData(productData)
        const priceToShow = GetPrice(priceData);
        const qtyModalInfo = {
            onSelectModalQty: this.onSelectModalQty
        };
        const getModalDatas = (productData, staticLabels) => { /* addedd s to staticlabel -- changes made for Pdp staticlabel issue */
            let lpPromotions = productData && productData.skupriceInfo && productData.skupriceInfo[0]["lpPromotions"] || [];
            let lpPromotionsArray = []
            lpPromotions.length > 0 && lpPromotions.map((eachPromotions) => lpPromotionsArray.push(eachPromotions.promoDescriptionVisualize))
            let otherPromotions = productData && productData.skupriceInfo && productData.skupriceInfo[0]["otherPromotions"] || [];
            let otherPromotionsArray = []
            otherPromotions.length > 0 && otherPromotions.map((eachPromotions) => otherPromotionsArray.push(eachPromotions.promoDescriptionVisualize))

            return {
                productPolicies: (productData["product.refundPolicy"] && productData["product.refundPolicy"][0]) || '',
                productLongDescription: (productData["product.longDescription"] && productData["product.longDescription"][0]) || '',
                //productFeatures: (productInfo["product.dynamicAttribute"] && productInfo["product.dynamicAttribute"][0]) || '',
                productFeatures: productData["product.dynamicAttribute"] || '',

                productPromotion: {
                    lpPromotions: lpPromotionsArray || [],
                    otherPromotions: otherPromotionsArray || [],
                },
                productSocialShare: {
                    /*changes made for Pdp staticlabel issue start */
                    txtFacebook: staticLabels && staticLabels["pwa.facebook.text"] || 'pwa.facebook.text',
                    txtTwitter: staticLabels && staticLabels["pwa.twitter.text"] || 'pwa.twitter.text',
                    txtEmail: staticLabels && staticLabels["pwa.email.text"] || 'pwa.email.text',
                    txtCopy: staticLabels && staticLabels["pwa.copiar.text"] || 'pwa.copiar.text',
                    txtWhatsapp: staticLabels && staticLabels["pwa.whatsapp.text"] || 'pwa.whatsapp.text',
                    /*changes made for Pdp staticlabel issue end*/
                }
            }
        }

        let ifSize = productData && !isEmpty(productData) && productData["sku.size"] || "";
        let ifDimension = productData && !isEmpty(productData) && productData["sku.dimensions"] || "";
        const specialSaleMessage = productData && productData.specialSaleMessage || ""  /* changes for bug id 23445  */
        return (
            <React.Fragment>
                <EventListener target="window" onResize={this.onOrientationChange} />

                {(productStockAvailability && productStockAvailability === true) ?
                    <article className={"o-product__collectionDescription " + classNameItem}>
                        <Content ref={this[this.props.productId + "constant"]} /*Added for Edd in collection add to cart --  start*/
                            qtyDropdownInfo={qtyDropdownInfo}
                            productData={productData}
                            productId={productId}
                            gwpInfo={gwpInfo}
                            check_product_sku_selection={this.check_product_sku_selection}
                            set_postal_zip_code={this.set_postal_zip_code}
                            productSelection={this.productSelection}
                            mainProductData={mainProductData}
                            getHexaColorCodeByColorName={this.getHexaColorCodeByColorName}
                            uniqueColorList={this.state.uniqueColorList}
                            finalSortedSize={this.state.finalSortedSize}
                            activeSizeIndex={this.state.activeSizeIndex}
                            activeColorIndex={this.state.activeColorIndex}
                            getMaterialsBySize={this.getMaterialsBySize}
                            getTexturesByMaterial={this.getTexturesByMaterial}
                            getVariantsByColor={this.getVariantsByColor}
                            getSelectedTexture={this.getSelectedTexture}
                            colorText={this.state.colorText}
                            onColorHover={this.onColorHover}
                            hoverColorText={this.state.hoverColorText}
                            materials={this.state.materials}
                            textures={this.state.textures}
                            staticLabels={staticLabels} /*changes made for Pdp staticlabel issue -- addedd s to staticlabel */
                            productSizeName={this.state.productSizeName}
                            colorStyle={this.state.colorStyle}
                            stockAvailability={"stockAvailabilityMessage"}
                            productSizeId={this.state.productSizeId}
                            giftRegistryInfo={giftRegistryInfo}
                            mainContent={this.props.mainContent}
                            productSelectionStatus={this.state.productSelectionStatus}
                            isMarketPlace={isMarketPlace}
                            EDD_Eligibility={EDD_Eligibility}
                            ITR_Eligibility={ITR_Eligibility}
                            skuImages={this.state.slideImages}
                            productDeSelection={this.productDeSelection}
                            priceToShow={priceToShow}
                            limited={this.state.limited_Pieces}
                            getModalDatas={this.getModalDatas}
                            windowObject={this.props.windowObject}
                            flags={this.props.fullCollectionData.flags}
                            fullCollectionData={this.props.fullCollectionData}
                            set_store_number={this.set_store_number}
                            show_alert={this.props.show_alert}
                            qtyModalInfo={this.onSelectModalQty}
                            setSelectedAddressInfo={this.setSelectedAddressInfo}
                            validate_sku_selection={this.validate_sku_selection}
                            ifSize={ifSize}
                            specialSaleMessage={specialSaleMessage} /* changes for bug id 23445  */
                        />
                        <div className="unavailable__product">
                            <Paragraph>Artículo no disponible por el momento</Paragraph>
                        </div>
                    </article>
                    :
                    <article className={"o-product__collectionDescription " + classNameItem}>
                        <Content ref={this[this.props.productId + "constant"]} /*Added for Edd in collection add to cart --  start*/
                            qtyDropdownInfo={qtyDropdownInfo}
                            productData={productData}
                            productId={productId}
                            gwpInfo={gwpInfo}
                            check_product_sku_selection={this.check_product_sku_selection}
                            set_postal_zip_code={this.set_postal_zip_code}
                            productSelection={this.productSelection}
                            mainProductData={mainProductData}
                            getHexaColorCodeByColorName={this.getHexaColorCodeByColorName}
                            uniqueColorList={this.state.uniqueColorList}
                            finalSortedSize={this.state.finalSortedSize}
                            activeSizeIndex={this.state.activeSizeIndex}
                            activeColorIndex={this.state.activeColorIndex}
                            getMaterialsBySize={this.getMaterialsBySize}
                            getTexturesByMaterial={this.getTexturesByMaterial}
                            getVariantsByColor={this.getVariantsByColor}
                            getSelectedTexture={this.getSelectedTexture}
                            colorText={this.state.colorText}
                            materials={this.state.materials}
                            textures={this.state.textures}
                            staticLabels={staticLabels}  /*changes made for Pdp staticlabel issue -- addedd s to staticlabel */
                            productSizeName={this.state.productSizeName}
                            colorStyle={this.state.colorStyle}
                            stockAvailability={"stockAvailabilityMessage"}
                            productSizeId={this.state.productSizeId}
                            giftRegistryInfo={giftRegistryInfo}
                            mainContent={this.props.mainContent}
                            productSelectionStatus={this.state.productSelectionStatus}
                            isMarketPlace={isMarketPlace}
                            EDD_Eligibility={EDD_Eligibility}
                            ITR_Eligibility={ITR_Eligibility}
                            skuImages={this.state.slideImages}
                            productDeSelection={this.productDeSelection}
                            priceToShow={priceToShow}
                            limited={this.state.limited_Pieces}
                            getModalDatas={this.getModalDatas}
                            windowObject={this.props.windowObject}
                            fullFlags={this.props.fullCollectionData.flags}
                            fullCollectionData={this.props.fullCollectionData}
                            set_store_number={this.set_store_number}
                            show_alert={this.props.show_alert}
                            qtyModalInfo={this.onSelectModalQty}
                            onColorHover={this.onColorHover}
                            hoverColorText={this.state.hoverColorText}
                            setSelectedAddressInfo={this.setSelectedAddressInfo}
                            validate_sku_selection={this.validate_sku_selection}
                            ifSize={ifSize}
                            specialSaleMessage={specialSaleMessage} /* changes for bug id 23445  */
                        />

                    </article>
                }

            </React.Fragment>
        );
    }

}

export class Content extends React.Component {
/*Added for Edd in collection add to cart --  start*/
    constructor(props) {
        super(props)
        this[props.productId + "infocol"] = React.createRef();
    }
    /*Added for Edd in collection add to cart --  end*/
    render() {
        const { productData = {}, productId = "", check_product_sku_selection, mainProductData, productSizeId, isMarketPlace, EDD_Eligibility, ITR_Eligibility, staticLabels, skuImages = [], gwpInfo = {}, ifSize } = this.props; /*changes made for Pdp staticlabel issue -- addedd s to staticlabel */
        // const skuImageMap = productData.akamaiSkuImagesInfo && productData.akamaiSkuImagesInfo.skuImageMap || {};
        // //const skuImageMap = contentsRecords && contentsRecords.akamaiSkuImagesInfo && contentsRecords.akamaiSkuImagesInfo.skuImageMap || {};
        // let stickyThumbImg = skuImageMap && skuImageMap[productSizeId + '_th'] || '';
        // if (stickyThumbImg === '') {
        //     const defaultSkuId = productData.productVarientsInfo.defaultSkuId || '';
        //     stickyThumbImg = skuImageMap && skuImageMap[defaultSkuId + '_th'] || '';
        // }
        //const staticLabels = staticLabels && staticLabels.staticLabelValues && staticLabels.staticLabelValues[0] && staticLabels.staticLabelValues[0].keyValues /*changes made for Pdp staticlabel issue -- commented */
        //
        const pageUrl = get(this.props.windowObject, 'document.location.href', '')
        const { isDesktop, isMobile, isIpad } = UserAgentDetails(this.props.windowObject);
        ProductCollectionDetailData.productSocialShare.txtFacebook = staticLabels && staticLabels["pwa.facebook.text"] || 'pwa.facebook.text';
        ProductCollectionDetailData.productSocialShare.txtTwitter = staticLabels && staticLabels["pwa.twitter.text"] || 'pwa.twitter.text';
        ProductCollectionDetailData.productSocialShare.txtEmail = staticLabels && staticLabels["pwa.email.text"] || 'pwa.email.text';
        ProductCollectionDetailData.productSocialShare.txtCopy = staticLabels && staticLabels["pwa.copiar.text"] || 'pwa.copiar.text';
        ProductCollectionDetailData.productSocialShare.txtWhatsapp = staticLabels && staticLabels["pwa.whatsapp.text"] || 'pwa.whatsapp.text';
        ProductCollectionDetailData.productSocialShare.pageUrl = pageUrl;

        ProductCollectionDetailData.information.title = productData["product.displayName"];
        ProductCollectionDetailData.information.productCode = productId;
        let slideImage = skuImages.length > 0 && skuImages.map((img, i) => <Image key={i} src={img.src} alt="collections products gallery" title="collections product item" />);
        return (
            <React.Fragment>
                <div className="o-product__collectionDescription__image">
                    <figure>
                        <div className="m-gallery">
                            <div className="m-carousel collections__product__gallery">

                                {/*Need to show image as gallery*/}
                                {/* {/*<Image src="https://ss101.liverpool.com.mx/xl/1035535281_2p.jpg" alt="collections products gallery" title="collections product item"/> */}
                                {skuImages.length > 0 ? <Slider {...ProductCollectionDetailData.settings}>
                                    {slideImage}
                                </Slider> :
                                    <Image src={Path.onImgError} alt="collections products gallery" title="collections product item" />}
                                {/* {
                                    isDesktop || (isIpad && (Math.abs(orientation) === 90 || Math.abs(window.orientation) === 90 || padWidth > padHeigth)) ?
                           
                                        :
                                        <Image src="https://ss101.liverpool.com.mx/xl/1035535_4p.jpg" alt="collections products gallery" title="collections product item" />
                                } */}
                            </div>
                        </div>
                    </figure>

                    <div id={`selectionIcon${productId}`} className={`m-product__selection  ${this.props.productSelectionStatus ? "selected" : ""} `}>
                        <i className="icon-done"> </i>
                    </div>
                </div>
                <div className="o-product__collectionDescription__detail">
                    <ProductInformationCollection {...this.props} ifSize={ifSize} productInfo={ProductCollectionDetailData.information} share={false} descriptionNeeded={false} />
                </div>
                <div className="o-product__collectionDescription__separator d-none d-lg-block"></div>
                <div className="o-product__collectionDescription__purchase">
                    <div className="container d-lg-block d-none o-product__purchase__info">
                        <div>
                            <ProductInfoCollection
                                ref={this[this.props.productId + "infocol"]} /*Added for Edd in collection add to cart*/
                                {...this.props}
                                check_product_sku_selection={check_product_sku_selection}
                                spanText=""
                                priceToShow={this.props.priceToShow}
                                gwpInfo={gwpInfo}
                                marketPlaceInfo="{this.props.marketPlaceInfo}"
                                giftRegistryInfo="{this.props.giftRegistryInfo}"
                                productDetails={this.props.mainContent}
                                pdpType="default"
                                qtyDropdownInfo={this.props.qtyDropdownInfo}
                                QtyLabel="a-product__paragraphQtyLabel m-0"
                                btnclass="a-btn a-btn--action"
                                ItrBtnText={staticLabels && staticLabels["pdpPage.ITR.DisplayInPDP.label"] || "pdpPage.ITR.DisplayInPDP.label"}
                                EdPreOrder=""
                                EdDateStore="Liverpool Santa Fe"
                                EdRange="14 de diciembre - 17 de diciembre"
                                edLabel={staticLabels && staticLabels["pdpPage.estimatedDeliveydate.label"] || "pdpPage.estimatedDeliveydate.label"}
                                btntext="BtnTxt"
                                productinfo="o-product__productInfo pb-lg-4"
                                aideproductinfo="o-product__productInfo pb-lg-4"
                                productEdd="row o-product__productEdd"
                                productItr="row o-product__productItr"
                                selectButton={true}
                                collectionProductId={productId}
                                productSelection={this.props.productSelection}
                                isMarketPlace={isMarketPlace}
                                EDD_Eligibility={EDD_Eligibility}
                                ITR_Eligibility={ITR_Eligibility}
                                information={ProductCollectionDetailData.information}
                                staticLabels={staticLabels} /*changes made for Pdp staticlabel issue -- addedd s to staticlabel */
                                flags={this.props.fullFlags}
                                productType={productData["productType"]}
                                fullCollectionData={this.props.fullCollectionData}
                                qtyModalInfo={this.props.qtyModalInfo}

                            />
                        </div>
                        {/* <ProductInfo /> from Oranism  :: Or :: include  ../ProductPdp/organism-pdp-product-info.pug */}
                    </div>
                    <div className="container d-lg-none o-product__selection p-0">
                        <Button className="a-btn a-btn--tertiary ripple" data-toggle="modal" data-target="#select-product-modal">Seleccionar</Button>
                    </div>
                    <div className="container d-lg-none o-product__selected p-0">
                        {this.props.productSelectionStatus ? <div className="o-product__selected__details">
                            <div className="m-product__selected__details__color">
                                {/*changes for color image implementation -- start*/}
                                {this.props.colorImage != "" ? <Link className={this.props.anchor} href="#" data-name="color0" >
                                    <Image src={this.props.colorImage} nonClickable="true" showLoader="true" className="maccolorsh" />
                                </Link> : this.props.colorStyle && this.props.colorStyle != "" ? <div className="m-product__selected__color__selected">
                                    <div className="color " style={{ background: this.props.colorStyle }}></div>
                                </div> : null}
                                {/*changes for color image implementation -- end*/}
                                <Paragraph className="a-product__selected__color__selected">{this.props.colorText}</Paragraph>
                            </div>
                            <div className="m-product__selected__details__quantity">
                                <Label className="a-product__selected__quantity">{`Cant: ${this.props.qtyDropdownInfo.pdpQty}`}</Label>
                            </div>
                        </div> : null}
                        <parentContext.Consumer>
                            {({ OpenModal, updateCollectionMobileData }) => (
                                <Button id={productId} className={`a-btn ${this.props.productSelectionStatus ? "a-btn--secondary" : "a-btn--tertiary"} ripple`} onClick={(e) => { if (e.currentTarget.innerHTML == "Eliminar") { this.props.productDeSelection({ productId: e.currentTarget.id }) } else { OpenModal("selectProductModal"); updateCollectionMobileData(this.props) } }}>{this.props.productSelectionStatus ? "Eliminar" : "Seleccionar"}</Button>
                            )}
                        </parentContext.Consumer>
                    </div>
                </div>
                <parentContext.Consumer>
                    {({ showModal, SelectedModelData, closeModal, OpenModal }) => (
                        <Modal modalDetails={ProductCollectionDetailData.modalProductSocialShare} showModalpopUp={"showModal10"} >
                            <ProductSocialShareModal {...this.props} staticLabels={staticLabels} productSocialShare={ProductCollectionDetailData.productSocialShare} OpenModal={OpenModal} ModalpopUp={"showModal10"} closeModal={closeModal} />
                        </Modal>
                    )}
                </parentContext.Consumer>
                <parentContext.Consumer>
                    {({ showModal, SelectedModelData }) => (showModal.showModal12 === true ? <Modal modalDetails={ProductCollectionDetailData.modalProductSocialEmail} showModalpopUp={"showModal12"}>
                        <ProductSocialEmail ModalpopUp={"showModal12"} productSocialEmailData={SelectedModelData} staticLabels={staticLabels} />
                    </Modal> : null
                    )}
                </parentContext.Consumer>
            </React.Fragment>
        );
    }

}