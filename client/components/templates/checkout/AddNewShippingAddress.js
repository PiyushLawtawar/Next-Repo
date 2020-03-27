/**
 * Module Name : AddNewShippingAddress Module
 * Functionality : Component used to add new shipping address. Form Validation functionality happening here. This is get called from \templates\checkout\CommonShippingPage.js
 * @exports : AddNewShippingAddress
 * @requires : module:React
 * @requires : module:molecules/MaterialInputCheckBox/MaterialInputCheckBox#Path
 * @requires : module:atoms/Paragraph/Paragraph#Path
 * @requires : module:molecules/MaterialSelect/MaterialSelect#Path
 * @requires : module:atoms/HeadLines/Headlines.js#Path
 * @requires : module:templates/checkout/ShippingAddressForm.js#Path
 * @requires : module:helpers/utilities/Validate#Path
 * Team : Checkout Team
 * Other information : Added ShippingAddressForm module as child component which have all the form fields.
 * 
 */

import React from 'react';
import {H4,H5} from '../../atoms/HeadLines/Headlines';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import {InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import ShippingAddressForm from './ShippingAddressForm';
import { Validate } from '../../../helpers/utilities/Validate';

/**
 * @class AddNewShippingAddress
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class AddNewShippingAddress extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props) {
        super(props);
        const editAddress = props.editAddress || {}
        this.state = {
            labels: this.props.labels || {},
            user:{
                shortName: editAddress.nickName || '',
                firstName: editAddress.firstName || '',
                lastName: editAddress.lastName || '',
                mothersLastName: editAddress.mothersLastName || (editAddress.maternalName || ''),
            },
            focused:{

            },
            errors:{

            },
        }
    }

   /**
   * Address form fields validation
   * @function validateForm
   * @author dondapati.kumar@zensar.com
   * @desc this function will validate all the address fields values.
   * @returns It returns address details only if given values are valid.
   * 
   */
    validateForm = () => {
        var shippingAddressPromise = this.refs.shippingAddressFormRef.validateForm();
        return new Promise((resolve,reject)=>{
            const { user } = this.state;
            var errors = {};
            if(!user.shortName){ errors.shortName = true; }
            if(!user.firstName){ errors.firstName = true; }
            if(!user.lastName){ errors.lastName = true; }
            if(Object.keys(errors).length===0){
                shippingAddressPromise.then(address=>{
                    return resolve({...user,...address})
                },error=>{
                    return reject(error)
                })
            }else{
                this.setState({errors});
                return reject({})
            }
        });
    }


   /**
   * Method will call on field value change
   * @function handleOnChange
   * @author dondapati.kumar@zensar.com
   * @desc this function will capture the value what user enters and assign to the state.
   * @param {object} element
   * 
   */
    handleOnChange = (e) => {
        const { user } = this.state;
        e.persist();
        this.setState(function (prevState){
            const pre_value = prevState.user[e.target.name];
            user[e.target.name] = Validate.validation(e,pre_value);
            return {user}
        })
    }


   /**
   * On focus method. Used for mantaining field focus status for adding css classes dynamically.
   * @function handleOnFocus
   * @author dondapati.kumar@zensar.com
   * @desc this function will fire when cursor enters into the field. And set state value to true.
   * @param {object} element  
   * 
   */
    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({focused});
    }

   /**
   * On blur method. Used for mantaining field focus status for removing css classes dynamically.
   * @function handleBlur
   * @author dondapati.kumar@zensar.com
   * @desc this function will fire when cursor outs from the field. And set state value to false.
   * @param {object} element  
   * 
   */
    handleBlur = (e) => {
        const { focused, user, errors } = this.state;
        focused[e.target.name] = false;
        if(!user[e.target.name] && e.target.required){
            errors[e.target.name] = true;
        }else{
            errors[e.target.name] = false;
        }
        this.setState({focused, errors});
    }

   /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   */
    render(){
        const { user, errors, focused, labels } = this.state;
        return(
            <React.Fragment>
                    <form autoComplete="off">
                        <div className="row no-gutters align-items-center justify-content-between mb-3">
                            <div className="col-lg-4 col-7">
                                <H5 headLineClass="a-box__heading" headLineText={labels["pwa.addressFormPage.recipientDetails.text"]} />

                            </div>
                            <div className="col-lg-4 col-5 text-right">
                                <Paragraph className="a-box__requiredMessage">{labels["pwa.checkoutShippingPage.requiredfields.text"] || "*Campos obligatorios"}</Paragraph>
                            </div>
                        </div>
                        <div className="row align-items-start">
                            <div className="col-xl-4 col-lg-6 col-12">
                                <InputHelperAssistant
                                    name="shortName"
                                    value={user.shortName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.shortName}
                                    field_valid={errors.shortName}
                                    validationtype={"onlyMaxLength"}
                                    maxLength={30}
                                    inputId='nombreCorto'
                                    nameInput='nombreCorto'
                                    labelText={labels["pwa.addressFormPage.nickname.label"]}
                                    labelPosition='left'
                                    helperTextId='helper-nombreCorto'
                                    
                                    
                                    type="text"
                                    required
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    { errors.shortName &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                            {labels["pwa.addressFormPage.emptyNickName.errorMsg"]}
                                        </Paragraph>
                                    }
                                    {!errors.shortName &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                        {"Ej. Casa, Oficina..."}
                                        </Paragraph>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-start" text="Nombre corto">
                            <div className="col-xl-4 col-lg-6 col-12">
                                <InputHelperAssistant
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.firstName}
                                    field_valid={errors.firstName}
                                    validationtype={"textWithSpecialChars"}
                                    maxLength={100}
                                    inputId='nombreCorto'
                                    nameInput='nombre'
                                    labelText={labels["pwa.addressFormPage.firstname.label"]}
                                    labelPosition='left'
                                    text='Ej. Casa, Oficina...'
                                    helperTextId='helper-nombreCorto'
                                    
                                    
                                    type="text"
                                    required
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                        { errors.firstName && labels["pwa.addressFormPage.emptyFirstName.errorMsg"]}
                                    </Paragraph>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-12">
                                <InputHelperAssistant
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.lastName}
                                    field_valid={errors.lastName}
                                    validationtype={"textWithSpecialChars"}
                                    maxLength={100}
                                    inputId='nombreCorto'
                                    nameInput='nombreCorto'
                                    labelPosition='left'
                                    text='Ej. Casa, Oficina...'
                                    helperTextId='helper-nombreCorto'
                                    
                                    
                                    type="text"
                                    required
                                    labelText={labels["pwa.addressFormPage.lastname.label"]}
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                        { errors.lastName && labels["pwa.addressFormPage.emptyLastName.errorMsg"]}
                                    </Paragraph>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-12">
                                <InputHelperAssistant
                                    name="mothersLastName"
                                    value={user.mothersLastName}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.mothersLastName}
                                    field_valid={errors.mothersLastName}
                                    validationtype={"textWithSpecialChars"}
                                    maxLength={100}
                                    inputId='nombreCorto'
                                    nameInput='nombreCorto'
                                    labelPosition='left'
                                    text='Ej. Casa, Oficina...'
                                    helperTextId='helper-nombreCorto'
                                    
                                    
                                    type="text"
                                    labelText={labels["pwa.addressFormPage.maternalName.label"]}
                                />

                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                    {labels["pwa.checkoutShippingPage.optional.text"]}
                                    </Paragraph>
                                </div>
                            </div>
                        </div>

                        <div className="row align-items-center mb-4 mt-4">
                            <div className="col-xl-4 col-lg-6 col-12">
                                <H5 headLineClass="a-box__heading" headLineText={labels["pwa.checkoutShippingPage.shippingPageSmall.text"]} />
                            </div>
                        </div>

                        <ShippingAddressForm
                            show_alert={this.props.show_alert}
                            labels={labels}
                            ref="shippingAddressFormRef"
                            editAddress={this.props.editAddress}
                            loggedInUser={this.props.loggedInUser}
                            addressRecords={this.props.addressRecords}
                            defaultShippingAddressId={this.props.defaultShippingAddressId}
                            states={this.props.states}
                            check_estimateddeliverydate={this.props.check_estimateddeliverydate}
                            error_scenario={this.props.error_scenario}
                            GuatemalaEnableFlag={this.props.GuatemalaEnableFlag}
                            handleOnCountryChange={this.props.handleOnCountryChange}
                        />

                    </form>
            </React.Fragment>
        )
    }
}