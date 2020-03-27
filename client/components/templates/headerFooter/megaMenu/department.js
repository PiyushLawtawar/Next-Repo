import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Link from '../../../atoms/Link/Link';
import Span from "../../../atoms/Span/Span";
import List from "../../../atoms/List/List";
import Icons from "../../../atoms/Icons/Icons";
import { SHOW_TOTAL_COLUMNS, SHOW_TOTAL_CELLS } from '../../../../../client/config/constants';
import { GetLinkData, getBrandName } from '../../../../../client/helpers/utilities/utility';

const DepartmentMenu = (props) => {
  const data = props.deptMenuData;
  const { headerData } = props;
  const { isIpad } = props.agentDetails || {};
  const maxColumns = (headerData && !isEmpty(headerData.megaMenu)) ? Number(headerData.megaMenu[0].maxColumns) : 0;
  const seeAllText = (headerData && !isEmpty(headerData.megaMenu)) ? headerData.megaMenu[0].seeAllText : '';
  const subCatPercolumn = (headerData && !isEmpty(headerData.megaMenu)) ? Number(headerData.megaMenu[0].subcategoriesPerColumn) : 0;
  const maxDepth = (headerData && !isEmpty(headerData.megaMenu)) ? Number(headerData.megaMenu[0].maxDepth) : 0;
  const totalcolms = maxDepth * maxColumns;
  let showcolms = SHOW_TOTAL_CELLS / maxColumns;
  const maxRootCategoriesCount = headerData && headerData.megaMenu && headerData.megaMenu.length > 0 && headerData.megaMenu[0].maxRootCategoriesCount || 0;


  return (
    <React.Fragment>
      {
        !isEmpty(data) && data.l1Categories.length > 0 ? map(data.l1Categories, (item, index) => {
          if (index <= maxRootCategoriesCount - 1) {
            const catUrl = item.url || '';
            const inputData = {
              catId: catUrl.split('/').pop(),
              catName: catUrl.split('/')[2],
              pageName: 'CLP',
              always: typeof item.showPLP !== 'undefined' && item.showPLP? 'plp': '' 
            }

            const { href, asInfo } = GetLinkData(inputData);
            let BrandName = 'LP'
            if (typeof window !== 'undefined') {
              BrandName = getBrandName(window);
            }
            let subMenuHeight = { height: '512px' } // default 
            if (BrandName.brand !== 'LP') {
              subMenuHeight = { height: '350px' } // for MS 
            }

            return <List className="m-megamenu__category" key={index} data-submenu-id={item.id} onClick={() => { if (isIpad) { props.mouseOverOnSubcat(item.id) } }} onMouseOver={() => props.mouseOverOnSubcat(item.id)} onMouseOut={() => props.mouseOutOnSubcat(item.id)}>
              <Link className="a-dekstop__categoryLink" onClick={(e) => props.categoryLinkAjax(e, href, asInfo)} href="#"> {/*href="#" onClick={() => props.categoryLinkAjax(item.url)}    --- handleClick={(e) => handleClick(e, href, asInfo)}*/}
                <div className="row">
                  <div className="col-lg-10">
                    <Span>{item.name}</Span>
                  </div>
                  <div className="col-lg-2">
                    <Icons className="icon-arrow_right" />
                  </div>
                </div>
              </Link>
              <div className="m-desktop__submenu">
                <div className="popover" id={item.id} style={{ top: '0px', left: '240px', height: '574px' }}>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <Link className="a-desktop__submenuTitle" onClick={(e) => props.categoryLinkAjax(e, href, asInfo)} href="#"> {/* href="#" onClick={() => props.categoryLinkAjax(item.url)} */}
                          <span>{item.name}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="row align-items-top">
                      <div className="col-lg-8 category-menu">
                        <div className="row">
                          {

                            !isEmpty(item.l2subcategories) ? map(item.l2subcategories, (subCatItem, subKey) => {
                              if (subKey < totalcolms) {
                                let viewMoreLink = {};
                                if (!isEmpty(subCatItem.l3subcategories) && subCatItem.l3subcategories.length > subCatPercolumn) {
                                  const viewMoreUrl = subCatItem.url || '';

                                  const viewMoreInputData = {
                                    catId: viewMoreUrl.split('/').pop(),
                                    catName: viewMoreUrl.split('/')[2],
                                    pageName: 'CLP',
                                    always: typeof subCatItem.showPLP !== 'undefined' && subCatItem.showPLP? 'plp': '' 
                                  }
                                  viewMoreLink = GetLinkData(viewMoreInputData);
                                }
                                return (
                                  <div className="col-lg-4 pb-3" key={`${index}${subKey}`}>
                                    <Span className="a-desktop__categoryTitle">{subCatItem.name}</Span>
                                    <ul className="m-desktop-subcategory-list">
                                      {
                                        !isEmpty(subCatItem.l3subcategories) ? map(subCatItem.l3subcategories, (deepSubCatItem, deepSubKey) => {
                                          if (deepSubKey <= subCatPercolumn - 1) {
                                            const subCatUrl = deepSubCatItem.url || '';
                                            const subInputData = {
                                              catId: subCatUrl.split('/').pop(),
                                              catName: subCatUrl.split('/')[2],
                                              pageName: 'CLP',
                                              always: typeof deepSubCatItem.showPLP !== 'undefined' && deepSubCatItem.showPLP ? 'plp': ''
                                            }

                                            const { href, asInfo } = GetLinkData(subInputData);

                                            return <List key={`${index}${subKey}${deepSubKey}`} >
                                              <Link className="a-desktop__subcategoryTitle" onClick={(e) => props.categoryLinkAjax(e, href, asInfo)} href="#" >{deepSubCatItem.name}</Link> {/* href="#" onClick={() => props.categoryLinkAjax(deepSubCatItem.url)} */}
                                            </List>
                                          }
                                        }) : null
                                      }
                                      {
                                        !isEmpty(subCatItem.l3subcategories) && subCatItem.l3subcategories.length > subCatPercolumn ?
                                          <List key="more">
                                            <Link className="a-desktop__subcategoryMore" onClick={(e) => props.categoryLinkAjax(e, viewMoreLink.href, viewMoreLink.asInfo)} href="#">{`${seeAllText} +`}</Link> {/* href="#" onClick={() => props.categoryLinkAjax(subCatItem.url)} */}
                                          </List>
                                          : null
                                      }
                                    </ul>
                                  </div>
                                )
                              }
                            }) : null
                          }
                        </div>
                        {
                          item['l2subcategories'].length >= totalcolms ?
                            <div className="row all-sections">
                              <div className="col-lg-12">
                                <Link className="a-desktop__moreTitle" href="#" onClick={(e) => props.categoryLinkAjax(e, href, asInfo)}>Ver todas las secciones</Link>
                              </div>
                            </div>
                            : null
                        }
                      </div>
                      <div className="col-lg-4">
                        <div className="row align-items-end" style={subMenuHeight}>
                          <div className="col-12 pr-0 text-right" dangerouslySetInnerHTML={{ __html: item.imageUrl }}>
                            {/* <Link className="a-desktop__subcategoryImg" href="#">
                                                        <figure className="m-0">
                                                            <img src={item.imageUrl} alt="Image" />
                                                        </figure>
                                                    </Link> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </List>
          }
        })
          : null
      }
    </React.Fragment>
  )
}

// const DepartmentMenu = React.memo(Department);
export default DepartmentMenu;
