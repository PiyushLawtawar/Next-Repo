import React from 'react';

import Accordion from '../../molecules/Accordion/Accordion';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { H1 } from "../../atoms/HeadLines/Headlines";
import Button from "../../atoms/Button/Button";
import Span from "../../atoms/Span/Span";
import InputText from '../../molecules/InputText/InputText';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import MyAddressEmpty from './my-address-empty';
import { Validate } from '../../../helpers/utilities/Validate';
import Router from 'next/router';
import map from 'lodash/map';
import get from 'lodash/get';

class AddressEditPage extends React.Component {

  constructor(props) {
    super(props);
    this.oldNickname = '';
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
        otherColony: '',

      },
      userAddress: this.props,
      otherColonyTextInput: false,
      changeToText: false,
      municipalityList: [{}],
      settlementList: [{}],
      stateList: [{}],
      errors: {},
      focused: {},
      errorPassword: false,
      cellPhoneOption: false,
      ladaErrorValid: false,
      phoneErrorValid: false,
      lada2ErrorValid: false,
      phone2ErrorValid: false,
      cellphonePassword: false,
      changeToTextForCountry: false,
    };
    this.ladaValue = '',
      this.phoneValue = '',
      this.lada2Value = '',
      this.phone2Value = ''
  }

  handleOnStateChange = (e) => {
    const { AddressData } = this.state;
    e.persist();
    this.setState(function () {
      this.state.state = e.target.value;
      this.state.stateId = '000';
      return { AddressData }
    });
  }

  handleOnChange = (e) => {
    const { AddressData } = this.state;
    e.persist();
    this.setState(function (prevState) {
      const pre_value = this.state[e.target.name];
      this.state[e.target.name] = Validate.validation(e, pre_value);
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
        } else if (total != 10 && this.phoneValue.length > 0) {
          this.setState({ phoneErrorValid: true, ladaErrorValid: false })
        } else if (total === 10 && this.phoneValue.length > 0) {
          this.setState({ phoneErrorValid: false, ladaErrorValid: false })
        } else {
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
        } else if (e.target.value.length < 2) {
          this.setState({ lada2ErrorValid: true })
        } else if (total != 10 && this.phone2Value.length > 0) {
          this.setState({ lada2ErrorValid: false, phone2ErrorValid: true })
        } else if (total === 10 && this.phone2Value.length > 0) {
          this.setState({ lada2ErrorValid: false, phone2ErrorValid: false })
        } else {
          this.setState({ lada2ErrorValid: false })
        }
      }
      if (e.target.name === "phone2") {
        if (e.target.value.length === 0) {
          this.setState({ phone2ErrorValid: false })
        } else if (total !== 10) {
          this.setState({ phone2ErrorValid: true })
        } else if (total === 10) {
          this.setState({ phone2ErrorValid: false, lada2ErrorValid: false })
        }
      }
    }
    if (e.target.name === "cp") {
      const limitLength = e.target.maxLength;

      if (e.target.value.length < limitLength) {
        this.setState({ errorPassword: true })
      } else {
        this.setState({ errorPassword: false })
      }
    }
    if (e.target.name === "cellphone" && this.state.cellPhoneOption && e.target.value.length === 0) {
      this.setState({ cellphonePassword: false })
    } else if (e.target.name === "cellphone" && this.state.cellPhoneOption && e.target.value.length < 8) {
      this.setState({ cellphonePassword: true })
    } else if (e.target.name === "cellphone" && this.state.cellPhoneOption) {
      this.setState({ cellphonePassword: false })
    }
    if (e.target.name === "cellphone" && !this.state.cellPhoneOption && e.target.value.length === 0) {
      this.setState({ cellphonePassword: false })
    } else if (e.target.name === "cellphone" && !this.state.cellPhoneOption && e.target.value.length < 10) {
      this.setState({ cellphonePassword: true })
    } else if (e.target.name === "cellphone" && !this.state.cellPhoneOption) {
      this.setState({ cellphonePassword: false })
    }

  }

  handleOnSelectChange = e => {
    const { AddressData } = this.state;
    const targetId = e.target.id;
    const targetValue = e.target.value;
    const id = this.stateId.getId();
    if (targetId === 'stateId') {
      this.setState(function () {
        this.state.state = targetValue;
        this.state.stateId = id;
        return { AddressData }
      })
    } else if (targetId === 'coloniaId') {
      if (this.neighbourhood.getId() === '-2') {
        this.setState(function () {
          this.setState({ otherColonyTextInput: true })
          this.state.colonia = targetValue;
          this.state.coloniaId = this.neighbourhood.getId();
          return { AddressData }
        })
      } else {
        this.setState(function () {
          this.setState({ otherColonyTextInput: false })
          this.state.colonia = targetValue;
          this.state.coloniaId = this.neighbourhood.getId();
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
  handleAllowOnlyDigit = (e) => {
    const limitLength = e.target.maxLength;
    const keyCode = e.keyCode;
    if (keyCode === 46 || keyCode === 8 || keyCode === 9 || keyCode === 37 || keyCode === 39) {
      return true;
    }
    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
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

  scrollUp = () => {
    window.scrollTo(0, 0);
  }

  addressSearch = (e) => {
    const postalCode = e.target.value;
    if (postalCode !== this.state.postalCode) {
      if (postalCode && postalCode.toString().length === 5 && (this.state.AddressData.country === "MX" || this.state.country === "MX")) {
  		// service addresssearch change GET from POST method :: Start
        let payLoad = '?action=EMA&cp=' + postalCode;
        Utility(Path.addresssearch + payLoad, 'GET').then(response => {
    		// service addresssearch change GET from POST method :: End
          const { AddressData } = this.state;

          if (response && response.data && response.data.addrSearchResponse) {

            this.setState({ changeToText: false,changeToTextForCountry: false })

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
                this.state.state = name;
                this.state.stateId = this.state.stateList[0].id;
                return { AddressData }
              })
            }
            if (this.state.municipalityList) {
              name = this.state.municipalityList[0].value;
              this.setState(function () {
                this.state.delegacion = name;
                this.state.delegacionId = this.state.municipalityList[0].id;
                return { AddressData }
              })
            }
            if (this.state.settlementList) {
              name = this.state.settlementList[1].value;
              this.setState(function () {
                this.state.colonia = name;
                this.state.coloniaId = this.state.settlementList[1].id;
                return { AddressData }
              })
            }
          } else {
            window.scrollTo(0, 0);
            this.props.show_alert(response.data.err);
            if (this.state.cp === '00000') {
             this.clearData();
            }
            this.setState({ state: '', stateId: '',colonia:'',coloniaId:'',delegacion: '', delegacionId:'' })
            const eles = document.getElementsByClassName('mdc-notched-outline__notch');
            for (var i in eles) {
              if (!isNaN(i)) {
                eles[i].style.width = 'auto';
              }
            }
            this.setState({ changeToText: true, otherColonyTextInput: false,changeToTextForCountry:false })
            this.getstate();
          }

        }, (error) => {
        });
      } else {
        this.setState({ changeToText: true })
      }
    }
  }

  clearData = () => {
    const {AddressData} = this.state;
    this.setState(function () {
      this.state.cp = '';
      return { AddressData }
    })
    const eles = document.getElementsByClassName('m-input-outline__notch');
      for (var i in eles) {
          if (!isNaN(i)) {
              eles[i].style.width = 'auto';
          }
      }
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
        this.setState({ stateList: [{}, ...stateList]  });
      }
    }, (error) => {
    });
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
      console.error("Error ==== :: ", error);
    });

  }

  updateaddress = () => {


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
    if (this.state.changeToTextForCountry) {
      this.stateValueText.validation();
    } else {
      this.stateId.InputSelectionValidation();
    }
    // this.stateId.InputSelectionValidation();
    if (this.state.cellPhoneOption) {
      this.cellular.validation();
    }
    if (this.state.coloniaId == '-2') {
      this.otherColony.validation();
    }
    if (this.state.cellPhoneOption && this.state.cellphonePassword && this.state.cellphone.length < 8 ) {
      this.scrollUp();
      this.props.show_alert("El número de celular es de 8 dígitos.");
    }
    if (!this.state.cellPhoneOption && this.state.cellphonePassword && this.state.cellphone.length < 10 ) {
      this.scrollUp();
      this.props.show_alert("El número de celular es de 10 dígitos.");
    }
    if (this.state.lada2) {
      this.lada2.validation();
    }
    if (this.state.phone2) {
      this.phone2.validation();
    }
    { this.state.changeToText ? this.delegacion.validation() : this.delegacion.InputSelectionValidation() };
    { this.state.changeToText ? this.neighbourhood.validation() : this.neighbourhood.InputSelectionValidation() };

    const payload = {
      "address1": this.state.street ? this.state.street : "",
      "address2": this.state.betweenStreet ? this.state.betweenStreet : "",
      "address3": this.state.betweenStreet2 ? this.state.betweenStreet2 : "",
      "building": this.state.building ? this.state.building : "",
      "businessPhoneCode": this.state.lada2 ? this.state.lada2 : "",
      "businessPhoneNumber": this.state.phone2 ? this.state.phone2 : "",
      "cellular": this.state.cellphone ? this.state.cellphone : "",
      "city": this.state.city ? this.state.city : "",
      "country": this.state.country ? this.state.country : "",
      "delegationMunicipality": this.state.delegacion ? this.state.delegacion : "",
      "delegationMunicipalityId": this.state.delegacionId ? this.state.delegacionId : "",
      "exteriorNumber": this.state.numext ? this.state.numext : "",
      "firstName": this.state.name ? this.state.name : "",
      "interiorNumber": this.state.numint ? this.state.numint : "",
      "lastName": this.state.lastName ? this.state.lastName : "",
      "neighborhoodId": this.state.coloniaId ? this.state.coloniaId : "",
      "neighbourhood": this.state.colonia ? this.state.colonia : "",
      "newNickname": this.state.shortName ? this.state.shortName : "",
      "oldNickname": this.oldNickname ? this.oldNickname : "",
      "particularPhoneCode": this.state.lada ? this.state.lada : "",
      "phoneNumber": this.state.phone ? this.state.phone : "",
      "postalCode": this.state.cp ? this.state.cp : "",
      "state": this.state.state ? this.state.state : "",
      "stateId": this.state.stateId ? this.state.stateId : "",
      "otherColony": this.state.otherColony ? this.state.otherColony : "",
      "maternalName": this.state.motherName ? this.state.motherName : "",
      "middleName": this.state.secondName ? this.state.secondName : "",
    };

    if (this.state.cellPhoneOption) {
      if (this.state.shortName && this.state.name && this.state.lastName && this.state.country && this.state.cp
        && this.state.state && this.state.city && this.state.street && this.state.numext && this.state.lada && this.state.phone && this.state.cellphone && this.state.cellphonePassword === false) {
        this.props.editAddress(payload);
      }

    } else if (this.state.shortName && this.state.name && this.state.lastName && this.state.country && this.state.cp
      && this.state.state && this.state.city && this.state.street && this.state.numext && this.state.lada && this.state.phone && this.state.phoneErrorValid === false && this.state.ladaErrorValid === false && this.state.cellphonePassword === false && this.state.lada2ErrorValid === false && this.state.phone2ErrorValid === false) {
      this.props.editAddress(payload);
    }
  }

  componentDidMount() {

    // if (this.props.userAddress) {
    //   this.setState({ userAddress: this.state.setAddressData })
    // }
    const UserId = this.state.userAddress;
    const userAddressData = UserId.userAddress;
    if (userAddressData.records) {

      const address = userAddressData && userAddressData.records.filter(record => record.repositoryId == UserId.addressId)
      this.setState({ address: address })
      map(address, (item, index) => {
        this.oldNickname = item.nickName;
        if (item.phoneNumber) {
          const splitingPhoneNumber = item.phoneNumber.split("-");
          this.ladaValue = splitingPhoneNumber[0];
          this.phoneValue = splitingPhoneNumber[1];
        }
        if (item.businessPhoneNumber) {
          const splitingBusinessPhoneNumber = item.businessPhoneNumber.split("-");
          this.lada2Value = splitingBusinessPhoneNumber[0];
          this.phone2Value = splitingBusinessPhoneNumber[1];
        }
        if (item.country === 'Guatemala' || item.country === 'GT') {
          this.setState({ changeToText: true, country: 'GT', cellPhoneOption: true })
        } else {
          this.setState({ changeToText: false, country: 'MX', cellPhoneOption: false })
        }

        if (item.neighborhoodId === '-2') {
          this.setState({ otherColonyTextInput: true, otherColony: item.neighbourhood })
        }

        if (item.neighborhoodId) {
          this.setState({ changeToText: false,changeToTextForCountry: false })
        }else {
          this.setState({ changeToText: true ,changeToTextForCountry: true})
        }

        this.setState({
          shortName: item.nickName, name: item.firstName, secondName: item.middleName, lastName: item.lastName, motherName: item.maternalName, postalCode: item.postalCode,
          cp: item.postalCode, state: item.state, stateId: item.stateId, city: item.city, delegacion: item.delegationMunicipality, delegacionId: item.delegationMunicipalityId, colonia: item.neighbourhood,
          coloniaId: item.neighborhoodId, street: item.address1, numext: item.exteriorNumber, numint: item.interiorNumber, building: item.building, betweenStreet: item.address2, betweenStreet2: item.address3,
          name: item.firstName, lada: this.ladaValue, phone: this.phoneValue, lada2: this.lada2Value, phone2: this.phone2Value, cellphone: item.cellular
        })

      })
    }
  }
  handleOnCountryChange = (e) => {
    const { AddressData } = this.state;
    const id = this.country.getId();
    this.setState(function () {
      this.state.country = id;
      AddressData.country = id;
      return { AddressData }
    })
    if (id === 'GT') {
      this.getGautemelaState();
      this.setState({ changeToText: true, cellPhoneOption: true })
    } else {
      this.getstate();
      this.setState({ changeToText: false, cellPhoneOption: false })
    }
  }

  cancelAddress = () => {
    //Router.push('/tienda/users/addressBook');
    window.location.href = '/tienda/users/addressBook';
  }

  render() {
    const staticLabels = this.props.staticLabels;
    const deleteModalData = this.props.deleteModalData;
    const { focused, errors, address, stateList, settlementList, municipalityList, changeToText, errorPassword, cellPhoneOption, otherColonyTextInput,changeToTextForCountry } = this.state;
    let breadcrumbInfo = {
      label: '',
      breadcrumbData: {}
    };
    let enableGuatemala = true;
    // console.log("flags ==" + JSON.stringify(this.props.userAddress ? this.props.userAddress.flags : null))
    if (this.props.userAddress && this.props.userAddress.myAddressContent && this.props.userAddress.myAddressContent.flags && typeof this.props.userAddress.myAddressContent.flags['guatemala'] === 'boolean'
      && !this.props.userAddress.myAddressContent.flags['guatemala']) {
      enableGuatemala = false;
    }
    let flagGuatemala = get(this.props.userAddress, 'flags.guatemala', false);
    if(flagGuatemala === true || flagGuatemala === "true"){
        enableGuatemala = false;
    }
    const stateObject = [{
      id: this.state.stateId,
      value: this.state.state
    }]
    const municipalityObject = [{
      id: this.state.delegacionId,
      value: this.state.delegacion
    }]
    let settlementObject = [];
    if (this.state.coloniaId === '-2') {
      settlementObject = [{
        id: this.state.coloniaId,
        value: 'Otra Colonia'
      }]
    } else {
      settlementObject = [{
        id: this.state.coloniaId,
        value: this.state.colonia
      }]
    }

    let colonyList = [];
    if (settlementList.length > 1) {
      settlementList.map((item, index) => {
        const object = {};
        object.id = item.id;
        object.value = item.value;
        if (this.state.coloniaId === item.id) {
          object.selected = true
        } else if (index === 1 && this.state.coloniaId !== '-2') {
          object.selected = true
        }
        colonyList.push(object);
      })

    } else {
      colonyList = settlementList;
    }

    const countryList = [
      {
        id: 'MX',
        value: 'Mexico',
        selected: this.state.country === 'MX' ? true : false
      }]
    if (!enableGuatemala) {
      countryList.push({
        id: 'GT',
        value: 'Guatemala',
        selected: this.state.country === 'GT' ? true : false
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
      maxlength: "30",
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
      helperText: this.state.cp ? "El Código Postal debe ser de 5 dígitos." : 'Ingresa tu código postal',
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
      maxlength: '100',
      type: 'text'
    }
    const numext = {
      inputId: 'numext',
      nameInput: 'numext',
      labelText: 'Núm. Ext.',
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
      maxlength: 10,
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
      helperText: staticLabels && staticLabels["pwa.addressPage.lada1.label"],
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
      labelText: 'Teléfono Celular',
      required: true,
      helperText: 'Ingresa tu celular',
      helperTextId: 'helper-text-id',
      maxlength: '8',
      type: 'tel'
    }

    let countriesListOptions = {
      labelText: staticLabels && staticLabels["pwa.addressFormPage.country.label"],
      labelId: 'country',
      selected: true,
      helperText: 'Selecciona una opción',
      optionList: countryList,
      required: true,
    }
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
      labelId: 'coloniaId',
      selected: true,
      optionList: colonyList.length > 1 ? colonyList : settlementObject,
      required: true,
    };
    let municipalityOptionsText = {
      inputId: 'delegationMunicipality',
      nameInput: 'delegacion',
      labelText: staticLabels && staticLabels["pwa.addressPage.municipality.label"],
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
      optionList: municipalityList.length > 1 ? municipalityList : municipalityObject,
      required: true,
    };
    let stateListOptions = {
      labelText: "Estado",
      labelId: 'stateId',
      selected: true,
      helperText: 'Selecciona una opción',
      optionList: stateList.length > 1 ? stateList : stateObject,
      required: true,
    };
     //For textInput 
     let stateListOptionsText = {
      inputId: 'state',
      nameInput: 'state',
      labelText: 'Estado',
      required: true,
      helperText: 'Selecciona una opción',
      type: 'text',
      maxlength: '100'
    }
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
              <Span className="a-cards__requestLabel pt-3 pb-3 pt-lg-0 pb-lg-0">{staticLabels && staticLabels["pwa.newShippingAddressPage.requiredField.text"]}</Span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-2">
              <InputText ref={nombreCorto => this.nombreCorto = nombreCorto} options={nombreCorto} handleChange={this.handleOnChange} inputValue={this.state.shortName} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-2">
              <InputText ref={nombre => this.nombre = nombre} options={nombre} handleChange={this.handleOnChange} validationtype={"onlyText"} inputValue={this.state.name} />
            </div>

            <div className="col-lg-4 mb-2">
              <InputText options={secondName} handleChange={this.handleOnChange} validationtype={"onlyText"} inputValue={this.state.secondName} />
            </div>
            <div className="col-lg-4 mb-2">
              <InputText ref={apellidoP => this.apellidoP = apellidoP} options={apellidoP} validationtype={"onlyText"} handleChange={this.handleOnChange} inputValue={this.state.lastName} />
            </div>
            <div className="col-lg-4 mb-2">
              <InputText options={apellidoM} handleChange={this.handleOnChange} validationtype={"onlyText"} inputValue={this.state.motherName} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <h1 className="a-cards__infoCardTitle">{staticLabels && staticLabels["pwa.addressPage.envio1.label"]}
              </h1>
            </div>

            <div className="col-lg-4 mb-2 mt-4 mt-lg-0">
              {/*<InputText options={countriesListOptions} inputValue='Mexico' inputValue={this.state.country} />*/}
              <InputSelect
                ref={cn => this.country = cn}
                options={countriesListOptions}
                name="country"
                value={this.state.country}
                handleChange={this.handleOnCountryChange}
                required
              />
            </div>

            <div className="col-lg-4 mb-2">
              <InputText ref={cp => this.cp = cp} options={cp} handleChange={this.handleOnChange} inputValue={this.state.cp} validationtype={"onlyNumbers"} onBlur={this.addressSearch} error={errorPassword} />
            </div>
            <div className="col-lg-4 mb-2">
            {changeToTextForCountry ?
              <InputText options={stateListOptionsText} handleChange={this.handleOnStateChange} inputValue={this.state.state} ref={st => this.stateValueText = st} validationtype={'onlyText'} /> :
              <InputSelect
                ref={stateId => this.stateId = stateId}
                options={stateListOptions}
                name="stateId"
                value={this.state.state}
                handleChange={this.handleOnSelectChange}
                error_message="Error Estado"
                required
              />
            }
            </div>

            <div className="col-lg-4 mb-2">
              <InputText ref={city => this.city = city} options={city} handleChange={this.handleOnChange} inputValue={this.state.city} />
            </div>
            <div className="col-lg-4 mb-2">
              {changeToText ?
                <InputText ref={delegacion => this.delegacion = delegacion} options={municipalityOptionsText} inputValue={this.state.delegacion} handleChange={this.handleOnChange} /> :
                <InputSelect ref={delegacion => this.delegacion = delegacion} options={municipalityListOptions} value={this.state.delegacion} handleChange={this.handleOnSelectChange} />
              }
            </div>
            <div className="col-lg-4 mb-2">
              {changeToText ?
                <InputText ref={nbr => this.neighbourhood = nbr} options={colonyOptionsText} inputValue={this.state.colonia} handleChange={this.handleOnChange} /> :
                <InputSelect ref={nbr => this.neighbourhood = nbr} options={colonyListOptions} value={this.state.colonia}
                  handleChange={this.handleOnSelectChange} />
              }
            </div>
            {otherColonyTextInput &&
              <div className="col-lg-4 mb-2">
                <InputText options={otherColony} handleChange={this.handleOnChange} inputValue={this.state.otherColony} ref={ad => this.otherColony = ad} />
              </div>}
            <div className="col-lg-4 mb-2">
              <InputText ref={street => this.street = street} options={street} handleChange={this.handleOnChange} inputValue={this.state.street} />
            </div>

            <div className="col-6 col-lg-2 mb-2">
              <InputText ref={numext => this.numext = numext} options={numext} handleChange={this.handleOnChange} inputValue={this.state.numext} validationtype={"onlyNumbersWithCharacters"} />
            </div>
            {!cellPhoneOption ? <div className="col-6 col-lg-2 mb-2">
              <InputText options={numint} handleChange={this.handleOnChange} inputValue={this.state.numint} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-lg-4 mb-2">
              <InputText options={building} handleChange={this.handleOnChange} inputValue={this.state.building} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-lg-4 mb-2">
              <InputText options={betweenStreet} handleChange={this.handleOnChange} inputValue={this.state.betweenStreet} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-lg-4 mb-2">
              <InputText options={betweenStreet2} handleChange={this.handleOnChange} inputValue={this.state.betweenStreet2} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-4 col-lg-2 mb-2">
              <InputText ref={lada => this.lada = lada} onBlur={this.onBlur} options={lada} handleChange={this.handleOnChange} validationtype={"onlyNumbers"} error={this.state.ladaErrorValid} inputValue={this.state.lada} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-8 col-lg-2 mb-2">
              <InputText onBlur={this.onBlur} onFocus={this.onFocus} ref={phone => this.phone = phone} options={phone} handleChange={this.handleOnChange} error={this.state.phoneErrorValid} validationtype={"onlyNumbers"} inputValue={this.state.phone} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-4 col-lg-2 mb-2">
              <InputText onBlur={this.onBlur} options={lada2} ref={lada => this.lada2 = lada} handleChange={this.handleOnChange} options={lada2} handleChange={this.handleOnChange} error={this.state.lada2ErrorValid} validationtype={"onlyNumbers"} inputValue={this.state.lada2} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
            </div> : ''}

            {!cellPhoneOption ? <div className="col-8 col-lg-2 mb-2">
              <InputText options={phone2} onBlur={this.onBlur} ref={phone => this.phone2 = phone} onFocus={this.onFocus} handleChange={this.handleOnChange} error={this.state.phone2ErrorValid} inputValue={this.state.phone2} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
            </div> : ""}
            <div className="col-lg-4 mb-2">
              <InputText options={cellPhoneOption ? cellphoneGT : cellphone} ref={cellular => this.cellular = cellular} handleChange={this.handleOnChange} validationtype={"onlyNumbers"} error={this.state.cellphonePassword} inputValue={this.state.cellphone} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); }} />
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
              <Button handleClick={this.updateaddress} className="a-btn a-btn--primary" ripple="ripple">{staticLabels && staticLabels["pwa.newShippingAddressPage.Aceptar.text"]}
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment >
    )
  }
}

export default AddressEditPage;
