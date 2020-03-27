import {H4,H5} from '../../atoms/HeadLines/Headlines';
import Link from '../../atoms/Link/Link';
import Label from '../../atoms/Label/Label';
import Icons from '../../atoms/Icons/Icons';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import {ParagraphWithBlockNew} from '../../molecules/MixinMolecules/MixinMolecules';
import {InputText,InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import CheckoutStep1Giftregistry from './CheckoutStep1Giftregistry';
import CheckoutStep1PreselectedAddressLogin from './CheckoutStep1PreselectedAddressLogin';
import CheckoutStep2AddNewCardLogin from './CheckoutStep2AddNewCardLogin';
import CheckoutStep2PaymentGuest from './CheckoutStep2PaymentGuest';
import CheckoutStep2PaymentLogin from './CheckoutStep2PaymentLogin';
import CheckoutStep3 from './CheckoutStep3';
import CheckoutBundle from './CheckoutBundle';
import SummeryMyProducts from './SummeryMyProducts';
import CheckoutHeaderFooter from '../../organisms/Header/CheckoutHeaderFooter';


class CheckoutStep1AddressGuatemala extends React.Component {
    
constructor(props) {
        super(props);
        this.state = {
            mainContent : props.mainContent,
            showDropdown: false,
            typeheadResponse: {},
            showMobileDeptMenu: false,
            searchTerm: '',
            dynamic_popover_status_obj: {},
            window: {},
            showPromotionBanner: true,
            cartHeaderResponse: {},
            deptMenuData: {},
            loader: false
        }
    }
render(){ 
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

let condition = {
		 pText: 'He leído y acepto ',
         pClass: 'a-checkout__termsAndConditions',
         bType: 'anchor',
         bClass: 'a-checkout__termsLink',
         bText: 'Términos, Condiciones y Aviso de Privacidad',
         bUrl: '#'
	}; 

let departmentos = {
        labelText: "Departmentos",
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
let estado = {
        labelText: "Estado",
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
let municipio = {
        labelText: "Municipio o Delegación",
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
let Colonia= {
        labelText: "Colonia",
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


let { pageName } = this.props;

return(
<React.Fragment>
{/*<CheckoutHeaderFooter />*/}

{/*Start CheckoutStep1Giftregistry page*/}
  {/*{pageName && pageName === "CheckoutStep1Giftregistry" &&
  <CheckoutStep1Giftregistry />
  }*/}
{/*end of CheckoutStep1Giftregistry page*/}


{/*Start CheckoutStep1PreselectedAddressLogin page*/}
  {/*{pageName && pageName === "CheckoutStep1PreselectedAddressLogin" &&
  <CheckoutStep1PreselectedAddressLogin mainContent = {this.state.mainContent}/>
  }*/}
{/*end of CheckoutStep1PreselectedAddressLogin page*/}

 {/*<CheckoutStep2AddNewCardLogin />*/}

 {/*<CheckoutStep2PaymentGuest />*/}

 {/*<CheckoutStep2PaymentLogin />*/}

 {/*<CheckoutStep2PaymentGuest />*/}
{/*
<CheckoutStep3 />*/}

<CheckoutBundle />


{/*<main>
<div className="o-checkout container">
        <div className="row">
          <div className="col-12">
              <H4 headLineClass="a-checkout__heading -headingMargin" headLineText="Ingresa una nueva dirección de envío" /> 
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-12 order-1">
            <form className="m-box" id="add-address">
              <div className="row no-gutters align-items-center justify-content-between mb-3">
                <div className="col-lg-4 col-7">
                    <H5 headLineClass="a-box__heading" headLineText="Datos del destinatario" />
                      
                </div>
                <div className="col-lg-4 col-5 text-right">
                      <Paragraph className="a-box__requiredMessage">* Campos obligatorios</Paragraph>
                </div>
              </div>
              <div className="row align-items-start">
                <div className="col-xl-4 col-lg-6 col-12">

                <InputHelperAssistant
                          inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelText= 'Nombre corto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required
                 />
                   <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg pb-3" id="helper-text-id">Ej. Casa, Oficina...

                </Paragraph>
                </div>
              </div>
              <div className="row align-items-start" text="Nombre corto">
                <div className="col-lg-4 col-12">

                  <InputHelperAssistant 
                          inputId= 'nombreCorto'
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
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>
                 
                </div>
                <div className="col-lg-4 col-12">
                 <InputHelperAssistant 
                  inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required 
                          labelText="Apellido Paterno"
                 />
                   <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>
                </div>
                <div className="col-lg-4 col-12">
                  <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Apellido Materno"
                  />
                    <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">Optional
                </Paragraph>
                </div>
              </div>
<div className="row align-items-center mb-4 mt-4">
                <div className="col-lg-4 col-12">
                    <H5 headLineClass="a-box__heading" headLineText="Dirección de envío" />
                </div>
              </div>
              <div className="row align-items-start">
                <div className="col-lg-4 col-12">
                  <options className="required"></options>
                 <MaterialSelect options={validity} />
                <div className="mdc-select-helper-line">
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true"></Paragraph>
                </div>

                </div>
                <div className="col-lg-4 col-12">
                <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Código Postal"
                          required
                  />
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>
                </div>
                <div className="col-lg-4 col-12">
                  
                  <MaterialSelect options={departmentos} />
<div className="mdc-select-helper-line">
                    <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true"></Paragraph>
                </div>
                 
                </div>
              </div>
              <div className="row align-items-start">
                <div className="col-lg-4 col-12">
                  <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Municipilo"
                          required
                  />
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>
                </div>
                <div className="col-lg-4 col-12">
                   <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Colonia"
                          required
                  />
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>
                </div>
                <div className="col-lg-4 col-12">
                   <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Calle"
                          required
                  />
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>
                </div>
              </div>
              <div className="row align-items-start">
                <div className="col-lg-4 col-12">
                  <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Número"
                          required
                  />  
                  <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                </Paragraph>        
                </div>
                <div className="col-lg-4 col-12">
                  <InputHelperAssistant 
                   inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Teléfono"
                          required
                  />
                  
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">8 digitos
                        </Paragraph>
                  </div>
                </div>             
              </div>



{pageName && pageName === "checkoutstep1" &&
<div className="row align-items-start">
                <div className="col-xl-4 col-lg-6 col-12">
                 
                   <MaterialSelect options={validity} />
                 
                  <div className="mdc-select-helper-line">
                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectPais"><font ><font >Country Error
                        </font></font></Paragraph>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                  <InputHelperAssistant 
                          inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          
                          required
                          labelText="Postal Code"
                  />
    
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                 
                   <MaterialSelect options={estado} />
                
                  <div className="mdc-select-helper-line">
                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectEstado"><font ><font >Error State
                        </font></font></Paragraph>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                    <InputHelperAssistant 
                          inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                         
                          required
                          labelText="City"
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                   <MaterialSelect options={municipio} />
                  <div className="mdc-select-helper-line">
                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectMunicipio"><font ><font >Municipality or Delegation error
                        </font></font></Paragraph>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                  <MaterialSelect options={Colonia} />
                  <div className="mdc-select-helper-line">
                        <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true" id="alert-selectColonia"><font ><font >Cologne Error
                        </font></font></Paragraph>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                   <InputHelperAssistant 
                          inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                         
                          required
                         labelText="Street"
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          
                          required
                       labelText="No. Ext."
                  />

                    </div>
                     <div className="col-12 col-lg-6">
                     <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="No. Ext."
                  />
                  </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                  <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Building"
                  />
                 
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                 <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Teléfono"
                          labelText="Between Street"
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                  <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Teléfono"
                          labelText="and Street"
                  />
                  
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                 <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          text= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          required
                          labelText="Teléfono"
                          labelText="Teléfono con LADA"
                  />
                 
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                  <InputHelperAssistant 
                       inputId= 'nombreCorto'
                          nameInput= 'nombreCorto'
                          labelPosition='left'
                          helperText= 'Ej. Casa, Oficina...'
                          helperTextId= 'helper-nombreCorto'
                          disabled= 'false'
                          checked= "false"
                          type= "text"
                          labelText="Teléfono"
                          labelText="Cellphone"
                  />
                  <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-telefonoCelular"><font><font>Optional
                        </font></font></Paragraph>
                  </div>
                </div>
              </div>
}

             
              <div className="row align-items-start justify-content-end">
                <div className="col-lg-auto col-12">
                  <MaterialInputCheckBox text="Establecer dirección predeterminada"/>          
                </div>
              </div>
            </form>
            <div className="row align-items-center justify-content-end">
              <div className="col-lg-auto col-12 pt-3 pb-3">
                        <ParagraphWithBlockNew options={condition} />
              </div>
            </div>
            <div className="row align-items-center justify-content-end flex-column-reverse flex-lg-row">
              <div className="col-lg-3 col-12 mt-3 mt-lg-0">
                    <Button className="a-btn a-btn--secondary" ripple="">Regresar</Button>
              </div>
              <div className="col-lg-3 col-12">
                    <Button className="a-btn a-btn--primary" ripple="" onclick="add_address()">Continuar</Button>
              </div>
            </div>
          </div>
            <SummeryMyProducts mainContent={this.state.mainContent}/>
        </div>
      </div>
    </main>*/}
</React.Fragment>
);
}
}

export default CheckoutStep1AddressGuatemala;