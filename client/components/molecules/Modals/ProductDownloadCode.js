import React from 'react';
import Modal from '../../../helpers/modal/modal';
import ModalHeader from './ModalHeader';
import { parentContext } from '../../../contexts/parentContext';
import {ParagraphGroup} from '../MixinMolecules/MixinMolecules'



export default (props) => {



	var modalHeader = {
		title: 'Descarga',
		titleType: 'h4',
		headlineAttributes: {
			"id":"download-modal"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type":"button",
			"data-dismiss":"modal",
			"aria-label":"Close"
		}
	}

	var paragraphGroup = [{
			text: '¿Cómo funcionan los códigos de descarga?',
			blockclass: 'mb-2'
		},{
			text: '',
			blockclass: 'a-product__paragraphProductDescriptionContentWeb m-0 mt-2 m-product__information--code'
		},{
			text: 'De inmediato recibirás un código de descarga, que podrás canjear directamente en la consola o en línea a través del sitio web.',
			blockclass: 'a-product__paragraphProductDescriptionContentWeb m-0 mt-2 m-product__information--code'
		},{
			text: '',
			blockclass: 'a-product__paragraphProductDescriptionContentWeb m-0 mt-2 m-product__information--code'
		},{
			text: 'Este código se almacenará en Mis pedidos de tu cuenta por si necesitas acceder a él más tarde.',
			blockclass: 'a-product__paragraphProductDescriptionContentWeb m-0 mt-2 m-product__information--code'
		}]


        return (
            <React.Fragment>
                <ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp} />
                <div className="modal-body">
                    <div className="row">
                        <div className="col-12 m-0 mb-3">
                            {paragraphGroup.map((item,i) => <ParagraphGroup key={i} blockclass={item.blockclass} text={item.text}/>)}
                        </div> 
                    </div>
                </div>
            </React.Fragment>
        );
}