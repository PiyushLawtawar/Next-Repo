import React from 'react';
import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Slider from "react-slick";
//import { CarouselProvider, Slider, Slide, ButtonBack, Image, ButtonNext,Dot } from 'pure-react-carousel';
import {Card} from '../../molecules/Card/Card';
// import './Carousel.styl'
import get from 'lodash/get';

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
class CarouselBlp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            items: {
                imageUrl: 'http://media9.liverpool.com.mx/web/images/products/es_MX/xl/1033333998.jpg',
                categoryName: 'CategoryName',
                description: 'asasas description',
                price: 'price ',
                discount: 'discount'
            },
            carouselsData: props.carouselsData || {},
            showImg: true
        };
        const visibleSlides = 6;
        const naturalSlideWidth=220;
        const naturalSlideHeight=266;
        this.onImgError = this.onImgError.bind(this);
    }
    onImgError (e)  {
               const errImgElement  =  e.target;
               OnImgError(errImgElement,  Path.onImgError);
       }
    componentDidMount() {
        //  let carouselRecords = get(this.state, 'carouselsData.carouselContent[0].records', []);
         
          const carouselRecords = get(this.state, 'carouselsData.records', {});
           if(!isEmpty(carouselRecords)) {
                this.callGtmForCarousal(carouselRecords);
            }

        
        // <480 =2 item
        // <960 =4 item
        // <1024 =5 item
        // <1366 =6 item
        this.setState({
            visibleSlide: screen.width <= 480 ? 2
                : screen.width <= 768 ? 3
                    : screen.width <= 960 ? 4
                        : screen.width <= 1080 ? 5
                            : screen.width <= 1366 ? 6
                                : 6,
            naturalSlideWidth: screen.width <= 480 ? 40
                : screen.width <= 768 ? 110
                    : screen.width <= 960 ? 8
                        : screen.width <= 1080 ? 120
                            : screen.width <= 1366 ? 220
                                : 220,
            naturalSlideHeight: screen.width <= 480 ? 70
                : screen.width <= 768 ? 133
                    : screen.width <= 960 ? 10
                        : screen.width <= 1080 ? 180
                            : screen.width <= 1366 ? 266
                                : 266

        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.carouselsData  !== nextProps.carouselsData) {
            const carouselRecords = get(nextProps, 'carouselsData.records', {});
            this.setState({ showImg: false })
            if(!isEmpty(carouselRecords)) {
                 this.callGtmForCarousal(carouselRecords); 
            }
            this.setState({ carouselsData: nextProps.carouselsData }, () => {
                this.setState({ showImg: true });
            });    
        }
    }

getBrandName = (getSellerName) => {
     let sellerNameHardCode = '';
      if (getSellerName) {
            if (getSellerName.indexOf('liverpool') > -1) {
                sellerNameHardCode = 'liverpool';
            } else if (getSellerName.indexOf('williams-sonoma') > -1) {
                sellerNameHardCode = 'Williams-Sonoma';
            } else if (getSellerName.indexOf('potterybarnkids') > -1) {
                sellerNameHardCode = 'PotteryBarnKids';
            } else if (getSellerName.indexOf('potterybarn') > -1) {
                sellerNameHardCode = 'PotteryBarn';
            } else if (getSellerName.indexOf('pbteens') > -1) {
                sellerNameHardCode = 'PotteryBarnTeen';
            } else if (getSellerName.indexOf('westelm') > -1) {
                sellerNameHardCode = 'WestElm';
            } else {
                sellerNameHardCode = 'liverpool';
            }
        }
        return sellerNameHardCode;
}

callGtmForCarousal=(caroudalData)=>{
//console.log('caroudalData',caroudalData);
        let categoryName = this.props.categoryNameForCarousal;
        let getSellerName = window.location.host;
        let sellerNameHardCode = '';
  
if(getSellerName){
sellerNameHardCode  = this.getBrandName(getSellerName);
}
 
this.productListDataForGTM=[];
let splitVariable=[];
     let productCount = 0;
            if(caroudalData.length < 15){
                productCount = caroudalData.length;
            }else{
                productCount = 15;
            }
      if (caroudalData) {
                for (var i = 0; i < caroudalData.length ; i++) {
                    var objProduct = {};
                    objProduct.brand =caroudalData[i]['product.brand'] && caroudalData[i]['product.brand'][0] || '';
                    objProduct.category =  categoryName || '';
                    objProduct.dimension36 =  caroudalData[i].sellerName && caroudalData[i].isMarketPlace[0] && caroudalData[i].isMarketPlace[0] === "true" ?'Market Place-'+caroudalData[i].sellerName :sellerNameHardCode;
                    objProduct.id = caroudalData[i]['sku.repositoryId'] && caroudalData[i]['sku.repositoryId'][0];
                    objProduct.list =  caroudalData[i] && caroudalData[i]['product.category'] && caroudalData[i]['product.category'][0] ? caroudalData[i]['product.category'][0]+'|secondary': '';
                    objProduct.name = caroudalData[i].productDisplayName && caroudalData[i].productDisplayName[0];
                    objProduct.position = i+1;
                    objProduct.price = caroudalData[i].promoPrice && (caroudalData[i].promoPrice[0]!== '0.0') ? caroudalData[i].promoPrice[0].toString() : caroudalData[i].productPrice[0] &&  caroudalData[i].productPrice[0] ? caroudalData[i].productPrice[0].toString() :'';
                    objProduct.variant = "N/A";
                    objProduct.metric3=caroudalData[i].promoPrice && caroudalData[i].promoPrice[0].toString();
                    objProduct.metric2 = caroudalData[i].productPrice && caroudalData[i].productPrice[0].toString();
                    this.productListDataForGTM.push(objProduct);
                    //console.log('caroudalData',caroudalData[i]);
                }
                //        for (var i = 15; i < caroudalData.length; i++) {
                //     var objProduct = {};
                //     objProduct.brand =caroudalData[i]['product.brand'] || '';
                //     objProduct.category =  caroudalData[i]['product.category'] || '';
                //     objProduct.dimension36 =  caroudalData[i].Seller || '';
                //     objProduct.id = caroudalData[i]['sku.repositoryId'];
                //     objProduct.list = caroudalData[i]['product.category'] || '';
                //     objProduct.name = caroudalData[i]['product.displayName'];
                //     objProduct.position = i+1;
                //     objProduct.price = caroudalData[i]['sku.promoPrice'] !== '0.0' ? caroudalData[i]['sku.promoPrice'] : caroudalData[i]['sku.list_Price'];
                //     objProduct.variant = "N/A";
                //     objProduct.metric3=caroudalData[i]['sku.promoPrice'];
                //     objProduct.metric2 = caroudalData[i]['sku.list_Price'];
                //     this.productListDataForGTM2.push(objProduct);
                //     //console.log('caroudalData',caroudalData[i]);
                // }
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

    blpCarouselImgUrl = (data) => {
        var carouselImgUrl = !isEmpty(data) ? map(data, (items, index) => {
            if (items["@type"] === "MostVisitedSpotLight") {
                return map(items.records, (item, index) => {
                    const carouselData = Object.assign({
                        imageUrl: item['sku.largeImage'], /* 23509 fix */
                        categoryName: item['product.displayName'],
                        description: item['product.displayName'],
                        price: item['sku.sale_Price'],
                        discount: item['sku.sale_Price']
                    })          

               return carouselData;
             //  return item.attributes["product.thumbnailImage"]
        })
                 
            }
        }) : carouselImgUrl = 'https://assetsqa.liverpool.com.mx/assets/web/images/targeted_promotions/es/bpromos01d_101218com_new.jpg'
        return carouselImgUrl[0];
    }

    triggerGTM = (data) =>{
        let categoryName = this.props.categoryNameForCarousal;
        let getSellerName  = window.location.host;
        let sellerNameHardCode = '';
        sellerNameHardCode  = this.getBrandName(getSellerName);
        let allCarausalData = this.state &&  this.state.carouselsData && this.state.carouselsData.records ? this.state.carouselsData.records:[];
        let setCatName = this.props.sendCurrentL1Name;
        let selectedProduct = {};
        let position = 0;
        for(var i=0 ;i<allCarausalData.length;i++){
            const productId = allCarausalData[i]['productId'] && allCarausalData[i]['productId'][0] || allCarausalData[i]['product.repositoryId'] && allCarausalData[i]['product.repositoryId'][0] || allCarausalData[i]['sku.repositoryId'] && allCarausalData[i]['sku.repositoryId'][0] || '';
            if(productId === data.repositoryId){
                selectedProduct =  allCarausalData[i];
                position = i+1;
            }
        }
    if(!isEmpty(selectedProduct)){
        dataLayer.push({
                    'event': 'productClick',
                    'ecommerce': {
                        'click': {
                            'actionField': {'list':selectedProduct && selectedProduct['product.category'] && selectedProduct['product.category'][0] ? selectedProduct['product.category'][0]+'|secondary': ''},
                            'products': [{
                                name:  selectedProduct && selectedProduct.productDisplayName && selectedProduct.productDisplayName[0] ? selectedProduct.productDisplayName[0] :'',
                                id:  !isEmpty(data.repositoryId)? data.repositoryId: '',
                                category: categoryName || '',
                                variant: 'N/A',
                                brand: selectedProduct && selectedProduct['product.brand'] && selectedProduct['product.brand'][0] ? selectedProduct['product.brand'][0]:'',
                                price: selectedProduct.promoPrice && selectedProduct.promoPrice[0] !== '0.0' ? selectedProduct.promoPrice[0].toString() : selectedProduct['sku.listPrice'] && selectedProduct['sku.listPrice'][0].toString() || '',
                                position: position || '',
                                dimension36: selectedProduct.sellerName && selectedProduct.isMarketPlace[0] && selectedProduct.isMarketPlace[0] === "true" ?'Market Place-'+selectedProduct.sellerName :sellerNameHardCode || '', //CD 36
                                metric2:selectedProduct['sku.listPrice'] && selectedProduct['sku.listPrice'][0] ? selectedProduct['sku.listPrice'][0].toString(): '', //M2
                                metric3: selectedProduct.promoPrice && selectedProduct.promoPrice[0] ? selectedProduct.promoPrice[0].toString():'',//M3
                            }]
                        }
                    },
            });
    }

}

    blpInlineCarouselImgUrl = (data) => {
        //console.log("blpInlineCarouselImgUrl = "+JSON.stringify(data))
        var promo_price =0;
        var groupTypeCollection =null;
        var carouselImgUrl = !isEmpty(data) ? map(data.records, (item, index) => {

            promo_price = Number(item['promoPrice'][0]);
            if(item['groupType'] &&  ((item['groupType'][0] && item['groupType'][0] ==='Collection')|| (item['groupType'] && item['groupType'] ==='Collection')) ){
                groupTypeCollection = item['productId'][0];
            }else{
                groupTypeCollection =null;
            }
                    const carouselData = Object.assign({
                        imageUrl: item['sku.largeImage'] && item['sku.largeImage'][0] || Path.onImgError, /* 23509 fix */
                        categoryName: item['productDisplayName'][0],
                        description: item['productDisplayName'][0],
                        List_price: item['sku.listPrice'][0] ,
                        sale_Price:item['salePrice'][0],
                        promoPrice:promo_price,
                        minList:item['minimumListPrice']?item['minimumListPrice'][0]:0,
                        maxList:item['maximumListPrice']?item['maximumListPrice'][0]:0,
                        minPromo:item['minimumPromoPrice']?item['minimumPromoPrice'][0]:0,
                        maxPromo:item['maximumPromoPrice']?item['maximumPromoPrice'][0]:0,
                       // numRecords: ((item['minimumListPrice']?item['minimumListPrice'][0]:0)!== (item['maximumListPrice']?item['maximumListPrice'][0]:0))?3:1,
                        numRecords:2,
                        discount: (promo_price && promo_price >0 )?item['promoPrice'][0]:item['salePrice'][0],
                        //repositoryId: item['sku.repositoryId'][0],
                        repositoryId: item['productId'][0],
                        pdpTypeCollection: item['product.relatedProducts'] || groupTypeCollection|| '',
                        pdpTypeHybrid: item['product.hybridProducts'] || ''
                    })          

               return carouselData;
             //  return item.attributes["product.thumbnailImage"]
        })
        
         : carouselImgUrl = 'https://assetsqa.liverpool.com.mx/assets/web/images/targeted_promotions/es/bpromos01d_101218com_new.jpg'
        return carouselImgUrl;
    }
    render() {
         var settings = {
      responsive: [
        {
          breakpoint: 3100, 
          settings: {
            slidesToShow: 6,
            slidesToScroll: 5,
            infinite: true,
            dots: true,
            arrows: true,
            nextArrow: <SampleNextArrow className={"icon-arrow_right"}/>,
            prevArrow: <SamplePrevArrow className={"icon-arrow_left"}/>,
            adaptiveHeight: true,
            draggable: false
          }
        },
        {
          breakpoint: 1124,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 3,
            infinite: false,
            arrows: false,
            dots: true,
            adaptiveHeight: true
          }},
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 2,
            dots: true,
            infinite: false,
            arrows: false,
            nextArrow: <SampleNextArrow className={"icon-arrow_right"}/>,
            prevArrow: <SamplePrevArrow className={"icon-arrow_left"}/>,
            adaptiveHeight: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2.40,
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
          
           const _onImgError = this.onImgError;
           const img = !isEmpty(this.state.carouselsData) && this.state.carouselsData&& this.state.carouselsData["@type"] === "MostVisitedSpotLight"?this.blpInlineCarouselImgUrl(this.state.carouselsData)
                                                                                          :this.blpCarouselImgUrl(this.state.carouselsData);
           const dotCount = Math.ceil(img && img.length / this.state.visibleSlide);
           const { showImg } = this.state;
           
           return (
        <React.Fragment>
            <section className="o-carousel blpcarousel">
                  <h2>{this.state.carouselsData.name}</h2>
                  <hr /> 
                            <div className="owl-stage-outer">
                            <Slider {...settings} >
                                    {!isEmpty(img) && map(img, (item, index) => {
                                        return (
                                            
                                                <Card showImg={showImg} data={item} key={index}  onError={this.onImgError}  chanelBrandJSON={this.props.chanelBrandJSON} triggerGTM={this.triggerGTM}/>
                                            
                                        )
                                    })
                                    }
                                </Slider>
                            </div>
                           
            </section>
        </React.Fragment>
        )
    }

}
export default CarouselBlp
