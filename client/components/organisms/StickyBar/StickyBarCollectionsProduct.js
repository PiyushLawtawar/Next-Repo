import React from 'react';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Image from "../../atoms/Tagimage/Image"; /*changes for color image implementation */
import Figure from '../../molecules/Figure/Figure';
import Link from "../../atoms/Link/Link"; /*changes for color image implementation */
//import './StickyBarCollectionsProduct.styl'

export default (props) => {
    const figInfo = {
        src: props.details.productImg,
        imageAlt: "Product item detail",
        imageTitle: "detalle del producto"
    };
    const { productName = "", quantity = "", selectedSkuColor = "", productId = "", colorImage } = props.details /*changes for color image implementation */

    return (
        <div className="o-stickyBar__productAdded item1 added" style={{ width: "240px" }}>
            <div className="o-stickyBar__product__item">
                <div className="m-stickyBar__product__image">
                    <Figure options={figInfo} />
                </div>
                <div className="m-stickyBar__product__detail">
                    <div className="m-stickyBar__product__title">
                        <Paragraph className="a-stickyBar__title">{productName}</Paragraph>
                    </div>
                    <div className="m-stickyBar__product__quantity">
                        <span>Cant:</span>
                        <Paragraph className="a-stickyBar__product__quantity" style={{ overflow: "hidden" }}> {quantity}</Paragraph>
                    </div>
                    <div className="m-stickyBar__product__separator"></div>
                    <div className="m-stickyBar__product__color">
                        <div className="m-stickyBar__product__color__selected">
                            {/*changes for color image implementation -start */}
                            {colorImage == "empty" || colorImage == "" ? <div className="color " style={{ backgroundColor: selectedSkuColor }}></div>
                                :
                                <Link className="atom-color" href="#" data-name="color0" >
                                    <Image src={colorImage} nonClickable="true" showLoader="true" id={productId} className="maccolorsh color" />
                                </Link>}
                            {/*changes for color image implementation - end*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-stickyBar__productAdded__close">
                <i className="icon-close_ci" onClick={() => props.productDeSelection({ productId })}></i>
            </div>
        </div>


    );
}

