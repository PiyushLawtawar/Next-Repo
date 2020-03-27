import CarouselPdp from '../../organisms/Carousel/CarouselPdp';
import ProductInformation from '../../organisms/ProductInformation/ProductInformation';
import ProductInfo from '../ProductPdp/ProductInfo';
import PdpAccordion from '../../molecules/Accordion/PdpAccordion';
import get from 'lodash/get';
import { parentContext } from '../../../contexts/parentContext';
export default (props) => {
   let PDP_Desc_css_class = (props.chanelBrandCss && typeof props.chanelBrandCss !== 'undefined' && props.chanelBrandCss !== 'NA') ? props.chanelBrandCss['PDP_Desc_css_class'] : 'a-product__information--title';
   if (!PDP_Desc_css_class || typeof PDP_Desc_css_class === 'undefined' || PDP_Desc_css_class.trim().length === 0) {
      PDP_Desc_css_class = 'a-product__information--title';
   }
   let PDP_Price_css_class = (props.chanelBrandCss && typeof props.chanelBrandCss !== 'undefined' && props.chanelBrandCss !== 'NA') ? props.chanelBrandCss['PDP_Price_css_class'] : 'a-product__paragraphRegularPrice m-0 d-inline';
   if (!PDP_Price_css_class || typeof PDP_Price_css_class === 'undefined' || PDP_Price_css_class.trim().length === 0) {
      PDP_Price_css_class = 'a-product__paragraphRegularPrice m-0 d-inline';
   }
   let PDP_DiscountPrice_css_class = (props.chanelBrandCss && typeof props.chanelBrandCss !== 'undefined' && props.chanelBrandCss !== 'NA') ? props.chanelBrandCss['PDP_DiscountPrice_css_class'] : 'a-product__paragraphDiscountPrice m-0 d-inline ';
   if (!PDP_DiscountPrice_css_class || typeof PDP_DiscountPrice_css_class === 'undefined' || PDP_DiscountPrice_css_class.trim().length === 0) {
      PDP_DiscountPrice_css_class = 'a-product__paragraphDiscountPrice m-0 d-inline ';
   }
/*changes made for Pdp staticlabel issue start --  commented start */
//   let staticLabelKeyValues = {};
//   if(props.mainContent && props.mainContent.staticLabels){
//      for ( let k in props.mainContent.staticLabels.staticLabelValues){
//         //console.log("----------------------",k,props.mainContent.staticLabels.staticLabelValues[k])
//         if(props.mainContent.staticLabels.staticLabelValues[k].pageName === 'PWA-PDP-PAGE'){
//          staticLabelKeyValues = props.mainContent.staticLabels.staticLabelValues[k].keyValues;
//         }
//      }
   
//   }
/*changes made for Pdp staticlabel issue end --  commented */
   return (
      <React.Fragment>
         <section className="o-product__detail">
            <div className="container o-product__mainContainer">

               <main>
                    <parentContext.Consumer>
                        {({  closeAllModals  }) => (
                            <CarouselPdp {...props} closeAllModals={closeAllModals} />
                        )}
                    </parentContext.Consumer>
                  <ProductInformation
                     {...props}
                     spanText={props.staticLabels && props.staticLabels['PD_shareThis.text'] || ""} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                     staticLabels={props.staticLabels} /*changes made for Pdp staticlabel issue --  modified staticlabels from props */
                     headLineText="Sala Tropicalia Trendy"
                     descClass="o-product__description"
                     headLineClass={PDP_Desc_css_class}
                     priceClass={PDP_Price_css_class}
                     discountPriceClass={PDP_DiscountPrice_css_class}
                     productCode="m-product__information--code"
                     productRating="m-product__information--rating"
                     ratingComment="rating__comments"
                     productdesc="a-product__paragraphProductDescriptionWeb d-none d-lg-block mb-1"
                     prodetail="a-product__paragraphProductDescriptionContentWeb d-none d-lg-block m-0 mt-2 product__information--code"
                     proLink="a-product__anchorProductDescriptionMoreInfo d-none d-lg-block"
                     text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
                     href="#o-product__productSpecsDetails"
                     linktext="Más información"
                     description={props.staticLabels && props.staticLabels['PD.desc.text'] + ":" || "Descripción:"} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                     iconClass="icon-shared a-product__iconProductShareWeb"
                     paratext={props.stockAvailability}
                     lastSize="a-product__paragraphSizeLast m-0"
                     ifSize={props.ifSize}
                  />
               </main>

               <div className="a-product__separator"></div>

               <ProductInfo
                  {...props}
                  spanText={props.spanText}
                  priceToShow={props.priceToShow}
                  gwpInfo={props.gwpInfo}
                  marketPlaceInfo={props.marketPlaceInfo}
                  giftRegistryInfo={props.giftRegistryInfo}
                  staticLabels={props.staticLabels}  /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                  productDetails={props.mainContent} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                  pdpType={props.pdpType}
                  qtyDropdownInfo={props.qtyDropdownInfo}
                  qtyModalInfo={props.qtyModalInfo}
                  QtyLabel="a-product__paragraphQtyLabel m-0"
                  btnclass="a-btn a-btn--action"
                  ItrBtnText={props.staticLabels && props.staticLabels['pdpPage.ITR.DisplayInPDP.label'] || "pdpPage.ITR.DisplayInPDP.label"} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                  EdPreOrder=""
                  EdDateStore="Liverpool Santa Fe"
                  EdRange="14 de diciembre - 17 de diciembre"
                  edLabel={props.staticLabels && props.staticLabels['pdpPage.estimatedDeliveydate.label'] || "pdpPage.estimatedDeliveydate.label"} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                  btntext={props.staticLabels && props.staticLabels['pdpPage.estimatedDeliveydate.label'] || "pdpPage.estimatedDeliveydate.label"} /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                  productinfo="o-product__productInfo pb-lg-4"
                  aideproductinfo="o-product__productInfo pb-lg-4"
                  productEdd="row o-product__productEdd"
                  productItr="row o-product__productItr"
                  chanelBrandCss={props.chanelBrandCss}
                  isLensePage={props.isLensePage}
                  Enableswogo = {props.Enableswogo}
                  // Custom Products functionality START
                  handleCustomProduct={props.handleCustomProduct}
                  handleGetCustomSkus={props.handleGetCustomSkus}
                  window={props.window}
                  handleAddToMyBag={props.handleAddToMyBag}
                  // Custom Products functionality END
               />

            </div>
         </section>
            {props.Enableswogo == "true" && props.swogoFlag &&
            <section>
               <div className="container-fluid">
                  <div className="container p-0">
                     <div className="row">
                        {(props.isDesktop)  ?  
                            <div className="col-12 mt-5 d-none d-lg-block o-product__swogocontent">
                                <div className="o-product__swogo">
                                    <PdpAccordion headText={props.staticLabels && props.staticLabels['pdpPage.CompraEnGrupo.label'] || "pdpPage.CompraEnGrupo.label"} isopenStatus="show"> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                                        <div className="swogo-box" id="swogo-bundle-1"></div>
                                    </PdpAccordion>
                                </div>
                            </div> : null
                        }
                        {(props.isMobile)  ?
                           <div class="col-12 mt-5 d-lg-none o-product__swogocontent">
                              <div class="o-product__swogo">
                                 <h3 class="a-product__swogoMobileTitle">{props.staticLabels && props.staticLabels['pdpPage.CompraEnGrupo.label'] || "pdpPage.CompraEnGrupo.label"}:</h3> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                                 <div className="swogo-box" id="swogo-bundle-1"></div>
                              </div>
                           </div> : null
                        }

                     </div>
                  </div>
               </div>
            </section>
         }
      </React.Fragment>













   );

}
