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
            message: this.props.cartItemEditMsg && this.props.cartItemEditMsg.giftMessage || '',
            itemEventId:'',
             focused: {}
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.itemEventId !== this.state.itemEventId) {
            this.setState({ itemEventId: nextProps.itemEventId })
        }
        if (nextProps.giftMessage !== this.state.giftMessage) {
            this.setState({ message: nextProps.giftMessage })
        }
       
    }
    resetAllStateGR = () =>{
        this.state = {
            itemEventId:''       
        }
        this.setState(this.state)
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
    render() {
       // console.log('gREventsOwnersData', this.props)
        const cartItemData = this.props.cartItemEditMsg
        const data = this.props.gREventsOwnersData;
        const curEventId=this.state.itemEventId
        const modalHeader = {
            title: 'To return',
            titleType: 'link',
            headlineAttributes: {
                "id": "availability-modal"
            },
            close: true,
            back: true,
            buttonClass: 'close',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            headerClass:'o-selectCelebrated__head'            
        };
        const shippingGroupId=this.props.shippingGroupId;
        const comId=this.props.CommerceId;
        const refId=this.props.catalogRefId;
        const msg =this.props.giftMessage
        
          const fData = Object.assign({
            shippingGroupId:shippingGroupId,
            commerceItemId: comId,
            catalogRefId: refId,
            giftMessage:msg
        })
        // console.log('cartItemData',cartItemData)
         const { errors, focused,message } = this.state;
        return (
            <React.Fragment >
                <MyBagModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} editMSG={true}/>
                <div className="o-selectCelebrated__body">
                    <p className="a-blockElement a-blockElement--enphasis">Selecciona al festejado</p>
                    <p className="a-inlineElement">¿A quién quieres dirigir tu regalo?</p>
                    <p className="a-blockElement -hidden -errorSelectedCelebbrated">Selecciona un festejado</p>
                     <div className="o-selectCelebrated__items o-selectCelebrated__items--choiceCelebrated thirdParties">
                    {
                        !isEmpty(data) && map(data && data.events, (items, index) =>
                            !isEmpty(data) && map(items && items.owners, (item, i) => {
                                return (     
                                    curEventId ==  items.eventId  ?
                                   
                                        <div className="mdc-form-field"  key={i}>
                                            <div className="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" >
                                                <input className="mdc-radio__native-control" id="radio-1" type="radio" name="radios" />
                                                <div className="mdc-radio__background">
                                                    <div className="mdc-radio__outer-circle"></div>
                                                    <div className="mdc-radio__inner-circle"></div>
                                                </div>
                                            </div>
                                            <label htmlFor="radio-1"><font><font>{item.firstName} { item.lastNameOrPaternalName}</font></font></label>
                                        </div>
                                    :null
                                )
                            })
                        )
                    }
                    </div>
                    <p className="a-blockElement -messageTitle">Mensaje</p>
                    <div className="o-selectCelebrated__items thirdParties">
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
                                <Button className="a-btn a-btn--primary sendMessageToCelebrated" id="sendMessageToCelebrated" handleClick={() => { this.props.editMesgToGRItem(fData, closeModal, this.state.message) }}>Aceptar</Button>
                            )}
                        </parentContext.Consumer>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}