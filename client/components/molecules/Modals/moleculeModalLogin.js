import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import ModalHeader from './ModalHeader';
import { parentContext } from '../../../contexts/parentContext';

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var modalHeader = {
      title: 'Eliminar teléfono',
      titleType: 'h4',
      back: false,
      headlineAttributes: {
        "id": "a-airTime-title__modal"
      },
      close: true,
      buttonClass: 'close a-eddBox__closeButton',
      buttonAttributes: {
        "type": "button",
        // "data-dismiss": "modal",
        "aria-label": "Close"
      }
    }

    return (
      <parentContext.Consumer>
        {({ closeModal }) => (
          <React.Fragment>
            {/*<div className="o-product__modal modal fade modal-filters__storeLocator show" id="AirTime-removeCellphone" tabindex="1" role="dialog" aria-labelledby="storeLocator-modal" aria-modal="true">
              <div className="modal-dialog modal-sm modal-dialog-centered modal-small" role="document">
                <div className="modal-content">*/}
                  <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp}/>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-12 text-center">
                        <Paragraph>¿Estás seguro que deseas eliminar este teléfono? También se eliminará de tus teléfonos en Mi Cuenta</Paragraph>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 offset-lg-4 col-12">
                        <Button handleClick={() => { this.props.deleteCreditCard(); closeModal(this.props.ModalpopUp)}} className="a-btn a-btn--primary mt-5" data-dismiss="modal">Aceptar</Button>
                      </div>
                    </div>
                  </div>
                {/*</div>
              </div>
            </div>*/}
          </React.Fragment>
        )}
      </parentContext.Consumer>
    );
  }

}