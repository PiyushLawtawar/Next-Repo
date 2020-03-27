/**
* Module Name :PaymentDetailBlock
* Functionality : Showing payment details related template.
* @exports : PaymentDetailBlock
* @requires : module:React
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/helpers/utilities/utility
* Team : Checkout Team
* Other information : Showing payment details related template.
* 
*/
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';
import { getAssetsPath } from '../../../helpers/utilities/utility';

/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/
export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Method will validate referance number
     * @function referenceNumber
     * @author shreyansh.khare@zensar.com
     * @desc Validating referance number and returning value.
     * @param {object} ref
     * @returns {string} arr
     */
    referenceNumber = (ref) => {
        if (ref) {
            var arr = ref.split('');
            for (let i = 0; i < arr.length; i++) {
                if (i == 4 || i == 9 || i == 14 || i == 19) {

                    arr.splice(i, 0, '-')
                }
            }
            return arr.join("")
        } else {
            return ''
        }
    }

  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */
    
    render() {
        let  AssetsPath = '../../..';
	    if (typeof window !== 'undefined') {
		    const path = getAssetsPath(window,undefined); 
            AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
	    }

        const { paymentDetail, orderSuccessTotal, staticLabels, configurationData } = this.props;
        let orderedcardtypesmap = configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration && configurationData.configuration.liverpoolconfiguration.orderedcardtypesmap || [];
        let cartdTypes = {};
        Object.keys(orderedcardtypesmap).map(key => {
            const obj = orderedcardtypesmap[key];
            const name = Object.keys(obj)[0];
            const value = obj[name];
            cartdTypes[name.toLowerCase()] = value;
        })

        return (
            <React.Fragment>
                <div className="row align-items-center mt-4">
                    <div className="col-lg-6 col-12">
                        <Paragraph className="a-checkout__titleSection m-0 pb-3">{staticLabels['pwa.orderConfirmationPage.PaymentDetails.text'] + ': '}</Paragraph>
                    </div>
                </div>
                {(paymentDetail && paymentDetail.creditCardType && paymentDetail.creditCardNumber) &&
                    <div className="m-box mb-3">
                        <Paragraph className="a-box__cardTitle">{paymentDetail && paymentDetail.creditCardType && cartdTypes[paymentDetail.creditCardType.toLowerCase()] || paymentDetail.creditCardType.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</Paragraph>
                        <Paragraph className="a-box__cardNumber m-0">*{paymentDetail.creditCardNumber.slice(-4)}</Paragraph>
                    </div>
                }
                {(paymentDetail && paymentDetail['Forma de pago'] && paymentDetail['Forma de pago'].trim().toLowerCase() === 'Pago: Paypal'.toLowerCase()) &&
                    <div className="m-box mb-3">
                        <Image className="a-box__image w-auto pt-3 pb-3" src={AssetsPath + "/static/images/paypal-color.svg"} alt="Paypal" />
                    </div>
                }
                {(paymentDetail && paymentDetail['Forma de pago'] && paymentDetail['Forma de pago'].trim().toLowerCase() === ''.toLowerCase())}
                <div style={{ display: 'none' }} className="m-box mb-3">
                    <Paragraph className="a-box__cardTitle">Efectivo y Transferencias</Paragraph>
                    <Paragraph className="a-box__cardNumber mb-1">Estatus: Pendiente</Paragraph>
                    <Paragraph className="a-box__cardNumber m-0">Vence: 13 de Dic 2019</Paragraph>
                </div>
                {(paymentDetail && paymentDetail['Forma de pago'] && (paymentDetail['Forma de pago'].trim().toLowerCase() === 'Transferencia'.toLowerCase() || paymentDetail['Forma de pago'].trim().toLowerCase() === 'Efectivo'.toLowerCase() || paymentDetail['Forma de pago'].trim().toLowerCase() === 'Efectivo y Transferencias'.toLowerCase() || paymentDetail['Forma de pago'].trim().toLowerCase() === 'Pago: CIE Bancomer'.toLowerCase())) &&
                    <div className="m-box mb-3">
                        <Paragraph className="a-box__cardTitle">{paymentDetail['Forma de pago'].trim().toLowerCase() !== 'Pago: CIE Bancomer'.toLowerCase() ? paymentDetail['Forma de pago'] : 'Efectivo y Transferencias'}
                        </Paragraph>
                        {paymentDetail.Estatus && <Paragraph className="a-box__cardNumber mb-1">Estatus: <span className="-pendingDelivery">{paymentDetail.Estatus}</span>
                        </Paragraph>}
                        {orderSuccessTotal.expirationTime && <Paragraph className="a-box__cardNumber mb-1">Vence: {orderSuccessTotal.expirationTime}
                        </Paragraph>}
                        {orderSuccessTotal.cieBancomerReference && <Paragraph className="a-box__cardNumber mb-1">Referencia: {this.referenceNumber(orderSuccessTotal.cieBancomerReference)}
                        </Paragraph>}
                        {orderSuccessTotal.clabe && <Paragraph className="a-box__cardNumber m-0">CLABE: {orderSuccessTotal.clabe}
                        </Paragraph>}
                        {orderSuccessTotal.bankname && <Paragraph className="a-box__cardNumber m-0">Banco Destino: {orderSuccessTotal.bankname}
                        </Paragraph>}
                    </div>
                }
            </React.Fragment>
        )
    }
}
