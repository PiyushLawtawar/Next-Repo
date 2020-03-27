/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Recently Viewed Products Carousel content.
 *                <CardHomeCarousel> - will render Home page Carousel content,
 *                <Slider> - will help to apply slider effect to Home page Carousel content.
 * 
 * @exports  : RecentlyViewedProductsCarousel
 * @requires : module:React
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/map
 * @requires : module:lodash/get
 * @requires : module:Slider
 * @requires : module:helpers/utilities/utility#OnImgError
 * @requires : module:helpers/config/config#Path
 * @requires : module:molecules/Card/Card#CardHomeCarousel
 * Team : B&S Team
 * 
 */
import React from 'react';
import { Utility,OnImgError } from '../../../../helpers/utilities/utility';
import { Path } from '../../../../helpers/config/config';
import { parentContext } from '../../../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import {CardHomeCarousel} from '../../../molecules/Card/Card';
import Slider from "react-slick";
import get from 'lodash/get';
import Link from '../../../atoms/Link/Link';

/**
 * Create div html element
 * @function SampleNextArrow
 * @desc this function is use to create right arrow of Carousel.
 * @param {Object} props 
 * @returns HTML content.
 * 
 */
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

/**
 * Create div html element
 * @function SamplePrevArrow
 * @desc this function is use to create left arrow of Carousel.
 * @param {Object} props 
 * @returns HTML content.
 * 
 */
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

/**
 * @class RecentlyViewedProductsCarousel
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class RecentlyViewedProductsCarousel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            carouselsData: props.getCarouselsData || '',
            visibleSlide: 2,
            naturalSlideWidth:220,
            naturalSlideHeight:266
        }
        this.onImgError = this.onImgError.bind(this);

    }

    /**
     * REACT life cycle event. It will be called once the component is actually mounted to the DOM.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        // <480 =2 item
        // <960 =4 item
        // <1024 =5 item
        // <1366 =6 item
        this.setState({
            visibleSlide:
            screen.width <= 360 ? 2
                : screen.width <= 440 ? 2.5
                    : screen.width <= 480 ? 2.5
                        : screen.width <= 568 ? 2.2
                            : screen.width <= 768 ? 3
                                : screen.width <= 960 ? 4
                        : screen.width <= 1080 ? 5
                            : screen.width <= 1366 ? 5
                                : 5
        });
    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps
     * @param {*} nextProps 
     * @param {*} state 
     * 
     */
    componentWillReceiveProps(newProps, state){
        if(newProps.getCarouselsData && newProps.getCarouselsData){
            this.setState({carouselsData:newProps.getCarouselsData})
        }
    }

  /**
   * @function homePageCarouselImgUrl
   * @desc this function is use to get carouselData product informations.
   * @param {Obejct} data 
   * @returns {Array} newCaro.
   * 
   */
  homePageCarouselImgUrl = (data) => {
    if (data["@type"] === "MostVisitedSpotLight") {
                let newCaro = [];
                 map(data.records, (item, index) => {
                      let carouselData = {
                            imageUrl: item['sku.largeImage'] || Path.onImgError, 
                            description: item['product.displayName'],
                            repositoryId: item['product.repositoryId'],
                            pdpTypeCollection: item['product.relatedProducts'] || '',
                            pdpTypeHybrid: item['product.hybridProducts'] || ''
                    }
                    return newCaro.push(carouselData);
                })
                return newCaro;
            }
    else if(data && data.recentlyViewedProducts){
         let newCaro = [];
                 map(data.recentlyViewedProducts, (item, index) => {
                      let carouselData = {
                            imageUrl: item.imageUrl || Path.onImgError,
                            description: item.displayName,
                            repositoryId: item.repositoryId,
                            pdpTypeCollection: item.relatedProducts || '',
                            pdpTypeHybrid: item.hybridProducts || ''
                    }
                    return newCaro.push(carouselData);
                })
                return newCaro;
    }
    }

  /**
   * @function onImgError
   * @desc this function is use to call OnImgError() function.
   * @param {Obejct} e 
   * @returns null.
   * 
   */
  onImgError (e) {
       const errImgElement = e.target;
       OnImgError(errImgElement, Path.onImgError);
   }

    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {


        const img = !isEmpty(this.state.carouselsData) && this.homePageCarouselImgUrl(this.state.carouselsData);
        const { carouselsData } = this.state;
        let getlenth = carouselsData.recentlyViewedProducts && carouselsData.recentlyViewedProducts.length || 0
        if(getlenth!=0 && getlenth >=5) { getlenth = 5 } 
        
       // console.log("carouselsData==",getlenth )
       var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      initialSlide: 0,
      arrows: true,
      nextArrow: <SampleNextArrow className={"icon-arrow_left"}/>,
       prevArrow: <SamplePrevArrow className={"icon-arrow_left"}/>,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
            draggable: false
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 1,
            dots: false,
            infinite: false,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 2,
             infinite: false,
            dots: false,
            arrows: false
          }
        }
      ]
    };

        
        const moreLinkText = get(carouselsData, 'moreLinkText', '#');
        const asInfo = moreLinkText !== '#' ? `/tienda/${moreLinkText}`: '#';
        const href = `/tienda/twoColumnCategoryPage?categoryId=${moreLinkText}`;
        return (

            <React.Fragment>
            <div className="container mb-5 homepage">
                                    <div className="m-recentItems">
                                        <div className="row justify-content-center no-gutters p-3">
                                            <div className="col-12 text-center">
                                            <h5 className="a-recentItems__title">PRODUCTOS VISTOS RECIENTEMENTE</h5>
                                            
                                            </div>
                                            <div className="col-lg-12 col-12 mt-3 text-center">
                                            {getlenth >=5 &&
                                              <Slider {...settings} >
                                            {
                                                !isEmpty(img) && map(img, (item, index) => {
                                                    return (
                                                    
                                                            <CardHomeCarousel data={item} onError={this.onImgError} />
                                                        
                                                    )
                                                })
                                            }
                                </Slider>
                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                 
            </React.Fragment>
        )
    }
}


export default RecentlyViewedProductsCarousel; 
