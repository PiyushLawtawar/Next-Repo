import React from 'react';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import FlagNew from '../../molecules/Flag/FlagNew';
import ProductPriceMixin from '../../molecules/ProductPrice/ProductPriceMixin'
import ProductColor from '../../molecules/ProductColor/ProductColor'
import ProductSize from '../../molecules/ProductSize/ProductSize'
import MaterialSelectPDP from '../../molecules/MaterialSelect/MaterialSelectPDP'
import ProductOptic from '../../organisms/ProductPdp/ProductOptic'
import { parentContext } from '../../../contexts/parentContext';
import { AnchorIconSpan, AnchorIconSpanNew } from '../../molecules/MixinMolecules/MixinMolecules'
import PdpProductHybrid from '../ProductPdp/PdpProductHybrid';
import { MAS_INFO_STRING } from '../../../../client/config/constants';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';

const moveToDescriptionTab = (e) => {
    //console.log("scrolling fine ")
    var element = document.getElementById("o-product__productSpecsDetails");
    const offset = 115;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    //console.log("scrolling fine posit" , offsetPosition)

    window.scrollTo({
        top: offsetPosition,
    });
    // window.scrollTo(0, e.currentTarget.offsetTop)
}
export default (props) => {

    const endecaProductRecord = props.mainContent.endecaProductInfo ? props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {};
    const headLineText = endecaProductRecord.productDisplayName ? endecaProductRecord.productDisplayName[0] : (endecaProductRecord.attributes && endecaProductRecord.attributes['product.displayName'][0])
    const longDescriptionText = endecaProductRecord['product.longDescription'] ? (endecaProductRecord['product.longDescription'] && endecaProductRecord['product.longDescription'][0]) : (endecaProductRecord.attributes && endecaProductRecord.attributes['product.longDescription'] && endecaProductRecord.attributes['product.longDescription'][0])
    const productId = endecaProductRecord.productId ? endecaProductRecord.productId[0] : (endecaProductRecord.attributes && endecaProductRecord.attributes['product.collectionProductId'][0]);
    let groupType = endecaProductRecord.groupType && endecaProductRecord.groupType[0] && endecaProductRecord.groupType[0] || ''
    let staticKeys = props.staticLabels || {};

    const Limtedkey = staticKeys['plp.minimun.pieces.to.buy'] || ''; // "Compra mínima {0} pzs";
    const limtedMessage = Limtedkey.replace("{0}", props.limited);

    let flags = [];
    const flagList = get(endecaProductRecord, 'product.productFlags_pwa', get(endecaProductRecord, "attributes['product.productFlags_pwa']", [])); //defect ID 24226
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
    const staticLabel = props.staticLabels || {}
    const pdpDownloadable = {
        aHref: '#',
        aClass: 'a-product__anchorProductDownloadCode',
        anchorAttributes: {
            "data-toggle": "modal",
            "data-target": "#download-modal"
        },
        iconClass: 'icon-help a-pdpHybrid_icon',
        spanText: '¿Cómo funcionan los códigos de descarga?',
        spanClass: 'm0',
        iconPosition: 'right',
        aText: ""
    }

    return (

        <div className={props.descClass}>
            <H1 headLineClass={props.headLineClass} headLineHTMLText={headLineText} /> {/* Changed "headLineText" props into "headLineHTMLText" */}
            <Paragraph className={props.productCode}>{props.staticLabels && props.staticLabels['PD.code.text'] || "PD.code.text: "} <Span>{productId}</Span></Paragraph> {/*changes made for Pdp staticlabel issue */}
            <div className={props.productRating}>
                <fieldset className="rating">
                    <Span className="TurnToReviewsTeaser"></Span>
                </fieldset>

            </div>

            {props.pdpType && (props.pdpType == "default" || props.pdpType == "optic" || props.pdpType == "hybrid") &&
                <React.Fragment>

                    {!isEmpty(flags) && <FlagNew options={flags} />}
                    <hr className="d-none d-lg-block a-product__information__separator"></hr>
                    <ProductPriceMixin
                        {...props}
                        priceCollection="m-product__price--collection"
                        regularPrice={props.priceClass}
                        discountedPrice={props.discountPriceClass} />

                    {
                        props.limited !== '' && props.limited >= 2 &&
                        <p className="a-product__paragraphColor m-0 mt-2 mb-2">{limtedMessage}</p>
                    }

                    {!isEmpty(props.uniqueColorList) && props.pdpType != "optic" && props.pdpType != "hybrid" &&
                        <ProductColor
                            {...props}
                            spanText={staticLabel && staticLabel['pdpPage.selectColor.label'] || "pdpPage.selectColor.label"}
                            records={endecaProductRecord.records}
                            productColor="m-product__colors" /* Defect 22981 - removed "mb-4" */
                            productParaColor="a-product__paragraphColor m-0 mt-2 mb-1"
                            productspancolor="a-product__spanColor"
                            procolor="m-product__productColor mt-0"
                            colorCircleactive="a-productColor__item active mr-lg-2 mr-3 mt-2"
                            colorcircle="a-productColor__item mr-lg-2 mr-3 mt-2"
                            anchor="atom-color"
                            anchorcolor="a-product__anchorColors"
                            text="Mostrar todo(12)"
                            groupType={groupType}
                        />
                    }

                    {!isEmpty(props.finalSortedSize) && props.pdpType != "optic" && props.pdpType != "hybrid" &&
                        <ProductSize
                            {...props}
                            size="a-product__paragraphSize mb-2"
                            text={props.ifSize !== null && props.ifSize !== "" ? staticLabel && staticLabel['pdpPage.talla_Size.label'] || "pdpPage.talla_Size.label" : staticLabel && staticLabel["pdpPage.tamano_dimenssion.label"] || "pdpPage.tamano_dimenssion.label"}
                            btnActive="a-btn a-btn--actionpdp active"
                            btn="a-btn a-btn--actionpdp"
                            btnDissable="a-btn a-btn--actionpdp -disabled"
                        />
                    }

                    {(props.materials.length > 1 || props.textures.length > 1) && props.pdpType != "optic" && props.pdpType != "hybrid" &&
                        <div className="m-product__material">
                            <MaterialSelectPDP
                                allowWhatEverLength={true}
                                value={props.selectedMaterial}
                                required='required'
                                field_focus={false}
                                field_valid={false}
                                options={{
                                    labelText: staticLabel['pdpPage.materialKey.label'] || 'pdpPage.materialKey.label',
                                    optionList: props.materials,
                                    labelId: 'Materail',
                                    removeEmptyOption: true
                                }} handleChange={props.getTexturesByMaterial} />
                        </div>
                    }

                    {props.textures.length > 1 && props.pdpType != "optic" && props.pdpType != "hybrid" &&
                        <div className="m-product__texture">
                            <MaterialSelectPDP
                                allowWhatEverLength={true}
                                value={props.selectedTexture}
                                required='required'
                                field_focus={false}
                                field_valid={false}
                                options={{
                                    labelText: staticLabel['pdpPage.SelectTexture.label'] || 'pdpPage.SelectTexture.label',
                                    optionList: props.textures,
                                    labelId: 'Texture',
                                    removeEmptyOption: true
                                }} handleChange={props.getSelectedTexture} />
                        </div>

                    }

                    {props.pdpType != "optic" && !isEmpty(props.paratext) && <div className="row">
                        <div className="col-12 mb-2 mt-2">
                            <Paragraph className={props.lastSize}>{props.paratext}
                            </Paragraph>
                        </div>
                    </div>}


                    {props.pdpType && props.pdpType == "optic" &&
                        <ProductOptic updateOpticData={props.updateOpticData} pdpType={props.pdpType} productDetails={props.mainContent} />
                    }

                </React.Fragment>

            }
            {props.pdpType && props.pdpType == "hybrid" &&
                <PdpProductHybrid staticLabels={staticLabel}mainContent={props.mainContent} priceToShow={props.priceToShow} getHybridPDPData={props.getHybridPDPData} productType={props.productType} /> /*changes made for Pdp staticlabel issue start --  addedd props staticlabels*/ 
            }
            {props.productType == "Digital" ?
                <parentContext.Consumer>
                    {({ OpenModal }) => (
                        <AnchorIconSpanNew options={pdpDownloadable} href="#" onClick={() => OpenModal('productDownloadCode')} />
                    )}
                </parentContext.Consumer>
                : ""}
            {longDescriptionText && longDescriptionText != "" ? <><Paragraph className={props.productdesc}>{props.description}</Paragraph>
                <div className="a-product__paragraphProductDescriptionContentWeb d-none d-lg-block m-0 mt-2 hidedesc" dangerouslySetInnerHTML={{ __html: longDescriptionText }} /></> : null}
            {longDescriptionText && longDescriptionText.length >= MAS_INFO_STRING ? <Link href="#" className={props.proLink} onClick={moveToDescriptionTab}>{props.linktext}</Link> : ''}

            <div className="mt-4 d-none d-lg-block">

                <parentContext.Consumer>
                    {({ OpenModal }) => (
                        <AnchorIconSpan Linkclass="m-product__anchorShareSocial" href="#" onClick={() => OpenModal('showModal10')} iconClass={props.iconClass} spanText={props.spanText} spanClassname="ml-1 a-product__labelProductShareWeb" />
                    )}
                </parentContext.Consumer>

            </div>
        </div>


    );
}