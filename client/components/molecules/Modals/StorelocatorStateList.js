import StoreModalHeader from './StoreModalHeader';
import ListScrollable from '../../molecules/ListScrollable/ListScrollable';
import map from 'lodash/map';
import './StorelocatorFilter.styl'

const modalHeader = {
	title: 'Selecciona tu estado',
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

class StorelocatorStateList extends React.Component {
	constructor(props) {
		super(props);
	}
	closeModal = (dataType='closeStateListWithoutMapData') => {
		const { closeModal } = this.props;
		closeModal(dataType);
	}

	selectedItem = (stateId) => {
		const { getAllStores } = this.props;
		const data = { "stateId": stateId };
		this.closeModal('stateList');
		getAllStores(data);	
	}

	render() {
        const { stateList } = this.props;
		return (
			<div className="o-product__modal modal modal-filters__storeLocator" id="filters-storeLocator-categories" tabIndex="1" role="dialog" aria-labelledby="edd-modal">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<StoreModalHeader notRequireArrow={true} modalHeader={modalHeader} closeModal={this.closeModal} dataType="stateList" />
						<div className="modal-body">
							<div className="row">
								<div className="col-12 p-0">
									<ListScrollable scrollableItem={this.selectedItem} scrollableData={stateList} dataType="stateList" scrollableul="list-group m-list-ul-scrollable" scrollableli="list-group-item a-list-li-scrollable" scrollabletext="Liverpool Estado1" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StorelocatorStateList;