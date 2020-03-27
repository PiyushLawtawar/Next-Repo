import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { parentContext } from '../../../contexts/parentContext';
import Span from '../../atoms/Span/Span';
import ReactTooltip from 'react-tooltip';
import Icons from '../../atoms/Icons/Icons';
import Label from "../../atoms/Label/Label";
import { getPriceInFormat } from '../../../helpers/utilities/utility';
import { H2 } from "../../atoms/HeadLines/Headlines";

class orderDetailsProduct extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const productOptions = this.props.productOptions;
        const SomsproductOptions = this.props.SomsproductOptions;
        const IsSomsOrder = this.props.IsSomsOrder;
        const staticLabels = this.props.staticLabels;
        // console.log('productOptions',productOptions)

        return (
            <parentContext.Consumer>
                {({ loginDetails }) => (
                    <React.Fragment>
                        {IsSomsOrder ?
                            <React.Fragment>
                                <div className="row m-row">
                                    <div className="col-12 m-col px-0 col-lg-3">
                                        <div className="col m-col">
                                            <H2 headLineText={SomsproductOptions.DisplayName ? SomsproductOptions.DisplayName : ''} headLineClass="a-orderDetail__productTitle"></H2>
                                        </div>
                                        <div className="col m-col">
                                            {SomsproductOptions.sellerName && SomsproductOptions.sellerOperatorId ? <Paragraph className="a-orderDetail__productSku">{staticLabels && staticLabels["pwa.orderDetailsPage.skuId.lable"]}{SomsproductOptions.sellerSkuId}</Paragraph>
                                                : SomsproductOptions.skuId ? <Paragraph className="a-orderDetail__productSku">{staticLabels && staticLabels["pwa.orderDetailsPage.skuId.lable"]}{SomsproductOptions.SkuId}</Paragraph>
                                                    : ''}
                                        </div>
                                        {SomsproductOptions.gwpItem ?
                                            <div className="col m-col">
                                                <div className="giftitem">
                                                    <span className="icon"></span><span className="text"> Regalo </span> </div></div> : ''}
                                        {SomsproductOptions.sellerName ?
                                            <div className="col m-col">
                                                <Paragraph className="a-orderDetail__productMaterial">Vendido por {productOptions.sellerName}</Paragraph></div>
                                            : ''}


                                    </div>
                                    <div className="col-12 m-col px-0 col-lg-2">
                                        <div className="col m-col">
                                            {/*{productOptions.amount && <Paragraph className="a-orderDetail__productRegularPrice">{productOptions.amount}</Paragraph>}*/}
                                            {SomsproductOptions.Amount && <Paragraph className="a-orderDetail__productDiscountPrice">${getPriceInFormat(SomsproductOptions.Amount)}</Paragraph>}
                                        </div>
                                    </div>
                                    <div className="col-12 m-col px-0 col-lg-2">
                                        <div className="col m-col">
                                            <Paragraph className="a-order-DetailProductQuantityTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Cantidad.lable"]}</Paragraph>
                                            {SomsproductOptions.Quantity && <Span className="a-orderDetail__productQuantity">{SomsproductOptions.Quantity}</Span>}
                                        </div>
                                    </div>

                                    <div className="col-12 m-col px-0 col-lg-2">
                                        <div className="col m-col">
                                            {SomsproductOptions.promoDescription && <Paragraph className="a-orderDetail__productPromo">{SomsproductOptions.promoDescription}</Paragraph>}
                                        </div>
                                    </div>
                                    {SomsproductOptions.Amount && <div className="col-12 m-col px-0 col-lg-2">
                                        <div className="col m-col">
                                            <Paragraph className="a-orderDetail__productTotalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.headertotal.lable"]}</Paragraph>
                                            <Span className="a-orderDetail__productTotalValue">${getPriceInFormat(SomsproductOptions.Amount)}</Span>
                                        </div>
                                    </div>}
                                </div>
                            </React.Fragment>
                            :
                            <div className="row m-row">
                                <div className="col-12 m-col px-0 col-lg-3">
                                    <div className="col m-col">
                                        <H2 headLineText={productOptions.displayName ? productOptions.displayName : ''} headLineClass="a-orderDetail__productTitle"></H2>
                                    </div>
                                    <div className="col m-col">
                                        {productOptions.sellerName && productOptions.sellerOperatorId ? <Paragraph className="a-orderDetail__productSku">{staticLabels && staticLabels["pwa.orderDetailsPage.skuId.lable"]}{productOptions.sellerSkuId}</Paragraph>
                                            : productOptions.skuId ? <Paragraph className="a-orderDetail__productSku">{staticLabels && staticLabels["pwa.orderDetailsPage.skuId.lable"]}{productOptions.skuId}</Paragraph>
                                                : ''}
                                    </div>
                                    {loginDetails && loginDetails.LoggedInSession ?
                                        <div>
                                            {productOptions.productType === "Digital" && <div className="col m-col">
                                                <Paragraph className="a-orderDetail__productDownloadable">{staticLabels && staticLabels["pwa.orderConfirmationPage.digitalProductKey.label"]}
                                                    {/*<Icons data-tip data-for='Detalles' className="a-login--iconHelper ml-1" />
                                            <ReactTooltip id="Detalles" className="popover-body" type="light" effect="solid">
                                                <a>{staticLabels && staticLabels["pwa.orderDetailsPage.masInfo.tlo.message.text"]}</a>
                                            </ReactTooltip>*/}
                                                    <a href={staticLabels && staticLabels["pwa.orderDetailsPage.masInfo.tlo.message.text"]}>
                                                        <i className="icon-help a-progressBar__iconHelp AllTextPopover" id="helperTextPopoverTracking1"></i>
                                                    </a>
                                                    {/*<div ref={this.show}>
                                                <a>{staticLabels && staticLabels["pwa.orderDetailsPage.masInfo.tlo.message.text"]}</a>
                                            </div>*/}
                                                </Paragraph></div>
                                            }
                                            {productOptions.productType === "Digital" && <div className="col m-col">
                                                <Paragraph className="a-orderDetail__productDownloadable">{productOptions.productKey}</Paragraph></div>
                                            }
                                            {productOptions.productType === "Digital" && <div className="col m-col">
                                                <Paragraph className="a-orderDetail__productDownloadable">{productOptions.userInstruction}</Paragraph>
                                                {loginDetails && loginDetails.cartHeaderResponse && loginDetails.cartHeaderResponse.cartHeaderDetails ? <Paragraph className="a-orderDetail__productDownloadable">{loginDetails.cartHeaderResponse.cartHeaderDetails.email}</Paragraph>: '' }</div>                                                
                                            }</div> : ''}
                                    {productOptions.downloadable && <div className="col m-col">
                                        <Paragraph className="a-orderDetail__productDownloadable">{productOptions.productDownloadable}</Paragraph></div>
                                    }
                                    {productOptions.clothingSize && <div className="col m-col">
                                        <Paragraph className="a-orderDetail__productSize">{staticLabels && staticLabels["pwa.orderDetailsPage.Talla.label"]} {productOptions.clothingSize}</Paragraph></div>
                                    }
                                    {productOptions.clothingColor && <div className="col m-col">
                                        <Paragraph className="a-orderDetail__productColor">{staticLabels && staticLabels["pwa.orderDetailsPage.Color.label"]} {productOptions.clothingColor}</Paragraph></div>
                                    }
                                    {productOptions.material && <div className="col m-col">
                                        <Paragraph className="a-orderDetail__productMaterial">{staticLabels && staticLabels["pwa.orderDetailsPage.Material.label"]} {productOptions.material}</Paragraph></div>
                                    }
                                    {productOptions.itemStatus === 'Cancelado' && <div className="col m-col">
                                        <Label id="statusPayment" className="a-order__footer__statusPayment --expired normal">{productOptions.itemStatus}
                                        </Label></div>
                                    }
                                    {productOptions.gwpItem ?
                                        <div class="col m-col">
                                            <div className="giftitem">
                                                <span className="icon"></span><span className="text"> Regalo </span> </div></div> : ''}
                                    {productOptions.sellerName ?
                                        <div className="col m-col">
                                            <Paragraph className="a-orderDetail__productMaterial">Vendido por {productOptions.sellerName}</Paragraph></div>
                                        : ''}
                                    {/*{productOptions.itemStatus && <div className="col m-col">
                         <Paragraph className="a-orderDetail__productStatus">{productOptions.itemStatus}</Paragraph></div>
                    }*/}

                                </div>
                                <div className="col-12 m-col px-0 col-lg-2">
                                    <div className="col m-col">
                                        {/*{productOptions.amount && <Paragraph className="a-orderDetail__productRegularPrice">{productOptions.amount}</Paragraph>}*/}
                                        {productOptions.amount && <Paragraph className="a-orderDetail__productDiscountPrice">${getPriceInFormat(productOptions.listPrice)}</Paragraph>}
                                    </div>
                                </div>
                                <div className="col-12 m-col px-0 col-lg-2">
                                    <div className="col m-col">
                                        <Paragraph className="a-order-DetailProductQuantityTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.Cantidad.lable"]}</Paragraph>
                                        {productOptions.quantity && <Span className="a-orderDetail__productQuantity">{productOptions.quantity}</Span>}
                                    </div>
                                </div>

                                <div className="col-12 m-col px-0 col-lg-2">
                                    <div className="col m-col">
                                        {productOptions.promoDescription && <Paragraph className="a-orderDetail__productPromo">{productOptions.promoDescription}</Paragraph>}
                                    </div>
                                </div>
                                {productOptions.amount && <div className="col-12 m-col px-0 col-lg-2">
                                    <div className="col m-col">
                                        <Paragraph className="a-orderDetail__productTotalTitle">{staticLabels && staticLabels["pwa.orderDetailsPage.headertotal.lable"]}</Paragraph>
                                        <Span className="a-orderDetail__productTotalValue">${getPriceInFormat(productOptions.amount)}</Span>
                                    </div>
                                </div>}
                            </div>
                        }
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
export default orderDetailsProduct;