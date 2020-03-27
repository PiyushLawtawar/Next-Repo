import isEmpty from 'lodash/isEmpty';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../molecules/MixinMolecules/MixinMolecules';
import { ParagraphWithBlockNew } from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {

    const { productDisplayName, priceToShow, pdpQty } = props || {};
    let pText = '', bText = '';

    if (priceToShow.discount) {
        pText = priceToShow.discount.val;
        bText = priceToShow.discount.decimal;

    } else if (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) {
        pText = priceToShow.rangeDiscount.noRange.val;
        bText = priceToShow.rangeDiscount.noRange.decimal;

    } /* else if (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) { // This cenario wil not come, if comes we can use as below.

        pText = priceToShow.rangeDiscount.min.val;
        bText = priceToShow.rangeDiscount.min.decimal;
        // Or
        pText = priceToShow.rangeDiscount.max.val;
        bText = priceToShow.rangeDiscount.max.decimal;
        
    } */

    const productSpecs = {
        pText: '$' + pText,
        pClass: 'a-giftRegistry__price',
        bType: 'sup',
        bText
    };

    return (
        <div className="m-giftRegistry__detailProduct">
            <H1 className="a-giftRegistry__titlepProduct" headLineHTMLText={productDisplayName}  /> {/*defect id 23809*/}
            <Paragraph className="a-giftRegistry_qntProduct">Cantidad: {pdpQty}</Paragraph>
            { !isEmpty(priceToShow) && <ParagraphWithBlockNew options={productSpecs} /> }
        </div>
    );
}