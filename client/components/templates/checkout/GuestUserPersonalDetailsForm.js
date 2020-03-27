import React from 'react';
import { InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default (props) => {
    let { user, errors, focused, labels } = props;
    return (
        <React.Fragment>
            <div className="row no-gutters align-items-center justify-content-between mb-3">
                <div className="col-lg-4 col-7">
                    <h5 className="a-box__heading">{labels['pwa.addressFormPage.recipientDetails.text']}</h5>
                </div>
                <div className="col-lg-4 col-5 text-right"><Paragraph className="a-box__requiredMessage"> {labels["pwa.checkoutShippingPage.requiredfields.text"] || "*Campos obligatorios"}</Paragraph></div>
            </div>

            <div className="row align-items-start">
                <div className="col-xl-4 col-lg-6 col-12">
                    <InputHelperAssistant
                        value={user.firstName}
                        onChange={props.handleOnChange}
                        onFocus={props.handleOnFocus}
                        onBlur={props.handleBlur}
                        field_focus={focused.firstName}
                        field_valid={errors.firstName}
                        validationtype={"textWithSpecialChars"}
                        maxLength={100}
                        name="firstName"
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
                            { errors.firstName &&
                                labels["pwa.addressFormPage.emptyFirstName.errorMsg"]
                            }
                        </Paragraph>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                    <InputHelperAssistant
                        value={user.lastName}
                        onChange={props.handleOnChange}
                        onFocus={props.handleOnFocus}
                        onBlur={props.handleBlur}
                        field_focus={focused.lastName}
                        field_valid={errors.lastName}
                        name="lastName"
                        validationtype={"textWithSpecialChars"}
                        maxLength={100}
                        inputId='apellidopaterno'
                        nameInput='apellidopaterno'
                        labelText={labels["pwa.addressFormPage.lastname.label"]}
                        labelPosition='left'
                        helperText='Ej. Casa, Oficina...'
                        helperTextId='helper-apellidopaterno'
                        
                        
                        type="text"
                        required
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                            { errors.lastName && labels["pwa.addressFormPage.emptyLastName.errorMsg"]}
                        </Paragraph>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                    <InputHelperAssistant
                        value={user.mothersLastName}
                        onChange={props.handleOnChange}
                        onFocus={props.handleOnFocus}
                        onBlur={props.handleBlur}
                        field_focus={focused.mothersLastName}
                        name="mothersLastName"
                        validationtype={"textWithSpecialChars"}
                        maxLength={100}
                        inputId='apellidomaterno'
                        nameInput='apellidomaterno'
                        labelText={labels['pwa.addressFormPage.maternalName.label']}
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-apellidomaterno'
                        
                        
                        type="text"
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                            {labels["pwa.checkoutShippingPage.optional.text"]}
                        </Paragraph>
                    </div>
                </div>
            </div>

            <div className="row align-items-start">
                <div className="col-xl-4 col-lg-6 col-12">
                    <InputHelperAssistant
                        value={user.email}
                        onChange={props.handleOnChange}
                        onFocus={props.handleOnFocus}
                        onBlur={props.handleBlur}
                        field_focus={focused.email}
                        field_valid={errors.email}
                        maxLength={100}
                        name="email"
                        inputId='correoelectrónico'
                        nameInput='correoelectrónico'
                        labelText={labels["pwa.checkoutShippingPage.email.label"]}
                        labelPosition='left'
                        helperText='Ej. Casa, Oficina...'
                        helperTextId='helper-correoelectrónico'
                        
                        
                        type="email"
                        required
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                            { errors.email && (labels["pwa.addressFormPage.emptyEmail.errorMsg"] || 'El Correo Electronico es requerido')}
                        </Paragraph>
                        {/*El campo es requerido y debe tener formato de email correcto.*/}
                    </div>
                </div>
                {!props.guest_hide_telephone_lada &&
                    <React.Fragment>
                    <div className="col-xl-2 col-lg-2 col-4">
                        <InputHelperAssistant
                            name="LADA"
                            value={user.LADA}
                            onChange={props.handleOnChange}
                            onFocus={props.handleOnFocus}
                            onBlur={props.handleBlur}
                            field_focus={focused.LADA}
                            field_valid={errors.LADA || (user.LADA && (
                                (user.phone.length===7 && user.LADA.length !== 3) ||
                                (user.phone.length===8 && user.LADA.length !== 2) ||
                                (user.LADA.length < 2)
                               ))}
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={user.phone.length===8 ? 2 : 3}
                            type="tel"
                            required
                            labelText={labels["pwa.checkoutShippingPage.ladaPhone.label"] || "LADA"} />

                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {(errors.LADA || (user.LADA && (   
                                (user.phone.length===7 && user.LADA.length !== 3) ||
                                (user.phone.length===8 && user.LADA.length !== 2) ||
                                (user.LADA.length < 2)
                               ))) && labels["pwa.checkoutShippingPage.emptyPhoneCode.errorMsg"]}
                                    </Paragraph>
                            </div>

                    </div>
                    <div className="col-xl-2 col-lg-2 col-8">
                        <InputHelperAssistant
                            value={user.phone}
                            onChange={props.handleOnChange}
                            onFocus={props.handleOnFocus}
                            onBlur={props.handleBlur}
                            field_focus={focused.phone}
                            field_valid={errors.phone || (!focused.phone && user.phone && (
                                (user.LADA.length===2 && user.phone.length !== 8) ||
                                (user.LADA.length===3 && user.phone.length !== 7) ||
                                ( user.phone.length < 7)
                               )) }
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={user.LADA.length===3 ? 7 : 8}
                            name="phone"
                            inputId='teléfono'
                            nameInput='teléfono'
                            labelText={labels["pwa.checkoutShippingPage.particularPhone.label"] || "Teléfono"}
                            labelPosition='left'
                            text='Ej. Casa, Oficina...'
                            helperTextId='helper-Teléfono'
                            
                            
                            type="tel"
                            required
                        />
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            { !(!focused.phone && user.phone && (
                                (user.LADA.length===2 && user.phone.length !== 8) ||
                                (user.LADA.length===3 && user.phone.length !== 7) ||
                                ( user.phone.length < 7)
                            )) && !errors.phone &&
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    {(user.LADA.length===3) ? "7 digitos" : labels["pwa.checkoutShippingPage.digits8.label"]}
                                </Paragraph>
                            }
                            { !user.phone && errors.phone &&
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    {labels["pwa.checkoutShippingPage.phonerequired.label"] || "El teléfono es requerido"}
                                </Paragraph>
                            }
                            { !focused.phone && user.phone && (
                                (user.LADA.length===2 && user.phone.length !== 8) ||
                                (user.LADA.length===3 && user.phone.length !== 7) ||
                                ( user.phone.length < 7)
                            ) &&
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    {labels["pwa.addressFormPage.invalidTelephoneNum.errorMsg"]}
                                </Paragraph>
                            }
                        </div>
                    </div>
                    </React.Fragment>
                }
                {/*labels["pwa.addressFormPage.telWithLada.text"]*/}
                {/*labels["pwa.addressFormPage.emptyParticularPhone.errorMsg"]*/}
            </div>
            { props.cartHaveAtLeasetOneDigitalItem  &&
                <div class="row">
                    <div class="col">
                        <Paragraph className="a-digital-clarification" dangerouslySetInnerHTML={{__html:  (labels["pwa.shippingDigital.emailDisclaimerText.message"] || "<span>El código de descarga te llegará por este medio recuerda que podrás consultarlo también en: Mis pedidos y Confirmación de tu Compra. Recuerda que en compras digitales no contamos con cambios ni devoluciones, al dar click en siguiente estás aceptando nuestros Términos y condiciones así como nuestro Aviso de privacidad.</span>")}}>
                        </Paragraph>
                    </div>
                </div>
            }                    
        </React.Fragment>
    )
}