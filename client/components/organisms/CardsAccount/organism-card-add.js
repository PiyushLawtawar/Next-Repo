import React from 'react';
import Router from 'next/router';
import Button from '../../atoms/Button/Button';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { Menumotion } from '../../molecules/MenuMotion/molecule-menu-motion';
// import { InputText, HelperText } from '../../molecules/MaterialInputText/MaterialInputText';
import InputText from '../../molecules/InputText/InputText';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import InputSelect from '../../molecules/InputSelect/InputSelect';
import './organism-cards-account.styl';
import { Utility, logError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import { Validate } from '../../../helpers/utilities/Validate';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: {
        nickname: "",
        creditCardType: "",
        creditCardNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        maternalName: "",
        country: "",
        postalCode: "",
        stateId: "",
        state: "",
        city: "",
        delegationMunicipalityId: "",
        delegationMunicipality: "",
        neighborhoodId: "",
        neighbourhood: "",
        otherColony: "",
        address1: "",
        interiorNumber: "",
        building: "",
        address2: "",
        address3: "",
        exteriorNumber: "",
        phoneNumber: "",
        businessPhoneCode: "",
        businessPhoneNumber: "",
        cellular: "",
        particularPhoneCode: ""
      },
      changeToText: false,
      changeToTextForCountry: false,
      editFlag: false,
      editCall: true,
      municipalityList: [],
      settlementList: [{}, { id: '-2', value: 'Otra Colonia' }],
      stateList: [{}],
      countryList: [{}],
      // creditCardType: [],
      staticMetaTags: '',
      countryId: 'MX',
      errorPassword: false,
      errorCardNum: false,
      otherColonyTextInput: false,
      ladaErrorValid: false,
      phoneErrorValid: false,
      lada2ErrorValid: false,
      phone2ErrorValid: false,
      cellphonePassword: false,
      cardTypeList: []
    };
    this.newNickname = '',
    this.oldNickName = '',
    this.neighborhoodId = ''
    this.creditCardTypeList = [];
    this.ladaValue = '',
    this.phoneValue = ''
    this.lada2Value = '',
    this.phone2Value = ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getCountries();
    this.getConfiguration();

    if (Router && Router.router && Router.router.query && Router.router.query.creditCardId) {
      this.setState({ editFlag: true });
    } else {
      this.getstate();
      this.setState({ editFlag: false });
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps && nextProps.cardData && nextProps.cardData.billingAddress && nextProps.cardData.billingAddress.firstName) {
      if (this.state.editCall) {
        this.saveData(nextProps.cardData);
        this.getCountries();
        // let countryValue = ''
        // this.state && this.state.countryList && this.state.countryList.map(item => {
        //   if (item.id === 'MX') {
        //     countryValue = item.value;
        //   }
        // })
        if ('México' == nextProps.cardData.billingAddress.country || 'MX' == nextProps.cardData.billingAddress.country) {
          this.setState({ changeToText: false, changeToTextForCountry: false });
          // this.addressSearch(nextProps.cardData.billingAddress.postalCode, nextProps.cardData.billingAddress.postalCode)
        } else {
          this.setState({ changeToText: true, changeToTextForCountry: true });
        }
        if(nextProps.cardData.billingAddress.neighborhoodId){
          this.setState({ changeToText: false,changeToTextForCountry: false })
        }else {
          this.setState({ changeToText: true,changeToTextForCountry: true })
        }
        if (nextProps.cardData.billingAddress.neighborhoodId === '-2') {
          this.setState({ otherColonyTextInput: true })
        }
        this.neighborhoodId = nextProps.cardData.billingAddress.neighborhoodId;
        this.oldNickName = nextProps.cardData.nickName;
        this.setState({ editCall: false })
      }

    }
  }

  getConfiguration = () => {
    let cardType = this.props.data.configurationData && this.props.data.configurationData.configuration.liverpoolconfiguration && this.props.data.configurationData.configuration.liverpoolconfiguration.orderedcardtypesmap;
    if (typeof cardType === 'undefined' || cardType.length === 0) {
      Utility(Path.fetchConfiguration, 'GET').then(response => {
        if (response && response.data) {
          cardType = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.orderedcardtypesmap;
          this.setState({ cardTypeList: cardType})
        }
      });
    }else {
        this.setState({
            cardTypeList: cardType
        });
    }
}

  getCountries = () => {
    const { address } = this.state;
    Utility(Path.getcountry, 'GET').then(response => {
      if (response.status === 200 && response.data) {
        let countryList = [];
        countryList = Object.keys(response.data).map(key => {
          const obj = response.data[key];
          const id = Object.keys(obj)[0];
          const value = obj[id];
          let selected = false;
          if (id === "MX" && !this.state.editFlag) {
            selected = true;
          } else if (value === this.state.address.country || id == this.state.address.country) {
            selected = true;
            this.setState(function () {
              address.country = value;
              return { address }
            })
          }
          return { value, id, selected }
        })
        this.setState({ countryList: countryList });
        if (!address.country) {
          this.setState(function () {
            address.country = countryList[154].value;
            return { address }
          })
        }
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

  scrollUp = () => {
    window.scrollTo(0, 0);
  }
  clearData = () => {
    const {address} = this.state;
    this.setState(function () {
      address.postalCode = '';
      return { address }
    })
			const eles = document.getElementsByClassName('m-input-outline__notch');
			for (var i in eles) {
				if (!isNaN(i)) {
					eles[i].style.width = 'auto';
				}
			}
	}

  handleOnCountryChange = e => {
    const { address } = this.state;
    const targetId = e.target.id;
    const targetValue = e.target.value;
    const id = this.country.getId();

    if (id !== "MX") {
      this.setState({ changeToText: true, changeToTextForCountry: true, countryId: id });
    } else {
      this.setState({ changeToText: false, changeToTextForCountry: false, countryId: id });
    }

    this.setState(function () {
      address[targetId] = targetValue;
      return { address }
    })

  }
  handleOnSelectChange = e => {
    const { address } = this.state;
    const targetId = e.target.id;
    const targetValue = e.target.value;

    if (targetId === 'state') {
      this.setState(function () {
        address.state = targetValue;
        address.stateId = this.stateValue.getId();
        return { address }
      })
    } else if (targetId === 'neighbourhood') {
      if (this.neighbourhood.getId() === '-2') {
        this.setState({ otherColonyTextInput: true })
        this.setState(function () {
          address.neighbourhood = targetValue;
          address.neighborhoodId = this.neighbourhood.getId();
          return { address }
        })
      } else {
        this.setState(function () {
          this.setState({ otherColonyTextInput: false })
          address.neighbourhood = targetValue;
          address.neighborhoodId = this.neighbourhood.getId();
          return { address }
        })
      }
    } else if (targetId === 'creditCardType') {
      address.creditCardType = this.creditCardType.getId();
    } else {
      this.setState(function () {
        address[targetId] = targetValue;
        return { address }
      })
    }

  }

  handleOnChange = (e) => {
    const { address } = this.state;
    e.persist();
    if (e.target.name !== 'nickname' || !this.state.editFlag) {
      this.setState(function (prevState) {
        const pre_value = prevState.address[e.target.name];
        address[e.target.name] = Validate.validation(e, pre_value);
        logError(Validate.validation(e, pre_value))
        return { address }
      });
    } else {
      this.newNickname = e.target.value;
      this.oldNickName = e.target.value;
    }
    if (e.target.name === 'particularPhoneCode' || e.target.name === 'phoneNumber') {
      if (e.target.name === 'particularPhoneCode') {
        this.ladaValue = e.target.value
      }
      if (e.target.name === 'phoneNumber') {
        this.phoneValue = e.target.value
      }
      const total = this.ladaValue.length + this.phoneValue.length;
      if (e.target.name === "particularPhoneCode") {
        if (e.target.value.length < 2) {
          this.setState({ ladaErrorValid: true })
        } else if (total != 10 && this.phoneValue.length > 0) {
          this.setState({ phoneErrorValid: true, ladaErrorValid: false })
        }else if (total === 10 && this.phoneValue.length > 0) {
          this.setState({ phoneErrorValid: false, ladaErrorValid: false })
        } else {
          this.setState({ ladaErrorValid: false })
        }
      }
      if (e.target.name === "phoneNumber") {
        if (total !== 10) {
          this.setState({ phoneErrorValid: true })
        }
        else if (total === 10) {
          this.setState({ phoneErrorValid: false, ladaErrorValid: false })
        }
      }
    }
    if (e.target.name === 'businessPhoneCode' || e.target.name === 'businessPhoneNumber') {
      if (e.target.name === 'businessPhoneCode') {
        this.lada2Value = e.target.value
      }
      if (e.target.name === 'businessPhoneNumber') {
        this.phone2Value = e.target.value
      }
      const total = this.lada2Value.length + this.phone2Value.length;
      if (e.target.name === "businessPhoneCode") {
        if (e.target.value.length === 0) {
          this.setState({ lada2ErrorValid: false })
        } else if (e.target.value.length < 2) {
          this.setState({ lada2ErrorValid: true })
        } else if (total != 10 && this.phone2Value.length > 0) {
          this.setState({ lada2ErrorValid: false, phone2ErrorValid: true })
        }else if (total === 10 && this.phone2Value.length > 0) {
          this.setState({ lada2ErrorValid: false, phone2ErrorValid: false })
        } else {
          this.setState({ lada2ErrorValid: false })
        }
      }
      // const ladaPhoneLength = (AddressData.lada.length + e.target.value.length);
      if (e.target.name === "businessPhoneNumber") {
        if (e.target.value.length === 0) {
          this.setState({ phone2ErrorValid: false })
        } else if (total !== 10) {
          this.setState({ phone2ErrorValid: true })
        } else if (total === 10) {
          this.setState({ phone2ErrorValid: false, lada2ErrorValid: false })
        }
      }
    }
    if (e.target.name === "postalCode") {
      const limitLength = e.target.maxLength;

      if (e.target.value.length < limitLength) {
        this.setState({ errorPassword: true })
      } else {
        this.setState({ errorPassword: false })
      }
    }
    if (e.target.name === "cellular" && e.target.value.length === 0) {
      this.setState({ cellphonePassword: false })
    }else if (e.target.name === "cellular" && e.target.value.length < 10) {
      this.setState({ cellphonePassword: true })
    } else if (e.target.name === "cellular") {
      this.setState({ cellphonePassword: false })
    }
   
  }

  onBlur = (e) => {
    if(e.target.name == 'creditCardNumber'){
      const limitLength = e.target.minLength;
      if (e.target.value.length < limitLength) {
        this.setState({ errorCardNum: true })
      } else {
        this.setState({ errorCardNum: false })
      }
    }
  }

  handleOnStateChange = (e) => {
    const { address } = this.state;
    e.persist();
    this.setState(function () {
      address.state = e.target.value;
      address.stateId = '000';
      return { address }
    });
  }

  addressSearch = (e, postalcode) => {
    const { address } = this.state;
    let postalCode = ''
    if (e && e.target && e.target.value) {
      postalCode = e.target.value;
    } else {
      postalCode = postalcode;
    }
    this.setState(function () {
      address.postalCode = postalCode;
      return { address }
    })
    if (postalCode && postalCode.toString().length === 5 && this.state.countryId === "MX") {
      // service addresssearch change GET from POST method :: Start
      let payLoad = '?action=EMA&cp=' + postalCode;
        Utility(Path.addresssearch + payLoad, 'GET').then(response => {
        // service addresssearch change GET from POST method :: End
        if (response && response.data && response.data.addrSearchResponse) {

          this.setState({ changeToText: false,changeToTextForCountry: false })

          const { municipality, settlement, state } = (response && response.data && response.data.addrSearchResponse) || {};

          const municipalityList = municipality && municipality.map(str => {
            str = str.split(':');
            return { value: str[1], id: str[0] };
          }) || [];
          //  if(!this.neighborhoodId){
          const settlementList = settlement && settlement.map(str => {
            str = str.split(':');
            return { value: str[1], id: str[0] };
          }) || [];
          //  }
          settlementList.unshift({ id: '-2', value: 'Otra Colonia' })
          const stateList = state && state.map(str => {
            str = str.split(':');
            return { value: str[1], id: str[0] };
          }) || [];


          this.setState({
            municipalityList: municipalityList, // setstate the response  coming from services
            settlementList: settlementList,
            stateList: stateList,
            address
          });

          if (stateList && stateList.length > 0) {
            this.setState(function () {
              address.state = stateList[0].value;
              address.stateId = stateList[0].id
              return { address }
            })
          }
          if (municipalityList && municipalityList.length > 0) {
            this.setState(function () {
              address.delegationMunicipality = municipalityList[0].value;
              address.delegationMunicipalityId = municipalityList[0].id;
              return { address }
            })
          }
          if (address.neighborhoodId === '-2') {
            if (settlementList && settlementList.length > 0) {
              this.setState(function () {
                address.neighbourhood = address.neighbourhood;
                address.neighborhoodId = address.neighborhoodId;
                return { address }
              })
            }
          } else if (settlementList && settlementList.length > 0) {
            this.setState(function () {
              address.neighbourhood = settlementList[1].value;
              address.neighborhoodId = settlementList[1].id;
              return { address }
            })
          }



        } else {
          window.scrollTo(0, 0);

          this.props.show_alert(response && response.data && response.data.err);

          if (address.postalCode === '00000') {
            this.clearData();
          }
          this.setState({ municipalityList: [{}] })
          this.setState(function () {
            address.delegationMunicipality = '';
            address.delegationMunicipalityId = '';
            return { address }
          })
          this.setState({ settlementList: [{}] })
          this.setState(function () {
            address.neighbourhood = '';
            address.neighborhoodId = '';
            return { address }
          })
          this.setState({ stateList: [{}] })
          this.setState(function () {
            address.state = '';
            address.stateId = '';
            return { address }
          })
          const eles = document.getElementsByClassName('mdc-notched-outline__notch');
          for (var i in eles) {
            if (!isNaN(i)) {
              eles[i].style.width = 'auto';
            }
          }
          this.setState({ changeToText: true, otherColonyTextInput: false })
          this.getstate();
        }

      }, (error) => {
        logError("Error ==== :: ", error);
      });

    }
  }

  submit = () => {
    const { nickname, creditCardType, creditCardNumber, firstName, lastName, country, postalCode, stateId, state, city, delegationMunicipalityId, delegationMunicipality, neighborhoodId,
      neighbourhood, address1, exteriorNumber, phoneNumber, particularPhoneCode, businessPhoneCode, businessPhoneNumber } = this.state.address;
    this.nickname.validation();
    this.creditCardType.InputSelectionValidation();
    this.creditCardNumber.validation();
    this.firstName.validation();
    this.lastName.validation();
    this.country.InputSelectionValidation();
    this.postalCode.validation();
    if (this.state.changeToTextForCountry) {
      this.stateValueText.validation();
    } else {
      this.stateValue.InputSelectionValidation();
    }
    if (this.state.changeToText) {
      this.delegationMunicipalityText.validation();
      this.neighbourhoodText.validation();
    } else {
      this.delegationMunicipality.InputSelectionValidation();
      this.neighbourhood.InputSelectionValidation();
    }
    if (this.state.address.cellular.length < 10 && this.state.cellphonePassword) {
      this.scrollUp();
      this.props.show_alert("El número de celular es de 10 dígitos.");
    }
    this.city.validation();
    this.address1.validation();
    this.exteriorNumber.validation();
    this.phoneNumber.validation();
    this.particularPhoneCode.validation();
    if (businessPhoneCode) {
      this.businessPhoneCode.validation();
    }
    if (businessPhoneNumber) {
      this.businessPhoneNumber.validation();
    }
    let payload = {};
    payload = this.state.address;
    if (this.state.editFlag) {
      payload.newNickname = this.newNickname ? this.newNickname : this.state.address.nickname;
    }
    if (nickname && creditCardType && creditCardNumber && firstName && lastName && country && postalCode && state && city &&
      delegationMunicipality && neighbourhood && address1 && exteriorNumber && phoneNumber && particularPhoneCode && this.state.ladaErrorValid === false && this.state.phoneErrorValid === false && this.state.cellphonePassword === false && this.state.lada2ErrorValid === false && this.state.phone2ErrorValid === false  && this.state.errorCardNum === false) {
      if (Router && Router.router && Router.router.query && Router.router.query.creditCardId) {
        if(this.oldNickName) {
          this.props.editCard(payload);
        }
      } else if (Router && Router.router && Router.router.query && Router.router.query.id) {
        this.props.addCard(payload);
        // Router.push("/tienda/checkout/airtimeTicket");
      }
      else {
        this.props.addCard(payload);
      }
    }


  }

  saveData = (cardData) => {
    const { address, nickNameValue } = this.state;

    if (cardData && cardData.billingAddress && cardData.billingAddress.businessPhoneNumber) {
      this.phone2Value = cardData.billingAddress.businessPhoneNumber.split('-')[1];
      this.lada2Value = cardData.billingAddress.businessPhoneNumber.split('-')[0];
    }
    if (cardData && cardData.billingAddress && cardData.billingAddress.phoneNumber) {
      this.phoneValue = cardData.billingAddress.phoneNumber.split('-')[1];
      this.ladaValue = cardData.billingAddress.phoneNumber.split('-')[0];
    }

    this.setState(function () {
      address.nickname = cardData.nickName ? cardData.nickName : "";
      address.creditCardNumber = cardData.creditCardNumber ? cardData.creditCardNumber : "";
      address.creditCardType = cardData.creditCardType ? cardData.creditCardType : "";
      address.firstName = cardData.billingAddress.firstName ? cardData.billingAddress.firstName : "";
      address.middleName = cardData.billingAddress.middleName ? cardData.billingAddress.middleName : "";
      address.lastName = cardData.billingAddress.lastName ? cardData.billingAddress.lastName : "";
      address.maternalName = cardData.billingAddress.maternalName ? cardData.billingAddress.maternalName : "";
      address.country = cardData.billingAddress.country ? cardData.billingAddress.country : "";
      address.postalCode = cardData.billingAddress.postalCode ? cardData.billingAddress.postalCode : "";
      address.stateId = cardData.billingAddress.stateId ? cardData.billingAddress.stateId : '000';
      address.state = cardData.billingAddress.state ? cardData.billingAddress.state : "";
      address.city = cardData.billingAddress.city ? cardData.billingAddress.city : "";
      address.delegationMunicipalityId = cardData.billingAddress.delegationMunicipalityId ? cardData.billingAddress.delegationMunicipalityId : "";
      address.delegationMunicipality = cardData.billingAddress.delegationMunicipality ? cardData.billingAddress.delegationMunicipality : "";
      address.neighborhoodId = cardData.billingAddress.neighborhoodId ? cardData.billingAddress.neighborhoodId : "";
      address.neighbourhood = cardData.billingAddress.neighbourhood ? cardData.billingAddress.neighbourhood : "";
      address.otherColony = cardData.billingAddress.otherColony ? cardData.billingAddress.otherColony : "";
      address.address1 = cardData.billingAddress.address1 ? cardData.billingAddress.address1 : "";
      address.interiorNumber = cardData.billingAddress.interiorNumber ? cardData.billingAddress.interiorNumber : "";
      address.building = cardData.billingAddress.building ? cardData.billingAddress.building : "";
      address.address2 = cardData.billingAddress.address2 ? cardData.billingAddress.address2 : "";
      address.address3 = cardData.billingAddress.address3 ? cardData.billingAddress.address3 : "";
      address.exteriorNumber = cardData.billingAddress.exteriorNumber ? cardData.billingAddress.exteriorNumber : "";
      address.phoneNumber = this.phoneValue ? this.phoneValue : "";
      address.businessPhoneCode = this.lada2Value ? this.lada2Value : "";
      address.businessPhoneNumber = this.phone2Value ? this.phone2Value : "";
      address.cellular = cardData.billingAddress.cellular ? cardData.billingAddress.cellular : "";
      address.particularPhoneCode = this.ladaValue ? this.ladaValue : "";
      address.otherColony = cardData.billingAddress.neighborhoodId === '-2' ? cardData.billingAddress.neighbourhood : "";
      return { address }
    })
  }


  cancelAddCard = () => {
    if (Router && Router.router && Router.router.query && Router.router.query.id) {
      Router.push("/tienda/checkout/airtimeTicket");
    } else {
      Router.push("/tienda/users/creditCards");
    }

  }
  // added for 23887
  getMinCardLength =(type) =>{
    let minLength = '8';
    if(type && type !=='' && this.props.data.cardLengthInfo){
      let currentObj = {};
      for(let k in this.props.data.cardLengthInfo){
         currentObj = this.props.data.cardLengthInfo[k];
         if(currentObj && currentObj.key === type){
           return currentObj.min;
         }
      }
    }
    return minLength;
  }
// added for 23887
  getMaxCardLength =(type) =>{
    let maxLength = '16';
    if(type && type !=='' && this.props.data.cardLengthInfo){
      let currentObj = {};
      for(let k in this.props.data.cardLengthInfo){
         currentObj = this.props.data.cardLengthInfo[k];
         if(currentObj && currentObj.key === type){
           return currentObj.max;
         }
      }
    }
    return maxLength;
  }
  //#23925
  handleAllowOnlyDigit = (e) => {
    const { AddressData } = this.state;
    const limitLength = e.target.maxLength;
    const keyCode = e.keyCode;
    if(e.shiftKey){
      return false;
    }
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

  render() {
    const staticLabels = this.props.staticLabels;
    const { countryList, stateList, municipalityList, settlementList, changeToText, address, editFlag, changeToTextForCountry, staticMetaTags, errorPassword, otherColonyTextInput,errorCardNum } = this.state;
    const creditCardNumber = address.creditCardNumber && address.creditCardNumber.substr(address.creditCardNumber.length - 4);
    // const staticLabels = staticMetaTags && staticMetaTags.staticLabelValues[0] && staticMetaTags.staticLabelValues[0].keyValues;
    let optionCaption = ''
    let stateObject = ''
    if (stateList.length > 1) {
      optionCaption = staticLabels && staticLabels['pwa.newCreditCardPage.selectCardType.text'];
    }
    if(address.stateId === ''){
      stateObject = stateList
    }else {
      stateObject = [{
        id: address.stateId,
        value: address.state
      }]
    }

    let cardList = [];
    cardList.unshift({});
    const orderedcardtypesmap = this.state.cardTypeList;
    orderedcardtypesmap && orderedcardtypesmap.forEach(function(item) {
      Object.keys(item).forEach(function(key) {
        const obj = {id: key, value: item[key]}
        cardList.push(obj);
      }); 
    });
    this.creditCardTypeList = cardList;
    let cardTypeValue = address.creditCardType;
    this.creditCardTypeList.map(item => {if(item.id == address.creditCardType){
      cardTypeValue = item.value
    }})
   
    const municipalityObject = [{
      id: address.delegationMunicipalityId,
      value: address.delegationMunicipality
    }]
    let settlementObject = [];
    let colonyList = [];
    if (settlementList.length > 2) {
      settlementList.map((item, index) => {
        const object = {};
        object.id = item.id;
        object.value = item.value;
        if (address.neighborhoodId === item.id) {
          object.selected = true
        } else if (index === 1 && address.neighborhoodId !== '-2') {
          object.selected = true
        }
        colonyList.push(object);
      })

    } else if(address.neighborhoodId === '-2') {
      settlementObject = [{
        id: address.neighborhoodId,
        value: 'Otra Colonia'
      }]
      colonyList = settlementObject;
    }else if(address.neighborhoodId) {
      settlementObject = [{
        id: '-2',
        value: 'Otra Colonia'
      },
      { id: address.neighborhoodId,
        value: address.neighbourhood,
        selected: true}]
      colonyList = settlementObject;
    }else {
      colonyList = settlementList;
    }
    let nombreCorto = {
      inputId: 'nickname',
      nameInput: 'nickname',
      labelText: staticLabels && staticLabels['pwa.newCreditCardPage.nickName.label'],
      helperText: staticLabels && staticLabels["pwa.creditCardsPage.tarjeta3.label"],
      helperTextId: 'helper__shortName',
      required: true,
      type: 'text',
      maxlength: '30'

    }
    let typeCard = {
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.rowHeader1.label'],
      labelId: 'creditCardType',
      selected: true,
      selectId: 'typeCard',
      required: true,
      optionList: this.creditCardTypeList,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      //optionCaption: staticLabels && staticLabels['pwa.newCreditCardPage.selectCardType.text']
    }
    // added or updated for 23887
    let numCard = {
      inputId: 'creditCardNumber',
      nameInput: 'creditCardNumber',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.rowHeader2.label'],
      helperText: this.state.address.creditCardNumber ? "La longitud de los números debe ser mayor a " +(this.getMinCardLength(address.creditCardType) )+ " dígitos" : staticLabels && staticLabels['pwa.creditCardsPage.numero.label'],
      helperTextId: 'helper__numCard',
      required: true,
      type: 'tel',
      maxlength: (this.getMaxCardLength(address.creditCardType) ),
      minLength: (this.getMinCardLength(address.creditCardType) ),
    }
    let nombre = {
      inputId: 'firstName',
      nameInput: 'firstName',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.nombre1.label'],
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.nombre.label'],
      helperTextId: 'helper__name',
      required: true,
      type: 'text',
      maxlength: '100'
    }
    let secondName = {
      inputId: 'middleName',
      nameInput: 'middleName',
      labelText: staticLabels && staticLabels['pwa.nameFormPage.middleName.label'],
      required: false,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      type: 'text',
      maxlength: '100'
    }
    let apellidoP = {
      inputId: 'lastName',
      nameInput: 'lastName',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.paterno1.label'],
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.paterno.label'],
      helperTextId: 'helper__lastName',
      required: true,
      type: 'text',
      maxlength: '100'
    }
    let apellidoM = {
      inputId: 'maternalName',
      nameInput: 'maternalName',
      labelText: staticLabels && staticLabels['pwa.nameFormPage.maternalName.label'],
      required: false,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      type: 'text',
      maxlength: '100'

    }
    let cp = {
      inputId: 'postalCode',
      nameInput: 'postalCode',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.cp.label'],
      helperText: address.postalCode ? 'El Código Postal debe ser de 5 dígitos.' : staticLabels && staticLabels['pwa.creditCardsPage.cperror.label'],
      helperTextId: 'helper__cp',
      required: true,
      type: 'tel',
      maxlength: '5'
    }

    let city = {
      inputId: 'city',
      nameInput: 'city',
      labelText: staticLabels && staticLabels['pwa.addressFormPage.city.label'],
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.ciudaderror.label'],
      helperTextId: 'helper__city',
      required: true,
      type: 'text',
      maxlength: '40'
    }
    let street = {
      inputId: 'address1',
      nameInput: 'address1',
      labelText: staticLabels && staticLabels['pwa.addressFormPage.street.label'],
      helperText: 'Ingresa tu calle',
      helperTextId: 'helper__street',
      required: true,
      type: 'text',
      maxlength: '100'
    }
    let numext = {
      inputId: 'exteriorNumber',
      nameInput: 'exteriorNumber',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.numext.label'],
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.numeroerror.label'],
      helperTextId: 'helper__numext',
      required: true,
      type: 'text',
      maxlength: '10'
    }
    let numint = {
      inputId: 'interiorNumber',
      nameInput: 'interiorNumber',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.numint.label'],
      required: false,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      type: 'text',
      maxlength: '10'
    }
    let building = {
      inputId: 'building',
      nameInput: 'building',
      labelText: staticLabels && staticLabels['pwa.addressFormPage.building.label'],
      required: false,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      type: 'text',
      maxlength: '100'
    }
    let betweenStreet = {
      inputId: 'address2',
      nameInput: 'address2',
      labelText: 'Entre calle',//staticLabels && staticLabels['pwa.displayAddressInfoPage.Streets.Text']
      required: false,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      type: 'text',
      maxlength: '100'
    }
    let betweenStreet2 = {
      inputId: 'address3',
      nameInput: 'address3',
      labelText: staticLabels && staticLabels['pwa.addressFormPage.betweenStreet2.label'],
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      required: false,
      type: 'text',
      maxlength: '100'
    }
    let lada = {
      inputId: 'particularPhoneCode',
      nameInput: 'particularPhoneCode',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.Lada.label'],
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.laddaerror.label'],
      helperTextId: 'helper__lada',
      required: true,
      type: 'tel',
      maxlength: '3'
    }
    let phone = {
      inputId: 'phoneNumber',
      nameInput: 'phoneNumber',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.telefona.label'],
      helperText: staticLabels && staticLabels['pwa.addressFormPage.invalidTelephoneNum.errorMsg'],
      required: true,
      helperTextId: 'helper__phone',
      type: 'tel',
      maxlength: '8'
    }
    let lada2 = {
      inputId: 'businessPhoneCode',
      nameInput: 'businessPhoneCode',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.Lada.label'],
      type: 'tel',
      maxlength: '3'
    }
    let phone2 = {
      inputId: 'businessPhoneNumber',
      nameInput: 'businessPhoneNumber',
      labelText: staticLabels && staticLabels['pwa.displayAddressInfoPage.Phone.Text'],
      helperText: 'Opcional oficina',
      helperTextId: 'helper-text-id',
      type: 'tel',
      maxlength: '8'
    }
    let cellphone = {
      inputId: 'cellular',
      nameInput: 'cellular',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.cellularerror.label'],
      required: false,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.Opcional.label'],
      helperTextId: 'helper-text-id',
      type: 'tel',
      maxlength: '10'
    }
    let stateListOptions = {
      labelText: staticLabels && staticLabels['pwa.addressFormPage.state.label'],
      labelId: 'state',
      selected: true,
      optionList: stateList.length > 1 ? stateList : stateObject, // stateList mantain after service call
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      required: true,
      //optionCaption

    }
    //For textInput 
    let stateListOptionsText = {
      inputId: 'state',
      nameInput: 'state',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.estado.label'],
      required: true,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      type: 'text',
      maxlength: '100'
    }
    // for selection Tab
    let colonyListOptions = {
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.colonia.label'],
      labelId: 'neighbourhood',
      selected: true,
      optionList: colonyList,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      required: true,
      //optionCaption: staticLabels && staticLabels['pwa.newCreditCardPage.selectCardType.text']
    }
    //for Input Select
    let colonyOptionsText = {
      inputId: 'neighbourhood',
      nameInput: 'neighbourhood',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.colonia.label'],
      required: true,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      type: 'text',
      maxlength: '100'
    }
    // for selection Tab
    let municipalityListOptions = {
      labelText: staticLabels && staticLabels['pwa.addressFormPage.deleg.label'],
      labelId: 'delegationMunicipality',
      selected: true,
      optionList: municipalityList.length > 1 ? municipalityList : municipalityObject,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      required: true,
    }
    //for Input Select
    let municipalityOptionsText = {
      inputId: 'delegationMunicipality',
      nameInput: 'delegationMunicipality',
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.delegacion.label'],
      required: true,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      type: 'text',
      maxlength: '100'
    }
    let countriesListOptions = {
      labelText: staticLabels && staticLabels['pwa.creditCardsPage.pais.label'],
      labelId: 'country',
      selected: true,
      optionList: countryList,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      required: true,
    }
    let otherColony = {
      inputId: 'otherColony',
      nameInput: 'otherColony',
      labelText: staticLabels && staticLabels['pwa.addressFormPage.otherColony.label'],
      required: true,
      helperText: staticLabels && staticLabels['pwa.creditCardsPage.opicion.label'],
      type: 'text',
      maxlength: '100'
    }
    return (
      <div className="m-box o-myAccount__editCards mb-5">
        <div className="row mt-0 mt-lg-3">
          <div className="col-6 col-lg-9">
            <H1 headLineText={staticLabels && staticLabels["pwa.newCreditCardPage.heading1.text"]} headLineClass="a-cards__infoCardTitle" />
          </div>
          <div className="col-6 col-lg-3">
            <Span spanClassname="a-cards__requestLabel pt-2 pb-4 pt-lg-0 pb-lg-0">{staticLabels && staticLabels["pwa.newCreditCardPage.requiredFields.text"]}  </Span>
          </div>
        </div>
        <div className="row" style={{ display: this.state.editFlag ? 'none' : '' }}>
          <div className="col-lg-4 mb-2">
            <InputText options={nombreCorto} handleChange={this.handleOnChange} ref={nm => this.nickname = nm} />
          </div>
          <div className="col-lg-4 mb-2">
            <InputSelect options={typeCard} handleChange={this.handleOnSelectChange} inputValue={address.creditCardType} ref={creditCard => this.creditCardType = creditCard} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={numCard} handleChange={this.handleOnChange} onBlur={this.onBlur} validationtype={"onlyNumbers"} ref={cn => this.creditCardNumber = cn} inputValue={address.creditCardNumber} slow={true} error={errorCardNum}/>
          </div>
        </div>
        <div className="row" style={{ display: this.state.editFlag ? '' : 'none' }}>
          <div className="col-lg-12">
            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.creditCardsPage.rowHeader1.label"]} </Paragraph>
            <Paragraph className="a-cards__descriptionCardBox">{cardTypeValue}</Paragraph>
            <Paragraph className="a-cards__titleCardBox">{staticLabels && staticLabels["pwa.creditCardsPage.rowHeader2.label"]} </Paragraph>
            <Paragraph className="a-cards__descriptionCardBox">*{creditCardNumber}</Paragraph>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={nombreCorto} handleChange={this.handleOnChange} inputValue={this.newNickname ? this.newNickname : this.oldNickName} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <H1 headLineText={staticLabels && staticLabels["pwa.newCreditCardPage.personalHeading.text"]} headLineClass="a-cards__infoCardTitle" />
          </div>
          <div className="col-lg-4 mb-2 mt-4 mt-lg-0">
            <InputText options={nombre} handleChange={this.handleOnChange} inputValue={address.firstName} ref={cn => this.firstName = cn} validationtype={'onlyText'} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={secondName} handleChange={this.handleOnChange} inputValue={address.middleName} validationtype={'onlyText'} />
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={apellidoP} handleChange={this.handleOnChange} inputValue={address.lastName} ref={cn => this.lastName = cn} validationtype={'onlyText'} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={apellidoM} handleChange={this.handleOnChange} inputValue={address.maternalName} validationtype={'onlyText'} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <H1 headLineText={staticLabels && staticLabels["pwa.newCreditCardPage.addressheading.label"]} headLineClass="a-cards__infoCardTitle" />
          </div>
          <div className="col-lg-4 mb-2 mt-4 mt-lg-0">
            <InputSelect options={countriesListOptions} value={address.country} handleChange={this.handleOnCountryChange} ref={cn => this.country = cn} />
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={cp} onBlur={this.addressSearch} handleChange={this.handleOnChange} ref={cp => this.postalCode = cp} inputValue={address.postalCode} validationtype={"onlyNumbers"} onKeyDown={(e) => { this.handleAllowOnlyDigit(e); } /* 23925*/} error={errorPassword} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            {changeToTextForCountry ?
              <InputText options={stateListOptionsText} handleChange={this.handleOnStateChange} inputValue={address.state} ref={st => this.stateValueText = st} validationtype={'onlyText'} slow={true}/> :
              <InputSelect options={stateListOptions}
                name="stateId"
                value={address.state}
                handleChange={this.handleOnSelectChange}
                error_message="Error Estado"
                required
                ref={st => this.stateValue = st}
                value={address.state}
              />}


          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={city} handleChange={this.handleOnChange} inputValue={address.city} ref={ct => this.city = ct} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            {changeToText ?
              <InputText options={municipalityOptionsText} handleChange={this.handleOnChange} inputValue={address.delegationMunicipality} ref={dm => this.delegationMunicipalityText = dm} slow={true}/> :
              <InputSelect options={municipalityListOptions} value={address.municipality} handleChange={this.handleOnSelectChange} ref={dm => this.delegationMunicipality = dm} value={address.delegationMunicipality} />
            }

          </div>
          <div className="col-lg-4 mb-2">
            {changeToText ?
              <InputText options={colonyOptionsText} handleChange={this.handleOnChange} inputValue={address.neighbourhood} ref={nbr => this.neighbourhoodText = nbr} slow={true}/> :
              <InputSelect options={colonyListOptions} value={address.neighbourhood}
                handleChange={this.handleOnSelectChange} ref={nbr => this.neighbourhood = nbr} />
            }

          </div>
          {otherColonyTextInput &&
            <div className="col-lg-4 mb-2">
              <InputText options={otherColony} handleChange={this.handleOnChange} inputValue={address.otherColony} ref={ad => this.otherColony = ad} slow={true}/>
            </div>}
          <div className="col-lg-4 mb-2">
            <InputText options={street} handleChange={this.handleOnChange} inputValue={address.address1} ref={ad => this.address1 = ad} slow={true}/>
          </div>
          <div className="col-6 col-lg-2 mb-2">
            <InputText options={numext} handleChange={this.handleOnChange} ref={exnum => this.exteriorNumber = exnum} inputValue={address.exteriorNumber} validationtype={"onlyNumbersWithCharacters"} slow={true}/>
          </div>
          <div className="col-6 col-lg-2 mb-2">
            <InputText options={numint} handleChange={this.handleOnChange} ref={intnum => this.interiorNumber = intnum} inputValue={address.interiorNumber} validationtype={"onlyNumbersWithCharacters"} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={building} handleChange={this.handleOnChange} inputValue={address.building} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={betweenStreet} handleChange={this.handleOnChange} inputValue={address.address2} />
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={betweenStreet2} handleChange={this.handleOnChange} inputValue={address.address3} />
          </div>
          <div className="col-4 col-lg-2 mb-2">
            <InputText options={lada} handleChange={this.handleOnChange} onBlur={this.onBlur} validationtype={"onlyNumbers"} error={this.state.ladaErrorValid} ref={la => this.particularPhoneCode = la} inputValue={address.particularPhoneCode} slow={true}/>
          </div>
          <div className="col-8 col-lg-2 mb-2">
            <InputText options={phone} handleChange={this.handleOnChange} onBlur={this.onBlur} onFocus={this.onFocus} validationtype={"onlyNumbers"} error={this.state.phoneErrorValid} ref={ph => this.phoneNumber = ph} inputValue={address.phoneNumber} slow={true}/>
          </div>
          <div className="col-4 col-lg-2 mb-2">
            <InputText options={lada2} handleChange={this.handleOnChange} onBlur={this.onBlur} validationtype={"onlyNumbers"} error={this.state.lada2ErrorValid} ref={la2 => this.businessPhoneCode = la2} inputValue={address.businessPhoneCode} slow={true}/>
          </div>
          <div className="col-8 col-lg-2 mb-2">
            <InputText options={phone2} handleChange={this.handleOnChange} onBlur={this.onBlur} onFocus={this.onFocus} error={this.state.phone2ErrorValid} validationtype={"onlyNumbers"} ref={ph2 => this.businessPhoneNumber = ph2} inputValue={address.businessPhoneNumber} slow={true}/>
          </div>
          <div className="col-lg-4 mb-2">
            <InputText options={cellphone} handleChange={this.handleOnChange} validationtype={"onlyNumbers"} ref={cl => this.cellular = cl} inputValue={address.cellular} error={this.state.cellphonePassword} slow={true}/>
          </div>
        </div>
        <div className="row mt-4 mb-4">
          <div className="col-12">
            <Paragraph className="a-mycards__termsText">{staticLabels && staticLabels["pwa.newCreditCardPage.legaTerms.text"]}<a target="_blank" href={staticLabels && staticLabels["pwa.newCreditCardPage.condition.text"]} style={{ color: '#e10098', textDecoration: 'underline' }} className="a-mycards__termsLink">{staticLabels && staticLabels["pwa.newCreditCardPage.termsAndPrivacyLink.text"]}</a></Paragraph>
          </div>
          <div className="col-lg-3 mb-3 order-1 order-lg-2">
            <Button handleClick={this.submit} className="a-btn a-btn--primary">{staticLabels && staticLabels['pwa.newCreditCardPage.okButton.label']}</Button>
          </div>
          <div className="col-lg-3 mb-3 order-2 order-lg-1">
            <Button handleClick={this.cancelAddCard} className="a-btn a-btn--secondary">{staticLabels && staticLabels['pwa.newCreditCardPage.cancelButton.label']}</Button>
          </div>
        </div>


        {/*</div>
                </div>
            </div>*/}
      </div>
    )
  }
}
