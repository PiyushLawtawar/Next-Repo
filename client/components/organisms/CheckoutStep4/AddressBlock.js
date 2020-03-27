/**
* Module Name : AddressBlock
* Functionality : Showing delivery address template
* @exports : AddressBlock
* @requires : module:React
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* Team : Checkout Team
* 
*/

import Paragraph from '../../atoms/Paragraph/Paragraph';
import { LabelSpan } from '../../molecules/MixinMolecules/MixinMolecules';

/*export default (this.props) => {
    const {  deleveryAddressDetail, isClickAndCollect,paymentDetail } = this.props;
    console.log('check this.props on address',this.props.paymentDetail);

    return (
        <React.Fragment>
            <div className="row align-items-center mt-4">
                <div className="col-lg-6 col-12">
                    <Paragraph className="a-checkout__titleSection m-0 pb-3">Dirección de entrega:</Paragraph>
                </div>
            </div>
            <div className="m-box mb-3">
                {
                    isClickAndCollect ?
                        <LabelSpan labelClass="a-box__cardTitle" labelText="Recoge en tienda: " spanClass="-driveThru d-lg-inline-block d-block" spanText="Click and collect Drive Thru" />
                        : ((this.props.paymentDetail['Forma de pago'] === "Transferencia" || this.props.paymentDetail.creditCardType )? (this.props.paymentDetail['Forma de pago'] === "Transferencia" ?<Paragraph className="a-box__cardTitle">Entrega a tienda</Paragraph> : '' ) || (this.props.paymentDetail.creditCardType ? <Paragraph className="a-box__cardTitle">Recoger en tienda</Paragraph> : ''):
                        <Paragraph className="a-box__cardTitle">Entrega a domicilio</Paragraph>)
                }
                <Paragraph className="a-box__cardNumber mb-1">{deleveryAddressDetail.nickName}</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">{deleveryAddressDetail.address1 + ', ' + deleveryAddressDetail.exteriorNumber + ', ' + deleveryAddressDetail.city + ', ' + deleveryAddressDetail.city + ', ' + deleveryAddressDetail.neighborhood + ', ' + deleveryAddressDetail.delegation + ', ' + deleveryAddressDetail.postalCode + ', ' + deleveryAddressDetail.state}</Paragraph>
            </div>
        </React.Fragment>
    )
}
*/

/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        /** SWOGO team requested not to send failure items to them and hence commiting this code */
        //this.getDataForSwogo();
    }

    /**
     * Method will call on change tag line
     * @function changeTagline
     * @author shreyansh.khare@zensar.com
     * @desc Dynamically returning tag line by address flag status
     * 
     */

    changeTagline = () => {
        let paymentOptionValue = false;
        let addressFlag = this.props.deleveryAddressDetail.storePickup;
        let labelMessage = '';
        if (this.props.paymentDetail && this.props.paymentDetail['Forma de pago'] && typeof this.props.paymentDetail['Forma de pago'] !== 'undefined') {
            if (this.props.paymentDetail['Forma de pago'] === 'Transferencia') {
                paymentOptionValue = true;
            }
            if (this.props.paymentDetail['Forma de pago'] === 'Efectivo') {
                paymentOptionValue = true;
            } if (JSON.stringify(this.props.paymentDetail['Forma de pago']).indexOf('CIE') > -1 &&
                JSON.stringify(this.props.paymentDetail['Forma de pago']).indexOf('Bancomer') > -1) {
                paymentOptionValue = true;
            }

        }
        if (!addressFlag) {
            labelMessage = 'Entrega a domicilio';
            return (
                <Paragraph className="a-box__cardTitle">Entrega a domicilio</Paragraph>
            )
        } else if (!paymentOptionValue && addressFlag && this.props.isClickAndCollect === 'ccd') {
            return (
                <React.Fragment>
                    <LabelSpan labelClass="a-box__cardTitle" labelText="Recoge en tienda: " spanClass="-driveThru d-lg-inline-block d-block" spanText="Click and collect Drive Thru" />
                    <Paragraph className="a-box__cardNumber mb-1">{this.props.deleveryAddressDetail.name}</Paragraph>
                </React.Fragment>
            )
        } else if (addressFlag) {
            labelMessage = 'Recoger en tienda';
            return (
                <Paragraph className="a-box__cardTitle">Recoger en tienda</Paragraph>
            )
        } else if (addressFlag && (this.props.paymentDetail['Forma de pago'] === "Transferencia")) {
            labelMessage = 'Entrega a tienda';
            return (
                <Paragraph className="a-box__cardTitle">Entrega a tienda</Paragraph>
            )
        }

        // if(this.props.isClickAndCollect){
        //  return (
        //      <LabelSpan labelClass="a-box__cardTitle" labelText="Recoge en tienda: " spanClass="-driveThru d-lg-inline-block d-block" spanText="Click and collect Drive Thru" />
        //  )
        // }else if(this.props.paymentDetail['Forma de pago'] === "Transferencia"){
        //       labelMessage = 'Entrega a tienda';
        //        return(
        //          <Paragraph className="a-box__cardTitle">Entrega a tienda</Paragraph>
        //       )
        // }else if(this.props.paymentDetail.creditCardType ){
        //        labelMessage = 'Recoger en tienda';
        //         return(
        //          <Paragraph className="a-box__cardTitle">Recoger en tienda</Paragraph>
        //       )
        // }else{
        //       labelMessage = 'Entrega a domicilio';
        //       return(
        //          <Paragraph className="a-box__cardTitle">Entrega a domicilio</Paragraph>
        //       )
        // }
    }


  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */

    render() {
        const {  deleveryAddressDetail, isClickAndCollect, paymentDetail } = this.props;
        //console.log('check this.props on address', this.props);
        return (
            <React.Fragment>
                <div className="row align-items-center mt-4">
                    <div className="col-lg-6 col-12">
                        <Paragraph className="a-checkout__titleSection m-0 pb-3">Dirección de entrega:</Paragraph>
                    </div>
                </div>
                <div className="m-box mb-3">
                    {this.changeTagline()}
                    {deleveryAddressDetail && deleveryAddressDetail.nickName ? <Paragraph className="a-box__cardNumber mb-1">{deleveryAddressDetail.nickName}</Paragraph> : ''}
                    {deleveryAddressDetail && deleveryAddressDetail.name && deleveryAddressDetail.storePickup && isClickAndCollect !== 'ccd' ? <Paragraph style={{ display: "inline-block", wordWrap: "break-word", wordBreak: "break-all" }} className="a-box__cardNumber m-0">{deleveryAddressDetail.name}</Paragraph> : ''}
                    {deleveryAddressDetail && deleveryAddressDetail.address1 ? <Paragraph style={{ display: "inline-block", wordWrap: "break-word", wordBreak: "break-all" }} className="a-box__cardNumber m-0">{deleveryAddressDetail.address1 + ', ' + deleveryAddressDetail.exteriorNumber + ', ' + deleveryAddressDetail.city + ', ' + deleveryAddressDetail.city + ', ' + deleveryAddressDetail.neighborhood + ', ' + deleveryAddressDetail.delegation + ', ' + deleveryAddressDetail.postalCode + ', ' + deleveryAddressDetail.state}</Paragraph> : ''}
                </div>
            </React.Fragment>
        )
    }
}
