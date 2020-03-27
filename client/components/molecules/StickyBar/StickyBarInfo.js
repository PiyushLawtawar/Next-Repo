//import './StickyBar.styl'

/*include ../../atoms/HeadLines/atom-headlines.pug
include ../../atoms/Paragraph/atom-paragraph.pug
include ../../atoms/Anchor/atom-anchor.pug
include ../../atoms/Span/atom-span.pug
include ../../molecules/MixinMolecules/mixin-molecules.pug
include ../../molecules/ProductGallery/molecule-product-gallery.pug*/
import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph'
import Link from '../../atoms/Link/Link'
import Image from "../../atoms/Tagimage/Image"; /*changes for color image implementation */
import Span from '../../atoms/Span/Span'
import Sup from '../../atoms/Sup/Sup'

//import Paragraph from '../atoms/Paragraph/Paragraph'

// const getHexaColorCodeByColorName = (colorName, records) => {
//   const colors = records.filter(obj => {
//     if (obj['sku.color'] && (obj['sku.color'][0] === colorName)) {
//       return obj;
//     }
//   }
//   );
//   const colorHexaCodeValue = ((colors && colors.length) && (colors[0].colorHexaCodeValue && colors[0].colorHexaCodeValue[0])) ? colors[0].colorHexaCodeValue[0] : '';
//   return colorHexaCodeValue;
// }

const getSkewIdUsingColorAndSize = (color, size, ) => {
  for (const key in skuRecord) {

  }
}
export default (props) => {
  let { mainContent, priceToShow, productSizeId, skuAttributeMap, pdpType, opticData } = props;
  //console.log("stickybarInfo", priceToShow) 
  const record = props.stickyData || {};
  const skuRecords = record.records || [];
  const productDisplayName = record.productDisplayName && record.productDisplayName[0];
  const minimumListPrice = record.productDisplayName && record.minimumListPrice && record.minimumListPrice[0]; //24421
  const maximumListPrice = record.productDisplayName && record.maximumListPrice && record.maximumListPrice[0]; //24421
  const skuid = productSizeId || ""
  const Size = props.productSizeName
  let colorStyle = typeof props.colorStyle !== "string" && props.colorStyle[0] && props.colorStyle[0].split("|")[0] || props.colorStyle;
  
  return (
    <div className={props.stickybarInfo}>
      <div className="row">
        <div className="col">

          <div className={props.stickybarTitle}>
            <Paragraph htmlText={productDisplayName} /> {/*Defect 22065*/}

          </div>
        </div>
      </div>
      {pdpType != "optic" ?
        <div className="row">
          <div className="col-6 pr-0">


            <div className={props.PriceRange}>
              {
                (priceToShow.discount) ?
                  <Paragraph className={props.stickyPrice}>${priceToShow.discount.val}<Sup>{priceToShow.discount.decimal}</Sup></Paragraph>
                  :
                  (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) ?
                    <Paragraph className={props.stickyPrice}>${priceToShow.rangeDiscount.noRange.val}<Sup>{priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                    :
                    (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) ?
                      <React.Fragment>
                        <Paragraph className={props.stickyPrice}>${priceToShow.rangeDiscount.min.val}<Sup>{priceToShow.rangeDiscount.min.decimal}</Sup></Paragraph>
                        <Span className={props.discountPrice}> - </Span>
                        <Paragraph className={props.endPrice}>${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup></Paragraph>
                      </React.Fragment>
                      :
                      null
              }
              {/*<Paragraph className={props.stickyPrice}>${minimumListPrice}<Sup> 00</Sup>
                                                  </Paragraph><Span className={props.discountPrice}> - </Span>
                                                  <Paragraph className={props.endPrice}>${maximumListPrice} <Sup> 00</Sup>

                                                  </Paragraph>*/}
            </div>

          </div>
          {/*changes for color image implementation */}
          {props.colorImage != "empty" && props.colorImage != "" ? <div className="col-2 text-center a-stickyBar__color -container">
            <div className={props.productColor}><Link className="atom-color" href="#" data-name="color0" >
              <Image src={props.colorImage} nonClickable="true" showLoader="true" id={productSizeId} className="maccolorsh color" />
            </Link> </div>
          </div>
            : colorStyle && colorStyle != "" ? <div className="col-2 text-center a-stickyBar__color -container">

              <div className={props.productColor}><a className="a-stickyBar__productColor atom-color" href="#" data-color="#f7a0ac" style={{ background: colorStyle }}></a>

              </div>
            </div> : null}
          {/*changes for color image implementation */}
          <div className="col-3">
            <div className={props.stickySize}>
              <Paragraph className="m-0">{Size || ""}
              </Paragraph>
            </div>
          </div>
        </div>
        :
        <div className="row m-0 m-stickyBar__eyesBlock">
          <div className="col-3 col-xl-2 m-stickyBar__price px-0">
            {
              (priceToShow.discount) ?
                <Paragraph className={props.stickyPrice}>${priceToShow.discount.val}<Sup>{priceToShow.discount.decimal}</Sup></Paragraph>
                :
                (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) ?
                  <Paragraph className={props.stickyPrice}>${priceToShow.rangeDiscount.noRange.val}<Sup>{priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                  :
                  (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) ?
                    <React.Fragment>
                      <Paragraph className={props.stickyPrice}>${priceToShow.rangeDiscount.min.val}<Sup>{priceToShow.rangeDiscount.min.decimal}</Sup></Paragraph>
                      <Span className={props.discountPrice}> - </Span>
                      <Paragraph className={props.endPrice}>${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup></Paragraph>
                    </React.Fragment>
                    :
                    null
            }
          </div>
          <div className="col-9 col-xl-10 m-stickyBar__eyesContainer">
            <div className="m-stickyBar__eyeInfo">
              {props.opticData && props.opticData["Ojo Izquierdo"] && <Paragraph className="a-stickyBar__eyeLabel">Ojo Izquierdo</Paragraph>}
              <ul>
                {props.opticData && props.opticData["Ojo Izquierdo"] && props.opticData["Ojo Izquierdo"].map((optic, i) => {
                  return <li key={i}><Span>{` ${Object.keys(optic)}  ${Object.values(optic)} `}</Span></li>
                })}
              </ul>
            </div>
            <div className="m-stickyBar__eyeInfo">
              {props.opticData && props.opticData["Ojo Derecho"] && <Paragraph className="a-stickyBar__eyeLabel">Ojo Derecho</Paragraph>}
              <ul>
                {props.opticData && props.opticData["Ojo Derecho"] && props.opticData["Ojo Derecho"].map((optic, i) => {
                  return <li key={i}><Span>{` ${Object.keys(optic)} ${Object.values(optic)} `}</Span></li>
                })}
              </ul>
            </div>
          </div>
        </div>}
    </div>

  );
}