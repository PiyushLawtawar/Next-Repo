
import Label from "../../atoms/Label/Label";
import Input from "../../atoms/Input/Input";
//import './MaterialInputCheckBox.styl'

export default (props) => {

        return (
                <div className ={`${props.extraClass} m-checkbox__button mdc-form-field ${props.showClass ? "m-plp-compareCheckbox" : ""}`}>
                        < div className = {
                                "m-checkbox mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded " + (props.value && "mdc-ripple-upgraded--background-focused mdc-checkbox--selected")
                        } >
                                <Input className="a-checkbox__input mdc-checkbox__native-control" type="checkbox" name={props.name} id={props.id} checked={props.checked} onClick={props.onClick} onChange={props.onChange} />
                                <div className="mdc-checkbox__background">
                                        <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                                <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                        </svg>
                                        <div className="mdc-checkbox__mixedmark"></div>
                                </div>
                        </div>

                        <Label for={!props.noFor ? props.id : ""} onClick={(e) => { e.stopPropagation(); props.lableOnClick && props.lableOnClick(e); }}>{props.text}</Label>
                </div>

        );
}
