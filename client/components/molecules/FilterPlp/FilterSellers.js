import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';

export default (props) => {
    const {filterIds} = props;
    const refinements = props.options || [];
    return (
        !isEmpty(refinements) && map(refinements, (item, index) => {
            let url = item.navigationState;
            if(item.count > 1) {
                return <MaterialInputCheckBox key={index} onChange={props.handleCheckbox.bind(this, item.properties.dimensionValueId, item.label, props.dimensionName, item.count)} checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} text={`${item.label} (${item.count})`} id={item.properties.dimensionValueId} {...props}/>
            }
        })
    );
}
