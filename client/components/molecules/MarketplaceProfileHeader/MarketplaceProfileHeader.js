import Router from 'next/router';
import get from 'lodash/get';
//import './MarketplaceProfileHeader.styl';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Ratings from '../../molecules/Ratings/Ratings';
import Icons from '../../atoms/Icons/Icons';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import { Path } from '../../../helpers/config/config';
import {H2} from '../../atoms/HeadLines/Headlines';
import VendorInfo from '../MarketplaceProfileHeader/VendorInfo';
import MarketplaceDelivery from '../MarketplaceProfileHeader/MarketplaceDelivery';

export default (props) =>{
    const sellerName = get(props.marketPlaceData,'sellerName');
    const sellerDesc = get(props.marketPlaceData,'sellerDesc');
    const city = get(props.marketPlaceData,'contactInfo.city');
    const sellerId = props.sellerId || '';
    const imageurl = props.sellerImageURL ||  '';
    const staticArray = props.pageSpecificStaticLabels && props.pageSpecificStaticLabels.staticLabelValues? props.pageSpecificStaticLabels.staticLabelValues[0].keyValues:props.pageSpecificStaticLabels;
    let ayudaLink = staticArray ?staticArray['mirakl.sellerDetail.ayuda.link']:'';
    //console.log("staticArray11==",staticArray['mirakl.sellerDetail.ayuda.link'])
    let grade = props.marketPlaceData.grade || '';
    let evaluationsCount = props.marketPlaceData.evaluationsCount || '';
    const ratingInfo = {
        ratingAvg: (props.marketPlaceData && Math.round(grade)) || "0",
        ratingCount: (props.marketPlaceData && Math.round(grade)) || "0"
    };
    let offset = imageurl != '' ? "offset-lg-1 " : '';
    return(
     <div className="container m-marketplace__vendorInfo">
              <div className="row align-items-end pt-lg-2 pb-lg-2">
                { imageurl != '' &&
                <div className="col-lg-1 align-self-start">
                
                  <div className="a-marketplace__vendorLogo">
                      <Image className="a-vendor__logo" src={imageurl} alt="Sportium" />
                  </div>
                 
                </div>
                 }
                <div className="col-lg-2 pr-0">
                 <VendorInfo {...props} />
                </div>
                <div className="col-lg-5 align-self-center">
                  <MarketplaceDelivery {...props}  staticArray={staticArray} />
                </div>
                <div className={offset +"col-lg-2 order-lg-3 mt-2 mt-lg-n3"} >
                              <div className="m-ratings d-flex align-items-center justify-content-center justify-content-lg-start">
                                <label className="rating_calification">{Math.round(grade).toFixed(2)}</label>
                                <Ratings ratingInfo={ratingInfo} SellerRatings={true} /> {/*(evaluationsCount + "Opiniones")*/}
                              </div>
                </div>
                 {/* <div className="col-lg-3">
                  <div className="m-marketplace__sendMessage">
                  Defect#21973 asked to remove the icon pin and mentioned the zeplin visual
                    <Icons className="icon-pin" />
                    <Paragraph className="a-marketplace__deliverTitle">{city}</Paragraph>
                     
                </div>
                </div>*/}
                <div className="col-lg-2 mb-3 order-3 order-lg-1">
                  <Button className="a-btn a-btn--tertiaryAlternative" ripple="" handleClick={() => {Router.push(`/tienda/sp/${sellerName}/${sellerId}`)}}>{staticArray['mirakl.view.catalog.label']}</Button>
                </div>
                <div className="col-lg-2 mb-3 order-4 order-lg-2">
                    <Button className="a-btn a-btn--tertiary" ripple="" handleClick={() => { window.location.href = ayudaLink; }}>{staticArray['mirakl.help.label']}</Button>{/* defect id 23583*/}
                </div>
                <div className="col-12 order-1 order-lg-3">
                    <H2 headLineClass="a-marketplace__aboutTitle" headLineText={staticArray['mirakl.about.seller.label']} />                                 
                </div>
                <div className="col-12 order-2 order-lg-4 mb-5 mb-lg-0">
                    <Paragraph className="a-marketplace__aboutDesc">
                        {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.*/}
                        {sellerDesc}
                        </Paragraph>
                </div>
              </div>
            </div>
    );
}