import React from 'react';
import Button from '../../atoms/Button/Button';
import StickyBarProduct from './StickyBarProduct';
import ProductGallery from '../../molecules/ProductGallery/ProductGallery';

export default (props) => {
    return (
        <div className={`o-stickyBar__container__collections  ${props.stickyStatus ? "showSticky" : "hideSticky"}`}>
            <div className="container">
                <div className="o-stickyBar__product">
                    <StickyBarProduct selectedProductPrice={props.selectedProductPrice} priceToShow={props.priceToShow} stickyData={props.stickyData} stickybarInfo="m-stickyBar__info" stickybarTitle="a-stickyBar__title" PriceRange="m-stickyBar__price -range" stickyPrice="a-product__paragraphDiscountPrice m-0 d-inline " discountPrice="a-product__paragraphDiscountPrice" startPrice="a-stickyBar__price -start m-0" endPrice="a-stickyBar__price -end m-0" productColor="a-stickyBar__color a-productColor__item" stickySize="a-stickyBar__size"/>
                </div>
                <div className="o-stickyBar__separator"></div>
                <div className="o-stickyBar__productsAdded">
                    <ProductGallery devices = {props.devices} addedProduct={props.addedProduct} productDeSelection={props.productDeSelection} />
                </div>
                <div className="o-stickyBar__addtocart">
                    <Button className="a-btn a-btn--primary ripple" onClick={() => props.addMultipleItemToCart(undefined,undefined,undefined)}>Agregar a mi bolsa</Button>
                </div>
            </div>
        </div>
    );
}

