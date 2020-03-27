import React from 'react';
import Button from '../../atoms/Button/Button';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { ShowMotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';


class CardsAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    setDefaultCreditCard = (nickName) => {
        const payload = {
            "nickname": nickName
        };

        Utility(Path.setDefaultCreditCard, 'POST', payload).then(response => {
            if (response.data && response.data.s !== undefined && response.data.s === "0") {
                this.props.getCreditCards();
            }
        }, (error) => {
        });

    }
    nullCheck = (data) => {
        return data || ''
    }
    render() {

        const staticLabels = this.props.staticLabels;
        const { data, defaultCreditCardId } = this.props;
        const address = data.billingAddress;
        const creditCardNumber = data && data.creditCardNumber&&data.creditCardNumber.substr(data.creditCardNumber.length - 4);
        const optionsForDefault = [
            { text: staticLabels && staticLabels["pwa.creditCardsPage.Editar.label"], onClick: () => Router.push('/tienda/users/editCreditCard?creditCardId=' + data.repositoryId) }
        ];
        const options = [
            { text: staticLabels && staticLabels["pwa.creditCardsPage.predeterminada.label"], onClick: () => this.setDefaultCreditCard(data.nickName) },
            { text: staticLabels && staticLabels["pwa.creditCardsPage.editButton.label"], onClick: () => Router.push('/tienda/users/editCreditCard?creditCardId=' + data.repositoryId) },
            { text: staticLabels && staticLabels["pwa.creditCardsPage.Eliminar.label"], onClick: () => { this.props.setAddressToDelete(data.nickName); this.props.openDeleteModal('deleteModal') } }

        ]
        return (

            <div className="col-lg-4">
                <div className="m-box m-cardBox mb-4">
                    <div className="row">
                        <div className="col-11">
                            <H1 headLineText={data.nickName} headLineClass="a-cards__titleCard" />
                            <Span spanClassname="a-cards__defaultTitle">{data.repositoryId === defaultCreditCardId && 'Predeterminada'}</Span>
                            <Paragraph className="a-cards__titleCardBox"> {staticLabels && staticLabels["pwa.creditCardsPage.rowHeader1.label"]}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox" id="typeCard">{data.creditCardType}</Paragraph>
                            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.creditCardsPage.rowHeader2.label"]}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox">*{creditCardNumber}</Paragraph>
                            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.creditCardsPage.rowHeader3.label"]}  </Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox">{this.nullCheck(address.firstName) + ' ' + this.nullCheck(address.middleName) + ' ' +
                                this.nullCheck(address.lastName) + ' ' + this.nullCheck(address.maternalName)}</Paragraph>
                            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.newCreditCardPage.addressheading.label"]}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox">{this.nullCheck(address.address1) + ', ' + this.nullCheck(address.exteriorNumber) + ' ' +
                                this.nullCheck(address.interiorNumber) + ' ' + this.nullCheck(address.building) + ', ' + this.nullCheck(address.city) + ', ' + this.nullCheck(address.neighbourhood) +
                                ', ' + this.nullCheck(address.delegationMunicipality) + ', ' + this.nullCheck(address.postalCode) + ' ' + this.nullCheck(address.country) + ', ' +
                                this.nullCheck(address.state)}</Paragraph>
                            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.displayAddressInfoPage.Streets.Text"]}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox">{this.nullCheck(address.address2) + (address.address2 && address.address3 ? ' y ' : '') +
                                this.nullCheck(address.address3)}</Paragraph>
                            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.displayAddressInfoPage.Phone.Text"]} </Paragraph>
                            {address.phoneNumber && <Paragraph className="a-cards__descriptionCardBox  m-0">{address.phoneNumber}</Paragraph>}
                            {address.businessPhoneNumber && <Paragraph className="a-cards__descriptionCardBox">{this.nullCheck(address.businessPhoneNumber)}</Paragraph>}
                            {address.cellular && <Paragraph className="a-cards__descriptionCardBox">{this.nullCheck(address.cellular)}</Paragraph>}
                        </div>
                        <div className="col-1 p-0">
                            <ShowMotion transform={data.repositoryId === defaultCreditCardId ? null : -263} options={data.repositoryId === defaultCreditCardId ? optionsForDefault : options} />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default CardsAccount;    