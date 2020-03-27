//import './ListScrollable.styl'
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import map from 'lodash/map';


export default (props) => {
  const { scrollableData, scrollableItem, dataType, getAllStores } = props;
  return (
    <div className="m-list-scrollable">
      <Ul className={props.scrollableul}>
        {
          dataType === 'storeType' &&
          <List className={props.scrollableli + ' active'} onClick={getAllStores}>Seleccionar una opción</List>
        }
        {
          dataType === 'storeType' &&
          map(scrollableData, (store, index) => {
            return <List key={index} onClick={() => scrollableItem(store.code)} className={props.scrollableli}>{store.type}</List>
          })
        }
        {
          dataType === 'stateList' &&
          map(scrollableData, (state, index) => {
            return <List key={index} onClick={() => scrollableItem(state.stateId)} className={props.scrollableli}>{state.stateName}</List>
          })
        }
        {
          dataType !== 'storeType' &&
          map(scrollableData, (store, index) => {
            return <List key={index} onClick={() => scrollableItem(store.storeId)} className={props.scrollableli}>{store.name}</List>
          })
        }
      </Ul>
    </div>

  );
}

