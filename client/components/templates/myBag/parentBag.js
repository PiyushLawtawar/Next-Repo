import MyBag from '../../templates/myBag/myBag';
import EmptyBag from '../../templates/myBag/EmptyBag';
import Router from 'next/router';
import get from 'lodash/get';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import { Utility,logError,logDebug } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import MyBagGRModal from '../../molecules/Modals/MyBagGRModal'
import MyBagGRModalEvents from '../../molecules/Modals/MyBagGRModalEvents'
import MyBagGRModalEventsOwners from '../../molecules/Modals/MyBagGRModalEventsOwners'
import MyBagGiftWrap from '../../molecules/Modals/MyBagGiftWrap'
import MyBagGRModalEditMsg from '../../molecules/Modals/MyBagGRModalEditMsg'
import MyBagGRModalEToNonGR from '../../molecules/Modals/MyBagGRModalEToNonGR'
//import './empty.styl'
export default class ParentBag extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            MyBag: props.MyBag || {},
            activeTab: props.activeTab || 'mdc-tab-1',
            curEventId: '',
            promotionCode: '',
            alert_status: false,
            alert_message: '',
            gREventsData: {},
            gREventsDataOwner: {},
            CommerceIdForGROne: {},
            CommerceIdForGRTwo: {},
            CommerceIdForGRThree: {},
            window: '',
            globalConfigData: {},
            eventTypeList: [],
            objectres: '',
            errors: {},
            focused: {},
            setGiftWrapServiceData: {},
            details: [],
            lastIndex: {},
            allClear: true
        };

    }
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.MyBag !== this.state.MyBag) {
            this.setState({ MyBag: nextProps.MyBag })
        }
         if (nextProps.activeTab !== this.props.activeTab) {
            this.setState({ activeTab: nextProps.activeTab })
        }
    }
     componentDidMount() {
        const { configurationData } = this.props;
        if (isEmpty(configurationData)) {        
        Utility(Path.fetchConfiguration, 'GET').then(response => {
            let globalConfigData = response.data || {};
            this.setState({ globalConfigData: globalConfigData })
            this.setState({
                eventTypeList: (this.getList(globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.bridgecoreeventtypemap ? globalConfigData.configuration.liverpoolconfiguration.bridgecoreeventtypemap : []))
            })
        })
    } else {
            let globalConfigData = configurationData
            this.setState({globalConfigData: configurationData});
            this.setState({
                eventTypeList: (this.getList(globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration && globalConfigData.configuration.liverpoolconfiguration.bridgecoreeventtypemap ? globalConfigData.configuration.liverpoolconfiguration.bridgecoreeventtypemap : []))
            })
        }

    }
    giftWrap = (eventType, selectedColor, message, closeModal) => {
        let { details, catalogRefIdForGiftWrapItem, CommerceIdForGiftWrapItem, giftMessage, isGiftWrapSelected } = this.state
        var flag = false
        !isEmpty(details) && map(details, (item, index) => {
            if (item.catalogRefId === catalogRefIdForGiftWrapItem) {
                flag = true
                details[index] = {
                    giftMessages: giftMessage !== undefined ? giftMessage : '|',
                    catalogRefId: catalogRefIdForGiftWrapItem,
                    giftwrapType: eventType,
                    giftwrapColor: selectedColor,
                    giftwrapNeeded: 'true',
                    giftwrapMessage: message,
                    commerceItemIds: CommerceIdForGiftWrapItem

                }
            }

        })
        if (flag === false) {
            details.push({
                giftMessages: giftMessage !== undefined ? giftMessage : '|',
                catalogRefId: catalogRefIdForGiftWrapItem,
                giftwrapType: eventType,
                giftwrapColor: selectedColor,
                giftwrapNeeded: 'true',
                giftwrapMessage: message,
                commerceItemIds: CommerceIdForGiftWrapItem

            })
        }
        this.setState({
            details: details
        })
        closeModal("MyBagGiftWrap")
    }
    getList = (value) => {
        var optionItem = !isEmpty(value) && map(value, (items, index) => {
            let i = Object.keys(items)
            const optionName = Object.assign({
                name: i[0],
                value: i[0]
            })
            return optionName;
        })
        return optionItem;
    }
    showTabContent = (id) => {
        this.setState({ activeTab: id });
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }
    show_alert = (alert_message, alert_Type = "alert") => {
        this.setState({ alert_status: true, alert_message, alert_Type });
    }
    handleOnFocus = (e) => {
        const { focused } = this.state;
        focused[e.target.name] = true
        this.setState({ focused });
    }
    handleBlur = (e) => {
        const { focused, errors } = this.state;
        focused[e.target.name] = false;
        this.setState({ focused, errors });
    }
    gREventsOwners = (value, val) => {
        this.setState({
            gREventsDataOwner: value
        });
        this.setState({
            curEventId: val
        })
    }
    cartItemIdToGRModalOne = (CommerceId) => {
        this.setState({
            CommerceIdForGROne: CommerceId
        });
    }
    cartItemIdToGiftWrapItem = (CommerceId, catalogRefId, giftMessage, cartItem) => {
        this.setState({
            CommerceIdForGiftWrapItem: CommerceId,
            catalogRefIdForGiftWrapItem: catalogRefId,
            giftMessage: giftMessage,
            cartItemEditMsg: cartItem,
            shippingGroupId: cartItem && cartItem.shippingGroupId || ''
        });
    }
    cartItemIdToGRModalTwo = (CommerceId) => {
        this.setState({
            CommerceIdForGRTwo: CommerceId
        });
    }
    cartItemIdToGRModalThree = (CommerceId) => {
        this.setState({
            CommerceIdForGRThree: CommerceId
        });
    }
    gREventsbysearch = (val, iSEventId, OpenModal, closeModal) => {
        const GRContext = get(this.state.globalConfigData, 'configuration.siteConfigurations.giftRegistryContext', '');
      // const GRContext ='http://172.16.213.134:8080/regalos/services'
        //2019/01/26

        const errors = {};

        if (!val.lastNameOrPaternalName && !iSEventId) {
            errors.lastNameOrPaternalName = true;
        }
        if (!val.firstNameOrNickName && !iSEventId) {
            errors.firstNameOrNickName = true;
        }
        if (iSEventId && !val.eventId) {
            errors.eventId = true;
        }
        this.setState({ errors })

        function GetFormattedDate() {
            var date = new Date(val.date);
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (day < 10) {
                day = `0${day}`;
            }
            if (month < 10) {
                month = `0${month}`;
            }
            return year + "/" + month + "/" + day;
        }
        var payload = {
            "firstNameOrNickName": val.firstNameOrNickName,
            "lastNameOrPaternalName": val.lastNameOrPaternalName,
            "channel": val.channel,
            "GRDomain": GRContext
        }
        if (val.eventType) {
            payload.eventType = val.eventType
        }
        if (val.date) {
            payload.eventDate = val.date ? GetFormattedDate() : ''
        }
        if (iSEventId) {
            var payload = {
                'eventNumber': val.eventId,
                "channel": val.channel,
                "brand": "LP",
                "GRDomain": GRContext
            }
        }
        if (isEmpty(errors)) {
            Utility(Path.gREventsbysearch, 'POST', payload).then(response => {
                if (response.data && response.data.status && response.data.status.status != "failure") {
                    this.setState({
                        gREventsData: response.data
                    });
                    closeModal('MyBagGRModal')
                    OpenModal('MyBagGRModal2')
                }
                else {
                    if (this.refs.MyBagGRModalRef) {
                        if (response.data && response.data.status && response.data.status.errorMessage) {
                            this.refs.MyBagGRModalRef.show_alert(response.data && response.data.status && response.data.status.errorMessage)
                        }
                    }
                }
            });
        }
        else {
            if (this.refs.MyBagGRModalRef) {
                this.refs.MyBagGRModalRef.validateForm()
            }
        }

    }
    redirectToHome = () => {
        Router.push({ pathname: '/tienda/home' });
    }
    editMesgToGRItem = (data, closeModal, message) => {
        let payload = {
            "giftMessages": message || ' ',
            "shippingGroupId": data && data.shippingGroupId ? data.shippingGroupId : '',
            "commerceItemIds": data.commerceItemId,
            "catalogRefId": data.catalogRefId
        }
        Utility(Path.setGrGiftMessage, 'POST', payload).then(response => {
            closeModal('MyBagGRModalEditMsg');
            const { MyBag } = this.state;
            MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
            MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
            this.setState({ MyBag }, () => {
               // this.getDisplayMybagListCount();
            });
            // resetAllState
            if (this.refs.MyBagGRModalRef) {
                this.refs.MyBagGRModalRef.resetAllState();
            }
            if (this.refs.MyBagGRModalRefEditMsg) {
                this.refs.MyBagGRModalRefEditMsg.resetAllStateGR();
            }
        })

    }
    convertToGRItem = (val, closeModal, message) => {
        var payload = val
        var closeModal = closeModal;
        if (!isEmpty(val) && !message) {
            Utility(Path.convertToGiftRegistryItemApi, 'POST', payload).then(response => {
                payload.message = false
                 if(response&&response.data&&response.data.status&&response.data.status.status== "failure" || response&&response.data&&response.data.status&&response.data.status&&response.data.status.errorCode=="002"){
                     this.refs.MyBag.show_alert(response.data && response.data.status && response.data.status.errorMessage)
                    closeModal('MyBagGRModal3');
                    closeModal('MyBagGRModal2');
                    closeModal('MyBagGRModal');
                    closeModal('MyBagGRModalEToNonGR');
                    // resetAllState
                    if (this.refs.MyBagGRModalRef) {
                        this.refs.MyBagGRModalRef.resetAllState();
                    }
                    if (this.refs.MyBagGRModalRefOwners) {
                        this.refs.MyBagGRModalRefOwners.resetAllStateGR();
                    }
                 }
                else  {
                    const { MyBag } = this.state;
                    MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
                    MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
                    this.setState({ MyBag }, () => {
                      //  this.getDisplayMybagListCount();
                    });
                    closeModal('MyBagGRModal3');
                    closeModal('MyBagGRModal2');
                    closeModal('MyBagGRModal');
                    closeModal('MyBagGRModalEToNonGR');
                    // resetAllState
                    if (this.refs.MyBagGRModalRef) {
                        this.refs.MyBagGRModalRef.resetAllState();
                    }
                    if (this.refs.MyBagGRModalRefOwners) {
                        this.refs.MyBagGRModalRefOwners.resetAllStateGR();
                    }
                }
            });
        }
        else if (!isEmpty(val) && message) {
            payload.message = true
            Utility(Path.convertToGiftRegistryItemApi, 'POST', payload).then(response => {
                if (response.data) {
                    if(response&&response.data&&response.data.status&&response.data.status.status== "failure" || response&&response.data&&response.data.status&&response.data.status&&response.data.status.errorCode=="002"){
                     this.refs.MyBag.show_alert(response.data && response.data.status && response.data.status.errorMessage)
                    }
                    let payload = {
                        "giftMessages": message || ' ',
                        "shippingGroupId": response.data && response.data.shippingGroupId ? response.data.shippingGroupId : val.shippingGroupId,
                        "commerceItemIds": response.data.commerceItemId,
                        "catalogRefId": response.data.catalogRefId
                    }
                    Utility(Path.setGrGiftMessage, 'POST', payload).then(response => {
                        closeModal('MyBagGRModal3');
                        closeModal('MyBagGRModal2');
                        closeModal('MyBagGRModal');
                        const { MyBag } = this.state;
                        MyBag.commerceItems = this.props.getCards(response.data.commerceItems) || [];
                        MyBag.redirectToBilling = response && response.data && response.data.redirectToBilling;
                        this.setState({ MyBag }, () => {
                           // this.getDisplayMybagListCount();
                        });
                        // resetAllState
                        if (this.refs.MyBagGRModalRef) {
                            this.refs.MyBagGRModalRef.resetAllState();
                        }
                        if (this.refs.MyBagGRModalRefOwners) {
                            this.refs.MyBagGRModalRefOwners.resetAllStateGR();
                        }
                    })
                }
            });
        }
    }
    setGiftWrapService = () => {
        const catalogRefId = [];
        const eventType = [];
        const selectedColor = [];
        const message = [];
        const CommerceIdForGiftWrapItem = [];
        const giftwrapNeeded = [];
        const giftMessages = [];

        map(this.state.details, (item, index) => {
            catalogRefId.push(item.catalogRefId);
            eventType.push(item.giftwrapType);
            selectedColor.push(item.giftwrapColor);
            giftwrapNeeded.push(item.giftwrapNeeded);
            message.push(item.giftwrapMessage);
            CommerceIdForGiftWrapItem.push(item.commerceItemIds);
            giftMessages.push(item.giftMessages);



        });
        const data = {
            'catalogRefId': catalogRefId.join(','),
            'giftMessages': giftMessages.join('|'),
            'giftwrapType': eventType.join(','),
            'giftwrapColor': selectedColor.join(','),
            'giftwrapNeeded': giftwrapNeeded.join(','),
            'giftwrapMessage': message.join('|'),
            'commerceItemIds': CommerceIdForGiftWrapItem.join(',')


        };
        if (data.catalogRefId !== '') {
            Utility(Path.setGiftWrapService, 'POST', data).then(response => {
            })

        }
    }
    render() {
        const modalFindGiftTable = {
            modalId: "o-findGiftTable",
            modalClass: "o-product__modal modal ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered find-gift",
            modalContentClass: "o-findGiftTable__backPanelMyBag"
        };
        const modalFindGiftTable2 = {
            modalId: "o-resultGiftTable",
            modalClass: "o-product__modal modal  ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "o-resultGiftTable__backPanelMyBag "
        };
        const modalFindGiftTable3 = {
            modalId: "o-selectCelebrated",
            modalClass: "o-product__modal modal  ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered s",
            modalContentClass: "o-selectCelebrated__backPanelMyBag"
        };
        const modalFindGiftTableNonGr = {
            modalId: "o-dontGiftTable",
            modalClass: "o-product__modal modal  ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "o-dontGiftTable__backPanelMyBag"
        };
        const modalFindGiftTableGift = {
            modalId: "o-giftWrap ",
            modalClass: "o-product__modal modal  ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "o-giftWrap__backPanelMyBag "
        };
        return (
            <React.Fragment>                       
                            <main className="cart-alert-top">
                             {
                                (this.state.MyBag && (this.state.MyBag.commerceItems && this.state.MyBag.commerceItems.length>0) || (this.state.MyBag&&this.state.MyBag.wishlistItem && this.state.MyBag.wishlistItem.length>0))?
                           
                                <MyBag  ref="MyBag"
                                    globalConfigData={this.state.globalConfigData}
                                    eventTypeList={this.state.eventTypeList}
                                    showModal={this.props.showModal} 
                                    dropdownMenu={this.props.dropdownMenu} 
                                    onDropdownToggle={this.props.onDropdownToggle} 
                                    headerData={this.props.myBagHeaderData} 
                                    MyBag={this.state.MyBag} 
                                    getCards={this.props.getCards} 
                                    loginDetails={this.props.loginDetails} 
                                    updateCartCount={this.props.updateCartCount}
                                    /*showTabContent={this.showTabContent}*/
                                    activeTab={this.state.activeTab}                                    
                                        cartItemIdToGRModalOne={this.cartItemIdToGRModalOne}
                                        cartItemIdToGRModalOneNew={this.cartItemIdToGRModalOne}
                                        cartItemIdToGiftWrapItem={this.cartItemIdToGiftWrapItem}
                                        detailsGW={this.state.details}
                                        limitedPiecesSkus={this.props.limitedPiecesSkus}
                                />
                                
                                :
                                <EmptyBag 
                                    loginDetails={this.props.loginDetails} 
                                    headerData={this.props.myBagHeaderData} 
                                    staticLables = {this.props.staticLables} 
                                    isShow={true} 
                                    MyBag={this.state.MyBag}
                                    /*showTabContent={this.showTabContent}*/
                                    activeTab={this.state.activeTab}
                                />
                              
                            }                            
                            </main>
                 {this.props.showModal.MyBagGRModal && 
                <Modal modalDetails={modalFindGiftTable} ofindGiftTableClass={' o-findGiftTable '} desableOutsideClose={true} gRModel={true} showModalpopUp={"MyBagGRModal"}>
                    <MyBagGRModal ref="MyBagGRModalRef" errors={this.state.errors} ModalpopUp={"MyBagGRModal"} eventTypeList={this.state.eventTypeList} gREventsbysearch={this.gREventsbysearch} gROne={this.state.CommerceIdForGROne} gRModalTwo={this.cartItemIdToGRModalTwo} staticLables={this.props.staticLables} />
                </Modal>
                 }
                <Modal modalDetails={modalFindGiftTable2} ofindGiftTableClass={' o-resultGiftTable '} desableOutsideClose={true} gRModel={true} showModalpopUp={"MyBagGRModal2"}>
                    <MyBagGRModalEvents ModalpopUp={"MyBagGRModal2"} gREventsbysearch={this.gREventsbysearch} gREventsData={this.state.gREventsData} gREventsOwners={this.gREventsOwners} gRTwo={this.state.CommerceIdForGRTwo} gRModalTwo={this.cartItemIdToGRModalTwo} staticLables={this.props.staticLables} hostname={this.props.hostname}/>
                </Modal>
                <Modal modalDetails={modalFindGiftTable3} ofindGiftTableClass={' o-selectCelebrated '} desableOutsideClose={true} gRModel={true} showModalpopUp={"MyBagGRModal3"}>
                    <MyBagGRModalEventsOwners ref="MyBagGRModalRefOwners" ModalpopUp={"MyBagGRModal3"} gREventsOwnersData={this.state.gREventsDataOwner} convertToGRItem={this.convertToGRItem} gRModalThree={this.cartItemIdToGRModalThree} gRTwo={this.state.CommerceIdForGRTwo} gRThree={this.state.CommerceIdForGRThree} itemEventId={this.state.curEventId} staticLables={this.props.staticLables} />
                </Modal>
                <Modal modalDetails={modalFindGiftTable2} showModalpopUp={"MyBagGRModalEditMsg"} ofindGiftTableClass={' o-dontGiftTable '} gRModel={true}>
                    <MyBagGRModalEditMsg ref="MyBagGRModalRefEditMsg" ModalpopUp={"MyBagGRModalEditMsg"} gREventsOwnersData={this.state.gREventsDataOwner} cartItemEditMsg={this.state.cartItemEditMsg} editMesgToGRItem={this.editMesgToGRItem} CommerceId={this.state.CommerceIdForGiftWrapItem} catalogRefId={this.state.catalogRefIdForGiftWrapItem} shippingGroupId={this.state.shippingGroupId} giftMessage={this.state.giftMessage} itemEventId={this.state.curEventId} staticLables={this.props.staticLables} />
                </Modal>
                <Modal modalDetails={modalFindGiftTableNonGr} ofindGiftTableClass={' o-dontGiftTable '} showModalpopUp={"MyBagGRModalEToNonGR"} gRModel={true}>
                    <MyBagGRModalEToNonGR ModalpopUp={"MyBagGRModalEToNonGR"} convertToGRItem={this.convertToGRItem} gROne={this.state.CommerceIdForGROne} staticLables={this.props.staticLables} />
                </Modal>

                <Modal modalDetails={modalFindGiftTableGift} gRModel={true} desableOutsideClose={true} showModalpopUp={"MyBagGiftWrap"}  ofindGiftTableClass={' o-giftWrap '}>
                    <MyBagGiftWrap ModalpopUp={"MyBagGiftWrap"} giftWrapperDisplayServiceData={this.state.MyBag.giftWrapperDisplayServiceData} giftWrap={this.giftWrap} staticLables={this.props.staticLables}

                        giftWrapColor={this.state.giftWrapColor} giftWrapMessage={this.state.giftWrapMessage} giftWrapType={this.state.giftWrapType} />
                </Modal>
                {/*<parentContext.Consumer>
                    {({ showModal, loginDetails }) => (
                        <React.Fragment>

                            <div className={Object.values(showModal).includes(true) === true ? 'modal-backdrop show' : ''}></div>
                        </React.Fragment>
                    )}
                </parentContext.Consumer>*/}
               

            </React.Fragment>
        )
    }

}
