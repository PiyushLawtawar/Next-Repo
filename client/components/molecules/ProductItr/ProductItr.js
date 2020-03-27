import { parentContext } from '../../../contexts/parentContext';
import Span from '../../atoms/Span/Span'
import Icons from "../../atoms/Icons/Icons";

//import './ProductItr.styl'

export default (props) => {

    return (
        <div className="m-product__itr">
            <div className="row">
                <parentContext.Consumer>
                    {({ OpenModal, updateSelectedState }) => (
                        <div className="col-12 mb-3 " >
                            <div className="m-product__giftPurchase-container -small" onClick={() => { props.check_product_sku_selection().then(() => { OpenModal('showModal2'); updateSelectedState(props.modalProductDetails) }); }}>
                                <div className="a-btn a-btn--action" ripple="" data-toggle="modal" data-target="#itr-modal" id="a-itr-modal__btn">
                                    <Span>{props.ItrBtnText}</Span><Icons className="icon-arrow_right" />
                                </div>
                            </div>
                        </div>
                        // <ButtonHeadIcon
                        //     handleClick={() => { props.check_product_sku_selection().then(() => { OpenModal('showModal2'); updateSelectedState(props.modalProductDetails) }); }}
                        //     btnclass={props.btnclass}
                        //     btntext={props.ItrBtnText}
                        //     ripple=""
                        //     data-toggle="modal"
                        //     data-target="#itr-modal"
                        //     id="a-itr-modal__btn"
                        //     iconclass="icon-arrow_right"
                        // />
                    )}
                </parentContext.Consumer>
            </div>
        </div>

    );
}


