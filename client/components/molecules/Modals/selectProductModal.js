import React from 'react';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import EventListener from 'react-event-listener';
import { Path } from '../../../helpers/config/config';
import { Utility, logError, UserAgentDetails, logDebug } from '../../../helpers/utilities/utility'; /*added logdebug and logerror for 23505 */
import ModalHeader from './ModalHeader';
import ProductInformationCollection from '../../organisms/ProductInformation/ProductInformationCollection';
import ProductInfoCollection from '../../organisms/ProductPdp/ProductInfoCollection';
import ProductSpecs from '../../organisms/ProductSpecs/ProductSpecs';
import CarouselPdp from '../../organisms/Carousel/CarouselPdp';
import Alerts from '../../molecules/Alert/Alert';
import { parentContext } from '../../../contexts/parentContext';

export default class extends React.Component {
    constructor(props) {
        super(props)
        // changes for 23505 starts
        const varientColorMap = get(props, 'productData.productVarientsInfo.colorMap.size', {});
        const varientColors = get(props, 'productData.productVarientsInfo.colorMap.color', {});
        const defaultSkuId = get(props, 'productData.productVarientsInfo.defaultSkuId', {});
        let productSizeIdVal = '';
        let productSizeIdValTmp = '';
        const varientSizeArr = Object.keys(varientColorMap);
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
            activeColorIndex: 0,
            activeSizeIndex: null,
            productSizeName: '',
            colorStyle: '',
            colorImage: '', /*changes for color image implementation */
            anySizeSelected: false,
            materials: [],
            textures: [],
            productSizeId: productSizeIdVal, /*changed for 23505 */  // (props.mainContent.productVarientsInfo && props.mainContent.productVarientsInfo.skuAttributeMap) ? Object.keys(props.mainContent.productVarientsInfo.skuAttributeMap)[0] : {},
            endecaProductRecord: this.props.mainContent.endecaProductInfo ? this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {},
            selectedMaterial: null,
            selectedTexture: null,
            finalPrices: {},
            uniqueColorList: {},
            productSelectionStatus: false,
            window: '',
            imageBreakFlag: false,
            limited_Pieces: '0',
            hoverColorText: '',
            sizeRecords: props.mainContent.productVarientsInfo || {},
            alert_Type: "alert", alertToTopSticky: '', alertToTop: '', alert_message: "", alert_status: false,
            resetQty: "1"
        }

        this.myContent = React.createRef();
        this.document = document.getElementById("select-product-modal");
    }

    componentDidMount() {

        let colorList = this.props.productData && this.props.productData.productVarientsInfo && this.props.productData.productVarientsInfo.colorMap && this.props.productData.productVarientsInfo.colorMap.color || {};
        const uniqueColorList = this.getHexaColorCodeByColorName('', colorList)
        //const uniqueColorList = this.get_UniqueColorList('', getHexaColorCodeFromColorMap);
        const windowObj = window || {};
        this.Limited_pieces_skus();
        document.body.addEventListener('click', this.closeQtyDropdown);

        this.setState({ uniqueColorList, colorText: Object.keys(colorList)[0], window: windowObj, colorStyle: Object.values(uniqueColorList)[0] }, () => {
            //this.getVariantsByColor('', Object.keys(colorList)[0], 0);
            let variantsData = { "colorMap": get(this.props.productData, 'productVarientsInfo.colorMap', {}) };
            let responseData = { variantsData };
            this.forColorAndSize(responseData, { e: '', val: Object.keys(colorList)[0], index: 0 });
        })
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.deslectionFromSticky != undefined && nextProps.deslectionFromSticky.productId == this.props.id) {
            this.setState({ productSelectionStatus: false, pdpQty: 0 })
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
    Limited_pieces_skus = () => {

        let objectres = {};
        const productId = this.props.productId;
        let getqty = 0;


        Utility(Path.limitedPiecesSkus, 'GET').then(response => {
            if (response.status === 200) {
                !isEmpty(response) && map(response.data, (item, i) => {
                    objectres[item.sku] = item.piezas;
                });
                getqty = objectres[productId] || "0";
                this.setState({ pdpQty: getqty.toString(), limited_Pieces: getqty })
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });
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

                this.show_alert(validationText, "alert", true);
            } else {
                resolve()
            }
        });
        return promise;

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
                this.show_alert(validationText, "alert", true);
            } else {
                resolve()
            }
        });
        return promise;
    }



    set_postal_zip_code = (postalZipCode) => {
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
        } catch (e) { logError(e); }
    }
    onSelectDropdownQty = (qty) => {
        if (!this.limitedqty(qty)) { return false; }
        else {
            this.validate_sku_selection().then(() => {
                if (qty === '6+' && this.state.pdpQty !== '') {
                    this.setState({ resetQty: "1", pdpQty: '' });
                    const qtyInput = document.getElementById('a-ProductQty__inputDesktop');
                    qtyInput && qtyInput.focus();
                } else if (qty !== '' && qty !== this.state.pdpQty) {
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
                    //this.getImage(this.props.productData)
                    let selectedProductDetails = { "productName": this.props.productData && this.props.productData["product.displayName"], "productId": this.props.productId, "quantity": qty, "selectedSkuColor": this.state.colorStyle, colorImage: this.state.colorImage, productImg: this.getImage(this.props.productData), addressId, selectedState, storeNumber, postalZipCode } /*changes for color image implementation , Added for Edd in collection add to cart */
                    this.setState({ resetQty: "1", pdpQty: qty, productSelectionStatus: qty > 0 ? true : false });
                    // if (window.screen.width >= 990) {
                    this.props.productSelection(selectedProductDetails)
                    //}

                }
                this.setState({ showQtyDropdown: false });
            })
        }
    }
    getImage = (productData) => {
        const skuImageMap = productData.akamaiSkuImagesInfo && productData.akamaiSkuImagesInfo.skuImageMap || {};
        //const skuImageMap = contentsRecords && contentsRecords.akamaiSkuImagesInfo && contentsRecords.akamaiSkuImagesInfo.skuImageMap || {};
        let stickyThumbImg = skuImageMap && skuImageMap[this.state.productSizeId + '_th'] || ''; /*changes for color image implementation */
        if (stickyThumbImg === '') {
            const defaultSkuId = productData.productVarientsInfo.defaultSkuId || '';
            stickyThumbImg = skuImageMap && skuImageMap[defaultSkuId + '_th'] || '';
        }
        return stickyThumbImg
    }
    onSelectModalQty = (qty) => {

        if (!this.limitedqty(qty)) { return false; }
        else {
            qty = qty.toString();
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

        qty = qty.toString();
        if (qty.length <= 3) {
            this.setState({ resetQty: "1", pdpQty: qty, productSelectionStatus: qty > 0 && src != undefined && src != "" ? true : false });
            const { productSizeId, selectedStoreStateId, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType } = this.state;

            let productType = this.props.productData && this.props.productData.productType && this.props.productData.productType[0] || "";
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
            //let selectedProductDetails = { src: src, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": this.props.productId, "quantity": qty, "selectedSkuColor": this.state.colorStyle, productImg: this.getImage(this.props.productData) }
            let selectedProductDetails = { src: src, "productName": this.props.productData && this.props.productData["product.displayName"], "productId": this.props.productId, "quantity": qty, "selectedSkuColor": this.state.colorStyle, colorImage: this.state.colorImage, productImg: this.getImage(this.props.productData), productSizeId, productType, pdpQty: qty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, qty: qty, colorCode: this.state.colorStyle, colorText: this.state.colorText, addressId, selectedState, storeNumber, postalZipCode }  /*changes for color image implementation , Added for Edd in collection add to cart */

            //if (window.screen.width >= 990) {
            this.props.productSelection(selectedProductDetails)
            //}
        }
        else {
            //this.props.show_alert("only three digits allowed")
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

    getVariantsByColor = (e, val, index, hexaColorCode, colorId) => {

        const { productSizeId, colorText, endecaProductRecord } = this.state;
        const { productId } = this.props;
        let colorList = this.props.productData && this.props.productData.productVarientsInfo && this.props.productData.productVarientsInfo.colorMap && this.props.productData.productVarientsInfo.colorMap.color && Object.keys(this.props.productData.productVarientsInfo.colorMap.color) || [];


        if (colorText !== val) {
            if (e != "") {
                /*changes for color image implementation - start*/
                let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
                const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
                let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {}
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
                let selectedProductDetails = { "productName": this.props.productData && this.props.productData["product.displayName"], "productId": productId, "quantity": this.state.pdpQty, "selectedSkuColor": hexaColorCode, colorImage: this.getColorImage(val, colorList), productImg: this.getImage(this.props.productData), addressId, selectedState, storeNumber, postalZipCode } /*Added for Edd in collection add to cart */
                /*changes for color image implementation - end */
                this.props.productDeSelection(selectedProductDetails)
            }
            let query = "?variantType=" + 'color' + "&variantValue=" + val + "&productId=" + productId;
            Utility(Path.getVariants + query, 'GET' /*, {
                "variantType": 'color',
                "variantValue": val,
                "productId": productId
            }*/).then(response => {

                let responseData = response.data;
                this.forColorAndSize(responseData, { e, val, index, hexaColorCode, colorId }); /*added for bug fix 23505 start */
                /*commented for bug fix 23505 start */
                // let finalSortedSize = this.get_FinalSortedSize({ sizeApiRecord: responseData });
                // if ((!finalSortedSize || finalSortedSize.length === 0) && this.state.sizeRecords.colorMap && this.state.sizeRecords.colorMap.color
                //     && this.state.sizeRecords.colorMap.color[val]) {

                //     var temp = this.state.sizeRecords.colorMap.color[val].split("|");
                //     let selectedSku = temp[temp.length - 1];
                //     //calling swogo bundle reload function soon after the size selection
                //     if (window && window.swogoBundles) {
                //         window.swogoBundles.reload();
                //     }
                // } else {
                // }
                // this.setState({
                //     sizeApiRecord: responseData,
                //     finalSortedSize,
                //     colorText: val,
                //     activeColorIndex: index,
                //     activeSizeIndex: null,
                //     productSizeName: "", //finalSortedSize.length && finalSortedSize[0].size,
                //     anySizeSelected: false,
                //     pdpQty: 0,
                //     productSelectionStatus: false,
                //     productSizeId: colorId === undefined ? productSizeId : colorId,
                //     colorStyle: hexaColorCode ? hexaColorCode : Object.values(this.getHexaColorCodeByColorName(val, colorList))
                // }, () => {
                //     let enabledSortedSize = [];
                //     enabledSortedSize = finalSortedSize && finalSortedSize.length > 0 && finalSortedSize.filter(size => {
                //         if (size.disable === false) {
                //             return size;
                //         }
                //     });

                //     if (enabledSortedSize.length === 1) {
                //         let index = 0;
                //         for (var i in finalSortedSize) {
                //             if (enabledSortedSize[0].sizeid === finalSortedSize[i].sizeid) {
                //                 index = i;
                //                 break;
                //             }
                //         }
                //         this.getMaterialsBySize(index, enabledSortedSize[0], this.state.productSizeId)
                //     }
                // })
                /*commented for bug fix 23505 end */
            });
        }
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
    /*changes for color image implementation - end*/
    forColorAndSize = (responseData, { e, val, index, hexaColorCode, colorId }) => {
        const { productSizeId, productId, colorText, endecaProductRecord } = this.state;
        let contentsRecords = this.state.hybridPdpData ? this.state.hybridPdpData.mainContent : this.props.mainContent;
        const productVarientsInfo = contentsRecords && contentsRecords.productVarientsInfo || {};
        let colorList = productVarientsInfo && productVarientsInfo.colorMap && productVarientsInfo.colorMap.color || {};

        let finalSortedSize = this.get_FinalSortedSize({ sizeApiRecord: responseData });
        let selectedSku = colorId;
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
                materials
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
                textures
            });
        }
    }
    get_UniqueColorList = (props) => {

        let colorList = this.getHexaColorCodeByColorName('', props);
        let uniqueColorList = uniq(colorList)
        return uniqueColorList;
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
    productSelection = (src) => {

        let productType = this.props.productData && this.props.productData.productType && this.props.productData.productType[0] || "";
        const { productSizeId, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType } = this.state;
        let productId = this.props.productId || ""
        let selectedDetails = { src: src, qty: this.state.pdpQty, colorCode: this.state.colorStyle, colorText: this.state.colorText, productSizeId, productType, productId, pdpQty, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType }
        //this.setState({ productSelectionStatus: true })
        this.props.productSelection(selectedDetails)
    }
    productDeSelection = () => {

        this.setState({ productSelectionStatus: false })
    }
    imageBreak = () => {
        this.setState({
            imageBreakFlag: true
        })
    }
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
    onColorHover = (hoveredColor) => {

        this.setState({ hoverColorText: hoveredColor })
    }
    setSelectedAddressInfo = (selectedAddressInfo) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode: '', selectedAddressInfo })
    }
    show_alert = (alert_message, alert_Type = "alert", alertTimeOut) => {

        this.setState({ alert_status: true, alert_message, alert_Type, alertToTop: '-toTop' });
        if (alert_Type.toString().toLowerCase() == "success" || alertTimeOut) {
            setTimeout(() => {
                this.setState({ alert_status: false });
            }, 4000)
        }
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }
    handleScrollAlert = () => {

        try {
            if (window.scrollY >= 330) {
                this.setState({
                    alertToTopSticky: '-toTopSticky',
                    alertToTop: ''
                });
            }
            else if (window.scrollY >= 117) {
                this.setState({ alertToTopSticky: '', alertToTop: '-toTop' });
            }
            else {
                this.setState({ alertToTopSticky: '', alertToTop: '' });
            }
        } catch (e) { }
    }
    // changes for image changes on color selection start, fixes for 23707 added gl and th images  -- start
    getSelectedSkuImages = (collectionData, ProductId, Skuid) => {

        let selectedSkuData = collectionData || {}
        let productImages = selectedSkuData && !isEmpty(selectedSkuData) && selectedSkuData.akamaiSkuImagesInfo && selectedSkuData.akamaiSkuImagesInfo.skuImageMap || {}
        let imageArray = [];
        let sortedImages = this.sortingImage(productImages, Skuid);  /* added for 23682 */
        //console.log("sortedImages in mobile", sortedImages)
        for (let imag in sortedImages) {  /* modified for 23682 */
            //
            imag.match(Skuid + "_th") || imag.match(Skuid + "_gl") ? imageArray.push(sortedImages[imag]) : ""  /* modified for 23682 */
        }
        // productImages.filter((imag) => Object.keys(imag) == Skuid +"gl")

        let thumbnailImage = !isEmpty(imageArray) && imageArray || [] // this.dynamicUrl(productImages, Skuid);

        if (thumbnailImage.length == 0) {
            let defaultSkuID = selectedSkuData && selectedSkuData.productVarientsInfo && selectedSkuData.productVarientsInfo.defaultSkuId
            let imageArray = [];
            for (let imag in productImages) {
                //
                imag == defaultSkuID + "_th" || defaultSkuID + "_gl" ? imageArray.push(productImages[imag]) : ""
            }
            thumbnailImage = !isEmpty(imageArray) && imageArray || [] // && this.dynamicUrl(productImages, defaultSkuID);
        }

        /*fixes for 23707 added gl and th images  -- start */
        return thumbnailImage
    }

    // changes for image changes on color selection End
    /* added for 23682 - start */
    sortingImage = (carouselRecords, productId) => {
        //console.log("carousalRecord", carouselRecords)
        let glrecords = Object.keys(carouselRecords).filter(imagekey => imagekey.match("gl")).map(eachglimages => eachglimages.split("_")[2]).sort((a, b) => a - b)
        let orderedImage = {};
        for (let image in carouselRecords) {
            if (image.match(productId + '_th')) { orderedImage[image] = carouselRecords[image] }
        }
        glrecords.map(eachsortorder => { for (let image in carouselRecords) { if (image.match(productId + '_gl') && image.split("_")[1] == "gl" && image.split("_")[2] == eachsortorder) { orderedImage[image] = carouselRecords[image] } } })

        //console.log("orderedImage", orderedImage);
        return orderedImage
    }
    /* added for 23682 - end */
    render() {

        const { productData = {}, productId = "", check_product_sku_selection, mainProductData, productSizeId, isMarketPlace, EDD_Eligibility, ITR_Eligibility, staticLabels, skuImages } = this.props;
        // const staticLabels = staticLabels && staticLabels.staticLabelValues && staticLabels.staticLabelValues[0] && staticLabels.staticLabelValues[0].keyValues /*changes made for Pdp staticlabel issue --  commented */

        const modalHeader = {
            title: staticLabels && staticLabels["Pwa.pdp.collection.article.modal.header.label"] || "Pwa.pdp.collection.article.modal.header.label",
            titleType: 'h4',
            headlineAttributes: { "id": "select-product-modal" },
            close: true,
            buttonClass: 'close a-eddBox__closeButton',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            requireArrow: false
        };

        const productImage = get(this.props, 'modalProductDetails.productImage', '');
        const imgDetails = {
            imgAlt: 'PDP Demo',
            imgTitle: 'Tenis Under Armour Showstopper 2.0 entrenamiento para caballero',
            imgSrc: productImage
        };
        const gwpInfo = {
            gwpData: get(productData, 'productVarientsInfo.gwpPromotions', {}),
            onSelectGiftItem: this.onSelectGiftItem,
            activeGiftItemIndex: this.state.activeGiftItemIndex
        };
        let giftRegistryInfo = {};
        let information = {
            title: productData["product.displayName"],
            productCode: productId,
            ratings: 'true',
            price: 'true',
            offerPrice: 'single',
            downloadable: 'false',
            colors: 'true',
            sizes: 'true',
            descTitle: 'false',
            description: 'false',
            moreInfo: 'false',
            share: 'false',
            headlineTitle: 'h2',
            modals: true,
            typePage: "pdp-collection"
        };
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
        const pageUrl = get(this.state.window, 'document.location.href', '');
        const productSocialEmailData = {
            productDescription: get(productData, 'product.longDescription[0]', ''),
            productId: get(productData, 'productId[0]', ''),
            skuLargeImage: (productData["sku.largeImage"] && productData["sku.largeImage"][0]) || '',
            pageUrl
        };
        const { isDesktop, isMobile, isIpad } = UserAgentDetails(this.state.window);

        let promotionInfo = {};
        if (isMarketPlace === "true") {
            promotionInfo.lpPromotions = get(alloffers, 'skuOffers.liverpoolPromotions');
            promotionInfo.otherPromotions = get(alloffers, 'skuOffers.otherPromotions');
        } else {
            promotionInfo.lpPromotions = get(productData, 'lpPromotions_pwa');
            promotionInfo.otherPromotions = get(productData, 'otherPromotions_pwa');
        }
        const getModalDatas = (productData, staticLabels) => {
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
                    txtFacebook: staticLabels && staticLabels["pwa.facebook.text"] || 'pwa.facebook.text',
                    txtTwitter: staticLabels && staticLabels["pwa.twitter.text"] || 'pwa.twitter.text',
                    txtEmail: staticLabels && staticLabels["pwa.email.text"] || 'pwa.email.text',
                    txtCopy: staticLabels && staticLabels["pwa.copiar.text"] || 'pwa.copiar.text',
                    txtWhatsapp: staticLabels && staticLabels["pwa.whatsapp.text"] || 'pwa.whatsapp.text',
                    pageUrl
                }
            }
        }
        const modalDatas = getModalDatas(productData, staticLabels);
        // changes for image changes on color selection start
        let skuImagesArr = this.getSelectedSkuImages(productData, productId, this.state.productSizeId) || []
        const carouselRecords = skuImagesArr.length > 0 && skuImagesArr.map(image => image) || [Path.onImgError]
        // changes for image changes on color selection start

        const { alert_status, alert_message, alert_Type } = this.state;
        const alert = {
            type: '-alert',
            text: alert_message,
            pClass: 'a-alert__text',
            iconType: 'a-alert__icon icon-error'
        };

        const success = {
            type: '-success',
            text: 'Se ha copiado el link del artículo',
            pClass: 'a-alert__text',
            iconType: 'a-alert__icon icon-done'
        };
        let alertType = alert_Type == "success" ? success : alert

        let ifSize = productData && !isEmpty(productData) && productData["sku.size"] || "";
        let ifDimension = productData && !isEmpty(productData) && productData["sku.dimensions"] || "";

        return (
            <React.Fragment>
                <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
                <div className="modal-body" onScroll={this.handleScrollAlert}>
                    <section className="o-product__detail">
                        <div className="container o-product__mainContainer">
                            <main>
                                <Alerts fromPDP="true" iconType={alertType.iconType} options={alert_Type == "success" ? success : alert} alertTopClass={`-alert__container mdc-snackbar ${alertType.type}  ${this.state.alertToTop} ${this.state.alertToTopSticky} `} text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                                <parentContext.Consumer>
                                    {({  closeAllModals  }) => (
                                        <CarouselPdp productSizeId={this.state.productSizeId} imageBreak={this.imageBreak} carouselRecords={carouselRecords} productId={productId} isCollection={true} closeAllModals={closeAllModals} />
                                    )}
                                </parentContext.Consumer>
                                <div className="o-product__description">
                                    <ProductInformationCollection qtyDropdownInfo={qtyDropdownInfo}
                                        priceToShow={this.props.priceToShow}
                                        productData={productData}
                                        productId={productId}
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
                                        staticLabels={staticLabels} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
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
                                        skuImages={skuImages}
                                        share={false}
                                        onColorHover={this.onColorHover}
                                        hoverColorText={this.state.hoverColorText}
                                        productDeSelection={this.productDeSelection} productInfo={information}
                                        descriptionNeeded={true}
                                        ifSize={ifSize}
                                    />
                                </div>

                            </main>
                            <div className="a-product__separator"></div>
                            <ProductInfoCollection
                                {...this.props}
                                check_product_sku_selection={this.check_product_sku_selection}
                                spanText=""
                                priceToShow={this.props.priceToShow}
                                gwpInfo={gwpInfo}
                                marketPlaceInfo="{this.props.marketPlaceInfo}"
                                giftRegistryInfo="{this.props.giftRegistryInfo}"
                                productDetails={this.props.mainContent}
                                pdpType="default"
                                qtyDropdownInfo={qtyDropdownInfo}
                                qtyModalInfo={this.onSelectModalQty}
                                QtyLabel="a-product__paragraphQtyLabel m-0"
                                btnclass="a-btn a-btn--action"
                                ItrBtnText={staticLabels && staticLabels["pdpPage.ITR.DisplayInPDP.label"] || "Ver disponibilidad en tienda"}
                                EdPreOrder=""
                                EdDateStore="Liverpool Santa Fe"
                                EdRange="14 de diciembre - 17 de diciembre"
                                edLabel={staticLabels && staticLabels["pdpPage.estimatedDeliveydate.label"] || "Fecha estimada de entrega:"}
                                btntext="BtnTxt"
                                productinfo="o-product__productInfo pb-lg-4"
                                aideproductinfo="o-product__productInfo pb-lg-4"
                                productEdd="row o-product__productEdd"
                                productItr="row o-product__productItr"
                                selectButton={true}
                                collectionProductId={productId}
                                productSelection={this.productSelection}
                                isMarketPlace={isMarketPlace}
                                EDD_Eligibility={EDD_Eligibility}
                                ITR_Eligibility={ITR_Eligibility}
                                isModal={true}
                                limited={this.state.limited_Pieces}
                                information={information}
                                staticLabels={staticLabels} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                                productType={productData["productType"]}
                                setSelectedAddressInfo={this.setSelectedAddressInfo}
                                validate_sku_selection={this.validate_sku_selection}
                                forcePadding={true}
                            />
                        </div>

                    </section>
                    <section className=" pt-lg-5 pb-lg-5 o-product__various">
                        <div className="container-fluid">
                            <div className="container p-0 pt-4 pb-4">
                                <div className="row">
                                    <div className="col-12 pr-lg-3 pl-lg-3">
                                        <ProductSpecs isFromCollectionPage={true} forcePadding={true} share={false} mainContent={productData} productSocialEmailData={productSocialEmailData} isMobile={isMobile} isIpad={isIpad} promotionInfo={promotionInfo} modalDatas={modalDatas} productSizeId={this.state.productSizeId} imageBreakFlag={this.state.imageBreakFlag} staticLabels={staticLabels} show_alert={this.show_alert} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                                            padWidth={(this.state.window && typeof this.state.window !== 'string') ? this.state.window.innerWidth : 0} padHeigth={(this.state.window && typeof this.state.window !== 'string') ? this.state.window.innerHeight : 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </React.Fragment>
        );
    }
}