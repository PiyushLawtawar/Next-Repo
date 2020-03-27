import React from 'react';
import Button from '../../atoms/Button/Button';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import get from 'lodash/get';
import MoleculeCellPhoneEmpty from '../../molecules/CellPhone/MoleculeCellPhoneEmpty';

class CardEmpty extends React.Component {
    
    render() {
        // const staticLabels = get(loginDetails, 'cartHeaderResponse.cartHeaderDetails.email', '');

        return (
            <div className="d-lg-block o-myAccount__cards--empty">
                <MoleculeCellPhoneEmpty staticLabels={this.props.staticLabels} route={this.props.route} /> 
            </div>
        )
    }
}

export default CardEmpty;