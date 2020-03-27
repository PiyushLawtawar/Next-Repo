import React from 'react';
import ListScrollable from '../../molecules/ListScrollable/ListScrollable'
import Searchbar from '../../molecules/Searchbar/Searchbar'
import { H1 } from '../../atoms/HeadLines/Headlines'
import Paragraph from '../../atoms/Paragraph/Paragraph'
import InputSelect from '../../molecules/InputSelect/InputSelect';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

class AsideStoreLocator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeSelect: [],
      searchTerm: '',
      storeType: '',
      stateId: ''
    }
  }
  changeState = (e) => {
    const { getAllStores } = this.props;
    const { storeType } = this.state;
    var getId = this.getIdOnSelection.getId(); 
    this.setState({ stateId: getId });   
    let data = { 'stateId': getId };
    if(!isEmpty(storeType)) {
      data = { 'stateId': getId, 'storeType': storeType };
    }
    if(!isEmpty(getId)) {
      getAllStores(data);
    }
  }

  getStoreByType = (e) => {
    const { getAllStores, storeType } = this.props
    const { stateId } = this.state;
    const storeKey = this.getStoreKey.getId();
    this.setState({ storeType: storeKey });
    let data = { "storeType": storeKey };
    if(!isEmpty(stateId)) {
      data = { 'storeType': storeKey, 'stateId': stateId };
    }
    if(!isEmpty(storeKey)) {
      getAllStores(data);
    } 
  }

  onChangeSearchbar = (e) => {
    const { value } = e.target;
    this.setState({ searchTerm: value });
  }

  handleSubmit = () => {
    const { searchTerm } = this.state;
    const { getAllStores } = this.props;
    const data = {'storeName': searchTerm};
    if (!isEmpty(searchTerm)) {
      this.setState({ stateId: '', storeType: '' });
      getAllStores(data);
    }
}

  getStoreDetails = (storeId) => {
    const { getStoreDetails } = this.props;
    const data = { 'storeId': storeId };
    getStoreDetails(data);
  }

  onKeypress = (event) => {
    const code = event.keyCode || event.which;
    const { value } = event.target;
    if (code === 13) {
      const { getAllStores } = this.props;
      const data = {'storeName': value};
      if (!isEmpty(value)) {
        this.setState({ stateId: '', storeType: '' });
        getAllStores(data);
      }
    }
  }

  getDetailsByStoreName = (storeName) => {
    const { getAllStores } = this.props;
    const data = {'storeName': storeName};
    getAllStores(data, 'storeName');
  }

  render() {
    const { storeData, scrollableData } = this.props;
    const { stateId } = this.state;
    var storeType = this.props.storeType;
    var stateListData = this.props.stateList;
    var stateNameArray = [];
    for (var property1 in stateListData) {
      stateNameArray.push(stateListData[property1]);
    }

    var changedInput = {
      labelText: "Seleccione estado",
      labelId: 'select-state',
      selected: 'selectCardType',
      optionList: []
    };
    var changeKey = {};
    changedInput.optionList.push({ id: '', value: '' });
    for (var i = 0; i < stateNameArray.length; i++) {
      changeKey = {};
      changeKey.id = stateNameArray[i].stateId;
      changeKey.value = stateNameArray[i]['stateName'].toLowerCase() === 'distrito federal' ? 'CDMX/Zona Metropolitana': stateNameArray[i].stateName ;
      changeKey.selected = (stateId === stateNameArray[i].stateId) ? true : false;
      changedInput.optionList.push(changeKey);
    }    
    var obj = {}
    var arraycheck = {
      labelText: "Filtrar por tipo de tienda",
      labelId: 'select-state',
      selected: 'selectCardType',
      optionList: []
    }
    arraycheck.optionList.push({ id: '', value: '' });
    for (var property1 in storeType) {
      obj = {}
      obj.id = Object.entries(storeType[property1])[0][0]
      obj.value = Object.entries(storeType[property1])[0][1]
      obj.selected = (Object.entries(storeType[property1])[0][0] === this.state.storeType) ? true : false;
      arraycheck.optionList.push(obj);
    }

    return (

      <div className="o-storeLocator-aside d-none d-lg-block">
        <H1 headLineText="Busca un Liverpool, Centro comercial o Dutty free" headLineClass="a-storeLocator-aside__title" />
        <Searchbar searchTerm={this.state.searchTerm} onKeypress={this.onKeypress} placeholder="Buscar por nombre o estado" redirectToSearchPage={this.handleSubmit} onChangeSearchbar={this.onChangeSearchbar} searchclass="m-header__searchBar -storeLocator" />
        <InputSelect options={changedInput} handleChange={this.changeState} ref={getIdOnSelection => this.getIdOnSelection = getIdOnSelection} />
        <div className="mdc-select-helper-line">
          <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true"></Paragraph>
        </div>
        <InputSelect options={arraycheck} handleChange={this.getStoreByType} ref={getStoreKey => this.getStoreKey = getStoreKey} />
        <div className="mdc-select-helper-line">
          <Paragraph className="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent" aria-hidden="true"></Paragraph>
        </div>
        <ListScrollable scrollableItem={this.getStoreDetails} scrollableData={scrollableData} scrollableul="list-group m-list-ul-scrollable" scrollableli="list-group-item a-list-li-scrollable" />
      </div>
    );
  }
}
export default AsideStoreLocator;