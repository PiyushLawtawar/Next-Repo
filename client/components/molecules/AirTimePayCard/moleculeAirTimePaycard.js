import MaterialInputRadio from '../MaterialInputRadio/MaterialInputRadio';
import Label from '../../atoms/Label/Label';
import InputSelect from '../InputSelect/InputSelect';
import InputText from '../InputText/InputText';
import Popover from "../Popover/PopoverHelpingText";
import map from 'lodash/map';
import { Path } from './../../../helpers/config/config';
import { Validate } from '../../../helpers/utilities/Validate';
import Router from 'next/router';
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';

class MoleculeAirTimePaycard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dynamic_popover_status_obj: false,
      // error: false
      //showExpMonthAndYearField: false
    }
  }
  showCVVFieldFunction = (e, index, nickName) => {
    let cardType = e;
    if (cardType === 'LPC') {
      this.props.showCVVFieldOrNot(cardType);
    } else {
      this.props.showCVVFieldOrNot(cardType);
    }
    // this.props.updateActiveIndex(index);
    this.props.showCVVFieldOrNot(cardType, index);
    this.props.getselectedCreditCardType(nickName);

  }

  getMonth = (e) => {
    let creditCardMonth = e.target.value;
    this.props.getCreditCardMonth(creditCardMonth);
    this.props.onBlurMonth(creditCardMonth);
  }
  getYear = (e) => {
    let creditCardYear = e.target.value;
    this.props.getCreditCardYear(creditCardYear);
    this.props.onBlurYear(creditCardYear);
  }

  // handleChangeName = (e) => {
  //   let creditCardCvv = e.target.value;
  //     this.setState(function (prevState) {
  //     const pre_value =  e.target.value;
  //     creditCardCvv = Validate.validation(e, pre_value);
  //     return { creditCardCvv }
  //   })
  //   this.props.getCreditCardCvv(creditCardCvv)
  // }
  handleChangeName = (e) => {
    let creditCardCvv = e.target.value;
    this.props.getCreditCardCvv(creditCardCvv)
    this.props.onBlur(creditCardCvv);

  }
  handleAllowOnlyDigit = (e) => {
    const limitLength = e.target.maxLength;
    const keyCode = e.keyCode;
    if (keyCode === 46 || keyCode === 8 || keyCode === 9 || keyCode === 37 || keyCode === 39) {
      return true;
    }
    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
      // numbers and numeric keypad
      if (e.target.value.length > limitLength) {
        e.preventDefault();
        e.stopPropagation();
      }
    } else {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;
  }
  mouseOverLinks = () => {
    let { dynamic_popover_status_obj } = this.state;
    dynamic_popover_status_obj = true;
    this.setState({ dynamic_popover_status_obj })
  }

  mouseOutLinks = () => {
    let { dynamic_popover_status_obj } = this.state;
    dynamic_popover_status_obj = false;
    this.setState({ dynamic_popover_status_obj })
  }
  handleOnFocus = (e) => {
    const { focused } = this.state;
    focused[e.target.name] = true
    this.setState({ focused });
  }
  render() {
    const arrPayCards = this.props.arrPayCards;
    const index = this.props.index;
    const dynamic_popover_status_obj = this.state.dynamic_popover_status_obj;
    const staticLabels = this.props.staticLabels && this.props.staticLabels;

    return (
      <React.Fragment>
        <div id={arrPayCards.id} className={"m-airTime-paymentCard col-12 "} style={{'border' : arrPayCards.id === this.props.lastDivId ? 'none' : ''}}>
          <MaterialInputRadio options={arrPayCards} handleClick={(e) => this.showCVVFieldFunction(e, index, arrPayCards.nickName)} ref={cn => this.temp = cn} />

          <div className="m-airTime-infoHidden" id={"cardInfo" + index} ref={cn => this.divRef = cn}>
            {
              (index === this.props.activeIndex) && (this.props.showExpMonthAndYearField) &&
              <React.Fragment>
                <div className="row">
                  <div className="col-12">
                    <Label className="a-airTime-date__label" for="">{arrPayCards.FechaVencimiento}</Label>
                  </div>
                  <div className="col-12">
                    <Label className="a-airTime-required__label" for="">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.requiredFields.text"]}</Label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-5 col-lg-4 offset-1">
                        <InputSelect
                          options={arrPayCards.SelectMonth}
                          handleChange={this.getMonth}
                          error={this.props.errorMonth}
                        />
                      </div>

                      <div className="col-5 col-lg-4">
                        <InputSelect
                          options={arrPayCards.SelectYear}
                          handleChange={this.getYear}
                          error={this.props.errorYear} />

                      </div>

                    </div>
                  </div>
                </div>

              </React.Fragment>
            }
            {
              index === this.props.activeIndex && 
              <React.Fragment>
                <div className="row">
                  <div className="col-12">
                  </div>

                  {
                    this.props.showExpMonthAndYearField === true ? '' :
                      <div className="col-12">
                        <Label className="a-airTime-required__label" for="">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.requiredFields.text"]}</Label>
                      </div>
                  }


                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-5 col-lg-4 offset-1">
                        <InputText
                          options={arrPayCards.InputCvv}
                          handleChange={this.handleChangeName}
                          error={this.props.errorCvv}
                          validationtype={"onlyNumbers"}

                        />
                      </div>
                      <div id="airTimePopOver" className="col-6 col-lg-7">
                        <CustomTooltip
                            tooltipFor="airtimepay-label"
                            trigger="click"
                            content={"Son los tres números detrás de tu tarjeta"}
                            position="top"
                            arrowSize="8px"
                            borderSize="1px"
                            contentPadding="10px 25px 10px 10px"
                            boxClass="customBoxSizing">
                        </CustomTooltip>
                        <label className="a-cvv-anchor--helperText" id='airtimepay-label' onMouseOver={() => this.mouseOverLinks(`panel${index}`)} onMouseOut={() => this.mouseOutLinks(`panel${index}`)} data-content={staticLabels && staticLabels["pwa.airtimeCheckoutPage.CVVHelper.text"]} title="" data-original-title=" ">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.PopOver.text"]}
                         <i id='airtimepay' className="a-iconHelper ml-1" onMouseOver={() => this.mouseOverLinks(`panel${index}`)} onMouseOut={() => this.mouseOutLinks(`panel${index}`)}></i>
                        </label>
                        <CustomTooltip
                            tooltipFor="airtimepay"
                            trigger="click"
                            content={"Son los tres números detrás de tu tarjeta"}
                            position="top"
                            arrowSize="8px"
                            borderSize="1px"
                            contentPadding="10px 25px 10px 10px"
                            boxClass="customBoxSizing">
                        </CustomTooltip>
                      </div>

                    </div>
                  </div>
                </div>
              </React.Fragment>
            }
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default MoleculeAirTimePaycard;