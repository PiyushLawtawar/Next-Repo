import React from 'react'
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';


import ProductCollectionItem from '../../organisms/ProductCollectionDetail/ProductCollectionDetail';
import HrTag from '../../atoms/HrTag/HrTag';
import Span from '../../atoms/Span/Span';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';
import Pdp from '../../templates/Pdp/Pdp';

//import './Container.styl';


export const Container = (props) => {
  return (
    <div className={"o-content " + props.containerClass}>
      {props.children}
    </div>
  );
}

export class ProductContainer extends React.Component {
  render() {
    const { title = {}, hr = '' } = this.props.containerInfo || {};
    const { collectionData = {}, productSelection, mainProductData, productDeSelection, show_alert, fullCollectionData, staticLabels, deslectionFromSticky, ITR_Eligibility, addMultipleItemToCart } = this.props;
    const skuAttributeMap = fullCollectionData && fullCollectionData.productVarientsInfo && fullCollectionData.productVarientsInfo.skuAttributeMap || {}


    let productList = []
    let index = 1;
    for (let product in collectionData) {
      let EDD_Eligibility = fullCollectionData.productsEddInfo[product].enableEdd || ""
      let isMarketPlace = collectionData[product] && collectionData[product].isMarketPlace || "false"
      const articleSkuAttributeMap =  collectionData && collectionData[product] && collectionData[product].productVarientsInfo && collectionData[product].productVarientsInfo.skuAttributeMap;
      //const articleSkuAttributeMap = get(collectionData, "collectionData[product].productVarientsInfo.skuAttributeMap", {}); // collectionData[product] && collectionData[product].productVarientsInfo && collectionData[product].productVarientsInfo.skuAttributeMap
      
      const countOfArticle = articleSkuAttributeMap &&  Object.keys(articleSkuAttributeMap).length || 1;
      let skuAvailability = 0;
      for(let sku in articleSkuAttributeMap){
        if(articleSkuAttributeMap[sku].size_1001){
          skuAvailability +=  1
        }
      }
      const productStockAvailability = countOfArticle == skuAvailability ? true : false;
      productList.push(
        <React.Fragment>

          <ProductCollectionItem
            key={product}
            id={product}
            productId={product}
            productData={collectionData[product]}
            mainProductData={mainProductData}
            classNameItem= {productStockAvailability == true ? "unavailable": "product-selected"}
            productSelection={productSelection}
            productDeSelection={productDeSelection}
            mainContent={collectionData[product]}
            staticLabels={staticLabels}
            skuAttributeMap={skuAttributeMap}
            show_alert={show_alert}
            deslectionFromSticky={deslectionFromSticky}
            isMarketPlace={isMarketPlace}
            EDD_Eligibility={EDD_Eligibility}
            ITR_Eligibility={ITR_Eligibility}
            fullCollectionData={fullCollectionData}
            windowObject={this.props.windowObject}
            productStockAvailability = {productStockAvailability}
            configurationData={this.props.configurationData}
            limitedPiecesSkusData={this.props.limitedPiecesSkusData}
            orientation={this.props.orientation}
          />
            {Object.keys(collectionData).length > index ? <HrTag /> : null
          }

        </React.Fragment>
      )
      //productList.push(<React.Fragment><Pdp mainContent={mainProductData} />;  {Object.keys(collectionData).length > index ? <HrTag /> : null} </React.Fragment>)

      index++
    }

    return (
      <div className="o-product__container">
        {!isEmpty(title) &&
          <div className="m-product__container__title">
            <Span>{title.text1}</Span>
            <Label className="" id="products__selected__quantity">{title.selectedQty}</Label>
            <Span> {title.text2} </Span>
            <Label className="total" id="products__total__quantity">{title.totalQty}</Label>
          </div>
        }
        {hr === 'true' &&
          <HrTag />
        }

        {productList}


        {/*<ProductCollectionItem id="item2" />
              <HrTag />
              <ProductCollectionItem id="item3" classNameItem="unavailable" unavailable="true"/>
              <HrTag />
              <ProductCollectionItem id="item4" />*/}

        <div className="m-collection__products__addItems">
          <div></div>
          <div></div>
          <div></div>
          <div className="m-add-to-cart">
            <div className="container">
              <div className="row">
                <div className="col-12 col-lg-4"></div>
                <div className="col-12 col-lg-8">
                  <Button className="a-btn a-btn--primary ripple" handleClick={() => addMultipleItemToCart()}>Agregar a mi Bolsa</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div >
    );
  }

}
