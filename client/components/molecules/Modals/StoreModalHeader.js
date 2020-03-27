import { H4 } from '../../atoms/HeadLines/Headlines';
import Button from "../../atoms/Button/Button";
import Icons from "../../atoms/Icons/Icons";

export default (props) => {


    const { title, titleType, headlineAttributes, close, buttonClass, buttonAttributes, requireArrow, } = props.modalHeader;
    return (
        <div className="modal-header" style={{ position: 'initial' }}>
            {
                !props.notRequireArrow && <Icons className="icon-back a-modalHeder__back" data-dismiss="modal" aria-label="Close" onClick={() => props.goBack()} />
            }
            <H4 className="modal-title" id={(headlineAttributes && headlineAttributes.id) ? headlineAttributes.id : ''} headLineText={title} />
            {
                <Button
                    className={buttonClass}
                    type={(buttonAttributes && buttonAttributes.type) ? buttonAttributes.type : ''}
                    data-dismiss={(buttonAttributes && buttonAttributes["data-dismiss"]) ? buttonAttributes["data-dismiss"] : ''}
                    aria-label={(buttonAttributes && buttonAttributes["aria-label"]) ? buttonAttributes["aria-label"] : ''}
                    handleClick={() => props.closeModal()}
                >
                    <Icons className="icon-close close"></Icons>
                </Button>
            }
        </div>
    )
}