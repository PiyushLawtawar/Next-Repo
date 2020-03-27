import React from 'react';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default (props) => {

	const modalHeader = {
		title: 'Políticas',
		titleType: 'h4',
		headlineAttributes: {
			"id":"politics-modal"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type":"button",
			"data-dismiss":"modal",
			"aria-label":"Close"
		}
	}

   return (
    <React.Fragment>
        <ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp}/>
        <div className="modal-body" style={{overflow:"hidden auto", padding: props.forcePadding === true ? "1rem": 0}}>
			<div className="row">
				<div className="col-12">
					{/* <Paragraph className="a-product__paragraphProductPolitics">{props.productPolicies}</Paragraph> */}
					<div className="a-product__paragraphProductPolitics" dangerouslySetInnerHTML={{__html:props.productPolicies}} />
				</div>
			</div>
		</div>
    </React.Fragment>
   );
}