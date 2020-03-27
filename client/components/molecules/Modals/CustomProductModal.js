// Custom Products functionality START
import React from 'react';
import ModalHeader from './ModalHeader';
import Label from '../../atoms/Label/Label';
import InputText from '../../molecules/InputText/InputText';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import Button from '../../atoms/Button/Button';
import Icons from '../../atoms/Icons/Icons';
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';
import Alert from '../../molecules/Alert/Alert';
import { parentContext } from '../../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';

export default class CustomProductModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			font: 'American Typewriter',
			size: '2.5 cm',
			color: 'negro',
			lengthText: 0,
			maxLenghtText: 8,
			errorMaxText: false,
			errorEmptyText: false,
			errorEmptyColor: false,
			errorBigWords: false,
			alertSucess: false,
			alert_status: false,
			loader: true,
			colors: [
				{
					id: 1,
					hexa: 'rgb(0, 0, 0)',
					name: 'negro',
					selected: true
				},
				{
					id: 2,
					hexa: '#9b9b9b',
					name: 'gris',
					selected: false
				},
				{
					id: 3,
					hexa: '#223a67',
					name: 'azul',
					selected: false
				},
				{
					id: 4,
					hexa: '#a62e34',
					name: 'rojo',
					selected: false
				},
				{
					id: 5,
					hexa: '#b7834a',
					name: 'dorado',
					selected: false
				},
				{
					id: 6,
					hexa: '#417505',
					name: 'verde',
					selected: false
				},
				{
					id: 7,
					hexa: '#e06ea5',
					name: 'rosa',
					selected: false
				}
			]
		}
		this.existing = '';
		this.myRefTop = React.createRef()
	}

	componentDidMount() {
		this.getImage();
		this.updateInfoModal();
	}

	updateInfoModal = () => {
		const data = JSON.parse(localStorage.getItem('customProduct'));

		if (!isEmpty(data)) {
			data.map(item => {
				if (item.sku === this.props.productId) {
					this.setState({
						text: item.text,
						font: item.font,
						size: item.size,
						color: item.color,
						colors: item.colors,
						lengthText: item.text.toString().length
					})
				}
			});
		}
		return null ;
	}

  getImage = () => {
    try {
      fetch('https://us-central1-productospersonalizados-edea9.cloudfunctions.net/getSkus',{
          mode: 'cors',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
      })
      .then(res => {
        this.setState({
          loader: true
        });
        return res.json();
      })
      .then(res => {
        if (res.success) {
          res.data.map(item => {
            if (item.sku === this.props.productId) {
              // setTimeout(() => {
                this.setState({
                  imagePath: item.image,
                  loader: false
                })
              // }, 15000)
            }
          })
        }
      })
      .catch(err => console.log("ERROR FETCH ", err));
    } catch(err) {
        console.log("ERROR GET SKUS", err);
    }
};

	handleOnChangeText = (e) => {
    const { size } = this.state;
    let text = e.target.value;
    if (text.match(/[^a-zA-Z0-9ñáéíóúü ]/g)) {
      text = text.replace(/[^a-zA-Z0-9ñáéíóúü ]/g, '');
    }

		switch (size) {
			case "2.5 cm":
				if (e.target.value.length <= 8) {
					this.setState({ 
						[e.target.name]: e.target.value,
						lengthText: e.target.value.length,
						errorMaxText: false,
						errorEmptyText: false,
						errorBigWords: false,
						text: text
					});
				} 
				break;
			case "3 cm":
				if (e.target.value.length <= 6) {
					this.setState({ 
						[e.target.name]: e.target.value,
						lengthText: e.target.value.length,
						errorMaxText: false,
						errorEmptyText: false,
						errorBigWords: false,
						text: text
					});
				} 
				break;				
			case "4 cm":
				if (e.target.value.length <= 4) {
					this.setState({ 
						[e.target.name]: e.target.value,
						lengthText: e.target.value.length,
						errorMaxText: false,
						errorEmptyText: false,
						errorBigWords: false,
						text: text
					});
				}
				break;	
			default:
				break;
		}

	}

	handleOnChangeFont = (e) => {
		const fontSelected = e.target.value;

		this.setState({
			font: fontSelected
		});
	}

	handleOnChangeSize = (e) => {		
		
		let { text, errorMaxText} = this.state;
		const targetValue = e.target.value;
		let newMaxLenghtText = 0;
		let newText = false;
		let newLengthText = 0;
		let newErrorName = false;

		if (targetValue === '2.5 cm' ) {
			if (text.length <= 8) {
				newText = text;
				newLengthText = text.length;
				newErrorName = errorMaxText;
			}
			newMaxLenghtText = 8;

		} else if (targetValue === '3 cm') {

			if (text.length > 6) {
				newText = '';
				newErrorName = true;
				if (this.props.isMobile || this.props.isIpad) {
					let divToScroll = this.props.window.document.getElementsByClassName('modal')[0];
					divToScroll.scrollTop = 0;
				}
			} else {
				newText = text;
				newLengthText = text.length;
				newErrorName = errorMaxText;
			}
			newMaxLenghtText = 6;

		} else if (targetValue === '4 cm') {

			if (text.length > 4) {
				newText = '';
				newErrorName = true;
				if (this.props.isMobile || this.props.isIpad) {
					let divToScroll = this.props.window.document.getElementsByClassName('modal')[0];
					divToScroll.scrollTop = 0;
				}
			} else {
				newText = text;
				newLengthText = text.length;
				newErrorName = errorMaxText;
			}
			newMaxLenghtText = 4;
		}

		this.setState({
			maxLenghtText: newMaxLenghtText,
			size: targetValue,
			text: newText,
			lengthText: newLengthText,
			errorMaxText: newErrorName,
		})
	}

	handleClickColor = (id, name) => {
		this.setState((prevState) => {
			return ({
				colors: prevState.colors.map((color) => {
					color.selected = false;
					if (color.id === id) {
						return {
							...color,
							selected: !color.selected
						}
					} else {
						return color;
					}
				}),
				color: name,
				errorEmptyColor: false
			})
		})
	}

	handleClickAccept = (closeModal) => {

		const { text, 
			color, 
			size, 
			font, 
			errorBigWords, 
			errorEmptyText, 
			errorEmptyColor, 
      errorMaxText } = this.state;
      
    const arrayBigWords = ['apañar', 'asesinar', 'asesino', 'babosa', 'bitch', 'chingada', 'cagante', 'cagon', 'carajo', 'bubis', 'chingado', 'cabron', 'boludo', 'chingar', 'cagar', 'cagada', 'clitoris', 'cocaina', 'cojo', 'cojones', 'colofox', 'coño', 'culeada', 'culera', 'culero', 'culo', 'culote', 'dick', 'drogas', 'estupido', 'facismo', 'jodase', 'follador', 'follar', 'fornicar', 'fuck', 'fucker', 'fuckin', 'gargajo', 'golfa', 'güevo', 'huevon', 'huevudo', 'ijueputa', 'jeton', 'joder', 'joto', 'ladrones', 'lenon', 'mamada', 'mamadota', 'mamar', 'mamerto', 'mamon', 'marica', 'maricon', 'mierda', 'mierdota', 'narco', 'nazismo', 'ojete', 'opio', 'panocha', 'panochon', 'pason', 'pedo', 'pelotudo', 'pendeja', 'pendejo', 'perverso', 'ass', 'pinche', 'pinches', 'piruja', 'pito', 'pitote', 'pucha', 'pussy', 'puta', 'putera', 'putisima', 'putisimo', 'putita', 'putito', 'puto', 'puton', 'putota', 'putote', 'rameras', 'ratero', 'ratonear', 'sadico', 'shit', 'shon', 'des', 'sicario', 'suastica', 'suicidio', 'tacha', 'tarado','tontejo', 'verga', 'vergasos', 'vergaste', 'vergota', 'verguita', 'verija', 'verijon', 'wey', 'ahorcar', 'amputar', 'ano', 'apuñalar', 'asesinar', 'asesinar', 'asesino', 'asesinos', 'asfixiar', 'ashole', 'asholes', 'asshole', 'assholes', 'atentado', 'beltran', 'leyva', 'bin', 'laden', 'blowjob', 'blowjobs', 'chapo', 'chingada', 'chingar', 'chingar', 'chingars', 'chingo', 'clitoris', 'coño', 'coños', 'cula', 'culadero', 'culazo', 'culeado', 'culear', 'culearse', 'culei', 'culeis', 'culero', 'culeros', 'culísimo', 'culo', 'culos', 'dick', 'dicks', 'droga', 'guerra', 'hitler', 'maldita', 'maldito', 'maldoso', 'mutilar', 'narco', 'nazi', 'odio', 'osama', 'ossama', 'pendejas', 'pendejos', 'pepazo', 'peresoza', 'perezoso', 'puchas', 'punjetas', 'puñeta', 'puñetas', 'pussy', 'pussys', 'putarrón', 'putas', 'putativo', 'putazo', 'putazos', 'puteada', 'putear', 'putears', 'putearse', 'puterias', 'puterio', 'putesa', 'putifera', 'putimas', 'putin', 'putísima', 'putísimo', 'putita', 'putitas', 'putón', 'putos', 'sicario', 'sicarios', 'sidoso', 'sidosos', 'suicidio', 'torturar', 'vagina', 'abusar', 'agraviar', 'agredir', 'amatar', 'asaltar', 'asesinar', 'biolar', 'dañar', 'golpear', 'herir', 'insultar', 'insulto', 'lastimar', 'matar', 'matars', 'mutilar', 'ofender', 'torturar', 'violar' ];

		let bigWord = arrayBigWords.includes(text.toLowerCase());

		if (text.length === 0 || color.length === 0) {
			this.setState({
				errorEmptyText: text.length === 0 ? true : false,
				errorEmptyColor: color.length === 0 ? true : false
			})
			if (this.props.isMobile || this.props.isIpad) {
				let divToScroll = this.props.window.document.getElementsByClassName('modal')[0];
				divToScroll.scrollTop = 0;
			}
		} else if (bigWord) {
			this.setState({
				errorBigWords: true
			});
			if (this.props.isMobile || this.props.isIpad) {
				let divToScroll = this.props.window.document.getElementsByClassName('modal')[0];
				divToScroll.scrollTop = 0;
			}
		} else if (!errorBigWords || !errorEmptyText || !errorEmptyColor || !errorMaxText) {
			this.setState({
				errorBigWords: false,
				alertSucess: true,
				alert_status: true
			});
			
			const personalization =
				{
					text,
					font,
					size,
					color,
					sku: this.props.productId,
					colors: this.state.colors
				};
			
			this.existing = JSON.parse(localStorage.getItem("customProduct"));

			if (!isEmpty(this.existing)) {

				// REMOVING DUPLICATE IN ARRAY LOCAL STORAGE
				this.existing.unshift(personalization);
				let uniqueSkus = Array.from(new Set(this.existing.map(item => item.sku)))
				.map(id => {
					return this.existing.find(b => b.sku === id)
				});

				if(uniqueSkus.length > 0) {
					localStorage.setItem("customProduct", JSON.stringify(uniqueSkus));
				} else {
					this.existing = [];
					this.existing.push(personalization);
					localStorage.setItem("customProduct", JSON.stringify(this.existing));
				}

			} else {
				this.existing = [];
				this.existing.push(personalization);
				localStorage.setItem("customProduct", JSON.stringify(this.existing));
			}

			// setTimeout(() => {
			// 	this.setState({ alert_status: false });
			// }, 6000);

			// CLOSE MODAL
      closeModal('showModalPersonalization');
      // ADD PRODUCT IN MY BAG
      // this.props.handleAddToMyBag();
			// ALERT PROPS
			const customProduct = true;
			this.props.handleCustomProduct(customProduct);
			// INFO BUTTON CUSTOM PRODUCT
			this.props.handleInfoButton(customProduct);
		}
	}

	dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

	render() {
		const modalHeader = {
			title: 'Personaliza tu bota',
			titleType: 'h4',
			headlineAttributes: {
				"id": "custom-product-modal"
			},
			close: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			},
      requireArrow: false
    }

		const text_options = {
			inputId: 'text',
			nameInput: 'text',
			labelText: "Ingresa el texto",
			required: true,
			type: 'text',
			maxlength: `${this.state.maxLenghtText}`,
			extraClass: "mt-2",
			// helperTextForRequired: `${this.state.lengthText}/${this.state.maxLenghtText}`,
			helperText: this.state.errorEmptyText || this.state.errorBigWords || this.state.errorMaxText ? null : 'Escribe el texto a personalizar',
      // showOptional: true
		}

		const font_options = { 
			labelText: 'Tipo de letra', 
			labelId: 'label-font', 
			selected: 'selectFont', 
			optionList: [
				{
					id: 'american',
					value: 'American Typewriter',
					selected: this.state.font === 'American Typewriter' ? true : false
				},
				{
					id: 'ballatines',
					value: 'Ballantines Serial',
					selected: this.state.font === 'Ballantines Serial' ? true : false
				},
				{
					id: 'graffiti',
					value: 'Design Graffiti Kids',
					selected: this.state.font === 'Design Graffiti Kids' ? true : false
				},
				{
					id: 'garamondFont',
					value: 'Garamond Regular',
					selected: this.state.font === 'Garamond Regular' ? true : false
				},
				{
					id: 'times',
					value: 'Times New Roman',
					selected: this.state.font === 'Times New Roman' ? true : false
				}
			], 
			selectText: 'Seleccionar',
			helperText: 'Selecciona una opción',
      selected: true,
      required: true
			// optionCaption: 'Selecciona'
		}

		const size_options = {
			labelText: 'Tamaño de letra', 
			labelId: 'label-size', 
			selected: 'selectSize', 
			optionList: [
				{
					id: 1,
					value: '2.5 cm',
					selected: this.state.size === '2.5 cm' ? true : false
				},
				{
					id: 2,
					value: '3 cm',
					selected: this.state.size === '3 cm' ? true : false
				},
				{
					id: 3,
					value: '4 cm',
					selected: this.state.size === '4 cm' ? true : false
				}
			],
			selectText: 'Seleccionar',
      selected: true,
      required: true
		}
		
		const { 
			font, 
			text, 
			color,
			colors,
			errorEmptyText, 
			errorMaxText, 
			errorEmptyColor,
			errorBigWords
		} = this.state;

		return (
			<div className="wrapper-modal" ref={this.myRefTop}>
				<ModalHeader modalHeader={modalHeader} />
				{ this.state.alertSucess &&
					<Alert 
						alertTopClass="m-alert__container mdc-snackbar -success" 
						iconType="a-alert__icon icon-done" 
						text='Gracias por personalizar tu bota navideña' 
						alert_status={this.state.alert_status} 
						dismiss_alert={this.dismiss_alert}
					/>
				}
				<div className="modal-body">
					<div className="row inner-modal">
						<div className="col-md-6 boot">
							<div className="box">
								{ this.state.loader
									? (
										<div className="loader-custom-products">
											<img src='/static/images/loading/liverpool/imageLoading.svg' alt="loader"/>
										</div>
									)
									: <img src={this.state.imagePath} alt="bota navideña liverpool" width="245px"/>
								}
								<span 
									className={`text-personalization 
										${font === 'American Typewriter'
										? 'font-american'
										: (font === 'Ballantines Serial'
											? 'font-ballantines'
											: (font === 'Design Graffiti Kids'
												? 'font-graffiti'
												: (font === 'Garamond Regular'
													? 'font-garamondFont'
													: (font === 'Times New Roman' 
														? 'font-times'
														: null
														)
													)
												)
											)
										}
										${color === 'negro'
										? 'negro'
										: (color === 'azul'
											? 'azul'
											: (color === 'rosa'
												? 'rosa'
												: (color === 'rojo'
													? 'rojo'
													: (color === 'dorado'
														? 'dorado'
														: ( color === 'verde'
															? 'verde'
															: (color === 'gris'
																? 'gris'
																: null
															)
														)
													)
												)
											)
										)
									}
								`}>
									{ this.state.imagePath &&
										text 
									}
								</span>
							</div>
						</div>

						<div className="col-md-6 form">
							<div className="wrapper-input-name">
								<div className="input-name">
									<div className="title-button">
										<Label className="step-one-personalization" >
											1. Ingresa el texto
										</Label>
										<Icons id="NamePersonalization" className="a-login--iconHelper ml-1" />

										<CustomTooltip
											tooltipFor="NamePersonalization"
											trigger="click"
											content="En caso de detectar palabras ofensivas o discriminatorias, Liverpool podrá cancelar el pedido y dará aviso al cliente sobre dicha cancelación."
											position="top"
											arrowSize="8px"
											borderSize="1px"
											contentPadding="10px 22px 10px 10px"
											boxClass="customBoxSizing"
											adjustedPosition="0"
										>
										</CustomTooltip>
									</div>

									<InputText 
										options={text_options} 
										handleChange={this.handleOnChangeText}
										inputValue={text}
                    error={errorEmptyText || errorMaxText || errorBigWords}
                    // pattern={}
										// onBlur={this.onBlur} 
										// onFocus={this.onFocus} 
										// ref={em => this.email = em} 
										// onKeypress={this.onKeypress}
									/>

									{ (errorEmptyText || errorMaxText || errorBigWords) &&
										<p className="message-error">
											{`${errorMaxText
												? 'El largo del texto supera el tamaño'
												: (errorEmptyText
													? 'Este campo es requerido'
													: (errorBigWords
														? 'No se permite utilizar groserías'
														: null 	
													)
												)
											}`}
										</p>
									}
									<div className="helperText-counter">
										<p>{`${this.state.lengthText}/${this.state.maxLenghtText}`}</p>
									</div>
								</div>
							</div>

							<div className="wrapper-font-size">
                <div className="wrapper-label-size">
                  <Label className="step-two-personalizatio" >
                    2. Personaliza el texto
                  </Label>
                  <Icons id="sizePersonalization" className="a-login--iconHelper ml-1" />
                  <CustomTooltip
                    tooltipFor="sizePersonalization"
                    trigger="click"
                    content="La cantidad de carácteres depende del tamaño de letra."
                    position="top"
                    arrowSize="8px"
                    borderSize="1px"
                    contentPadding="10px 22px 10px 10px"
                    boxClass="customBoxSizing"
                    adjustedPosition="0"
                  >
                  </CustomTooltip>
                </div>

								<div className="selects-text">
									<InputSelect
										options={font_options}
										name="Typefont"
										value={font}
										required
										handleChange={this.handleOnChangeFont}
										required
									/>
									<InputSelect
										options={size_options}
										name="TypeSize"
										value={this.state.size}
										required
										handleChange={this.handleOnChangeSize}
									/>
								</div>
							</div>

							<div className="wrapper-colors">
								<Label>
									3. Selecciona el color del bordado
								</Label>
								<ul className="colors">
									{ colors.map((color, i) => {
										return (
											<li 
												key={i}
												className={`a-productColorModal 
													${color.selected ? 'active' : null}
													${errorEmptyColor ? 'error-color' : null}
												`}
											>
												<span 
													style={{ backgroundColor: color.hexa }}
													onClick={() => this.handleClickColor(color.id, color.name)}
												></span>
											</li>
										)
									})
								}
								</ul>
								{ errorEmptyColor &&
									<p className="message-error-color">
										Selecciona un color
									</p>
								}
							</div>
						</div>
					</div>
					<div className="wrapper-button-terminos">
						<div className="row m-buttons-modal">
							<div className="col-md-6">
							<parentContext.Consumer>
								{({ closeModal }) => (
									<Button 
										className="a-btn a-btn--tertiary a-product__buttonCancelar mb-3" 
										ripple="" 
										handleClick={() => closeModal('showModalPersonalization')}
									>
										Cancelar
									</Button>
								)}
							</parentContext.Consumer>
							</div>
							<div className="col-md-6">
								<parentContext.Consumer>
									{
                    ({ closeModal }) => (
										<Button 
											className="a-btn a-btn--tertiary a-product__buttonAcept mb-3" 
											ripple="" 
                      onClick={ () => {this.handleClickAccept(closeModal)}}
										>
                      Aceptar
										</Button>
									)}
								</parentContext.Consumer>
							</div>
						</div>
						<div className="m-terminos-condiciones">
							<p>Las imágenes mostradas son ilustrativas, por lo que debido al sistema, los colores y tonalidades pueden tener variaciones.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
// Custom Products functionality END