import HeadFilter from '../HeadFilter/HeadFilter';
import FilterContainer from '../FilterContainer/FilterContainer';
//import './FilterSelection.styl';

export default (props) => (
    <div className="m-plp__filterApplied mt-4">
        <HeadFilter linkClassName={props.linkClassName} removeAllFilters={props.removeAllFilters}/> 
        <FilterContainer />
    </div>
)