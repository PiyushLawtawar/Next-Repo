import React from 'react';
import Button from '../../atoms/Button/Button';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Router from 'next/router';

class MoleculeCellPhoneEmpty extends React.Component {

    onHandleClick = () => {
        if (this.props.route === 'cellPhone') {
            Router.push('/tienda/users/addPhone')
        } else {
            Router.push('/tienda/users/newCreditCard')
        }
    }

    render() {
        const staticLabels = this.props && this.props.staticLabels;
                // console.log('statis-----',staticLabels)

        return (
            <div className="row m-0">
                <div className="col-12 mb-4 mb-lg-0 m-account__cardInfo mt-lg-2 --empty">
                    <div className="m-account__cardDetails mb-lg-0">
                        <Paragraph className="a-account__cardInfoEmpty">{staticLabels && (staticLabels["pwa.emptyPhone.label"] || staticLabels["pwa.creditCardsPage.noRegisteredCards.text"])}</Paragraph>
                        {/*<Paragraph className="a-account__cardInfoEmpty">{staticLabels && staticLabels["pwa.emptyPhone.labe"]}</Paragraph>*/}
                    </div>
                </div>
                <div className="col-12 col-lg-3 mb-3 px-0 mb-lg-1 mt-2">          
                    <Button handleClick={this.onHandleClick} className="a-btn a-btn--primary">{staticLabels && (staticLabels["pwa.viewPhone.telefono.label"] || staticLabels["pwa.creditCardsPage.agregartarjeta.label"])}</Button>
                </div>
            </div>
        )
    }
}
export default MoleculeCellPhoneEmpty;      