import React from 'react';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import isEmpty from 'lodash/isEmpty';

export default (props) => {

	const modalHeader = {
		title: 'Información Extra',
		titleType: 'h4',
		headlineAttributes: {
			"id": "informacion_extra"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type": "button",
			"data-dismiss": "modal",
			"aria-label": "Close"
		}
	}
	
	return (
		<React.Fragment>
			<ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp} />
			<div className="modal-body" style={{overflow:"hidden auto", padding: props.forcePadding === true ? "1rem": 0}}>
				<div className="row">
					<div className="col-12">
						{!isEmpty(props.extraInformationWeb) ?
							<div dangerouslySetInnerHTML={{ __html: props.extraInformationWeb }}></div>
							:
							!isEmpty(props.extraInformationWap) ?
								<div dangerouslySetInnerHTML={{ __html: props.extraInformationWap }}></div>
								: null
						}
					</div>
				</div>
			</div>
			}
    </React.Fragment>

	);

}