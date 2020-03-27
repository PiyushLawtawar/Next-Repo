import React from 'react';
import Button from '../../atoms/Button/Button';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { ShowMotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import DeleteModal from '../../molecules/Modals/moleculeModalDelete';
import Modal from '../../../helpers/modal/modal';
import { parentContext } from '../../../contexts/parentContext';
import CardBlock from './CardBlock';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';

class CardsAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: {},
            usernickName: null
        };
    }

    deleteCreditCard = (nickName) => {
        const payload = {
            "nickname": this.state.usernickName
        };
        Utility(Path.removeCreditCard, 'POST', payload).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                this.props.cardRecord();
            }
        }, (error) => {
        });
    }

    setAddressToDelete = usernickName => {
        this.setState({ usernickName })
    }
    render() {
        const staticLabels = this.props.staticLabels;
        const modalDelete = {
            modalId: "delete-modal",
            modalClass: "o-product__modal modal fade account-show",
            modalTabIndex: "1",
            modalAriaLabelledBy: "delete-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };
        const { cardData } = this.props;
        return (
            <parentContext.Consumer >
                {({ OpenModal }) => (
                    <div className="o-myAccount__cards -default">
                        <div className="row d-none d-lg-block">
                            <div className="col-lg-3 mb-2">
                                <Button handleClick={() => Router.push("/tienda/users/newCreditCard")} className="a-btn a-btn--primary">{staticLabels && staticLabels["pwa.creditCardsPage.agregartarjeta.label"]}</Button>
                            </div>
                        </div>
                        <div className="row">
                            {cardData && cardData.records ? cardData.records.map((data, index) => <CardBlock key={index} staticLabels={staticLabels} getCreditCards={this.props.cardRecord} setAddressToDelete={this.setAddressToDelete} openDeleteModal={OpenModal} data={data} defaultCreditCardId={cardData.defaultCreditCardId} />) : null}
                        </div>
                        <div className="row d-block d-lg-none">
                            <div className="col-lg-4 mb-4">
                                <Button className="a-btn a-btn--primary" handleClick={() => Router.push("/tienda/users/newCreditCard")}>{staticLabels && staticLabels["pwa.creditCardsPage.agregartarjeta.label"]}</Button>
                            </div>
                        </div>
                        <Modal modalDetails={modalDelete} showModalpopUp={'deleteModal'}>
                            <DeleteModal staticLabels={staticLabels} deleteCreditCard={this.deleteCreditCard} ModalpopUp={"deleteModal"} />
                        </Modal>
                    </div>
                )}
            </parentContext.Consumer>
        )
    }
}

export default CardsAccount;