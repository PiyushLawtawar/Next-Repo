import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Link from '../../atoms/Link/Link';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { parentContext } from '../../../contexts/parentContext';


export default (props) => {
    const arrayStates = props.stateList || [];
    
    return (
        <div className="m-product__itrSelectStates">
            <div className="row">
                <div className="col-12 mt-3 mb-2">
                    <Paragraph className="a-product__paragraphitrSelectStates m-0">Selecciona un estado</Paragraph>
                </div>
            </div>
            <div className="row m-0">
                <div className="col-12 p-0" style={{padding:"0px !important"}}>
                    {!isEmpty(arrayStates) && map(arrayStates, (state, index) => {
                        if(state.stateName ==='DISTRITO FEDERAL'){
                            return <parentContext.Consumer key={index}>
                            {({ OpenModal,updateSelectedState, updateCollProductId }) => (<Link key={index} className="a-product__anchorSelectState" href="#" data-toggle="modal" data-target="#availability-modal" onClick={() => {OpenModal('showAvailabilityItr', 'showModal2');updateSelectedState(state.stateName); updateCollProductId(props.modalProductDetails)}}>{"CDMX/ZONA METROPOLITANA"}</Link>
                            )}
                                </parentContext.Consumer>
                        }else{

                        }
                        return <parentContext.Consumer key={index}>
                            {({ OpenModal,updateSelectedState, updateCollProductId }) => (<Link key={index} className="a-product__anchorSelectState" href="#" data-toggle="modal" data-target="#availability-modal" onClick={() => {OpenModal('showAvailabilityItr', 'showModal2');updateSelectedState(state.stateName); updateCollProductId(props.modalProductDetails)}}>{state.stateName}</Link>
                            )}
                        </parentContext.Consumer>
                        {/*return <Link key={index} className="a-product__anchorSelectState" href="#" data-toggle="modal" data-target="#availability-modal-itr">{state.stateName}</Link>*/ }
                    })}
                    {props.ErrMessage != "" && props.ErrMessage}
                </div>
            </div>
        </div>
    );
}


