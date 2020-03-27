import React from 'react';
import Icons from '../../atoms/Icons/Icons';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Input from '../../atoms/Input/Input';
import Link from '../../atoms/Link/Link';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import PromotionQty from '../../organisms/CheckoutStepThree/promotionQty.js';
import QtyModelPromotion from '../../molecules/Modals/QtyModelPromotion';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import { PRICEFILTER_VALIDATION } from '../../../../client/config/constants';



class Quantity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      count: [1, 2, 3, 4, 5],
      inputFieldDisable: true,
      quantity: props.quantity,
      commerceId: props.commerceId,
      limited_Pieces: props.limited_Pieces,
      index: props.index,
      updatedkey: null
    };

    this.qtyInpuField = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.quantity !== this.state.quantity) {
      this.setState({ quantity: nextProps.quantity })
    }
    if (nextProps.limited_Pieces !== this.state.limited_Pieces) {
      this.setState({ limited_Pieces: nextProps.limited_Pieces })
    }
     if (nextProps.commerceId !== this.state.commerceId) {
      this.setState({ commerceId: nextProps.commerceId })
    }
  }

  toggleClass = (e) => {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
    // console.log(this.state.active)
    // this.qtyInpuField.focus();
  };
  onBlurQty = (e) => {
    let { value } = e.target;
    if (value > 0 && value >= this.state.limited_Pieces && (this.props.quantity != this.state.quantity)) {
      this.props.updateItemQuantity(this.state.commerceId, value, this.props.quantity)
    }
    else if (value > 0 && value <= this.state.limited_Pieces) {
      this.setState({ quantity: this.state.limited_Pieces });
    }
    else if (value == 0) {
      this.setState({ quantity: this.props.quantity });
    }

  }
  handleQtyEnter = (e) => {
    let { value } = e.target;

    if (value.match(PRICEFILTER_VALIDATION)) {
      value = value.replace(PRICEFILTER_VALIDATION, '');
    }

    this.setState({ quantity: value })


  }
  handleMoreQty = () => {
    this.setState({ quantity: "", prevQuantity: this.state.quantity });
    this.qtyInpuField.current.focus();
  }
  updateIndex(key, quantity, commerceId) {
    this.setState({
      updatedkey: key,
      quantity: quantity,
      commerceId: commerceId
    })
  }
  updateItemQuantityLess = (CommerceId, quantity, index) => {
    if (quantity > 0 && quantity >= this.state.limited_Pieces) {
      this.setState({
        quantity: quantity,
        CommerceId: CommerceId,
        updatedkey: null
      }, () => {
        this.props.updateItemQuantity(this.state.CommerceId, this.state.quantity, index)
      }
      );
    }

  }
  updateItemQuantityMore = (quantity, CommerceId, index) => {
    if (quantity == '6+') {
      this.setState({
        quantity: '',
        updatedkey: null,
        CommerceId: CommerceId,
        prevQuantity: index
      });
      const qtyInput = document.getElementById('pq-' + index);
      qtyInput && qtyInput.focus();
    }
  }
  closeOtherOption = () => {
    let allDropdowns = document.querySelectorAll('.dropdown-menu');
    allDropdowns.forEach(option => {
      option.classList.remove('show');
    });
  }

  render() {
    const modalQty = {
      modalId: "qty-modal",
      modalClass: "o-product__modal modal fade",
      modalTabIndex: "1",
      modalAriaLabelledBy: "qty-modal",
      modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",
      modalContentClass: "modal-content",
      style: { overflowY: 'hidden' }
    };

    let dropdownstyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      transform: 'translate3d(15px, 44px, 0px)',
    }
    return (
      <React.Fragment>
        <div className="m-product__qty d-none d-lg-block p-0 mb-0">
          <div className="row">
            <div className="col pb-1">
              <Paragraph className="a-product__paragraphQtyLabel m-0" />
            </div>
          </div>
          <div className="row">
            <div className={this.state.active ? 'col show' : "col"} onClick={(e) => { this.closeOtherOption(); this.toggleClass(e);this.handleMoreQty() }}>
              <Link className="m-ProductQty__container m-ProductQty__container--small show" href="#" id="qtyDropdownDesktop0" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <div className="row m-0">
                  <div className="col-9 p-0">
                    <Input reference={this.qtyInpuField} className="a-ProductQty__input" type="tel" pattern="[0-9]*"  maxLength="3" value={this.state.quantity} onBlur={(e) => this.onBlurQty(e)} onChange={this.handleQtyEnter} />
                  </div>
                  <div className="col-3 p-0"><Icons className="icon-arrow_down"></Icons></div>
                </div>
              </Link>
              <div className={this.state.active ? 'dropdown-menu dropdown-menu --small show' : "dropdown-menu dropdown-menu--small"} aria-labelledby="qtyDropdownDesktop0" onClick={this.toggleClass} style={dropdownstyle}>
                {
                  !isEmpty(this.state.count) && map(this.state.count, (quantity, index) => {
                    return (
                      <Link
                        className="dropdown-item"
                        href="#"
                        key={index}
                        data-value={quantity}
                        onClick={() => quantity >= this.state.limited_Pieces ? this.props.updateItemQuantity(this.state.commerceId, quantity, this.state.quantity) : ''}
                      >{quantity}</Link>
                    )
                  })

                }
                <Link className="dropdown_item" href="#" data-value="plus" onClick={this.handleMoreQty} >6 +</Link>
              </div>
            </div>
          </div>
        </div>

        <parentContext.Consumer>
          {({ OpenModal }) => (
            <button className="m-product__qty d-lg-none -multiple" onClick={this.handleMoreQty}>
              <div className="row no-gutters"> 
                <div className="col p-0">                 
                  <Input
                    id={`pq-${this.state.index}`}
                    className="a-ProductQty__input -mobile"
                    type="tel"
                    name="product-quantity"
                    value={this.state.quantity}
                    onChange={this.handleQtyEnter}
                    onBlur={(e) => this.onBlurQty(e)}
                    data-toggle="modal"
                    maxLength="3" />
                  </div>
                </div>
             </button>

          )}
        </parentContext.Consumer>
        {
          this.state.updatedkey != null ?
            <parentContext.Consumer>
              {({ showModal, SelectedModelData, closeModal }) => (showModal.QtyModelPromotion === true ?
                <Modal modalDetails={modalQty} showModalpopUp={"QtyModelPromotion"} >
                  <QtyModelPromotion ModalpopUp={"QtyModelPromotion"} updateItemQuantity={this.updateItemQuantityLess} updateItemQuantityMore={this.updateItemQuantityMore} closeModal={closeModal} quantity={this.state.quantity} commerceItemId={this.state.commerceId} index={this.state.updatedkey} />
                </Modal> : null
              )}
            </parentContext.Consumer>

            : ''
        }
      </React.Fragment>
    )
  }
}
export default Quantity

