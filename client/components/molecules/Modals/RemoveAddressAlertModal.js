import React from 'react';
import map from 'lodash/map';
import { H5 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from "../../atoms/Button/Button";

export default (props) => {

   const labels = props.labels || {}

   return (
        <div className="m-modal modal fade show" onClick={props.onClick}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" onClick={(e)=>{ e.stopPropagation(); }} style={{maxHeight: 200}}>
                    <div className="modal-header">
                        <H5 className="modal-title" id="exampleModalLongTitle" headLineText={labels['pwa.addressFormPage.deleteAddress.label'] || "Eliminar dirección"}></H5>
                        <Button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={props.onClick}><span aria-hidden="true">×</span></Button>
                    </div>                    
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-12 text-center">
                                <Paragraph className="a-modal__bodyText">{labels['pwa.addressFormPage.deleteAddressConfirmation.label'] || "¿Estás seguro que deseas eliminar esta dirección?"}</Paragraph>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-4">
                                <Button className="a-btn a-btn--primary" ripple="" onClick={(e)=>props.confirmRemoveAddress()}>{labels['pwa.addressFormPage.accept.label'] || "Aceptar"}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   );
}
