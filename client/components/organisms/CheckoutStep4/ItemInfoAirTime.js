import Label from '../../atoms/Label/Label';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import HrTag from '../../atoms/HrTag/HrTag';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Image from '../../atoms/Tagimage/Image';
import { GetWithDecimal } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Sup from "../../atoms/Sup/Sup";


export default class extends React.Component {
    componentDidMount() {    
    }
    render() {
        const { itemData, quantity,  packedList, staticLabels } = this.props;
        const totalPrice = packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].total.toString();
        const paymentMethodForMessage = this.props && this.props.orderSuccessTotal && this.props.orderSuccessTotal.payemntMethod;
        return (
            <React.Fragment>
                <HrTag hrClass="a-productList__separator" />
                <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                        <Image showLoader className="a-box__image" src={packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].imageURL ? packedList[0].CommerceItems[0].imageURL : Path.onImgError} alt="Product" />
                    </div>
                    <div className="col-8 col-lg-4">
                        <Label className="a-box__resume -resumeTitle d-block mb-lg-1">{packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].displayName}</Label>
                        {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].salePrice === '0.01' &&
                            <div className="m-flag">
                                <div className="m-flag-item -defaultFlag"><span>Regalo</span>
                                </div>
                            </div>
                        }
                        <Label className="a-box__productQuantity ">Código de producto: {packedList.sellerSkuId !== undefined ? packedList.sellerSkuId : packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].sku}{}</Label>
                        <Label className="a-box__productQuantity mb-lg-3">Teléfono: {packedList.sellerSkuId !== undefined ? packedList.sellerSkuId : packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].airtimePhone}{}</Label>
                        {(packedList.purchaseType && packedList.ProductType) && <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].ProductType}</Label>}
                        {packedList.clothingColor ? <Label className="a-box__productQuantity">{staticLabels['pwa.orderSuccessPage.color.label']}: {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].clothingColor}</Label> : ''}
                        {packedList.clothingSize ? <Label className="a-box__productQuantity">{staticLabels['pwa.orderSuccessPage.size.label']}: {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].clothingSize}</Label> : ''}
                        {packedList.dimensions ? <Label className="a-box__productQuantity">{staticLabels['pwa.orderSuccessPage.dimensions.label']}: {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].dimensions}</Label> : ''}
                        {packedList.material ? <Label className="a-box__productQuantity">{staticLabels['pwa.orderSuccessPage.material.label']}: {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].material}</Label> : ''}
                        {packedList.texture ? <Label className="a-box__productQuantity">{staticLabels['pwa.orderSuccessPage.texture.label']}: {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].texture}</Label> : ''}
                        {packedList.sellerName ? <Label className="a-box__productQuantity">{'Vendido por'}: {packedList.sellerName}</Label> : ''}


                        {packedList.isBundle && packedList.bundleList && packedList.bundleList.length ? <Label className="a-box__productQuantity">Contenido:</Label> : null}

                        {packedList.isBundle && packedList.bundleList && packedList.bundleList.length ? packedList.bundleList.map((item, index) =>
                            <React.Fragment key={index} >
                                <Label className="a-box__resume -resumeTitle mb-lg-1">{item.displayName}</Label>
                                <Label className="a-box__productQuantity ">Código de producto: {item.bundleSkuId}</Label>
                            </React.Fragment>
                        ) : null}

                        {(packedList.fulFillmentStatus === "0" && packedList.fulfillData && packedList.fulfillData.productKey) &&
                            <React.Fragment>
                                <Label className="a-box__downloadDigital pt-2">Código de descarga:</Label>
                                <LabelAnchor labelClass="a-box__downloadDigital pb-2" labelText={packedList.fulfillData.productKey} anchorClass="a-box__moreInfo pl-lg-2 pl-0" anchorLink="" anchorText="Más información" />
                            </React.Fragment>
                        }
                       
                        {packedList.cieWarningMessage &&
                            <React.Fragment>
                                <LabelAnchor labelClass="a-box__productQuantity" labelText={packedList.cieWarningMessage}></LabelAnchor>
                            </React.Fragment>
                        }
                    </div>

                    <div className="col-4 col-lg-2 offset-4 offset-lg-0">
                        {packedList.listPrice !== packedList.salePrice ?
                            <Label className="a-box__linePrice">${GetWithDecimal(packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].listPrice, '2').val}
                                <Sup>{GetWithDecimal(packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].listPrice, '2').decimal}</Sup>
                            </Label>                 
                            : ''}
                        <div>
                            <Label className="a-box__normalPrice">${GetWithDecimal(packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].salePrice, '2').val}
                                <Sup>{GetWithDecimal(packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].salePrice, '2').decimal}</Sup>
                            </Label>
                        </div>
                    </div>



                    <div className="col-8 col-lg-2 offset-4 offset-lg-0">
                        {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].promoDescription &&
                            <span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].promoDescription}</span>
                        }
                        {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].discountAmount &&
                            <span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{staticLabels['pwa.orderConfirmationPage.Descuento.text']}:{' '}
                                <LabelSpanSpan
                                    labelClass="d-lg-block"
                                    labelText={` $ ${GetWithDecimal(packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].discountAmount, '2').val}`}
                                    supText={`  ${GetWithDecimal(packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].discountAmount, '2').decimal}`}
                                />
                            </span>
                        }
                        <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text={packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].quantity} />
                    </div>               
                    <div className="col-2">
                        <LabelSup labelClass="a-box__totalPrice d-none d-lg-block"
                            labelText={` $ ${GetWithDecimal(totalPrice, '2').val}`}
                            supText={`  ${GetWithDecimal(totalPrice, '2').decimal}`}
                        />
                    </div>
                </div>
                {
                    (this.props.itemData.shoppingType && this.props.itemData.shoppingType.trim().toLowerCase() === "Gift Registry".trim().toLowerCase()) &&
                    <React.Fragment>
                        <HrTag hrClass="a-productList__separator" />
                        <div className="row align-items-center justify-content-between">
                            <div className="col-12">
                                <label className="a-box__resume d-block">{staticLabels['pwa.orderConfirmationPage.giftregistrymsg.label']}:{packedList.giftMessage}</label>
                            </div>
                        </div>

                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}