import React from 'react';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Accordion from '../../molecules/Accordion/Accordion';
import AsideMyAccount from '../../organisms/Aside/AsideMyAccount';
import { H1 } from "../../atoms/HeadLines/Headlines";
import Button from "../../atoms/Button/Button";
import Span from "../../atoms/Span/Span";
import InputText from '../../molecules/InputText/InputText';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import MyAddressEmpty from './my-address-empty';
import { Utility, logDebug, logError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import { Validate } from '../../../helpers/utilities/Validate';
import get from 'lodash/get';


class AddressAddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AddressData: {
                shortName: '',
                name: '',
                secondName: '',
                lastName: '',
                motherName: '',
                country: 'MX',
                city: '',
                stateId: '',
                state: '',
                delegacion: '',
                delegacionId: '',
                building: '',
                cp: '',
                colonia: '',
                coloniaId: '',
                street: '',
                betweenStreet: '',
                betweenStreet2: '',
                numext: '',
                numint: '',
                lada: '',
                lada2: '',
                phone: '',
                phone2: '',
                cellphone: '',
                otherColony: ''
            },
            changeToText: false,
            municipalityList: [{}],
            settlementList: [{},{ id: '-2', value: 'Otra Colonia' }],
            stateList: [{}],
            errorPassword: false,
            cellPhoneOption: false,
            otherColonyTextInput: false,
            userAddress: {},
            isAddressEdit: '',
            ladaErrorValid: false,
            phoneErrorValid: false,
            lada2ErrorValid: false,
            phone2ErrorValid: false,
            cellphonePassword: false,
            cpError: '',

        };
        this.ladaValue = '',
            this.phoneValue = '',
            this.lada2Value = '',
            this.phone2Value = ''
    }

    componentDidMount() {
        this.getstate();
    }

    handleOnSelectChange = e => {
        const { AddressData } = this.state;
        const targetId = e.target.id;
        const targetValue = e.target.value;
        const id = this.stateId.getId();
        if (targetId === 'stateId') {
            this.setState(function () {
                AddressData.state = targetValue;
                AddressData.stateId = id;
                return { AddressData }
            })
        } else if (targetId === 'neighbourhood') {
            if (this.neighbourhood.getId() === '-2') {
                this.setState({ otherColonyTextInput: true })
                this.setState(function () {
                    AddressData.colonia = targetValue;
                    AddressData.coloniaId = this.neighbourhood.getId();
                    return { AddressData }
                })
            } else {
                this.setState(function () {
                    this.setState({ otherColonyTextInput: false })
                    AddressData.colonia = targetValue;
                    AddressData.coloniaId = this.neighbourhood.getId();
                    return { AddressData }
                })
            }
        } else {
            this.setState(function () {
                AddressData[targetId] = targetValue;
                return { AddressData }
            })
        }
    }

    addressSearch = (e) => {
        const postalCode = e.target.value;

        if (postalCode && postalCode.toString().length === 5 && this.state.AddressData.country === "MX") {
    		// service addresssearch change GET from POST method :: Start
		    let payLoad = '?action=EMA&cp=' + postalCode;
            Utility(Path.addresssearch + payLoad, 'GET').then(response => {
    		// service addresssearch change GET from POST method :: End

                const { AddressData } = this.state;
                if (response && response.data && response.data.addrSearchResponse) {

                    this.setState({ changeToText: false })

                    const { municipality, settlement, state } = (response && response.data && response.data.addrSearchResponse) || {};

                    const municipalityList = municipality && municipality.map(str => {
                        str = str.split(':');
                        return { id: str[0], value: str[1] };
                    }) || [];

                    const settlementList = settlement && settlement.map(str => {
                        str = str.split(':');
                        return { id: str[0], value: str[1] };
                    }) || [];
                    settlementList.unshift({ id: '-2', value: 'Otra Colonia' })
                    const stateList = state && state.map(str => {
                        str = str.split(':');
                        return { id: str[0], value: str[1] };
                    }) || [];
                    this.setState({
                        municipalityList: municipalityList.length > 1 ? [{}, ...municipalityList] : municipalityList,
                        settlementList: settlementList,
                        stateList: stateList.length > 1 ? [{}, ...stateList] : stateList,
                        AddressData,
                        otherColonyTextInput: false
                    });
                    if (this.state.stateList) {
                        name = this.state.stateList[0].value;
                        this.setState(function () {
                            AddressData['state'] = name;
                            AddressData['stateId'] = this.state.stateList[0].id;
                            return { AddressData }
                        })
                    }

                    if (this.state.municipalityList) {
                        name = this.state.municipalityList[0].value;
                        this.setState(function () {
                            AddressData['delegacion'] = name;
                            AddressData['delegacionId'] = this.state.municipalityList[0].id;
                            return { AddressData }
                        })
                    }
                    if (this.state.settlementList) {
                        name = this.state.settlementList[1].value;
                        this.setState(function () {
                            AddressData['colonia'] = name;
                            AddressData['coloniaId'] = this.state.settlementList[1].id;
                            return { AddressData }
                        })
                    }
                } else {
                    window.scrollTo(0, 0);
                    this.props.show_alert(response.data.err);
                    if (AddressData.cp === '00000') {
                        this.clearData();
                    }
                    this.setState({ changeToText: true, otherColonyTextInput: false })
                    this.getstate();
                }
            }, (error) => {

                logDebug("Error ==== :: ", error);
            });
        } else {
            this.setState({ changeToText: true })
        }
    }

    scrollUp = () => {
        window.scrollTo(0, 0);
    }
    clearData = () => {
        const {AddressData} = this.state;
        this.setState(function () {
            AddressData.cp = '';
            return { AddressData }
        })
                const eles = document.getElementsByClassName('m-input-outline__notch');
                for (var i in eles) {
                    if (!isNaN(i)) {
                        eles[i].style.width = 'auto';
                    }
                }
        }
    
    addAddress = () => {
        this.nombreCorto.validation();
        this.nombre.validation();
        this.apellidoP.validation();
        this.cp.validation();
        this.city.validation();
        this.street.validation();
        this.numext.validation();
        if (!this.state.cellPhoneOption) {
            this.lada.validation();
            this.phone.validation();
        }
        if (this.state.AddressData.lada2) {
            this.lada2.validation();
        }
        if (this.state.AddressData.phone2) {
            this.phone2.validation();
        }
        this.stateId.InputSelectionValidation();
        if (this.state.cellPhoneOption) {
            this.cellular.validation();
        }
        if (this.state.cellPhoneOption && this.state.cellphonePassword && this.state.AddressData.cellphone.length < 8 ) {
            this.scrollUp();
            this.props.show_alert("El número de celular es de 8 dígitos.");
        }
        if (!this.state.cellPhoneOption && this.state.cellphonePassword && this.state.AddressData.cellphone.length < 10 ) {
            this.scrollUp();
            this.props.show_alert("El número de celular es de 10 dígitos.");
        }
        { this.state.changeToText ? this.delegacion.validation() : this.delegacion.InputSelectionValidation() };
        { this.state.changeToText ? this.neighbourhood.validation() : this.neighbourhood.InputSelectionValidation() };

        const { AddressData, phoneErrorValid, ladaErrorValid, phone2ErrorValid, lada2ErrorValid, cellphonePassword } = this.state;
        const payload = {
            "nickname": AddressData.shortName,
            "firstName": AddressData.name,
            "lastName": AddressData.lastName,
            "country": AddressData.country,
            "city": AddressData.city,
            "stateId": AddressData.stateId,
            "state": AddressData.state,
            "delegationMunicipality": AddressData.delegacion,
            "delegationMunicipalityId": AddressData.delegacionId,
            "building": AddressData.building,
            "postalCode": AddressData.cp,
            "neighbourhood": AddressData.colonia,
            "neighborhoodId": AddressData.coloniaId,
            "address1": AddressData.street,
            "address2": AddressData.betweenStreet,
            "address3": AddressData.betweenStreet2,
            "exteriorNumber": AddressData.numext,
            "interiorNumber": AddressData.numint,
            "particularPhoneCode": AddressData.lada,
            "phoneNumber": AddressData.phone,
            "businessPhoneCode": AddressData.lada2,
            "businessPhoneNumber": AddressData.phone2,
            "cellular": AddressData.cellphone,
            "otherColony": AddressData.otherColony,
            "maternalName": AddressData.motherName,
            "middleName": AddressData.secondName,
        }
        if (this.state.cellPhoneOption) {
            if (AddressData.shortName && AddressData.name && AddressData.lastName && AddressData.country && AddressData.cp
                && AddressData.stateId && AddressData.city && AddressData.street && AddressData.numext && AddressData.lada && AddressData.phone && AddressData.cellphone && cellphonePassword === false) {
                this.props.addAddress(payload)
            }

        } else if (AddressData.shortName && AddressData.name && AddressData.lastName && AddressData.country && AddressData.cp
            && AddressData.stateId && AddressData.city && AddressData.street && AddressData.numext && AddressData.lada && AddressData.phone && ladaErrorValid === false && phoneErrorValid === false && lada2ErrorValid === false && phone2ErrorValid === false && cellphonePassword === false) {
            this.props.addAddress(payload);
        }
    }

    handleOnChange = (e) => {

        const { AddressData } = this.state;
        e.persist();
        this.setState(function (prevState) {
            const pre_value = prevState.AddressData[e.target.name];
            AddressData[e.target.name] = Validate.validation(e, pre_value);
            return { AddressData }
        })
        if (e.target.name === 'lada' || e.target.name === 'phone') {
            if (e.target.name === 'lada') {
                this.ladaValue = e.target.value
            }
            if (e.target.name === 'phone') {
                this.phoneValue = e.target.value
            }
            const total = this.ladaValue.length + this.phoneValue.length;
            if (e.target.name === "lada") {
                 if (e.target.value.length < 2) {
                        this.setState({ ladaErrorValid: true })
                    } else if (total != 10 && this.phoneValue.length > 0){
                        this.setState({ phoneErrorValid: true,ladaErrorValid: false })
                    }else if (total === 10 && this.phoneValue.length > 0){
                        this.setState({ phoneErrorValid: false,ladaErrorValid: false })
                    }else {
                        this.setState({ ladaErrorValid: false })
                    }
            }
            if (e.target.name === "phone") {
                if (total !== 10) {
                    this.setState({ phoneErrorValid: true })
                }
                else if (total === 10) {
                    this.setState({ phoneErrorValid: false, ladaErrorValid: false })
                }
            }
        }
        if (e.target.name === 'lada2' || e.target.name === 'phone2') {
            if (e.target.name === 'lada2') {
                this.lada2Value = e.target.value
            }
            if (e.target.name === 'phone2') {
                this.phone2Value = e.target.value
            }
            const total = this.lada2Value.length + this.phone2Value.length;
            if (e.target.name === "lada2") {
                if (e.target.value.length === 0) {
                    this.setState({ lada2ErrorValid: false })
                }else if (e.target.value.length < 2) {
                    this.setState({ lada2ErrorValid: true })
                } else if (total != 10 && this.phone2Value.length > 0) {
                    this.setState({ lada2ErrorValid: false, phone2ErrorValid: true })
                }else if (total === 10 && this.phone2Value.length > 0){
                    this.setState({ phone2ErrorValid: false,lada2ErrorValid: false })
                }else {
                    this.setState({ lada2ErrorValid: false,phone2ErrorValid: false })
                }
            }
            if (e.target.name === "phone2") {
                if (e.target.value.length === 0) {
                    this.setState({ phone2ErrorValid: false })
                }else if (total !== 10) {
                    this.setState({ phone2ErrorValid: true })
                }else if (total === 10) {
                    this.setState({ phone2ErrorValid: false, lada2ErrorValid: false })
                }
            }
        }
        if (e.target.name === "cp") {
            const limitLength = e.target.maxLength;

            if (e.target.value.length < limitLength) {
                this.setState({ errorPassword: true })
            } else if (e.target.value.length === limitLength) {
                this.setState({ errorPassword: false })
            }
        }
        if (e.target.name === "cellphone" && this.state.cellPhoneOption && e.target.value.length === 0){
            this.setState({ cellphonePassword: false })
        }else if (e.target.name === "cellphone" && this.state.cellPhoneOption && e.target.value.length < 8) {
            this.setState({ cellphonePassword: true })
        } else if (e.target.name === "cellphone" && this.state.cellPhoneOption) {
            this.setState({ cellphonePassword: false })
        }
        if(e.target.name === "cellphone" && !this.state.cellPhoneOption && e.target.value.length === 0){
            this.setState({ cellphonePassword: false })
        }else if (e.target.name === "cellphone" && !this.state.cellPhoneOption && e.target.value.length < 10) {
            this.setState({ cellphonePassword: true })
        } else if (e.target.name === "cellphone" && !this.state.cellPhoneOption) {
            this.setState({ cellphonePassword: false })
        }

    }
    handleAllowOnlyDigit = (e) => {
        const { AddressData } = this.state;
        const limitLength = e.target.maxLength;
        const keyCode = e.keyCode;
        if (keyCode === 46 || keyCode === 8 || keyCode === 9 || keyCode === 37 || keyCode === 39) {
            return true;
        }
        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
            // numbers and numeric keypad
            if (e.target.value.length > limitLength) {
                e.preventDefault();
                e.stopPropagation();
            }
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
        return true;
    }

    handleOnCountryChange = (e) => {
        const { AddressData } = this.state;
        const id = this.country.getId();
        this.setState(function () {
            AddressData.country = id;
            return { AddressData }
        })
        if (id === 'GT') {
            this.getGautemelaState();
            this.setState({ changeToText: true, cellPhoneOption: true, otherColonyTextInput: false })
            this.setState(function () {
                AddressData.lada = '11';
                AddressData.phone = '11111111';
                return { AddressData }
            })
        } else {
            this.getstate();
            this.setState({ changeToText: false, cellPhoneOption: false })
        }
    }
    getGautemelaState() {
        Utility(Path.guatemalaStates, 'GET').then(response => {
            if (response.status === 200 && response.data) {
                let stateListReponse = response.data;
                let stateList = [];
                stateListReponse.map((item, index) => {
                    let stateObject = {}
                    stateObject.id = index;
                    stateObject.value = item;
                    stateList.push(stateObject);
                })
                this.setState({ stateList: stateList });
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });

    }
    getstate = () => {
        Utility(Path.stateSearch, 'POST').then(response => {
            if (response.status === 200 && response.data) {
                let stateListReponse = response.data;
                let stateList = [];
                for (var item in stateListReponse) {
                    if (item !== 's') {
                        let stateObject = {}
                        stateObject.id = item;
                        stateObject.value = stateListReponse[item];
                        stateList.push(stateObject);
                    }
                }
                stateList.sort((a, b) => ('' + a.value).localeCompare(b.value));
                this.setState({ stateList: [{}, ...stateList] });
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });
    }

    cancelAddress = () => {
        // Router.push('/tienda/users/addressBook');
        window.location.href = '/tienda/users/addressBook';
    }

    render() {
        const staticLabels = this.props.staticLabels;
        const deleteModalData = this.props.deleteModalData;
        let enableGuatemala = true;
        if (this.props.userAddress && this.props.userAddress.myAddressContent && this.props.userAddress.myAddressContent.flags && typeof this.props.userAddress.myAddressContent.flags['guatemala'] === 'boolean'
            && !this.props.userAddress.myAddressContent.flags['guatemala']) {
            enableGuatemala = false;
        }
        let flagGuatemala = get(this.props.userAddress, 'flags.guatemala', false);
        if(flagGuatemala === true || flagGuatemala === "true"){
            enableGuatemala = false;
        }
        const { AddressData, stateList, settlementList, municipalityList, changeToText, errorPassword, cellPhoneOption, otherColonyTextInput, cellphonePassword } = this.state;
        let colonyList = [];
        if (settlementList.length > 1) {
            settlementList.map((item, index) => {
                const object = {};
                object.id = item.id;
                object.value = item.value;
                if (AddressData.coloniaId === item.id) {
                    object.selected = true
                } else if (index === 1 && AddressData.coloniaId !== '-2') {
                    object.selected = true
                }
                colonyList.push(object);
            })

        } else {
            colonyList = settlementList;
        }
        let breadcrumbInfo = {
            label: '',
            breadcrumbData: {}
        };

        let countryList = [
            {
                id: 'MX',
                value: 'Mexico'
            }
        ]
        if (!enableGuatemala) {
            countryList.push({
                id: 'GT',
                value: 'Guatemala'
            });
        }

        const nombreCorto = {
            inputId: 'shortName',
            nameInput: 'shortName',
            labelText: staticLabels && staticLabels["pwa.NewShippingAddressPage.ShortName.Text"],
            required: true,
            helperText: staticLabels && staticLabels["pwa.addressPage.direccionerror.label"],
            helperTextId: 'helper-text-id',
            type: 'text',
            maxlength: '30',
            helperTextForRequired: 'Ej. Casa, Oficina...',
            showOptional: true
        }
        const nombre = {
            inputId: 'name',
            nameInput: 'name',
            labelText: staticLabels && staticLabels["pwa.nameFormPage.firstName.label"],
            required: true,
            helperText: deleteModalData && deleteModalData["pwa.nameFormPage.emptyFirstName.errorMsg"],
            type: 'text',
            maxlength: '100'
        }
        const secondName = {
            inputId: 'secondName',
            nameInput: 'secondName',
            labelText: staticLabels && staticLabels["pwa.addressPage.segundo.label"],
            required: false,
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            type: 'text',
            maxlength: '100'
        }
        const apellidoP = {
            inputId: 'lastName',
            nameInput: 'lastName',
            labelText: staticLabels && staticLabels["pwa.nameFormPage.lastName.label"],
            required: true,
            helperText: 'Ingresa tu apellido paterno',
            type: 'text',
            maxlength: '100'
        }
        const apellidoM = {
            inputId: 'motherName',
            nameInput: 'motherName',
            labelText: staticLabels && staticLabels["pwa.nameFormPage.maternalName.label"],
            required: false,
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            type: 'text',
            maxlength: '100'
        }
        const cp = {
            inputId: 'cp',
            nameInput: 'cp',
            labelText: staticLabels && staticLabels["pwa.addressPage.cp1.label"],
            required: true,
            helperText: AddressData.cp ? 'El Código Postal debe ser de 5 dígitos.' : staticLabels && staticLabels["pwa.addressFormPage.emptyPostalCode.errorMsg"],
            maxlength: '5',
            type: 'tel'
        }
        const city = {
            inputId: 'city',
            nameInput: 'city',
            labelText: staticLabels && staticLabels["pwa.addressFormPage.city.label"],
            required: true,
            helperText: staticLabels && staticLabels["pwa.addressPage.ciudad1.label"],
            maxlength: '40',
            type: 'text'
        }
        const street = {
            inputId: 'street',
            nameInput: 'street',
            labelText: staticLabels && staticLabels["pwa.addressFormPage.street.label"],
            required: true,
            helperText: 'Ingresa tu calle',
            type: 'text',
            maxlength: '100'
        }
        const numext = {
            inputId: 'numext',
            nameInput: 'numext',
            labelText: this.state.AddressData && this.state.AddressData.country === "GT" ? "Número" : 'Núm. Ext.',
            required: true,
            helperText: staticLabels && staticLabels["pwa.addressPage.numero12.label"],
            maxlength: '10',
            type: 'text',
        }
        const numint = {
            inputId: 'numint',
            nameInput: 'numint',
            labelText: 'Núm. Int.',
            required: false,
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            maxlength: '10',
            type: 'text'
        }
        const building = {
            inputId: 'building',
            nameInput: 'building',
            labelText: staticLabels && staticLabels["pwa.addressFormPage.building.label"],
            required: false,
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            maxlength: '100',
            type: 'text'
        }
        const betweenStreet = {
            inputId: 'betweenStreet',
            nameInput: 'betweenStreet',
            labelText: staticLabels && staticLabels["pwa.addressFormPage.betweenStreet1.label"],
            required: false,
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            maxlength: '100',
            type: 'text'
        }
        const betweenStreet2 = {
            inputId: 'betweenStreet2',
            nameInput: 'betweenStreet2',
            labelText: staticLabels && staticLabels["pwa.addressFormPage.betweenStreet2.label"],
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            required: false,
            maxlength: '100',
            type: 'text'
        }
        const lada = {
            inputId: 'lada',
            nameInput: 'lada',
            labelText: 'Lada',
            required: true,
            // helperText: this.state.ladaErrorMessage,
            helperText: staticLabels && staticLabels["pwa.addressPage.lada1.label"],
            helperTextId: 'helper__lada',
            // staticLabels && staticLabels["pwa.addressPage.lada1.label"]
            maxlength: '3',
            type: 'tel'
        }
        const lada2 = {
            inputId: 'lada2',
            nameInput: 'lada2',
            labelText: 'Lada',
            required: false,
            maxlength: '3',
            type: 'tel'
        }
        const phone = {
            inputId: 'phone',
            nameInput: 'phone',
            labelText: 'Teléfono',
            required: true,
            helperText: staticLabels && staticLabels["pwa.addressFormPage.invalidTelephoneNum.errorMsg"],
            // Ingresa tu teléfono
            maxlength: '8',
            type: 'tel'
        }
        const phone2 = {
            inputId: 'phone2',
            nameInput: 'phone2',
            labelText: 'Teléfono',
            required: false,
            helperText: 'Opcional oficina',
            helperTextId: 'helper-text-id',
            maxlength: '8',
            type: 'tel'
        }
        const cellphone = {
            inputId: 'cellphone',
            nameInput: 'cellphone',
            labelText: 'Teléfono Celular',
            required: false,
            helperText: 'Opcional',
            helperTextId: 'helper-text-id',
            maxlength: '10',
            type: 'tel'
        }
        const cellphoneGT = {
            inputId: 'cellphone',
            nameInput: 'cellphone',
            labelText: 'Teléfono',
            required: true,
            helperText: 'Ingresa tu celular',
            helperTextId: 'helper-text-id',
            maxlength: '8',
            type: 'tel'
        }
        // const countriesListOptions = {
        //     //labelText: "Mexico",
        //     labelId: 'label-country',
        //     selectId: 'selectCountry',
        //     disabled: 'true',
        //     //helperText: 'Selecciona una opción'
        // }
        let countriesListOptions = {
            labelText: staticLabels && staticLabels["pwa.addressFormPage.country.label"],
            labelId: 'country',
            selected: true,
            helperText: 'Selecciona una opción',
            optionList: countryList,
            required: true,
        };

        let colonyOptionsText = {
            inputId: 'neighbourhood',
            nameInput: 'colonia',
            labelText: 'Colonia',
            required: true,
            helperText: 'Selecciona una opción',
            type: 'text',
            maxlength: '100',
        }
        let colonyListOptions = {
            labelText: "Colonia",
            labelId: 'neighbourhood',
            selected: true,
            optionList: colonyList,
            helperText: 'Selecciona una opción',
            required: true
        };
        let municipalityOptionsText = {
            inputId: 'delegationMunicipality',
            nameInput: 'delegacion',
            labelText: this.state.AddressData && this.state.AddressData.country === "GT" ? "Municipio" : staticLabels && staticLabels["pwa.addressPage.municipality.label"],
            required: true,
            helperText: 'Selecciona una opción',
            type: 'text',
            maxlength: '100',
        }
        let municipalityListOptions = {
            labelText: staticLabels && staticLabels["pwa.addressPage.municipality.label"],
            labelId: 'delegacionId',
            selected: true,
            helperText: 'Selecciona una opción',
            optionList: municipalityList,
            required: true,
        };
        let stateListOptions = {
            labelText: this.state.AddressData && this.state.AddressData.country === "GT" ? "Departamentos" : "Estado",
            labelId: 'stateId',
            selected: true,
            helperText: 'Selecciona una opción',
            optionList: stateList,
            required: true
        };
        let otherColony = {
            inputId: 'otherColony',
            nameInput: 'otherColony',
            labelText: staticLabels && staticLabels['pwa.addressFormPage.otherColony.label'],
            required: true,
            helperText: staticLabels && staticLabels['pwa.addressFormPage.emptyOtherColony.errorMsg'],
            type: 'text',
            maxlength: '100',
        }
        return (
            <React.Fragment>
                <div className="m-box o-myAccount__editCards mb-5">
                    <div className="row mt-0 mt-lg-3">
                        <div className="col-6 col-lg-9">
                            <H1 className="a-cards__infoCardTitle" headLineText={staticLabels && staticLabels["pwa.newShippingAddressPage.recipient.text"]}>
                            </H1>
                        </div>
                        <div className="col-6 col-lg-3">
                            <Span className="a-cards__requestLabel pt-2 pb-3 pt-lg-0 pb-lg-0">{staticLabels && staticLabels["pwa.newShippingAddressPage.requiredField.text"]}</Span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 mb-2">
                            <InputText ref={nombreCorto => this.nombreCorto = nombreCorto} options={nombreCorto} handleChange={this.handleOnChange} inputValue={AddressData.shortName} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 mb-2">
                            <InputText ref={nombre => this.nombre = nombre} options={nombre} handleChange={this.handleOnChange} validationtype={"onlyText"} inputValue={AddressData.name} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <InputText options={secondName} handleChange={this.handleOnChange} validationtype={"onlyText"} inputValue={AddressData.secondName} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <InputText ref={apellidoP => this.apellidoP = apellidoP} validationtype={"onlyText"} options={apellidoP} handleChange={this.handleOnChange} inputValue={AddressData.lastName} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <InputText options={apellidoM} handleChange={this.handleOnChange} validationtype={"onlyText"} inputValue={AddressData.motherName} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="a-cards__infoCardTitle">{staticLabels && staticLabels["pwa.addressPage.envio1.label"]}
                            </h1>
                        </div>
                        <div className="col-lg-4 mb-2 mt-4 mt-lg-0">
                            {/*<InputText options={countriesListOptions} inputValue='Mexico' inputValue={AddressData.country} />*/}
                            <InputSelect
                                ref={cn => this.country = cn}
                                options={countriesListOptions}
                                name="country"
                                value={AddressData.country}
                                handleChange={this.handleOnCountryChange}
                                required
                            />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <InputText ref={cp => this.cp = cp} options={cp} handleChange={this.handleOnChange} inputValue={AddressData.cp} onBlur={this.addressSearch} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} error={this.state.errorPassword} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <InputSelect
                                ref={stateId => this.stateId = stateId}
                                options={stateListOptions}
                                name="stateId"
                                value={AddressData.state}
                                handleChange={this.handleOnSelectChange}
                                error_message="Error Estado"
                                required
                            />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <InputText ref={city => this.city = city} options={city} handleChange={this.handleOnChange} inputValue={AddressData.city} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            {changeToText ?
                                <InputText ref={delegacion => this.delegacion = delegacion} options={municipalityOptionsText} value={AddressData.delegacion} handleChange={this.handleOnChange} /> :
                                <InputSelect ref={delegacion => this.delegacion = delegacion} options={municipalityListOptions} value={AddressData.delegacion} handleChange={this.handleOnSelectChange} />
                            }
                        </div>
                        <div className="col-lg-4 mb-2">
                            {changeToText ?
                                <InputText ref={nbr => this.neighbourhood = nbr} options={colonyOptionsText} value={AddressData.colonia} handleChange={this.handleOnChange} /> :
                                <InputSelect ref={nbr => this.neighbourhood = nbr} options={colonyListOptions} value={AddressData.colonia}
                                    handleChange={this.handleOnSelectChange} />
                            }
                        </div>
                        {otherColonyTextInput &&
                            <div className="col-lg-4 mb-2">
                                <InputText options={otherColony} handleChange={this.handleOnChange} inputValue={AddressData.otherColony} ref={ad => this.otherColony = ad} />
                            </div>}
                        <div className="col-lg-4 mb-2">
                            <InputText ref={street => this.street = street} options={street} handleChange={this.handleOnChange} inputValue={AddressData.street} />
                        </div>
                        <div className="col-6 col-lg-2 mb-2">
                            <InputText ref={numext => this.numext = numext} options={numext} handleChange={this.handleOnChange} inputValue={AddressData.numext} validationtype={"onlyNumbersWithCharacters"} />
                        </div>
                        {!cellPhoneOption ? <div className="col-6 col-lg-2 mb-2">
                            <InputText options={numint} handleChange={this.handleOnChange} inputValue={AddressData.numint} />
                        </div> : ''}
                        {!cellPhoneOption ? <div className="col-lg-4 mb-2">
                            <InputText options={building} handleChange={this.handleOnChange} inputValue={AddressData.building} />
                        </div> : ''}
                        {!cellPhoneOption ? <div className="col-lg-4 mb-2">
                            <InputText options={betweenStreet} handleChange={this.handleOnChange} inputValue={AddressData.betweenStreet} />
                        </div> : ""}
                        {!cellPhoneOption ? <div className="col-lg-4 mb-2">
                            <InputText options={betweenStreet2} handleChange={this.handleOnChange} inputValue={AddressData.betweenStreet2} />
                        </div> : ''}

                        {!cellPhoneOption ? <div className="col-4 col-lg-2 mb-2">
                            <InputText onBlur={this.onBlur} ref={lada => this.lada = lada} options={lada} handleChange={this.handleOnChange} validationtype={"onlyNumbers"} error={this.state.ladaErrorValid} inputValue={AddressData.lada} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
                        </div> : ''}
                        {!cellPhoneOption ? <div className="col-8 col-lg-2 mb-2">
                            <InputText onBlur={this.onBlur} onFocus={this.onFocus} ref={phone => this.phone = phone} options={phone} handleChange={this.handleOnChange} error={this.state.phoneErrorValid} inputValue={AddressData.phone} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />

                        </div> : ''}
                        {!cellPhoneOption ? <div className="col-4 col-lg-2 mb-2">
                            <InputText onBlur={this.onBlur} options={lada2} ref={lada => this.lada2 = lada} handleChange={this.handleOnChange} inputValue={AddressData.lada2} error={this.state.lada2ErrorValid} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
                        </div> : ''}
                        {!cellPhoneOption ? <div className="col-8 col-lg-2 mb-2">
                            <InputText onBlur={this.onBlur} onFocus={this.onFocus} ref={phone => this.phone2 = phone} options={phone2} handleChange={this.handleOnChange} error={this.state.phone2ErrorValid} inputValue={AddressData.phone2} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
                        </div> : ''}
                        <div className="col-lg-4 mb-2">
                            <InputText options={cellPhoneOption ? cellphoneGT : cellphone} ref={cellular => this.cellular = cellular} validationtype={"onlyNumbers"} handleChange={this.handleOnChange} error={this.state.cellphonePassword} inputValue={AddressData.cellphone} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
                        </div>
                    </div>
                    <div className="row mt-4 mb-4">
                        <div className="col-12">
                            <p className="a-mycards__termsText">{deleteModalData && deleteModalData["pwa.newCreditCardPage.legaTerms.text"]}
                                <a className="a-mycards__termsLink" target="_blank" href={staticLabels && staticLabels["pwa.newShippingAddressPage.condition.text"]} style={{ color: '#e10098', textDecoration: 'underline' }}>{staticLabels && staticLabels["pwa.newShippingAddressPage.termsLink.text"]}</a>
                            </p>
                        </div>
                        <div className="col-lg-3 mb-3 order-2 order-lg-1">
                            <Button className="a-btn a-btn--secondary" handleClick={this.cancelAddress} ripple="ripple">{staticLabels && staticLabels["pwa.editAddressPage.cancel.text"]}
                            </Button>
                        </div>
                        <div className="col-lg-3 mb-3 order-1 order-lg-2">
                            <Button className="a-btn a-btn--primary" handleClick={this.addAddress} ripple="ripple">{staticLabels && staticLabels["pwa.newShippingAddressPage.Aceptar.text"]}
                            </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment >

        )

    }
}

export default AddressAddPage;
