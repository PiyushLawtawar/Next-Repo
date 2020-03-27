
import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty'
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

import { ProductInfoCollectionData } from '../../templates/Pdp/staticConstant'

//import './ProductPdp.styl';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = { states: [], selectedAddId: "", Edd: "" };
        this.eddRef = React.createRef();
        this.eddModalRef = React.createRef() /*Added for Edd in collection add to cart --  start*/
    }
    showAddressList = (stateList) => {
        let states = Object.values(stateList.stateList)
        this.setState({ states: states, selectedAddId: stateList.selectedAddressId })
        this.states = states;
    }

    changeEdd = (estimatedDate, SelectedModelData, SelectedEdd) => {
        /*Added for Edd in collection add to cart --  start*/
        let zipcode = "";
        let config = typeof estimatedDate.config === "string" ? JSON.parse(estimatedDate.config) : estimatedDate.config
        let configData
         if(config){
              configData = config && config.data && typeof config.data === "string" ? JSON.parse(config.data) : config.data
         }       
         if(configData && configData){
            zipcode = configData && configData.storeNumber &&  `storeName:${configData.storeNumber}${estimatedDate.selectedState ? ":"+estimatedDate.selectedState:""}` || configData && configData.zipCode && `zipCode:${configData.zipCode}${estimatedDate.addressId ? ":"+estimatedDate.addressId:""}`;
        }
        /*Added for Edd in collection add to cart --  end*/
        let EdDateStore = estimatedDate.stateDetails || "";
        if(estimatedDate && estimatedDate.EDDErrorMessages && isEmpty(estimatedDate.EDDErrorMessages.stateDetails)) { /* Sanity observation issue */
            delete estimatedDate.EDDErrorMessages.stateDetails;
        }
        let errmessage = Object.keys(estimatedDate.EDDErrorMessages).length < 0 ? "" : estimatedDate.EDDErrorMessages[Object.keys(estimatedDate.EDDErrorMessages)]
        let eddMessage = estimatedDate.estimatedDeliveryDate || errmessage
        let eddClassName = errmessage == "" || errmessage == undefined ? "a-product__eddDateRange -green m-0" : "a-product__eddPreOrder -green m-0"
        SelectedEdd.updateRangeMessae(eddMessage, EdDateStore, eddClassName, zipcode) /*Added for Edd in collection add to cart */
        // let elem = document.getElementById("eddRange" + SelectedModelData.ProductCode)
        // elem != null && elem != undefined ? (elem.innerHTML = eddMessage || "") : ""
        //this.setState({ Edd: eddMessage })
    }

    render() {

        let records = this.props.productDetails && this.props.productDetails.endecaProductInfo && this.props.productDetails.endecaProductInfo.contents &&
            this.props.productDetails.endecaProductInfo.contents && this.props.productDetails.endecaProductInfo.contents[0] &&
            this.props.productDetails.endecaProductInfo.contents[0].mainContent && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0]
            && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record || {}
        let isPresale = this.props.productData && this.props.productData.isSpecialSale || this.props.productData.isPresale && this.props.productData.isPresale[0] || '';
        let propspecialSaleMessage = this.props.specialSaleMessage || '';




        let skuRecords = records.records || [];
        let ProductDisplayName = this.props.information && this.props.information.title || "";
        let ProductCode = this.props.information && this.props.information.productCode || ""
        const productImage = this.props.stickyThumbImg; //records["sku.largeImage"] && records["sku.largeImage"][0] || "";
        let Sku = "";
        let activeSize = "";
        this.props.finalSortedSize && this.props.finalSortedSize.length > 0 && this.props.finalSortedSize.map((skusize, index) => { if (parseInt(this.props.activeSizeIndex) === index) { activeSize = skusize.size } })
        let modalProductDetails = { ProductDisplayName, ProductCode, productImage, colorText: this.props.colorText, colorStyle: this.props.colorStyle, size: activeSize, priceToShow: this.props.priceToShow } /*added for price issue in collection EDD Popup -- start*/
        const pdpType = this.props.pdpType;
        const staticLabels = this.props.staticLabels || {}; /*changes made for Pdp staticlabel issue */
        let QtyTXT = staticLabels && staticLabels['pdpPage.Qty.text'] || 'pdpPage.Qty.text';
        let Comprar = staticLabels && staticLabels['pdpPage.comprar_ahora.text'] || 'pdpPage.comprar_ahora.text';
        let Agregarbtn = staticLabels && staticLabels['pdpPage.Agregar_mi_bolsa.text'] || 'pdpPage.Agregar_mi_bolsa.text';
        let hydbtn = staticLabels && staticLabels['pdpPage.Comprar_y_obtener.text'] || 'pdpPage.Comprar_y_obtener.text';




        const gwpInfo = this.props.gwpInfo || {};
        const gwpData = gwpInfo.gwpData || {};
        let activeGiftItemIndex = gwpInfo && gwpInfo.activeGiftItemIndex || 0;
        activeGiftItemIndex = (activeGiftItemIndex === -1) ? 0 : activeGiftItemIndex;
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
        const onSelectModalQty = this.props.qtyModalInfo || {};
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

        const { isMarketPlace = 'false', skuAttributeMapSize = 0, alloffers, anySizeSelected } = this.props.marketPlaceInfo || {};
        const skuOffers = alloffers && alloffers.skuOffers && alloffers.skuOffers[0] || {};
        const { sellersCount = 0, bestSalePrice = 0, bestSeller = '', sellerId } = skuOffers;

        const vendorsInfo = { sellerId, sellersCount, bestSalePrice, alloffers };
        const productSpecs = {
            bType: 'anchor',
            pText: 'Vendido por ',
            pClass: 'a-productInfo_selledBy',
            bText: bestSeller,
            bClass: 'a-productInfo__selledByLink',
            bUrlp: "/tienda/vendedor/" + sellerId,
            bUrl: "#"
        };

        const { EDD_Eligibility = "", ITR_Eligibility = "", flags = {}, productType } = this.props;

        const enableeddforbigticket = (flags['enableeddforbigticket'] && typeof flags['enableeddforbigticket'] === 'boolean' && !flags['enableeddforbigticket']) ? false : true
        const enableeddforsoftline = (flags['enableeddforsoftline'] && typeof flags['enableeddforsoftline'] === 'boolean' && !flags['enableeddforsoftline']) ? false : true

        let eddEnable = false;
        const productTypeText = productType && productType[0] || '';
        if (productTypeText.indexOf('Big') > -1 && typeof enableeddforbigticket === 'boolean') {
            eddEnable = true;
        }
        if (productTypeText.indexOf('Line') > -1 && typeof enableeddforsoftline === 'boolean') {
            eddEnable = true;
        }
        const { onChangeQty } = this.props.qtyDropdownInfo || {};
        let bundleMessage = this.props.productDetails && this.props.productDetails.bundleMessage || ""

        return (
            <aside className="o-product__purchase p-0 pt-lg-3 pr-lg-3 pl-lg-3">
                {((this.props.pdpType && this.props.pdpType == "hybrid") || this.props.productType && this.props.productType[0] == 'Digital') && ((this.props.isModal == undefined && !this.props.ismodal) ? /* fixes for 23669 */

                    <div className="m-product__productInfo pb-lg-4 d-lg-block">
                        {/* <Button className=" a-btn a-btn--primary a-btn__hybrid" handleClick={this.props.handleAddToMyBag}>{hydbtn}</Button> */}
                        <Button id={this.props.collectionProductId} className="a-btn a-btn--tertiary a-product__select" ripple="" handleClick={() => onChangeQty(Number(this.props.qtyDropdownInfo && this.props.qtyDropdownInfo.pdpQty) == 0 ? Number(this.props.qtyDropdownInfo && this.props.qtyDropdownInfo.pdpQty) + 1 : Number(this.props.qtyDropdownInfo && this.props.qtyDropdownInfo.pdpQty), "addProduct")}>Seleccionar</Button>

                        <hr className="d-none d-lg-block mt-5" />
                    </div> :
                    <div className="col-12 col-lg-8">
                        <div className="m-product__buttons mt-1 container pr-0 pl-0">
                            <div className="row">
                                <div className="col-12 d-lg-none">
                                    <parentContext.Consumer>
                                        {({ closeModal }) => (
                                            <Button className="a-btn a-btn--primary a-btn__accept mb-4" handleClick={() => { onChangeQty(Number(this.props.qtyDropdownInfo && this.props.qtyDropdownInfo.pdpQty) == 0 || this.props.qtyDropdownInfo.pdpQty == "" ? Number(this.props.qtyDropdownInfo && this.props.qtyDropdownInfo.pdpQty) + 1 : Number(this.props.qtyDropdownInfo && this.props.qtyDropdownInfo.pdpQty), "addProduct"); closeModal("selectProductModal") }} ripple="">Aceptar</Button>
                                        )}
                                    </parentContext.Consumer>
                                </div>
                                <div className="col-12 mt-1 pt-lg-3">
                                    <parentContext.Consumer>
                                        {({ closeModal }) => (
                                            <Button className="a-btn a-btn--secondary a-btn__cancel" handleClick={() => { closeModal("selectProductModal") }} ripple="">Cancelar</Button>
                                        )}
                                    </parentContext.Consumer>
                                </div>
                            </div>
                        </div>
                    </div>)

                }
                {this.props.pdpType && (this.props.pdpType == "default" || this.props.pdpType == "optic") &&
                    <div className="row">
                        <div className="col-12 col-lg-12">

                            <aside className={this.props.productinfo}>
                                {this.props.pdpType && this.props.pdpType != "hybrid" &&
                                    <> {isPresale == 'true' ?
                                        // <div className="o-productInfo-greenMA">
                                        //     <span>
                                        //         {propspecialSaleMessage}
                                        //     </span>
                                        // </div>
                                        /* changes for bug id 23445 -- start */
                                        <div class="row o-product__productEdd">
                                            <div class="col">
                                                <div class="m-product__edd mt-lg-1"> {/* Defect 22981 - removed "mt-4" */}
                                                    <div class="row">
                                                        <div class="col-12 mb-3" id="m-product__preOrderContainer">
                                                            <div class="m-product__eddDate a-btn--action" data-target="#edd-modal" data-toggle="modal">
                                                                <p class="a-product__eddDateLabel m-0">{this.props.edLabel && this.props.edLabel.replace(/\:$/, '')}</p>
                                                                <p class="a-product__eddPreOrder -green m-0" id="eddRange"> {propspecialSaleMessage || "El envío se realizará cuando el artículo este disponible."}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        /* changes for bug id 23445 -- end */
                                        :
                                        // this.props.productDetails.bundleMessage && this.props.productDetails.bundleMessage != '' ?
                                        //     <div className="o-productInfo-greenMA">
                                        //         <span >
                                        //             {this.props.productDetails.bundleMessage}
                                        //         </span>
                                        //     </div>
                                        //     :
                                        <div>
                                            {EDD_Eligibility == true && eddEnable === true && this.props.productType && this.props.productType[0] != 'Digital' ? /* fixes for 23669 */
                                                <div className={this.props.productEdd}>
                                                    <div className="col">
                                                        <ProductEdd
                                                            ref={this.eddRef}
                                                            btntext={this.props.btntext}
                                                            edLabel={this.props.edLabel && this.props.edLabel.replace(/\:$/, '')}
                                                            EdRange={this.state.Edd}
                                                            EdDateStore={this.props.EdDateStore}
                                                            EdPreOrder={this.props.EdPreOrder}
                                                            check_product_sku_selection={this.props.check_product_sku_selection}
                                                            modalProductDetails={modalProductDetails}
                                                            bundleMsg={bundleMessage}
                                                            isCollection={true}
                                                            qtyDropdownInfo={this.props.qtyDropdownInfo} /* added for bug id 23723 */
                                                        />
                                                    </div>
                                                </div>
                                                : null}
                                            {ITR_Eligibility == "true" && isMarketPlace == "false" && this.props.productType && this.props.productType[0] != 'Digital' ? /* fixes for 23669 */
                                                <div className={this.props.productItr}>
                                                    <div className="col">
                                                        <ProductItr
                                                            btnclass={this.props.btnclass}
                                                            ItrBtnText={this.props.ItrBtnText}
                                                            check_product_sku_selection={this.props.check_product_sku_selection}
                                                            modalProductDetails={modalProductDetails}
                                                        />
                                                    </div>
                                                </div>
                                                : null}
                                        </div>}
                                        <parentContext.Consumer>
                                            {({ showModal, SelectedModelData, SelectedEdd }) => (showModal.showModal1 === true ? <Modal ref={this.eddModalRef} modalDetails={ProductInfoCollectionData.modalEdd} showModalpopUp={"showModal1"}> {/*Added for Edd in collection add to cart*/}
                                                <EddModal  forcePadding={true} SelectedEdd={SelectedEdd} isCollection={true} fullCollectionData={this.props.fullCollectionData} skuRecords={skuRecords} spanText={this.props.spanText} priceToShow={this.props.priceToShow} modalProductDetails={SelectedModelData} ModalpopUp={"showModal1"} addressList={this.showAddressList} selectedAddId={this.state.selectedAddId} {... this.props} estimatedDate={(e) => { this.changeEdd(e, SelectedModelData, SelectedEdd) }} set_postal_zip_code={this.props.set_postal_zip_code} staticLabels={staticLabels} setSelectedAddressInfo={this.props.setSelectedAddressInfo} selectedAddressInfo={this.props.selectedAddressInfo} colorText={SelectedModelData.colorText} colorStyle={SelectedModelData.colorStyle} />
                                            </Modal> : null
                                            )}
                                        </parentContext.Consumer>


                                        <parentContext.Consumer>
                                            {({ showModal, SelectedModelData }) => (showModal.showModal2 === true ? <Modal modalDetails={ProductInfoCollectionData.modalItr} showModalpopUp={"showModal2"}>
                                                <ItrModal forcePadding={true} skuRecords={skuRecords} spanText={this.props.spanText} priceToShow={this.props.priceToShow} modalProductDetails={SelectedModelData} ModalpopUp={"showModal2"} {... this.props} colorText={SelectedModelData.colorText} colorStyle={SelectedModelData.colorStyle} />
                                            </Modal> : null
                                            )}
                                        </parentContext.Consumer>

                                        <parentContext.Consumer>
                                            {({ showModal, SelectedModelData }) => (showModal.showModal3 === true ? <Modal modalDetails={ProductInfoCollectionData.modalSelecState} showModalpopUp={"showModal3"}>
                                                <SelectStateModal modalProductDetails={SelectedModelData} ModalpopUp={"showModal3"} staticLabels={staticLabels} stateList={this.states} fullCollectionData={this.props.fullCollectionData} />
                                            </Modal> : null
                                            )}
                                        </parentContext.Consumer>

                                        <parentContext.Consumer>
                                            {({ showModal, SelectedModelData, selectedCollProductId, SelectedEdd }) => (showModal.showModal4 === true ? <Modal modalDetails={ProductInfoCollectionData.modalAvailability} showModalpopUp={"showModal4"}>
                                                <AvailabilityModal SelectedEdd={SelectedEdd} fromCollection={true} fullCollectionData={this.props.fullCollectionData} ModalpopUp={"showModal4"} modalProductDetails={selectedCollProductId} staticLabels={staticLabels} productSizeId={this.props.productSizeId} SelectedModelData={SelectedModelData} estimatedDate={(e) => this.changeEdd(e, selectedCollProductId, SelectedEdd)} set_store_number={this.props.set_store_number} {... this.props} /> {/* added selectedEdd prop for bug id 23723 */}
                                            </Modal> : null
                                            )}
                                        </parentContext.Consumer>

                                        <parentContext.Consumer>
                                            {({ showModal, SelectedModelData, selectedCollProductId }) => (showModal.showAvailabilityItr === true ?
                                                <Modal modalDetails={ProductInfoCollectionData.modalAvailabilityItr} showModalpopUp={"showAvailabilityItr"}>
                                                    <AvailabilityModalItr fromCollection={true} ModalpopUp={"showAvailabilityItr"} SelectedModelData={SelectedModelData} modalProductDetails={selectedCollProductId} productSizeId={this.props.productSizeId} {... this.props} productType={this.props.productType && this.props.productType[0]} /> {/* fixes for 23669 -- added prop again to send [0] value */}
                                                </Modal> : null
                                            )}
                                        </parentContext.Consumer>


                                        <parentContext.Consumer>
                                            {({ showModal, SelectedModelData, closeModal }) => (showModal.showModal6 === true ?
                                                <Modal modalDetails={ProductInfoCollectionData.modalQty} showModalpopUp={"showModal6"} >
                                                    <QtyModal limited={this.props.limited} ModalpopUp={"showModal6"} onSelectModalQty={onSelectModalQty} closeModal={closeModal} />
                                                </Modal> : null
                                            )}
                                        </parentContext.Consumer>
                                        {(this.props.productType != 'Digital') &&
                                            <>
                                                <ProductQty validate_sku_selection={this.props.validate_sku_selection} limited={this.props.limited} isModal={this.props.isModal} productSelection={this.props.productSelection} handleAddToMyBag={this.props.handleAddToMyBag} qtyDropdownInfo={this.props.qtyDropdownInfo} QtyLabel={this.props.QtyLabel} QtyText={QtyTXT} dropDItem="dropdown-item" headLineText={QtyTXT} QtyBtn={Comprar} addCart={Agregarbtn} pdpCollection={this.props.selectButton} collectionProductId={this.props.collectionProductId} productSelection={this.props.productSelection} chanelBrandCss={this.props.chanelBrandCss} />
                                                <hr className="d-none d-lg-block mt-4" />
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
                                                <Modal modalDetails={ProductInfoCollectionData.modalGiftPurchase} showModalpopUp={"showModal14"}>
                                                    <ProductGiftPurchaseModal ModalpopUp={"showModal14"} staticLabels={staticLabels} gwpInfo={gwpInfo} />
                                                </Modal>
                                            </div>
                                        }
                                    </div>
                                }
                                {(isLoggedIn && eventCount > 0) && (this.props.pdpType && this.props.pdpType != "hybrid") &&
                                    <div className="row o-product__giftRegistry">
                                        <div className="col-12 mt-lg-3">
                                            <parentContext.Consumer>
                                                {({ OpenModal, closeModal, showModal }) => (
                                                    <React.Fragment>
                                                        <ButtonHeadlineIcon options={ProductInfoCollectionData.optionsButtonHeadlineIcon} onClick={() => checkSkuSelection().then(() => OpenModal('showModal15'))} />
                                                        <Buttonicon classButton={ProductInfoCollectionData.optionsButtonIcon.btnClass} handleClick={() => checkSkuSelection().then(() => OpenModal('showModal15'))} btnAttributes={optionsButtonIcon.btnAttributes} btnText={optionsButtonIcon.btnText} classIcon={optionsButtonIcon.iconClass} />
                                                        {showModal.showModal15 === true ? <Modal modalDetails={ProductInfoCollectionData.modalGiftRegistry} showModalpopUp={"showModal15"}>
                                                            <ProductGiftRegistry ModalpopUp={"showModal15"} giftRegistryModalInfo={giftRegistryModalInfo} closeModal={closeModal} />
                                                        </Modal> : null}
                                                    </React.Fragment>
                                                )}
                                            </parentContext.Consumer>
                                        </div>
                                    </div>
                                }
                                <div className="row o-product__swogo o-product__swogocontent">
                                    <div className="col">
                                        <div className="swogo-box" id="swogo-bundle-0"></div>
                                    </div>
                                </div>
                            </aside>

                        </div>
                    </div>
                }

                {isMarketPlace === "true" && (skuAttributeMapSize < 2 || anySizeSelected) &&
                    <div className="row o-product__marketPdp">
                        <div className="col-12" >
                            <ParagraphWithBlockNew options={productSpecs} HandleClick={() => { Router.push(productSpecs.bUrlp) }} />
                        </div>
                        {sellersCount > 1 &&
                            <div className="col-12 mb-4">
                                <Vendorspdp vendorsInfo={vendorsInfo} productSizeId={this.props.productSizeId} productId={this.props.productId} />
                            </div>
                        }
                    </div>
                }

            </aside>

        );
    }
}

