import Label from '../../atoms/Label/Label';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import HrTag from '../../atoms/HrTag/HrTag';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Image from '../../atoms/Tagimage/Image';
import ItemInfoAirTime from './ItemInfoAirTime';
import { GetWithDecimal } from '../../../helpers/utilities/utility';
import map from 'lodash/map';



export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showInfo: false }
    }

    render() {
        const { itemData, quantity, orderSuccessTotal, facturaDetails, deleveryAddressDetail, staticLabels } = this.props;
        const packedList = [];
        map(itemData, (item, index) => {
            packedList.push(item);
        })
        const commerceairTimeItem = this.props.commerceairTimeItem[0].shippingGroupId;
        const totalPrice = packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].total.toString();
        const deliveryDate = packedList[0].estimatedDeliveryDate || packedList.packageDeliveryDate || '';
        return (
            <React.Fragment>
                <div>
                    {
                    map(itemData, (item, index) => {
                            return <React.Fragment>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <div className="m-box -noBottomBorders">
                                            <div className="row align-items-center justify-content-end">
                                                <div className="col-12 col-lg-auto">
                                                    {/*<HrTag hrClass="d-lg-none d-block" />*/}
                                                    <div className="row align-items-cente">
                                                        {(packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].CodigoFacturacion && facturaDetails.facturaEnable && facturaDetails.facturaEnable.toLowerCase().trim() === "true") && <React.Fragment>
                                                            <div className="col-6 col-lg-auto">
                                                                <Label className="a-box__productTitle d-inline-block">
                                                                    {staticLabels['pwa.orderConfirmationPage.BillingCode.label']} {packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].CodigoFacturacion}
                                                                </Label>

                                                            </div>
                                                            <div className="col-6 col-lg-auto text-right">
                                                                <Link href={facturaDetails.ElectronicInvoiceLink ? facturaDetails.ElectronicInvoiceLink : null} className="a-box__invoice pr-3">Factura ahora</Link>
                                                                <Icons className="icon-arrow_right -small" />
                                                            </div>
                                                        </React.Fragment>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <HrTag hrClass="a-productList__separator  d-none d-lg-block" />

                                            <div className="row align-items-center justify-content-between d-none d-lg-flex">
                                                <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                                                <div className="col-4"><Label className="a-box__detailTitle">{staticLabels['pwa.orderConfirmationPage.Numbre.text']}</Label></div>
                                                <div className="col-2"><Label className="a-box__detailTitle">{staticLabels['pwa.orderConfirmationPage.Precio.text']}</Label></div>
                                                <div className="col-2"><Label className="a-box__detailTitle">Cantidad</Label></div>
                                                <div className="col-2"><Label className="a-box__detailTitle">Total</Label></div>
                                            </div>
                                            {packedList && packedList.length ? packedList.map((item) => <ItemInfoAirTime quantity={quantity} purchaseDate={this.props.purchaseDate} clickAndCollect={this.props.clickAndCollect} setClickAndCollect={this.props.setClickAndCollect} skus={this.props.skus} deleveryAddressDetail={deleveryAddressDetail} setSkus={this.props.setSkus} packedList={packedList} itemData={itemData} staticLabels={staticLabels} />) : null}

                                        </div>
                                        <div className="m-box mt-lg-2 mt-0 -noTopBorders">

                                            <div className="row align-items-center justify-content-between d-flex d-lg-none">
                                                <HrTag hrClass="w-100 mb-3" />
                                                <div onClick={() => this.setState({ showInfo: !this.state.showInfo })} className="col-12">
                                                    <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" spanText="Mas información" iconClass={"icon-arrow_down" + (this.state.showInfo ? ' rotate-180' : '')} />
                                                </div>
                                            </div>

                                            <div className={"row align-items-center justify-content-between d-lg-flex moreInfoWrap pt-3 pt-lg-0" + (this.state.showInfo ? '' : ' d-none')}>
                                                {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].lpChargeNbr && <div className="col-lg-auto col-6">
                                                    <LabelSpan labelClass="a-box__resumeDetail" labelText={staticLabels['pwa.orderConfirmationPage.NodeBoleta.label'] + ': '} spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].lpChargeNbr} />
                                                </div>}
                                                {packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].CCAuthorization && <div className="col-lg-auto col-6">
                                                    <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={packedList[0] && packedList[0].CommerceItems[0] && packedList[0].CommerceItems[0].CCAuthorization} />
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        )}
                </div>
            </React.Fragment>
        )
    }
}



















