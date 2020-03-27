/**
  * Module Name : PickUpInStore Module
  * Functionality : Component used to show stores based on state selection and event list. This is get called from \templates\checkout\CommonShippingPage.js
  * @exports : PickUpInStore
  * @requires : module:React
  * @requires : module:/atoms/HeadLines/Headlines
  * @requires : module:/atoms/Link/Link
  * @requires : module:/atoms/Icons/Icons
  * @requires : module:/atoms/Label/Label
  * @requires : module:/molecules/MaterialSelect/MaterialSelect
  * @requires : module:/atoms/Paragraph/Paragraph
  * @requires : module:/atoms/HrTag/HrTag
  * @requires : module:/molecules/MaterialInputRadio/Material_Input_Radio
  * @requires : module:/atoms/Span/Span
  * @requires : module:/helpers/utilities/Validate
  * @requires : module:/helpers/utilities/utility
  * @requires : module:/helpers/config/config
  * @requires : module:/atoms/Button/Button
  * @requires : module:/atoms/CustomTooltip/CustomTooltip
  * Team : Checkout Team
  * Other information : Showing click and collect option based on enableclickandcollect status and showing drive thru option based on CncDriveEnableFlag status.
  * 
  */
import React from 'react';
import { H5 } from '../../atoms/HeadLines/Headlines';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import HrTag from '../../atoms/HrTag/HrTag';
import Material_Input_Radio from '../../molecules/MaterialInputRadio/Material_Input_Radio';
import Span from '../../atoms/Span/Span';
import { Validate } from '../../../helpers/utilities/Validate';
import { Utility, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Button from '../../atoms/Button/Button';
// import ReactTooltip from 'react-tooltip';
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';

/**
	* @class PickUpInStore
	* @classdesc Main function which will get exported and will get imported in other JS
	*/
export default class PickUpInStore extends React.Component {
    /**
     * constructor
     * @author dondapati.kumar@zensar.com
     * @desc receiving prop values from the parent module. And adding state values.
     * @param {object} props
     * 
     */
    constructor(props){
        super(props);
        let { storeEventDetails, pdpSelection, pickup_userSelection} = props;
        const eventList = (storeEventDetails && storeEventDetails.eventDetails && storeEventDetails.eventDetails[0] && storeEventDetails.eventDetails[0].eventInfo) || [];
        const stores = pickup_userSelection.stores || {};
        this.state = {
            states: props.states || [],
            stores: stores || {},
            noStoresMsg: '',
            selectedStore: this.props.pickup_userSelection.locationId,
            selectedClickAndCollectStore: '',
            storeEventDetails: storeEventDetails || {},
            loggedInUser: props.loggedInUser,
            userSelection:{
                state: pdpSelection.stateId || (this.props.pickup_userSelection.state || false),
                event: this.props.pickup_userSelection.event || (eventList.length===1 ? eventList[0].eventId : false),
            },
            focused:{

            },
            errors:{

            },
            isDesktop: true,
            pdpSelection: pdpSelection || {}
        }
        this.show = React.createRef();
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * @desc calling methods to persist previous selection. 
     * 
     */
    componentDidMount(){
        this.handle_page_onload();
        this.getDeviceMode();
        if(this.props.pickup_userSelection && this.props.pickup_userSelection.stores){
            let ele = document.getElementById('shipToStore');
            if(ele){
                ele.style.overflow = '';
            }
        }
    }

    /**
      * Getting mode of the device
      * @function getDeviceMode
      * @author dondapati.kumar@zensar.com
      * @desc checking device type whether it is desktop or mobile.
      * 
      */

    getDeviceMode = () =>{
        let agentDetails = UserAgentDetails(window);
        this.setState({
            isDesktop: agentDetails && agentDetails.isDesktop
        })
    }

    /**
     * Persisting previouse selected details
     * @function handle_page_onload
     * @author dondapati.kumar@zensar.com
     * @desc On page load, persisting state, store and event details by pdp selection / previous user selection.
     * 
     */
    handle_page_onload = () => {
        const { deliverySelectionPayLoad, pickup_userSelection } = this.props;
        let { selectedStore, selectedClickAndCollectStore, pdpSelection } = this.state;
        if(pdpSelection.stateId){
            const userSelection = {
                state: pdpSelection.stateId || false,
                event: pdpSelection.event || false,
            }
            selectedClickAndCollectStore = pdpSelection.locationId ? 'cc_'+pdpSelection.locationId : selectedClickAndCollectStore
            this.showPreviousSelection(userSelection, selectedStore, selectedClickAndCollectStore, pdpSelection.storeId);

        }else if(pickup_userSelection.selectedStatevalue){
            const userSelection = pickup_userSelection;
            selectedStore = deliverySelectionPayLoad.locationId || selectedStore;
            selectedClickAndCollectStore = deliverySelectionPayLoad.locationId ? 'cc_'+deliverySelectionPayLoad.locationId : selectedClickAndCollectStore
            this.showPreviousSelection(userSelection, selectedStore, selectedClickAndCollectStore);
        }else if(pickup_userSelection.state){
            const userSelection = {
                state: pickup_userSelection.state || false,
                event: pickup_userSelection.event || false,
            }
            const selectedStore = pickup_userSelection.locationId || selectedStore;
            selectedClickAndCollectStore = pickup_userSelection.locationId ? 'cc_'+pickup_userSelection.locationId : selectedClickAndCollectStore
            this.showPreviousSelection(userSelection, selectedStore, selectedClickAndCollectStore);
        }else if(pickup_userSelection.eventNumber){
            this.setPickUpInStorePayload('event');
        }
    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps 
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps){
      if(this.state.states.length !== nextProps.states.length){
        this.setState({states : nextProps.states},()=>{
            this.handle_page_onload();
        });
      }
      if(this.state.storeEventDetails && nextProps.storeEventDetails && Object.keys(this.state.storeEventDetails).length !== Object.keys(nextProps.storeEventDetails).length){
        this.setState({storeEventDetails : nextProps.storeEventDetails});
      }
      if(this.state.loggedInUser !== nextProps.loggedInUser){
          this.setState({loggedInUser : nextProps.loggedInUser});
      }
      if(nextProps.pdpSelection && nextProps.pdpSelection.stateId && this.props.pdpSelection.stateId !== nextProps.pdpSelection.stateId){
            this.setState({
                pdpSelection: nextProps.pdpSelection
            },()=>{
                this.handle_page_onload();
            });
      }
    }

    /**
     * Getching stores list by state value
     * @function showPreviousSelection
     * @author dondapati.kumar@zensar.com
     * @desc As part of persisting previous selection, calling function to get stores list by state value.
     * @param {object} userSelection
     * @param {object} selectedStore
     * @param {object} selectedClickAndCollectStore
     * @param {string} storeId
     * 
     */
    showPreviousSelection = (userSelection, selectedStore, selectedClickAndCollectStore, storeId) =>{
        const { states } = this.state;
        const selectedState = states.filter(state=> state.value === userSelection.state);
        userSelection.selectedStatevalue = selectedState.length >0 ? selectedState[0].name : ""
        this.setState({ userSelection, selectedStore, selectedClickAndCollectStore },()=>{
            const { pickup_userSelection } = this.props;
            if(pickup_userSelection.stores){
                this.handle_get_storeAddress(pickup_userSelection.stores,'PreviousSelection',storeId);
            }else{
                this.getStoresByStateSelection('PreviousSelection',storeId)
            }
            if(this.state.selectedStore){
                this.setPickUpInStorePayload()
                this.props.userSelectPickpuInStore()
            }
        });
    }

    /**
     * Resetting all the user selection
     * @function resetValues
     * @author dondapati.kumar@zensar.com
     * @desc Resetting user selection of state, stores and event.
     * 
     */
    resetValues = () => {
        const { selectedStore, userSelection, states  } = this.state;
        userSelection.state = '';
        userSelection.event = '';
        this.setState({ stores:{}, selectedStore: '',selectedClickAndCollectStore: '', userSelection });
    }

    /**
     * Validating state and event selection
     * @function warningSelectGiftEvent
     * @author dondapati.kumar@zensar.com
     * @desc Validating state and event selection and updating the state value to show proper error messages in DOM.
     * 
     */
    warningSelectGiftEvent = () => {
        const { errors, userSelection } = this.state;
        if(!userSelection.state){
            errors.state = true;
        }
        if(!userSelection.event){
            errors.event = true;
        }
        this.setState({errors},()=>{
            this.props.setMaxHeightForAnimation('shipToStore');
            this.props.setZeroHeightForAnimation('shipToAddress');
        });
    }

    /**
     * Store vaule on changed method
     * @function handleOnStoreSelectionChange
     * @author dondapati.kumar@zensar.com
     * @desc calling method on change of store selection to update the state values.
     * @param {object} e
     * 
     */
    handleOnStoreSelectionChange = (e) => {
        this.setSelectedStoreValue(e.currentTarget.value);
    }

    /**
     * Updating state values by user selection.
     * @function setSelectedStoreValue
     * @author dondapati.kumar@zensar.com
     * @desc Updating state values by user selection. And adding a session value whether the store selection is Click And Collect or Click And Collect Drive Thru
     * @param {string} value
     * 
     */
    setSelectedStoreValue = (value) => {
        const { userSelection } = this.state;
        userSelection.locationId = value;
        this.setState({
            selectedStore: value,
            selectedClickAndCollectStore: 'cc_'+ value,
            userSelection
        },()=>{
            this.props.set_pickup_userSelection(userSelection);
            if(userSelection.state === '09' && value === '700021'){
                window.sessionStorage.setItem('ClickAndCollect','cc')
            }else{
                window.sessionStorage.removeItem('ClickAndCollect');
            }
            this.setPickUpInStorePayload();
        });
    }

    /**
     * Creating payload of user selection
     * @function setSelectedStoreValue
     * @author dondapati.kumar@zensar.com
     * @desc Creating payload of user selection to make a service call to proceed from shipping to billing page.
     * @param {string} fieldName
     * 
     */
    setPickUpInStorePayload = (fieldName) => {
        const { selectedStore, userSelection, storeEventDetails } = this.state;
        const storeNumber = (this.state.stores && this.state.stores[this.state.selectedStore] && this.state.stores[this.state.selectedStore].address2 || "");
        if(storeNumber && fieldName!== 'event'){
            this.props.check_estimateddeliverydate('',storeNumber);
        }
        const deliverySelectionPayLoad = {
            "profileAddress": 'false',
            "shipToStore": 'true',
            "locationId": selectedStore,
            "selectedStateId": userSelection.state,
            "selectedStatevalue": userSelection.selectedStatevalue,
            "type": 'store'
        }
        if(storeEventDetails.eventCount>0){
            deliverySelectionPayLoad.eventCount = storeEventDetails.eventCount;
            let eventInfo = storeEventDetails.eventDetails && storeEventDetails.eventDetails[0] && storeEventDetails.eventDetails[0].eventInfo || [];
            if(userSelection.event){
                const eventObj = eventInfo.filter(event=>event.eventId === userSelection.event)[0];
                deliverySelectionPayLoad.eventId = eventObj.eventId;
                deliverySelectionPayLoad.eventRecipientIndex = eventObj.recipientIndex;
                deliverySelectionPayLoad.addicionalAddressOwnerName = eventObj.addicionalAddressOwnerName || " ";
            }
            else if(eventInfo.length===1){
                const eventObj = eventInfo[0];
                deliverySelectionPayLoad.eventId = eventObj.eventId;
                deliverySelectionPayLoad.eventRecipientIndex = eventObj.recipientIndex;
                deliverySelectionPayLoad.addicionalAddressOwnerName = eventObj.addicionalAddressOwnerName || " ";
            }
        }
        this.props.userDeliveryTypeSelection('store',deliverySelectionPayLoad)
    }

    /**
     * select value change method
     * @function handleOnSelectChange
     * @author dondapati.kumar@zensar.com
     * @desc handling on selection change of state and event
     * @param {string} value
     * @param {object} e
     * 
     */
    handleOnSelectChange = (value, e) => {
        if(e.target.value){
            this.handleOnChange(e);
            this.props.userSelectPickpuInStore()
        }
    }

    /**
     * Common on change method for all the select fields.
     * @function handleOnChange
     * @author dondapati.kumar@zensar.com
     * @desc handling on change event and changed value updating to the state. And calling setPickUpInStorePayload to create payload.
     * @param {object} e
     * 
     */
    handleOnChange = (e) => {
        const { userSelection, states, stores } = this.state;
        e.persist();
        this.setState(function (prevState){
            const pre_value = prevState.userSelection[e.target.name];
            userSelection[e.target.name] = Validate.validation(e,pre_value);
            if(e.target.name === 'state'){
                const state = states.filter(state=>state.value === userSelection[e.target.name])[0] || {}
                userSelection.selectedStatevalue = state.name;
                this.props.set_pickup_userSelection(userSelection);
            }
            return {userSelection}
        },()=>{
            if(e.target.name === 'state'){
                this.getStoresByStateSelection();
                this.props.userDeliveryTypeSelection('clear-homeDelivery');
            }else{
                this.setPickUpInStorePayload(e.target.name);
            }
        })
    }

    /**
     * Click and collect , Click and collect drive thru handling
     * @function onClickAndCollect
     * @author dondapati.kumar@zensar.com
     * @desc handling the selection of click and collect and click and collect drive thru value.
     * @param {object} e
     * @param {string} locationId
     * @param {string} type
     * 
     */
    onClickAndCollect = (e, locationId,type) => {
        this.setState({
            selectedStore: locationId,
            selectedClickAndCollectStore: type+'_'+locationId
        },()=>{
            window.sessionStorage.setItem('ClickAndCollect',type)
            this.setPickUpInStorePayload()
        });
    }

    /**
     * Fetching stores list by state.
     * @function getStoresByStateSelection
     * @author dondapati.kumar@zensar.com
     * @desc Making RESTfull service call to fetch stores list by selected state.
     * @param {object} PreviousSelection
     * @param {string} storeId
     * 
     */
    getStoresByStateSelection = (PreviousSelection, storeId) => {
        const { userSelection } = this.state;
        Utility(Path.getstoreaddress, 'POST',{
            "selectedStateId": userSelection.state
        }).then(response => {
            if(response && response.data && response.data.storeAddress){
                if(response.data.storeAddress.err){
                    // Need to show a message which coming from response that says NO STORES IN THIS STATE
                    this.setState({stores:{},selectedStore:'', selectedClickAndCollectStore:'',noStoresMsg: response.data.storeAddress.err});
                }else{
                    this.handle_get_storeAddress(response.data.storeAddress, PreviousSelection, storeId);
                    userSelection.stores = response.data.storeAddress;
                    this.props.set_pickup_userSelection(userSelection);
                }
            }else{
                this.setState({stores:{},selectedStore:'', selectedClickAndCollectStore:'', noStoresMsg: ''});
                this.props.error_scenario(response);
            }
        },(error)=>{
            // console.log("Error ==== :: ",error);
        });
    }

    /**
     * handling stores after fetching by state, 
     * @function handle_get_storeAddress
     * @author dondapati.kumar@zensar.com
     * @desc Making RESTfull service call to fetch stores list by selected state. And persisting previous store selection.
     * @param {object} stores
     * @param {object} PreviousSelection
     * @param {string} storeId
     * 
     */
    handle_get_storeAddress(stores, PreviousSelection, storeId){
        let { selectedStore } = this.state;
        if(storeId){
            for(var i in stores){
                if(stores[i].address2 === storeId){
                    selectedStore = stores[i].locationId;
                }
            }
        }
        this.setState({stores: stores, noStoresMsg: '',selectedStore},()=>{
            if(!PreviousSelection){
                this.setSelectedStoreValue(Object.keys(this.state.stores)[0])
            }else{
                const storeNumber = (this.state.stores && this.state.stores[this.state.selectedStore] && this.state.stores[this.state.selectedStore].address2 || "");
                if(storeNumber){
                    this.props.check_estimateddeliverydate('',storeNumber);
                }                            
            }
            let ele = document.getElementById('shipToStore');
            if(ele){
                ele.style.maxHeight = ele.scrollHeight + 'px';
                ele.style.overflow = '';
            }
        });
    }

    /**
     * handle On Focus
     * @function handleOnFocus
     * @author dondapati.kumar@zensar.com
     * @desc handling field Focus. Updating field focus status which required to showing the focus styles to that filed.
     * @param {object} e
     */
    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({focused});
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
        const { focused, userSelection, errors } = this.state;
        focused[e.target.name] = false;
        if(!userSelection[e.target.name] && e.target.required){
            errors[e.target.name] = true;
        }else{
            errors[e.target.name] = false;
        }
        this.setState({focused, errors});
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render(){
        let { states, stores, userSelection , errors, focused, selectedStore, selectedClickAndCollectStore, storeEventDetails, loggedInUser, noStoresMsg, isDesktop } = this.state;
        let { labels } = this.props;
        userSelection.event = userSelection.event || "";
        const StoresTemplate = getStoreTemplate(stores,this.handleOnStoreSelectionChange, this.onClickAndCollect, selectedStore, selectedClickAndCollectStore,userSelection, storeEventDetails, loggedInUser, labels, this.props, isDesktop);
        let eventInfo = storeEventDetails.eventDetails && storeEventDetails.eventDetails[0] && storeEventDetails.eventDetails[0].eventInfo || [];
        const eventList = eventInfo.map((event)=>{ return { name: event.eventName, value: event.eventId } });
        const statesOptions = { labelText: labels["pwa.checkoutShippingPage.state.label"], labelId: 'seleccionaunestado', selected: true, optionList: userSelection.state ? (states || []) : states || []  };
        const eventOptions  = { labelText: labels["pwa.checkoutShippingPage.selectGiftTableMessage.text"], labelId: 'SelectAnEvent', selected: true, optionList: userSelection.event ? eventList : eventList  };
        return(
            <React.Fragment>
                    <div className="row no-gutters align-items-end justify-content-between mt-3">
                        <div className="col-xl-4 col-lg-4 col-12">
                            <MaterialSelect
                                allowWhatEverLength={true}
                                options={statesOptions}
                                name="state"
                                value={userSelection.state}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.state}
                                field_valid={errors.state}
                                error_message={labels["pwa.checkoutShippingPage.emptyState.errorMsg"]}
                                required
                            />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                    {errors.state && labels["pwa.checkoutShippingPage.emptyState.errorMsg"]}
                                </Paragraph>
                            </div>
                        </div>
                        {eventList.length>1 &&
                        <div className="col-xl-4 col-lg-4 col-12">
                            <Span className="a-select__helpText">Mesa para asociar compra
                                <Icons id='MesaParaAsociarCompra' className="icon-help a-select__help" />
                            </Span>
                            {/* <ReactTooltip id="MesaParaAsociarCompra" className="popover-body" type="light" effect="solid">
                                <span>{labels["pwa.checkoutShippingPage.giftInfo.text"] || "Las compras que realices solo se asociarán a la mesa de regalos que selecciones."}</span>
                            </ReactTooltip>*/}
                            <CustomTooltip
                                tooltipFor="MesaParaAsociarCompra"
                                trigger="click"
                                content={labels["pwa.checkoutShippingPage.giftInfo.text"]}
                                position="top"
                                arrowSize="8px"
                                borderSize="1px"
                                contentPadding="10px 15px"
                                boxClass="customBoxSizing">
                            </CustomTooltip>
                            <MaterialSelect
                                allowWhatEverLength={true}
                                options={eventOptions}
                                name="event"
                                value={userSelection.event}
                                handleChange={this.handleOnSelectChange}
                                onFocus={this.handleOnFocus}
                                onBlur={this.handleBlur}
                                field_focus={focused.event}
                                field_valid={errors.event}
                                required
                            />
                            <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                                </Paragraph>
                            </div>                            
                        </div>
                        }
                        <div className="col-lg-3 col-5 text-right d-none d-lg-block align-self-center">
                            <Paragraph className="a-box__requiredMessage">{labels["pwa.checkoutShippingPage.requiredfields.text"] || "*Campos obligatorios"}</Paragraph>
                        </div>
                    </div>

                    {noStoresMsg &&
                        <Paragraph className={"col-lg-12 a-box__radioWarningAlert"}> {noStoresMsg} </Paragraph>
                    }
                    {StoresTemplate.length >0 &&
                        <div className="row align-items-center justify-content-between mt-3 mb-4 -stores" style={{display: 'block'}}>
                            {StoresTemplate}
                        </div>
                    }

            </React.Fragment>
        )
    }
}


/**
 * Creating stores list template along with click and collect drive thru options
 * @function getStoreTemplate
 * @author dondapati.kumar@zensar.com
 * @desc Showing list of stores template with store event message. And creating template for click and collect, click and collect drive thru options.
 * @param {object} stores
 * @param {function} onChange
 * @param {function} onClickAndCollect
 * @param {object} selectedStore
 * @param {object} selectedClickAndCollectStore
 * @param {object} userSelection
 * @param {object} storeEventDetails
 * @param {object} loggedInUser
 * @param {object} labels
 * @param {object} props
 * @param {boolean} isDesktop
 * 
 */
const getStoreTemplate = (stores, onChange, onClickAndCollect ,selectedStore, selectedClickAndCollectStore,userSelection, storeEventDetails, loggedInUser, labels, props, isDesktop) => {

    return Object.keys(stores).map((locationId)=>{

        const obj = stores[locationId];
        const address = obj.address2+' '+
                        obj.address1+', '+
                        obj.address3+', '+
                        obj.city+', '+
                        obj.state+', '+
                        obj.delegationMunicipality+', '+
                        obj.country+', '+labels["pwa.checkoutShippingPage.cp.label"]+
                        obj.postalCode+', '+labels["pwa.checkoutShippingPage.tel.text"]+
                        obj.phoneNumber;

        return <React.Fragment key={'store'+locationId}>
                <HrTag />
                <Label className="col-12 rowStore" htmlFor={'pickup_'+locationId}>
                    <div className="mdc-form-field">
                            <Material_Input_Radio
                                name="storeSelection"
                                value={locationId}
                                id={'pickup_'+locationId}
                                checked={locationId === selectedStore}
                                onChange={onChange}
                                alert_msg ={labels["pwa.checkout.eddmodified.label"]}
                                show_alert={props.show_alert}
                                userselection_state={userSelection.state}
                                />
                            
                                <div>
                                    <Span className="a-box__radioTitle">{obj.name}</Span>
                                    <br />
                                    <Span className="a-box__radioSubtitle">
                                        {address}
                                        { !(props.enableclickandcollect &&((userSelection.state === '09' && locationId === '700021' && selectedStore==='700021') || obj.estatusCnCDriveThru )) &&
                                            <React.Fragment>
                                                <Link href={`https://www.google.com/maps?q=${obj.latitude},${obj.longitude}`} target="_blank">{', '+labels["pwa.checkoutShippingPage.direction.text"]}</Link>
                                                {', '+labels["pwa.checkoutShippingPage.moduleofcnc.text"]+': '+obj.moduloDeCnC}
                                            </React.Fragment>
                                        }
                                    </Span>
                                    <br />
                                    { (locationId === selectedStore) &&
                                        <React.Fragment>
                                            {(storeEventDetails.eventCount>0) &&
                                                <React.Fragment>
                                                    <Icons className="icon-done a-box__radioIcon" />
                                                    <span className={"a-box__radio"+(storeEventDetails.enableGRClicknCollect ?'Success' : 'Warning')+"Alert"}>
                                                        {storeEventDetails.eventMessage}
                                                    </span>
                                                    <br />
                                                </React.Fragment>
                                            }
                                            { 
                                                (!isDesktop)?
                                                <Button className="mt-3 col-6 btn a-btn__primary" onClick={ (e) => {window.scrollTo(0,0); props.handleContinueMethod(e);}}>{labels["pwa.addressFormPage.continueButton.label"] || "Continuar"}</Button>
                                                : null
                                            }
                                        </React.Fragment>
                                    }
                                </div>

                    </div>
                    {(props.enableclickandcollect &&((userSelection.state === '09' && locationId === '700021' && selectedStore==='700021') || obj.estatusCnCDriveThru )) &&
                        <div className="row justify-content-center mt-3 mb-3">
                            <div className="col-lg-5 col-12 pl-5 pl-lg-3">
                                <div className="mdc-form-field">
                                    <Material_Input_Radio
                                        name={"cc_"+locationId}
                                        value={"cc_"+locationId}
                                        checked={"cc_"+locationId === selectedClickAndCollectStore}
                                        onChange={(e)=>onClickAndCollect(e,locationId,'cc')}
                                    />
                                    <Label htmlFor="insurgentes">
                                        <Span className="a-box__radioTitle">{labels["pwa.checkoutShippingPage.moduleofcnc.text"]}</Span>
                                        <br />
                                        <Span className="a-box__radioSubtitle">
                                            {labels["pwa.checkoutShippingPage.moduleof.text"]+' '}
                                            <Link href={"https://goo.gl/maps/iASoqwPPyfE2"} target="_blank">{labels["pwa.checkoutShippingPage.moduleofcnc.text"]}</Link>
                                            {': '+obj.moduloDeCnC.split('|')[0]}
                                        </Span>
                                        {/*<br />                                        */}
                                        {/*<Span className="a-box__radioSubtitle">{labels["pwa.checkoutShippingPage.cncdesc.text"] || "Módulo de Click and Collect; Calle de Oso, a un costado de la Ferretería, Jardinería y llantera en el edificio del estacionamiento."}</Span>*/}
                                    </Label>
                                </div>
                            </div>

                            <div className="col-lg-5 col-12 pl-5 pl-lg-3">
                            {props.CncDriveEnableFlag &&
                                <div className="mdc-form-field">
                                    <Material_Input_Radio
                                        name={"ccd_"+locationId}
                                        value={"ccd_"+locationId}
                                        checked={"ccd_"+locationId === selectedClickAndCollectStore}
                                        onChange={(e)=>onClickAndCollect(e,locationId,'ccd')}
                                    />
                                    <Label htmlFor="insurgentes">
                                        <Span className="a-box__radioTitle">{labels["pwa.checkoutShippingPage.moduleofcncdrivethru.text"]}</Span>
                                        <br />
                                        {/*<Span className="a-box__radioSubtitle">
                                            <Link href={"https://goo.gl/maps/iASoqwPPyfE2"} target="_blank">{labels["pwa.checkoutShippingPage.moduleofcnc.text"]}</Link>
                                            {': '+obj.moduloDeCnC};
                                        </Span>*/}
                                        <Span className="a-box__radioSubtitle">
                                            {labels["pwa.checkoutShippingPage.moduleof.text"]+' '}
                                            <Link href={"https://goo.gl/maps/iASoqwPPyfE2"} target="_blank">{labels["pwa.checkoutShippingPage.moduleofcncdrivethru.text"]}</Link>
                                            {': '+(obj.moduloDeCnC.split('|')[1] ? obj.moduloDeCnC.split('|')[1] : labels["pwa.checkoutShippingPage.moduleofcncdrive.text"])}
                                        </Span>
                                    </Label>
                                </div>}
                            </div> 
                        </div>
                    }
                </Label>
        </React.Fragment>
    })
}
