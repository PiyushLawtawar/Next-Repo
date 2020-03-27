/**
 * Module Name : HomeDelivery Module
 * Functionality : Component used to show the all the saved address and button to add a new address. This is get called from \templates\checkout\CommonShippingPage.js
 * @exports : HomeDelivery
 * @requires : module:React
 * @requires : module:atoms/HeadLines/Headlines.js#Path
 * @requires : module:atoms/Link/Link.js#Path
 * @requires : module:atoms/Icons/Icons.js#Path
 * @requires : module:atoms/Label/Label.js#Path
 * @requires : module:molecules/MaterialInputRadio/Material_Input_Radio.js#Path
 * @requires : module:molecules/MenuMotion/molecule-menu-motion.js#Path
 * @requires : module:atoms/Button/Button.js#Path
 * @requires : module:atoms/Span/Span.js#Path
 * @requires : module:atoms/HrTag/HrTag.js#Path
 * @requires : module:helpers/utilities/utility.js#Path
 * @requires : module:helpers/config/config.js#Path
 * @requires : module:molecules/MaterialSelect/MaterialSelect.js#Path
 * @requires : module:atoms/Paragraph/Paragraph.js#Path
 * @requires : module:atoms/CustomTooltip/CustomTooltip.js#Path
 * Team : Checkout Team
 * Other information : Showing GR event list dynamically based on the address selection. And each address have hamburger menu with options.
 * 
 */

import React from 'react';
import { H5 } from '../../atoms/HeadLines/Headlines';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import Material_Input_Radio from '../../molecules/MaterialInputRadio/Material_Input_Radio';
import { Menumotion, AddressOptions } from '../../molecules/MenuMotion/molecule-menu-motion';
import Button from '../../atoms/Button/Button';
import Span from '../../atoms/Span/Span';
import HrTag from '../../atoms/HrTag/HrTag';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Paragraph from '../../atoms/Paragraph/Paragraph';
// import ReactTooltip from 'react-tooltip';
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';

/**
 * @class HomeDelivery
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class HomeDelivery extends React.Component {
   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
    constructor(props){
        super(props);
        const address_records = props.address_records || {};
        const storeEventDetails = props.storeEventDetails || {};
        const eventList = (storeEventDetails && storeEventDetails.eventDetails && storeEventDetails.eventDetails[0] && storeEventDetails.eventDetails[0].eventInfo) || [];
        this.state = {
            addresses: address_records.addresses || {},
            addressSelection: address_records.addressSelection || '',
            selectedAddressObj: address_records.selectedAddressObj || {},
            pdpSelection: this.props.pdpSelection || {},
            eventList: eventList,
            eventSelection:{

            },
            focused:{

            },
            errors:{

            },
            lastIndex: {},
            allClear: true
        }
        this.show = React.createRef();
    }

  /**
   * REACT life cycle Event. Method will call on component load.
   * @event componentDidMount 
   * 
   */
    componentDidMount(){
        window.sessionStorage.removeItem('ClickAndCollect');
        if(!this.state.addresses.records){
            this.getShippingAddresses();
        }else{
            this.handle_shippingaddress_success(this.state.addresses);
        }
    }

   /**
   * REACT life cycle Event. This will get fire when ever component Will Receive Props
   * @event componentWillReceiveProps 
   * @param {*} nextProps 
   */
    componentWillReceiveProps(nextprops){
        if( (Object.keys(this.props.homeDelivery_userSelection).length !== Object.keys(nextprops.homeDelivery_userSelection))
            && (nextprops.homeDelivery_userSelection.nickName) ){
            const { addresses } = this.state;
            const nickName = nextprops.homeDelivery_userSelection.nickName;
            const selectedAddressObj = addresses.records && addresses.records.filter((obj,index)=>obj.nickName === nickName)[0] || {};
            const eventSelection = nextprops.homeDelivery_userSelection.eventNumber;
            this.setState({
                addressSelection: selectedAddressObj.addressId,
                selectedAddressObj
            },()=>{
                this.setDeliveryPayload();
                if(eventSelection,selectedAddressObj.addressId){
                    this.handleOnChange(eventSelection, selectedAddressObj.addressId)
                }
            });
        }
        if(nextprops.pdpSelection.addressId && this.props.pdpSelection.addressId !== nextprops.pdpSelection.addressId){
            const { addresses } = this.state;
            if(addresses && addresses.records){
                this.setState({
                    pdpSelection: nextprops.pdpSelection
                },()=>{
                    this.handle_shippingaddress_success(addresses);
                });
            }
        }
    }

   /**
   * Method will reset that state values.
   * @function resetValues
   * @author dondapati.kumar@zensar.com
   * @desc The selection of the address will reset here.
   * 
   */
    resetValues = () => {
        this.setState({ addressSelection: '', eventSelection: {} });
    }

    /**
     * REACT life cycle Event.  Method will call before component removes from the DOM.
     * @event componentWillUnmount 
     * @desc  Method will remove all the event listeners which are used to close the hamburger menu when click on outside.
     * 
     */
    componentWillUnmount(){
        document.removeEventListener('click',this.handleOutsideClick, false);
        document.removeEventListener('touchend',this.listenTouch,false);
    }

    /**
     * Dynamically opening hamburger menu for each address.
     * @function openAddressOptions
     * @author dondapati.kumar@zensar.com
     * @desc  Method will open and close the hamburger menu based on the address selection. Showing edit,remove,make as default options in that.
     * @param {boolean} index
     * @param {object} element
     * 
     */
    openAddressOptions = (index, e) => {
        let { addresses, lastIndex } = this.state;
        document.removeEventListener('touchend',this.listenTouch,false);
        document.removeEventListener('click',this.handleOutsideClick, false);
        this.setState(prevState=>{
            addresses.records[index].address_options_visibility = !prevState.addresses.records[index].address_options_visibility
            if((lastIndex.index || lastIndex.index===0) && index!==lastIndex.index){
                addresses.records[lastIndex.index].address_options_visibility = false
            }
            lastIndex = { index: index, status: !prevState.addresses.records[index].address_options_visibility };
            return { addresses, lastIndex, allClear: false }
        },()=>{
            if (addresses.records[index].address_options_visibility) {
                document.addEventListener('click',this.handleOutsideClick, false);
                document.addEventListener('touchend',this.listenTouch,false);
            }
        })
    }

    /**
     * close hamburger menu when click outside
     * @function openAddressOptions
     * @author dondapati.kumar@zensar.com
     * @desc  Method will close the hamburger menu which contains address options edit,remove,make as default
     * @param {object} element
     * @param {boolean} status
     * 
     */
    handleOutsideClick = (e,status) => {
        if (this.addressOptionsRef && this.addressOptionsRef.contains(e.target)) {
            return;
        }
        this.clearAllAddressOptions();
    }

    /**
     * close hamburger menu when touch outside
     * @function listenTouch
     * @author dondapati.kumar@zensar.com
     * @desc  Method will call when user click
     * @param {object} element
     * @param {boolean} status
     * 
     */
    listenTouch = () => {
        const { allClear } = this.state;
        if(allClear===false){
            this.clearAllAddressOptions();
        }
    }

    /**
     * close hamburger menu when touch outside
     * @function clearAllAddressOptions
     * @author dondapati.kumar@zensar.com
     * @desc  Method will close the hamburger menu which contains address options edit,remove,make as default
     * @param {object} element
     * @param {boolean} status
     * 
     */
    clearAllAddressOptions = () => {
        document.removeEventListener('click', this.handleOutsideClick, false);
        document.removeEventListener('touchend',this.listenTouch,false);
        const { addresses, lastIndex } = this.state;
        if(addresses && addresses.records && addresses.records.length>0){
            addresses.records = addresses.records.map(record=>{
                record.address_options_visibility = false;
                return record;
            });
            this.setState({addresses,allClear: true});
        }
    }

    /**
     * Making address as default address
     * @function markAsdefault
     * @author dondapati.kumar@zensar.com
     * @desc  Calling RESTfull service call to make the selected address as default address. And calling shipping address API to get latest results.
     * @param {boolean} index
     * 
     */
    markAsdefault = (index) => {
        this.clearAllAddressOptions();
        const { addresses } = this.state;
        const address = addresses.records[index];
        Utility(Path.setDefaultAddress, 'POST',{ "addressId": address.addressId }).then(response => {
            if(response.status === 200 && response.data && response.data.s==="0"){
                this.getShippingAddresses();
            }else{
                this.props.error_scenario(response);
            }
        },(error)=>{
            // console.log("Error ==== :: ",error);
        });
    }

    /**
     * Removing address from the addres list.
     * @function removeAddress
     * @author dondapati.kumar@zensar.com
     * @desc  Calling RESTfull service call to delete the selected address. And calling shipping address API to get latest results.
     * @param {boolean} index
     * 
     */
    removeAddress = (index) => {
        this.clearAllAddressOptions();
        const { addresses } = this.state;
        const address = addresses.records[index];
        this.openAddressOptions(index);
        Utility(Path.removeaddress, 'POST',{ "nickname": address.nickName }).then(response => {
            if(response.status === 200 && response.data && response.data.s==="0"){
                this.getShippingAddresses();
            }else{
                this.props.error_scenario(response);
            }
        },(error)=>{
            // console.log("Error ==== :: ",error);
        });
    }

    /**
     * Calling method to update the address
     * @function removeAddress
     * @author dondapati.kumar@zensar.com
     * @desc  Filtering address based on the given index, calling method to updated that address.
     * @param {boolean} index
     * @param {string} defaultShippingAddressId
     * 
     */
    updateAddress = (index, defaultShippingAddressId) => {
        const { addresses } = this.state;
        const address = addresses.records[index];
        this.clearAllAddressOptions();
        this.props.updateAddress(address, defaultShippingAddressId);
    }

    /**
     * Method will fire after getting new shipping address from the API
     * @function handle_shippingaddress_success
     * @author dondapati.kumar@zensar.com
     * @desc  The addresses which are getting from the API, setting up to the state.
     * @param {boolean} index
     * @param {string} defaultShippingAddressId
     * 
     */
    handle_shippingaddress_success = (addresses) => {
        const records = addresses.records || [];
        const defaultShippingAddressId = addresses.defaultShippingAddressId;
        const { deliverySelectionPayLoad } = this.props;
        const { pdpSelection } = this.state;
        let selectedAddressObj = {};
        if(pdpSelection && pdpSelection.addressId){
            selectedAddressObj = records.filter((obj,index)=>obj.addressId === pdpSelection.addressId)[0] || {};
        }else if(deliverySelectionPayLoad.addressId){
            selectedAddressObj = records.filter((obj,index)=>obj.addressId === deliverySelectionPayLoad.addressId)[0] || {};
        }else if(this.state.nickName){
            selectedAddressObj = records.filter((obj,index)=>obj.nickName === this.statet.nickName)[0] || {};
        }else{
            selectedAddressObj = records.filter((obj,index)=>obj.addressId === defaultShippingAddressId)[0] || {};
        }
        this.setState({
            addresses,
            addressSelection: selectedAddressObj.addressId,
            selectedAddressObj
        },()=>{
            this.setDeliveryPayload();
            this.props.saveAddresses({
                addresses,
                addressSelection: selectedAddressObj.addressId,
                selectedAddressObj
            })
        });
    }

    /**
     * Fetching shipping addresses
     * @function getShippingAddresses
     * @author dondapati.kumar@zensar.com
     * @desc Making RESTfull API call to featch shipping addresses.
     * 
     */
    getShippingAddresses = () => {
        Utility(Path.getshippingaddresses, 'POST').then(response => {
            if(response && response.data && response.data.status.status === "success" && response.data.records){
                const addresses = response.data || {};
                this.handle_shippingaddress_success(addresses);
            }else{
                this.props.error_scenario(response);
                this.setState({addresses:{}});
            }
        },(error)=>{
            // console.log("Error ==== :: ",error);
        });
    }

    /**
     * Method will fire when user change the address selection
     * @function handleOnAddressSelectionChange
     * @author dondapati.kumar@zensar.com
     * @desc  The selected address setting up to the state.
     * @param {boolean} index
     * @param {string} defaultShippingAddressId
     * 
     */
    handleOnAddressSelectionChange = (e) => {
        const { addresses } = this.state;
        if(e.currentTarget.value){
            const selectedAddressObj = addresses && addresses.records && addresses.records.filter((obj,index)=>obj.addressId === e.currentTarget.value)[0] || {};
            this.setState({
                addressSelection: e.currentTarget.value,
                selectedAddressObj,
            },()=>{
                if(selectedAddressObj && selectedAddressObj.eventInfo && selectedAddressObj.eventInfo.length === 1){
                    this.handleOnChange(
                        selectedAddressObj.eventInfo[0].eventId,
                        selectedAddressObj.eventInfo[0].eventId
                    );
                }else{
                    this.setDeliveryPayload();
                }
            });
        }
    }

    /**
     * Method will fire every  change of address selection
     * @function setDeliveryPayload
     * @author dondapati.kumar@zensar.com
     * @desc  Creating payload with the user selection to make API call to preceed shipping to billing.
     * 
     */
    setDeliveryPayload = () => {
        let { selectedAddressObj } = this.state;
        if(selectedAddressObj.postalCode){
            this.props.check_estimateddeliverydate(selectedAddressObj.postalCode);
        }
        let deliverySelectionPayLoad = {}

        // if(selectedAddressObj.eventInfo && selectedAddressObj.eventInfo.length===1){
        //     const eventObj = selectedAddressObj.eventInfo[0];
        //     deliverySelectionPayLoad = {
        //         shipToAddressName: selectedAddressObj.nickName,
        //         profileAddress: selectedAddressObj.profileAddress ? 'true' : 'false',
        //         eventId: eventObj.eventId,
        //         eventRecipientIndex: eventObj.recipientIndex,
        //         addressId: selectedAddressObj.addressId,
        //         addicionalAddressOwnerName: eventObj.addicionalAddressOwnerName || " ",
        //         type: 'homeDelivery'
        //     }
        // }else{
            if(selectedAddressObj.nickName){
                deliverySelectionPayLoad = {
                    shipToAddressName: selectedAddressObj.nickName,
                    profileAddress: selectedAddressObj.profileAddress ? 'true' : 'false',
                    type: 'homeDelivery',
                    addressId: selectedAddressObj.addressId
                }
                if(selectedAddressObj.eventCount === 1 && selectedAddressObj.eventInfo){
                    deliverySelectionPayLoad.eventId = selectedAddressObj.eventInfo[0].eventId;
                    deliverySelectionPayLoad.eventRecipientIndex = selectedAddressObj.eventInfo[0].recipientIndex;
                    deliverySelectionPayLoad.addicionalAddressOwnerName = " ";
                }
            }
        // }

        if(selectedAddressObj.nickName && selectedAddressObj.eventCount!==0){
            deliverySelectionPayLoad.eventCount = selectedAddressObj.eventCount
        }

        this.props.userDeliveryTypeSelection('homeDelivery',deliverySelectionPayLoad);
    }
    /**
     * Method will fire every change of address/event selection
     * @function handleOnSelectChange
     * @author dondapati.kumar@zensar.com
     * @desc  Calling commong on changed method to handle user address/event selection.
     * @param {boolean} value
     * @param {object} e
     * 
     */
    handleOnSelectChange = (value, e) => {
        this.handleOnChange(e.target.value,e.target.name);
    }

    /**
     * Method will call to show the warning messeages if selection is invalid.
     * @function warningSelectGiftEvent
     * @author dondapati.kumar@zensar.com
     * @desc Updating state to show the error messages when GR Event not selected for that address.
     * 
     */
    warningSelectGiftEvent = () => {
        const { selectedAddressObj, errors } = this.state;
        errors[selectedAddressObj.addressId] = true;
        this.setState({errors},()=>{
            this.props.setMaxHeightForAnimation('shipToAddress');
            this.props.setZeroHeightForAnimation('shipToStore');
        });
    }

    /**
     * Common on changed method will every change of selection.
     * @function handleOnChange
     * @author dondapati.kumar@zensar.com
     * @desc Updating state what ever change is happend in the selection. Creating payload with the user selection to make API call to preceed shipping to billing.
     * @param {boolean} value
     * @param {string} name
     * 
     */
    handleOnChange = (value,name) => {
        if(value){
            const { selectedAddressObj } = this.state;
            const eventSelection = { [name] : value }
            const eventObj = selectedAddressObj.eventInfo.filter((obj,index)=>obj.eventId === value)[0] || {};
            const deliverySelectionPayLoad = {
                shipToAddressName: selectedAddressObj.nickName,
                profileAddress: selectedAddressObj.profileAddress ? 'true' : 'false',
                eventId: eventObj.eventId,
                eventRecipientIndex: eventObj.recipientIndex,
                addressId: selectedAddressObj.addressId,
                addicionalAddressOwnerName: eventObj.addicionalAddressOwnerName || " ",
                type: 'homeDelivery'
            }
            this.setState({ eventSelection },()=>{
                this.props.userDeliveryTypeSelection('homeDelivery',deliverySelectionPayLoad);
            });
        }
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
        const { focused, eventSelection, errors } = this.state;
        focused[e.target.name] = false;
        if(!eventSelection[e.target.name] && e.target.required){
            errors[e.target.name] = true;
        }else{
            errors[e.target.name] = false;
        }
        this.setState({focused, errors});
    }

    /**
     * Creating GR event list template
     * @function getEventsTemplate
     * @author dondapati.kumar@zensar.com
     * @desc Showing list of GR items based on selected address. And creating tooltip template to show gift information.
     * @param {object} obj
     * 
     */
    getEventsTemplate = (obj) => {
        let { focused, errors, eventSelection } = this.state;
        const { labels } = this.props;
        const events = obj.eventInfo.map(event=>{
            return {
                name: event.eventName,
                value: event.eventId
            }
        })
        
        let eventListOptions =  { labelText: labels["pwa.checkoutShippingPage.selectGiftTableMessage.text"], labelId: 'validity', selected: true, optionList: (events && events.length) ? events : []  };
        eventSelection[obj.addressId] = eventSelection[obj.addressId] || "";
        return <React.Fragment>
                <div className="row no-gutters align-items-center justify-content-between mt-3 -pl-associatedPurchase">
                    <div className="col-lg-5 col-12">
                        {/* <Span className="a-select__helpText"> {labels["pwa.checkoutShippingPage.tableToAssociateEvent.text"]}
                            <Icons className="icon-help a-select__help" data-tip data-for='addressEvent'/>
                        </Span>*/}
                        <Span className="a-select__helpText"> {labels["pwa.checkoutShippingPage.tableToAssociateEvent.text"]}
                            <Icons className="icon-help a-select__help" id='addressEvent'/>
                        </Span>
                        {/* <ReactTooltip id="addressEvent" className="popover-body" type="light" effect="solid">
                            <span>{labels["pwa.checkoutShippingPage.giftToolTipInfo.text"]}</span>
                        </ReactTooltip>*/}
                        <CustomTooltip
                            tooltipFor="addressEvent"
                            trigger="click"
                            content={labels["pwa.checkoutShippingPage.giftToolTipInfo.text"]}
                            position="top"
                            arrowSize="8px"
                            borderSize="1px"
                            boxClass="customBoxSizing">
                        </CustomTooltip>
                        <MaterialSelect options={eventListOptions}
                            allowWhatEverLength={true}
                            name={obj.addressId}
                            value={eventSelection[obj.addressId]}
                            handleChange={this.handleOnSelectChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleBlur}
                            field_focus={focused[obj.addressId]}
                            field_valid={errors[obj.addressId]}
                            required
                        />
                    </div>
                    <div className="col-lg-3 d-none d-lg-block">
                        <Paragraph className="a-box__requiredMessage">{labels["pwa.checkoutShippingPage.requiredfields.text"] || "* Campos obligatorios"}
                        </Paragraph>
                    </div>
                </div>
                <div className="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper">
                    </Paragraph>
                </div>
        </React.Fragment>
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */
    render(){
        const { labels, OpenModal, storeEventDetails, isMobile } = this.props;

        const { addresses, addressSelection, eventList } = this.state;

        const AddressTemplate =  addresses && addresses.records && addresses.records.map((obj,index)=>{

        const countryArray = {
            "MX": "México",
            "Mexico": "México",
            "GT": "Guatemala",
            "Guatemala": "Guatemala",
        }

        const address = obj.address1+', '+
                        obj.exteriorNumber+', '+
                        ((obj.interiorNumber && obj.interiorNumber!==' ') ? obj.interiorNumber+', ' : '')+
                        ((obj.address3 && obj.address3!==' ') ? obj.address3+', ' : '')+
                        ((obj.address2 && obj.address2!==' ') ? obj.address2+', ' : '')+
                        ((obj.neighbourhood && obj.neighbourhood!==' ') ? obj.neighbourhood+', ' : '')+
                        obj.postalCode+', '+
                        (obj.city && obj.city!==' ' && obj.city+', ')+
                        obj.state+', '+
                        countryArray[obj.country];

                                    const eventTemplate = (obj.addressId === addressSelection && obj.eventInfo.length > 1 ) ? this.getEventsTemplate(obj) : "";
                                    return <React.Fragment key={'address'+obj.addressId}>
                                        <hr className="a-box__horizontalSeparator" />
                                        <Label className="row align-items-center justify-content-between mb-4" style={{width: '100%'}} htmlFor={'address'+obj.addressId}>
                                            <div className="col-10">
                                                <div className="mdc-form-field">
                                                     {/*value={obj.addressId}  onClick={(e) => { e.currentTarget.value=obj.addressId; this.handleOnAddressSelectionChange(e);}}*/}
                                                    <Material_Input_Radio
                                                        name="deliveryAddressSelection"
                                                        id={'address'+obj.addressId}
                                                        value={obj.addressId}
                                                        checked={obj.addressId === addressSelection}
                                                        onChange={this.handleOnAddressSelectionChange}/>

                                                    <Label style={{display: "inline-block", wordWrap: "break-word", wordBreak: "break-all"}} htmlFor={'address'+obj.addressId}>
                                                        <Span className="a-box__radioTitle">{obj.nickName}</Span>
                                                        { obj.addressId === addressSelection && obj.eventInfo.length>0 &&
                                                            <React.Fragment>
                                                                <br/>
                                                                <div className="m-flag">
                                                                    <div className="m-flag-item -primaryFlag -mesa">
                                                                        <Span> {labels["pwa.checkoutShippingPage.giftTableMessage.text"] || "mesa de regalos"} {obj.eventInfo.length}</Span>
                                                                        {/*labels["pwa.checkoutShippingPage.selectGiftTableMessage.text"]*/}
                                                                        <Icons className="icon-gift" />
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                        <br/>
                                                        <Span className="a-box__radioSubtitle">{address}</Span>
                                                        <br/>
                                                        { obj.addressId === addresses.defaultShippingAddressId &&
                                                            <Span className="a-box__radioFlag">{labels["pwa.checkoutShippingPage.default.text"]}</Span>
                                                        }
                                                    </Label>
                                                </div>
                                            </div>
                                            {obj.profileAddress &&
                                                <div className={(isMobile ? "col-2" : "col-1") + " text-right align-self-start"}>
                                                    <AddressOptions
                                                        labels={labels}
                                                        ref="addressOptionsRef"
                                                        openOptions={(e)=>this.openAddressOptions(index,e)}
                                                        options_visibility={obj.address_options_visibility}
                                                        markAsdefault={()=>this.markAsdefault(index)}
                                                        hideEditBtn={obj.eventInfo && obj.eventInfo.length>0 || (obj.country === 'GT')}
                                                        hideRemoveBtn={obj.addressId === addresses.defaultShippingAddressId  || (obj.eventInfo && obj.eventInfo.length>0)}
                                                        hideDefaultBtn={obj.addressId === addresses.defaultShippingAddressId}
                                                        remove={()=>this.props.removeAddress(index)}
                                                        edit={()=>this.updateAddress(index, addresses.defaultShippingAddressId)}
                                                        enableEditAddress= {this.props.enableEditAddress}
                                                        />
                                                </div>
                                            }
                                        </Label>

                                        { eventTemplate }
                                        {obj.addressId === addressSelection &&
                                            <div className="row no-gutters align-items-center mb-3 -pl-associatedPurchase">
                                                { obj.isEventAssociated === true &&
                                                    <div className="col-12">
                                                        <div className="a-box__radioSuccessAlert">
                                                            <Icons className="icon-done pr-2" /> {obj.eventMessage}
                                                        </div>
                                                    </div>
                                                }
                                                { obj.isEventAssociated === false && eventList && eventList.length>0 &&
                                                    <div className="col-12">
                                                        <div className="a-box__radioWarningAlert">
                                                             {obj.eventMessage}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                         }

                                    </React.Fragment>
                                })

        return(

            <React.Fragment>

                {AddressTemplate}

            </React.Fragment>
        )
    }
}