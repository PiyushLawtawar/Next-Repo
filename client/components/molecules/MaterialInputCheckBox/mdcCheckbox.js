import React from 'react';
import Input from '../../atoms/Input/Input';

export default class mdcCheckbox extends React.Component {
  constructor(props) {
    super(props);
  }
  setChecked = () => {
    this.checked =  !this.checked;
  }
   isChecked() {
    return this.checked;
  }
  render() {
    const option = this.props.options;
    return (
      <div className="m-checkbox mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" onClick={this.props.onClick}>
        <Input type="checkbox"
          className="a-checkbox__input mdc-checkbox__native-control"
          name={option.nameInput}
          id={this.props.id}
          defaultChecked={this.checked}
          onClick={this.setChecked}
        />
        <div className="mdc-checkbox__background">
          <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
            <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div className="mdc-checkbox__mixedmark"></div>
        </div>
      </div>
    );
  }
}

