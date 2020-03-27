import React from 'react';
import List from '../../atoms/List/List';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';
import Icons from '../../atoms/Icons/Icons';
import ReactTooltip from 'react-tooltip'
import { MDCSelect } from '@material/select';


//import './MaterialSelect.styl';
export default class MaterialSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || '',
            required: this.props.required,
            name: this.props.name,
            field_focus: this.props.field_focus,
            field_valid: this.props.field_valid,
            selectFocus: '',
            editCardTextMessage: this.props.editCardTextMessage || ''
        };
        this._handleChange = this._handleChange.bind(this);
        this.materialRefs = React.createRef();
    }

    componentDidMount() {
        if (this.props.options && this.props.options.labelText) {
            this.adjustLabelWidth(1000);
        }
    }

    _handleChange(event) {
        this.setState({ value: event.target.value });
        this.props.handleChange(event.target.value, event)
    }

    setFocus = () => {
        this.materialRefs.current.setAttribute("class", `${this.materialRefs.current.className} mdc-select--focused`)
        //this.setState({selectFocus:"mdc-select--focused"})
    }
    onBlur = () => {
        this.materialRefs.current.setAttribute("class", `mdc-select mdc-select--outlined`);
    }

    componentWillReceiveProps(nextprops, nextstate) {

        let { value, required, name, field_focus, field_valid } = this.state;
        if (this.props && this.props.options && this.props.options.pdpType != "optic") {
            if (required !== nextprops.required ||
                name !== nextprops.name ||
                field_focus !== nextprops.field_focus ||
                field_valid !== nextprops.field_valid ||
                (this.props && this.props.options && this.props.options.pdpType != "optic" && this.state.value == undefined) ||
                value !== nextprops.value ||
                this.props.options.pdpType == "hybrid"
            ) {
                
                if (required !== nextprops.required) required = nextprops.required;
                if (name !== nextprops.name) name = nextprops.name;
                if (field_focus !== nextprops.field_focus) field_focus = nextprops.field_focus;
                if (field_valid !== nextprops.field_valid) field_valid = nextprops.field_valid;

                if (this.props && this.props.options && this.props.options.pdpType == "optic" && this.state.value == undefined) {
                    value = '';
                } else if (value !== nextprops.value) {
                    value = nextprops.value;
                } else if (this.props.options.pdpType == "hybrid") {
                    value = this.state.value;
                }

                this.setState({ value, required, name, field_focus, field_valid });
            }
        }

        if (this.props.options.labelText !== nextprops.options.labelText) {
            this.adjustLabelWidth(1000);
        }
    }

    adjustLabelWidth = (time) => {
        setTimeout(() => {
            try {
                // statements
                if (this.materialRefs) {
                    var inputText = new MDCSelect(this.materialRefs.current);
                }
            } catch (e) {
                // statements
                console.error(e);
            }
        }, time || 0)
    }

    render() {

        const options = this.props.options || {};
        const pdpType = options && options.pdpType || {};
        const labelText = options && options.labelText || {};
        let { value, required, name, field_focus, field_valid, editCardTextMessage } = this.state;
        options.optionList = options.items || options.optionList || []
        const optionListLength = options ? options.optionList.length : 0
        value = value || false;
        required = required || false;
        const giftWrap = this.props.giftWrap
        return (
            <React.Fragment>
                <div ref={this.materialRefs} className={"mdc-select mdc-select--outlined " +
                    (required ? "mdc-select--required " : " ") +
                    ((value || value === false) ? "mdc-notched-outline--notched " : " ") +
                    (field_focus ? 'mdc-select--focused  mdc-notched-outline--notched' : '') +
                    (field_valid ? ' mdc-select--invalid mdc-text-field--invalidphone ' : (!field_valid ? ' mdc-select--valid ' : ''))
                }>
                    {pdpType && (pdpType == "optic") &&
                        <Icons data-tip={options.popoverContent} className="icon-help a-icon__opticHelp" data-toggle="popover" title="" data-content="Contenido del popover de Poder" data-placement="top" data-trigger="focus" data-original-title="Poder" />
                    }
                    {this.props.allowWhatEverLength || optionListLength > 1 || pdpType == "optic" ? <Icons className="mdc-select__dropdown-icon" /> : null}

                    {this.props.allowWhatEverLength || optionListLength > 1 || pdpType == "optic" ? <select className="mdc-select__native-control"
                        required={required}
                        onChange={this._handleChange}
                        name={name}
                        onFocus={this.props.onFocus}
                        onBlur={this.props.onBlur}
                        id={this.props.optionsId ? this.props.optionsId : ""}
                        value={value}
                        disabled={editCardTextMessage}
                    >
                        {
                            options.allowEmptyOptionToSelect ? <option value=""></option> :
                                (
                                    (options.removeEmptyOption || options.custom) ? "" :
                                        (options.selectText ? <option value={options.selectTextValue || false}>{options.selectText}</option> : <option disabled={value}>Seleccionar</option>)
                                )
                        }
                        {options.custom && <option value='Selecciona' >Selecciona</option>}
                        {options.optionList && options.optionList.map((item, index) => {
                            if (item.name === 'DISTRITO FEDERAL') {
                                return <option key={item.value + '_' + index} value={item.value} defaultValue={item.status && item.status == "Active" ? "defaultValue" : ""}>{"CDMX/ZONA METROPOLITANA"}</option>
                            } else {
                                return <option key={item.value + '_' + index} value={item.value} defaultValue={item.status && item.status == "Active" ? "defaultValue" : ""}>{item.name}</option>
                            }
                        })}
                    </select> : <Paragraph>{options && options.optionList && options.optionList.length && options.optionList[0].name}</Paragraph>}
                    <div className={"mdc-notched-outline mdc-notched-outline--upgraded " +
                        (field_focus ? 'mdc-notched-outline--notched ' : '') + (pdpType == "optic" ? 'mdc-notched-outline--notched' : "")}>
                        <div className="mdc-notched-outline__leading"></div>
                        {!giftWrap ?
                            <div className="mdc-notched-outline__notch">
                                <Span className={"mdc-floating-label mdc-notched-outline--upgraded " +
                                    ((value !== '' || field_focus || pdpType == "optic") && 'mdc-floating-label--float-above ')} id={options && options.labelId}>{options && options.labelText}</Span>
                            </div>
                            : null
                        }
                        <div className="mdc-notched-outline__trailing"></div>
                    </div>
                </div>
                {/*<ReactTooltip className="popover-body" type="light" effect="solid" />*/}
            </React.Fragment>
        );
    }
}

