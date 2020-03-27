//import './ProductInfo.styl'
import { H1 } from '../../atoms/HeadLines/Headlines'
import Figure from '../Figure/Figure'
import Ratings from '../Ratings/Ratings'
import { LiAnchorSpan, ButtonHeadIcon } from '../MixinMolecules/MixinMolecules'
import Paragraph from '../../atoms/Paragraph/Paragraph'
import Ul from '../../atoms/Ul/Ul';
import Icons from "../../atoms/Icons/Icons";
import { parentContext } from '../../../contexts/parentContext';
import get from 'lodash/get';
import Modal from '../../../helpers/modal/modal';
import EddModal from '../../molecules/Modals/EddModal';
import SelectStateModal from '../../molecules/Modals/SelectStateModal';
import AvailabilityModal from '../../molecules/Modals/AvailabilityModal';

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Edd: ""
    }
  }
  changeEdd = (estimatedDate) => {

    let errmessage = Object.keys(estimatedDate.EDDErrorMessages).length < 0 ? "" : estimatedDate.EDDErrorMessages[Object.keys(estimatedDate.EDDErrorMessages)]
    let eddMessage = estimatedDate.estimatedDeliveryDate || errmessage
    if (typeof this.props.pdpOfferList === 'boolean' && this.props.pdpOfferList) {
      this.setState({ Edd: '' }, () => { this.props.eddData('') })
    } else {
      this.setState({ Edd: eddMessage }, () => { this.props.eddData(this.state.Edd) })
    }
  }

  render() {
    const headLineText = this.props.endecaProductRecord.productDisplayName ? this.props.endecaProductRecord.productDisplayName[0] : (this.props.endecaProductRecord.attributes && this.props.endecaProductRecord.attributes['product.displayName'][0])
    const Rating = this.props.endecaProductRecord && this.props.endecaProductRecord.productAvgRating && this.props.endecaProductRecord.productAvgRating.length > 0 && this.props.endecaProductRecord.productAvgRating[0] || {}
    const largeImage = get(this.props, 'endecaProductRecord["product.largeImage"][0]', '');
    const Imageinfo = {
      src: largeImage, //"https://images-na.ssl-images-amazon.com/images/I/81z7XDxtBqL._SY550_.jpg",
      imageClassName: "align-self-center mb-3 mb-lg-0",
    };
    let records = this.props.productDetails && this.props.productDetails.endecaProductInfo && this.props.productDetails.endecaProductInfo.contents &&
      this.props.productDetails.endecaProductInfo.contents && this.props.productDetails.endecaProductInfo.contents[0] &&
      this.props.productDetails.endecaProductInfo.contents[0].mainContent && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0]
      && this.props.productDetails.endecaProductInfo.contents[0].mainContent[0].record || {}
    let skuRecords = records.records || [];

    var finalSortedSize = [];
    Object.keys(this.props.skuAttributeMap).forEach(key => {
      let size = this.props.skuAttributeMap[key];
      if (this.props.colorName === size.color) {
        finalSortedSize.push({
          colorHexaCodeValue: size.colorHexaCodeValue
        })

      }
    });
    let hexacode = finalSortedSize && finalSortedSize[0] && finalSortedSize && finalSortedSize[0].colorHexaCodeValue
    let productImage = Imageinfo.src;
    let ProductCode = records && records.productId && records.productId[0]
    const ProductDisplayName = this.props.endecaProductRecord.productDisplayName ? this.props.endecaProductRecord.productDisplayName : (this.props.endecaProductRecord.attributes && this.props.endecaProductRecord.attributes['product.displayName'])
     let modalProductDetails = { ProductDisplayName, ProductCode, productImage }

   // console.log("finalSortedSize-----", hexacode)
    const ratingInfo = {
      ratingAvg: Rating && Math.round(Rating) || 0,
      ratingCount: Rating && Math.round(Rating) || 0
    };

    const modalEdd = {
      modalId: "edd-modal",
      modalClass: "o-product__modal modal fade",
      modalTabIndex: "1",
      modalAriaLabelledBy: "edd-modal",
      modalDialogClass: "modal-dialog modal-dialog-centered",
      modalContentClass: "modal-content"
    };
    const modalSelecState = {
      modalId: "select-state-modal",
      modalClass: "o-product__modal modal fade",
      modalTabIndex: "2",
      modalAriaLabelledBy: "select-state-modal",
      modalDialogClass: "modal-dialog modal-dialog-centered",
      modalContentClass: "modal-content"
    };
    const modalAvailability = {
      modalId: "availability-modal",
      modalClass: "o-product__modal modal fade",
      modalTabIndex: "1",
      modalAriaLabelledBy: "availability-modal",
      modalDialogClass: "modal-dialog modal-dialog-centered",
      modalContentClass: "modal-content"
    };
    return (
      <React.Fragment>

        <div className="col-12 m-offerList-productInfo d-flex flex-column justify-content-start">
          <div className="row">
            <div className="col-3 d-flex">
              <Figure options={Imageinfo} />
            </div>
            <div className="col-9">
              <H1 headLineClass="a-offerList-title order-1" headLineText={headLineText} />
              <Ratings ratingInfo={ratingInfo} />
              {
                this.props.sizeName !== undefined ? <Paragraph className="a-offertList-product__size d-lg-none order-3">Talla: <span className="a-offertList-product__sizeProperty">{this.props.sizeName}</span></Paragraph> : ''
              }

              {/*<Paragraph className="a-offertList-product__size d-lg-none order-4">Textura: <span className="a-offertList-product__sizeProperty">Suave</span></Paragraph>
              <Paragraph className="a-offertList-product__size d-lg-none order-5">Material: <span className="a-offertList-product__sizeProperty">Nylon</span></Paragraph>*/}
              <div className="m-product__productColor d-lg-none order-6 --noScroll">
                <Ul className="p-0 mb-3 d-flex align-items-center">
                  <LiAnchorSpan pdplistclass="a-productColor__item" anchorClassname="atom-color" anchorUrl="#" spanClassname="a-offertList-product__labelColor" spanText={this.props.colorName} data-color="#f7a0ac" style={{ background: hexacode }} />
                </Ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 offset-lg-3 col-lg-9 m-offerList-productInfo d-flex flex-column justify-content-center">
          {/*<div className="m-product__giftPurchase-container -small order-4 order-lg-1 order-2">
            <ButtonHeadIcon btnclass="a-btn a-btn--action --offerList" data-toggle="modal" data-target="#edd-modal" id="a-edd-modal__btn" btntext="Fecha estimada de entrega" iconclass="icon-arrow_right" />
          </div>*/}

          <parentContext.Consumer>
            {({ OpenModal }) => (
              <div className="m-product__eddDate" data-target="#edd-modal" data-toggle="modal" onClick={() => OpenModal('showModal1')}>
                <Paragraph className="a-product__eddDateLabel m-0">Fecha estimada de entrega</Paragraph>
                <Paragraph className="a-product__eddPreOrder -green m-0">{this.state.Edd}</Paragraph>
                <Icons className="float-right icon-arrow_right" />
              </div>
            )}
          </parentContext.Consumer>
          <Paragraph className="a-offertList-note d-none d-lg-block order-1 order-lg-2">*Las promociones pueden variar según el vendedor
                                      </Paragraph>
        </div>

        <parentContext.Consumer>
          {({ showModal }) => (showModal.showModal1 === true ? <Modal modalDetails={modalEdd} showModalpopUp={"showModal1"}>
              <EddModal
                skuRecords={skuRecords}
                // spanText={this.props.spanText}
                //  productImage={productImage}
                //  priceToShow={this.props.priceToShow}
                //  productDetails={ProductDetails}
                ModalpopUp={"showModal1"}
                //  addressList={this.showAddressList}
                // selectedAddId={this.state.selectedAddId}
                //  {... this.props}
                pdpQty={'1'}
                productType={this.props.productType}
                productSizeId={this.props.productSizeId}
                estimatedDate={(e) => this.changeEdd(e)}
                modalProductDetails= {modalProductDetails}
                setSelectedAddressInfo={this.props.setSelectedAddressInfo}
                selectedAddressInfo={this.props.selectedAddressInfo}
                set_postal_zip_code={this.props.set_postal_zip_code}
                pdpOfferList={this.props.pdpOfferList}
              />
            </Modal> : null
          )}
        </parentContext.Consumer>

        <parentContext.Consumer>
          {({ showModal }) => (showModal.showModal3 === true ? <Modal modalDetails={modalSelecState} showModalpopUp={"showModal3"}>
            <SelectStateModal ModalpopUp={"showModal3"} stateList={this.states} />
          </Modal> : null
          )}
        </parentContext.Consumer>
        <parentContext.Consumer>
          {({ showModal, SelectedModelData }) => (showModal.showModal4 === true ? <Modal modalDetails={modalAvailability} showModalpopUp={"showModal4"}>

            <AvailabilityModal ModalpopUp={"showModal4"} productSizeId={this.props.productSizeId} SelectedModelData={SelectedModelData} estimatedDate={(e) => this.changeEdd(e)} set_store_number={this.props.set_store_number} productType={this.props.productType} pdpOfferList={this.props.pdpOfferList} />
          </Modal> : null
          )}
        </parentContext.Consumer>
      </React.Fragment>
    );
  }
}


