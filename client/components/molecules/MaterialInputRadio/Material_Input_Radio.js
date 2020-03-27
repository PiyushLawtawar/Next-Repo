import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Image from '../../atoms/Tagimage/Image';
import Span from '../../atoms/Span/Span';
import Alert from '../Alert/Alert';
//import './MaterialInputRadio.styl';

export default (props) => {
    return (
        <div className="m-radioButton mdc-form-field">
            <div className="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" >
                <Input
                    className="a-radio__input mdc-radio__native-control"
                    type="radio"
                    name={props.name}
                    value={props.value}
                    checked={props.checked}
                    onChange={props.onChange}
                    disabled={(props.disabled && props.disabled != undefined)? true: false}
                    id={props.id}
                    />
                     {props.name ==='storeSelection' && props.userselection_state && JSON.stringify(props.userselection_state).trim()!=='' && props.show_alert && props.alert_msg && typeof props.alert_msg ==='string' && (props.checked === 'true' || props.checked === true)  
                              //props.show_alert(props.alert_msg)
                              //console.log(props.alert_msg)
                            }
                <div className="mdc-radio__background">
                    <div className="mdc-radio__outer-circle"></div>
                    <div className="mdc-radio__inner-circle"></div>
                </div>
            </div>
        </div>
    );
}
