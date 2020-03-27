import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Span from '../../atoms/Span/Span';
import MdcCheckbox from './mdcCheckbox';
import map from 'lodash/map';
import './MaterialInputCheckBox.styl'

export default class MaterialInputCheckboxNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked : this.props.options.checked
    }
  }
  render() {
    const options = this.props.options;
    const labelPosition = options.labelPosition || 'right';
    var arrayColor = ['#c91a34', '#5b1e26', '#84434c', '#8e0c1e', '#fc1635'];
    let disabledClass = '';
    if (options.disabled) {
      disabledClass = "mdc-checkbox--disabled";
    }

    return (
      <div className={"m-checkbox__button mdc-form-field " + options.customClass}>
        {
          labelPosition === 'left' ?
            options.colorInput ?
              <div className="a-productColor__item a-product__color a-filterColor__modal">
                <Span className="atom-color" data-color={arrayColor[0]}></Span>
                <Label for="">{options.labelText}</Label>
                <MdcCheckbox className={disabledClass} options={options} />
              </div>
              :
              <div><Label for="">{options.labelText}</Label>
                <MdcCheckbox className={disabledClass} options={options} />
              </div>
            :
            <React.Fragment>
              <MdcCheckbox id={"mdcCheck"+options.labelText.shortname+this.props.index} options={options} className={disabledClass} onClick={() => this.props.onClick(this.props.service, this.props.airTime)} checked={this.state.checked} ref={st => this.checkBox = st} />
              <Label htmlFor={"mdcCheck"+options.labelText.shortname+this.props.index}>
                <p className="a-checkCellphone-data">{options.labelText.shortname}</p>
                <p className="a-checkCellphone-data--cellphone__number" >{options.labelText.phoneNumber}</p>
                <p className="a-checkCellphone-data--company">{options.labelText.service}</p>
              </Label>
            </React.Fragment>
        }
      </div>
    )
  }
}
