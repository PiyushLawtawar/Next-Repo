import React from 'react';
import Span from '../../atoms/Span/Span';
import { ShowMotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Router from 'next/router';

//import './organism-cards-account.styl';

class CardRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { data } = this.props;
        const staticLabels = this.props.staticLabels;
        const options = [
            { text: staticLabels && staticLabels["pwa.viewPhone.edit.label"], onClick: () => Router.push('/tienda/users/editPhone?repositoryId='+ data.repositoryId), cls: "a-menuMotion__link dropdown-item ripple-motion" },
            { text: staticLabels && staticLabels["pwa.viewPhone.remove.label"], onClick: () => { this.props.setPhoneNoToDelete(data.repositoryId); this.props.openDeleteModal('deleteModal'); }, cls: "a-menuMotion__link dropdown-item ripple-motion" }

        ]
        return (
            <div className="col-12 mb-4 mb-lg-0 m-account__cardInfo -cellphone" >
            <div className="m-account__cardDetails mb-lg-0">
                <div className="row">
                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                        <Paragraph className="a-account__cardInfoLabel d-block d-lg-none">{staticLabels && staticLabels["pwa.viewPhone.name.label"]}</Paragraph>
                        <Span className="a-account__cardInfoText">{data.shortname}</Span>
                    </div>
                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                         <Paragraph className="a-account__cardInfoLabel d-block d-lg-none">{staticLabels && staticLabels["pwa.viewPhone.phoneNumber.label"]}</Paragraph>
                        <Span className="a-account__cardInfoText">{data.phoneNumber}</Span>
                    </div>
                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                         <Paragraph className="a-account__cardInfoLabel d-block d-lg-none">{staticLabels && staticLabels["pwa.viewPhone.service.label"]}</Paragraph>
                        <Span className="a-account__cardInfoText">{data.service}</Span>
                    </div>
                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                         <Paragraph className="a-account__cardInfoLabel d-block d-lg-none">{staticLabels && staticLabels["pwa.viewPhone.amount.label"]}</Paragraph>
                        <Span className="a-account__cardInfoText">{data.airTimeDisplayName}</Span>
                    </div>
                    <ShowMotion  options={options} />
                </div>
            </div>
        </div>

        )
    }
}

export default CardRow;