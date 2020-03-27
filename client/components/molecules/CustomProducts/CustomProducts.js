import React, { Component } from 'react';
import { parentContext } from '../../../contexts/parentContext';
import Span from '../../atoms/Span/Span'
import Icons from "../../atoms/Icons/Icons";
import isEmpty from 'lodash/isEmpty';

class CustomProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customSkus: [],
            textState: false,
            colorState: false,
            fontState: false
        }
    }

    getSkus = () => {
        try {
            fetch('https://us-central1-productospersonalizados-edea9.cloudfunctions.net/getSkus',{
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.setState({
                        customSkus: res.data
                    });
                    this.props.handleGetCustomSkus(res.data);
                    this.props.handleGetSku(res.data);
                }
            })
            .catch(err => console.log("ERROR FETCH ", err));
        } catch(err) {
            console.log("ERROR GET SKUS", err);
        }
    };

    componentDidMount() {
        this.getSkus();
        this.showTextProduct();
    }

    showTextProduct = () => {
        const data = JSON.parse(localStorage.getItem('customProduct'));

        if (data !== null && data !== undefined) {

            data.map(item => {
                if (item.sku === this.props.productId) {
                    if (!this.state.text && !this.state.color && !this.state.font) {
                        this.setState({
                            textState: item.text.charAt(0).toUpperCase() + item.text.slice(1).toLowerCase(),
                            colorState: item.color.charAt(0).toUpperCase() + item.color.slice(1).toLowerCase(),
                            fontState: item.font
                        })
                    }

                }
            })
        } 
        return null;
    }
    
    render() {
        const { customSkus, textState, fontState, colorState } = this.state;
        const { productId, text, font, color } = this.props;

        return (
            <React.Fragment>

                { customSkus.map((item, i) => {
                    if (item.sku === productId && item.activate === true ) {
                        return (
                            <div className="m-product__itr">
                                <div className="row">
                                    <parentContext.Consumer>
                                        {({ OpenModal }) => (
                                            <div className="col-12 mb-3">
                                                <div 
                                                    className="m-customProduct a-btn a-btn--action m-customProduct"
                                                    onClick={() => { OpenModal('showModalPersonalization'); }}
                                                >
                                                    <div className="a-customProduct__imgText">
                                                        <img src={item.image} 
                                                            alt="Bota Navideña" 
                                                            width="50" 
                                                        />
                                                        <div className="title-font">
                                                            <Span>Personaliza tu bota</Span>
                                                            <Span>
                                                                { (text && font && color) 
                                                                    ? `${text}, ${color}, ${font}`   
                                                                    : ((textState && colorState && fontState)
                                                                        ? `${textState}, ${colorState}, ${fontState}`
                                                                        : null
                                                                    )                                                                 
                                                                }
                                                            </Span>
                                                        </div>
                                                    </div>
                                                    <Icons className="icon-arrow_right" />
                                                </div>
                                            </div>
                                        )}
                                    </parentContext.Consumer>
                                </div>
                            </div>
                        )
                    }
                    return null;
                })}
            </React.Fragment>
        );
    }
}

export default CustomProducts;