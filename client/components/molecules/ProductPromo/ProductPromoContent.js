import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import { ParagraphWithBlock } from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {

    const productSpecs = {
        bType: 'span',
        pText: '25%: ',
        pClass: 'a-product__paragraphProductPromo m-0 a-product__spec',
        bText: 'de descuento - Presupuesto Liverpool',
        bClass: 'description'
    };
    // const lpPromotions = props.productPromotion && props.productPromotion.lpPromotions || [];
    // const otherPromotions = props.productPromotion && props.productPromotion.otherPromotions || [];
    const { lpPromotions = [], otherPromotions = [] } = props.productPromotion || {};
    let lpPromotionsToShow = !isEmpty(lpPromotions) && lpPromotions.map((eachPromo, index) =>    <List key={index}><ParagraphWithBlock blockclass={"a-product__paragraphProductPromo m-0 a-product__spec"} spanClassname={props.spanClassname} htmlText={eachPromo} spanText="" /></List>) /*removed null condition for bug id 22455 starts */
    let otherPromotionsToShow = !isEmpty(otherPromotions) && otherPromotions.map((eachPromo, index) => <List key={index}><ParagraphWithBlock blockclass={"a-product__paragraphProductPromo m-0 a-product__spec"} spanClassname={props.spanClassname} htmlText={eachPromo} spanText="" /></List>) /*removed null condition for bug id 22455 starts */

    const cardTab = props.cardTab;  



    return (
        <div className="m-product__productPromoContent pt-4 pb-4 pl-4 pr-4">
            <div className="tabs-content" data-tab="cards" style={(!cardTab) ? { 'display': 'none' } : {}}>
                {/* {!isEmpty(lpPromotions) && map(lpPromotions, (val, i) => {
                    return <div key={i} className="a-product__paragraphProductPromo m-0 " dangerouslySetInnerHTML={{__html: val}} />
                })}
                {/*<Ul className="mt-4 ml-3 p-0">
                    {!isEmpty(lpPromotions) && map(lpPromotions, (val, i) => {
                        let productSpecs = {
                            pText: val,
                            pClass: 'a-product__paragraphProductPromo m-0 a-product__spec',
                        };
                        return <List key={i}>
                                <ParagraphWithBlockNew options={productSpecs} />
                            </List>
                    })}
                </Ul> */}
                 <Ul className="mt-4 ml-0 p-0">
                    {lpPromotionsToShow}
                </Ul>
            </div>
            <div className="tabs-content" data-tab="other" style={(cardTab) ? { 'display': 'none' } : { 'display': 'block' }}>
                {/* {!isEmpty(otherPromotions) && map(otherPromotions, (val, i) => {
                    return <div key={i} className="a-product__paragraphProductPromo m-0 " dangerouslySetInnerHTML={{ __html: val }} />
                })} */}
                <Ul className="mt-4 ml-0 p-0">
                    {otherPromotionsToShow}
                </Ul>
                
                {/* #23784 start <Paragraph className="a-product__paragraphProductPromo">Cuenta Corriente Externas</Paragraph> #23784 end 
                <Ul className="mt-4 ml-3 p-0">
                    {!isEmpty(otherPromotions) && map(otherPromotions, (val, i) => {
                        let productSpecs = {
                            pText: val,
                            pClass: 'a-product__paragraphProductPromo m-0 a-product__spec',
                        };
                        return <List key={i}>
                                <ParagraphWithBlockNew options={productSpecs} />
                            </List>
                    })}
                    <List>
                        <Paragraph className="a-product__paragraphProductPromo">Cuenta Corriente Externas</Paragraph>
                    </List>
                </Ul>*/}
            </div>
        </div>
    );
}