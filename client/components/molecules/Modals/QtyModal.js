import React from 'react';
import map from 'lodash/map';
import ModalHeader from './ModalHeader';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from '../../atoms/Link/Link';

export default (props) => {
	const modalHeader = {
		title: 'Cantidad',
		titleType: 'h4',
		headlineAttributes: {
			"id":"qty-modal"
		},
		buttonClass: 'close',
		buttonAttributes: {
			"type":"button",
			"data-dismiss":"modal",
			"aria-label":"Close"
		}
	};
	let onSelectModalQty = props.onSelectModalQty || (() => {}) ;
	const closeModal = props.closeModal || (() => {});
	
   return (
    <React.Fragment>
        <ModalHeader modalHeader={modalHeader} />
        <div className="modal-body">
			<div className="row">   
				<div className="col-12">
					<Ul>
						{map([1, 2, 3, 4, 5], (qty, index) => {
							return <List key={'qty'+index} className="a-product__anchorProductQuantity">
										<Link  data-value={qty} data-dismiss="modal" onClick={() => { onSelectModalQty(qty); closeModal('showModal6');} } >{qty}</Link>
									</List>
						})}
						<List className="a-product__anchorProductQuantity">
							<Link  data-value="plus" data-dismiss="modal" onClick={() => { onSelectModalQty('6+'); closeModal('showModal6');} }>6 +</Link>
						</List>
					</Ul>
				</div>
			</div>
		</div>
    </React.Fragment>
   );
}