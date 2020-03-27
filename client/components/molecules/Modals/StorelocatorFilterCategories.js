import Searchbar from '../../molecules/Searchbar/Searchbar'
import StoreModalHeader from './StoreModalHeader';
import ListScrollable from '../../molecules/ListScrollable/ListScrollable';
import map from 'lodash/map';
import './StorelocatorFilter.styl'

const modalHeader = {
	title: 'Regresar',
	titleType: 'h4',
	back: true,
	headlineAttributes: {
		"id": "a-storeLocator-title__modal_cat"
	},
	close: true,
	buttonClass: 'close a-eddBox__closeButton',
	buttonAttributes: {
		"type": "button",
		"data-dismiss": "modal",
		"aria-label": "Close"
	}
}

class StorelocatorFilterCategories extends React.Component {
	constructor(props) {
		super(props);
	}
	closeModal = () => {
		const { closeModal } = this.props;
		closeModal('storeType');
	}

	selectedItem = (code) => {
		const { getAllStores } = this.props;
		const data = { "storeType": code };
		this.closeModal();
		getAllStores(data);	
	}

	getAllStores = () => {
		const { getAllStores } = this.props;
		const data = {};
		this.closeModal();
		getAllStores(data);	
	}

	render() {
		const { storeType } = this.props;
		const arr = [];
		map(storeType, (store) => {
			for (let key in store) {
				arr.push({ 'code': key, 'type': store[key] });
			}
		})
		return (
			<div className="o-product__modal modal modal-filters__storeLocator" id="filters-storeLocator-categories" tabIndex="1" role="dialog" aria-labelledby="edd-modal">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<StoreModalHeader modalHeader={modalHeader} goBack={this.closeModal} closeModal={this.closeModal} dataType="storeType" />
						<div className="modal-body">
							<div className="row">
								<div className="col-12 p-0">
									<ListScrollable getAllStores={this.getAllStores} scrollableItem={this.selectedItem} scrollableData={arr} dataType="storeType" scrollableul="list-group m-list-ul-scrollable" scrollableli="list-group-item a-list-li-scrollable" scrollabletext="Liverpool Estado1" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StorelocatorFilterCategories;