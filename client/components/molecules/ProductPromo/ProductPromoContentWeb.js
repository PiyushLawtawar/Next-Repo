import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map'
//import './ProductPromoContentWeb.styl'
import { H2, H3 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import { ParagraphWithBlock } from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {
    const { lpPromotions = [], otherPromotions = [] } = props.productPromotion || {};
    let lpPromotionsToShow = !isEmpty(lpPromotions) && lpPromotions.map((eachPromo, index) => <List key={index}><ParagraphWithBlock blockclass={props.blockclass} spanClassname={props.spanClassname} htmlText={eachPromo} spanText="" /></List>)
    let otherPromotionsToShow = !isEmpty(otherPromotions) && otherPromotions.map((eachPromo, index) => <List key={index}><ParagraphWithBlock blockclass={props.blockclass} spanClassname={props.spanClassname} htmlText={eachPromo} spanText="" /></List>)

    return (
        
        <div className="row">
            <div className="col-6">
                <div className="m-product__productPromoContent pl-4">
                    <H3 className="a-product__headLineProductPromoSubtitle ml-0 mr-3 mt-3 mb-3" headLineText="Tarjetas Liverpool" />
                    <Ul className="mt-4 ml-0 p-0">
                        {lpPromotionsToShow}
                    </Ul>
                    {/* !isEmpty(lpPromotions) && map(lpPromotions, (val, i) => {
                        return <div key={i} className="a-product__paragraphProductPromo m-0 " dangerouslySetInnerHTML={{ __html: val }} />
                    }) */}
                </div>
            </div>
            <div className="col-6">
                <div className="m-product__productPromoContent">
                    <H3 className="a-product__headLineProductPromoSubtitle ml-0 mr-3 mt-3 mb-3" headLineText="Otras tarjetas" />
                    <Ul className="mt-4 ml-0 p-0">
                        {otherPromotionsToShow}
                    </Ul>
                    {/* !isEmpty(otherPromotions) && map(otherPromotions, (val, i) => {
                        return <div key={i} className="a-product__paragraphProductPromo m-0 " dangerouslySetInnerHTML={{ __html: val }} />
                    }) */}
                </div>
            </div>
        </div>

    );
}