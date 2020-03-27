//import './OfferListProduct.styl'

/*include ../../molecules/Figures/molecule-Figure.pug
include ../../molecules/MixinMolecules/mixin-molecules.pug
include ../../atoms/Anchor/atom-anchor.pug
 include ../../molecules/ProductInfo/molecule-productInfo
  include ../../molecules/ColorSelection/molecule-colorSelection*/

import Figure from '../../molecules/Figure/Figure';

import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Button from '../../atoms/Button/Button';
import ProductInfo from '../../molecules/ProductInfo/ProductInfo';
import ColorSelection from '../../molecules/ColorSelection/ColorSelection';
import map from 'lodash/map';
import Router from 'next/router';

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {  
    return (
      <React.Fragment>
        <div className="mt-3 mb-3 d-none d-lg-block" onClick={() => Router.back()}>
          <Link className="a-offerList-anchor" href="#"><Icons className="icon-arrow_left" />Volver</Link>
        </div>
        <div className="col-12 o-offerList-product d-flex -justify-content-start align-items-center my-3">
          <div className="col-12 col-lg-4 px-0 px-lg-3">
            <div className="row">
              <ProductInfo  {...this.props} />
            </div>
          </div>
          <div className="col-lg-8 d-none d-lg-block">
            <div className="row">
              <ColorSelection {...this.props} />
              <div className="col m-product__size px-0" data-option="size">
                {
                  this.props.sizeName !=''?  <Label className="m-offerList-label__opotions">Tallas: {this.props.sizeName}</Label>:''
                }
              
                <Ul className="productSizeList row">
                  {
                    map(this.props.sizedata, (item, index) =>
                      <List key={'size' + index}>
                        <Button className={(item.disable) ? 'a-btn a-btn --actionpdp -disabled' : (this.props.activeSizeIndex === index ? "a-btn a-btn--actionpdp active" : "a-btn a-btn--actionpdp")}
                          ripple=""
                          handleClick={(e) => this.props.getActiveSize(item.sizeid, index,item.size)}> {item.size} </Button>
                      </List>
                    )
                  }
                  {/*<Ul className="productSizeList row">
                  <List><Button className="a-btn a-btn--actionpdp" ripple="">CH</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp --disabled" ripple="">M</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp --active" ripple="">Grande</Button></List>*/}
                </Ul>

              </div>


              {/*<div className="col m-product__size --texture px-0" data-option="texture">
                <Label className="m-offerList-label__opotions">Textura:</Label>
                <Ul className="productSizeList row">
                  <List><Button className="a-btn a-btn--actionpdp --active" ripple="">Suave</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp" ripple="">Rugosa</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp" ripple="">Aspera</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp --disabled" ripple="">Lisa</Button></List>
                </Ul>

              </div>*/}
              <div className="col m-product__size --material px-0" data-option="material">
                {
                  this.props.materialData && this.props.materialData.length > 1 ? <Label className="m-offerList-label__opotions">Maerial:</Label> : null
                }

                <Ul className="productSizeList row">
                  {
                    this.props.materialData && this.props.materialData.length > 1 ?
                      map(this.props.materialData, (item, index) =>
                        <List><Button className="a-btn a-btn--actionpdp active" ripple="">{item.name}</Button></List>
                      ) : null
                  }
                  {/*<List><Button className="a-btn a-btn--actionpdp" ripple="">Nylon</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp" ripple="">Nylon</Button></List>
                  <List><Button className="a-btn a-btn--actionpdp --disabled" ripple="">Nylon</Button></List>*/}
                </Ul>
              </div>
            </div>
          </div>
        </div>

      </React.Fragment>
    );
  }
}
