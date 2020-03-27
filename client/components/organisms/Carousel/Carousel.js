import React from 'react';
import { OnImgError,GetPrice } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Slider from "react-slick";
import { Utility,logError,logDebug, getAssetsPath} from '../../../helpers/utilities/utility';
import {Card} from '../../molecules/Card/Card';
//import './Carousel.styl';
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
class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plpData: {},
            carouselsData: props.carouselsData,
            renderFlag:false,
            items: {
                imageUrl: 'http://media9.liverpool.com.mx/web/images/products/es_MX/xl/1033333998.jpg',
                categoryName: 'CategoryName',
                description: 'asasas description',
                price: 'price ',
                discount: 'discount'
            },
            showImg: true /* 23404 fix */
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
        // if(this.state && this.state.carouselsData && this.state.carouselsData.carouselContent && his.state.carouselsData.carouselContent[0]){

        //  this.callGtmForCarousal(this.state.carouselsData.carouselContent[0].records);
        // const pageName = get(this.props, 'pageName', '');
        // if(pageName === 'pdp') {
        //     let carouselRecords = get(this.state, 'carouselsData.carouselContent[0].records', []);
        //     const PdpSecond = get(this.props, 'PdpSecond', false);
        //     if(PdpSecond) {
        //         carouselRecords = get(this.state, 'carouselsData.carouselContent[1].records', []);
        //     }
        //     if(!isEmpty(carouselRecords)) {
        //         this.callGtmForCarousal(carouselRecords);
        //     }
        // }
        // }
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
    componentWillReceiveProps(nextProps) {
        if (this.props.carouselsData  !== nextProps.carouselsData) {
            /* 23404 fix start*/
            this.setState({ showImg: false })
            this.setState({ carouselsData: nextProps.carouselsData }, () => {
              this.setState({ showImg: true });
            })
            /* 23404 fix end*/
            let carouselRecords = get(nextProps, 'carouselsData.carouselContent[0].records', []);
            const PdpSecond = get(this.props, 'PdpSecond', false);
            if(PdpSecond) {
                carouselRecords = get(nextProps, 'carouselsData.carouselContent[1].records', []);
            }
            const configCarouselData=  !isEmpty(nextProps.carouselsData) && this.configCarousel(nextProps.carouselsData);
            if(!isEmpty(carouselRecords)  && configCarouselData.totalNumRecs >= configCarouselData.minNumRecords) {
                this.callGtmForCarousal(carouselRecords);
            }
        }
    }
    configCarousel = (data) => {
        var config ={};
        if(this.props && this.props.PdpSecond){
            data = data.carouselContent && data.carouselContent[1]?data.carouselContent[1]:{}
        }
        else{
            data = data.carouselContent && data.carouselContent[0]?data.carouselContent[0]:{}
        }
            if (data && data["@type"] === "MostVisitedSpotLight") {
                    config= Object.assign({
                    minNumRecords:data.minNumRecords,
                    totalNumRecs:data.totalNumRecs,
                    maximumNumRecords:data.maximumNumRecords,
                    name:data.name
                });
                return config;
            }
        return config;
    }
    homePageCarouselImgUrl = (data) => {
      var groupTypeCollection =null;
        let  AssetsPath = '';
        if (typeof window !== 'undefined') {
          AssetsPath = getAssetsPath(window,undefined);  
        }
        var carouselImgUrl = !isEmpty(data) ? map(data && data.carouselContent, (items, index) => {
            if (items["@type"] === "MostVisitedSpotLight") {
                return map(items.records, (item, index) => {
                      if(item['groupType'] &&  ((item['groupType'][0] && item['groupType'][0] ==='Collection')|| (item['groupType'] && item['groupType'] ==='Collection')) ){
                        groupTypeCollection = item['product.repositoryId'];
                      }else{
                          groupTypeCollection =null;
                      }
                       const carouselData = Object.assign({
                        imageUrl: item['sku.largeImage'] || Path.onImgError,
                        categoryName: item['product.displayName'],
                        description: item['product.displayName'],
                        List_price: item['sku.list_Price'],
                        promoPrice: item['sku.promoPrice'],
                        sale_Price: item['sku.sale_Price'],
                        minList:item['minimumListPrice']?item['minimumListPrice']:0,
                        maxList:item['maximumListPrice']?item['maximumListPrice']:0,
                        minPromo:item['minimumPromoPrice']?item['minimumPromoPrice']:0,
                        maxPromo:item['maximumPromoPrice']?item['maximumPromoPrice']:0,
                        repositoryId: item['product.repositoryId'],
                        pdpTypeCollection: item['product.relatedProducts']|| groupTypeCollection || '',
                        pdpTypeHybrid: item['product.hybridProducts'] || ''
                    })
               return carouselData;
             //  return item.attributes["product.thumbnailImage"]
        })

            }
        }) : carouselImgUrl = AssetsPath + '/static/images/filler_REC.gif';

        if(this.props && this.props.PdpSecond){
            return  (carouselImgUrl && carouselImgUrl[1])?carouselImgUrl[1]:{}
        }
        return (carouselImgUrl && carouselImgUrl[0])?carouselImgUrl[0]:{}
    }


setPrice=(caroudalData)=>{
     const priceData = {
                list: caroudalData['sku.list_Price'] || "",
                sale: caroudalData['sku.sale_Price'] || "",
                promo: caroudalData['sku.promoPrice'] || "",
                minList: caroudalData['minimumListPrice'] || "",
                maxList: caroudalData['maximumListPrice'] || "",
                minPromo: caroudalData['minimumPromoPrice'] || "",
                maxPromo: caroudalData['maximumPromoPrice'] || "",
                numRecords:  caroudalData['numRecords'] || 0
            };

 const priceToShow = GetPrice(priceData);
   let showPrice='';
  if(priceToShow.discount && priceToShow.discount.val && priceToShow.discount.decimal){
       showPrice =priceToShow.discount.val +'.'+ priceToShow.discount.decimal;
  }
  if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange){
    showPrice = priceToShow.rangeDiscount.noRange.val +'.'+ priceToShow.rangeDiscount.noRange.decimal;
  }
  if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.min){
      showPrice = priceToShow.rangeDiscount.min.val +'.'+priceToShow.rangeDiscount.min.decimal;
  }
  if(priceToShow.price){
  showPrice = priceToShow.price.val +'.'+priceToShow.price.decimal;
}
if(priceToShow.rangePrice && priceToShow.rangePrice.noRange){
    showPrice = priceToShow.rangePrice.noRange.val +'.'+priceToShow.rangePrice.noRange.decimal;
}
  if(priceToShow.rangePrice && priceToShow.rangePrice.min){
showPrice = priceToShow.rangePrice.min.val +'.'+priceToShow.rangePrice.min.decimal;
}

return showPrice;
}

callGtmForCarousal=(caroudalData)=>{
let setCatName = this.props.sendCurrentL1Name;
this.productListDataForGTM=[];
this.productListDataForGTM2=[];
let splitVariable=[];
     let productCount = 0;
            if(caroudalData && caroudalData.length < 15){
                productCount = caroudalData.length;
            }else{
                productCount = 15;
            }
      if (caroudalData ) {

                for (var i = 0; i < caroudalData.length ; i++) {

           let showPrice = this.setPrice(caroudalData[i]);
                    var objProduct = {};
                    objProduct.brand =caroudalData[i]['product.brand'] || '';
                    objProduct.category =  setCatName || ''
                    objProduct.dimension36 = caroudalData[i].Seller && caroudalData[i].isMarketPlace && caroudalData[i].isMarketPlace ==="true" ?  'Market Place - '+caroudalData[i].Seller : caroudalData[i].Seller || '';
                    objProduct.id = caroudalData[i]['sku.repositoryId'];
                    objProduct.list = caroudalData[i]['product.category'] + '|secondary' || '';
                    objProduct.name = caroudalData[i]['product.displayName'];
                    objProduct.position = i+1;    
                    objProduct.price = caroudalData[i]['sku.promoPrice'] !=='0.0'? caroudalData[i]['sku.promoPrice'].toString() :showPrice.toString().replace(/,/g,'');
                    // objProduct.price = caroudalData && caroudalData.minimumListPrice && caroudalData.minimumListPrice !== '0.0' ? minimumListPrice : caroudalData[i]['sku.promoPrice'] !== '0.0' ? caroudalData[i]['sku.promoPrice'] : caroudalData[i]['sku.list_Price'];
                    objProduct.variant = "N/A";
                    objProduct.metric3=caroudalData[i]['sku.promoPrice'].toString();
                    objProduct.metric2 = caroudalData[i]['sku.list_Price'].toString();
                    this.productListDataForGTM.push(objProduct);
                    //console.log('caroudalData',caroudalData[i]);
                }

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

triggerGTM = (data, priceToShow) =>{
    let allCarausalData = this.state.carouselsData.carouselContent[0].records;
    let setCatName = this.props.sendCurrentL1Name;
    let selectedProduct = {};
    let position = 0;
    const totalNumRecs =  this.state.carouselsData.carouselContent[0].totalNumRecs;
    const minNumRecords = this.state.carouselsData.carouselContent[0].minNumRecords;
    const gtmtrigger = totalNumRecs >= minNumRecords;
    for(var i=0 ;i<allCarausalData.length;i++){
if(allCarausalData[i]['product.repositoryId'] === data.repositoryId){
   selectedProduct =  allCarausalData[i];
   position = i+1;
}
    }
      let showPrice = this.setPrice(selectedProduct);
      
      let priceVal = '';
      let metric2Val = '';
      let metric3Val = '';
      if(!isEmpty(priceToShow)) {

        if(priceToShow.price) {
          metric3Val = priceToShow.price.val + '.' + priceToShow.price.decimal;
          metric2Val = metric3Val;
        } else if(priceToShow.rangePrice && priceToShow.rangePrice.noRange) {
          metric3Val = priceToShow.rangePrice.noRange.val + '.' + priceToShow.rangePrice.noRange.decimal;
          metric2Val = metric3Val;
        } else if (priceToShow.rangePrice && priceToShow.rangePrice.min) {
          metric3Val = priceToShow.rangePrice.min.val + '.' + priceToShow.rangePrice.min.decimal;
          metric2Val = metric3Val;
        }

        if(priceToShow.discount) {
          priceVal = priceToShow.discount.val + '.' + priceToShow.discount.decimal;
          metric3Val = priceToShow.discount.val + '.' + priceToShow.discount.decimal;
        } else if(priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) {
          priceVal = priceToShow.rangeDiscount.noRange.val + '.' + priceToShow.rangeDiscount.noRange.decimal;
          metric3Val = priceToShow.rangeDiscount.noRange.val + '.' + priceToShow.rangeDiscount.noRange.decimal;
        } else if (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) {
          priceVal = priceToShow.rangeDiscount.min.val + '.' + priceToShow.rangeDiscount.min.decimal;
          metric3Val = priceToShow.rangeDiscount.min.val + '.' + priceToShow.rangeDiscount.min.decimal;
        }
      }
    if(selectedProduct !== {} && gtmtrigger){
      
    dataLayer.push({
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'actionField': {
                            'list':selectedProduct['product.category']+'|secondary'
                        },
                        'products': [{
                            name:  selectedProduct['product.displayName'] || '',
                            id:  selectedProduct['product.repositoryId'] || '',
                            category: setCatName || '',
                            variant: 'N/A',
                            brand: selectedProduct['product.brand'] || '',
                            // price: selectedProduct['sku.promoPrice'] ? selectedProduct['sku.promoPrice'] : selectedProduct['sku.list_Price'] || '',
                            // price : selectedProduct['sku.promoPrice'] !== '0.0'? selectedProduct['sku.promoPrice'] :showPrice,
                            price: priceVal.toString().replace(/,/g, ''),
                            position: position || '',
                            dimension36: selectedProduct.Seller && selectedProduct.isMarketPlace === "true" ?  'Market Place - '+selectedProduct.Seller : selectedProduct.Seller || '', //CD 36
                            //metric2:selectedProduct['sku.list_Price'] || '', //M2
                            //metric3: selectedProduct['sku.promoPrice'] || '',//M3
                            metric2: metric2Val.toString().replace(/,/g, '') || priceVal.toString().replace(/,/g, '') || '', //M2
                            metric3: metric3Val.toString().replace(/,/g, '') || '',//M3
                        }]
                    }
                },
        });
    }

}


    render() {
if(this.state && this.state.carouselsData && this.state.carouselsData.carouselContent){
    //console.log('dataaaaaaa',this.state.carouselsData.carouselContent[0].records);
    if(this.state && this.state.renderFlag === false){
        logDebug('inside GTM')
              this.setState({
     renderFlag:true
    })
        // this.callGtmForCarousal(this.state.carouselsData.carouselContent[0].records);

    }
}
       var settings = {
      dots: true,
      nextArrow: <SampleNextArrow className={"icon-arrow_left"}/>,
       prevArrow: <SamplePrevArrow className={"icon-arrow_left"}/>,
           
           
      responsive: [

        {
          breakpoint: 3100,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
            infinite: true,
            dots: true,
            adaptiveHeight: true,
            draggable: false
          }
        },{
          breakpoint: 1300,
          settings: {
            slidesToShow: 4.75,
            slidesToScroll: 4,
            infinite: false,
            dots: true,
            adaptiveHeight: true,
            draggable: false
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
            adaptiveHeight: true,
            draggable: false
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
            adaptiveHeight: true
          }
        },
        {
          breakpoint: 380,
          settings: {
            slidesToShow: 2.75,
            slidesToScroll: 2,
            dots: true,
            arrows: false,
            infinite: false,
            adaptiveHeight: true
          }
        }
      ]
    };

           const _onImgError = this.onImgError;
           const configCarouselData=  !isEmpty(this.state.carouselsData) && this.configCarousel(this.state.carouselsData);
           var configCaro = parseInt(configCarouselData&&configCarouselData.maximumNumRecords);
           var img = !isEmpty(this.state.carouselsData) && this.homePageCarouselImgUrl(this.state.carouselsData);
           const dotCount = Math.ceil(img && img.length / this.state.visibleSlide);
           const { showImg } = this.state; /* 23404 fix */

           //console.log("this.props.chanelBrandCss = "+JSON.stringify(this.props.chanelBrandCss))
           return (
        <React.Fragment>
         {img && img.length && img.length>0?
          configCarouselData.totalNumRecs >= configCarouselData.minNumRecords?
            <section className="o-carousel plpclp">
                  <h2>{configCarouselData.name}</h2>
                  <hr />
                                <Slider {...settings} >
                                    {!isEmpty(img) && map(img, (item, index) => {
                                      /* 23404 fix start*/
                                        return (
                                             <Card key={index} showImg={showImg} data={item} onError={this.onImgError}  chanelBrandJSON={this.props.chanelBrandCss} triggerGTM={this.triggerGTM}/>
                                        )
                                      /* 23404 fix end*/
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
