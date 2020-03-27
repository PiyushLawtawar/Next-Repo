import React from 'react';
import ProductSpecList from '../../molecules/ProductDetail/ProductSpecList';
import ProductSocialShare from '../../molecules/ProductSocialShare/ProductSocialShare';
import ProductSpecDetail from './ProductSpecDetail';
import PdpProductPromos from './PdpProductPromos';

import Modal from '../../../helpers/modal/modal';
import ProductDescriptionModal from '../../molecules/Modals/ProductDescriptionModal';
import ProductSpecsModal from '../../molecules/Modals/ProductSpecsModal';
import ProductPoliticsModal from '../../molecules/Modals/ProductPoliticsModal';
import ProductSocialShareModal from '../../molecules/Modals/ProductSocialShareModal';
import ProductPromoModal from '../../molecules/Modals/ProductPromoModal';
import ProductSocialEmail from '../../molecules/Modals/ProductSocialEmail';
import ProductExtrainfoModal from '../../molecules/Modals/ProductExtrainfoModal';
import { parentContext } from '../../../contexts/parentContext';

//import './PdpProductSpecs.styl'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.specsOptionRef = React.createRef();
    }
    render() {
        const modalProductDescription = {
            modalId: "description-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog",
            modalContentClass: "modal-content"
        };

        const modalProductSpecs = {
            modalId: "specs-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "specs-modal",
            modalDialogClass: "modal-dialog",
            modalContentClass: "modal-content"
        };
        const modalProductPolitics = {
            modalId: "politics-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "politics-modal",
            modalDialogClass: "modal-dialog",
            modalContentClass: "modal-content"
        };
        const modalProductSocialShare = {
            modalId: "social-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "social-modal",
            modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",
            modalContentClass: "modal-content"
        };
        const modalProductPromo = {
            modalId: "promo-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "promo-modal",
            modalDialogClass: "modal-dialog",
            modalContentClass: "modal-content"
        };
        const modalProductSocialEmail = {
            modalId: "share-email-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "share-email-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        const { productLongDescription, productFeatures, productPromotion, productPolicies, productSocialShare } = this.props.modalDatas || '';
        const descriptionModalData = this.props.productLongDescription || '';


        let endecaData = this.props.mainContent && this.props.mainContent.endecaProductInfo && this.props.mainContent.endecaProductInfo.contents && this.props.mainContent.endecaProductInfo.contents[0] && this.props.mainContent.endecaProductInfo.contents[0].mainContent && this.props.mainContent.endecaProductInfo.contents[0].mainContent[0] && this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record
        const extraInformationWap = endecaData && endecaData['product.extraInformationWeb'] || ''
        const extraInformationWeb = endecaData && endecaData['product.extraInformationWap'] || ''

        // let longDescription = endecaData.attributes ? endecaData.attributes['product.longDescription'][0] : endecaData['product.longDescription'][0]
        // let dynamicAttribute = endecaData.attributes && endecaData.attributes['product.dynamicAttribute'] ? endecaData.attributes['product.dynamicAttribute'][0] : endecaData['product.dynamicAttribute'] ? endecaData['product.dynamicAttribute'][0] : ""
        let { staticLabels = {} } = this.props /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
        let tempProductFeatures = [
            "10|Otra Información|Prueba",
            "11730|Razón Social|LETICIA PAMMY SA DE CV",
            "17490|Tipo EAN|EAN Instore        (asign.int.posible)",
            "17730|Tipo de artículo|Mercadería",
            "19120|Categoría de artículo|Artículo genérico",
            "21380|Hecho en|México",
            "2|Tipo de Espejo|Prueba",
            "3|Material|Porcelana",
            "5|Material del Marco|Prueba",
            "650|Volumen|0.000",
            "6|Alto|Prueba",
            "7|Ancho|Prueba",
            "8530|Grupo artículos|10407 - BAÑO",
            "8|Marca|POTTERY BARN",
            "9|Peso|Prueba"
        ]
        let orderedData = [];
        if (productFeatures.length > 0) {

            let sortData = []
            let orderMapObj = {};

            productFeatures.map(features => { let valueObj = {}; let splitedArray = features.split("|"); sortData.push(splitedArray[0]); valueObj[splitedArray[1]] = splitedArray[2]; orderMapObj[splitedArray[0]] = valueObj; })
            //console.log("sortedArray", sortData.sort((a, b) => a - b));
            //console.log("framedObject",orderMapObj )
            sortData.sort((a, b) => a - b).map(orderedValue => orderedData.push(orderMapObj[orderedValue]))
            //console.log("orderedData",orderedData)
        }
        
        return (
            //Mobile version of Tab is left.Mobile version is in accordion form.ProductSpecList

            <React.Fragment>
                <div className="o-product__productSpecs pb-0 pb-lg-3" id="scroll">
                    <div className="m-product__productSpecsList d-block d-lg-none mt-4 mb-4">
                        {this.props.isMobile === true || (this.props.isIpad === true && Math.abs(this.props.orientation) !== 90) ? <ProductSpecList isFromCollectionPage={this.props.isFromCollectionPage} isMobile={this.props.isMobile} btnclass="a-btn a-btn--action -noRadius" productLongDescription={productLongDescription} orderedData={orderedData} productPolicies={productPolicies} isMobile={this.props.isMobile} extraInformationWap={extraInformationWap} extraInformationWeb={extraInformationWeb} isIpad={this.props.isIpad} padWidth={this.props.padWidth} padHeigth={this.props.padHeigth} /> : null} {/*modified  for bug id 23601 -- added conditional rendering -- modified orientation to prop instead of window- 23061 */}
                        <ProductSocialShare />
                    </div>
                    <div className="o-product__productSpecsList d-none d-lg-block">

                        {(productLongDescription != "" || productFeatures != "" || productPolicies != "") &&
                            <ProductSpecDetail ref={this.specsOptionRef} funChangeTabs={this.props.funChangeTabs} changeTabs={this.props.changeTabs} mainContent={this.props.mainContent} widthClass="col-7" childClass={"m-product__detail pt-4 pb-4 pl-4 pr-4"} >
                                {productLongDescription != "" ? <div label={staticLabels && staticLabels["PD.desc.text"] || "Descripción"}> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                                    <div dangerouslySetInnerHTML={{ __html: productLongDescription }} />
                                </div> : null}
                                {orderedData && orderedData.length > 0 ? <div label={staticLabels && staticLabels["pdpPage.characteristic.label"] || "Características"}> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                                    {orderedData.length > 0 && orderedData.map((features, i) => {
                                        return <p key={i} className="a-product__paragraphProductSpecs spec">{Object.keys(features)}: <span className="description ml-1">{Object.values(features)}</span>
                                        </p>
                                    })}
                                </div> : null}
                                {productPolicies != "" ? <div label="Políticas">
                                    <div dangerouslySetInnerHTML={{ __html: productPolicies }} />
                                </div> : null}
                            </ProductSpecDetail>
                        }
                        <section className="mt-5">
                            <PdpProductPromos productPromotion={productPromotion} promotionInfo={this.props.promotionInfo} staticLabels={staticLabels} /> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                        </section>
                    </div>
                </div>
                <Modal modalDetails={modalProductDescription} showModalpopUp={"showModal7"} >
                    <ProductDescriptionModal productLongDescription={productLongDescription} ModalpopUp={"showModal7"} forcePadding={this.props.forcePadding} />
                </Modal>
                <Modal modalDetails={modalProductSpecs} showModalpopUp={"showModal8"} >
                    <ProductSpecsModal isMobile = {this.props.isMobile} orderedData={orderedData} ModalpopUp={"showModal8"} forcePadding={this.props.forcePadding} />
                </Modal>
                <Modal modalDetails={modalProductPolitics} showModalpopUp={"showModal9"} >
                    <ProductPoliticsModal productPolicies={productPolicies} ModalpopUp={"showModal9"} forcePadding={this.props.forcePadding} />
                </Modal>
                {this.props.isMobile ? <Modal modalDetails={modalProductPolitics} showModalpopUp={"wap_Extra"} >
                    <ProductExtrainfoModal extraInformationWap={extraInformationWap} extraInformationWeb={extraInformationWeb} ModalpopUp={"wap_Extra"} forcePadding={this.props.forcePadding} />
                </Modal> : null}

                <parentContext.Consumer>
                    {({ showModal, SelectedModelData, closeModal, OpenModal }) => (
                        <Modal modalDetails={modalProductSocialShare} showModalpopUp={"showModal10"} >
                            <ProductSocialShareModal {...this.props} productSocialShare={productSocialShare} OpenModal={OpenModal} ModalpopUp={"showModal10"} closeModal={closeModal} staticLabels={staticLabels} /> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                        </Modal>
                    )}
                </parentContext.Consumer>

                <Modal modalDetails={modalProductPromo} showModalpopUp={"showModal11"}>
                    <ProductPromoModal isMobile = {this.props.isMobile} productPromotion={productPromotion} ModalpopUp={"showModal11"} forcePadding={this.props.forcePadding} />
                </Modal>
                <parentContext.Consumer>
                    {({ showModal }) => (showModal.showModal12 === true ? <Modal modalDetails={modalProductSocialEmail} showModalpopUp={"showModal12"}>
                        <ProductSocialEmail ModalpopUp={"showModal12"} productSocialEmailData={this.props.productSocialEmailData} staticLabels={staticLabels} /> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
                    </Modal> : null
                    )}
                </parentContext.Consumer>
            </React.Fragment>
        );
    }
}


