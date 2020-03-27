import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import MyBagModalHeader from './MyBagModalHeader';
import ModalHeader from '../Modals/ModalHeader';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailability from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailability';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';



export default class extends React.Component {
    constructor(props) {
        super(props)
        this.fData = {},
        this.state={
            message:'',
            itemEventId:'',
            shippingGroupId: this.props.gROne || 'sg'
        }
    }

    render() {

        const data = this.props.gREventsOwnersData;
          const fData = Object.assign({
            actionType: 'toNonGR',
            shippingGroupId: this.props.gROne
        })
        const modalHeader = {
            title: 'To return',
            titleType: 'link',
            headlineAttributes: {
                "id": "availability-modal"
            },
            close: true,
            back: true,
            buttonClass: 'close',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            headerClass:'o-dontGiftTable__head'
        };
        return (
            <React.Fragment >
                <MyBagModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} toNonGR={true}/>
                <div className="o-dontGiftTable__body">
                    <div className="o-dontGiftTable__items" name="dontGiftTableMessage">
                         <p className="a-blockElement a-blockElement--enphasis">¿Estás seguro de quitar la selección de mesa de regalos para este artículo?</p>
                    </div>
                    <div className="o-dontGiftTable__items thirdParties" name="dontGiftTable">
                        <parentContext.Consumer>
                            {({ closeModal }) => (
                                <Button className="a-btn a-btn--primary dontGiftTable" id="dontGiftTable" handleClick={() => { this.props.convertToGRItem(fData, closeModal, false) }}>Aceptar</Button>
                            )}
                        </parentContext.Consumer>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}