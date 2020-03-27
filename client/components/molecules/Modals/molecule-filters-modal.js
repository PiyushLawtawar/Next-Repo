import { H6 } from '../../atoms/HeadLines/Headlines';
import Button from "../../atoms/Button/Button";
import { parentContext } from '../../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Modal from '../../../helpers/modal/modal';
import get from 'lodash/get';
// import './molecule-filters-modal.styl';

export default (props) => {

   const { filterLables, navigations, refinementAncestors, filterIds, minPriceFilter, maxPriceFilter, totalNumRecords, removeAllFilters, searchTerm, navCategoryInfo, departmentoId, showDynamicFacetOptions, departmentoFilterChanged } = props;
   const isButtonEnabled = !isEmpty(searchTerm) ? filterIds.length > 0 ? true : false : filterIds.length > 1 ? true : false;
   let navData = {};
   !isEmpty(navigations) && map(navigations, (item) => {
      const dimensionName = item.dimensionName || '';
      if (dimensionName == 'product.category') {
         navData = item;
      }
   })
   let childCategories = [];
   map(navigations, (nav) => {
      if (nav.dimensionName === 'product.category') {
         childCategories = nav.childCategories;
      }
   });
   let lastAncestorId = null;
   let navLength = navData.refinements && navData.refinements.length || 0;
   const refinementsList = navData.refinements || [];
   const departmentoData = [];
   const ancestors = get(navData, 'ancestors', []);
   if (!isEmpty(ancestors) && ancestors.length > 0) {
      map(ancestors, (item) => {
         departmentoData.push({ 'categoryName': item.label, 'viewAllUrl': item['navigationState'], 'categoryId': item['properties']['category.repositoryId'] });
      })
   } else if (!isEmpty(refinementAncestors) && refinementAncestors.length > 0) { // take from refinement ancestors
      map(refinementAncestors, (item) => {
         departmentoData.push({ 'categoryName': item.label, 'viewAllUrl': item['navigationState'], 'categoryId': item['properties']['category.repositoryId'] });
      })
      const ancestorsLen = refinementAncestors.length;
      lastAncestorId = departmentoData[ancestorsLen - 1].categoryId;
   }

   if (departmentoData.length === 0 && Array.isArray(refinementsList) && refinementsList.length > 0) {
      map(refinementsList, (item) => {
         departmentoData.push({ 'categoryName': item.label, 'viewAllUrl': item['navigationState'], 'categoryId': item['properties']['category.repositoryId'] });
      })
   } else {
      if (!isEmpty(departmentoData)) {
         const ancestorsLen = ancestors.length;
         if (Array.isArray(refinementsList) && refinementsList.length > 0) {
            departmentoData[ancestorsLen - 1].children = refinementsList;
         } else {
            if (lastAncestorId && Array.isArray(childCategories) && childCategories.length > 0) {
               let mainChildren = [];

               map(childCategories, (child) => {
                  if (child && child.children && child.children.length > 0 && child.viewAllUrl.indexOf(lastAncestorId) > -1) {
                     mainChildren = child.children;
                  } else {
                     map(child.children, (innerChild) => {
                        if (innerChild && innerChild.children && innerChild.children.length > 0 && innerChild.viewAllUrl.indexOf(lastAncestorId) > -1) {
                           mainChildren = innerChild.children;
                        }
                     })
                  }
               })
               if (mainChildren.length == 0) {
                  mainChildren = childCategories;
               }
               let refinementListObject = [];
               let categoryId = '';
               map(mainChildren, (cItem) => {
                  var array = cItem.viewAllUrl.split("/");
                  categoryId = (array && array.length) >= 2 ? array[2] : '';
                  refinementListObject.push({ 'label': cItem.categoryName, 'navigationState': cItem.viewAllUrl, 'properties': { 'category.repositoryId': categoryId }, 'noShowPLP': true });
               })
               navLength = refinementListObject.length;
               departmentoData[refinementAncestors.length - 1].children = refinementListObject;
            }
         }
      }
   }

   const filtrarButtonEnabled = !isEmpty(searchTerm) ? (filterIds.length > 0 || (departmentoData.length > 0 && departmentoFilterChanged)) ? true : false : (filterIds.length > 1 || (departmentoData.length > 0 && departmentoFilterChanged)) ? true : false;

   return (
      <Modal showModalpopUp="showModal13">
         <div className="modal-header">
            <H6 headLineText={`${totalNumRecords} artículos`} className="modal-title"></H6>
            {/* <Button handleClick={() => closeModal('showModal13')} ripple="ripple" data-dismiss="modal" aria-label="Close" > */}
            <Button handleClick={(e) => removeAllFilters(e)} ripple="ripple" data-dismiss="modal" aria-label="Close" >
               <span className={isButtonEnabled ? 'a-btn__clean' : 'a-btn__clean -btn__cleanDisabled'}>Limpiar Filtros</span>
            </Button>
         </div>

         <div className="modal-body">
            <div className="container-fluid">
               <div className="row">
                  <div className="accordion pb-5" id="modal-filters">
                     {
                        !isEmpty(departmentoId) && navLength > 0 &&
                        <div className="card">
                           <div className="card-header" id="department-filter-title" onClick={(e) => props.handleOptions(e, 'departmento', 'wap')}>
                              <div className="mb-0">
                                 <a className="btn btn-link" onClick={(e) => e.preventDefault()} href="#" aria-expanded="false" >Departamento<i className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf('departmento') !== -1 ? 'icon-arrow_up' : 'icon-arrow_down'}></i></a>
                              </div>
                              <span className="a-filter-selection">Cualquier departamento</span>
                           </div>
                           <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf('departmento') !== -1 ? 'collapse show-accord' : 'collapse hide-accord'} id="department-filter" aria-labelledby="department-filter-title" data-parent="#modal-filters">
                              <div className="card-body">
                                 {
                                    !isEmpty(departmentoData) && map(departmentoData, (item, index) => {
                                       return <React.Fragment>
                                          <div className="m-radioButton mdc-form-field">
                                             <label for={`checkboxDep---level${index + 1}`}>{item.categoryName}</label>
                                             <div className="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded">
                                                <input className="a-radio__input mdc-radio__native-control" onClick={(e) => props.handleDepartmento(e, item.categoryId, item.categoryName, (index >= 3))} checked={(item.categoryId === departmentoId.categoryId) ? true : false} type="radio" name={`departmentLevel`} id={`checkboxDep--${index + 1}-level${index + 1}`} />
                                                <div className="mdc-radio__background">
                                                   <div className="mdc-radio__outer-circle"></div>
                                                   <div className="mdc-radio__inner-circle"></div>
                                                </div>
                                             </div>
                                          </div>
                                          {
                                             item.children && item.children.length > 0 &&
                                             <div className="row pr-3 filter-subLevels" id={`sublevel${index + 1}`} >
                                                {
                                                   item.children && item.children.length > 0 && map(item.children, (subItem, subIndex) => {
                                                      return <div className="m-radioButton mdc-form-field">
                                                         <label for={`checkboxDep--${index + 1}-level${index + 1}_${index + 1}`}>{subItem.label}</label>
                                                         <div className="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" >
                                                            <input className="a-radio__input mdc-radio__native-control" onClick={(e) => props.handleDepartmento(e, subItem.properties['category.repositoryId'], subItem.label, (index >= 3))} checked={subItem.properties['category.repositoryId'] === departmentoId.categoryId ? true : false} type="radio" name={`departmentLevel`} id={`checkboxDep--${index + 1}-level${index + 1}_${index + 1}`} />
                                                            <div className="mdc-radio__background">
                                                               <div className="mdc-radio__outer-circle"></div>
                                                               <div className="mdc-radio__inner-circle"></div>
                                                            </div>
                                                         </div>
                                                      </div>
                                                      // }
                                                   })
                                                }
                                             </div>
                                          }
                                       </React.Fragment>
                                    })
                                 }

                              </div>
                           </div>
                        </div>
                     }
                     {
                        !isEmpty(navigations) && map(navigations, (navigationItem, index) => {
                           if ((navigationItem.dimensionName === "sku.normalizedColor" || navigationItem.dimensionName === "sku.color") && navigationItem.refinements && navigationItem.refinements.length > 0) {
                              return <div className="card" key={index}>
                                 <div className="card-header" id={`${navigationItem.name}-brands-filter-title`} onClick={(e) => props.handleOptions(e, navigationItem.dimensionName, 'wap')}>
                                    <div className="mb-0">
                                       <button className="btn btn-link" ripple="ripple" type="button" data-target={`#${navigationItem.name}-brands-filter-title`} aria-expanded="false" aria-controls={`${navigationItem.name}-brands-filter-title`}>{navigationItem.name}
                                          <i className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'icon-arrow_up' : 'icon-arrow_down'}></i>
                                       </button>
                                    </div>
                                    {getDynamicFacetLabel(showDynamicFacetOptions, filterLables, navigationItem.dimensionName)}
                                 </div>
                                 <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'collapse show-accord' : 'collapse hide-accord'} id={`${navigationItem.name}-brands-filter`} aria-labelledby="brands-filter-title" data-parent="#modal-filters">
                                    <div className="card-body">
                                       {
                                          !isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                             // if(item.count > 1) {
                                             const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                             return <div className="m-checkbox__button mdc-form-field" key={i}>
                                                <div className="a-productColor__item a-product__color a-filterColor__modal" style={{ backgroundColor: item.properties.colorHexaCodeValue }}>
                                                   <span className="atom-color"></span>
                                                </div>
                                                <label htmlFor={`mobile-${item.properties.dimensionValueId}`}>{`${item.label} (${item.count})`}</label>
                                                <div className="m-checkbox mdc-checkbox">
                                                   <input className="a-checkbox__input mdc-checkbox__native-control" type="checkbox" checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} id={`mobile-${item.properties.dimensionValueId}`} onClick={props.handleCheckboxWap.bind(this, itemObj)} />
                                                   <div className="mdc-checkbox__background">
                                                      <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                                         <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                                      </svg>
                                                      <div className="mdc-checkbox__mixedmark"></div>
                                                   </div>
                                                </div>
                                             </div>
                                             // }
                                          })
                                       }
                                    </div>
                                 </div>
                              </div>
                           }
                           else if (navigationItem.dimensionName === "Rating" && navigationItem.refinements && navigationItem.refinements.length > 0) {
                              return <div className="card" key={index}>
                                 <div className="card-header" id={`${navigationItem.name}-brands-filter-title`} onClick={(e) => props.handleOptions(e, navigationItem.dimensionName, 'wap')}>
                                    <div className="mb-0">
                                       <button className="btn btn-link" ripple="ripple" type="button" data-target={`#${navigationItem.name}-brands-filter-title`} aria-expanded="false" aria-controls={`${navigationItem.name}-brands-filter-title`}>{navigationItem.name}
                                          <i className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'icon-arrow_up' : 'icon-arrow_down'}></i>
                                       </button>
                                    </div>
                                    {getDynamicFacetLabel(showDynamicFacetOptions, filterLables, navigationItem.dimensionName)}
                                 </div>
                                 <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'collapse show-accord' : 'collapse hide-accord'} id={`${navigationItem.name}-brands-filter`} aria-labelledby="brands-filter-title" data-parent="#modal-filters">
                                    <div className="card-body">
                                       {
                                          !isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                             // if(item.count > 1) {
                                             const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                             return <div className="m-checkbox__button mdc-form-field" key={i}>
                                                <label htmlFor={`mobile-${item.properties.dimensionValueId}`}>
                                                   <div className="m-ratings">
                                                      <ul>
                                                         {
                                                            [...Array(Number(item.label)).keys()].map((starIndex) => {
                                                               return <li key={starIndex}><i className="icon-star_large"></i></li>
                                                            })
                                                         }
                                                         <li className="ratings-number">{` (${item.count})`}</li>
                                                      </ul>
                                                   </div>
                                                </label>
                                                <div className="m-checkbox mdc-checkbox">
                                                   <input className="a-checkbox__input mdc-checkbox__native-control" checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} type="checkbox" id={`mobile-${item.properties.dimensionValueId}`} onClick={props.handleCheckboxWap.bind(this, itemObj)} />
                                                   <div className="mdc-checkbox__background">
                                                      <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                                         <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                                      </svg>
                                                      <div className="mdc-checkbox__mixedmark"></div>
                                                   </div>
                                                </div>
                                             </div>
                                             // }
                                          })
                                       }
                                    </div>
                                 </div>
                              </div>
                           } else { //defect fix 24265
                              if(navigationItem.refinements && navigationItem.refinements.length > 0 && navigationItem.dimensionName !== 'product.category') {
                                 return <div className="card" key={index}>
                                    <div className="card-header" id={`${navigationItem.name}-brands-filter-title`} onClick={(e) => props.handleOptions(e, navigationItem.dimensionName, 'wap')}>
                                       <div className="mb-0">
                                          <button className="btn btn-link" ripple="ripple" type="button" data-target={`#${navigationItem.name}-brands-filter-title`} aria-expanded="false" aria-controls={`${navigationItem.name}-brands-filter-title`}>{navigationItem.name}
                                             <i className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'icon-arrow_up' : 'icon-arrow_down'}></i>
                                          </button>
                                       </div>
                                       {getDynamicFacetLabel(showDynamicFacetOptions, filterLables, navigationItem.dimensionName)}
                                    </div>
                                    <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'collapse show-accord' : 'collapse hide-accord'} id={`${navigationItem.name}-brands-filter`} aria-labelledby="brands-filter-title" data-parent="#modal-filters">
                                       <div className="card-body">
                                          {
                                             !isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                                // if(item.count > 1) {
                                                const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                                return <div className="m-checkbox__button mdc-form-field" key={i}>
                                                   <label htmlFor={`mobile-${item.properties.dimensionValueId}`}>{`${item.label} (${item.count})`}</label>
                                                   <div className="m-checkbox mdc-checkbox">
                                                      <input className="a-checkbox__input mdc-checkbox__native-control" checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} type="checkbox" id={`mobile-${item.properties.dimensionValueId}`} onClick={props.handleCheckboxWap.bind(this, itemObj)} />
                                                      <div className="mdc-checkbox__background">
                                                         <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                                            <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                                         </svg>
                                                         <div className="mdc-checkbox__mixedmark"></div>
                                                      </div>
                                                   </div>
                                                </div>
                                                // }
                                             })
                                          }
                                       </div>
                                    </div>
                                 </div>
                              }
                           }
                        })
                     }
                  </div>
               </div>
               <parentContext.Consumer>
                  {({ closeModal }) => (
                     <div className="row m-filters__applied">
                        <div className="col d-flex align-items-center" >
                           <button className={filtrarButtonEnabled ? 'mdc-button a-btn__primary' : 'mdc-button a-btn__primary -mdc_disabled'} onClick={() => closeModal('showModal13')} ripple="ripple" type="button"><span className="mdc-button__label">Filtrar</span>
                           </button>
                        </div>
                     </div>
                  )}
               </parentContext.Consumer>
            </div>
         </div>
      </Modal>
   );
}

const getDynamicFacetLabel = (labelArr, filterLables, dimensionName) => {
   let label = '';
   if (labelArr.indexOf(dimensionName) === -1) {
      !isEmpty(filterLables) && map(filterLables, (item, index) => {
         if (dimensionName === item.dimensionName) {
            label = label + ' ' + item.label + ',';
         }
      })
      if (!isEmpty(label)) {
         label = label.slice(0, -1);
         return <label className="a-filter-selection filter-applied">{label}</label>;
      }
   }
   return label;
}
