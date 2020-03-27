import Router from 'next/router';
import get from 'lodash/get';
import Span from '../../atoms/Span/Span'
import Icons from '../../atoms/Icons/Icons'
import Paragraph from '../../atoms/Paragraph/Paragraph'
import {AnchorSpanIcon} from '../../molecules/MixinMolecules/MixinMolecules'

//import './Vendorspdp.styl'

export default (props) => {    
    const { sellerId = '', sellersCount = 0, bestSalePrice = 0, alloffers = {},selectedSkuOffer={} } = props.vendorsInfo || {};
    let priceToDisplay = 0.00;
    try {
        //const bestSellerInfo = get(alloffers, 'skuOffers[0]', {});
        const bestSellerInfo =selectedSkuOffer;
        const list = Number(bestSellerInfo.bestListPrice) || 0;
        const sale = Number(bestSellerInfo.bestSalePrice) || 0;
        const promo = Number(bestSellerInfo.bestPromoPrice) || 0;

        if ( (list === sale && promo === 0) || (list === sale && list === promo && promo != 0) ) {
            priceToDisplay = list;

        } else if (list === sale && promo > 0) {
            priceToDisplay = promo;

        } else if (list > sale && promo == 0) {
            priceToDisplay = sale;

        } else if (list > sale && promo > 0) {
            priceToDisplay = promo;

        }
        priceToDisplay = priceToDisplay.toFixed(2);
        
    } catch(e){}

    return (
        <div className="m-vendors">
            <div className="vendors__title">
                <Paragraph className="a-vendors__title">Disponible con otros vendedores</Paragraph>
            </div>
            <div className="m-vendors__description cursor-pointer" onClick={() => {Router.push('/tienda/mirakl/offerListing?productId='+props.productId+'&skuId='+props.productSizeId)}}>
                <AnchorSpanIcon Linkclass="m-vendors__offersTitle" href="#" anchorText={sellersCount + " ofertas desde"} spanText={"$" + priceToDisplay} spanClassname="a-vendors__offerPrice" iconClass="icon-arrow_right" />
            </div>
        </div>
    );
}