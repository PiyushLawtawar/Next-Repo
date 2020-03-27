import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import Button from "../../atoms/Button/Button";
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Icons from '../../atoms/Icons/Icons';
import Image from '../../atoms/Tagimage/Image';
import Span from '../../atoms/Span/Span';
import Label from "../../atoms/Label/Label";
import Router from 'next/router';
import Ratings from '../../molecules/Ratings/Ratings';

import './organism-container.styl';


class PackedListInfo extends React.Component {

  redirectToUrl = (displayName, productId) => {
    let productName = displayName.toLowerCase().replace(/ /g, '-');
    const url = '/tienda/pdp/' + productName + '/' + productId;
    Router.push(url);

  }

  render() {
    const IsSomsOrder = this.props && this.props.IsSomsOrder;
    const orderDetails = this.props.orderDetails;
    const deliveryInfo = this.props.deliveryInfo;
    const packedList = this.props.packedList;
    const staticLabels = this.props.staticLabels;
    const imgSrc = (packedList.smallImage) ? packedList.smallImage : Path.onImgError;
    // console.log('deliveryInfo', staticLabels)
    // console.log('packedList', packedList)



    // const ratingInfo = {
    //   ratingAvg: (packedList.ratingInfo.averageRating) || "0",
    //   ratingCount: (packedList.ratingInfo.productRateCount) || "0"
    // };

    const SomsratingInfo = {
      ratingAvg: (packedList.averageRating) || "0",
      ratingCount: (packedList.ratingsCount) || "0"
    };

    return (
      <React.Fragment>
        {IsSomsOrder ?

          <React.Fragment>
            <div className="o-order__product__content">
              <div className="o-order__product__item" id="product__content__1">
                <div className="o-order__product__image">
                  <figure className={packedList.InventoryStatus ? "m-order__product__image__container" : "m-order__product__image__container notAvailable"}>
                    {packedList.InventoryStatus || orderDetails.eventNumber ?
                      <Image showLoader className="a-order__product__image" src={(packedList.SmallImage) ? packedList.SmallImage : Path.onImgError} alt="platos de lujo" onClick={() => this.redirectToUrl(packedList.displayName, packedList.productId)} />
                      :
                      <React.Fragment>
                        <Image showLoader className="a-order__product__image" src={(packedList.SmallImage) ? packedList.SmallImage : Path.onImgError} alt="platos de lujo" />
                        <Paragraph className="prueba">{staticLabels && staticLabels["pwa.OrderHistoryPage.Nodisponible.label"]}</Paragraph>
                      </React.Fragment>
                    }

                  </figure>
                </div>
                <div className="o-order__product__detail">
                  <Paragraph className="a-order__product__title">{packedList.DisplayName}
                  </Paragraph>
                  {packedList.averageRating && packedList.ratingsCount ?
                    <React.Fragment>
                      <Ratings ratingInfo={SomsratingInfo} />
                    </React.Fragment> : ''}
                  <div className="o-order__detail__description">
                    {packedList.clothingSize ? <div className="m-order__detail__size"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Talla.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.clothingSize}
                      </Label>
                    </div> : ''}
                    {packedList.clothingColor ? <div className="m-order__detail__color"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Color.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.clothingColor}
                      </Label>
                    </div> : ''}
                    {packedList.material ? <div className="m-order__detail__material"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Material.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.material}
                      </Label>
                    </div> : ''}
                    {packedList.Quantity ? <div className="m-order__detail__quantity"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Cantidad.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.Quantity}
                      </Label>
                    </div> : ''}
                    {/*{packedList.itemStatus === 'Cancelado' ? <div className="m-order__detail__quantity">
                      <Label id="statusPayment" className="a-order__footer__statusPayment --expired normal">{packedList.itemStatus}
                      </Label>
                    </div> : ''}*/}
                    {packedList.sellerName ? <div className="m-order__detail__quantity"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Vendidopor.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.sellerName}
                      </Label>
                    </div> : ''}
                    {packedList.gwpItem ? <div className="giftitem">
                      <span className="icon"></span><span className="text">{staticLabels && staticLabels["pwa.OrderHistoryPage.Regalo.label"]}</span> </div> : ''}
                  </div>
                </div>
              </div>

            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <div className="o-order__product__content">
              <div className="o-order__product__item" id="product__content__1">
                <div className="o-order__product__image">
                  <figure className={packedList.InventoryStatus || deliveryInfo.productType == "Digital" ? "m-order__product__image__container" : "m-order__product__image__container notAvailable"}>
                    {packedList.InventoryStatus || deliveryInfo.eventNumber || deliveryInfo.productType == "Digital" ?
                      <Image showLoader className="a-order__product__image" src={imgSrc} alt="platos de lujo" onClick={() => this.redirectToUrl(packedList.displayName, packedList.productId)} />
                      :
                      <React.Fragment>
                        <Image showLoader className="a-order__product__image" src={imgSrc} alt="platos de lujo" />
                        <Paragraph className="prueba">{staticLabels && staticLabels["pwa.OrderHistoryPage.Nodisponible.label"]} </Paragraph>
                      </React.Fragment>
                    }

                  </figure>
                </div>
                <div className="o-order__product__detail">
                  <Paragraph className="a-order__product__title">{packedList.displayName}
                  </Paragraph>
                  {packedList && packedList.ratingInfo ?
                    <React.Fragment>
                      <Ratings ratingInfo={{
                        ratingAvg: (packedList.ratingInfo.averageRating) || "0",
                        ratingCount: (packedList.ratingInfo.productRateCount) || "0"
                      }} />
                    </React.Fragment> : ''}
                  <div className="o-order__detail__description">
                    {packedList.clothingSize ? <div className="m-order__detail__size"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Talla.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.clothingSize}
                      </Label>
                    </div> : ''}
                    {packedList.clothingColor ? <div className="m-order__detail__color"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Color.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.clothingColor}
                      </Label>
                    </div> : ''}
                    {packedList.material ? <div className="m-order__detail__material"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Material.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.material}
                      </Label>
                    </div> : ''}
                    {packedList.quantity ? <div className="m-order__detail__quantity"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Cantidad.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.quantity}
                      </Label>
                    </div> : ''}
                    {/*{packedList.itemStatus === 'Cancelado' ? <div className="m-order__detail__quantity">
                      <Label id="statusPayment" className="a-order__footer__statusPayment --expired normal">{packedList.itemStatus}
                      </Label>
                    </div> : ''}*/}
                    {packedList.sellerName ? <div className="m-order__detail__quantity"><Span className="a-order__order light">{staticLabels && staticLabels["pwa.OrderHistoryPage.Vendidopor.label"]} </Span>
                      <Label className="a-order__orderNumber normal">{packedList.sellerName}
                      </Label>
                    </div> : ''}
                    {packedList.gwpItem ? <div className="giftitem">
                      <span className="icon"></span><span className="text">{staticLabels && staticLabels["pwa.OrderHistoryPage.Regalo.label"]}</span> </div> : ''}
                  </div>
                </div>
              </div>

            </div>
          </React.Fragment>
        }
      </React.Fragment>

    )

  }
}

export default PackedListInfo;

