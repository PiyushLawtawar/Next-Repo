import InputText from '../../molecules/InputText/InputText';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import Span from '../../atoms/Span/Span';
import { FormButtons } from '../../molecules/MixinMolecules/MixinMolecules';
import { Utility } from '../../../helpers/utilities/utility';
import InvoiceConfirmation from './organism-billing-confirmation';
import { Path } from '../../../helpers/config/config';
// import Button from '../../atoms/Button/Button'
import map from 'lodash/map';
import Router from 'next/router';
import OrganismInvoiceTabs from './organism-invoice-tabs';
import { Validate } from '../../../helpers/utilities/Validate'
import Alert from "../../molecules/Alert/Alert";
import TermsAndConditions from '../../molecules/TermsAndConditions/Common_Terms_And_Conditions';
import './organism-billing.styl';

class OrganismBilling extends React.Component {
  constructor(props) {
    super(props);
    this.countries = React.createRef();
    this.taxRegistration = React.createRef();
    this.personType = React.createRef();
    this.firstName = React.createRef();
    this.lastName = React.createRef();
    this.motherLastName = React.createRef();
    this.companyName = React.createRef();
    // this.orderNumberPerson = this.props.showTrackingNumber;
    this.state = {
      invoiceResponce: '',
      invoiceusocfdilist: [],
      invoicecountrylist: [],
      rfc: '',
      rfcFieldMendatory: '',
      personType: '',
      invoiceData: {
        orderNumberPerson: '',
        rfcuser: '',
        rfc1: '',
        rfc2: '',
        rfc3: '',
        email: '',
        usocfdi: '',
        country: '',
        personType: '',
        name: '',
        paternalName: '',
        maternalName: '',
        companyName: ''
      },
      showTrackingNumber: '',
      invoiceSuccess: '',
      errors: {}
    }
  }
  handlePersonTypeField = () => {
    const personType = document.getElementById('personType').value;

    if (personType === "Física") {
      this.setState({ personType: personType })
      // console.log('if called');
      this.firstName.current.classList.remove('d-none');
      this.firstName.current.classList.add('d-block');
      this.lastName.current.classList.remove('d-none');
      this.lastName.current.classList.add('d-block');
      this.motherLastName.current.classList.remove('d-none');
      this.motherLastName.current.classList.add('d-block');
      this.companyName.current.classList.remove('d-block');
      this.companyName.current.classList.add('d-none');
    }
    else if (personType === "Moral") {
      this.setState({ personType: personType })
      //  console.log('else if called');
      this.companyName.current.classList.remove('d-none');
      this.companyName.current.classList.add('d-block');
      this.firstName.current.classList.remove('d-block');
      this.firstName.current.classList.add('d-none');
      this.lastName.current.classList.remove('d-block');
      this.lastName.current.classList.add('d-none');
      this.motherLastName.current.classList.remove('d-block');
      this.motherLastName.current.classList.add('d-none');
    }
    else if (personType === "") {
      this.hideDefaultFields();
    }
  }
  hideDefaultFields = () => {
    // console.log('hideDefaultFields is called');
    this.firstName.current.classList.remove('d-block');
    this.firstName.current.classList.add('d-none');
    this.lastName.current.classList.remove('d-block');
    this.lastName.current.classList.add('d-none');
    this.motherLastName.current.classList.remove('d-block');
    this.motherLastName.current.classList.add('d-none');
    this.companyName.current.classList.remove('d-block');
    this.companyName.current.classList.add('d-none');
  }

  selectedInvoiceTab = (tabType) => {
    //  console.log('..................selectedInvoiceTab......................................', tabType)
    const { selectInvoiceTab } = this.props;
    if (tabType === "showPhysicalOrMoralPersonFields") {
      selectInvoiceTab(tabType);
      this.countries && this.countries.current && this.countries.current.classList.remove('d-block');
      this.countries && this.countries.current && this.countries.current.classList.add('d-none');
      this.taxRegistration && this.taxRegistration.current && this.taxRegistration.current.classList.remove('d-block');
      this.taxRegistration && this.taxRegistration.current && this.taxRegistration.current.classList.add('d-none');
      this.personType && this.personType.current && this.personType.current.classList.remove('d-block');
      this.personType && this.personType.current && this.personType.current.classList.add('d-none');
      this.hideDefaultFields();
    }
    if (tabType === "showCreditPropertyFields") {
      selectInvoiceTab(tabType);
      this.countries.current.classList.remove('d-block');
      this.countries.current.classList.add('d-none');
      this.taxRegistration.current.classList.remove('d-block');
      this.taxRegistration.current.classList.add('d-none');
      this.personType.current.classList.remove('d-none');
      this.personType.current.classList.add('d-block');
      // this.hideDefaultFields();
      this.handlePersonTypeField()

    }
    if (tabType === "showForeignFields") {
      this.setState({ invoice: "" })
      selectInvoiceTab(tabType);
      this.countries.current.classList.remove('d-none');
      this.countries.current.classList.add('d-block');
      this.taxRegistration.current.classList.remove('d-none');
      this.taxRegistration.current.classList.add('d-block');
      this.personType.current.classList.remove('d-block');
      this.personType.current.classList.add('d-none');
      this.hideDefaultFields();
    }
    this.setState({errors:{}})
  }
  handleChangeTarack = (e) => {
    this.setState({ showTrackingNumber: e.target.value })
  }
  handleChange = (e) => {
    let ctlName = e.target.name.trim().lenght > 0 ? e.target.name : e.target.id
    const { invoiceData } = this.state;
    e.persist();
    this.setState(function (prevState) {
      const pre_value = prevState.invoiceData[ctlName];
      invoiceData[ctlName] = Validate.validation(e, pre_value);
      return { invoiceData }
    });
    // if (this.props.showPhysicalOrMoralPersonFields) {
    //   this.setState({})
    // }
  }

  dismiss_alert = () => {
    this.setState({ alert_status: false })
  }

  show_alert = (alert_message) => {
    this.setState({ alert_status: true, alert_message });

    setTimeout(() => {
      this.setState({ alert_status: false });
    }, 5000)
  }
  scrollUp = () => {
    window.scrollTo(0, 0);
  }

  validatePhysicalFields = () => {
    return new Promise((resolve, reject) => {
      let { invoice = {} } = this.state;
      var errors = {};
      // var rfcReg = new RegExp('^[A-Z]{4}[0-9]{9}$');
      // !rfcReg.test(this.rfcuser.state.value)
      if (!this.orderNumberPerson.state.value) { errors.orderNumberPerson = true; }
      if (!this.rfcuser.state.value || this.rfcuser.state.value.length !== 13) { errors.rfcuser = true; }
      if (!this.state.invoiceData.usocfdi) { errors.usocfdi = true; }
      if (!this.email.state.value || !Validate.isValidEmail(this.email.state.value)) { errors.email = true; }
      this.setState({ errors });
      if (Object.keys(errors).length === 0) {
        return resolve({});
      } else {
        return reject(errors)
      }
    });
  }

  validateForeignFields = () => {
    return new Promise((resolve, reject) => {
      let { invoice = {} } = this.state;
      var errors = {};
      if (!this.orderNumberPerson.state.value) { errors.orderNumberPerson = true; }
      if (!this.state.invoiceData.usocfdi) { errors.usocfdi = true; }
      if (!this.email.state.value || !Validate.isValidEmail(this.email.state.value)) { errors.email = true; }
      if (!this.state.invoiceData.country) { errors.country = true; }
      if (!this.taxRegistration.state.value) { errors.taxRegistration = true; }
      this.setState({ errors });
      if (Object.keys(errors).length === 0) {
        return resolve({});
      } else {
        return reject(errors)
      }
    });
  }

  validateCreditPropertyFields = () => {
    return new Promise((resolve, reject) => {
      let { invoice = {} } = this.state;
      var errors = {};
      if (!this.orderNumberPerson.state.value) { errors.orderNumberPerson = true; }
      if (!this.state.invoiceData.usocfdi) { errors.usocfdi = true; }
      if (!this.email.state.value) { errors.email = true; }
      if (!this.state.personType) { errors.personType = true; }
      if(this.state.personType === "Física"){
        if (!this.name.state.value) { errors.name = true; }
        if (!this.paternalName.state.value) { errors.paternalName = true; }
        if (!this.maternalName.state.value) { errors.maternalName = true; }
      }else if(this.state.personType === "Moral"){
        if (!this.companyName.state.value) { errors.company = true; }
      }

      this.setState({ errors });
      if (Object.keys(errors).length === 0) {
        return resolve({});
      } else {
        return reject(errors)
      }
    });
  }

  confirmationData = () => {
    const { invoiceData, showTrackingNumber } = this.state;
    this.props.invoiceConfirmationData(invoiceData);
    this.props.invoiceTrackingNumber(showTrackingNumber);
    // this.rfcuser.validation();
    if (this.props.showPhysicalOrMoralPersonFields) {
      // console.log('payloadpayload', invoiceData);
      let rfc1 = invoiceData.rfcuser.substring(0, 4);
      let rfc2 = invoiceData.rfcuser.substring(4, 10);
      let rfc3 = invoiceData.rfcuser.substring(10, 13);
      if (this.props.showPhysicalOrMoralPersonFields) {
        const foreignFields = this.validatePhysicalFields();
        foreignFields.then((data) => {
          const payload = {
            "page": "Fisica/Moral",
            "trackingNumber": this.state.showTrackingNumber ? this.state.showTrackingNumber : "",
            "rfc1": rfc1,
            "rfc2": rfc2,
            "rfc3": rfc3,
            "usoCFDI": invoiceData.usocfdi ? invoiceData.usocfdi : "",
            "emailId": invoiceData.email ? invoiceData.email : ""
          }
          this.props.invoiceSubmit(payload);
        }, (error) => {
          // console.error("INVALID FORM .........", error);
        })
      }
    }
    else if (this.props.showForeignFields) {
      const foreignFields = this.validateForeignFields();
      foreignFields.then((data) => {
        const payload = {
          "page": "Extranjero",
          "trackingNumber": this.state.showTrackingNumber ? this.state.showTrackingNumber : "",
          "rfc1": this.state.invoiceResponce.erfc1,
          "rfc2": this.state.invoiceResponce.erfc2,
          "rfc3": this.state.invoiceResponce.erfc3,
          "usoCFDI": invoiceData.usocfdi ? invoiceData.usocfdi : "",
          "emailId": invoiceData.email ? invoiceData.email : "",
          "country": invoiceData.country ? invoiceData.country : ""
        }
        this.props.invoiceSubmit(payload);
      }, (error) => {
        // console.log("INVALID FORM .........",error);
      })
    }
    else if (this.props.showCreditPropertyFields && this.state.personType === "Física") {
      const creditPropertyFields = this.validateCreditPropertyFields();
      creditPropertyFields.then((data) => {
        let rfc1 = this.state.invoiceResponce.arfc1
        let rfc2 = this.state.invoiceResponce.arfc2
        let rfc3 = this.state.invoiceResponce.arfc3
        const payload = {
          "page": "Acreditar",
          "trackingNumber": this.state.showTrackingNumber ? this.state.showTrackingNumber : "",
          "rfc1": rfc1,
          "rfc2": rfc2,
          "rfc3": rfc3,
          "usoCFDI": invoiceData.usocfdi ? invoiceData.usocfdi : "",
          "emailId": invoiceData.email ? invoiceData.email : "",
          "tipoDePersona": this.state.personType ? this.state.personType : "",
          "name": invoiceData.name ? invoiceData.name : "",
          "paternalName": invoiceData.paternalName ? invoiceData.paternalName : "",
          "maternalName": invoiceData.maternalName ? invoiceData.maternalName : ""
        }
        this.props.invoiceSubmit(payload);
      }, (error) => {
        // console.log("INVALID FORM .........",error);
      })
    }
    else if (this.props.showCreditPropertyFields && this.state.personType === "Moral") {
      const creditPropertyFields = this.validateCreditPropertyFields();
      creditPropertyFields.then((data) => {
        let rfc1 = this.state.invoiceResponce.arfc1
        let rfc2 = this.state.invoiceResponce.arfc2
        let rfc3 = this.state.invoiceResponce.arfc3
        const payload = {
          "page": "Acreditar",
          "trackingNumber": this.state.showTrackingNumber ? this.state.showTrackingNumber : "",
          "rfc1": rfc1,
          "rfc2": rfc2,
          "rfc3": rfc3,
          "usoCFDI": invoiceData.usocfdi ? invoiceData.usocfdi : "",
          "emailId": invoiceData.email ? invoiceData.email : "",
          "tipoDePersona": this.state.personType ? this.state.personType : "",
          " razonSocial": invoiceData.companyName ? invoiceData.companyName : ""
        }
        this.props.invoiceSubmit(payload);
      }, (error) => {
        // console.log("INVALID FORM .........",error);
      })
    }else{
        this.validateCreditPropertyFields();
    }
  }
  componentDidMount() {
    this.getConfiguration();
    const trackingNumber = document.location.search.split('=')
    this.setState({ showTrackingNumber: trackingNumber && trackingNumber[1] })
    const e = document.getElementById("nds-chat-launcher-container");
    if (e) {
      e.style.display = 'none';
    }

  }
  redirectToCreateInvoice = () => {
    Router.push('/tienda/users/createInvoice')
  }
  getConfiguration = () => {
    Utility(Path.fetchConfiguration, 'GET').then(response => {
      if (response && response.data) {
        let invoice = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration
        let cfdiList = invoice && invoice.invoiceusocfdilist;
        let countryList = invoice && invoice.invoicecountrylist;
        const cfdiListData = [{}]
        const countryListData = [{},]

        map(cfdiList, (item, index) => {
          let data = {}
          data.value = item,
            cfdiListData.push(data);
        }),
          map(countryList, (item, index) => {
            let Countrydata = {}
            Countrydata.value = item,
              countryListData.push(Countrydata);
          })
        this.setState({
          invoiceResponce: invoice,
          invoiceusocfdilist: cfdiListData,
          invoicecountrylist: countryListData
        });
        this.props.invoiceResponseCon(this.state.invoiceResponce);
      }
    });
  }
  render() {
    const invoiceResponse = this.state.invoiceResponce;
    const staticLabels = this.props.staticLabels;
    const { errors } = this.state;

    const options = {
      classBtns: 'o-invoiceOptionContainer',
      Idbtn1: 'personTypeBtn',
      Idbtn2: 'foreignBtn',
      Idbtn3: 'ownershipBtn',
      classContainers: 'o-invoice__tabs',
      classContainer1: 'o-invoiceOptionContainer__selector--selected',
      classContainer2: 'o-invoiceOptionContainer__selector',
      classContainer3: 'o-invoiceOptionContainer__selector',
      spanText1: staticLabels && staticLabels["pwa.createInvoiceForm.fiscaMoral.label"],
      spanClass1: 'a-invoiceOptionContainer__optionText--selected',
      spanText2: staticLabels && staticLabels["pwa.createInvoiceForm.Extranjero.label"],
      spanClass2: 'a-invoiceOptionContainer__optionText',
      spanText3: staticLabels && staticLabels["pwa.createInvoiceForm.acreditar.label"],
      spanClass3: 'a-invoiceOptionContainer__optionText',
      classTooltips: 'a-invoiceOptionContainer__tooltip',
      classGeneralCol: 'o-invoice__tabs--horizontal'
    }
    const order = {
      inputId: 'orderNumberPerson',
      nameInput: 'orderNumberPerson',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.pedido.label"],
      helperText: 'El campo número de pedido es obligatorio',
      helperTextId: 'helper-orderNumberPerson',
      required: true,
      disabled: false,
      maxlength: 10,
      type: 'text'
    }
    const rfcuser = {
      inputId: 'rfcuser',
      nameInput: 'rfcuser',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.rfc.label"],
      helperText: 'El campo RFC es obligatorio',
      helperTextId: 'helper-rfcPerson1',
      required: true,
      type: 'text',
      maxlength: 13
      // pattern: '/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/'
    }

    const usocfdi = {
      containerClass: 'mdc-select mdc-select--outlined',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.cfdi.label"],
      inputId: 'usocfdi',
      nameInput: 'usocfdi',
      labelId: 'usocfdi',
      selectId: 'usocfdi',
      helperText: 'Selecciona un CFDI',
      helperTextId: 'helper-usocfdi',
      helperTextClass: 'm-inputBilling__helperSelect',
      required: true,
      customItems: true,
      optionList: this.state.invoiceusocfdilist
    }
    const email = {
      inputId: 'email',
      nameInput: 'email',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.correo.label"],
      helperText: this.email && ((this.email.state.value && errors.email) ? "Ingresa un correo electrónico valido" : "Este campo es obligatorio"),
      helperTextId: 'helper-email',
      required: true,
      maxlength: 50,
      type: 'email'
    }

    const countries = {
      containerClass: 'mdc-select mdc-select--outlined',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.pais.label"],
      inputId: 'country',
      labelId: 'country',
      selectId: 'country',
      helperText: 'Este campo es obligatorio',
      helperTextId: 'helper-email',
      helperTextClass: 'm-inputBilling__helperSelect',
      required: true,
      customItems: true,
      optionList: this.state.invoicecountrylist
    }
    const taxRegistration = {
      inputId: 'taxRegistration',
      nameInput: 'taxRegistration',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.registro.label"],
      helperText: 'Este campo es obligatorio',
      helperTextId: 'helper-taxRegistration',
      required: true,
      type: 'text'
    }

    const personType = {
      containerClass: 'mdc-select mdc-select--outlined',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.tippo.label"],
      nameInput: 'personType',
      labelId: 'personType',
      selectId: 'personType',
      helperText: 'Selecciona una opción',
      helperTextId: 'helper-personType',
      helperTextClass: 'm-inputBilling__helperSelect',
      required: true,
      customItems: true,
      optionList: [
        {},
        { value: 'Física' },
        { value: 'Moral' }
      ]
    }

    const companyName = {
      inputId: 'companyName',
      nameInput: 'companyName',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.razon.label"],
      helperText: 'Este campo es obligatorio',
      helperTextId: 'helper-company',
      required: true,
      type: 'text'
    }

    const name = {
      inputId: 'name',
      nameInput: 'name',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.nombre.label"],
      helperText: 'Este campo es obligatorio',
      helperTextId: 'helper-name',
      required: true,
      maxlength: 50,
      type: 'text'
    }

    const paternalName = {
      inputId: 'paternalName',
      nameInput: 'paternalName',
      labelText: staticLabels && staticLabels["pwa.createInvoiceForm.paterno.label"],
      helperText: 'Este campo es obligatorio',
      helperTextId: 'helper-firstSurname',
      required: true,
      maxlength: 50,
      type: 'text'
    }

    const maternalName = {
      inputId: 'maternalName',
      nameInput: 'maternalName',
      labelText: 'Apellido materno',
      helperText: 'Este campo es obligatorio',
      helperTextId: 'helper-secondSurname',
      required: true,
      maxlength: 50,
      type: 'text'
    }
    const typePage = "billing"
    const invoiceData = this.state;
    return (
      <React.Fragment>
        <OrganismInvoiceTabs staticLabels={staticLabels} options={options} selectedInvoiceTab={this.selectedInvoiceTab} {...this.props} />
        <div className="o-invoice__box mt-2">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="row">
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={order} ref={orderNumberPerson => this.orderNumberPerson = orderNumberPerson} error={errors.orderNumberPerson} nameInput="orderNumberPerson" handleChange={(e) => this.handleChangeTarack(e)} inputValue={this.state.showTrackingNumber} />
                </div>
              </div>
              <div className="row">
                {this.props.showPhysicalOrMoralPersonFields === true ?
                  <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                    <InputText options={rfcuser} ref={rfcuser => this.rfcuser = rfcuser} nameInput="rfcuser" error={errors.rfcuser} handleChange={(e) => this.handleChange(e)} inputValue={this.props.showForeignFields === true ? invoiceResponse.erfc1 + invoiceResponse.erfc2 + invoiceResponse.erfc3 : this.props.showCreditPropertyFields ? invoiceResponse.arfc1 + invoiceResponse.arfc2 + invoiceResponse.arfc3 : this.state.invoiceData && this.state.invoiceData.rfcuser} />
                  </div>
                  :
                  <div id="disableFieldInvoice" className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                    <InputText options={rfcuser} ref={rfcuser => this.rfcuser = rfcuser} nameInput="rfcuser" error={errors.rfcuser} handleChange={(e) => this.handleChange(e)} disabled="true" inputValue={this.props.showForeignFields === true ? invoiceResponse.erfc1 + invoiceResponse.erfc2 + invoiceResponse.erfc3 : this.props.showCreditPropertyFields ? invoiceResponse.arfc1 + invoiceResponse.arfc2 + invoiceResponse.arfc3 : this.state.invoiceData && this.state.invoiceData.rfc1 + this.state.invoiceData.rfc2 + this.state.invoiceData.rfc3} />
                  </div>
                }
              </div>
              <div className="row">
                <div className="col-12 p-0 pl-lg-3">
                  <InputSelect options={usocfdi} ref={usocfdi => this.usocfdi = usocfdi} nameInput="usocfdi" error={errors.usocfdi} handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.usocfdi} />
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={email} ref={email => this.email = email} nameInput="email" error={errors.email} handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.email} />
                </div>
              </div>
              <div className="row o-billing__fieldsForeign o-billing__fieldsForeign--countries d-none" ref={this.countries} >
                <div className="col-12 p-0 pl-lg-3">
                  <InputSelect options={countries} ref={country => this.country = country} nameInput="country" error={errors.country} handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.country} />
                </div>
              </div>
              <div className="row o-billing__fieldsForeign d-none" ref={this.taxRegistration}>
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={taxRegistration} ref={taxRegistration => this.taxRegistration = taxRegistration} nameInput="taxRegistration" error={errors.taxRegistration} handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.taxRegistration} />
                </div>
              </div>
              <div className="row o-billing__fieldsProperty o-billing__fieldsForeign--personaType d-none" ref={this.personType}>
                <div className="col-12 p-0 pl-lg-3">
                  <InputSelect options={personType} handleChange={this.handlePersonTypeField} ref={personType => this.personType = personType} error={errors.personType} nameInput="personType" inputValue={this.state.invoiceData && this.state.invoiceData.personType} />
                </div>
              </div>
              <div className="row o-billing__fieldsProperty_f d-none o-billing__fieldCompany" ref={this.companyName}>
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={companyName} ref={companyName => this.companyName = companyName} error={errors.company} nameInput="company" handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.companyName} />
                </div>
              </div>
              <div className="row o-billing__fieldsProperty_f d-none o-billing__fieldName" ref={this.firstName}>
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={name} ref={name => this.name = name} nameInput="name" error={errors.name} handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.name} />
                </div>
              </div>
              <div className="row o-billing__fieldsProperty_f d-none o-billing__fieldFirstSurname" ref={this.lastName}>
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={paternalName} ref={paternalName => this.paternalName = paternalName} error={errors.paternalName} nameInput="paternalName" handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.paternalName} />
                </div>
              </div>
              <div className="row o-billing__fieldsProperty_f d-none o-billing__fieldSecondSurname" ref={this.motherLastName}>
                <div className="col-12 p-0 pl-lg-3 m-invoice__colInput">
                  <InputText options={maternalName} ref={maternalName => this.maternalName = maternalName} error={errors.maternalName} nameInput="maternalName" handleChange={(e) => this.handleChange(e)} inputValue={this.state.invoiceData && this.state.invoiceData.maternalName} />
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <Span className="a-invoice__requiredtext">*Campos obligatorios</Span>
            </div>
          </div>
        </div>
        <div className="row p-3 o-billing__invoiceAcceptTerms">
          <Span className="a-billing__invoiceAccept">{staticLabels && staticLabels["pwa.createInvoiceForm.accept.label"]}</Span>
          <a id="invoiceTermsAndConditions" className="a-billing__invoiceConditions ml-lg-2" href={staticLabels["pwa.InvoiceRequestPage.termsandconditions.linkUrl"]}>{staticLabels["pwa.InvoiceRequestPage.invoiceTermsAndConditions.label"]}</a>
        </div>
        <div className="row o-billing__rowButtons">
          <div className="col-12">
            <div className="m-form-buttons">
              <div className="row o-billing__rowBtnsForm">
                <div className="col-12 order-2 order-lg-0 col-lg-3">
                  <button onClick={this.redirectToCreateInvoice} className="a-btn a-btn__billing--secondary d-none d-lg-block a-btn__cancelInvoice">{staticLabels && staticLabels["pwa.createInvoiceForm.cancel.label"]}
                  </button>
                </div>
                <div className="col-12 order-1 order-lg-1 col-lg-3" ref={requestButton => this.requestButton = requestButton}>
                  <button className="a-btn a-btn__billing" disabled={this.props.buttonDisabled} type="submit" form="" onClick={() => this.confirmationData()}>{staticLabels && staticLabels["pwa.createInvoiceForm.requestInvoice.label"]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default OrganismBilling;
