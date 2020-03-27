import React from 'react';
import Router from 'next/router';
import Label from '../../atoms/Label/Label';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { HelperText } from '../../molecules/MaterialInputText/MaterialInputText';
import Modal from '../../molecules/Modals/molecule-benefits-modal';
import InputText from '../../molecules/InputText/InputText';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import Button from '../../atoms/Button/Button';
import Icons from '../../atoms/Icons/Icons';
import LoginDetails from '../LoginDetails/LoginDetails';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import LiverpoolDatePicker from '../../molecules/LiverpoolDatePicker/LiverpoolDatePicker';
import { Validate } from '../../../helpers/utilities/Validate';
import ReactTooltip from 'react-tooltip';
import '../../molecules/Modals/datePickerStyle.styl'
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';

import './molecule-formCreateAccount.styl';

class createAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      user_email: '',
      user_pass: '',
      user_firstName: '',
      user_lastName: '',
      user_bdayDAY: '',
      user_bdayMONTH: '',
      user_bdayYEAR: '',
      user_MotherName: '',
      user_gender: '',
      user_genderSelected: true,
      user_birthday: '',
      errorEmail: '',
      user_email_valid: true,
      user_pass_valid: true,
      errorPassword: '',
      user_dateSelected: true,
      show: false,
      minDate: '1930'
    }
    this.registerButton = React.createRef();
    this.checkedValue = '';
  }

  componentDidMount() {
    this.getConfiguration();
  }


  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) ? 'true' : 'false';
  }

  handleGenderChange = (e) => {
    this.setState({ user_gender: e });

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
    if (e.target.name === "user_pass") {
      const limitLength = e.target.minLength;

      if (e.target.value.length < limitLength) {
        this.setState({ errorPassword: true })
      } else {
        this.setState({ errorPassword: false })
      }
    }
  }

  handleChange = (e) => {
    // this.setState({ [e.target.name]: e.target.value }); // Applying input value to the state.
    e.persist();
    this.setState(function (prevState) {
      const pre_value = prevState[e.target.name];
      this.state[e.target.name] = Validate.validation(e, pre_value);
      return this.state;
    });



  }

  dateChange = date => {
    this.setState({ date });

    let dateValue = date && date.getDate();
    let month = date && date.getMonth();
    let year = date && date.getFullYear();

    if(date !== '') {
        month++;
    }

    this.setState({
      user_bdayYEAR: year,
        user_bdayMONTH: month,
        user_bdayDAY: dateValue
    });
  }

  changeDate = date => {
    this.setState({ date });
    let dateValue = date && date.getDate();
    let month = date && date.getMonth();
    let year = date && date.getFullYear();
    this.setState({
      user_bdayYEAR: year,
      user_bdayMONTH: month + 1,
      user_bdayDAY: dateValue
    });
  }

  visibiliyShow = () => {
    if (this.registerButton.current.style.visibility === 'hidden') {
      this.registerButton.current.style.visibility = 'visible';
    } else {
      this.registerButton.current.style.visibility = 'hidden';
    }
  }

  onHandleChecked = (checkedValue) => {
    this.checkedValue = checkedValue;
  }


  createAccount = () => {
    const { user_email, user_pass, user_firstName, user_lastName, user_MotherName, user_bdayYEAR, user_bdayMONTH, user_bdayDAY, user_gender, user_email_valid, date, user_dateSelected, errorPassword } = this.state;
    this.email.validation();
    this.password.validation();
    this.firstName.validation();
    this.lastName.validation();
    this.motherName.validation();
    //this.birthday.validation();

    if (user_gender) {
      this.setState({ user_genderSelected: true });
    } else {
      this.setState({ user_genderSelected: false });
    }
    if (date) {
      this.setState({ user_dateSelected: true });
    } else {
      this.setState({ user_dateSelected: false });
    }

    if (user_email && user_pass && user_firstName && user_lastName && user_MotherName && user_bdayYEAR && user_bdayMONTH && user_bdayDAY && user_gender && (user_email_valid === 'true') && !errorPassword) {
      const payload = {
        "email": user_email,
        "password": user_pass,
        "firstName": user_firstName,
        "lastName": user_lastName,
        "bdayDAY": user_bdayDAY,
        "bdayMONTH": user_bdayMONTH,
        "bdayYEAR": user_bdayYEAR,
        "gender": user_gender,
        "maternalName": user_MotherName
      }

      this.props.createAccount(payload);
      this.visibiliyShow();
    } else {
      dataLayer.push({
        event: 'evRegistration',  //variable estática
        bool: 'Error',  //variable estática
      });
      window.scrollTo(0, 0);
    }


  }

  showModal = (e) => {
    if (this.state.show === true) {
      this.setState({ show: false })
    } else {
      this.setState({ show: true })
    }
  }

  getConfiguration = () => {
    //  change for getConfigration service Calls : Start
    let { configurationData, setConfigurationData } = this.props;
    
    let minDate = configurationData &&  configurationData.configuration && configurationData.configuration.flagConfiguration && configurationData.configuration.flagConfiguration.dobStartYear || undefined;
    if (typeof minDate === 'undefined') {
      try {
        Utility(Path.fetchConfiguration, 'GET').then(response => {
          if (response && response.data) {
            minDate = response.data && response.data.configuration && response.data.configuration.flagConfiguration && response.data.configuration.flagConfiguration.dobStartYear;
            minDate && this.setState({ minDate: minDate })
          }
        });
      } catch (e) {
        console.error(e, "error");
      }
    }
    else {
      this.setState({ minDate: minDate })
    }
    //  change for getConfigration service Calls : End
  }

  render() {
    const staticLabels = this.props.staticLabels

    const { user_email, user_pass, user_firstName, user_lastName, user_MotherName, user_birthday, user_pass_valid, user_email_valid, errorEmail, errorPassword, user_genderSelected, user_dateSelected } = this.state;
    

    var user__pass = {
      type: "password",
      inputId: 'inputPass',
      nameInput: 'user_pass',
      labelText: staticLabels && staticLabels["pwa.registerPage.password.lebel"],
      helperText: user_pass ? staticLabels && staticLabels["pwa.registerPage.pwdLengthRequired.errorMsg"] : staticLabels && staticLabels["pwa.registerPage.passwordRequired.errorMsg"],
      helperTextId: 'helper__userPass',
      required: true,
      minLength: "8",
      field_valid: { user_pass_valid },
      helperTextForRequired: 'Mínimo 8 carácteres',
      showOptional: true,
      // showError: errorPassword && true,
      // errorText: errorPassword && staticLabels && staticLabels["pwa.registerPage.pwdLengthRequired.errorMsg"]
    }

    var user__email = {
      type: "email",
      inputId: 'input-user__email',
      nameInput: 'user_email',
      labelText: staticLabels && staticLabels["pwa.registerPage.email.lebel"],
      helperText: user_email ? staticLabels && staticLabels["pwa.registerPage.emailID.valid"] : staticLabels && staticLabels["pwa.registerPage.electronico.label"], //- text that appear when validation fails
      helperTextId: 'helper__updateEmail',
      required: true,
      field_valid: { user_email_valid },
      maxlength: '100'
    }

    var user__name = {
      type: "text",
      inputId: 'input-user__name', //- attribute id
      nameInput: 'user_firstName', //- name of the input
      labelText: staticLabels && staticLabels["pwa.registerPage.name.lebel"], //- text of the label
      helperText: staticLabels && staticLabels["pwa.registerPage.nombreerror.label"], //- text that appear when validation fails
      helperTextId: 'helper__updateName',//- attibute id for helper text
      required: true, //- if value of the input is required set true
      maxlength: '100'
    }

    var user__apaterno = {
      type: "text",
      inputId: 'input-user__apaterno', //- attribute id
      nameInput: 'user_lastName', //- name of the input
      labelText: staticLabels && staticLabels["pwa.registerPage.lastName.lebel"],//- text of the label
      helperText: staticLabels && staticLabels["pwa.registerPage.apellidoerror.label"],//- text that appear when validation fails
      helperTextId: 'helper__updateApaterno',//- attibute id for helper text
      required: true, //- if value of the input is required set true
      maxlength: '100'
    }

    var user__amaterno = {
      type: "text",
      inputId: 'input-user__amaterno', //- attribute id
      nameInput: 'user_MotherName', //- name of the input
      labelText: staticLabels && staticLabels["pwa.registerPage.maternalName.lebel"],//- text of the label
      helperText: staticLabels && staticLabels["pwa.registerPage.maternoerror.label"],//- text that appear when validation fails
      helperTextId: 'helper__updateAmaterno',
      required: true, //- if value of the input is required set true
      maxlength: '100'
    }
    var update__radio1 = {
      inputId: 'female', //- attribute id
      nameInput: 'gender', //- name of the input
      labelText: staticLabels && staticLabels["pwa.registerPage.female.lebel"],//- text of the label
      labelClass: 'm-pdp__productDigital',//- class of the label
      required: true, //- if value of the input is required set true
      disabled: false,//- if input is disabled set true
    }
    var update__radio2 = {
      inputId: 'male', //- attribute id
      nameInput: 'gender', //- name of the input
      labelText: staticLabels && staticLabels["pwa.registerPage.male.lebel"],//- text of the label
      labelClass: '',//- class of the label
      required: true, //- if value of the input is required set true
      disabled: false,//- if input is disabled set true

    }

    return (
      <div className="m-box-form__content--my__account m-formCreateAccout" id="formCreateAccount">
        <div className="m-formCreateAccount__header" >
          <Label className="a-changePass-label--required">{staticLabels && staticLabels["pwa.registerPage.obligatorios.label"]}</Label>
          <Link className="a-formCreateAccount__benefitsModal" href="#" onClick={() => this.showModal()} >{staticLabels && staticLabels["pwa.registerPage.heading.text"]}<i className="a-login--iconHelper" ></i></Link>
          <Modal show={this.state.show} staticLabels={staticLabels && staticLabels["pwa.registerPage.benifits.leftText"]} title={staticLabels && staticLabels["pwa.registerPage.heading.text"]} showModal={this.showModal} />
        </div>
        <InputText options={user__email} handleChange={this.handleChange} onBlur={this.onBlur} inputValue={user_email} error={errorEmail} ref={em => this.email = em} />

        <InputText options={user__pass} handleChange={this.handleChange} onBlur={this.onBlur} inputValue={user_pass} ref={ps => this.password = ps} error={errorPassword} />

        <InputText options={user__name} handleChange={this.handleChange} validationtype={"onlyNumbersWithCharactersWithSpaceWithSpecialChars"} inputValue={user_firstName} ref={fn => this.firstName = fn} />

        <InputText options={user__apaterno} handleChange={this.handleChange} inputValue={user_lastName} validationtype={"onlyNumbersWithCharactersWithSpaceWithSpecialChars"} ref={ln => this.lastName = ln} />

        <InputText options={user__amaterno} handleChange={this.handleChange} validationtype={"onlyNumbersWithCharactersWithSpaceWithSpecialChars"} inputValue={user_MotherName} ref={mn => this.motherName = mn} />

        <label for="dia"><span class="a-updatePersonalData-label align-self-start">Fecha de Nacimiento</span></label>
        {/* Changes for defects 22957, 23425, 23423 and 22974  START */}
        <LiverpoolDatePicker passDate={this.changeDate} case='create' />
        {/* Changes for defects 22957, 23425, 23423 and 22974  END */}
        {!user_dateSelected ?
          <div className="errormsg">
            <p>{staticLabels && staticLabels["pwa.registerPage.nacimientoerror.label"]}</p>
          </div> : ''
        }
        <div className="select-gender select-gender-createAccount d-flex flex-column">
          <Label className="a-updatePersonalData-label align-self-start">{staticLabels && staticLabels["pwa.registerPage.sexo.lebel"]}</Label>
          <div className="row">
            <div className="col-4 col-lg-3 p-1 text-left">
              <MaterialInputRadio options={update__radio1} handleClick={this.handleGenderChange} />
            </div>
            <div className="col-4 col-lg-3 p-1 text-left">
              <MaterialInputRadio options={update__radio2} handleClick={this.handleGenderChange} />
            </div>
          </div>
          {!user_genderSelected ?
            <div className="errormsg">
              <p>{staticLabels && staticLabels["pwa.registerPage.opcion.label"]}</p>
            </div> : ''
          }
        </div>
        <div className="d-flex justify-content-start align-items-center ml-n2 mt-3 m-login-details" id="loginDetails" >
          <MaterialInputCheckBox checked="checked" text={staticLabels && staticLabels["pwa.sessionActive.checkboxOnAutoLogin.text"]} />
          <Span className="a-login-anchor--helperText d-flex align-items-center justify-content-start">{staticLabels && staticLabels["pwa.registerPage.details.text"]}
            <Icons id="Detalles" className="a-login--iconHelper ml-1" />
          </Span>
          {/* <ReactTooltip id="Detalles" className="popover-body" type="light" effect="solid">
            <span>{"Para mantener tu cuenta segura, usa esta opción sólo en tus dispositivos personales."}</span>
          </ReactTooltip> */}
          <CustomTooltip
            tooltipFor="Detalles"
            trigger="click"
            content="Para mantener tu cuenta segura, usa esta opción sólo en tus dispositivos personales."
            position="top"
            arrowSize="8px"
            borderSize="1px"
            boxClass="customBoxSizing">
          </CustomTooltip>
        </div>
        {/* <LoginDetails staticLabels={staticLabels} onHandleChecked={this.onHandleChecked} /> */}
        <p className="m-termsConditions"  >
          <div dangerouslySetInnerHTML={{ __html: staticLabels && staticLabels["pwa.registerPage.click.text"] }} />
          <a href={staticLabels && staticLabels["pwa.registerPage.termCondition.text"]}>{staticLabels && staticLabels["pwa.registerPage.termandcondition.text"]}</a> {staticLabels && staticLabels["pwa.registerPage.termandcondition.text2"]}
        </p>
        <div ref={this.registerButton}>
          <Button handleClick={this.createAccount} className="a-btn a-btn--primary" >{staticLabels && staticLabels["pwa.registerPage.crearcuenta.label"]}</Button></div>
      </div>
    )
  }
}
export default createAccount;

