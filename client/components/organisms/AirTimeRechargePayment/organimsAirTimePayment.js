import Button from '../../atoms/Button/Button';
import { H2 } from '../../atoms/HeadLines/Headlines';
import MoleculeAirTimePaycard from '../../molecules/AirTimePayCard/moleculeAirTimePaycard';
import Router from 'next/router';
import map from 'lodash/map';

class OrganimsAirTimePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreditCardSection: "false",
      errorCvv: false
    }
    this.lastIndexOfArray = '',
      this.lastDivId = ''
  }

  creditCardFunction = () => {
    this.setState({
      showCreditCardSection: "true"
    })
  }
  render() {
    const creditCardsData = this.props.creditCardsData;
    const showAirTimePayCard = this.props.showAirTimePayCard;
    const defaultCreditCardId = this.props.defaultCreditCardId;
    const staticLabels = this.props.staticLabels && this.props.staticLabels;
    const PaymentNumberTwoText = staticLabels && staticLabels["pwa.airtimeCheckoutPage.numberTwo.text"]
    const choosePaymentMethodText = staticLabels && staticLabels["pwa.airtimeCheckoutPage.choosePaymentMethod.text"]
    // let expiryMonthDta = [{}]
    let expiryYearDta = [{}]
    // this.props && this.props.expiryMonth && this.props.expiryMonth.map((expiryMonth) => {
    //   expiryMonthDta.push({ value: Object.keys(expiryMonth.value)[0] })
    // })
    let expiryMonthDta = [{},...this.props.expiryMonth];

    this.props && this.props.expiryYear && this.props.expiryYear.map((expiryYear) => {
      expiryYearDta.push({ value: Object.keys(expiryYear.value)[0] })
    })

    const arrPayCards = [];
    map(creditCardsData, (creditData, index) => {
      const creditCardEncrpt = creditData.creditCardNumber && creditData.creditCardNumber.substr(creditData.creditCardNumber.length - 4)
      let temp = {
        id: creditData.repositoryId,
        inputId: creditData.creditCardType,
        nickName: creditData.nickName,
        nameInput: 'radio-PayCard',
        labelText: `<p class="a-airTime-payCard">` + creditData.nickName + `</p>
                    <p class="a-airTime-payCard">` + '*' + creditCardEncrpt + `</p>
                    <p class="a-airTime-payCard--predetermined">` + (creditData.repositoryId === defaultCreditCardId ? staticLabels && staticLabels["pwa.airtimeCheckoutPage.DefaultCreditCard.text"] : "") + `</p>`,

        labelClass: "m-airTime-paymet_cardInfo",
        required: false,
        disabled: false,
        HTMLrequired: true,
        FechaVencimiento: "Fecha de vencimiento:",
        checkedDefaultValue: creditData.repositoryId === defaultCreditCardId ? true : false,
        SelectMonth: {
          labelText: 'Mes', // text of the label
          optionList: expiryMonthDta ? expiryMonthDta : [],
          labelId: 'idLabel__Month', // label id
          selectId: 'idSelect__Month', // select id
          alertId: 'idAlert__Month', // alert id
          helperText: 'Ingresa el mes', // alert text
          selected: false,
          required: true,
          type: 'text',
          showError: true
        },
        SelectYear: {
          labelText: 'Año', 
          optionList: expiryYearDta ? expiryYearDta : [],
          labelId: 'idLabel__Year', 
          selectId: 'idSelect__Year', 
          alertId: 'idAlert__Year',
          required: true,
          selected: false,
          showError: true,
          helperText: 'Ingresa el año'
        },
        InputCvv: {
          inputId: 'idCvv', 
          nameInput: 'inputCvv', 
          labelText: 'CVV',
          helperText: staticLabels["pwa.airtimeCheckoutPage.securityCode.text"],
          helperTextId: 'cvv-text-id',
          required: true,
          maxlength: "3",
          minLength: "3",
          type: 'tel',
          CVVClass: true
        }
      }
      arrPayCards.push(temp);
    })

    this.lastIndexOfArray = arrPayCards && arrPayCards.length && arrPayCards.length - 1

    return (
      <React.Fragment>
        {showAirTimePayCard &&
          <React.Fragment>
            <div className="o-box mb-5" id="o-box-payment">
              <div className="col-12">
                <H2 className="a-airTime-sub__title" headLineText={PaymentNumberTwoText + ". " + choosePaymentMethodText} />
              </div>
              {map(arrPayCards, (arrPayCards, index) => {
                if (index === this.lastIndexOfArray) {
                  this.lastDivId = arrPayCards.id
                  //console.log('this.lastDivId',this.lastDivId);
                }
                return (
                  <MoleculeAirTimePaycard onBlur={this.props.onBlur} onBlurMonth={this.props.onBlurMonth} onBlurYear={this.props.onBlurYear} key={index} errorCvv={this.props.errorCvv} errorYear={this.props.errorYear} errorMonth={this.props.errorMonth} activeIndex={this.props.activeIndex} arrPayCards={arrPayCards} creditCardFunction={this.creditCardFunction} showCreditCardSection={this.state.showCreditCardSection} showCVVField={this.state.showCVVField} index={index} getCreditCardMonth={this.props.getCreditCardMonth} getCreditCardYear={this.props.getCreditCardYear} getCreditCardCvv={this.props.getCreditCardCvv} getselectedCreditCardType={this.props.getselectedCreditCardType} staticLabels={staticLabels} {...this.props}  lastDivId={this.lastDivId} />
                )
              })}
              {/*add card for WEB*/}
              <div className="m-airTime-buttons col-5 d-none d-lg-block">
                <Button handleClick={() => { Router.push(`/tienda/users/newCreditCard?id=airtime`) }} className="a-btn a-btn--tertiary">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.addCard.text"]}</Button>
              </div>

              {/*add card for mobile*/}
              <div className="col-12 d-lg-none">
                <a className="a-airTime-addPhone--mobile d-flex align-items-center" href="#" onClick={() => { Router.push('/tienda/users/newCreditCard?id=airtime') }}>{staticLabels && staticLabels["pwa.airtimeCheckoutPage.mAddCard.text"]}
                  <i className="icon-arrow_right"></i>
                </a>
              </div>
            </div>

            <div className="row">
              <div className="col-12 d-lg-none">
                <Button className="a-btn a-btn--primary mb-5" onClick={this.props.finishRechargeForAirTimeMobile}>{staticLabels && staticLabels["pwa.airtimeCheckoutPage.buyButton.text"]}</Button>
              </div>
            </div>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}
export default OrganimsAirTimePayment;