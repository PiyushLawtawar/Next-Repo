import isEmpty from 'lodash/isEmpty';
import { parentContext } from '../../contexts/parentContext';

const Modal = (props) => {
    const modalDetails = props.modalDetails || {};

    let modalClass = 'modal transitionEffect';
    if (modalDetails && modalDetails.modalClass) {
        modalClass = modalDetails.modalClass
    }
    const { isMybag, children } = props;
    let className = " show"
    return (
        <parentContext.Consumer>
            {({ showModal, closeModal, stopPropagationToChild }) => (

                props.gRModel?
                <div onClick={() => !props.desableOutsideClose && closeModal(props.showModalpopUp)} className={ props.ofindGiftTableClass + (showModal[props.showModalpopUp] ?  '-show modal' : '')} id={modalDetails.modalId ? modalDetails.modalId : " "}>
                    <div className={modalDetails.modalContentClass ? modalDetails.modalContentClass : "modal-content"} onClick={stopPropagationToChild} style={props.nestedModal === true ? {overflowX:"hidden", overflowY:"auto"} : {}}>
                                {props.children}
                    </div>
                    {/*<div className={(modalDetails.modalDialogClass ? modalDetails.modalDialogClass : "modal-dialog" + (showModal[props.showModalpopUp] && " show"))} role="document">
                            <div className={modalDetails.modalContentClass ? modalDetails.modalContentClass : "modal-content"} onClick={stopPropagationToChild}>
                                {props.children}
                            </div>
                    </div>*/}
                </div>
                :
                <div onClick={() => !props.desableOutsideClose && closeModal(props.showModalpopUp)} className={"modal-fixed-header " + modalClass + (showModal[props.showModalpopUp] ? className : '')} id={modalDetails.modalId ? modalDetails.modalId : "filters-modal"} tabIndex={modalDetails.modalTabIndex ? modalDetails.modalTabIndex : "-1"} role="dialog" aria-labelledby={modalDetails.modalAriaLabelledBy ? modalDetails.modalAriaLabelledBy : "filtersModalLabel"} aria-hidden="true" style={modalDetails.style}>
                    <div className={(modalDetails.modalDialogClass ? modalDetails.modalDialogClass : "modal-dialog" + (showModal[props.showModalpopUp] && " show"))} role="document">
                            <div className={modalDetails.modalContentClass ? modalDetails.modalContentClass : "modal-content"} onClick={stopPropagationToChild} style={props.nestedModal === true ? {overflowX:"hidden", overflowY:"auto"} : {}}>
                                {props.children}
                            </div>
                    </div>
                </div>
            )}
        </parentContext.Consumer>
    )
}

export default Modal;
