import isEmpty from 'lodash/isEmpty';
import Paragraph from  "../../atoms/Paragraph/Paragraph";
import Span from  "../../atoms/Span/Span";
import Sup from  "../../atoms/Sup/Sup";
import { ParagraphWithBlockNew } from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {
    const priceToShow = props.priceToShow || {};
    return (
          <div className={props.priceCollection}>
                <div className="row">
                    <div className="col-12">
                        {
                            (priceToShow.price) ?
                            <Paragraph className={props.regularPrice} >${priceToShow.price.val}<Sup>{priceToShow.price.decimal}</Sup></Paragraph>
                            :
                                (priceToShow.rangePrice && priceToShow.rangePrice.noRange)?
                                <Paragraph className={props.regularPrice} >${priceToShow.rangePrice.noRange.val}<Sup>{priceToShow.rangePrice.noRange.decimal}</Sup></Paragraph>
                                :
                                    (priceToShow.rangePrice && priceToShow.rangePrice.min)?
                                    <React.Fragment>
                                        <Paragraph className={props.regularPrice} >${priceToShow.rangePrice.min.val}<Sup>{priceToShow.rangePrice.min.decimal}</Sup><Span>-</Span></Paragraph>
                                        <Paragraph className={props.regularPrice} >${priceToShow.rangePrice.max.val}<Sup>{priceToShow.rangePrice.max.decimal}</Sup></Paragraph>
                                    </React.Fragment>
                                    :
                                    null
                        }
                    </div>
                    <div className="col-12 mt-1">
                        {
                            (priceToShow.discount)?
                            <Paragraph className={props.discountedPrice} >${priceToShow.discount.val}<Sup>{priceToShow.discount.decimal}</Sup></Paragraph>
                            :
                                (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange)?
                                <Paragraph className={props.discountedPrice} >${priceToShow.rangeDiscount.noRange.val}<Sup>{priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                                :
                                    (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min)?
                                    <React.Fragment>
                                        <Paragraph className={props.discountedPrice}>${priceToShow.rangeDiscount.min.val}<Sup>{priceToShow.rangeDiscount.min.decimal}</Sup><Span>-</Span></Paragraph>
                                        <Paragraph className={props.discountedPrice} >${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup></Paragraph>
                                    </React.Fragment>
                                    :
                                    null
                        }
                    </div>
                </div>
            </div>


    );
}

export const ProductPriceDoubleRange = (props) => {
    const { offer, productPrice1, productPrice2, productPrice3, productPrice4 } = props.doubleRangeInfo || {};
    return (
        <div className="m-product__price--collection">
            <div className="row">
                <div className="col-12">
                    <ParagraphWithBlockNew options={productPrice1} />
                    <ParagraphWithBlockNew options={productPrice2} />
                </div>
                {!isEmpty(offer) &&
                    <div className="col-12 mt-1">
                        <ParagraphWithBlockNew options={productPrice3} />
                        <ParagraphWithBlockNew options={productPrice4} />
                    </div>
                }
            </div>
        </div>
    );
}

export const ProductPriceRange = ({ productPrice3,productPrice4, ...props }) => {
    return (
        <div className="m-product__price">
            <div className="row">
                <div className="col-12">
                    <ParagraphWithBlockNew options={productPrice3} />
                    <ParagraphWithBlockNew options={productPrice4} />
                </div>
            </div>
        </div>
    );
}

export const ProductPrice = ({ productPrice4, ...props }) => {
    return (
        <div className="m-product__price">
            <div className="row">
                <div className="col-12">
                    <ParagraphWithBlockNew options={productPrice4} />
                </div>
            </div>
        </div>
    );
}
