import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Icons from '../../atoms/Icons/Icons';
import HrTag from '../../atoms/HrTag/HrTag';
import ProductImage from '../../molecules/ProductImage/ProductImage';
import AlertsOnModal from '../../molecules/Alert/AlertsOnModal';
import ProductDetailGiftRegistry from '../../molecules/ProductDetail/ProductDetailGiftRegistry';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Select from '../../molecules/MaterialSelect/Select';
import MaterialInputRadioNew from '../../molecules/MaterialInputRadio/MaterialInputRadioNew';

import { CheckboxRadioList } from '../CheckboxList/CheckboxList';

export default class ProductGiftRegistry extends React.Component {

	constructor (props) {
        super (props)
        this.state = {
			modeOfDelivery: '',
			currentTime: props.currentTime,
			eventId: '',
			giftRegistryModalInfo: this.props.giftRegistryModalInfo,
			showAlert: false,
			alertType: '',
			alertText: '',isCartBtnDisabled:false
        }
    }

	onChangeEvent = (e) => {
		const eventId = e.target && e.target.value || '';
		this.setState({ eventId, showAlert: false });
	}

	onSelectModeOfDelivery = (modeOfDelivery) => {
		this.setState({ modeOfDelivery, showAlert: false,isCartBtnDisabled:true });
	}

	showAlert = ( { type = '', text = '' } ) => {
		this.setState({ 
			alertType: type,
			alertText: text,
			showAlert: true
		});

	}

	render () {

		const alertOption = {
			showAlert: this.state.showAlert,
			alertType: this.state.alertType,
			alertText: this.state.alertText,
			alertClass: 'm-alert__text'
		};

		const modalHeader = {
			title: 'Agregar a mi mesa de regalos',
			titleType: 'h4',
			headlineAttributes: {
				"id":"giftRegistry-modal"
			},
			close: true,
			buttonClass: 'close a-eddBox__closeButton',
			buttonAttributes: {
				"type":"button",
				"data-dismiss":"modal",
				"aria-label":"Close"
			}
		};
		const isDisabled = (this.state.eventId == '') ? 'true' : 'false';
		const option1 = {
			inputId:'radioGR1',
			labelText: 'Regalo Físico',
			nameInput: 'option',
			disabled: isDisabled,
			onClick: () => {this.onSelectModeOfDelivery('physical')}
		};
		const option2 = {
			inputId:'radiradioGR2',
			labelText: 'Regalo Electrónico',
			nameInput: 'option',
			disabled: isDisabled,
			onClick: () => {this.onSelectModeOfDelivery('electronic')}
		};
		const optionsGR = {
			labelText: 'Selecciona tu mesa de regalos', // text of the label
			labelId: 'select-label__gr', // label id
			selectId: 'select-gr__id', // select id
			selected: false, //  if you need a preselected option
			custom:true,
			items:[
				{text:"1"},
				{text:"2"},
				{text:"4"}
				]
		};

		const { eventListMap = {}, productImage, productDisplayName, priceToShow, pdpQty, selectedSkuId, thumbnailImage, onAddItemToEvent, departmentId } = this.state.giftRegistryModalInfo || {};
		const imageInfo = {
			imgAlt: 'PDP Demo',
			imgTitle: productDisplayName,
			imgSrc: productImage
		};

		const addItemToEventInfo = {
			departmentId,
			selectedSkuId,
			thumbnailImage,
			modeOfDelivery: this.state.modeOfDelivery,
			eventId: this.state.eventId,
			closeModal: this.props.closeModal,
			showAlert: this.showAlert
		};
	
		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp}/>
				<div className="modal-body">
					<AlertsOnModal options={alertOption} />
					<div className="row">
						<div className="col-4">
							<ProductImage options={imageInfo} />
						</div>
						<div className="col-8">
							<ProductDetailGiftRegistry productDisplayName={productDisplayName} priceToShow={priceToShow} pdpQty={pdpQty}/>
						</div>
						<div className="col-12 mb-3 mt-3">
							{/*<MaterialSelect options={optionsGR} />  ---- Need to reuse this component ---- */}
							<div className="mdc-select mdc-select--outlined">
								<Icons className="mdc-select__dropdown-icon" />
								<Select eventListMap={eventListMap} onChangeEvent={this.onChangeEvent}/>
								<div className="mdc-notched-outline mdc-notched-outline--upgraded mdc-notched-outline--notched">
									<div className="mdc-notched-outline__leading"></div>
									<div className="mdc-notched-outline__notch" ><span className="mdc-floating-label mdc-floating-label--float-above" id="select-label__gr" >Selecciona tu mesa de regalos</span></div>
									<div className="mdc-notched-outline__trailing"></div>
								</div>
							</div>
							<div className="mdc-select-helper-line">
								<Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true"></Paragraph>
							</div>
						</div>
						<div className="col-9">
							<Paragraph className="a-giftRegistry__preferencesTitle">Preferencias del regalo</Paragraph>
							<HrTag />
						</div>
						<div className="col-9">
							<MaterialInputRadioNew options={option1} />
						</div>
						<div className="col-9">
							<MaterialInputRadioNew options={option2} />
						</div>
						 <div className="col-12 col-lg-6 mt-3">
							<Button className="a-btn a-btn--primary" ripple="" disabled={this.state.modeOfDelivery == "" ? "disabled":""} id="addGRButton" handleClick={ () => onAddItemToEvent(addItemToEventInfo) } >Agregar a mi mesa</Button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}