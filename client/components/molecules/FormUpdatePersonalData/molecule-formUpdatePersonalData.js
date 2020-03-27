import { H1 } from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import InputText from '../../molecules/InputText/InputText';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import { FormButtons } from '../../molecules/MixinMolecules/MixinMolecules';
import './molecule-formUpdatePersonalData.styl';
import { Utility, logError ,logDebug} from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { HelperText } from '../../molecules/MaterialInputText/MaterialInputText';
import Router from 'next/router';
import { Validate } from '../../../helpers/utilities/Validate';
import LiverpoolDatePicker from '../../molecules/LiverpoolDatePicker/LiverpoolDatePicker';
import '../../molecules/Modals/datePickerStyle.styl'
import Alert from "../../molecules/Alert/Alert";

class formpdatePersonalData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            email: '',
            firstName: '',
            lastName: '',
            maternalName: '',
            dateOfBirth: '',
            gender: '',
            data: '',
            bdayDAY: '',
            bdayMONTH: '',
            bdayYEAR: '',
            user_email_valid: true,
            errorEmail: false,
            alert_status: '',
            alert_message: '',
            error: ''
        }
    }
    componentDidMount() {
        this.summary()
    }
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase()) ? 'true' : 'false';
    }

    handleChange = (e) => {
        e.persist();
        // this.setState({[e.target.name]:e.target.value})
        this.setState(function (prevState) {
            const pre_value = prevState[e.target.name];
            //    console.log(Validate.validation(e, pre_value))
            this.state[e.target.name] = Validate.validation(e, pre_value);
            return this.state;
        });
        if (e.target.name === "email") {
            const user_email_valid = this.validateEmail(e.target.value);
            this.setState({ user_email_valid: user_email_valid })
            if (user_email_valid === 'false' && e.target.value) {
                this.setState({ errorEmail: true })
            } else {
                this.setState({ errorEmail: false })
            }
        }

    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message) => {
        this.setState({ alert_status: true, alert_message });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }

    stateFunction = (e) => {
        const { dateOfBirth, email, firstName, lastName, maternalName, gender, bdayYEAR, bdayMONTH, bdayDAY,errorEmail } = this.state;
        e.preventDefault();
        this.email.validation();
        this.firstName.validation();
        this.lastName.validation();
        this.maternalName.validation();        
        //this.dateOfBirth.validation();
        const params = {
            "email": email,
            "firstName": firstName,
            "lastName": lastName,
            "maternalName": maternalName,
            "bdayDAY": bdayDAY && bdayDAY.toString(),
            "bdayMONTH": bdayMONTH && bdayMONTH.toString(),
            "bdayYEAR": bdayYEAR && bdayYEAR.toString(),
            "gender": gender
        }
        if (dateOfBirth && email && firstName && maternalName && gender && errorEmail === false) {
            if (!(gender && (gender ==='female' || gender ==='male'))){ //gender fix for old profiles
                window.scrollTo(0, 0);
                const genderErrorMsg = staticLabels && staticLabels["pwa.updateProfilePage.gendererror.label"] ||'Introduzca su sexo';
                this.show_alert(genderErrorMsg);
            }else{
                Utility(Path.updateUser, 'POST', params).then(response => {
                    if (response && response.data && response.data.errorCode === '1002') {
                        Router.push('/tienda/login')
                    } else if (response && response.data && response.data.s === '0') {
                        Router.push("/tienda/users/myAccount")
                    } else {
                        if (response.data && response.data.err) {
                            window.scrollTo(0, 0);
                            this.show_alert(response.data.err);
                        }
                    }
                }, (error) => {
                    logError("Error ==== :: ", error);
                });
          }
        }

    }

    summary = () => {
        const userHeaders = { 'request_from': 'updateProfile' }
        Utility(Path.summary, 'POST', {}, userHeaders).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                const profile = response && response.data && response.data.profile;
                this.setState({
                    email: profile && profile.email,
                    firstName: profile && profile.firstName,
                    lastName: profile && profile.lastName,
                    dateOfBirth: profile && profile.dateOfBirth && profile.dateOfBirth.time && new Date(profile && profile.dateOfBirth && profile.dateOfBirth.time),
                    gender: profile && profile.gender,
                    maternalName: profile && profile.maternalName
                })
                this.dateChange(this.state.dateOfBirth);
            }
        }, (error) => {
        });
    }

    setGender = (e) => {
        this.setState({ gender: e.target.value })

    }

    dateChange = date => {
        this.setState({ dateOfBirth: date });
        let dateValue = date && date.getDate()
        let month = date && date.getMonth()
        let year = date && date.getFullYear()
        this.setState({
            bdayYEAR: year,
            bdayMONTH: month + 1,
            bdayDAY: dateValue
        })
    }

    changeDate = date => {
        this.setState({ dateOfBirth: date });

        let dateValue = date && date.getDate();
        let month = date && date.getMonth();
        let year = date && date.getFullYear();

        if(date !== '') {
            month++;
        }

        this.setState({
            bdayYEAR: year,
            bdayMONTH: month,
            bdayDAY: dateValue
        });
    }

    render() {
        const staticLabels = this.props.staticLabels;

        const update__email = {
            type: "email",
            inputId: 'input-update_email', 
            nameInput: 'email', 
            labelText: staticLabels && staticLabels["pwa.updateProfilePage.email.label"],
            helperText: this.state.email ? 'Ingresa un correo electrónico válido' : staticLabels && staticLabels["pwa.updateProfilePage.correoerror.label"], 
            helperTextId: 'helper__updateEmail',
            required: true, 
            maxlength: '100'
        }
        const update__name = {
            type: "text",
            inputId: 'input-update__name', 
            nameInput: 'firstName',
            labelText: staticLabels && staticLabels["pwa.updateProfilePage.nombre.label"], 
            helperText: staticLabels && staticLabels["pwa.updateProfilePage.nombreerror.label"],
            helperTextId: 'helper__updateName',
            required: true, 
            maxlength: '100'
        }
        const update__apaterno = {
            type: "text",
            inputId: 'input-update__apaterno', 
            nameInput: 'lastName',
            labelText: staticLabels && staticLabels["pwa.updateProfilePage.fatherName.label"],
            helperText: staticLabels && staticLabels["pwa.updateProfilePage.apellidoerror.label"],
            helperTextId: 'helper__updateApaterno',
            required: true,
            maxlength: '100'
        }
        const update__amaterno = {
            type: "text",
            inputId: 'input-update__amaterno', 
            nameInput: 'maternalName', 
            labelText: staticLabels && staticLabels["pwa.updateProfilePage.maternalName.label"],
            helperText: staticLabels && staticLabels["pwa.updateProfilePage.meternoerror.label"],
            helperTextId: 'helper__updateAmaterno',
            required: true,
            maxlength: '100'
        }
        const update__radio1 = {
            inputId: 'female', 
            nameInput: 'gender', 
            labelText: staticLabels && staticLabels["pwa.updateProfilePage.female.label"],
            labelClass: 'm-pdp__productDigital',
            required: true, 
            checked: true,
            disabled: false,
            active: this.state.gender === 'female' ? true : false

        }
        const update__radio2 = {
            inputId: 'male', 
            nameInput: 'gender',
            labelText: staticLabels && staticLabels["pwa.updateProfilePage.male.label"],
            labelClass: '',
            required: true, 
            disabled: false,
            active: this.state.gender === 'male' ? true : false
        }

        const buttonsOptions = [{
            text: staticLabels && staticLabels["pwa.updateProfilePage.cancelButton.label"],
            btnClass: "a-btn a-btn--secondary my-2 my-lg-4",
            typeButton: "",
            Idform: "",
            handleClick: () => Router.push('/tienda/users/myAccount')

        },
        {
            text: staticLabels && staticLabels["pwa.updateProfilePage.Actualizar.label"],
            btnClass: "a-btn a-btn--primary test",
            typeButton: "",
            Idform: "",
            handleClick: this.stateFunction

        }];

        return (
            <div id="UpdateDataPersonal" method="POST">
                <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={this.state.alert_message} alert_status={this.state.alert_status} dismiss_alert={this.dismiss_alert} />
                <div className="m-box-title d-block d-lg-none">
                    <div className="d-flex justify-content-start align-items-center">
                        <h2 className="m-0 a-box-title--forms">{staticLabels && staticLabels["pwa.updateProfilePage.breadCrumbheading.text"]}</h2>
                    </div>
                </div>
                <div className="m-box-form__content--my__account col-12 col-lg-5 px-4 ml-lg-2 pb-lg-3">
                    <H1 className="a-myAccount-aside--title__formChangePassowrd" headLineText="Confirma tu información" />
                    <Label className="a-changePass-label--required">*{staticLabels && staticLabels["pwa.updateProfilePage.requiredFields.text"]} </Label>

                    <InputText options={update__email} handleChange={this.handleChange} inputValue={this.state.email} ref={cn => this.email = cn} error={this.state.errorEmail} />
                    <InputText options={update__name} handleChange={this.handleChange} inputValue={this.state.firstName} ref={cn => this.firstName = cn} validationtype={'textWithSpecialCharsNoQ'} />
                    <InputText options={update__apaterno} handleChange={this.handleChange} inputValue={this.state.lastName} ref={cn => this.lastName = cn} validationtype={'textWithSpecialCharsNoQ'} />
                    <InputText options={update__amaterno}  handleChange={this.handleChange} validationtype={'textWithSpecialCharsNoQ'} inputValue={this.state.maternalName} slow={true} ref={cn => this.maternalName = cn} />
                    <label for="dia" class="pb-2"><span class="a-updatePersonalData-label align-self-start">{staticLabels && staticLabels["pwa.updateProfilePage.dateOfBirth.label"]}</span></label>
                    {/* <DatePicker onChange={this.dateChange} value={this.state.dateOfBirth} name="date" error={this.state.error} maxDate={new Date()} ref={cn => this.datePicker = cn} minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 129))} /> */}
                    <LiverpoolDatePicker passDate={this.changeDate} case={'update'} predefinedDate={this.state.dateOfBirth} ref={cn => this.datePicker = cn}/>
                    {this.state.dateOfBirth === null ?
                        <p id="updatePersonalDataBirthError" className="a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true">{staticLabels && staticLabels["pwa.updateProfilePage.fechaerror.label"]}</p>
                        : ''}

                    {/*<InputText options={update__birthday} nameInput="DateOfBirth" handleChange={this.handleChangeDOB} inputValue={this.state.dateOfBirth} ref={cn => this.dateOfBirth = cn} />*/}
                    
                    {/* Changes for defects 22957, 23425, 23423 and 22974  START */}
                    {/* <HelperText /> */}
                    {/* Changes for defects 22957, 23425, 23423 and 22974  END */}
                    <div className="select-gender d-flex flex-column">
                        <Label className="a-updatePersonalData-label align-self-start">{staticLabels && staticLabels["pwa.updateProfilePage.gender.label"]}</Label>
                        <div className="row">
                            <div className="col-4 col-lg-3 p-1 text-left">
                                <MaterialInputRadio options={update__radio1} onSelectGiftItem={this.setGender} />
                            </div>
                            <div className="col-4 col-lg-3 p-1 text-left">
                                <MaterialInputRadio options={update__radio2} onSelectGiftItem={this.setGender} />
                            </div>
                        </div>
                    </div>
                    <FormButtons buttonsOptions={buttonsOptions} />
                </div>
            </div>
        );
    }
}

export default formpdatePersonalData

