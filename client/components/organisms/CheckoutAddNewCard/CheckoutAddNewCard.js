//import './CheckoutAddNewCard.styl'

/**
* Module Name : AddNewCreditCardForm
* Functionality : Component used to show the credit card form dynamically. This is get called from \components\templates\checkout\CheckoutStep2AddNewCardLogin.js and \components\templates\checkout\CheckoutStep2PaymentLogin.js
* @exports : AddNewCreditCardForm
* @requires : module:React
* @requires : module:/molecules/PaymentSectionHeader/PaymentSectionHeader
* @requires : module:/molecules/MaterialInputText/MaterialInputText
* @requires : module:/atoms/Input/Input
* @requires : module:/atoms/Label/Label
* @requires : module:/molecules/MaterialSelect/MaterialSelect
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/molecules/RequestedCardInformation/RequestedCardInformation
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/molecules/MaterialInputCheckBox/MaterialInputCheckBox
* @requires : module:/helpers/utilities/Validate
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* Team : Checkout Team
* Other information : Showing the credit card form dynamically.
* 
*/
import PaymentSectionHeader from '../../molecules/PaymentSectionHeader/PaymentSectionHeader';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import Input from "../../atoms/Input/Input";
import Label from '../../atoms/Label/Label';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Image from '../../atoms/Tagimage/Image';
import RequestedCardInformation from '../../molecules/RequestedCardInformation/RequestedCardInformation';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import { Validate } from '../../../helpers/utilities/Validate';
import { Utility,logError,logDebug, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
/**
 * @class CheckoutPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class AddNewCreditCardForm extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */  
  constructor(props) {
    const billingAddress = props.editCardInfoDetails && props.editCardInfoDetails.billingAddress || {};
    let creditCardNumber = props.editCardInfoDetails && props.editCardInfoDetails.creditCardNumber? '* '+ props.editCardInfoDetails.creditCardNumber.substr(props.editCardInfoDetails.creditCardNumber.length - 4) : ""
    if(billingAddress && billingAddress.country && (billingAddress.country === 'MX' || billingAddress.country.toLowerCase() === 'méxico' || billingAddress.country.toLowerCase() === 'mexico')){
      billingAddress.country = 'MX';
    }
    super(props);
    this.state = {
      address: {
        shortName: props.editCardInfoDetails && props.editCardInfoDetails.nickName || '',
        country: billingAddress && billingAddress.country || 'MX',
        postalCode: billingAddress && billingAddress.postalCode || '',
        city: billingAddress && billingAddress.city || '',
        stateId: billingAddress && billingAddress.stateId || '',
        municipality: billingAddress && billingAddress.delegationMunicipality || '',
        delegationMunicipalityId: billingAddress && billingAddress.delegationMunicipalityId || '',
        colonyName: billingAddress && billingAddress.neighbourhood || '',
        colony: billingAddress && billingAddress.neighborhoodId || '',
        street: billingAddress && billingAddress.address1 || '',
        noExt: billingAddress && billingAddress.exteriorNumber || '',
        noInt: billingAddress && billingAddress.interiorNumber || '',
        building: billingAddress && billingAddress.building || '',
        betweenStreet: billingAddress && billingAddress.address2 || '',
        andStreet: billingAddress && billingAddress.address3 || '',
        phoneWithLADA: billingAddress && billingAddress.phoneNumber && billingAddress.phoneNumber.replace(/[^\d]/g, '') || '',
        cellphone: billingAddress && billingAddress.phoneNumber && billingAddress.phoneNumber.replace(/[^\d]/g, '') || '',
        firstName: billingAddress && billingAddress.firstName || '',
        lastName: billingAddress && billingAddress.lastName || '',
        motherLastName: billingAddress && billingAddress.maternalName || '',
        editCardNumber:  creditCardNumber || '',
        cardNumber:  props.editCardInfoDetails && props.editCardInfoDetails.creditCardNumber || '',
        Typeofcard: props.editCardInfoDetails && props.editCardInfoDetails.creditCardType || false,
        useDeliveryAddr: false,
        setAsDefault: false,
        stateName: billingAddress && billingAddress.state || '',
        municipalityText: billingAddress && billingAddress.delegationMunicipality || '',
        colonyText: billingAddress && billingAddress.neighbourhood || '',
        otherColony: (billingAddress && billingAddress.neighborhoodId === '-2')? billingAddress.neighbourhood : ''
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
      oldStateList: [],
      focused: {

      },
      errors: {

      },
      guatamalaCountry: false,
      cardlengthsmap: [],
      liverpool: [],
      americanExpress: 0,
      visa: [],
      fabricasDeFrancia: [],
      LPC: 0,
      masterCard: 0,
      countriesLis: [],
      addressSearchErrorText: '',
      cardTypesList: [],
      editCardTypeDisplayText : ''
    }
  }


    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
  componentDidMount() {
    this.getStates();
    this.getCountries();
    if (this.props.editCardInfoDetails && this.props.editCardInfoDetails.billingAddress && this.props.editCardInfoDetails.billingAddress.postalCode) {
      this.addresssearchAPI(this.state.address.postalCode)
    }
    this.getConfiguration()

  }

  /**
  * Method will call to fetch configuration details.
  * @function getConfiguration
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating state with credit card types related status from the configuration details.
  * 
  */
  getConfiguration = () => {
    const { configurationData } = this.props;
    let { cardlengthsmap, liverpool, americanExpress, visa, fabricasDeFrancia, LPC, masterCard, cardTypesList } = this.state;
    // Utility(Path.fetchConfiguration, 'GET').then(response => {
    //   if (response && response.data) {
        let globalConfigData = configurationData;
        cardlengthsmap = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.cardlengthsmap;
        let orderedcardtypesmap = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.orderedcardtypesmap;
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
        if(orderedcardtypesmap){
          cardTypesList = Object.keys(orderedcardtypesmap).map(key => {
              const obj = orderedcardtypesmap[key];
              const value = Object.keys(obj)[0];
              const name = obj[value];
              return { name, value }
          })
        }
        this.setState({
          americanExpress,
          visa,
          liverpool,
          fabricasDeFrancia,
          LPC,
          masterCard,
          cardTypesList
        });
    //   }


    // });
  }

  /**
  * Method will call to validate form.
  * @function subValidateForm
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating request card information form fields.
  * @return {object} *
  * 
  */
  subValidateForm = () => {
    return this.refs.requestedCardInformationRef.validateForm();
  }

  /**
  * Method will call to fetch countries list.
  * @function getCountries
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTful service call to fetch countries list.
  * @param {boolean} isTrue
  * 
  */
  getCountries = (isTrue) => {
    let { countries, address, countriesLis } = this.state;
    if (isTrue && isTrue === true) {
      countries.optionList[0].name = address.country;
      this.setState({ countries });
    } else if (isTrue && isTrue === false) {
      countries.optionList = countriesLis;
      this.setState({ countries });
    } else {
      countries.optionList = [{}];
      Utility(Path.getcountry, 'GET').then(response => {
        let countriesList = [];
        if(response && response.data){
          countriesList = Object.keys(response.data).map(key => {
            const obj = response.data[key];
            const value = Object.keys(obj)[0];
            const name = obj[value];
            if(this.props.editCardTextMessage && (address.country == value || address.country == name)){ // start 23300
              address.country = value;
            }// start 23300
            return { name, value }
          })
        }
        countries.optionList = countriesList || []
        countriesLis = countriesList;
        this.setState({ countries, countriesLis, address });// change for 23300
      });
    }
  }

  /**
  * Method will call to search address based on given zipcode.
  * @function addresssearchAPI
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTfull service call to search address based on given postal code.
  * @param {number} PostalCode
  * @param {boolean} fieldBlur
  * 
  */
  addresssearchAPI = (PostalCode, fieldBlur) => {
    const shippingAddress = this.props.shippingAddressDetail || {}
    // service addresssearch change GET from POST method :: Start
    let payLoad = '?action=EMA&cp=' + PostalCode;
    Utility(Path.addresssearch + payLoad, 'GET').then(response => {
    // service addresssearch change GET from POST method :: End
      let { address, editAddress, labels, errors, addressSearchErrorText, oldStateList, stateList } = this.state;
      if (response && response.data && response.data.s === '1') {
        //this.props.show_alert(response.data.err);
        addressSearchErrorText = response.data.err;
        stateList = oldStateList; 
        if(!this.props.editCardTextMessage && !address.useDeliveryAddr){
           address.stateId = '';
        }else{
           const stateObj = stateList.filter(state => state.name === shippingAddress.state)[0];
          if (stateObj && stateObj.name) {
            address.stateId = stateObj.value
          }
        }
        this.props.show_alert_message(addressSearchErrorText, 'alert');
        this.setState({ addressSearchErrorText, address, stateList });
      } else if (PostalCode && response.data.s === '0') {
        addressSearchErrorText = '';
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
        }) || [];

        if (fieldBlur) {
          if(shippingAddress.nickName){
            const state_filter = stateList.filter(state => state.name === shippingAddress.state)[0];
            if(state_filter && state_filter.value){
              address.stateId = state_filter.value;
            }else{
              address.stateId = stateList && stateList.length > 0 && stateList[0] ? stateList[0].value : '';  
            }
            const munic_filter = municipalityList.filter(municipality => municipality.name === shippingAddress.deligation)[0];
            if(munic_filter && munic_filter.value){
              address.municipality = munic_filter.value;
            }else{
              address.municipality = municipalityList && municipalityList.length > 0 && municipalityList[0] ? municipalityList[0].value : '';
            }
            if(shippingAddress.colonyId === "-2"){
              address.otherColony = shippingAddress.colony;
              address.colony = "other";
            }else{
              const colony_filter = settlementList.filter(colony => colony.name === shippingAddress.colony)[0];
              if(colony_filter && colony_filter.value){
                address.colony = colony_filter.value;
              }else{
                address.colony = settlementList && settlementList.length > 0 && settlementList[0] ? settlementList[0].value : '';
              }
            }
          }else{
            address.stateId = stateList && stateList.length > 0 && stateList[0] ? stateList[0].value : '';
            address.municipality = municipalityList && municipalityList.length > 0 && municipalityList[0] ? municipalityList[0].value : '';
            address.colony = settlementList && settlementList.length > 0 && settlementList[0] ? settlementList[0].value : '';
          }
        }
        const { previousSelection } = this.props;
        if (!fieldBlur && this.props.manualClick === false && previousSelection && previousSelection.postalCode) {
          const stateObj = stateList.filter(state => state.name === previousSelection.state)[0];
          if (stateObj && stateObj.name) {
            address.stateId = stateObj.value
          }
          address.municipality = previousSelection.delegationMunicipalityId || '';
          address.colony = previousSelection.colonyId || '';
        }
        const selectedState = stateList.filter(obj => obj.value === address.stateId);
        if (selectedState.length === 0 || !address.stateId) {
          address.stateId = stateList.length > 0 ? stateList[0].value : '';
        }

        if (address.stateId) errors.stateId = false;
        if (address.municipality) errors.municipality = false;
        if (address.colony) errors.colony = false;

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
      logError("Error ==== :: ", error);
    });
  }

  /**
  * Method will call on blur of postal code input field.
  * @function handlePostalCodeBlur
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating given postal code is valid or not. If invalid, showing proper alert message.
  * @param {object} e
  * 
  */
  handlePostalCodeBlur = (e) => {
    let { address, errors, addressSearchErrorText, oldStateList, stateList } = this.state;
    this.handleBlur(e);
    if (e.target.value && e.target.value.length === 5 && e.target.value !== '00000') {
      this.addresssearchAPI(e.target.value, true);
    } else if (e.target.value) {
      stateList = oldStateList; 
      address.stateId = '';
      // addressSearchErrorText = this.props.staticLabelValues['pwa.checkoutBillingPage.postalCode.incorrect.text'];
      if(e.target.value === '00000'){
         address.postalCode = "";
      }
      // if (e.target.value.length !== 5) {
      //   addressSearchErrorText = this.props.staticLabelValues['pwa.checkoutBillingPage.postalCode.maxLength.text'];
      // }
      // this.props.show_alert_message(addressSearchErrorText, 'alert');
      // addressSearchErrorText = "";
      errors.postalCode = true;
      this.setState({ address, errors, stateList });
    } else {
      address.postalCode = e.target.value;
      errors.postalCode = true;
      // addressSearchErrorText = '';
      this.setState({ address, errors });
    }
  }


  /**
  * Method will call to fetch states list.
  * @function getStates
  * @author srinivasa.gorantla@zensar.com
  * @desc Making RESTful service call to fetch states list.
  * 
  */
  getStates = () => {
    // Utility(Path.getListOfStates+"ITR", 'GET' /*, { "ITR": "ITR" }*/).then(response => {
    //   let { stateList, oldStateList } = this.state;
    //   if (response && response.data && response.data.estados) {
    //     stateList = Object.keys(response.data.estados).map(key => {
    //       const obj = response.data.estados[key];
    //       const value = obj.stateId;
    //       const name = obj.stateName;
    //       return { name, value }
    //     })
    //   }
    //   oldStateList = stateList;
    //   this.setState({ stateList, oldStateList });
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

  /**
  * Method will call to validate form
  * @function validateForm
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating form fields and showing proper error message if field is invalid.
  * 
  */
  validateForm = () => {
    const requestedCardInformationPromise = this.refs.requestedCardInformationRef.validateForm();
    return new Promise((resolve, reject) => {

      const { address, municipalityList, neighbourhoodList, settlementList, stateList, addressSearchErrorText } = this.state;
      var errors = {};

      if (!address.shortName) { errors.shortName = true; }
      if (!address.country) { errors.country = true; }
      if (!address.postalCode || address.postalCode.length !== 5) { errors.postalCode = true; }
      if (!address.city) { errors.city = true; }
      if (!address.municipality && !address.municipalityText) { errors.municipality = true; }
      if (!address.colony && !address.colonyText) { errors.colony = true; }
      if (address.colony && address.colony === 'other' && !address.otherColony) { errors.otherColony = true; }
      if (!address.street) { errors.street = true; }
      if (!address.noExt) { errors.noExt = true; }
      if (!address.phoneWithLADA) { errors.phoneWithLADA = true; }
      if (!address.firstName) { errors.firstName = true; }
      if (!address.lastName) { errors.lastName = true; }
      if (!address.stateId) { errors.stateId = true; }
      if (!address.cardNumber) { errors.cardNumber = true; }
      if (!address.Typeofcard || address.Typeofcard === 'false') { errors.Typeofcard = true; }
      if (address.cardNumber) {
        const cardnumber = address.cardNumber;
        let lengthList = this.state[address.Typeofcard];
        lengthList = typeof lengthList === 'string' ? [lengthList] : lengthList;
        const length = cardnumber.length;
        if(!this.props.editCardTextMessage){
          if (lengthList && lengthList.indexOf(length.toString()) === -1) {
            errors.inValidCardNumber = true;
          }
        }
      }


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
        address.stateName = (state && state[0]) ? state[0].name : (address.stateName || '');
        address.businessPhoneCode = address.phoneWithLADA.substring(0, 3);
        address.businessPhoneNumber = address.phoneWithLADA.substring(3);

        requestedCardInformationPromise.then((data) => {
          return resolve({ data, address })
        })
      } else {
      //  console.log("errors ------------------------ ", errors);
        this.setState({ errors });
        return reject({})
      }

    });
  }

  /**
  * Method will call on selection of copy shipping address check box.
  * @function handleOnCheckBoxChange
  * @author srinivasa.gorantla@zensar.com
  * @desc Copying shipping address based on the selection of the check box status.
  * @param {object} e
  * 
  */
  handleOnCheckBoxChange = (e) => {
    const { address } = this.state;
    const municipalityList = [{}];
    const neighbourhoodList = [{}];
    const settlementList = [{}];
    const stateList = [{}];
    address[e.target.name] = e.target.checked;
    if (e.target.name !== 'setAsDefault') {
      if (e.target.checked) {
        const shippingAddress = this.props.shippingAddressDetail || {};
        address.postalCode = shippingAddress.postalCode || '';
          address.city = shippingAddress.city || '';
          address.stateName = shippingAddress.state || '';
          address.country = shippingAddress.country || '';
          if(shippingAddress && shippingAddress.delegationMunicipalityId){
             address.municipality = shippingAddress.deligation || '';
          }
          if(shippingAddress.colonyId === "-2"){
            address.otherColony = shippingAddress.colony;
            address.colony = "other";
          }else{
            address.colony = shippingAddress.colonyId || '';
            if(shippingAddress && shippingAddress.colonyId){
              address.colonyName = shippingAddress.colony || '';
            }
          }
          address.street = shippingAddress.street || '';
          address.noExt = shippingAddress.exteriorNumber || '';
          address.noInt = shippingAddress.interiorNumber || '';
          address.building = shippingAddress.building || '';
          address.betweenStreet = shippingAddress.address2 || '';
          address.andStreet = shippingAddress.address3 || '';
          address.phoneWithLADA = shippingAddress.phoneNumber && shippingAddress.phoneNumber.replace(/[^\d]/g, '') || '';
          address.cellphone = shippingAddress.mobilePhoneNumber && shippingAddress.mobilePhoneNumber.replace(/[^\d]/g, '') || '';
          address.municipalityText= shippingAddress && shippingAddress.deligation || '';
          address.colonyText= shippingAddress && shippingAddress.colony || '';
          this.addresssearchAPI(shippingAddress.postalCode, true);
        this.setState({ address });
        this.getCountries(true);
      } else {
        const billingAddress = this.props.editCardInfoDetails.billingAddress || {};
        address.postalCode = billingAddress.postalCode || '',
          address.city = billingAddress.city || '',
          address.stateId = billingAddress.stateId || '',
          address.municipality = billingAddress.delegationMunicipality || '',
          address.country = billingAddress.country || '',
          address.colony = billingAddress.neighborhoodId || '',
          address.colonyName = billingAddress.neighbourhood || '',
          address.street = billingAddress.address1 || '',
          address.noExt = billingAddress.exteriorNumber || '',
          address.noInt = billingAddress.interiorNumber || '',
          address.building = billingAddress.building || '',
          address.betweenStreet = billingAddress.address2 || '',
          address.andStreet = billingAddress.address3 || '',
          address.phoneWithLADA = billingAddress.phoneNumber && billingAddress.phoneNumber.replace(/[^\d]/g, '') || '',
          address.cellphone = billingAddress.phoneNumber && billingAddress.phoneNumber.replace(/[^\d]/g, '') || '';
          address.municipalityText= billingAddress && billingAddress.delegationMunicipality || '',
          address.colonyText= billingAddress && billingAddress.neighbourhood || '',
        this.getCountries(false);
        if (!this.props.editCardTextMessage) {
          const { oldStateList } = this.state;
          this.setState({
            municipalityList,
            neighbourhoodList,
            settlementList,
            stateList: oldStateList,
            address
          });
        } else {
          this.addresssearchAPI(billingAddress.postalCode);
          this.setState({ address });

        }
      }
    }

  }

  /**
  * Method will call on change of select field.
  * @function handleOnSelectChange
  * @author srinivasa.gorantla@zensar.com
  * @desc Fetching guatemal states list if the selected state is guatemala.
  * @param {string} value
  * @param {object} e
  * 
  */
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
      if (this.state.address && !this.state.address.useDeliveryAddr) {
        this.getStates();
      }
    }
    const { cvvMaxLengthHandleByCardType } = this.props;
    if (e.target.value === 'americanExpress') {
      cvvMaxLengthHandleByCardType(true, e);
    } else {
      cvvMaxLengthHandleByCardType(false, e);
    }

    this.handleOnChange(e);
  }

  /**
  * Common form field on change method.
  * @function handleOnChange
  * @author srinivasa.gorantla@zensar.com
  * @desc This is common on change method. Updating state value dynamically.
  * @param {object} e
  * 
  */
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

  /**
  * Method will call on focus of the form field.
  * @function handleOnFocus
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating focus state to update dynamic classes for style update.
  * @param {object} e
  * 
  */
  handleOnFocus = (e) => {
    const { focused } = this.state;
    focused[e.target.name] = true
    this.setState({ focused });
  }

  /**
  * Method will call on blur of the form field.
  * @function handleBlur
  * @author srinivasa.gorantla@zensar.com
  * @desc Updating focus state to update dynamic classes for style update.
  * @param {object} e
  * 
  */
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

  /**
  * Method will call to validate card number length.
  * @function validateCardNumberLength
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating card number and showing proper error message.
  * @param {object} e
  * 
  */
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

  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */
  render() {
    let { address, errors, focused, municipalityList, neighbourhoodList, settlementList, stateList, countries, guatamalaCountry, addressSearchErrorText, cardTypesList, editCardTypeDisplayText } = this.state;
    const { staticLabelValues, editCardTextMessage, configurationData } = this.props;
    if (settlementList.length === 0 || (settlementList[0] && settlementList[0].value !== 'other')) {
      settlementList.unshift({ name: 'OTRA COLONIA', value: 'other' });
    }
    if(editCardTextMessage){
      const orderedcardtypesmap = configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration && configurationData.configuration.liverpoolconfiguration.orderedcardtypesmap || [];
      let cartdTypes = {};
        Object.keys(orderedcardtypesmap).map(key => {
            const obj = orderedcardtypesmap[key];
            const name = Object.keys(obj)[0];
            const value = obj[name];
            cartdTypes[name.toLowerCase()] = value;
        })
      if(cartdTypes[address.Typeofcard]){
         editCardTypeDisplayText = cartdTypes[address.Typeofcard];
      }
    }

    let stateListOptions = { labelText: staticLabelValues['pwa.checkoutBillingPage.state.label'], labelId: 'validity', selected: true, selectText: staticLabelValues['pwa.checkoutBillingPage.state.label'], optionList: stateList };
    let colonyListOptions = { labelText: staticLabelValues['pwa.checkoutBillingPage.colony.text'], labelId: 'validity', selected: true, selectText: staticLabelValues['pwa.checkoutBillingPage.colony.text'], optionList: settlementList };
    let municipalityListOptions = { labelText: staticLabelValues['pwa.checkoutBillingPage.municipality.label'], labelId: 'validity', selected: true, selectText: !editCardTextMessage ? staticLabelValues['pwa.checkoutBillingPage.municipality.label'] : '', optionList: municipalityList };
    let countriesListOptions = { ...countries, labelText : staticLabelValues['pwa.checkoutBillingPage.country.label']};
    cardTypesList = cardTypesList.length === 0 ? [{}] : cardTypesList;
    let cardTypes = { labelText: staticLabelValues["pwa.checkoutBillingPage.cardType.label"], labelId: 'label-cardType', selected: 'selectCardType', optionList: cardTypesList, selectText: 'Seleccionar' }

    let paymentinfo = {
      sectionHeaderClass: "a-sectionHeader__title",
      sectionHeaderText: staticLabelValues['pwa.checkoutBillingPage.BoardDirection.text'],
      secondaryTextClass: 'a-box__requiredMessage',
      secondaryText: staticLabelValues['pwa.checkoutPageBilling.requiredData.text'],
    };

    let optionsI = {
      containerClass: 'm-sectionHeader no-gutters',
      sectionHeaderText: staticLabelValues['pwa.checkoutPageBilling.cardholderdata.text'],
      sectionHeaderClass: 'a-sectionHeader__title',
    }

    var options2 = {
      containerClass: 'm-addressSectionHeader no-gutters',
      sectionHeaderText: staticLabelValues['pwa.checkoutBillingPage.direction.text'],
      sectionHeaderClass: 'a-sectionHeader__title',
    }

    let containerClass = {
      labelText: staticLabelValues['pwa.checkoutBillingPage.cardType.label'],
      className: "m-typeCardContainer__input",
      labelId: 'label-cardType',
      selectId: 'selectCardType',
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

    let pais = {
      containerClass: 'mdc-select mdc-select--outlined --mb-32',
      labelText: 'País',
      labelId: 'label-country',
      selectId: 'selectCountry',
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
    let Estado = {
      containerClass: 'mdc-select mdc-select--outlined --mb-32',
      labelText: 'Estado',
      labelId: 'Estado',
      selectId: 'Estado',
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

    let Delegación = {
      containerClass: 'mdc-select mdc-select--outlined --mb-32',
      labelText: 'Municipio o Delegación',
      labelId: 'Municipio o Delegación',
      selectId: 'Municipio o Delegación',
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
    let Colonia = {
      containerClass: 'mdc-select mdc-select--outlined --mb-32',
      labelText: 'Colonia',
      labelId: 'Colonia',
      selectId: 'Colonia',
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
    let  AssetsPath = '../../..';
    if (typeof window !== 'undefined') {
      const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..'; 
    }else{
      const path = getAssetsPath(undefined,this.props.hostname,process);
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../../';    
  }
    return (
      <div className="o-addNewCardForm">
        <PaymentSectionHeader options={paymentinfo} />
        <div className="col-12 col-lg-6 no-gutters d-flex justify-content-start p-0 flex-column">
          <div className="col-lg-12 pl-lg-0 pr-lg-3 p-0 p-xl-0">
            <InputHelperAssistant
              name="shortName"
              value={address.shortName}
              onChange={this.handleOnChange}
              onFocus={this.handleOnFocus}
              onBlur={this.handleBlur}
              field_focus={focused.shortName}
              field_valid={errors.shortName}
              maxLength={30}
              inputId='shortName'
              className="a-textField__input mdc-text-field__input"
              nameInput='nombreCorto'
              labelText= {staticLabelValues['pwa.checkoutBillingPage.nickName.text']}
              labelPosition='right'
              helperTextId='helper1'
              type="text"
              required
            />
            {errors.shortName &&
              <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
              <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                { errors.shortName && (staticLabelValues['pwa.checkoutPageBilling.nickName.errorMsg'] || staticLabelValues['pwa.checkoutBillingPage.nickName.text']+" es requerido.") }
              </Paragraph>
            </div>
            }
          </div>
          <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
            <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
              {staticLabelValues['pwa.checkoutPageBilling.creditCard.help.text']}
            </Paragraph>
          </div>
        </div>
        <div className={"col-12 no-gutters d-flex justify-content-start p-0"}>
          <div className="col-12 col-lg-6">
            <div className="col-lg-12 pl-lg-0 pr-lg-3 p-0 p-xl-0">
              {
                (this.props.editCardTextMessage) ?
                  <React.Fragment>
                    <InputHelperAssistant
                      name="Typeofcard"
                      value={editCardTypeDisplayText}
                      handleChange={this.handleOnSelectChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.Typeofcard}
                      field_valid={errors.Typeofcard}
                      editCardTextMessage={(this.props.editCardTextMessage) ? true : false}
                      required
                      labelText={staticLabelValues["pwa.checkoutBillingPage.cardType.label"]}
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      </Paragraph>
                    </div>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <MaterialSelect options={cardTypes}
                      name="Typeofcard"
                      value={address.Typeofcard}
                      handleChange={this.handleOnSelectChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.Typeofcard}
                      field_valid={errors.Typeofcard}
                      editCardTextMessage={(this.props.editCardTextMessage) ? true : false}
                      required
                    />
                    <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais">
                            { errors.Typeofcard && staticLabelValues['pwa.checkoutBillingPage.emptyCardType.errorMsg'] }
                        </Paragraph>
                    </div>
                  </React.Fragment>
              }
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <div className="m-cardsThumbnails">
              <Image className="a-cardsThumbnails__rectangleCard" src={AssetsPath + "/static/images/atomo-icono-dilisa-card.png"} alt="Tarjeta Dilisa Liverpool" />
              <Image className="a-cardsThumbnails__rectangleCard" src={AssetsPath + "/static/images/atomo-icono-visa-liver.png"} alt="Tarjeta Visa Liverpool" />
              <Image className="a-cardsThumbnails__squareCard" src={AssetsPath + "/static/images/atomo-icono-amex.png"} alt="Tarjeta Amex" />
              <Image className="a-cardsThumbnails__squareCard--visa" src={AssetsPath + "/static/images/atomo-icono-visa.png"} alt="Tarjeta Visa" />
              <Image className="a-cardsThumbnails__squareCard--master" src={AssetsPath + "/static/images/atomo-icono-mastercard.png"} alt="Tarjeta Mastercard" />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 no-gutters d-block justify-content-start p-0 flex-column">
          <div className="col-lg-12 pl-lg-0 pr-lg-3 p-0 p-xl-0">

            <InputHelperAssistant
              name="cardNumber"
              noRef={true}
              value={(this.props.editCardTextMessage)? address.editCardNumber : address.cardNumber}
              validationtype={(this.props.editCardTextMessage)? 'onlyMaxLength' : "onlyNumbersWithMaxLength"}
              maxLength={(this.props.americanExpressCvv) ? 15 : 16}
              onChange={this.handleOnChange}
              onFocus={this.handleOnFocus}
              onBlur={(e) => {
                this.handleBlur(e);
                this.validateCardNumberLength(e)
              }}
              field_focus={focused.cardNumber}
              field_valid={errors.cardNumber || errors.inValidCardNumber}
              editCardTextMessage={(this.props.editCardTextMessage) ? true : false}
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='cardNumber'
              className="a-textField__input mdc-text-field__input"
              nameInput='numeroTarjeta'
              labelText={staticLabelValues['pwa.checkoutBillingPage.cardNumber.label']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type={(this.props.editCardTextMessage)? 'text' : "tel"}
              required
            />
           
                  {errors.cardNumber &&
                   <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      { errors.cardNumber && staticLabelValues['pwa.checkoutPageBilling.card.required.text'] }
                    </Paragraph>
                  </div>
                  }
                  {errors.inValidCardNumber &&
                   <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      {staticLabelValues['pwa.checkoutPageBilling.card.length.text']}
                    </Paragraph>
                  </div>
                  }
          </div>
        </div>

        <RequestedCardInformation ref="requestedCardInformationRef" isFull={(this.props.editCardTextMessage) ? false : true} {...this.props} />
        <div className="m-sectionHeader no-gutters">
          <PaymentSectionHeader options={optionsI} />
        </div>
        {/* App Start*/}
        <div className="m-cardholderInfo col-12 no-gutters d-flex justify-content-between p-0">
          <div className="d-xl-none d-lg-none">
            <InputHelperAssistant
              name="firstName"
              value={address.firstName}
              onChange={this.handleOnChange}
              onFocus={this.handleOnFocus}
              onBlur={this.handleBlur}
              field_focus={focused.firstName}
              field_valid={errors.firstName}
              validationtype={"textWithSpecialChars"}
              containerClass='m-textField mdc-text-field mdc-text-field--outlined --mb-32'
              inputId='Nombre'
              className="a-textField__input mdc-text-field__input"
              nameInput='nombretarjeta habiente'
              labelText={staticLabelValues['pwa.checkoutBillingPage.name.text']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="text"
              maxLength={250}
              required
            />
            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                  {errors.firstName && staticLabelValues['pwa.checkoutShippingPage.emptyFirstName.errorMsg']}
                </Paragraph>
            </div>
            <InputHelperAssistant
              name="lastName"
              value={address.lastName}
              onChange={this.handleOnChange}
              onFocus={this.handleOnFocus}
              onBlur={this.handleBlur}
              field_focus={focused.lastName}
              field_valid={errors.lastName}
              validationtype={"textWithSpecialChars"}
              containerClass='m-textField mdc-text-field mdc-text-field--outlined --mb-32'
              inputId='ApellidoPaterno'
              className="a-textField__input mdc-text-field__input"
              nameInput='ApellidoPaterno'
              labelText={staticLabelValues['pwa.checkoutBillingPage.lastName.text']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              maxLength={250}
              type="text"
              required
            />
            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                  {errors.lastName && staticLabelValues['pwa.checkoutPageBilling.lastName.required']}
                    </Paragraph>
            </div>
            <InputHelperAssistant
              name="motherLastName"
              value={address.motherLastName}
              onChange={this.handleOnChange}
              onFocus={this.handleOnFocus}
              onBlur={this.handleBlur}
              field_focus={focused.motherLastName}
              field_valid={errors.motherLastName}
              validationtype={"textWithSpecialChars"}
              maxLength={250}
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='ApellidoMaterno'
              className="a-textField__input mdc-text-field__input"
              nameInput='ApellidoMaterno'
              labelText={staticLabelValues['pwa.checkoutBillingPage.mothersName.text']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="text"
            />
              <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                  </Paragraph>
              </div>
          </div>
          {/* App End*/}
          {/* Web Start*/}
          <div className="d-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-40">
            <div className="col-xl-4 d-xl-flex flex-row justify-content-start">
              <div className="col-xl-12 pl-xl-0">
                <InputHelperAssistant
                  name="firstName"
                  value={address.firstName}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.firstName}
                  field_valid={errors.firstName}
                  validationtype={"textWithSpecialChars"}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='Nombre'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='Nombre'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.name.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  maxLength={250}
                  type="text"
                  required
                />
                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      {errors.firstName && staticLabelValues['pwa.checkoutShippingPage.emptyFirstName.errorMsg']}
                    </Paragraph>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-xl-flex flex-row justify-content-between">
              <div className="col-xl-12">
                <InputHelperAssistant
                  name="lastName"
                  value={address.lastName}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.lastName}
                  field_valid={errors.lastName}
                  validationtype={"textWithSpecialChars"}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='ApellidoPaterno'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='ApellidoPaterno'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.lastName.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  maxLength={250}
                  type="text"
                  required
                />
                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      {errors.lastName && staticLabelValues['pwa.checkoutPageBilling.lastName.required']}
                        </Paragraph>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-xl-flex flex-row justify-content-between">
              <div className="col-xl-12 pr-xl-0">
                <InputHelperAssistant
                  name="motherLastName"
                  value={address.motherLastName}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.motherLastName}
                  field_valid={errors.motherLastName}
                  validationtype={"textWithSpecialChars"}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='ApellidoMaterno'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='ApellidoMaterno'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.mothersName.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  maxLength={250}
                  
                  type="text"
                />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                      </Paragraph>
                  </div>
              </div>
            </div>
          </div>
          {/* Web End*/}

          {/* Tab Start*/}
          <div className="d-none d-lg-flex d-xl-none col-12 no-gutters justify-content-between p-0 --mb-46">
            <div className="col-6">
              <div className="col-12 pl-0">
                <InputHelperAssistant
                  name="firstName"
                  value={address.firstName}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.firstName}
                  field_valid={errors.firstName}
                  validationtype={"textWithSpecialChars"}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='Nombre'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='Nombre'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.name.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="text"
                  maxLength={250}
                  required
                />
              </div>
              {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                    {errors.firstName && staticLabelValues['pwa.checkoutShippingPage.emptyFirstName.errorMsg']}
                  </Paragraph>
              </div>*/}
            </div>
            <div className="col-6">
              <div className="col-12 pl-0">
                <InputHelperAssistant
                  name="lastName"
                  value={address.lastName}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.lastName}
                  field_valid={errors.lastName}
                  validationtype={"textWithSpecialChars"}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='ApellidoPaterno'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='ApellidoPaterno'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.lastName.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="text"
                  maxLength={250}
                  required
                />
                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      {errors.lastName && staticLabelValues['pwa.checkoutPageBilling.lastName.required']}
                    </Paragraph>
                </div>*/}
              </div>
            </div>





          </div>


          <div className="d-none d-lg-flex d-xl-none col-12 no-gutters justify-content-start p-0 --mb-46">
            <div className="col-6">
              <div className="col-12 pl-0">
                <InputHelperAssistant
                  name="motherLastName"
                  value={address.motherLastName}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.motherLastName}
                  field_valid={errors.motherLastName}
                  validationtype={"textWithSpecialChars"}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='ApellidoMaterno'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='ApellidoMaterno'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.mothersName.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  maxLength={250}
                  type="text"
                />
                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                    </Paragraph>
                </div>*/}
              </div>
            </div>
          </div>
          {/* Tab End*/}


        </div>

        <div className="m-addressSectionHeader no-gutters">
          <PaymentSectionHeader options={options2} />
        </div>

        {
          ((this.props.shippingAddressDetail && this.props.shippingAddressDetail.nickName && !this.props.shippingAddressDetail.storePickup && !this.props.shippingAddressDetail.digitalInfo) ||  (this.props.shippingAddressDetail && this.props.shippingAddressDetail.postalCode && !this.props.mainContent.showGiftInfoMsg && !this.props.shippingAddressDetail.storePickup)) ? // changes for defect of 23875
            <div className="m-predefinedAddress m-checkout-wrapper">
              <MaterialInputCheckBox text={staticLabelValues['pwa.checkoutBillingPage.copyShippingAddress.text']}
                name="useDeliveryAddr"
                value={address.useDeliveryAddr}
                onChange={this.handleOnCheckBoxChange}
              />
              <div className="m-deliverAddress no-gutters col-12 pb-lg-2 pb-0 pb-xl-0">
                <Span className="a-infoContainer__cardName">{this.props.shippingAddressDetail.nickName}</Span>
                <Paragraph className="a-deliveryAddress__description" style={{ wordBreak: "break-word"}}>{this.props.shippingAddressDetail.street}, {this.props.shippingAddressDetail.city}, {this.props.shippingAddressDetail.colony}, {this.props.shippingAddressDetail.postalCode}, {this.props.shippingAddressDetail.phoneNumber}</Paragraph>
              </div>
            </div>
            : null
        }



        {/*......App..........Start...............*/}
        <div className="m-newAddressInfo">
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
            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                  {errors.country && staticLabelValues["pwa.checkoutBillingPage.country.required.text"]}
                </Paragraph>
            </div>
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
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='CódigoPostal'
              className="a-textField__input mdc-text-field__input"
              nameInput='CódigoPostal'
              labelText={staticLabelValues['pwa.checkoutBillingPage.postalCode.text']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="tel"
              required
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
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='Ciudad'
              className="a-textField__input mdc-text-field__input"
              nameInput='numeroTarjeta'
              labelText={staticLabelValues['pwa.checkoutBillingPage.city.label']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="text"
              required
            />
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
                    inputId='municipalityText' nameInput='municipalityText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.municipality.label']} required />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
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
                  allowWhatEverLength={true}
                  maxLength={100}
                  required />
                <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                  <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
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
                      inputId='colonyText' nameInput='colonyText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.neighbourhood.label']} required  />
              <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
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
              allowWhatEverLength={true}
              maxLength={100}
              required />
              <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                  <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                  {errors.colony && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                </Paragraph>
            </div>
            </React.Fragment>
            }
            { 
                (address.colony === 'other' || address.colony === '-2')?
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
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='Calle'
              className="a-textField__input mdc-text-field__input"
              nameInput='Calle'
              labelText={staticLabelValues['pwa.checkoutBillingPage.street.label']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="text"
              required
            />
            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                  { errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyStreet.errorMsg']}
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
                      validationtype={"onlyNumbersWithCharactersWithSpace"}
                      maxLength={10}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='NumExt'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='NumExt'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.exteriorNumber.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                      required
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                          { errors.noExt && staticLabelValues['pwa.checkoutBillingPage.emptyExtNumber.errorMsg']}
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
                      field_valid={errors.noInt}
                      maxLength={10}
                      validationtype={"onlyNumbersWithCharactersWithSpace"}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='NumInt'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='numeroTarjeta'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.interiorNumber.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                    />
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
                    field_valid={errors.building}
                    maxLength={100}
                    containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                    inputId='Edificio'
                    className="a-textField__input mdc-text-field__input"
                    nameInput='Edificio'
                    labelText={staticLabelValues['pwa.checkoutBillingPage.building.label']}
                    labelPosition='right'
                    text='Ej. Tarjeta de crédito'
                    helperTextId='helper1'
                    
                    
                    type="text"
                  />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                      </Paragraph>
                  </div>
                  <InputHelperAssistant
                    name="betweenStreet"
                    value={address.betweenStreet}
                    onChange={this.handleOnChange}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleBlur}
                    field_focus={focused.betweenStreet}
                    field_valid={errors.betweenStreet}
                    maxLength={100}
                    containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                    inputId='Entrecalle'
                    className="a-textField__input mdc-text-field__input"
                    nameInput='Entrecalle'
                    labelText={staticLabelValues['pwa.checkoutBillingPage.betweenStreet.label']}
                    labelPosition='right'
                    text='Ej. Tarjeta de crédito'
                    helperTextId='helper1'
                    
                    
                    type="text"

                  />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                      </Paragraph>
                  </div>
                  <InputHelperAssistant
                    name="andStreet"
                    value={address.andStreet}
                    onChange={this.handleOnChange}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleBlur}
                    field_focus={focused.andStreet}
                    field_valid={errors.andStreet}
                    maxLength={100}
                    containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                    inputId='ycalle'
                    className="a-textField__input mdc-text-field__input"
                    nameInput='ycalle'
                    labelText={staticLabelValues['pwa.checkoutBillingPage.andStreet.label']}
                    labelPosition='right'
                    text='Ej. Tarjeta de crédito'
                    helperTextId='helper1'
                    
                    
                    type="text"
                  />
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
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='TeléfonoconLADA'
              className="a-textField__input mdc-text-field__input"
              nameInput='TeléfonoconLADA'
              labelText={staticLabelValues['pwa.checkoutBillingPage.PhoneNoWithCode.label']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="tel"
              required
            />
            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">10 digitos
                  { errors.phoneWithLADA && staticLabelValues['pwa.checkoutBillingPage.emptyParticularPhone.errorMsg']}
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
              containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
              inputId='TeléfonoCelular'
              className="a-textField__input mdc-text-field__input"
              nameInput='TeléfonoCelular'
              labelText={staticLabelValues['pwa.checkoutBillingPage.celluler.label']}
              labelPosition='right'
              text='Ej. Tarjeta de crédito'
              helperTextId='helper1'
              
              
              type="tel"
            />
            <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                </Paragraph>
            </div>
            <div className="m-checkbox__button mdc-form-field">
              <MaterialInputCheckBox text={staticLabelValues['pwa.checkoutBillingPage.defaultbilling.text']}
                  name="setAsDefault"
                  value={address.setAsDefault}
                  onChange={this.handleOnCheckBoxChange} 
              />


            </div>
          </div>
          {/*......App..........End...............*/}
          {/*......Web..........Start...............*/}
          <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-11">
            <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
              <div className="col-lg-12 pl-xl-0 mb-2">
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
                  <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                    </Paragraph>
                  </div>
              </div>
            </div>
            <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
              <div className="col-lg-12">
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='CódigoPostal'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='CódigoPostal'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.postalCode.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="tel"
                  required
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
              <div className="col-lg-12 pl-xl-0 mb-2">
                <InputHelperAssistant
                  name="city"
                  value={address.city}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.city}
                  field_valid={errors.city}
                  maxLength={40}
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='Ciudad'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='Ciudad'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.city.label']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="text"
                  required
                />
                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      { errors.city && staticLabelValues['pwa.checkoutBillingPage.emptyCity.errorMsg']}
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
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
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
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                        {errors.municipality && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                    </Paragraph>
                  </div>
              </div>
              }
              
            </div>
            <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
              {
                (addressSearchErrorText)?
                  <div className="col-xl-12 pr-xl-0">
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
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                            { errors.colonyText && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                        </Paragraph>
                    </div>
                  </div>
                :
              
              <div className="col-xl-12 pr-xl-0">
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
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                      {errors.colony && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                    </Paragraph>
                  </div>
              </div>
              }
            </div>
          </div>

          <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0 --mb-11">
            <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
              <div className="col-lg-12 pl-xl-0 mb-2">
                  { 
                    (address.colony === 'other' || address.colony === '-2')?
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='calle'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='calle'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.street.label']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="text"
                  required
                />
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
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      name="noExt"
                      value={address.noExt}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.noExt}
                      field_valid={errors.noExt}
                      maxLength={10}
                      validationtype={"onlyNumbersWithCharactersWithSpace"}
                      inputId='NumExt'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='NumExt'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.exteriorNumber.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                      required
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                          { errors.noExt && staticLabelValues['pwa.checkoutBillingPage.emptyExtNumber.errorMsg']}
                        </Paragraph>
                    </div>
                  </div>
                  : null
              }
              {
                (!guatamalaCountry) ?
                  <div className="col-lg-6">
                    <InputHelperAssistant
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      name="noInt"
                      value={address.noInt}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.noInt}
                      field_valid={errors.noInt}
                      maxLength={10}
                      validationtype={"onlyNumbersWithCharactersWithSpace"}
                      inputId='NumInt'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='NumInt'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.interiorNumber.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                        </Paragraph>
                    </div>
                  </div>
                  : null
              }
            </div>
            {
              (!guatamalaCountry) ?

                <div className="col-lg-4 d-xl-flex flex-row justify-content-start">
                  <div className="col-lg-12 pr-xl-0">
                    <InputHelperAssistant
                      name="building"
                      value={address.building}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.building}
                      field_valid={errors.building}
                      maxLength={100}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='Edificio'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='Edificio'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.building.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                        </Paragraph>
                    </div>
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
                      field_valid={errors.betweenStreet}
                      maxLength={100}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='Entrecalle'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='Entrecalle'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.betweenStreet.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"

                    />
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
                <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
                  <div className="col-lg-12">
                    <InputHelperAssistant
                      name="andStreet"
                      value={address.andStreet}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.andStreet}
                      field_valid={errors.andStreet}
                      maxLength={100}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='ycalle'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='ycalle'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.andStreet.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"

                    />
                    <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                        </Paragraph>
                    </div>
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='TeléfonoconLADA'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='TeléfonoconLADA'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.PhoneNoWithCode.label']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="tel"
                  required
                />
                <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        {errors.phoneWithLADA && staticLabelValues['pwa.checkoutBillingPage.emptyParticularPhone.errorMsg']}
                    </Paragraph>
                </div>
              </div>
            </div>
          </div>

          <div className="d-none d-lg-none d-xl-flex col-12 no-gutters justify-content-between p-0">
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
                  
                  
                  type="tel"
                />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">{staticLabelValues["pwa.checkoutBillingPage.optional.text"]}
                      </Paragraph>
                  </div>
              </div>
            </div>

            {/* Tab Start*/}

            <div className="col-lg-4 d-xl-flex flex-row justify-content-between">
              <div className="col-lg-12 pr-xl-0 d-flex align-items-start justify-content-end">
                <MaterialInputCheckBox text="Establecer dirección predeterminada"
                  name="setAsDefault"
                  value={address.setAsDefault}
                  onChange={this.handleOnCheckBoxChange} />
              </div>
            </div>
          </div>
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
                  {/*<div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                    </Paragraph>
                  </div>*/}
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='CódigoPostal'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='CódigoPostal'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.postalCode.text']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="tel"
                  required
                />
                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                  {
                      errors.postalCode &&
                      <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        {errors.postalCode && staticLabelValues['pwa.checkoutBillingPage.postalCode.required.text']}
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='Ciudad'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='Ciudad'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.city.label']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="text"
                  required
                />
                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      { errors.city && staticLabelValues['pwa.checkoutBillingPage.emptyCity.errorMsg']}
                    </Paragraph>
                </div>*/}
              </div>
            </div>
          </div>
          <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
            {
                (addressSearchErrorText)?
                  <div className="col-6">
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
                          inputId='municipalityText' nameInput='municipalityText' labelPosition='right'   type="text" labelText={staticLabelValues['pwa.checkoutBillingPage.municipality.label']} required  />
                        {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                          {errors.municipalityText && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                        </Paragraph>*/}
                   </div>
                </div>
              : 
              <div className="col-6">
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
                  {/*<div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                        {errors.municipality && staticLabelValues['pwa.checkoutBillingPage.emptyMunicipality.errorMsg']}
                    </Paragraph>
                  </div>*/}
                </div>
              </div>
            }
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
                    {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      { errors.colonyText && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                    </Paragraph>*/}
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
                    {/*<div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                      <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                        {errors.colony && staticLabelValues['pwa.checkoutBillingPage.emptyColony.errorMsg']}
                      </Paragraph>
                    </div>*/}
                </div>
              }
            </div>
          </div>
          { 
            (address.colony === 'other' || address.colony === '-2') &&
            <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
              <div className="col-6">
                <div className="col-12 pl-0">
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
                      {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                          <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                                  {errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyOtherColony.errorMsg']}
                          </Paragraph>
                      </div>*/}
                </div>
              </div>
            </div>
          }
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='Calle'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='Calle'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.street.label']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="text"
                  required
                />
                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      { errors.street && staticLabelValues['pwa.checkoutBillingPage.emptyStreet.errorMsg']}
                    </Paragraph>
                </div>*/}
              </div>
            </div>
            {
              (!guatamalaCountry) ?
                <div className="col-6 d-flex flex-row">
                  <div className="col-6 pr-0">
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
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='NumExt'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='NumExt'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.exteriorNumber.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                      required
                    />
                    {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                          { errors.noExt &&  staticLabelValues['pwa.checkoutBillingPage.emptyExtNumber.errorMsg']}
                        </Paragraph>
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
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='NumInt'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='NumInt'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.interiorNumber.label']}
                      validationtype={"onlyNumbersWithCharactersWithSpace"}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                    />
                    {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                    </Paragraph>*/}
                  </div>
                </div>
                : null
            }
          </div>
          <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
            {
              (!guatamalaCountry) ?
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
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='Edificio'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='Edificio'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.building.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"
                    />
                    {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                    </Paragraph>*/}
                  </div>
                </div>
                : null
            }
          </div>
          <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
           
            {
              (!guatamalaCountry) ?
                <div className="col-6 pr-0">
                  <div className="col-12 pl-0">
                    <InputHelperAssistant
                      name="andStreet"
                      value={address.andStreet}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.andStreet}
                      maxLength={100}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='ycalle'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='ycalle'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.andStreet.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"

                    />
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
                      name="betweenStreet"
                      value={address.betweenStreet}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      onBlur={this.handleBlur}
                      field_focus={focused.betweenStreet}
                      maxLength={100}
                      containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                      inputId='Entrecalle'
                      className="a-textField__input mdc-text-field__input"
                      nameInput='Entrecalle'
                      labelText={staticLabelValues['pwa.checkoutBillingPage.betweenStreet.label']}
                      labelPosition='right'
                      text='Ej. Tarjeta de crédito'
                      helperTextId='helper1'
                      
                      
                      type="text"

                    />
                    {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                    </Paragraph>*/}
                  </div>
                </div>
                : null
            }
           </div>
            <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-between p-0 --mb-44">
          
              <div className="col-6">
                <div className="col-12 pl-0">
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
                    
                    
                    type="tel"
                    required
                  />
                  {/*<Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                  </Paragraph>*/}
                </div>
              </div>
                <div className="col-6">
              <div className="col-12 pr-0">
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
                  containerClass='m-textField mdc-text-field mdc-text-field--outlined mb-4 pb-md-2 pb-lg-0'
                  inputId='TeléfonoconLADA'
                  className="a-textField__input mdc-text-field__input"
                  nameInput='TeléfonoconLADA'
                  labelText={staticLabelValues['pwa.checkoutBillingPage.PhoneNoWithCode.label']}
                  labelPosition='right'
                  text='Ej. Tarjeta de crédito'
                  helperTextId='helper1'
                  
                  
                  type="tel"
                  required
                />
                {/*<div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                      { errors.phoneWithLADA && staticLabelValues['pwa.checkoutBillingPage.emptyParticularPhone.errorMsg']}
                    </Paragraph>
                </div>*/}
              </div>
            </div>
            </div>
          <div className="d-none d-xl-none d-lg-flex col-12 no-gutters justify-content-end p-0">
            <div className="col-6">
              <div className="col-12 pr-0">
                <MaterialInputCheckBox text="Establecer dirección predeterminada"
                  name="setAsDefault"
                  value={address.setAsDefault}
                  onChange={this.handleOnCheckBoxChange} />
              </div>
            </div>
          </div>
        </div>
        {/* Tab End*/}

        {/*end div*/}
      </div>

    );
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