/**
* Module Name : ItemBlock
* Functionality : Showing item details template
* @exports : ItemBlock
* @requires : module:React
* @requires : module:/atoms/Label/Label
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* @requires : module:/atoms/HrTag/HrTag
* @requires : module:/atoms/Link/Link
* @requires : module:lodash/isEmpty
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/ItemInfo
* Team : Checkout Team
* 
*/

import Label from '../../atoms/Label/Label';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import HrTag from '../../atoms/HrTag/HrTag';
import Link from '../../atoms/Link/Link';
import isEmpty from 'lodash/isEmpty';
import Icons from '../../atoms/Icons/Icons';
import Image from '../../atoms/Tagimage/Image';
import ItemInfo from './ItemInfo';

/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showInfo: false,
            showSeperator:true
        }
    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps 
     * 
     */
    componentWillReceiveProps() {
        this.checkForData();
    }

    /**
     * Method will call to set seperator status
     * @function checkForData
     * @author shreyansh.khare@zensar.com
     * @desc Updating seperator state value.
     * @param {object}
     * 
     */
    checkForData = () => {
        const dataCheck = document.querySelector('#itemInfoBlock');
        if (dataCheck.children.length === 0) {
            this.setState({
                showSeperator: false
            })
        }
        
    }

  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */

    render() {
        const { itemData, orderSuccessTotal, facturaDetails, deleveryAddressDetail, staticLabels } = this.props;
        let tempData = itemData.deliveryInfo;
        // const packedList = itemData.deliveryInfo[0] ? itemData.deliveryInfo[0].packedList : itemData.deliveryInfo.packedList;
        // const packedListForPreorder = itemData.deliveryInfo[1] ? itemData.deliveryInfo[1].packedList : itemData.deliveryInfo.packedList;
        let packedList = [];
        let estimatedDeliveryDateMsgResult = ''
        for (let i = 0; i < tempData.length; i++) {
            packedList = tempData[i] ? tempData[i].packedList : tempData.packedList;
            if (packedList && packedList[0] && packedList[0].bundleList && packedList[0].bundleList[0] && packedList[0].bundleList[0]) {
                let estimatedDeliveryDateMsg = packedList[0] && packedList[0].bundleList;
                let result = estimatedDeliveryDateMsg.filter(word => word.estimatedDeliveryDate === 'La fecha estimada de entrega no aplica para paquetes.');
                estimatedDeliveryDateMsgResult = 'La fecha estimada de entrega no aplica para paquetes.';
            }
        }

        if (tempData && tempData.packedList) {
            for (var i = 0; i < tempData.packedList.length; i++) {
                packedList.push(tempData && tempData.packedList[i] ? tempData.packedList[i] : tempData.packedList);

            }
        }
        // console.log('packedList++++',itemData && itemData.deliveryInfo && itemData.deliveryInfo && itemData.deliveryInfo[0].packageApplied);
        const totalPrice = (packedList.salePrice - packedList.discountAmount).toString();
        //presale item or backsale item do not show EDD
        const preOrderOrBackOrder = (packedList[0] && !isEmpty(packedList[0].PRE_BACK_ORDER_MESSAGE)) && typeof packedList[0].PRE_BACK_ORDER_MESSAGE !== 'undefined' ? true : false;
        const presaleFlag = packedList[0] && packedList[0].productFlags && packedList[0].productFlags[0].length > 0 && packedList[0].productFlags[0] === 'presale' && packedList[0].productFlags[0] !== 'undefined' ? true : false;
        const packageApplied = (itemData && itemData.deliveryInfo && itemData.deliveryInfo.packageApplied === false) || (itemData && itemData.deliveryInfo && itemData.deliveryInfo && itemData.deliveryInfo[0].packageApplied === false);
        const deliveryDate = estimatedDeliveryDateMsgResult !== '' ? estimatedDeliveryDateMsgResult : packedList[0] && packedList[0].estimatedDeliveryDate || packedList[0].packageDeliveryDate || '';
        // console.log('deliveryDate',deliveryDate,itemData.deliveryInfo)
        const EddErrorMessage = packedList[0] && packedList[0].EddErrorMessage ? true : false;
        const paymentMethodForMessage = this.props && this.props.orderSuccessTotal && this.props.orderSuccessTotal.payemntMethod;
        const checkOptions = (paymentMethodForMessage === 'Efectivo') || (paymentMethodForMessage === 'Transferencia') ? true : false;
        const checkCIE = paymentMethodForMessage === 'CIEBancomer' ? true : false;
        const span2class = deliveryDate && deliveryDate.toLowerCase().trim() === 'Pronto tendremos la fecha de entrega de este producto'.toLowerCase().trim() ? '-pendingDelivery' : '-digital';
        const label = staticLabels && staticLabels['pwa.checkoutBagPage.LatePayment.text'] ? staticLabels['pwa.checkoutBagPage.LatePayment.text'] : '';
        const efectivoLevel = staticLabels && staticLabels['pwa.confirmEmailPage.eddCheck.text'] ? staticLabels['pwa.confirmEmailPage.eddCheck.text'] : '';
        //  console.log('check props for MKP', this.props && this.props.itemData && this.props.itemData.deliveryInfo && this.props.itemData.deliveryInfo[0] && this.props.itemData.deliveryInfo[0].packedList && this.props.itemData.deliveryInfo[0].packedList[0] && this.props.itemData.deliveryInfo[0].packedList[0].sellerId);
        const checkMKP = this.props && this.props.itemData && this.props.itemData.deliveryInfo && this.props.itemData.deliveryInfo[0] && this.props.itemData.deliveryInfo[0].packedList && this.props.itemData.deliveryInfo[0].packedList[0] && this.props.itemData.deliveryInfo[0].packedList[0].sellerId || '';
        let mkpFlag = false;
        if (checkMKP && checkMKP !== '') {
            mkpFlag = true;
        }
        return (

            <div className="row mb-3">

                <div className="col-12">
                    {itemData.eventNbr && <LabelSpanSpan labelClass="a-box__resume d-block" span2Class='a-box__resume' span2Text='Mesa de Regalos' />}

                    <div className="m-box -noBottomBorders">
                        <div className="row align-items-center justify-content-between">
                            <div id="itemInfoBlock" className="col-12 col-lg-auto">

                                {orderSuccessTotal.nightOrderReferenceNumber && <Label className="a-box__resume d-block">{(staticLabels && staticLabels['pwa.orderSuccessPage.cieReferenceNumber.text'] ? staticLabels['pwa.orderSuccessPage.cieReferenceNumber.text'] : '') + ': ' + orderSuccessTotal.nightOrderReferenceNumber}</Label>}

                                {!itemData.DigitalReference && (!itemData.packageId && !itemData.isPackageApplied) ? itemData.trackingNumber && <Label className="a-box__resume d-block">{(staticLabels && staticLabels['pwa.OrderHistoryPage.orderNum.lable'] ? staticLabels['pwa.OrderHistoryPage.orderNum.lable'] : '') + itemData.trackingNumber}</Label> : itemData.packageId && itemData.isPackageApplied ? itemData.packageId && <Label className="a-box__resume d-block">{(staticLabels && staticLabels['pwa.OrderHistoryPage.orderNum.lable'] ? staticLabels['pwa.OrderHistoryPage.orderNum.lable'] : '') + itemData.packageId}</Label> : null}

                                {itemData.DigitalReference && <Label className="a-box__resume d-block">{(staticLabels && staticLabels['pwa.orderSuccessPage.digitalReference.label'] ? staticLabels['pwa.orderSuccessPage.digitalReference.label'] : '') + ': ' + itemData.DigitalReference}</Label>}

                                {packedList && packedList[0] && packedList[0].puchaseMode && <Label className="a-box__resume -digital d-block">{packedList[0].puchaseMode}</Label>}

                                {checkOptions && deliveryDate && !presaleFlag && !preOrderOrBackOrder && <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class={span2class} span2Text={checkOptions ? deliveryDate + ' | ' + label : deliveryDate} />}

                                {checkCIE && deliveryDate && !presaleFlag && !preOrderOrBackOrder && <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class={span2class} span2Text={checkCIE ? deliveryDate + ' | ' + efectivoLevel : deliveryDate} />}

                                {!checkCIE && !checkOptions && deliveryDate && !presaleFlag && !preOrderOrBackOrder && <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class={span2class} span2Text={deliveryDate} />}

                                {presaleFlag && <LabelSpanSpan labelClass="a-box__resume d-block" span2Class={span2class} span2Text='El envío se realizará cuando el artículo este disponible' />}

                                {EddErrorMessage && !presaleFlag && !deliveryDate && <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class={span2class} span2Text={packedList[0].EddErrorMessage ? packedList[0].EddErrorMessage : ''} />}


                                {(itemData.eventNbr && itemData.ownerName) &&
                                    <ParagraphSpanX3
                                        classParagraph=""
                                        span1Class="a-box__resume"
                                        span1Text={staticLabels['pwa.orderConfirmationPage.giftregistryevent.label'] + itemData.eventNbr}
                                        span2Class="a-box__resume pl-3 pr-3 d-lg-inline-block d-none"
                                        span2Text="|"
                                        span3Class="a-box__resume d-block d-lg-inline-block"
                                        span3Text={"Nombre del festejado: " + itemData.ownerName}
                                    />
                                }
                            </div>
                            <div className="col-12 col-lg-auto">
                                {this.state && this.state.showSeperator && <HrTag id="seperator" hrClass="d-lg-none d-block" />}
                                <div className="row align-items-cente">
                                    {(itemData.CodigoFacturacion && facturaDetails.facturaEnable && facturaDetails.facturaEnable.toLowerCase().trim() === "true") &&
                                        <React.Fragment>
                                            <div className="col col-lg-auto">
                                                <Label className="a-box__productTitle d-inline-block">{staticLabels['pwa.orderConfirmationPage.BillingCode.label'] + ' ' + itemData.CodigoFacturacion}</Label>
                                            </div>
                                            <div className="col col-lg-auto text-right">
                                                <Link href={facturaDetails.ElectronicInvoiceLink ? facturaDetails.ElectronicInvoiceLink : null} className="a-box__invoice pr-3">Factura ahora</Link>
                                                <Icons className="icon-arrow_right -small" />
                                            </div>
                                        </React.Fragment>
                                    }{
                                        (mkpFlag && facturaDetails && facturaDetails.miraklInvoiceUrl) &&
                                        <React.Fragment>
                                            <div className="col-6 col-lg-auto text-right">
                                                <Link href={facturaDetails.miraklInvoiceUrl ? facturaDetails.miraklInvoiceUrl : null} className="a-box__invoice pr-3">Factura ahora</Link>
                                                <Icons className="icon-arrow_right -small" />
                                            </div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>

                        {this.state && this.state.showSeperator &&
                        <HrTag id="seperator" hrClass="a-productList__separator  d-none d-lg-block" />                       
                        }

                        <div className="row align-items-center justify-content-between d-none d-lg-flex">
                            <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                            <div className="col-3"><Label className="a-box__detailTitle">{staticLabels && staticLabels['pwa.orderConfirmationPage.Numbre.text'] ? staticLabels['pwa.orderConfirmationPage.Numbre.text'] : ''}</Label></div>
                            <div className="col-1"><Label className="a-box__detailTitle">{staticLabels && staticLabels['pwa.orderConfirmationPage.Precio.text'] ? staticLabels['pwa.orderConfirmationPage.Precio.text'] : ''}</Label></div>
                            <div className="col-1"><Label className="a-box__detailTitle">{staticLabels && staticLabels['pwa.orderConfirmationPage.Cantidad.text'] ? staticLabels['pwa.orderConfirmationPage.Cantidad.text'] : ''}</Label></div>
                            <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                            <div className="col-1"> {!checkCIE && !checkOptions && <Label className="a-box__detailTitle">{staticLabels && staticLabels['pwa.orderConfirmationPage.Descuento.text'] ? staticLabels['pwa.orderConfirmationPage.Descuento.text'] : ''}</Label>}</div>
                            <div className="col-1"><Label className="a-box__detailTitle">{staticLabels && staticLabels['pwa.orderConfirmationPage.Total.text'] ? staticLabels['pwa.orderConfirmationPage.Total.text'] : ''}</Label></div>
                        </div>
                        {packedList && packedList.length ? packedList.map((item, index) => (
                            <React.Fragment>
                                {index > 0 && <HrTag hrClass="a-productList__separator d-lg-block" />}
                                <ItemInfo
                                    key={index}
                                    purchaseDate={this.props.purchaseDate}
                                    clickAndCollect={this.props.clickAndCollect}
                                    setClickAndCollect={this.props.setClickAndCollect}
                                    skus={this.props.skus}
                                    deleveryAddressDetail={deleveryAddressDetail}
                                    setSkus={this.props.setSkus}
                                    packedList={item}
                                    itemData={itemData}
                                    staticLabels={staticLabels}
                                    orderSuccessTotal={orderSuccessTotal}
                                />
                            </React.Fragment>
                        )
                        ) : null}
                        {(this.props.itemData.shoppingType && this.props.itemData.shoppingType.trim().toLowerCase() === "Gift Registry".trim().toLowerCase()) && packedList && packedList[0].giftMessage && packedList[0].giftMessage !== '' && <React.Fragment>
                            <HrTag hrClass="a-productList__separator" />
                            <div className="row align-items-center justify-content-between">
                                <div className="col-12">
                                    <label className="a-box__resume d-block">{(staticLabels && staticLabels['pwa.orderConfirmationPage.giftregistrymsg.label'] ? staticLabels['pwa.orderConfirmationPage.giftregistrymsg.label'] : '')}:{packedList[0].giftMessage}</label>
                                </div>
                            </div>

                        </React.Fragment>}
                    </div>
                    {/*{packedListForPreorder && packedListForPreorder.length ?
                         <div className="m-box -noBottomBorders">
                        <div className="row align-items-center justify-content-between">
                            {packedListForPreorder && packedListForPreorder.length ? packedListForPreorder.map((item, index) => <ItemInfo key={index} purchaseDate={this.props.purchaseDate} clickAndCollect={this.props.clickAndCollect} setClickAndCollect={this.props.setClickAndCollect} skus={this.props.skus} deleveryAddressDetail={deleveryAddressDetail} setSkus={this.props.setSkus} packedList={item} itemData={itemData} staticLabels={staticLabels} orderSuccessTotal={orderSuccessTotal}/>) : null}

                              </div>
                              </div>
     :null}*/}
                    <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                        <div className="row align-items-center justify-content-between d-flex d-lg-none">
                            <HrTag hrClass="w-100 mb-3" />
                            <div onClick={() => this.setState({ showInfo: !this.state.showInfo })} className="col-12">
                                <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" spanText="Más información" iconClass={"icon-arrow_down" + (this.state.showInfo ? ' rotate-180' : '')} />
                            </div>
                        </div>
                        <div className={"row align-items-center justify-content-between d-lg-flex moreInfoWrap pt-3 pt-lg-0" + (this.state.showInfo ? '' : ' d-none')}>
                            {itemData.lpChargeNbr && <div className="col-lg-auto col-6">
                                <LabelSpan labelClass="a-box__resumeDetail" labelText={(staticLabels && staticLabels['pwa.orderConfirmationPage.NodeBoleta.label'] ? staticLabels['pwa.orderConfirmationPage.NodeBoleta.label'] : '') + ': '} spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={itemData.lpChargeNbr} />
                            </div>}
                            {itemData.terminal && <div className="col-lg-auto col-6">
                                <LabelSpan labelClass="a-box__resumeDetail" labelText={(staticLabels && staticLabels['pwa.orderConfirmationPage.NoDeTerminal.label'] ? staticLabels['pwa.orderConfirmationPage.NoDeTerminal.label'] : '') + ': '} spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={itemData.terminal} />
                            </div>}
                            {itemData.tienda && <div className="col-lg-auto col-6">
                                <LabelSpan labelClass="a-box__resumeDetail" labelText={(staticLabels && staticLabels['pwa.orderConfirmationPage.Tienda.label'] ? staticLabels['pwa.orderConfirmationPage.Tienda.label'] : '') + ': '} spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={itemData.tienda} />
                            </div>}
                            {itemData.folioPago && <div className="col-lg-auto col-6">
                                <LabelSpan labelClass="a-box__resumeDetail" labelText={(staticLabels && staticLabels['pwa.orderConfirmationPage.foliopago.label'] ? staticLabels['pwa.orderConfirmationPage.foliopago.label'] : '') + ': '} spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={itemData.folioPago} />
                            </div>}
                            {itemData.folioPayPal && <div className="col-lg-auto col-6">
                                <LabelSpan labelClass="a-box__resumeDetail" labelText={(staticLabels && staticLabels['pwa.orderConfirmationPage.folioPaypal.label'] ? staticLabels['pwa.orderConfirmationPage.folioPaypal.label'] : '') + ': '} spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={itemData.folioPayPal} />
                            </div>}
                            {itemData.CCAuthorization && <div className="col-lg-auto col-6">
                                <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText={itemData.CCAuthorization} />
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
