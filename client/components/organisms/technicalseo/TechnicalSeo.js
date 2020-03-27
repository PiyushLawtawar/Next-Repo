import React from 'react';
import { Path } from '../../../helpers/config/config';
import { TechnicalSEO } from '../../../../client/config/technicalSeoKeys';
import Head from 'next/head';

export default class TechnicalSeo extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            pageName: props.pageName,
            staticKeyData: props.staticLabelValues,
            url: "https://" + props.hostName + "/tienda",
            pdpUrl: "https://" + props.hostName + "/tienda/pdp/",
            hostName: props.hostName,
            relativePath: props.relativePath,
            offers: props.offers,
            breadcrumbData: props.breadcrumbData,
            contentItem: props.contentItem,
            outputJsons: []
        }
        TechnicalSEO.TECHNICAL_SEO_PAGE_RELOAD = 'false';
        //console.log("technical seo constructor "+JSON.stringify(props));
    }
    getSiteBrandName() {
        let siteBrandName = 'Liverpool';
        const { hostName } = this.state;
        let domainName = hostName && hostName.replace(/.+?\./, '') || '';
        switch (domainName) {
            case 'williams-sonoma.com.mx':
                siteBrandName = "Williams Sonoma";
                break;
            case 'potterybarn.com.mx':
                siteBrandName = "Pottery Barn";
                break;
            case 'potterybarnkids.com.mx':
                siteBrandName = "Pottery Barn Kids";
                break;
            case 'pbteen.com.mx':
                siteBrandName = "Pottery Barn Teen";
                break;
            case 'westelm.com.mx':
                siteBrandName = "West ELM";
                break;
            case 'liverpool.com.mx':
                siteBrandName = "Liverpool";
                break;
        }
        return siteBrandName;
    }
    getEveryPageJSON() {
        var json = Object.assign({}, TechnicalSEO.everyPageDefaultJSON);
        let data = null;
        //console.log("pagename = "+this.state.pageName+"  --- "+this.props.pageName);
        // console.log("staticKeyData = "+JSON.stringify(this.state.staticKeyData)+"  --- "+JSON.stringify(this.props.staticLabelValues));
        // console.log("contentItem = "+JSON.stringify(this.state.contentItem)+"  --- "+JSON.stringify(this.props.contentItem));
        const staticKeyData = this.props.staticKeyData ? this.props.staticKeyData : this.state.staticKeyData;
        if (staticKeyData && typeof staticKeyData !== 'undefined' && json) {
            const sData = staticKeyData.staticLabelValues ? staticKeyData.staticLabelValues : staticKeyData;
            if (sData && sData.length > 0) {
                sData.map(staticLabel => {
                    // console.log("page name in every page json "+staticLabel.pageName +"...."+TechnicalSEO.PWA_TECH_SEO_EVERY_PAGE +"    data = "+JSON.stringify(staticLabel.keyValues));
                    if (staticLabel && staticLabel.pageName && staticLabel.pageName === TechnicalSEO.PWA_TECH_SEO_EVERY_PAGE) {
                        data = staticLabel.keyValues;
                    }

                });
            }
            if (!data || typeof data === 'undefined') {
                return json;
            }
            json['name'] = data[TechnicalSEO.everyPage.name];
            json['url'] = data[TechnicalSEO.everyPage.url];
            json['email'] = data[TechnicalSEO.everyPage.email];
            json['logo'] = data[TechnicalSEO.everyPage.logo];
            json['telephone'] = data[TechnicalSEO.everyPage.telephone];
            if (data[TechnicalSEO.everyPage.sameAs] && typeof data[TechnicalSEO.everyPage.sameAs] !== 'undefined') {
                const similarURLS = JSON.stringify(data[TechnicalSEO.everyPage.sameAs]).split("|");
                if (similarURLS) {
                    json['sameAs'] = similarURLS;
                }
            }
            json['potentialAction'] = Object.assign({}, TechnicalSEO.potentialAction);
            json['potentialAction']['target'] = data[TechnicalSEO.everyPage.target];
            json['potentialAction']['query-input'] = data[TechnicalSEO.everyPage.queryInput];
        }
        // console.log("every page JSON ="+JSON.stringify(json));
        return json;
    }
    getHomePageJSON() {
        var json = [];
        let data = null;
        var pageJson = Object.assign({}, TechnicalSEO.homePageWebPageDefaultJSON);
        json.push(this.getEveryPageJSON());
        const staticKeyData = this.props.staticKeyData ? this.props.staticKeyData : this.state.staticKeyData;
        if (staticKeyData && typeof staticKeyData !== 'undefined' && json) {
            const sData = staticKeyData.staticLabelValues ? staticKeyData.staticLabelValues : staticKeyData;
            if (sData && sData.length > 0) {
                sData.map(staticLabel => {
                    // console.log("page name in home page json "+staticLabel.pageName +"...."+TechnicalSEO.PWA_TECH_SEO_HOME_PAGE +"    data = "+JSON.stringify(staticLabel.keyValues));
                    if (staticLabel && staticLabel.pageName && staticLabel.pageName === TechnicalSEO.PWA_TECH_SEO_HOME_PAGE) {
                        data = staticLabel.keyValues;
                    }

                });
            }
            if (!data || typeof data === 'undefined') {
                return json;
            }
            pageJson['name'] = data[TechnicalSEO.homePage.name];
            pageJson['url'] = data[TechnicalSEO.homePage.url];
            pageJson['description'] = data[TechnicalSEO.homePage.description];
            json.push(pageJson);
            if (data[TechnicalSEO.software.name] && typeof data[TechnicalSEO.software.name] !== 'undefined') {
                let mulitpleNames = JSON.stringify(data[TechnicalSEO.software.name]).split("|");
                let operatingSystems = JSON.stringify(data[TechnicalSEO.software.operatingSystem]).split("|");
                if (!operatingSystems || typeof operatingSystems === 'undefined') {
                    operatingSystems = [""];
                }
                if (operatingSystems && typeof operatingSystems !== 'undefined' && typeof operatingSystems === 'string') {
                    operatingSystems = [operatingSystems];
                }
                let categories = JSON.stringify(data[TechnicalSEO.software.applicationCategory]).split("|");
                if (!categories || typeof categories === 'undefined') {
                    categories = [""];
                }
                if (categories && typeof categories !== 'undefined' && typeof categories === 'string') {
                    categories = [categories];
                }
                let fileSizes = JSON.stringify(data[TechnicalSEO.software.fileSize]).split("|");
                if (!fileSizes || typeof fileSizes === 'undefined') {
                    fileSizes = [""];
                }
                if (fileSizes && typeof fileSizes !== 'undefined' && typeof fileSizes === 'string') {
                    fileSizes = [fileSizes];
                }
                let softwareVersions = JSON.stringify(data[TechnicalSEO.software.softwareVersion]).split("|");
                if (!softwareVersions || typeof softwareVersions === 'undefined') {
                    softwareVersions = [""];
                }
                if (softwareVersions && typeof softwareVersions !== 'undefined' && typeof softwareVersions === 'string') {
                    softwareVersions = [softwareVersions];
                }

                if (mulitpleNames) {
                    let softwareJson = null;
                    let aggregateRating = null;
                    let offers = null;
                    mulitpleNames.forEach((currentName, nameIndex) => {
                        softwareJson = Object.assign({}, TechnicalSEO.homePageSoftwareDefaultJSON);
                        softwareJson['name'] = currentName.replace(/\\/g, " ");
                        softwareJson['operatingSystem'] = (operatingSystems[nameIndex] ? operatingSystems[nameIndex].replace(/\\/g, " ") : operatingSystems[0].replace(/\\/g, " "));
                        softwareJson['applicationCategory'] = (categories[nameIndex] ? categories[nameIndex].replace(/\\/g, " ") : categories[0].replace(/\\/g, " "));
                        softwareJson['fileSize'] = (fileSizes[nameIndex] ? fileSizes[nameIndex].replace(/\\/g, " ") : fileSizes[0].replace(/\\/g, " "));
                        softwareJson['softwareVersion'] = (softwareVersions[nameIndex] ? softwareVersions[nameIndex].replace(/\\/g, " ") : softwareVersions[0].replace(/\\/g, " "));
                        aggregateRating = softwareJson['aggregateRating'];
                        offers = softwareJson['offers'];
                        aggregateRating['ratingValue'] = data[TechnicalSEO.software.ratingValue];
                        aggregateRating['ratingCount'] = data[TechnicalSEO.software.ratingCount];
                        offers['price'] = data[TechnicalSEO.software.price];
                        softwareJson['aggregateRating'] = aggregateRating;
                        softwareJson['offers'] = offers;
                        json.push(softwareJson);
                    });
                }
            }

        }
        // console.log("home page JSON ="+JSON.stringify(json));
        return json;
    }
    getBreadCrumb(ancestors, currentId, currentName) {
        let bJson = Object.assign({}, TechnicalSEO.breadcrumbDefaultJSON);
        bJson['itemListElement'] = [];
        let index = 0;
        //console.log("MMMMMMMMMMMMMMMMMMMMMM   "+currentId+"   "+currentName+"  page name "+this.props.pageName )
        //console.log("bread crumb "+JSON.stringify(ancestors));
        if (ancestors && typeof ancestors !== 'undefined' && (ancestors.length > 0 || ancestors.breadCrumbs)) {
            if (this.props.pageName === 'CLP') {
                let bcItemJson = null;
                ancestors.map((ancestor, position) => {
                    bcItemJson = Object.assign({}, TechnicalSEO.breadcrumbItem);
                    index = position + 1;
                    bcItemJson['position'] = index;
                    bcItemJson['item'] = Object.assign({}, TechnicalSEO.item);
                    bcItemJson['item']['name'] = ancestor.categoryName;
                    bcItemJson['item']['@id'] = this.state.url + ancestor.viewAllUrl;
                    bJson['itemListElement'].push(bcItemJson);
                });
            }
            if (this.props.pageName === 'PLP') {
                let plpItemJson = null;
                ancestors.map((ancestor, position) => {
                    if (ancestor && ancestor.properties) {
                        index = position + 1;
                        plpItemJson = Object.assign({}, TechnicalSEO.breadcrumbItem);
                        plpItemJson['position'] = index;
                        plpItemJson['item'] = Object.assign({}, TechnicalSEO.item);
                        plpItemJson['item']['name'] = ancestor.properties['category.displayName'] ? ancestor.properties['category.displayName'] : ancestor.properties['category.repositoryId'];
                        plpItemJson['item']['@id'] = this.state.url + "/" + plpItemJson['item']['name'] + "/" + ancestor.properties['category.repositoryId'];
                        bJson['itemListElement'].push(plpItemJson);
                    }
                });
            }
            if (this.props.pageName === 'PDP' && ancestors.breadCrumbs) {
                let pItemJson = null;
                ancestors.breadCrumbs.map((breadcrumb, position) => {
                    index = position + 1;
                    pItemJson = Object.assign({}, TechnicalSEO.breadcrumbItem);
                    pItemJson['position'] = index;
                    pItemJson['item'] = Object.assign({}, TechnicalSEO.item);
                    pItemJson['item']['name'] = breadcrumb.categoryName;
                    pItemJson['item']['@id'] = this.state.url + breadcrumb.categoryUrl;
                    bJson['itemListElement'].push(pItemJson);
                });
            }

        }
        if (currentId && currentName && typeof currentId !== 'undefined' && typeof currentName !== 'undefined') {
            // console.log("inside the current "+currentName)
            let iitemJson = Object.assign({}, TechnicalSEO.breadcrumbItem);
            iitemJson['position'] = (index + 1);
            iitemJson['item'] = Object.assign({}, TechnicalSEO.item);
            iitemJson['item']['name'] = currentName;
            iitemJson['item']['@id'] = this.state.url + "/" + currentName + "/" + currentId;
            bJson['itemListElement'].push(iitemJson);
        }
        const breadcrumbResults = Object.assign({}, bJson);
        bJson = Object.assign({}, TechnicalSEO.breadcrumbDefaultJSON);
        //console.log("Bread crumb page JSON ="+JSON.stringify(breadcrumbResults));
        return breadcrumbResults;
    }
    getBrandLandingPage(contentItem) {
        var fullJson = [];
        var BLPjson = Object.assign({}, TechnicalSEO.BLPCLPBreadCrumbDefaultJSON);
        let name = null;
        let id = null;
        if (this.props.pageName === 'BLP') {
            fullJson.push(this.getEveryPageJSON());
            if (contentItem && contentItem.contents && contentItem.contents[0] && contentItem.contents[0].secondaryContent) {
                contentItem.contents[0].secondaryContent.map((classType) => {
                    if (classType['@type'] === 'Breadcrumbs' && classType.refinementCrumbs && classType.refinementCrumbs[0]
                        && classType.refinementCrumbs[0]['properties']) {
                        name = classType.refinementCrumbs[0]['properties']['category.displayName'];
                        id = classType.refinementCrumbs[0]['properties']['category.repositoryId'];
                        BLPjson['breadcrumb'] = "Home>" + name;
                        BLPjson['name'] = name + " " + this.getSiteBrandName();
                        BLPjson['url'] = this.state.url + "/" + name + "/" + id;
                    }
                });
                if (id && name) {
                    fullJson.push(this.getBreadCrumb(null, id, name));
                }
                fullJson.push(BLPjson);
            }
            if (contentItem && contentItem.childCategories) {
                var siteNav = Object.assign({}, TechnicalSEO.CLPItemList);
                var cat = null;
                siteNav['url'] = BLPjson['url'];
                siteNav['name'] = siteNav['name'] + name;
                siteNav['itemListElement'] = [];
                contentItem.childCategories.map((cur, postion) => {
                    cat = Object.assign({}, TechnicalSEO.SiteNavigationElement);
                    cat['position'] = postion + 1;
                    cat['name'] = cur['categoryName'];
                    cat['url'] = this.state.url + cur['viewAllUrl'];
                    // console.log("loop cat = "+JSON.stringify(cat))
                    siteNav['itemListElement'].push(cat);
                });
                // console.log("site nav = "+JSON.stringify(siteNav))
                fullJson.push(siteNav);
            }
        }
        //console.log("BLP page JSON ="+JSON.stringify(fullJson));
        return fullJson;
    }
    getCategoryLandingPage(contentItem) {
        let CLPJson = [];
        var breadCrumbjson = Object.assign({}, TechnicalSEO.BLPCLPBreadCrumbDefaultJSON);
        var clpItemjson = Object.assign({}, TechnicalSEO.CLPItemList);
        clpItemjson['itemListElement'] = [];
        let listItem = null;
        if (this.props.pageName === 'CLP' && contentItem) {
            CLPJson.push(this.getEveryPageJSON());
            const categoryName = contentItem.categoryName;
            let breadcrumb = "Home";
            breadCrumbjson['name'] = categoryName;
            breadCrumbjson['url'] = this.state.url + contentItem.viewAllUrl;
            clpItemjson['url'] = this.state.url + contentItem.viewAllUrl;
            clpItemjson['name'] = clpItemjson['name'] + categoryName;
            if (contentItem.ancestors) {
                contentItem.ancestors.map((ancestor) => {
                    if (ancestor) {
                        breadcrumb = breadcrumb + ">" + ancestor['categoryName'];
                    }
                });
                breadcrumb = breadcrumb + ">" + categoryName;
            }
            breadCrumbjson['breadcrumb'] = breadcrumb;
            if (contentItem.children) {
                contentItem.children.map((child, position) => {
                    listItem = Object.assign({}, TechnicalSEO.CLPListItem);
                    if (child && typeof child !== 'undefined') {
                        listItem['name'] = child.categoryName;
                        listItem['url'] = this.state.url + child.viewAllUrl;
                        listItem['position'] = position + 1;
                        listItem['image'] = child.imageUrl;
                        clpItemjson['itemListElement'].push(listItem);
                    }
                });
            }
            if (contentItem) {
                var array = contentItem.viewAllUrl ? contentItem.viewAllUrl.split("/") : null;
                const lengthh = array ? array.length : -1;
                if (array && lengthh > -1 && array[(lengthh - 2)] && array[(lengthh - 1)]) {
                    CLPJson.push(this.getBreadCrumb(contentItem.ancestors, array[(lengthh - 2)], array[(lengthh - 1)]));
                }
                if (contentItem && contentItem.childCategories) {
                    var siteNav = Object.assign({}, TechnicalSEO.CLPItemList);
                    var cat = null;
                    siteNav['url'] = this.state.url + contentItem.viewAllUrl;
                    siteNav['name'] = siteNav['name'] + contentItem['categoryName'];
                    siteNav['itemListElement'] = [];
                    contentItem.childCategories.map((cur, postion) => {
                        cat = Object.assign({}, TechnicalSEO.SiteNavigationElement);
                        cat['position'] = postion + 1;
                        cat['name'] = cur['categoryName'];
                        cat['url'] = this.state.url + cur['viewAllUrl'];
                        siteNav['itemListElement'].push(cat);
                    });
                    CLPJson.push(siteNav);
                }
                CLPJson.push(breadCrumbjson);
                CLPJson.push(clpItemjson);
            }

        }
        //console.log("CLP page JSON ="+JSON.stringify(CLPJson));
        return CLPJson;
    }
    getProductListingPage(contentItem) {
        let plpjson = [];
        let plpmainJson = Object.assign({}, TechnicalSEO.PLPMainDefaultJSON);
        plpmainJson['itemListElement'] = [];
        var resultsList = null;
        if (this.props.pageName === 'PLP' && contentItem && contentItem.contents && contentItem.contents[0] && contentItem.contents[0].secondaryContent) {
            plpjson.push(this.getEveryPageJSON());
            contentItem.contents[0].secondaryContent.map(content => {
                if (content['@type'] === 'Breadcrumbs' && content.refinementCrumbs && content.refinementCrumbs[0]) {
                    const ancestors = content.refinementCrumbs[0].ancestors;
                    const properties = content.refinementCrumbs[0].properties;
                    let mainId = null;
                    let mainName = null;
                    if (ancestors && typeof ancestors !== 'undefined' && ancestors[0]) {
                        //plp
                        mainId = properties['category.displayName'];
                        mainName = properties['category.repositoryId'];
                        plpjson.push(this.getBreadCrumb(ancestors, mainName, mainId));
                    } else {
                        //market place plp
                        mainName = content.refinementCrumbs && content.refinementCrumbs[0] && content.refinementCrumbs[0]['label'];
                        mainId = mainName;
                        if (this.state.relativePath && typeof this.state.relativePath !== 'undefined') {
                            var array = this.state.relativePath.split("/");
                            if (array) {
                                array.forEach(localPath => {
                                    mainId = localPath;
                                });
                            }
                        }
                        plpjson.push(this.getBreadCrumb(null, mainName, mainId));
                    }
                    plpmainJson['url'] = this.state.url + "/" + mainName + "/" + mainId;
                }
            });
        }
        if (this.props.pageName === 'PLP' && contentItem && contentItem.contents && contentItem.contents[0] && contentItem.contents[0].mainContent) {
            contentItem.contents[0].mainContent.map(content => {
                if (content['name'] === 'Results List Collection' || JSON.stringify(content['name']).indexOf("Results") > -1) {
                    resultsList = content.contents[0];
                }
            });
            if (resultsList && typeof resultsList !== 'undefined') {
                plpmainJson['numberOfItems'] = resultsList.totalNumRecs;
                if (resultsList.records) {
                    let skuId = null;
                    let productId = null;
                    let productName = null;
                    let ratingValue = null;
                    let reviewCount = null;
                    let sellerName = null;
                    let sellerId = null;
                    let recordJson = null;
                    resultsList.records.map((record, position) => {
                        productId = (record['productId'] && record['productId'][0]) ? record['productId'][0] : '';
                        skuId = (record['sku.repositoryId'] && record['sku.repositoryId'][0]) ? record['sku.repositoryId'][0] : '';
                        productName = (record['productDisplayName'] && record['productDisplayName'][0]) ? record['productDisplayName'][0] : '';
                        ratingValue = (record['productAvgRating'] && record['productAvgRating'][0]) ? record['productAvgRating'][0] : '';
                        reviewCount = (record['productRatingCount'] && record['productRatingCount'][0]) ? record['productRatingCount'][0] : '';
                        sellerName = (record['productBestSeller'] && record['productBestSeller'][0]) ? record['productBestSeller'][0] : '';
                        if (sellerName && sellerName.indexOf("|") > -1) {
                            var array = sellerName.split("|");
                            if (array && array[0] || array[1]) {
                                sellerName = array[0];
                                sellerId = array[1];
                            }
                        }
                        recordJson = Object.assign({}, TechnicalSEO.PLPMarketListItemDefaultJSON);
                        recordJson['position'] = position + 1;
                        recordJson['item'] = Object.assign({}, TechnicalSEO.PLPItem);
                        recordJson['item']['name'] = productName;
                        recordJson['item']['url'] = this.state.pdpUrl + productName + "/" + productId + "?skuId=" + skuId;
                        if ((ratingValue && ratingValue.trim().length > 0 && Number(ratingValue) >= 1) ||
                            (reviewCount && reviewCount.trim().length > 0 && Number(reviewCount) >= 1)) {
                            recordJson['item']['aggregateRating'] = Object.assign({}, TechnicalSEO.PLPAggregateRating);
                            recordJson['item']['aggregateRating']['ratingValue'] = ratingValue;
                            recordJson['item']['aggregateRating']['reviewCount'] = reviewCount;
                        }
                        if (sellerId && typeof sellerId !== 'undefined') {
                            recordJson['item']['Offers'] = Object.assign({}, TechnicalSEO.PLPOffers);
                            recordJson['item']['Offers']['seller']['name'] = sellerName;
                        } else {
                            recordJson['item']['Offers'] = {};
                        }
                        plpmainJson['itemListElement'].push(recordJson);
                    });
                }
            }
            plpjson.push(plpmainJson);
        }

        if (this.props.pageName === 'PLP' && contentItem && contentItem.contents && contentItem.contents[0] && contentItem.contents[0].secondaryContent) {
            contentItem.contents[0].secondaryContent.map(content => {
                if (content['@type'] == 'GuidedNavigation' || content['name'] === 'Facets' || JSON.stringify(content['name']).indexOf("Facets") > -1) {
                    if (content.navigation) {
                        content.navigation.map(nav => {
                            if (nav['dimensionName'] == 'product.category' && nav['childCategories']) {
                                var siteNav = Object.assign({}, TechnicalSEO.CLPItemList);
                                var cat = null;
                                siteNav['itemListElement'] = [];
                                nav['childCategories'].map((cur) => {
                                    if (cur.children) {
                                        siteNav['url'] = this.state.url + cur.viewAllUrl;
                                        siteNav['name'] = siteNav['name'] + cur['categoryName'];
                                        cur.children.map((data, position) => {
                                            cat = Object.assign({}, TechnicalSEO.SiteNavigationElement);
                                            cat['position'] = position + 1;
                                            cat['name'] = data['categoryName'];
                                            cat['url'] = this.state.url + data['viewAllUrl'];
                                            siteNav['itemListElement'].push(cat);
                                        })
                                        // console.log("siteNav = "+JSON.stringify(siteNav))
                                        plpjson.push(siteNav);
                                    }
                                })

                            }
                        })
                    }
                }
            });
        }
        //console.log("PLP page JSON ="+JSON.stringify(plpjson));
        return plpjson;
    }
    getProductDetailPage(contentItem, breadcrumbData, offers) {
        let xjson = [];
        //console.log("offers= "+JSON.stringify(offers))     
        //console.log("breadcrumbData= "+JSON.stringify(breadcrumbData))     
        let PDPmainJson = Object.assign({}, TechnicalSEO.PLPMarketListItemDefaultJSON);
        let price = -1;
        let lowPrice = -1;
        let highPrice = -1;
        let productName = null;
        let productDesc = null;
        let productId = null;
        let skuId = null;
        let images = [];
        let brand = null;
        let ratingValue = null;
        let reviewCount = null;
        let inventory = "https://schema.org/InStock";
        let sellerName = null;
        let isDigital = false;
        let collectionOffers = [];
        let currentOffer = null;

        if (this.props.pageName === 'PDP' && contentItem) {
            xjson.push(this.getEveryPageJSON());
            if (breadcrumbData) {
                xjson.push(this.getBreadCrumb(breadcrumbData, null, null));
            }
            const collectionProduct = (contentItem.collectionProductInfo) ? contentItem.collectionProductInfo : null;
            const collectionChildren = (contentItem.productsInfo) ? contentItem.productsInfo : null;
            const skuAttributeMap = (contentItem.productVarientsInfo) ? contentItem.productVarientsInfo.skuAttributeMap : null;
            const mainContent = (contentItem.endecaProductInfo) ? contentItem.endecaProductInfo.contents[0].mainContent : null;
            const dynamicAttribute = (contentItem.dynamicAttribute) ? contentItem.dynamicAttribute : null;
            let mainRecord = null;
            if (dynamicAttribute && dynamicAttribute['Marca']) {
                brand = dynamicAttribute['Marca'];
            }
            if (skuAttributeMap) {
                skuId = contentItem.productVarientsInfo.defaultSkuId;
                // console.log(" type  "+(typeof skuAttributeMap)  +"  sku id = "+skuId)
                let currentPrice = null;
                Object.keys(skuAttributeMap).map(sku => {
                    if (Number(skuAttributeMap[sku]['promoPrice']) > 0) {
                        currentPrice = Number(skuAttributeMap[sku]['promoPrice']);
                    } else if (Number(skuAttributeMap[sku]['salePrice']) > 0) {
                        currentPrice = Number(skuAttributeMap[sku]['salePrice']);
                    } else if (Number(skuAttributeMap[sku]['listPrice']) > 0) {
                        currentPrice = Number(skuAttributeMap[sku]['listPrice']);
                    }
                    if (currentPrice === null) {
                        currentPrice = 0;
                    }
                    if (lowPrice === -1 || currentPrice < lowPrice) {
                        lowPrice = currentPrice;
                    }
                    if (highPrice === -1 || currentPrice > highPrice) {
                        highPrice = currentPrice;
                    }

                });
                if (lowPrice && highPrice && lowPrice === highPrice) {
                    price = lowPrice;
                }
            }
            if (mainContent) {
                mainContent.map(classType => {
                    if (classType['@type'] === 'ProductDetail') {
                        if (classType.record && classType.record.attributes) {
                            mainRecord = classType.record.attributes;
                        }
                        if (classType.record && !classType.record.attributes) {
                            mainRecord = classType.record;
                        }
                    }
                });
            }
            if (mainRecord) {
                // console.log("main record "+JSON.stringify(mainRecord));
                productDesc = (mainRecord['product.longDescription'] && mainRecord['product.longDescription'].length > 0 && mainRecord['product.longDescription'][0]) ? mainRecord['product.longDescription'][0] : mainRecord['productDisplayName'] && mainRecord['productDisplayName'][0];
                productDesc = productDesc ? productDesc.replace(/\\/g, " ") : productDesc;
                productName = mainRecord['product.displayName'] ? mainRecord['product.displayName'][0] : mainRecord['productDisplayName'][0];
                productName = productName ? productName.replace(/\\/g, " ") : productName;
                if (!brand || typeof brand === 'undefined') {
                    if (mainRecord['product.brand']) {
                        brand = mainRecord['product.brand'][0];
                    } else {
                        brand = mainRecord['brandId'] && mainRecord['brandId'][0] ? mainRecord['brandId'][0] : "";
                    }
                }
                if (mainRecord['isMarketPlace'] && mainRecord['isMarketPlace'][0] && mainRecord['isMarketPlace'][0] !== 'false' && offers && offers['skuOffers'] && offers['skuOffers'][0]) {
                    sellerName = offers['skuOffers'][0]['bestSeller'];
                }
                if (mainRecord['InventoryStatus'][0] && mainRecord['InventoryStatus'][0] === '1001') {
                    inventory = "https://schema.org/OutOfStock";
                }
                if (mainRecord['product.repositoryId']) {
                    productId = mainRecord['product.repositoryId'][0];
                } else {
                    productId = mainRecord['productId'][0];
                }
                if (mainRecord['productType'] && mainRecord['productType'][0] && mainRecord['productType'][0] === 'Digital') {
                    isDigital = true;
                }
                ratingValue = mainRecord['productAvgRating'][0];
                if (mainRecord['product.displayName']) {
                    productName = mainRecord['product.displayName'][0].replace(/\\/g, " ");
                } else {
                    productName = mainRecord['productDisplayName'][0].replace(/\\/g, " ");
                }

                reviewCount = mainRecord['product.productRatingCount'][0];
                let RproductAvgRating = Number(mainRecord['oneRatingPercentage'] ? mainRecord['oneRatingPercentage'][0] : 0) +
                    Number(mainRecord['twoRatingPercentage'] ? mainRecord['twoRatingPercentage'][0] : 0) +
                    Number(mainRecord['threeRatingPercentage'] ? mainRecord['threeRatingPercentage'][0] : 0) +
                    Number(mainRecord['fourRatingPercentage'] ? mainRecord['fourRatingPercentage'][0] : 0) +
                    Number(mainRecord['fiveRatingPercentage'] ? mainRecord['fiveRatingPercentage'][0] : 0);
                if (RproductAvgRating > 0) {
                    ratingValue = RproductAvgRating;
                }

                let RproductRatingCount = Number(mainRecord['oneRatingCount'] ? mainRecord['oneRatingCount'][0] : 0) +
                    Number(mainRecord['twoRatingCount'] ? mainRecord['twoRatingCount'][0] : 0) +
                    Number(mainRecord['threeRatingCount'] ? mainRecord['threeRatingCount'][0] : 0) +
                    Number(mainRecord['fourRatingCount'] ? mainRecord['fourRatingCount'][0] : 0) +
                    Number(mainRecord['fiveRatingCount'] ? mainRecord['fiveRatingCount'][0] : 0);
                if (RproductRatingCount > 0) {
                    reviewCount = RproductRatingCount;
                }
                if (mainRecord['smallImage'] && mainRecord['smallImage'][0]) {
                    images.push(mainRecord['smallImage'][0]);
                }
                if (mainRecord['product.largeImage'] && mainRecord['product.largeImage'][0]) {
                    images.push(mainRecord['product.largeImage'][0]);
                }
                if (mainRecord['thumbnailImage'] && mainRecord['thumbnailImage'][0]) {
                    images.push(mainRecord['thumbnailImage'][0]);
                }
                if (mainRecord['sku.smallImage'] && mainRecord['sku.smallImage'][0]) {
                    images.push(mainRecord['sku.smallImage'][0]);
                }
                if (mainRecord['sku.largeImage'] && mainRecord['sku.largeImage'][0]) {
                    images.push(mainRecord['sku.largeImage'][0]);
                }
                if (mainRecord['sku.thumbnailImage'] && mainRecord['sku.thumbnailImage'][0]) {
                    images.push(mainRecord['sku.thumbnailImage'][0]);
                } //start of defect #24183              
                if ((!collectionProduct || typeof collectionProduct === undefined) && mainRecord.records && price <= 0) {
                    let currentPrice = null;
                    Object.keys(mainRecord.records).map(index => {
                        if (mainRecord.records[index]['promoPrice'] && mainRecord.records[index]['promoPrice'][0] && Number(mainRecord.records[index]['promoPrice'][0]) > 0) { //24421
                            currentPrice = Number(mainRecord.records[index]['promoPrice'][0]);
                        } else if (mainRecord.records[index]['salePrice'] && mainRecord.records[index]['salePrice'][0] && Number(mainRecord.records[index]['salePrice'][0]) > 0) { //24421
                            currentPrice = Number(mainRecord.records[index]['salePrice'][0]);
                        } else if (mainRecord.records[index]['listPrice'] && mainRecord.records[index]['listPrice'][0] && Number(mainRecord.records[index]['listPrice'][0]) > 0) { //24421
                            currentPrice = Number(mainRecord.records[index]['listPrice'][0]);
                        }
                        if (currentPrice === null) {
                            currentPrice = 0;
                        }
                        if (lowPrice === -1 || currentPrice < lowPrice) {
                            lowPrice = currentPrice;
                        }
                        if (highPrice === -1 || currentPrice > highPrice) {
                            highPrice = currentPrice;
                        }

                    });
                    if (lowPrice && highPrice && lowPrice === highPrice) {
                        price = lowPrice;
                    }
                }
                //end of defect #24183
            }
            if (collectionProduct && collectionChildren) {//collection
                let ratingValue = 0;
                let reviewCount = 0;
                let curSKU = null;
                PDPmainJson = Object.assign({}, TechnicalSEO.collectionPDPDefaultJSON);
                PDPmainJson['name'] = collectionProduct['product.displayName'] && collectionProduct['product.displayName'][0] || "";
                PDPmainJson['name'] = PDPmainJson['name'] ? PDPmainJson['name'].replace(/\\/g, " ") : PDPmainJson['name'];
                PDPmainJson['sku'] = collectionProduct['product.collectionProductId'] && collectionProduct['product.collectionProductId'][0] || "";
                PDPmainJson['image'] = collectionProduct['product.thumbnailImage'] && collectionProduct['product.thumbnailImage'][0] || "";
                PDPmainJson['description'] = collectionProduct['product.longDescription'] && collectionProduct['product.longDescription'][0] || "";
                PDPmainJson['description'] = PDPmainJson['description'] ? PDPmainJson['description'].replace(/\\/g, " ") : PDPmainJson['description'];
                PDPmainJson['brand'] = { "@type": "Thing", "name": "No Brand" };
                Object.keys(collectionChildren).map(sku => {
                    currentOffer = Object.assign({}, TechnicalSEO.collectionOffer);
                    currentOffer['name'] = collectionChildren[sku]['product.displayName'][0];
                    currentOffer['name'] = currentOffer['name'] ? currentOffer['name'].replace(/\\/g, " ") : currentOffer['name'];
                    currentOffer['sku'] = collectionChildren[sku]['product.repositoryId'][0];
                    ratingValue = collectionChildren[sku]['productAvgRating'] ? collectionChildren[sku]['productAvgRating'][0] : 0;
                    reviewCount = collectionChildren[sku]['product.productRatingCount'] ? collectionChildren[sku]['product.productRatingCount'][0] : 0;
                    let RproductAvgRating = Number(collectionChildren[sku]['twoRatingPercentage'] ? collectionChildren[sku]['twoRatingPercentage'][0] : 0) +
                        Number(collectionChildren[sku]['oneRatingPercentage'] ? collectionChildren[sku]['oneRatingPercentage'][0] : 0) +
                        Number(collectionChildren[sku]['threeRatingPercentage'] ? collectionChildren[sku]['threeRatingPercentage'][0] : 0) +
                        Number(collectionChildren[sku]['fourRatingPercentage'] ? collectionChildren[sku]['fourRatingPercentage'][0] : 0) +
                        Number(collectionChildren[sku]['fiveRatingPercentage'] ? collectionChildren[sku]['fiveRatingPercentage'][0] : 0);
                    if (RproductAvgRating > 0) {
                        ratingValue = RproductAvgRating;
                    }

                    let RproductRatingCount = Number(collectionChildren[sku]['oneRatingCount'] ? collectionChildren[sku]['oneRatingCount'][0] : 0) +
                        Number(collectionChildren[sku]['twoRatingCount'] ? collectionChildren[sku]['twoRatingCount'][0] : 0) +
                        Number(collectionChildren[sku]['threeRatingCount'] ? collectionChildren[sku]['threeRatingCount'][0] : 0) +
                        Number(collectionChildren[sku]['fourRatingCount'] ? collectionChildren[sku]['fourRatingCount'][0] : 0) +
                        Number(collectionChildren[sku]['fiveRatingCount'] ? collectionChildren[sku]['fiveRatingCount'][0] : 0);
                    if (RproductRatingCount > 0) {
                        reviewCount = RproductRatingCount;
                    }
                    if (ratingValue > 0 || reviewCount > 0) {
                        currentOffer['aggregateRating'] = Object.assign({}, TechnicalSEO.collectionaggregateRating);
                        currentOffer['aggregateRating']['ratingValue'] = ratingValue;
                        currentOffer['aggregateRating']['reviewCount'] = reviewCount;
                    } else {
                        delete currentOffer.aggregateRating;
                    }
                    if (collectionChildren[sku]['InventoryStatus'][0] && collectionChildren[sku]['InventoryStatus'][0] === '1001') {
                        currentOffer['availability'] = "https://schema.org/OutOfStock";
                    }
                    if (collectionChildren[sku].productVarientsInfo) {
                        skuId = collectionChildren[sku].productVarientsInfo.defaultSkuId;
                        curSKU = (collectionChildren[sku].productVarientsInfo.skuAttributeMap && collectionChildren[sku].productVarientsInfo.skuAttributeMap[skuId]) ?
                            collectionChildren[sku].productVarientsInfo.skuAttributeMap[skuId] : null;
                        if (curSKU) {
                            if (typeof curSKU['promoPrice'] !== 'undefined' && Number(curSKU['promoPrice']) > 0) {
                                currentOffer['price'] = curSKU['promoPrice'];
                            } else if (typeof curSKU['salePrice'] !== 'undefined' && Number(curSKU['salePrice']) > 0) {
                                currentOffer['price'] = curSKU['salePrice'];
                            } else {
                                currentOffer['price'] = curSKU['listPrice'];
                            }
                        }
                        currentOffer['url'] = this.state.pdpUrl + collectionChildren[sku]['product.displayName'][0].replace(/\\/g, " ") + "/" + collectionChildren[sku]['product.repositoryId'][0] + "?skuId=" + skuId;
                    }
                    collectionOffers.push(currentOffer);
                });
                PDPmainJson['offers'] = collectionOffers;
                xjson.push(PDPmainJson);
                // console.log("collection PDP page JSON ="+JSON.stringify(xjson));
                return xjson;
            }
            if (isDigital) {//download product
                PDPmainJson = Object.assign({}, TechnicalSEO.DigitalPDPDefaultJSON);
                PDPmainJson['offers'] = Object.assign({}, TechnicalSEO.PDPoffers);
                PDPmainJson['offers']['price'] = price;
            } else if (sellerName && typeof sellerName !== 'undefined') {//market place PDP
                PDPmainJson = Object.assign({}, TechnicalSEO.marketPlacePDPDefaultJSON);
                PDPmainJson['offers'] = Object.assign({}, TechnicalSEO.marketPDPoffers);
                PDPmainJson['offers']['seller']['name'] = sellerName;
                PDPmainJson['offers']['price'] = price;
            } else if (price === -1 && lowPrice !== highPrice) { //multile variants
                PDPmainJson = Object.assign({}, TechnicalSEO.PDPVariantDefaultJSON);
                PDPmainJson['offers'] = Object.assign({}, TechnicalSEO.PDPVariantoffers);
                PDPmainJson['offers']['lowPrice'] = lowPrice;
                PDPmainJson['offers']['highPrice'] = highPrice;
            } else { //normal PDP or hybrid or optic
                PDPmainJson = Object.assign({}, TechnicalSEO.GeneralPDPDefaultJSON);
                PDPmainJson['offers'] = Object.assign({}, TechnicalSEO.PDPoffers);
                PDPmainJson['offers']['price'] = price;
            }
            // console.log("price = "+price +"  lowprice = "+lowPrice+"   high price "+highPrice)
            if (!collectionProduct || typeof collectionProduct === 'undefined') {
                PDPmainJson['name'] = productName;
                PDPmainJson['sku'] = productId;
                PDPmainJson['image'] = images;
                PDPmainJson['description'] = productDesc;
                PDPmainJson['brand']['name'] = brand;
                try {
                    if (Number(ratingValue) >= 1 || Number(reviewCount) >= 1) {
                        // console.log("inside the ratingValue = "+ratingValue +" reviewCount=   "+reviewCount)
                        PDPmainJson['aggregateRating'] = Object.assign({}, TechnicalSEO.collectionaggregateRating);
                        PDPmainJson['aggregateRating']['ratingValue'] = ratingValue;
                        PDPmainJson['aggregateRating']['reviewCount'] = reviewCount;
                    } else {
                        delete PDPmainJson.aggregateRating;
                    }
                } catch (e) { }
                PDPmainJson['offers']['url'] = this.state.pdpUrl + productName + "/" + productId + "?skuId=" + skuId;;
                PDPmainJson['offers']['availability'] = inventory;
                xjson.push(PDPmainJson);
            }

        }
        // console.log("PDP page JSON ="+JSON.stringify(xjson));
        return xjson;
    }
    getSellerPage(contentItem) {
        let json = [];
        let mainJson = Object.assign({}, TechnicalSEO.sellerDefaultJSON);
        if (this.props.pageName === 'vendedor' && contentItem) {
            const everyPage = this.getEveryPageJSON();
            json.push(everyPage);
            if (everyPage) {
                everyPage['logo']
            }
            mainJson['name'] = contentItem['sellerName'] + mainJson['name'];
            mainJson['description'] = mainJson['description'].replace("##", contentItem['sellerName']);
            mainJson['url'] = this.state.url + this.state.relativePath;
            mainJson['mainEntity'] = Object.assign({}, TechnicalSEO.sellerMainEntity);
            mainJson['mainEntity']['name'] = contentItem['sellerName'];
            mainJson['mainEntity']['image'] = (everyPage && everyPage['logo']) ? everyPage['logo'] : "";
            const reviewCount = (contentItem['oneStarRatings'] + contentItem['twoStarRatings'] + contentItem['threeStarRatings'] +
                contentItem['fourStarRatings'] + contentItem['fiveStarRatings']);
            // console.log("contentItem['grade']",reviewCount)
            if (reviewCount > 0) {
                mainJson['mainEntity']['aggregateRating'] = Object.assign({}, TechnicalSEO.collectionaggregateRating);
                mainJson['mainEntity']['aggregateRating']['ratingValue'] = contentItem['grade'];
                mainJson['mainEntity']['aggregateRating']['reviewCount'] = reviewCount;
                if (contentItem.evaluationsInfoList && contentItem.evaluationsInfoList.length > 0) {

                    var sorted_reviews = contentItem.evaluationsInfoList.sort((a, b) => {
                        return new Date(a.commentDate).getTime() -
                            new Date(b.commentDate).getTime()
                    }).reverse();
                    let review = null;
                    mainJson['mainEntity']['review'] = [];
                    let info = {};
                    for (let index in sorted_reviews) {
                        if (index < 5) {
                            review = Object.assign({}, TechnicalSEO.sellerReview);
                            info = sorted_reviews[index];
                            review['author'] = info['lastName'] + " " + info['firstName'];
                            review['name'] = review['name'] + info['lastName'] + " " + info['firstName'];
                            review['datePublished'] = info['commentDate'];
                            review['reviewBody'] = info['comment'];
                            review['reviewRating'] = Object.assign({}, TechnicalSEO.reviewRating);
                            review['reviewRating']['ratingValue'] = info['grade'];
                            mainJson['mainEntity']['review'].push(review);
                        }
                    }
                    /*contentItem.evaluationsInfoList.map(info=>{
                    review = Object.assign({}, TechnicalSEO.sellerReview);
                    review['author'] =info['lastName']+" "+info['firstName'];
                    review['name'] =review['name']+info['lastName']+" "+info['firstName'];
                    review['datePublished'] =info['commentDate'];
                    review['reviewBody'] =info['comment'];
                    review['reviewRating'] = Object.assign({}, TechnicalSEO.reviewRating);
                    review['reviewRating']['ratingValue'] =info['grade'];
                    mainJson['mainEntity']['review'].push(review);
                    });*/
                }
            } else {
                delete mainJson['mainEntity']['aggregateRating'];
                delete mainJson['mainEntity']['review'];
            }
            json.push(mainJson);
        }
        // console.log("Seller - vendedor PDP page JSON ="+JSON.stringify(json));
        return json;
    }

    getPageSpecificJSONS() {
        let json = [];

        if (this.props.pageName && typeof this.props.pageName === 'string') {
            switch (this.props.pageName) {
                case 'home':
                    json = this.getHomePageJSON();
                    break;
                case 'CLP':
                    json = this.getCategoryLandingPage(this.state.contentItem.contentItem);
                    break;
                case 'BLP':
                    json = this.getBrandLandingPage(this.state.contentItem.contentItem);
                    break;
                case 'PLP':
                    json = this.getProductListingPage(this.state.contentItem.contentItem);
                    break;
                case 'PDP':
                    json = this.getProductDetailPage(this.state.contentItem, this.state.breadcrumbData, this.state.offers);
                    break;
                case 'vendedor':
                    json = this.getSellerPage(this.state.contentItem.contentItem);
                    break;
            }
        }

        return json;
    }
    getPageSpecificJSONSLater() {
        let json = [];
        TechnicalSEO.TECHNICAL_SEO_PAGE_RELOAD = "false";
        if (this.props.pageName && typeof this.props.pageName === 'string') {
            switch (this.props.pageName) {
                case 'home':
                    json = this.getHomePageJSON();
                    break;
                case 'CLP':
                    json = this.getCategoryLandingPage(this.props.contentItem.contentItem);
                    break;
                case 'BLP':
                    json = this.getBrandLandingPage(this.props.contentItem.contentItem);
                    break;
                case 'PLP':
                    json = this.getProductListingPage(this.props.contentItem.contentItem);
                    break;
                case 'PDP':
                    json = this.getProductDetailPage(this.props.contentItem, this.props.breadcrumbData, this.props.offers);
                    break;
                case 'vendedor':
                    json = this.getSellerPage(this.props.contentItem);
                    break;
            }
        }


        return json;
    }
    getResourceOptimization() {
        let urls = [];
        const staticKeyData = this.props.staticKeyData ? this.props.staticKeyData : this.state.staticKeyData;
        if (staticKeyData && typeof staticKeyData !== 'undefined') {
            const sData = staticKeyData.staticLabelValues ? staticKeyData.staticLabelValues : staticKeyData;
            if (sData && sData.length > 0) {
                sData.map(staticLabel => {
                    if (staticLabel.pageName && typeof staticLabel.pageName !== 'undefined' && staticLabel.pageName === TechnicalSEO.PWA_TECH_SEO_EVERY_PAGE) {
                        const data = staticLabel.keyValues;
                        if (data[TechnicalSEO.everyPage.resourceOpt] && typeof data[TechnicalSEO.everyPage.resourceOpt] !== 'undefined') {
                            const urlArray = data[TechnicalSEO.everyPage.resourceOpt].split("|");
                            if (urlArray && typeof urlArray !== "undefined" && typeof urlArray !== "string" && urlArray.length > 0) {
                                urlArray.map(url => {
                                    if ((!this.props.mouseFlag) && (url.indexOf("cdn.mouseflow") > -1 || url === 'cdn.mouseflow')) {
                                        // just skip
                                    } else {
                                        urls.push({ "url": url });
                                    }
                                });
                            }

                        }
                    }

                });
            }
        }
        //console.log("getResourceOptimization  "+JSON.stringify(urls));
        return urls;
    }
    getOutput(reload) {
        if (reload === 'true') {
            return this.getPageSpecificJSONSLater();
        } else {
            return this.getPageSpecificJSONS();
        }
    }
    setInState(json) {
        TechnicalSEO.TECHNICAL_SEO_PAGE_RELOAD = "true";
        this.setState({ outputJsons: json });
    }
    doNothing() {

    }

    getStaticKeyPageNamesPerLandingPage() {
        if (this.props.pageName && typeof this.props.pageName !== "undefined" && this.props.pageName === 'home') {
            return [TechnicalSEO.PWA_TECH_SEO_EVERY_PAGE, TechnicalSEO.PWA_TECH_SEO_HOME_PAGE];
        } else {
            return [TechnicalSEO.PWA_TECH_SEO_EVERY_PAGE];
        }
    }



    render() {
        const output = this.getPageSpecificJSONSLater();
        const resources = this.getResourceOptimization();
        // console.log("render technicalseo =  "+JSON.stringify( output));
        /* Change done for RTC 23322 call:Start */
        /* if (typeof window === "undefined") {
            return null
        } else {*/
        /* Change done for RTC 23322 call:End */
        // RTC 24215 :: Duplicated HTML tag in document remove html tag 
        return (
            <Head>
                {
                    TechnicalSEO.TECHNICAL_SEO_PAGE_RELOAD === 'true' ?

                        Object.keys(this.state.outputJsons).map((cur, index) => (
                            <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(this.state.outputJsons[cur]) }} />
                        ))
                        :
                        Object.keys(output).map((cur, index) => (
                            <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(output[cur]) }} />
                        ))
                }
                {
                    resources.map((cur, index) => (
                        <link key={index} crossorigin="" href={cur['url']} rel="preconnect" />
                    ))
                }

            </Head>
        )
        // }  /* Change done for RTC 23322 call */
    }
}
