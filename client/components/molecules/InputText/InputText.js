import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Label from "../../atoms/Label/Label";
import Input from "../../atoms/Input/Input";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { MDCTextField } from '@material/textfield';
//import "./InputText.styl";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { focus: false, value: '', showError: '', showOptional: '', onLoads:true }
        this.textInput = React.createRef();
    }

    componentDidMount() {
        if (this.props.inputValue) {
            this.setState({ value: this.props.inputValue })
        }
        if (this.props.options && this.props.options.labelText) {
            this.adjustLabelWidth(1000);
        }
        if (this.props && this.props.options && this.props.options.showOptional) {
            this.setState({ showOptional: this.props.options.showOptional })
        }
    }

    componentWillReceiveProps(nextProps, prev) {
        if (nextProps.inputValue != undefined) {
            this.setState({ value: nextProps.inputValue })
            if(nextProps.error) {
                this.setState({ showOptional: false })
            }
        }
        if (nextProps.options.helperText == "" && nextProps.inputValue == "") {
            this.setState({ focus: false, showError: false })
        }

        if(nextProps.error !== this.state.showError){
            this.setState({ showError: nextProps.error })
        }
        // if (nextProps.error) {
        //     this.setState({ showError: nextProps.error })
        // } else if (nextProps.error === false && nextProps.inputValue) {
        //     this.setState({ showError: nextProps.error })
        // }

        if (nextProps.options.helperText != "" && nextProps.options.isEddAddress) {
            this.setState({ showError: true })
        }

        if (this.props.options.labelText !== nextProps.options.labelText) {
            this.adjustLabelWidth(1000);
        }
         if(this.props.slow){
            if(this.state.onLoads){               
                setTimeout(() => {
                    this.setState({ value: nextProps.inputValue,onLoads:false })
                }, 1100)
            }
        }

    }

    adjustLabelWidth = (time) => {
        setTimeout(() => {
            try {
                // statements
                if (this.refs.labelRef) {
                    var inputText = new MDCTextField(this.refs.labelRef);
                }
            } catch (e) {
                // statements
                console.log(e);
            }
        }, time || 0)
    }

    scrollUp = () => {
        window.scrollTo(0, 0);
    }

    validation = () => {
        if (this.state.value == '') {
            this.setState({ focus: false, showError: true, showOptional: false })
        } else if (this.props.error) {
            this.setState({ focus: false, showError: true })
        } else {
            this.setState({ focus: false, showError: false })
        }
    }

    postalCodeEntry = elem => {
        this.props.handelChange(elem.currentTarget.value)
    }
    onFocus = (e) => {
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
        this.setState({ focus: true });
    }
    onBlur = (e) => {

        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
        // if(this.props.options.showOptional){
        //     this.setState({showOptional:false})
        // }
        // let inputValue = document.getElementById("CP").value;
        if (this.state.value == "" && this.props.options.required) {
            this.setState({ focus: false, showError: true })
        } else {
            this.setState({ focus: false, showError: false })
        }
        // if (this.state.value && this.props.options.showOptional) {
        //     this.setState({ showOptional: true })
        // }else {
        //     this.setState({ showOptional: false})
        // }
        if(e.target.value === '') {
            this.setState({ showOptional: false})
        }
        const options = this.props.options || {};
        if (this.props.error || (options.required && !this.state.showOptional && !this.state.value)) {
            this.setState({ focus: false, showError: true })
        }
    }

    handleChange = e => {
        e.target.value = e.target.name === "rfcuser" ? e.target.value.toUpperCase() : e.target.value;
        if (this.props.handleChange) {
            this.props.handleChange(e);
        }
        this.setState({ value: e.target.value });
    }
    /* Change done for RTC 22449 Start*/
    showHidePasswordIcon = (e) =>{
        if (e.currentTarget.classList.contains('hidePass')){
            e.currentTarget.classList.remove("hidePass");
            e.currentTarget.previousSibling.type = "password"
        } else {
            e.currentTarget.classList.add("hidePass");
            e.currentTarget.previousSibling.type = "text"
        }
    }
    /* Change done for RTC 22449 End*/
    render() {
        const options = this.props.options;
        let temp = {
            "-webkit-text-security": "disc"
        }
        return (
            <React.Fragment>
                <div ref="labelRef">
                    <div className={`m-inputText mdc-text-field mdc-text-field--outlined ${options.extraClass} ${this.state.showError ? "mdc-text-field--invalid" : " "} ${this.state.focus ? "mdc-text-field--focused" : ""}`} onFocus={this.onFocus} onBlur={this.onBlur}>
                        <Input ref={this.textInput} className="mdc-text-field__input a-material__input" style={options.CVVClass && temp} type={options.type} required={options.required} id={options.inputId} name={options.nameInput} onChange={this.handleChange} validationtype={this.props.validationtype} value={this.state.value} maxlength={options.maxlength} minLength={options.minLength} disabled={options.disabled} onKeyDown={this.props.onKeyDown} onKeyPress={this.props.onKeypress} pattern={options.pattern} inputmode={options.inputmode} />
                        {options.type && options.type.toLowerCase() === 'password' && <div class="a-visibility__icon" onClick={(e) => {this.showHidePasswordIcon(e); }} ></div>}   {/* Change done for RTC 22449 */}
                        <div style={{ color: '#f00' }} className={`m-input-notched mdc-notched-outline ${this.state.focus || this.state.value ? " mdc-notched-outline--upgraded mdc-notched-outline--notched" : ""}`}>
                            <div className="m-input-leading mdc-notched-outline__leading"></div>
                            <div className="m-input-outline__notch mdc-notched-outline__notch">
                                <Label className={`mdc-floating-label a-input-label ${this.state.focus || this.state.value ? "mdc-floating-label--float-above" : ""}`} htmlFor={options.inputId}>{options.labelText}</Label>
                            </div>
                            <div className="m-input-outline__trailing mdc-notched-outline__trailing"></div>
                        </div>
                    </div>
                </div>
                {options.required && this.state.showOptional &&

                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id={options.helperTextId}>
                            {options.helperTextForRequired} </Paragraph>
                    </div>
                }
                {options.required && options.showError && 

                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph style={{ color: '#f00' }} className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id={options.helperTextId}>
                            {options.errorText} </Paragraph>
                    </div>
                }
                {options.required && !this.state.showOptional && 
                    <div className={this.props.dobOrder?"m-input-helper__text mdc-text-field-helper-line pb-3 pb-lg-1":"m-input-helper__text mdc-text-field-helper-line pb-3"} >
                        <Paragraph style={{ color: '#f00' }} id={options.helperTextId ? options.helperTextId : ''} className="a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true">
                            {this.state.showError && options.helperText ? options.helperText : ''}</Paragraph>
                    </div>
                }

                {!options.required &&

                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id={options.helperTextId}>
                            {options.helperText} </Paragraph>
                    </div>
                }


            </React.Fragment>
        );
    }

}
