import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import MyBagModalHeader from './MyBagModalHeader';
import ModalHeader from '../Modals/ModalHeader';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Ul from '../../atoms/Ul/Ul'

import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailability from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailability';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { InputHelperAssistantTextarea } from '../../molecules/MaterialInputText/MaterialInputText';
import List from "../../atoms/List/List";


export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      giftWrapperDisplayServiceData: props.giftWrapperDisplayServiceData,
      focused: {},
      colorWrap: [],
      eventType: '',
      selectedColor: '',
      activeIndex: '',
      message: '',
      active:''
    }

    this.handleOnSelectChange = this.handleOnSelectChange.bind(this)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("UNSAFE_componentWillReceiveProps---->", nextProps)
    this.setState({
      eventType: nextProps.giftWrapType !== undefined ? nextProps.giftWrapType : '',
      selectedColor: nextProps.giftWrapColor !== undefined ? nextProps.giftWrapColor : '',
      activeIndex: '',
      message: nextProps.giftWrapMessage !== undefined ? nextProps.giftWrapMessage : ''
    }, () => {
      map(this.state&&this.state.giftWrapperDisplayServiceData&&this.state.giftWrapperDisplayServiceData.giftRibbonColor, (item, index) => {
        if (index === this.state.selectedColor) {
          this.setState({
            activeIndex: index
          })
        }
      })

    })

  }
  toggleClass = (e) => {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
    // console.log(this.state.active)
    // this.qtyInpuField.focus();
  };
    closeOtherOption = () => {
      const currentState = this.state.active;
      if(currentState){
        this.setState({ active: !currentState })
      }    
  }
  handleOnSelectChange = (value) => {
    this.setState({
      eventType: value
    })
  }
  handleColorChange = (value) => {
    this.setState({
      selectedColor: value,
      activeIndex: value
    })
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
    // console.log('activeIndex------>', this.state.activeIndex)

    let GWDisplayService = []
    let colorWrap = []
    map(this.state&&this.state.giftWrapperDisplayServiceData&&this.state.giftWrapperDisplayServiceData.giftRibbonColor, (item, index) => {

      colorWrap.push({
        name: index,
        colorHexacode: item
      })

    })


    map(this.state&&this.state.giftWrapperDisplayServiceData&&this.state.giftWrapperDisplayServiceData.giftwrapType, (item, index) => {
      GWDisplayService.push({
        name: item,
        value: item
      })

    })



   // let eventTypeListOptions = { labelText: false, labelId: 'validity', selected: false, optionList: GWDisplayService || [], allowEmptyOptionToSelect: true };
       let eventTypeListOptions = {  labelId: 'validity', selected: false, optionList: GWDisplayService || [], selectText: "Tipo de envoltura" };

    const modalHeader = {
      title: 'To return',
      titleType: 'link',
      headlineAttributes: {
        "id": "availability-modal"
      },
      close: true,
      back: true,
      buttonclassName: 'close',
      buttonAttributes: {
        "type": "button",
        "data-dismiss": "modal",
        "aria-label": "Close"
      },
      headerClass: 'o-giftWrap__head'

    };
    const { errors, focused, message } = this.state;
    return (
      <React.Fragment >
          <MyBagModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} gift={true}/>
          <div className="o-giftWrap__body"onClick={(e) => { this.closeOtherOption();}}>
            <div className="o-giftWrap__items">
              <p className="a-blockElement a-blockElement--enphasis">Selecciona las opciones para tu envoltura:</p>
            </div>
            {/*<div className="o-giftWrap__items -wrapOptions">
              <div className="o-giftWrap__options thirdParties" name="typeWrap">

                <MaterialSelect
                  allowWhatEverLength={true}
                  options={eventTypeListOptions}
                  name="eventTypeList"
                  value={this.state.eventType}
                  giftWrap={true}
                  handleChange={this.handleOnSelectChange}
                  error_message="Error Estado"

                />
              </div>
              <div className="m-optionsColorWrap">
                <label className="a-inlineElement">Color de moño: </label>
                <label className="a-inlineElement">{this.state.selectedColor}</label>

                <Ul className="m-optionsColorWrap__list">
                  {
                    map(colorWrap, (item, index) => {
                      let colorStyle = { backgroundColor: item.colorHexacode };
                      return (
                        <List key={'color' + index} className={this.state.activeIndex === item.name ? 'a-productColor__item active mr-lg-2 mr-3 mb-2' : 'a-productColor__item mr-lg-2 mr-3 mb-2'} >
                          <Link className='atom-color' href="#" data-name="color0" style={colorStyle} onClick={() => { this.handleColorChange(item.name, index) }} ></Link>
                        </List>
                      )

                    })
                  }
                </Ul>
              </div>
            </div>*/}
            <div className="o-giftWrap__items -wrapOptions">
            <div className="o-giftWrap__options thirdParties" name="typeWrap">
                            <div className="m-dropdown" onClick={(e) => { this.toggleClass(e) }}>
                              <div className={this.state.active ?"dropdown show":"dropdown"}>
                                <a className="btn  dropdown-toggle" href="#" id="sortby" role="button" data-toggle="dropdown" aria-haspopup={this.state.active ?"true":"false"} aria-expanded="true">
                                  {!isEmpty(this.state.eventType) ?
                                      this.state.eventType
                                      :
                                      "Tipo de envoltura"
                                  }
                                  <i className="icon-arrow_down"></i>
                                </a>
                                <div className={this.state.active ?"dropdown-menu show":"dropdown-menu"} aria-labelledby="sortby" x-placement="bottom-start" >
                                 {
                                  map(GWDisplayService, (item, index) => {
                                     return (
                                       <a className=" dropdown-item"key={index} href="#" onClick={() => this.handleOnSelectChange(item.value)}>{item.name}</a>
                                     )
                                  })
                                }
                                </div>
                              </div>
                            </div>
            </div>
            <div className="m-optionsColorWrap">
                      <label className="a-inlineElement">Color de moño: </label>
                      <label className="a-inlineElement">{this.state.selectedColor?this.state.selectedColor:'Azul'}</label>
                  {/*<ul class="m-optionsColorWrap__list">
                    <li class="m-optionsColorWrap__item">
                      <label class="wrapSelected -optionColor -blueWrap">
                        <input class="a-optionWrap" name="availableColor" type="radio" value=""/>
                      </label>
                    </li>
                    <li class="m-optionsColorWrap__item -selectWrap">
                      <label class="wrapSelected -optionColor -yellowWrap">
                        <input class="a-optionWrap" name="availableColor" type="radio" value=""/>
                      </label>
                    </li>
                    <li class="m-optionsColorWrap__item">
                      <label class="wrapSelected -optionColor -grayWrap">
                        <input class="a-optionWrap" name="availableColor" type="radio" value=""/>
                      </label>
                    </li>
                    <li class="m-optionsColorWrap__item">
                      <label class="wrapSelected -optionColor -pinkWrap">
                        <input class="a-optionWrap" name="availableColor" type="radio" value=""/>
                      </label>
                    </li>
                  </ul>*/}
                  <Ul className="m-optionsColorWrap__list">
                  {
                    map(colorWrap, (item, index) => {
                      let colorStyle = { backgroundColor: item.colorHexacode };
                      return (
                        <List key={'color' + index} className={this.state.activeIndex === item.name ? 'm-optionsColorWrap__item -selectWrap ' : 'm-optionsColorWrap__item'} >
                          <label className="wrapSelected -optionColor" style={colorStyle} onClick={() => { this.handleColorChange(item.name, index) }}>
                              <input className="a-optionWrap" name="availableColor" type="radio" value={item.name}/>
                          </label>
                          {/*<Link className='atom-color' href="#" data-name="color0" style={colorStyle} onClick={() => { this.handleColorChange(item.name, index) }} ></Link>*/}
                        </List>
                      )

                    })
                  }
                </Ul>
                </div>
          </div>

              < div className = "o-giftWrap__items thirdParties" >
                <InputHelperAssistantTextarea
                  name="message"
                  value={message}
                  onChange={this.handleOnChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleBlur}
                  field_focus={focused.message}
                  labelPosition='right'
                  labelText="Escribe tu mensaje"
                  required
                  giftWrap={false}
                />
                {/* <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id"> </Paragraph> */}
              </div>

              <div className="o-giftWrap__items thirdParties">
                <div className="row o-giftWrap__items-modalButtons">
                  < div className = " col-lg-6 order-2 order-lg-1 mt-4 mt-lg-0" >
                         <parentContext.Consumer>
                            {({ closeModal }) => (
                              <button className="a-btn a-btn--secondary findGiftTable" id="findGiftTable-Cancel" onClick={() => { closeModal('MyBagGiftWrap') }}>Cancelar</button>
                            )}
                          </parentContext.Consumer>
                  </div>
                  < div className = "col-lg-6 col order-1 order-lg-2" >
                          <parentContext.Consumer>
                            {({ closeModal }) => (
                              <button className="a-btn a-btn--primary findGiftTable" id="findGiftTable" onClick={() => { this.props.giftWrap(this.state.eventType, this.state.selectedColor, this.state.message, closeModal) }}>Aceptar</button>
                            )}
                          </parentContext.Consumer>
                  </div>
                </div>
              </div>
          </div>

      </React.Fragment >
    )
  }
}
