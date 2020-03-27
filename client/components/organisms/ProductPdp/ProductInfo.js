
import React from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { Buttonicon, ButtonHeadlineIcon } from '../../molecules/MixinMolecules/MixinMolecules';
import ProductEdd from '../../molecules/ProductEdd/ProductEdd'
import ProductItr from '../../molecules/ProductItr/ProductItr'
import ProductQty from '../../molecules/ProductQty/ProductQty'
import Modal from '../../../helpers/modal/modal';
import EddModal from '../../molecules/Modals/EddModal';
import SelectStateModal from '../../molecules/Modals/SelectStateModal';
import AvailabilityModal from '../../molecules/Modals/AvailabilityModal';
import ItrModal from '../../molecules/Modals/ItrModal';
import AvailabilityModalItr from '../../molecules/Modals/AvailabilityModalItr';
import QtyModal from '../../molecules/Modals/QtyModal';
import ProductGiftPurchase from '../../molecules/ProductGiftPurchase/ProductGiftPurchase';
import ProductGiftPurchaseModal from '../../molecules/Modals/ProductGiftPurchaseModal';
import ProductGiftRegistry from '../../molecules/Modals/ProductGiftRegistry';
import { parentContext } from '../../../contexts/parentContext';
import { ParagraphWithBlockNew } from '../../molecules/MixinMolecules/MixinMolecules';
import Vendorspdp from '../../molecules/Vendorspdp/Vendorspdp';
import Router from 'next/router';
import Button from '../../atoms/Button/Button';
// Custom Products functionality START
import CustomProduct from '../../molecules/CustomProducts/CustomProducts';
import CustomProductModal from '../../molecules/Modals/CustomProductModal';
// Custom Products functionality END

//import './ProductPdp.styl';

export default class extends React.Component {
    constructor(props) {
        super(props)
        // Custom Products functionality START
        this.state = { 
            states: [], 
            selectedAddId: "", 
            Edd: "", 
            EdDateStore:"", 
            eddClassName:"",
            text: '',
            color: '',
            font: '',
            imagePath: '',
            CustomProduct: false
        };
        this.productId = this.props.mainContent.productId;
        // Custom Products functionality END
        // this.states = []
      //  console.log("staticLabel",props.staticLabel)
    }
    componentWillReceiveProps(newProps, state) {
        if (this.productId !== newProps.mainContent.productId) {
            this.productId = newProps.mainContent.productId;
            this.setState({ 
                states: [], 
                selectedAddId: "", 
                Edd: "", 
                EdDateStore:"", 
                eddClassName:"",
                text: '',
                color: '',
                font: '',
                imagePath: '',
                CustomProduct: false
            });
        }
    }
    showAddressList = (stateList) => {
        let states = Object.values(stateList.stateList)
        this.setState({ states: states, selectedAddId: stateList.selectedAddressId })
        this.states = states;
    }

    changeEdd = (estimatedDate) => {
        
        const { isMarketPlace, leadtimeForSLOrCnC } = estimatedDate || {};
        if(!isEmpty(isMarketPlace) && isMarketPlace === 'true') {
            this.setState({ Edd: leadtimeForSLOrCnC, eddClassName: "a-product__eddDateRange -green m-0", EdDateStore: estimatedDate.stateDetails, })
        } else {
            if(estimatedDate && estimatedDate.EDDErrorMessages && isEmpty(estimatedDate.EDDErrorMessages.stateDetails)) { /* Sanity observation issue */
                delete estimatedDate.EDDErrorMessages.stateDetails;
            }
            let errmessage = Object.keys(estimatedDate.EDDErrorMessages).length < 0 ? "" : estimatedDate.EDDErrorMessages[Object.keys(estimatedDate.EDDErrorMessages)]
            let eddMessage = estimatedDate.estimatedDeliveryDate || errmessage
            let eddClassName = errmessage == "" || errmessage == undefined ? "a-product__eddDateRange -green m-0":"a-product__eddPreOrder -green m-0"
            this.setState({ Edd: eddMessage, EdDateStore: estimatedDate.stateDetails, eddClassName })
        }
    }

    // Custom Products functionality START
    handleInfoButton = (customProduct) => {
        if (customProduct) {
            const data = JSON.parse(localStorage.getItem('customProduct'));
            if (data !== null && data !== undefined) {
                data.map(item => {
                    if (item.sku === this.productId) {
                        this.setState({
                            text: item.text.charAt(0).toUpperCase() + item.text.slice(1).toLowerCase(),
                            color: item.color.charAt(0).toUpperCase() + item.color.slice(1).toLowerCase(),
                            font: item.font
                        })
                    }
                })
            } 
            return null;
        }
        return null;
    }

    handleGetSku = (getSkus) => {
        if (!isEmpty(getSkus)) {
            getSkus.map(item => {
                if (item.sku === this.productId) {
                    this.setState({
                        CustomProduct: true
                    })
                }
            })
        }
    }
    // Custom Products functionality END
   
    render() {

        let records = this.props.productDetails && this.props.productDetails.endecaProductInfo && this.props.productDetails.endecaProductInfo.contents &&
            this.props.productDetails.endecaProductInfo.contents && this.props.productDetails.endecaProductInfo.contents[0] &&
            this.props.productDetails.endecaProductInfo.contents[0].mainContent && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0]
            && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record || {}
            let isPresale = this.props.mainContent.isSpecialSale || records.isPresale && records.isPresale[0] || '' ;
            let propspecialSaleMessage = this.props.specialSaleMessage || '';
            let flags = this.props.productDetails.flags;            
            const enableeddforbigticket = (flags && flags['enableeddforbigticket'] && typeof flags['enableeddforbigticket'] ==='boolean'  && !flags['enableeddforbigticket']  )?false:true 
            const enableeddforsoftline = (flags && flags['enableeddforsoftline'] && typeof flags['enableeddforsoftline'] ==='boolean'  && !flags['enableeddforsoftline']  )?false:true 
            let hybridDigital=true;
            if(this.props.pdpType && this.props.pdpType == "hybrid" ){
                let hybridData = get(this.props.mainContent, "endecaProductInfo.contents[0].mainContent[0].record.attributes", {})
                if(hybridData.deliveryMode){
                    hybridData['deliveryMode'].map((item, key) => {
                        if(item.indexOf('Digital') >-1 && item.indexOf('ctive') >-1){
                            hybridDigital=true;
                        }
                        if(item.indexOf('Physical') >-1 && item.indexOf('ctive') >-1){
                            hybridDigital=false;
                        }
                    });
                }
            
            }
            let eddEnable =false;
            
            if(this.props.productType && typeof this.props.productType !=='undefined' 
                    && typeof enableeddforbigticket ==='boolean' &&  this.props.productType.indexOf('Big') >-1 && this.props.productType.indexOf('Ticket') >-1){
                        eddEnable= true;
            }
            if(this.props.productType && typeof this.props.productType !=='undefined' 
                    && typeof enableeddforsoftline ==='boolean' && this.props.productType.indexOf('Soft') >-1 && this.props.productType.indexOf('Line') >-1){
                        eddEnable= true;
            } 
            if( this.props.pdpType == "hybrid" && !hybridDigital && typeof enableeddforsoftline ==='boolean'&&  enableeddforsoftline)  {
                eddEnable= true;
            }        
            
          
        let skuRecords = records.records ||  [];
        let ProductDisplayName = records.productDisplayName || ""
        let ProductCode = records.productId && records.productId[0] || "";
        const productImage = this.props.stickyThumbImg; //records["sku.largeImage"] && records["sku.largeImage"][0] || "";
        let Sku = "";
        const productSelectedSkuId = this.props.productSizeId || ''; /* Defect 24209 */
        let modalProductDetails = { ProductDisplayName, ProductCode, productSelectedSkuId, productImage }
        const pdpType = this.props.pdpType;
        const staticLabels = this.props.staticLabels || {};
        let QtyTXT = staticLabels && staticLabels['pdpPage.Qty.text'] || 'pdpPage.Qty.text';
        let Comprar =  staticLabels && staticLabels['pdpPage.comprar_ahora.text'] || 'pdpPage.comprar_ahora.text';
        let Agregarbtn =  staticLabels && staticLabels['pdpPage.Agregar_mi_bolsa.text'] || 'pdpPage.Agregar_mi_bolsa.text'; 
        let hydbtn = staticLabels && staticLabels['pdpPage.Comprar_y_obtener.text'] || 'pdpPage.Comprar_y_obtener.text'; 
        let StaticMkbbt = staticLabels && staticLabels['pdpPage.Marketplace_BT.text'] || 'pdpPage.Marketplace_BT.text'; 

        // Custom Products functionality START
        const modalPersonalization = {
            modalId: "personalization-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "custom-product-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };
        // Custom Products functionality END

        const modalEdd = {
            modalId: "edd-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "edd-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const modalItr = {
            modalId: "itr-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "itr-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const modalSelecState = {
            modalId: "select-state-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "2",
            modalAriaLabelledBy: "select-state-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const modalAvailability = {
            modalId: "availability-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "availability-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const modalAvailabilityItr = {
            modalId: "availability-modal-itr",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "availability-modal-itr",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const modalQty = {
            modalId: "qty-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "qty-modal",
            modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",
            modalContentClass: "modal-content"
        };
        const modalGiftPurchase = {
            modalId: "giftPurchase-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "giftPurchase-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };
        const modalGiftRegistry = {
            modalId: "giftRegistry-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "giftRegistry-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };
        const optionsButtonHeadlineIcon = {
            hText: '',
            hType: 'h2',
            btnModalAttributes: {
                "data-toggle": "modal",
                "data-target": "#giftRegistry-modal",
                "id": "a-giftRegistry-modal__btn"
            },
            iconClass: 'icon-arrow_right',
            divClass: 'm-product__giftRegistry-container d-none d-lg-block',
            btnText: 'Agregar a mi mesa de regalos',
            btnClass: 'a-btn a-btn--action'
        };
        const optionsButtonIcon = {
            btnClass: 'a-btn a-btn--tertiaryAlternative btn-giftRegistry__add mb-3 d-block d-lg-none',
            btnText: 'Agregar a mi mesa de regalos',
            btnAttributes: {
                "data-toggle": "modal",
                "data-target": "#giftRegistry-modal",
                "id": "a-giftRegistry-modal__btn"
            },
            iconClass: "icon-arrow_right"
        };
        
        const gwpInfo = this.props.gwpInfo || {};
        const gwpData = gwpInfo.gwpData || {};
        let activeGiftItemIndex = gwpInfo && gwpInfo.activeGiftItemIndex || 0;
            activeGiftItemIndex = (activeGiftItemIndex === -1)? 0 : activeGiftItemIndex;
        const allOutOfStockMessage = gwpData.allOutOfStockMessage || '';
        const gwpActiveItem = gwpData.giftItems && gwpData.giftItems[activeGiftItemIndex] || {};
        const giftItems = get(gwpData, 'giftItems', []);
        const giftItemsCount = giftItems.length;
        const giftPurchaseOpenModal = {
            bType: 'icon',
            sText: (gwpActiveItem.giftDescription || gwpActiveItem.promoName || ''),
            sClass: 'a-giftPurchase-btnText -imageBtn preventOverride',
            giftItemsCount,
            btnModalAttributes: {
                "data-toggle": "modal",
                "data-target": "#giftPurchase-modal",
                "id": "a-giftPurchase-modal__btn"
            },
            iconClass: 'icon-arrow_right',
            imgSrc: (gwpActiveItem.promoSmallImageURL || ''),
            imgAlt: 'Gift Added',
            imgClassName: 'a-giftAdded-img',
            divClass: 'm-product__giftPurchase-container',
            btnText: '',
            btnClass: 'a-btn a-btn--action'
        };
        const { onSelectModalQty } = this.props.qtyModalInfo || {};
        const isGiftRegistry = false;
        const { eventListMap = {}, isLoggedIn = false, pdpQty, selectedSkuId, onAddItemToEvent, departmentId, thumbnailImage, checkSkuSelection } = this.props.giftRegistryInfo || {};
        const eventIdList = Object.keys(eventListMap) || [];
        const eventCount = eventIdList.length;
        const giftRegistryModalInfo = {
            eventListMap,
            productImage,
            productDisplayName: get(records, 'productDisplayName[0]'),
            pdpQty,
            selectedSkuId,
            onAddItemToEvent,
            departmentId,
            thumbnailImage,
            priceToShow: this.props.priceToShow
        };

        const { isMarketPlace = 'false', skuAttributeMapSize = 0, alloffers, anySizeSelected, sortedSizeActive } = this.props.marketPlaceInfo || {};        
        const skuOffers = alloffers && alloffers.skuOffers  || [];
        
        let selectedSkuOffer = {};
        let bestPromoPrice = -1;
        map(skuOffers, (item, index) => {
            if (item.skuId === this.props.productSizeId) {
                if(bestPromoPrice == -1){
                    selectedSkuOffer = item;
                    bestPromoPrice = Number(item.bestPromoPrice);
                }else {
                    if(Number(item.bestPromoPrice) < bestPromoPrice){
                        selectedSkuOffer = item;
                        bestPromoPrice = Number(item.bestPromoPrice);
                    }
                }
               
            }
        })
        const { sellersCount = 0, bestSalePrice = 0, bestSeller = '', sellerId } = selectedSkuOffer;

        const vendorsInfo = { sellerId, sellersCount, bestSalePrice, alloffers ,selectedSkuOffer};
        const productSpecs = {
            bType: 'anchor',
            pText: 'Vendido por ',
            pClass: 'a-productInfo_selledBy',
            bText: bestSeller,
            bClass: 'a-productInfo__selledByLink',
            bUrlp: "/tienda/vendedor/"+sellerId,
            bUrl:"#"
        };
        /* start of 23525 */
       let isHybrid =false;
       if(this.props.productDetails.endecaProductInfo && this.props.productDetails.endecaProductInfo.contents[0] && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0] 
       && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record.attributes &&
       this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record.attributes.isHybridProduct && 
       this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record.attributes.isHybridProduct[0] &&
       this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record.attributes.isHybridProduct[0] ==='true'){
           isHybrid = true;
       }
       /* end of 23525 */
       const  {EDD_Eligibility = "", ITR_Eligibility = "" }= this.props;
       let ismkbt = false;
       if(this.props.productType=='Big Ticket' && isMarketPlace == "true") { ismkbt = true;   }
       //console.log("ismkbt==",this.props)
        let bundlemessage =  this.props.productDetails  && this.props.productDetails.bundleMessage &&  this.props.productDetails.bundleMessage  || ""
        
       return (
            <aside className="o-product__purchase p-0 pt-lg-3 pr-lg-3 pl-lg-3">
                {((this.props.pdpType && this.props.pdpType == "hybrid" ) || this.props.productType == 'Digital') && hybridDigital &&
                    <div className="m-product__productInfo pb-lg-4 d-lg-block">
                        <Button className=" a-btn a-btn--primary a-btn__hybrid" handleClick={this.props.handleAddToMyBag}>{hydbtn}</Button>
                        <hr className="d-none d-lg-block" />
                    </div>
                }
                
                {this.props.pdpType && (this.props.pdpType == "default" || this.props.pdpType == "optic"|| (this.props.pdpType == "hybrid" && !hybridDigital )) && 
                    <div className="row">
                        <div className="col-12 col-lg-12">

                            <aside className={this.props.productinfo}>
                             {this.props.pdpType && 
                               <> {ismkbt ? 
                                        <div className="o-productInfo-greenMA">
                                        <span>
                                            {StaticMkbbt}
                                        </span> </div> :
                                  isPresale == 'true' ? 
                                  <div class="row o-product__productEdd">
                                    <div class="col">
                                        <div class="m-product__edd mt-lg-1"> {/* Defect 22981 - removed "mt-4" */}
                                            <div class="row">
                                                <div class="col-12 mb-3" id="m-product__preOrderContainer">
                                                <div class="m-product__eddDate a-btn--action" data-target="#edd-modal" data-toggle="modal">
                                                    <p class="a-product__eddDateLabel m-0">{this.props.edLabel && this.props.edLabel.replace(/\:$/, '')}</p>
                                                    <p class="a-product__eddPreOrder -green m-0" id="eddRange"> {propspecialSaleMessage}</p>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    :
                                <div>
                                       {(EDD_Eligibility == true || !hybridDigital) && eddEnable ===true ? <div className={this.props.productEdd}>
                                            <div className="col">
                                                <ProductEdd
                                                    btntext={this.props.btntext}
                                                    edLabel={this.props.edLabel && this.props.edLabel.replace(/\:$/, '')}
                                                    EdRange={this.props.productDetails && this.props.productDetails.bundleMessage  && this.props.productDetails.bundleMessage != "" ?  this.props.productDetails.bundleMessage : this.state.Edd}
                                                    EdDateStore={this.state.EdDateStore}
                                                    EdPreOrder={this.props.EdPreOrder}
                                                    check_product_sku_selection={this.props.check_product_sku_selection}
                                                    eddClassName = { this.props.productDetails && this.props.productDetails.bundleMessage && this.props.productDetails.bundleMessage != "" ?  "a-product__eddPreOrder -green m-0" :  this.state.eddClassName }
                                                    bundleMsg = {this.props.productDetails.bundleMessage || ""}
                                                />
                                            </div>
                                        </div> : null }
                                       { ((ITR_Eligibility == "true" || !hybridDigital) && isMarketPlace == "false") && bundlemessage == ""  ? 
                                        <div className={this.props.productItr}>
                                            {/* Custom Products functionality START */}
                                            {
                                                !this.state.CustomProduct &&
                                                <div className="col">
                                                    <ProductItr
                                                        btnclass={this.props.btnclass}
                                                        ItrBtnText={this.props.ItrBtnText}
                                                        check_product_sku_selection={this.props.check_product_sku_selection}
                                                    />
                                                </div>
                                            }
                                            {/* Custom Products functionality END */}
                                        </div>
                                       : null }
                                    </div>}
                                <parentContext.Consumer>
                                    {({ showModal }) => (showModal.showModal1 === true ? <Modal modalDetails={modalEdd} showModalpopUp={"showModal1"}>
                                        <EddModal forcePadding={true} skuRecords={skuRecords} spanText={this.props.spanText} priceToShow={this.props.priceToShow} modalProductDetails={modalProductDetails} ModalpopUp={"showModal1"} addressList={this.showAddressList} selectedAddId={this.state.selectedAddId} {... this.props} estimatedDate={(e) => this.changeEdd(e)} set_postal_zip_code={this.props.set_postal_zip_code} staticLabels={staticLabels} setSelectedAddressInfo={this.props.setSelectedAddressInfo} selectedAddressInfo={this.props.selectedAddressInfo} marketPlaceInfo={this.props.marketPlaceInfo} hybridDigital={hybridDigital}/>
                                    </Modal> : null
                                    )}
                                </parentContext.Consumer>


                                <parentContext.Consumer>
                                    {({ showModal, updateSelectedState }) => (showModal.showModal2 === true ? <Modal modalDetails={modalItr} showModalpopUp={"showModal2"}>
                                        <ItrModal forcePadding={true} skuRecords={skuRecords} spanText={this.props.spanText} priceToShow={this.props.priceToShow} modalProductDetails={modalProductDetails} ModalpopUp={"showModal2"} {... this.props} />
                                    </Modal> : null
                                    )}
                                </parentContext.Consumer>

                                <parentContext.Consumer>
                                    {({ showModal }) => (showModal.showModal3 === true ? <Modal modalDetails={modalSelecState} showModalpopUp={"showModal3"}>
                                        <SelectStateModal ModalpopUp={"showModal3"} staticLabels={staticLabels} stateList={this.states} />
                                    </Modal> : null
                                    )}
                                </parentContext.Consumer>

                                <parentContext.Consumer>
                                    {({ showModal, SelectedModelData,loginDetails }) => (showModal.showModal4 === true ? <Modal modalDetails={modalAvailability} showModalpopUp={"showModal4"}>
                                        <AvailabilityModal ModalpopUp={"showModal4"} staticLabels={staticLabels} productSizeId={this.props.productSizeId} SelectedModelData={SelectedModelData} estimatedDate={(e) => this.changeEdd(e)} set_store_number={this.props.set_store_number} {... this.props} marketPlaceInfo={this.props.marketPlaceInfo} loginDetails={loginDetails}/> 
                                    </Modal> : null
                                    )}
                                </parentContext.Consumer>

                                <parentContext.Consumer>
                                    {({ showModal, SelectedModelData,loginDetails }) => (showModal.showAvailabilityItr === true ?
                                        <Modal modalDetails={modalAvailabilityItr} showModalpopUp={"showAvailabilityItr"}>
                                            <AvailabilityModalItr ModalpopUp={"showAvailabilityItr"} SelectedModelData={SelectedModelData} productSizeId={this.props.productSizeId} {... this.props}  loginDetails={loginDetails}/>
                                        </Modal> : null
                                    )}
                                </parentContext.Consumer>

                             
                                <parentContext.Consumer>
                                    {({ showModal, SelectedModelData, closeModal }) => (showModal.showModal6 === true ?
                                        <Modal modalDetails={modalQty} showModalpopUp={"showModal6"} >
                                            <QtyModal ModalpopUp={"showModal6"} onSelectModalQty={onSelectModalQty} closeModal={closeModal} />
                                        </Modal> : null
                                    )}
                                </parentContext.Consumer>
                                {(this.props.productType != 'Digital' || !hybridDigital ) &&
                                <>
                                <ProductQty isModal={this.props.isModal} productSelection={this.props.productSelection} handleAddToMyBag={this.props.handleAddToMyBag} qtyDropdownInfo={this.props.qtyDropdownInfo} QtyLabel={this.props.QtyLabel} QtyText={QtyTXT} dropDItem="dropdown-item" headLineText={QtyTXT} QtyBtn={Comprar} addCart={Agregarbtn} pdpCollection={this.props.selectButton} collectionProductId={this.props.collectionProductId} productSelection={this.props.productSelection} chanelBrandCss={this.props.chanelBrandCss} />
                                <hr className="d-none d-lg-block" />
                                </>
                                }
                                </>}
                                {((gwpData && gwpData.giftItems && gwpData.giftItems.length > 0) || allOutOfStockMessage !== '') &&

                                    <div className="row o-product__giftPurchase">
                                        {allOutOfStockMessage !== '' ?
                                            <div className="col">
                                                <div className="m-product__giftPurchase mt-lg-3 giftError">
                                                    <div className="message">{allOutOfStockMessage}</div>
                                                </div>
                                            </div>
                                            :
                                            <div className="col">
                                                <ProductGiftPurchase options={giftPurchaseOpenModal} staticLabels={staticLabels} />
                                                <Modal modalDetails={modalGiftPurchase} showModalpopUp={"showModal14"}>
                                                    <ProductGiftPurchaseModal ModalpopUp={"showModal14"} staticLabels={staticLabels} gwpInfo={gwpInfo} />
                                                </Modal>
                                            </div>
                                        }
                                    </div>
                                }
                                {(isLoggedIn && eventCount > 0) && !isHybrid /*23525 */ && (this.props.pdpType  && this.props.pdpType != "optic") && (isMarketPlace == "false" ) && 
                                    // Custom Products functionality START
                                    (isPresale != 'true') && (this.props.productDetails.bundleMessage == undefined) && (this.props.productType != 'Digital') && (this.state.CustomProduct === false) &&
                                    // Custom Products functionality START
                                    <div className="row o-product__giftRegistry">
                                        <div className="col-12 mt-lg-3">
                                            <parentContext.Consumer>
                                                {({ OpenModal, closeModal, showModal }) => (
                                                    <React.Fragment>
                                                    <div class="m-product__giftRegistry-container d-none d-lg-block">
                                                        <ButtonHeadlineIcon options={optionsButtonHeadlineIcon} onClick={() => checkSkuSelection().then(() => OpenModal('showModal15'))} />
                                                        </div>
                                                        <Buttonicon classButton={optionsButtonIcon.btnClass} handleClick={() => checkSkuSelection().then(() => OpenModal('showModal15'))} btnAttributes={optionsButtonIcon.btnAttributes} btnText={optionsButtonIcon.btnText} classIcon={optionsButtonIcon.iconClass} />
                                                        {showModal.showModal15 === true ? <Modal modalDetails={modalGiftRegistry} showModalpopUp={"showModal15"}>
                                                            <ProductGiftRegistry ModalpopUp={"showModal15"} giftRegistryModalInfo={giftRegistryModalInfo} closeModal={closeModal} />
                                                        </Modal> : null }
                                                    </React.Fragment>
                                                )}
                                            </parentContext.Consumer>
                                        </div>
                                    </div>
                                }
                                {/* Custom Products functionality START */}
                                <CustomProduct 
                                    productId={this.productId}
                                    handleGetCustomSkus={this.props.handleGetCustomSkus} 
                                    handleGetSku={this.handleGetSku}
                                    text={this.state.text}
                                    color={this.state.color}
                                    font={this.state.font}
                                />
                                {/* Custom Products functionality END */}
                            </aside>

                        </div>
                        {/* Custom Products functionality START */}
                        <parentContext.Consumer>
                            {
                                ({ showModal }) => (
                                    showModal.showModalPersonalization === true ?
                                    <Modal modalDetails={modalPersonalization} showModalpopUp={"showModalPersonalization"}>
                                        <CustomProductModal 
                                            productId={this.productId} 
                                            handleCustomProduct={this.props.handleCustomProduct} 
                                            handleInfoButton={this.handleInfoButton}
                                            isMobile={this.props.isMobile}
                                            isIpad={this.props.isIpad}
                                            window={this.props.window}
                                            handleAddToMyBag={this.props.handleAddToMyBag}
                                        />
                                    </Modal> 
                                    : null
                                )
                            }
                        </parentContext.Consumer>
                        {/* Custom Products functionality END */}
                    </div>
                }

                {isMarketPlace === "true" && (skuAttributeMapSize < 2 || anySizeSelected) &&
                    <div className="row o-product__marketPdp">
                        <div className="col-12" >
                            <ParagraphWithBlockNew options={productSpecs}   HandleClick={()=>{Router.push(productSpecs.bUrlp)}}/>
                    </div>
                        {sellersCount > 1 &&
                            <div className="col-12 mb-4">
                                <Vendorspdp vendorsInfo={vendorsInfo} productSizeId={this.props.productSizeId} productId={this.props.productId} />
                            </div>
                        }
                    </div>
                }
                {this.props.Enableswogo == "true" && this.props.swogoFlag &&
                 <div className="row o-product__swogo o-product__swogocontent">
                        <div className="col">
                        <div className="swogo-box" id="swogo-bundle-0"></div>
                      </div>
                    </div>
                }
            </aside>
        );
    }
}

