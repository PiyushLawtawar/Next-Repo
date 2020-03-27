import React from 'react';
import { OnImgError, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import {Card} from '../../molecules/Card/Card';
import Slider from "react-slick";
//import './Carousel.styl';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className+" icon-arrow_right"}
      onClick={onClick}
    />
  );
}

 function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className +" icon-arrow_left"}
      onClick={onClick}
    />
  );
}


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plpData: {},
            carouselsData: props.carouselsData,
            items: {
                imageUrl: 'http://media9.liverpool.com.mx/web/images/products/es_MX/xl/1033333998.jpg',
                categoryName: 'CategoryName',
                description: 'asasas description',
                price: 'price ',
                discount: 'discount'
            }
        };
        const visibleSlides = 5;
        const naturalSlideWidth=220;
        const naturalSlideHeight=266;
        this.onImgError = this.onImgError.bind(this);
    }
    onImgError (e)  {
               const errImgElement  =  e.target;
               OnImgError(errImgElement,  Path.onImgError);
       }
    componentDidMount() {
        // <480 =2 item
        // <960 =4 item
        // <1024 =5 item
        // <1366 =6 item
        this.setState({
            visibleSlide: 
            screen.width <= 360 ? 2
                : screen.width <= 440 ? 1.6
                    : screen.width <= 480 ? 1.8
                        : screen.width <= 568 ? 2.2
                            : screen.width <= 768 ? 3
                                : screen.width <= 960 ? 4
                                    : screen.width <= 1020 ? 5
                                        : screen.width <= 1366 ? 6
                                            : 6,
            // naturalSlideWidth: screen.width <= 480 ? 40
            //     : screen.width <= 768 ? 110
            //         : screen.width <= 960 ? 8
            //             : screen.width <= 1080 ? 120
            //                 : screen.width <= 1366 ? 220
            //                     : 220,
            // naturalSlideHeight: screen.width <= 480 ? 70
            //     : screen.width <= 768 ? 133
            //         : screen.width <= 960 ? 10
            //             : screen.width <= 1080 ? 180
            //                 : screen.width <= 1366 ? 266
            //                     : 266

        });
    }
    componentWillReceiveProps(newProps,  state) {
        if (this.props.carouselsData  !==  newProps.carouselsData) {
            this.setState({ carouselsData: newProps.carouselsData })
        }
    }
    configCarousel = (data) => {
        var config ={};
                    if (data && data.contents && data.contents[0] && data.contents[0]["@type"] === "MostVisitedSpotLight") {
                    config= Object.assign({
                    minNumRecords:data.contents[0].minNumRecords,
                    totalNumRecs:data.contents[0].totalNumRecs,
                    maximumNumRecords:data.contents[0].maximumNumRecords,
                    name:data.contents[0].name
                });
                return config;
            }
        return config;
    }
    homePageCarouselImgUrl = (data) => {
      let groupTypeCollection =null;
       let  AssetsPath = '';
      if (typeof window !== 'undefined') {
          AssetsPath = getAssetsPath(window,undefined);  
      }
        var carouselImgUrl = !isEmpty(data) ? map(data && data.contents, (items, index) => {           
             if(items["@type"] === "MostVisitedSpotLight")     
             {
                 
                 
               return items && items.records && map(items.records, (item, index) => {
                    if(item['groupType'] &&  ((item['groupType'][0] && item['groupType'][0] ==='Collection')|| (item['groupType'] && item['groupType'] ==='Collection')) ){
                      groupTypeCollection = item.attributes['product.repositoryId'] && item.attributes['product.repositoryId'][0];
                     }else{
                      groupTypeCollection =null;
                    }
                       const carouselData = Object.assign({
                        imageUrl: item.attributes['sku.largeImage'] && item.attributes['sku.largeImage'][0] || Path.onImgError,
                        categoryName: item.attributes['product.displayName'] && item.attributes['product.displayName'][0],
                        description: item.attributes['product.displayName'] && item.attributes['product.displayName'][0],
                        List_price: item.attributes['sku.list_Price'] && item.attributes['sku.list_Price'][0],
                        promoPrice: item.attributes['sku.promoPrice'] && item.attributes['sku.promoPrice'][0],
                        sale_Price: item.attributes['sku.sale_Price'] && item.attributes['sku.sale_Price'][0],
                        minimumListPrice: item.attributes['minimumListPrice'] && item.attributes['minimumListPrice'][0],
                        maximumListPrice: item.attributes['maximumListPrice'] && item.attributes['maximumListPrice'][0],
                        minimumPromoPrice: item.attributes['minimumPromoPrice'] && item.attributes['minimumPromoPrice'][0],
                        maximumPromoPrice: item.attributes['maximumPromoPrice'] && item.attributes['maximumPromoPrice'][0],
                        numRecords: item.attributes.numRecords,
                        repositoryId: item.attributes['product.repositoryId'] && item.attributes['product.repositoryId'][0],
                        pdpTypeCollection: item.attributes['product.relatedProducts'] || groupTypeCollection || '',
                        pdpTypeHybrid: item.attributes['product.hybridProducts'] || ''
                    }) 
         
               return carouselData;
               //console.log("records==",carouselData,"===========");  
             //  return item.attributes["product.thumbnailImage"]
        })
        
                  
            }
        }) : carouselImgUrl = AssetsPath + '/static/images/filler_REC.gif';
      
        return carouselImgUrl[0];
    }
    render() {
          
           const _onImgError = this.onImgError;
           const configCarouselData=  !isEmpty(this.state.carouselsData) && this.configCarousel(this.state.carouselsData);
           var configCaro = parseInt(configCarouselData&&configCarouselData.maximumNumRecords);

           var img = this.state.carouselsData && this.state.carouselsData.contents && !isEmpty(this.state.carouselsData) && this.homePageCarouselImgUrl(this.state.carouselsData) || false;
          
          var settings = {
   
      initialSlide: 0,
      arrows: true,
        adaptiveHeight: true,
      responsive: [

        {
          breakpoint: 1950,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
            infinite: false,
             arrows: true,
             dots: true,
            adaptiveHeight: true,
             nextArrow: <SampleNextArrow />,
             prevArrow: <SamplePrevArrow />,
            
          }
        },{
          breakpoint: 1300,
          settings: {
            slidesToShow: 4.5,
            slidesToScroll: 4,
            infinite: false,
            dots: true,
            nextArrow: <SampleNextArrow />,
             prevArrow: <SamplePrevArrow />,
            adaptiveHeight: true
          }
        },
        {
          breakpoint: 910,
          settings: {
            slidesToShow: 3.25,
            slidesToScroll: 3,
            dots: true,
            infinite: false,
            arrows: false,
                       nextArrow: <SampleNextArrow className={"icon-arrow_left"}/>,
       prevArrow: <SamplePrevArrow className={"icon-arrow_left"}/>,
            adaptiveHeight: true
          }
        },
        {
          breakpoint: 680,
          settings: {
            slidesToShow: 2.75,
            slidesToScroll: 2,
            dots: true,
            arrows: false,
            infinite: false,
            adaptiveHeight: true,
            useTransform: false
           
          }
        },
        {
          breakpoint: 418,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 2,
            dots: true,
            arrows: false,
            infinite: false,
            adaptiveHeight: true,
            useTransform: false
          }
        }
      ]
    };
           //console.log("this.props.chanelBrandCss = "+JSON.stringify(this.props.chanelBrandCss))
           return (
        <React.Fragment>
         {img!='undefined' && img && img.length && img.length>0?
          configCarouselData.totalNumRecs >= configCarouselData.minNumRecords?
            <section className="o-carousel sellerpage">
                  <h2>{configCarouselData.name}</h2>
                  <hr />                                                                         
                        <Slider {...settings} >
                                    {img!=undefined && !isEmpty(img) && map(img, (item, index) => {
                                       return (
                                            <Card data={item} onError={this.onImgError}  chanelBrandJSON={this.props.chanelBrandCss}/>
                                        )
                                       
                                    })
                                    }
                                </Slider>
                            
                         
            </section>
          :null:null}
        </React.Fragment>
        )
    }

}
export default Carousel
