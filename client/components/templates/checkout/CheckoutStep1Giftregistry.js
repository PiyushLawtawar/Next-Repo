import {H4,H5} from '../../atoms/HeadLines/Headlines';
import Link from '../../atoms/Link/Link';
import HrTag from '../../atoms/HrTag/HrTag';
import Label from '../../atoms/Label/Label';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import Image from '../../atoms/Tagimage/Image';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import {InputText,InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Alert from '../../molecules/Alert/Alert';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import {Menumotion} from '../../molecules/MenuMotion/molecule-menu-motion';
import CheckoutHeader from '../../organisms/Header/CheckoutHeader';
import Footer from '../../organisms/Footer/Footer';
export default (props) =>{

let validity = {
        labelText: "Pais",
        labelId: 'validity',
        selected: true,
        optionList:[
            {
                name:"",
                value:""
            },
            {
                name:"1",
                value:"1"
            },
             {
                name:"2",
                value:"2"
            },
             {
                name:"3",
                value:"3"
            }
        ]
    }


let optionsI={
                            labelText: 'Selecciona un Evento',
                            labelId: 'Label-associatedPurchase',
                            selectId: 'associatedPurchase',
                            alertId: 'alert-associatedPurchase',
                            alertText: 'Error Estado',
                            headingText: 'Mesa para asociar compra',
                            headingClass: 'a-select__helpText',
                            headingIcon: 'icon-help a-select__help',
                            headingTooltipText: '111Esta dirección tiene más de una mesa de regalos asociada, las compras que realices solo se asociarán a la mesa de regalos que selecciones.'
                            //selected: true
                          }
const mBox={"active":"false" , "amount": "20", "inputId" : "itemArray[5]", "nameInput" : "delivery" , "radioId": 'delivery'}

return(
<React.Fragment>
  <CheckoutHeader />

         <Alert alertTopclassName="m-alert__container mdc-snackbar" iconType="icon-close"/>
<main>
<div className="container">
        <div className="row">
          <div className="col-12">
                <H4 headLineClass="a-checkout__heading -headingMargin" headLineText="Selecciona el tipo de entrega de tu preferencia" />
          </div>
        </div>
      <div className="row">
         <div className="col-lg-8 col-12 order-1">
        <div className="m-box mb-4">
          <div className="row no-gutters align-items-center justify-content-between">
            <Link className="m-box__accordionHeading collapsed" href="#shipToStore" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="shipToStore" onclick="sendAlertWarning()">
                      <div className="m-box_accordionText">
                            <H5 headLineClass="a-box__heading" headLineText="Recoge en tienda"/>
                            <Label className="a-box__subHeading">Selecciona tu tienda mas cercana</Label>
                      </div>
                      <div className="a-box__accordionIcon">
                        <Icons className="icon-arrow_down" />
                      </div>
            </Link>

          {/*collapse data Recoge en tienda*/}

           <div className="w-100" id="shipToStore">
                  <hr className="a-box__horizontalSeparator" />
                  <div className="row no-gutters align-items-end justify-content-between mt-3">
                    <div className="col-lg-4 col-12">
                      <MaterialSelect options={validity} />
                      <div className="mdc-select-helper-line">
                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectState">Error Estado
                            </Paragraph>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12">
                      <Span className="a-select__helpText">Mesa para asociar compra<i className="icon-help a-select__help" data-container="body" data-toggle="popover" data-placement="top" data-content="444Las compras que realices solo se asociarán a la mesa de regalos que selecciones." data-original-title="" title=""></i></Span>

                       <MaterialSelect options={validity} />

                      <div className="mdc-select-helper-line">
                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectEvent">Error Estado
                            </Paragraph>
                      </div>
                   </div>
                    <div className="col-lg-2 col-5 text-right d-none d-lg-block align-self-center">
                          <Paragraph className="a-box__requiredMessage">* Campos obligatorios
                          </Paragraph>
                    </div>
                  </div>

                </div>

          </div>



          {/*new row store added*/}

<div className="col-12 rowStore">
                      <div className="mdc-form-field">
                        <MaterialInputRadio options={mBox} />
                            <Label for="insurgentes">
                              <Span className="a-box__radioTitle">Liverpool Galerías Insurgentes</Span>
                              <Span className="a-box__radioSubtitle">Liverpool Toreo,Colonia Lomas de Sotelo,Naucalpan de Juárez,Lomas de Sotelo,Distrito Federal,México,C.P.53390,Tel.5596897200, Ubicación, Módulo de Click and Collect: Piso 3 Junto al departamento de Blancos</Span>
                            </Label>
                      </div>
                      <div className="row justify-content-center mt-3 mb-3">
                        <div className="col-lg-5 col-12 pl-5 pl-lg-3">
                          <div className="mdc-form-field">
                            <MaterialInputRadio options={mBox}/>
                                <Label for="insurgentes"><Span className="a-box__radioTitle">Click &amp; Collect</Span>

                                <Span className="a-box__radioSubtitle">Módulo de Click and Collect; Calle de Oso, a un costado de la Ferretería, Jardinería y llantera en el edificio del estacionamiento.</Span>
                                </Label>
                          </div>
                        </div>
                        <div className="col-lg-5 col-12 pl-5 pl-lg-3">
                          <div className="mdc-form-field">
                            <MaterialInputRadio options={mBox}/>
                                <Label for="insurgentes"><Span className="a-box__radioTitle">Click &amp; Collect Drive Thu</Span>
                                <Span className="a-box__radioSubtitle">Módulo de Click and Collect; Calle de Oso, a un costado de la Ferretería, Jardinería y llantera en el edificio del estacionamiento.</Span>
                                </Label>
                          </div>
                        </div>
                      </div>
                    </div>

{/*end of new row store added*/}

           {/*End of collapse data Recoge en tienda*/}
      </div>

 <div className="m-box">
    <div className="row no-gutters align-items-center justify-content-between pb-4">
               <Link className="m-box__accordionHeading" href="#shipToAddress" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="shipToAddress" onclick="sendAlertWarning()">
                      <div className="m-box_accordionText">
                            <H5 headLineClass="a-box__heading" headLineText="Entrega en tu domicilio"/>
                            <Label className="a-box__subHeading">Selecciona una dirección</Label>
                      </div>
                      <div className="a-box__accordionIcon">
                        <Icons className="icon-arrow_down" />
                      </div>
                 </Link>

  {/*collapse data*/}
                 <div className="w-100" id="shipToAddress">
                  <hr className="a-box__horizontalSeparator" />
                  <div className="row align-items-center justify-content-between mb-4">
                    <div className="col-10">

  {/* Radio button*/}
                    <div className="mdc-form-field">
                         <MaterialInputRadio options={mBox}/>
                            <Label for="address1"><Span className="a-box__radioTitle">Casa ana</Span><br/>
                              <div className="m-flag">
                                <div className="m-flag-item -primaryFlag -mesa"><Span>Mesa de Regalos</Span><Icons className="icon-gift" />
                                </div>
                              </div>
                              <Span className="a-box__radioSubtitle"><br />Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Span>
                              <Span className="a-box__radioFlag"><br />Predeterminada</Span>
                            </Label>
                      </div>

 {/* end of Radio button*/}

                    </div>
                    <div className="col-2 text-right">
                             <Menumotion />
                    </div>
                  </div>


{/*............................................................................*/}
           <div className="row no-gutters align-items-center justify-content-between mt-3 -pl-associatedPurchase">
                    <div className="col-lg-5 col-12">
                      <Span className="a-select__helpText">Mesa para asociar compra
                        <Icons className="icon-help a-select__help" data-container="body" data-toggle="popover" data-placement="top" data-content="222Esta dirección tiene más de una mesa de regalos asociada, las compras que realices solo se asociarán a la mesa de regalos que selecciones." data-original-title="" title="" /></Span>
                     <MaterialSelect options={validity} />
                      <div className="mdc-select-helper-line">
                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-associatedPurchase">Error Estado
                            </Paragraph>
                      </div>
                    </div>
                    <div className="col-lg-3 d-none d-lg-block">
                          <Paragraph className="a-box__requiredMessage">* Campos obligatorios
                          </Paragraph>
                    </div>
                  </div>
            <div className="row no-gutters align-items-center mb-3 -pl-associatedPurchase">
                    <div className="col-12">
                      <div className="a-box__radioSuccessAlert"><Icons className="icon-done pr-2" />Tus compras serán asociadas a tu mesa de regalos exceptuando categorías no participantes.</div>
                    </div>
            </div>
            <hr />
{/*............................................................................*/}

<div className="row align-items-center justify-content-between mb-4">
                    <div className="col-10">

  {/* Radio button*/}
                      <div className="mdc-form-field">
                         <MaterialInputRadio options={mBox}/>
                            <Label for="address1"><Span className="a-box__radioTitle">Casa ana</Span><br/>
                              <div className="m-flag">
                                <div className="m-flag-item -primaryFlag -mesa"><Span>Mesa de Regalos</Span><Icons className="icon-gift" />
                                </div>
                              </div>
                              <Span className="a-box__radioSubtitle"><br />Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Span>
                              <Span className="a-box__radioFlag"><br />Predeterminada</Span>
                            </Label>
                      </div>
 {/* end of Radio button*/}

                    </div>
                    <div className="col-2 text-right">
                             <Menumotion />
                    </div>
                  </div>


{/*............................................................................*/}

            <hr />


<div className="row align-items-center justify-content-between mb-4">
                    <div className="col-10">

  {/* Radio button*/}
                     <div className="mdc-form-field">
                         <MaterialInputRadio options={mBox}/>
                            <Label for="address1"><Span className="a-box__radioTitle">Casa ana</Span><br/>
                              <div className="m-flag">
                                <div className="m-flag-item -primaryFlag -mesa"><Span>Mesa de Regalos</Span><Icons className="icon-gift" />
                                </div>
                              </div>
                              <Span className="a-box__radioSubtitle"><br />Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Span>
                              <Span className="a-box__radioFlag"><br />Predeterminada</Span>
                            </Label>
                      </div>
 {/* end of Radio button*/}

                    </div>
                    <div className="col-2 text-right">
                              <Menumotion />
                    </div>
                  </div>


{/*............................................................................*/}
           <div className="row no-gutters align-items-center justify-content-between mt-3 -pl-associatedPurchase">
                    <div className="col-lg-5 col-12">
                      <Span className="a-select__helpText">Mesa para asociar compra
                        <Icons className="icon-help a-select__help" data-container="body" data-toggle="popover" data-placement="top" data-content="333Esta dirección tiene más de una mesa de regalos asociada, las compras que realices solo se asociarán a la mesa de regalos que selecciones." data-original-title="" title="" /></Span>
                     <MaterialSelect options={validity} />
                      <div className="mdc-select-helper-line">
                            <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-associatedPurchase">Error Estado
                            </Paragraph>
                      </div>
                    </div>

                  </div>
            <div className="row no-gutters align-items-center mb-3 -pl-associatedPurchase">
                    <div className="col-12">
                      <div className="a-box__radioWarningAlert">555Esta dirección no registrada en tu mesa de regalos, las compras que realices no serán asociadas</div>
                    </div>
            </div>


<div className="row align-items-center mt-3">
                    <div className="col-lg-4 col-12 col-xl-3">
                          <Button className="a-btn a-btn--tertiary -ml-45 -btnCheckout mb-lg-4" ripple="">Agregar dirección
                            <Icons className="icon-arrow_right d-lg-none d-block" />
                          </Button>
                    </div>
                  </div>


                </div>
  {/*end of collapse data*/}
    </div>
  </div>

      </div>
      </div>
</div>
</main>

<Footer />
</ React.Fragment>
);
}
