/**
* Module Name : CieBlock
* Functionality : Shwoing CIE template
* @exports : CieBlock as functional component
* @requires : module:React
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/atoms/HrTag/HrTag
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/helpers/utilities/utility
* Team : Checkout Team
* 
*/
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import HrTag from '../../atoms/HrTag/HrTag';
import Image from '../../atoms/Tagimage/Image';

import Paragraph from '../../atoms/Paragraph/Paragraph';
import { getAssetsPath } from '../../../helpers/utilities/utility';

export default (props) => {
    const { orderSuccessTotal } = props.orderSuccessTotal;
    // console.log('orderSuccessTotal::::',orderSuccessTotal);
    let  AssetsPath = '../../..';
	if (typeof window !== 'undefined') {
		const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
	}else{
        const path = getAssetsPath(undefined,props.hostname,process); 
        AssetsPath = (path && path !='' && path.length > 9)?path:'../../..'; 
    }
    return (
        <React.Fragment>
            <div className="row align-items-start mt-3">
                <div className="col-12">
                    <div className="m-box mb-3">
                        <H4 headLineClass="a-box__heading" headLineText="Proceso para completar tu pedido" />
                        <HrTag />
                        <div className="row no-gutters align-items-center justify-content-between mt-3 mb-3">
                            <div className="col-auto">
                                <Paragraph className="a-box__cardTitle m-0">Convenio CIE: 1207865</Paragraph>
                            </div>
                            <div className="col-auto">
                                <Paragraph className="a-box__cardTitle m-0">{'Número de referencia: ' + props.orderSuccessTotal.cieBancomerReference}</Paragraph>
                            </div>
                        </div>
                        <HrTag />
                        <Paragraph className="a-box__resume m-0">Recuerda que con tu hoja de pedido podrás realizar tu pago en cualquier de los siguientes medios</Paragraph>
                        <div className="row no-gutters align-items-start justify-content-center mt-3 mb-3">
                            <Image src={AssetsPath + "/static/images/bancomer-logo.png"} alt="Logo" />
                            <Image src={AssetsPath + "/static/images/7-eleven-logo-210-x-136.png"} alt="Logo" />
                            <Image src={AssetsPath + "/static/images/spei-logo.png"} alt="Logo" />
                        </div>
                        <div className="row no-gutters align-items-start justify-content-center mt-3 mb-3" >
                            <Image src={'data:image/png;base64,' + props.orderSuccessTotal.cieBarCode} alt="Logo" />
                        </div>
                        <div className="row no-gutters align-items-start justify-content-between mt-3 mb-3">
                            <div className="col-lg-6 col-12 pr-3">
                                <Paragraph className="a-box__legal m-0 pb-3">• Cualquier sucursal o cajero automático BBVA Bancomer o desde su portal https://www.bancomer.com/, para lo cual deberás presentar impresa tu Hoja de Pedido o indicar:
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Número de la Referencia
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Importe exacto a pagar
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3 pb-3">• Convenio CIE: 1207865
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• Realizar una transferencia electrónica desde cualquier otro banco a Bancomer a través de SPEI, indicando los siguientes datos:
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Número de la Referencia
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Importe exacto a pagar
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Convenio CIE: 1207865
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3 pb-3">• CLABE: 012914002012078652
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• En cualquier tienda 7-Eleven de la República Mexicana, presentando tu hoja de pedido impresa o indicando el Número de la Referencia y el importe exacto a pagar:
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Tu pago podrás realizarlo únicamente en efectivo
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• El importe máximo de tu Referencia no podrá ser mayor a $10,000.00 pesos
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3 pb-3">• En estos comercios se te cobrará una comisión adicional de $9.00 pesos
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• Deberás de realizar tu pago dentro del tiempo establecido en la fecha de vencimiento que marca tu referencia; de no realizarlo dentro de este plazo tu pedido será cancelado automáticamente. Podrás realizar tu pago conforme a los horarios establecidos en la institución financiera. Liverpool recibirá de la institución financiera el registro de tu pago los días martes a sábado.
                      </Paragraph>
                            </div>
                            <div className="col-lg-6 col-12 pl-3">
                                <Paragraph className="a-box__legal m-0 pb-3">• La presente hoja de pedido no podrá ser utilizada después de la fecha de vencimiento indicada.
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• Al imprimir esta hoja asegúrate de imprimirla al 100% de su tamaño (no reducción, ni ampliación), de preferencia con una impresora láser, y procura no doblarla ya que puede ocasionar problemas de lectura del código de barras por los scaners. Te recomendamos verificar que los datos proporcionados sean correctos ya que servirán para la entrega de tu producto.
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• Te recordamos que es necesario conservar el comprobante de pago original, el cual deberá coincidir con el monto total de tu compra, en caso contrario, DISTRIBUIDORA LIVERPOOL, S.A. DE C.V. se reserva el derecho de realizar la entrega hasta en tanto no le sea acreditado el pago correspondiente.
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• Se deberá de pagar el importe exacto de tu pedido.
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• La mercancía solicitada queda sujeta a la disponibilidad del inventario al momento de recibir tu pago.
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pb-3">• En caso de requerir un reembolso:
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3">• Llama al Centro de Atención telefónica al 5262-9999 o del Interior de la República sin costo al 01 800 713 5555, en donde un asesor te apoyará para realizar el cambio y/o devolución.
                      </Paragraph>
                                <Paragraph className="a-box__legal m-0 pl-3 pb-3">• Ten a la mano tu confirmación de compra (email que recibiste cuando realizaste tu compra).
                      </Paragraph>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center d-flex d-lg-none">
                        <div className="col-lg-4 col-12 text-center">
                            <Paragraph className="m-0"><i className="icon-lock pr-2"></i><span>Todas nuestras transacciones son seguras </span>
                            </Paragraph>
                        </div>
                        <div className="col-12 text-justify">
                            <Paragraph className="a-box__legal m-0 pt-3">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3. Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos. C.P. 05348, Ciudad de México.RFC: DLI931201MI9. Régimen General de Ley Personas Morales., Cuajimalpa de Morelos, CDMX, C.P.05348
                    </Paragraph>
                            <Paragraph className="a-box__legal m-0 pt-3">Lugar de expedición: Liverpool Santa Fe, Av. Vasco de Quiroga, 3800 Col. Santa Fe Cuajimalpa, Cuajimalpa de Morelos, CDMX, C.P.05348
                    </Paragraph>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}