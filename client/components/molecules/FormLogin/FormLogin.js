import React from 'react';
import InputText from '../../molecules/InputText/InputText';
import LoginDetails from "../LoginDetails/LoginDetails";
import Link from "../../atoms/Link/Link";
import Label from "../../atoms/Label/Label";
import Button from "../../atoms/Button/Button";
import Icons from "../../atoms/Icons/Icons";
import Input from "../../atoms/Input/Input";
import Router from 'next/router'
import { Utility, logError, logDebug } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';

export default class FormLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_email: '',
			user_pass: '',
			errorEmail: '',
			errorPassword: '',
			validEmail: '',
			validPassword: '',
			cartdetails: {}
		}
		this.loginButton = React.createRef();
		this.email = ''
	}

	componentDidMount() {
		this.summary();
	}

	handleFormSubmit = (e) => {
		e.preventDefault();
		this.email.validation();
		this.password.validation();
		const { user_email, user_pass, validEmail, validPassword } = this.state;
		if(validEmail){
			this.setState({errorEmail: true});
		}else {
			this.setState({errorEmail: false});
		}
		if(validPassword){
			this.setState({errorPassword: true})
		}else {
			this.setState({errorPassword: false})
		}
		if (user_email && user_pass && validEmail === false && validPassword === false) {
			this.props.handle_login_API(user_email, user_pass);
			this.visibiliyShow();
		} else {
			dataLayer.push({
				event: 'evLogin', //variable estática
				bool: 'Error'  //variable estática
			});
		}
	}

	validateEmail = (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase()) ? 'true' : 'false';
	}
	onBlur = (e) => {
		if (e.target.name === "user_email") {
			const user_email_valid = this.validateEmail(e.target.value);
			if (user_email_valid === 'false') {
				this.setState({ errorEmail: true, validEmail: true })
			} else {
				this.setState({ errorEmail: false, validEmail: false })
			}
		}
		if (e.target.name === "user_pass") {
			const limitLength = e.target.minLength;

			if (e.target.value.length < limitLength) {
				this.setState({ errorPassword: true, validPassword: true })
			} else {
				this.setState({ errorPassword: false, validPassword: false })
			}
		}
	}
	handleOnChange = (e) => {
		this.setState({ [e.target.name]: e.target.value }); // Applying input value to the state.
		if (e.target.name === "user_email") {
			const user_email_valid = this.validateEmail(e.target.value);
			if (user_email_valid === 'false') {
				this.setState({ validEmail: true })
			} else {
				this.setState({ validEmail: false })
			}
		}
		if (e.target.name === "user_pass") {
			const limitLength = e.target.minLength;

			if (e.target.value.length < limitLength) {
				this.setState({ validPassword: true })
			} else {
				this.setState({ validPassword: false })
			}
		}
	}

	clearData = () => {
		this.setState({ user_email: '', user_pass: '' }, () => {
			const eles = document.getElementsByClassName('m-input-outline__notch');
			for (var i in eles) {
				if (!isNaN(i)) {
					eles[i].style.width = 'auto';
				}
			}
		});
	}
	visibiliyShow = () => {
		if (this.loginButton.current.style.visibility === 'hidden') {
			this.loginButton.current.style.visibility = 'visible';
		} else {
			this.loginButton.current.style.visibility = 'hidden';
		}

	}
	OnClickCreateAccount = () => {
		if (Router && Router.router && Router.router.asPath !== '/tienda/login') {
			Router.push('/tienda/users/createAccount?checkoutRegister=' + true);
		} else {
			Router.push('/tienda/users/createAccount');
		}
	}

	onKeypress = (event) => {
      
        const code = event.keyCode || event.which;
        const { value } = event.target;
        if (code === 13 && value.length <= 20) {
            this.handleFormSubmit(event);
        }
    }

	summary = () => {
		Utility(Path.getCartHeaderDetails, 'POST', {}).then(response => {
			if (response.data && response.data.status && response.data.status.status === "SUCCESS" && response.data.cartHeaderDetails.login) {
				this.setState({ user_email: response.data.cartHeaderDetails.login, errorEmail: false,validEmail: false, cartdetails: response.data.cartHeaderDetails})
			}else if(response && response.data && response.data.cartHeaderDetails){
				this.setState({cartdetails: response.data.cartHeaderDetails})
			}
		});
	}

	render() {
		const staticMetaTags = this.props.staticLabels;
		const domainName = this.props.domainName;

		const { user_email, user_pass, errorEmail, errorPassword, cartdetails } = this.state;

		let user__email = {
			inputId: 'user_email',
			nameInput: 'user_email',
			labelText: staticMetaTags && staticMetaTags['pwa.loginPage.email.label'],
			required: true,
			helperText: user_email ? "Ingresa un correo electrónico valido" : staticMetaTags && staticMetaTags['pwa.loginPage.electronicaerror.label'],
			type: 'text',
			maxlength: '100',
			extraClass: "mt-2"
		}
		let user__password = {
			inputId: 'user_pass',
			nameInput: 'user_pass',
			labelText: staticMetaTags && staticMetaTags['pwa.loginPage.password.label'],
			required: true,
			helperText: user_pass ? staticMetaTags && staticMetaTags['pwa.loginPage.minimumeight.label'] : staticMetaTags && staticMetaTags['pwa.loginPage.contrasenaerror.label'],
			type: 'password',
			minLength: "8",
			maxlength: '50',
			incognito: true
		}
		return (
			<div className="m-box-form__content p-4" >
				<InputText options={user__email} onBlur={this.onBlur} onFocus={this.onFocus} handleChange={this.handleOnChange} inputValue={user_email} error={errorEmail} ref={em => this.email = em} onKeypress={this.onKeypress}/>
				<InputText options={user__password} onBlur={this.onBlur} onFocus={this.onFocus} handleChange={this.handleOnChange} inputValue={user_pass} ref={ps => this.password = ps} error={errorPassword} onKeypress={this.onKeypress}/>
				<div ref={this.loginButton}>
					<Button className="a-btn a-btn--primary" ripple="ripple" type="submit" onClick={this.handleFormSubmit} >{staticMetaTags['pwa.loginPage.loginNewSmall.label']}</Button></div>
				<Link classNameAnchor="-primary-style a-login-anchor--forgotPass" href='/tienda/users/forgotPassword' asInfo='/tienda/users/forgotPassword'>{staticMetaTags['pwa.loginPage.forgotPassword.label']}</Link>
				<LoginDetails staticMetaTags={staticMetaTags} onHandleChecked={this.props.onHandleChecked} login='true' />
				<hr />

				{
					this.props.continueAsGuestBtn && cartdetails.isLoggedIn === false && cartdetails.cartCount > 0 &&
					<div>
						<Label className="a-login-label--new">{staticMetaTags && staticMetaTags["pwa.checkoutLoginPopupPage.purchaseWithoutRegistrationMsg1"]}
						</Label>
						<Button className="a-btn a-btn--secondary" type="button" onClick={this.props.buyWithOutRegistration}>{staticMetaTags['pwa.checkoutLoginPopupPage.purchaseWithoutRegistrationMsg']}</Button>
					</div>
				}

				{domainName === "liverpool" ? <Label className="a-login-label--new">{staticMetaTags && staticMetaTags["pwa.loginPage.nuevomessage.label"]}</Label> : <Label className="a-login-label--new">¿Nuevo en {domainName}?</Label>}
				<Button className="a-btn a-btn--tertiary" handleClick={this.OnClickCreateAccount} ripple="ripple" type="submit" form="formLogin" id="create_account">{staticMetaTags['pwa.loginPage.registerButton.label']}</Button>
			</div>
		);
	}
}

// function validateEmail(email) {
// 	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 	return re.test(String(email).toLowerCase()) ? 'true' : 'false';
// }
