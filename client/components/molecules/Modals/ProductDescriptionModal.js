import React from 'react';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default (props) => {

    const modalHeader = {
		title: 'Descripción',
		titleType: 'h4',
		headlineAttributes: {
			"id":"description-modal"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type":"button",
			"data-dismiss":"modal",
			"aria-label":"Close"
		}
	};
	const productLongDescription = props.productLongDescription || '';
   return (
    <React.Fragment>
        <ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp}/>
        <div className="modal-body" style={{overflow:"hidden auto", padding: props.forcePadding === true ? "1rem": 0}}>
			<div className="row">
				<div className="col-12">
					{productLongDescription && 
						<div className="a-product__paragraphProductDescription" dangerouslySetInnerHTML={{__html: productLongDescription}}></div>
					}
				</div>
			</div>
		</div>
    </React.Fragment>
   );
}