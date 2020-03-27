import Figure from '../Figure/Figure';
//import Stars from '../Stars/molecule-stars';
import Ratings from '../Ratings/Ratings'
import Quantity from '../ProductQty/molecule-product-qty';
import Ul from '../../atoms/Ul/Ul';
import Sup from "../../atoms/Sup/Sup";
import Button from '../../atoms/Button/Button';
import { Menumotion } from '../MenuMotion/molecule-menu-motion';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { AtomChunkText } from '../../atoms/Tab/atom-chunk-text';
import Link from '../../atoms/Link/Link';
import EmptyBag from '../../../components/templates/myBag/EmptyBag';
import { parentContext } from '../../../contexts/parentContext';
import Span from '../../atoms/Span/Span';
import { GetWithDecimal } from '../../../helpers/utilities/utility';
// const getCards = (commerceItems) => {
//     let listData = [];
//     for (var i in commerceItems) {
//         if(typeof commerceItems[i] === 'object'){
//            listData.push(commerceItems[i]);
//         }
//     }
//     return listData;
// }

export default (props) => {
  // console.log(props.loginDetails,'MyBag')

  let giftWrapExcludedProductTypes = ['Flowers', 'E Book', 'Air Time', 'Photobook', ' CDL', ' Gift Certificate', 'Digital']
  let staticLables = props.staticLables;
  let type = 'p';
  let listData = {};
  if (props.activeTab === 'mdc-tab-1') {
    listData = props.commerceItems || [];
  } else {
    listData = props.wishlistItem || [];
  }
  let objectres = {};
  map(props.objectres, (item, i) => {
    objectres[item.sku] = item.piezas;

  });

  const giftWrapEnabledFlag = (props.flags && typeof props.flags['giftWrapEnabled'] === 'boolean' && !props.flags['giftWrapEnabled']) ? false : true;
  const EDDErrorMessages = props.EDDErrorMessages || ''
  return (
    <React.Fragment>
      {
        !isEmpty(listData) && map(listData, (cartItem, index) => {
          let limited_Pieces = objectres[cartItem.productId]
          const desableGWPgetItem = cartItem && cartItem.promotionalGiftItemMessage ? true : false

          let giftWrapElegibility = giftWrapExcludedProductTypes.includes(cartItem.productType);

          const ratingInfo = {
            ratingAvg: cartItem.ratings ? cartItem.ratings : cartItem.averageRating,
            ratingCount: cartItem.ratingCount ? cartItem.ratingCount : cartItem.productRatingCount

          };
          var fDataMoveToBag = {
            productId: cartItem.productId,
            giftItemId: cartItem.giftListItemId,
            catalogRefIds: cartItem.skuId,
            productType: cartItem.productType,
            quantity: "1",
            moveItemToCart: "true"
          }
          if (cartItem.isMarketPlaceItem) {
            fDataMoveToBag.sellerId = cartItem.sellerId
            fDataMoveToBag.sellerName = cartItem.sellerName
            fDataMoveToBag.sellerOperatorId = cartItem.sellerOperatorId
            fDataMoveToBag.sellerSkuId = cartItem.sellerSkuId
            fDataMoveToBag.offerId = cartItem.offerId
          }
          if ((cartItem && cartItem.productId) || (cartItem && cartItem.id) || (cartItem && cartItem.productType)) {
            if (props.activeTab === 'mdc-tab-2') {
              return (
                <div className="o-myBag o-myBag--giftTable" key={index}>

                  <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                    <div className="o-myBag__image" onClick={((cartItem.inventoryAvailable || cartItem.inventoryAvailableForVarients) || (cartItem.inventoryAvailable || (cartItem.isMarketPlaceItem && cartItem.inventoryAvailableForVendors))) && !desableGWPgetItem && props.pdpProductLanding.bind(this, cartItem, cartItem.productId)}>
                      {
                        <Figure imageClassName={((cartItem.inventoryAvailable || cartItem.inventoryAvailableForVarients) || (cartItem.inventoryAvailable || (cartItem.isMarketPlaceItem && cartItem.inventoryAvailableForVendors))) ? !desableGWPgetItem ? "a-myBagImageProduct" : "cursurDef a-myBagImageProduct" : "cursurDef m-imageProductMyBag m-imageProductMyBag--isntAvailable"} imageAlt="alt-Description" src={cartItem.imageURL || 'filler_REC.jpg'} cursurDef={cartItem.inventoryAvailable} />
                      }
                    </div>
                    <div className="o-myBag__description">
                      <span onClick={((cartItem.inventoryAvailable && cartItem.inventoryAvailableForVarients) || (cartItem.inventoryAvailable || (cartItem.isMarketPlaceItem && cartItem.inventoryAvailableForVendors))) && !desableGWPgetItem && props.pdpProductLanding.bind(this, cartItem, cartItem.productId)} style={{ 'cursor': ((cartItem.inventoryAvailable && cartItem.inventoryAvailableForVarients) || (cartItem.inventoryAvailable || (cartItem.isMarketPlaceItem && cartItem.inventoryAvailableForVendors))) ? 'pointer' : 'default' }}>
                        <AtomChunkText className="a-inlineElement a-inlineElement--enphasis" Type={type}>{cartItem.displayName}</AtomChunkText>
                      </span>
                      {
                        (cartItem.inventoryAvailable || cartItem.inventoryAvailableForVarients || cartItem.inventoryAvailableForVendors)?<Ratings ratingInfo={ratingInfo} />:null
                      }
                      

                      {
                        !isEmpty(cartItem.productFlags) && map(cartItem.productFlags, (item, i) => {
                          //console.log('cartItem.productFlags_pwa____ item', cartItem.productFlags_pwa[item],item)
                          const statickey = cartItem.productFlagsMap[item] || item;
                          const txt = staticLables[statickey] || statickey;
                          return (
                            <AtomChunkText className="a-blockElement" Type={type} key={i}>
                              <label className="a-inlineElement a-inlineElement--default">{txt}</label>
                            </AtomChunkText>
                          )
                        })
                      }
                      <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type} >{staticLables['pwa.PD.code.text']} {cartItem.parentSkuId ? cartItem.parentSkuId : (cartItem.sellerSkuId ? cartItem.sellerSkuId : cartItem.productId)}</AtomChunkText>

                      {
                        (cartItem.color) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.color.label']} {cartItem.color}</AtomChunkText> : null
                      }
                      {
                        (cartItem.size) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.size.label']} {cartItem.size}</AtomChunkText> : null
                      }
                      {
                        (cartItem.material) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.material.label']} {cartItem.material}</AtomChunkText> : null
                      }
                      {
                        (cartItem.texture) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.texture.label']} {cartItem.texture}</AtomChunkText> : null
                      }
                      {
                        (cartItem.platform) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.plataforma.label']} {cartItem.platform}</AtomChunkText> : null
                      }
                      {
                        (cartItem.edition) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.edition.label']} {cartItem.edition}</AtomChunkText> : null
                      }


                      {
                        (cartItem.format) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.format.label']} {cartItem.format}</AtomChunkText> : null
                      }
                      {
                        (cartItem.hybridLanguage) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.language.label'] || 'Idioma:'} {cartItem.hybridLanguage}</AtomChunkText> : null
                      }
                      {
                        (cartItem.license) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.license.label'] || 'Licencia:'} {cartItem.license}</AtomChunkText> : null
                      }
                      {
                        (cartItem.validity) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.validity.label'] || 'Validez:'} {cartItem.validity}</AtomChunkText> : null
                      }


                      {
                        (cartItem.isGwpItem) ? <label className="a-inlineElement a-inlineElement--eventsProduct -gift buyGiftTable"></label> : null
                      }
                      {
                        (cartItem.isMarketPlaceItem) ?
                          <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>Vendido por: {cartItem.sellerName}</AtomChunkText>
                          : null
                      }
                      {
                        (cartItem.commerceItemClassType === 'giftRegistryCommerceItem') ?
                          <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.eventNumber.label']} {cartItem.giftRegistryEventNumber}</AtomChunkText>
                          :
                          null
                      }

                      {
                        (cartItem && cartItem.isBundleItem === true) ?
                          <React.Fragment>
                            <AtomChunkText className="a-inlineElement -marginSeparatorTop" Type={type}>Contenido: </AtomChunkText>

                            <Ul className="m-listBundle">
                              {
                                !isEmpty(cartItem.bundleItem) && map(cartItem.bundleItem, (bundleItem, index) => {
                                  return (
                                    <li className="m-listBundle__item">
                                      <AtomChunkText className="a-inlineElement a-inlineElement--enphasis" Type={type}>{bundleItem.displayName}</AtomChunkText>
                                      <AtomChunkText className="a-inlineElement" Type={type}>{staticLables['pwa.PD.code.text']} {bundleItem.skuId}</AtomChunkText>
                                    </li>
                                  )
                                })
                              }
                            </Ul>
                          </React.Fragment>
                          : null

                      }

                      {
                        (cartItem.commerceItemClassType !== 'giftRegistryCommerceItem' && cartItem.commerceItemClassType !== 'isDigitalItem') ?
                          <React.Fragment>
                            {
                              (cartItem.estimatedDeliveryDate) ? <AtomChunkText className="a-inlineElement a-inlineElement--fEstimadaTitle" Type={type}> {staticLables['pwa.cart.estimatedDeliveydate.label']}</AtomChunkText> : null
                            }
                            {cartItem.estimatedDeliveryDate ? <AtomChunkText className="a-inlineElement -greenText" Type={type}>{cartItem.estimatedDeliveryDate}</AtomChunkText> : null}
                          </React.Fragment>
                          : null


                      }
                      {
                        (cartItem.isDigitalItem === true) ?
                          <React.Fragment>
                            <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.sfl.tipo.compra.text']}{staticLables['pwa.sfl.digital.text']}</AtomChunkText>
                            <AtomChunkText className="a-inlineElement -greenText" Type={type}>{staticLables['pwa.sfl.digitalmsg.text']}</AtomChunkText>
                          </React.Fragment>
                          :
                          null
                      }
                        
                        {
                          ((!cartItem.inventoryAvailable && cartItem.inventoryAvailableForVarients) || (!cartItem.inventoryAvailable && cartItem.isMarketPlaceItem && cartItem.inventoryAvailableForVendors)) ? 
                           <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>
                            No disponible en las opciones que guardaste. Disponible con otras variantes</AtomChunkText> : null
                        }
                      <div className="m-latestinlineElement m-latestinlineElement--triple">
                        <Button className="a-inlineElement a-inlineElement--eventsProduct " handleClick={() => { props.removeItemFromSavedCart(cartItem.giftListItemId), props.dismiss_alert() }}>{staticLables['pwa.cart.Borrar.text']}
                        </Button>
                        {
                          cartItem.inventoryAvailable && !cartItem.isGwpItem ?
                            <Button className="a-inlineElement a-inlineElement--eventsProduct " handleClick={() => { props.addItemToCart(fDataMoveToBag), props.dismiss_alert() }}>{staticLables['pwa.sfl.addToCart.text']}</Button>
                            // : !cartItem.isGwpItem ? <label className="a-inlineElement a-inlineElement--eventsProduct ">{staticLables['pwa.sfl.unavailable.text']}</label>:null
                            : !cartItem.isGwpItem ? null : null
                        }
                        {
                          cartItem.inventoryAvailable && cartItem.isGwpItem ? <Button className="a-inlineElement a-inlineElement--eventsProduct " onClick={props.pdpProductLanding.bind(this, cartItem, cartItem.productId)}>{staticLables['pwa.sfl.gotopdp.text']}</Button>
                            : null
                        }
                        {/*{
                          ((!cartItem.inventoryAvailable && cartItem.inventoryAvailableForVarients) || (!cartItem.inventoryAvailable && cartItem.isMarketPlaceItem && cartItem.inventoryAvailableForVendors)) ? <Button className="a-inlineElement a-inlineElement--eventsProduct " onClick={props.pdpProductLanding.bind(this, cartItem, cartItem.productId)}>
                            No disponible en las opciones que guardaste. Disponible con otras variantes</Button> : null
                        }*/}
                      </div>
                    </div>
                  </div>

                  <div className="o-myBag__column" name="columnPrice">
                    {

                      cartItem.inventoryAvailable ?
                        <React.Fragment>
                          {
                            (cartItem.listPrice && cartItem.salePrice && (cartItem.promoPrice > 0)) ?
                              <div className="o-myBag__column--priceContainer">
                                <AtomChunkText className="a-inlineElement a-inlineElement--strikethrough" Type={type}> ${GetWithDecimal(cartItem.listPrice, 2).val}<Sup>{GetWithDecimal(cartItem.listPrice, 2).decimal}</Sup> </AtomChunkText>
                              </div>
                              : <AtomChunkText className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal" Type={type}>  ${GetWithDecimal(cartItem.salePrice, 2).val}<Sup>{GetWithDecimal(cartItem.salePrice, 2).decimal}</Sup>  </AtomChunkText>
                          }
                          <div className="o-myBag__column--priceContainer">
                            {
                              (cartItem.promoPrice > 0) ?
                                <AtomChunkText className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal" Type={type}> ${GetWithDecimal(cartItem.promoPrice, 2).val} <Sup>{GetWithDecimal(cartItem.promoPrice, 2).decimal}</Sup></AtomChunkText>
                                : null
                            }
                          </div>
                        </React.Fragment> : null

                    }

                  </div>

                  <div className="o-myBag__motionMenu">
                    {!desableGWPgetItem ?
                      <Menumotion index={index} options_visibility={cartItem['options_visibility']} removeItemFromCartNew={props.removeItemFromSavedCart} addItemToCart={props.addItemToCart} fDataMoveToBag={fDataMoveToBag} openOptions={(index) => props.openOptions(index, 'wishlist')} removeItem={cartItem.giftListItemId} staticLables={staticLables} cartItem={cartItem} activeTab={props.activeTab} pdpProductLanding={props.pdpProductLanding}  gtmRemoveFromCart={props.gtmRemoveFromCart}/>
                      : null
                    }
                  </div>
                </div>
              )

            } else {

              // If the item is presale showing following message as EDD
              if(cartItem.isSpecialSaleItem && !cartItem.estimatedDeliveryDate){
                cartItem.estimatedDeliveryDate = staticLables['pwa.cart.presale.edd.message'] || "El envío se realizará cuando el artículo esté disponible";
              }
              
              return (
                <div className="o-myBag o-myBag--giftTable" key={index}>
                  <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                    <div className="o-myBag__image" onClick={!desableGWPgetItem && props.pdpProductLanding.bind(this, cartItem, cartItem.productId)}>
                      {
                        <Figure imageClassName={!desableGWPgetItem ? "a-myBagImageProduct" : "cursurDef a-myBagImageProduct"} imageAlt="alt-Description" src={cartItem.productImageURL || 'filler_REC.jpg'} />
                      }
                    </div>
                    <div className="o-myBag__description">
                      <span onClick={!desableGWPgetItem && props.pdpProductLanding.bind(this, cartItem, cartItem.productId)} style={{ 'cursor': 'pointer' }}>
                        <AtomChunkText className="a-inlineElement a-inlineElement--enphasis" Type={type}>{cartItem.itemDisplayName}</AtomChunkText>
                      </span>
                      <Ratings ratingInfo={ratingInfo} />
                      {
                        !isEmpty(cartItem.productFlags) && map(cartItem.productFlags, (item, i) => {
                          const statickey = cartItem.productFlags_pwa[item] || item;
                          const txt = staticLables[statickey] || statickey;
                          return (
                            (item === 'giftWithPurchase' || item === 'exclusivePromotion') ? null :
                              <AtomChunkText className="a-blockElement" Type={type} key={i}>
                                <label className="a-inlineElement a-inlineElement--default">{txt}</label>
                              </AtomChunkText>
                          )
                        })
                      }
                      {
                        isEmpty(cartItem.promotionalGiftItemMessage) ? null :
                          <AtomChunkText className="a-blockElement" Type={type} >

                            <label className="a-inlineElement a-inlineElement--default "> {staticLables['pwa.gwp.regaloExclusiveOnline.text']}</label>

                          </AtomChunkText>

                      }


                      <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type} >{staticLables['pwa.PD.code.text']} {cartItem.parentSkuId ? cartItem.parentSkuId : (cartItem.sellerSkuId ? cartItem.sellerSkuId : cartItem.catalogRefId)}</AtomChunkText>
                      {
                        (cartItem.clothingSize) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.size.label']} {cartItem.clothingSize}</AtomChunkText> : null
                      }
                      {
                        (cartItem.dimensions) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.dimensions.label']}: {cartItem.dimensions}</AtomChunkText> : null
                      }
                      {
                        (cartItem.clothingColor) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.color.label']} {cartItem.clothingColor}</AtomChunkText> : null
                      }
                      {
                        (cartItem.texture) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.texture.label']} {cartItem.texture}</AtomChunkText> : null
                      }
                      {
                        (cartItem.material) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.material.label']} {cartItem.material}</AtomChunkText> : null
                      }
                      {
                        (cartItem.platform) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.plataforma.label']} {cartItem.platform}</AtomChunkText> : null
                      }
                      {
                        (cartItem.edition) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.edition.label']} {cartItem.edition}</AtomChunkText> : null
                      }


                      {
                        (cartItem.format) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.format.label']} {cartItem.format}</AtomChunkText> : null
                      }
                      {
                        (cartItem.hybridLanguage) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.language.label'] || 'Idioma:'} {cartItem.hybridLanguage}</AtomChunkText> : null
                      }
                      {
                        (cartItem.license) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.license.label'] || 'Licencia:'} {cartItem.license}</AtomChunkText> : null
                      }
                      {
                        (cartItem.validity) ? <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.digital.sku.validity.label'] || 'Validez:'} {cartItem.validity}</AtomChunkText> : null
                      }



                      {
                        (cartItem.commerceItemClassType === 'miraklCommerceItem') ?
                          <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>Vendido por: {cartItem.sellerName}</AtomChunkText>
                          : null
                      }
                      {
                           (cartItem.commerceItemClassType === 'miraklCommerceItem' && cartItem.productType=="Big Ticket") ?
                           (cartItem.estimatedDeliveryDate || EDDErrorMessages[cartItem.catalogRefId])? null :
                            <React.Fragment>
                              <AtomChunkText className="a-inlineElement a-inlineElement--fEstimadaTitle" Type={type}> {staticLables['pwa.cart.estimatedDeliveydate.label']}</AtomChunkText> 
                              <AtomChunkText className="a-inlineElement -yellowOrangeText " Type={type}>La fecha de entrega de este producto estará disponible pronto.</AtomChunkText>
                           </React.Fragment> : null
                        }
                      {
                        (cartItem.commerceItemClassType === 'giftRegistryCommerceItem') ?
                          <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.cart.eventNumber.label']} {cartItem.giftRegistryEventNumber}</AtomChunkText>
                          :
                          null
                      }

                      {
                        (cartItem && cartItem.isBundle === true) ?
                          <React.Fragment>
                            <AtomChunkText className="a-inlineElement -marginSeparatorTop" Type={type}>Contenido: </AtomChunkText>

                            <Ul className="m-listBundle">
                              {
                                !isEmpty(cartItem.relatedProducts) && map(cartItem.relatedProducts, (bundleItem, index) => {
                                  return (
                                    <li className="m-listBundle__item">
                                      <AtomChunkText className="a-inlineElement a-inlineElement--enphasis" Type={type}>{bundleItem.childSkuDisplayName}</AtomChunkText>
                                      <AtomChunkText className="a-inlineElement" Type={type}>{staticLables['pwa.PD.code.text']} {bundleItem.childSkuId}</AtomChunkText>
                                    </li>
                                  )
                                })
                              }
                            </Ul>
                          </React.Fragment>
                          : null

                      }

                      {
                        (cartItem.commerceItemClassType !== 'giftRegistryCommerceItem' && cartItem.commerceItemClassType !== 'electronicCommerceItem') ?
                          <React.Fragment>
                            {
                              (cartItem.estimatedDeliveryDate || EDDErrorMessages[cartItem.catalogRefId]) ? <AtomChunkText className="a-inlineElement a-inlineElement--fEstimadaTitle" Type={type}> {staticLables['pwa.cart.estimatedDeliveydate.label']}</AtomChunkText> : null
                            }
                            {(cartItem.estimatedDeliveryDate || EDDErrorMessages[cartItem.catalogRefId]) ? <AtomChunkText className="a-inlineElement -greenText" Type={type}>{(cartItem.estimatedDeliveryDate || EDDErrorMessages[cartItem.catalogRefId])}</AtomChunkText> : null}
                          </React.Fragment>
                          :
                          (cartItem.commerceItemClassType === 'electronicCommerceItem') ?
                            <React.Fragment>
                              <AtomChunkText className="a-inlineElement a-inlineElement--simpleLineSpacing" Type={type}>{staticLables['pwa.sfl.tipo.compra.text']}{staticLables['pwa.sfl.digital.text']}</AtomChunkText>
                              <AtomChunkText className="a-inlineElement -greenText" Type={type}>{staticLables['pwa.sfl.digitalmsg.text']}</AtomChunkText>

                            </React.Fragment>
                            :
                            null
                      }

                      {
                        giftWrapEnabledFlag && props.giftWrapperDisplayServiceData && props.giftWrapperDisplayServiceData.giftWrapEnabled && !giftWrapElegibility ?
                          <parentContext.Consumer>
                            {({ OpenModal }) => (
                              <button
                                className="a-inlineElement -giftWrap"
                                data-toggle="modal"
                                data-target="#giftWrap-modal"

                                onClick={() => {
                                  props.cartItemIdToGiftWrapItem(cartItem.id, cartItem.catalogRefId, cartItem.giftMessage),
                                    props.UpdateValue(cartItem.giftWrapColor, cartItem.giftWrapMessage, cartItem.giftWrapType),
                                    OpenModal('MyBagGiftWrap')
                                }}


                              >¿Envolver para regalo?
                                                      </button>
                            )}
                          </parentContext.Consumer> : null
                      }

                      <div className="m-latestinlineElement m-latestinlineElement--triple">
                        {
                          (cartItem.isGRConversionEligible === false) ?
                            (cartItem.commerceItemClassType === 'giftRegistryCommerceItem') ?
                              null
                              : cartItem && cartItem.promotionalGiftItemMessage ? null :
                                <Button className="a-inlineElement a-inlineElement--eventsProduct -gift" data-toggle="modal" data-target="#dontGift-modal">{staticLables['pwa.cart.noGiftAssociation.text']}</Button>
                            :
                            <parentContext.Consumer>
                              {({ OpenModal }) => (
                                <Button className="a-inlineElement a-inlineElement--eventsProduct -gift buyGiftTable" handleClick={() => { props.cartItemIdToGRModalOne(cartItem.id), OpenModal('MyBagGRModal') }}>{staticLables['pwa.cart.addToGiftEvent.text']}</Button>
                              )}
                            </parentContext.Consumer>

                        }
                        {
                          (cartItem.commerceItemClassType === 'giftRegistryCommerceItem' && cartItem.shippingGroupId) ?
                            <parentContext.Consumer>
                              {({ OpenModal }) => (
                                cartItem.allItemsAddedInCart === 'true' && cartItem.onlyGwpChildItem == false ?
                                  <Button className="a-inlineElement a-inlineElement--eventsProduct -gift buyGiftTable" handleClick={() => { props.cartItemIdToGRModalOne(cartItem.shippingGroupId), OpenModal('MyBagGRModalEToNonGR') }}>Ya no quiero regalar</Button>
                                  : null
                              )}
                            </parentContext.Consumer>
                            : null
                        }
                        {
                          <parentContext.Consumer>
                            {/* //Custom products new feature, my bag changes - START */}
                            {({ loginDetails }) => (
                              cartItem.isCustomProduct ? null :
                                loginDetails.LoggedInSession ?
                                  /*(cartItem.isItemAvilableInWishlist === 'false' && cartItem.commerceItemClassType !== 'giftRegistryCommerceItem' && cartItem.commerceItemClassType !== 'electronicCommerceItem') ?*/
                                  (cartItem.isItemAvilableInWishlist === 'false' && cartItem.commerceItemClassType !== 'giftRegistryCommerceItem') ?
                                    <Button className="a-inlineElement a-inlineElement--eventsProduct" handleClick={() => { props.addItemToWishList(cartItem.id, cartItem.catalogRefId) }}>{staticLables['pwa.sfl.movetowishlist.text']}
                                    </Button>
                                    :
                                    (cartItem.commerceItemClassType !== 'giftRegistryCommerceItem' && cartItem.commerceItemClassType !== 'electronicCommerceItem' && !cartItem.promotionalGiftItemMessage) ?
                                      <span className="a-inlineElement a-inlineElement--eventsProduct">{staticLables['pwa.sfl.articulo.guardados.text']}</span>
                                      : null
                                  : null
                            )}
                            {/* //Custom products new feature, my bag changes - END */}
                          </parentContext.Consumer>
                        }
                        {
                          cartItem && cartItem.promotionalGiftItemMessage ? null :
                            cartItem && cartItem.onlyGwpChildItem == true ? null : <Button className="a-inlineElement a-inlineElement--eventsProduct " handleClick={() => { props.removeItemFromCart(cartItem.id), props.gtmRemoveFromCart(cartItem) }}>{staticLables['pwa.cart.Borrar.text']}</Button>
                        }


                      </div>
                    </div>
                  </div>

                  <div className="o-myBag__column" name="columnPrice">
                    {
                      (cartItem.listPriceWithDiscount && cartItem.listPrice && (cartItem.listPriceWithDiscount !== cartItem.listPrice || cartItem.salePrice !== cartItem.listPrice)) ?
                        <div className="o-myBag__column--priceContainer">
                          <AtomChunkText className="a-inlineElement a-inlineElement--strikethrough" Type={type}>${GetWithDecimal(cartItem.listPrice, 2).val}<Sup>{GetWithDecimal(cartItem.listPrice, 2).decimal}</Sup></AtomChunkText>
                        </div>
                        : null

                    }
                    <div className="o-myBag__column--priceContainer">

                      {cartItem.salePrice && cartItem.listPriceWithDiscount && parseInt(cartItem.salePrice) > parseInt(cartItem.listPriceWithDiscount) ?
                        <AtomChunkText className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal" Type={type}>${GetWithDecimal(cartItem.listPriceWithDiscount, 2).val}<Sup>{GetWithDecimal(cartItem.listPriceWithDiscount, 2).decimal}</Sup></AtomChunkText>
                        : <AtomChunkText className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal" Type={type}>${GetWithDecimal(cartItem.salePrice, 2).val}<Sup>{GetWithDecimal(cartItem.salePrice, 2).decimal}</Sup></AtomChunkText>
                      }
                    </div>
                  </div>

                  <div className="o-myBag__column" name="columnQuantity">
                    <div className="m-product">
                      {
                        /*(cartItem.commerceItemClassType === 'electronicCommerceItem' || cartItem.commerceItemClassType === 'miraklCommerceItem') ?*/
                        (cartItem.commerceItemClassType === 'electronicCommerceItem' || cartItem.promotionalGiftItemMessage) ?
                          <label className="a-inlineElement -quantityReadOnly">{cartItem.quantity}</label>
                          :
                          <Quantity limited_Pieces={limited_Pieces !== undefined ? limited_Pieces : 1} quantity={cartItem.quantity} index={index} commerceId={cartItem.id} {...props} />
                      }
                      {
                        limited_Pieces === undefined ? '' : <Span className="a-checkout__minimunPurchase">Compra mínima {limited_Pieces} pzs.</Span>
                      }
                    </div>
                  </div>

                  <div className="o-myBag__column" name="columnTotal">
                    <div className="o-myBag__column--priceContainer">
                      <AtomChunkText className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total" Type={type}>${GetWithDecimal(cartItem.ProductTotalWithDiscount, 2).val}<Sup>{GetWithDecimal(cartItem.ProductTotalWithDiscount, 2).decimal}</Sup></AtomChunkText>
                    </div>
                  </div>

                  {
                    (cartItem.commerceItemClassType === 'giftRegistryCommerceItem') ?
                      <div className="o-myBag__giftTableDetails">
                        <parentContext.Consumer>
                          {({ OpenModal }) => (
                            <React.Fragment>
                              <div className="m-giftTableDetails" onClick={() => { screen.width <= 960 ? (props.cartItemIdToGiftWrapItem(cartItem.id, cartItem.catalogRefId, cartItem.giftMessage, cartItem), OpenModal('MyBagGRModalEditMsg')) : null }}>
                                <AtomChunkText className="a-inlineElement a-inlineElement--giftTableType" Type={type}>{cartItem.eventType}</AtomChunkText>
                                <AtomChunkText className="a-inlineElement a-inlineElement--giftTableName" Type={type}>{cartItem.ownerName}</AtomChunkText>
                                <AtomChunkText className="a-inlineElement a-inlineElement--giftTableMessage wap" Type={type}>{cartItem.giftMessage}</AtomChunkText>
                               { cartItem.personalGR || cartItem.shoppingType =='Personal Shopping'?
                                <AtomChunkText className="a-inlineElement a-inlineElement--giftTableMessage wap" Type={type}>{staticLables['pwa.shipping.personal.purchase.warn']}</AtomChunkText>
                                  :null
                               }
                                {/*<Link className="a-inlineElement a-inlineElement--giftTableActions " href="#">Editar mensaje</Link>*/}
                                <parentContext.Consumer>
                                  {({ OpenModal }) => (
                                    <React.Fragment>
                                      <Button className="a-inlineElement a-inlineElement--giftTableActions" handleClick={() => { props.cartItemIdToGiftWrapItem(cartItem.id, cartItem.catalogRefId, cartItem.giftMessage, cartItem), OpenModal('MyBagGRModalEditMsg') }}>Editar mensaje</Button>
                                      {cartItem.allItemsAddedInCart === 'true' && cartItem.onlyGwpChildItem == false ? <Button className="a-inlineElement a-inlineElement--giftTableActions" handleClick={() => { props.cartItemIdToGRModalOne(cartItem.shippingGroupId), OpenModal('MyBagGRModal') }}>Nueva búsqueda</Button>
                                        : null
                                      }
                                    </React.Fragment>
                                  )}
                                </parentContext.Consumer>
                                {/*<Link className="a-inlineElement a-inlineElement--giftTableActions " href="#">Nueva búsqueda</Link>*/}
                              </div>
                            </React.Fragment>
                          )}
                        </parentContext.Consumer>
                      </div>
                      :
                      null
                  }

                  <div className="o-myBag__motionMenu">
                    {!desableGWPgetItem ?
                      <Menumotion index={index} options_visibility={cartItem['options_visibility']}
                        removeItemFromCartNew={props.removeItemFromCartNew}
                        addItemToCart={props.addItemToCart}
                        openOptions={(index) => props.openOptions(index, 'mybag')}
                        removeItem={cartItem.id}
                        staticLables={staticLables}
                        cartItem={cartItem}
                        addItemToWishListNew={props.addItemToWishListNew}
                        cartItemIdToGRModalOneNew={props.cartItemIdToGRModalOneNew}
                        cartItemIdToGRModalOne={props.cartItemIdToGRModalOne}
                        cartItemIdToGiftWrapItem={props.cartItemIdToGiftWrapItem}
                        pdpProductLanding={props.pdpProductLanding} 
                        gtmRemoveFromCart={props.gtmRemoveFromCart}
                        />
                        
                      : null
                    }
                  </div>
                </div>
              )
            }
          }
        })
      }
      {
        <parentContext.Consumer>
          {({ loginDetails }) => (
            (props.activeTab === 'mdc-tab-1' && props.commerceItems.length === 0) || (props.activeTab === 'mdc-tab-2' && props.wishlistItem.length === 0) ?
              <EmptyBag loginDetails={loginDetails} headerData={props.headerData} staticLables={staticLables} isShow={false} activeTab={props.activeTab}/> : null
          )}
        </parentContext.Consumer>
      }
    </React.Fragment>
  )
}