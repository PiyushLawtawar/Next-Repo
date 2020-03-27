import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import ModalHeader from './ModalHeader';
import { parentContext } from '../../../contexts/parentContext';


export default class extends React.Component {
    constructor() {
        super()
        this.state = {};
    }
    render() {

        const deleteModalData = this.props.deleteModalData;
        const staticLabels = this.props.staticLabels;
        const staticPhoneData = this.props.staticPhoneData;

        var modalHeader = {
            title: staticPhoneData ? staticPhoneData && staticPhoneData["pwa.viewPhone.eltelefono.label"] : (staticLabels ? staticLabels && staticLabels["pwa.creditCardsPage.tarjeta1.label"] : deleteModalData && deleteModalData["pwa.addressPage.EliminarAddress.label"]),
            titleType: 'h4',
            headlineAttributes: {
                // "id": staticLabels && staticLabels["pwa.creditCardsPage.tarjeta1.label"] ? "delete-modal-myAcccount" : "delete-modal"
            "id": "delete-modal"
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
            <parentContext.Consumer>
                {({ closeModal }) => (
                    <React.Fragment>
                        <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <Paragraph className="a-delete__message">{staticPhoneData ? staticPhoneData && staticPhoneData["pwa.viewPhone.eliminar.label"] : (staticLabels ? staticLabels && staticLabels["pwa.creditCardsPage.deseas.label"] : deleteModalData && deleteModalData["pwa.addressPage.deseas.label"])}</Paragraph>
                                    <Button handleClick={() => { this.props.deleteCreditCard(); closeModal(this.props.ModalpopUp) }} className="a-btn a-btn--primary">{staticPhoneData ? staticPhoneData && staticPhoneData["pwa.addNewPhone.add.label"] : (staticLabels ? staticLabels && staticLabels["pwa.newCreditCardPage.okButton.label"] : deleteModalData && deleteModalData["pwa.newShippingAddressPage.Aceptar.text"])}</Button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        );
    }

}
