import React from 'react';
import map from 'lodash/map';
import ModalHeader from './ModalHeader';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from '../../atoms/Link/Link';

export default (props) => {
       // console.log("model------------->",props.quantity,props.commerceItemId)
    const modalHeader = {
        title: 'Cantidad',
        titleType: 'h4',
        headlineAttributes: {
            "id": "qty-modal"
        },
        buttonClass: 'close',
        buttonAttributes: {
            "type": "button",
            "data-dismiss": "modal",
            "aria-label": "Close"
        }
    };
    const onSelectModalQty = props.onSelectModalQty || (() => { });
    const closeModal = props.closeModal || (() => { });
    return (
     
        <React.Fragment>
            <ModalHeader modalHeader={modalHeader} />
            <div className="modal-body">
                <div className="row">
                    <div className="col-12">
                        <Ul>
                            {map([1, 2, 3, 4, 5], (qty, index) => {
                                return <List key={'qty' + index} className="a-product__anchorProductQuantity">
                                    <Link href="#" data-value={qty} data-dismiss="modal" onClick={(e) => { props.updateItemQuantity(props.commerceItemId, qty ,props.quantity); closeModal('QtyModelPromotion'); }} >{qty}</Link>
                                </List>
                            })}
                            <List className="a-product__anchorProductQuantity">
                                <Link href="#" data-value="plus" data-dismiss="modal" onClick={(e) => { props.updateItemQuantityMore('6+',props.commerceItemId,props.index,props.quantity); closeModal('QtyModelPromotion'); }}>6 +</Link>
                            </List>
                        </Ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}