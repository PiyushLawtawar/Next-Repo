import Searchbar from '../../molecules/Searchbar/Searchbar'
import StoreModalHeader from './StoreModalHeader';
import ListScrollable from '../../molecules/ListScrollable/ListScrollable'
import TriggerFilterBtn from '../../molecules/TriggerFilterBtn/TriggerFilterBtn';
import isEmpty from 'lodash/isEmpty';
import './StorelocatorFilter.styl';

const modalHeader = {
  title: 'Regresar',
  titleType: 'h4',
  back: true,
  headlineAttributes: {
    "id": "a-storeLocator-title__modal"
  },
  close: true,
  buttonClass: 'close a-eddBox__closeButton',
  buttonAttributes: {
    "type": "button",
    "data-dismiss": "modal",
    "aria-label": "Close"
  }
}

class StorelocatorFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  getDetailsByStoreName = (storeName) => {
    const { getAllStores } = this.props;
    const data = { 'storeName': storeName };
    this.closeModal();
    getAllStores(data, 'storeName');
  }

  handleSubmit = () => {
    const { getAllStores, searchTerm } = this.props;
    const data = { 'storeName': searchTerm };
    if (!isEmpty(searchTerm)) {
      getAllStores(data);
    }
  }

  closeModal = () => {
    const { closeModal } = this.props;
    closeModal('storeDetails');
  }

  goBack = () => {
    const { stateShown, closeModal } = this.props;
    if(!stateShown) {
      this.closeModal();
    } else {
      closeModal('showStateList');
    }
  }

  getStoreDetails = (storeId) => {
    const { getStoreDetails, openModal } = this.props;
    const data = { 'storeId': storeId };
    openModal('storeFullDetail');
    getStoreDetails(data);
  }

  render() {
    const { scrollableData, searchTerm, onChangeSearchbar, openModal } = this.props;
    return (
      <div className="o-product__modal modal modal-filters__storeLocator" id="filters-storeLocator" tabIndex="1" role="dialog" aria-labelledby="edd-modal">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <StoreModalHeader modalHeader={modalHeader} goBack={this.goBack} closeModal={this.closeModal} dataType="storeDetails" />
            <div className="modal-body">
              <div className="row">
                <div className="col-9">
                  <Searchbar placeholder="Buscar por nombre o estado" searchTerm={searchTerm} redirectToSearchPage={this.handleSubmit} onChangeSearchbar={onChangeSearchbar} inputClassName="form-control a-storeLocator-aside__search -stroreLocator-search__mobile" searchclass="m-header__searchBar -storeLocator" />
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <TriggerFilterBtn openModal={openModal} dataType="storeType" />
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0">
                  <ListScrollable scrollableItem={this.getStoreDetails} scrollableData={scrollableData} scrollableul="list-group m-list-ul-scrollable" scrollableli="list-group-item a-list-li-scrollable" scrollabletext="Liverpool Estado1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StorelocatorFilter;