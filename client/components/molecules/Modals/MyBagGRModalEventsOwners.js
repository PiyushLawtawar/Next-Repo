import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import MyBagModalHeader from './MyBagModalHeader';
import ModalHeader from '../Modals/ModalHeader';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailability from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailability';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';
import { InputText, InputHelperAssistantTextarea } from '../../molecules/MaterialInputText/MaterialInputText';


export default class extends React.Component {
    constructor(props) {
        super(props)
        this.fData = {},
        this.state={
            message: '',
            itemEventId:'',
             focused: {},
             selectedNun: false,
             radios: true
        }
    }
    resetAllStateGR = () =>{
        this.state = {
            message: '',
            itemEventId:''       
        }
        this.setState(this.state)
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.itemEventId !== this.state.itemEventId) {
            this.setState({ itemEventId: nextProps.itemEventId })
        }
    }
    eventData = (items, item, recipientIndex) => {
        const fData = Object.assign({
            actionType: 'toGR',           
            eventNumber: items.eventId,
            eventType: items.eventType,
            eventRecipientIndex: recipientIndex,
            eventDate: items.eventDate,
            ownerName: (item.lastNameOrPaternalName?item.firstName+ ' ' + item.lastNameOrPaternalName:item.firstName),

        })
           
        if(this.props.gRTwo && this.props.gRTwo.indexOf('ci') !== -1){
             fData['commerceItemId'] = this.props.gRTwo;
        }
        else{
            fData['shippingGroupId'] = this.props.gRTwo;
        }        
         
        const data = this.props.gREventsOwnersData;

        !isEmpty(data) && map(data.events, (eve, indexx) => {
            return !isEmpty(eve) && map(eve.owners, (own, ownerIndex) => {
                var ownerIndexOne = ownerIndex + 1;
                var cName = 'celebrity' + ownerIndexOne + 'Name'
                fData[cName] = own.firstName + ' ' + own.lastNameOrPaternalName;
            })
        })
        return this.fData = fData;
    }

    eventFormUpdate = (e) => {

        if (e.target.name == 'firstNameOrNickName') {
            this.setState({ firstNameOrNickName: e.target.value }, () => { })
        }

    }
    giftMessage = (e) => {
        this.setState({
            message: e.target.value
        })

    }
     handleOnChange = (e) => {
        let {  message  } = this.state;
        e.persist();         
        
         if (e.target.name == 'message') {
             this.setState({ message: e.target.value })
        }
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
    handleSelected = () => {
             this.setState({ selectedNun:false,radios:false }); 
    }
    remErrSelectedNun = () =>{
            this.setState({ selectedNun:true,radios:false });
    }
    handleSelectedNun =() =>{
         this.setState({ radios:true });
    }
    render() {
       // console.log('this.state.radios.......... ::: ',this.state.radios);
       // console.log('gREventsOwnersData', this.props)
        const data = this.props.gREventsOwnersData;
        const curEventId=this.state.itemEventId
        const modalHeader = {
            title: 'To return',
            titleType: 'link',
            headlineAttributes: {
                "id": "availability-modal"
            },
            close: true,
            back: false,
            buttonClass: 'close',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            headerClass:'o-selectCelebrated__head'
            
        };
         const { errors, focused,message } = this.state;
        return (
            <React.Fragment >
                <MyBagModalHeader modalHeader={modalHeader} ModalpopUpBack="MyBagGRModal2" ModalpopUp={this.props.ModalpopUp} handleSelectedNun={this.handleSelectedNun} />
                <div className="o-selectCelebrated__body">
                    <p className="a-blockElement a-blockElement--enphasis ownr">Selecciona al festejado</p>
                    <p className="a-inlineElement">¿A quién quieres dirigir tu regalo?</p>
                    <p className="a-blockElement -hidden -errorSelectedCelebbrated">Selecciona un festejado</p>
                    <p className={ this.state.selectedNun ?"a-blockElement -errorSelectedCelebbrated": "a-blockElement -hidden"}>Selecciona un festejado</p>
                     <div className="o-selectCelebrated__items o-selectCelebrated__items--choiceCelebrated thirdParties">
                    {
                        !isEmpty(data) && map(data && data.events, (items, index) =>
                            !isEmpty(data) && map(items && items.owners, (item, i) => {
                                return (     
                                    curEventId ==  items.eventId  ?
                                   
                                        <div className="mdc-form-field"  key={i} >
                                            <div className="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" >
                                                <input className="mdc-radio__native-control" id={"radio-"+i} type="radio" name="radios" onClick={() => { this.props.gRModalThree(this.props.gRTwo), this.eventData(items, item, item.recipientIndex),this.handleSelected() }}/>
                                                <div className="mdc-radio__background">
                                                    <div className="mdc-radio__outer-circle"></div>
                                                    <div className="mdc-radio__inner-circle"></div>
                                                </div>
                                            </div>
                                            <label htmlFor={"radio-"+i}><font><font>{item.firstName} { item.lastNameOrPaternalName}</font></font></label>
                                        </div>
                                    :null
                                )
                            })
                        )
                    }
                    </div>
                    <p className="a-blockElement -messageTitle">Mensaje</p>
                    <div className="o-selectCelebrated__items thirdParties s">
                        <InputHelperAssistantTextarea
                            name="message"
                            value={message}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                             onBlur={this.handleBlur}
                            field_focus={focused.message}
                            labelPosition='right'
                            labelText="Escribe un mensaje"
                        />
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id"> </Paragraph>                        
                    </div>
                    {/*<div className="o-selectCelebrated__items thirdParties">
                        <div className="mdc-text-field mdc-text-field--textarea">
                            <div className="mdc-text-field-character-counter"><font><font>0/300</font></font></div>
                            <textarea className="mdc-text-field__input" id="textarea" rows="4" cols="40" value={this.state.message} onChange={this.giftMessage} ></textarea>
                            <div className="mdc-notched-outline mdc-notched-outline--upgraded">
                                <div className="mdc-notched-outline__leading"></div>
                                <div className="mdc-notched-outline__notch" >
                                    <label className="mdc-floating-label" for="textarea"><font><font>Write a message</font></font></label>
                                </div>
                                <div className="mdc-notched-outline__trailing"></div>
                            </div>
                        </div>
                    </div>*/}
                    <div className="o-selectCelebrated__items">
                        <parentContext.Consumer>
                            {({ closeModal }) => (
                                <Button className="a-btn a-btn--primary sendMessageToCelebrated" id="sendMessageToCelebrated"   onClick={() => { this.state.radios?this.remErrSelectedNun() : this.props.convertToGRItem(this.fData, closeModal, this.state.message),this.handleSelectedNun()  }}>Aceptar</Button>
                            )}
                        </parentContext.Consumer>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}