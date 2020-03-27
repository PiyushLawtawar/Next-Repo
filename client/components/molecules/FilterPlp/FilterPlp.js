import FilterTrigger from '../FilterTrigger/FilterTrigger';
import Input from '../../atoms/Input/Input';
import map from 'lodash/map';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';
import Link from '../../atoms/Link/Link';
import isEmpty from 'lodash/isEmpty';
//import './FilterPlp.styl';
import FilterContainer from '../FilterContainer/FilterContainer';
import FilterSellers from './FilterSellers';
// import ReactTooltip from 'react-tooltip'
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';

const FilterPlp = (props) => {
  const { filterLables, navigations, filterIds, minPriceFilter, maxPriceFilter, handleButton, removeAllFilters, minTallaCount, showTallaViewMore, maxPrice, minPrice, minTxtBox, maxTxtBox, minMarcasCount, showMarcasViewMore, handleMarcasViewMoreLink, showPriceErrorAlert, showDynamicFacetOptions } = props;
  let haveSelectedPriceRange = false;
  return (
    <React.Fragment>
      <div className="m-plp__filterApplied mt-4">
        <FilterContainer filterLables={filterLables} handleButton={handleButton} removeAllFilters={removeAllFilters} />
      </div>
      {
        !isEmpty(navigations) && map(navigations, (navigationItem, index) => {
          return (
            <div className="m-plp__filterSection" key={index}>

              {
                ((navigationItem.dimensionName === "sku.normalizedColor" || navigationItem.dimensionName === "sku.color") && navigationItem.refinements && navigationItem.refinements.length > 0) ?
                  <React.Fragment>
                    <FilterTrigger text={navigationItem.name} handleArrowIcon={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? false : true} handleClick={(e) => props.handleOptions(e, navigationItem.dimensionName)} />
                    <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'plp-filter-options' : 'plp-filter-options active'}>
                      <ul className="a-plp-color">

                        {
                          !isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                            if (item.properties.colorHexaCodeValue) {
                              const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                              return (
                                <li>
                                  <a key={i} className="a-productColor__item a-product__color atom-color" id={item.properties.dimensionValueId} onClick={props.handleButton.bind(this, itemObj)} data-color={item.properties.colorHexaCodeValue} title="" style={{ backgroundColor: item.properties.colorHexaCodeValue }} key={i} ></a>
                                  <CustomTooltip
                                    tooltipFor={item.properties.dimensionValueId}
                                    trigger="hover"
                                    content={item.label}
                                    position="top"
                                    arrowSize="6px"
                                    borderSize="1px"
                                    borderRadius="4px"
                                    contentPadding="5px 10px"
                                    backgroundColor="#666666"
                                    textColor="#d8d8d8"
                                    fontSize="10px"
                                    boxClass="customBoxSizing">
                                  </CustomTooltip>
                                </li>
                              )
                            }
                          })
                        }
                      </ul>
                    </div>
                  </React.Fragment>
                  :
                  ((navigationItem.dimensionName === "sku.normalizedSize" || navigationItem.dimensionName === "sku.size") && navigationItem.refinements && navigationItem.refinements.length > 0) ?
                    <React.Fragment>
                      <FilterTrigger text={navigationItem.name} handleArrowIcon={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? false : true} handleClick={(e) => props.handleOptions(e, navigationItem.dimensionName)} />
                      <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'plp-filter-options' : 'plp-filter-options active'}>
                        <ul>
                          {
                            !isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                              const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                              const len = navigationItem.refinements.length;
                              let showLength = minTallaCount - 1;
                              if (len > showLength && !showTallaViewMore) {
                                showLength = len;
                              }
                              // if(item.count > 1) {
                              if (i <= showLength) {
                                return (
                                  <li className={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? "a-product__sizeActive" : "a-product__size"} key={i} id={item.properties.dimensionValueId} onClick={props.handleButton.bind(this, itemObj)} >
                                    <Button className="mdc-chip o-plp__button">{item.label}</Button>
                                    {/* 23436 START */}
                                    <CustomTooltip
                                      tooltipFor={item.properties.dimensionValueId}
                                      trigger="hover"
                                      content={item.count}
                                      position="top"
                                      borderRadius = "4px"
                                      arrowSize="6px"
                                      borderSize="1px"
                                      contentPadding="5px 10px"
                                      backgroundColor = "#666666"
                                      textColor = "#d8d8d8"
                                      fontSize = "10px"
                                      boxClass="customBoxSizing">
                                    </CustomTooltip>
                                    {
                                      /* 23436 END */ }
                                  </li>
                                )
                              }
                              // }
                            })
                          }
                        </ul>
                        {
                          (navigationItem.refinements && navigationItem.refinements.length > minTallaCount && showTallaViewMore) &&
                          <Link className='a-link__viewMore' href="#" onClick={props.handleTallaViewMoreLink}>Ver más</Link>

                        }
                        {
                          (navigationItem.refinements && navigationItem.refinements.length > minTallaCount && !showTallaViewMore) &&
                          <Link className='a-link__viewMore' href="#" onClick={props.handleTallaViewMoreLink}>Ver menos</Link>

                        }
                      </div>
                    </React.Fragment>
                    : (navigationItem.dimensionName === "product.brand" && navigationItem.refinements && navigationItem.refinements.length > 0) ?
                      <React.Fragment>
                        <FilterTrigger text={navigationItem.name} handleArrowIcon={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? false : true} handleClick={(e) => props.handleOptions(e, navigationItem.dimensionName)} />
                        <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'plp-filter-options' : 'plp-filter-options active'}>

                          <div className="form-group">
                            <Input className="form-control a-search-filter" id="search-filter-brands" type="text" aria-describedby="searchBrands" placeholder="Búsqueda rápida" onChange={props.onChangeMarcas} value={props.userInput} />
                          </div>
                          <div class="filter-brands">
                            {
                              !isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                const len = navigationItem.refinements.length;
                                let showLength = minMarcasCount - 1;
                                if (len > showLength && !showMarcasViewMore) {
                                  showLength = len;
                                }
                                let userInput = props.userInput;
                                userInput = userInput.trim().toLowerCase();
                                const itemLabel = item.label.trim().toLowerCase();
                                if (itemLabel.indexOf(userInput) === 0) {
                                  if (i <= showLength) {
                                    return (

                                      <div className="m-checkbox__button mdc-form-field" key={i}>
                                        <div className="m-checkbox mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded">
                                          <Input className="a-checkbox__input mdc-checkbox__native-control" type="checkbox" id={item.properties.dimensionValueId} checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} onClick={props.handleCheckbox.bind(this, itemObj)} />
                                          <div className="mdc-checkbox__background">
                                            <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                              <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                            </svg>
                                          </div>
                                        </div>

                                        <Label for={item.properties.dimensionValueId}>{item.label} ({item.count})</Label>
                                      </div>
                                    )
                                  }
                                }
                              })
                            }
                          </div>
                          {
                            (navigationItem.refinements && navigationItem.refinements.length > minMarcasCount && showMarcasViewMore) &&
                            <Link className="a-link__viewMore" href="#" onClick={handleMarcasViewMoreLink}>Ver más</Link>

                          }
                          {
                            (navigationItem.refinements && navigationItem.refinements.length > minMarcasCount && !showMarcasViewMore) &&
                            <Link className="a-link__viewMore" href="#" onClick={handleMarcasViewMoreLink}>Ver menos</Link>

                          }


                        </div>
                      </React.Fragment>
                      : (navigationItem.dimensionName === "Price" && navigationItem.refinements && navigationItem.refinements.length > 0) ?
                        <React.Fragment>
                          <FilterTrigger text={navigationItem.name} handleArrowIcon={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? false : true} handleClick={(e) => props.handleOptions(e, navigationItem.dimensionName)} />
                          <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'plp-filter-options' : 'plp-filter-options active'}>
                            <div class="fiterl-prices">
                              {!isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                // if(item.count > 1) {
                                const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                if (filterIds.indexOf(item.properties.dimensionValueId) !== -1) {
                                  haveSelectedPriceRange = true;
                                }
                                return (
                                  <div className="m-checkbox__button mdc-form-field" key={i}>
                                    <div className="m-checkbox mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded">
                                      <Input className="a-checkbox__input mdc-checkbox__native-control" type="checkbox" id={item.properties.dimensionValueId} checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} onClick={props.handleCheckbox.bind(this, itemObj)} />
                                      <div className="mdc-checkbox__background">
                                        <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                          <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                        </svg>
                                      </div>
                                    </div>

                                    <Label for={item.properties.dimensionValueId}>{item.label} ({item.count})</Label>
                                  </div>
                                )
                                // }
                              })}
                            </div>
                            <div className="row ml-0 mt-4">
                              <div className="a-price__filterInput">
                                <div className="form-group">
                                  <Input className="form-control" id="min-price-filter" value={((haveSelectedPriceRange || minTxtBox) ? minPrice : '')} type="text" aria-describedby="minPrice" placeholder="Mínimo" onChange={props.setMinMaxPrice} autoComplete="off" />
                                </div>
                              </div>
                              <div className="a-price__range"><span>-</span></div>
                              <div className="a-price__filterInput">
                                <div className="form-group">
                                  <Input className="form-control" id="max-price-filter" value={((haveSelectedPriceRange || maxTxtBox) ? maxPrice : '')} type="text" aria-describedby="maxPrice" placeholder="Máximo" onChange={props.setMinMaxPrice} autoComplete="off" />
                                </div>
                              </div>
                              <div className="a-price__filterButton" onClick={props.handleMinMaxPriceClick}>
                                <span className="next-button__filter"><i className="icon-arrow_right"></i></span>
                              </div>
                              {
                                showPriceErrorAlert && <span className="a-alert__input">El valor mínimo debe ser menor que el máximo</span>
                              }
                            </div>
                          </div>

                        </React.Fragment>
                        : (navigationItem.dimensionName === "Rating" && navigationItem.refinements && navigationItem.refinements.length > 0) ?
                          <div className="m-plp__filterSection">
                            <FilterTrigger text={navigationItem.name} handleArrowIcon={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? false : true} handleClick={(e) => props.handleOptions(e, navigationItem.dimensionName)} />
                            <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'plp-filter-options' : 'plp-filter-options active'}>
                              {!isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                // if(item.count > 1) {
                                const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                return (
                                  <div className="m-checkbox__button mdc-form-field" key={i}>
                                    <div className="m-checkbox mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded">
                                      <Input className="a-checkbox__input mdc-checkbox__native-control" type="checkbox" id={item.properties.dimensionValueId} checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} onClick={props.handleCheckbox.bind(this, itemObj)} />
                                      <div className="mdc-checkbox__background">
                                        <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                          <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                        </svg>
                                      </div>
                                    </div>
                                    <Label>
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
                                    </Label>
                                  </div>
                                )
                                // }
                              })}

                            </div>
                          </div>
                          : (navigationItem.refinements && navigationItem.refinements.length > 0 && navigationItem.dimensionName !== 'product.category')  ? //defect fix 24265
                            <React.Fragment>
                              <FilterTrigger text={navigationItem.name} handleArrowIcon={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? false : true} handleClick={(e) => props.handleOptions(e, navigationItem.dimensionName)} />
                              <div className={!isEmpty(showDynamicFacetOptions) && showDynamicFacetOptions.indexOf(navigationItem.dimensionName) !== -1 ? 'plp-filter-options' : 'plp-filter-options active'}>
                                {!isEmpty(navigationItem.refinements) && map(navigationItem.refinements, (item, i) => {
                                  // if(item.count > 1) {
                                  const itemObj = { label: item.label, id: item.properties.dimensionValueId, dimensionName: navigationItem.dimensionName, facetName: navigationItem.name, count: item.count };
                                  return (
                                    <div className="m-checkbox__button mdc-form-field" key={i}>
                                      <div className="m-checkbox mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded">
                                        <Input className="a-checkbox__input mdc-checkbox__native-control" type="checkbox" id={item.properties.dimensionValueId} checked={(filterIds.indexOf(item.properties.dimensionValueId) !== -1) ? true : false} onClick={props.handleCheckbox.bind(this, itemObj)} />
                                        <div className="mdc-checkbox__background">
                                          <svg className="mdc-checkbox__checkmark a-checkbox__svg" viewBox="0 0 24 24">
                                            <path className="mdc-checkbox__checkmark-path a-checkbox__path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                                          </svg>
                                        </div>
                                      </div>

                                      <Label for={item.properties.dimensionValueId}>{item.label} ({item.count})</Label>
                                    </div>
                                  )
                                  // }
                                })}
                              </div>
                            </React.Fragment>
                            : null
              }

            </div>
          )
        })
      }
    </React.Fragment>
  )
}

export default FilterPlp;
