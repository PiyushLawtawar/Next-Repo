import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
//import './Dropdown.styl';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';
import Button from '../../atoms/Button/Button';
import Ul from '../../atoms/Ul/Ul';

import DropdownToggle from '../DropdownToggle/DropdownToggle';

export default (props) => { 

  const { dropdownText, dropdownTextDesktop, menuID, typeOf, classNameIconExtra, dropdownData, dropdownMenu, onDropdownToggle, onSortSelect, sortSelected, resolution } = props.dropdownDetails;
  const forDesktop = props.forDesktop || '';
  return (
            (resolution == 'desktop' || forDesktop === "true") ?
              <div className="m-dropdown">
                  <div className="dropdown">
                      <DropdownToggle dropdownText={dropdownTextDesktop} menuID={menuID} classNameAnchor="btn dropdown-toggle sortBy" classNameIcon={"icon-arrow_down " + classNameIconExtra} onDropdownToggle={onDropdownToggle} sortSelected={sortSelected} />
                      <div className={"dropdown-menu" + ((dropdownMenu)?" show":"")} aria-labelledby={menuID}>
                          {
                              map(dropdownData, (item, index) => { 
                                  return (typeOf == "buttons") ?
                                            <Button id={item.id} key={index} type="button" className="dropdown-item" datahref={'/tienda' + item.navigationState} handleClick={() => onSortSelect(item.label, item.navigationState,item.id)}>{item.label}</Button>
                                            :
                                                (typeOf == "text") ?
                                                <Link key={index} href={'/tienda' + item.navigationState} className="dropdown-item">{item.label}</Link>
                                                : 
                                                null
                              })
                          }
                      </div>
                  </div>
              </div>
              :
               <div className="m-dropdown__mobile">
                  <div className="dropdown">
                      <DropdownToggle dropdownText={dropdownText} menuID={menuID} classNameAnchor="btn dropdown-toggle sortBy" classNameIcon="icon-arrow_down" onDropdownToggle={onDropdownToggle} sortSelected={sortSelected} />
                      <div className={"dropdown-menu" + ((dropdownMenu)?" show":"")} aria-labelledby={menuID}>
                          {
                              map(dropdownData, (item, index) => {
                                  return (typeOf == "buttons") ?
                                            <Button key={index} type="button" className="dropdown-item" datahref={'/tienda' + item.navigationState} handleClick={() => onSortSelect(item.label, item.navigationState)}>{item.label}</Button>
                                            :
                                                (typeOf == "text") ?
                                                <Link key={index} href={'/tienda' + item.navigationState} className="dropdown-item">{item.label}</Link>
                                                : 
                                                null
                              })
                          }
                      </div>
                  </div>
              </div>
  );
}
