import Dropdown from '../../molecules/Dropdown/Dropdown';
import TriggerViewPLP from '../../molecules/TriggerViewPLP/TriggerViewPLP';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
//import './NavPlp.styl';
import MobileFilters from '../../molecules/Modals/molecule-filters-modal';
import { parentContext } from '../../../contexts/parentContext';

import Link from '../../atoms/Link/Link';

export default (props) => {

    const { dropdownDetails, viewModeDetails } = props.navData;

    return (
        <parentContext.Consumer>

            {({ OpenModal }) => (
                <div className="row d-flex d-lg-none o-container-shadow align-items-center pt-2">
                    <div className="col-4">
                        <Dropdown dropdownDetails={dropdownDetails} />
                    </div>
                    <div className="col-4">
                        <TriggerViewPLP plpListView={props.plpListView} viewModeDetails={viewModeDetails}/>
                    </div>
                    <div className="col-4">
                        <Link onClick={() => OpenModal('showModal13')} href="#" className="a-btn__filters">Filtrar<i className="icon-filtro"></i></Link>
                        <MobileFilters {...props} />
                    </div>
                    <div className="row">
                        <div className="col m-filters__selected">
                     { 
                        !isEmpty(props.filterLables) && map(props.filterLables, (item, index) => {
                           return( <div key={index} className="mdc-chip-set" tabIndex="0" onClick={props.handleButton.bind(this, item)}>
                                <div className="mdc-chip a-plp__filterSelection">
                                    <div className="mdc-chip__text">{item.label}<i className="icon-close"></i>
                                    </div>
                                </div>
                            </div>
                           )
                        })
                     }
                        </div>
                    </div>
                </div>
            )}
        </parentContext.Consumer>
    );
}
