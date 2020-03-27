import React from 'react';
import StoreModalHeader from './StoreModalHeader';
import MoleculeList from '../../molecules/List/molecule-list';
import ModalHeader from './ModalHeader';

export default (props) => {
  var modalHeader = {
		title: props.title,
		titleType: 'h4',
		headlineAttributes: {
			"id":"gift-registry-modal"
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
      <div className={`o-product__modal modal fade ${props.show === true ? 'show' : ''}`} id="benefits-modal"  style={{display: props.show ? 'block': 'none'}}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" >
            <StoreModalHeader modalHeader={modalHeader} closeModal={props.showModal} notRequireArrow/>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div dangerouslySetInnerHTML={{ __html: props.staticLabels }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
     
  );
}


						