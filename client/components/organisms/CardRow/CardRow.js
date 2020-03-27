import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

//import './CardRow.styl';
import {CardClp} from '../../molecules/Card/Card';

export default (props) => {
    const mainContentItems = props.mainContentItems;
    const onImgError = props.onImgError;
    const { parentIndex } = props || '0';
    
    return (

<div className="o-cards-row o-clp-cards-row mt-lg-4">
            {
                !isEmpty(mainContentItems) ? map(mainContentItems, (items, index) => {
                     return <CardClp domainName={props.domainName} cardDetails={items} key={index} index={`${parentIndex}_${index}`} onImgError={onImgError}/>
                }) : null
            }
            </div>
            
    );
}
