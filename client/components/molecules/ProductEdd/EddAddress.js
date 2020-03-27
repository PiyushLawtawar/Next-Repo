import { H3 } from '../../atoms/HeadLines/Headlines';
import Sup from "../../atoms/Sup/Sup";
import Span from "../../atoms/Span/Span";
import Ul from "../../atoms/Ul/Ul";
import List from "../../atoms/List/List";
import Link from "../../atoms/Link/Link";
import Button from "../../atoms/Button/Button";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import isEmpty from "lodash/isEmpty"

import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import InputText from '../../molecules/InputText/InputText';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';

export default class extends React.Component {
    constructor() {
        super()
        this.postalInput = React.createRef();
        this.state = { listedAddress: [], postalCodeValue: "", postalCodeValidation: "" }
    }
    postalCodeChange = (postCode) => {

        if (postCode.currentTarget.value.length <= 5) {

            // this.setState({ postalCodeValue: postCode.currentTarget.value.match(/\d+/g) == null ? "" : postCode.currentTarget.value.match(/\d+/g).join("") }, () => {
            let zipVal = postCode.currentTarget.value || '';
            zipVal = zipVal.replace(/[^0-9]/g, '');
            this.setState({ postalCodeValue: zipVal }, () => {
                //this.props.set_postal_zip_code(this.state.postalCodeValue);
            })
        }
        else {
            this.setState({ postalCodeValidation: this.props.staticLabels && this.props.staticLabels["pdpPage.soms_no_date_invalid_zip_code.errormsg"] || 'pdpPage.soms_no_date_invalid_zip_code.errormsg' })
        }

    }
    getAddress = () => {

        const { addressList, addressList: { records }, stateDetails, selectedAddId, selectedAddressInfo = {} } = this.props;
        let sticmsgPredeterminada = this.props.staticLabels && this.props.staticLabels["pdpPage.default.predeterminada"] || 'pdpPage.default.predeterminada';
        Utility(Path.getshippingaddresses, 'POST').then(response => {

            const listedAddress = response && response.data && response.data.records && response.data.records && response.data.records.length > 0 &&
                response.data.records.map((eachAddress) => {
                    
                    if (!isEmpty(eachAddress)) {
                        let labelTextSpan = (response.data.defaultShippingAddressId  == eachAddress.addressId) ? eachAddress.address1 + '<br/>' +sticmsgPredeterminada : eachAddress.address1;
                        const addressOptions = {
                            radioId: eachAddress.addressId,
                            inputId: eachAddress.addressId,
                            labelText: eachAddress.nickName,
                            labelTextSpan: labelTextSpan,
                            nameInput: 'address',
                            active: eachAddress.addressId === selectedAddressInfo['addressId'],
                            defaultAddressId: response.data.defaultShippingAddressId
                            //active: eachAddress.repositoryId == addressList.defaultShippingAddressId
                        };
                        return <List key={eachAddress.repositoryId}><MaterialInputRadio options={addressOptions} handleClick={(e) => stateDetails({ fromAddress: true, selectedAddressid: e, address: response.data["records"] })} /></List>
                    }
                })
            this.setState({ listedAddress })
        });
    }
    componentDidMount() {
        if (this.props.loginDetails && this.props.loginDetails.LoggedInSession) {
            this.getAddress();
        }
        //this.setState({listedAddress})
    }

    validatePostalCodeEntry = () => {
        let zipCode = this.postalInput.current.state.value || '';
        if (zipCode.length == 5 && zipCode !== '00000') {
            this.setState({ postalCodeValidation: "" })
            this.props.stateDetails({ "postCode": this.postalInput.current.state.value })
            this.props.set_postal_zip_code(zipCode);
        }
        else {
            let errorText = '';
            if (zipCode !== '' && zipCode.length < 5) {
                errorText = this.props.staticLabels && this.props.staticLabels["pdpPage.zip_code.lessthan5.errormsg"] || 'pdpPage.zip_code.lessthan5.errormsg';
            } else if (zipCode !== '' && zipCode === '00000') {  
                errorText = this.props.staticLabels && this.props.staticLabels["pdpPage.soms_zero_zip_code.errormsg"] || 'pdpPage.soms_zero_zip_code.errormsg';
            } else {
                errorText = this.props.staticLabels && this.props.staticLabels["pdpPage.soms_no_date_invalid_zip_code.errormsg"] || 'pdpPage.soms_no_date_invalid_zip_code.errormsg';
            }
            this.setState({ postalCodeValidation: errorText, "postalCodeValue": this.postalInput.current.state.value })
        }
    }
    componentWillReceiveProps(nextProps) {
        //console.log("addressCWRP");
        //this.setState({ postalCodeValidation: "" })
        try {
            const nextLoginDetails = nextProps.loginDetails && nextProps.loginDetails.LoggedInSession || {};
            const prevLoginDetails = this.props.loginDetails && this.props.loginDetails.LoggedInSession || {};
            if (nextLoginDetails !== prevLoginDetails && (nextLoginDetails === true || nextLoginDetails === "true")) {
                this.getAddress();
            }
        } catch (e) { }
    }
    render() {

        const inputCP = {
            inputId: 'CP',
            labelText: 'Código Postal',
            nameInput: 'address',
            required: "required",
            isEddAddress: true,
            helperText: this.state.postalCodeValidation,
            maxlength: 5,
            // type: 'number'
            type: 'tel'
        };
        const updateButton = {
            blockType: 'span',
            buttonClass: 'mdc-button a-btn__primary m-eddBox__updateButton',
            spanText: 'Actualizar',
            spanClass: 'mdc-button__label',
            buttonAttributes: {
                "data-dismiss": "modal"
            }
        };
        const { addressList, addressList: { records }, stateDetails, selectedAddId } = this.props;
        return (
           
            <div className="m-product__eddAddress mb-0">
                <div className="row">
                    <div className="col-12 mb-2 mt-2">
                        <Paragraph className="a-product__paragraphAddressList m-0">Entrega a domicilio</Paragraph>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="m-product__eddAddressList">
                            <Ul className="user-address m-0 p-0">
                                {this.state.listedAddress}
                            </Ul>
                        </div>
                    </div>
                    <div className="col-12 mt-2 mb-2">
                        <Paragraph className="a-product__paragraphAddress m-0">Estima una dirección</Paragraph>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-lg-4 pr-2 pr-lg-2">
                        <InputText key={inputCP} ref={this.postalInput} options={inputCP} inputValue={this.state.postalCodeValue} warning={this.state.postalCodeValidation} handleChange={this.postalCodeChange} />
                    </div>
                    <div className="col-6 col-lg-4 pl-2 pl-lg-2">
                        <Button className={updateButton.buttonClass} data-dismiss="modal" handleClick={this.validatePostalCodeEntry} >
                            <Span>{updateButton.spanText}</Span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

}
