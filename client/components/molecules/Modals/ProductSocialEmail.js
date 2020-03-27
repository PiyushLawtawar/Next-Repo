import React from 'react';
import ModalHeader from './ModalHeader';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import Input from '../../atoms/Input/Input';
import Label from '../../atoms/Label/Label';
import { H3 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export default class extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			data: [
				{ focus: false, value: '', isValid: '' },
				{ focus: false, value: '', isValid: '' }
			],
			emailHelperText: ""
		};
	}

	handleOnFocus = (index) => {
		let data = this.state.data;
		data[index]['focus'] = true;
		this.setState({ data });
	}

	handleOnBlur = (index) => {
		let data = this.state.data;
		data[index]['focus'] = false;
		this.setState({ data });
	}

	handleOnChange = (e, index) => {
		try {
			const val = e.target.value || '';
			let data = this.state.data;
			data[index]['value'] = val;
			this.setState({ data });
		} catch (e) { }
	}

	handleFormSubmit = (e) => {

		let data = this.state.data;

		if (data[0]['value'] === '') {
			data[0]['isValid'] = 'false';
		} else {
			data[0]['isValid'] = 'true';
		}
		let emailValidation = this.validateEmail(data[1]['value']);
		let emailHelperText = emailValidation.emailHelperText
		data[1]['isValid'] = emailValidation.data[1]['isValid']

		// let emailId = data[1]['value'];
		// if (emailId === '' || validateEmail(emailId) === 'false') {
		// 	data[1]['isValid'] = 'false';
		// } else {
		// 	data[1]['isValid'] = 'true';
		// }

		if (data[0]['isValid'] === '' || data[0]['isValid'] === 'false' || data[1]['isValid'] === '' || data[1]['isValid'] === 'false') {
			this.setState({ data, emailHelperText });
			e.preventDefault();
			e.stopPropagation();
		}
	}
	validateEmail = (email) => {
		//var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let msg = ""
		if (String(email).toLowerCase() != "") {
			if (String(email).toLowerCase().includes("@")) {
				if (!re.test(String(email).toLowerCase())) {
					msg = this.props.staticLabels && this.props.staticLabels['pdpPage.share.email.address.error.text'] || "Praveen Escribe un email (ejemplo@correo.com)"
					let emailarray = email.split("@");
					let mailIdReg = /^[ A-Za-z0-9_.]*$/
					if (!mailIdReg.test(String(emailarray[0]).toLowerCase())) {
						msg = this.props.staticLabels && this.props.staticLabels['pdpPage.share.email.address.id.error.text'] || "aparte del  '@' no debe contener simbolos'."
					}
				}
			}
			else {
				msg = this.props.staticLabels && this.props.staticLabels['pdpPage.share.email.address.atmissing.error.text'] || "Por favor incluye un '@' en la dirección de envió. 'email texto que le hace falta"
			}

		}
		else {
			msg = this.props.staticLabels && this.props.staticLabels['pdpPage.share.email.address.empty.error.text'] || "Ingresa un correo electrónico"
		}
		let data = this.state.data;
		if (msg != "") {

			data[1]['isValid'] = 'false'
			//this.setState({helperText:msg, data })
		}
		else {
			data[1]['isValid'] = 'true'
		}
		return { emailHelperText: msg, data }
	}

	render() {

		const staticLabels = this.props.staticLabels || {};
		const modalHeader = {
			title: staticLabels && staticLabels['pdpPage.share.email.modal.title'] || 'pdpPage.share.email.modal.title', // 'Comparte este artículo por email',
			titleType: 'h4',
			headlineAttributes: {
				"id": "share-email-modal"
			},
			close: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			}
		};

		const emailInfo = [
			{
				inputId: 'emailFrom',
				labelText: staticLabels && staticLabels['pdpPage.emaillabelText.from.text'] || 'pdpPage.emaillabelText.from.text',
				nameInput: 'DE_NOMBRE_EMAIL',
				required: true,
				type: 'text',
				helperText: staticLabels && staticLabels['pdpPage.share.email.from.error.text'] || 'pdpPage.share.email.from.error.text', // 'Escribe tu nombre'
			},
			{
				inputId: 'emailTo',
				labelText: staticLabels && staticLabels['pdpPage.Para_belText.from.text'] || 'pdpPage.Para_labelText.from.text',
				nameInput: 'EMAIL_ADDRESS_',
				required: true,
				type: 'email',
				helperText: this.state.emailHelperText || (staticLabels && staticLabels['pdpPage.share.email.address.error.text']) || 'pdpPage.share.email.address.error.text', // 'Escribe un email (ejemplo@correo.com)'
			}
		];

		const formData = this.props.productSocialEmailData || {};
		//console.log("host name in email", formData.hostName);
		let hostName = formData.hostName;
		let domainName = 'LP';

		try {
			hostName = hostName.replace(/.+?\./, '');
			//console.log("inside try", hostName)
			switch (hostName) {
				case 'williams-sonoma.com.mx':
					domainName = 'WS';
					break;
				case 'potterybarn.com.mx':
					domainName = 'PB';
					break;
				case 'potterybarnkids.com.mx':
					domainName = 'PBK';
					break;
				case 'pbteen.com.mx':
					domainName = 'PBT';
					break;
				case 'westelm.com.mx':
					domainName = 'WLM';
					break;
				default:
					domainName = 'LP';
			}
		} catch (e) {

		}
		let shareVal = 'SHARE';
		if( domainName !== 'LP') {
			if (domainName === 'WLM') {
				shareVal = 'SHARE_WE';
			} else {
				shareVal = 'SHARE_' + domainName;
			}
		}
		// console.log("domain name in email", domainName);
		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
				<div className="modal-body" style={{ overflowX: "hidden" }}>
					<div className="m-product__emailShareForm">
						<form action={staticLabels['pdpPage.eamil_from.action'] || 'pdpPage.eamil_from.action'} method="get" target="_self" onSubmit={this.handleFormSubmit}>
							<div className="row">
								{!isEmpty(emailInfo) && map(emailInfo, (item, i) => {

									let disabledClass = '';
									if (item.disabled) {
										disabledClass = "mdc-text-field--disabled";
									}

									return <div key={i} className="col-12">
										<div className={`m-textField mdc-text-field mdc-text-field--outlined ${disabledClass} ${(this.state.data[i].focus) ? "mdc-text-field--focused" : ""} ${(this.state.data[i].isValid === 'false') ? "mdc-text-field--invalid" : ""}`}>
											{item.inputId === "emailFrom" ?
												<Input maxLength="20" className={`a-textField__input mdc-text-field__input ${(this.state.data[i].focus || this.state.data[i].value) ? "mdc-notched-outline--notched" : ""}`} type={item.type} id={item.inputId} name={item.nameInput} onFocus={() => this.handleOnFocus(i)} onBlur={() => this.handleOnBlur(i)} onChange={(e) => this.handleOnChange(e, i)} />
												:
												<Input maxLength="250" className={`a-textField__input mdc-text-field__input ${(this.state.data[i].focus || this.state.data[i].value) ? "mdc-notched-outline--notched" : ""}`} type={item.type} id={item.inputId} name={item.nameInput} onFocus={() => this.handleOnFocus(i)} onBlur={() => this.handleOnBlur(i)} onChange={(e) => this.handleOnChange(e, i)} />
											}

											<div className={`m-mdc__notchedOutline mdc-notched-outline mdc-notched-outline--upgraded ${(this.state.data[i].focus || this.state.data[i].value) ? "mdc-notched-outline--notched" : ""}`}>
												<div className="m-mdc__notchedLeading mdc-notched-outline__leading"></div>
												<div className="m-mdc__notchedNotch mdc-notched-outline__notch">
													<Label className={`a-textField__label mdc-floating-label ${(this.state.data[i].focus || this.state.data[i].value) ? "mdc-floating-label--float-above" : ""}`} htmlFor={item.inputId}>{item.labelText}</Label>
												</div>
												<div className="mdc-notched-outline__trailing"></div>
											</div>
										</div>
										<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
											<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">{item.helperText}</Paragraph>
										</div>
									</div>
								})}
							</div>
							<div className="m-product__emailShareContent">
								<div className="row">
									<div className="col-4">
										<Image className="a-product__imageEmailShareContent" src={formData.skuLargeImage} alt={formData.productDescription} />
									</div>
									<div className="col-8 mt-2">
										<H3 className="a-product__headLineEmailShareContent" headLineText={formData.productDescription} />
										<Paragraph className="a-product__paragraphEmailShareContent">Código de producto: {formData.productId}</Paragraph>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-12 col-lg-4 offset-lg-8">

									<Input type="hidden" name="ID_ENCUESTA" value={shareVal} />
									<Input type="hidden" name="CUSTOMER_ID_" value={shareVal} id="Customer" />
									<Input type="hidden" name="DESC_PRODUCTO" id="desc_producto" value={formData.productDescription} />
									<Input type="hidden" name="SKU_PRODUCTO" id="sku_producto" value={formData.productId} />
									<Input type="hidden" name="UTM_PRODUCTO" id="utm_producto" value={formData.skuLargeImage} />
									<Input type="hidden" name="URL_IMAGEN" id="url_imagen" value={formData.pageUrl} />
									<Input type="hidden" id="hiddenInput" value={formData.pageUrl} />
									<Button className="mdc-button a-btn__primary a-product__buttonShare" type="submit" id="sendButton" name="_ri_" value={staticLabels[`pdpPage.${domainName}.eamil_from.submitval`] || `pdpPage.${domainName}.eamil_from.submitval`}>Compartir</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

// const validateEmail = (email) => {
// 	//var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//

// 	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// 	let msg = ""

// 	if (!re.test(String(email).toLowerCase())) {
// 		msg = "Escribe un email (ejemplo@correo.com)"
// 		let emailarray = email.split("@");
// 		let mailIdReg = /^[ A-Za-z0-9_.]*$/
// 		if (!mailIdReg.test(String(emailarray).toLowerCase())) {
// 			msg = "aparte del  '@' no debe contener simbolos'."
// 		}
// 	}
// 	return msg
// }
