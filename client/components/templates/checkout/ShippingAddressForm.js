/**
  * Module Name : ShippingAddressForm Module
  * Functionality : Component used to show  show the from fields for shipping address. This is get called from \templates\checkout\CommonShippingPage.js and \templates\checkout\AddNewShippingAddress.js
  * @exports : ShippingAddressForm
  * @requires : module:React
  * @requires : module:/atoms/HeadLines/Headlines
  * @requires : module:/molecules/MaterialInputCheckBox/material_defaultaddress_checkbox
  * @requires : module:/atoms/Paragraph/Paragraph
  * @requires : module:/molecules/MaterialInputText/MaterialInputText
  * @requires : module:/molecules/MaterialSelect/MaterialSelect
  * @requires : module:/helpers/utilities/Validate
  * @requires : module:/helpers/utilities/utility
  * @requires : module:/helpers/config/config
  * Team : Checkout Team
  * Other information : Dynamically showing form fields based on country selection and zip code.
  * 
  */
import React from 'react';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/material_defaultaddress_checkbox';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { Validate } from '../../../helpers/utilities/Validate';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
// import { PRICEFILTER_VALIDATION, MIN_TALLA_COUNT } from '../../../../client/config/constants';

/**
* @class ShippingAddressForm
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class ShippingAddressForm extends React.Component {
    /**
     * constructor
     * @author dondapati.kumar@zensar.com
     * @desc receiving prop values from the parent module. And adding state values.
     * @param {object} props
     * 
     */
    constructor(props) {
        super(props);
        const editAddress = props.editAddress || {};
        const previousSelection = props.manualClick === false && props.previousSelection || {};
        const addressRecords = props.addressRecords || [];
        let cellular,LADA='',phone='';

        if(previousSelection.country === "Guatemala" && previousSelection.phoneNumber){
            cellular = previousSelection.phoneNumber.split('-').join('');
            cellular = cellular.substring(2);
        }else if(editAddress.country === 'GT' && editAddress.phoneNumber){
            cellular = editAddress.phoneNumber.split('-').join('');
            cellular = cellular.substring(2);
        }else{
            cellular = editAddress.cellular || (previousSelection.mobilePhoneNumber || "");
        }
        let ladaPhone = (editAddress && editAddress.phoneNumber) ? editAddress.phoneNumber : ((previousSelection && previousSelection.phoneNumber) ? previousSelection.phoneNumber : "");
        if(ladaPhone && ladaPhone.length>0){
            const _phoneNumber = ladaPhone.split('-').join('');
            const index = ladaPhone.indexOf('-') === 3 ? 3 : 2;
            LADA = _phoneNumber.substring(0,index);
            phone = _phoneNumber.substring(index,10);
        }
        let countryArray =[{ name: "México", value: "MX" } ]
        if(props.GuatemalaEnableFlag ==='undefined' || (typeof props.GuatemalaEnableFlag ==='boolean' && props.GuatemalaEnableFlag)){
            countryArray.push({ name: "Guatemala", value: "GT" });
        }
        const country = editAddress.country || (this.props.guest_hide_telephone_lada ? "GT" : "MX");
        this.state = {
            labels: this.props.labels || {},
            address: (this.props.carryAddress && Object.keys(this.props.carryAddress).length >0) ? this.props.carryAddress : {
                country,
                postalCode: editAddress.postalCode || previousSelection.postalCode || "",
                stateId: editAddress.stateId  || (previousSelection.state || ""),
                city: editAddress.city || previousSelection.city || "",
                municipality: editAddress.delegationMunicipalityId || previousSelection.delegationMunicipalityId || "",
                // colonyText: previousSelection.country === "Guatemala" ?  (previousSelection.colony || "") : (editAddress.neighbourhood || ""),
                // municipalityText: previousSelection.country === "Guatemala" ? (previousSelection.deligation || "") : (editAddress.delegationMunicipality || ""),
                colonyText: previousSelection.colony || (editAddress.neighbourhood || ""),
                municipalityText: previousSelection.deligation || (editAddress.delegationMunicipality || ""),
                departamentName: previousSelection.country === "Guatemala" ?  previousSelection.state : editAddress.state,
                colony: (previousSelection.country !== "Guatemala" && previousSelection.colonyId==='-2') || (editAddress.country !== "GT" && editAddress.neighborhoodId==='-2') ? 'other' : (editAddress.neighborhoodId || previousSelection.colonyId || ""),
                otherColony: (previousSelection.country !== "Guatemala" && previousSelection.colonyId==='-2') || (editAddress.country !== "GT" && editAddress.neighborhoodId==='-2') ? (editAddress.neighbourhood || previousSelection.colony) : "",
                street: editAddress.address1 || previousSelection.street || "",
                noExt: editAddress.exteriorNumber || previousSelection.exteriorNumber || "",
                noInt: editAddress.country ? (editAddress.interiorNumber!== " " ? (editAddress.interiorNumber || "") : "") : (previousSelection.interiorNumber!== " " ? (previousSelection.interiorNumber || "") : ""),
                building: editAddress.country ? (editAddress.building!== " " ? (editAddress.building || "") : "") : (previousSelection.building!== " " ? (previousSelection.building || "") : ""),
                betweenStreet: editAddress.country ? (editAddress.address3!== " " ? (editAddress.address3 || "") : "") : (previousSelection.address3!== " " ? (previousSelection.address3 || "") : ""),
                andStreet: editAddress.country ? (editAddress.address2!== " " ? (editAddress.address2 || "") : "") : (previousSelection.address2!== " " ? (previousSelection.address2 || "") : ""),
                // phoneWithLADA: (editAddress.phoneNumber && editAddress.phoneNumber.split('-')[0] + '' + editAddress.phoneNumber.split('-')[1]) || (previousSelection.phoneNumber && previousSelection.phoneNumber.split('-')[0] + '' + previousSelection.phoneNumber.split('-')[1]) || "",
                LADA,
                phone,
                cellphone: (cellular && cellular!== " " && cellular.length > 0) ? cellular : "",
                isDefault: (editAddress.addressId && (props.defaultShippingAddressId === editAddress.addressId)) ? true : ((addressRecords && addressRecords.length === 0) ? true : false),
                guatemalanumber: editAddress.country === "GT" ? editAddress.exteriorNumber : (previousSelection.country === "Guatemala" ?  previousSelection.exteriorNumber : ""),
                departament: ''
            },
            editAddress: editAddress,
            previousSelection: previousSelection,
            focused: {

            },
            errors: {

            },
            countriesList: countryArray,
            municipalityList: [],
            neighbourhoodList: [],
            settlementList: [],
            stateList: props.states || [],
            guatemalaStates: [],
            states: props.states || [],
            addressSearchErrorText: '',
            invalidCPCode: country === 'MX' ? null : false
        }
    }

    /**
     * Carrying given address details
     * @function carryAddressMethod
     * @author dondapati.kumar@zensar.com
     * @desc carrying given address details added by the guest user to making REST full service call along with user information.
     * 
     */
    carryAddressMethod = () => {
        return this.state.address;
    }

    /**
     * Dynamic validation based on the country/zip selection.
     * @function validateForm
     * @author dondapati.kumar@zensar.com
     * @desc Dynamic validation based on the country/zip selection. validating form fields, Showing proper message to the required field if not enter.
     * @returns return address details if form is valid.
     * 
     */
    validateForm = () => {
        return new Promise((resolve, reject) => {

            const { address, municipalityList, neighbourhoodList, settlementList, stateList, addressSearchErrorText, invalidCPCode  } = this.state;
            var errors = {};
            const colony = settlementList.filter(obj=>obj.value===address.colony);
            if(!address.country){ errors.country = true; }
            if(!address.postalCode || address.postalCode.length!==5){ errors.postalCode = true; }
            if(!address.street){ errors.street = true; }

            if(address.country !== 'GT'){
                if(!address.stateId){ errors.stateId = true; }
                if(!address.city){ errors.city = true; }
                if(!address.noExt){ errors.noExt = true; }
            }else{
                if(!address.departament){ errors.departament = true; }
                if(!address.guatemalanumber){ errors.guatemalanumber = true; }
                if(!address.cellphone){ errors.cellphone = true; }
            }

            if(address.country !== 'GT' && invalidCPCode !== true){
                if(!address.municipality){ errors.municipality = true; }
                if(!address.colony || colony.length===0){ errors.colony = true; }
                if(address.colony === 'other' && (!address.otherColony || address.otherColony.length ===0) ){ errors.otherColony = true; }
            }else{
                if(!address.municipalityText){ errors.municipalityText = true; }
                if(!address.colonyText){ errors.colonyText = true; }
            }

            if (this.props.loggedInUser && address.country !== 'GT') {
                // if (!address.phoneWithLADA || !Validate.testLength(address.phoneWithLADA, 10)) { errors.phoneWithLADA = true; }
                if (!address.phone || address.phone.length < 7) { errors.phone = true; }
                if (!address.LADA || address.LADA.length < 2 ) { errors.LADA = true; }
                if((address.phone.length === 8 || address.phone.length === 7) && !Validate.testLength(address.LADA, (address.phone.length===8 ? 2 : 3))){
                    errors.LADA = true;
                }
                if((address.LADA.length === 2 || address.LADA.length === 3) && !Validate.testLength(address.phone, (address.LADA.length===3 ? 7 : 8))){
                    errors.phone = true;
                }
            }
            if (Object.keys(errors).length === 0) {
                if (address.country !== 'GT') {
                    const municipality = municipalityList.filter(obj => obj.value === address.municipality);
                    address.delegationMunicipality = (municipality && municipality[0]) ? municipality[0].name : "";
                    address.delegationMunicipalityId = (municipality && municipality[0]) ? municipality[0].value : "";
                    // const neighbourhood = neighbourhoodList.filter(obj=>obj.value===address.municipality);
                    // address.neighbourhood = neighbourhood ? neighbourhood.name : "";

                    address.colonyName = (colony && colony[0]) ? colony[0].name : "";

                    const state = stateList.filter(obj => obj.value === address.stateId);
                    address.stateName = (state && state[0]) ? state[0].name : "";
                } else {
                    address.delegationMunicipality = address.municipalityText;
                    address.colonyName = address.colonyText;
                    address.stateName = address.departament;
                    address.city = "Guatemala Ciudad";
                    address.exteriorNumber = address.guatemalanumber;
                    address.stateId = '-2';
                    address.delegationMunicipalityId = '-2';
                    address.neighborhoodId = '-2';
                }

                if(address.country !== 'GT' && invalidCPCode === true){
                    address.delegationMunicipality = address.municipalityText;
                    address.delegationMunicipalityId = '';
                    address.colonyName = address.colonyText;
                    address.neighborhoodId = '';
                }

                if (this.props.loggedInUser) {
                    // address.businessPhoneCode = address.phoneWithLADA.substring(0, 3);
                    // address.businessPhoneNumber = address.phoneWithLADA.substring(3);
                    address.businessPhoneCode = address.LADA;
                    address.businessPhoneNumber = address.phone;
                }
                this.setState({ errors: {} });
                return resolve(address);
            } else {
                this.setState({ errors });
                return reject({address: false});
            }

        });
    }

    /**
    * REACT life cycle Event. This will get fire when ever component Will Receive Props
    * @event componentDidMount
    * @desc Calling methods for countries, guatemala states and searching address by postal code.
    */
    componentDidMount() {
        this.getCountries();
        if (this.state.editAddress.country === "GT" || this.state.previousSelection.country === "Guatemala" || this.props.guest_hide_telephone_lada) {
            this.getGuatemalaStates();
        }
        if (this.state.address.postalCode && this.state.editAddress.country !== "GT" && this.state.previousSelection.country !== "Guatemala") {
            this.addresssearch(this.state.address.postalCode);
        }
    }

    /**
     * Fetching countries list
     * @function getCountries
     * @author dondapati.kumar@zensar.com
     * @desc Making a service call to get countries list. And making first country as default selected country.
     * 
     */
    getCountries = () => {
        const { labels, address, countriesList } = this.state;
        // Utility(Path.getcountry, 'POST',{}).then(response => {
        //     if(response.status===200 && response.data){
        //         let countriesList = [];
        //         countriesList = Object.keys(response.data).map(key=>{
        //             const obj = response.data[key];
        //             const value = Object.keys(obj)[0];
        //             const name = obj[value];
        //             return {name,value}
        //         })
        if (this.props.manualClick === false && this.props.previousSelection && this.props.previousSelection.country) {
            let country = []
            country = countriesList.filter(country => country.name === this.props.previousSelection.country);
            if (country.length === 0) {
                country = countriesList;
            }
            if (country && country[0] && country[0].value) {
                address.country = country[0].value
            }
        }
        this.setState({ countriesList, address });
        //     }
        // },(error)=>{
        //     console.log("Error ==== :: ",error);
        // });
    }


    /**
     * Calling guatemala states if the selected country is Guatemala.
     * @function handleOnCountryChange
     * @author dondapati.kumar@zensar.com
     * @desc Method will call when user change country. Calling guatemala states if the selected country is Guatemala.
     * 
     */
    handleOnCountryChange = (value, e) => {
        if (e.target.value && e.target.value === 'GT') {
            this.getGuatemalaStates();
            const { errors } = this.state;
            errors.postalCode = false;
            this.setState({ errors, addressSearchErrorText: '' });
            // const { countriesList } = this.state;
            // if (Object.keys(countriesList[0]).length === 0) {
            //     countriesList.splice(0, 1);
            // }
            // this.setState({countriesList})
        }else{
            const { address } = this.state;
            address.city = address.city === "Guatemala Ciudad" ? "" : address.city;
            address.cellphone = address.cellphone.length!==10 ? "" : address.cellphone;
            this.setState({address})
        }
        this.props.handleOnCountryChange(e.target.value);
        if (this.state.address.postalCode && e.target.value !== 'GT') {
            this.addresssearch(this.state.address.postalCode, true);
        }
        this.handleOnSelectChange(value, e)
    }

    /**
     * Making RESTfull service call to get guatemala states.
     * @function getGuatemalaStates
     * @author dondapati.kumar@zensar.com
     * @desc Making RESTfull service call to get guatemala states. And showing first state as default.
     * 
     */
    getGuatemalaStates = () => {
        const { labels, address, errors } = this.state;
        address.cellphone = address.cellphone.length <= 8 ? address.cellphone : "";
        Utility(Path.guatemalaStates, 'GET').then(response => {
            if (response.status === 200 && response.data) {
                const guatemalaStates = response.data.map(item => ({ name: item, value: item }))
                const { editAddress , previousSelection } = this.props;
                if(previousSelection && previousSelection.country === "Guatemala"){
                    const previousDepartment = guatemalaStates.filter(dept=> dept.name === address.departamentName)
                    address.departament = (previousDepartment && previousDepartment[0]) && previousDepartment[0].value;
                }else if(editAddress && editAddress.country && this.props.editAddress.country === "GT"){
                    address.departament = address.departamentName;
                }else{
                    address.departament = (guatemalaStates && guatemalaStates[0]) && guatemalaStates[0].value;
                }
                errors.departament = false;
                this.setState({ guatemalaStates, address, errors })
            }else{
                this.props.error_scenario(response);
            }
        }, (error) => {
            // console.log("Error ==== :: ", error);
        });
    }

    /**
     * Method will fire on select type change
     * @function handleOnSelectChange
     * @author dondapati.kumar@zensar.com
     * @desc Method will call if any select value changed.
     * @param seleted value, element
     * @param {string} value
     * @param {object} e
     * 
     */
    handleOnSelectChange = (value, e) => {
        this.handleOnChange(e);
    }

    /**
     * This is the default onchange method.
     * @function handleOnChange
     * @author dondapati.kumar@zensar.com
     * @desc This is the default onchange method. What ever value added by the user setting to the state by validating that.
     * @param {object} e
     * 
     */
    handleOnChange = (e) => {
        const { address, errors } = this.state;
        e.persist();
        let newPostalCode = true;
        this.setState(function (prevState) {
            const pre_value = prevState.address[e.target.name];
            const correct_value = Validate.validation(e, pre_value);
            if(e.target.name === 'postalCode' && pre_value === correct_value){
                newPostalCode = false;
            }
            address[e.target.name] = correct_value;
            errors[e.target.name] = false;
            return { address, errors }
        },()=>{
            if(newPostalCode && e.target.name === 'postalCode'){
                this.handlePostalCodeChange()
            }
        })
    }

    /**
     * Method will call when postal code changed.
     * @function handlePostalCodeChange
     * @author dondapati.kumar@zensar.com
     * @desc Method will call when postal code changed. Showing an alert if given postal code is 00000. Otherwise making a REST full service call for the address search.
     * @param {object} e
     * 
     */
    handlePostalCodeChange = () => {
        const { address, errors } = this.state;
        if(address.postalCode){
            if(address.country !== 'GT' && address.postalCode.length === 5){
                if(address.postalCode === '00000'){
                    setTimeout(()=>{
                        address.postalCode = '';
                        errors.postalCode = true;
                        this.setState({address, errors},()=>{
                            // this.props.show_alert('El Código Postal es incorrecto.');
                        });
                    },200)
                    // this.setState({addressSearchErrorText: 'El Código Postal es incorrecto.'});
                }else{
                    // this.setState({addressSearchErrorText: ''});
                    this.addresssearch(address.postalCode,true)
                }
            }
        }
    }

    /**
     * Handling field Focus.
     * @function handleOnFocus
     * @author dondapati.kumar@zensar.com
     * @desc handling field Focus. showing proper errors and validating the given input value.
     * @param {object} e
     * 
     */
    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }

    /**
     * Validation for zip code
     * @function validateZipCode
     * @author dondapati.kumar@zensar.com
     * @desc Showing an error if postal code is more than 5 digits.
     * @param {string} PostalCode
     * 
     */
    validateZipCode = (PostalCode) => {
        // let errorMessage = '';
        const { errors } = this.state;
        if(PostalCode && PostalCode.length !== 5){
            errors.postalCode = true;
            this.setState({errors});
            // this.props.show_alert('El Código Postal debe ser de 5 dígitos');
            // errorMessage = 'El Código Postal debe ser de 5 dígitos';
        }else if(!PostalCode){
            errors.postalCode = true;
            this.setState({errors});
        }
        // this.setState({
        //     addressSearchErrorText: errorMessage
        // });
    }

    /**
     * Making a RESTful service call
     * @function addresssearch
     * @author dondapati.kumar@zensar.com
     * @desc Based on valid postal code making a RESTful service call for fetching municipalityList, neighbourhoodList, settlementList and stateList.
     * @param {string} PostalCode
     * @param {boolean} fieldBlur
     * 
     */ 
    addresssearch = (PostalCode, fieldBlur) => {
        if(PostalCode && PostalCode.length === 5){
            // service addresssearch change GET from POST method :: Start    
            let payLoad = '?action=EMA&cp=' + PostalCode;
            Utility(Path.addresssearch + payLoad, 'GET').then(response => {
    		// service addresssearch change GET from POST method :: End                
                let { address, editAddress, labels, errors, states, addressSearchErrorText,invalidCPCode, stateList, municipalityList,settlementList } = this.state;
                    // addressSearchErrorText = "";
                if (response && response.data && response.data.s === '1') {
                    // addressSearchErrorText = response.data.err;
                    this.props.show_alert("No se obtuvieron datos.");
                    if(PostalCode==='00000'){
                        address.postalCode = '';
                    }
                    if(address.colony === 'other'){
                        address.colony = '';
                    }
                    stateList = states;
                    // if(address.stateId){
                    //     const state = states.filter(obj=>obj.value === address.stateId);
                    //     address.stateId = (state && state[0] && state[0].value) || states[0].value;
                    // }else 
                    if(!address.stateId && address.stateName){
                        const state = states.filter(obj=>obj.name === address.stateName);
                        address.stateId = state && state[0] && state[0].value;
                    }else if(!address.stateId){
                        address.stateId = states[0].value;
                    }
                    this.setState({
                        // addressSearchErrorText
                        address,
                        invalidCPCode: true,
                        stateList
                    });
                }else if (response && response.data && response.data.s === '0') {
                    addressSearchErrorText = '';
                    invalidCPCode = false
                    const { municipality, neighbourhood, settlement, state } = (response && response.data && response.data.addrSearchResponse) || {};

                    const municipalityList = municipality && municipality.map(str => {
                        str = str.split(':');
                        return { name: str[1], value: str[0] };
                    }) || [];

                    const neighbourhoodList = neighbourhood && neighbourhood.map(str => {
                        str = str.split(':');
                        return { name: str[1], value: str[0] };
                    }) || [];

                    const settlementList = settlement && settlement.map(str => {
                        str = str.split(':');
                        return { name: str[1], value: str[0] };
                    }) || [];

                    const stateList = state && state.map(str => {
                        str = str.split(':');
                        return { name: str[1], value: str[0] };
                    }) || states;

                    if (fieldBlur) {
                        address.stateId = stateList.length > 0 ? stateList[0].value : '';
                        address.municipality = municipalityList.length > 0 ? municipalityList[0].value : '';
                        address.colony = settlementList.length > 0 ? settlementList[0].value : '';
                    }
                    const { previousSelection } = this.props;
                    if (!fieldBlur && this.props.manualClick === false && previousSelection && previousSelection.postalCode) {
                        const stateObj = stateList.filter(state => state.name === previousSelection.state)[0];
                        if (stateObj && stateObj.name) {
                            address.stateId = stateObj.value
                        }
                        address.municipality = previousSelection.delegationMunicipalityId || '';
                        address.colony = (previousSelection.country !== "Guatemala" && previousSelection.colonyId==='-2') ? 'other' : (previousSelection.colonyId || '');
                    }

                    if(!fieldBlur && this.state.editAddress && this.state.editAddress.delegationMunicipality){
                        const municipalityObj = municipalityList.filter(state => state.name === this.state.editAddress.delegationMunicipality);
                        address.municipality = municipalityObj && municipalityObj.length>0 ? municipalityObj[0].value : address.municipality;
                    }

                    const selectedState = stateList.filter(obj => obj.value === address.stateId);
                    if (selectedState.length === 0 || !address.stateId) {
                        address.stateId = stateList.length > 0 ? stateList[0].value : '';
                    }

                    if (address.stateId) errors.stateId = false;
                    if (address.municipality) errors.municipality = false;
                    if (address.colony) errors.colony = false;
                    address.colonyText = "";
                    address.municipalityText = "";
                    this.setState({
                        municipalityList,
                        neighbourhoodList,
                        settlementList,
                        stateList,
                        address,
                        errors,
                        addressSearchErrorText,
                        invalidCPCode
                    });
                }
            }, (error) => {
                // console.log("Error ==== :: ", error);
            });
        }else{
            // this.validateZipCode(PostalCode);
            // let {addressSearchErrorText} = this.state;
            // let errorMessage = 'El Código Postal es incorrecto';
            // if(PostalCode.length !== 5){
            //     errorMessage = 'El Código Postal debe ser de 5 dígitos';
            // }else{
            //     errorMessage = '';
            // }
            // this.setState({
            //     addressSearchErrorText: errorMessage
            // });
        }
    }

    /**
     * handle On Postal Code Field Blur
     * @function handlePostalCodeBlur
     * @author dondapati.kumar@zensar.com
     * @desc On postal code change calling method to feach estimated delivery date of cart items.
     * @param {object} e
     * 
     */
   
    handlePostalCodeBlur = (e) => {
        this.handleBlur(e);
        // const { address, errors } = this.state;
        this.validateZipCode(e.target.value);
        if(e.target.value && e.target.value!== '00000' && e.target.value.length === 5){
            this.props.check_estimateddeliverydate(e.target.value);
        }
        // if(e.target.value){
            // if(e.target.value.length !== 5){
            //     errors.postalCode = true;
            //     this.setState({errors})
            // }else{
                // if(!(this.props.editAddress && this.props.editAddress.country)){
                //     this.props.check_estimateddeliverydate(e.target.value);
                // }
                // if(address.country !== 'GT'){
                //     this.addresssearch(e.target.value,true)
                // }
            //}
        // }
    }
    /**
     * handle On Blur
     * @function handleBlur
     * @author dondapati.kumar@zensar.com
     * @desc handling field blur. showing proper errors and validating the given input value.
     * @param {object} e
     * 
     */
    handleBlur = (e) => {
        const { focused, address, errors } = this.state;
        focused[e.target.name] = false;
        if (!address[e.target.name] && e.target.required) {
            errors[e.target.name] = true;
        } else if (e.target.name === 'LADA' || e.target.name === 'phone') {
            if(address.phone.length === 8 || address.phone.length === 7){
                errors.LADA = !Validate.testLength(address.LADA, (address.phone.length===8 ? 2 : 3));
            }else{
                errors.LADA = address.LADA.length < 2 ? true : false
            }
            if(address.LADA.length === 2 || address.LADA.length === 3){
                errors.phone = !Validate.testLength(address.phone, (address.LADA.length===3 ? 7 : 8));
            }else{
                errors.phone = address.phone.length < 7 ? true : false
            }
            // errors.LADA = !Validate.testLength(e.target.value, 2);
            // errors.phone = !Validate.testLength(e.target.value, 8);
        } else {
            errors[e.target.name] = false;
        }
        this.setState({ focused, errors });
    }

    /**
     * Handling default address checkbox status
     * @function handleCheckboxChange
     * @author dondapati.kumar@zensar.com
     * @desc handling default address checkbox status and setting to the state.
     * @param {object} e
     * 
     */
    handleCheckboxChange = (e) => {
        const { address } = this.state;
        address.isDefault = e.target.checked
        this.setState({ address })
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render() {
        const { address, errors, focused, municipalityList, neighbourhoodList, settlementList, stateList, countriesList, labels, guatemalaStates, invalidCPCode } = this.state;
        let {addressSearchErrorText} = this.state;
        if(errors.postalCode){
            addressSearchErrorText = "";
        }
        if (settlementList.length === 0 || (settlementList[0] && settlementList[0].value !== 'other')) {
            settlementList.unshift({ name: labels["pwa.addressFormPage.otherneighbourhood.label"], value: 'other' });
        }

        let stateListOptions = { labelText: labels["pwa.addressFormPage.state.label"], labelId: 'validity', selected: true, optionList: stateList };
        let colonyListOptions = { labelText: labels["pwa.checkoutShippingPage.neighbourhood.label"], labelId: 'validity', selected: true, optionList: settlementList };
        let municipalityListOptions = { labelText: labels["pwa.addressFormPage.delegationOfMuncipality.text"], labelId: 'validity', selected: true, optionList: municipalityList };
        let countriesListOptions = { labelText: labels["pwa.addressFormPage.country.label"], labelId: 'validity', selected: true, optionList: countriesList };
        let departamentosOptions = { labelText: (labels["pwa.addressFormPage.departamentos.label"] || "Departamentos"), labelId: 'validity', selected: true, optionList: guatemalaStates };
        // console.log("countriesList.......... ::: ",countriesList);
        return (
            <React.Fragment>
                <div className="row align-items-start">
                    <div className="col-xl-4 col-lg-6 col-12">
                        <MaterialSelect
                            allowWhatEverLength={true}
                            options={countriesListOptions}
                            name="country"
                            value={address.country}
                            handleChange={this.handleOnCountryChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.country}
                            field_valid={errors.country}
                            required
                        />
                        <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                {errors.country && (labels["pwa.addressFormPage.emptyCountry.label"] || "El País es requerido.")}
                            </Paragraph>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-12">
                        <InputHelperAssistant
                            name="postalCode"
                            value={address.postalCode}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handlePostalCodeBlur}
                            field_focus={focused.postalCode}
                            field_valid={ (address.postalCode && address.postalCode.length!== 5 && !focused.postalCode) || (address.country==='MX' && address.postalCode==='00000') || errors.postalCode}
                            type="tel"
                            required
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={5}
                            labelText={ labels["pwa.addressFormPage.postalcodeInfo.label"] || "Código Postal"} />

                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            {/*{
                                (address.postalCode==='00000')?
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                        {'El Código Postal es incorrecto.'}
                                    </Paragraph>
                                :*/}
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                        {errors.postalCode && ( (address.postalCode && address.postalCode.length!== 5) ? (labels["pwa.addressFormPage.invalidPostalCode.errorMsg"] || 'El Código Postal debe ser de 5 dígitos') : labels["pwa.addressFormPage.emptyPostalCode.errorMsg"])}
                                    </Paragraph>
                            {/*}*/}

                        </div>
                    </div>

                    {address.country === 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <MaterialSelect
                                allowWhatEverLength={true}
                                options={departamentosOptions}
                                name="departament"
                                value={address.departament}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.departament}
                                field_valid={errors.departament}
                                error_message="Error Estado"
                                required
                            />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                    {errors.departament && (labels["pwa.addressFormPage.emptydepartamentos.label"] || "El Departamentos es requerido.")}
                                </Paragraph>
                            </div>
                        </div>
                    }

                    {
                        address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <MaterialSelect options={stateListOptions}
                                name="stateId"
                                allowWhatEverLength={true}
                                value={address.stateId}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.stateId}
                                field_valid={errors.stateId}
                                error_message={labels["pwa.addressFormPage.emptyState.errorMsg"]}
                                required
                            />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                    {errors.stateId && (labels["pwa.addressFormPage.emptyState.errorMsg"])}
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="city"
                                value={address.city}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.city}
                                field_valid={errors.city}
                                maxLength={40}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text" required
                                labelText={labels["pwa.addressFormPage.city.label"]} />

                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                    {errors.city && labels["pwa.addressFormPage.emptyCity.errorMsg"]}
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        (address.country !== 'GT' && invalidCPCode !== true) &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <MaterialSelect options={municipalityListOptions}
                                name="municipality"
                                allowWhatEverLength={true}
                                value={address.municipality}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.municipality}
                                field_valid={errors.municipality}
                                error_message={labels["pwa.addressFormPage.emptyMunicipality.errorMsg"]}
                                required
                            />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                    {errors.municipality && (labels["pwa.addressFormPage.emptyMunicipality.errorMsg"])}
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        (address.country === 'GT' || invalidCPCode === true) &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="municipalityText"
                                value={address.municipalityText}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.municipalityText}
                                field_valid={errors.municipalityText}
                                maxLength={100}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text" required
                                labelText={"Municipio"} />
                                {/*labels["pwa.addressFormPage.delegationOfMuncipality.text"]*/}

                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                    {errors.municipalityText && labels["pwa.addressFormPage.emptyMunicipality.errorMsg"]}
                                </Paragraph>
                            </div>
                        </div>
                    }

                    {
                        (address.country !== 'GT'  && invalidCPCode !== true) &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <MaterialSelect options={colonyListOptions}
                                name="colony"
                                allowWhatEverLength={true}
                                value={address.colony}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.colony}
                                field_valid={errors.colony}
                                error_message={labels["pwa.addressFormPage.emptyColony.errorMsg"]}
                                required
                            />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                    {errors.colony && (labels["pwa.addressFormPage.emptyColony.errorMsg"])}
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        address.country !== 'GT' && address.colony === 'other' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="otherColony"
                                value={address.otherColony}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.otherColony}
                                field_valid={errors.otherColony}
                                maxLength={100}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text" required
                                labelText={labels["pwa.addressFormPage.otherColony.label"]} />
                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                                    {errors.otherColony && labels["pwa.addressFormPage.emptyOtherColony.errorMsg"]}
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        (address.country === 'GT'  || invalidCPCode === true) &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="colonyText"
                                value={address.colonyText}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.colonyText}
                                field_valid={errors.colonyText}
                                maxLength={100}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text" required
                                labelText={labels["pwa.addressFormPage.neighbourhood.label"]} />
                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                                    {errors.colonyText && labels["pwa.addressFormPage.emptyColony.errorMsg"]}
                                </Paragraph>
                            </div>
                        </div>
                    }
                    <div className="col-xl-4 col-lg-6 col-12">
                        <InputHelperAssistant
                            name="street"
                            value={address.street}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.street}
                            field_valid={errors.street}
                            maxLength={100}
                            inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text" required
                            labelText={labels["pwa.addressFormPage.street.label"]} />

                        <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                                {errors.street && labels["pwa.addressFormPage.emptyStreet.errorMsg"]}
                            </Paragraph>
                        </div>
                    </div>
                    {
                        address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <div className="row">
                                <div className="col-12 col-lg-6">
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
                                        type="text"
                                        required
                                        labelText={"Núm. Ext."} />
                                        {/*labelText={labels["pwa.addressFormPage.externalNum.label"]}*/}

                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                                            {errors.noExt && labels["pwa.addressFormPage.emptyExtNumber.errorMsg"]}
                                        </Paragraph>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <InputHelperAssistant
                                        name="noInt"
                                        value={address.noInt}
                                        onChange={this.handleOnChange}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleBlur}
                                        field_focus={focused.noInt}
                                        validationtype={"onlyNumbersWithCharactersWithSpace"}
                                        maxLength={10}
                                        type="text"
                                        labelText={"Núm. Int."} />
                                        {/*labelText={labels["pwa.addressFormPage.internalNum.label"]}*/}

                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-telefonoCelular"><font><font>{labels["pwa.checkoutShippingPage.optional.text"]}
                                        </font></font>
                                        </Paragraph>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="building"
                                value={address.building}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.building}
                                maxLength={100}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text"
                                labelText={labels["pwa.addressFormPage.building.label"]} />
                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-telefonoCelular"><font><font>{labels["pwa.checkoutShippingPage.optional.text"]}
                                </font></font>
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="betweenStreet"
                                value={address.betweenStreet}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.betweenStreet}
                                maxLength={100}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text"
                                labelText={labels["pwa.addressFormPage.betweenStreet1.label"] || "Entre calle"} />
                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-telefonoCelular"><font><font>{labels["pwa.checkoutShippingPage.optional.text"]}
                                </font></font>
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {
                        address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="andStreet"
                                value={address.andStreet}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.andStreet}
                                maxLength={100}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'   type="text"
                                labelText={labels["pwa.addressFormPage.andstreet.label"] || "y calle"} />
                                {/*labels["pwa.addressFormPage.andstreet.label"]*/}
                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-telefonoCelular"><font><font>{labels["pwa.checkoutShippingPage.optional.text"]}
                                </font></font>
                                </Paragraph>
                            </div>
                        </div>
                    }
                    {this.props.loggedInUser && address.country !== 'GT' &&
                        <React.Fragment>
                            <div className="col-xl-2 col-lg-2 col-4">
                                <InputHelperAssistant
                                    name="LADA"
                                    value={address.LADA}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.LADA}
                                    field_valid={errors.LADA || (address.LADA && !focused.phone && (
                                        (address.phone.length===7 && address.LADA.length !== 3) ||
                                        (address.phone.length===8 && address.LADA.length !== 2) ||
                                        (address.LADA.length < 2)
                                    ))}
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={address.phone.length===8 ? 2 : 3}
                                    type="tel"
                                    required
                                    labelText={labels["pwa.checkoutShippingPage.ladaPhone.label"] || "LADA"} />

                                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                                {(errors.LADA || (address.LADA && !focused.phone && (
                                                    (address.phone.length===7 && address.LADA.length !== 3) ||
                                                    (address.phone.length===8 && address.LADA.length !== 2) ||
                                                    (address.LADA.length < 2)
                                                ))) && labels["pwa.checkoutShippingPage.emptyPhoneCode.errorMsg"]}
                                            </Paragraph>
                                    </div>

                            </div>
                            <div className="col-xl-2 col-lg-2 col-8">
                                <InputHelperAssistant
                                    value={address.phone}
                                    onChange={this.handleOnChange}
                                    onFocus={this.handleOnFocus}
                                    onBlur={this.handleBlur}
                                    field_focus={focused.phone}
                                    field_valid={errors.phone || (!focused.phone && address.phone && (
                                        (address.LADA.length===2 && address.phone.length !== 8) ||
                                        (address.LADA.length===3 && address.phone.length !== 7) ||
                                        (address.phone.length < 7)
                                    )) }
                                    validationtype={"onlyNumbersWithMaxLength"}
                                    maxLength={address.LADA.length===3 ? 7 : 8}
                                    name="phone"
                                    inputId='teléfono'
                                    nameInput='teléfono'
                                    labelText={labels["pwa.checkoutShippingPage.particularPhone.label"] || "Teléfono"}
                                    labelPosition='left'
                                    text='Ej. Casa, Oficina...'
                                    helperTextId='helper-Teléfono'
                                    
                                    
                                    type="tel"
                                    required
                                />
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    { !(!focused.phone && address.phone && (
                                        (address.LADA.length===2 && address.phone.length !== 8) ||
                                        (address.LADA.length===3 && address.phone.length !== 7) ||
                                        (address.phone.length < 7)
                                    )) && !errors.phone &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {(address.LADA.length===3) ? "7 digitos" : labels["pwa.checkoutShippingPage.digits8.label"]}
                                        </Paragraph>
                                    }
                                    { !address.phone && errors.phone &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {labels["pwa.checkoutShippingPage.phonerequired.label"] || "El teléfono es requerido"}
                                        </Paragraph>
                                    }
                                    { !focused.phone && address.phone && (
                                        (address.LADA.length===2 && address.phone.length !== 8) ||
                                        (address.LADA.length===3 && address.phone.length !== 7) ||
                                        (address.phone.length < 7)
                                    ) &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {labels["pwa.addressFormPage.invalidTelephoneNum.errorMsg"]}
                                        </Paragraph>
                                    }
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    
                    {/*{this.props.loggedInUser && address.country !== 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="phoneWithLADA"
                                value={address.phoneWithLADA}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.phoneWithLADA}
                                field_valid={errors.phoneWithLADA || (!focused.phoneWithLADA && address.phoneWithLADA && address.phoneWithLADA.length !== 10)}
                                validationtype={"onlyNumbersWithMaxLength"}
                                maxLength={10}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' text='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'  
                                type="tel" required
                                labelText={labels["pwa.addressFormPage.phoneWithLada.text"] || "Teléfono con LADA"} />

                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                { !(!address.phoneWithLADA && errors.phoneWithLADA) && !(!focused.phoneWithLADA && address.phoneWithLADA && address.phoneWithLADA.length!==10) &&
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {labels["pwa.checkoutShippingPage.digits10.label"] || "10 digitos"}
                                    </Paragraph>
                                }
                                { !address.phoneWithLADA && errors.phoneWithLADA &&
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {labels["pwa.checkoutShippingPage.phonerequired.label"] || "El teléfono es requerido"}
                                    </Paragraph>
                                }
                                {!focused.phoneWithLADA && address.phoneWithLADA && address.phoneWithLADA.length!==10 &&
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                        {labels["pwa.addressFormPage.invalidTelephoneNum.errorMsg"]}
                                    </Paragraph>
                                }
                            </div>
                        </div>
                    }*/}
                    {address.country === 'GT' &&
                        <div className="col-xl-4 col-lg-6 col-12">
                            <InputHelperAssistant
                                name="guatemalanumber"
                                value={address.guatemalanumber}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.guatemalanumber}
                                field_valid={errors.guatemalanumber}
                                validationtype={"onlyNumbersWithCharactersWithSpace"}
                                maxLength={10}
                                inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' helperText='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'  
                                type="text"
                                required
                                labelText={labels["pwa.addressFormPage.number.label"] || 'Número'}
                                />

                            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                    {errors.guatemalanumber && labels["pwa.addressFormPage.emptyExtNumber.errorMsg"]}
                                </Paragraph>
                            </div>
                        </div>
                    }

                    <div className="col-xl-4 col-lg-6 col-12">
                        <InputHelperAssistant
                            name="cellphone"
                            value={address.cellphone}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused.cellphone}
                            field_valid={address.country === 'GT' && (errors.cellphone || (!focused.cellphone && address.cellphone && address.cellphone.length!==8)) }
                            validationtype={"onlyNumbersWithMaxLength"}
                            maxLength={address.country !== 'GT' ? 10 : 8}
                            inputId='nombreCorto' nameInput='nombreCorto' labelPosition='left' helperText='Ej. Casa, Oficina...' helperTextId='helper-nombreCorto'  
                            type="tel"
                            labelText={address.country !== 'GT' ? (labels["pwa.addressFormPage.cellphone.label"] || "Teléfono Celular") : (labels["pwa.addressFormPage.phone.label"] || "Teléfono")}
                            required={address.country === 'GT'}
                            />
                            {/*labels["pwa.addressFormPage.telephone.label"]*/}

                            {address.country !== 'GT' &&
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-telefonoCelular">
                                        <font><font>
                                            {labels["pwa.checkoutShippingPage.optional.text"]}
                                        </font></font>
                                    </Paragraph>
                                </div>
                            }

                            {address.country === 'GT' &&
                                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                                    {/*{!errors.cellphone &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                            {"8 digitos"}
                                        </Paragraph>
                                    }
                                    {errors.cellphone &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                                            {labels["pwa.addressFormPage.emptyCelular.errorMsg"]}
                                        </Paragraph>
                                    }*/}
                                    { !(!focused.cellphone && address.cellphone && address.cellphone.length!==8) && !errors.cellphone &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {labels["pwa.checkoutShippingPage.digits8.label"] || "8 digitos"}
                                        </Paragraph>
                                    }
                                    { !address.cellphone && errors.cellphone &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {labels["pwa.addressFormPage.emptyCelular.errorMsg"]}
                                        </Paragraph>
                                    }
                                    { !focused.cellphone && address.cellphone && address.cellphone.length!==8 &&
                                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                            {labels["pwa.addressFormPage.invalidTelephoneNum.errorMsg"]}
                                        </Paragraph>
                                    }
                                </div>
                            }
                    </div>

                </div>
                {this.props.loggedInUser &&
                    <div className="row align-items-start justify-content-end">
                        <div className="col-lg-auto col-12">
                            <MaterialInputCheckBox text={"Establecer dirección predeterminada"} name="isDefault" onChange={this.handleCheckboxChange} checked={address.isDefault} />
                            {/*labels["pwa.addressFormPage.setDefaultAddress.label"]*/}
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}