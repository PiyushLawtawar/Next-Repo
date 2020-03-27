import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import ModalHeader from './ModalHeader';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailability from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailability';
import { Utility, logError, logDebug, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';



export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = { allStores: [], availableStores: [], allStoreErrMessage: "", availStoreErrMessage: "", isMobile: false }
	}
	getRealTimeInventory = () => {
		Utility(Path.realTimeInventoryCheckService, 'POST', {
			"ïsStoreListforEDD": "true",
			"onlyAvailableStore": "false",
			"skuId": this.props.productSizeId,
			"state": this.props.SelectedModelData,
			"productType": this.props.productType && this.props.productType[0] || this.props.productType || ""
		}).then(response => {

			if (response && response.data && response.data != null) {
				let ErrMsg = "Por ahora no es posible mostrar la fecha de entrega."

				if (response.data.s == "0") {

					let allStores = response.data.storeInventoryDetails;
					let availableStores = allStores.filter(store => store.available === 'true');
					this.setState({
						allStores, availableStores, allStoreErrMessage: allStores.length > 0 ? "" : ErrMsg, availStoreErrMessage: availableStores.length > 0 ? "" : ErrMsg
					});
				}
				else {
					this.setState({ allStoreErrMessage: response.data.err || ErrMsg, availStoreErrMessage: response.data.err || ErrMsg })
				}
			}
			else {
				this.setState({ allStoreErrMessage: "", availStoreErrMessage: "" })
				//conosle.log("No response in StoreApi")
			}

		})
			.catch((err) => {
				logError(err)
			})
	}
	componentDidMount() {
		const { isMobile } = UserAgentDetails(window);
		this.setState({ isMobile });
		this.getRealTimeInventory();
		// Utility(Path.realTimeInventoryCheckService, 'POST', {
		// 	"ïsStoreListforEDD": "true",
		// 	"onlyAvailableStore": "false",
		// 	"skuId": this.props.productSizeId,
		// 	"state": this.props.SelectedModelData,
		// 	"productType": "SL"
		// }).then(response => {
		// 	
		// 	this.setState({
		// 		allStores: response.data.storeInventoryDetails,
		// 		availableStores: response.data.storeInventoryDetails.filter(store => store.available === 'true')
		// 	});
		// });

	}
	// componentWillReceiveProps(nextProps) {
	// 	
	// 	console.log("Avalability CWRP", nextProps);

	// 	//this.getRealTimeInventory();
	// }
	getPostalCodeAddress = (selectedAddress, eddRes, closeModal) => {
		// service addresssearch change GET from POST method :: Start
		let payLoad = '?action=EMA&cp=' + selectedAddress;
		Utility(Path.addresssearch + payLoad, 'GET').then(response => {
		// service addresssearch change GET from POST method :: End

			if (response && response.data && response.data.s == "0" && response.data.addrSearchResponse) {
				let { addrSearchResponse: { municipality = "", state = "" } = "" } = response.data;
				let postalCodeState = "C.P." + selectedAddress + "," + municipality[0].split(":")[1] + "," + state[0].split(":")[1]
				eddRes.stateDetails = postalCodeState
				this.props.estimatedDate(eddRes)
				closeModal('showModal1')
			}
			else if (response && response.data && response.data.s == "1") {
				let { addrSearchResponse: { municipality = "", state = "" } = "" } = response.data;
				let postalCodeState = "C.P." + selectedAddress
				eddRes.stateDetails = postalCodeState
				this.props.estimatedDate(eddRes)
				closeModal('showModal1')
			}
		}).catch(e => {
			console.error("edd service", e)
		})
	}
	getEdd = (selectedStore, closeModal) => {

		let allproduct = this.props.fullCollectionData && this.props.fullCollectionData.productsInfo || {};
		let productInfo = {}
		let collectionSkuId = "";
		let collectionProductType = "";
		let Qty = this.props.qtyDropdownInfo ? this.props.fromCollection === true ? this.props.SelectedEdd.props.qtyDropdownInfo.pdpQty : this.props.qtyDropdownInfo.pdpQty : 1 /* modified for bug id 23723 */
		for (let product in allproduct) {
			if (this.props.modalProductDetails.ProductCode == product) {
				productInfo = allproduct[product]
				collectionSkuId = productInfo && productInfo.productVarientsInfo && productInfo.productVarientsInfo.skuAttributeMap && Object.keys(productInfo.productVarientsInfo.skuAttributeMap)[0] || ""
				collectionProductType = productInfo && productInfo.productType && productInfo.productType[0] || ""
				// Qty = qtyDropdownInfo
			}
		}
		const { isMarketPlace = 'false', alloffers } = this.props.marketPlaceInfo || {};
		try {
			let storeName = this.state.allStores.filter((store) => store.storeId == selectedStore)[0].storeName
			const selectedStoreInfo = this.state.allStores.filter((store) => store.storeId == selectedStore);
			const stateId = get(selectedStoreInfo, '[0].stateId', '');
			if (selectedStore) {
				this.props.set_store_number(selectedStore, stateId); // Setting up store number to PDP state at parent level
			}
			if (isMarketPlace === 'true') {
				const leadtimeForSLOrCnC = get(alloffers, 'leadtimeForCnC', '');
				const marketPlaceInfoTmp = { isMarketPlace, leadtimeForSLOrCnC, stateDetails: storeName};
				this.props.estimatedDate(marketPlaceInfoTmp)
				if (this.props.fromCollection === true) {
					closeModal(["showModal4", "showModal3", "showModal1"]);
				}
				else {
					closeModal();
				}

			} else {
				/* let storeName = this.state.allStores.filter((store) => store.storeId == selectedStore)[0].storeName
				const selectedStoreInfo = this.state.allStores.filter((store) => store.storeId == selectedStore);
				const stateId = get(selectedStoreInfo, '[0].stateId', '');
				if (selectedStore) {
					this.props.set_store_number(selectedStore, stateId); // Setting up store number to PDP state at parent level
				} */

				if (!this.props.pdpOfferList || typeof this.props.pdpOfferList === 'undefined') {
					Utility(Path.estimatedDeliveryDate, 'POST', {
						"storeNumber": selectedStore,
						"quantity": Qty || this.props.pdpQty,
						"pageName": "pdp",
						"skuId": collectionSkuId || this.props.productSizeId,
						"productType": collectionProductType || typeof this.props.productType === "string" && this.props.productType || this.props.productType[0]
					}).then(response => {

						// if (response && response.status && response.status != 500) {
						response && response.data ? response.data.stateDetails = storeName : response.data.stateDetails = ""
						/*Added for Edd in collection add to cart --  start*/
						if (response.data && response.data.EDDErrorMessages && isEmpty(response.data.EDDErrorMessages) && !response.data.estimatedDeliveryDate) {
							response.data.EDDErrorMessages = { [collectionSkuId || this.props.productSizeId]: "Por ahora no es posible mostrar la fecha de entrega", stateDetails: storeName }
						}
						response.data.config = response.config || ""
						response.data.selectedState = stateId || ""
						/*Added for Edd in collection add to cart --  end*/
						this.props.estimatedDate(response.data)
						if (this.props.fromCollection === true) {
							closeModal(["showModal4", "showModal3", "showModal1"]);
						}
						else {
							closeModal();
						}
						// }
						// else {
						// 	//this.props.estimatedDate(response.data)
						// 	if (this.props.fromCollection === true) {
						// 		closeModal(["showModal4", "showModal3", "showModal1"]);
						// 	}
						// 	else {
						// 		closeModal();
						// 	}
						// }

						//this.setState({ listedAddress })
					})
						.catch(err => {
							this.props.estimatedDate({ "s": "0", "EDDErrorMessages": { [collectionSkuId || this.props.productSizeId]: "Por ahora no es posible mostrar la fecha de entrega", stateDetails: storeName } })
							if (this.props.fromCollection === true) {
								closeModal(["showModal4", "showModal3", "showModal1"]);
							}
							else {
								closeModal();
							}
							console.error("err", err)
						})
				} else {
					if (this.props.fromCollection === true) {
						closeModal(["showModal4", "showModal3", "showModal1"]);
					}
					else {
						closeModal();
					}
				}
			}
		} catch (e) { logError("Error while on get Edd: ", e) }
	}
	render() {
		const { isMobile } = this.state;
		// let value= this.state.allStores.filter( store =>store.available==='true')
		const staticLabels = this.props.staticLabels || {};
		const modalHeader = {
			title: staticLabels && staticLabels['pdpPage.availability.modal.title.text'] || 'pdpPage.availability.modal.title.text',
			titleType: 'h4',
			headlineAttributes: {
				"id": "availability-modal"
			},
			close: true,
			back: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			},
			requireArrow: true
		};

		const paragraphGroup = [{

			class: 'a-product__paragraphClickAndCollectSelected m-0'
		}];

		const overflowStyle = {
			overflowX: 'hidden',
			overflowY: 'auto'
		}

		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} modalProductDetails={this.props.modalProductDetails} fromCollection={this.props.fromCollection} modalToOpen="showModal3" ModalpopUp={this.props.ModalpopUp} />
				<div className="modal-body" style={isMobile ? overflowStyle : {}}>
					<div className="row">
						<div className="col-12 m-0 mb-3">
							<Paragraph className="a-product__paragraphClickAndCollectCity m-0">{staticLabels && staticLabels['pdpPage.availability.ITR.state.label'] || 'pdpPage.availability.ITR.state.label'}</Paragraph>
							<parentContext.Consumer>{({ SelectedModelData }) => (
								!isEmpty(paragraphGroup) && map(paragraphGroup, (para, index) => {

									return <ParagraphGroup key={index} blockclass={para.class} text={SelectedModelData} />
								}))
							}</parentContext.Consumer>

						</div>
					</div>
					<div className="row availabilityTabs">
						<div className="col">
							<ProductSpecDetail widthClass="" childClass="m-click-and-collect-modal-select-tab pt-3">
								<div label="Todas las tiendas">
									{this.state.allStores.length > 0 ? <parentContext.Consumer>{({ closeModal, showModal }) => {
										return (
											showModal ? <ClickAndCollectAvailability data={this.state.allStores} handleStoreChange={(e) => this.getEdd(e, closeModal)} /> : null
										)
									}
									}</parentContext.Consumer> :
										// (this.state.ErrMessage != "" && this.state.ErrMessage)
										<p className="a-product__paragraphClickAndCollectNotAvailable">{this.state.allStoreErrMessage}</p>
									}
								</div>
								<div label="Con disponibilidad">
									{this.state.availableStores.length > 0 ? <parentContext.Consumer>{({ closeModal }) => (
										<ClickAndCollectAvailability data={this.state.availableStores} handleStoreChange={(e) => this.getEdd(e, closeModal)} />
									)
									}</parentContext.Consumer> : <p className="a-product__paragraphClickAndCollectNotAvailable">{this.state.availStoreErrMessage}</p>}
								</div>
							</ProductSpecDetail>
							{/*<div className="mdc-tab-bar" role="tablist">
								<div className="mdc-tab-scroller">
									<div className="mdc-tab-scroller__scroll-area">
										<div className="mdc-tab-scroller__scroll-content">
											<Button className="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabIndex="0" data-open="stores">
												<Span className="mdc-tab__content">
													<Span className="mdc-tab__text-label">Todas las tiendas</Span>
												</Span>
												<Span className="mdc-tab-indicator mdc-tab-indicator--active">
													<Span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></Span>
												</Span>
												<Span className="mdc-tab__ripple"></Span>
											</Button>
											<Button className="mdc-tab" role="tab" aria-selected="true" tabIndex="0" data-open="available">
												<Span className="mdc-tab__content">
													<Span className="mdc-tab__text-label">Con disponibilidad</Span>
												</Span>
												<Span className="mdc-tab-indicator">
													<Span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></Span>
												</Span>
												<Span className="mdc-tab__ripple"></Span>
											</Button>
										</div>
									</div>
								</div>
							</div>*/}

							{/*<ClickAndCollectAvailability />*/}
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