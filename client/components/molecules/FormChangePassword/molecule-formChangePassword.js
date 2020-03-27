import React from 'react';
import Label from '../../atoms/Label/Label';
import InputText from '../../molecules/InputText/InputText';
import Button from '../../atoms/Button/Button';
import { H1 } from '../../atoms/HeadLines/Headlines'
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Router from 'next/router';

class FormChangePassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user_pass: '',
      user_passNew: '',
      user_passConfirm: '',
      isredirect: 'true',
      error: false,
      errorMessage: "",
      passwordMatchError: '',
      errorPassword: false,
      errorPasswordConfirm: false,
      errorNewPassword: false
    }
    const user_email = ''
  }

  // la contraseña no coincidió
  handleChange = (e) => {
    const { user_pass, user_passNew, user_passConfirm, isredirect } = this.state;
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === "user_pass") {
      const limitLength = e.target.minLength;

      if (e.target.value.length < limitLength) {
        this.setState({ errorPassword: true })
      } else {
        this.setState({ errorPassword: false })
      }
    }
    if (e.target.name === "user_passNew") {
      const limitLength = e.target.minLength;

      if (e.target.value.length < limitLength) {
        this.setState({ errorNewPassword: true })
      } else {
        this.setState({ errorNewPassword: false })
      }
    }
    if (e.target.name === "user_passConfirm") {

      if (e.target.value !== user_passNew) {

        this.setState({ errorPasswordConfirm: true })
      } else {
        this.setState({ errorPasswordConfirm: false })
      }
    }
  }
  changePassword = (e) => {
    e.preventDefault();
    const { user_pass, user_passNew, user_passConfirm, isredirect, errorPassword, errorPasswordConfirm } = this.state;
    this.password.validation();
    this.newpasword.validation();
    this.confirmpassword.validation();
    if (this.user_email && user_pass && user_passNew && user_passConfirm && errorPassword === false && errorPasswordConfirm === false) {
      const payload = {
        "email": this.user_email ? this.user_email : '',
        "oldPassword": user_pass,
        "password": user_passNew,
        "confirmPassword": user_passConfirm
      }
      this.props.changePassword(payload);
    }


  }


  render() {
    const staticLabels = this.props.staticLabels;
    const { user_pass, user_passNew, user_passConfirm, errorPassword, errorPasswordConfirm, errorNewPassword } = this.state;
    if (this.props.loginDetails && this.props.loginDetails.cartHeaderResponse && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails.isLoggedIn) {
      this.user_email = this.props.loginDetails.cartHeaderResponse.cartHeaderDetails.email;
    }

    var user__pass1 = {
      type: "password",
      inputId: 'inputPass', //- attribute id
      nameInput: 'user_pass', //- name of the input
      labelText: 'Contraseña actual',//- text of the label
      helperText: user_pass ? staticLabels && staticLabels["pwa.changePasswordPage.oldPasswordLength.errorMsg"] : staticLabels && staticLabels["pwa.changePasswordPage.contresana.errorMsg"], //- text that appear when validation fails
      helperTextId: 'helper__userPass',//- attibute id for helper text
      required: true, //- if value of the input is required set true
      minLength: "8",
      helperTextForRequired: errorPassword ? staticLabels && staticLabels["pwa.changePasswordPage.oldPasswordLength.errorMsg"] : staticLabels && staticLabels["pwa.changePasswordPage.contresana.errorMsg"],
      showOptional: true
    }
    var user__passNew = {
      type: "password",
      inputId: 'inputPassNew', //- attribute id
      nameInput: 'user_passNew', //- name of the input
      labelText: staticLabels && staticLabels["pwa.changePassword.newPassword.label"],//- text of the label
      helperText: user_passNew ? staticLabels && staticLabels["pwa.changePasswordPage.newPasswordLength.errorMsg"] : staticLabels && staticLabels["pwa.changePasswordPage.nueva.errorMsg"], //- text that appear when validation fails
      helperTextId: 'helper__userPassNew',//- attibute id for helper text
      required: true, //- if value of the input is required set true
      minLength: "8",
      helperTextForRequired: errorNewPassword ? staticLabels && staticLabels["pwa.changePasswordPage.newPasswordLength.errorMsg"] : staticLabels && staticLabels["pwa.changePasswordPage.nueva.errorMsg"],
      showOptional: true
    }
    var user__passConfirm = {
      type: "password",
      inputId: 'inputPassConfirm', //- attribute id
      nameInput: 'user_passConfirm', //- name of the input
      labelText: staticLabels && staticLabels["pwa.changePassword.newPassword.label"],//- text of the label
      helperText: user_passConfirm ? staticLabels && staticLabels["pwa.changePasswordPage.notEqualPassword.errorMsg"] : staticLabels && staticLabels["pwa.changePassword.confirmPassword.label"], //- text that appear when validation fails
      helperTextId: 'helper__userPassConfirm',//- attibute id for helper text
      required: true, //- if value of the input is required set true
      minLength: "8",
      helperTextForRequired: errorPasswordConfirm ? staticLabels["pwa.changePasswordPage.notEqualPassword.errorMsg"] : staticLabels && staticLabels["pwa.changePassword.confirmPassword.label"],
      showOptional: true
    }
    return (

      <div className="m-box-form__content--my__account col-12 col-lg-5 pb-lg-3 px-4" id="formchangePass">
        <H1 headLineText={staticLabels && staticLabels["pwa.changePasswordPage.siguientes.errorMsg"]} className="a-myAccount-aside--title__formChangePassowrd" />
        <Label className="a-changePass-label--required">{staticLabels && staticLabels["pwa.changePassword.requiredFields.text"]}</Label>
        <InputText options={user__pass1} handleChange={this.handleChange} inputValue={user_pass} ref={cn => this.password = cn} error={errorPassword} />

        <InputText options={user__passNew} handleChange={this.handleChange} inputValue={user_passNew} ref={cn => this.newpasword = cn} error={errorNewPassword} />

        <InputText options={user__passConfirm} handleChange={this.handleChange} inputValue={user_passConfirm} error={errorPasswordConfirm} ref={cn => this.confirmpassword = cn} />

        <Button handleClick={this.changePassword} className="a-btn a-btn--primary" >{staticLabels && staticLabels["pwa.changePassword.Aceptar.label"]}</Button>
      </div>

    );
  }
}

export default FormChangePassword;