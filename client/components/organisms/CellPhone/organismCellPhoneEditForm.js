import { headLineText, H2 } from "../../atoms/HeadLines/Headlines";
import Label from '../../atoms/Label/Label';
import InputText from '../../molecules/InputText/InputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import { FormButtons } from '../../molecules/MixinMolecules/MixinMolecules';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import { HelperText } from '../../molecules/MaterialInputText/MaterialInputText';
import Router from 'next/router';
import { Validate } from '../../../helpers/utilities/Validate';

class OrganismCellPhoneEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            telefono: '',
            nombre: '',
            company: '',
            amount: '',
            phoneId: '',
            phoneServiceData: [],
            airtimeAmountSearchData: [],
            name: '',
            phoneData: {},
            error: false
        }
    }
    componentDidMount() {
        this.phoneServiceSearch();
        // RTC 23619 Start
        setTimeout(() => {
            document.querySelectorAll(".mdc-floating-label").forEach(i => {
                i.classList.add("mdc-floating-label--float-above");
            })
        }, 1000);
        // RTC 23619 End
    }

    saveData = () => {
        let phoneServiceDataArray = [];
        if (this.state.phoneServiceData && this.state.phoneServiceData.length) {
            this.state.phoneServiceData.map((item) => {
                const data = {};
                if (item.id && item.value) {
                    data.id = item.id;
                    data.value = item.value;
                    data.selected = false;
                    if (item.id === this.state.phoneData.service) {
                        data.selected = true;
                    }
                    phoneServiceDataArray.push(data);
                }
            })
            this.setState({ phoneServiceData: phoneServiceDataArray });
        }
        const payload = {
            "phoneService": this.state.phoneData.service
        }
        const airtimeAmountSearchData = [];
        this.airtimeAmountSearch(payload, this.state.phoneData.airTime);
        this.setState({
            telefono: this.state.phoneData.phoneNumber,
            nombre: this.state.phoneData.shortname,
            company: this.state.phoneData.service,
            amount: this.state.phoneData.airTime,
            phoneId: this.state.phoneData.repositoryId
        })

    }

    getPhoneNumber = (repositoryId) => {
        Utility(Path.getPhoneNumber, 'POST').then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                const phoneData = response && response.data && response.data.phones;
                phoneData.map((item) => {
                    if (item.repositoryId === repositoryId) {
                        this.setState({ phoneData: item })
                        if (this.state.phoneServiceData && this.state.phoneServiceData.length) {
                            this.saveData();
                        }
                    }
                })
            }
        }, (error) => {
        });

    }


    handleOnChange = (e) => {
        e.persist();
        this.setState(function (prevState) {
            const pre_value = prevState[e.target.name];
            this.state[e.target.name] = Validate.validation(e, pre_value);
            return this.state;
        });
        if (e.target.name === "telefono") {
            const limitLength = e.target.maxLength;
            if (e.target.value.length < limitLength) {
                this.setState({ error: true })
            } else if (e.target.value.length === limitLength) {
                this.setState({ error: false })
            }
        }
    }

    editPhoneNumber = () => {
        this.telephone.validation();
        this.firstName.validation();
        this.company.InputSelectionValidation();
        this.airtime.InputSelectionValidation();
        const { telefono, nombre, company, amount, phoneId } = this.state;
        const payload = {
            "registerPhoneNumber": telefono,
            "registeredPhoneOwnerName": nombre,
            "registeredPhoneService": company,
            "airTimeSKU": amount,
            "phoneId": phoneId,
        }
        Utility(Path.editPhoneNumber, 'POST', payload).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                if (Router.router.query.repositoryId) {
                    Router.push("/tienda/users/viewPhones")
                } else {
                    Router.push("/tienda/checkout/airtimeTicket")
                }

            }
        }, (error) => {
        });
    }

    phoneServiceSearch = () => {
        Utility(Path.phoneServiceSearch, 'POST').then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response.data && response.data.s === "0") {
                const phoneServiceData = response && response.data && response.data.phoneService;
                const phoneServiceDataArray = [];
                for (var item in phoneServiceData) {
                    const data = {};
                    data.id = phoneServiceData[item].value;
                    data.value = phoneServiceData[item].displayText;
                    phoneServiceDataArray.push(data);
                }
                this.setState({ phoneServiceData: [{}, ...phoneServiceDataArray] });
                if (Router && Router.router && Router.router.query && Router.router.query.repositoryId) {
                    this.getPhoneNumber(Router.router.query.repositoryId);
                } else if (Router && Router.router && Router.router.query && Router.router.query.id) {
                    this.getPhoneNumber(Router.router.query.id);
                }
            }
        }, (error) => {
        });
    }

    airtimeAmountSearch = (payload, airtime) => {
        Utility(Path.airtimeAmountSearch, 'POST', payload).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response.data && response.data.s === "0" && response.data.airtimeSkus) {
                const test = response.data.airtimeSkus;
                const airtimeAmountSearchData = [];
                for (var item in test) {
                    const data = {};
                    data.id = test[item].repositoryId;
                    data.value = test[item].displayName;
                    if (test[item].repositoryId === airtime) {
                        data.selected = true;
                    }
                    airtimeAmountSearchData.push(data);
                }
                this.setState({ airtimeAmountSearchData: [...airtimeAmountSearchData] });
                if (airtime === 'onChange') {
                    this.setState({ amount: airtimeAmountSearchData[0].id })
                    this.setState({ repositoryId: airtimeAmountSearchData[0].id })
                }
            }
        }, (error) => {
        });
    }
    handleChangeAirtimeAmount = (e) => {
        let company = this.company.getId();
        this.setState({ company: company });
        const payload = {
            "phoneService": company
        }
        this.airtimeAmountSearch(payload, 'onChange');
    }
    handleChangeAirtime = (e) => {
        let amount = this.airtime.getId();
        let repositoryId = this.airtime.getId();
        this.setState({ repositoryId: amount });
        this.state.airtimeAmountSearchData.map((item) => {
            if (amount === item.id) (
                this.setState({ amount: item.id })
            )
        })
    }
    CancelEdit = () => {
        if (Router && Router.router && Router.router.query && Router.router.query.repositoryId) {
            Router.push("/tienda/users/viewPhones")
        } else if (Router && Router.router && Router.router.query && Router.router.query.id) {
            Router.push("/tienda/checkout/airtimeTicket")
        }
    }

    render() {
        const staticLabels = this.props.staticLabels;
        const telefono = {
            inputId: 'cell',
            nameInput: 'telefono',
            labelText: staticLabels && staticLabels["pwa.addNewPhone.phoneNumber.label"],
            helperText: staticLabels && staticLabels["pwa.viewPhone.errorten.label"],
            helperTextId: '',
            required: true,
            type: 'tel',
            maxlength: '10'
        }

        const nombre = {
            inputId: 'name',
            nameInput: 'nombre',
            labelText: staticLabels && staticLabels["pwa.addNewPhone.Nombre.label"],
            helperText: staticLabels && staticLabels["pwa.editPhone.ownerName.errorMsg"],
            required: true,
            type: 'text',
            maxlength: '100'
        }

        const company = {
            labelText: staticLabels && staticLabels["pwa.addNewPhone.services.label"],
            labelId: 'company',
            selectId: 'company',
            custom: true,
            optionList: this.state.phoneServiceData
        }

        const amount = {
            labelText: 'Monto de recarga',
            labelId: 'ammount',
            selectId: 'ammount',
            custom: true,
            optionList: this.state.airtimeAmountSearchData
        }

        const buttonsOptions = [{
            text: staticLabels && staticLabels["pwa.addNewPhone.returnBack.label"],
            btnClass: "a-btn a-btn--secondary",
            // handleClick: () => Router.push("/tienda/users/viewPhones")
            handleClick: this.CancelEdit

        },
        {
            text: staticLabels && staticLabels["pwa.editPhone.addphone.label"],
            btnClass: "a-btn a-btn--primary",
            typeButton: "submit",
            Idform: "",
            handleClick: this.editPhoneNumber
        }];

        return (
            <div className="o-myAccount__cellphoneForm">
                <div className="m-box-form__content col-12 col-lg-7 col-xl-5 px-4 ml-lg-2 pb-lg-3">
                    <div className="row m-row">
                        <div className="col-7 pr-0 m-col">
                            <H2 headLineClass="a-myAccount-aside--title__formChangePassowrd" headLineText="Datos del teléfono" />
                        </div>
                        <div className="col-5 pl-0 m-col">
                            <Label className="a-changePass-label">{staticLabels && staticLabels["pwa.editPhone.requiredFields.label"]}</Label>
                        </div>
                    </div>
                    <div className="row m-row">
                        <div className=" col-12 m-col ">
                            <InputText options={telefono} nameInput="cellphone" handleChange={this.handleOnChange} inputValue={this.state.telefono} error={this.state.error} validationtype={"onlyNumbers"} ref={cn => this.telephone = cn} />
                            {/*<InputText options={telefono} nameInput="cellphone" handleChange={this.handleTelephoneChange} inputValue={this.state.telefono} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} ref={cn => this.telephone = cn} />*/}

                        </div>
                        <div className="col-12 mb-1 m-col ">
                            <InputText options={nombre} handleChange={this.handleOnChange} inputValue={this.state.nombre} ref={cn => this.firstName = cn} validationtype={'onlyText'} />

                        </div>
                        <div className="col-12 mb-1 m-col ">
                            <InputSelect options={company} handleChange={this.handleChangeAirtimeAmount} ref={cn => this.company = cn} inputValue={this.state.company} />
                        </div>
                        <div className="col-12 mb-3 m-col ">
                            <InputSelect options={amount} handleChange={this.handleChangeAirtime} ref={cn => this.airtime = cn} inputValue={this.state.amount} />
                        </div>
                        <div className="col-12 m-col ">
                            <FormButtons buttonsOptions={buttonsOptions} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}


export default OrganismCellPhoneEditForm;


