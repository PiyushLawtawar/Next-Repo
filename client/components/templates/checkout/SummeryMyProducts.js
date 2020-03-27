/**
  * Module Name : SummeryMyProducts Module
  * Functionality : Component used to show the Summary of my bag information. This is get called from \templates\checkout\CommonShippingPage.js
  * @exports : SummeryMyProducts
  * @requires : module:React
  * @requires : module:/atoms/HeadLines/Headlines
  * @requires : module:/atoms/Label/Label
  * @requires : module:lodash/isEmpty
  * @requires : module:lodash/map
  * @requires : module:/helpers/config/config
  * @requires : module:/helpers/utilities/utility
  * @requires : module:/molecules/Figure/Figure
  * Team : Checkout Team
  * Other information : Showing the list of products which are added to cart.
  * 
  */
import React from 'react';
import {H4,H5} from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
// import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { getPriceInFormat } from '../../../helpers/utilities/utility';
import Figure from '../../molecules/Figure/Figure';

  /**
   * Items converting to array format
   * @function getItems
   * @author dondapati.kumar@zensar.com
   * @desc this list of cart items converting to array format.
   * @param {object} itemInfo
   * @returns {array} listData
   * 
   */
const getItems = (itemInfo) => {
    let listData = [];
    for (var i in itemInfo) {
      if(i !== 's'){
        listData.push(itemInfo[i]);
      }
    }
    return listData;
}

// const onImgError =(e) =>{
//     const errImgElement= e.target;
//     OnImgError(errImgElement, Path.onImgError);
// }

/**
	* @class SummeryMyProducts
	* @classdesc Main function which will get exported and will get imported in other JS
	*/
export default class SummeryMyProducts extends React.Component {

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
      const { priceInfo, totalCommerceItemCount="" } = this.props.checkoutItemsDetail;
      const items = getItems(this.props.checkoutItemsDetail.itemInfo) || []
      const { labels } = this.props;
        return (
          <React.Fragment>
            <div className="m-box mb-4 shipping-sticky">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                    <H5 headLineClass="a-box__heading" headLineText={labels["pwa.checkoutBagPage.heading.text"]} />
                </div>
              </div>
             <hr className="mb-3" />
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                    <Label className="a-box__resume">{labels["pwa.checkoutBagPage.subtotal.text"]}({totalCommerceItemCount} {labels["pwa.checkoutBagPage.productos.text"]}):</Label>
                </div>
                <div className="col-auto">
                  {
                    (priceInfo && priceInfo.Subtotal)?
                     <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.Subtotal)}</Label> : null
                  }
                </div>
              </div>
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                      <Label className="a-box__resume"> {labels["pwa.checkoutBagPage.descuento.text"]} </Label>
                </div>
                <div className="col-auto">
                  {
                    (priceInfo && priceInfo.institutionalPromotionDiscount)?
                       <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.institutionalPromotionDiscount)}</Label> : null
                  }
                </div>
              </div>
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                      <Label className="a-box__resume"> {labels["pwa.checkoutBagPage.codigoPromocion.text"]} </Label>
                </div>
                <div className="col-auto">
                  {
                    (priceInfo && priceInfo.couponDiscount)?
                       <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.couponDiscount)}</Label> : null
                  }
                </div>
              </div>
              <div className="row no-gutters align-items-center justify-content-between mb-2">
                <div className="col-auto">
                      <Label className="a-box__resume">{labels["pwa.checkoutBagPage.cdl.shippingcost.label"]}</Label>
                </div>
                <div className="col-auto">
                  {
                    (priceInfo && priceInfo.shippingCost)?
                       <Label className="a-box__resume">$ {getPriceInFormat(priceInfo.shippingCost)}</Label> : null
                  }
                </div>
              </div>
              <div className="row no-gutters align-items-center justify-content-between mb-3">
                <div className="col-auto">
                      <Label className="a-box__resume -totalLabel">{labels["pwa.checkoutBagPage.total.text"]}</Label>
                </div>
                <div className="col-auto">
                   {
                    (priceInfo && priceInfo.Total)?
                      <Label className="a-box__resume -totalPrice">$ {getPriceInFormat(priceInfo.Total)}</Label> : null
                  }
                </div>
              </div>
            </div>
            <div className="m-box -previewList" style={{ 'overflowY': 'auto' }}>
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                     <H5 headLineClass="a-box__title" headLineText={ `Mis productos (${totalCommerceItemCount})`} />
                     {/*labels["pwa.checkoutShippingPage.productos.label"] */}
                </div>
              </div>
              {
                !isEmpty(items) && map(items, (cartItem, index) => {
                  if(cartItem.productId){
                    return (
                      <React.Fragment key={index}>
                        <hr />
                        <div className="row no-gutters align-items-center justify-content-between mb-2">
                            <div className="col-4">
                              {/*<img className="a-box__productImg" src={cartItem.productImageURL} alt="" onError={onImgError}/>*/}
                              <Figure imageClassName={"a-box__productImg cursurDef a-myBagImageProduct"} imageAlt="alt-Description" src={cartItem.productImageURL || 'filler_REC.jpg'} height={100} />
                            </div>
                            <div className="col-8">
                              <Label className="a-box__productTitle">{cartItem.displayName}</Label>
                              <Label className="a-box__productQuantity">{labels["pwa.checkoutShippingPage.quantity.label"]} {cartItem.quantity}</Label>
                              { cartItem.eventNumber &&
                                <Label className="a-box__eddTitle">{labels["pwa.checkoutShippingPage.event.label"]} {cartItem.eventNumber}</Label>
                              }
                              {  cartItem.enableEdd === true && cartItem.isSpecialSale === false && cartItem.isBundle === false && cartItem.itemType !== 'giftRegistryCommerceItem' && cartItem.estimatedDeliveryDate &&
                            
                                <React.Fragment>
                                  <Label className="a-box__eddTitle">{labels["pwa.checkoutShippingPage.estimatedDeliveydate.label"]}</Label>
                                  <Label className="a-box__edd">{cartItem.estimatedDeliveryDate}</Label>
                                </React.Fragment>
                              }
                              { cartItem.isSpecialSale === true && (cartItem.specialSaleMessage || cartItem.estimatedDeliveryDate) &&
                                <React.Fragment>
                                  <Label className="a-box__eddTitle">{labels["pwa.checkoutShippingPage.estimatedDeliveydate.label"]}</Label>
                                  <Label className="a-box__edd">{ cartItem.specialSaleMessage || cartItem.estimatedDeliveryDate }</Label>
                                </React.Fragment>
                              }
                              { cartItem.commerceItemType === 'Digital' &&
                                <Label className="a-box__edd">{labels["pwa.checkoutDigital.download.message"]}</Label>
                              }
                            </div>
                        </div>
                      </React.Fragment>
                    )
                  }
                })
              }
            </div>
          </React.Fragment>
        )
    }
}

