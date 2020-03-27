import React from 'react';
import Icons from '../../atoms/Icons/Icons';


export default class MaterialSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
            required: this.props.required,
            name: this.props.name,
            field_focus: this.props.field_focus,
            field_valid: this.props.field_valid,
            selectFocus: ''
        };
        this._handleChange = this._handleChange.bind(this);
        this.materialRefs = React.createRef();
        this.handleClick = this.handleClick.bind(this)
    }

    _handleChange(event) {
        this.setState({ value: event.target.value });
        this.props.handleChange(event.target.value, event)
    }
    handleClick(event) {
        var element1 = '';
        var element2 = '';
        if ((event.currentTarget.getElementsByClassName('mdc-select--focused'))
            && (event.target.id == 'selectbox_Texture')) {

            element2 = document.getElementById("select_Materail");
            element2.classList.remove("mdc-select--focused");
        }
        if ((event.currentTarget.getElementsByClassName('mdc-select--focused'))
            && (event.target.id == 'selectbox_Materail')) {
            element2 = document.getElementById("selectbox_Materail");
            element2.classList.remove("mdc-select--focused");
        }
        if ((event.currentTarget.getElementsByClassName('mdc-select--focused'))
            && (event.target.className != 'mdc-select__native-control m-inputSelectContainer')) {

            element1 = document.getElementById("select_Materail");
            element1.classList.remove("mdc-select--focused");
            element2 = document.getElementById("select_Texture");
            element2.classList.remove("mdc-select--focused");
        }
    }

    setFocus = () => {

        let getclassname = this.materialRefs.current.className;
        if (getclassname.lastIndexOf('mdc-select--focused') == '-1')
            this.materialRefs.current.setAttribute("class", `${this.materialRefs.current.className} mdc-select--focused`)
    }
    setFocusOut() {
        let getclassname = this.materialRefs.current.className;
        if (getclassname.lastIndexOf('mdc-select--focused') == '-1')
            this.materialRefs.current.setAttribute("class", `${this.materialRefs.current.className}`)
    }
    onBlur = () => {
        this.materialRefs.current.setAttribute("class", `mdc-select mdc-select--outlined`)

    }

    componentDidMount() {
        global.document.addEventListener('click', this.handleClick, false)
    }
    componentWillUnmount() {
        global.document.removeEventListener('click', this.handleClick, false)
    }


    componentWillReceiveProps(nextprops, nextstate) {

        let { value, required, name, field_focus, field_valid } = this.state;
        if (required !== nextprops.required) required = nextprops.required;
        if (name !== nextprops.name) name = nextprops.name;
        if (field_focus !== nextprops.field_focus) field_focus = nextprops.field_focus;
        if (field_valid !== nextprops.field_valid) field_valid = nextprops.field_valid;

        if (this.props && this.props.options && this.props.options.pdpType == "optic" && this.state.value == undefined) {
            value = '';
        } else if (value !== nextprops.value) {
            value = nextprops.value;
        }
        else if (this.props.options.pdpType == "hybrid") {
            value = this.state.value;
        }

        this.setState({ value, required, name, field_focus, field_valid });

    }

    render() {

        const options = this.props.options;
        const pdpType = options && options.pdpType || {};
        const labelText = options && options.labelText || {};
        const { value, required, name, field_focus, field_valid } = this.state;
        options.optionList = options.items || options.optionList || []
        const optionListLength = options ? options.optionList.length : 0
        let addclassanme = '';
        (options.labelId == 'materail' || options.labelId == 'Texture') ? addclassanme = 'mdc-select--required ' : ''



        return (
            <React.Fragment>
                <div ref={this.materialRefs} className={"mdc-select mdc-select--outlined " +
                    (required && "mdc-select--required " || addclassanme) +
                    (field_focus ? 'mdc-select--focused ' : '') +
                    (field_valid ? ' mdc-select--invalid ' : '')
                } id={`select_${options.labelId}`}>

                    {optionListLength > 1 && <Icons className="mdc-select__dropdown-icon --noBottom a-dropdownIcon" />}

                    <select className="mdc-select__native-control m-inputSelectContainer"
                        required={required}
                        onChange={this._handleChange}
                        name={name}
                        onFocus={this.setFocus}
                        onFocusout={this.setFocusOut}
                        onBlur={this.setFocus}
                        id={this.props.optionsId ? this.props.optionsId : ""}
                        value={value}

                        id={`selectbox_${options.labelId}`}
                    >
                        {this.props.options && this.props.options.allowEmptyOptionToSelect ? <option value=""></option> : (this.props.options && this.props.options.removeEmptyOption ? "" : <option disabled={value}></option>)}
                        {optionListLength > 1 && <option value='0' selected='selected'>{this.props.options.labelText}</option>}
                        {options.optionList && options.optionList.map((item, index) => {
                            return <option key={item.value + '_' + index} value={item.value}>{item.name}</option>
                        })}
                    </select>

                    <div className="mdc-notched-outline mdc-notched-outline--upgraded m-inputSelectContainer--upgraded mdc-notched-outline--notched">
                        <div className="mdc-notched-outline__leading a-inputSelectContainer__leading"></div>
                        <div className="mdc-notched-outline__notch a-inputSelectContainer__notch" style={{ width: 53.75 }}><span className="mdc-floating-label mdc-floating-label--float-above" id="label-material" >{options.labelId}</span></div>
                        <div className="mdc-notched-outline__trailing a-inputSelectContainer__trailing"></div>
                    </div>




                </div>


            </React.Fragment>
        );
    }
}

