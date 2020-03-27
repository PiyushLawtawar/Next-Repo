import React from 'react';
/* include ../../organism/Carousel/organism-carousel.pug
 include ../../molecules/Breadcrumb/molecule-breadcrumb
 include ../../organism/OfferListProduct/organism-offerListProduct
 include ../../organism/OfferListTable/organism-offerListTable
 include ../../molecules/modals/molecule-edd-modal.pug*/


import OfferListProduct from '../../organisms/OfferListProduct/OfferListProduct'
import OfferListTable from '../../organisms/OfferListTable/OfferListTable'
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alert from '../../molecules/Alert/Alert';
import Carousel from '../../organisms/Carousel/Carousel';
import isEmpty from 'lodash/isEmpty';

import Router from 'next/router';

export default class extends React.Component {
    constructor(props) {
        super(props)
        let selectedSkuId = (props.mainContent && props.mainContent.selectedSkuId) ? props.mainContent.selectedSkuId : '';
        let selectedObject = props.mainContent.productVarientsInfo.skuAttributeMap[selectedSkuId];
        if (!selectedObject) {
            selectedObject = Object.values(props.mainContent.productVarientsInfo.skuAttributeMap)[0];
        }
        let index = 0;
        for (let k in props.mainContent.productVarientsInfo.skuAttributeMap) {
            if (k !== selectedSkuId) {
                index = index + 1;
            } else {
                break;
            }

        }
        this.state = {
            activeSizeIndex: index,
            activeColorIndex: index,
            carouselData: {},
            productSizeId: (props.mainContent && props.mainContent.selectedSkuId) ? props.mainContent.selectedSkuId : {},
            productId: (props.mainContent && props.mainContent.productId) ? props.mainContent.productId : {},
            colorAvaliability: selectedObject.color ? true : false,
            sizeAvaliability: selectedObject.size ? true : false,
            colorName: selectedObject.color ? selectedObject.color : '',
            sizeName: selectedObject.size ? selectedObject.size : '',
            alloffers: [],
            storeNumber: '',
            selectedStoreStateId: '',
            postalZipCode: '', 
            selectedAddressInfo: {},
            productType: checkForProductType(props),
        }
        this.getActiveSize = this.getActiveSize.bind(this)
        this.getVariantsByColor = this.getVariantsByColor.bind(this)
        this.addToCart = this.addToCart.bind(this)

    }
    componentWillReceiveProps(newProps, state) {
        if (this.props.carouselsData !== newProps.carouselsData) {
            this.setState({ carouselData: newProps.carouselsData })
        }
    }

    getActiveSize(skewId, index = 0, size = this.state.sizeName) {
        if (skewId !== 'NONELIGIBLESIZE') {
            Utility(Path.offers + skewId, 'GET', {
                "channel": "WEB",
                "brandName": "LP"
            }).then(response => {
                this.setState({
                    alloffers: response.data,
                    productSizeId: skewId,
                    activeSizeIndex: index,
                    sizeName: size,
                })
            });
        }
    }

    addToCart(item) {
        var payload = {
            "productId": this.state.productId,
            "sellerId": item.sellerId,
            "sellerSkuId": item.sellerSkuId,
            "sellerName": item.sellerName,
            "sellerOperatorId": item.sellerOperatorId,
            "offerId": item.offerId,
            "catalogRefIds": this.state.productSizeId,
            "productType": this.state.productType,
            "quantity": "1"
        };

        const storeNumber = this.state.storeNumber || '';
        const selectedStoreStateId = this.state.selectedStoreStateId || '';
        const postalZipCode = this.state.postalZipCode || '';
        const selectedAddressInfo = this.state.selectedAddressInfo || {};

        if (!isEmpty(postalZipCode)) {
            payload.zipCode = postalZipCode;
            payload.eddZipCode = postalZipCode;
            payload.deliveryMethod = 'home';
        }
        if (!isEmpty(storeNumber)) {
            payload.deliveryMethod = 'store';
            payload.storeNumber = storeNumber;
            payload.stateId = selectedStoreStateId;
        }
        if (!isEmpty(selectedAddressInfo)) {
            payload.deliveryMethod = 'home';
            payload.zipCode = (selectedAddressInfo && selectedAddressInfo['postalCode'] || '');
            payload.eddZipCode = (selectedAddressInfo && selectedAddressInfo['postalCode'] || '');
            payload.addressId = (selectedAddressInfo && selectedAddressInfo['addressId'] || '');
        }

        Utility(Path.addpdpitemtocart, 'POST', payload).then(response => {
            if (response && response.data && response.data.s === '0') {
                this.show_alert('Agregaste un producto a tu bolsa', "success")
                window.scrollTo(0, 0);
                //if (response.data.cartCount) {
                    response.data["fromOfferListingPage"] = true;
                    this.props.updateCartHeaderDetails(response.data);
                //}
            } else if (response && response.data && response.data.s === '1') {
                this.show_alert(response.data[0].err)
                window.scrollTo(0, 0);
            }
        });

    }

    set_store_number = (storeNumber, selectedStoreStateId) => {
        this.setState({ storeNumber, selectedStoreStateId, postalZipCode: '', selectedAddressInfo: {} });
    }

    set_postal_zip_code = (postalZipCode) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode, selectedAddressInfo: {} })
    }

    setSelectedAddressInfo = (selectedAddressInfo) => {
        this.setState({ storeNumber: '', selectedStoreStateId: '', postalZipCode: '', selectedAddressInfo })
    }

    last(array, n) {
        let temp;
        if (array == null) {
            return void 0;
        }
        if (n == null) {
            temp = array[array.length - 1];
            if (!temp) {
                return void 0;
            }
            return temp.categoryId;
        }
    }
    getVariantsByColor(variantType, variantValue, productId, index = 0, skewId) {
        skewId !== undefined ? this.getActiveSize(skewId) : '';
        let query = "?variantType=" + variantType + "&variantValue=" + variantValue + "&productId=" + productId;
        if (typeof skewId !== 'undefined') {
            Utility(Path.getVariants + query, 'GET').then(response => {
                this.setState({
                    activeColorIndex: index,
                    colorName: variantValue,
                    materialData: response.data.variantsData && response.data.variantsData.colorMap && response.data.variantsData.colorMap.material ? materialBySize(response.data.variantsData.colorMap.material) : {},
                    sizedata: response.data.variantsData && response.data.variantsData.colorMap && response.data.variantsData.colorMap.size ? get_FinalSortedSize(response.data.variantsData.colorMap.size) : {}
                })
            });
        }
    }
    redirectToSeller = (sellerId) => {
        Router.push("/tienda/vendedor/" + sellerId, "/tienda/vendedor/" + sellerId)
    }
    getPdpDynamicContent = () => {
        const productId = this.state.productId;
        const { productSizeId, productType } = this.state;
        Utility(Path.getPdpDynamicContent, 'POST', {
            "productId": productId,
            "skuList": productSizeId,
            "skuId": productSizeId,
            "pType": productType
        }).then(response => {
            this.setState({
                breadcrumbData: response.data
            }, () => {
                const breadCrumbData = this.state.breadcrumbData
                const categoryId = this.last(breadCrumbData && breadCrumbData.breadCrumbs)
                const auth = this.state.breadcrumbData && this.state.breadcrumbData.authToken;
                window.authToken = auth;
                let guest = '';
                let LoggedInSession = this.props.loginDetails && this.props.loginDetails.LoggedInSession || "";
                if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
                    LoggedInSession = false;
                }
                if (!LoggedInSession) {
                    guest = "&isguest=true";
                } else {
                    guest = "&isguest=false";
                }
                Utility(Path.getCarousels + '?page=OLP&categoryId=' + categoryId + guest, 'GET').then(response => {
                    this.setState({
                        carouselsData: response.data
                    });
                });
            })
        });
    }
    componentDidMount() {
        this.getActiveSize(this.state.productSizeId)
        this.state.colorAvaliability ? this.getVariantsByColor('color', this.state.colorName, this.state.productId) : this.getVariantsByColor('size', this.state.sizeName, this.state.productSizeId)
        this.getPdpDynamicContent();
    }
    eddData = (edd) => {
        this.setState({
            Edd: edd
        })
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert") => {

        this.setState({ alert_status: true, alert_message, alert_Type });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }
    render() {
        const skuAttributeMap = this.props.mainContent.productVarientsInfo && this.props.mainContent.productVarientsInfo.skuAttributeMap ? this.props.mainContent.productVarientsInfo.skuAttributeMap : {}
        const endecaProductRecord = this.props.mainContent.endecaProductInfo ? this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {};

        return (
            <main className="t-offerList">
                <Alert {...this.props} alertTopClass={this.state.alert_Type == "success" ? "m-alert__container mdc-snackbar -success" : "m-alert__container mdc-snackbar -alert"} iconType="close" text={this.state.alert_message} alert_status={this.state.alert_status} dismiss_alert={this.dismiss_alert} />

                <div className="container">
                    <div className="row">
                        <div className="col">
                            <OfferListProduct
                                skuAttributeMap={skuAttributeMap}
                                getActiveSize={this.getActiveSize}
                                endecaProductRecord={endecaProductRecord}
                                activeSizeIndex={this.state.activeSizeIndex}
                                activeColorIndex={this.state.activeColorIndex}
                                productDetails={this.props.mainContent}
                                productSizeId={this.state.productSizeId}
                                productId={this.state.productId}
                                set_postal_zip_code={this.set_postal_zip_code}
                                colorAvaliability={this.state.colorAvaliability}
                                colorName={this.state.colorName}
                                sizedata={this.state.sizedata}
                                materialData={this.state.materialData}
                                getVariantsByColor={this.getVariantsByColor}
                                sizeName={this.state.sizeName}
                                productType={this.state.productType}
                                eddData={this.eddData}
                                setSelectedAddressInfo={this.setSelectedAddressInfo}
                                selectedAddressInfo={this.selectedAddressInfo}
                                set_store_number={this.set_store_number}
                                pdpOfferList={true}
                            />
                            <OfferListTable
                                alloffers={this.state.alloffers}
                                colorName={this.state.colorName}
                                sizeName={this.state.sizeName}
                                colorAvaliability={this.state.colorAvaliability}
                                sizeAvaliability={this.state.sizeAvaliability}
                                addToCart={this.addToCart}
                                redirectToSeller={this.redirectToSeller}
                                edd={this.state.Edd}
                                selectedAddressInfo={this.state.selectedAddressInfo}
                                storeNumber={this.state.storeNumber}
                                postalZipCode={this.state.postalZipCode}

                            />
                        </div>
                    </div>
                </div>
                <section className="o-carousel-section">
                    <div className="container-fluid o-carousel-container">
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-12">
                                    <Carousel carouselsData={this.state.carouselsData} chanelBrandCss={this.state.chanelBrandCss} loginDetails={this.props.loginDetails} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="o-carousel-section">
                    <div className="container-fluid o-carousel-container">
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-12">
                                    <Carousel carouselsData={this.state.carouselsData} PdpSecond={true} chanelBrandCss={this.state.chanelBrandCss} loginDetails={this.props.loginDetails} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        )

    }
}
const get_FinalSortedSize = (sizeList) => {
    var finalSortedSize = [];
    Object.keys(sizeList).forEach(key => {
        let size = sizeList[key];
        finalSortedSize.push({
            size: key,
            disable: (size.split('|'))[0] === 'FALSE' ? true : false,
            sizeid: (size.split('|'))[1]
        })
    });
    return finalSortedSize;
}

const materialBySize = (materialList) => {
    var matched_sizes = [];
    for (var materialName in materialList) {
        var m_value = materialList[materialName];
        var sku_id = m_value.split('|')[1]
        matched_sizes.push({ name: materialName, value: sku_id })
    }
    return matched_sizes;
}
const checkForProductType = (props = {}) => {
    return (props.mainContent && props.mainContent.endecaProductInfo &&
        props.mainContent.endecaProductInfo.contents && props.mainContent.endecaProductInfo.contents[0] &&
        props.mainContent.endecaProductInfo.contents[0].mainContent && props.mainContent.endecaProductInfo.contents[0].mainContent[0] &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record && props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.productType &&
        props.mainContent.endecaProductInfo.contents[0].mainContent[0].record.productType[0]) || ""
}
