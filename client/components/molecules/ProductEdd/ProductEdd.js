//import './ProductEdd.styl'

/*include ../MixinMolecules/mixin-molecules
include ../../atoms/Icons/atom-icon*/
import React from 'react'
import Button from '../../atoms/Button/Button'
import Span from '../../atoms/Span/Span'
import Icons from "../../atoms/Icons/Icons";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { parentContext } from '../../../contexts/parentContext';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = { EdRange: props.EdRange, EdDateStore: "", eddClassName: "a-product__eddPreOrder -green m-0", SelectedEdd:{} } /*Added for Edd in collection add to cart */
    }
    componentWillReceiveProps(nextprops){
        if(this.props.isCollection != true){
            this.setState({EdRange:nextprops.EdRange, EdDateStore: nextprops.EdDateStore, eddClassName:nextprops.eddClassName })
        }
    }
    updateRangeMessae = (Message, EdDateStore, eddClassName, SelectedEdd) => { /*Added for Edd in collection add to cart */
        
        this.setState({ EdRange: Message, EdDateStore, eddClassName, SelectedEdd }) /*Added for Edd in collection add to cart */
    }
    render() {
        const productCodeVal = this.props.modalProductDetails && this.props.modalProductDetails.ProductCode || '';
        const { EdRange = "", EdDateStore = "", eddClassName = "a-product__eddPreOrder -green m-0", SelectedEdd } = this.state /*Added for Edd in collection add to cart */
        
        return (
            <div className="m-product__edd mt-lg-1"> {/* Defect 22981 - removed "mt-4" */}
                <div className="row">
                    <parentContext.Consumer>
                        {({ OpenModal, updateSelectedState, selectedEddState }) => (
                            EdRange == "" ?
                                <div className="col-12 mb-3 " id="m-product__eddBox" >
                                    <div className="m-product__giftPurchase-container -small" onClick={() => { this.props.bundleMsg == "" ? this.props.check_product_sku_selection().then(() => { OpenModal('showModal1'); updateSelectedState(this, this.props.modalProductDetails); selectedEddState(this) }) : "" }}>
                                        <div className="a-btn a-btn--action" ripple="" data-toggle="modal" data-target="#edd-modal" id="a-edd-modal__btn">
                                            <Span>{this.props.edLabel}</Span><Icons className="icon-arrow_right" />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="col-12 mb-3" id="m-product__preOrderContainer">
                                    <div className="m-product__eddDate a-btn--action" data-target="#edd-modal" data-toggle="modal" onClick={() => { this.props.bundleMsg == "" ? this.props.check_product_sku_selection().then(() => { OpenModal('showModal1'); updateSelectedState(this.props.modalProductDetails); selectedEddState(this) }) : "" }}>
                                        <Paragraph className="a-product__eddDateLabel m-0">{`${this.props.edLabel}:`}</Paragraph>
                                        <Paragraph className={eddClassName} id={"eddRange" + productCodeVal}>{EdRange != "" ? EdRange : this.props.EdPreOrder}</Paragraph>
                                        {EdDateStore != "" && <Paragraph id={"eddStore" + productCodeVal} name={SelectedEdd} className="a-product__eddDateStore m-0">{EdDateStore}</Paragraph>} {/*Added for Edd in collection add to cart */}
                                        {this.props.bundleMsg == "" && <Icons className="float-right icon-arrow_right" />}
                                    </div>
                                </div>
                        )}
                    </parentContext.Consumer>
                </div>
            </div>

        );
    }
}

