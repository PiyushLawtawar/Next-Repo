
import React from 'react';
import Button from "../../atoms/Button/Button";
import InputText from '../../molecules/InputText/InputText';
// import { InputText, HelperText } from "../MaterialInputText/MaterialInputText"

import './moleculeformRecovery.styl'


export default class moleculeformRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_email: '',
      errorEmail: '',
      user_email_valid: true
    };
    this.forgetPasswordButton = React.createRef();
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) ? 'true' : 'false';
  }
  onBlur = (e) => {
		if (e.target.name === "user_email") {
      this.email.validation();
      const user_email_valid = this.validateEmail(e.target.value);
      this.setState({ user_email_valid: user_email_valid })
      if (user_email_valid === 'false' && e.target.value) {
        this.setState({ errorEmail: true })
      } else {
        this.setState({ errorEmail: false })
      }
    }
	}
  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { user_email, user_email_valid } = this.state;
    this.email.validation();
    if (user_email && (user_email_valid === 'true')) {
      this.props.resetPassword(user_email);
      this.visibiliyShow();
    }
  }
  
  visibiliyShow = () => {
    if (this.forgetPasswordButton.current.style.visibility === 'hidden') {
      this.forgetPasswordButton.current.style.visibility = 'visible';
    } else {
      this.forgetPasswordButton.current.style.visibility = 'hidden';
    }
  }

  render() {
    const staticLabels = this.props.staticLabels;
    const {user_email, user_email_valid,errorEmail} = this.state;
    
    var user__email = {
      type: "email",
      inputId: 'input-user__email',
      nameInput: 'user_email',
      labelText: staticLabels && staticLabels['pwa.forgotPassword.email1.label'],
      helperText: user_email ? staticLabels && staticLabels["pwa.forgotPassword.electronica.label"] : staticLabels && staticLabels["pwa.emailerror.enterEmail.label"], //- text that appear when validation fails
      helperTextId: 'helper__updateEmail',
      required: true,
      field_valid: { user_email_valid },
      maxlength: '100'
    }

    return (
      <form className="m-box-form__content" id="formRecovery">
        <label className="a-login-label--recovery">{staticLabels['pwa.forgotPassword.emailHeading.text']}
        </label>
        <InputText options={user__email} handleChange={this.handleOnChange} onBlur={this.onBlur} inputValue={user_email} error={errorEmail} ref={em => this.email = em} />
        <div ref={this.forgetPasswordButton}><Button className="a-btn a-btn--primary" handleClick={this.handleFormSubmit}>Enviar
                  </Button></div>
      </form>
    )

  }
}



