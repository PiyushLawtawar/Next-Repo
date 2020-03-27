import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import ModalHeader from './ModalHeader';
import Link from '../../atoms/Link/Link';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup, ParagraphGroups } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailabilityItr from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailabilityItr';
import { Utility, logError, logDebug, UserAgentDetails } from '../../../helpers/utilities/utility';
import {GetCookie} from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';


export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = { allStores: [], availableStores: [], allStoreErrMessage: "", availStoreErrMessage: "", isMobile: false }
	}
	componentDidMount() {
        const { isMobile } = UserAgentDetails(window);
        this.setState({isMobile});
		// let prodType = this.props.productType && this.props.productType[0] || this.props.productType || ""
		// if (prodType != "") {
		this.getRealTimeInventory();

		// }
	}
	componentWillReceiveProps() {
		//this.getRealTimeInventory();
	}

	callGTM = (selectedStore) => {
		let ProductCodeFlag= this.props && this.props.modalProductDetails && this.props.modalProductDetails.ProductCode? this.props.modalProductDetails.ProductCode:'';
		let collectionProductId = this.props && this.props.collectionProductId? this.props.collectionProductId : '';
		if((ProductCodeFlag === collectionProductId) && this.props.fromCollection !== undefined){	
		let collectionFlag = false;
		let firstValue = this.props && this.props.priceToShow && this.props.priceToShow.discount && this.props.priceToShow.discount.val || '';
		let decimalValue = this.props && this.props.priceToShow && this.props.priceToShow.discount && this.props.priceToShow.discount.decimal || '';
		if (firstValue === '' && decimalValue === '') {
			firstValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.noRange && this.props.priceToShow.rangeDiscount.noRange.val;
			decimalValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.noRange && this.props.priceToShow.rangeDiscount.noRange.decimal;
		}
		if (firstValue === undefined && decimalValue === undefined) {
			firstValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.max && this.props.priceToShow.rangeDiscount.max.val ? this.props.priceToShow.rangeDiscount.max.val + '.' + this.props.priceToShow.rangeDiscount.min.decimal : '';
			decimalValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.max && this.props.priceToShow.rangeDiscount.max.decimal ? this.props.priceToShow.rangeDiscount.min.val + '.' + this.props.priceToShow.rangeDiscount.min.decimal : '';
			collectionFlag = true;
		}

		 let GTM_USER_ID = sessionStorage.getItem('gtm');
		// console.log('GTM_USER_ID',GTM_USER_ID);
		dataLayer.push({
			event: 'verDisponibilidad',//variable estática
			state: selectedStore || '',
			id: this.props.mainContent.productId || this.props.collectionProductId || '',
			price: !collectionFlag ? (firstValue.toString().replace(/,/g,'') + '.' + decimalValue) : firstValue.toString().replace(/,/g,'') + '-' + decimalValue,
			"loginStatus": GTM_USER_ID && GTM_USER_ID.length > 0 ? true: false,
			"userID": GTM_USER_ID || '',
		});
	}
	if(this.props.fromCollection === undefined){
		let collectionFlag = false;
		let firstValue = this.props && this.props.priceToShow && this.props.priceToShow.discount && this.props.priceToShow.discount.val || '';
		let decimalValue = this.props && this.props.priceToShow && this.props.priceToShow.discount && this.props.priceToShow.discount.decimal || '';
		if (firstValue === '' && decimalValue === '') {
			firstValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.noRange && this.props.priceToShow.rangeDiscount.noRange.val;
			decimalValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.noRange && this.props.priceToShow.rangeDiscount.noRange.decimal;
		}
		if (firstValue === undefined && decimalValue === undefined) {
			firstValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.max && this.props.priceToShow.rangeDiscount.max.val ? this.props.priceToShow.rangeDiscount.max.val + '.' + this.props.priceToShow.rangeDiscount.min.decimal : '';
			decimalValue = this.props && this.props.priceToShow && this.props.priceToShow.rangeDiscount && this.props.priceToShow.rangeDiscount.max && this.props.priceToShow.rangeDiscount.max.decimal ? this.props.priceToShow.rangeDiscount.min.val + '.' + this.props.priceToShow.rangeDiscount.min.decimal : '';
			collectionFlag = true;
		}
		dataLayer.push({
			event: 'verDisponibilidad',//variable estática
			state: selectedStore || '',
			id: this.props.mainContent.productId || this.props.collectionProductId || '',
			price: !collectionFlag ? (firstValue.toString().replace(/,/g,'') + '.' + decimalValue) : firstValue.toString().replace(/,/g,'') + '-' + decimalValue,
			"loginStatus": this.props && this.props.loginDetails && this.props.loginDetails.LoggedInSession ? this.props.loginDetails.LoggedInSession : 'N',
			"userID": this.props.loginDetails && this.props.loginDetails.cartHeaderResponse && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails && this.props.loginDetails.cartHeaderResponse.cartHeaderDetails.gtmUserId || '',
		});
	}

	}

	getRealTimeInventory = () => {
		Utility(Path.realTimeInventoryCheckService, 'POST', {
			"ïsStoreListforEDD": "false",
			"onlyAvailableStore": "false",
			"skuId": this.props.productSizeId,
			"state": this.props.SelectedModelData,
			"productType": this.props.productType && this.props.productType[0] || this.props.productType || ""
		}).then(response => {

			if (response && response.data && response.data != null) {
				let ErrMsg = "Por ahora no es posible mostrar el inventario del producto"

				if (response.data.s == "0") {
					
					let allStores = response.data && response.data.storeInventoryDetails || [];
					let withInventory = allStores.filter(store => store.available === 'true');
					let withoutInventory = allStores.filter(store => store.available !== 'true');
					!isEmpty(withInventory) && withInventory.sort((first, second) => (first.numberOfPieces > second.numberOfPieces) ? 1 : -1);
					!isEmpty(withInventory) && withInventory.reverse();
					!isEmpty(withoutInventory) && withoutInventory.sort((first, second) => (first.storeName > second.storeName) ? 1 : -1);
					//!isEmpty(withoutInventory) && withoutInventory.reverse();
					let allinventoryConcat = withInventory.concat(withoutInventory);
					allStores = allinventoryConcat;
					let availableStores = withInventory;
					this.setState({
						allStores, availableStores, allStoreErrMessage: allStores.length > 0 ? "" : ErrMsg, availStoreErrMessage: availableStores.length > 0 ? "" : ErrMsg
					});
					this.callGTM(this.props.SelectedModelData);
				}
				else {
					this.setState({ allStoreErrMessage: response.data.err || ErrMsg, availStoreErrMessage: response.data.err || ErrMsg })
				}
			}
			else {
				this.setState({ allStoreErrMessage: "", availStoreErrMessage: "" })
				conosle.log("No response in StoreApi")
			}

		})
			.catch((err) => {
				logError(err)
			})
	}
	render() {
		const { isMobile } = this.state;
		const staticLabels = this.props.staticLabels || {}; /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
		const modalHeader = {
			title: staticLabels && staticLabels['pdpPage.ITR.DisplayInPDP.label'] || 'pdpPage.ITR.DisplayInPDP.label', /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
			titleType: 'h4',
			headlineAttributes: {
				"id": "availability-modal-itr"
			},
			back: true,
			close: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			},
			requireArrow: true
		};

		const paragraphGroup = [{
			// text: 'Ciudad',
			class: 'a-product__paragraphClickAndCollectSelected m-0'
		}];

        const overflowStyle = {
            overflowX: 'hidden',
            overflowY: 'auto'
        }

		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} modalToOpen="showModal2" modalProductDetails={this.props.modalProductDetails} fromCollection={this.props.fromCollection} ModalpopUp={this.props.ModalpopUp} />
				<div className="modal-body" style={isMobile ? overflowStyle : {}}>
					<div className="row">
						<div className="col-12 m-0 mb-3">
							<Paragraph className="a-product__paragraphClickAndCollectCity m-0">{staticLabels['pdpPage.availability.ITR.state.label'] || 'pdpPage.availability.ITR.state.label'}</Paragraph> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel */}
							<parentContext.Consumer>{({ SelectedModelData }) => (
								!isEmpty(paragraphGroup) && map(paragraphGroup, (para, index) => {

									return <ParagraphGroup key={index} blockclass={para.class} text={SelectedModelData ==='DISTRITO FEDERAL' ? "CDMX/ZONA METROPOLITANA" : SelectedModelData} />
								}))
							}</parentContext.Consumer>

						</div>
					</div>
					<div className="row availabilityTabs">
						<div className="col">

							<ProductSpecDetail widthClass="" childClass="m-click-and-collect-modal-select-tab pt-3">
								<div label="Todas las tiendas">
									{this.state.allStores.length > 0 ? <parentContext.Consumer>
										{
											({ closeModal, showModal }) => {
												return (
													showModal ? <ClickAndCollectAvailabilityItr data={this.state.allStores} productType={this.props.productType} statusRequired={false} handleStoreChange={(e) => this.getEdd(e, closeModal)} /> : null
												)
											}
										}
									</parentContext.Consumer> :
										//(this.state.ErrMessage != "" && this.state.ErrMessage)
										this.state.allStoreErrMessage != "" && <p className="a-product__paragraphClickAndCollectNotAvailable"> {this.state.allStoreErrMessage}</p>
									}
								</div>
								<div label="Con disponibilidad">
									{this.state.availableStores.length > 0 ? <parentContext.Consumer>
										{
											({ closeModal }) => <ClickAndCollectAvailabilityItr data={this.state.availableStores} productType={this.props.productType} tabType={"Con disponibilidad"} />
										}
									</parentContext.Consumer> : <p className="a-product__paragraphClickAndCollectNotAvailable">{this.state.availStoreErrMessage}</p>}
								</div>
							</ProductSpecDetail>
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<Paragraph>El inventario puede variar en la consulta y al momento de concluir la compra</Paragraph>
				</div>
			</React.Fragment>
		);
	}
}
