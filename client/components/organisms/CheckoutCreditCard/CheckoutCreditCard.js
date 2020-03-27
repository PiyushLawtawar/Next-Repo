//import './CheckoutCreditCard.styl'

/**
* Module Name : creditCard
* Functionality : Component used to show the list of credit cards. This is get called from \components\templates\checkout\CheckoutStep2PaymentLogin.js
* @exports : creditCard
* @requires : module:React
* @requires : module:lodash/map
* @requires : module:/molecules/MaterialInputRadio/Material_Input_Radio
* @requires : module:/molecules/UserCardInformation/UserCardInformation
* @requires : module:/molecules/RequestedCardInformation/RequestedCardInformation
* @requires : module:/molecules/MenuMotion/molecule-menu-motion
* @requires : module:/atoms/Icons/Icons
* @requires : module:/atoms/Span/Span
* @requires : module:/atoms/Label/Label
* @requires : module:/atoms/Button/Button
* @requires : module:/helpers/utilities/utility
* @requires : module:/helpers/config/config
* Team : Checkout Team
* Other information : Showing the list of credit cards.
* 
*/

import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Material_Input_Radio from '../../molecules/MaterialInputRadio/Material_Input_Radio';
import UserCardInformation from '../../molecules/UserCardInformation/UserCardInformation';
import RequestedCardInformation from '../../molecules/RequestedCardInformation/RequestedCardInformation';
import { ShowMotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';
import { Utility, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
/**
 * @class CheckoutPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class creditCard extends React.Component {

   /**
   * REACT life cycle Event. This will get fire on component load
   * @event constructor 
   * @param {*} props
   */
     constructor(props) {
        super(props);
        this.state = {
          isShowMotion: false,
          enableClickToBuy : false,
          reliablecardtypelist: [],
          isDesktop: true
        }
    }

    /**
     * REACT life cycle Event. Method will call on component load.
     * @event componentDidMount 
     * 
     */  
  componentDidMount() {
    // start changes for 22849
    const { configurationData } = this.props;
    if(configurationData && configurationData.configuration && configurationData.configuration.liverpoolconfiguration){
      this.getConfiguration(configurationData)
    }else{
      Utility(Path.fetchConfiguration, 'GET').then(response => {
          if (response && response.data) {
              this.getConfiguration(response.data)
          }
      })
    }// end changes for 22849
    const { isDesktop } = UserAgentDetails(window);
    this.setState({ isDesktop });
}

  /**
  * Method will call to fetch configuration data.
  * @function getConfiguration
  * @author srinivasa.gorantla@zensar.com
  * @desc updating clicktoby, reliable card type list related information from the configuration data.
  * @param {object} configurationData
  * 
  */
getConfiguration = (configurationData) =>{//  changes for 22849
  let {enableClickToBuy,reliablecardtypelist} = this.state;
  //  Utility(Path.fetchConfiguration, 'GET').then(response => {
  //     if(response && response.data){
          let globalConfigData = configurationData || {};
              globalConfigData = globalConfigData && globalConfigData.configuration && globalConfigData.configuration.liverpoolconfiguration;
              enableClickToBuy = globalConfigData && globalConfigData.enableclicktobuy || false;
              if(globalConfigData && globalConfigData.reliablecardtypelist && typeof globalConfigData.reliablecardtypelist === 'string')
                globalConfigData.reliablecardtypelist = globalConfigData && globalConfigData.reliablecardtypelist;
              reliablecardtypelist = (globalConfigData && globalConfigData.reliablecardtypelist && globalConfigData.reliablecardtypelist.length>0 && globalConfigData.reliablecardtypelist.map(item =>item.toLowerCase())) || []
              this.setState({
                enableClickToBuy,
                reliablecardtypelist
              });
    //   }
    
     
    // });
}

  /**
  * Method will call to validate form
  * @function ValidateForm
  * @author srinivasa.gorantla@zensar.com
  * @desc Validating requested card information details.
  * 
  */
  ValidateForm = () =>{
    return this.refs.requestedCardInformationRef.validateForm();
  }

  /**
  * Method will call to update hamburger visibility status.
  * @function isShowMotionFun
  * @author srinivasa.gorantla@zensar.com
  * @desc updating hamburger visibility status.
  * 
  */
  isShowMotionFun = () =>{
    this.setState({
      isShowMotion : true
    })
  }

/**
 * REACT life cycle Event. This will get fire on load and on state update.
 * @event render 
 * 
 */
render (){
  const checkLoginRadio = { "active": "false", "amount": "20", "inputId": "itemArray[5]", "radioId": 'delivery' }
  // const options = [ { text: 'Editar', onClick: this.props.editCardInfo()} ]

  var optionsI = {
    inputId: 'card2RadioButton',
    nameInput: 'cardRadioButton',
    required: false,
    disabled: false,
    checked: false
  }
  const { records, defaultCreditCardId } = this.props.creditCards || {};
  let bottonDivider = '-bottomDivider ';
  const { enableClickToBuy,reliablecardtypelist, isDesktop } = this.state;
  return (
    <div className={(this.props.ccclassName) ? ((!this.props.isAddNewCard)?"o-loggedUserCardInfo d-block" : "o-loggedUserCardInfo d-none"): (((!this.props.paypalAvailable && !this.props.digitalInfo && !this.props.ctclassName) || (this.props.paypalAvailable && this.props.isGiftCertificate && !this.props.ctclassName))? "o-loggedUserCardInfo d-block" : "o-loggedUserCardInfo d-none")} id="creditCardOrganism">
      {
        !isEmpty(records) && map(records, (cardInfo, index) => {
          if (records.length === index + 1) {
            bottonDivider = ''
          }
          cardInfo.creditCardType = (cardInfo && cardInfo.creditCardType && cardInfo.creditCardType.toLowerCase()) || '';
          return (   
            <Label className={"o-singleCardInfo " + bottonDivider + "no-gutters align-items-start justify-content-start mb-3"} key={index}  htmlfor={'card_'+cardInfo.repositoryId}>
              <div className="m-cardInfoContainer col-11 justify-content-start">

                <Material_Input_Radio
                    name="billingCreditCard"
                    value={cardInfo.repositoryId}
                    id={'card_'+cardInfo.repositoryId}
                    checked={cardInfo.repositoryId === this.props.selectedRepositoryId}
                    onChange={(e)=>this.props.onBillingCreditCardChange(e,cardInfo.nickName)}/>
                
                <div className="m-infoContainer col-10 row no-gutters align-items-start-justify-content-start">
                  <UserCardInformation
                      containerClass="m-infoContainer__textContainer" titleClass="a-infoContainer__cardName" cardNumberClass="a-infoContainer__cardEnding" thirdText={this.props.staticLabelValues['pwa.checkoutPageBilling.predeterminda.text']} thirdTextClass="a-infoContainer__predefinedCard"
                      titleText={cardInfo.nickName}
                      cardNumber={cardInfo.creditCardNumber}  
                      defaultCreditCardId = {defaultCreditCardId} 
                      repositoryId = {cardInfo.repositoryId}
                      htmlfor={'card_'+cardInfo.repositoryId}
                  />
                </div>
              </div>
              <div className="m-redirectIconContainer col-1">
                <ShowMotion cardInfo = {cardInfo} isShowMotion={cardInfo.isShowMotion} options={[ { text: 'Editar', onClick: ()=> this.props.editCardInfo(cardInfo)} ]} transform={cardInfo.repositoryId === this.props.selectedRepositoryId ? null : -263} />
              </div>
              { ((!enableClickToBuy && cardInfo.repositoryId === this.props.selectedRepositoryId) || (enableClickToBuy && cardInfo.repositoryId === this.props.selectedRepositoryId && !(reliablecardtypelist.indexOf(cardInfo.creditCardType) > -1 && cardInfo.isReliable === 'true' && this.props.creditCards.digitalItems === 'false')))?
                <React.Fragment>
                     
                    { 
                      (cardInfo.creditCardType && (cardInfo.creditCardType !== 'liverpool' && cardInfo.creditCardType !== "galeriasfashioncard" && cardInfo.creditCardType !== "fabricasdefrancia"))?
                          <div className={isDesktop ? "col-11 ml-5": "col-11 ml-4"}>
                              <RequestedCardInformation isFull={true} isCvv={false} ref="requestedCardInformationRef" americanExpCvv = {(cardInfo.creditCardType === "americanexpress")? true : false} {...this.props}/>
                          </div>
                      : 
                         <div className={isDesktop ? "col-11 ml-5" : "col-11 ml-4"}>
                          <RequestedCardInformation isCvv={true} isFull={false} ref="requestedCardInformationRef" {...this.props}/>
                        </div>
                    }

                 </React.Fragment>
                : null //<RequestedCardInformation isCvv={false} isFull={false} ref="requestedCardInformationRef" {...this.props}/> commented for 19905
              }
             
            </Label>      
          )
        })
      }
                 <div class="row --upperDivider d-lg-none"></div>
         <div className="col-11 ml-5">
          <Button className="a-btn a-btn--tertiary ripple a-addCardButton d-none d-lg-inline-block" handleClick={this.props.addNewCard}>{this.props.staticLabelValues['pwa.checkoutBillingPage.addcard.label']}</Button>
        </div>

        <div className="m-addNewCard no-gutters align-items-start justify-content-start mt-3 d-lg-none">
          <div className="col-11">
            <Span className="a-addCard d-flex justify-content-start" onClick={this.props.addNewCard}>{this.props.staticLabelValues['pwa.checkoutBillingPage.addcard.label']}</Span>
          </div>
          <div className="col-1 --pd-0 d-flex justify-content-end">
            <Icons className="a-addCard--icon" />
          </div>
      </div>

      {/*<div className="o-singleCardInfo no-gutters align-items-start justify-content-start mb-3">
        <div className="m-cardInfoContainer col-11 justify-content-start">
          <MaterialInputRadio options={optionsI} />
          <div className="m-infoContainer col-10 row no-gutters align-items-start-justify-content-start">

            <UserCardInformation containerClass="m-infoContainer__textContainer" titleClass="a-infoContainer__cardName" titleText="Tarjeta Liverpool"
              cardNumber="*1234" cardNumberClass="a-infoContainer__cardEnding" thirdText="" thirdTextClass="a-infoContainer__predefinedCard"
            />
          </div>
        </div>
        <div className="m-redirectIconContainer col-1">
          <ShowMotion />
        </div>
        <div className="col-11 ml-5" id="cvvCreditCardContainer" hidden="true">
          <RequestedCardInformation />
        </div>
        <div className="col-11 ml-5">
          <Button className="a-btn a-btn--tertiary ripple a-addCardButton d-none d-lg-inline-block" handleClick={props.addNewCard}>Agregar tarjeta</Button>
        </div>
      </div>
      <div className="row --upperDivider d-lg-block"></div>
      <div className="m-addNewCard no-gutters align-items-start justify-content-start mt-3 d-lg-none">
        <div className="col-11">
          <Span className="a-addCard d-flex justify-content-start">Agregar tarjeta</Span>
        </div>
        <div className="col-1 --pd-0 d-flex justify-content-end">
          <Icons className="a-addCard--icon" />
        </div>
      </div>*/}
    </div>
  );
}
}