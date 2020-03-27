import React from 'react';
import List from '../../atoms/List/List';
import Span from '../../atoms/Span/Span';
import Image from '../../atoms/Tagimage/Image';
import Icons from '../../atoms/Icons/Icons';
import ReactTooltip from 'react-tooltip';
import Paragraph from '../../atoms/Paragraph/Paragraph';
// import './InputSelect.styl';
import { MDCSelect } from '@material/select';
export default class MaterialSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { focus: false, value: this.props.value || '', showError: false, }
  }

  componentDidMount() {
      if(this.props.options && this.props.options.labelText){
          this.adjustLabelWidth(1000);
      }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ showError: false, value:nextProps.value })
    }else {
      this.setState({value:nextProps.value});
    }
    if(nextProps.error !== this.state.showError){
      this.setState({ showError: nextProps.error })
    }
    // if (nextProps.error && this.state.value == "") {
    //   this.setState({ showError: nextProps.error })
    // }
    if(this.props.options.labelText !== nextProps.options.labelText){
        this.adjustLabelWidth(1000);
    }
    //console.log(nextProps, this.state.value, 'willProps')
  }

  handleChange = e => {
    if (this.props.handleChange) {
      this.props.handleChange(e);
    }
    this.setState({ value: e.target.value })
  }

  adjustLabelWidth = (time) => {
      setTimeout(()=>{
          try {
              // statements
              if(this.refs.labelRef){
                  var inputText = new MDCSelect(this.refs.labelRef);
              }
          } catch (e) {
              // statements
              console.log(e);
          }
      },time || 0)
  }

  onFocus = () => {
    this.setState({ focus: true })
  }
  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
    if ((this.state.value == "" && this.props.value == '') && this.props.options.required) {
      this.setState({ focus: false, showError: true })
    } else {
      this.setState({ focus: false, showError: false })
    }
    const options = this.props.options || {};
    if (this.props.error || (options.required && !this.state.showOptional && !this.state.value)) {
      this.setState({ focus: false, showError: true })
    }

  }
  scrollUp = () => {
    window.scrollTo(0, 0);
  }

  InputSelectionValidation = () => {
    if ( (this.state.value == "" && this.props.value == '') || this.props.inputValue == '')  {
      this.setState({ focus: false, showError: true })
      this.scrollUp();
      return false
    } else {
      this.setState({ focus: false, showError: false })
    }
  }
  getId = () => {
    if (this.selectedOption && this.selectedOption.options && this.selectedOption.options.length) {
      const id = this.selectedOption.options[this.selectedOption.selectedIndex].id;
      return id;
    }
    return null;
  }

  render() {

    const options = this.props.options;
    const { value } = this.state;
    let optionCaptionHtml;
    if (options.optionCaption !== undefined) {
      const optionProps = {
        selected: 'selected',
        disabled: 'true',
        key: '0caption' + options.labelId,
        value: 'slectetion'
      };
      optionCaptionHtml = <option {...optionProps}>{options.optionCaption}</option>;
    }
    //console.log(this.state.focus, this.state.value,this.props.value,options.optionCaption,this.props.inputValue, 'render')
    return (
      <React.Fragment>
        <div ref="labelRef">
          <div className={`mdc-select mdc-select--outlined ${this.state.focus ? "mdc-select--focused" : ""} ${options.required === true ? "mdc-select--required" : ""} ${this.state.showError ? "mdc-select--invalid" : ""}`}>
            <Icons className="mdc-select__dropdown-icon" />
            <select className="mdc-select__native-control"
              defaultValue={this.props.inputValue}
              required={options.required}
              onChange={this.handleChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              id={options.labelId}
              ref={selectedOption => this.selectedOption = selectedOption}
              /* Changes for defects 22957, 23425, 23423 and 22974  START */
              value={value}
              /* Changes for defects 22957, 23425, 23423 and 22974  END */
            >
              {options.optionList && options.optionList.map((item, index) => {
                if (options.optionCaption && index === 0) {
                  return ([
                    optionCaptionHtml,
                    <option key={item.value + '_' + index} value={item.price ? item.price : item.value} id={item.id} selected={item.selected} >{item.value}</option>
                  ])
                }
                return <option key={item.value + '_' + index} value={item.price ? item.price : item.value} id={item.id} selected={item.selected} >{item.name_text ? item.name_text : item.value}</option>
              })}
            </select>
            <div style={{ color: '#f00' }} className={`mdc-notched-outline mdc-notched-outline--upgraded m-inputSelectContainer--upgraded ${this.state.focus || this.props.value || options.optionCaption || this.state.value || this.props.inputValue ? "mdc-notched-outline--notched" : ""}`}>
              <div className="mdc-notched-outline__leading a-inputSelectContainer__leading"></div>
              <div className="mdc-notched-outline__notch a-inputSelectContainer__notch">
                <Span className={`mdc-floating-label ${this.state.focus || this.state.value || this.props.value || options.optionCaption || this.props.inputValue ? "mdc-floating-label--float-above" : ""}`} id={options.labelId}>
                  {options.labelText}
                </Span>
              </div>
              <div className="mdc-notched-outline__trailing a-inputSelectContainer__trailing"></div>
            </div>
          </div>
        </div>
        {this.state.showError ? <div className="m-textField__helperText mdc-select-helper-line p-0" style={this.props.datePicker?{'white-space': 'initial','display':this.state.showError ?'block':'none'}:{'opacity': this.state.showError ? 1 : 0}}>
          <Paragraph style={{ color: '#f00' }} className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent">{options.helperText}</Paragraph>
        </div> :
          <div className={this.props.datePicker?"mdc-select-helper-line":"mdc-select-helper-line d-lg-block"} style={this.props.datePicker?{'white-space': 'initial','display':this.state.showError ?'block':'none'}:{'opacity': this.state.showError ? 1 : 0}}>
            <Paragraph  className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent"></Paragraph>
          </div>}
        <ReactTooltip className="popover-body" type="light" effect="solid" />
      </React.Fragment>
    );
  }
}

