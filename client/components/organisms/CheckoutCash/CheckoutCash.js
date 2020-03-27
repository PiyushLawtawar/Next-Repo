//import './CheckoutCash.styl';

/**
* Module Name : CheckoutCash
* Functionality : Showing Checkout Cash panel in cash and transfer tab.
* @exports : CheckoutCash as functional component
* @requires : module:React
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/HeadLines/Headlines
* @requires : module:/molecules/MaterialInputRadio/Material_Input_Radio
* @requires : module:/atoms/Tagimage/Image
* @requires : module:/atoms/Label/Label
* @requires : module:lodash/isEmpty
* @requires : module:lodash/map
* @requires : module:/molecules/Modals/CheckoutEstablishment
* @requires : module:/molecules/Modals/CheckoutEstablishmentTwo
* @requires : module:/helpers/modal/modal
* @requires : module:/contexts/parentContext
* Team :Checkout Team
* Other information : Showing Payment Checkout Cash 
* 
*/

import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import {H4,H5} from '../../atoms/HeadLines/Headlines';
import Material_Input_Radio from '../../molecules/MaterialInputRadio/Material_Input_Radio';
import Image from '../../atoms/Tagimage/Image';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import CheckoutEstablishment from '../../molecules/Modals/CheckoutEstablishment'
import CheckoutEstablishmentTwo from '../../molecules/Modals/CheckoutEstablishmentTwo'
import Modal from '../../../helpers/modal/modal';
import { parentContext } from '../../../contexts/parentContext';

/**
* Method will call on
* @function 
* @author srinivasa.gorantla@zensar.com
* @desc 
* @param {object}
* 
*/
const disableScroll = () => { 
  document.body.style.overflow = 'hidden' 
}

export default (props) => {
// const storeList = props.displayPayInfo && props.displayPayInfo.openPayInfo && props.displayPayInfo.openPayInfo.pagoEffectivo && props.displayPayInfo.openPayInfo.pagoEffectivo.storeList;
let { pagoEffectivo,expirationTime } = (props.displayPayInfo && props.displayPayInfo.openPayInfo) || {}
     pagoEffectivo = pagoEffectivo || {}
let { storeList } = pagoEffectivo;
    storeList = storeList || [];
const checkLoginRadio={"active":"false" , "amount": "20", "inputId" : "itemArray[5]", "nameInput" : "delivery" , "radioId": 'delivery'}
const modalFindGiftTable = {
            modalId: "establishments",
            modalClass: "o-product__modal modal fade ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog establishmentsModal",
            modalContentClass: "modal-content"
        };
const modalFindGiftTable1 = {
            modalId: "establishments2",
            modalClass: "o-product__modal modal fade ",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog establishmentsModal",
            modalContentClass: "modal-content"
        };


return(
<div className="o-cashInfo">
                <div className="row no-gutters align-items-center justify-content-between">
                    <Link className="a-cashInfo__accordionHeading" data-toggle="collapse" role="button" aria-expanded={props.paymentTypeSelection.cashType ? 'false' : 'true'} aria-controls="cashOptions" onClick={()=>props.toggleCheckoutCash('cashType','cashOptions')}>
                    {/*href="#cashOptions"*/}
                        <div className="m-cashInfo_accordionText">
                            <H5 headLineClass="a-cashInfo__heading" headLineText={props.staticLabelValues['pwa.openPay.pagoEfectivo.text']} />
                        </div>
                        <div className="a-cashInfo__accordionIcon">
                          {/*<Icons className={(props.paymentTypeSelection.cashType)?"icon-arrow_up":"icon-arrow_down"} />*/}
                              <Icons className='icon-arrow_down' />

                        </div>
                    </Link>
                    {/* removed 'max-height': '241px' from below line for 23312*/}
                  <div className="w-100 collapse d-block" id="cashOptions" style={{overflow: 'hidden',transition: 'max-height 0.4s ease-out'}}>
                     {/*className={(!props.paymentTypeSelection.cashType)? "w-100 collapse d-block" : "w-100 collapse d-block"}*/}
                    <hr className="a-cashInfo__horizontalSeparator" />
                    <Label htmlFor={'billingCASH'}>
                      <div className="row no-gutters align-items-end justify-content-between mt-3 pt-2">
                        <div className="col-12">
                              <Paragraph className="a-cashInfo__Info"> {props.staticLabelValues['pwa.openPay.concludePurchaseEfectivo.text']}</Paragraph>
                        </div>
                        <div className="col-12 mb-3 mb-lg-2 pb-lg-1">
                          <Material_Input_Radio
                              name="billingCASH"
                              id="billingCASH"
                              onChange={()=>props.selectCTPaymentRadioButton('cash')}
                              checked={props.isCashSelected}
                              disabled={!pagoEffectivo.eligibleForTotal}
                              />
                            
                            {
                                !isEmpty(storeList) && map(storeList, (payStore, i) => {
                                        return (
                                          // Custom Products functionality START
                                          <Image className={(i+1 === 1)?"a-cashOptions__rectangleCard ml-2": (i+1 === 4 || i+1 === 8 || i+1 === 12)? "a-cashOptions__rectangleCard ml-5 ml-md-0" : "a-cashOptions__rectangleCard" } key={i} style={ (!payStore.eligibleForTotal || props.customProduct) ? {opacity:"0.3"} : null }  src={payStore.imageUrl} alt="Ícono seven-eleven" id="seven-eleven" />
                                          // Custom Products functionality START
                                        )
                                    
                                })
                            }

                          {/*<Image className="a-cashOptions__rectangleCard ml-2" src="../../../static/images/atomo-icono-seven.png" alt="Ícono seven-eleven" id="seven-eleven" />
                          <Image className="a-cashOptions__rectangleCard" src="../../../static/images/atomo-icono-k.png" alt="Ícono círculo K" id="circle-k" />
                          <Image className="a-cashOptions__rectangleCard" src="../../../static/images/atomo-icono-extra.png" alt="Ícono extra" id="extra" />
                          <Image className="a-cashOptions__rectangleCard ml-5 ml-md-0" src="../../../static/images/atomo-icono-ahorro.png" alt="Ícono farmacias del ahorro" id="farmacias-ahorro" />
                          <Image className="a-cashOptions__rectangleCard" src="../../../static/images/atomo-icono-benavides.png" alt="Ícono farmacias benavides" id="farmacias-benavides" />*/}
                        </div>
                        <div className="col-12">
                          <parentContext.Consumer>
                              {({ OpenModal }) => (
                                  (pagoEffectivo.eligibleForTotal)? <Link className="a-checkout__termsLink ml-5 pl-2" href="#" data-toggle="modal" data-target="#establishments" onClick={() => OpenModal("billingmodel")} >{props.staticLabelValues['pwa.checkoutPageBilling.establecimientos.text']}</Link>: null
                              )}
                          </parentContext.Consumer>
                        </div>


                        {/*checkoutestablishment cash */}
                        <parentContext.Consumer>
                            {({ showModal, SelectedModelData }) =>
                                  <React.Fragment>
                                        {
                                          showModal.billingmodel === true && <CheckoutEstablishment {...props}/>
                                        }
                                        {
                                          showModal.billingInnerModel === true && <CheckoutEstablishmentTwo {...props}/>
                                        }
                                  </React.Fragment>
                            }
                        </parentContext.Consumer>
                        
                        {/*{
                        
                        
                          <React.Fragment>
                            <parentContext.Consumer>
                                      {({ showModal, SelectedModelData }) => (showModal.billingmodel === true ? 
                            <Modal modalDetails={modalFindGiftTable} showModalpopUp={"billingmodel"} onAfterOpen={disableScroll}>
                                <CheckoutEstablishment ModalpopUp={"billingmodel"} {...props}/>
                            </Modal> 
                          : null
                                      )}
                                      </parentContext.Consumer>
                            
                          </React.Fragment>
                          
                        }
                        {
                          <React.Fragment>
                            <parentContext.Consumer>
                                      {({ showModal, SelectedModelData }) => (showModal.billingInnerModel === true ? 
                            <Modal modalDetails={modalFindGiftTable1} showModalpopUp={"billingInnerModel"} onAfterOpen={disableScroll}>
                                <CheckoutEstablishmentTwo ModalpopUp={"billingInnerModel"} {...props}/>
                            </Modal> 
                          : null
                                      )}
                                      </parentContext.Consumer>
                            
                          </React.Fragment>
                        }*/}

                        {/*end of checkoutestablishment cash */}




                        <div className={(pagoEffectivo.pagoEffectivoWarnning && pagoEffectivo.eligibleForTotal)? "col-12 d-block" : "col-12 d-none"} id="maxPriceContainer">
                              <Paragraph className="a-box__digital mb-4 mb-md-5 ml-5 pl-2">{props.staticLabelValues['pwa.openpay.minimum.onestore.disabled.text']}
                              </Paragraph>
                        </div>
                        
                        <div className={(!pagoEffectivo.eligibleForTotal && pagoEffectivo.pagoEffectivoWarnning)? "col-12 d-block" : "col-12 d-none"} id="maxPriceExceededContainer">
                          <Paragraph className="icon-warning a-box__digital mb-4 mb-md-5 ml-5 pl-2"> {props.staticLabelValues['pwa.openpay.order.total.greater.text'] || 'pwa.openpay.order.total.greater.text'}
                              </Paragraph>
                        </div>
                      </div>
                    </Label>
                    <div className={(props.isCashSelected)?"d-block":"d-none"} id="cashSelected" >
                      <hr className="a-cashInfo__horizontalSeparator--alter" />
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-12">
                          <Paragraph className="a-cashInfo__description" style={{'text-align': 'inherit'}}><Span className="a-cashInfo__important">{props.staticLabelValues['pwa.openPay.important.text']} </Span> {props.staticLabelValues['pwa.openPay.solicitud1.text']} 
                          <Span className="a-cashInfo__bolded"> {expirationTime} </Span>
                           { props.isDesktop &&
                           <React.Fragment>
                             <br className="d-md-none" /> 
                           <br className="d-md-none" /> 
                           </React.Fragment>
                           }
                           <Span dangerouslySetInnerHTML={{__html:  props.staticLabelValues['pwa.openPay.solicitud2.text']}}></Span>
                           {/*<Span className="a-cashInfo__bolded"> puede cobrar comisión</Span> por realizar tu pago.*/}
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

);
}