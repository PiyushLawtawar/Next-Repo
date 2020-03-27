/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Home page Carousel content.
 *                <CardHomeCarousel> - will render Home page Carousel content,
 *                <Slider> - will help to apply slider effect to Home page Carousel content.
 * 
 * @exports  : HomeCarousel
 * @requires : module:React
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/map
 * @requires : module:lodash/get
 * @requires : module:Slider
 * @requires : module:helpers/utilities/utility#OnImgError, #setPrice
 * @requires : module:helpers/config/config#Path
 * @requires : module:molecules/Card/Card#CardHomeCarousel
 * @requires : module:atoms/Link/Link#Link
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
import { setPrice } from '../../../../helpers/utilities/utility';

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
 * @class HomeCarousel
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class HomeCarousel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            carouselsData: props.getCarouselsData || '',
            visibleSlide: 2,
            naturalSlideWidth:220,
            naturalSlideHeight:266,
            renderFlag:false,
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
 * @function callGtmForCarousal
 * @desc this function is use to add productImpression event into GTM dataLayer object.
 * @param {Array} caroudalData 
 * @returns null.
 * 
 */
callGtmForCarousal=(caroudalData)=>{
this.productListDataForGTM=[];
this.productListDataForGTM2=[];
let splitVariable=[];
     let productCount = 0;
            if(caroudalData.length < 15){
                productCount = caroudalData.length;
            }else{
                productCount = 15;  
            }
      if (caroudalData) {
                for (var i = 0; i < caroudalData.length; i++) {
                    const { showPrice, metric2 } = setPrice(caroudalData[i]);
                    var objProduct = {};
                    objProduct.brand =caroudalData[i]['product.brand'] || '';
                    objProduct.category =  caroudalData[i]['product.category'] || '';
                    objProduct.dimension36 = caroudalData[i].isMarketPlace && caroudalData[i].isMarketPlace === "true"?'Market Place-'+caroudalData[i].Seller :caroudalData[i].Seller || '';
                    objProduct.id = caroudalData[i]['sku.repositoryId'];
                    objProduct.list =caroudalData[i]['product.category'] +'|secondary'  || '';
                    objProduct.name = caroudalData[i]['product.displayName'];
                    objProduct.position = i+1;
                    objProduct.price =caroudalData[i]['sku.promoPrice'] !== '0.0' ? caroudalData[i]['sku.promoPrice'].toString(): showPrice.toString().replace(/,/g,'') || '';
                    objProduct.variant = "N/A";
                    objProduct.metric3=caroudalData[i]['sku.promoPrice'].toString();
                    objProduct.metric2 = caroudalData[i]['sku.list_Price'] !== '0.0' ? caroudalData[i]['sku.list_Price'].toString().replace(/,/g,'') : metric2.toString().replace(/,/g,'') || '';
                    this.productListDataForGTM.push(objProduct);
                    //console.log('caroudalData',caroudalData[i]);
                }
                //     for (var i = 15; i < caroudalData.length; i++) {
                //     var objProduct = {};
                //     objProduct.brand =caroudalData[i]['product.brand'] || '';
                //     objProduct.category =  caroudalData[i]['product.category'] || '';
                //     objProduct.dimension36 =  caroudalData[i].Seller || '';
                //     objProduct.id = caroudalData[i]['sku.repositoryId'];
                //     objProduct.list = "SearchResults";
                //     objProduct.name = caroudalData[i]['product.displayName'];
                //     objProduct.position = i+1;
                //     objProduct.price =caroudalData[i]['sku.promoPrice'] !== '0.0' ? caroudalData[i]['sku.promoPrice']: caroudalData[i]['sku.list_Price'] || '';
                //     objProduct.variant = "N/A";
                //     objProduct.metric3=caroudalData[i]['sku.promoPrice'];
                //     objProduct.metric2 = caroudalData[i]['sku.list_Price'];
                //     this.productListDataForGTM2.push(objProduct);
                //     //console.log('caroudalData',caroudalData[i]);
                // }
            // }
            //  dataLayer.push({
            //         event: "productImpression",
            //         ecommerce: {
            //             impressions: this.productListDataForGTM
            //         }
            //      });
            //       if(caroudalData.length > 15){
            //      dataLayer.push({
            //         event: "productImpression",
            //         ecommerce: {
            //             impressions: this.productListDataForGTM2
            //         }
            //      });
            //       }
                             do {
                splitVariable.push(this.productListDataForGTM.splice(0,15))
            } while( this.productListDataForGTM.length > 0 );
         
            }
           for(var i=0;i<splitVariable.length;i++){
                    dataLayer.push({
                                event: "productImpression",
                                ecommerce: {
                                    impressions: splitVariable[i]
                                }
                            });
                        }
}

    /**
     * @function getHomePageCaraosalGTM
     * @desc this function is use to add "productClick" event into GTM dataLayer object.
     * @param {Obejct} data 
     * @returns null.
     * 
     */
    getHomePageCaraosalGTM=(data)=>{
    let allCarausalData = this.props && this.props.getCarouselsData && this.props.getCarouselsData.records || [];
    let selectedProduct = {};
    let position = 0;
    for(var i=0 ;i<allCarausalData.length;i++){
if(allCarausalData[i]['product.repositoryId'] === data.repositoryId){
   selectedProduct =  allCarausalData[i];
   position = i+1;
}
    }
    if(selectedProduct !== {}){
    const { showPrice, metric2 } = setPrice(selectedProduct);
    dataLayer.push({
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'actionField': {'action':"click",'list': selectedProduct['product.category'] +'|secondary'},
                        'products': [{
                            name:  selectedProduct['product.displayName'] || '',
                            id:  selectedProduct['product.repositoryId'] || '',
                            category: selectedProduct['product.category'] || '',
                            variant: 'N/A',
                            brand: selectedProduct['product.brand'] || '',
                            price: selectedProduct['sku.promoPrice'] !== '0.0' ? selectedProduct['sku.promoPrice'].toString().replace(/,/g,'') : showPrice.toString().replace(/,/g,'') || '',
                            position: position || '',
                            dimension36: selectedProduct.isMarketPlace && selectedProduct.isMarketPlace === "true"?'Market Place-'+selectedProduct.Seller :selectedProduct.Seller|| '', //CD 36
                            metric2: selectedProduct['sku.list_Price'] !== '0.0' ? selectedProduct['sku.list_Price'].toString().replace(/,/g,''): metric2.toString().replace(/,/g,'') || '', //M2
                            metric3: selectedProduct['sku.promoPrice'].toString() || '',//M3
                        }]
                    }
                },
        });
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
                let groupTypeCollection =null;
                 map(data.records, (item, index) => {
                    if(item['groupType'] && ((item['groupType'][0] && item['groupType'][0] ==='Collection')|| (item['groupType'] && item['groupType'] ==='Collection')) ){
                        groupTypeCollection = item['product.repositoryId'];
                    }else{
                        groupTypeCollection =null;
                    }
                      let carouselData = {
                            imageUrl: item['sku.largeImage'] || Path.onImgError, 
                            description: item['product.displayName'],
                            repositoryId: item['product.repositoryId'],
                            pdpTypeCollection: item['product.relatedProducts'] || groupTypeCollection || '',
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

        const img = !isEmpty(this.state.carouselsData) && this.homePageCarouselImgUrl(this.state.carouselsData);
        const { carouselsData } = this.state;
        const moreLinkText = get(carouselsData, 'moreLinkText', '#');
        const asInfo = moreLinkText !== '#' ? `/tienda/${moreLinkText}`: '#';
        const href = `/tienda/twoColumnCategoryPage?categoryId=${moreLinkText}`;

        if(this.props && this.props.getCarouselsData && this.props.getCarouselsData.records){
            let tempData = this.props && this.props.getCarouselsData && this.props.getCarouselsData.records || [];
    if(this.state && this.state.renderFlag === false){
              this.setState({
     renderFlag:true
    })
        const totalNumRecs =  this.props.getCarouselsData.totalNumRecs;
    const minNumRecords = this.state.carouselsData.minNumRecords;
       if(totalNumRecs >= minNumRecords){
           this.callGtmForCarousal(this.props.getCarouselsData.records);
       }
   
    }
}
        return (

            <React.Fragment>
                 <div className="container my-5 homepage">
                    <div className="row carousel-heading justify-content-center">
                        <div className="mb-5"><Link asInfo={asInfo} href={href} >{this.state.carouselsData && this.state.carouselsData.name}<i className="icon-arrow_right"></i></Link></div>
                    </div>
                    
                <Slider {...settings} >
                            {
                                !isEmpty(img) && map(img, (item, index) => {
                                    return (
                                       
                                            <CardHomeCarousel data={item} onError={this.onImgError} getHomePageCaraosalGTM={this.getHomePageCaraosalGTM}/>
                                        
                                    )
                                })
                            }
                                </Slider>
                        
                         
                </div>
            </React.Fragment>
        )
    }
}


export default HomeCarousel;
