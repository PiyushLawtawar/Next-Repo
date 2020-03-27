import Label from '../../atoms/Label/Label';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import HrTag from '../../atoms/HrTag/HrTag';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Image from '../../atoms/Tagimage/Image';
import { GetWithDecimal } from '../../../helpers/utilities/utility';
import Sup from  "../../atoms/Sup/Sup";
import Figure from '../../molecules/Figure/Figure';

export default class extends React.Component {
    componentDidMount() {
        this.getDataForSwogo();

        this.getDataForClickAndDrive();

    }
    getDataForSwogo = () => {
        let skus = this.props.skus;

        let itemData = this.props.itemData;
        let deleveryAddressDetail = this.props.deleveryAddressDetail;

        if (this.props.packedList) {
            let packedList = this.props.packedList;
            let obj = {};
            obj.title = packedList.displayName;
            obj.productType = packedList.ProductType ? packedList.ProductType : ' ';
            obj.productId = packedList.productId;
            obj.sku = packedList.sku;
            obj.imageURL = packedList.imageMap;
            obj.listPrice = packedList.listPrice ? (typeof packedList.listPrice === 'string' ? Number(packedList.listPrice) : packedList.listPrice) : 0.01;
            obj.salePrice = packedList.salePrice ? (typeof packedList.salePrice === 'string' ? Number(packedList.salePrice) : packedList.salePrice) : 0.01;
            obj.storeNumber = itemData.tienda;
            obj.promoPrice = packedList.discountAmount ? (typeof packedList.discountAmount === 'string' ? Number(packedList.discountAmount) : packedList.discountAmount) : 0.00;
            obj.price = packedList.salePrice ? (typeof packedList.salePrice === 'string' ? Number(packedList.salePrice) : packedList.salePrice) : 0.01;
            obj.quantity = packedList.quantity ? (typeof packedList.quantity === 'string' ? Number(packedList.quantity) : packedList.quantity) : 1;
            obj.active = true;
            skus.push(obj)
        }
        // if (this.props.packedList.isBundle && this.props.packedList.bundleList && this.props.packedList.bundleList.length) {
        //     this.props.packedList.bundleList.forEach((item) => item ? skus.push(item) : null)
        // }
        this.props.setSkus(skus);
    }
    getDataForClickAndDrive = () => {
        if (this.props.setClickAndCollect) {
            let clickAndCollect = this.props.clickAndCollect;

            let itemData = this.props.itemData;
            let deleveryAddressDetail = this.props.deleveryAddressDetail;

            if (this.props.packedList) {
                let packedList = this.props.packedList;
                let obj = {};
                obj.s = packedList.sku;
                obj.q = packedList.quantity;
                obj.bta = itemData.lpChargeNbr;
                obj.tal = itemData.tienda;
                obj.ta = deleveryAddressDetail.address1;
                obj.bia = itemData.CCAuthorization;
                obj.ne = deleveryAddressDetail.firstName + ' ' + deleveryAddressDetail.lastName;
                obj.pd = this.props.purchaseDate

                clickAndCollect.push(obj);
            }
            this.props.setClickAndCollect(clickAndCollect);
        }
    }
    render() {
        const { packedList, staticLabels } = this.props;
        // console.log("staticLabels", staticLabels);
        // const totalPrice = packedList.salePrice !== '0.01' ? (packedList.salePrice - packedList.discountAmount).toFixed(2).toString() : packedList.salePrice;
        /** defect 19355 used the list price not the sale price */
     // console.log('packedList', packedList);
        const totalPrice = (packedList.total).toString();
         const paymentMethodForMessage = this.props && this.props.orderSuccessTotal && this.props.orderSuccessTotal.payemntMethod;
         const checkCIE = (paymentMethodForMessage === 'Efectivo') || (paymentMethodForMessage === 'Transferencia') || (paymentMethodForMessage === 'CIEBancomer') ? true : false;
         const useremail = this.props && this.props.packedList && this.props.packedList.userEmail ? this.props.packedList.userEmail :'';

        return (
            <React.Fragment>
                
                <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                        <Figure imageClassName={"a-box__productImg cursurDef a-myBagImageProduct"} imageAlt="alt-Description" src={packedList.imageMap || 'filler_REC.jpg'} height={100} />
                        {/*<Image className="a-box__image" src={packedList.imageMap}  alt="Product" />*/}
                    </div>
                    <div className="col-8 col-lg-3">
                        <Label className="a-box__resume -resumeTitle d-block mb-lg-1">{packedList.displayName}</Label>
                        {packedList.salePrice === '0.01' &&
                            <div className="m-flag">
                                <div className="m-flag-item -defaultFlag"><span>Regalo</span>
                                </div>
                            </div>
                        }
                        {
                            (packedList.productFlags && packedList.productFlags.length>0 && packedList.productFlags.indexOf('presale') !== -1) &&
                            <div class="m-flag">
                                <div class="m-flag-item -defaultFlag"><span>Preventa</span></div>
                            </div>
                        }
                        {packedList.ProductType === "Digital" && (packedList.productFlags && packedList.productFlags.length>0 && packedList.productFlags.indexOf('presale') !== -1) &&
                            <Label className="a-box__resume d-block">
                                <span className="-pendingDelivery">{staticLabels['pwa.orderConfirmationPage.presaleMessage.text'] || "Producto disponible a la fecha de lanzamiento"}</span>
                            </Label>
                        }
                        <Label className="a-box__productQuantity ">Código de producto: {packedList.sellerSkuId !==undefined ?packedList.sellerSkuId :  packedList.sku}{}</Label>
                        {(packedList.purchaseType && packedList.ProductType) && <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: {packedList.ProductType}</Label>}
                        {packedList.clothingColor ? <Label className="a-box__productQuantity">{(staticLabels && staticLabels['pwa.orderSuccessPage.color.label'] ? staticLabels['pwa.orderSuccessPage.color.label'] :'')}: {packedList.clothingColor}</Label> : ''}
                        {packedList.clothingSize ? <Label className="a-box__productQuantity">{(staticLabels && staticLabels['pwa.orderSuccessPage.size.label'] ? staticLabels['pwa.orderSuccessPage.size.label']:'')}: {packedList.clothingSize}</Label> : ''}
                        {packedList.dimensions ? <Label className="a-box__productQuantity">{(staticLabels && staticLabels['pwa.orderSuccessPage.dimensions.label'] ?staticLabels['pwa.orderSuccessPage.dimensions.label']:'')}: {packedList.dimensions}</Label> : ''}
                        {packedList.material ? <Label className="a-box__productQuantity">{(staticLabels['pwa.orderSuccessPage.material.label'] ? staticLabels['pwa.orderSuccessPage.material.label']: '')}: {packedList.material}</Label> : ''}
                        {packedList.texture ? <Label className="a-box__productQuantity">{staticLabels && staticLabels['pwa.orderSuccessPage.texture.label'] ? staticLabels['pwa.orderSuccessPage.texture.label']:''}: {packedList.texture}</Label> : ''}
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
                                <Label className="a-box__downloadDigital pb-2">{'Hemos enviado las instrucciones, el código y el link por correo a:'+useremail}</Label>                             
                            </React.Fragment>
                        }
                        
                        {/*{
                         (packedList.fulFillmentStatus === "2" && packedList.digitalErrorMessage) &&
                            <React.Fragment>
                                <LabelAnchor labelClass="a-box__productQuantity" labelText={packedList.digitalErrorMessage}></LabelAnchor>
                            </React.Fragment>   
                        }*/}
                        {/*{packedList.cieWarningMessage && 
                         <React.Fragment>
                                <LabelAnchor labelClass="a-box__productQuantity" labelText={packedList.cieWarningMessage}></LabelAnchor>
                            </React.Fragment>      
                        }*/}
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                        {packedList.listPrice !== packedList.salePrice ?
                         <Label className="a-box__linePrice">${GetWithDecimal(packedList.listPrice, '2').val}<Sup>{GetWithDecimal(packedList.listPrice, '2').decimal}</Sup></Label>
                            /*<LabelSup labelClass=""
                                //labelText={'$' + packedList.listPrice.slice(0, packedList.listPrice.indexOf('.'))} 
                                // supText={packedList.listPrice.slice(packedList.listPrice.indexOf('.') + 1)} 
                                labelText={` $ ${GetWithDecimal(packedList.listPrice, '2').val}`}
                                supText={`  ${GetWithDecimal(packedList.listPrice, '2').decimal}`}*/
                           // />
                             : ''}
                        <div>
                            <Label className="a-box__normalPrice">${GetWithDecimal(packedList.salePrice, '2').val}<Sup>{GetWithDecimal(packedList.salePrice, '2').decimal}</Sup></Label>
                            {/*<LabelSup labelClass="a-box__normalPrice"
                                // labelText={'$' + packedList.salePrice.slice(0, packedList.salePrice.indexOf('.'))} 
                                // supText={packedList.salePrice.slice(packedList.salePrice.indexOf('.') + 1)} 

                                labelText={` $ ${GetWithDecimal(packedList.salePrice, '2').val}`}
                                supText={`  ${GetWithDecimal(packedList.salePrice, '2').decimal}`}
                            />*/}
                            </div>
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                        {packedList.promoDescription &&
                            <span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{packedList.promoDescription}</span>
                        }
                        {packedList.discountAmount && !checkCIE && 
                           <span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{staticLabels && staticLabels['pwa.orderConfirmationPage.Descuento.text'] ? staticLabels['pwa.orderConfirmationPage.Descuento.text'] :''}:{' '}
                               <Label className="d-lg-block">${GetWithDecimal(packedList.discountAmount, '2').val}<Sup>{GetWithDecimal(packedList.discountAmount, '2').decimal}</Sup></Label>
                            {/*<LabelSpanSpan
                                labelClass="d-lg-block"
                                labelText={ ` $ ${GetWithDecimal(packedList.discountAmount, '2').val}`}
                                supText={`  ${GetWithDecimal(packedList.discountAmount, '2').decimal}`}
                            />*/}
                            </span>
                        }
                        <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text={packedList.quantity} />
                    </div>
                    <div className="col-3">
                        {packedList.promoDescription &&
                            <LabelSpan labelClass="a-box__medium d-none d-lg-block" labelText={packedList.promoDescription.slice(0, packedList.promoDescription.indexOf('%') + 1)} spanText={packedList.promoDescription.slice(packedList.promoDescription.indexOf('%') + 1)} spanClass="a-box__promotionText" />
                        }
                    </div>
                    <div className="col-1">
                        {packedList.discountAmount && !checkCIE &&
                         <Label className="a-box__normalPrice d-none d-lg-block">${GetWithDecimal(packedList.discountAmount, '2').val}<Sup>{GetWithDecimal(packedList.discountAmount, '2').decimal}</Sup></Label>
                            /*<LabelSup
                                labelClass="a-box__normalPrice d-none d-lg-block"
                                labelText={` $ ${GetWithDecimal(packedList.discountAmount, '2').val}`}
                                supText={`  ${GetWithDecimal(packedList.discountAmount, '2').decimal}`}
                            />*/
                        }
                    </div>
                    
                    <div className="col-1">
                        <Label className="a-box__totalPrice d-none d-lg-block">${GetWithDecimal(totalPrice, '2').val}<Sup>{GetWithDecimal(totalPrice, '2').decimal}</Sup></Label>
                        {/*<LabelSup labelClass="a-box__totalPrice d-none d-lg-block"
                            labelText={` $ ${GetWithDecimal(totalPrice, '2').val}`}
                            supText={`  ${GetWithDecimal(totalPrice, '2').decimal}`}
                        />*/}
                    </div>
                </div>
             
            </React.Fragment>
        )
    }
}