import Paragraph from '../../atoms/Paragraph/Paragraph';
import {H1} from '../../atoms/HeadLines/Headlines';
import Ratings from '../../molecules/Ratings/Ratings'
//import './MarketplaceProfileHeader.styl'
export default (props) =>{	
    const venderName=props.marketPlaceData &&props.marketPlaceData.sellerName	?props.marketPlaceData.sellerName:''
    const createdDate=props.marketPlaceData &&props.marketPlaceData.createdDate	?props.marketPlaceData.createdDate:''
    const staticArray = props.pageSpecificStaticLabels && props.pageSpecificStaticLabels.staticLabelValues? props.pageSpecificStaticLabels.staticLabelValues[0].keyValues:{};
    const ratingInfo = {
            ratingAvg: props.marketPlaceData && Math.round(props.marketPlaceData.grade)||0,
            ratingCount:props.marketPlaceData && Math.round(props.marketPlaceData.grade)||0
            };
    return(
        <div className="m-marketplace__vendorsInfo">                                     
            <H1 headLineClass="a-marketplace__vendorName" headLineText={venderName} />

            {/* Defect#21975 says that remove it<Ratings ratingInfo={ratingInfo} classname ="ratings-number a-offertList-ratings order-2"  opiniones = {staticArray['mirakl.opiniones.label']}/>*/}
            <Paragraph className="a-marketplace__vendorSince"> {createdDate}</Paragraph>
         </div>
    );
}