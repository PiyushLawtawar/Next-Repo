import { headLineText, H2 } from "../../atoms/HeadLines/Headlines";
import { HelperText } from '../../molecules/MaterialInputText/MaterialInputText';
import Label from '../../atoms/Label/Label';
import InputText from '../../molecules/InputText/InputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import { FormButtons } from '../../molecules/MixinMolecules/MixinMolecules';
import { Utility, logError, logDebug } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';
import { Validate } from '../../../helpers/utilities/Validate';

class OrganismCellPhoneAddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            telefono: '',
            nombre: '',
            company: '',
            amount: '',
            phoneId: '',
            repositoryId: '',
            phoneServiceData: [],
            airtimeAmountSearchData: [],
            name: '',
            data: '',
            error: false
        }
    }

    addNewPhoneNumber = () => {
        this.telephone.validation();
        this.firstName.validation();
        this.company.InputSelectionValidation();
        this.airtime.InputSelectionValidation();
        const { telefono, nombre, company, amount, repositoryId } = this.state;
        const payload = {
            "registerPhoneNumber": telefono,
            "registeredPhoneOwnerName": nombre,
            "registeredPhoneService": company,
            "airTimeSKU": repositoryId,
            "phoneId": amount,
        }
        if (telefono && nombre && company && amount && repositoryId) {
            Utility(Path.addNewPhoneNumber, 'POST', payload).then(response => {
                if (response && response.data && response.data.errorCode === '1002') {
                    Router.push('/tienda/login')
                } else if (response && response.data && response.data.s === '0') {
                    if (Router.router.query.id === "airtime") {
                        Router.push("/tienda/checkout/airtimeTicket")
                    } else {
                        Router.push("/tienda/users/viewPhones")
                    }

                }

            }, (error) => {
                logError("Error ==== :: ", error);
            });
        }

    }

    phoneServiceSearch = () => {
        Utility(Path.phoneServiceSearch, 'POST').then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                const phoneServiceData = response && response.data && response.data.phoneService;
                const phoneServiceDataArray = [];
                for (var item in phoneServiceData) {
                    const data = {};
                    data.id = phoneServiceData[item].value;
                    data.value = phoneServiceData[item].displayText;
                    phoneServiceDataArray.push(data);
                }
                this.setState({ phoneServiceData: phoneServiceDataArray });
                if (phoneServiceDataArray.length) {
                    this.setState({ company: phoneServiceDataArray[0].id });
                    const payload = {
                        "phoneService": phoneServiceDataArray[0].id
                    }
                    this.airtimeAmountSearch(payload);
                }
            }
        }, (error) => {
        });
    }

    airtimeAmountSearch = (payload) => {
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
                    airtimeAmountSearchData.push(data);
                }
                this.setState({ airtimeAmountSearchData: [...airtimeAmountSearchData] });
                this.setState({ amount: airtimeAmountSearchData[0].id })
                this.setState({ repositoryId: airtimeAmountSearchData[0].id })
            }
        }, (error) => {
        });
    }

    componentDidMount() {
        this.phoneServiceSearch();
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

    handleChangeAirtimeAmount = (e) => {
        let company = this.company.getId();
        this.setState({ company: company });
        const payload = {
            "phoneService": company
        }
        this.airtimeAmountSearch(payload);
    }
    handleChangeAirtime = (e) => {
        let amount = this.airtime.getId();
        let repositoryId = this.airtime.getId();
        this.setState({ repositoryId: amount });
        this.state.airtimeAmountSearchData.map((item) => {
            if (amount === item.id) {
                this.setState({ amount: item.id })
            }
        })
    }

    cancelNewPhoneNumber = () => {
        if (Router && Router.router && Router.router.query && Router.router.query.id && Router.router.query.id === "airtime") {
            Router.push("/tienda/checkout/airtimeTicket");
        } else {
            Router.push("/tienda/users/viewPhones");
        }
    }

    render() {

        const staticLabels = this.props.staticLabels;

        const telefono = {
            inputId: 'cell',
            nameInput: 'telefono',
            labelText: staticLabels && staticLabels["pwa.addNewPhone.phoneNumber.label"],
            helperText: staticLabels && staticLabels["pwa.addPhone.phoneNumber.errorMsg"],
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
            optionList: this.state.phoneServiceData,
            helperText: 'Selecciona una opción',
            required: false,
        }

        const amount = {
            labelText: 'Monto de recarga',
            labelId: 'ammount',
            selectId: 'ammount',
            optionList: this.state.airtimeAmountSearchData,
            helperText: 'Selecciona una opción',
            required: false,

        }

        const buttonsOptions = [{
            text: staticLabels && staticLabels["pwa.addNewPhone.returnBack.label"],
            btnClass: "a-btn a-btn--secondary",
            // handleClick: () => Router.push("/tienda/users/viewPhones")
            handleClick: this.cancelNewPhoneNumber
        },
        {
            text: staticLabels && staticLabels["pwa.addNewPhone.add.label"],
            btnClass: "a-btn a-btn--primary",
            handleClick: this.addNewPhoneNumber
        }];
        return (
            <div className="o-myAccount__cellphoneForm" >
                <div className="m-box-form__content col-12 col-lg-7 col-xl-5 px-4 ml-lg-2 pb-lg-3">
                    <div className="row m-row">

                        <div className="col-7 pr-0 m-col">
                            <H2 headLineClass="a-myAccount-aside--title__formChangePassowrd" headLineText="Datos del Teléfono" />

                        </div>

                        <div className="col-5 pl-0 m-col">
                            <Label className="a-changePass-label">{staticLabels && staticLabels["pwa.addNewPhone.requiredFields.label"]} </Label>
                        </div>
                    </div>

                    <div className="row m-row">
                        <div className=" col-12 m-col ">
                            <InputText options={telefono} nameInput="cellphone" handleChange={this.handleOnChange} inputValue={this.state.telefono} error={this.state.error} ref={cn => this.telephone = cn} validationtype={"onlyNumbers"} />
                        </div>

                        <div className="col-12 mb-1 m-col ">
                            <InputText options={nombre} handleChange={this.handleOnChange} inputValue={this.state.nombre} ref={cn => this.firstName = cn} validationtype={'onlyText'} />
                        </div>

                        <div className="col-12 mb-1 m-col ">
                            <InputSelect options={company} handleChange={this.handleChangeAirtimeAmount} inputValue={this.state.company} ref={cn => this.company = cn} />
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


export default OrganismCellPhoneAddForm;


