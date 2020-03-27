import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { ParagraphWithBlock } from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {

	const modalHeader = {
		title: 'Características',
		titleType: 'h4',
		headlineAttributes: {
			"id": "specs-modal"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type": "button",
			"data-dismiss": "modal",
			"aria-label": "Close"
		}
	};

	const specs = {
		bType: 'span',
		pText: 'Marca: ',
		pClass: 'a-product__paragraphProductSpecs spec',
		bText: 'LIEB BASICS',
		bClass: 'description ml-1'
	};
	const orderedData = props.orderedData || '';

	const overflowStyle = {
		overflowX: 'hidden',
		overflowY: 'auto',
		padding: props.forcePadding === true ? "1rem" : 0
	}
	return (
		<React.Fragment>
			<ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp} />
			<div className="modal-body" style={props.isMobile ? overflowStyle : {padding: props.forcePadding === true ? "1rem" : 0 }}>
				<div className="row">
					<div className="col-12">
						{/*{map([1,2,3,4,5,6,7,8], (item, i) => {
						return <ParagraphWithBlock key={i} blockclass={specs.pClass} text={specs.pText} spanClassname={specs.bClass} spanText={specs.bText} />
					})}*/}
						{/* {productFeatures && 
						<div>{productFeatures}</div>
					} */}
						{orderedData && orderedData.length > 0 ? <>
							{orderedData.length > 0 && orderedData.map((features, i) => {
								return <p key={i} className="a-product__paragraphProductSpecs spec">{Object.keys(features)}: <span className="description ml-1">{Object.values(features)}</span>
								</p>
							})}
						</> : null}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}