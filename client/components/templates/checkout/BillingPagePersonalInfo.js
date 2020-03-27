import React from 'react';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import { Validate } from '../../../helpers/utilities/Validate';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import { H3 } from '../../atoms/HeadLines/Headlines';
import Image from '../../atoms/Tagimage/Image';
let validity = {
    labelText: "Country",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "Red",
            value: "Red"
        },
        {
            name: "BLUE",
            value: "BLUE"
        },
        {
            name: "ORange",
            value: "ORange"
        }
    ]
}

let estado = {
    labelText: "Estado",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "1",
            value: "1"
        },
        {
            name: "2",
            value: "2"
        },
        {
            name: "3",
            value: "3"
        }
    ]
}

let municipio = {
    labelText: "Municipio o Delegación",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "Red",
            value: "Red"
        },
        {
            name: "BLUE",
            value: "BLUE"
        },
        {
            name: "ORange",
            value: "ORange"
        }
    ]
}

let expiration = {
    labelText: "Expiration date",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "1",
            value: "1"
        },
        {
            name: "2",
            value: "2"
        },
        {
            name: "3",
            value: "3"
        }
    ]
}

let Colonia = {
    labelText: "Colony",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "1",
            value: "1"
        },
        {
            name: "2",
            value: "2"
        },
        {
            name: "3",
            value: "3"
        }
    ]
}

let validity1 = {
    labelText: "Tipo de tarjeta",
    labelId: 'label-cardType',
    selected: 'selectCardType',
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "1",
            value: "1"
        },
        {
            name: "2",
            value: "2"
        },
        {
            name: "3",
            value: "3"
        }
    ]
}

export default class BillingPersonalInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: {
              firstName:'',
              lastName:'',
              mothersLastName:'',
              email:''

            },
            focused: {

            },
            errors: {

            }
        }
    }

    validateForm = () => {
        return new Promise((resolve, reject) => {

            const { address } = this.state;
            var errors = {};

            if (!address.firstName) { errors.firstName = true; }
            if (!address.lastName) { errors.lastName = true; }
            if (this.props.mainContent && this.props.mainContent.showGiftInfoMsg){
               if (!address.email) { errors.email = true; }
            }
        

            if (Object.keys(errors).length === 0) {
                return resolve(address);
            } else {
                this.setState({ errors });
                return reject()
            }

        });
    }

    handleOnSelectChange = (value, e) => {
        this.handleOnChange(e);
    }

    handleOnChange = (e) => {
        const { address } = this.state;
        e.persist();
        this.setState(function (prevState) {
            const pre_value = prevState.address[e.target.name];
            address[e.target.name] = Validate.validation(e, pre_value);
            return { address }
        })
    }

    // handleOnChange = (e) => {
    //     const { address } = this.state;
    //     address[e.target.name] = e.target.value;
    //     this.setState({address});
    // }

    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }

    handleBlur = (e) => {
        const { focused, address, errors } = this.state;
        focused[e.target.name] = false;
        if (!address[e.target.name] && e.target.required) {
            errors[e.target.name] = true;
        } else {
            errors[e.target.name] = false;
        }
        this.setState({ focused, errors });
    }

    render() {
        const { address, errors, focused } = this.state;
        const { staticLabelValues } = this.props;
        return (
            <React.Fragment>
                <div className="m-cardholderInfo col-12 no-gutters d-flex justify-content-between p-0">
                    <div className="d-xl-none d-lg-none">
                        <InputHelperAssistant
                            name="firstName"
                            value={address.firstName}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.firstName}
                            field_valid={errors.firstName}
                            validationtype = {"textWithSpecialChars"}
                            inputId='Nombre'
                            nameInput='Nombre'
                            labelPosition='right'
                            
                            
                            type="text"
                            labelText={staticLabelValues['pwa.checkoutBillingPage.name.text']}
                            maxLength={250}
                            required
                        />
                         <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                { errors.firstName && staticLabelValues['pwa.checkoutShippingPage.emptyFirstName.errorMsg']}
                            </Paragraph>
                        </div>
                        <InputHelperAssistant
                            name="lastName"
                            value={address.lastName}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.lastName}
                            field_valid={errors.lastName}
                            validationtype = {"textWithSpecialChars"}
                            inputId='ApellidoPaterno'
                            nameInput='ApellidoPaterno'
                            labelPosition='right'
                            
                            
                            type="text"
                            labelText={staticLabelValues['pwa.checkoutBillingPage.lastName.text']}
                            maxLength={250}
                            required
                        />
                         <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                {errors.lastName && staticLabelValues['pwa.checkoutPageBilling.lastName.required']}
                            </Paragraph>
                        </div>
                        <InputHelperAssistant
                            name="mothersLastName"
                            value={address.mothersLastName}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.mothersLastName}
                            field_valid={errors.mothersLastName}
                            validationtype = {"textWithSpecialChars"}
                            inputId='ApellidoMaterno'
                            nameInput='ApellidoMaterno'
                            labelPosition='right'
                            
                            
                            type="text"
                            labelText= {staticLabelValues['pwa.checkoutBillingPage.mothersName.text']}
                            maxLength={250}
                        />
                         <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">Opcional
                            </Paragraph>
                        </div>
            {
                (this.props.mainContent && this.props.mainContent.showGiftInfoMsg)?
                <React.Fragment>
                        <InputHelperAssistant
                            name="email"
                            value={address.email}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.email}
                            field_valid={errors.email}
                            inputId='CorreoElectrónic'
                            nameInput='CorreoElectrónic'
                            labelPosition='right'
                            
                            
                            type="text"
                            labelText="Correo Electrónico"
                            required
                        />
                         <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                { errors.email && "CorreoElectrónic es necesario" }
                            </Paragraph>
                        </div>
                      </React.Fragment>
                    : null
            }
                    </div>
                    <div className="d-none d-xl-flex col-12 no-gutters justify-content-between p-0 mb-3 row">
                        <div className="col-xl-4 d-xl-flex flex-row justify-content-start">
                            <div className="col-xl-12 pl-xl-0">
                                <InputHelperAssistant
                                    name="firstName"
                                    value={address.firstName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.firstName}
                                    field_valid={errors.firstName}
                                    validationtype = {"textWithSpecialChars"}
                                    inputId='Nombre'
                                    nameInput='Nombre'
                                    labelPosition='right'
                                    
                                    
                                    type="text"
                                    labelText={staticLabelValues['pwa.checkoutBillingPage.name.text']}
                                    maxLength={250}
                                    required
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        { errors.firstName && staticLabelValues['pwa.checkoutShippingPage.emptyFirstName.errorMsg'] }
                                    </Paragraph>
                                 </div>
                            </div>
                        </div>
                        <div className="col-xl-4 d-xl-flex flex-row justify-content-between">
                            <div className="col-xl-12">
                                <InputHelperAssistant
                                    name="lastName"
                                    value={address.lastName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.lastName}
                                    field_valid={errors.lastName}
                                    validationtype = {"textWithSpecialChars"}
                                    inputId='ApellidoPaterno'
                                    nameInput='ApellidoPaterno'
                                    labelPosition='right'
                                    
                                    
                                    type="text"
                                    labelText={staticLabelValues['pwa.checkoutBillingPage.lastName.text']}
                                    maxLength={250}
                                    required
                                />
                                 <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        { errors.lastName && staticLabelValues['pwa.checkoutPageBilling.lastName.required'] }
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 d-xl-flex flex-row justify-content-between">
                            <div className="col-xl-12 pr-xl-0">
                                <InputHelperAssistant
                                    name="mothersLastName"
                                    value={address.mothersLastName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.mothersLastName}
                                    field_valid={errors.mothersLastName}
                                    validationtype = {"textWithSpecialChars"}
                                    inputId='ApellidoMaterno'
                                    nameInput='ApellidoMaterno'
                                    labelPosition='right'
                                    
                                    
                                    type="text"
                                    labelText= {staticLabelValues['pwa.checkoutBillingPage.mothersName.text']}
                                    maxLength={250}
                                />
                                 <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">Opcional
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
            {
                (this.props.mainContent && this.props.mainContent.showGiftInfoMsg)?
                        <div className="col-xl-4 d-xl-flex flex-row justify-content-start mt-4">
                            <div className="col-xl-12 pl-xl-0">
                                <InputHelperAssistant
                                    name="email"
                                    value={address.email}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.email}
                                    field_valid={errors.email}
                                    inputId='CorreoElectrónic'
                                    nameInput='CorreoElectrónic'
                                    labelPosition='right'
                                    
                                    
                                    type="text"
                                    labelText="Correo Electrónico"
                                    required
                                />
                                 <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        { errors.email && "CorreoElectrónic es necesario" }
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                    : null 
                    }
                    </div>
                    {/*Tab start*/}
                    <div className="d-none d-lg-flex d-xl-none col-12 no-gutters justify-content-between p-0 --mb-46">
                        <div className="col-lg-5 d-lg-flex flex-row justify-content-between">
                            <InputHelperAssistant
                                   name="firstName"
                                    value={address.firstName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.firstName}
                                    field_valid={errors.firstName}
                                    validationtype = {"textWithSpecialChars"}
                                    inputId='Nombre'
                                    nameInput='Nombre'
                                    labelPosition='right'
                                    
                                    
                                    type="text"
                                    labelText={staticLabelValues['pwa.checkoutBillingPage.name.text']}
                                    maxLength={250}
                                    required
                            />
                             {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                   { errors.firstName && staticLabelValues['pwa.checkoutShippingPage.emptyFirstName.errorMsg'] }
                                </Paragraph>
                            </div>*/}
                        </div>
                        <div className="col-lg-5 d-lg-flex flex-row justify-content-between">
                            <InputHelperAssistant
                                name="lastName"
                                    value={address.lastName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.lastName}
                                    field_valid={errors.lastName}
                                    validationtype = {"textWithSpecialChars"}
                                    inputId='ApellidoPaterno'
                                    nameInput='ApellidoPaterno'
                                    labelPosition='right'
                                    
                                    
                                    type="text"
                                    labelText= {staticLabelValues['pwa.checkoutBillingPage.lastName.text']}
                                    maxLength={250}
                                    required
                            />
                             {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    { errors.lastName && staticLabelValues['pwa.checkoutPageBilling.lastName.required'] }
                                </Paragraph>
                            </div>*/}
                        </div>
                    </div>
                    <div className="d-none d-lg-flex d-xl-none col-12 no-gutters justify-content-between p-0 mb-4 pb-2">
                        <div className="col-lg-5 d-lg-flex flex-column justify-content-between">
                            <InputHelperAssistant
                                name="mothersLastName"
                                value={address.mothersLastName}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.mothersLastName}
                                field_valid={errors.mothersLastName}
                                validationtype = {"textWithSpecialChars"}
                                inputId='ApellidoMaterno'
                                nameInput='ApellidoMaterno'
                                labelPosition='right'
                                
                                
                                type="text"
                                labelText= {staticLabelValues['pwa.checkoutBillingPage.mothersName.text']}
                                maxLength={250}
                            />
                            {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                </Paragraph>
                            </div>*/}
                        </div>
                    {
                       (this.props.mainContent && this.props.mainContent.showGiftInfoMsg)?
                            <div className="col-lg-5 d-lg-flex flex-row justify-content-between">
                            <InputHelperAssistant
                                name="email"
                                value={address.email}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.email}
                                field_valid={errors.email}
                                inputId='CorreoElectrónic'
                                nameInput='CorreoElectrónic'
                                labelPosition='right'
                                
                                
                                type="text"
                                labelText="Correo Electrónico"
                                required
                            />
                             {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                  { errors.email && "CorreoElectrónic es necesario" }
                                </Paragraph>
                            </div>*/}
                        </div>
                    : null
                    }
                    </div>
                </div>

            </React.Fragment>
        )
    }
}














