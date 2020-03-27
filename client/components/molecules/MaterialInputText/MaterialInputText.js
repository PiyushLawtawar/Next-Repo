
import Label from "../../atoms/Label/Label";
import Input from "../../atoms/Input/Input";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import {MDCTextField} from '@material/textfield';

//import "./MaterialInputText.styl";

export const InputText = ({...props}) => {
  const labelParentStyle = props.field_focus ? {width:'117px'} : {};
  return (

    <div className={"m-inputText mdc-text-field mdc-text-field--outlined "+
        (props.field_focus==='true' ? 'mdc-text-field--focused' : '') +
        (props.field_valid==='false' ? 'mdc-text-field--invalid' : (props.field_valid==='true' ? 'mdc-text-field--valid' : ''))
      }>

      <Input className={props.loginUserInput}
          type={props.loginType}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onChange={props.onChange}
          maxLength={props.maxLength}
          field_valid={props.field_valid}
          field_focus={props.field_focus}
          field_shake={props.field_shake}
          value={props.value}
          name={props.name} 
          placeholder={props.placeholder}
          
          />

      <div className={"mdc-notched-outline mdc-notched-outline--upgraded "+
        ((props.field_focus==='true' || props.value) ? ' mdc-notched-outline--notched ' : '') }>
        <div className="mdc-notched-outline__leading"></div>
        <div className="mdc-notched-outline__notch" style={labelParentStyle}>
          <Label className={"mdc-floating-label atom-label " +
            ((props.value!=='' || props.field_focus==='true') ? 'mdc-floating-label--float-above ' : '')+
            (props.field_shake==='true' ? 'mdc-floating-label--shake ' : '')
          } htmlFor="inputUser">{props.placeholder}</Label>
        </div>
        <div className="mdc-notched-outline__trailing"></div>
      </div>
    </div>

  );
}

export const InputTextNew = (props) => {
  const options = props.options || {};

  let disabledClass = '';
  if (options.disabled) {
    disabledclassName="mdc-text-field--disabled"
  }
  
  return (
    <React.Fragment>
      <div className={"m-inputText mdc-text-field mdc-text-field--outlined " + disabledClass + " " + options.customClass}>
        <Input className="mdc-text-field__input a-material__input" type={options.type} id={options.inputId} aria-controls={options.helperTextId} aria-describedby={options.helperTextId} required={options.required} name={options.nameInput} />
        <div className="m-input-notched mdc-notched-outline">
          <div className="m-input-leading mdc-notched-outline__leading"></div>
          <div className="m-input-outline__notch mdc-notched-outline__notch">
            <Label className="mdc-floating-label a-input-label" htmlFor={options.inputId}>{options.labelText}</Label>
          </div>
          <div className="m-input-outline__trailing mdc-notched-outline__trailing"></div>
        </div>
      </div>
      <div className="m-input-helper__text mdc-text-field-helper-line pb-3">
        <Paragraph className="a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true" id={options.helperTextId}>
          {options.helperText}
        </Paragraph>
      </div>
    </React.Fragment>
  );
}

export class InputHelperAssistant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
      this.adjustLabelWidth(1000);
  }

  onFocus = (e) =>{
    if(this.props.onFocus){
      this.props.onFocus(e)
    }
  }

  adjustLabelWidth = (time) => {
      setTimeout(()=>{
          try {
              // statements
              if(this.refs.labelRef){
                  var inputText = new MDCTextField(this.refs.labelRef);
              }
          } catch (e) {
              // statements
              console.error(e);
          }
      },time)
  }

  componentWillReceiveProps(nextProps) {
      if(this.props.labelText !== nextProps.labelText){
          this.adjustLabelWidth(1000);
      }
  }

  onBlur = (e) =>{
    if(this.props.onBlur)
    this.props.onBlur(e)
    if(!this.props.value){
        this.setState({lableParentWidth: 'auto'})
    }
  }

  render(){
  const props = this.props;
  const editCardTextMessage = props.editCardTextMessage || '';
  const field_valid = (props.field_valid==='false' ? false : (props.field_valid==='true' ? true : (props.field_valid===true ? true : false)));
  const field_focus = (props.field_focus==='false' ? false : (props.field_focus==='true' ? true : (props.field_focus===true ? true : false)));
  // const labelParentStyle = field_focus ? {width:'70.5px'} : {};
  
    return ( 
        <React.Fragment>

            <div ref={ props.noRef ? "" : "labelRef"} className={"m-textField mdc-text-field mdc-text-field--outlined "+
                (field_focus ? 'mdc-text-field--focused ' : '') +
                (field_valid ? ('mdc-text-field--invalid '+((props.name === 'phone' || props.name === "LADA" || props.name === 'postalCode') && "mdc-text-field--invalidphone ")) : (!field_valid  ? 'mdc-text-field--valid ' : ''))
              }>

                <Input
                    className="a-textField__input mdc-text-field__input"
                    type={props.type}
                    id={props.id}
                    aria-controls="helper-nombreCorto"
                    aria-describedby="helper-nombreCorto"
                    name="nombreCorto"
                    text="text"
                    validationtype={props.validationtype}
                    maxLength={props.maxLength}
                    value={props.value}
                    name={props.name}
                    onChange={props.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    readOnly= {editCardTextMessage}
                    required={props.required}
                />
              <div className={"mdc-notched-outline mdc-notched-outline--upgraded "+
                ((field_focus || props.value)  ? 'mdc-notched-outline--notched ' : '') }>
                <div className="mdc-notched-outline__leading"></div>
                <div className="mdc-notched-outline__notch">
                  <Label className={"mdc-floating-label atom-label " +
                    ((props.value!=='' || field_focus ) ? 'mdc-floating-label--float-above ' : '')+
                    (props.field_shake  ? 'mdc-floating-label--shake ' : '')
                  } htmlFor="inputUser">{props.labelText}</Label>
                </div>
                <div className="mdc-notched-outline__trailing"></div>
              </div>
            </div>

        </React.Fragment>
    );
  }
}

export class InputHelperAssistantTextarea extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      this.adjustLabelWidth(1000);
  }

  adjustLabelWidth = (time) => {
      setTimeout(()=>{
          try {
              // statements
              if(this.refs.textAreaField){
                  var inputText = new MDCTextField(this.refs.textAreaField);
              }
          } catch (e) {
              // statements
              console.error(e);
          }
      },time)
  }

  render(){
    const props = this.props;
    const maxlength= props && props.giftWrap?'500':'300'
    return(
      <React.Fragment>               
           
                <div ref="textAreaField"  className={"mdc-text-field mdc-text-field--textarea "+ (props.field_focus ? "mdc-text-field--focused" : "")}>
                  <div className="mdc-text-field-character-counter">{props && props.value && props.value.length ?props && props.value && props.value.length:0} / {props && props.giftWrap?'500':'300'}</div>
                  <textarea className="mdc-text-field__input" id="textarea" rows="4" cols="40"
                              value={props.value}
                              name={props.name}
                              onChange={props.onChange}
                              onFocus={props.onFocus}
                              onBlur={props.onBlur}
                              maxLength={maxlength}>                              
                  </textarea>
                  <div className={"mdc-notched-outline mdc-notched-outline--upgraded "+ (props.required ? "mdc-select--required " : " ")  + ((props.field_focus || props.value)  ? 'mdc-notched-outline--notched ' : '')}>
                    <div className="mdc-notched-outline__leading"></div>
                    <div className="mdc-notched-outline__notch " >
                      <label  className={"mdc-floating-label " +
                  ((props.value!=='' || props.field_focus ) ? ' mdc-floating-label--float-above ' : '')+
                  (props.field_shake  ? ' mdc-floating-label--shake ' : '')
                } htmlFor="textarea">{props.labelText}</label>
                    </div>
                    <div className="mdc-notched-outline__trailing"></div>
                  </div>
                </div>

                     
                            {/*<textarea
                              className={"mdc-text-field__input"+ props.field_focus ? "mdc-text-field--focused" : ""+ props.field_valid  ? "mdc-text-field--invalid" :"" + !props.field_valid  ? 'mdc-text-field--valid ' : ""}
                              id="textarea"
                              rows="4" cols="55"
                              name="nombreCorto"
                              value={props.value}
                              name={props.name}
                              onChange={props.onChange}
                              onFocus={props.onFocus}
                              onBlur={props.onBlur}
                              placeholder={props.labelText}
                          >
                          </textarea>*/}
                         
                 
                         
                                    
      </React.Fragment>
    )
  }
}


export const HelperText = ({...props}) => {
  return (
    <div className="m-input-helper__text mdc-text-field-helper-line pb-3">
      <Paragraph 
            className="atom-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent"
            aria-hidden="true" 
            id="helper__userEmail">{props.error}</Paragraph>
    </div>
  );
}