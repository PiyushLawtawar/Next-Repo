import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { GetPrice, GetLinkData, GetWithDecimal, getAssetsPath } from '../../../helpers/utilities/utility';
import MaterialInputCheckBox from '../MaterialInputCheckBox/MaterialInputCheckBox';
import Ratings from '../../molecules/Ratings/Ratings';
import Link from '../../atoms/Link/Link';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Span from '../../atoms/Span/Span';
import Sup from '../../atoms/Sup/Sup';
import Image from '../../atoms/Tagimage/Image';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { H5 } from '../../atoms/HeadLines/Headlines';
import { Path } from '../../../helpers/config/config';
import Lazy from '../../../helpers/lazyload/lazyload';
import Button from '../../atoms/Button/Button';
import { parentContext } from '../../../contexts/parentContext';
import { getFilteredString } from '../../../helpers/utilities/utility';

import Router from 'next/router';
//import './Card.styl';

const getLoaderPath = (domainName) => {
    let  AssetsPath = getAssetsPath(undefined,domainName, process)  
    
    let path = '/static/images/loading/liverpool/imageLoading.svg';
    if(domainName === 'williamssonoma') {
        path = '/static/images/loading/wsonoma/imageLoading.svg';
    } else if(domainName === 'potterybarn') {
        path = '/static/images/loading/pb/imageLoading.svg';
    } else if(domainName === 'potterybarnkids') {
        path = '/static/images/loading/pbkids/imageLoading.svg';
    } else if(domainName === 'pbteen') {
        path = '/static/images/loading/pbteen/imageLoading.svg';
    } else if(domainName === 'westelm') {
        path = '/static/images/loading/westelm/imageLoading.svg';
    } else if(domainName === 'liverpool') {
        path = '/static/images/loading/liverpool/imageLoading.svg';
    }
   // console.log('AssetsPath + path', AssetsPath + path)
    return AssetsPath + path;
}

export const CardClp = (props) => {

    const cardDetails = props.cardDetails || {};
    const imgSrc = (cardDetails.imageUrl) ? cardDetails.imageUrl : Path.onImgError;
    const onImgError = props.onImgError;
    const { index } = props || '0_0';
    const parentIndex = index.split('_')[0];
    const childIndex = index.split('_')[1];

    const catUrl = cardDetails.viewAllUrl || '';
    const inputData = {
        catId: catUrl.split('/').pop(),
        catName: catUrl.split('/')[1],
        pageName: 'CLP'
    }
    const { href, asInfo } = GetLinkData(inputData);
    return (
        <div className="o-clp-cards-row_container">
            <div>
                <figure className="m-figureCard__figure card  m-card">

                    <Link href={href} asInfo={asInfo}> {/* href={"/tienda" + cardDetails.viewAllUrl} */}
                    {
                        Number(parentIndex) === 0 && Number(childIndex) <= 3 ?
                            <Image imageLoader={getLoaderPath(props.domainName)} className="card-img-top" extraClass="clp-card-loader-img" src={imgSrc} alt={cardDetails.categoryName} onError={onImgError} />
                        :
                        <Lazy>
                            <Image showLoader imageLoader={getLoaderPath(props.domainName)} className="card-img-top" extraClass="clp-card-loader-img" src={imgSrc} alt={cardDetails.categoryName} onError={onImgError} />
                        </Lazy>
                    }
                        

                        <figcaption className="card-body d-flex flex-column align-items-start">
                            <article className="d-flex">
                                <H5 className="card-title a-card-description" headLineText={cardDetails.categoryName} />
                            </article>
                        </figcaption>

                    </Link>

                </figure>
            </div>
        </div>
    );
}

export const CardPlp = (props) => {
    const { isDesktop, isIpad, isMobile, isLandscape, isPortrait } = props.agentDetails;
    const { showCardImage } = props.productListDetails;
    const cardIndex = props.index;
   

    const cardDetails = props.cardDetails;
    let imgSrc = (cardDetails["sku.largeImage"] && cardDetails["sku.largeImage"][0]) || Path.onImgError; // defect fix 23485,23390,23372
    const productDescription = (cardDetails["productDisplayName"] && cardDetails["productDisplayName"][0]) || "";
    const productPrice = (cardDetails["productPrice"] && cardDetails["productPrice"][0]) || "";
    let numRecords = cardDetails["numRecords"] || 0; // Defect 23341 (changed "const" to "let")

    let productName = cardDetails["productDisplayName"] && cardDetails["productDisplayName"][0] || '';
    productName = productName.toLowerCase().replace(/\s/g, '-').replace(/#/g, '').replace(/<[^>]*>/g,'-'); /* Defect 22065: Removing HTML tags from the product name */
    const productId = cardDetails["productId"] && cardDetails["productId"][0] || '';

    const isHybridProduct = cardDetails["isHybridProduct"] && cardDetails["isHybridProduct"][0] || "false";
    const groupType = cardDetails["groupType"] && cardDetails["groupType"][0] || "";
    let pdpName = 'pdp';
    let pdpTypeForSPA = 'default'
    if (isHybridProduct === "true") {
        pdpName = 'pdp/hp';
        pdpTypeForSPA = 'hybrid'
    } else if (groupType === 'Collection' || groupType === 'MAC Collection') {
        pdpName = 'group';
        pdpTypeForSPA = 'collection'
        numRecords = 2; // Defect 23341 (added new line)
        imgSrc = (cardDetails["largeImage"] && cardDetails["largeImage"][0]) || Path.onImgError; // defect fix 23485,23390,23372
    }

    let inputData = {
        productId: productId,
        productName: getFilteredString(productName),
        pageName: 'productDetails',
        pdpTypeForSPA: pdpTypeForSPA,
        typeahead: 'no'
    }
    const { href, asInfo } = GetLinkData(inputData);

    // const cardAsInfo = `/tienda/${pdpName}/${productName}/${productId}`;
    // const cardHref = `/tienda/pdp?pdpName=${pdpName}&pdpTypeForSPA=${pdpTypeForSPA}&productName=${productName}&productId=${productId}`;
    const cardAsInfo = asInfo;
    const cardHref = href;

    const priceData = {

        list: (cardDetails["sku.listPrice"] && cardDetails["sku.listPrice"][0]) || "",
        sale: (cardDetails["sku.salePrice"] && cardDetails["sku.salePrice"][0]) || "",
        promo: (cardDetails["promoPrice"] && cardDetails["promoPrice"][0]) || "",
        minList: (cardDetails["minimumListPrice"] && cardDetails["minimumListPrice"][0]) || "",
        maxList: (cardDetails["maximumListPrice"] && cardDetails["maximumListPrice"][0]) || "",
        minPromo: (cardDetails["minimumPromoPrice"] && cardDetails["minimumPromoPrice"][0]) || "",
        maxPromo: (cardDetails["maximumPromoPrice"] && cardDetails["maximumPromoPrice"][0]) || "",
        numRecords: numRecords
    };

    const priceToShow = GetPrice(priceData);

    const swatchColors = cardDetails["product.swatchColors"] || [];
    const staticLabels = props.staticLabels || {};
    const productFlags = cardDetails["product.productFlags_pwa"] || [];
    const ratingInfo = {
        ratingAvg: (cardDetails["productAvgRating"] && cardDetails["productAvgRating"][0]) || "0",
        ratingCount: (cardDetails["productRatingCount"] && cardDetails["productRatingCount"][0]) || "0"
    };

    /* let maxColorVisible = 5;
    let colorContainerWidth = 21;
    if(isLandscape || isDesktop) {
        maxColorVisible = 6;
        colorContainerWidth = 24;
    }    
    const colorCount = swatchColors.length;
    const colorListWidth = colorCount * colorContainerWidth;

    if (colorCount > 1 && colorCount < maxColorVisible) {
        colorContainerWidth = colorCount * colorContainerWidth;
    } else if (colorCount > 1) {
        colorContainerWidth = maxColorVisible * colorContainerWidth;
    } */

    const cardEvents = props.cardEvents;

    let maxColorVisible = 0;

    if( (isDesktop || (isIpad && isLandscape)) && !cardEvents.listView) {
        maxColorVisible = 6;

    } else if( (isDesktop || (isIpad && isLandscape)) && cardEvents.listView) {
        maxColorVisible = 10;

    } else if( (isMobile || (isIpad && isPortrait)) && !cardEvents.listView) { // Mobile grid mode: 6 colors + plus icon  (but it depends on that colors don't overboard the card and other colors go to a second line)
        maxColorVisible = 6;

    } else if( (isMobile || (isIpad && isPortrait)) && cardEvents.listView) {
        maxColorVisible = 9;
    }

    const disablecomparisonfeature = (props.flags && typeof props.flags['disablecomparisonfeature'] === 'boolean') ? props.flags['disablecomparisonfeature'] : false;
    const limitedPiecesSkus = props.limitedPiecesSkus;
    const { handleToggleProductCompare, productComparatorObj, UserAgentDetails, gotToComparePage } = props.productComparatorDetails;
    const key = 'compare_' + cardDetails.productId[0];
    const Limtedkey = staticLabels['plp.minimun.pieces.to.buy'] || ''; // "Compra mínima {0} pzs";
    const limtedMessage = Limtedkey.replace("{0}", limitedPiecesSkus);
    let plp_Desc_css_class = (props.chanelBrandJSON && JSON.stringify(props.chanelBrandJSON) !== 'NA') ? props.chanelBrandJSON['carousel_Desc_css_class'] : 'card-title a-card-description';
    let plp_Price_css_class = (props.chanelBrandJSON && JSON.stringify(props.chanelBrandJSON) !== 'NA') ? props.chanelBrandJSON['carousel_Price_css_class'] : 'a-card-price';
    let plp_DiscountPrice_css_class = (props.chanelBrandJSON && JSON.stringify(props.chanelBrandJSON) !== 'NA') ? props.chanelBrandJSON['carousel_DiscountPrice_css_class'] : 'a-card-discount';
    if (!plp_Desc_css_class || typeof plp_Desc_css_class === 'undefined' || plp_Desc_css_class.trim().length === 0) {
        plp_Desc_css_class = 'card-title a-card-description';
    }
    if (!plp_Price_css_class || typeof plp_Price_css_class === 'undefined' || plp_Price_css_class.trim().length === 0) {
        plp_Price_css_class = 'a-card-price';
    }
    if (!plp_DiscountPrice_css_class || typeof plp_DiscountPrice_css_class === 'undefined' || plp_DiscountPrice_css_class.trim().length === 0) {
        plp_DiscountPrice_css_class = 'a-card-discount';
    }
  //  console.log("isMobile===",isMobile, "========disablecomparisonfeature==", disablecomparisonfeature)
    let showclass = props.selectedCardsCount >=2 ? true : false 
    return (
        <List className="m-product__card card-masonry" onMouseOver={cardEvents.showCardElements} onMouseOut={cardEvents.hideCardElements}>
            {/* <div className={"m-plp-card-container" + (cardEvents.listView ? ' m-plp-list-view' : '')} onClick={() => props.redirectToPdp(cardHref)}> */}
            <div className="m-plp-card-container" onClick={() => props.redirectToPdp(cardHref, cardAsInfo, pdpTypeForSPA, productId)}>
                <figure className="m-figureCard__figure card m-plp-product-card m-card">
                    <div className="o-card__image__container">
                        {
                            cardIndex > 3 ?
                            showCardImage &&
                            <Lazy>
                                {/* <Image className={"card-img-top a-plp-image-product" + (cardEvents.listView ? ' a-plp-image-list-view' : '')} id={"img_" + cardIndex} src={imgSrc} alt="Chamarra capitonada Punt Roma de algodón para dama" onError={cardEvents.onImgError} /> */}
                                <Image showLoader imageLoader={getLoaderPath(props.domainName)} id={"img_" + cardIndex} extraClass="reduce-size" src={imgSrc} alt={productDescription} onError={cardEvents.onImgError} />
                                <Image id={"img_" + cardIndex+"_"} extraClass="reduce-size" src={imgSrc} alt={productDescription} onError={cardEvents.onImgError} />
                            </Lazy>
                            :
                            showCardImage &&
                                <React.Fragment>
                                    <Image showLoader imageLoader={getLoaderPath(props.domainName)} id={"img_" + cardIndex} extraClass="reduce-size" src={imgSrc} alt={productDescription} onError={cardEvents.onImgError} />
                                    <Image id={"img_" + cardIndex+"_"} extraClass="reduce-size" src={imgSrc} alt={productDescription} onError={cardEvents.onImgError} />
                                </React.Fragment>
                        }
                    </div>
                    <figcaption className="m-figureCard__figcaption card-body d-flex flex-column align-items-start a-plp-product-info">

                        <article className="d-flex ipod-d-block">
                            <H5 className={plp_Desc_css_class} headLineHTMLText={productDescription} /> {/* Defect 22065: Changed "headLineText" props into "headLineHTMLText" */}
                        </article>

                        {
                            (priceToShow.price) ?
                                <Paragraph className={plp_Price_css_class} >${priceToShow.price.val}<Sup>{priceToShow.price.decimal}</Sup></Paragraph>
                                :
                                (priceToShow.rangePrice && priceToShow.rangePrice.noRange) ?
                                    <Paragraph className={plp_Price_css_class}>${priceToShow.rangePrice.noRange.val}<Sup>{priceToShow.rangePrice.noRange.decimal}</Sup></Paragraph>
                                    :
                                    (priceToShow.rangePrice && priceToShow.rangePrice.min) ?
                                        <Paragraph className={plp_Price_css_class} >
                                            ${priceToShow.rangePrice.min.val}<Sup>{priceToShow.rangePrice.min.decimal}</Sup> - ${priceToShow.rangePrice.max.val}<Sup>{priceToShow.rangePrice.max.decimal}</Sup>
                                        </Paragraph>
                                        :
                                        null
                        }

                        {
                            (priceToShow.discount) ?
                                <Paragraph className={plp_DiscountPrice_css_class} >${priceToShow.discount.val}<Sup>{priceToShow.discount.decimal}</Sup></Paragraph>
                                :
                                (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) ?
                                    <Paragraph className={plp_DiscountPrice_css_class} >${priceToShow.rangeDiscount.noRange.val}<Sup>{priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                                    :
                                    (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) ?
                                        <Paragraph className={plp_DiscountPrice_css_class} >
                                            ${priceToShow.rangeDiscount.min.val}<Sup>{priceToShow.rangeDiscount.min.decimal}</Sup> - ${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup>
                                        </Paragraph>
                                        :
                                        null
                        }

                            {
                                !isEmpty(swatchColors) &&
                                <div className="a-plp-color">
                                    <Ul>
                                        {
                                            map(swatchColors, (item, index) => {
                                                if(index < maxColorVisible){
                                                    const color = (typeof item === "string") ? item.split('|') : [];
                                                    const colorCode = (color.length > 5 && color[5] || "");
                                                    const colorImage = (color.length > 2 && color[3].trim() || "");
                                                    if(!isEmpty(colorImage)) {
                                                        return <List key={index} className="a-productColor__item a-product__color" onClick={(e) => cardEvents.onChangeColor(e, "img_" + cardIndex, color[1], cardHref)}>
                                                            <Image className="atom-color" src={colorImage}  />
                                                            </List> 
                                                    }
                                                    return <List key={index} className="a-productColor__item a-product__color" onClick={(e) => cardEvents.onChangeColor(e, "img_" + cardIndex, color[1], cardHref)}>
                                                        <Span className="atom-color" data-color={colorCode} title={color[0]} style={{ backgroundColor: colorCode }} ></Span>
                                                    </List>
                                                }
                                            })
                                        }
                                        {
                                            !isEmpty(swatchColors) && swatchColors.length > maxColorVisible &&
                                            <List className="a-plus__icon plp-plus__icon"  onClick={(e) => { e.preventDefault(); e.stopPropagation() }}><i className="icon-sum"></i></List>
                                        }
                                    </Ul>
                                    </div>
                            }
                        
                        {!isEmpty(productFlags) && 
                            <div className={`m-plp-flag-container ${!isEmpty(swatchColors) ? '' : 'marginTop-8' }`}>
                                {
                                    map(productFlags, (item, i) => {
                                        const txt = staticLabels[item] || item;
                                        return <Span key={i} className="a-flag">{txt}</Span>
                                    })
                                }
                            </div>
                        }
                        {
                            limitedPiecesSkus !== '' &&
                            <div className="m-plp-flag-container"><span className="a-flag">{limtedMessage}</span></div>
                        }

                        <Ratings ratingInfo={ratingInfo} swatchColors={swatchColors} showZeroRating={true}/>

                        {isMobile === false && !disablecomparisonfeature &&
                            <MaterialInputCheckBox
                                id={key}
                                value={productComparatorObj[key]}
                                checked={productComparatorObj[key]}
                                text={"Comparar"}
                                noFor={true}
                                showClass={showclass}
                                lableOnClick={(e) => {
                                    if (productComparatorObj[key] && props.selectedCardsCount >= 2) {
                                        gotToComparePage(e)
                                    } else {
                                        e.stopPropagation();
                                    }
                                }}
                                onClick={(e) => handleToggleProductCompare(e, key, cardDetails.productId[0], !productComparatorObj[key] && props.selectedCardsCount === 4)}
                            />
                        }
                    </figcaption>
                </figure>
            </div>
        </List>
    );
}

export const Card = (props) => {
    const data = props.data;
    /* production BLP carousel image issue observation fix start*/
    let { showImg } = props;
    if(typeof showImg === 'undefined') {
        showImg = true;
    }
    /* production BLP carousel image issue observation fix end*/
    let productName = data.description && data.description.toLowerCase().replace(/\s/g, '-') || '';
    const productId = data.repositoryId || '';
    const priceData = {

        list: data.List_price || "",
        sale: data.sale_Price || "",
        promo: data.promoPrice || "",
        //Always use the minimum and maximum prices only and hence making num records count to 2 always. 
        numRecords: data.numRecords || 2,
        minList: data.minList || data.minimumListPrice || "",
        maxList: data.maxList || data.maximumListPrice || "",
        minPromo: data.minPromo || data.minimumPromoPrice || "",
        maxPromo: data.maxPromo || data.maximumPromoPrice || ""
    };

    const priceToShow = GetPrice(priceData);
    let carousel_Desc_css_class = (props.chanelBrandJSON && JSON.stringify(props.chanelBrandJSON) !== 'NA') ? props.chanelBrandJSON['carousel_Desc_css_class'] : 'a-card-description';
    let carousel_Price_css_class = (props.chanelBrandJSON && JSON.stringify(props.chanelBrandJSON) !== 'NA') ? props.chanelBrandJSON['carousel_Price_css_class'] : 'a-card-price';
    let carousel_DiscountPrice_css_class = (props.chanelBrandJSON && JSON.stringify(props.chanelBrandJSON) !== 'NA') ? props.chanelBrandJSON['carousel_DiscountPrice_css_class'] : 'a-card-discount';
    if (!carousel_Desc_css_class || typeof carousel_Desc_css_class === 'undefined' || carousel_Desc_css_class.trim().length === 0) {
        carousel_Desc_css_class = 'a-card-description';
    }
    if (!carousel_Price_css_class || typeof carousel_Price_css_class === 'undefined' || carousel_Price_css_class.trim().length === 0) {
        carousel_Price_css_class = 'a-card-price';
    }
    if (!carousel_DiscountPrice_css_class || typeof carousel_DiscountPrice_css_class === 'undefined' || carousel_DiscountPrice_css_class.trim().length === 0) {
        carousel_DiscountPrice_css_class = 'a-card-discount';
    }
    //console.log("card page carousel_Desc_css_class = "+carousel_Desc_css_class +"  carousel_Price_css_class= "+carousel_Price_css_class+"  carousel_DiscountPrice_css_class= "+carousel_DiscountPrice_css_class)
    //  const isHybridProduct = cardDetails["isHybridProduct"] && cardDetails["isHybridProduct"][0] || "false";
    let pdpName = 'pdp';
    let pdpTypeForSPA = 'default';
    if (data.pdpTypeCollection) {
        pdpName = 'group'; // Defect 23372
        pdpTypeForSPA = 'collection';
    }
    if (data.pdpTypeHybrid) {
        pdpName = 'pdp/hp';
        pdpTypeForSPA = 'hybrid';
    }
    //const cardHref = `/tienda/${pdpName}/${productName}/${productId}`;

    let inputData = {
        productId: productId,
        productName: getFilteredString(productName),
        pageName: 'productDetails',
        pdpTypeForSPA: pdpTypeForSPA,
        typeahead: 'no'
    }
    const { href, asInfo } = GetLinkData(inputData);

    const cardAsInfo = asInfo;
    const cardHref = href;

    const imgSrc = (data.imageUrl) ? data.imageUrl : Path.onImgError;
    const htmlFormat = !isEmpty(data.description)? (data.description.indexOf("<") > -1 && data.description.indexOf(">") > -1):false;
    const onImgError = props.onError;
    return (
        <div className="item">
            <Link onClick={() => { if(typeof props.triggerGTM === 'function'){props.triggerGTM(data, priceToShow);} if(pdpTypeForSPA === 'default' || pdpTypeForSPA === 'collection'){ Router.push(cardHref, cardAsInfo);} else {window.location.href = cardAsInfo;} } } href='#'>
                <figure className="card m-card">
                    {
                        showImg && <img className="card-img-top lazyload" data-src={data.imageUrl} alt={data.description} onError={onImgError} /> /* 23404 fix */
                    }
                    <figcaption className="card-body d-flex flex-column align-items-start">
                        {/* start of defect 23796 */}
                        {
                            (!isEmpty(data.description)) && htmlFormat &&
                            <p className={carousel_Desc_css_class} dangerouslySetInnerHTML ={{ __html:data.description}}></p>
                        }
                        {
                            (!isEmpty(data.description)) && !htmlFormat &&   <p className={carousel_Desc_css_class} >{data.description}</p>
                        }
                        {/* end of defect 23796 */}
                        {/*{
                            (!isEmpty(data.price)) &&
                            <p className="a-card-price">${data.price}<sup>50</sup></p>
                        }
                        {
                            (!isEmpty(data.discount)) &&
                            <p className="a-card-discount">${data.discount}<sup>99</sup></p>
                        }*/}

                        {
                            (priceToShow.price) ?
                                <Paragraph className={carousel_Price_css_class} >${priceToShow.price.val}<Sup>{priceToShow.price.decimal}</Sup></Paragraph>
                                :
                                (priceToShow.rangePrice && priceToShow.rangePrice.noRange) ?
                                    <Paragraph className={carousel_Price_css_class} >${priceToShow.rangePrice.noRange.val}<Sup>{priceToShow.rangePrice.noRange.decimal}</Sup></Paragraph>
                                    :
                                    (priceToShow.rangePrice && priceToShow.rangePrice.min) ?
                                        <Paragraph className={carousel_Price_css_class} >
                                            ${priceToShow.rangePrice.min.val}<Sup>{priceToShow.rangePrice.min.decimal}</Sup> 
                                            {/*- ${priceToShow.rangePrice.max.val}<Sup>{priceToShow.rangePrice.max.decimal}</Sup> // Commented for Defect 20274 */}
                                            {pdpName === 'group' &&
                                                <React.Fragment>
                                                - ${priceToShow.rangePrice.max.val}<Sup>{priceToShow.rangePrice.max.decimal}</Sup>
                                                </React.Fragment>
                                            }
                                        </Paragraph>
                                        :
                                        null
                        }

                        {
                            (priceToShow.discount) ?
                                <Paragraph className={carousel_DiscountPrice_css_class} >${priceToShow.discount.val}<Sup>{priceToShow.discount.decimal}</Sup></Paragraph>
                                :
                                (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) ?
                                    <Paragraph className={carousel_DiscountPrice_css_class} >${priceToShow.rangeDiscount.noRange.val}<Sup>{priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                                    :
                                    (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) ?
                                        <Paragraph className={carousel_DiscountPrice_css_class}>
                                            ${priceToShow.rangeDiscount.min.val}<Sup>{priceToShow.rangeDiscount.min.decimal}</Sup> 
                                            {pdpName === 'group' &&
                                                <React.Fragment>
                                                - ${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup>
                                                </React.Fragment>
                                            }
                                            {/*- ${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup> // Commented for Defect 20274 */}
                                        </Paragraph>
                                        :
                                        null
                        }


                        {
                            (!isEmpty(data.CardTypeahead)) &&
                            <p className="a-search-suggestion-title">Consola Xbox One S 1 TB + Battlefield</p>
                        }

                    </figcaption>
                </figure>
            </Link>
        </div>
    );
}

export const CardHomeCarousel = (props) => {
    const data = props.data;
    let productName = data.description && data.description.toLowerCase().replace(/\s/g, '-') || '';
    const productId = data.repositoryId || '';

    //  const isHybridProduct = cardDetails["isHybridProduct"] && cardDetails["isHybridProduct"][0] || "false";
    let pdpName = 'pdp';
    let pdpTypeForSPA = 'default';
    if (data.pdpTypeCollection) {
        pdpName = 'group'; // Defect 23372
        pdpTypeForSPA = 'collection';
    }
    if (data.pdpTypeHybrid) {
        pdpName = 'pdp/hp';
        pdpTypeForSPA = 'hybrid';
    }

    let inputData = {
        productId: productId,
        productName: getFilteredString(productName),
        pageName: 'productDetails',
        pdpTypeForSPA: pdpTypeForSPA,
        typeahead: 'no'
    }
    const { href, asInfo } = GetLinkData(inputData);
    const cardAsInfo = asInfo;
    const cardHref = href;

    const imgSrc = (data.imageUrl) ? data.imageUrl : Path.onImgError;
    const onImgError = props.onError;
    return (
        <div className="item">
            <Link onClick={() => { if(typeof props.getHomePageCaraosalGTM === 'function'){ props.getHomePageCaraosalGTM(data); } if(pdpTypeForSPA === 'default' || pdpTypeForSPA === 'collection'){ Router.push(cardHref, cardAsInfo);} else {window.location.href = cardAsInfo;} } }  href='#'>
                <img className="card-img-top lazyload" data-src={data.imageUrl} alt={productName} onError={onImgError} />
            </Link>
        </div>
    );
}

export const CardTrackingCarousal = (props) => {
    const data = props.data;
    let productName = data.description && data.description.toLowerCase().replace(/\s/g, '-') || '';
    const productId = data.repositoryId || '';
    const quantity = data.quantity || ''

    //  const isHybridProduct = cardDetails["isHybridProduct"] && cardDetails["isHybridProduct"][0] || "false";
    let pdpName = 'pdp';
    const cardHref = `/tienda/${pdpName}/${productName}/${productId}`;

    const imgSrc = (data.imageUrl) ? data.imageUrl : Path.onImgError;
    return (
        <div className="item">
                <Link href={cardHref}>
                <figure className="m-figureCard__figure card m-trackingOrder__figure" id="carousalImage">
                     <Image showLoader className="card-img-top" src={imgSrc} alt={productName} />
                    <figcaption className="m-figureCard__figcaption card-body d-flex flex-column align-items-start">
                        <p className="a-card-description">{data.description}</p>
                        <p className="a-paragraph__quantity">Cantidad: {quantity}</p>
                    </figcaption>
                </figure>
                </Link>
        </div>
    );
}


export const CardTypeahead = (props) => {
    const { searchTerm, title, onClick, href, asInfo, handleTypeheadHide, clearSearchbar, pdpTypeForSPA } = props;
    const new_title = getColoredString(searchTerm, title);
    return (
        <List className="col-lg-6 col-xl col-6 pl-2 pr-2">
            <div className="m-search-suggestion-product mb-3">
                <Link href='#' onClick={() => {handleTypeheadHide(); clearSearchbar(); onClick(props.href); if(pdpTypeForSPA === 'default' || pdpTypeForSPA === 'collection') { Router.push(href, asInfo); } else { window.location.href= asInfo;} }}>
                    <figure className="m-figureCard__figure card  m-card">

                        <Image src={props.imgPath} alt={props.imgAlt} />
                        <figcaption className="card-body d-flex flex-column align-items-start">
                            <Paragraph className={props.className} dangerouslySetInnerHTML={{__html: new_title}} />
                        </figcaption>
                    </figure>
                </Link>
            </div>
        </List>
    );

}


export const CompareCard = (props) => {

    const data = props.data || {};
    //console.log("cpmpare==",data)
    const cardDetails = data.productPriceInfo || {};
    const priceData = {
        list: cardDetails["listPrice"] || "",
        sale: cardDetails["salePrice"] || "",
        promo: cardDetails["promoPrice"] || "",
        minList: cardDetails["minimumListPrice"] || "",
        maxList: cardDetails["maximumListPrice"] || "",
        minPromo: cardDetails["minimumPromoPrice"] || "",
        maxPromo: cardDetails["maximumPromoPrice"] || "",
        numRecords: cardDetails["numRecords"] || 1
    };

    const priceToShow = GetPrice(priceData);
    const ratingInfo = {
        ratingAvg: (data.averageRating && data.averageRating) || "0",
        ratingCount: (data.ratingCount && data.ratingCount) || "0"
    };

    return (
        <Link className="m-plp-card-container" href="#" >
            <figure className="card m-card m-plp-product-card" style={{ maxHeight: 'initial' }} >
                <Image className="card-img-top a-plp-image-product" alt={data.product.displayName} src={data.product.largeImageUrl || Path.onImgError} onClick={() => props.goToPdpPage(data)} />
                {props.visibleCloseBtn &&
                    <div className="a-card__close" onClick={() => props.removeProductFromCompare(data)}>
                        <i className="icon-close_ci"></i>
                    </div>
                }
                <figcaption className="card-body d-flex flex-column align-items-start a-plp-product-info">
                    <article className="d-flex justify-content-center">
                        <h5 className="card-title a-card-description">{data.product.displayName}</h5>
                    </article>
                    {/* <Paragraph className="a-card-price">{GetWithDecimal(data.productPriceInfo.listPrice, '2').val}<sup>{GetWithDecimal(data.productPriceInfo.listPrice, '2').decimal}</sup></Paragraph>
                    <Paragraph className="a-card-discount">{GetWithDecimal(data.productPriceInfo.listPrice, '2').val}<sup>{GetWithDecimal(data.productPriceInfo.listPrice, '2').decimal}</sup></Paragraph> */}
                    {
                        (priceToShow.price) ?
                            <Paragraph className="a-card-price" >${priceToShow.price.val}<Sup>{priceToShow.price.decimal}</Sup></Paragraph>
                            :
                            (priceToShow.rangePrice && priceToShow.rangePrice.noRange) ?
                                <Paragraph className="a-card-price">${priceToShow.rangePrice.noRange.val}<Sup>{priceToShow.rangePrice.noRange.decimal}</Sup></Paragraph>
                                :
                                (priceToShow.rangePrice && priceToShow.rangePrice.min) ?
                                    <Paragraph className="a-card-price" >
                                        ${priceToShow.rangePrice.min.val}<Sup>{priceToShow.rangePrice.min.decimal}</Sup> - ${priceToShow.rangePrice.max.val}<Sup>{priceToShow.rangePrice.max.decimal}</Sup>
                                    </Paragraph>
                                    :
                                    null
                    }

                    {
                        (priceToShow.discount) ?
                            <Paragraph className="a-card-discount" >${priceToShow.discount.val}<Sup>{priceToShow.discount.decimal}</Sup></Paragraph>
                            :
                            (priceToShow.rangeDiscount && priceToShow.rangeDiscount.noRange) ?
                                <Paragraph className="a-card-discount" >${priceToShow.rangeDiscount.noRange.val}<Sup>{priceToShow.rangeDiscount.noRange.decimal}</Sup></Paragraph>
                                :
                                (priceToShow.rangeDiscount && priceToShow.rangeDiscount.min) ?
                                    <Paragraph className="a-card-discount" >
                                        ${priceToShow.rangeDiscount.min.val}<Sup>{priceToShow.rangeDiscount.min.decimal}</Sup> - ${priceToShow.rangeDiscount.max.val}<Sup>{priceToShow.rangeDiscount.max.decimal}</Sup>
                                    </Paragraph>
                                    :
                                    null
                    }
                    <div className="m-ratings">
                        <Ratings ratingInfo={ratingInfo} />
                    </div>
                    <div className="col mb-5">
                        <div className="a-btn m-product__giftPurchase-container plp-btn-compare -small mb-3">
                            <parentContext.Consumer>
                                {({ OpenModal }) => (
                                    <div className="a-btn a-btn--action -comparePromotions"
                                        data-toggle="modal" data-target="#comparator__OfferYPromotions" id="a-morePromotions-modal__btn" onClick={() => {
                                            props.assignModalData(data);
                                            OpenModal("comparatorOfferYPromotions");
                                        }}>Más promociones de pago<i className="icon-arrow_right"></i></div>
                                )}
                            </parentContext.Consumer>
                        </div>
                        {
                            data.hasVariants !== 'true' &&
                            <Button className="mdc-button a-btn__primary" onClick={() => props.addItemToCart(data)}><span>Comprar</span></Button>
                        }
                        {
                            data.hasVariants === 'true' &&
                            <Button className="a-btn a-btn--tertiary" onClick={() => props.goToPdpPage(data)}><span>Ver detalle</span></Button>
                        }
                    </div>
                </figcaption>
            </figure>
        </Link>
    )
}

// export const LinkCard = (cardOptions) => {
// // const {cardOptions.cardHref} = '#'
// //   const {cardOptions.alt}      = 'Card image caption'
//     return (
//         <moleculeLinkCard />
//     );

// }

const getColoredString = (searchTerm, title) => {
    let str = title;
    title = title.toLowerCase();
    searchTerm = searchTerm.toLowerCase();    
    if(title.indexOf(searchTerm) !== -1) {
        const startIndex = title.indexOf(searchTerm);
        const len = searchTerm.length;
        const lastIndex = startIndex + len;
        str = str.replace(str.substring(startIndex, lastIndex), `<span>${str.substring(startIndex, lastIndex)}</span>`);
        return str;
    }
    return title;
}