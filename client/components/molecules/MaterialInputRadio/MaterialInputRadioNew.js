import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Image from '../../atoms/Tagimage/Image';
import Span from '../../atoms/Span/Span';

//import './MaterialInputRadio.styl';

export default (props) => {
        
    const options = props.options;
    const { onClick = () => {} } = options;

    return (
        <div className="m-radioButton mdc-form-field">
            <div className={"mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" + ((options.disabled == 'true') ? ' mdc-radio--disabled':'')} >
                <Input className="a-radio__input mdc-radio__native-control" type="radio" name={options.nameInput} id={options.inputId} value={options.inputId} checked={options.checked} disabled={(options.disabled == 'true')?'disabled':''} onClick={onClick}/>
                <div className="mdc-radio__background">
                    <div className="mdc-radio__outer-circle"></div>
                    <div className="mdc-radio__inner-circle"></div>
                </div>
            </div>
            {options.imgSrc &&
                <Image src={options.imgSrc} alt={options.imgAlt} />
            }
            <Label className={options.labelClass ? options.labelClass : ""} for={options.inputId}>
                 {options.labelText && options.HTMLrequired ?
                    <div dangerouslySetInnerHTML={{ __html: options.labelText }} ></div> : options.labelText
                    } 
                {options.labelTextSpan &&
                    <React.Fragment>
                        <br /><Span className={options.labelSpanClass ? options.labelSpanClass : ""}>{options.labelTextSpan}</Span>
                    </React.Fragment>
                }
                {options.defaultSpanText &&
                    <React.Fragment><br /> <Span className={options.labelSpanClass ? options.labelSpanClass : ""}>{options.defaultAddressId == options.inputId ? "default" : ""}</Span></React.Fragment>
                }
            </Label>
        </div>
    );
}
