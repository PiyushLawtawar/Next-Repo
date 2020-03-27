import React from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import Span from '../../atoms/Span/Span';
import FlagNew from '../../molecules/Flag/FlagNew';
import ProductPriceMixin from '../../molecules/ProductPrice/ProductPriceMixin'
import ProductColor from '../../molecules/ProductColor/ProductColor'
import ProductSize from '../../molecules/ProductSize/ProductSize'
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect'
import ProductSpecsModal from '../../molecules/Modals/ProductSpecsModal';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { AnchorIconSpan, AnchorIconSpanNew, ButtonHeadlineIcon } from '../../molecules/MixinMolecules/MixinMolecules';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import ProductPromoModal from '../../molecules/Modals/ProductPromoModal';
import Router from 'next/router';
import Ratings from '../../molecules/Ratings/Ratings';
import { ProductInformationCollectionData } from '../../templates/Pdp/staticConstant'
import { GetLinkData, getFilteredString } from '../../../helpers/utilities/utility';



export default (props) => {

    const product = props.productInfo || {};
    const mainProductData = props.mainProductData || {};
    const productData = props.productData || {};
    const pdpTypeCollection = productData && productData['product.relatedProducts'] || '';
    const pdpTypeHybrid = productData && productData['product.hybridProducts'] || ''
    const staticLabels = props.staticLabels || props.staticLabel /*changes made for Pdp staticlabel issue */


    const ratings = { numOfRatings: "", text: "Sé el primero en opinar", textIsVisible: true, index: 0 };


    let flags = [];
    const flagList = get(productData, 'product.productFlags_pwa', []);
    !isEmpty(flagList) && map(flagList, (item, index) => {
        let txt = staticKeys[item] || item;
        if (!isEmpty(txt)) {
            let flagInfo = {
                flagText: txt,
                flagType: 'default'
            };
            flags.push(flagInfo);
        }
    })

    const longDescriptionText = productData["product.longDescription"] && productData["product.longDescription"][0] || ""
    let lpPromotions = productData && productData.skupriceInfo && productData.skupriceInfo[0]["lpPromotions"] || [];
    let lpPromotionsArray = []
    lpPromotions.length > 0 && lpPromotions.map((eachPromotions) => lpPromotionsArray.push(eachPromotions.promoDescriptionVisualize))
    let otherPromotions = productData && productData.skupriceInfo && productData.skupriceInfo[0]["otherPromotions"] || [];
    let otherPromotionsArray = []
    otherPromotions.length > 0 && otherPromotions.map((eachPromotions) => otherPromotionsArray.push(eachPromotions.promoDescriptionVisualize))
    let productPromotion = {
        lpPromotions: lpPromotionsArray || [],
        otherPromotions: otherPromotionsArray || [],
    };
    let productPolicies = (productData["product.refundPolicy"] && productData["product.refundPolicy"][0]) || '';
    let productFeatures = productData["product.dynamicAttribute"] || '';

    const pageUrl = get(props.windowObject, 'document.location.href', '');
    const productDescription = product.title || '';
    const productSocialEmailData = {
        productDescription,
        productId: props.productId,
        skuLargeImage: (productData["sku.largeImage"] && productData["sku.largeImage"][0]) || '',
        pageUrl
    };
    let pdpName = 'default';
    if (pdpTypeCollection && pdpTypeCollection != '') {
        pdpName = 'group'; // Defect 23372
    }
    if (pdpTypeHybrid && pdpTypeHybrid != '') {
        pdpName = 'pdp/hp';
    }
    let displayName = (product && product.title && product.title[0] || mainProductData && mainProductData["product.displayName"] && mainProductData["product.displayName"][0]) || ""
    let productId = (product && product.productCode || mainProductData && mainProductData["product.collectionProductId"] && mainProductData["product.collectionProductId"][0]) || ""
    const ratingInfo = {
        ratingAvg: (productData["productAvgRating"] && productData["productAvgRating"][0]) || (mainProductData["productAvgRating"] && mainProductData["productAvgRating"][0]) || "0",
        ratingCount: (productData["product.productRatingCount"] && productData["product.productRatingCount"][0]) || (mainProductData["product.productRatingCount"] && mainProductData["product.productRatingCount"][0]) || "0"
    };
    let orderedData = [];
    if (productFeatures.length > 0) {

        let sortData = []
        let orderMapObj = {};
        productFeatures.map(features => { let valueObj = {}; let splitedArray = features.split("|"); sortData.push(splitedArray[0]); valueObj[splitedArray[1]] = splitedArray[2]; orderMapObj[splitedArray[0]] = valueObj; })
        sortData.sort((a, b) => a - b).map(orderedValue => orderedData.push(orderMapObj[orderedValue]))
    }
    let instProductType = productData && productData.productType || ""
    let colorList = props.productData && props.productData.productVarientsInfo && props.productData.productVarientsInfo.colorMap && props.productData.productVarientsInfo.colorMap.color || {};
    let inputData = {
        productId: productId,
        productName: getFilteredString(displayName),
        pageName: 'productDetails',
        pdpTypeForSPA: pdpName,
        typeahead: 'no'
    }
    const { href, asInfo } = GetLinkData(inputData);
    
    return (
        <React.Fragment>
            {!isEmpty(product.headlineTitle) &&
                <H1 className="a-product__information--title" style={{ cursor: "pointer" }} headLineText={displayName} onClick={() => Router.push(href, asInfo)} />
            }
            {!isEmpty(product.titleChanel) &&
                <H2 className="a-product__information--title" headLineText={product.titleChanel} />
            }
            {!isEmpty(product.subtitle) &&
                <H2 className="a-product__information--subtitle" headLineText={product.subtitle} />
            }
            {!isEmpty(product.productCode) &&
                <Paragraph className="m-product__information--code">{staticLabels && staticLabels["PD.code.text"] || "PD.code.text : "} <Span>{productId}</Span></Paragraph> /*changes made for Pdp staticlabel issue -- added space and colon*/
            }
            {product.ratings === 'true' &&
                <div className={product.typePage === "pdp-collection" ? 'm-product__information--rating' : 'm-product__informationPdps--rating'}>
                    <Ratings ratingInfo={ratingInfo} collectionRatings={true} />
                </div>
            }
            {instProductType.toString().toLowerCase() == "digital" &&
                <Paragraph className="a-product__paragraphProductDownloadable mb-1">{`${staticLabels && staticLabels["pdpPage.DeliveryTypeHeader.label"] || "pdpPage.DeliveryTypeHeader.label"} ${instProductType}`}</Paragraph>
            }
            {product.downloadable !== "false" &&
                <AnchorIconSpanNew options={ProductInformationCollectionData.pdpDownloadable} />
            }

            <React.Fragment>

                {!isEmpty(flags) && <FlagNew options={flags} />}
                <hr className="d-none d-lg-block a-product__information__separator"></hr>
                <ProductPriceMixin
                    {...props}
                    priceCollection="m-product__price--collection"
                    regularPrice="a-product__paragraphRegularPrice m-0 d-inline "
                    discountedPrice="a-product__paragraphDiscountPrice m-0 d-inline " />

                {instProductType.toString().toLowerCase() != "digital" && <> {!isEmpty(props.uniqueColorList) &&
                    <ProductColor
                        {...props}
                        spanText={staticLabels && staticLabels['pdpPage.selectColor.label'] || "pdpPage.selectColor.label"}
                        records={productData}
                        productColor="m-product__colors"
                        productParaColor="a-product__paragraphColor m-0 mt-2 mb-2"
                        productspancolor="a-product__spanColor"
                        procolor="m-product__productColor mt-0"
                        colorCircleactive="a-productColor__item active mr-lg-2 mr-3 mt-2"
                        colorcircle="a-productColor__item mr-lg-2 mt-2"
                        anchor="atom-color"
                        anchorcolor="a-product__anchorColors"
                        text="Mostrar todo(12)"
                        collectionColorList={{uniqueColorList : colorList}}
            />
        }
                    {!isEmpty(props.finalSortedSize) &&

                        <ProductSize
                            {...props}
                            size="a-product__paragraphSize mb-2"
                            //text={staticLabels && staticLabels['pdpPage.talla_Size.label'] || ""}
                            text={props.ifSize !== null  && props.ifSize !== "" ? staticLabels && staticLabels['pdpPage.talla_Size.label'] || "pdpPage.talla_Size.label" : staticLabels && staticLabels["pdpPage.tamano_dimenssion.label"] || "pdpPage.tamano_dimenssion.label"}
                            btnActive="a-btn a-btn--actionpdp active"
                            btn="a-btn a-btn--actionpdp"
                            btnDissable="a-btn a-btn--actionpdp -disabled"
                            
                        />
                    }
                    {props.materials && props.materials.length > 0 &&

                        <MaterialSelect options={{
                            labelText: staticLabels && staticLabels['pdpPage.materialKey.label'] || "pdpPage.materialKey.label",
                            optionList: props.materials,
                            labelId: 'materail',
                            removeEmptyOption: true
                        }} handleChange={props.getTexturesByMaterial} />
                    }
                    {props.textures && props.textures.length > 0 &&

                        <MaterialSelect options={{
                            labelText: staticLabels && staticLabels['pdpPage.SelectTexture.label'] || "pdpPage.SelectTexture.label",
                            optionList: props.textures,
                            labelId: 'Texture',
                            removeEmptyOption: true
                        }} handleChange={props.getSelectedTexture} />
                    }
                    {props.pdpType != "optic" && props.paratext && <div className="row">
                        <div className="col-12 mb-2 mt-2">
                            <Paragraph className={props.lastSize}>{props.paratext}
                            </Paragraph>
                        </div>
                    </div>}</>}
            </React.Fragment>
            {props.descriptionNeeded === true && longDescriptionText !== "" &&
                <>
                    <Paragraph className="a-product__paragraphProductDescriptionWeb d-none d-lg-block mb-1">{staticLabels && staticLabels["PD.desc.text"] || "PD.desc.text"}</Paragraph>
                    <div className="a-product__paragraphProductDescriptionContentWeb d-none d-lg-block m-0 mt-2 product__information--code" dangerouslySetInnerHTML={{ __html: longDescriptionText }} />
                </>
            }
            {product.information !== "false" &&
                <Paragraph className="a-product__paragraphProductDescriptionContentWeb m-0 mt-2 product__information--code">{product.information}</Paragraph>
            }
            {product.modals === true &&
                <div className="mt-4 d-none d-lg-block o-product__chracteristics">

                    {orderedData && orderedData.length > 0 ?
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="m-characteristics-container -small">
                                    <parentContext.Consumer>
                                        {({ OpenModal, updateSelectedState }) =>
                                            <ButtonHeadlineIcon options={ProductInformationCollectionData.characteristics} onClick={() => { OpenModal('showModal8'); updateSelectedState(orderedData) }} />
                                        }
                                    </parentContext.Consumer>
                                </div>
                            </div>
                        </div> : null}
                    {productPromotion.lpPromotions.length > 0 || productPromotion.otherPromotions.length > 0 ? <div className="row">
                        <div className="col-12">
                            <div className="m-characteristics-container -small">
                                <parentContext.Consumer>
                                    {({ OpenModal, updateSelectedState }) =>
                                        <ButtonHeadlineIcon options={ProductInformationCollectionData.offers} onClick={() => { OpenModal('showModal11'); updateSelectedState(productPromotion) }} />
                                    }
                                </parentContext.Consumer>
                            </div>
                        </div>
                    </div> : null}
                </div>
            }
            {props.share == true ? <parentContext.Consumer>
                {({ OpenModal, updateSelectedState }) => (
                    <div className="m-product__information__share mt-4 d-none d-lg-block">
                        <AnchorIconSpan Linkclass="m-product__anchorShareSocial" href="#" onClick={() => { OpenModal('showModal10'); updateSelectedState(productSocialEmailData) }} iconClass="icon-shared a-product__iconProductShareWeb" spanText={staticLabels && staticLabels['PD_shareThis.text'] || "PD_shareThis.text"} spanClassname="ml-1 a-product__labelProductShareWeb" />
                    </div>
                )}
            </parentContext.Consumer> : null}

            <parentContext.Consumer>
                {({ showModal, SelectedModelData }) => (showModal.showModal8 === true ? <Modal modalDetails={ProductInformationCollectionData.modalProductPolitics} showModalpopUp={"showModal8"}>
                    <ProductSpecsModal forcePadding={true} orderedData={SelectedModelData} ModalpopUp={"showModal8"} show_alert={props.show_alert} />
                </Modal> : null
                )}
            </parentContext.Consumer>

            <parentContext.Consumer>
                {({ showModal, SelectedModelData }) => (showModal.showModal11 === true ? <Modal modalDetails={ProductInformationCollectionData.modalProductPromo} showModalpopUp={"showModal11"}>
                    <ProductPromoModal forcePadding={true} productPromotion={SelectedModelData} ModalpopUp={"showModal11"} />
                </Modal> : null
                )}
            </parentContext.Consumer>
        </React.Fragment>
    );
}