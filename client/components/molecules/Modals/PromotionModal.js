import React from 'react';
import map from 'lodash/map';
import ModalHeader from './ModalHeader';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from '../../atoms/Link/Link';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
 let promotionData=[]
       map(this.props.PromotionalData[0],(data)=>{
           if(data !== this.props.PromotionalData[0].catalogRefId){
               promotionData.push(data)
           }

       })
       //console.log("promotional model--------->",promotionData)
        const modalHeader = {
            title: 'Elige una promoción',
            titleType: 'h4',
            headlineAttributes: {
                "id": "promotion-modal"
            },
            buttonClass: 'close',
            close: true,
            buttonClass: 'close a-eddBox__closeButton',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            }
        };
        const onSelectModalQty = this.props.onSelectModalQty || (() => { });
        const closeModal = this.props.closeModal || (() => { });
        return (
            <React.Fragment>
                <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
                <div className="modal-body pt-2">
                    <div className="row m-checkout__promotionsWrapper">
                        <div className="col-12 p-0">
                            <Ul className="a-checkout_promoList">
                                {map(promotionData, (qty, index) => {
                                    return <li key={'qty' + index} className="a-checkout_promoListElement" onClick={() => { onSelectModalQty(qty, this.props.commerceItemId); closeModal('PromotionModal') }} >
                                        <span dangerouslySetInnerHTML={{__html: qty.promoDescriptionPwa}}></span>
                                        <i className="icon-arrow_right"></i>
                                    </li>
                                })}
                            </Ul>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
