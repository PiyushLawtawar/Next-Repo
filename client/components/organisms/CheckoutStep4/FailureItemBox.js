/**
* Module Name : FailureItemBox
* Functionality : Showing failure item box template
* @exports : FailureItemBox
* @requires : module:React
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/HrTag/HrTag
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/ItemInfo
* @requires : module:/atoms/Button/Button
* @requires : module:/molecules/Alert/Alerts
* @requires : module:/helpers/utilities/utility
* @requires : module:/atoms/Sup/Sup
* @requires : module:/molecules/Figure/Figure
* Team : Checkout Team
* 
*/
import Label from '../../atoms/Label/Label';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import HrTag from '../../atoms/HrTag/HrTag';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Image from '../../atoms/Tagimage/Image';
import ItemInfo from './ItemInfo';
import Button from '../../atoms/Button/Button';
import Alerts from '../../molecules/Alert/Alerts';
import {  GetWithDecimal } from '../../../helpers/utilities/utility';
import Sup from  "../../atoms/Sup/Sup";
import Figure from '../../molecules/Figure/Figure';
/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        /** SWOGO team requested not to send failure items to them and hence commiting this code */
        //this.getDataForSwogo();
    }

    /**
     * Method will call on
     * @function 
     * @author shreyansh.khare@zensar.com
     * @desc 
     * @param {object}
     * 
     */
     getDataForSwogo = () => {
        let skus = this.props.skus;
        const { data } = this.props;
        let items = [];
        for (let key in data) {
            items = data[key].CommerceItems;
            items.forEach(item => {
                let temp = item;
                let obj = {};
                obj.title = temp.displayName;
                obj.productType = temp.ProductType ? temp.ProductType : '';
                obj.productId = temp.productId;
                obj.sku = temp.sku;
                obj.imageURL = temp.imageMap;
                obj.listPrice = temp.listPrice ? (typeof temp.listPrice ==='string'?Number(temp.listPrice):temp.listPrice):0.01; 
                obj.salePrice = temp.salePrice ? (typeof temp.salePrice ==='string'?Number(temp.salePrice):temp.salePrice):0.01;
                obj.storeNumber = temp.tienda;
                obj.promoPrice = temp.discountAmount ? (typeof temp.discountAmount ==='string'?Number(temp.discountAmount):temp.discountAmount):0.00;
                obj.price = temp.salePrice ? (typeof temp.salePrice ==='string'?Number(temp.salePrice):temp.salePrice):0.01;
                obj.active = false;
                skus.push(obj)
            })
        }
        this.props.setSkus(skus);
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    
    render() {
        const { data, staticLabels,chargedAndUncollected,commerceItems} = this.props;
        let items = [];
        if(chargedAndUncollected === 'chargedAndUncollected'){
            items.push(data);
        }else {
            for (let key in data) {
            items = data[key].CommerceItems;
            }
        }

        return (
           <React.Fragment>
                {items ? items.map((item,index) =>
                    <div className="row mb-3" key={index}>
                        <div className="col-12">
                            <div className="m-box -noBottomBorders">
                                <div className="row align-items-center justify-content-between d-none d-lg-flex">
                                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                                </div>
                                
                                {index >0 && <HrTag hrClass="a-productList__separator" />}
                                <div className="row align-items-start">
                                    <div className="col-4 col-lg-2">
                                        <Figure imageClassName={"a-box__productImg cursurDef a-myBagImageProduct"}
                                                imageAlt="alt-Description"
                                                src={(item.itemType==="Air Time" ? item.imageURL : item.imageMap) || 'filler_REC.jpg'}
                                                height={100} />
                                        {/*<Image className="a-box__image" src={item.imageMap} alt="Product" />*/}
                                    </div>
                                    <div className="col-8 col-lg-3">
                                        <Label className="a-box__resume -resumeTitle mb-lg-2">{item.displayName}</Label>
                                        {
                                            (item.productFlags && item.productFlags.length>0 && item.productFlags.indexOf('presale') !== -1) &&
                                            <div class="m-flag">
                                                <div class="m-flag-item -defaultFlag"><span>Preventa</span></div>
                                            </div>
                                        }                                        
                                        <Label className="a-box__productQuantity">Código de producto: {item.productId}</Label>
                                        {(item.purchaseType && item.itemType) && <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: {item.itemType}</Label>}
                                        {item.clothingColor ? <Label className="a-box__productQuantity">{staticLabels && staticLabels['pwa.orderSuccessPage.color.label'] ? staticLabels['pwa.orderSuccessPage.color.label'] :''}: {item.clothingColor}</Label> : ''}
                                        {item.clothingSize ? <Label className="a-box__productQuantity">{staticLabels && staticLabels['pwa.orderSuccessPage.size.label'] ? staticLabels['pwa.orderSuccessPage.size.label'] :''}: {item.clothingSize}</Label> : ''}
                                        {item.dimensions ? <Label className="a-box__productQuantity">{staticLabels && staticLabels['pwa.orderSuccessPage.dimensions.label'] ? staticLabels['pwa.orderSuccessPage.dimensions.label'] :''}: {item.dimensions}</Label> : ''}
                                        {item.material ? <Label className="a-box__productQuantity">{staticLabels && staticLabels['pwa.orderSuccessPage.material.label'] ? staticLabels['pwa.orderSuccessPage.material.label']:''}: {item.material}</Label> : ''}
                                        {item.texture ? <Label className="a-box__productQuantity">{staticLabels && staticLabels['pwa.orderSuccessPage.texture.label'] ? staticLabels['pwa.orderSuccessPage.texture.label'] :''}: {item.texture}</Label> : ''}
                                        {item.sellerName ? <Label className="a-box__productQuantity">{'Vendido por'}: {item.sellerName}</Label> : ''}
                                    </div>
                                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                    
                    {item.listPrice !== item.salePrice ? 
                    <Label className="a-box__linePrice">${GetWithDecimal(item.listPrice, '2').val}<Sup>{GetWithDecimal(item.listPrice, '2').decimal}</Sup></Label>
                       /*<LabelSup labelClass="a-box__linePrice"
                            labelText={` $ ${GetWithDecimal(item.listPrice, '2').val}`}
                            supText={`  ${GetWithDecimal(item.listPrice, '2').decimal}`}
                        />*/
                        :''} 

                        <div>
                            <Label className="a-box__normalPrice">${GetWithDecimal(item.salePrice, '2').val}<Sup>{GetWithDecimal(item.salePrice, '2').decimal}</Sup></Label>
                            {/*<LabelSup labelClass="a-box__normalPrice"
                                labelText={` $ ${GetWithDecimal(item.salePrice, '2').val}`}
                                supText={`  ${GetWithDecimal(item.salePrice, '2').decimal}`}
                            />*/}
                            </div>
                                    </div>
                                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                                        {item.promoDescription &&
                                            <span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{item.promoDescription}</span>
                                        }
                                        {item.discountAmount &&
                                        <span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{staticLabels && staticLabels['pwa.orderConfirmationPage.Descuento.text'] ? staticLabels['pwa.orderConfirmationPage.Descuento.text'] :''}:{' '}
                                            <Label className="d-lg-block">${GetWithDecimal(item.discountAmount, '2').val}<Sup>{GetWithDecimal(item.discountAmount, '2').decimal}</Sup></Label>
                                            {/*<LabelSpanSpan
                                                labelClass="d-lg-block"
                                                labelText={ ` $ ${GetWithDecimal(item.discountAmount, '2').val}`}
                                                supText={`  ${GetWithDecimal(item.discountAmount, '2').decimal}`}
                                            />*/}
                                            </span>
                                            /*<span class="a-box__quantity d-block d-lg-none pt-1 pb-1">{staticLabels['pwa.orderConfirmationPage.Descuento.text']}: {` $ ${GetWithDecimal(item.discountAmount, '2').val}`}{`  ${GetWithDecimal(item.discountAmount, '2').decimal}`}</span>*/
                                        }                                        
                                        <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text={item.quantity} />
                                    </div>
                                    <div className="col-3">
                                        {item.promoDescription &&
                                            <LabelSpan labelClass="a-box__medium d-none d-lg-block" labelText={item.promoDescription.slice(0, item.promoDescription.indexOf('%') + 1)} spanText={item.promoDescription.slice(item.promoDescription.indexOf('%') + 1)} spanClass="a-box__promotionText" />
                                        }
                                    </div>
                                    {item.discountAmount && 
                                    <div className="col-1">
                                        <Label className="a-box__normalPrice d-none d-lg-block">${GetWithDecimal(item.discountAmount, '2').val}<Sup>{GetWithDecimal(item.discountAmount, '2').decimal}</Sup></Label>
                                        {/*<LabelSup
                                        labelClass="a-box__normalPrice d-none d-lg-block"
                                        labelText={` $ ${GetWithDecimal(item.discountAmount, '2').val}`}
                                        supText={`  ${GetWithDecimal(item.discountAmount, '2').decimal}`}
                                        />*/}
                                        </div>
                                    }
                                    {item.total &&
                                        <div className="col-1">
                                            <Label className="a-box__totalPrice d-none d-lg-block">${GetWithDecimal(item.total, '2').val}<Sup>{GetWithDecimal(item.total, '2').decimal}</Sup></Label>
                                    {/*<LabelSup labelClass="a-box__totalPrice d-none d-lg-block"
                                    labelText={` $ ${GetWithDecimal(item.total, '2').val}`}
                                    supText={`  ${GetWithDecimal(item.total, '2').decimal}`}
                                    />*/}
                                      </div>
                                    }
                                </div>
                            </div>
                             {commerceItems && commerceItems.AutorizacionBancaria &&  <div className="m-box mt-lg-2 mt-0 -noTopBorders">
        <div className="row align-items-center justify-content-between d-lg-flex moreInfoWrap pt-3 pt-lg-0">
          <div className="col-lg-auto col-6">
            <label className="a-box__resumeDetail">Autorizacion Bancaria : <span className="a-box__resumeDetail -bold d-block d-lg-inline-block">{commerceItems.AutorizacionBancaria}</span>
            </label>
          </div>
        </div>
      </div>}
                        </div>
                       
                    </div>
                    
                )
                    : null
                }
            </React.Fragment >
        )
    }
}