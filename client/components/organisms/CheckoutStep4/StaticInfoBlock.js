/**
* Module Name :StaticInfoBlock
* Functionality : Showing static information template
* @exports :StaticInfoBlock
* @requires :module:React
* @requires :module:/atoms/Paragraph/Paragraph
* @requires :module:next/router
* Team : Checkout Team
* 
*/
import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { withRouter } from 'next/router';
import Router from 'next/router';

/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {

    /**
     * Method will call to redirect page
     * @function pageRedirection
     * @author shreyansh.khare@zensar.com
     * @desc This function will redirecting page
     * 
     */
    pageRedirection = () => {
        window.location.href = this.redirectURL;
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
        let email = this.props && this.props.orderData && this.props.orderData.email || '';
        let emailcheck = this.props.staticLabels && this.props.staticLabels['pwa.orderConfirmationPage.tiendano.text'] ? this.props.staticLabels['pwa.orderConfirmationPage.tiendano.text'].replace("#email#", email) : '';
        this.setState({
            emailHandle: emailcheck
        })
    }

    /**
     * REACT life cycle Event. This will get fire on load and on state update.
     * @event render 
     * 
     */

    render() {
        let { digitalPurchasesDisclaimer } = this.props.orderData || {};
        let viewPort = this.props.viewPort;
        // console.log('viewPort',this.props);

        let { staticLabels } = this.props;
        this.redirectURL = staticLabels && staticLabels['pwa.orderConfirmationPage.seguridadDelSitio'] ? staticLabels['pwa.orderConfirmationPage.seguridadDelSitio'] : '';
        let tiendaValue = '039';
        if (this.props.orderData && this.props.orderData.orderSuccess && this.props.orderData.orderSuccess.ItemDetails && this.props.orderData.orderSuccess.ItemDetails.success
            && this.props.orderData.orderSuccess.ItemDetails.success[0]) {
            tiendaValue = this.props.orderData.orderSuccess.ItemDetails.success[0]['tienda'];
        }
        // console.log('staticData',staticData)
        return (
            <React.Fragment>
                {/*<div className="m-box d-none d-lg-block">
                <Paragraph className="a-box__legal m-0">En caso de que haya adquirido más de un artículo, es posible que le sean entregados por separado, agradecemos su comprensión.</Paragraph>
                <Paragraph className="a-box__legal m-0">En Liverpool, nos preocupamos por su seguridad, por lo que esta compra estará sujeta a un proceso de validación para la entrega de la mercancía.</Paragraph>
                <Paragraph className="a-box__legal m-0">La página aplica para garantía y devoluciones.</Paragraph>
                <Paragraph className="a-box__legal m-0">El comprobante de pago se envió a la dirección: baliverpool01@gmail.com</Paragraph>
                <Paragraph className="a-box__legal m-0">Te recordamos que este sitio es seguro.</Paragraph>
                <Paragraph className="a-box__legal m-0">Centro de Atención Telefónica: 52629999 y en el interior de la República: 01 800 713 55 55</Paragraph>
                <Paragraph className="a-box__legal m-0">Tienda 039</Paragraph>
                <Paragraph className="a-box__legal m-0">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3.</Paragraph>
                <Paragraph className="a-box__legal m-0">Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos.</Paragraph>
                <Paragraph className="a-box__legal m-0">C.P. 05348, Ciudad de México.</Paragraph>
                <Paragraph className="a-box__legal m-0">RFC: DLI931201MI9. Régimen General de Ley Personas Morales.</Paragraph>
            </div>*/}
                <div className="m-box d-none d-lg-block"  >
                    {/*<Paragraph className="a-box__legal m-0" htmlText={staticLabels['pwa.orderConfirmationPage.policytext1.text']} />
                <Paragraph className="a-box__legal m-0" htmlText={staticLabels['pwa.orderConfirmationPage.policytext2.text']} />
                <Paragraph className="a-box__legal m-0" htmlText={staticLabels['pwa.orderConfirmationPage.policytext3.text']} />
                <Paragraph className="a-box__legal m-0"> {email?':'+email:':baliverpool01@gmail.com'} </Paragraph>
                <Paragraph className="a-box__legal m-0" htmlText={staticLabels['pwa.orderConfirmationPage.policytext4.text']} />
                <Paragraph className="a-box__legal m-0">Centro de Atención Telefónica: 52629999 y en el interior de la República: 01 800 713 55 55</Paragraph>
                <Paragraph className="a-box__legal m-0">Tienda {tiendaValue}</Paragraph>
                <Paragraph className="a-box__legal m-0">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3.</Paragraph>
                <Paragraph className="a-box__legal m-0">Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos.</Paragraph>
                <Paragraph className="a-box__legal m-0">C.P. 05348, Ciudad de México.</Paragraph>
                <Paragraph className="a-box__legal m-0">RFC: DLI931201MI9. Régimen General de Ley Personas Morales.</Paragraph>*/}

                    {this.state && this.state.emailHandle ? <Paragraph className="a-box__legal m-0" dangerouslySetInnerHTML={{ __html: this.state.emailHandle }} /> : null}
                </div>
                {digitalPurchasesDisclaimer &&
                    <Paragraph className="a-checkout__reminder m-0 p-lg-3 pt-3 pb-3">*{digitalPurchasesDisclaimer}</Paragraph>
                }
                <Paragraph className="pt-3 m-0 d-none d-lg-block" onClick={this.pageRedirection}>
                    <i className="icon-lock pr-2"></i><span>{staticLabels && staticLabels['pwa.orderConfirmationPage.todastext.text'] ? staticLabels['pwa.orderConfirmationPage.todastext.text'] : ''}</span>
                </Paragraph>
                {viewPort.isMobile ?
                    <div className="row d-lg-none d-block">
                        <div className="col-12 text-center">

                            <Paragraph className="m-0" onClick={this.pageRedirection}><i className="icon-lock pr-2"></i><span>{staticLabels && staticLabels['pwa.orderConfirmationPage.todastext.text'] ? staticLabels['pwa.orderConfirmationPage.todastext.text'] : ''}</span>
                            </Paragraph>
                        </div>


                        <div className="col-12 text-justify">
                            <p className="a-box__legal m-0 pt-3">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3. Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos. C.P. 05348, Ciudad de México.RFC: DLI931201MI9. Régimen General de Ley Personas Morales., Cuajimalpa de Morelos, CDMX, C.P.05348
            </p>
                            <p className="a-box__legal m-0 pt-3">Lugar de expedición: Liverpool Santa Fe, Av. Vasco de Quiroga, 3800 Col. Santa Fe Cuajimalpa, Cuajimalpa de Morelos, CDMX, C.P.05348
            </p>
                        </div>
                    </div>
                    : ''}

            </React.Fragment >
        )
    }
}

