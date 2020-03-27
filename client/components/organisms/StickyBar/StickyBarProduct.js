import React from 'react';
import { H5 } from '../../atoms/HeadLines/Headlines';
import Figure from '../../molecules/Figure/Figure';
import Paragraph from '../../atoms/Paragraph/Paragraph'
import Span from '../../atoms/Span/Span'
import Sup from '../../atoms/Sup/Sup'

export default (props) => {

    const figInfo = {
        src: props.stickyData && props.stickyData.gallery || "",
        imageAlt: "stickyBar product image"
    };
    const { priceToShow, selectedProductPrice = 0 } = props;
    let price = selectedProductPrice && selectedProductPrice.split(".")[0]
    price = price.toString().includes(",") ? price : price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let sup = selectedProductPrice && selectedProductPrice.split(".")[1]

    return (
        <div className="o-stickyBar__product__general">
            <div className="o-stickyBar__product__image">
                <Figure options={figInfo} />
            </div>
            <div className="o-stickyBar__product__title">
                <H5 headLineText={props.stickyData.info.title} />
            </div>
            <div className="o-stickyBar__product__price">
                <div class="m-product__price">
                    <div class="row">
                        <div class="col-12">
                            {
                                selectedProductPrice == 0 ?
                                    (priceToShow.discount) ?
                                        <Paragraph className={props.stickyPrice}>${priceToShow.discount.val}<Sup style={{ paddingLeft: "2px" }}>{" " + priceToShow.discount.decimal}</Sup></Paragraph>
                                        :
                                        (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) ?
                                            <Paragraph className={props.stickyPrice}>${priceToShow.rangeDiscount.noRange.val}<Sup style={{ paddingLeft: "2px" }} >{" " + priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                                            :
                                            (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) ?
                                                <React.Fragment>
                                                    <Paragraph className={props.stickyPrice} style={{ paddingRight: "15px" }}>${priceToShow.rangeDiscount.min.val}<Sup style={{ paddingLeft: "2px" }}>{" " + priceToShow.rangeDiscount.min.decimal}</Sup></Paragraph>
                                                    <Span className={props.discountPrice} style={{ padding: "0px 10px" }}> - </Span>
                                                    <Paragraph className={props.stickyPrice}>${priceToShow.rangeDiscount.max.val}<Sup style={{ paddingLeft: "2px" }}>{" " + priceToShow.rangeDiscount.max.decimal}</Sup></Paragraph>
                                                </React.Fragment>
                                                :
                                                null
                                    :
                                    <Paragraph className={props.stickyPrice}>${price}<Sup style={{ paddingLeft: "2px" }}>{" " + sup}</Sup></Paragraph>


                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

