import Button from '../../atoms/Button/Button';
import MoleucleCheckCellphone from '../../molecules/CheckCellphone/moleucleCheckCellphone';
import { parentContext } from '../../../contexts/parentContext';
import Modal from '../../../helpers/modal/modal';
import DeleteModal from '../../molecules/Modals/moleculeModalLogin';
import { Utility, logError, logDebug } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';
import map from 'lodash/map';

class OrganimsAirTimeCellphones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // airtimeAmountSearchData: [],
      phones: '',
      phoneId: null,
    }
    this.lastIndexOfArray = '',
    this.lastDivId = ''
  }
  deleteCreditCard = (phoneId) => {
    try {
      const payload = {
        "phoneId": this.state.phoneId
      };
      Utility(Path.removePhoneNumber, 'POST', payload).then(response => {
        if (response && response.data && response.data.s === "0") {
          this.props.loadAirTimeData();
        }
      }, (error) => {
        logError("error", error);
      });
    } catch (e) {
      logError(e, "error");
    }

  }

  edit = () => {
    Router.push(`/tienda/users/editPhone`)
  }

  setAddressToDelete = phoneId => {
    this.props.getselectedPhones(phoneId)
    //console.log('phoneId', phoneId);
    this.setState({ phoneId })
  }
  render() {
    const airTimePhonesData = this.props.phonesData;
    const desktopScreen = this.props.desktopScreen;
    const staticLabels = this.props.staticLabels && this.props.staticLabels;

    let labelText = [];
    map(airTimePhonesData, (items, index) => {
      let temp = {
        shortname: items.name,
        phoneNumber: items.number,
        service: items.service,
        repositoryId: items.repositoryId,
        airTime: items.airTime
      }
      labelText.push(temp);
    })

    const arrCellphones = [];
    map(airTimePhonesData, (phonesData, index) => {
      let temp = {
        nameInput: 'cell1', //- name of the input
        labelPosition: 'right',
        customClass: 'recharge0', //- if you want a custom class for your input div
        labelText: labelText ? labelText[index] : '',
        checked: false
      }
      arrCellphones.push(temp);
    })

    const modalDelete = {
      modalId: "AirTime-removeCellphone", // delete-modal
      modalClass: "o-product__modal modal fade",
      modalTabIndex: "1",
      modalAriaLabelledBy: "delete-modal",
      modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",  //modal-dialog modal-dialog-centered
      modalContentClass: "modal-content"
    };

    this.lastIndexOfArray = arrCellphones && arrCellphones.length && arrCellphones.length - 1
    return (
      <parentContext.Consumer>
        {({ OpenModal }) => (
          <React.Fragment>
            <div className="o-box mb-5" id="o-box-airTime__cellphones">
              <div className="col-12">
                <h2 className="a-airTime-sub__title">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.numberOne.text"]}. {staticLabels && staticLabels["pwa.airtimeCheckoutPage.selectYourPhone.text"]}</h2>
              </div>
              {
                map(arrCellphones, (arrCellphones, index) => {
                  if (index === this.lastIndexOfArray) {
                     this.lastDivId = arrCellphones.labelText.repositoryId
                  }
                  return (
                    <MoleucleCheckCellphone index={index} show={this.state.show} setAddressToDelete={this.setAddressToDelete} airTime={arrCellphones.labelText.repositoryId} service={arrCellphones && arrCellphones.labelText && arrCellphones.labelText.service} arrCellphones={arrCellphones} openDeleteModal={OpenModal} edit={this.edit} handleChange={this.handleChange} index={index} deleteCreditCard={this.deleteCreditCard} getSelectedAirtimeSKUs={this.props.getSelectedAirtimeSKUs} getselectedPhones={this.props.getselectedPhones} getSubtotal={this.props.getSubtotal} showPaymentMethodForMobile={this.props.showPaymentMethodForMobile} desktopScreen={desktopScreen} staticLabels={staticLabels} airTimePhonesData={airTimePhonesData} showAirTimePayCardFunction={this.props.showAirTimePayCardFunction} {...this.props} lastDivId={this.lastDivId} showrechargeTotal={this.props.showrechargeTotal}/>
                  )
                })}
              {/*add phone link for WEB*/}
              <div className="m-airTime-buttons col-4 d-none d-lg-block">
                <Button handleClick={() => { Router.push('/tienda/users/addPhone?id=airtime') }} className="a-btn a-btn--tertiary">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.addPhone.text"]}</Button>
              </div>

              {/*add phone link for WAP*/}
              <div className="col-12 d-lg-none">
                <a className="a-airTime-addPhone--mobile d-flex align-items-center" href="#" onClick={() => { Router.push('/tienda/users/addPhone?id=airtime') }}>{staticLabels && staticLabels["pwa.airtimeCheckoutPage.mAddPhone.text"]}<i className="icon-arrow_right"></i></a>
              </div>

            </div>
            <div className="row">
              <div className="col-12 d-lg-none">
                <Button className="a-btn a-btn--primary mb-5" id="btn-box-airTime__cellphones" onClick={this.props.showPaymentMethodForMobile}>{staticLabels && staticLabels["pwa.airtimeCheckoutPage.Continue.text"]}</Button>
              </div>
            </div>
            <Modal modalDetails={modalDelete} showModalpopUp={'deleteModal'}>
              <DeleteModal deleteCreditCard={this.deleteCreditCard} ModalpopUp={"deleteModal"} />
            </Modal>
          </React.Fragment>

        )}
      </parentContext.Consumer>
    );
  }
}
export default OrganimsAirTimeCellphones;
