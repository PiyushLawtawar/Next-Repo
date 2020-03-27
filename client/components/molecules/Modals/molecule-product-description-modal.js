import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { H4 } from '../../atoms/HeadLines/Headlines';
import ModalHeader from './ModalHeader';
export default (props) => { 
       // console.log('description data.....',props.productLongDescription)
        const data =props.productLongDescription;
        var modalHeader = {
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
    // console.log('contents...................', props.productLongDescription)  
	const productLongDescription = props.productLongDescription || '';         
    return (
        <React.Fragment>
                 <ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp} />
                  <div className="modal-body">
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
