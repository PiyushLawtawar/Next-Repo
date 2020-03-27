//import './CheckoutEstablishment.styl'
import ModalHeader from '../../molecules/Modals/ModalHeader'
import Paragraph from '../../atoms/Paragraph/Paragraph'
import Link from '../../atoms/Link/Link'
import Image from '../../atoms/Tagimage/Image'
import { parentContext } from '../../../contexts/parentContext';
import {  getAssetsPath } from '../../../helpers/utilities/utility';
export default (props) => {

let modalHeader = {
		title: 'Establecimientos',
		titleType: 'h4',
		headlineAttributes: {
			"id":"establishments"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type":"button",
			"data-dismiss":"modal",
			"aria-label":"Close"
		}
  }

  let  AssetsPath = '../../..';
    if (typeof window !== 'undefined') {
      //console.log('................if.......................');
      const path = getAssetsPath(window,undefined);
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';
    }else{
      //console.log('..............else..if..........hostname.............',props.router.query.data.hostname);
      const path = getAssetsPath(undefined,props.router.query.data.hostname,process);
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';
    }
    //console.log('................AssetsPath.......................',AssetsPath);
return(
<div className="o-product__modal modal fade show overFlowOnlyInMobile" id="establishments" tabindex="1" role="dialog" aria-labelledby="description-modal">
      <div className="modal-dialog establishmentsModal" role="document">
        <div className="modal-content">
              <ModalHeader modalHeader={modalHeader} />

          <div className="modal-body">
            <div className="row">
              <div className="col-12">
                    <Paragraph className="a-modal__title mt-md-2 ml-md-2 mb-1">Puedes realizar tu pago en cualquiera de los siguientes establecimientos.
                    </Paragraph>
              </div>
              <div className="col-12">
                    <Paragraph className="a-modal__description ml-md-2 mb-4">Los montos máximos pueden variar dependiendo de las políticas de cada establecimiento
                    </Paragraph>
              </div>
              <div className="col-12 d-lg-none mb-4 pd-2">
                <parentContext.Consumer>
                      {({ OpenModal }) => (
                        <Link className="a-checkout__termsLink" href="#" data-toggle="modal" data-target="#establishments2" onClick={() => OpenModal("billingInnerModel",'billingmodel')} >Ver establecimientos cercanos</Link>
                      )}
                  </parentContext.Consumer>
              </div>
              <div className="col-12">
                <div className="m-establishmentsRow col-12">
                      <Paragraph className=".a-deliveryAddress__description mb-3 pb-1">Monto máximo: $5,000
                      </Paragraph>
                  <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center ml-lg-1">
                      <Image className="a-allyEstablishments__icon" src= {AssetsPath + "/static/images/atomo-icono-waldos.jpg"} alt="Ícono Waldos" />
                        <Paragraph className="a-allyEstablishments__name">Waldos´s
                        </Paragraph>
                  </div>
                </div>
                <div className="m-establishmentsRow col-12">
                      <Paragraph className=".a-deliveryAddress__description mb-3 pb-1">Monto máximo: $10,000
                      </Paragraph>
                  <div className="row col-12 p-0 m-0 d-flex flex-row justify-content-start">
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-extra.png"} alt="Ícono Extra" />
                          <Paragraph className="a-allyEstablishments__name">Extra
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-k.jpg"} alt="Ícono K" />
                          <Paragraph className="a-allyEstablishments__name">K
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-k.png"} alt="Ícono Circle K" />
                          <Paragraph className="a-allyEstablishments__name">Circle K
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-alSuper.jpg"} alt="Ícono AlSuper" />
                          <Paragraph className="a-allyEstablishments__name">Alsuper
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-prendaMex.jpg"} alt="Ícono PrendaMex" />
                          <Paragraph className="a-allyEstablishments__name">Prenda Mex
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-cefemex.jpg"} alt="Ícono Cefemex" />
                          <Paragraph className="a-allyEstablishments__name">Cefemex
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-petroFe.jpg"} alt="Ícono Petro-Fé" />
                          <Paragraph className="a-allyEstablishments__name">Grupo Petro-Fé
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-maxilana.jpg"} alt="Ícono Maxilana" />
                          <Paragraph className="a-allyEstablishments__name">Maxilana
                          </Paragraph>
                    </div>
                  </div>
                </div>
                <div className="m-establishmentsRow col-12">
                      <Paragraph className=".a-deliveryAddress__description mb-3 pb-1">Monto máximo: $15,000
                      </Paragraph>
                  <div className="row col-12 p-0 m-0 d-flex flex-row justify-content-start">
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-seven.png"} alt="Ícono Seven-Eleven" />
                          <Paragraph className="a-allyEstablishments__name">7 eleven
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-benavides.png"} alt="Ícono Farmacias Benavides" />
                          <Paragraph className="a-allyEstablishments__name">Farmacias Benavides
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-one.jpg"} alt="Ícono One" />
                          <Paragraph className="a-allyEstablishments__name">One
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-bazar.jpg"} alt="Ícono Famrcias Bazar" />
                          <Paragraph className="a-allyEstablishments__name">Famrcias Bazar
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-creemos.jpg"} alt="Ícono TeCreemos" />
                          <Paragraph className="a-allyEstablishments__name">Te Creemos
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-tamaulipas.jpg"} alt="Ícono Tamaulipas" />
                          <Paragraph className="a-allyEstablishments__name">Caja Solidaria Tamaulipas
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-cerroSilla.jpg"} alt="Ícono Cerro de la Silla" />
                          <Paragraph className="a-allyEstablishments__name">Caja Cerro de la Silla
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-1 d-flex flex-column justify-content-center pl-0 align-items-center mr-lg-3">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-asturiano.jpg"} alt="Ícono Asturiano" />
                          <Paragraph className="a-allyEstablishments__name">El Asturiano
                          </Paragraph>
                    </div>
                  </div>
                </div>
                <div className="m-establishmentsRow col-12">
                      <Paragraph className=".a-deliveryAddress__description mb-3 pb-1">Monto máximo: $30,000
                      </Paragraph>
                  <div className="row col-12 p-0 m-0 d-flex flex-row justify-content-start">
                    <div className="col-3 col-lg-auto d-flex flex-column justify-content-center pl-0 align-items-center">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-ahorro.png"} alt="Ícono Farmacias Ahorro" />
                          <Paragraph className="a-allyEstablishments__name">Farmacia del Ahorro
                          </Paragraph>
                    </div>
                    <div className="col-3 col-lg-auto d-flex flex-column justify-content-center pl-0 align-items-center">
                        <Image className="a-allyEstablishments__icon" src={AssetsPath + "/static/images/atomo-icono-kiosco.jpg"} alt="Ícono Kiosco" />
                          <Paragraph className="a-allyEstablishments__name">Kiosco
                          </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 d-none d-lg-block text-center mt-3">
                  <parentContext.Consumer>
                      {({ OpenModal }) => (
                        <Link className="a-checkout__termsLink" href="#" data-toggle="modal" data-target="#establishments2" onClick={() => OpenModal("billingInnerModel",'billingmodel')} >Ver establecimientos cercanos</Link>
                      )}
                  </parentContext.Consumer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}
