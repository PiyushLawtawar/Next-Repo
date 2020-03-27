import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

export default (props) => {
    const { eventListMap, onChangeEvent } = props || {}
    return (
        <select className="mdc-select__native-control" id="select-gr__id" onChange={ (e) => onChangeEvent(e) }>
            <option value="Selecciona" disabled="disabled" selected="selected">Selecciona</option>
            { !isEmpty(eventListMap) && map(eventListMap, (item, index) => {
                return <option key={index} value={index}>{item}</option>
            })}
        </select>
    );
}

