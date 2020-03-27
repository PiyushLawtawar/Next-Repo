import { parentContext } from '../../../contexts/parentContext';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Utility,logError,logDebug } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import BreakdownExpensesMyBag from '../../molecules/MyBag/BreakdownExpensesMyBag'
import { AtomChunkText } from '../../atoms/Tab/atom-chunk-text.js'
import ProductList from '../../organisms/MyBag/organism-productList.js'
import OrganismTab from '../../organisms/tab/organism-tab'
import Button from '../../atoms/Button/Button'
import MoleculeTextList from '../../molecules/OptionList/molecule-text-list'
import { UserAgentDetails,GTMallPages } from '../../../helpers/utilities/utility';
import Router from 'next/router';
import Footer from '../headerFooter/headerFooter';
import map from 'lodash/map';
import Alert from '../../molecules/Alert/Alert';
import EventListener from 'react-event-listener';

import Modal from '../../../helpers/modal/modal';
// import './myBag.styl';
// import '../../molecules/Stars/molecule-stars.styl'
// import '../../molecules/ProductQty/molecule-product-qty.styl'
// import '../../molecules/MyBag/molecule-product-bundle.styl'
// import '../../molecules/Figure/Figure.styl'
export default class MyBag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptMenuData: {},
            MyBag: props.MyBag || {},
            LoggedInSession: (props.loginDetails && props.loginDetails.LoggedInSession) || false,
            //activeTab: 'mdc-tab-1',
            tabCounts: {
                myBagCount: props.MyBag.myBagCount || 0,
                wishListCount: props.MyBag.wishListCount || 0
            },
            curEventId: '',
            promotionCode: '',
            alertToTop: '',
            alert_status: false,
            alert_message: '',
            gREventsData: {},
            gREventsDataOwner: {},
            CommerceIdForGROne: {},
            CommerceIdForGRTwo: {},
            CommerceIdForGRThree: {},
            window: '',
            globalConfigData: props.globalConfigData||{},
            eventTypeList: props.eventTypeList||[],
            objectres: '',
            errors: {},
            focused: {},
            setGiftWrapServiceData: {},
            details: props.detailsGW|| [],
            lastIndex: {},
            allClear: true
        };
    }
    //Required for sWOGO functionalities
    getOrderId = () => {
        return this.state.MyBag['orderID'];
    }
    //Required for sWOGO functionalities
    getSWOGOPageIdentifier = () => {
        const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
        if (isMobile) {
            return "mobileBasket-0";
        }
        return "basket-0";
    }
    //Required for sWOGO functionalities
    getSkusInfoForSWOGO = () => {  // shared the cart all commerce items
        let inventory = true;
        let items = [];
        let currentItem = {};
        if (this.state.MyBag && this.state.MyBag.commerceItems) {
            this.state.MyBag.commerceItems.map((record) => {
                currentItem = {};
                currentItem["active"] = inventory;
                currentItem["quantity"] = Number(record['quantity']) || 1;
                currentItem["productId"] = record['productId'];
                currentItem["sku"] = record['catalogRefId'];
                currentItem["productType"] = record['productType'];
                currentItem["title"] = record['itemDisplayName'];
                currentItem["isSpecialSale"] = "false";
                currentItem["imageURL"] = record['productImageURL'];
                currentItem["eddZipCode"] = record['eddZipCode'];
                currentItem["storeNumber"] = record['storeNumber'];
                let lprice = record['listPrice'] && typeof record['listPrice'] !== 'undefined' ? Number(record['listPrice']) : 0;
                let sprice = record['salePrice'] && typeof record['salePrice'] !== 'undefined' ? Number(record['salePrice']) : 0;
                let pprice = record['listPriceWithDiscount'] && typeof record['listPriceWithDiscount'] !== 'undefined' ? Number(record['listPriceWithDiscount']) : 0;
                currentItem["listPrice"] = lprice;
                currentItem["salePrice"] = sprice;
                currentItem["promoPrice"] = pprice;
                currentItem["price"] = pprice > 0 ? pprice : (sprice > 0 ? sprice : lprice);
                items.push(currentItem);

            });
        }
        return items;
    }

    getListForgiftWrap = () => {
        const { commerceItems } = this.state.MyBag;
        let { details } = this.state
        !isEmpty(commerceItems) && map(commerceItems, (item, index) => {
            if (item.isGiftWrapSelected === true) {
                details.push({
                    giftMessages: item.giftMessage !== undefined ? item.giftMessage : '|',
                    catalogRefId: item.catalogRefId,
                    giftwrapType: item.giftWrapType,
                    giftwrapColor: item.giftWrapColor,
                    giftwrapNeeded: 'true',
                    giftwrapMessage: item.giftWrapMessage,
                    commerceItemIds: item.id
                })
            }
        })
        this.setState({
            details: details
        })
    }

    handleWindowScroll = (e) => {
        this.handleScrollAlert(e);
    }

    handleScrollAlert = () => {
        try {
            if (window.scrollY >= 117) {
                this.setState({ alertToTop: '-toTop' });
            }
            else {
                this.setState({ alertToTop: '' });
            }
        } catch (e) { }
    }

    componentDidMount() {        
        //Custom products new feature, my bag changes - START
        let customProducts = JSON.parse(localStorage.getItem('customProduct')) || [];
        let target = { ...this.state };
        let source = { customProducts: customProducts };

        target = Object.assign(target, source);

        this.setState(target);
        let productsInBag = this.state.MyBag.commerceItems;
        let productSku, exceptionSku, i, found, copy;

        customProducts.forEach((custom, index) => {
            exceptionSku = parseInt(custom.sku);

            i = 0;
            found = false;

            while ( i < productsInBag.length && !found ) {
                productSku = parseInt(productsInBag[i].productId);

                if ( exceptionSku === productSku ) {
                    copy = { ...this.state };

                    copy.MyBag.commerceItems[i].isGRConversionEligible = !copy.MyBag.commerceItems[i].isGRConversionEligible;
                    copy.MyBag.commerceItems[i].isCustomProduct = true;

                    this.setState(copy);

                    found = !found;
                }
                i++;
            }
        });
        //Custom products new feature, my bag changes - END

         this.resetFooterPosition();
        // this.getCartHeaderDetails();
        this.getListForgiftWrap();
        // this.getDisplayMybagListCount();
         //  this.getDisplayWishListItems();
        //Required for sWOGO functionalities   =>  // we need this for cart funtionality   so enabling
        window.swogoDependencies = { getSkus: this.getSkusInfoForSWOGO, getPage: this.getSWOGOPageIdentifier, getOrderId: this.getOrderId };
        // Utility(Path.fetchConfiguration, 'GET').then(response => {
        //     let globalConfigData = response.data || {};
        //     this.setState({ globalConfigData: globalConfigData })
        //     this.setState({
        //         eventTypeList: (this.getList(globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.bridgecoreeventtypemap ? globalConfigData.configuration.liverpoolconfiguration.bridgecoreeventtypemap : []))
        //     })
        // })
       this.Limited_pieces_skus();

    }

    //   set_GTMallPages = () => {
    //     const { isMobile } = UserAgentDetails(window);
    //     this.setState({ isMobile });
    //         const gtmObjectData = {
    //             actURL: window.location.href,
    //             actPageTitle: window.document.title
    //         }
    //         GTMallPages(gtmObjectData);
    // }
    componentWillReceiveProps(nextProps){
      if(this.props.loginDetails.LoggedInSession !== nextProps.loginDetails.LoggedInSession){
          this.setState({LoggedInSession : nextProps.loginDetails.LoggedInSession,
              userID:nextProps.loginDetails.cartHeaderResponse.cartHeaderDetails.gtmUserId});
      }
    }
    resetFooterPosition() {
       const footer = document.querySelector('footer');
        let windowHeight = document.documentElement.clientHeight;
        let srcollHeight = document.documentElement.scrollHeight;

    
        if (window.outerWidth >= 992) {
          srcollHeight > windowHeight ? footer.classList.remove('fixedFooter') : footer.classList.add('fixedFooter')
        }
        else {
          footer.classList.remove('fixedFooter')
        }
  }
    getCartHeaderDetails = () => {
        Utility(Path.getCartHeaderDetails, 'POST', {}).then(response => {
            if (response.status === 200) {
                if (response.data && response.data.status && response.data.status.status === "SUCCESS") {
                    this.setState({
                        LoggedInSession: (response.data && response.data.cartHeaderDetails) ? response.data.cartHeaderDetails.isLoggedIn : false
                    });
                    this.props.loginDetails.check_login_status(response.data);
                }
            } else {
            }
        }, (error) => {

        });
    }
    handlePromotionCodeChange = (e) => {
        this.setState({ promotionCode: e.target.value })
    }
    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }
    handleBlur = (e) => {
        const { focused, errors } = this.state;
        focused[e.target.name] = false;
        this.setState({ focused, errors });
    }
    getDisplayMybagListCount = (myBagCount) => {       
            const { tabCounts } = this.state;
            tabCounts.myBagCount = myBagCount || 0;
            this.setState({ tabCounts }, () => {
                this.props.updateCartCount(tabCounts.myBagCount);
            });
    }
    getDisplayWishListItems = (wishListCount) => {
            const { tabCounts } = this.state;
            tabCounts.wishListCount = wishListCount || 0
            this.setState({ tabCounts }, () => {});
    }

    removeItemFromCart = (CommerceId) => {
        Utility(Path.removeItemFromCart, 'POST', {
            "removalCommerceIds": CommerceId
        }).then(response => {
            let { MyBag } = this.state;

            MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
            MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
            MyBag.orderPriceInfo = response.data && response.data.orderPriceInfo || {};

            //Custom products new feature, my bag changes - START
            this.setState({ MyBag }, () => {
                this.getDisplayMybagListCount(response.data && response.data.myBagCount);
                
                let customProducts = this.state.customProducts || [];

                let productsInBag = this.state.MyBag.commerceItems;
                let productSku, exceptionSku, i, found, copy;

                if (customProducts.length > 0) {
                    productsInBag.forEach((product, index) => {
                        productSku = parseInt(product.productId);
        
                        i = 0;
                        found = false;
        
                        while (i < customProducts.length && !found) {
                            exceptionSku = parseInt(customProducts[i].sku);
        
                            if (exceptionSku === productSku) {
                                copy = { ...this.state };
        
                                copy.MyBag.commerceItems[index].isGRConversionEligible = !copy.MyBag.commerceItems[index].isGRConversionEligible;
                                copy.MyBag.commerceItems[index].isCustomProduct = true;
        
                                this.setState(copy);
        
                                found = !found;
                            }
                            i++;
                        }
                    });
                }
            });
            //Custom products new feature, my bag changes - END
            if(response.data&&response.data.myBagCount==0){
                this.resetFooterPosition()
            }
            if (response.data && response.data.err && response.data.err !== "No tienes productos en tu bolsa") {
                this.show_alert(response.data && response.data.err)
            }
            });
    };

    addItemToWishList = (CommerceId, CatalogRefId) => {
        Utility(Path.addItemToWishList, 'POST', {
            "removalCommerceIds": CommerceId,
            "addItemToGiftlist": true,
            "removalCatalogRefIds": CatalogRefId
        }).then(response => {
            let { MyBag } = this.state;
            MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
            MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
            MyBag.orderPriceInfo = response.data && response.data.orderPriceInfo || {};
            MyBag.wishlistItem = response.data.wishlistItem || [];
            if (MyBag.wishlistItem && MyBag.wishlistItem.length == 30) {
                this.show_alert("Has alcanzado el límite máximo de artículos Guardados")
            }
            this.setState({ MyBag }, () => {
                 this.getDisplayWishListItems(response.data&&response.data.wishListCount)
                 this.getDisplayMybagListCount(response.data&&response.data.myBagCount)
            });
            if(response.data&&response.data.myBagCount==0){
                this.resetFooterPosition()
            }
            if (response.data&&response.data.err) {
                this.show_alert(response.data&&response.data.err)
                }
        });
    }
    updateItemQuantity = (CommerceId, quantity, index) => {
        var obj = {};
        obj.commerceId = CommerceId || '';
        obj.quantity = quantity;
        var lastQuantity = index;
        if (quantity != lastQuantity) {
            Utility(Path.updateItemQuantity, 'POST', obj).then(response => {
                const { MyBag } = this.state;
                MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
                MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
                MyBag.orderPriceInfo = response.data && response.data.orderPriceInfo || {};
                
                if (quantity < lastQuantity) {
                        let updatedQuantity=lastQuantity - quantity
                    if (response.data.commerceItems && response.data.commerceItems[obj.commerceId]) { this.gtmRemoveFromCart(response.data.commerceItems[obj.commerceId],updatedQuantity) };
                }
                else if (quantity > lastQuantity && !response.data.err) {
                        let updatedQuantity=quantity - lastQuantity
                    if (response.data.commerceItems && response.data.commerceItems[obj.commerceId]) { this.gtmAddToCartMyBag(response.data.commerceItems[obj.commerceId],updatedQuantity) };
                }
                this.setState({ MyBag }, () => {
                    this.getDisplayMybagListCount(response.data&&response.data.myBagCount);
                });
                
                if (response.data&&response.data.err) {
                this.show_alert(response.data&&response.data.err)
                }
                else if (response.data&&response.data.warning) {
                this.show_alert_warning(response.data&&response.data.warning)
                }
            });
        }
    }
    // showTabContent = (id) => {
    //     this.setState({ activeTab: id }, () => {
    //         // this.getDisplayWishListItems()
    //         // this.getDisplayMybagListCount()
    //     });

    // }
    applyCoupon = () => {
        let { promotionCode } = this.state;
        if (promotionCode !== '') {
            Utility(Path.applyCoupon, 'POST', {
                "couponClaimCode": promotionCode
            }).then(response => {
                if (response.data && response.data.commerceItems.orderPriceInfo) {
                    const { MyBag } = this.state;
                    MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
                    MyBag.orderPriceInfo = response.data && response.data.commerceItems.orderPriceInfo || {};
                    this.setState({
                        MyBag,
                        promotionCode: '',

                    });
                    this.show_alert(response && response.data && response.data.commerceItems.couponDescription, 'success');
                } else {
                    const err = response && response.data && response.data.commerceItems.err || response.data && response.data.commerceItems.s || '';
                    this.show_alert(err)

                }
            });

        }
    }
    removeItemFromSavedCart = (giftListid) => {
        Utility(Path.removeItemFromSavedCart, 'POST', {
            "giftListid": giftListid
        }).then(response => {
            let { MyBag } = this.state;
            MyBag.wishlistItem = response.data.wishlistItem || [];
            this.setState({ MyBag }, () => {
                this.getDisplayWishListItems(response.data&&response.data.wishListCount)
            });
            if(response.data&&response.data.wishListCount==0){
                this.resetFooterPosition()
            }
            if (response.data&&response.data.err) {
                this.show_alert(response.data&&response.data.err)
                }
        });
    }
    Limited_pieces_skus = () => {
        let objectres = {};
         const { limitedPiecesSkus } = this.props;
        if (isEmpty(limitedPiecesSkus)) {
        Utility(Path.limitedPiecesSkus, 'GET').then(response => {
            if (response.status === 200) {               
                this.setState({ objectres: response.data })
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });
        } else {
            this.setState({
                objectres: limitedPiecesSkus
            });
        }
    }

    addItemToCart = (payload) => {
        let objectres = {};
        map(this.state.objectres, (item, i) => {
            if (item.sku == payload.productId) {
                payload.quantity = (item.piezas).toString()
            }
        });
        // var payload = {};
        Utility(Path.addItemToCartFromWishlist, 'POST', payload).then(response => {
            let { MyBag } = this.state;
            MyBag.commerceItems = this.props.getCards(response.data) || [];
            MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
            MyBag.wishlistItem = response.data&&response.data.wishlistItem || [];
            MyBag.orderPriceInfo = response.data && response.data.orderPriceInfo || {};
            this.setState({ MyBag }, () => {
                this.getDisplayWishListItems(response.data&&response.data.wishListCount)
                this.getDisplayMybagListCount(response.data&&response.data.myBagCount)
            });
            if(response.data&&response.data.wishListCount==0){
                this.resetFooterPosition()
            }
            if (response.data&&response.data.err) {
                this.show_alert(response.data&&response.data.err)
                }
        });

    }
    setGiftWrapService = () => {
        const catalogRefId = [];
        const eventType = [];
        const selectedColor = [];
        const message = [];
        const CommerceIdForGiftWrapItem = [];
        const giftwrapNeeded = [];
        const giftMessages = [];
        map(this.state.details, (item, index) => {
            catalogRefId.push(item.catalogRefId);
            eventType.push(item.giftwrapType);
            selectedColor.push(item.giftwrapColor);
            giftwrapNeeded.push(item.giftwrapNeeded);
            message.push(item.giftwrapMessage);
            CommerceIdForGiftWrapItem.push(item.commerceItemIds);
            giftMessages.push(item.giftMessages);



        });
        const data = {
            'catalogRefId': catalogRefId.join(','),
            'giftMessages': giftMessages.join('|'),
            'giftwrapType': eventType.join(','),
            'giftwrapColor': selectedColor.join(','),
            'giftwrapNeeded': giftwrapNeeded.join(','),
            'giftwrapMessage': message.join('|'),
            'commerceItemIds': CommerceIdForGiftWrapItem.join(',')


        };
        if (data.catalogRefId !== '') {
            Utility(Path.setGiftWrapService, 'POST', data).then(response => {
            })

        }
    }
    moveToCheckout = () => {
         this.setGiftWrapService()
        if (this.state.LoggedInSession) {
            if (this.props.MyBag.redirectToBilling === 'true') {
                Router.push('/tienda/checkoutBilling');
                window.sessionStorage.setItem('cameFromCart', true);
            } else {
                Router.push('/tienda/checkoutShipping');
            }
        } else {
            const commerceItems = this.state.MyBag && this.state.MyBag.commerceItems || [];
            let onlyDigitalItems = true;
            for (var i in commerceItems) {
                if (commerceItems[i].productType !== 'Digital') {
                    onlyDigitalItems = false;
                }
            }
            if(commerceItems.length>0 && onlyDigitalItems){
                window.sessionStorage.setItem('onlyDigitalItems', onlyDigitalItems ? 'true' : 'false');
            }
            if (this.props.MyBag.redirectToBilling === 'true') {
                window.sessionStorage.setItem('cartToCheckoutCustomRoute', '/tienda/checkoutBilling');
                window.sessionStorage.setItem('cameFromCart', true);
                Router.push('/tienda/login');
            } else {
                window.sessionStorage.setItem('cartToCheckoutCustomRoute', '/tienda/checkoutShipping')
                Router.push('/tienda/login');
            }
        }
    }
    pdpProductLanding = (cartItem, productId) => {
        let string = cartItem.itemDisplayName && cartItem.itemDisplayName.replace(/[^a-zA-Z0-9]/g, '');
        if (cartItem && cartItem.displayName) {
            string = cartItem.displayName && cartItem.displayName.replace(/[^a-zA-Z0-9]/g, '');
        }
        let pdpLandingUrl = '/tienda/pdp/';
        if (cartItem && (cartItem.platform || cartItem.edition || cartItem.format || cartItem.license || cartItem.validity || cartItem.hybridLanguage)) {
            pdpLandingUrl = '/tienda/pdp/hp/'
        }
        let pId
         if(productId){
            pId=productId
        }
        else if(cartItem.catalogRefId){
            pId=cartItem.catalogRefId
        }
         
        Router.push(pdpLandingUrl + string + '/' + pId);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
        document.removeEventListener('touchend',this.listenTouch,false);
    }

    openOptions = (index, type) => {
        let { lastIndex, MyBag } = this.state;
        if (MyBag.commerceItems.length > 0 && type === 'mybag') {
            document.removeEventListener('click', this.handleOutsideClick, false);
            document.removeEventListener('touchend',this.listenTouch,false);
            this.setState(prevState => {
                MyBag.commerceItems[index].options_visibility = prevState.MyBag.commerceItems ? !prevState.MyBag.commerceItems[index].options_visibility : true;
                if ((lastIndex.index || lastIndex.index === 0) && index !== lastIndex.index) {
                    MyBag.commerceItems[lastIndex.index].options_visibility = false
                }
                lastIndex = { index: index, status: !prevState.MyBag.commerceItems[index].options_visibility };
                return { MyBag, lastIndex, allClear: false }
            }, () => {
                if (MyBag.commerceItems[index].options_visibility) {
                    document.addEventListener('click', this.handleOutsideClick, false);
                    document.addEventListener('touchend',this.listenTouch,false);
                }
            })
        }
        if (MyBag.wishlistItem.length > 0 && type === 'wishlist') {
            document.removeEventListener('click', this.handleOutsideClick, false);
            document.removeEventListener('touchend',this.listenTouch,false);
            this.setState(prevState => {
                MyBag.wishlistItem[index].options_visibility = !prevState.MyBag.wishlistItem[index].options_visibility
                if ((lastIndex.index || lastIndex.index === 0) && index !== lastIndex.index) {
                    MyBag.wishlistItem[lastIndex.index].options_visibility = false
                }
                lastIndex = { index: index, status: !prevState.MyBag.wishlistItem[index].options_visibility };
                return { MyBag, lastIndex, allClear: false }
            }, () => {
                if (MyBag.wishlistItem[index].options_visibility) {
                    document.addEventListener('click', this.handleOutsideClick, false);
                    document.addEventListener('touchend',this.listenTouch,false);
                }
            })
        }
    }

    handleOutsideClick = (e, status) => {
        this.clearAllAddressOptions();
    }

    listenTouch = (e) => {
         e.preventDefault();
        const { allClear } = this.state;
        if(allClear===false){
            this.clearAllAddressOptions();        
        }
    }
    redirectToHome = () => {
        Router.push({ pathname: '/tienda/home' });
    }
    clearAllAddressOptions = () => {
        document.removeEventListener('click', this.handleOutsideClick, false);
        document.removeEventListener('touchend',this.listenTouch,false);
        const { MyBag } = this.state;
        for (let i in MyBag.commerceItems) {
            MyBag.commerceItems[i]['options_visibility'] = false;
        }
        for (let i in MyBag.wishlistItem) {
          if (MyBag.wishlistItem[i]['options_visibility']) {  MyBag.wishlistItem[i]['options_visibility'] = false };
        }
        this.setState({ MyBag, lastIndex: {}, allClear: true });
    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert") => {
        this.setState({ alert_status: true, alert_message, alert_Type });
        // setTimeout(() => {
        //     this.setState({ alert_status: false });
        // }, 3000)
    }
    show_alert_warning = (alert_message, alert_Type = "-warning") => {
        this.setState({ alert_status: true, alert_message, alert_Type });
        // setTimeout(() => {
        //     this.setState({ alert_status: false });
        // }, 3000)
    }
    gtmAddToCartMyBag = (cartItemData,updatedQuantity) => {
        const { itemDisplayName,associatedGiftItems, listPrice, promoPrice, clothingSize, texture, productId, material, catalogRefId, parentSkuId, sellerSkuId, salePrice, brand, categoryId, subcategory, clothingColor, quantity, sellerName ,categoryName,listPriceWithDiscount,dimensions} = cartItemData || ''
        let getSellerName = window.location.host;
        let sellerNameHardCode = '';
        let price =listPriceWithDiscount?listPriceWithDiscount:salePrice?salePrice:listPrice;
         let tempPrice = listPrice ? listPrice:salePrice?salePrice:'';
        let dimension40 = parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : catalogRefId) ? parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : catalogRefId) : ''
        if(associatedGiftItems){
            dimension40 += ','+ associatedGiftItems[0]
        }
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
        let getSellerNameForAll = ';'
        if (sellerName) {
            getSellerNameForAll = sellerName;
        } else {
            getSellerNameForAll = sellerNameHardCode;
        }
        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'add': {
                    'products': [{
                        'name': itemDisplayName ? itemDisplayName : '',
                        'id':  productId ? productId : '', //Generic SKU
                        'category': categoryName ? categoryName : '',
                        'variant': 'N/A',
                        'price': price?price.toString():'',
                        'brand': brand ? brand : '',
                        'quantity': updatedQuantity ? updatedQuantity.toString() :quantity?quantity.toString(): '',
                        'dimension27': (clothingSize ? clothingSize : (dimensions?dimensions:'')), //CD 27 If doesn`t apply, the value must be empty “”
                        //   'dimension27':  || '',
                        'dimension28': clothingColor ? clothingColor : '',
                        // 'dimension28': dataAvailable['sku.color'] && dataAvailable['sku.color'][0] || '', //CD 27 If doesn`t apply, the value must be empty  “”
                        'dimension36': sellerName ? 'Market Place-' + sellerName: getSellerNameForAll?getSellerNameForAll : '', //CD 36
                        'dimension40': dimension40?dimension40 : '', //CD 40
                        'dimension41': material ? material : '', //CD 41 If doesn`t apply, the value must be  empty “”
                        'dimension42': texture ? texture : '', //CD 42 If doesn`t apply, the value must be empty  “”
                        'dimension43': 'N',
                        'metric2': tempPrice ? tempPrice.toString() : '', //M2
                        'metric3': promoPrice ? promoPrice.toString() : tempPrice!=listPriceWithDiscount?listPriceWithDiscount.toString(): '' //M3
                    }]
                }
            }
        });

    }
    gtmRemoveFromCart = (data,updatedQuantity) => {
        const { itemDisplayName,associatedGiftItems, productId, listPrice, salePrice, brand, categoryId, parentSkuId, sellerSkuId, catalogRefId, subcategory, clothingColor,promoPrice, quantity,clothingSize,texture, dimension8, material, sellerName,categoryName,listPriceWithDiscount,dimensions } = data || ''
        //  console.log('datadatadatadatadata', data);
        let getSellerName = window.location.host;
        let sellerNameHardCode = '';
        let price =listPriceWithDiscount?listPriceWithDiscount:salePrice?salePrice:listPrice;
        let tempPrice = listPrice ? listPrice:salePrice?salePrice:'';
        let dimension40 = parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : catalogRefId) ? parentSkuId ? parentSkuId : (sellerSkuId ? sellerSkuId : catalogRefId) : ''
        if(associatedGiftItems){
            dimension40 += ','+ associatedGiftItems[0]
        }
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
        let getSellerNameForAll = ';'
        if (sellerName) {
            getSellerNameForAll = sellerName;
        } else {
            getSellerNameForAll = sellerNameHardCode;
        }
             dataLayer.push({
                    'event': 'removeFromCart',
                    'ecommerce': {
                        'remove': {
                            'products': [{
                                'name': itemDisplayName ? itemDisplayName : "",
                                'id':  productId ? productId : '',                                
                                'category': categoryName ? categoryName : "",
                                'variant': 'N/A',
                                'price': price?price.toString():'',
                                'brand': brand ? brand : "",
                                'quantity': updatedQuantity ? updatedQuantity.toString() :quantity?quantity.toString(): "",
                                //'dimension8': dimension8 ? dimension8 : "",
                                'dimension27': clothingSize ? clothingSize : (dimensions ? dimensions : ''),
                                'dimension28':  clothingColor ? clothingColor : "",
                                'dimension36': sellerName ? 'Market Place-' + sellerName: getSellerNameForAll?getSellerNameForAll : '',
                                'dimension40': dimension40?dimension40 : '', //CD 40
                                'dimension41': material ? material : '', //CD 41 If doesn`t apply, the value must be  empty “”
                                'dimension42': texture ? texture : '', //CD 42 If doesn`t apply, the value must be empty  “”
                                'dimension43': 'N',
                                'metric2': tempPrice ? tempPrice.toString() : '', //M2
                                'metric3': promoPrice ? promoPrice.toString() : tempPrice!=listPriceWithDiscount?listPriceWithDiscount.toString(): '' //M3
                            }]
                        }
                    }
                });
    }
    

    UpdateValue = (giftWrapColor, giftWrapMessage, giftWrapType) => {
        this.setState({
            giftWrapColor: giftWrapColor,
            giftWrapMessage: giftWrapMessage,
            giftWrapType: giftWrapType

        })
    }

    render() {
        const { MyBag, tabCounts, promotionCode, alert_message, alert_status, alert_Type, objectres } = this.state;
        const { commerceItems, wishlistItem, EDDErrorMessages} = MyBag;
        const staticLables = MyBag && MyBag.staticLabels && MyBag.staticLabels.staticLabelValues.length ? MyBag.staticLabels.staticLabelValues[0].keyValues : '';
        const header = {
            downarrow: "icon-arrow_down"
        }
        const data = this.state.deptMenuData;
        const organism = {
            name: "o-tabIcon"
        };

        const myBagHeadersName = {
            name: "m-myBagHeadersName",
            columns: [staticLables['pwa.cart.nombre.label'], staticLables['pwa.cart.precio.label'], staticLables['pwa.cart.pantidad.label'], staticLables['pwa.cart.total.label']],
            el: ["product", "price", "quantity", "total"],
            modifier: "--triple"
        };
        const orderPriceInfo = Object.assign({ nameComponent: "m-breakdownExpenses" }, this.state.MyBag.orderPriceInfo);
        orderPriceInfo.staticLables = staticLables;
        const swogoScript = MyBag.swogoEndPoint || '';
       

        return (
            <React.Fragment>
                <script defer="" type="text/javascript" src={swogoScript}></script>
                <EventListener target="window" onScroll={this.handleWindowScroll}
                    onResize={this.resetFooterPosition}
                    onLoad={this.resetFooterPosition} />
                
                <Alert {...this.props} alertTopClass={`m-alert__container mdc-snackbar ${this.state.alertToTop} ` + (alert_Type === "-warning" ? "-warning" : "-alert")} iconType={alert_Type === "-warning" ? "a-alert__icon icon-warning" :"a-alert__icon icon-error"} text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />

                <section className="container-fluid t-myBag">
                    <div className="t-myBag__head">
                        <OrganismTab loginDetails={this.props.loginDetails} tabCounts={tabCounts} Tab={organism} showTabContent={this.props.showTabContent} activeTab={this.props.activeTab} staticLables={staticLables} show_alert_warning={this.show_alert_warning} dismiss_alert={this.dismiss_alert} />
                        {
                            (this.props.activeTab === 'mdc-tab-1' && commerceItems && commerceItems.length > 0) ?
                                <div className="t-myBag__toBuy" name="toBuyTop">
                                    <Button className='a-btn a-btn--primary a-product__buttonBuy' handleClick={this.moveToCheckout}>{staticLables['pwa.cart.pay.label']}</Button>

                                </div>
                                : null
                        }
                    </div>

                    {
                        ((this.props.activeTab === 'mdc-tab-1' && commerceItems.length > 0) || (this.props.activeTab === 'mdc-tab-2' && wishlistItem.length > 0)) ?
                            <div className={this.props.activeTab === 'mdc-tab-1' ? "t-myBag__cards" : "t-myBag__cards t-myBag__cards--saved"}>
                                <div className="t-myBag__productList">
                                    <MoleculeTextList MyBagHeadersName={myBagHeadersName} activeTab={this.props.activeTab} />
                                    <ProductList
                                        wishlistItem={wishlistItem}
                                        commerceItems={commerceItems}
                                        staticLables={staticLables}
                                        removeItemFromCart={this.removeItemFromCart}
                                        removeItemFromCartNew={this.removeItemFromCart}
                                        addItemToWishList={this.addItemToWishList}
                                        addItemToWishListNew={this.addItemToWishList}
                                        updateItemQuantity={this.updateItemQuantity}
                                        activeTab={this.props.activeTab}
                                        removeItemFromSavedCart={this.removeItemFromSavedCart}
                                        addItemToCart={this.addItemToCart}
                                        headerData={this.props.headerData}
                                        cartItemIdToGRModalOne={this.props.cartItemIdToGRModalOne}
                                        cartItemIdToGRModalOneNew={this.props.cartItemIdToGRModalOne}
                                        objectres={this.state.objectres}
                                        gtmRemoveFromCart={this.gtmRemoveFromCart}
                                        gtmAddToCartMyBag={this.gtmAddToCartMyBag}
                                        pdpProductLanding={this.pdpProductLanding}
                                        openOptions={this.openOptions}
                                        loginDetails={this.props.loginDetails}
                                        giftWrapperDisplayServiceData={this.props.MyBag.giftWrapperDisplayServiceData}
                                        cartItemIdToGiftWrapItem={this.props.cartItemIdToGiftWrapItem}
                                        UpdateValue={this.UpdateValue}
                                        EDDErrorMessages={EDDErrorMessages}
                                        show_alert_warning={this.show_alert_warning}
                                        dismiss_alert={this.dismiss_alert}
                                    />
                                </div>
                            </div>

                            :
                            <ProductList
                                wishlistItem={wishlistItem}
                                commerceItems={commerceItems}
                                staticLables={staticLables}
                                removeItemFromCart={this.removeItemFromCart}
                                addItemToWishList={this.addItemToWishList}
                                addItemToWishListNew={this.addItemToWishList}
                                updateItemQuantity={this.updateItemQuantity}
                                activeTab={this.props.activeTab}
                                removeItemFromSavedCart={this.removeItemFromSavedCart}
                                addItemToCart={this.addItemToCart}
                                headerData={this.props.headerData}
                                cartItemIdToGRModalOne={this.props.cartItemIdToGRModalOne}
                                cartItemIdToGRModalOneNew={this.props.cartItemIdToGRModalOne}
                                pdpProductLanding={this.pdpProductLanding}
                                openOptions={this.openOptions}
                                objectres={this.state.objectres}
                                gtmRemoveFromCart={this.gtmRemoveFromCart}
                                gtmAddToCartMyBag={this.gtmAddToCartMyBag}
                                giftWrapperDisplayServiceData={this.props.MyBag.giftWrapperDisplayServiceData}
                                UpdateValue={this.UpdateValue}
                                show_alert_warning={this.show_alert_warning}
                                dismiss_alert={this.dismiss_alert}

                            />

                    }

                    {
                        (this.props.activeTab === 'mdc-tab-1') ?
                            <React.Fragment>
                                {
                                    (commerceItems && commerceItems.length > 0) ?
                                        <div className="t-myBag__breakdownExpenses">
                                            <BreakdownExpensesMyBag
                                                tabCounts={this.state.tabCounts}
                                                promotionCode={promotionCode}
                                                handlePromotionCodeChange={this.handlePromotionCodeChange}
                                                handleOnFocus={this.handleOnFocus}
                                                handleBlur={this.handleBlur}
                                                orderPriceInfo={orderPriceInfo}
                                                applyCoupon={this.applyCoupon}
                                                errors={this.state.errors}
                                                focused={this.state.focused}
                                            />
                                        </div>
                                        : null
                                }
                                {
                                    (commerceItems && commerceItems.length > 0) ?
                                        <React.Fragment>
                                            <div className="t-myBag__footerTab">
                                                <div className="t-myBag__continueToBuy" name="continueToBuyBottom">
                                                    <Button className="a-btn a-btn--secondary" handleClick={this.redirectToHome}>{staticLables['pwa.cart.continueshop.text']}
                                                    </Button>
                                                </div>
                                                <div className="t-myBag__toBuy" name="toBuyBottom">
                                                    <Button className="a-btn a-btn--primary a-product__buttonBuy" handleClick={this.moveToCheckout}>{staticLables['pwa.cart.pay.label']}
                                                    </Button>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                        : null
                                }
                            </React.Fragment>
                            : null
                    }


                </section>
                
            </React.Fragment>
        )
    }
}