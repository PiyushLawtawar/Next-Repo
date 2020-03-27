/*include ../../molecules/MaterialInputText/molecule-inputText
include ../../molecules/MaterialInputCheckbox/molecule-inputCheckbox
include ../../molecules/MaterialSelect/molecule-select
include ../../molecules/MaterialInputRadio/molecule-inputRadio
include ../../molecules/MenuMotion/molecule-menu-motion
include ../../atoms/Buttons/atom-buttons
include ../../atoms/HrTag/atom-hr*/
import {InputText,InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import {Menumotion} from '../../molecules/MenuMotion/molecule-menu-motion';
import Button from '../../atoms/Button/Button';
import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import HrTag from '../../atoms/HrTag/HrTag';
import {H4,H5} from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import SummeryMyProducts from './SummeryMyProducts';


export default (props) =>{

let departmentos = {
        labelText: "Selecciona un Estado",
        labelId: 'seleccionaunestado',
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

const checkLoginRadio={"active":"false" , "amount": "20", "inputId" : "itemArray[5]", "nameInput" : "delivery" , "radioId": 'delivery'}

return(
<main>
<div className="container">
        <div className="row">
          <div className="col-12">
                <H4 headLineClass="a-checkout__heading -headingMargin" headLineText="Select the delivery type of your preference"/>
          </div>
        </div>
<div className="row">
<div className="col-lg-8 col-12 order-1">
<form className="m-box mb-4">
                <div className="row no-gutters align-items-center justify-content-between mb-3">
                    <div className="col-lg-4 col-7"></div>
                    <div className="col-lg-4 col-5 text-right"><Paragraph className="a-box__requiredMessage">* Datos requeridos</Paragraph></div>
                </div>

            <div className="row align-items-start">
                <div className="col-lg-4 col-12">
                  <InputHelperAssistant
                          inputId= 'nombre'
                          nameInput= 'nombre'
                          labelText= 'Nombre'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required
                 />
                </div>
                <div className="col-lg-4 col-12">
                   <InputHelperAssistant
                          inputId= 'apellidopaterno'
                          nameInput= 'apellidopaterno'
                          labelText= 'Apellido Paterno'
                          labelPosition='left'
                          helperText= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-apellidopaterno'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required
                 />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-apellidoPaterno">
                        </Paragraph>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <InputHelperAssistant
                          inputId= 'apellidomaterno'
                          nameInput= 'apellidomaterno'
                          labelText= 'Apellido Materno'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-apellidomaterno'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                 />
               
                </div>
             </div>

<div className="row align-items-start">
                <div className="col-lg-4 col-12">
                   <InputHelperAssistant
                          inputId= 'correoelectrónico'
                          nameInput= 'correoelectrónico'
                          labelText= 'Correo Electrónico'
                          labelPosition='left'
                          helperText= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-correoelectrónico'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required
                 />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <p className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </p>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                   <InputHelperAssistant
                          inputId= 'teléfono'
                          nameInput= 'teléfono'
                          labelText= 'Teléfono'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-Teléfono'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required
                 />           
                </div>
</div>
</form>
<div className="m-box mb-4">
    <div className="row no-gutters align-items-center justify-content-between">
          <Link className="m-box__accordionHeading" href="#shipToStore" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="shipToStore" onclick="sendAlertWarning()">
                      <div className="m-box_accordionText">
                            <H5 headLineClass="a-box__heading" headLineText="Recoge en tienda" />
                            <Label className="a-box__subHeading">Selecciona tu tienda mas cercana
                            </Label>
                      </div>
                      <div className="a-box__accordionIcon"><Icons className="icon-arrow_down" />
                      </div>
            </Link>

{/*collapse*/}
           <div className="w-100 collapse show" id="shipToStore">
               <HrTag hrClass="a-box__horizontalSeparator" />
                  <div className="row no-gutters align-items-center justify-content-between mb-3 mt-5">
                    <div className="col-lg-5 col-12">
                       <MaterialSelect options={departmentos} />
                      <div className="mdc-select-helper-line">
                      <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectState">Error Estado
                            </Paragraph>
                      </div>
                    </div>
                    <div className="col-lg-4 col-5 text-right d-none d-lg-block">
                          <Paragraph className="a-box__requiredMessage">* Datos requerido</Paragraph>
                    </div>
                  </div>
                  
                </div>
    {/*end of collapse*/}
</div>
 
{/*collapse radio*/}

{/*end of collapse radio*/}
</div>

<div className="m-box">
              <div className="row no-gutters align-items-center justify-content-between">
                  <Link className="m-box__accordionHeading" href="#shipToAddress" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="shipToAddress" onclick="sendAlertWarning()">
                      <div className="m-box_accordionText">
                            <H5 headLineClass="a-box__heading" headLineText="Entrega en tu domicilio" />
                            
                            <Label className="a-box__subHeading">Selecciona una dirección</Label>
                      </div>
                      <div className="a-box__accordionIcon">
                          <Icons className="icon-arrow_down" />
                      </div>
            </Link>
                <div className="w-100 collapse show" id="shipToAddress">
                  <HrTag hrClass="a-box__horizontalSeparator" />
                  <div className="row align-items-center justify-content-between mb-4">
                    <div className="col-10">

                      <MaterialInputRadio options={checkLoginRadio} />

                       <Label for="address1"><Span className="a-box__radioTitle">Casa ana</Span><br/>
                              <Span className="a-box__radioSubtitle">Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Span>
                              <br /><Span className="a-box__radioFlag">Predeterminada</Span>
                        </Label>
                    </div>
                    <div className="col-2 text-right">
                             <Menumotion />
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center justify-content-between mb-4">
                    <div className="col-10">
                       <MaterialInputRadio options={checkLoginRadio} />

                       <Label for="address1"><Span className="a-box__radioTitle">Casa ana</Span><br/>
                              <Span className="a-box__radioSubtitle">Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Span>
                              <br /><Span className="a-box__radioFlag">Predeterminada</Span>
                        </Label>
                    </div>

                    <div className="col-2 text-right">
                               <Menumotion />
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-lg-3 col-12">
                          <Button className="a-btn a-btn--tertiary -ml-45 -btnCheckout mb-4" ripple="">Agregar dirección</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>



</div>

<SummeryMyProducts mainContent={props.mainContent}/>

</div>

           
    </div>
</main>
    );
}