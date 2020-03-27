import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Image from '../../atoms/Tagimage/Image';
import Span from '../../atoms/Span/Span';

//import './MaterialInputRadio.styl';

export default class MaterialInputRadio extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ''
      // selectedOption: this.props.options.active
    };
    this.radioChange = this.radioChange.bind(this);
  }

  radioChange(e) {
    /* // Commenting this to fix the issue 18877.
    if (e.currentTarget.name === 'delivery') {
      this.setState({
        selectedOption: true
      });
    } */

    this.props.handleClick && this.props.handleClick(e.currentTarget.value)
  }

  render() {
    let radiobtn = {
      size: "24px",
      scale: "1.66667",
      left: "8px",
      top: "8px",
    }
    const options = this.props.options;
    const disabled = this.props.options.disabled === true ? "disablerideo" : ''
    const onSelectGiftItem = this.props.onSelectGiftItem || null;
    return (
      <div className={"m-radioButton mdc-form-field " + disabled}>
        <div className="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" >
          <Input className="a-radio__input mdc-radio__native-control" type="radio" onClick={onSelectGiftItem} name={options.nameInput} id={options.inputId} value={options.inputId} checked={this.state.selectedOption ? this.state.selectedOption : options.active} onChange={this.radioChange} defaultChecked={options.checkedDefaultValue}/>
          <div className="mdc-radio__background">
            <div className="mdc-radio__outer-circle"></div>
            <div className="mdc-radio__inner-circle"></div>
          </div>
        </div>
        {options.imgSrc &&
          <Image src={options.imgSrc} alt={options.imgAlt} />
        }
        <Label className={options.labelClass ? options.labelClass : ""} for={options.inputId}>
          {options.labelText && options.HTMLrequired ?
            <div dangerouslySetInnerHTML={{ __html: options.labelText }} ></div> : options.labelText
          }
          {options.labelTextSpan &&
            <React.Fragment>
              <br /><Span className={options.labelSpanClass ? options.labelSpanClass : options.labelTextSpan=="No Exhibido"?"-errorSelectedCelebbrated":""} dangerouslySetInnerHTML={{ __html: options.labelTextSpan }}></Span>
            </React.Fragment>
          }
          {options.defaultSpanText &&
            <React.Fragment><br /> <Span className={options.labelSpanClass ? options.labelSpanClass : ""}>{options.defaultAddressId == options.inputId ? "default" : ""}</Span></React.Fragment>
          }
        </Label>
      </div>
    );
  }
}
