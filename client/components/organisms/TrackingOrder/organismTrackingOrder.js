import React from 'react';
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import { LinkCard } from '../../molecules/Card/Card';
import AnchorHeadlineIcon from '../../molecules/MixinMolecules/MixinMolecules';
import Span from '../../atoms/Span/Span';
import Carousel from '../../organisms/Carousel/Carousel';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import OrganismTrackingBuyInfo from '../../organisms/TrackingBuyInfo/organismTrackingBuyInfo';
import MoleculeTrackingNumber from '../../molecules/TrackingOrder/moleculeTrackingNumber';
import OrganismTrackingRating from '../../organisms/TrackingOrder/organismTrackingRating';
import MoleculeProgressBar from '../../molecules/ProgressBar/moleculeProgressBar';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Router from 'next/router';
import Figure from '../../molecules/Figure/Figure';
import { Path } from '../../../helpers/config/config';
import { OnImgError } from '../../../helpers/utilities/utility';
import Slider from "react-slick";
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { CardTrackingCarousal } from '../../molecules/Card/Card';
import Link from '../../atoms/Link/Link';


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " icon-arrow_right"}
      onClick={onClick}
    >

    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " icon-arrow_left"}
      onClick={onClick}
    >
    </div>
  );
}




class OrganismTrackingOrder extends React.Component {
  constructor(props) {
    super(props);
  }


  redirectToUrl = (displayName, productId) => {
    let productName = displayName.toLowerCase().replace(/ /g, '-');
    const url = '/tienda/pdp/' + productName + '/' + productId;
    Router.push(url);

  }

  redirectToOrderHistorySomsData = (searchTerm, SomsSkuID) => {
    window && window.history.back();
  }

  redirectToOrderHistory = (searchTerm) => {
    window && window.history.back();
  }

  showMobileTrackingView = () => {
    this.hide1.classList.add('d-none');
    this.hide2.classList.add('d-none');
    this.hide3.classList.add('d-none');
    this.show1.classList.remove('d-none');
    this.show2.classList.remove('d-none');
    this.props.showMobileTracking();
  }

  render() {
    const router = this.props.router;
    const SomsSkuID = this.props.router && this.props.router.skuID;
    const searchTerm = this.props.searchTerm;
    // console.log('searchTerm', searchTerm)
    const staticLabels = this.props.staticLabels;
    const loginDetails = this.props.loginDetails;
    const commerceItems = this.props && this.props.orderSearched && this.props.orderSearched.commerceItems;
    const SomsData = commerceItems && commerceItems.commerceItem;
    // console.log('router', staticLabels && staticLabels["pwa.OrderHistoryPage.quantity.lable"])
    const deliveryInfo = this.props && this.props.orderSearched && this.props.orderSearched.deliveryInfo;
    const deliveryAddress = this.props && this.props.orderSearched && this.props.orderSearched.deliveryAddress;
    const trackingOrder_Rating_type = 'desktop';
    let productItem = [];

    commerceItems && commerceItems.length > 0 && commerceItems.map((item => {
      let objectItem = {}
      objectItem.description = item.displayName;
      objectItem.imageUrl = item.smallImage;
      objectItem.repositoryId = item.productId;
      objectItem.quantity = item.quantity;

      productItem.push(objectItem);
    }));


    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 2,
      initialSlide: 0,
      lazyLoad: true,
      nextArrow: <SampleNextArrow className={"icon-arrow_left"} />,
      prevArrow: <SamplePrevArrow className={"icon-arrow_left"} />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 2,
            infinite: false,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 1,
            dots: false,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 3,
            dots: true,
            arrows: false
          }
        }
      ]
    };
    return (
      <React.Fragment>

        {router && router.isSomsOrder ?

          <div className={loginDetails && loginDetails.LoggedInSession ? "col-lg-9 m-column_mainContent" : "container-fluid p-0"}>

            <div className="o-box -forms m-lg-0 o-trackingOrder__commonView" ref={hide => this.hide1 = hide}>
              <BoxTitle texto="Seguimiento a entrega" classe="m-0 a-box-title--forms d-block d-lg-none" />
            </div>

            <div className="o-box o-tracking__boxBuyInfo o-trackingOrder__commonView" ref={hide => this.hide2 = hide}>
              <OrganismTrackingBuyInfo staticLabels={staticLabels} deliveryAddress={deliveryAddress} deliveryInfo={deliveryInfo} SomscommerceItems={commerceItems} router={this.props.router} searchTerm={searchTerm} />

              <div className="container">
                {
                  SomsData && SomsData.estimatedDeliveryDate ?
                    <div className="row o-tracking__deliverDateRow">
                      <span className="a-tracking__deliverDateValue">Fecha estimada de entrega: </span>
                      <span className="a-tracking__deliverDate">{SomsData && SomsData.estimatedDeliveryDate}</span>
                    </div>
                    :
                    <div className="row o-tracking__deliverDateRow">
                    </div>}

              </div>

              <div className="container">
                <div className="row o-tracking__gallery">


                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3">
                    <div>
                      <figure className="m-figureCard__figure card m-trackingOrder__figure">
                        {SomsData && SomsData.InventoryStatus ?
                          <Image showLoader className="card-img-top" src={SomsData && SomsData.SmallImage ? SomsData && SomsData.SmallImage : Path.onImgError} alt={SomsData && SomsData.displayName} onClick={() => this.redirectToUrl(item.displayName, item.productId)} />
                          :
                          <div className="o-order__product__image">
                            <Image showLoader className="a-order__product__image" src={SomsData && SomsData.SmallImage ? SomsData && SomsData.SmallImage : Path.onImgError} alt={SomsData && SomsData.displayName} />
                            <Paragraph className="prueba">No disponible </Paragraph>
                          </div>
                        }
                        <figcaption className="m-figureCard__figcaption card-body d-flex flex-column align-items-start">
                          <Paragraph className="a-card-description">{SomsData && SomsData.DisplayName}
                          </Paragraph>
                          <Paragraph className="a-paragraph__quantity">{staticLabels && staticLabels["pwa.OrderHistoryPage.quantity.lable"]} {SomsData && SomsData.Quantity}
                          </Paragraph>
                        </figcaption>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row o-tracking__rowProgressBar">
                  <div className="col-12">
                    <MoleculeProgressBar SomsData={SomsData} router={this.props.router} staticLabels={staticLabels}/>
                  </div>
                </div>
              </div>
              <MoleculeTrackingNumber staticLabels={staticLabels} deliveryInfo={deliveryInfo} router={this.props.router} commerceItems={commerceItems} />

            </div>
            <div className="row justify-content-end o-trackingOrder__commonView" ref={hide => this.hide3 = hide}>
              <div className="col-lg-3 col-12 justify-content-end">
                <Button className="a-btn a-btn--secondary a-btn-trackingOrder--cancel d-none d-lg-block" onClick={() => this.redirectToOrderHistorySomsData(searchTerm, SomsSkuID)} ripple="">{staticLabels && staticLabels["pwa.checkoutShippingPage.backButton.label"]}</Button>
              </div>
            </div>
          </div>
          :
          <div className={loginDetails && loginDetails.LoggedInSession ? "col-lg-9 m-column_mainContent" : "container-fluid p-0"}>

            <div className="o-box -forms m-lg-0 o-trackingOrder__commonView" ref={hide => this.hide1 = hide}>
              <BoxTitle texto="Seguimiento a entrega" classe="m-0 a-box-title--forms d-block d-lg-none" />
            </div>

            <div className="o-box o-tracking__boxBuyInfo o-trackingOrder__commonView" ref={hide => this.hide2 = hide}>
              <OrganismTrackingBuyInfo staticLabels={staticLabels} deliveryAddress={deliveryAddress} deliveryInfo={deliveryInfo} SomscommerceItems={commerceItems} router={this.props.router} searchTerm={searchTerm} />

              <div className="container">
                {
                  commerceItems && commerceItems[0].estimatedDeliveryDate ?
                    <div className="row o-tracking__deliverDateRow">
                      <span className="a-tracking__deliverDateValue">Fecha estimada de entrega: </span>
                      <span className="a-tracking__deliverDate">{commerceItems[0].estimatedDeliveryDate}</span>
                    </div>
                    :
                    <div className="row o-tracking__deliverDateRow">
                    </div>}

              </div>

              <div className="container">
                {commerceItems && commerceItems.length < 5 ?
                  <div className="row o-tracking__gallery">
                    {commerceItems && commerceItems.map((item, index) => {
                      return (
                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3" key={index}>
                          <div>
                            {item.inventoryStatus ?
                              <figure className="m-figureCard__figure card m-trackingOrder__figure">
                                <Image showLoader className="card-img-top" src={item.smallImage ? item.smallImage : Path.onImgError} alt={item.displayName} onClick={() => this.redirectToUrl(item.displayName, item.productId)} />
                                <figcaption className="m-figureCard__figcaption card-body d-flex flex-column align-items-start">
                                  <Paragraph className="a-card-description">{item.displayName}
                                  </Paragraph>
                                  <Paragraph className="a-paragraph__quantity">{staticLabels && staticLabels["pwa.OrderHistoryPage.quantity.lable"]} {item.quantity}
                                  </Paragraph>
                                </figcaption>
                              </figure>
                              :
                               <div className="m-figureCard__figure card m-trackingOrder__figure">
                              <figure className="product-notAvailable">
                                <Image showLoader className="product-notAvailable" src={item.smallImage ? item.smallImage : Path.onImgError} alt={item.displayName} />
                                <Paragraph className="prueba">No disponible </Paragraph>
                              </figure>
                                <figcaption className="m-figureCard__figcaption card-body d-flex flex-column align-items-start">
                                  <Paragraph className="a-card-description">{item.displayName}
                                  </Paragraph>
                                  <Paragraph className="a-paragraph__quantity">{staticLabels && staticLabels["pwa.OrderHistoryPage.quantity.lable"]} {item.quantity}
                                  </Paragraph>
                                </figcaption>
                              </div>
                            }
                          </div>
                        </div>
                      );
                    })}

                  </div>
                  :
                  <section className="o-carousel-section o-carousel">
                    <Slider {...settings} >
                      {
                        !isEmpty(productItem) && map(productItem, (item, index) => {
                          return (
                            <CardTrackingCarousal data={item} />
                          )
                        })
                      }
                    </Slider>
                  </section>}
              </div>

              <div className="container">
                <div className="row o-tracking__rowProgressBar">
                  <div className="col-12">
                    <MoleculeProgressBar orderSearched={commerceItems} staticLabels={staticLabels}/>
                  </div>
                </div>
              </div>

              <MoleculeTrackingNumber staticLabels={staticLabels} deliveryInfo={deliveryInfo} router={this.props.router} commerceItems={commerceItems} />
              {commerceItems && commerceItems[0].rateSeller && commerceItems[0].sellerOperatorId && commerceItems[0].sellerSkuId &&
                <div className="d-block d-lg-none pb-1">
                  <div className="o-trackingOrder__headline"><Link className="a-btn a-btn__tabs -noRadius a-trackingOrder__btnEvaluate" href='' onClick={this.showMobileTrackingView}>Califica al vendedor
                                                                  <div>

                    </div><i className="icon-arrow_right"></i></Link>
                  </div></div>}

            </div>

            {commerceItems && commerceItems[0].rateSeller && commerceItems[0].sellerOperatorId && commerceItems[0].sellerSkuId &&
              <OrganismTrackingRating staticLabels={staticLabels} trackingNumber={commerceItems[0].shippingId} commerceItems={commerceItems} onCustomerRating={this.props.onCustomerRating} />}

            <div className="row justify-content-end o-trackingOrder__commonView" ref={hide => this.hide3 = hide}>
              <div className="col-lg-3 col-12 justify-content-end">
                <Button className="a-btn a-btn--secondary a-btn-trackingOrder--cancel d-none d-lg-block" onClick={() => this.redirectToOrderHistory(searchTerm)} ripple="">{staticLabels && staticLabels["pwa.checkoutShippingPage.backButton.label"]}</Button>
              </div>
            </div>
            <div className="o-box d-none o-trackingOrder__ratingsMobile" ref={show => this.show1 = show}>
              <div className="m-box-title d-block d-lg-none">
                <div className="d-flex justify-content-start align-items-center">
                  <h2 className="m-0 a-box-title--forms">Califica al vendedor</h2>
                </div>
              </div>
            </div>
            <div className="container-fluid d-none o-trackingOrder__ratingsMobile" ref={show => this.show2 = show}>
              <div className="container p-0">
                {commerceItems && commerceItems[0].rateSeller && commerceItems[0].sellerOperatorId && commerceItems[0].sellerSkuId &&
                  <OrganismTrackingRating staticLabels={staticLabels} trackingNumber={commerceItems[0].shippingId} commerceItems={commerceItems} onCustomerRating={this.props.onCustomerRating} mobile />}
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    )
  }
}
export default OrganismTrackingOrder;