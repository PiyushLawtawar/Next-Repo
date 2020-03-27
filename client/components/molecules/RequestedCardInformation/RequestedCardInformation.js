
import React from 'react';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import { Validate } from '../../../helpers/utilities/Validate';
//import './RequestedCardInformation.styl'
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import { H3 } from '../../atoms/HeadLines/Headlines';
import Image from '../../atoms/Tagimage/Image';
import { Utility, UserAgentDetails, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
// import ReactTooltip from 'react-tooltip';
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';
let validity = {
    labelText: "Country",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "Red",
            value: "Red"
        },
        {
            name: "BLUE",
            value: "BLUE"
        },
        {
            name: "ORange",
            value: "ORange"
        }
    ]
}

let estado = {
    labelText: "Estado",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "1",
            value: "1"
        },
        {
            name: "2",
            value: "2"
        },
        {
            name: "3",
            value: "3"
        }
    ]
}

let municipio = {
    labelText: "Municipio o Delegación",
    labelId: 'validity',
    selected: true,
    optionList: [
        {
            name: "",
            value: ""
        },
        {
            name: "Red",
            value: "Red"
        },
        {
            name: "BLUE",
            value: "BLUE"
        },
        {
            name: "ORange",
            value: "ORange"
        }
    ]
}
let yearsOptions = [
        {
            name: "2019",
            value: "2019"
        },
        {
            name: "2020",
            value: "2020"
        },
        {
            name: "2021",
            value: "2021"
        },
        {
            name: "2022",
            value: "2022"
        },
        {
            name: "2023",
            value: "2023"
        },
        {
            name: "2024",
            value: "2024"
        },
        {
            name: "2025",
            value: "2025"
        },
        {
            name: "2026",
            value: "2026"
        },
        {
            name: "2027",
            value: "2027"
        },
        {
            name: "2028",
            value: "2028"
        },
        {
            name: "2029",
            value: "2029"
        },
    ]

let cardTypesOptions = [

        {
            name: "Liverpool",
            value: "liverpool"
        },
        {
            name: "Premium Card",
            value: "LPC"
        },
        {
            name: "Fabricas de Francia",
            value: "fabricasDeFrancia"
        },
        {
            name: "American Express",
            value: "americanExpress"
        },
        {
            name: "Master Card - Carnet",
            value: "masterCard"
        },
        {
            name: "Visa",
            value: "visa"
        },

    ]
/* Start fix for 24005 */
let monthsOptions = [
        {
            name: "01",
            value: "01"
        },
        {
            name: "02",
            value: "02"
        },
        {
            name: "03",
            value: "03"
        },
        {
            name: "04",
            value: "04"
        }
        ,
        {
            name: "05",
            value: "05"
        },
        {
            name: "06",
            value: "06"
        },
        {
            name: "07",
            value: "07"
        },
        {
            name: "08",
            value: "08"
        },
        {
            name: "09",
            value: "09"
        },
        {
            name: "10",
            value: "10"
        },
        {
            name: "11",
            value: "11"
        },
        {
            name: "12",
            value: "12"
        }
    ]

let monthsInSpanishOptions = [
        {
            name: "Ene",
            value: "01"
        },
        {
            name: "Feb",
            value: "02"
        },
        {
            name: "Mar",
            value: "03"
        },
        {
            name: "Abr",
            value: "04"
        }
        ,
        {
            name: "May",
            value: "05"
        },
        {
            name: "Jun",
            value: "06"
        },
        {
            name: "Jul",
            value: "07"
        },
        {
            name: "Ago",
            value: "08"
        },
        {
            name: "Sep",
            value: "09"
        },
        {
            name: "Oct",
            value: "10"
        },
        {
            name: "Nov",
            value: "11"
        },
        {
            name: "Dic",
            value: "12"
        }
    ]
/* End fix for 24005 */



export default class CardInformationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: {
                cvv: '',
                Year: '',
                Month: '',
                Typeofcard: false,
                cardNumber: ''

            },
            focused: {

            },
            errors: {

            },
            americanExpressCvv: props.americanExpressCvv,
            americanExpCvv: props.americanExpCvv,
            cardlengthsmap: [],
            liverpool: [],
            americanExpress: 0,
            visa: [],
            fabricasDeFrancia: [],
            LPC: 0,
            masterCard: 0,
            isMobile: false,
            isDesktop: true,
            monthsList: [],
            yearsList: [],
            cardTypesList: []
        }
        this.show1 = React.createRef();
        this.show2 = React.createRef();
        this.show3 = React.createRef();
    }

    componentDidMount() {
        let { configurationData } = this.props; // changes for 22849
        const { isDesktop, isMobile } = UserAgentDetails(window);
        this.setState({ isMobile, isDesktop });
        // start changes for 22849
        if(configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration &&
            typeof configurationData.configuration.liverpoolconfiguration.expirationyear !== 'undefined' &&
            configurationData.configuration.liverpoolconfiguration.expirationyear && configurationData.configuration.liverpoolconfiguration.expirationyear.length>0 &&
            typeof configurationData.configuration.liverpoolconfiguration.expirationMonth !== 'undefined' &&
            configurationData.configuration.liverpoolconfiguration.expirationMonth && configurationData.configuration.liverpoolconfiguration.expirationMonth.length>0){
           this.getConfiguration(configurationData)
        }else{
            Utility(Path.fetchConfiguration, 'GET').then(response => {
                if (response && response.data) {
                    this.getConfiguration(response.data)
                }
            })
        }// end changes for 22849
    }

    getConfiguration = (configurationData) => {//  changes for 22849
        let { cardlengthsmap, liverpool, americanExpress, visa, fabricasDeFrancia, LPC, masterCard, monthsList, yearsList, cardTypesList } = this.state;
        // Utility(Path.fetchConfiguration, 'GET').then(response => {
        //     if (response && response.data) {
                let globalConfigData = configurationData;
                cardlengthsmap = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.cardlengthsmap;
                /* Start fix for 24005 */
                let expirationMonthData = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.expirationMonth;
                let expirationmonth = typeof expirationMonthData !== 'undefined' && expirationMonthData && expirationMonthData.length>0 ? expirationMonthData : {};
                let expirationyearData = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.expirationyear;
                let expirationyear = typeof expirationyearData !== 'undefined' && expirationyearData && expirationyearData.length>0 ? expirationyearData : yearsOptions;
                /* End fix for 24005 */
                let orderedcardtypesmap = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.orderedcardtypesmap || {};
                for (var i in cardlengthsmap) {

                    if (cardlengthsmap[i]['americanExpress']) {
                        americanExpress = cardlengthsmap[i]['americanExpress'];
                    } else if (cardlengthsmap[i]['visa']) {
                        visa = cardlengthsmap[i]['visa'].split('/');
                    } else if (cardlengthsmap[i]['liverpool']) {
                        liverpool = cardlengthsmap[i]['liverpool'].split('/');
                    } else if (cardlengthsmap[i]['fabricasDeFrancia']) {
                        fabricasDeFrancia = cardlengthsmap[i]['fabricasDeFrancia'].split('/');
                    } else if (cardlengthsmap[i]['LPC']) {
                        LPC = cardlengthsmap[i]['LPC'];
                    } else if (cardlengthsmap[i]['masterCard']) {
                        masterCard = cardlengthsmap[i]['masterCard'];
                    }

                }
                monthsList = Object.keys(expirationmonth).map(key => {
                    const obj = expirationmonth[key];
                    const value = Object.keys(obj)[0];
                    const name = obj[value];
                    return { name, value }
                })
                if(monthsList.length===0){
                    monthsList = monthsOptions;
                }
                yearsList = Object.keys(expirationyear).map(key => {
                    const obj = expirationyear[key];
                    const value = Object.keys(obj)[0];
                    const name = obj[value];
                    return { name, value }
                })
                cardTypesList = Object.keys(orderedcardtypesmap).map(key => {
                    const obj = orderedcardtypesmap[key];
                    const value = Object.keys(obj)[0];
                    const name = obj[value];
                    return { name, value }
                })
                this.setState({
                    americanExpress,
                    visa,
                    liverpool,
                    fabricasDeFrancia,
                    LPC,
                    masterCard,
                    cardTypesList,
                    yearsList,
                    monthsList
                });
        //     }


        // });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.americanExpressCvv !== this.state.americanExpressCvv) {
            this.setState({ americanExpressCvv: nextProps.americanExpressCvv })
        }
    }

    validateForm = () => {
        return new Promise((resolve, reject) => {
            const { show_alert_message } = this.props;
            const { address } = this.state;
            var errors = {};
            if (this.props.isFull || this.props.isCvv) {
                if (!address.cvv) { errors.cvv = true; }
            }
            if (this.props.isGuest) {
                if (!address.Typeofcard || address.Typeofcard === 'false') { errors.Typeofcard = true; }
                if (!address.cardNumber) { errors.cardNumber = true; }
                if (address.cardNumber) {
                    const cardnumber = address.cardNumber;
                    let lengthList = this.state[address.Typeofcard];
                    lengthList = typeof lengthList === 'string' ? [lengthList] : lengthList;
                    const length = cardnumber.length;
                    if (lengthList && lengthList.indexOf(length.toString()) === -1) {
                        errors.inValidCardNumber = true;
                    }
                }
            }
            if (!this.props.isCvv && this.props.isFull) {
                if (this.props.monthYearShowOrHide) {
                    if (!address.Year) { errors.Year = true; }
                    if (!address.Month) { errors.Month = true; }
                }
            }

            if (Object.keys(errors).length === 0) {
                return resolve(address);
            } else {
                if(this.props.isFull && errors.Month || errors.Year){
                    const message =  this.props.staticLabelValues['pwa.checkoutBillingPage.invalidMonthYear.errorMessage'] || 'pwa.checkoutBillingPage.invalidMonthYear.errorMessage';
                    show_alert_message(message, 'alert')
                }else if(errors.cvv){
                   const message =  this.props.staticLabelValues['pwa.checkoutBillingPage.invalidCvv.errorMessage'] || 'pwa.checkoutBillingPage.invalidCvv.errorMessage';
                   show_alert_message(message, 'alert')
                }
                // console.log("errors ========================= :: ", errors);
                this.setState({ errors });
                return reject()
            }

        });
    }

    handleOnSelectChange = (value, e) => {
        const { cvvMaxLengthHandleByCardType } = this.props;
        if (e.target.value === 'americanExpress') {
            cvvMaxLengthHandleByCardType(true, e);
        } else {
            cvvMaxLengthHandleByCardType(false, e);
        }
        this.handleOnChange(e);
    }

    validateCardNumberLength = (e) => {
        const { address, errors } = this.state;
        const cardnumber = address.cardNumber;
        let lengthList = this.state[address.Typeofcard];
        lengthList = typeof lengthList === 'string' ? [lengthList] : lengthList;
        const length = cardnumber.length;
        if (lengthList && lengthList.indexOf(length.toString()) === -1) {
            if (length) {
                errors.inValidCardNumber = true;
                errors.cardNumber = false;
            } else {
                errors.cardNumber = true;
                errors.inValidCardNumber = false;
            }
        } else {
            errors.cardNumber = false;
            errors.inValidCardNumber = false;
        }
        this.setState({ errors });
    }

    handleOnChange = (e) => {
        const { address, errors } = this.state;
        e.persist();
        this.setState(function (prevState) {
            const pre_value = prevState.address[e.target.name];
            address[e.target.name] = Validate.validation(e, pre_value);
            if(address[e.target.name] === 'false'){
                address[e.target.name] = "";
            }
            if (e.target.required && (address[e.target.name] === 'false' || !address[e.target.name])) {
                errors[e.target.name] = true;
            }else{
                errors[e.target.name] = false;
            }
            return { address, errors }
        })
    }

    // handleOnChange = (e) => {
    //     const { address } = this.state;
    //     address[e.target.name] = e.target.value;
    //     this.setState({address});
    // }

    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }

    handleBlur = (e) => {
        const { focused, address, errors } = this.state;
        focused[e.target.name] = false;
        if (e.target.required && (address[e.target.name] === 'false' || !address[e.target.name])) {
            errors[e.target.name] = true;
        } else {
            errors[e.target.name] = false;
        }
        this.setState({ focused, errors });
    }

    render() {
        let { address, errors, focused, americanExpressCvv, americanExpCvv, isDesktop, monthsList, yearsList, cardTypesList } = this.state;
        const { staticLabelValues } = this.props;
        yearsList = yearsList.length === 0 ? [{}] : yearsList;
        monthsList = monthsList.length === 0 ? [{}] : monthsList;
        cardTypesList = cardTypesList.length === 0 ? [{}] : cardTypesList;
        let Months = { labelText: staticLabelValues['pwa.checkoutBillingPage.month.text'], labelId: 'validity', selected: true, selectText: "Mes", optionList:  monthsList};
        let cardTypes = { labelText: staticLabelValues['pwa.checkoutBillingPage.cardType.label'], labelId: 'label-cardType', selected: 'selectCardType', optionList: cardTypesList, selectText: staticLabelValues['pwa.checkoutBillingPage.select.text']};
        let Years = { labelText: staticLabelValues['pwa.checkoutBillingPage.year.label'], labelId: 'validity', selected: true, selectText: "Año", optionList: yearsList}
        let  AssetsPath = '../../../';
        if (typeof window !== 'undefined') {
            const path = getAssetsPath(window,undefined); 
            AssetsPath = (path && path !='' && path.length > 9)?path:'../../../';   
        }else{
            const path = getAssetsPath(undefined,this.props.hostname,process);
            AssetsPath = (path && path !='' && path.length > 9)?path:'../../../';    
        }
        //console.log("validity ========= :: ", validity);
        return (
            <React.Fragment>

                {
                    (this.props.isCvv) ?
                        <div className={isDesktop ? "d flex align-items-baseline justify-content-start" : "m-fullInfoContainer align-items-baseline justify-content-start col-11 pl-1 pr-0 d-lg-none"}>
                            {isDesktop &&
                                <div className="d-flex flex-row align-items-start justify-content-between col-12 p-0 mb-3 mt-4">
                                    <Paragraph className="a-text-endingDate">{staticLabelValues["pwa.checkoutPageBilling.expirationDate.cvv.text"]}</Paragraph>
                                    <Paragraph className="a-box__requiredMessage">{staticLabelValues["pwa.checkoutPageBilling.RequiredFields.text"]} </Paragraph>
                                </div>
                            }
                            {!isDesktop &&
                                <Paragraph className="a-box__requiredMessage mt-3 mb-2">{staticLabelValues["pwa.checkoutPageBilling.RequiredFields.text"]} </Paragraph>
                            }
                            <div className={"d-flex justify-content-start col-12 p-0 "+(isDesktop ? "align-items-start" : "align-items-baseline")} id={isDesktop ? "loginDetails4" : "loginDetails3"}>
                                <div className={isDesktop ? "col-lg-3 pl-0 col-xl-2" : "col-xl-4 col-5 pl-0"}>
                                    <InputHelperAssistant
                                        name="cvv"
                                        noRef={true}
                                        value={address.cvv}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.cvv}
                                        field_valid={errors.cvv || (address.cvv && address.cvv.length < 3) || ((americanExpressCvv || americanExpCvv) && address.cvv.length < 4)}
                                        validationtype={"onlyNumbersWithMaxLength"}
                                        maxLength={(americanExpressCvv || americanExpCvv) ? 4 : 3}
                                        inputId='cvv'
                                        id="cvv"
                                        nameInput='Código de seguridad'
                                        labelText={staticLabelValues['pwa.checkoutPageBilling.cvv.label.text']}
                                        labelPosition='right'
                                        text='Código de seguridad'
                                        helperTextId='helper-nombreCorto'
                                        type="password"
                                        pattern="[0-9]*"
                                        inputmode="numeric"
                                        required

                                    />
                                    <div className={"m-textField__helperText mdc-text-field-helper-line p-0"} id={!isDesktop && "helper-text-containerMobile3"} style={ errors.cvv ? { display:'block'} : {display : ''}}>
                                        {
                                            (!errors.cvv && address.cvv && address.cvv.length < 3 && !americanExpCvv && !americanExpressCvv) ?
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                    {staticLabelValues['pwa.checkout.credit_card_security_code_length.error.message']}
                                                </Paragraph>
                                                :
                                                (!errors.cvv && (americanExpressCvv || americanExpCvv) && address.cvv && address.cvv.length < 4) ?
                                                 <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                   {staticLabelValues['pwa.checkout.credit_card_security_code_length.four.error.message']}
                                                </Paragraph>
                                                :
                                                (errors.cvv)?
                                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id" style={{ "width": "195%", textAlign: "left" }}>
                                                        {staticLabelValues['pwa.checkoutBillingPage.emptyMunDescription.errorMsg']}
                                                    </Paragraph>
                                                :
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id" style={{ "width": "195%", textAlign: "left"  }}>
                                                    {staticLabelValues['pwa.checkoutPageBilling.codigo.de.seguridad.label']}
                                                </Paragraph>
                                        }
                                    </div>
                                </div>
                                <div className={isDesktop ? "col-lg-3 col-6 p-0 m-login-details d-flex justify-content-start" : "d-flex col-xl-4 col-7 p-0 m-login-details"}>
                                    {/* <Span className="a-cvv-anchor--helperText d-flex justify-content-end">
                                        {staticLabelValues['pwa.checkoutBillingPage.whatIsThis.text']}
                                        <Icons data-tip data-for='whatIsThis1' className="icon-help a-select__help" />
                                    </Span>*/}
                                    <Span className="a-cvv-anchor--helperText d-flex justify-content-end">
                                        {staticLabelValues['pwa.checkoutBillingPage.whatIsThis.text']}
                                        <Icons id='whatIsThis1' className="icon-help a-select__help" />
                                    </Span>
                                    {/* <ReactTooltip id="whatIsThis1" className="popover-body" type="light" effect="solid">
                                        <span>{staticLabelValues['pwa.checkoutPageBilling.card.numbers.text']}</span>
                                    </ReactTooltip>*/}
                                    <CustomTooltip
                                        tooltipFor="whatIsThis1"
                                        trigger="click"
                                        content={staticLabelValues["pwa.checkoutPageBilling.card.numbers.text"]}
                                        position="top"
                                        arrowSize="8px"
                                        borderSize="1px"
                                        contentPadding="10px 22px 10px 10px"
                                        boxClass="customBoxSizing">
                                    </CustomTooltip>
                                </div>
                            </div>
                        </div> : null
                }

                {/*<div className="d-xl-flex d-none flex-row align-items-start justify-content-between col-12 p-0">
                    <Paragraph className="a-text-endingDate--alter">Fecha de vencimiento </Paragraph>
                </div>*/}
                {
                    (this.props.isGuest) ?
                        <React.Fragment>
                            <div className="m-typeCardContainer col-12 no-gutters d-flex justify-content-start p-0">
                                <div className="col-lg-6">
                                    <MaterialSelect options={cardTypes}
                                        name="Typeofcard"
                                        value={address.Typeofcard}
                                        handleChange={this.handleOnSelectChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.Typeofcard}
                                        field_valid={errors.Typeofcard}
                                        required />
                                    <div className="mdc-select-helper-line">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true">
                                            { errors.Typeofcard && staticLabelValues['pwa.checkoutBillingPage.emptyCardType.errorMsg'] }
                                        </Paragraph>
                                    </div>
                                </div>
                                <div className="col-lg-6 d-none d-lg-block">
                                    <div className="m-cardsThumbnails"><Image className="a-cardsThumbnails__rectangleCard" src={AssetsPath + "/static/images/atomo-icono-dilisa-card.png"} alt="Tarjeta Dilisa Liverpool" />
                                        <Image className="a-cardsThumbnails__rectangleCard" src={AssetsPath + "/static/images/atomo-icono-visa-liver.png"} alt="Tarjeta Visa Liverpool" />
                                        <Image className="a-cardsThumbnails__squareCard" src={AssetsPath + "/static/images/atomo-icono-amex.png"} alt="Tarjeta Amex" />
                                        <Image className="a-cardsThumbnails__squareCard--visa" src={AssetsPath + "/static/images/atomo-icono-visa.png"} alt="Tarjeta Visa" />
                                        <Image className="a-cardsThumbnails__squareCard--master" src={AssetsPath + "/static/images/atomo-icono-mastercard.png"} alt="Tarjeta Mastercard" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 no-gutters d-flex justify-content-start p-0 flex-column">
                                <InputHelperAssistant
                                    name="cardNumber"
                                    noRef={true}
                                    value={address.cardNumber}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={(e) => {
                                        this.handleBlur(e);
                                        this.validateCardNumberLength(e)
                                    }}
                                    field_focus={focused.cardNumber}
                                    field_valid={errors.cardNumber || errors.inValidCardNumber}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={(americanExpressCvv) ? 15 : 16}
                                    inputId='cardNumber'
                                    nameInput='numeroTarjeta'
                                    labelPosition='right'


                                    type="number"
                                    labelText={staticLabelValues['pwa.checkoutBillingPage.cardNumber.label']}
                                    required
                                />
                               
                                    {
                                        (errors.cardNumber) ?
                                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues['pwa.checkoutPageBilling.card.required.text']}
                                                </Paragraph>
                                            </div>
                                            :
                                            (errors.inValidCardNumber) ?
                                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues['pwa.checkoutPageBilling.card.length.text']}
                                                    </Paragraph>
                                                </div>
                                                : null
                                    }
                                
                            </div>




                        </React.Fragment> : null
                }
                {
                    (this.props.isFull) ?
                        // web start
                        <div className="m-fullInfoContainer--medium align-items-center justify-content-start col-12 d-none d-lg-block" id="case1">
                            <div className="d-flex flex-row align-items-start justify-content-between col-12 p-0 mt-4">
                                {
                                    (this.props.monthYearShowOrHide) ? 
                                      <Paragraph className="a-text-endingDate">{staticLabelValues["pwa.checkoutPageBilling.expirationDate.text"]}</Paragraph>
                                    :
                                      <Paragraph className="a-text-endingDate">{staticLabelValues["pwa.checkoutPageBilling.expirationDate.cvv.text"]}</Paragraph>
                                }
                                
                                <Paragraph className="a-box__requiredMessage">{staticLabelValues["pwa.checkoutPageBilling.RequiredFields.text"]} </Paragraph>
                            </div>
                            <div className="d-flex align-items-start justify-content-start col-12 p-0 mt-3">
                                {
                                    (this.props.monthYearShowOrHide) ?
                                        <React.Fragment>
                                            <div className="col-lg-3 col-6 pl-0 col-xl-2">
                                                <MaterialSelect options={Months}
                                                    name="Month"
                                                    value={address.Month}
                                                    handleChange={this.handleOnSelectChange}
                                                    onFocus={this.handleOnFocus}
                                                    onBlur={this.handleBlur}
                                                    field_focus={focused.Month}
                                                    field_valid={errors.Month}
                                                    inputId='Month'
                                                    labelText={staticLabelValues['pwa.checkoutBillingPage.month.text']}
                                                    required
                                                    />
                                                    { errors.Month && 
                                                        <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                                                {staticLabelValues['pwa.checkoutBillingPage.emptyMonth.errorMsg']} 
                                                            </Paragraph>
                                                        </div>
                                                    }
                                            </div>
                                            <div className="col-lg-3 col-6 pl-0 col-xl-2">
                                                <MaterialSelect options={Years}
                                                    name="Year"
                                                    value={address.Year}
                                                    handleChange={this.handleOnSelectChange}
                                                    onFocus={this.handleOnFocus}
                                                    onBlur={this.handleBlur}
                                                    field_focus={focused.Year}
                                                    field_valid={errors.Year}
                                                    inputId='Year'
                                                    labelText={staticLabelValues['pwa.checkoutBillingPage.year.label']}
                                                    required
                                                />
                                                { errors.Year && 
                                                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                                            {staticLabelValues['pwa.checkoutBillingPage.emptyYear.errorMsg']}
                                                        </Paragraph>
                                                    </div>
                                                }
                                            </div>
                                        </React.Fragment>
                                        : null
                                }
                                <div className="col-lg-3 pl-0 col-xl-2">
                                    <InputHelperAssistant
                                        name="cvv"
                                        noRef={true}
                                        value={address.cvv}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.cvv}
                                        field_valid={errors.cvv || (address.cvv && address.cvv.length < 3) || (address.cvv && ((americanExpressCvv || americanExpCvv) && address.cvv.length < 4))}
                                        validationtype={"onlyNumbersWithMaxLength"}
                                        maxLength={(americanExpressCvv || americanExpCvv) ? 4 : 3}
                                        inputId='cvv'
                                        id="cvv"
                                        nameInput='Código de seguridad'
                                        labelText={staticLabelValues['pwa.checkoutPageBilling.cvv.label.text']}
                                        labelPosition='right'
                                        text='Código de seguridad'
                                        helperTextId='helper-nombreCorto'
                                        type="password"
                                        pattern="[0-9]*"
                                        inputmode="numeric"
                                        required
                                    />
                                    <div className="m-textField__helperText mdc-text-field-helper-line p-0" style={ errors.cvv ? { display:'block'} : {display : ''}}>
                                        {
                                            (!errors.cvv && address.cvv && address.cvv.length < 3 && !americanExpressCvv && !americanExpCvv) ?
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                    {staticLabelValues['pwa.checkout.credit_card_security_code_length.error.message']}
                                                </Paragraph>
                                                :
                                                (!errors.cvv && (americanExpressCvv || americanExpCvv) && address.cvv && address.cvv.length < 4) ?
                                                 <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                   {staticLabelValues['pwa.checkout.credit_card_security_code_length.four.error.message']}
                                                </Paragraph>
                                                :
                                                 (errors.cvv)?
                                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id" style={{ "width": "195%", textAlign: "left"  }}>
                                                        {staticLabelValues['pwa.checkoutBillingPage.emptyMunDescription.errorMsg']}
                                                    </Paragraph>
                                                :
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id" style={{ "width": "195%", textAlign: "left"  }}>
                                                    {staticLabelValues['pwa.checkoutPageBilling.codigo.de.seguridad.label']}
                                                </Paragraph>
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6 --pd-0 m-login-details d-flex justify-content-start">
                                    {/* <Span className="a-cvv-anchor--helperText d-flex justify-content-end">
                                        {staticLabelValues['pwa.checkoutBillingPage.whatIsThis.text']}
                                        <Icons data-tip data-for='whatIsThis2' className="icon-help a-select__help" />
                                    </Span>*/}
                                    <Span className="a-cvv-anchor--helperText d-flex justify-content-end">
                                        {staticLabelValues['pwa.checkoutBillingPage.whatIsThis.text']}
                                        <Icons id='whatIsThis2' className="icon-help a-select__help" />
                                    </Span>
                                    {/* <ReactTooltip id="whatIsThis2" className="popover-body" type="light" effect="solid">
                                        <span>{staticLabelValues['pwa.checkoutPageBilling.card.numbers.text']}</span>
                                    </ReactTooltip>*/}
                                    <CustomTooltip
                                        tooltipFor="whatIsThis2"
                                        trigger="click"
                                        content={staticLabelValues["pwa.checkoutPageBilling.card.numbers.text"]}
                                        position="top"
                                        arrowSize="8px"
                                        borderSize="1px"
                                        contentPadding="10px 22px 10px 10px"
                                        boxClass="customBoxSizing">
                                    </CustomTooltip>
                                </div>

                            </div>
                        </div>
                        : null
                }
                {
                    (this.props.isFull) ?
                        // app start
                        <div className="m-fullInfoContainer align-items-baseline justify-content-start col-11 pl-1 pr-0 d-lg-none" id="case1">
                                {
                                    (this.props.monthYearShowOrHide) ? 
                                      <Paragraph className = "a-text-endingDate mt-4" > {staticLabelValues["pwa.checkoutPageBilling.expirationDate.text"]} </Paragraph>
                                    :
                                      <Paragraph className = "a-text-endingDate mt-4" > {staticLabelValues["pwa.checkoutPageBilling.expirationDate.cvv.text"]} </Paragraph>
                                }
                                <Paragraph className = "a-box__requiredMessage mb-4" > </Paragraph>
                                {
                                    (this.props.monthYearShowOrHide) ?
                                        <div className="d-flex align-items-start justify-content-start col-12 p-0 mb-3">
                                            <div className = "col-xl-4 col-5 pl-0" >
                                                <MaterialSelect
                                                    options={Months}
                                                    name="Month"
                                                    value={address.Month}
                                                    handleChange={this.handleOnSelectChange}
                                                    onFocus={this.handleOnFocus}
                                                    onBlur={this.handleBlur}
                                                    field_focus={focused.Month}
                                                    field_valid={errors.Month}
                                                    inputId='Month'
                                                    labelText={staticLabelValues['pwa.checkoutBillingPage.month.text']}
                                                    required />
                                                { errors.Month && 
                                                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                                            {staticLabelValues['pwa.checkoutBillingPage.emptyMonth.errorMsg']}
                                                        </Paragraph>
                                                    </div>
                                                }
                                            </div>
                                            <div className = "col-xl-4 col-5 pl-0" >
                                                <MaterialSelect
                                                    options={Years}
                                                    name="Year"
                                                    value={address.Year}
                                                    handleChange={this.handleOnSelectChange}
                                                    onFocus={this.handleOnFocus}
                                                    onBlur={this.handleBlur}
                                                    field_focus={focused.Year}
                                                    field_valid={errors.Year}
                                                    inputId='Year'
                                                    labelText={staticLabelValues['pwa.checkoutBillingPage.year.label']}
                                                    required />
                                                { errors.Year && 
                                                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                                            {staticLabelValues['pwa.checkoutBillingPage.emptyYear.errorMsg']}
                                                        </Paragraph>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        : null}
                                <div className="d-flex align-items-baseline justify-content-start col-12 p-0" id="loginDetails5">
                                    <div className="col-xl-4 col-5 --pdl-0 mb-3">
                                        <InputHelperAssistant
                                            name="cvv"
                                            noRef={true}
                                            value={address.cvv}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.cvv}
                                            field_valid={errors.cvv || (address.cvv && address.cvv.length < 3) || (address.cvv && (americanExpressCvv || americanExpCvv) && address.cvv.length < 4)}
                                            validationtype={"onlyNumbersWithMaxLength"}
                                            maxLength={(americanExpressCvv || americanExpCvv) ? 4 : 3}
                                            inputId='cvv'
                                            nameInput='Código de seguridad'
                                            labelText={staticLabelValues['pwa.checkoutPageBilling.cvv.label.text']}
                                            labelPosition='right'
                                            text='Código de seguridad'
                                            helperTextId='helper-nombreCorto'
                                            type="password"
                                            id="cvv"
                                            required
                                        />
                                        <div className="m-textField__helperText mdc-text-field-helper-line p-0" id="helper-text-containerMobile5" style={ errors.cvv ? { display:'block'} : {display : ''}}>
                                            {
                                            (!errors.cvv && address.cvv && address.cvv.length < 3 && !americanExpressCvv && !americanExpCvv) ?
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text  mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" id="helper-text-id">
                                                    {staticLabelValues['pwa.checkout.credit_card_security_code_length.error.message']}
                                                </Paragraph>
                                                :
                                                (!errors.cvv && (americanExpressCvv || americanExpCvv) && address.cvv && address.cvv.length < 4) ?
                                                 <Paragraph className="a-textField__helperText mdc-text-field-helper-text  mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" id="helper-text-id">
                                                   {staticLabelValues['pwa.checkout.credit_card_security_code_length.four.error.message']}
                                                </Paragraph>
                                                :
                                                 (errors.cvv)?
                                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id" style={{ "width": "195%", textAlign: "left" }}>
                                                        {staticLabelValues['pwa.checkoutBillingPage.emptyMunDescription.errorMsg']}
                                                    </Paragraph>
                                                :
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text  mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" id="helper-text-id" style={{ "width": "195%", textAlign: "left" }}>
                                                    {staticLabelValues['pwa.checkoutPageBilling.codigo.de.seguridad.label']}
                                                </Paragraph>
                                        }
                                        </div>
                                    </div>

                                    <div className="d-flex col-xl-4 col-7 p-0 m-login-details">
                                        {/* <Span className="a-cvv-anchor--helperText d-flex justify-content-start">
                                            {staticLabelValues['pwa.checkoutBillingPage.whatIsThis.text']}
                                            <Icons data-tip data-for='whatIsThis3' className="icon-help a-select__help" />
                                        </Span>  */}
                                        <Span className="a-cvv-anchor--helperText d-flex justify-content-start">
                                            {staticLabelValues['pwa.checkoutBillingPage.whatIsThis.text']}
                                            <Icons id='whatIsThis3' className="icon-help a-select__help" />
                                        </Span>
                                        {/* <ReactTooltip id="whatIsThis3" className="popover-body" type="light" effect="solid">
                                            <span>{staticLabelValues['pwa.checkoutPageBilling.card.numbers.text']}</span>
                                        </ReactTooltip> */}
                                        <CustomTooltip
                                            tooltipFor="whatIsThis3"
                                            trigger="click"
                                            content={staticLabelValues["pwa.checkoutPageBilling.card.numbers.text"]}
                                            position="top"
                                            arrowSize="8px"
                                            borderSize="1px"
                                            contentPadding="10px 22px 10px 10px"
                                            boxClass="customBoxSizing">
                                        </CustomTooltip>
                                    </div>
                                </div>
                        </div>
                        : null
                }

            </React.Fragment>
        )
    }
}
































/*import './RequestedCardInformation.styl'
import {InputText,InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import {H3} from '../../atoms/HeadLines/Headlines';


export default (props) => {
let containerClass= {
        labelText: "Mes",
        className:"m-typeCardContainer__input",
        labelId: 'label-selectMonth',
        selectId: 'selectMonth',
        selected: true,
        optionList:[
            {
                name:"",
                value:""
            },
            {
                name:"1",
                value:"1"
            },
             {
                name:"2",
                value:"2"
            },
             {
                name:"3",
                value:"3"
            }
        ]
}

 var options2 = {
                containerClass: 'mdc-select mdc-select--outlined',
                labelText: 'Año',
                labelId: 'label-selectYear',
                selectId: 'selectYear',
                optionList:[
            {
                name:"",
                value:""
            },
            {
                name:"1",
                value:"1"
            },
             {
                name:"2",
                value:"2"
            },
             {
                name:"3",
                value:"3"
            }
        ]
              }
return(
<React.Fragment>
<div className="d flex align-items-baseline justify-content-start d-lg-none">
                                        <Paragraph className="a-text-endingDate--alter">
                                            <font>Fecha de vencimiento</font>
                                        </Paragraph>
  <div className="d-flex align-items-start justify-content-start col-12 p-0 mb-3 pb-1">
            <div className="col-xl-4 col-5 --pdl-0">
                     <MaterialSelect options={containerClass} />
             </div>
            <div className="col-xl-4 col-5 --pdl-0">
                    <MaterialSelect options={options2} />
             </div>
    </div>
    <div className="d-flex align-items-baseline justify-content-start --mb-32" id="loginDetails5">
        <div className="col-xl-4 col-5 --pdl-0 mb-3">
                                    <InputHelperAssistant
                                             inputId= 'cvv'
                                             nameInput= 'Código de seguridad'
                                             labelText= 'CVV'
                                             labelPosition='right'
                                             text= 'Código de seguridad'
                                             helperTextId= 'helper-nombreCorto'
                                             disabled= 'false'
                                             checked= "false"
                                             type= "text"
                                             required
                                    />
                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">Código de seguridad
                        </Paragraph>
                </div>
        </div>
        <div className="col-xl-4 col-5 --pd-0">
                                  <Span className="a-cvv-anchor--helperText d-flex justify-content-start" id="helperTextPopover5" data-toggle="popover" data-trigger="click hover focus" data-placement="top" data-delay="150" data-content="Son los tres números detrás de tu tarjeta" data-container="#loginDetails5" title="" data-original-title=" ">
                                      <font>¿Qué es esto?</font>
                              <Icons className="a-cvv--iconHelper" /></Span>
        </div>
    </div>
</div>
<div className="d-xl-flex d-none flex-row align-items-start justify-content-between col-12 p-0">
            <Paragraph className="a-text-endingDate--alter">Fecha de vencimiento </Paragraph>
</div>

<div className="d-lg-flex d-none align-items-start justify-content-start col-12 p-0 mb-5" id="loginDetails6">
                            <div className="col-lg-3 col-6 col-xl-2 --pdl-0">
                                          <MaterialSelect options={containerClass} />
                            </div>
                            <div className="col-lg-3 col-6 col-xl-2 --pdl-0">
                                          <MaterialSelect options={options2} />
                            </div>
                            <div className="col-lg-3 col-xl-2 --pdl-0">
                                           <InputHelperAssistant
                                             inputId= 'cvv'
                                             nameInput= 'Código de seguridad'
                                             labelText= 'CVV'
                                             labelPosition='right'
                                             text= 'Código de seguridad'
                                             helperTextId= 'helper-nombreCorto'
                                             disabled= 'false'
                                             checked= "false"
                                             type= "text"
                                             required
                                    />
                             <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">Código de seguridad
                        </Paragraph>
                </div>
                            </div>
                            <div className="col-lg-3 col-6 --pd-0 m-login-details d-flex justify-content-start">
                                <Span className="a-cvv-anchor--helperText d-flex justify-content-end" id="helperTextPopover6" data-toggle="popover" data-trigger="click hover focus" data-placement="top" data-delay="150" data-content="Son los tres números detrás de tu tarjeta" data-container="#loginDetails6" title="" data-original-title=" ">¿Qué es esto?
                                    <Icons className="a-cvv--iconHelper" />
                               </Span>
                            </div>
                            <div className="popover fade bs-popover-top requestcard" role="tooltip" id="popover489775" x-placement="top">
                              <div className="arrow" style={{left: "119px"}}>
                               </div>
                               <H3 headLineClass="popover-header" />
                                  <div className="popover-body">Son los tres números detrás de tu tarjeta
                                </div>
                             </div>
                          </div>

</React.Fragment>
);
}*/
