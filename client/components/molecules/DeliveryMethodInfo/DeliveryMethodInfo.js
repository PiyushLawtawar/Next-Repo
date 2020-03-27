//import './DeliveryMethodInfo.styl';
import {H5} from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import HrTag from '../../atoms/HrTag/HrTag';

export default (props) => {
  let {enableEditAddress} = props.configurationData && props.configurationData.configuration && props.configurationData.configuration.flagConfiguration || 'false'; // defect 23300 
return(
<React.Fragment>
   {
            ((props.shippingAddressDetail && props.shippingAddressDetail.postalCode && !props.shippingAddressDetail.storePickup) || props.mainContent.showGiftInfoMsg)?
            <React.Fragment>
              <div className="m-deliveryBox mb-4 d-none d-lg-block" id="domicile">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                    <H5 headLineClass="a-deliveryBox__heading" headLineText={props.staticLabelValues['pwa.checkoutPagePromotion.delivery.text']}/>
                </div>
              </div>
              <HrTag hrClass="a-deliveryBox--divider" />
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-auto">
                     <H5 headLineClass="a-deliveryBox__heading" headLineText={props.staticLabelValues['pwa.checkoutShippingPage.GRShippingAddressTitle.text']}/>
                </div>
              </div>
              <div className="row no-gutters align-items-center justify-content-between">
                {
                  (props.shippingAddressDetail && props.shippingAddressDetail.nickName && !props.mainContent.showGiftInfoMsg)?
                    <div className="col-auto">
                        <Label className="a-box__resume mt-3" for="">{props.shippingAddressDetail.nickName}</Label>
                  </div>
                  : null
                }
                
              </div>
              <div className="row no-gutters align-items-center justify-content-between">
                 {
                  (props.shippingAddressDetail && !props.mainContent.showGiftInfoMsg)?
                    <React.Fragment>
                      <div className="col-11">
                          <Label style={{display: "inline-block", wordWrap: "break-word", wordBreak: "break-all"}} className="a-box__resume--small mb-2 pb-1" for="">{props.shippingAddressDetail.street}, {props.shippingAddressDetail.city}, {props.shippingAddressDetail.colony}, {props.shippingAddressDetail.postalCode}, {props.shippingAddressDetail.phoneNumber}</Label>
                      </div>
                      
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-auto">
                                <Label className="a-box__resume--anchor" for="" onClick={props.modifyShippingAddress}>{props.staticLabelValues['pwa.checkoutPageBilling.modificar.delivery.text']}</Label>
                        </div>
                      </div>
                    </React.Fragment>
                :   <div className="col-11">
                        <Label style={{display: "inline-block", wordWrap: "break-word", wordBreak: "break-all"}} className="a-box__resume--small mb-2 pb-1" for="">{props.staticLabelValues['pwa.checkoutShippingPage.GRShippingAddressInfo.text']}</Label>
                    </div>
                 }
              </div>
            </div>
            </React.Fragment>
            : null
           }
            
 

             {
                (props.shippingAddressDetail && props.shippingAddressDetail.postalCode && props.shippingAddressDetail.storePickup)?
                    <div className="m-deliveryBox mb-4 d-none d-lg-block" id="pickUp">
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-12">
                            <H5 headLineClass="a-deliveryBox__heading" headLineText={props.staticLabelValues['pwa.checkoutPagePromotion.delivery.text']}/>
                        </div>
                      </div>
                      <HrTag hrClass="a-deliveryBox--divider" />
                      <div className="row no-gutters align-items-center justify-content-start">
                        <div className="col-auto">
                            <H5 headLineClass="a-deliveryBox__heading" headLineText={props.staticLabelValues['pwa.checkoutShippingPage.recog.text']}/>
                        </div>
                        {
                          (props.clickandcollect === 'ccd')?
                              <div className="col-auto">
                                    <Label className="a-box__clickCollect ml-3" for="">{props.staticLabelValues['pwa.checkoutPageBilling.clickAndCollectDriveThru.text']}</Label>
                              </div>
                          : null
                        }
                        
                      </div>
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-auto">
                                      <Label className="a-box__resume mt-3" for="">{props.shippingAddressDetail.state}</Label>
                        </div>
                      </div>
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-10">
                              <Label style={{display: "inline-block", wordWrap: "break-word", wordBreak: "break-all"}} className="a-box__resume mb-2 pb-1" for="">{props.shippingAddressDetail.street},{props.shippingAddressDetail.city},{props.shippingAddressDetail.colony},{props.shippingAddressDetail.postalCode},{props.shippingAddressDetail.phoneNumber}</Label>
                        </div>
                      </div>
                     
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-auto">
                                      <Label className="a-box__resume--anchor" for="" onClick={props.modifyShippingAddress}>{props.staticLabelValues['pwa.checkoutPageBilling.modificar.delivery.text']}</Label>
                        </div>
                      </div>
                    </div>
                : null
             }

             {
              (props.mainContent && props.mainContent.digitalInfoMessage && !props.mainContent.showGiftInfoMsg)?
                <div className="m-deliveryBox mb-4 d-none d-lg-block" id="digital">
                  { props.shippingAddressDetail && !props.shippingAddressDetail.postalCode && 
                    <React.Fragment>
                      <div className="row no-gutters align-items-center justify-content-between">
                        <div className="col-12">
                            <H5 headLineClass="a-deliveryBox__heading" headLineText={props.staticLabelValues['pwa.checkoutPagePromotion.delivery.text']}/>
                        </div>
                      </div>
                      <HrTag hrClass="a-deliveryBox--divider" />
                    </React.Fragment>
                  }
                    <div className="row no-gutters align-items-center justify-content-between">
                      <div className="col-auto">
                          <H5 headLineClass="a-deliveryBox__heading" headLineText={props.staticLabelValues['pwa.checkoutDigital.download.message']}/>
                      </div>
                    </div>
                    <div className="row no-gutters align-items-center justify-content-between">
                      <div className="col-10 mb-1">
                                    <Label className="a-box__digital mt-3 mb-2 pb-1" for="">{props.staticLabelValues['pwa.checkoutPageBilling.digitales.text']}</Label>
                      </div>
                    </div>
                </div>
              : null
            }
</React.Fragment>
    );
}