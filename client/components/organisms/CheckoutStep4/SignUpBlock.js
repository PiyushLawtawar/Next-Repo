/**
* Module Name : SignUpBlock
* Functionality : Showing signup template
* @exports : SignUpBlock
* @requires : module:React
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/molecules/InputText/InputText
* @requires : module:/molecules/MaterialInputRadio/MaterialInputRadio
* @requires : module:/atoms/Button/Button
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Icons/Icons
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* @requires : module:next/router
* @requires : module:/molecules/LiverpoolDatePicker/LiverpoolDatePicker
* @requires : module:react-tooltip
* @requires : module:/molecules/Modals/datePickerStyle.styl
* Team : Checkout Team
* Other information : Showing form to signup to the guest user.
* 
*/
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import { InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import InputText from '../../molecules/InputText/InputText';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import Button from '../../atoms/Button/Button';
import Span from '../../atoms/Span/Span';
import Icons from '../../atoms/Icons/Icons';
import { Utility, UserAgentDetails } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';
import LiverpoolDatePicker from '../../molecules/LiverpoolDatePicker/LiverpoolDatePicker';
import ReactTooltip from 'react-tooltip';
import '../../molecules/Modals/datePickerStyle.styl'

/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.show = React.createRef();
        this.state = {
            date: '',
            firstName: '',
            email: '',
            password: '',
            repassword: '',
            lastName: '',
            birth: '',
            sessionActive: false,
            gender: '',
            user_bdayDAY: '',
            user_bdayMONTH: '',
            user_bdayYEAR: '',
            isMobile: false,
            errorEmail: '',
            user_email_valid: true,
            user_pass_valid: true,
            errorPassword: '',
            errorPasswordConfirm: false,
            dateError: false,
            genderError: false
        };
        // this.firstName = React.createRef();
        // this.lastName = React.createRef();
        // this.email = React.createRef();
        // this.password = React.createRef();
        // this.repassword = React.createRef();
        // this.birth = React.createRef();
        this.addressDetail = {},
            this.emailDetail = ''

    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        const { isMobile } = UserAgentDetails(window);
        this.setState({ isMobile });
        this.addressDetail = this.props && this.props.orderData && this.props.orderData.deleveryAddressDetail ? this.props.orderData.deleveryAddressDetail : '';
        this.emailDetail = this.props && this.props.orderData && this.props.orderData.email ? this.props.orderData.email : '';
        this.setState({
            firstName: this.addressDetail.firstName,
            lastName: this.addressDetail.lastName,
            email: this.emailDetail
        })

    }

    /**
     * Method will call by selecting check box
     * @function handleLoginCheckBox
     * @author shreyansh.khare@zensar.com
     * @desc Handling login checkbox toggle
     * @param {object} e
     * 
     */
    handleLoginCheckBox = (e) => {
        const checkedValue = e.target && e.target.checked;
        this.props.onHandleChecked(checkedValue);
    }

    // showPopover = (e, id) => {
    //     if (id === 'show') {
    //         this.show.current.classList.add('show');
    //     } else {
    //         this.show.current.classList.remove('show');
    //     }
    //     e.stopPropagation();
    // }

    /**
     * Method will call on click of send button.
     * @function registerUser
     * @author shreyansh.khare@zensar.com
     * @desc Validating rgister form and Making RESTful service call to create account.
     * 
     */
    registerUser = () => {

        const { email, password, repassword, firstName, lastName, user_bdayDAY, user_bdayMONTH, user_bdayYEAR, date, gender, errorPassword, errorPasswordConfirm, user_email_valid } = this.state;

        // if (e.target.name === "email") {
        //         const user_email_valid = this.validateEmail(e.target.value);
        //         this.setState({ user_email_valid: user_email_valid })
        //         if (user_email_valid === 'false' && e.target.value) {
        //             this.setState({ errorEmail: true })
        //         } else {
        //             this.setState({ errorEmail: false })
        //         }
        //     }

        if (this.addressDetail && this.emailDetail) {
            let user_email_validCheck = this.validateEmail(this.emailDetail);
            if (user_email_validCheck === true) {
                user_email_valid = true;
            }
            if (user_email_validCheck === false) {
                user_email_valid = false;
            }
            this.setState({
                firstName:firstName,
                lastName:lastName,
                email: email,
            })
        }

        const payload = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            bdayDAY: this.state.user_bdayDAY,
            bdayMONTH: this.state.user_bdayMONTH,
            bdayYEAR: this.state.user_bdayYEAR,
            gender: this.state.gender
        };


        this.firstName.validation();
        this.lastName.validation();
        this.email.validation();
        this.password.validation();
        this.repassword.validation();
        if (date === '') {
            this.setState({ dateError: true })
        } else {
            this.setState({ dateError: false })
        }
        if (gender === '') {
            this.setState({ genderError: true })
        } else {
            this.setState({ genderError: false })
        }

        if (email && password && repassword && firstName && lastName && user_bdayDAY && user_bdayMONTH && user_bdayYEAR &&
            gender && !errorPasswordConfirm && user_email_valid && !errorPassword) {
            Utility(Path.createAccount, 'POST', payload).then(response => {
                if (response && response.data && response.data.s === "0") {
                    Router.push('/tienda/home')
                }else{
                      if (response && response.data && response.data.s === "1") {
                          this.setState({
                              emailErrMsg:response && response.data && response.data.err ||'',
                               errorEmail : true
                          })

                      }
                }
            }, (error) => {
                console.error(error);
            });
        }
    }

    /**
     * Method will call to validate email
     * @function validateEmail
     * @author shreyansh.khare@zensar.com
     * @desc This method will return status of the given email
     * @param {string} email
     * 
     */
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase()) ? 'true' : 'false';
    }

    /**
     * Method will call on change of input field.
     * @function handleChange
     * @author shreyansh.khare@zensar.com
     * @desc Common method will call on handle change
     * @param {object} e
     * 
     */
    handleChange = e => {
        // console.log('here',e.target.name)
        const { password } = this.state;
        this.setState({ [e.target.name]: e.target.value })
        if (e.target.name === "email") {
            const user_email_valid = this.validateEmail(e.target.value);
            this.setState({ user_email_valid: user_email_valid })
            if (user_email_valid === 'false' && e.target.value) {
                this.setState({ errorEmail: true })
            } else {
                this.setState({ errorEmail: false })
            }
        }
        if (e.target.name === "password") {
            const limitLength = e.target.minLength;

            if (e.target.value.length < limitLength) {
                this.setState({ errorPassword: true })
            } else {
                this.setState({ errorPassword: false })
            }
        }
        if (e.target.name === "repassword") {

            if (e.target.value !== password) {

                this.setState({ errorPasswordConfirm: true })
            } else {
                this.setState({ errorPasswordConfirm: false })
            }
        }
        if (e.target.name === "firstName") {
           let inputValue = e.target.value;
           const regExp = /^[A-Za-z]+$/;
           let result = regExp.test(inputValue);
           if(result === false){
               this.setState({firstName:inputValue.substring(0, inputValue.length - 1)});
           }
        }
          if (e.target.name === "lastName") {
           let inputValue = e.target.value;
           const regExp = /^[A-Za-z]+$/;
           let result = regExp.test(inputValue);
                if(result === false){
              this.setState({lastName:inputValue.substring(0, inputValue.length - 1)});
                 }
            }
        }

    /**
     * Method will call on gender value toggle
     * @function setGender
     * @author shreyansh.khare@zensar.com
     * @desc setting gender value to the state.
     * @param {string} value
     * 
     */
    setGender = value => {
        this.setState({ gender: value, genderError: false })
    }

    /**
     * Method will call to set session active status
     * @function setGender
     * @author shreyansh.khare@zensar.com
     * @desc setting session active status to the state.
     * @param {object} e
     * 
     */
    setSessionActive = e => {
        this.setState({ sessionActive: e.target.checked })
    }

    /**
     * Method will call on date change
     * @function dateChange
     * @author shreyansh.khare@zensar.com
     * @desc Updating date value to state
     * @param {object} date
     * 
     */
    dateChange = date => {
        this.setState({ date });
        let dateValue = date && date.getDate()
        let month = date && date.getMonth()
        let year = date && date.getFullYear()
        this.setState({
            user_bdayYEAR: year,
            user_bdayMONTH: month + 1,
            user_bdayDAY: dateValue,
            dateError: false
        })
    }

    /**
     * Method will call on date change
     * @function changeDate
     * @author shreyansh.khare@zensar.com
     * @desc Updating date value to state
     * @param {object} date
     * 
     */
    changeDate = date => {
        this.setState({ date: date });
        let dateValue = date && date.getDate();
        let month = date && date.getMonth();
        let year = date && date.getFullYear();
        this.setState({
            user_bdayYEAR: year,
            user_bdayMONTH: month + 1,
            user_bdayDAY: dateValue,
            dateError: false
        });
    }

  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */

    render() {
        const staticLabels = this.props.staticLabels;
        const male = {
            labelText: "Mujer",
            labelClass: "m-pdp__productDigital",
            labelPosition: "left",
            nameInput: "sexo",
            helperText: 'helper text',
            helperTextId: 'helper-text-id',
            required: 'false',
            checked: 'false',
            disabled: 'false',
            inputId: 'female'
        }
        const female = {
            labelText: "Hombre",
            labelClass: "m-pdp__productDigital",
            labelPosition: "left",
            nameInput: "sexo",
            helperText: 'helper text',
            helperTextId: 'helper-text-id',
            required: 'false',
            checked: 'false',
            disabled: 'false',
            inputId: 'male'
        }
        let nombre = {
            inputId: 'nombre',
            nameInput: 'firstName',
            labelText: 'Nombre',
            helperTextId: 'helper-nombreCorto',
            required: true,
            type: 'text',
            maxlength: '100',
            helperText: staticLabels && staticLabels["pwa.registerPage.nameRequired.errorMsg"] ? staticLabels["pwa.registerPage.nameRequired.errorMsg"] : ''
        }

        let email = {
            inputId: 'correo',
            nameInput: 'email',
            labelText: 'Correo electónico',
            helperTextId: 'helper-nombreCorto',
            required: true,
            type: 'email',
            maxlength: '100',
            helperText: this.state.emailErrMsg !==undefined ? this.state.emailErrMsg: staticLabels && staticLabels["pwa.registerPage.emailRequired.errorMsg"] ? staticLabels["pwa.registerPage.emailRequired.errorMsg"] : ''
        }

        let password = {
            inputId: 'password',
            nameInput: 'password',
            labelText: 'Contraseña',
            helperTextId: 'helper-nombreCorto',
            required: true,
            type: 'password',
            minLength: "8",
            helperText: this.state.password ? staticLabels && staticLabels["pwa.registerPage.pwdLengthRequired.errorMsg"] : staticLabels && staticLabels["pwa.registerPage.passwordRequired.errorMsg"]
        }
        let surName = {
            inputId: 'apellido',
            nameInput: 'lastName',
            labelText: 'Apellido',
            helperTextId: 'helper-nombreCorto',
            required: true,
            type: 'text',
            maxlength: '100',
            helperText: staticLabels && staticLabels["pwa.registerPage.maternoRequired.errorMsg"]
        }
        let birth = {
            inputId: 'birth',
            nameInput: 'birth',
            labelText: 'Fecha de nacimiento',
            helperTextId: 'helper-nombreCorto',
            required: true,
            type: 'text',
            helperText: staticLabels && staticLabels["pwa.registerPage.dateRequired.errorMsg"]
        }
        let repassword = {
            inputId: 'repassword',
            nameInput: 'repassword',
            labelText: 'Repetir Contraseña',
            helperTextId: 'helper-nombreCorto',
            required: true,
            type: 'password',
            minLength: "8",
            helperText: this.state.repassword ? "Las contraseñas no coinciden" : staticLabels && staticLabels["pwa.registerPage.passwordRequired.errorMsg"]
        }

        const datailsStyle = {
            position: 'absolute',
            transform: this.props.login ? 'translate3d(114px, 341px, 0px)' : 'translate3d(224px, 524px, 0px)',
            top: '-620px',
            left: '0px',
        }
        const { isMobile } = this.state;
        return (
            <div className="m-box mb-4">
                <div className="col-12 text-center pb-3">
                    <H5 headLineClass="a-box__heading" headLineText="¡Compra más rápido, regístrate!" />
                </div>
                <div className="col-12 text-center pb-3">
                    <Paragraph className="a-box__cardNumber m-0">{staticLabels && staticLabels["pwa.orderConfirmationPage.thanksmsg2.text"]}</Paragraph>
                </div> 
                {!isMobile &&
                    <div className="row align-items-start justify-content-between">
                        <div className="col-lg-6 col-12">
                            <div className="">
                                <InputText ref={first => this.firstName = first} options={nombre} inputValue={this.state.firstName} handleChange={this.handleChange} />
                            </div>
                            <div className="mt-lg-4" style={{paddingTop:"10px"}}>
                                <InputText ref={email => this.email = email} options={email} dobOrder={true} inputValue={this.state.email} handleChange={this.handleChange} error={this.state.errorEmail} />
                            </div>
                            <div className=""  style={{paddingTop:"10px"}}>
                                <InputText ref={password => this.password = password} options={password} handleChange={this.handleChange} error={this.state.errorPassword} />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="">
                                <InputText ref={lastName => this.lastName = lastName} options={surName} inputValue={this.state.lastName} handleChange={this.handleChange} />
                            </div>
                            <div className="" style={{display:"flex", flexDirection:"column"}}>
                                <LiverpoolDatePicker passDate={this.changeDate} case={'confirmation'}/>
                                <div className="m-input-helper__text mdc-text-field-helper-line pb-1 pb-lg-3" style={{order:"1"}}> 
                                <p id={this.state.dateError && "updatePersonalDataBirthError"} className="text-left a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true"> {this.state.dateError && staticLabels ? staticLabels["pwa.registerPage.dateRequired.errorMsg"] : (staticLabels && staticLabels["pwa.orderConfirmationPage.birthDayField.label"]) } </p>
                               </div>
                            </div>
                            <div className="">
                                <InputText ref={repassowrd => this.repassword = repassowrd} options={repassword} handleChange={this.handleChange} error={this.state.errorPasswordConfirm} />
                            </div>
                        </div>
                    </div>
                }
                {isMobile &&
                    <div className="row align-items-start justify-content-between">
                        <div className="col-lg-6 col-12">
                            <div className="">
                                <InputText ref={first => this.firstName = first} options={nombre} inputValue={this.state.firstName} handleChange={this.handleChange} />
                            </div>
                            <div className="">
                                <InputText ref={lastName => this.lastName = lastName} options={surName} inputValue={this.state.lastName} handleChange={this.handleChange} />
                            </div>
                            <div className="">
                                <InputText ref={email => this.email = email} options={email} inputValue={this.state.email} handleChange={this.handleChange} error={this.state.errorEmail} />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div style={{display:"flex", flexDirection:"column"}}>
                                <LiverpoolDatePicker passDate={this.changeDate} case={'confirmation'}/>
                                <div className="m-input-helper__text mdc-text-field-helper-line pb-1 pb-lg-3"  style={{order:"1"}}>
                                <p id={this.state.dateError && "updatePersonalDataBirthError"} className="text-left a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true">{this.state.dateError ? staticLabels && staticLabels["pwa.registerPage.dateRequired.errorMsg"]: (staticLabels && staticLabels["pwa.orderConfirmationPage.birthDayField.label"])}</p>
                                </div>
                            </div>
                            <div className="">
                                <InputText ref={password => this.password = password} options={password} handleChange={this.handleChange} error={this.state.errorPassword} />
                            </div>
                            <div className="">
                                <InputText ref={repassowrd => this.repassword = repassowrd} options={repassword} handleChange={this.handleChange} error={this.state.errorPasswordConfirm} />
                            </div>
                        </div>
                    </div>
                }
                <div className="row align-items-start">
                    <div className="col-lg-6 col-12">
                        <div className="row align-items-center justify-content-center justify-content-lg-start">
                            <div className="col-auto col-lg-12 col-xl-auto">
                                <Paragraph className="a-checkout__headingTitle m-0">Sexo:
                            </Paragraph>
                            </div>
                            <div className="col-auto">
                                <MaterialInputRadio handleClick={this.setGender} options={female} />
                            </div>
                            <div className="col-auto">
                                <MaterialInputRadio handleClick={this.setGender} options={male} />
                            </div>
                        </div>
                        {this.state.genderError &&
                            <p id="updatePersonalDataBirthError" className="a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true">{staticLabels && staticLabels["pwa.registerPage.genderRequired.errorMsg"]}</p>
                        }
                    </div>
                    <div className="col-lg-6 col-12 text-lg-left text-xl-right">
                        <MaterialInputCheckBox onChange={this.setSessionActive} text="Mantener mi sesión activa" />
                        <Paragraph className="a-checkout__session">
                            {/*<Span className="-underline ml-2 mr-1" onClick={(e) => this.showPopover(e, 'show')}>Detalles</Span>
                            <Icons className="a-select__help icon-help" data-toggle="popover" title="" data-content="Prueba Texto" data-placement="top" data-trigger="focus" data-original-title="" />*/}
                            <Span className="-underline ml-2 mr-1">Detalles
                                <Icons data-tip data-for='Detalles' className="a-select__help icon-help" />
                            </Span>
                            <ReactTooltip id="Detalles" className="popover-body" type="light" effect="solid">
                                <span>{"Para mantener tu cuenta segura, usa esta opción sólo en tus dispositivos personales."}</span>
                            </ReactTooltip>
                        </Paragraph>
                        {/*<div className="popover fade bs-popover-top"
                            style={datailsStyle}
                            ref={this.show} >
                            <div className="arrow" style={{ left: this.props.login ? '135px' : '92px' }} />
                            <div className="popover-body" >
                                <i aria-hidden="true" className="closeIconRegister" onClick={(e) => this.showPopover(e, 'remove')}>×</i>
                                Para mantener tu cuenta segura, usa esta opción sólo en tus dispositivos personales.</div>
                        </div>*/}
                    </div>
                </div>
                <div className="row align-items-center justify-content-end">
                    <div className="col-lg-5 col-12 mt-3">
                        <Button handleClick={this.registerUser} className="a-btn a-btn--primary">Enviar</Button>
                    </div>
                </div>
            </div>
        )
    }
}
