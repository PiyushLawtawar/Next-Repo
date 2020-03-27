/**
* Module Name : CheckoutStepThree
* Functionality : Component used to show the billing page. This is get called from \components\templates\checkout\CheckoutStep3.js
* @exports : CheckoutStepThree
* @requires : module:React
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Input/Input
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:next/router
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/molecules/ProductQty/ProductQty
* @requires : module:/molecules/MenuMotion/molecule-menu-motion
* @requires : module:/helpers/utilities/utility
* @requires : module:/atoms/Tab/atom-chunk-text
* @requires : module:/helpers/modal/modal
* @requires : module:/molecules/Modals/PromotionModal
* @requires : module:/contexts/parentContext
* @requires : module:/molecules/ProductQty/molecule-product-qty
* @requires : module:lodash/includes
* @requires : module:lodash/map
* @requires : module:lodash/isEmpty
* @requires : module:/helpers/config/config
* Team : Checkout Team
* Other information : Showing the billing page
* 
*/
import PromotionQty from './promotionQty.js';

import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { ParagraphWithBlockNew, ButtonHeadlineIcon } from '../../molecules/MixinMolecules/MixinMolecules';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import Input from '../../atoms/Input/Input';
import Label from '../../atoms/Label/Label';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Router from 'next/router';
import Icons from '../../atoms/Icons/Icons';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import ProductQty from '../../molecules/ProductQty/ProductQty';
import { ShowMotion, RemovePromotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import { Utility, GetPrice, UserAgentDetails, GetWithDecimal, getAssetsPath } from '../../../helpers/utilities/utility';
import { AtomChunkText } from '../../atoms/Tab/atom-chunk-text';

//include ../../molecules/modals/molecule-promos-modal
import Modal from '../../../helpers/modal/modal';
import PromotionModal from '../../molecules/Modals/PromotionModal';
import { parentContext } from '../../../contexts/parentContext';
import Quantity from '../../molecules/ProductQty/molecule-product-qty';
import includes from 'lodash/includes';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import { Path } from '../../../helpers/config/config';
import { getPriceInFormat } from '../../../helpers/utilities/utility';

export default class extends React.Component {
    /**
    * Method will call to redirecting page.
    * @function gotoCheckoutBilling
    * @author srinivasa.gorantla@zensar.com
    * @desc Page redirection is happening here.
    * @param {string} val
    * 
    */
    gotoCheckoutBilling = (val) => {
        window.scrollTo(0, 0);
        Router.push('/tienda/checkoutBilling', '/tienda/checkoutBilling')
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
        let  AssetsPath = '../../..';
        if (typeof window !== 'undefined') {
            const path = getAssetsPath(window,undefined); 
            AssetsPath = (path && path !='' && path.length > 9)?path:'../../..'; 
        }   
        const {priceInfo, itemInfo, shippingAddress, paymentDetail, defaultSinglePackageSelection, isPackageEligible, moreProductFlag, objectres, staticLabels, clickandcollect, EDDErrorMessages, configurationData} = this.props // defect 23300
        const orderedcardtypesmap = configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration && configurationData.configuration.liverpoolconfiguration.orderedcardtypesmap || [];
        let cartdTypes = {};
        const {enableEditAddress} = configurationData && configurationData.configuration && configurationData.configuration.flagConfiguration || 'false' // defect 23300
        let productType = [];
        let grItem = []
        if (defaultSinglePackageSelection == true && isPackageEligible == true) {
            map(itemInfo, (item, key) => {
                productType.push(item.productType)
            })
        } else {
            var itemInfoLength = itemInfo.length
            map(itemInfo, (item, key) => {
                productType.push(item.ItemType)
                if(item.eventNbr){ // changes for defect of 23794
                  grItem.push(item.eventNbr)
                }
            })

        }
        // Start change for 23827 defect 
        if(paymentDetail && paymentDetail.creditCardNumber && paymentDetail.creditCardNumber.length>4){
            paymentDetail.creditCardNumber = paymentDetail.creditCardNumber.slice(-4);
        }
        // End change for 23827 defect 

         Object.keys(orderedcardtypesmap).map(key => {
            const obj = orderedcardtypesmap[key];
            const name = Object.keys(obj)[0];
            const value = obj[name];
            cartdTypes[name.toLowerCase()] = value;
        })
        var digitalProduct = includes(productType, "Digital")
        if (!digitalProduct) {
            digitalProduct = includes(productType, "digital")
        }
        let digitalFlag = productType.every(v => v === 'Digital')
        if (!digitalProduct) {
            let digitalFlag = productType.every(v => v === 'digital')
        }
        let grFlag = grItem && grItem.length>0 && grItem.every(v => v && v !== undefined) // changes for defect of 23794

        let limited_Pieces = {}
        map(objectres, (item, i) => {
            limited_Pieces[item.sku] = item.piezas;

        });



        const { onSelectModalQty } = this.props.qtyModalInfo || {};

        const deliveryDesc = {
            bType: 'span',
            pText: 'Fecha estimada de entrega: ',
            pClass: 'a-checkout__headingDeliveryDesc',
            bText: '14 de diciembre - 17 de diciembre',
            bClass: 'a-checkout__headingDeliveryDate'
        };

        let securetitle = {

            bType: 'icon',
            pText: staticLabels['pwa.promotionPage.Nuestras.text'],
            bText: staticLabels['pwa.promotionPage.Nuestras.text'],
            bClass: 'icon-lock',
            pClass: 'a-checkout__secureTitle'
        }
        let price = {
            pText: '$4,000 ',
            pClass: 'a-product__paragraphRegularPrice m-0',
            bType: 'sup',
            bText: '00'
        }
        let discountedprice = {
            pText: '$00 ',
            pClass: 'a-product__paragraphRegularPrice --oldPrice m-0',
            bType: 'sup',
            bText: '00'
        }

        let checkoutsecure = {
            pText: staticLabels['pwa.promotionPage.Nuestras.text'],
            pClass: 'a-checkout__secureTitle',
            bType: 'icon',
            bText: '',
            bClass: "icon-lock",
            pPosition: "right"
        }

        let terms = {
            pText: staticLabels['pwa.promotionPage.acepto.text'],
            pClass: 'a-checkout__termsAndConditions',
            bType: 'anchor',
            bText: 'Términos, Condiciones y Aviso de Privacidad',
            bClass: "a-checkout__termsLink",
            bUrl: staticLabels['pwa.checkout.termsandconditions.linkUrl'] || '#',
            targetType: '_blank'
        };

        let optionsDelivery = {
            pText: 'Fecha estimada de entrega: ',
            pClass: 'a-checkout__headingDeliveryDesc ',
            bType: 'span',
            bText: '14 de diciembre - 17 de diciembre',
            bClass: 'a-checkout__headingDeliveryDate'
        }
        let options = {
            hText: 'No aplica promoción',
            hType: 'h2',
            btnModalAttributes: {
                "data-toggle": "modal",
                "data-target": "#promotion-modal",
                "id": "a-promotion-modal__btn"
            },
            iconClass: 'icon-arrow_right',
            divClass: 'm-product__giftRegistry-container d-lg-block',
            btnText: '',
            btnClass: 'a-btn a-btn--action --secondary a-checkout__btnPromotion'
        }
        let type = 'p';
        const modalQty = {
            modalId: "promotion-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "qty-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };
        return (
            <div className="container o-checkout__stepThree">
                <div className="row d-none d-lg-block">
                    <div className="col-12">
                        <H4 headLineClass="a-checkout__heading -headingMargin" headLineText={staticLabels['pwa.checkoutPagePromotion.Eligelapromocion.text']} />
                    </div>
                </div>


                <div className="row m-0 mt-3 mt-lg-0">
                    <div className="col-lg-8 col-12 order-1">

                        {
                            isPackageEligible ?
                                <div className="row align-items-center mb-4">
                                    <div className="col-12 m-box p-2" id='checkout_three'>
                                       { /*console.log('',defaultSinglePackageSelection)*/}
                                        <MaterialInputCheckBox text={staticLabels['pwa.checkoutPagePromotion.possibleShipments.label']} onChange={(e) => { this.props.ChangeIsPackageEligible(defaultSinglePackageSelection) }} checked={defaultSinglePackageSelection}
                                        />
                                    </div></div> :
                                null
                        }



                        <div className="row align-items-center m-box p-2 mb-2 d-none d-lg-flex">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-3 p-0">
                                <Paragraph className="a-checkout__headingTitle">{staticLabels['pwa.promotionPage.Nombre.text']}</Paragraph>
                            </div>
                            <div className="col-lg-2">
                                <Paragraph className="a-checkout__headingTitle">{staticLabels['pwa.orderConfirmationPage.Precio.text']}</Paragraph>
                            </div>
                            <div className="col-lg-2">
                                <Paragraph className="a-checkout__headingTitle">{staticLabels['pwa.orderDetailsPage.quantity.label']}</Paragraph>
                            </div>
                            <div className="col-lg-2">
                                <Paragraph className="a-checkout__headingTitle">{staticLabels['pwa.checkoutBagPage.total.text']}</Paragraph>
                            </div>
                            <div className="col-lg-1 p-0"></div>
                        </div>
                        <div className="row align-items-center mb-1">
                            {defaultSinglePackageSelection && isPackageEligible ?
                            
                                map(itemInfo, (item, itemInfoKey) => {

                                    let length = item.packedList.length - 1
                                    var productType = item.productType
                                    var packageDeliveryDate = item.packageDeliveryDate !== undefined ? item.packageDeliveryDate : ''

                                    return item.packedList && item.packedList.length > 1 ? (map(item.packedList, (item, key) => {

                                        return (
                                            <div className={length === key ? "col-12 m-box m-checkout__productAdded pt-3  " : "col-12 m-box m-checkout__productAdded pt-3 show"} key={key}>
                                                {
                                                    key === 0 ?
                                                        <div className="col-12 pl-0 mb-3 m-checkout__eddConsolidated show">
                                                            <Paragraph className="a-checkout__headingDeliveryTitle">Envío</Paragraph>
                                                            <ParagraphWithBlockNew options={{
                                                                bType: 'span',
                                                                pText: 'Fecha estimada de entrega: ',
                                                                pClass: 'a-checkout__headingDeliveryDesc',
                                                                bText: packageDeliveryDate,
                                                                bClass: 'a-checkout__headingDeliveryDate'
                                                            }} />
                                                        </div> : null
                                                }
                                                <div className="row justify-content-end justify-content-lg-between">
                                                    <div className="col-4 col-lg-2 p-1 order-1">
                                                        <Image className="a-checkout__imageProduct" src={item.imageURL} alt="product" />
                                                    </div>

                                                    <div className="col-7 col-lg-3 order-2 p-0">
                                                        <Paragraph className="a-checkout__titleProduct">{item.displayItemName}</Paragraph>
                                                        <Paragraph className="a-checkout__descriptionProduct a-checkout__productCode"> {staticLabels['pwa.promotionPage.Codigo.text']} {item.sellerSkuId !== undefined ? item.sellerSkuId : item.sku}</Paragraph>
                                                        {item.clothingSize != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productSize">{staticLabels['pwa.promotionPage.Talla.text']} {item.clothingSize}</Paragraph> : ''}
                                                        {item.dimensions != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.dimensions.label']}{': '}{item.dimensions} </Paragraph>
                                                            : ''}
                                                        {item.clothingColor != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">{staticLabels['pwa.promotionPage.Color.text']} {item.clothingColor}</Paragraph>
                                                            : ''}
                                                        {/*{(giftRegistryData && giftRegistryData.eventNumber && item.shoppingType) ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">Número de evento: {giftRegistryData.eventNumber}</Paragraph>
                                                            : ''}*/}
                                                        {item.material != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.material.label']}{item.material} </Paragraph>
                                                            : ''}
                                                        {item.texture != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.texture.label']}{item.texture} </Paragraph>
                                                            : ''}
                                                        {
                                                            (item.platform) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.plataforma.label']} {item.platform}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.edition) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.edition.label']} {item.edition}</Paragraph> : null
                                                        }


                                                        {
                                                            (item.format) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.format.label']} {item.format}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.language) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.idioma.label'] || 'Idioma:'} {item.language}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.license) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.licencia.label'] || 'Licencia:'} {item.license}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.validity) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.vigencia.label'] || 'Validez:'} {item.validity}</Paragraph> : null
                                                        }

                                                        {/*{item.quantity != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.OrderHistoryPage.quantity.lable']}{item.quantity} </Paragraph>
                                                            : ''}*/}
                                                        {/*{productType == 'Digital' ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.digital.sku.tipodecompra.label']}{productType.ItemType} </Paragraph>
                                                            : ''}*/}
                                                        {productType == 'Digital' ?
                                                            <React.Fragment>
                                                                <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.digital.sku.tipodecompra.label']}{productType} </Paragraph>
                                                                <AtomChunkText className="a-inlineElement -greenText" Type={type}>{staticLabels['pwa.checkoutDigital.download.message']}</AtomChunkText>
                                                            </React.Fragment>
                                                            : ''}
                                                        {item.productFlags !== undefined && item.productFlags.length > 0 && item.productFlags.indexOf('presale') !== -1 ?
                                                            <div className="m-flag">
                                                                <div className="m-flag-item -defaultFlag"><span>Preventa</span>
                                                                </div>
                                                            </div> : ''}
                                                        {item.sellerName != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">Vendido por :{item.sellerName} </Paragraph>
                                                            : ''}

                                                        {/*{
                                                            item.estimatedDeliveryDate != undefined ?
                                                                <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                    <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                    <Paragraph className="a-checkout__eddDescription --success">{item.estimatedDeliveryDate}</Paragraph>
                                                                </div> : ''
                                                        }*/}

                                                    </div>
                                                    <div className="col-1 text-right d-block d-lg-none order-3 pl-0">
                                                        {!item.promotionalParentSkuId &&
                                                            <RemovePromotion isShowMotion={item.isShowMotion} itemInfoKey={itemInfoKey} index={key} sku={item.sku} item={item} removeProduct={this.props.removeProduct} isShowMotionFun={this.props.isShowMotionFun} />
                                                        }

                                                    </div>

                                                    <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-lg-none">
                                                        {
                                                            item.salePrice != item.listPrice ?
                                                                <ParagraphWithBlockNew options={{
                                                                    pText: ` $ ${GetWithDecimal(item.listPrice, '2').val}`,
                                                                    pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                    bType: 'sup',
                                                                    bText: `  ${GetWithDecimal(item.listPrice, '2').decimal}`,
                                                                }} /> : ''
                                                        }

                                                        <ParagraphWithBlockNew options={{
                                                            pText: ` $ ${GetWithDecimal(item.salePrice, '2').val}`,
                                                            pClass: 'a-product__paragraphDiscountPrice m-0',
                                                            bType: 'sup',
                                                            bText: `  ${GetWithDecimal(item.salePrice, '2').decimal}`,

                                                        }} />

                                                    </div>
                                                    <div className="col-lg-2 d-none d-lg-block order-3">
                                                        {
                                                            item.salePrice != item.listPrice ?
                                                                <ParagraphWithBlockNew options={{
                                                                    pText: ` $ ${GetWithDecimal(item.listPrice, '2').val}`,
                                                                    pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                    bType: 'sup',
                                                                    bText: `  ${GetWithDecimal(item.listPrice, '2').decimal}`,
                                                                }} /> : ''
                                                        }

                                                        <ParagraphWithBlockNew options={{
                                                            pText: ` $ ${GetWithDecimal(item.salePrice, '2').val}`,
                                                            pClass: 'a-product__paragraphRegularPrice m-0',
                                                            bType: 'sup',
                                                            bText: `  ${GetWithDecimal(item.salePrice, '2').decimal}`,

                                                        }} />

                                                    </div>
                                                    <div className="col-8 col-lg-2 order-5 order-lg-4 pl-0 pl-lg-3">
                                                        <div className="m-product__qty d-none d-lg-block p-0 mb-0">
                                                            {
                                                                item.purchaseType === 'digital' || (item.promotionalParentSkuId !== undefined && item.promotionalParentSkuId !== null) ? <label className="a-inlineElement -quantityReadOnly">{item.quantity}</label> :
                                                                    <Quantity limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1} quantity={item.quantity} commerceId={item.commerceItemId} {...this.props} />
                                                            }
                                                        </div>


                                                        <PromotionQty
                                                            quantity={item.quantity}
                                                            commerceItemId={item.commerceItemId}
                                                            index={key}
                                                            updateItemQuantity={this.props.updateItemQuantity}
                                                            limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1}
                                                            purchaseType={item.purchaseType === 'digital' ? true : false}
                                                            promotionalParentSkuId={item.promotionalParentSkuId !== undefined && item.promotionalParentSkuId !== null ? true : false}

                                                        ></PromotionQty>

                                                        {
                                                            limited_Pieces[item.productId] === undefined ? '' : <Span className="a-checkout__minimunPurchase">Compra mínima {limited_Pieces[item.productId]} pzs.</Span>
                                                        }
                                                    </div>
                                                    <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-none d-lg-block">

                                                        <ParagraphWithBlockNew options={{
                                                            pText: ` $ ${GetWithDecimal(item.totalPrice, '2').val}`,
                                                            pClass: 'a-product__paragraphDiscountPrice m-0',
                                                            bType: 'sup',
                                                            bText: `  ${GetWithDecimal(item.totalPrice, '2').decimal}`,
                                                        }} />
                                                    </div>
                                                    <div className="col-lg-1 p-0 d-none d-lg-block order-6">
                                                        {
                                                            item.promoDescription !== undefined ?
                                                                <Link className="a-checkout__deleteBtn" onClick={(e) => { this.props.removeProduct(item) }}>{staticLabels['pwa.promotionPage.Eliminar.text']}</Link> : ''
                                                        }
                                                    </div>

                                                    <parentContext.Consumer>
                                                        {({ OpenModal }) => (
                                                            <div className="col-lg-5 offset-lg-2 order-8 mt-3 pl-lg-0">
                                                                {
                                                                    item.promoDescription !== undefined ? <div><Paragraph className="a-checkout__labelPromotion -mandatory">* <Span spanClassname="a-checkout__labelPromotion">Elige una promoción</Span>
                                                                    </Paragraph>
                                                                        <div className="m-product__giftRegistry-container d-lg-block">

                                                                            <ButtonHeadlineIcon options={{
                                                                                iconClass: item.promoDescription !== 'No aplica promoción' ? 'icon-arrow_right' : '',
                                                                                btnText: item.promoDescriptionPwa,
                                                                                html:true,
                                                                                btnClass: item.promoDescription === 'No aplica promoción' ? 'a-btn a-btn--action --secondary a-checkout__btnPromotion noCursor show ' : 'a-btn a-btn--action --secondary a-checkout__btnPromotion show '
                                                                            }}
                                                                                onClick={item.promoDescription !== 'No aplica promoción' ? () => { OpenModal('PromotionModal'), this.props.promotionClick(item.sku, item.commerceItemId) } : ''}
                                                                                data-toggle="modal"

                                                                            />
                                                                        </div></div> : ''
                                                                }
                                                            </div>
                                                        )}
                                                    </parentContext.Consumer>
                                                </div>
                                            </div>
                                        )




                                    })) : (item.packedList.length == 1 && item.packedList[0][0] == undefined) ? (map(item.packedList, (item, key) => {
                                       
                                        return (
                                            <div className={item.productFlags !== undefined && item.productFlags == "giftWithPurchase" ? 'col-12 m-box m-checkout__productAdded pt-3 show' : 'col-12 m-box m-checkout__productAdded pt-3'} key={key}>
                                                {/*<div className="col-12 pl-0 mb-3 m-checkout__eddConsolidated ">
                                                    <Paragraph className="a-checkout__headingDeliveryTitle">Envío</Paragraph>
                                                    <ParagraphWithBlockNew options={deliveryDesc} />
                                                </div>*/}
                                                <div className="row justify-content-end justify-content-lg-between">
                                                    <div className="col-4 col-lg-2 p-1 order-1">
                                                        <Image className="a-checkout__imageProduct" src={item.imageURL} alt="product" />
                                                    </div>

                                                    <div className="col-7 col-lg-3 order-2 p-0">
                                                        <Paragraph className="a-checkout__titleProduct">{item.displayItemName}</Paragraph>
                                                        <Paragraph className="a-checkout__descriptionProduct a-checkout__productCode">{staticLabels['pwa.promotionPage.Codigo.text']} {item.sellerSkuId !== undefined ? item.sellerSkuId : item.sku}</Paragraph>
                                                        {item.clothingSize != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productSize">{staticLabels['pwa.promotionPage.Talla.text']} {item.clothingSize}</Paragraph> : ''}
                                                        {item.dimensions != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.dimensions.label']}{': '}{item.dimensions} </Paragraph>
                                                            : ''}
                                                        {item.clothingColor != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">{staticLabels['pwa.promotionPage.Color.text']} {item.clothingColor}</Paragraph>
                                                            : ''}
                                                        {/*{(giftRegistryData && giftRegistryData.eventNumber && item.shoppingType) ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">Número de evento: {giftRegistryData.eventNumber}</Paragraph>
                                                            : ''}*/}
                                                        {item.material != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.material.label']}{item.material} </Paragraph>
                                                            : ''}
                                                        {item.texture != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.texture.label']}{item.texture} </Paragraph>
                                                            : ''}
                                                        {
                                                            (item.platform) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.plataforma.label']} {item.platform}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.edition) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.edition.label']} {item.edition}</Paragraph> : null
                                                        }


                                                        {
                                                            (item.format) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.format.label']} {item.format}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.language) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.idioma.label'] || 'Idioma:'} {item.language}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.license) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.licencia.label'] || 'Licencia:'} {item.license}</Paragraph> : null
                                                        }
                                                        {
                                                            (item.validity) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.vigencia.label'] || 'Validez:'} {item.validity}</Paragraph> : null
                                                        }

                                                        {/*{item.quantity != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.OrderHistoryPage.quantity.lable']}{item.quantity} </Paragraph>
                                                            : ''}*/}
                                                        {/*{item.ItemType == 'Digital' ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.digital.sku.tipodecompra.label']}{item.ItemType} </Paragraph>
                                                            : ''}*/}
                                                        {productType !== undefined && productType == 'Digital' ?
                                                            <React.Fragment>
                                                                <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.digital.sku.tipodecompra.label']}{productType} </Paragraph>
                                                                <AtomChunkText className="a-inlineElement -greenText" Type={type}>{staticLabels['pwa.checkoutDigital.download.message']}</AtomChunkText>
                                                            </React.Fragment>
                                                            : null}
                                                        {item.promotionalParentSkuId != undefined ? <div className="m-flag">
                                                            <div className="m-flag-item -defaultFlag"><span>Regalo</span>
                                                            </div>
                                                        </div> : ''}
                                                        {item.productFlags !== undefined && item.productFlags[0].length > 0 && item.productFlags[0] ?
                                                            <div className="m-flag">
                                                                <div className="m-flag-item -defaultFlag"><span>Preventa</span>
                                                                </div>
                                                            </div> : ''}
                                                        {item.sellerName != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">Vendido por :{item.sellerName} </Paragraph>
                                                            : ''}
                                                        {
                                                            item.productFlags !== undefined && item.productFlags.length > 0 && item.productFlags.indexOf('presale') !== -1 ?
                                                                <React.Fragment>
                                                                    <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                        <Paragraph className="a-checkout__eddDescription --success">El envío se realizará cuando el artículo este disponible</Paragraph>
                                                                    </div> </React.Fragment>
                                                                : item.estimatedDeliveryDate != undefined || EDDErrorMessages[item.sku] !== undefined ? <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                    <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                    <Paragraph className="a-checkout__eddDescription --success">{item.estimatedDeliveryDate ? item.estimatedDeliveryDate : EDDErrorMessages[item.sku]}</Paragraph>
                                                                </div>
                                                                    : ''
                                                        }

                                                    </div>
                                                    <div className="col-1 text-right d-block d-lg-none order-3 pl-0">
                                                        <RemovePromotion isShowMotion={item.isShowMotion} itemInfoKey={itemInfoKey} index={key} sku={item.sku} item={item} removeProduct={this.props.removeProduct} isShowMotionFun={this.props.isShowMotionFun} />
                                                    </div>

                                                    <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-lg-none">
                                                        {
                                                            item.salePrice != item.listPrice ?
                                                                <ParagraphWithBlockNew options={{
                                                                    pText: ` $ ${GetWithDecimal(item.listPrice, '2').val}`,
                                                                    pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                    bType: 'sup',
                                                                    bText: `  ${GetWithDecimal(item.listPrice, '2').decimal}`,
                                                                }} /> : ''
                                                        }

                                                        <ParagraphWithBlockNew options={{
                                                            pText: ` $ ${GetWithDecimal(item.salePrice, '2').val}`,
                                                            pClass: 'a-product__paragraphDiscountPrice m-0',
                                                            bType: 'sup',
                                                            bText: `  ${GetWithDecimal(item.salePrice, '2').decimal}`,

                                                        }} />

                                                    </div>
                                                    <div className="col-lg-2 d-none d-lg-block order-3">
                                                        {
                                                            item.salePrice != item.listPrice ?
                                                                <ParagraphWithBlockNew options={{
                                                                    pText: ` $ ${GetWithDecimal(item.listPrice, '2').val}`,
                                                                    pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                    bType: 'sup',
                                                                    bText: `  ${GetWithDecimal(item.listPrice, '2').decimal}`,
                                                                }} /> : ''
                                                        }

                                                        <ParagraphWithBlockNew options={{
                                                            pText: ` $ ${GetWithDecimal(item.salePrice, '2').val}`,
                                                            pClass: 'a-product__paragraphRegularPrice m-0',
                                                            bType: 'sup',
                                                            bText: `  ${GetWithDecimal(item.salePrice, '2').decimal}`,

                                                        }} />

                                                    </div>
                                                    <div className="col-8 col-lg-2 order-5 order-lg-4 pl-0 pl-lg-3">
                                                        <div className="m-product__qty d-none d-lg-block p-0 mb-0">
                                                            {
                                                                item.purchaseType === 'digital' || (item.promotionalParentSkuId !== undefined && item.promotionalParentSkuId !== null) ? <label className="a-inlineElement -quantityReadOnly">{item.quantity}</label> :
                                                                    <Quantity limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1} quantity={item.quantity} commerceId={item.commerceItemId} {...this.props} />
                                                            }
                                                        </div>


                                                        <PromotionQty
                                                            quantity={item.quantity}
                                                            commerceItemId={item.commerceItemId}
                                                            index={key}
                                                            updateItemQuantity={this.props.updateItemQuantity}
                                                            limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1}
                                                            purchaseType={item.purchaseType === 'digital' ? true : false}
                                                            promotionalParentSkuId={item.promotionalParentSkuId !== undefined && item.promotionalParentSkuId !== null ? true : false}

                                                        ></PromotionQty>

                                                        {
                                                            limited_Pieces[item.productId] === undefined ? '' : <Span className="a-checkout__minimunPurchase">Compra mínima {limited_Pieces[item.productId]} pzs.</Span>
                                                        }
                                                    </div>
                                                    <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-none d-lg-block">

                                                        <ParagraphWithBlockNew options={{
                                                            pText: ` $ ${GetWithDecimal(item.totalPrice, '2').val}`,
                                                            pClass: 'a-product__paragraphDiscountPrice m-0',
                                                            bType: 'sup',
                                                            bText: `  ${GetWithDecimal(item.totalPrice, '2').decimal}`,
                                                        }} />
                                                    </div>
                                                    <div className="col-lg-1 p-0 d-none d-lg-block order-6">
                                                        {
                                                            item.promoDescription !== undefined ?
                                                                <Link className="a-checkout__deleteBtn" onClick={(e) => { this.props.removeProduct(item) }}>{staticLabels['pwa.promotionPage.Eliminar.text']}</Link> : ''
                                                        }
                                                    </div>
                                                    <div className="col-lg-5 offset-lg-2 order-7 mt-lg-3 pl-lg-0 d-none d-lg-block">

                                                        {
                                                            (item.productFlags !== undefined && item.productFlags.length > 0 && item.productFlags.indexOf('presale') !== -1)
                                                                ? <Paragraph className="a-checkout__eddDescription --success">El envío se realizará cuando el artículo este disponible</Paragraph>

                                                                : item.estimatedDeliveryDate != undefined || EDDErrorMessages[item.sku] !== undefined ?
                                                                    <div className="m-checkout__edd mt-2 show">
                                                                        <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                        <Paragraph className="a-checkout__eddDescription --success">{item.estimatedDeliveryDate ? item.estimatedDeliveryDate : EDDErrorMessages[item.sku]}</Paragraph>
                                                                    </div> : ''

                                                        }

                                                    </div>
                                                    <parentContext.Consumer>
                                                        {({ OpenModal }) => (
                                                            <div className="col-lg-5 offset-lg-2 order-8 mt-3 pl-lg-0">
                                                                {
                                                                    item.promoDescription !== undefined ? <div><Paragraph className="a-checkout__labelPromotion -mandatory">* <Span spanClassname="a-checkout__labelPromotion">Elige una promoción</Span>
                                                                    </Paragraph>
                                                                        <div className="m-product__giftRegistry-container d-lg-block">

                                                                            <ButtonHeadlineIcon options={{
                                                                                iconClass: item.promoDescription !== 'No aplica promoción' ? 'icon-arrow_right' : '',
                                                                                btnText: item.promoDescriptionPwa,
                                                                                html:true,
                                                                                btnClass: item.promoDescription === 'No aplica promoción' ? 'a-btn a-btn--action --secondary a-checkout__btnPromotion noCursor show ' : 'a-btn a-btn--action --secondary a-checkout__btnPromotion show '
                                                                            }}
                                                                                onClick={item.promoDescription !== 'No aplica promoción' ? () => { OpenModal('PromotionModal'), this.props.promotionClick(item.sku, item.commerceItemId) } : ''}
                                                                                data-toggle="modal"

                                                                            />
                                                                        </div></div> : ''
                                                                }
                                                            </div>
                                                        )}
                                                    </parentContext.Consumer>
                                                </div>
                                            </div>
                                        )
                                    })) : (item.packedList.length == 1 && item.packedList[0].isBundle == true) ?
                                                <div className={item.packedList[0].productFlags !== undefined && item.packedList[0].productFlags == "giftWithPurchase" ? 'col-12 m-box m-checkout__productAdded pt-3 show' : 'col-12 m-box m-checkout__productAdded pt-3'}>
                                                    {/*<div className="col-12 pl-0 mb-3 m-checkout__eddConsolidated">
                                                        <Paragraph className="a-checkout__headingDeliveryTitle">Envío</Paragraph>
                                                        <ParagraphWithBlockNew options={deliveryDesc} />
                                                    </div>*/}
                                                    <div className="row justify-content-end justify-content-lg-between">
                                                        <div className="col-4 col-lg-2 p-1 order-1">
                                                            <Image className="a-checkout__imageProduct" src={item.packedList[0].imageURL} alt="product" />
                                                        </div>

                                                        <div className="col-7 col-lg-3 order-2 p-0">
                                                            {
                                                                map(item.packedList[0].bundleList, (item, key) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <Paragraph key={key} className="a-checkout__titleProduct">{item.displayName}</Paragraph>
                                                                            <Paragraph key={key} className="a-checkout__descriptionProduct a-checkout__productCode">{staticLabels['pwa.promotionPage.Codigo.text']} {item.bundleSKUId}</Paragraph>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }


                                                            {item.packedList[0].clothingSize != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productSize">{staticLabels['pwa.promotionPage.Talla.text']} {item.packedList[0].clothingSize}</Paragraph> : ''}
                                                            {item.packedList[0].dimensions != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.dimensions.label']}{': '}{item.packedList[0].dimensions} </Paragraph>
                                                                : ''}
                                                            {item.packedList[0].clothingColor != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">{staticLabels['pwa.promotionPage.Color.text']} {item.packedList[0].clothingColor}</Paragraph>
                                                                : ''}
                                                            {/*{(giftRegistryData && giftRegistryData.eventNumber && item.shoppingType) ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">Número de evento: {giftRegistryData.eventNumber}</Paragraph>
                                                                : ''}*/}
                                                            {item.packedList[0].material != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.material.label']}{item.packedList[0].material} </Paragraph>
                                                                : ''}
                                                            {item.packedList[0].texture != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.texture.label']}{item.packedList[0].texture} </Paragraph>
                                                                : ''}

                                                            {
                                                                (item.packedList[0].platform) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.plataforma.label']} {item.packedList[0].platform}</Paragraph> : null
                                                            }
                                                            {
                                                                (item.packedList[0].edition) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.edition.label']} {item.packedList[0].edition}</Paragraph> : null
                                                            }


                                                            {
                                                                (item.packedList[0].format) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.format.label']} {item.packedList[0].format}</Paragraph> : null
                                                            }
                                                            {
                                                                (item.packedList[0].language) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.idioma.label'] || 'Idioma:'} {item.packedList[0].language}</Paragraph> : null
                                                            }
                                                            {
                                                                (item.packedList[0].license) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.licencia.label'] || 'Licencia:'} {item.packedList[0].license}</Paragraph> : null
                                                            }
                                                            {
                                                                (item.packedList[0].validity) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.vigencia.label'] || 'Validez:'} {item.packedList[0].validity}</Paragraph> : null
                                                            }

                                                            {/*{item.packedList[0].quantity != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.OrderHistoryPage.quantity.lable']}{item.packedList[0].quantity} </Paragraph>
                                                                : ''}*/}
                                                            {item.packedList[0].ItemType == 'Digital' ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.digital.sku.tipodecompra.label']}{item.packedList[0].ItemType} </Paragraph>
                                                                : ''}

                                                            {item.packedList[0].promotionalParentSkuId != undefined ? <div className="m-flag">
                                                                <div className="m-flag-item -defaultFlag"><span>Regalo</span>
                                                                </div>
                                                            </div> : ''}

                                                            {item.packedList[0].productFlags !== undefined && item.packedList[0].productFlags.length > 0 && item.packedList[0].productFlags.indexOf('presale') !== -1 ?
                                                                <div className="m-flag">
                                                                    <div className="m-flag-item -defaultFlag"><span>Preventa</span>
                                                                    </div>
                                                                </div> : ''}
                                                            {item.packedList[0].sellerName != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">Vendido por :{item.packedList[0].sellerName} </Paragraph>
                                                                : ''}
                                                            {
                                                                item.packedList[0].productFlags !== undefined && item.packedList[0].productFlags.length > 0 && item.packedList[0].productFlags.indexOf('presale') !== -1 ? <React.Fragment>
                                                                    <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                        <Paragraph className="a-checkout__eddDescription --success">El envío se realizará cuando el artículo este disponible</Paragraph>
                                                                    </div> </React.Fragment>
                                                                    : item.packedList[0].estimatedDeliveryDate != undefined || EDDErrorMessages[item.packedList[0].sku] !== undefined ?
                                                                        <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                            <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                            <Paragraph className="a-checkout__eddDescription --success">{item.packedList[0].estimatedDeliveryDate ? item.packedList[0].estimatedDeliveryDate : EDDErrorMessages[item.packedList[0].sku]}</Paragraph>
                                                                        </div>
                                                                        : ''
                                                            }

                                                        </div>
                                                        <div className="col-1 text-right d-block d-lg-none order-3 pl-0">
                                                            <RemovePromotion isShowMotion={item.packedList[0].isShowMotion} itemInfoKey={itemInfoKey} index={itemInfoKey} sku={item.packedList[0].sku} item={item.packedList[0]} removeProduct={this.props.removeProduct} isShowMotionFun={this.props.isShowMotionFun} />
                                                        </div>
                                                        <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-lg-none">
                                                            {
                                                                item.packedList[0].salePrice != item.packedList[0].listPrice ?
                                                                    <ParagraphWithBlockNew options={{
                                                                        pText: ` $ ${GetWithDecimal(item.packedList[0].listPrice, '2').val}`,
                                                                        pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                        bType: 'sup',
                                                                        bText: `  ${GetWithDecimal(item.packedList[0].listPrice, '2').decimal}`,
                                                                    }} /> : ''
                                                            }

                                                            <ParagraphWithBlockNew options={{
                                                                pText: ` $ ${GetWithDecimal(item.packedList[0].salePrice, '2').val}`,
                                                                pClass: 'a-product__paragraphDiscountPrice m-0',
                                                                bType: 'sup',
                                                                bText: `  ${GetWithDecimal(item.packedList[0].salePrice, '2').decimal}`,

                                                            }} />

                                                        </div>

                                                        <div className="col-lg-2 d-none d-lg-block order-3">
                                                            {
                                                                item.packedList[0].salePrice != item.packedList[0].listPrice ?
                                                                    <ParagraphWithBlockNew options={{
                                                                        pText: ` $ ${GetWithDecimal(item.packedList[0].listPrice, '2').val}`,
                                                                        pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                        bType: 'sup',
                                                                        bText: `  ${GetWithDecimal(item.packedList[0].listPrice, '2').decimal}`,
                                                                    }} /> : ''
                                                            }

                                                            <ParagraphWithBlockNew options={{
                                                                pText: ` $ ${GetWithDecimal(item.packedList[0].salePrice, '2').val}`,
                                                                pClass: 'a-product__paragraphRegularPrice m-0',
                                                                bType: 'sup',
                                                                bText: `  ${GetWithDecimal(item.packedList[0].salePrice, '2').decimal}`,

                                                            }} />

                                                        </div>
                                                        <div className="col-8 col-lg-2 order-5 order-lg-4 pl-0 pl-lg-3">
                                                            <div className="m-product__qty d-none d-lg-block p-0 mb-0">
                                                                {
                                                                    item.packedList[0].purchaseType === 'digital' || (item.packedList[0].promotionalParentSkuId !== undefined && item.packedList[0].promotionalParentSkuId !== null) ? <label className="a-inlineElement -quantityReadOnly">{item.quantity}</label> :
                                                                        <Quantity limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1} quantity={item.quantity} commerceId={item.commerceItemId} {...this.props} />
                                                                }
                                                            </div>


                                                            <PromotionQty
                                                                quantity={item.quantity}
                                                                commerceItemId={item.commerceItemId}
                                                                index={itemInfoKey}
                                                                updateItemQuantity={this.props.updateItemQuantity}
                                                                limited_Pieces={limited_Pieces[item.packedList[0].productId] !== undefined ? limited_Pieces[item.packedList[0].productId] : 1}
                                                                purchaseType={item.packedList[0].purchaseType === 'digital' ? true : false}
                                                                promotionalParentSkuId={item.packedList[0].promotionalParentSkuId !== undefined && item.packedList[0].promotionalParentSkuId !== null ? true : false}

                                                            ></PromotionQty>

                                                            {
                                                                limited_Pieces[item.packedList[0].productId] === undefined ? '' : <Span className="a-checkout__minimunPurchase">Compra mínima {limited_Pieces[item.packedList[0].productId]} pzs.</Span>
                                                            }
                                                        </div>
                                                        <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-none d-lg-block">

                                                            <ParagraphWithBlockNew options={{
                                                                pText: ` $ ${GetWithDecimal(item.packedList[0].totalPrice, '2').val}`,
                                                                pClass: 'a-product__paragraphDiscountPrice m-0',
                                                                bType: 'sup',
                                                                bText: `  ${GetWithDecimal(item.packedList[0].totalPrice, '2').decimal}`,
                                                            }} />
                                                        </div>
                                                        <div className="col-lg-1 p-0 d-none d-lg-block order-6">
                                                            {
                                                                item.promoDescription !== undefined ?
                                                                    <Link className="a-checkout__deleteBtn" onClick={(e) => { this.props.removeProduct(item) }}>{staticLabels['pwa.promotionPage.Eliminar.text']}</Link> : ''
                                                            }
                                                        </div>
                                                        <div className="col-lg-5 offset-lg-2 order-7 mt-lg-3 pl-lg-0 d-none d-lg-block">
                                                            {
                                                                item.packedList[0].productFlags !== undefined && item.packedList[0].productFlags.length > 0 && item.packedList[0].productFlags.indexOf('presale') !== -1 ?
                                                                    <Paragraph className="a-checkout__eddDescription --success">El envío se realizará cuando el artículo este disponible</Paragraph>
                                                                    : item.packedList[0].bundleList[0].estimatedDeliveryDate != undefined || EDDErrorMessages[item.packedList[0].bundleList[0].sku] !== undefined ?
                                                                        <div className="m-checkout__edd mt-2 show">
                                                                            <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                            <Paragraph className="a-checkout__eddDescription --success">{item.packedList[0].bundleList[0].estimatedDeliveryDate ? item.packedList[0].bundleList[0].estimatedDeliveryDate : EDDErrorMessages[item.packedList[0].bundleList[0].sku]}</Paragraph>
                                                                        </div>
                                                                        : ''
                                                            }
                                                        </div>
                                                        <parentContext.Consumer>
                                                            {({ OpenModal }) => (
                                                                <div className="col-lg-5 offset-lg-2 order-8 mt-3 pl-lg-0">
                                                                    {
                                                                        item.packedList[0].promoDescription !== undefined ? <div><Paragraph className="a-checkout__labelPromotion -mandatory">* <Span spanClassname="a-checkout__labelPromotion">Elige una promoción</Span>
                                                                        </Paragraph>
                                                                            <div className="m-product__giftRegistry-container d-lg-block">

                                                                                <ButtonHeadlineIcon options={{
                                                                                    iconClass: item.packedList[0].promoDescription !== 'No aplica promoción' ? 'icon-arrow_right' : '',
                                                                                    btnText: item.promoDescriptionPwa,
                                                                                    html:true,
                                                                                    btnClass: item.packedList[0].promoDescription === 'No aplica promoción' ? 'a-btn a-btn--action --secondary a-checkout__btnPromotion noCursor show ' : 'a-btn a-btn--action --secondary a-checkout__btnPromotion show '
                                                                                }}
                                                                                    onClick={item.packedList[0] !== 'No aplica promoción' ? () => { OpenModal('PromotionModal'), this.props.promotionClick(item.sku, item.commerceItemId) } : ''}
                                                                                    data-toggle="modal"

                                                                                />
                                                                            </div></div> : ''
                                                                    }
                                                                </div>
                                                            )}
                                                        </parentContext.Consumer>
                                                    </div>
                                                </div>
                                                : ''



                                }) : map(itemInfo, (item, itemInfoKey) => {

                                    return (
                                        <div className={item.productFlags !== undefined && item.productFlags == "giftWithPurchase" ? 'col-12 m-box m-checkout__productAdded pt-3 show' : 'col-12 m-box m-checkout__productAdded pt-3'} key={itemInfoKey}>

                                            {/*<div className="col-12 pl-0 mb-3 m-checkout__eddConsolidated">
                                                <Paragraph className="a-checkout__headingDeliveryTitle">Envío</Paragraph>
                                                <ParagraphWithBlockNew options={deliveryDesc} />
                                            </div>*/}
                                            <div className="row justify-content-end justify-content-lg-between">
                                                <div className="col-4 col-lg-2 p-1 order-1">
                                                    <Image className="a-checkout__imageProduct" src={item.imageURL} alt="product" />
                                                </div>

                                                <div className="col-7 col-lg-3 order-2 p-0">
                                                    {item.isBundle != undefined && item.isBundle == true ?
                                                        map(item.bundleList, (item, key) => {
                                                            return (
                                                                <React.Fragment key={key}>
                                                                    <Paragraph className="a-checkout__titleProduct">{item.displayName}</Paragraph>
                                                                    <Paragraph className="a-checkout__descriptionProduct a-checkout__productCode">{staticLabels['pwa.promotionPage.Codigo.text']} {item.bundleSKUId}</Paragraph>
                                                                </React.Fragment>
                                                            )
                                                        }) : <React.Fragment>  <Paragraph className="a-checkout__titleProduct">{item.displayItemName}</Paragraph>
                                                            <Paragraph className="a-checkout__descriptionProduct a-checkout__productCode">{staticLabels['pwa.promotionPage.Codigo.text']} {item.sellerSkuId !== undefined ? item.sellerSkuId : item.sku}</Paragraph>
                                                        </React.Fragment>
                                                    }

                                                    {item.clothingSize != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productSize">{staticLabels['pwa.promotionPage.Talla.text']} {item.clothingSize}</Paragraph> : ''}
                                                    {item.dimensions != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.dimensions.label']}{': '}{item.dimensions} </Paragraph>
                                                        : ''}
                                                    {item.clothingColor != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">{staticLabels['pwa.promotionPage.Color.text']} {item.clothingColor}</Paragraph>
                                                        : ''}
                                                    {item.eventNbr != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productColor">Número de evento: {item.eventNbr}</Paragraph>
                                                        : ''}
                                                    {item.material != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.material.label']}{item.material} </Paragraph>
                                                        : ''}
                                                    {item.texture != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.cart.texture.label']}{item.texture} </Paragraph>
                                                        : ''}
                                                    {
                                                        (item.platform) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.plataforma.label']} {item.platform}</Paragraph> : null
                                                    }
                                                    {
                                                        (item.edition) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.edition.label']} {item.edition}</Paragraph> : null
                                                    }


                                                    {
                                                        (item.format) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.format.label']} {item.format}</Paragraph> : null
                                                    }
                                                    {
                                                        (item.language) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.idioma.label'] || 'Idioma:'} {item.language}</Paragraph> : null
                                                    }
                                                    {
                                                        (item.license) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.licencia.label'] || 'Licencia:'} {item.license}</Paragraph> : null
                                                    }
                                                    {
                                                        (item.validity) ? <Paragraph className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLabels['pwa.digital.sku.vigencia.label'] || 'Validez:'} {item.validity}</Paragraph> : null
                                                    }

                                                    {/*{item.quantity != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.OrderHistoryPage.quantity.lable']}{item.quantity} </Paragraph>
                                                        : ''}*/}
                                                    {item.ItemType == 'Digital' || item.ItemType == 'digital' ?
                                                        <React.Fragment>
                                                            <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">{staticLabels['pwa.digital.sku.tipodecompra.label']}{item.ItemType} </Paragraph>
                                                            <AtomChunkText className="a-inlineElement -greenText" Type={type}>{staticLabels['pwa.checkoutDigital.download.message']}</AtomChunkText>
                                                        </React.Fragment>
                                                        : ''}
                                                    {item.promotionalParentSkuId != undefined ?
                                                        <div className="m-flag">
                                                            <div className="m-flag-item -defaultFlag"><span>Regalo</span>
                                                            </div>
                                                        </div> : ''}
                                                    {item.productFlags !== undefined && item.productFlags.length > 0 && item.productFlags.indexOf('presale') !== -1 ?
                                                        <div className="m-flag">
                                                            <div className="m-flag-item -defaultFlag"><span>Preventa</span>
                                                            </div>
                                                        </div> : ''}
                                                    {item.sellerName != undefined ? <Paragraph className="a-checkout__descriptionProduct a-checkout__productMaterial">Vendido por :{item.sellerName} </Paragraph>
                                                        : ''}
                                                    {
                                                        item.productFlags !== undefined && item.productFlags.length > 0 && item.productFlags.indexOf('presale') !== -1 ?
                                                            <React.Fragment>
                                                                <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                    <Paragraph className="a-checkout__eddDescription --success">El envío se realizará cuando el artículo este disponible</Paragraph>
                                                                </div> </React.Fragment>
                                                            : item.estimatedDeliveryDate != undefined || EDDErrorMessages[item.sku] !== undefined ? <div className="m-checkout__edd mt-2 d-block d-lg-none show">
                                                                <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                <Paragraph className="a-checkout__eddDescription --success">{item.estimatedDeliveryDate ? item.estimatedDeliveryDate : EDDErrorMessages[item.sku]}</Paragraph>
                                                            </div>
                                                                : ''
                                                    }
                                                </div>
                                                <div className="col-1 text-right d-block d-lg-none order-3 pl-0">
                                                    {!item.promotionalParentSkuId &&
                                                        <RemovePromotion isShowMotion={item.isShowMotion} itemInfoKey={itemInfoKey} index={itemInfoKey} sku={itemInfoKey} item={item} removeProduct={this.props.removeProduct} isShowMotionFun={this.props.isShowMotionFun} />
                                                    }

                                                </div>

                                                <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-lg-none">
                                                    {
                                                        item.salePrice != item.listPrice ?
                                                            <ParagraphWithBlockNew options={{
                                                                pText: ` $ ${GetWithDecimal(item.listPrice, '2').val}`,
                                                                pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                bType: 'sup',
                                                                bText: `  ${GetWithDecimal(item.listPrice, '2').decimal}`,
                                                            }} /> : ''
                                                    }

                                                    <ParagraphWithBlockNew options={{
                                                        pText: ` $ ${GetWithDecimal(item.salePrice, '2').val}`,
                                                        pClass: 'a-product__paragraphDiscountPrice m-0',
                                                        bType: 'sup',
                                                        bText: `  ${GetWithDecimal(item.salePrice, '2').decimal}`,

                                                    }} />

                                                </div>
                                                <div className="col-lg-2 d-none d-lg-block order-3">
                                                    {
                                                        item.salePrice != item.listPrice ?
                                                            <ParagraphWithBlockNew options={{
                                                                pText: ` $ ${GetWithDecimal(item.listPrice, '2').val}`,
                                                                pClass: 'a-product__paragraphRegularPrice --oldPrice a-product__paragraphRegularPrice--oldPrice m-0',
                                                                bType: 'sup',
                                                                bText: `  ${GetWithDecimal(item.listPrice, '2').decimal}`,
                                                            }} /> : ''
                                                    }

                                                    <ParagraphWithBlockNew options={{
                                                        pText: ` $ ${GetWithDecimal(item.salePrice, '2').val}`,
                                                        pClass: 'a-product__paragraphRegularPrice m-0',
                                                        bType: 'sup',
                                                        bText: `  ${GetWithDecimal(item.salePrice, '2').decimal}`,

                                                    }} />

                                                </div>
                                                <div className="col-8 col-lg-2 order-5 order-lg-4 pl-0 pl-lg-3">
                                                    <div className="m-product__qty d-none d-lg-block p-0 mb-0">
                                                        {
                                                            item.purchaseType === 'digital' || (item.promotionalParentSkuId !== undefined && item.promotionalParentSkuId !== null) ? <label className="a-inlineElement -quantityReadOnly">{item.quantity}</label> :
                                                                <Quantity limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1} quantity={item.quantity} commerceId={item.commerceItemId} {...this.props} />
                                                        }
                                                    </div>


                                                    <PromotionQty
                                                        quantity={item.quantity}
                                                        commerceItemId={item.commerceItemId}
                                                        index={itemInfoKey}
                                                        updateItemQuantity={this.props.updateItemQuantity}
                                                        limited_Pieces={limited_Pieces[item.productId] !== undefined ? limited_Pieces[item.productId] : 1}
                                                        purchaseType={item.purchaseType === 'digital' ? true : false}
                                                        promotionalParentSkuId={item.promotionalParentSkuId !== undefined && item.promotionalParentSkuId !== null ? true : false}
                                                    ></PromotionQty>

                                                    {
                                                        limited_Pieces[item.productId] === undefined ? '' : <Span className="a-checkout__minimunPurchase">Compra mínima {limited_Pieces[item.productId]} pzs.</Span>
                                                    }


                                                </div>
                                                <div className="col-8 col-lg-2 order-4 order-lg-5 mt-3 mb-3 m-lg-0 pl-0 pl-lg-3 d-none d-lg-block ">


                                                    <ParagraphWithBlockNew options={{
                                                        pText: ` $ ${GetWithDecimal(item.totalPrice, '2').val}`,
                                                        pClass: 'a-product__paragraphDiscountPrice m-0',
                                                        bType: 'sup',
                                                        bText: `  ${GetWithDecimal(item.totalPrice, '2').decimal}`,
                                                    }} />
                                                </div>
                                                <div className="col-lg-1 p-0 d-none d-lg-block order-6">
                                                    {
                                                        item.promoDescription !== undefined ?
                                                            <Link className="a-checkout__deleteBtn" onClick={(e) => { this.props.removeProduct(item) }}>{staticLabels['pwa.promotionPage.Eliminar.text']}</Link> : ''
                                                    }
                                                </div>
                                                <div className="col-lg-5 offset-lg-2 order-7 mt-lg-3 pl-lg-0 d-none d-lg-block">
                                                    {
                                                        (item.productFlags !== undefined && item.productFlags.length>0 && item.productFlags.indexOf('presale') !== -1)
                                                            ? <Paragraph className="a-checkout__eddDescription --success">El envío se realizará cuando el artículo este disponible</Paragraph>

                                                            : (item.estimatedDeliveryDate != undefined || (EDDErrorMessages[item.sku] !== undefined || (item.isBundle && item[0] && item[0].estimatedDeliveryDate !==undefined )) )?
                                                                <div className="m-checkout__edd mt-2 show"> {/*24017 need to display same message similar to cart page.*/}
                                                                    <Paragraph className="a-checkout__eddTitle">Fecha estimada de entrega:</Paragraph>
                                                                    <Paragraph className="a-checkout__eddDescription --success">{item.estimatedDeliveryDate ? item.estimatedDeliveryDate : (item.isBundle && item[0] && item[0].estimatedDeliveryDate !==undefined )? item[0].estimatedDeliveryDate : (EDDErrorMessages[item.sku])}</Paragraph>
                                                                </div> : ''

                                                    }
                                                </div>
                                                <parentContext.Consumer>
                                                    {({ OpenModal }) => (
                                                        <div className="col-lg-5 offset-lg-2 order-8 mt-3 pl-lg-0">
                                                            {
                                                                item.promoDescription !== undefined ? <React.Fragment> <Paragraph className="a-checkout__labelPromotion -mandatory">* <Span spanClassname="a-checkout__labelPromotion">Elige una promoción</Span>
                                                                </Paragraph>
                                                                    <div className="m-product__giftRegistry-container d-lg-block">

                                                                        <ButtonHeadlineIcon options={{
                                                                            iconClass: item.promoDescription !== 'No aplica promoción' ? 'icon-arrow_right' : '',
                                                                            btnText: item.promoDescriptionPwa,
                                                                            html:true,
                                                                            btnClass: item.promoDescription === 'No aplica promoción' ? 'a-btn a-btn--action --secondary a-checkout__btnPromotion noCursor show ' : 'a-btn a-btn--action --secondary a-checkout__btnPromotion show '
                                                                        }}
                                                                            onClick={item.promoDescription !== 'No aplica promoción' ? () => { OpenModal('PromotionModal'), this.props.promotionClick(item.sku, item.commerceItemId) } : ''}
                                                                            data-toggle="modal"

                                                                        />
                                                                    </div> </React.Fragment> : ''
                                                            }

                                                        </div>
                                                    )}
                                                </parentContext.Consumer>
                                            </div>
                                        </div>
                                    )
                                })
                            }


                            <parentContext.Consumer>
                                {({ showModal, SelectedModelData, closeModal }) => (showModal.PromotionModal === true && this.props.PromotionalData !== undefined && this.props.PromotionalData.length > 0 && this.props.PromotionalData[0][0].promoDescription !== 'No aplica promoción' ?
                                    <Modal modalDetails={modalQty} showModalpopUp={"PromotionModal"} modalId='promotion-modal'>
                                        <PromotionModal ModalpopUp={"PromotionModal"} PromotionalData={this.props.PromotionalData} commerceItemId={this.props.commerceItemId} onSelectModalQty={onSelectModalQty} closeModal={closeModal} />
                                    </Modal> : null
                                )}
                            </parentContext.Consumer>

                        </div>
                    </div>



                    <div className="col-lg-4 col-12 order-2 d-lg-block p-0 pl-lg-3 leftPanel">


                        <div className="row">
                            <div className="col-12 order-3 order-lg-1">
                                <div className="m-box mb-4">
                                    <div className="row no-gutters align-items-center justify-content-between">
                                        <div className="col-12">
                                            <H5 headLineClass="a-box__heading" headLineText={staticLabels['pwa.checkoutBagPage.heading.text']} />
                                        </div>
                                    </div>
                                    <hr className="mb-3" />
                                    <div className="row no-gutters align-items-center justify-content-between">
                                        <div className="col-auto">
                                            <Label className="a-box__resume">{staticLabels['pwa.checkoutBagPage.subtotal.text']}({priceInfo.totalCommerceItemCount} {staticLabels['pwa.checkoutBagPage.productos.text']}):</Label>
                                        </div>
                                        <div className="col-auto">
                                            <Label className="a-box__resume">${getPriceInFormat(priceInfo.Subtotal)} </Label>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center justify-content-between">
                                        <div className="col-auto">
                                            <Label className="a-box__resume">{staticLabels['pwa.checkoutBagPage.descuento.text']}</Label>
                                        </div>
                                        <div className="col-auto">
                                            <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.institutionalPromotionDiscount)}</Label>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center justify-content-between">
                                        <div className="col-auto">
                                            <Label className="a-box__resume">{staticLabels['pwa.checkoutBagPage.codigoPromocion.text']}</Label>
                                        </div>
                                        <div className="col-auto">
                                            <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.couponDiscount)}</Label>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center justify-content-between mb-2">
                                        <div className="col-auto">
                                            <Label className="a-box__resume">{staticLabels['pwa.checkoutBagPage.cdl.shippingcost.label']}</Label>
                                        </div>
                                        <div className="col-auto">
                                            <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.shippingCost)}</Label>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center justify-content-between mb-3">
                                        <div className="col-auto">
                                            <Label className="a-box__resume -totalLabel">{staticLabels['pwa.checkoutBagPage.total.text']}:</Label>
                                        </div>
                                        <div className="col-auto">
                                            <Label className="a-box__resume -totalPrice">$ {getPriceInFormat(priceInfo.Total)}</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>





                            {/*end of For paypal page*/}
                            {digitalFlag ? <div className="col-12 order-1 order-lg-2">
                                <div className="m-box mb-4">
                                    <div className="row no-gutters align-items-center justify-content-between">
                                        <div className="col-12">
                                            <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.delivery.text']} />

                                        </div>

                                    </div>
                                    <hr className="mb-3" />
                                    <div className="row no-gutters align-items-center justify-content-between mb-2">
                                        <div className="col-12">
                                            <H5 headLineClass="a-box__title mb-2" headLineText="Descarga Digital" />
                                            <Paragraph className="a-checkoutBox__description --alertMessage">Recuerda que en compras digitales no contamos con cambios ni devoluciones.
                                                           </Paragraph>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                                (!grFlag && !isEmpty(shippingAddress)) ?
                                    <div className="col-12 order-1 order-lg-2">
                                        <div className="m-box mb-4">

                                            <div >
                                                <div className="row no-gutters align-items-center justify-content-between">
                                                    <div className="col-12">
                                                        <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.delivery.text']} />

                                                    </div>

                                                </div>
                                                <hr className="mb-3" />

                                                <div className="row no-gutters align-items-center justify-content-between mb-2">

                                                    <div className="col-11 col-lg-12">
                                                        {
                                                            shippingAddress.storePickup ?
                                                                <Paragraph className="a-checkoutBox__subtitle">{staticLabels['pwa.checkoutShippingPage.recog.text']} { clickandcollect === 'ccd' ? <Label className="a-box__clickCollect ml-3" for="">Click & Collect Drive thru</Label> : null}</Paragraph>

                                                                : <Paragraph className="a-checkoutBox__subtitle">{staticLabels['pwa.checkoutShippingPage.GRShippingAddressTitle.text']} {clickandcollect === 'ccd' ? <Label className="a-box__clickCollect ml-3" for="">Click & Collect Drive thru</Label> : null}</Paragraph>
                                                        }

                                                        <div className="row no-gutters align-items-center justify-content-between">
                                                            {
                                                                (shippingAddress && shippingAddress.nickName) ?
                                                                    <div className="col-auto">
                                                                        <Label className="a-box__resume mt-3" for="">{shippingAddress.nickName}</Label>
                                                                    </div>
                                                                    : shippingAddress.storePickup ?
                                                                        <div className="col-auto">
                                                                            <Label className="a-box__resume mt-3" for="">{shippingAddress.state}</Label>
                                                                        </div> : null
                                                            }

                                                        </div>
                                                        <Paragraph style={{ display: "inline-block", wordWrap: "break-word", wordBreak: "break-all" }} className="a-checkoutBox__description">
                                                            {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.colony}, {shippingAddress.postalCode}, {shippingAddress.phoneNumber}
                                                        </Paragraph>

                                                        {shippingAddress.postalCode &&
                                                            <Link className="a-checkoutBox__link d-none d-lg-block" href="/tienda/checkoutShipping" onClick={() => { Router.push('/tienda/checkoutShipping', '/tienda/checkoutShipping') }}>
                                                            {staticLabels['pwa.checkoutShippingPage.edit_delivery_address.text'] || "Modificar dirección de entrega"}</Link>
                                                        }

                                                    </div>
                                                    <div className="col-1 d-block d-lg-none text-right">
                                                        <Icons className="icon-arrow_right" onClick={() => { Router.push('/tienda/checkoutShipping', '/tienda/checkoutShipping') }} />
                                                    </div>
                                                </div>
                                            </div>


                                            {
                                                digitalProduct ?
                                                    <React.Fragment>
                                                        <hr className="mb-3" />
                                                        <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                            <div className="col-12">
                                                                <H5 headLineClass="a-box__title mb-2" headLineText="Descarga Digital" />
                                                                <Paragraph className="a-checkoutBox__description --alertMessage">Recuerda que en compras digitales no contamos con cambios ni devoluciones.
                                                           </Paragraph>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>

                                                    : ''
                                            }
                                        </div>
                                    </div>
                                    : digitalProduct ? <div className="col-12 order-1 order-lg-2">
                                        <div className="m-box mb-4">
                                            <div className="row no-gutters align-items-center justify-content-between">
                                                <div className="col-12">
                                                    <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.delivery.text']} />

                                                </div>

                                            </div>
                                            <hr className="mb-3" />
                                            <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                <div className="col-12">
                                                    <H5 headLineClass="a-box__title mb-2" headLineText="Descarga Digital" />
                                                    <Paragraph className="a-checkoutBox__description --alertMessage">Recuerda que en compras digitales no contamos con cambios ni devoluciones.
                                                           </Paragraph>
                                                </div>
                                            </div>
                                        </div>
                                    </div> : <div className="col-12 order-1 order-lg-2">
                                        <div className="m-box mb-4">
                                            <div className="row no-gutters align-items-center justify-content-between">
                                                <div className="col-12">
                                                    <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.delivery.text']} />
                                                </div>
                                            </div>
                                            <hr className="mb-3" />
                                            <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                <div className="col-12">
                                                    <H5 headLineClass="a-box__title mb-2" headLineText={staticLabels["pwa.checkoutShippingPage.GRShippingAddressTitle.text"]}/>
                                                    <Paragraph className="a-checkoutBox__description">{staticLabels["pwa.checkoutShippingPage.GRShippingAddressInfo.text"]}</Paragraph>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                            {/*23546 Related fixes*/}
                            {
                                paymentDetail['Forma de pago'] === 'Pago: Paypal' ?

                                    <div className="col-12 order-2 order-lg-3">
                                        <div className="m-box mb-4">
                                            <div className="row no-gutters align-items-center justify-content-between">
                                                <div className="col-12">
                                                    <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.Methodofpayment.text']} />
                                                </div>
                                            </div>
                                            <hr className="mb-3" />
                                            <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                <div className="col-11 col-lg-12">
                                                    <Image className="a-checkout__paymentPaypal" src={AssetsPath + "/static/images/atomo-icono-paypal.svg"} alt="paypal" />
                                                    <Link className="a-checkoutBox__link d-none d-lg-block" href="/tienda/checkoutBilling" onClick={() => { this.gotoCheckoutBilling('paypal') }} >Modificar forma de pago</Link>
                                                </div>
                                                <div className="col-1 d-block d-lg-none text-right">
                                                    <Icons className="icon-arrow_right" onClick={() => { this.gotoCheckoutBilling('paypal') }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div> : paymentDetail['Forma de pago'] === "Efectivo" ?
                                        <div className="col-12 order-2 order-lg-3">
                                            <div className="m-box -paymentMethod mb-4">
                                                <div className="row no-gutters align-items-center justify-content-between">
                                                    <div className="col-12">
                                                        <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.Methodofpayment.text']} />
                                                    </div>
                                                </div>
                                                <hr className="mb-3" />
                                                <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                    <div className="col-11 col-lg-12">
                                                        <Paragraph className="a-checkoutBox__subtitle">{paymentDetail['Forma de pago']}</Paragraph>

                                                        <Link className="a-checkoutBox__link d-none d-lg-block" href="/tienda/checkoutBilling" onClick={() => { this.gotoCheckoutBilling('CIEBancomer') }}>Modificar forma de pago</Link>
                                                    </div>
                                                    <div className="col-1 d-block d-lg-none text-right">
                                                        <Icons className="icon-arrow_right" onClick={() => { this.gotoCheckoutBilling('CIEBancomer') }} />
                                                    </div>
                                                </div>
                                            </div>

                                        </div> : paymentDetail['Forma de pago'] === "Transferencia" ?
                                            <div className="col-12 order-2 order-lg-3">
                                                <div className="m-box -paymentMethod mb-4">
                                                    <div className="row no-gutters align-items-center justify-content-between">
                                                        <div className="col-12">
                                                            <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.Methodofpayment.text']} />
                                                        </div>
                                                    </div>
                                                    <hr className="mb-3" />
                                                    <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                        <div className="col-11 col-lg-12">
                                                            <Paragraph className="a-checkoutBox__subtitle">{paymentDetail['Forma de pago']}</Paragraph>

                                                            <Link className="a-checkoutBox__link d-none d-lg-block" href="/tienda/checkoutBilling" onClick={() => { this.gotoCheckoutBilling('CIEBancomer') }}>Modificar forma de pago</Link>
                                                        </div>
                                                        <div className="col-1 d-block d-lg-none text-right">
                                                            <Icons className="icon-arrow_right" onClick={() => { this.gotoCheckoutBilling('CIEBancomer') }} />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div> :
                                            paymentDetail['Forma de pago'] === "Pago: CIE Bancomer" ?
                                                <div className="col-12 order-2 order-lg-3">
                                                    <div className="m-box -paymentMethod mb-4">
                                                        <div className="row no-gutters align-items-center justify-content-between">
                                                            <div className="col-12">
                                                                <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.Methodofpayment.text']} />
                                                            </div>
                                                        </div>
                                                        <hr className="mb-3" />
                                                        <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                            <div className="col-11 col-lg-12">
                                                                <Paragraph className="a-checkoutBox__subtitle">{paymentDetail['Forma de pago']}</Paragraph>

                                                                <Link className="a-checkoutBox__link d-none d-lg-block" href="/tienda/checkoutBilling" onClick={() => { this.gotoCheckoutBilling('CIEBancomer') }}>Modificar forma de pago</Link>
                                                            </div>
                                                            <div className="col-1 d-block d-lg-none text-right">
                                                                <Icons className="icon-arrow_right" onClick={() => { this.gotoCheckoutBilling('CIEBancomer') }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                : paymentDetail.creditCardNumber != undefined ?
                                                    <div className="col-12 order-2 order-lg-3">
                                                        <div className="m-box -paymentMethod mb-4">
                                                            <div className="row no-gutters align-items-center justify-content-between">
                                                                <div className="col-12">
                                                                    <H5 headLineClass="a-box__title" headLineText={staticLabels['pwa.checkoutPagePromotion.Methodofpayment.text']} />
                                                                </div>
                                                            </div>
                                                            <hr className="mb-3" />
                                                            <div className="row no-gutters align-items-center justify-content-between mb-2">
                                                                <div className="col-11 col-lg-12">
                                                                    <Paragraph className="a-checkoutBox__subtitle">Tarjeta de crédito</Paragraph>
                                                                    <Paragraph className="a-checkoutBox__description">{paymentDetail && paymentDetail.creditCardType && cartdTypes[paymentDetail.creditCardType.toLowerCase()] || paymentDetail.creditCardType.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</Paragraph>
                                                                    <Paragraph className="a-checkoutBox__description">*{paymentDetail.creditCardNumber}</Paragraph>
                                                                    <Link className="a-checkoutBox__link d-none d-lg-block" href="/tienda/checkoutBilling" onClick={() => { this.gotoCheckoutBilling('creditCard') }}  >Modificar forma de pago</Link>
                                                                </div>
                                                                <div className="col-1 d-block d-lg-none text-right">
                                                                    <Icons className="icon-arrow_right" onClick={() => { this.gotoCheckoutBilling('creditCard') }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div> : ''
                            }

                        </div>
                    </div>
                </div>

                <div className="row align-items-center pt-lg-0 pb-3">
                    <div className="col-lg-8" style={{ paddingRight: !this.props.isMobile && 5 }}>
                        <div className="row justify-content-between">
                            <div className="col-lg-6 d-none d-lg-block">
                                <ParagraphWithBlockNew options={checkoutsecure} />
                            </div>


                            <div className="col-lg-6">
                                <ParagraphWithBlockNew options={terms} />
                            </div>

                        </div>

                    </div>
                </div>


                <div className="row align-items-center">
                    <div className="col-lg-8" style={{ paddingRight: !this.props.isMobile && 5 }}>
                        <div className="row justify-content-end">
                            <div className="col-lg-3 col-12 mt-3 mt-lg-0 order-2 order-lg-1">
                                <Button className="a-btn a-btn--secondary" ripple="" onClick={() => { this.gotoCheckoutBilling('') }}>{staticLabels["pwa.checkoutPagePromotion.regresar.label"] || "Regresar"}</Button>
                            </div>
                            {
                                paymentDetail['Forma de pago'] === 'Pago: Paypal' ?
                                    <div className="col-lg-3 col-12 order-1 order-lg-2">
                                        <Button className="a-btn a-btn--primary" ripple="" id='submitForPaypal' handleClick={() => { this.props.finalSubmitForPaypal() }}>{staticLabels['pwa.checkoutPagePromotion.nextstep.text']}</Button>
                                    </div> :
                                    <div className="col-lg-3 col-12 order-1 order-lg-2">
                                        <Button className="a-btn a-btn--primary" ripple="" id='submitForOther' handleClick={(e) => { this.props.finalSubmit(isPackageEligible) }}>{staticLabels['pwa.checkoutPagePromotion.nextstep.text']}</Button>
                                    </div>
                            }

                        </div>
                    </div>
                </div>



                <div className="row pt-4">
                    <div className="col-12 d-block d-lg-none">
                        <ParagraphWithBlockNew options={securetitle} />
                    </div>
                </div>


                {/*end*/}
            </div>
        );
    }
}