import React, { Component, Fragment } from 'react';
import dynamic from 'next/dynamic';
import Alerts from '../../molecules/Alert/Alert';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { Container } from '../../organisms/Container/Container';
import StickyBarCollections from '../../organisms/StickyBar/StickyBarCollections';
import CollectionProducts from '../../organisms/CollectionProducts/CollectionProducts';
import ProductPurchase from '../../organisms/ProductPurchase/ProductPurchase';
import PdpProductDetailCollection from '../../organisms/ProductPdp/PdpProductDetailCollection';
import { Path } from '../../../helpers/config/config';

import { Utility, GetPrice, UserAgentDetails, GTMallPages } from '../../../helpers/utilities/utility';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import TechnicalSeo from '../../organisms/technicalseo/TechnicalSeo';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import SelectProductModal from '../../molecules/Modals/selectProductModal';
import Carousel from '../../organisms/Carousel/Carousel';
import NoProducts from '../../organisms/ErrorContainer/NoProducts';
import { CollectionData } from '../../templates/Pdp/staticConstant';
import Router from 'next/router';

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = { imageBreakFlag: false, openSticky: false, alert_Type: "alert", orientation: 0, alertToTopSticky: '', alertToTop: '', addedProductDetails: [], alert_message: "", alert_status: false, carouselsData: {}, chanelBrandCss: 'NA', breadcrumbData: this.props.mainContent && this.props.mainContent.breadcrumbData || {}, selectedProductPrice: 0 }
    this.selectedProducts = [];
    this.Window = "";
    let staticLabelCommon = get(props, 'mainContent.staticLabels.staticLabelValues', {}); /*changes made for Pdp staticlabel issue */
    this.devices = "";

    /*changes made for Pdp staticlabel issue start */
    this.StaticLabels = {};
    if (staticLabelCommon && !isEmpty(staticLabelCommon)) {
      for (let k in staticLabelCommon) {
        if (staticLabelCommon[k].pageName === 'PWA-PDP-PAGE') {
          this.StaticLabels = staticLabelCommon[k].keyValues;
        }
      }
    }
    /*changes made for Pdp staticlabel issue end */
  }


  componentDidMount() {

    this.devices = UserAgentDetails(window);
    window.addEventListener('scroll', this.handleScroll);
    // window.addEventListener('resize', this.onOrientationChange);

    this.getPdpDynamicContent();
    this.setState({
      chanelBrandCss: this.getchanelBrandCss()
    })
    this.Window = window;
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
  imageBreak() {
    this.setState({
      imageBreakFlag: true
    })
  }
  replaceBrandCssConfig(brandCssConfig) {
    let everyPageStatic = null;
    const staticLabelsArray = this.props.mainContent.staticLabels ? this.props.mainContent.staticLabels.staticLabelValues : null;
    if (staticLabelsArray) {
      staticLabelsArray.map(page => {
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
  show_alert = (alert_message, alert_Type = "alert") => {
    this.setState({ alert_status: true, alert_message, alert_Type });
    if (alert_Type.toString().toLowerCase() == "success") {
      setTimeout(() => {
        this.setState({ alert_status: false });
      }, 3000) /*modified for 22419 */
    }
  }
  dismiss_alert = () => {
    this.setState({ alert_status: false })
  }
  handleScroll = (event) => {
    let orientation = window.orientation;
    let padHeigth = window.innerHeight;
    let padWidth = window.innerWidth;

    const { isDesktop, isMobile, isIpad } = UserAgentDetails(window);

    if (isDesktop || (isIpad && (Math.abs(orientation) === 90 || Math.abs(window.orientation) === 90 || padWidth > padHeigth))) {
      if (window.scrollY >= 330) {
        if (this.state.openSticky != true) {
          this.setState({
            openSticky: true,
            alertToTopSticky: '-toTopSticky',
            alertToTop: ''
          });
        }
      }
      else {
        if (this.state.openSticky != false) {
          this.setState({ openSticky: false, alertToTopSticky: '', alertToTop: window.scrollY >= 117 ? '-toTop' : '' });
        }
        else {
          this.setState({ alertToTopSticky: '', alertToTop: window.scrollY >= 117 ? '-toTop' : '' });
        }
      }
    }
    else {
      if (this.state.alertToTop == "") {
        this.setState({ alertToTopSticky: '', alertToTop: '-toTop' });
      }
    }
  }
  productSelection = (selectedData) => {

    this.state.productDeselectionFrmSticky = ""

    if (this.selectedProducts.length > 0) {
      let productExists = this.selectedProducts.filter(product => product.productId == selectedData.productId)

      if (productExists.length > 0) {
        if (selectedData && selectedData.quantity != 0 && selectedData.quantity != "" && selectedData.quantity != undefined) {

          this.selectedProducts.map(eachProduct => {

            if (eachProduct.productId == selectedData.productId) {
              eachProduct.selectedSkuColor = selectedData.selectedSkuColor
              eachProduct.quantity = selectedData.quantity
              eachProduct.img = selectedData.productImg
            }
          })
        }
        else {
          let selectedProductPrice = this.state.selectedProductPrice;
          if (this.selectedProducts.length > 0) {

            this.selectedProducts.map((eachProduct, index) => {
              if (eachProduct.productId == selectedData.productId) {
                var price = parseFloat(eachProduct.priceToShow.discount.val.replace(",", "") + "." + eachProduct.priceToShow.discount.decimal).toFixed(2)
                let indvidualProductPrice = (price * Number(eachProduct.quantity)).toFixed(2);
                selectedProductPrice = (Number(selectedProductPrice) - Number(indvidualProductPrice)).toFixed(2);
                this.selectedProducts.splice(index, 1);
              }
            })
          }
        }
      }
      else {
        //if (selectedData.src && selectedData.src != "") {
        this.selectedProducts.push(selectedData)
        //}
      }
    }
    else {
      // if (selectedData.src && selectedData.src != "") {
      if (selectedData && selectedData.quantity != 0 && selectedData.quantity != "" && selectedData.quantity != undefined) {

        this.selectedProducts.push(selectedData)
      }
      // }

    }
    let selectedProductPrice = 0;
    this.selectedProducts.map(eachProduct => {

      var price = parseFloat(eachProduct.priceToShow.discount.val.replace(",", "") + "." + eachProduct.priceToShow.discount.decimal).toFixed(2)
      let indvidualProductPrice = (price * Number(eachProduct.quantity)).toFixed(2)

      selectedProductPrice = (Number(selectedProductPrice) + Number(indvidualProductPrice)).toFixed(2);
    })
    this.setState({ selectedProductPrice, addedProductDetails: this.selectedProducts, selectedData: this.selectedProducts })
  }

  productDeSelection = (deselectingData) => {
    let selectedProductPrice = this.state.selectedProductPrice;
    if (deselectingData == "removeAll") {
      this.selectedProducts = [];
      selectedProductPrice = "";
    }
    else {
      if (this.selectedProducts.length > 0) {

        this.selectedProducts.map((eachProduct, index) => {
          if (eachProduct.productId == deselectingData.productId) {
            var price = parseFloat(eachProduct.priceToShow.discount.val.replace(",", "") + "." + eachProduct.priceToShow.discount.decimal).toFixed(2)
            let indvidualProductPrice = (price * Number(eachProduct.quantity)).toFixed(2);
            selectedProductPrice = (Number(selectedProductPrice) - Number(indvidualProductPrice)).toFixed(2);
            this.selectedProducts.splice(index, 1);
          }
        })
      }
    }

    this.setState({ selectedProductPrice, addedProductDetails: this.selectedProducts, productDeselectionFrmSticky: deselectingData })
  }
  selectedProductCount = (selectedProductCount) => {
    let giftProduts = selectedProductCount.filter(product => product.GWPSelectedProductId != "").map(eachProduct => eachProduct.GWPSelectedProductId)
    let giftCount = giftProduts.length
    return giftCount
  }
  addMultipleItemToCart = (swogo, callback, eventName) => {
    let payload = null;

    if (swogo) {

      payload = swogo;
      const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
      var arraySwogo = []
      var objProduct = {};
      if (swogo && swogo.products && typeof swogo.products !== 'undefined' && enableGtmFlag) {
        for (var i = 0; i < swogo.products.productList.length; i++) {
          objProduct = {};
          objProduct.name = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].displayName ? swogo.products.productList[i].displayName : '';
          objProduct.id = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].productId ? swogo.products.productList[i].productId : ''; //Generic SKU
          if (objProduct.id === 'SWOGO' && swogo.products && swogo.products.productList[i] && swogo.products.productList[i].catalogRefId) {
            objProduct.id = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].catalogRefId;
          }
          objProduct.category = ''; // NOT AVAILABLE
          objProduct.variant = 'N/A';
          objProduct.price = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].salePrice ? swogo.products.productList[i].salePrice : '';
          objProduct.brand = ''; // NOT AVAILABLE
          objProduct.quantity = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].quantity ? swogo.products.productList[i].quantity : '';
          objProduct.dimension27 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].size ? swogo.products.productList[i].size : '';
          objProduct.dimension28 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].color ? swogo.products.productList[i].color : ''; //CD 27 If doesn`t apply, the value must be empty “”
          objProduct.dimension36 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].sellerName ? swogo.products.productList[i].sellerName : ''; // CD 36
          objProduct.dimension40 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].sellerSkuId ? swogo.products.productList[i].sellerSkuId : ''; //CD 40
          objProduct.dimension41 = ''; // This variable has to contain the material of the product, if material product does not apply in the product, the value of this variable must be empty ‘’.
          objProduct.dimension42 = ''; // This variable has to contain the texture of the product, if texture product does not apply in the product, the value of this variable must be empty ‘’.
          objProduct.dimension43 = 'Y';
          objProduct.metric2 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].listPrice ? swogo.products.productList[i].listPrice : ''; //M2
          objProduct.metric3 = swogo.products && swogo.products.productList[i] && swogo.products.productList[i].salePrice ? swogo.products.productList[i].salePrice : ''; //M3

          arraySwogo.push(objProduct);
        }
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
      if (this.selectedProducts.length > 0) {
        payload = this.createAddToCartPayload();
      }
    }

    let errorMessage = null;
    let cartresposedate = {};
    if (this.selectedProducts.length > 0) {
      let giftProductCount = this.selectedProductCount(this.selectedProducts)
      Utility(Path.addmultipleitemstoorder, 'POST', payload).then(response => {

        if (response.status === 200 && response.data && response.data.s === '0') {
          let addedItemCount = response.data.itemDetailsInfo.addedItemCount
          cartresposedate = response.data
          Utility(Path.mybagListCount, 'GET').then(response => {

            const res = response.data || {};
            if (response && response.data && response.data.s === '0') {

              if (response.data.quantity) {
                //response.data["cartHeaderDetails"] = cartresposedate.cartCount && cartresposedate.cartCount.cartHeaderDetails;
                response.data["fromPdpAddToCart"] = true;
                this.props.updateCartHeaderDetails(response.data);
                // this.productDeSelection("removeAll")
                if (eventName == "buyNow") {
                  Router.push("/tienda/cart", "/tienda/cart");
                }
              }
              
              const count = (addedItemCount && typeof addedItemCount === 'number') ? addedItemCount : 0;
              const warningMsg = get(cartresposedate, 'data.warning', '');
              let alertType = "success"
              let addToCartMessage = this.StaticLabels && this.selectedProducts.length <= 1 ? this.StaticLabels["PDPPage.AddToCart.SingleProduct.alert.Success"] || "PDPPage.AddToCart.SingleProduct.alert.Success" :
                this.StaticLabels["PDPPage.AddToCart.MultipleProducts.alert.Success"] || "PDPPage.AddToCart.MultipleProducts.alert.Success"
              if (warningMsg !== '') {
                addToCartMessage = warningMsg
                alertType = "warning"
              }
              if (count !== (this.selectedProducts.length + giftProductCount)) {
                addToCartMessage = "Incapaz de añadir " + (this.selectedProducts.length - count) + " cantidad de artículos al carrito debido a la falta de inventario u otros problemas de relación de productos";
              }
              this.productDeSelection("removeAll");
              this.show_alert(addToCartMessage, alertType)
              if (eventName == "buyNow") {
                Router.push("/tienda/cart", "/tienda/cart");
              }
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
            errorMessage = "Some error occured error = " + JSON.stringify(response.data.error) + " msg = " + JSON.stringify(response.data.message);
            if (callback) {
              callback(errorMessage, null);
            }
          }
        }
        
      }, (error) => {
        //console.log(error);
        errorMessage = JSON.stringify(error);
        if (callback) {
          callback(errorMessage, null);
        }
      });
    }
    else {
      this.show_alert("No hay artículos seleccionados", "alert")
    }
   
  }
  addItemToCart = (eventName) => {
    const payload = this.createAddToCartPayload();
    let cartresposedate = {};
    Utility(Path.addpdpitemtocart, 'POST', payload).then(response => {

      if (response.status === 200 && response.data && response.data.s === '0') {
        cartresposedate = response.data
        Utility(Path.mybagListCount, 'GET').then(response => {
          if (response.status === 200) {
            if (response && response.data && response.data.s === '0') {
              if (response.data.quantity) {
                //response.data["cartHeaderDetails"] = cartresposedate.cartCount.cartHeaderDetails;
                response.data["fromPdpAddToCart"] = true;
                this.props.updateCartHeaderDetails(response.data);
                if (eventName == "buyNow") {
                  Router.push("/tienda/cart", "/tienda/cart");
                }
              }
              this.show_alert("Agregaste un producto a tu bolsa", "success")
              const enableGtmFlag = (this.props.mainContent && this.props.mainContent.flags) ? this.props.mainContent.flags['gtmflag'] : true;
              if (enableGtmFlag) {
                this.onLoadPdpGtm('click', payload);
              }

            }
          }
          else {
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
        }

      }
    }, (error) => {
    });
  }
  createAddToCartPayload = () => {
    let opticPayload = {};
    let productList = [];

    this.selectedProducts.map((eachProduct) => {

      const { productSizeId, productType, productId, quantity, storeNumber, selectedStoreStateId, postalZipCode, selectedAddressInfo, hybridPdpData, opticData, GWPSelectedProductId, GWPSelectedAssociatedSkuId, GWPSelectedProductType, addressId, selectedState } = eachProduct; /*Added for Edd in collection add to cart */
      /*changes made for bug id 23445 -start */
      const subProductsData = this.props.mainContent && this.props.mainContent.productsInfo || {}
      const addeddProduct = productSizeId && !isEmpty(productSizeId) ? subProductsData[productSizeId] : subProductsData[productId]
      let isPresale = get(addeddProduct, 'isPresale[0]', "false");
      let specialSale = false;

      if (addeddProduct && addeddProduct.isSpecialSale && typeof addeddProduct.isSpecialSale !== 'undefined' && addeddProduct.isSpecialSale === 'true') {
        specialSale = true;
      }
      let specialItem = 'false';
      if (specialSale || isPresale === 'true') {
        specialItem = 'true';
      }
      /*changes made for bug id 23445 - end */
      let payload = {
        "productId": productId,
        "quantity": quantity,
        "catalogRefId": productSizeId && isEmpty(productSizeId) ? productId : productSizeId,
        "itemToGift": "false",
        "specailSaleItem": specialItem, /*changes made for bug id 23445 */
        "skipInventory": "false",
        productType
      }

      let isMarketPlace = get(this.props.mainContent, 'endecaProductInfo.contents[0].mainContent[0].record.isMarketPlace[0]', "false")
      if (isMarketPlace == "true") {
        const skuOffers = this.state.alloffers && this.state.alloffers.skuOffers && this.state.alloffers.skuOffers[0] || {};
        if (!isEmpty(skuOffers)) {
          const { bestSeller = '', sellerId, sellerSkuId, sellerOperatorId, offerId } = skuOffers;
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
        payload.stateId = selectedState; /*Added for Edd in collection add to cart */
      }
      /*Added for Edd in collection add to cart --  start*/
      if (!isEmpty(postalZipCode) && !isEmpty(addressId)) {
        payload.deliveryMethod = 'home';
        payload.zipCode = (postalZipCode || '');
        payload.eddZipCode = (postalZipCode || '');
        payload.addressId = (addressId || '');
      }
      /*Added for Edd in collection add to cart --  end*/

      payload.productId = productId;
      payload.productType = productType;

      if (GWPSelectedProductId !== '') {

        payload.giftSku = GWPSelectedAssociatedSkuId;
        payload.giftProductId = GWPSelectedProductId;
        payload.giftProductType = GWPSelectedProductType;

        payload.promotionalGiftMessage = "gwp.regaloExclusiveOnline.text";
      }

      if (this.props.mainContent.pdpType == "hybrid") {
        let hybridData = (hybridPdpData == "" || hybridPdpData == undefined) ? this.props : hybridPdpData;

        payload["catalogRefIds"] = hybridData && hybridData.mainContent && hybridData.mainContent.endecaProductInfo && hybridData.mainContent.endecaProductInfo.contents && hybridData.mainContent.endecaProductInfo.contents[0] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes["sku.repositoryId"] && hybridData.mainContent.endecaProductInfo.contents[0].mainContent[0].record.records[0].attributes["sku.repositoryId"][0] || "";
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

      productList.push(payload);
    })

    opticPayload.products = { productList }
    return opticPayload

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
  getPdpDynamicContent = () => {

    const mainProductData = this.props.mainContent && this.props.mainContent.collectionProductInfo || {}
    const productId = mainProductData && mainProductData["product.collectionProductId"] && mainProductData["product.collectionProductId"][0];
    const productType = mainProductData && mainProductData.productType && mainProductData.productType[0] || "";
    if (!this.state.breadcrumbData || typeof this.state.breadcrumbData === 'undefined' || isEmpty(this.state.breadcrumbData)) {

      Utility(Path.getPdpDynamicContent, 'POST', {
        "productId": productId,
        "skuList": productId,
        "isMarketPlace": "false",
        "skuId": productId,
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
          if (!LoggedInSession) {
            guest = "&isguest=true";
          } else {
            guest = "&isguest=false";
          }
          Utility(Path.getCarousels + '?page=PDP&categoryId=' + categoryId + guest, 'GET').then(response => {

            if (response.data && response.data.status && response.data.status.status == "0") {

              this.setState({
                carouselsData: response.data
              });
            }

          });
        })
      });
    } else {
      if (this.props.backEvent && this.props.backEvent.setBreadCrumbData) {
        this.props.backEvent.setBreadCrumbData(this.state.breadcrumbData)
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
      if (!LoggedInSession) {
        guest = "&isguest=true";
      } else {
        guest = "&isguest=false";
      }
      Utility(Path.getCarousels + '?page=PDP&categoryId=' + categoryId + guest, 'GET').then(response => {

        if (response.data && response.data.status && response.data.status.status == "0") {

          this.setState({
            carouselsData: response.data
          });
        }

      });
    }
  }
  getPriceData = (productInfo) => {
    return {
      list: (productInfo["sku.list_Price"] && productInfo["sku.list_Price"][0]) || "",
      sale: (productInfo["sku.sale_Price"] && productInfo["sku.sale_Price"][0]) || "",
      promo: (productInfo["sku.promoPrice"] && productInfo["sku.promoPrice"][0]) || "",
      minList: (productInfo["minimumListPrice"]) || "",
      maxList: (productInfo["maximumListPrice"]) || "",
      minPromo: (productInfo["minimumPromoPrice"]) || "",
      maxPromo: (productInfo["maximumPromoPrice"]) || "",
      numRecords: 2
    };
  }
  render() {

    //const data = Get(this.props, "this.props.mainContent.collectionProductInfo['product.relProdSequence']", []);
    const data = this.props.mainContent && this.props.mainContent.productsInfo || {}
    const mainProductData = this.props.mainContent && this.props.mainContent.collectionProductInfo || {}
    const fullCollectionData = this.props.mainContent;
    const collectionProductList = fullCollectionData && fullCollectionData.productsInfo || {};
    const mainCollectionData = fullCollectionData && fullCollectionData.collectionProductInfo || {};
    const err = fullCollectionData && fullCollectionData.err || ""

    /*changes made for Pdp staticlabel issue start */
    let staticLabels = {};
    const staticLabelArray = get(fullCollectionData, 'staticLabels.staticLabelValues', {});
    if (staticLabelArray && !isEmpty(staticLabelArray)) {
      for (let k in staticLabelArray) {
        if (staticLabelArray[k].pageName === 'PWA-PDP-PAGE') {
          staticLabels = staticLabelArray[k].keyValues;
        }
      }
    }
    /*changes made for Pdp staticlabel issue start*/

    const { openSticky, alert_status, alert_message, alert_Type } = this.state;

    CollectionData && CollectionData.alert && CollectionData.alert.text ? CollectionData.alert.text = alert_message : CollectionData.alert.text = "";

    const breadCrumbs = this.state.breadcrumbData && this.state.breadcrumbData.breadCrumbs || {};

    let breadcrumbInfo = {
      label: '',
      breadcrumbData: breadCrumbs,
      searchTerm: '',
      isPdp: true
    };

    const collectionInfo = {
      gallery: mainProductData && mainProductData["sku.thumbnailImage"] && mainProductData["sku.thumbnailImage"] || "",
      info: {
        title: mainProductData && mainProductData["product.displayName"] && mainProductData["product.displayName"],
        productCode: mainProductData && mainProductData["product.collectionProductId"] && mainProductData["product.collectionProductId"][0],
        ratings: 'false',
        price: 'true',
        downloadable: 'false',
        offerPrice: 'single',
        colors: 'false',
        sizes: 'false',
        descTitle: 'false',
        description: 'false',
        information: 'Los precios no representan la suma total de los artículos de la colección',
        moreInfo: 'false',
        share: 'true',
        flags: 'false',
        headlineTitle: 'h1'
      },
      purchase: 'button'
    };

    const ITR_Eligibility = this.props.mainContent && this.props.mainContent.ITR_Eligibility || "";

    const priceData = this.getPriceData(mainProductData)
    const priceToShow = GetPrice(priceData);
    let alertType = alert_Type == "success" ? CollectionData.success : alert_Type == "warning" ? CollectionData.warning : CollectionData.alert;

    return (
      err == "" && !isEmpty(mainProductData) && !isEmpty(collectionProductList) ?
        <Fragment>
          <TechnicalSeo pageName="PDP" contentItem={this.props.mainContent} breadcrumbData={this.props.mainContent && this.props.mainContent.breadcrumbData || {}} staticLabelValues={staticLabels} hostName={this.props.hostname} relativePath={this.props.url} />
          <div >
            <div>
              <Alerts fromPDP="true" iconType={alertType.iconType} options={alert_Type == "success" ? CollectionData.success : CollectionData.alert} alertTopClass={`-alert__container mdc-snackbar ${alertType.type}  ${this.state.alertToTop} ${this.state.alertToTopSticky} `} text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
            </div>
            <StickyBarCollections selectedProductPrice={this.state.selectedProductPrice} devices={this.devices} priceToShow={priceToShow} stickyStatus={openSticky} stickyData={collectionInfo} addedProduct={this.state.addedProductDetails} productDeSelection={this.productDeSelection} addMultipleItemToCart={this.addMultipleItemToCart} />
          </div>

          <div className="container-fluid d-none d-lg-block">
            <div className="container p-0">
              <div className="row">
                <Breadcrumb breadcrumbInfo={breadcrumbInfo} removeIconAtLast={true} />
              </div>
            </div>
          </div>

          <div className="o-product">
            <PdpProductDetailCollection windowObject={this.Window} priceToShow={priceToShow} staticLabels={staticLabels} collectionInfo={collectionInfo} mainProductData={mainCollectionData} fullCollectionData={fullCollectionData} />
          </div>

          <section className="o-product__items container" id="products-container">
            <Container containerClass="white-container mt-4" configurationData={this.props.configurationData} limitedPiecesSkusData={this.props.limitedPiecesSkusData}>
              {data && !isEmpty(data) && <CollectionProducts orientation={this.state.orientation} configurationData={this.props.configurationData} limitedPiecesSkusData={this.props.limitedPiecesSkusData} windowObject={this.Window} ref="collProduc" ITR_Eligibility={ITR_Eligibility} show_alert={this.show_alert} fullCollectionData={fullCollectionData} mainProductData={mainCollectionData} collectionData={collectionProductList} staticLabels={staticLabels} productSelection={(e) => this.productSelection(e)} productDeSelection={(e) => this.productDeSelection(e)} deslectionFromSticky={this.state.productDeselectionFrmSticky} selectedData={this.state.selectedData} addMultipleItemToCart={this.addMultipleItemToCart} />}
            </Container>
          </section>

          <div className="o-product__items__purchase container d-lg-none">
            <ProductPurchase addMultipleItemToCart={this.addMultipleItemToCart} windowObject={this.Window} collectionInfo={collectionInfo} />
          </div>

          <section className="o-carousel-section">
            <div className="container">
              <div className="row">
                <div className="col-12 p-0 p-lg-3">
                  <Carousel carouselsData={this.state.carouselsData} chanelBrandCss={this.state.chanelBrandCss} loginDetails={this.props.loginDetails} />
                </div>
              </div>
            </div>
          </section>
          {<parentContext.Consumer>
            {({ showModal, selectProductModalData }) => (showModal.selectProductModal === true ? <Modal modalDetails={CollectionData.modalEdd} showModalpopUp={"selectProductModal"} nestedModal={true}>
              <SelectProductModal {...selectProductModalData} />
            </Modal> : null
            )}
          </parentContext.Consumer>}

          {this.state.carouselsData && this.state.carouselsData.carouselContent && this.state.carouselsData.carouselContent[1] && <section className="o-carousel-section">
            <div className="container-fluid o-carousel-container">
              <div className="container p-0">
                <div className="row">
                  <div className="col-12">
                    <Carousel carouselsData={this.state.carouselsData} PdpSecond={true} chanelBrandCss={this.state.chanelBrandCss} loginDetails={this.props.loginDetails} />
                  </div>
                </div>
              </div>
            </div>
          </section>}
        </Fragment > : <NoProducts />
    );
  }


}

