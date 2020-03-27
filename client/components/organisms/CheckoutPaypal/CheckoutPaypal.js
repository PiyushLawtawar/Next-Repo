//import './CheckoutPaypal.styl';

/**
* Module Name : CheckoutPaypal
* Functionality : Showing paypal payment option as second tab
* @exports : CheckoutPaypal as functional component
* @requires : module:React
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/helpers/utilities/utility
* Team : Checkout Team
* Other information :  Showing paypal payment option
* 
*/

import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';
import { getAssetsPath } from '../../../helpers/utilities/utility';

/*include ../../atoms/TagImage/atom-image
include ../../atoms/Paragraph/atom-paragraph.pug
#paypalOrganism.o-paypalInfo
    .col-12.d-flex.justify-content-center.justify-content-md-start.p-0.flex-column
        +atom-paragraph("Esta forma de pago no aplica para compra de servicios, sólo de mercancía.", "a-paypalInfo__heading")
        +atom-image("../../../assets/images/atomo-icono-paypal.svg", "Logo PayPal", "a-paypalInfo__logo")(id = "paypalLogoBig")
        +atom-paragraph("Si ya estás registrado, puedes usar tu cuenta PayPal para pagar tus compras. ¿No tienes cuenta? ¡Ábrela ahora! PayPal te
         permite hacer pagos de manera  fácil y segura en millones de tiendas en línea con sólo proporcionar tu correo y contraseña.
          Mantén tus datos seguros: PayPal no comparte tu información financiera y después de registrarte,
         ya no tendrás que ingresar los números ni códigos de seguridad de tus tarjetas de crédito y/o débito.", "a-paypalInfo__description")*/
export default (props) => {
    let  AssetsPath = '../../..';
	if (typeof window !== 'undefined') {
		const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';   
	}
    return (
        <div className={(props.ppclassName) ? "o-paypalInfo d-block" : "o-paypalInfo d-none"} id="paypalOrganism" {...props}>
            <div className="col-12 d-flex justify-content-center justify-content-md-start p-0 flex-column">
                <Paragraph className="a-paypalInfo__heading">{props.staticLabelValues['pwa.checkoutBillingPage.newPaymentMethod.service.message']}
                            </Paragraph>
                <Image className="a-paypalInfo__logo" src={AssetsPath + "/static/images/atomo-icono-paypal.svg"} alt="Logo PayPal" id="paypalLogoBig" />
                <Paragraph className="a-paypalInfo__description">{props.staticLabelValues['pwa.checkoutBillingPage.newPaymentMethod.paypal.message1']}</Paragraph>
            </div>
        </div>
    );
}