import MaterialInputCheckboxNew from '../MaterialInputCheckBox/MaterialInputCheckboxNew';
import { ShowMotion } from '../MenuMotion/molecule-menu-motion';
// import { Menumotion } from '../MenuMotion/molecule-menu-motion';
import InputSelect from '../InputSelect/InputSelect';
import map from 'lodash/map';
import Router from 'next/router';
import { Utility, logError, logDebug } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';

class MoleucleCheckCellphone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInputSelect: false,
      showTotal: false,
      selectedAmount: 0,
      airtimeAmountSearchData: [],
      // Subtotal: ''

    }
    // this.selectedValue = 0;
    this.selectedAmount = 0
    this.airTime = ''
  }
  handleClick = (service, airTime) => {

    this.airTime = airTime
    this.props.getselectedPhones(airTime);
    // this.props.handleChange(service);
    this.handleChange(service, airTime);

    if (this.props.desktopScreen === true) {
      this.setState({
        // showInputSelect: true,
        showInputSelect: !this.state.showInputSelect,
        showTotal: !this.state.showTotal
      });
      this.props.showPaymentMethodForMobile();
    } else if (this.props.desktopScreen === false) {
      this.setState({
        showInputSelect: !this.state.showInputSelect,
        showTotal: !this.state.showTotal
      });
    }
  }

  handleInputSelect = (e) => {
    let price = parseInt(e.target.value);
    this.selectedAmount = price
    let selectedPhonesId = this.stateValue.getId();
    this.props.getSubtotal(e.target.value, this.airTime, this.state.showTotal);
    this.props.getSelectedAirtimeSKUs(selectedPhonesId, this.airTime, this.state.showTotal);
  }

  handleChange = (service, airTime) => {
    let airTimePhones = this.props.airTimePhonesData;
    try {
      //airtimeAmountSearch service
      const payload = { "phoneService": service }
      Utility(Path.airtimeAmountSearch, 'POST', payload).then(response => {
        if (response && response.data && response.data.s === "0" && response.data.airtimeSkus) {
          const airtimeSkus = response.data.airtimeSkus;

          const airtimeAmountSearchData = [];
          for (var item in airtimeSkus) {
            const data = {};
            data.id = airtimeSkus[item].repositoryId;
            data.value = airtimeSkus[item].displayName;
            data.price = airtimeSkus[item].salePrice ? airtimeSkus[item].salePrice : airtimeSkus[item].listPrice;

            airTimePhones.map((temp => {
              if (temp.airTime === airtimeSkus[item].repositoryId) {
                data.selected = true
              }
            }))

            airtimeAmountSearchData.push(data);
          }

          airtimeAmountSearchData.map((airtimeSku => {
            if (airtimeSku.selected === true) {
              this.props.getSelectedAirtimeSKUs(airtimeSku.id, airTime, this.state.showTotal);
              this.props.getSubtotal(airtimeSku.price, airTime, this.state.showTotal);
            }
          }))

          // RTC defect 23858 start
          document.querySelectorAll(".mdc-floating-label").forEach(i=>{
            i.classList.add("mdc-floating-label--float-above");
            }
          )
          // RTC defect 23858 End
          this.props.showrechargeTotal(this.state.showTotal)
          this.setState({ airtimeAmountSearchData: [...airtimeAmountSearchData] });
          this.props.showAirTimePayCardFunction();
        }
      }, (error) => {
      });

    } catch (e) {
      logError(e, "error");
    }

  }

  // Input Select function 
  // handleInputSelect = (e) => {
  //   let price = parseInt(e.target.value);
  //   console.log('price',price);
  //   this.selectedValue += price;
  //   this.props.getSubtotal(this.selectedValue);

  //   let selectedPhonesId = this.stateValue.getId();
  //   this.props.getSelectedAirtimeSKUs(selectedPhonesId);
  // }
  render() {
    const arrCellphones = this.props.arrCellphones;
    const staticLabels = this.props.staticLabels && this.props.staticLabels;
    let index = this.props.index;

    var menuMotion = [
      { text: staticLabels && staticLabels["pwa.airtimeCheckoutPage.editButton.text"], url: "#", cls: "a-menuMotion__link dropdown-item ripple-motion", textPosition: "", onClick: () => Router.push('/tienda/users/editPhone?id=' + arrCellphones.labelText.repositoryId) },
      { text: staticLabels && staticLabels["pwa.airtimeCheckoutPage.deleteButton.text"], url: "#", cls: "a-menuMotion__link dropdown-item ripple-motion", textPosition: "", onClick: () => { this.props.setAddressToDelete(arrCellphones.labelText.repositoryId); this.props.openDeleteModal('deleteModal') } }
    ]

    var selectOptions = {
      labelText: staticLabels["pwa.airtimeCheckoutPage.rechargeAmount.text"], 
      labelId: 'labelIDrecharge', // label id
      selectId: 'selectIDrecharge', // select id
      alertId: 'value', // alert id
      alertText: 'value', // alert text
      custom: true,
      // optionList: this.props.airtimeSkus,
      optionList: this.state.airtimeAmountSearchData,
      optionCaption: 'Selecciona',
    }

    return (
      <React.Fragment>
        <div id={arrCellphones.labelText.repositoryId} className={"m-checkCellphone-data__item col-12 "} style={{'border' : arrCellphones.labelText.repositoryId === this.props.lastDivId ? 'none' : ''}}>
          <div className="row align-items-start justify-content-between">
            <div className="col-10">
              <MaterialInputCheckboxNew index={this.props.index} options={arrCellphones} airTime={this.props.airTime} service={this.props.service} index={index} onClick={this.handleClick} checked={arrCellphones.checked} ref={st => this.MaincheckBox = st} />
            </div>

            <div className="col-2 text-right">
              <ShowMotion options={menuMotion} transform={null} />
            </div>
            {this.state.showInputSelect &&
              <div className="col-11 col-lg-8 offset-1 pl-2 mt-3" id={"recharge" + index}>
                <InputSelect options={selectOptions} handleChange={this.handleInputSelect} ref={st => this.stateValue = st} />
              </div>
            }
          </div>
        </div>
      </React.Fragment >

    )
  }
}
export default MoleucleCheckCellphone;
