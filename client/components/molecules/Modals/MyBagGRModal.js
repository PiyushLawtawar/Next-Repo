import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
//import MyBagModalHeader from './MyBagModalHeader';
import ModalHeader from '../Modals/ModalHeader';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailability from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailability';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';
import './datePickerStyle.styl'
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import LiverpoolDatePicker from '../../molecules/LiverpoolDatePicker/LiverpoolDatePicker';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Alert from '../../molecules/Alert/Alert';
import { AlertAction } from '../../molecules/MixinMolecules/MixinMolecules';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import { Validate } from '../../../helpers/utilities/Validate';
//import '../MyBag/datePicker.styl'



export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: '',
            firstNameOrNickName: '',
            lastNameOrPaternalName: '',
            motherName: '',
            motherName: '',
            channel: "ECOMM",
            eventType: "",
            eventId: '',
            eventTypeList: props.eventTypeList || [],
            eventTypeListValue: '',
            focused: {},
            errors: this.props.errors
        }
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.alert_message !== this.state.alert_message) {
            this.setState({ alert_message: nextProps.alert_message })
        }
        if (nextProps.eventTypeList !== this.state.eventTypeList) {
            this.setState({ eventTypeList: nextProps.eventTypeList })
        }
        if (Object.keys(nextProps.errors).length !== Object.keys(this.state.errors).length) {
            this.setState({ error_message: nextProps.errors })
        }
        if (Object.keys(nextProps.errors).length !== Object.keys(this.state.errors).length) {
            this.setState({ errors: nextProps.errors })
        }
    }

    resetAllState = () => {
        this.state = {
            date: '',
            firstNameOrNickName: '',
            lastNameOrPaternalName: '',
            motherName: '',
            motherName: '',
            channel: "ECOMM",
            eventType: "",
            eventId: '',
            eventTypeList: this.props.eventTypeList || [],
            eventTypeListValue: '',
            focused: {},
            errors: this.props.errors
        }

        this.setState(this.state)
    }
    validateForm = () => {
        return new Promise((resolve, reject) => {

            const { firstNameOrNickName, lastNameOrPaternalName, eventId } = this.state;
            var errors = {};

            if (!firstNameOrNickName) { errors.firstNameOrNickName = true; }
            if (!lastNameOrPaternalName) { errors.lastNameOrPaternalName = true; }
            if (!eventId) { errors.eventId = true; }

            if (Object.keys(errors).length === 0) {
                return resolve(firstNameOrNickName, lastNameOrPaternalName, eventId);
            } else {
                this.setState({ errors });
                return reject()
            }

        });
    }

    handleOnChange = (e) => {
        let { firstNameOrNickName, eventId, lastNameOrPaternalName,motherName } = this.state;
        e.persist();
        this.setState(function (prevState) {
            const pre_value_firs = prevState.firstNameOrNickName;
            const pre_value_last = prevState.lastNameOrPaternalName;
            const pre_value_eventId = prevState.eventId;
            const pre_value_motherName = prevState.motherName



            if (e.target.name == 'firstNameOrNickName') {
                firstNameOrNickName = Validate.validation(e, pre_value_firs);
                // this.setState({ firstNameOrNickName: e.target.value }, () => { })
            }
            if (e.target.name == 'lastNameOrPaternalName') {
                lastNameOrPaternalName = Validate.validation(e, pre_value_last);
                // this.setState({ lastNameOrPaternalName: e.target.value }, () => { })
            }
            // if (e.target.name == 'motherName') {
            //     this.setState({ motherName: e.target.value }, () => { })
            // }
            if (e.target.name == 'motherName') {
                motherName = Validate.validation(e, pre_value_motherName);
                //  this.setState({ eventId: e.target.value }, () => { })
            }
            if (e.target.name == 'eventId') {
                eventId = Validate.validation(e, pre_value_eventId);
                //  this.setState({ eventId: e.target.value }, () => { })
            }
            if (e.target.name == 'eventTypeList') {
                this.setState({ eventType: e.target.value=="false"?'':e.target.value })
            }

            return { firstNameOrNickName, lastNameOrPaternalName, motherName, eventId }
        })
    }

    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }

    handleBlur = (e) => {
        const { focused, firstNameOrNickName, lastNameOrPaternalName, errors } = this.state;
        focused[e.target.name] = false;
        if (!e.target.name && e.target.required) {
            errors[e.target.name] = true;
        } else {
            errors[e.target.name] = false;
        }
        this.setState({ focused, errors });
    }
    handleOnSelectChange = (value, e) => {
        this.handleOnChange(e);
    }
    //  handleOnChange = (e) => {
    //     this.setState({ eventType: e.target.value })
    //  }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert") => {
        this.setState({ alert_message, alert_status: true, alert_Type });
    }

    dateChange = date => this.setState({ date })

    changeDate = date => {
        this.setState({ date: date });
    }

    render() {
        // let value= this.state.allStores.filter( store =>store.available==='true')
        const modalHeader = {
            title: 'Comprar a mesa de regalos',
            titleType: 'h4',
            headlineAttributes: {
                "id": "availability-modal"
            },
            close: true,
            back: false,
            buttonClass: 'close',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            headerClass:'o-findGiftTable__head'
        };
       // let eventTypeListOptions = { labelText: 'Selecciona tipo de evento', labelId: 'validity', selected: false, optionList: this.state.eventTypeList || [], selectText: "Seleccionar" };
        let eventTypeListOptions = {  labelId: 'validity', selected: false, optionList: this.state.eventTypeList || [], selectText: "Selecciona tipo de evento" };

        const { errors, focused, firstNameOrNickName, lastNameOrPaternalName, motherName, eventType, eventId, alert_message, alert_status, alert_Type } = this.state;
        return (
            <React.Fragment>
                <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} gRModel={true}/>
                <div className="o-findGiftTable__body">
                    <div className={ (alert_status ? 'o-findGiftTable__items--errorAlert -alertErrorFindGiftTable' : 'o-findGiftTable__items--errorAlert -hidden')} >
                            { alert_status?
                                <React.Fragment>
                                    <p class="a-blockElement">{alert_message}</p>
                                    <i class="a-text icon-close a-closeAlertGiftModal" id="closeAlertFindGiftTable" onClick={this.dismiss_alert}></i>
                                 </React.Fragment>
                             :null
                            }
                    </div>
                    {/*<div className={'o-findGiftTable__items--errorAlert' + (alert_status ? ' -alertErrorFindGiftTable' : ' -toTop')} >
                        <p className="a-blockElement">
                                <div className="m-mdc__snackbarSurface mdc-snackbar__surface">
                                    <div className="m-mdc__snackbarLabel mdc-snackbar__label" role="status" aria-live="polite">{alert_message}</div>
                                    <div className="m-mdc__snackbarActions mdc-snackbar__actions">
                                    <AlertAction
                                        className={this.props.className}
                                        TypeclassName="icon-close mdc-snackbar__dismiss"
                                        onClick={this.dismiss_alert}
                                        title={this.props.title}
                                        iconType={this.props.iconType}
                                    />
                                    </div>
                                </div>
                            {/*<Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />*/}
                        {/*</p>
                    </div>*/}

                    <div className="o-findGiftTable__items">
                        <p className="a-blockElement a-blockElement--enphasis">Busca por el nombre de los festejados</p>
                    </div>
                    <div className="o-findGiftTable__items">
                        <p className="a-blockElement a-blockElement--enphasis -required">Campos obligatorios</p>
                    </div>
                    <div className="o-findGiftTable__items thirdParties " name="nameFindGiftTable">
                        <InputHelperAssistant
                            name="firstNameOrNickName"
                            value={firstNameOrNickName}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.firstNameOrNickName}
                            field_valid={errors.firstNameOrNickName}
                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                            inputId='Nombre'
                            nameInput='Nombre'
                            labelPosition='right'
                            type="text"
                            labelText="Nombre"
                            required
                        />
                        {errors.firstNameOrNickName &&
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    Nombre es necesario
                                </Paragraph>
                        </div>
                        }
                        {/*<div className="mdc-text-field mdc-text-field--outlined">
                            <input className="mdc-text-field__input" id="tf-outlined" type="text" required="" name="firstNameOrNickName" value={this.state.firstNameOrNickName} onChange={this.formUpdate} />
                            <div className="mdc-notched-outline mdc-notched-outline--upgraded">
                                <div className="mdc-notched-outline__leading"></div>
                                <div className="mdc-notched-outline__notch">
                                    <label className="mdc-floating-label" for="tf-outlined" >First name</label>
                                </div>
                                <div className="mdc-notched-outline__trailing"></div>
                            </div>
                        </div>*/}
                    </div>
                    <div className="o-findGiftTable__items thirdParties" name="firstLastNameFindGiftTable">
                        <InputHelperAssistant
                            name="lastNameOrPaternalName"
                            value={lastNameOrPaternalName}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.lastNameOrPaternalName}
                            field_valid={errors.lastNameOrPaternalName}
                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                            inputId='ApellidoPaterno'
                            nameInput='ApellidoPaterno'
                            labelPosition='right'
                            type="text"
                            labelText="Apellido Paterno"
                            required
                        />
                        {errors.lastNameOrPaternalName &&
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    ApellidoPaterno es necesario
                                </Paragraph>
                        </div>
                         }
                        {/*<div className="mdc-text-field mdc-text-field--outlined">
                            <input className="mdc-text-field__input" id="tf-outlined" type="text" required="" name="lastNameOrPaternalName" value={this.state.lastNameOrPaternalName} onChange={this.formUpdate} />
                            <div className="mdc-notched-outline mdc-notched-outline--upgraded">
                                <div className="mdc-notched-outline__leading"></div>
                                <div className="mdc-notched-outline__notch">
                                    <label className="mdc-floating-label" for="tf-outlined" >Last name</label>
                                </div>
                                <div className="mdc-notched-outline__trailing"></div>
                            </div>
                        </div>
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                { errors.lastNameOrPaternalName && "ERROR" }
                            </Paragraph>
                        </div>                        */}
                    </div>
                    <div id="secondLastNameFindGiftTable" className="o-findGiftTable__items thirdParties" name="secondLastNameFindGiftTable">
                        <InputHelperAssistant
                            name="motherName"
                            value={motherName}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.motherName}
                            field_valid={errors.motherName}
                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                            inputId='ApellidoMaterno'
                            nameInput='ApellidoMaterno'
                            labelPosition='right'
                            type="text"
                            labelText="Apellido Materno"

                        />
                        {/* <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id"> </Paragraph> */}
                        {/*<div className="mdc-text-field mdc-text-field--outlined">
                            <input className="mdc-text-field__input" id="tf-outlined" type="text" name="motherName" value={this.state.motherName} onChange={this.handleOnChange} />
                            <div className="mdc-notched-outline mdc-notched-outline--upgraded">
                                <div className="mdc-notched-outline__leading"></div>
                                <div className="mdc-notched-outline__notch">
                                    <label className="mdc-floating-label" for="tf-outlined" >Mother's last name</label>
                                </div>
                                <div className="mdc-notched-outline__trailing"></div>
                            </div>
                        </div>*/}
                    </div>
                    <div className = "o-findGiftTable_datePicker_wrapper o-findGiftTable__items thirdParties"
                    name = "dateEventFindGiftTable" >
                        <LiverpoolDatePicker passDate={this.changeDate} case={'bag'}/>
                    </div>
                    <div className="o-findGiftTable__items thirdParties" name="typeEventGiftTable">

                        <MaterialSelect
                            allowWhatEverLength={true}
                            options={eventTypeListOptions}
                            name="eventTypeList"
                            value={this.state.eventType}
                            handleChange={this.handleOnSelectChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.eventType}
                            field_valid={errors.eventType}
                            error_message="Error Estado"
                            giftWrap={true}
                        />
                    </div>
                    <div className="o-findGiftTable__items thirdParties" name="findGiftTableByName">
                        <parentContext.Consumer>
                            {({ OpenModal, closeModal }) => (
                                <Button className="a-btn a-btn--primary findGiftTable" id="findGiftTable" handleClick={() => { this.props.gREventsbysearch(this.state, false, OpenModal, closeModal), this.props.gRModalTwo(this.props.gROne) }}>Buscar mesa

                                    </Button>
                            )}
                        </parentContext.Consumer>
                    </div>
                    <div className="o-findGiftTable__items thirdParties wrapword" name="findByNumberEvent">
                        <p className="a-inlineElement a-inlineElement--enphasis">Encuentra la mesa de regalos por el número de evento</p>
                    </div>
                    <div className="o-findGiftTable__items thirdParties" name="eventCodeFindGiftTable">
                        <InputHelperAssistant
                            name="eventId"
                            value={eventId}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.eventId}
                            field_valid={errors.eventId}
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={10}
                            inputId='ApellidoMaterno'
                            nameInput='ApellidoMaterno'
                            labelPosition='right'
                            type="number"
                            labelText="Número de evento"
                            required

                        />
                      {/*  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id"></Paragraph>*/}
                        {/*<div className="mdc-text-field mdc-text-field--outlined">
                            <input className="mdc-text-field__input" id="tf-outlined" type="text" required="" name="eventId" value={this.state.eventId} onChange={this.handleOnChange} />
                            <div className="mdc-notched-outline mdc-notched-outline--upgraded">
                                <div className="mdc-notched-outline__leading"></div>
                                <div className="mdc-notched-outline__notch">
                                    <label className="mdc-floating-label" for="tf-outlined" >Event number</label>
                                </div>
                                <div className="mdc-notched-outline__trailing"></div>
                            </div>
                        </div>*/}
                    </div>
                    <div className="o-findGiftTable__items thirdParties" name="findGiftTableByCode">
                        <parentContext.Consumer>
                            {({ OpenModal, closeModal }) => (
                                <Button className="a-btn a-btn--primary findGiftTable" id="findGiftTable" handleClick={() => { this.props.gREventsbysearch(this.state, true, OpenModal, closeModal), this.props.gRModalTwo(this.props.gROne) }}>Buscar mesa

                                    </Button>
                            )}
                        </parentContext.Consumer>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
