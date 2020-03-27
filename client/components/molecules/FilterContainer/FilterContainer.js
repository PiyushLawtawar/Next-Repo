import FilterSelected from '../FilterSelected/FilterSelected';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
export default (props) => (
    <div className="plp-filters-container mt-3">
         {
            !isEmpty(props.filterLables) && map(props.filterLables, (item, index) => {
                   return <FilterSelected key={index} handleButton={props.handleButton} item={item}/>
            })
         }

    </div>
)