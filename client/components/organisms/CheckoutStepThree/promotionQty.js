
/**
* Module Name : promotionQty
* Functionality : promotion quantity relate operations
* @exports : promotionQty
* @requires : module:React
* @requires : module:/molecules/Modals/QtyModelPromotion
* @requires : module:/atoms/Input/Input
* @requires : module:/atoms/Icons/Icons
* @requires : module:/contexts/parentContext
* @requires : module:/helpers/modal/modal
* @requires : module:/client/config/constants
* Team : Checkout Team
* 
*/

import React from 'react';
import QtyModelPromotion from '../../molecules/Modals/QtyModelPromotion';
import Input from '../../atoms/Input/Input';
import Icons from '../../atoms/Icons/Icons';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import { PRICEFILTER_VALIDATION } from '../../../../client/config/constants';


/**
 * @class promotionQty
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class extends React.Component {

  /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props) {
        super(props)
        this.state = {
            quantity: props.quantity,
            commerceItemId: props.commerceItemId,
            key: props.index,
            updatedkey: null,
            limited_Pieces: props.limited_Pieces
        }
          this.qtyInpuField = React.createRef();
        this.updateItemQuantityMore = this.updateItemQuantityMore.bind(this)

    }

    /**
    * Method will call on update item quantity
    * @function updateItemQuantity
    * @author prinshu.singh@zensar.com 
    * @desc Updating product item quantity to the state.
    * @param {string} CommerceId 
    * @param {string} quantity 
    * @param {string} prevQuantity 
    * 
    */
    updateItemQuantity = (CommerceId, quantity,prevQuantity) => {
        this.setState({
            quantity: quantity,
            commerceItemId: CommerceId,
            updatedkey: null
        }, () => {
            if (this.state.quantity >= this.state.limited_Pieces && (this.props.quantity != this.state.quantity)) {
                this.props.updateItemQuantity(this.state.commerceItemId, this.state.quantity,this.props.quantity)

            }
        }
        );

    }


    /**
    * Method will call on blur quantity field
    * @function onBlurQty
    * @author prinshu.singh@zensar.com 
    * @desc Updating product item quantity to the state.
    * @param {e} object
    * 
    */
    onBlurQty = (e) => {
        let { value } = e.target;
        if (value > 0 && value >= this.state.limited_Pieces && (this.props.quantity != this.state.quantity)) {
            this.props.updateItemQuantity(this.state.commerceItemId, value,this.props.quantity)
        }
        else if (value > 0 && value <= this.state.limited_Pieces) {
        this.setState({ quantity: this.state.limited_Pieces });
        }
        else if (value == 0) {
        this.setState({ quantity: this.props.quantity });
        }
    }

    /**
    * Method will call on change quantity field
    * @function onChangeQty
    * @author prinshu.singh@zensar.com
    * @desc Updating product item quantity to the state.
    * @param {e} object
    * 
    */
    onChangeQty = (e) => {

        let { value } = e.target;
        if (value.match(PRICEFILTER_VALIDATION)) {
            value = value.replace(PRICEFILTER_VALIDATION, '');
        }

        this.setState({ quantity: value });
    }

    /**
    * Resetting quantity
    * @function qtyEmpty
    * @author prinshu.singh@zensar.com 
    * @desc Product quantity value making empty.
    * @param {object} e 
    * 
    */
    qtyEmpty = (e) =>{
        let value  = '';
        this.setState({ quantity: value });
    }

    /**
    * Method will call on click of quantity 6+
    * @function updateItemQuantityMore
    * @author prinshu.singh@zensar.com 
    * @desc Allowing user to enter quantity manually when click on 6+
    * @param {string} quantity 
    * @param {string} commerceItemId 
    * @param {number} index 
    * @param {string} prevQuantity 
    * 
    */
    updateItemQuantityMore = (quantity, commerceItemId, index,prevQuantity) => {
       
        if (quantity == '6+') {
            this.setState({
                quantity: '',
                updatedkey: null,
                commerceItemId: commerceItemId,
                prevQuantity:prevQuantity
            });
           this.qtyInpuField.current.focus();
        }


    }

    /**
    * Updating quantity
    * @function updateIndex
    * @author prinshu.singh@zensar.com 
    * @desc Updating product item quantity to the state.
    * @param {string} key 
    * @param {string} quantity 
    * @param {string} commerceItemId 
    * 
    */
    updateIndex(key, quantity, commerceItemId) {
        this.setState({
            updatedkey: key,
            quantity: quantity,
            commerceItemId: commerceItemId
        })
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
        let {quantity, commerceItemId, key} = this.state

        const modalQty = {
            modalId: "qty-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "qty-modal",
            modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",
            modalContentClass: "modal-content"
        };

        return (
            <React.Fragment>
                {
                    this.props.purchaseType || this.props.promotionalParentSkuId ?
                        <label className="a-inlineElement d-lg-none -quantityReadOnly">{this.props.quantity}</label>
                        :

                        <parentContext.Consumer>
                            {({ OpenModal }) => (
                                <button className="m-product__qty d-lg-none -multiple" data-toggle="modal" data-target="#qty-modal" >
                                    <div className="row no-gutters">
                                         <div className="col p-0">
                                            <Input
                                                id={`pq-${key}`}
                                                reference={this.qtyInpuField}
                                                className="a-ProductQty__input -mobile -multiple"
                                                type="tel"
                                                name="product-quantity"
                                                value={quantity}
                                                onChange={this.onChangeQty}
                                                onClick={this.qtyEmpty}
                                                 onBlur={(e) => this.onBlurQty(e)}
                                                maxlength="3"
                                                data-toggle="modal" />
                                       </div>                           
                                    </div>
                                </button>
                            )}
                        </parentContext.Consumer>
                }
                {
                    this.state.updatedkey != null ? <parentContext.Consumer>
                        {({ showModal, SelectedModelData, closeModal }) => (showModal.QtyModelPromotion === true ?
                            <Modal modalDetails={modalQty} showModalpopUp={"QtyModelPromotion"} >
                                <QtyModelPromotion ModalpopUp={"QtyModelPromotion"} updateItemQuantity={this.updateItemQuantity} updateItemQuantityMore={this.updateItemQuantityMore} closeModal={closeModal} quantity={this.state.quantity} commerceItemId={this.state.commerceItemId} index={this.state.updatedkey} />
                            </Modal> : null
                        )}
                    </parentContext.Consumer> : ''
                }

            </React.Fragment>
        )

    }
}
