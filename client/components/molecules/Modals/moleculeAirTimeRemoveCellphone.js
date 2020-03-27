import React from 'react';
import Button from '../../atoms/Button/Button';
import Label from '../../atoms/Label/Label';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Searchbar from '../../molecules/Searchbar/Searchbar'
import ModalHeader from './ModalHeader';

export default (props) => {
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
      "data-dismiss": "modal",
      "aria-label": "Close"
    }
  }
  return (
    <React.Fragment>
      <div className="o-product__modal modal fade modal-filters__storeLocator show" id="AirTime-removeCellphone" tabindex="1" role="dialog" aria-labelledby="storeLocator-modal" aria-modal="true" style="padding-right: 5px; display: block;">
        <div className="modal-dialog modal-sm modal-dialog-centered modal-small" role="document">
          <div className="modal-content">
            <ModalHeader modalHeader={modalHeader} />
            <div className="modal-body">
              <div className="row">
                <div className="col-12 text-center">
                  <Paragraph>¿Estás seguro que deseas eliminar este teléfono? También se eliminará de tus teléfonos en Mi Cuenta</Paragraph>

                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 offset-lg-4 col-12">
                  <Button className="a-btn a-btn--primary mt-5" data-dismiss="modal">Aceptar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
