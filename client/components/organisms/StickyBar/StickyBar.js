
import React from 'react';
//import './StickyBar.styl'

/*include ../../molecules/Figures/molecule-Figure
include ../../molecules/StickyBar/molecule-sticky-bar-info.pug
include ../../molecules/StickyBar/molecule-sticky-bar-actions.pug
include ../../molecules/StickyBar/molecule-sticky-bar-options.pug*/


import Figure from '../../molecules/Figure/Figure';
import StickyBarInfo from '../../molecules/StickyBar/StickyBarInfo';
import StickyBarActions from '../../molecules/StickyBar/StickyBarActions';
import StickyBarOptions from '../../molecules/StickyBar/StickyBarOptions';



export default class StickyBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      qty: props.qty,
      tabDesc: 0,
      tabCarac: 0,

    }
    this.changeQty = this.changeQty.bind(this)
    //this.onBlurQty = this.onBlurQty.bind(this)

  }
  removeValOnClick = () => {
    this.props.onChangeQty("")
    this.props.onBlurQty("", 'stickbar')
  }
  changeQty = (crtQuantity, operator) => {
    //console.log("operator==",e.target.value)
    
    let sum = operator == "" ? crtQuantity.replace(/^0+/, '') : eval(crtQuantity.replace(/^0+/, '') + operator + 1)
    //  console.log("sum===",sum)

    //  if(!this.props.limitedqty(sum))
    //     { console.log("I am un limitedqty") ;return false; }
    //     else 
    //     {
    //       console.log(sum);
    //      //this.setState({ qty: sum })
    this.props.onChangeQty(sum.toString())
    this.props.onBlurQty(sum, 'stickbar')
    //this.props.onBlurQty(document.querySelector('#a-stickyBar__inputQty'),)
    // }

  }
  inputQty = (enteredQty) => {
    //console.log(enteredQty)
    if (enteredQty <= 3) {
      this.setState({ qty: enteredQty })
      this.props.onChangeQty(sum)
    }
    else {
     // this.props.show_alert("only three digits allowed")
    }

  }
  componentWillReceiveProps(nextProps) {
    const tabDesc = document && document.getElementsByClassName('class-1').length;
    const tabCarac = document && document.getElementsByClassName('class-2').length;

    //this.setState({tabDesc:tabDesc,tabCarac:tabCarac})
    // console.log("tabCarac===",tabDesc);
    this.setState({ qty: nextProps.qty, tabDesc: tabDesc, tabCarac: tabCarac })
    // console.log("tabCarac= state ==",this.state.tabDesc);
  }

  render() {

    const { stickyData = {}, spanText, productSizeId, pdpType, opticData } = this.props;
    const records = stickyData.endecaProductInfo && stickyData.endecaProductInfo.contents && stickyData.endecaProductInfo.contents && stickyData.endecaProductInfo.contents[0] && stickyData.endecaProductInfo.contents[0].mainContent && stickyData.endecaProductInfo.contents[0].mainContent[0] && stickyData.endecaProductInfo.contents[0].mainContent[0].record || {}
    const skuAttributeMap = stickyData && stickyData.productVarientsInfo && stickyData.productVarientsInfo.skuAttributeMap || {}
    const { priceToShow, stickyThumbImg } = this.props.stickyBarInfo || {};

    const Imageinfo = {
      src: stickyThumbImg,
      imageAlt: 'Sticky Bar Image',
      imageClassName: 'a-stickyBar__image',
      fromPDP: true
    };

    return (
      <div>
        <div className={`o-stickyBar__container  ${this.props.visibility ? "show" : "hide"}`}>

          <div className="container">
            <div className="row">
              <div className="col-1 p-0">
                <div className="m-stickyBar__image -selected">
                  <Figure options={Imageinfo} />
                </div>

              </div>

              <div className="col-lg-6 col-xl-7">


                {/*<StickyBarInfo  />*/}
                <StickyBarInfo colorImage={this.props.colorImage} opticData={opticData} pdpType={pdpType} spanText={spanText} productSizeId={productSizeId} skuAttributeMap={skuAttributeMap} stickyData={records} priceToShow={priceToShow} stickybarInfo="m-stickyBar__info" stickybarTitle="a-stickyBar__title" PriceRange="m-stickyBar__price -range" stickyPrice="a-stickyBar__price -start m-0" discountPrice="a-product__paragraphDiscountPrice" endPrice="a-stickyBar__price -end m-0" productColor="a-stickyBar__color a-productColor__item" stickySize="a-stickyBar__size" productSizeName={this.props.productSizeName} colorStyle={this.props.colorStyle} /> {/*changes for color image implementation */}
              </div>

              <div className="col-lg-5 col-xl-4">
                {/*<StickyBarActions />*/}
                <StickyBarActions
                  changeQty={this.changeQty}
                  onBlurQty={this.props.onBlurQty}
                  qty={this.props.qty}
                  inputQty={this.inputQty}
                  stickyAction="m-stickyBar__actions"
                  qtyLabel="a-stickyBar__qtyLabel"
                  addButton="a-stickyBar__addButton"
                  primaryBtn="a-btn a-btn--primary"
                  handleAddToMyBag={this.props.handleAddToMyBag}
                  removeValOnClick={this.removeValOnClick}
                  pdpType={pdpType}
                  productType={this.props.productType}
                  staticLabels = {this.props.staticLabels}
                />
              </div>

            </div>
            <div className="row">
              <div className="col-5">
                <StickyBarOptions getModalDatas={this.props.getModalDatas} staticLabels={this.props.staticLabels} funChangeTabs={this.props.funChangeTabs} tabDesc={this.state.tabDesc} tabCarac={this.state.tabCarac} stickyLink="a-stickyBar__link" href="#mdc-tab-5" promoLink="#o-product__productSpecsPromos" /> {/*changes for showing policies in stickybar  */}
              </div>
            </div>
          </div>
        </div>


      </div>

    );

  }
}

