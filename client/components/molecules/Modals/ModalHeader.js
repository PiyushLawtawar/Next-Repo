import { H4 } from '../../atoms/HeadLines/Headlines';
import Button from "../../atoms/Button/Button";
import Icons from "../../atoms/Icons/Icons";
import { parentContext } from '../../../contexts/parentContext';

export default (props) => {
    

    const { title, titleType, headlineAttributes, close, buttonClass, buttonAttributes, requireArrow } = props.modalHeader;
    return (
         props.gRModel?
        <div className="o-findGiftTable__head">
            {requireArrow ? <parentContext.Consumer>
                {({ closeModal,updateCollProductId,updateSelectedState }) => (
                    <Icons className={`icon-back a-modalHeder__back`} data-dismiss="modal" aria-label="Close" onClick={() => {closeModal(props.ModalpopUp, props.modalToOpen) ; (props.fromCollection == true && updateSelectedState(props.modalProductDetails))}} />
                )}
            </parentContext.Consumer>: null}
            <a className="a-inlineElement a-inlineElement--enphasis" href='#'>{title}</a>
            {close &&
                <parentContext.Consumer>
                    {({ closeModal }) => (
                        <i className={'a-text icon-close a-closeGiftModal'} onClick={() => closeModal(props.ModalpopUp)} />
                    )}
                </parentContext.Consumer>
            }
        </div>
        :
        <div className="modal-header">
            {requireArrow ? <parentContext.Consumer>
                {({ closeModal,updateCollProductId,updateSelectedState }) => (
                    <Icons className={`icon-back a-modalHeder__back`} data-dismiss="modal" aria-label="Close" onClick={() => {closeModal(props.ModalpopUp, props.modalToOpen) ; (props.fromCollection == true && updateSelectedState(props.modalProductDetails))}} />
                )}
            </parentContext.Consumer>: null}
            <H4 className="modal-title" id={(headlineAttributes && headlineAttributes.id) ? headlineAttributes.id : ''} headLineText={title} />
            {close &&
                <parentContext.Consumer>
                    {({ closeModal }) => (
                        <Button
                            className={buttonClass}
                            type={(buttonAttributes && buttonAttributes.type) ? buttonAttributes.type : ''}
                            data-dismiss={(buttonAttributes && buttonAttributes["data-dismiss"]) ? buttonAttributes["data-dismiss"] : ''}
                            aria-label={(buttonAttributes && buttonAttributes["aria-label"]) ? buttonAttributes["aria-label"] : ''}
                            handleClick={() => closeModal(props.ModalpopUp)}
                        >
                            <Icons className="icon-close close"></Icons>
                        </Button>
                    )}
                </parentContext.Consumer>
            }
        </div>
    )
}