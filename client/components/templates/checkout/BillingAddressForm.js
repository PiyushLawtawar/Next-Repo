import React from 'react';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { Validate } from '../../../helpers/utilities/Validate';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { PRICEFILTER_VALIDATION, MIN_TALLA_COUNT } from '../../../../client/config/constants';



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

let Colonia = {
    labelText: "Colonia",
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

let validity = {
    labelText: "Validity",
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

export default class BillingAddressForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: {
                country: 'MX',
                postalCode: '',
                stateId: '',
                city: '',
                municipality: '',
                colony: '',
                street: '',
                noExt: '',
                noInt: '',
                building: '',
                betweenStreet: '',
                andStreet: '',
                phoneWithLADA: '',
                cellphone: '',
                useDeliveryAddr: false,
                stateName: '',
                colonyText:'',
                municipalityText:'',
                otherColony: ''
            },
            countries: {
                labelText: "",
                labelId: 'validity',
                selected: true,
                optionList: [{}]
            },
            municipalityList: [],
            neighbourhoodList: [{}],
            settlementList: [],
            stateList: [{}],
            oldStateList:[],
            focused: {

            },
            errors: {

            },
            guatamalaCountry: false,
            countriesLis: [],
            addressSearchErrorText: ''
        }
    }


    componentDidMount() {
        this.getStates();
        this.getCountries();
    }

    getStates = () => {
        // Utility(Path.getListOfStates+"ITR", 'GET'/*, { "ITR": "ITR" }*/).then(response => {
        //     let { stateList,oldStateList  } = this.state;
        //     if(response && response.data && response.data.estados){
        //         stateList = Object.keys(response.data.estados).map(key => {
        //             const obj = response.data.estados[key];
        //             const value = obj.stateId;
        //             const name = obj.stateName;
        //             return { name, value }
        //         })
        //     }
        //     oldStateList = stateList;
        //     this.setState({ stateList, oldStateList});
        // });
        Utility(Path.collectinstore, 'GET').then(response => {
            let { stateList, oldStateList } = this.state;
            if (response && response.data && response.data.s === '0') {
                const states = (response.data && response.data.statesInfo) ? getStateArray(response.data.statesInfo) : []
                this.setState({ states });
                this.setState({ stateList: states, oldStateList: states });
            }
        });
    }
    getCountries = (isTrue) => {
    let { countries, address, countriesLis } = this.state;
    if(isTrue && isTrue  === true){
      countries.optionList[0].name = address.country;
      this.setState({countries});
    }else if(isTrue && isTrue === false){
      countries.optionList = countriesLis;
      this.setState({countries});
    }else{
        countries.optionList = [{}];
        Utility(Path.getcountry, 'GET').then(response => {
            let countriesList = [];
            if(response && response.data){
                countriesList = Object.keys(response.data).map(key => {
                    const obj = response.data[key];
                    const value = Object.keys(obj)[0];
                    const name = obj[value];
                    return { name, value }
                })
            }
            countries.optionList = countriesList || [];
            countriesLis =  countriesList;
            this.setState({ countries,countriesLis });
        });
    }
    }
     addresssearchAPI = (PostalCode, fieldBlur) => {
        const shippingAddress = this.props.shippingAddressDetail || {}
        // service addresssearch change GET from POST method :: Start
        let payLoad = '?action=EMA&cp=' + PostalCode;
        Utility(Path.addresssearch + payLoad, 'GET').then(response => {
    		// service addresssearch change GET from POST method :: End            
            let { address, editAddress, labels, errors, addressSearchErrorText, stateList, oldStateList } = this.state;
            if(response && response.data && response.data.s === '1'){
                addressSearchErrorText = response.data.err;
                stateList = oldStateList; 
                if(!address.useDeliveryAddr){
                    address.stateId = '';
                }else{
                    const stateObj = stateList.filter(state => state.name === shippingAddress.state)[0];
                    if (stateObj && stateObj.name) {
                        address.stateId = stateObj.value
                    }
                }
                if(address.useDeliveryAddr && shippingAddress.colonyId === "-2"){
                    address.colony = shippingAddress.colony;
                }
                this.props.show_alert_message(addressSearchErrorText, 'alert');
                this.setState({addressSearchErrorText, stateList, address});
            }else if(PostalCode && response && response.data && response.data.s === '0'){
                  addressSearchErrorText = "";
                  address.postalcode = PostalCode;
            const { municipality , neighbourhood , settlement, state } = (response && response.data && response.data.addrSearchResponse) || {};

            const municipalityList = municipality && municipality.map(str=>{
                                str = str.split(':');
                                return {name: str[1],value: str[0]};
                            }) || [];

            const neighbourhoodList = neighbourhood && neighbourhood.map(str=>{
                                str = str.split(':');
                                return {name: str[1],value: str[0]};
                            }) || [];

            const settlementList = settlement && settlement.map(str=>{
                                str = str.split(':');
                                return {name: str[1],value: str[0]};
                            }) || [];

            const stateList = state && state.map(str=>{
                                str = str.split(':');
                                return {name: str[1],value: str[0]};
                            }) || [];
               
            if(fieldBlur){
                address.stateId = stateList.length > 0 ? stateList[0].value : '';
                address.municipality = municipalityList.length > 0 ? municipalityList[0].value : '';
                if(address.useDeliveryAddr && shippingAddress.colonyId === "-2"){
                    address.otherColony = shippingAddress.colony;
                    address.colony = "other";
                }else{
                    address.colony = settlementList.length > 0 ? settlementList[0].value : '';
                }
            }
            const { previousSelection } = this.props;
            if(!fieldBlur && this.props.manualClick===false &&  previousSelection && previousSelection.postalCode){
                const stateObj = stateList.filter(state=>state.name===previousSelection.state)[0];
                if(stateObj && stateObj.name){
                    address.stateId = stateObj.value
                }
                address.municipality = previousSelection.delegationMunicipalityId || '';
                address.colony = previousSelection.colonyId || '';
            }
            const selectedState = stateList.filter(obj=>obj.value===address.stateId);
            if(selectedState.length === 0 || !address.stateId){
                address.stateId = stateList.length > 0 ? stateList[0].value : '';
            }

            if(address.stateId) errors.stateId = false;
            if(address.municipality) errors.municipality = false;
            if(address.colony) errors.colony = false;

            this.setState({
                municipalityList,
                neighbourhoodList,
                settlementList,
                stateList,
                address,
                errors,
                addressSearchErrorText
            });
        }

        }, (error) => {
            // console.log("Error ==== :: ", error);
        });
    }

    handlePostalCodeBlur = (e) => {
        let {address, errors, addressSearchErrorText, oldStateList, stateList} = this.state;
        this.handleBlur(e);
        if(e.target.value && e.target.value.length === 5 && e.target.value !== '00000'){
          this.addresssearchAPI(e.target.value, true);
        }else if(e.target.value){
            stateList = oldStateList; 
            address.stateId = '';
            if(e.target.value === '00000'){
              address.postalCode = '';
            }
        //   addressSearchErrorText = this.props.staticLabelValues['pwa.checkoutBillingPage.postalCode.incorrect.text'];;
        //   if(e.target.value.length !== 5){
        //     addressSearchErrorText = this.props.staticLabelValues['pwa.checkoutBillingPage.postalCode.maxLength.text'];;
        //   }
        //   this.props.show_alert_message(addressSearchErrorText, 'alert');
        //   addressSearchErrorText = "";
            errors.postalCode = true;
          this.setState({address,errors, stateList});
        }else{
          address.postalCode = e.target.value;
          errors.postalCode = true;
          this.setState({address,errors});
        }
    }

    validateForm = () => {
        return new Promise((resolve, reject) => {

            const { address, municipalityList, neighbourhoodList, settlementList, stateList, addressSearchErrorText } = this.state;
            var errors = {};

            if (!address.country) { errors.country = true; }
            if(!address.postalCode ||  address.postalCode.length!==5){ errors.postalCode = true; }
            if (!address.stateId) { errors.stateId = true; }
            if (!address.city) { errors.city = true; }
            if (!address.municipality && !address.municipalityText) { errors.municipality = true; }
            if (!address.colony && !address.colonyText) { errors.colony = true; }
            if (address.colony && address.colony === 'other' && !address.otherColony) { errors.otherColony = true; }
            if (!address.street) { errors.street = true; }
            if (!address.noExt) { errors.noExt = true; }
            if (!address.phoneWithLADA) { errors.phoneWithLADA = true; }

            if(addressSearchErrorText){
                if(!address.municipalityText){ errors.municipalityText = true }
                if(!address.colonyText){ errors.colonyText = true }
            }
            if (Object.keys(errors).length === 0) {
                const municipality = municipalityList.filter(obj => obj.value === address.municipality);
                address.delegationMunicipality = (municipality && municipality[0]) ? municipality[0].name : "";

                // const neighbourhood = neighbourhoodList.filter(obj=>obj.value===address.municipality);
                // address.neighbourhood = neighbourhood ? neighbourhood.name : "";

                const colony = settlementList.filter(obj => obj.value === address.colony);
                address.colonyName = (colony && colony[0]) ? colony[0].name : (address.colonyName || "");

                const state = stateList.filter(obj => obj.value === address.stateId);
                address.stateName = (state && state[0]) ? state[0].name : "";
                address.businessPhoneCode = address.phoneWithLADA.substring(0, 3);
                address.businessPhoneNumber = address.phoneWithLADA.substring(3);

                return resolve(address);
            } else {
                this.setState({ errors });
                return reject({})
            }


        });
    }

    handleOnCheckBoxChange = (e) => {
        const { address } = this.state;
        address[e.target.name] = e.target.checked;
        if (e.target.checked) {
            const shippingAddress = this.props.shippingAddressDetail || {}
            address.postalCode = shippingAddress.postalCode || '';
            address.city = shippingAddress.city || '';
            address.stateId = shippingAddress.stateId || '';
            address.municipality = shippingAddress.deligation || '';
            if(shippingAddress.colonyId === "-2"){
                address.otherColony = shippingAddress.colony;
                address.colony = "other";
            }else{
                address.colony = shippingAddress.colony || '';
                address.colonyName = shippingAddress.colony || '';
            }
            address.country = shippingAddress.country || '',
            address.street = shippingAddress.street || '';
            address.noExt = shippingAddress.exteriorNumber || '';
            address.noInt = shippingAddress.interiorNumber || '';
            address.building = shippingAddress.building || '';
            address.betweenStreet = shippingAddress.address2 || '';
            address.andStreet = shippingAddress.address3 || '';
            address.phoneWithLADA = shippingAddress.phoneNumber && shippingAddress.phoneNumber.replace(/[^\d]/g, '') || '';
            address.cellphone = shippingAddress.mobilePhoneNumber && shippingAddress.mobilePhoneNumber.replace(/[^\d]/g, '') || '';
            address.colonyText = shippingAddress && shippingAddress.colony || '';
            address.municipalityText = shippingAddress && shippingAddress.deligation || '';
            if (shippingAddress && shippingAddress.country) {
                address.country = shippingAddress.country;
            }
            this.addresssearchAPI(shippingAddress.postalCode,true);
            this.setState({ address });
            this.getCountries(true);
        } else {
            const municipalityList = [{}];
            const neighbourhoodList = [{}];
            const settlementList = [{}];
            const stateList = [{}];
            const billingAddress = this.props.editCardInfoDetails && this.props.editCardInfoDetails.billingAddress || {};
            address.postalCode = billingAddress.postalCode || '',
                address.city = billingAddress.city || '',
                address.stateId = billingAddress.stateId || '',
                address.municipality = billingAddress.delegationMunicipality || '',
                address.colony = billingAddress.neighbourhood || '',
                address.street = billingAddress.address1 || '',
                address.noExt = billingAddress.exteriorNumber || '',
                address.noInt = billingAddress.interiorNumber || '',
                address.building = billingAddress.building || '',
                address.betweenStreet = billingAddress.address2 || '',
                address.andStreet = billingAddress.address3 || '',
                address.phoneWithLADA = billingAddress.phoneNumber || '',
                address.cellphone = billingAddress.phoneNumber || '';
                address.country = billingAddress.country || ''
                address.otherColony = billingAddress.otherColony || '';
                address.colonyName = billingAddress.colonyName || '';
                address.colonyText = billingAddress.colony || '';
                address.municipalityText = billingAddress.deligation || '';
                const { oldStateList } = this.state;
            this.setState({
                municipalityList,
                neighbourhoodList,
                settlementList,
                stateList: oldStateList,
                address
            });
            this.getCountries(false);
        }
    }

    handleOnSelectChange = (value, e) => {
        if (e.target.value === 'GT') {
            Utility(Path.guatemalaStates, 'GET').then(response => {
                let data = response.data || [];
                let { stateList } = this.state;
                stateList = data.map(str => {
                    let value = str;
                    let name = str;
                    return { name, value }
                })
                this.setState({ stateList, guatamalaCountry: true });
            });

        } else {
            this.getStates();
        }
        this.handleOnChange(e);
    }

    handleOnChange = (e) => {
        const { address } = this.state;
        e.persist();
        this.setState(function (prevState) {
            const pre_value = prevState.address[e.target.name];
            address[e.target.name] = Validate.validation(e, pre_value);
            return { address }
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
        if (!address[e.target.name] && e.target.required) {
            errors[e.target.name] = true;
        } else {
            errors[e.target.name] = false;
        }
        this.setState({ focused, errors });
    }

    render() {
        const { address, errors, focused, municipalityList, neighbourhoodList, settlementList, stateList, countries, guatamalaCountry, addressSearchErrorText } = this.state;
        if (settlementList.length === 0 || (settlementList[0] && settlementList[0].value !== 'other')) {
            settlementList.unshift({ name: 'OTRA COLONIA', value: 'other' });
        }
        const { colonia, staticLabelValues } = this.props;
        let stateListOptions = { labelText: staticLabelValues['pwa.checkoutBillingPage.state.label'], labelId: 'validity', selected: true, selectText: staticLabelValues['pwa.checkoutBillingPage.state.label'], optionList: stateList };
        let colonyListOptions = { labelText: staticLabelValues['pwa.checkoutBillingPage.colony.text'], labelId: 'validity', selected: true, selectText: staticLabelValues['pwa.checkoutBillingPage.colony.text'], optionList: settlementList };
        let municipalityListOptions = { labelText: staticLabelValues['pwa.checkoutBillingPage.municipality.label'], labelId: 'validity', selected: true, selectText: staticLabelValues['pwa.checkoutBillingPage.municipality.label'], optionList: municipalityList };
        let countriesListOptions = { ...countries, labelText : staticLabelValues['pwa.checkoutBillingPage.country.label']};
        return (
            <React.Fragment>
                {
                    ((this.props.shippingAddressDetail && this.props.shippingAddressDetail.nickName && !this.props.shippingAddressDetail.storePickup && !this.props.shippingAddressDetail.digitalInfo) ||  (this.props.shippingAddressDetail && this.props.shippingAddressDetail.postalCode && !this.props.mainContent.showGiftInfoMsg && !this.props.shippingAddressDetail.storePickup)) ?
                        <React.Fragment>
                            <MaterialInputCheckBox text={staticLabelValues['pwa.checkoutBillingPage.copyShippingAddress.text']}
                                name="useDeliveryAddr"
                                value={address.useDeliveryAddr}
                                onChange={this.handleOnCheckBoxChange} />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true"></Paragraph>
                            </div>
                        </React.Fragment>
                        : null
                }
                <div className="m-newAddressInfo">
                    
                    {/* App Start*/}
                    <div className="d-xl-none d-lg-none">
                        <MaterialSelect
                            options={countriesListOptions}
                            name="country"
                            value={address.country}
                            handleChange={this.handleOnSelectChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.country}
                            field_valid={errors.country}
                            allowWhatEverLength={true}
                            required />
                        <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                {/*<font><font >Country Error </font></font>*/}
                            </Paragraph>
                        </div>
                        <InputHelperAssistant
                            value={address.postalCode}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handlePostalCodeBlur}
                            field_focus={focused.postalCode}
                            field_valid={errors.postalCode}
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={5}
                            text='Ej. Casa, Oficina...'
                            helperTextId='helper-nombreCorto'
                            name="postalCode"
                            inputId='Codigo'
                            nameInput='Codigo'
                            labelPosition='right'
                            
                            
                            type="tel"
                            labelText={staticLabelValues['pwa.checkoutBillingPage.postalCode.text']}
                            required />
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                {
                                    (address.postalCode && address.postalCode.length!==5 && !focused.postalCode) ?
                                    staticLabelValues['pwa.checkoutBillingPage.postalCode.maxLength.text'] : (
                                        errors.postalCode && staticLabelValues['pwa.checkoutBillingPage.postalCode.required.text']
                                    )
                                }
                            </Paragraph>
                        </div>
                        <MaterialSelect
                            options={stateListOptions}
                            name="stateId"
                            value={address.stateId}
                            handleChange={this.handleOnSelectChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.stateId}
                            field_valid={errors.stateId}
                            allowWhatEverLength={true}
                            required />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                    {errors.stateId && staticLabelValues['pwa.checkoutBillingPage.emptyState.errorMsg']}
                                </Paragraph>
                            </div>
                        <InputHelperAssistant
                            name="city"
                            value={address.city}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.city}
                            field_valid={errors.city}
                            maxLength={40}
                            inputId='Ciudad' nameInput='Ciudad' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.city.label']} required />
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    {errors.city && staticLabelValues['pwa.checkoutBillingPage.emptyCity.errorMsg']}
                            </Paragraph>
                        </div>
                        {
                            (addressSearchErrorText)?
                            <React.Fragment>
                                <InputHelperAssistant
                                    name="municipalityText"
                                    value={address.municipalityText}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.municipalityText}
                                    field_valid={errors.municipalityText}
                                    maxLength={100}
                                    inputId='municipalityText' nameInput='municipalityText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.municipality.label']} required 
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                        {errors.municipalityText && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                                    </Paragraph>
                                </div>
                            </React.Fragment>
                        :
                        <React.Fragment>
                            <MaterialSelect
                                options={municipalityListOptions}
                                name="municipality"
                                value={address.municipality}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.municipality}
                                field_valid={errors.municipality}
                                maxLength={100}
                                allowWhatEverLength={true}
                                required />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                    {errors.municipality && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                                </Paragraph>
                            </div>
                        </React.Fragment>
                        }
                        {
                            (addressSearchErrorText)?
                            <React.Fragment>
                                <InputHelperAssistant
                                    name="colonyText"
                                    value={address.colonyText}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.colonyText}
                                    field_valid={errors.colonyText}
                                    maxLength={100}
                                    inputId='colonyText' nameInput='colonyText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.neighbourhood.label']} required
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                        { errors.colonyText && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                                    </Paragraph>
                                </div>
                          </React.Fragment>
                            :
                           <React.Fragment>
                            <MaterialSelect
                                options={colonyListOptions}
                                name="colony"
                                value={address.colony}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.colony}
                                field_valid={errors.colony}
                                maxLength={100}
                                allowWhatEverLength={true}
                                required />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                    { errors.colony && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                                </Paragraph>
                            </div>
                          </React.Fragment>
                        }
                        { 
                            (address.colony === 'other')?
                            <React.Fragment>
                            <InputHelperAssistant
                                name="otherColony"
                                value={address.otherColony}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.otherColony}
                                field_valid={errors.otherColony}
                                maxLength={100}
                                inputId='OtroColonia' nameInput='OtroColonia' labelPosition='right'   type="text" labelText={staticLabelValues["pwa.checkoutBillingPage.otherColony.text"]} required />
                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyOtherColony.errorMsg']}
                                </Paragraph>
                            </div>
                            </React.Fragment>
                            : null
                        }
                        <InputHelperAssistant
                            name="street"
                            value={address.street}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.street}
                            field_valid={errors.street}
                            maxLength={100}
                            inputId='Calle' nameInput='Calle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.street.label']} required />
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                    {errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyStreet.errorMsg']}
                            </Paragraph>
                        </div>
                        {
                            (!guatamalaCountry) ?
                                <div className="d-flex flex-row align-items-center justify-content-between no-gutters">
                                    <div className="col-6 pr-2">
                                        <InputHelperAssistant
                                            name="noExt"
                                            value={address.noExt}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.noExt}
                                            field_valid={errors.noExt}
                                            maxLength={10}
                                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                                            inputId='NumExt' nameInput='NumExt' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.exteriorNumber.label']} required />
                                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                {errors.noExt && staticLabelValues['pwa.checkoutBillingPage.emptyExtNumber.errorMsg']}
                                            </Paragraph>
                                        </div>
                                    </div>
                                    <div className="col-6 pl-2">
                                        <InputHelperAssistant
                                            name="noInt"
                                            value={address.noInt}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.noInt}
                                            maxLength={10}
                                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                                            inputId='NumInt' nameInput='NumInt' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.interiorNumber.label']} />
                                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                            </Paragraph>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                        {
                            (!guatamalaCountry) ?
                                <React.Fragment>
                                    <InputHelperAssistant
                                        name="building"
                                        value={address.building}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.building}
                                        maxLength={100}
                                        inputId='Edificio' nameInput='Edificio' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.building.label']} />
                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                        </Paragraph>
                                    </div>
                                </React.Fragment>
                                : null
                        }
                        {
                            (!guatamalaCountry) ?
                                <React.Fragment>
                                    <InputHelperAssistant
                                        name="betweenStreet"
                                        value={address.betweenStreet}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.betweenStreet}
                                        maxLength={100}
                                        inputId='Entrecalle' nameInput='Entrecalle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.betweenStreet.label']} />
                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                        </Paragraph>
                                    </div>
                                </React.Fragment>
                                : null
                        }
                        {
                            (!guatamalaCountry) ?
                                <React.Fragment>
                                    <InputHelperAssistant
                                        name="andStreet"
                                        value={address.andStreet}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.andStreet}
                                        maxLength={100}
                                        inputId='ycalle' nameInput='ycalle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.andStreet.label']} />
                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                        </Paragraph>
                                    </div>
                                </React.Fragment>
                                : null
                        }
                        <InputHelperAssistant
                            name="phoneWithLADA"
                            value={address.phoneWithLADA}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.phoneWithLADA}
                            field_valid={errors.phoneWithLADA}
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={10}
                            inputId='TeléfonoconLADA' nameInput='TeléfonoconLADA' labelPosition='right'   type="tel" labelText={staticLabelValues['pwa.checkoutBillingPage.PhoneNoWithCode.label']} required />
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                {errors.phoneWithLADA && staticLabelValues['pwa.checkoutBillingPage.emptyParticularPhone.errorMsg']}
                            </Paragraph>
                        </div>
                        <InputHelperAssistant
                            name="cellphone"
                            value={address.cellphone}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.cellphone}
                            field_valid={errors.cellphone}
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={10}
                            inputId='TeléfonoCellular' nameInput='TeléfonoCellular' labelPosition='right'   type="tel" labelText={staticLabelValues['pwa.checkoutBillingPage.celluler.label']} />
                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                            </Paragraph>
                        </div>
                    </div>
                    {/* App End*/}


                    {/*WeB Start*/}
                    <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-11">
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                            <div className="col-lg-12 pl-xl-0">
                                <MaterialSelect
                                    options={countriesListOptions}
                                    name="country"
                                    value={address.country}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.country}
                                    field_valid={errors.country}
                                    allowWhatEverLength={true}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                            <div className="col-lg-12">
                                <InputHelperAssistant
                                    inputId='Codigo'
                                    nameInput='Codigo'
                                    labelPosition='right'
                                    
                                    
                                    type="telss"
                                    labelText={staticLabelValues['pwa.checkoutBillingPage.postalCode.text']}
                                    required
                                    name="postalCode"
                                    value={address.postalCode}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handlePostalCodeBlur}
                                    field_focus={focused.postalCode}
                                    field_valid={errors.postalCode}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={5}
                                    text='Ej. Casa, Oficina...'
                                    helperTextId='helper-nombreCorto'

                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {
                                            (address.postalCode && address.postalCode.length!==5 && !focused.postalCode) ?
                                            staticLabelValues['pwa.checkoutBillingPage.postalCode.maxLength.text'] : (
                                                errors.postalCode && staticLabelValues['pwa.checkoutBillingPage.postalCode.required.text']
                                            )
                                        }
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                            <div className="col-lg-12 pr-xl-0">
                                <MaterialSelect
                                    options={stateListOptions}
                                    name="stateId"
                                    value={address.stateId}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.stateId}
                                    field_valid={errors.stateId}
                                    allowWhatEverLength={true}
                                    required />
                                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                        {errors.stateId && staticLabelValues['pwa.checkoutBillingPage.emptyState.errorMsg']}
                                        </Paragraph>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-11">
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                            <div className="col-lg-12 pl-xl-0">
                                <InputHelperAssistant
                                    name="city"
                                    value={address.city}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.city}
                                    field_valid={errors.city}
                                    maxLength={40}
                                    inputId='Ciudad' nameInput='Ciudad' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.city.label']} required />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {errors.city && staticLabelValues['pwa.checkoutBillingPage.emptyCity.errorMsg']}
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                            {
                            (addressSearchErrorText)?
                                <div className="col-lg-12">
                                    <InputHelperAssistant
                                        name="municipalityText"
                                        value={address.municipalityText}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.municipalityText}
                                        field_valid={errors.municipalityText}
                                        maxLength={100}
                                        inputId='municipalityText' nameInput='municipalityText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.municipality.label']} required 
                                    />
                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                            {errors.municipalityText && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                                        </Paragraph>
                                    </div>                                    
                                </div>
                            :
                            <div className="col-lg-12">
                                <MaterialSelect options={municipalityListOptions}
                                    name="municipality"
                                    value={address.municipality}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.municipality}
                                    field_valid={errors.municipality}
                                    maxLength={100}
                                    allowWhatEverLength={true}
                                    required />
                                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                            {errors.municipality && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                                        </Paragraph>
                                    </div>                                    
                            </div>
                            }
                        </div>
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                            {
                                (addressSearchErrorText)?
                                <div className="col-lg-12 pr-xl-0">
                                    <InputHelperAssistant
                                        name="colonyText"
                                        value={address.colonyText}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.colonyText}
                                        field_valid={errors.colonyText}
                                        maxLength={100}
                                        inputId='colonyText' nameInput='colonyText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.neighbourhood.label']} required
                                     />
                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                            { errors.colonyText && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                                        </Paragraph>
                                    </div>                                     
                                </div>
                            :
                            <div className="col-lg-12 pr-xl-0">
                                <MaterialSelect options={colonyListOptions}
                                    name="colony"
                                    value={address.colony}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.colony}
                                    field_valid={errors.colony}
                                    maxLength={100}
                                    allowWhatEverLength={true}
                                    required />
                                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                                            { errors.colony && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                                        </Paragraph>
                                    </div>                                    
                            </div>
                            }
                        </div>
                    </div>
                    <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-11">
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                            <div className="col-lg-12 pl-xl-0">
                                { 
                                    (address.colony === 'other')?
                                    <React.Fragment>
                                    <InputHelperAssistant
                                        name="otherColony"
                                        value={address.otherColony}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.otherColony}
                                        field_valid={errors.otherColony}
                                        maxLength={100}
                                        inputId='OtroColonia' nameInput='OtroColonia' labelPosition='right'   type="text" labelText={staticLabelValues["pwa.checkoutBillingPage.otherColony.text"]} required />
                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                {errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyOtherColony.errorMsg']}
                                        </Paragraph>
                                    </div>
                                    </React.Fragment>
                                    : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-11">
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                            <div className="col-lg-12 pl-xl-0">
                                <InputHelperAssistant
                                    name="street"
                                    value={address.street}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.street}
                                    field_valid={errors.street}
                                    maxLength={100}
                                    inputId='Calle' nameInput='Calle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.street.label']} required />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyStreet.errorMsg']}
                                    </Paragraph>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                            {
                                (!guatamalaCountry) ?
                                    <div className="col-lg-6">
                                        <InputHelperAssistant
                                            name="noExt"
                                            value={address.noExt}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.noExt}
                                            field_valid={errors.noExt}
                                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                                            maxLength={10}
                                            inputId='NumExt' nameInput='NumExt' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.exteriorNumber.label']} required />
                                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                {errors.noExt && staticLabelValues['pwa.checkoutBillingPage.emptyExtNumber.errorMsg']}
                                            </Paragraph>
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                (!guatamalaCountry) ?
                                    <div className="col-lg-6">
                                        <InputHelperAssistant
                                            name="noInt"
                                            value={address.noInt}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.noInt}
                                            maxLength={10}
                                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                                            inputId='NumInt' nameInput='NumInt' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.interiorNumber.label']} />
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                </Paragraph>
                                    </div>
                                    : null
                            }
                        </div>
                        {
                            (!guatamalaCountry) ?
                                <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                                    <div className="col-lg-12 pr-xl-0">
                                        <InputHelperAssistant
                                            name="building"
                                            value={address.building}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.building}
                                            maxLength={100}
                                            inputId='Edificio' nameInput='Edificio' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.building.label']} />
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                </Paragraph>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                    <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 mb-3">
                        {
                            (!guatamalaCountry) ?
                                <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                                    <div className="col-lg-12 pl-xl-0">
                                        <InputHelperAssistant
                                            name="betweenStreet"
                                            value={address.betweenStreet}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.betweenStreet}
                                            maxLength={100}
                                            inputId='EntreCalle' nameInput='EntreCalle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.betweenStreet.label']} />
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                </Paragraph>
                                    </div>
                                </div>
                                : null
                        }
                        {
                            (!guatamalaCountry) ?
                                <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                                    <div className="col-lg-12">
                                        <InputHelperAssistant
                                            name="andStreet"
                                            value={address.andStreet}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.andStreet}
                                            maxLength={100}
                                            inputId='ycalle' nameInput='ycalle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.andStreet.label']} />
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                                </Paragraph>
                                    </div>
                                </div>
                                : null
                        }
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                            <div className="col-lg-12 pr-xl-0">
                                <InputHelperAssistant
                                    name="phoneWithLADA"
                                    value={address.phoneWithLADA}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.phoneWithLADA}
                                    field_valid={errors.phoneWithLADA}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={10}
                                    inputId='TeléfonoconLADA' nameInput='TeléfonoconLADA' labelPosition='right'   type="tel" labelText={staticLabelValues['pwa.checkoutBillingPage.PhoneNoWithCode.label']} required />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {errors.phoneWithLADA && staticLabelValues['pwa.checkoutBillingPage.emptyParticularPhone.errorMsg']}
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 mb-4">
                        <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                            <div className="col-lg-12 pl-xl-0">
                                <InputHelperAssistant
                                    name="cellphone"
                                    value={address.cellphone}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.cellphone}
                                    field_valid={errors.cellphone}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={10}
                                    containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                                    inputId='TeléfonoCelular'
                                    className="a-textField__input mdc-text-field__input"
                                    nameInput='TeléfonoCelular'
                                    labelText={staticLabelValues['pwa.checkoutBillingPage.celluler.label']}
                                    labelPosition='right'
                                    text='Ej. Tarjeta de crédito'
                                    helperTextId='helper1'
                                    
                                    
                                    type="tel" />
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                        </Paragraph>

                            </div>
                        </div>
                    </div>

                    {/*WeB End*/}
                    {/* Tab Start*/}
                    <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
                        <div className="col-6">
                            <div className="col-12 pl-0">
                                <MaterialSelect options={countriesListOptions}
                                    name="country"
                                    value={address.country}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.country}
                                    field_valid={errors.country}
                                    allowWhatEverLength={true}
                                    required />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="col-12 pr-0">
                                <InputHelperAssistant
                                    name="postalCode"
                                    value={address.postalCode}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handlePostalCodeBlur}
                                    field_focus={focused.postalCode}
                                    field_valid={errors.postalCode}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={5}
                                    inputId='CódigoPostal' nameInput='CódigoPostal' labelPosition='right'   type="tel" labelText={staticLabelValues['pwa.checkoutBillingPage.postalCode.text']} required />
                                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    {
                                         errors.postalCode && 
                                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                 {staticLabelValues['pwa.checkoutBillingPage.postalCode.required.text']}
                                            </Paragraph>
                                       
                                    }
                                </div>*/}
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
                        <div className="col-6">
                            <div className="col-12 pl-0">
                                <MaterialSelect options={stateListOptions}
                                    name="stateId"
                                    value={address.stateId}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.stateId}
                                    field_valid={errors.stateId}
                                    allowWhatEverLength={true}
                                    required />
                                    {/*<div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                        {errors.stateId && staticLabelValues['pwa.checkoutBillingPage.emptyState.errorMsg']}
                                        </Paragraph>
                                    </div>*/}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="col-12 pr-0">
                                <InputHelperAssistant
                                    name="city"
                                    value={address.city}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.city}
                                    field_valid={errors.city}
                                    maxLength={40}
                                    inputId='Ciudad' nameInput='Ciudad' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.city.label']} required />
                                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    {errors.city &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                             {staticLabelValues['pwa.checkoutBillingPage.emptyCity.errorMsg']}
                                    </Paragraph>
                                    }
                                </div>*/}
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
                        <div className="col-6">
                            {
                                (addressSearchErrorText)?
                                <div className="col-12 pl-0">
                                    <InputHelperAssistant 
                                    name="municipalityText"
                                    value={address.municipalityText}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.municipalityText}
                                    field_valid={errors.municipalityText}
                                    maxLength={100}
                                    inputId='municipalityText' nameInput='municipalityText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.municipality.label']} required
                                />
                                </div>
                            :
                            <div className="col-12 pl-0">
                                <MaterialSelect options={municipalityListOptions}
                                    name="municipality"
                                    value={address.municipality}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.municipality}
                                    field_valid={errors.municipality}
                                    maxLength={100}
                                    allowWhatEverLength={true}
                                    required />
                            </div>
                            }
                        </div>
                        <div className="col-6">
                            {
                                (addressSearchErrorText)?
                                <div className="col-12 pr-0">
                                    <InputHelperAssistant 
                                        name="colonyText"
                                        value={address.colonyText}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.colonyText}
                                        field_valid={errors.colonyText}
                                        maxLength={100}
                                        inputId='colonyText' nameInput='colonyText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.neighbourhood.label']} required
                                     />
                                </div>

                            :
                            
                            <div className="col-12 pr-0">
                                <MaterialSelect options={colonyListOptions}
                                    name="colony"
                                    value={address.colony}
                                    handleChange={this.handleOnSelectChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.colony}
                                    field_valid={errors.colony}
                                    maxLength={100}
                                    allowWhatEverLength={true}
                                    required />
                            </div>
                            }
                        </div>
                    </div>
                    <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
                        <div className="col-6">
                            <div className="col-12 pl-0">
                                <InputHelperAssistant
                                    name="street"
                                    value={address.street}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.street}
                                    field_valid={errors.street}
                                    maxLength={100}
                                    inputId='Calle' nameInput='Calle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.street.label']} required />
                                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    {errors.street &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                              {staticLabelValues['pwa.checkoutBillingPage.emptyStreet.errorMsg']}
                                        </Paragraph>
                                    }
                                </div>*/}
                            </div>
                        </div>
                        {
                            (!guatamalaCountry) ?
                                <div className="col-6 d-flex flex-row">
                                    <div className="col-6">
                                        <InputHelperAssistant
                                            name="noExt"
                                            value={address.noExt}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.noExt}
                                            field_valid={errors.noExt}
                                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                                            maxLength={10}
                                            inputId='NumExt' nameInput='NumExt' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.exteriorNumber.label']} required />
                                        {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                            {errors.noExt &&
                                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                    {staticLabelValues['pwa.checkoutBillingPage.emptyExtNumber.errorMsg']}
                                                </Paragraph>
                                            }
                                        </div>*/}
                                    </div>
                                    <div className="col-6 pr-0">
                                        <InputHelperAssistant
                                            name="noInt"
                                            value={address.noInt}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.noInt}
                                            maxLength={10}
                                            validationtype={"onlyNumbersWithCharactersWithSpace"}
                                            inputId='NumInt' nameInput='NumInt' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.interiorNumber.label']} required />
                                        {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        </Paragraph>*/}
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                    {
                        (!guatamalaCountry) ?
                            <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
                                <div className="col-6">
                                    <div className="col-12 pl-0">
                                        <InputHelperAssistant
                                            name="building"
                                            value={address.building}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.building}
                                            maxLength={100}
                                            inputId='Edificio' nameInput='Edificio' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.building.label']} required />
                                        {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        </Paragraph>*/}
                                    </div>
                                </div>
                            </div>
                            : null
                    }
                    <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
                        {
                            (!guatamalaCountry) ?
                                <div className="col-6">
                                    <div className="col-12 pl-0">
                                        <InputHelperAssistant
                                            name="betweenStreet"
                                            value={address.betweenStreet}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.betweenStreet}
                                            maxLength={100}
                                            inputId='Entrecalle' nameInput='Entrecalle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.betweenStreet.label']} required />
                                        {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        </Paragraph>*/}
                                    </div>
                                </div>
                                : null
                        }
                        {
                            (!guatamalaCountry) ?
                                <div className="col-6">
                                    <div className="col-12 pr-0">
                                        <InputHelperAssistant
                                            name="andStreet"
                                            value={address.andStreet}
                                            onChange={this.handleOnChange}
                                            onFocus={this.handleOnFocus}
                                            onBlur={this.handleBlur}
                                            field_focus={focused.andStreet}
                                            maxLength={100}
                                            inputId='ycalle' nameInput='ycalle' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.andStreet.label']} required />
                                        {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        </Paragraph>*/}
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                    <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 mb-2">
                        <div className="col-6 pr-0">
                            <div className="col-12 pl-0">
                                <InputHelperAssistant
                                    name="phoneWithLADA"
                                    value={address.phoneWithLADA}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.phoneWithLADA}
                                    field_valid={errors.phoneWithLADA}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={10}
                                    inputId='TeléfonoconLADA' nameInput='TeléfonoconLADA' labelPosition='right'   type="tel" labelText={staticLabelValues['pwa.checkoutBillingPage.PhoneNoWithCode.label']} required />
                                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    {errors.phoneWithLADA &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                             {staticLabelValues['pwa.checkoutBillingPage.emptyParticularPhone.errorMsg']}
                                    </Paragraph>
                                    }
                                </div>*/}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="col-12 pr-0">
                                <InputHelperAssistant
                                    name="cellphone"
                                    value={address.cellphone}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.cellphone}
                                    field_valid={errors.cellphone}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={10}
                                    inputId='TeléfonoCelular' nameInput='TeléfonoCelular' labelPosition='right'   type="tel" labelText={staticLabelValues['pwa.checkoutBillingPage.celluler.label']} required />
                                {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                </Paragraph>*/}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tab End*/}
            </React.Fragment>
        )
    }
}
/**
* Conveting object to array format.
* @function getStateArray
* @author dondapati.kumar@zensar.com
* @desc Converting state which are in object format to array format to show the list of states.
* @param {object} obj
* @return {array} states
* 
*/
const getStateArray = (obj) => {
    const states = []
    Object.keys(obj).map((key) => {
        states.push({
            name: obj[key].stateName,
            value: obj[key].stateId
        })
    });
    return states;
}