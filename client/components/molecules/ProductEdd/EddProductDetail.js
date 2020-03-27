import React from 'react';
//import './ProductEdd.styl';
import { H3 } from '../../atoms/HeadLines/Headlines';
import Sup from "../../atoms/Sup/Sup";
import Span from "../../atoms/Span/Span";
import Ul from "../../atoms/Ul/Ul";
import List from "../../atoms/List/List";
import Link from "../../atoms/Link/Link";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphWithBlock } from '../../molecules/MixinMolecules/MixinMolecules';
import ProductPriceMixin from '../../molecules/ProductPrice/ProductPriceMixin';
import isEmpty from "lodash/isEmpty";

const getHexaColorCodeByColorName = (colorName, records) => {
    const colors = records.filter(obj => {
        if (obj['sku.color'] && (obj['sku.color'][0] === colorName)) {
            return obj;
        }
    }
    );
    const colorHexaCodeValue = ((colors && colors.length) && (colors[0].colorHexaCodeValue && colors[0].colorHexaCodeValue[0])) ? colors[0].colorHexaCodeValue[0] : '';
    return colorHexaCodeValue;
}

export default (props) => {

    let productPrice1 = {
        pText: '$10,000',
        pClass: 'a-product__eddModalRegularPrice m-0 d-inline ',
        bType: 'price',
        bText: '00'
    }
    let productPrice2 = {
        pText: '$9,000',
        pClass: 'a-product__eddModalRegularPrice m-0 d-inline ',
        bType: 'sup',
        bText: '00'
    }
    let productPrice3 = {
        pText: '$9,000',
        pClass: 'a-product__eddModalDiscountPrice m-0 d-inline ',
        bType: 'price',
        bText: '00'
    }
    let productPrice4 = {
        pText: '$9,000',
        pClass: 'a-product__eddModalDiscountPrice m-0 d-inline ',
        bType: 'sup',
        bText: '00'
    }
    let productCode = {
        pText: 'Código de producto: ',
        pClass: 'a-product__eddModalCode m-0',
        bType: 'span',
        bText: '1072472462'
    }
    let productSize = {
        pText: 'Talla: ',
        pClass: 'a-product__eddModalSize m-0',
        bType: 'span',
        bText: 'Mediana'
    }
    const { skuRecords = [], priceToShow = {} } = props;
    
    let modalProductDetails =  props.modalProductDetails && props.modalProductDetails.props && props.modalProductDetails.props.modalProductDetails || props.modalProductDetails

    let productDisplayName = modalProductDetails && modalProductDetails.ProductDisplayName && modalProductDetails.ProductDisplayName[0] || "";
    let productDisplayCode = modalProductDetails && modalProductDetails.ProductCode || "";
    let productSelectedSkuId = modalProductDetails && modalProductDetails.productSelectedSkuId || ""; /* Defect 24209 */
    
    let price = modalProductDetails && modalProductDetails.priceToShow || priceToShow /*added for price issue in collection EDD Popup */

    let colorStyle = props.colorStyle != undefined && typeof props.colorStyle !== "string" && props.colorStyle[0] && props.colorStyle[0].split("|")[0] || modalProductDetails && modalProductDetails.colorStyle && modalProductDetails.colorStyle[0]  || props.colorStyle;
    return (
        <React.Fragment>    
            <div className="row">
                <div className="col-12 mb-1">
                    <H3 className="a-product__eddModalTitle m-0" dangerouslySetInnerHTML={{__html:productDisplayName}} /> {/*defect id 23809*/}
                </div>
            </div>
            {/*<div className="row">
                <div className="col-12 mt-1 mb-1">
                    <Paragraph className="a-product__eddModalRegularPrice m-0 d-inline ">$10,000<Sup>00</Sup><Span>-</Span></Paragraph>
                    <Paragraph className="a-product__eddModalRegularPrice m-0 d-inline ">$9,000<Sup>00</Sup></Paragraph>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Paragraph className="a-product__eddModalDiscountPrice m-0 d-inline ">$9,000<Sup>00</Sup><Span>-</Span></Paragraph>
                    <Paragraph className="a-product__eddModalDiscountPrice m-0 d-inline ">$9,000<Sup>00</Sup></Paragraph>
                </div>
            </div>*/}
            <div className="row m-product__normalPrice">
                <div className="col-12 mt-1 mb-1">
                    {
                        /*added for price issue in collection EDD Popup -- start*/
                        (price && price.price) ?
                            <Paragraph className={"a-product__eddModalRegularPrice m-0 d-inline "} >${price.price.val}<Sup>{price.price.decimal}</Sup></Paragraph>
                            :
                            (price && price.rangePrice && price.rangePrice.noRange) ?
                                <Paragraph className={"a-product__eddModalRegularPrice m-0 d-inline "}>${price.rangePrice.noRange.val}<Sup>{price.rangePrice.noRange.decimal}</Sup></Paragraph>
                                :
                                (price && price.rangePrice && price.rangePrice.min) ?
                                    <Paragraph className={"a-product__eddModalRegularPrice m-0 d-inline "} >
                                        ${price.rangePrice.min.val}<Sup>{price.rangePrice.min.decimal}</Sup> - ${price.rangePrice.max.val}<Sup>{price.rangePrice.max.decimal}</Sup>
                                    </Paragraph>
                                    :
                                    null
                    }

                    {
                        (price && price.discount) ?
                            <Paragraph className={"a-product__eddModalDiscountPrice m-0 d-inline "} >${price.discount.val}<Sup>{price.discount.decimal}</Sup></Paragraph>
                            :
                            (price && price.rangeDiscount && price.rangeDiscount.noRange) ?
                                <Paragraph className={"a-product__eddModalDiscountPrice m-0 d-inline "} >${price.rangeDiscount.noRange.val}<Sup>{price.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                                :
                                (price && price.rangeDiscount && price.rangeDiscount.min) ?
                                    <Paragraph className={"a-product__eddModalDiscountPrice m-0 d-inline "} >
                                        ${price.rangeDiscount.min.val}<Sup>{price.rangeDiscount.min.decimal}</Sup> - ${price.rangeDiscount.max.val}<Sup>{price.rangeDiscount.max.decimal}</Sup>
                                    </Paragraph>
                                    :
                                    null
                                    
                    }
                    {/*added for price issue in collection EDD Popup -- end*/}
                </div>
            </div>


            {/* <ProductPriceMixin price={props.price} priceCollection="col-12 mt-1 mb-1" regularPrice="a-product__eddModalRegularPrice m-0 d-inline" discountedPrice="a-product__eddModalDiscountPrice m-0 d-inline" /> */}

            <div className="row">
                <div className="col-12 mb-2 mt-1">
                    <Paragraph className={productCode.pClass}> {productCode.pText}<Span>{productSelectedSkuId}</Span></Paragraph> {/* Defect 24209: Changed "productDisplayCode" into "productSelectedSkuId" */}
                </div>
            </div>
            {(props.productSizeName && props.productSizeName != "" && props.productSizeName !== 0 || (modalProductDetails.size && modalProductDetails.size != "" && modalProductDetails.size !== 0)) ?
                <div className="row">
                    <div className="col-12 mb-1">
                        <Paragraph className={productSize.pClass}>{productSize.pText} <Span>{props.productSizeName || modalProductDetails.size }</Span></Paragraph>
                    </div>
                </div> : null}
            {(colorStyle && colorStyle != "") ? <div className="row">
                <div className="col-12">
                    <div className="m-product__productColor">
                        <Ul className="p-0 m-0">
                            <List className="a-productColor__item  mr-2 mb-2"><Link className="atom-color" href="#" data-color="#f7a0ac" style={{ background: colorStyle }}></Link></List>
                            <Span className="a-product__colorLabel">Color:{props.colorText || modalProductDetails.colorText || ""}</Span>
                        </Ul>
                    </div>
                </div>
            </div> : null}
        </React.Fragment>
    );
}
