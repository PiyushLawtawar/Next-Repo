import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { SHOW_TOTAL_COLUMNS,SHOW_TOTAL_CELLS } from '../../../../config/constants';
import { GetLinkData, getBrandName } from '../../../../helpers/utilities/utility';
import MenuItem from './menuItem';
import Ul from '../../../atoms/Ul/Ul';
import menuAim  from 'menu-aim';

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const element = document.querySelector('.menu-aim')
        const options = {
          menuItemSelector: '.menu-aim__item',
          menuItemActiveClassName: 'menu-aim__item--active',
          menuItemSubMenuSelector: '.menu-aim__item-submenu',
          delayingClassName: 'menu-aim--delaying'
        }
        menuAim(element, options)
    }    
    render() {
        const data = this.props.deptMenuData;
        const { headerData, className, mouseOverOnSubcat, mouseOutOnSubcat, categoryLinkAjax, agentDetails } = this.props;
        const maxColumns = (headerData && !isEmpty(headerData.megaMenu)) ? Number(headerData.megaMenu[0].maxColumns) : 0;
        const seeAllText = (headerData && !isEmpty(headerData.megaMenu)) ? headerData.megaMenu[0].seeAllText : '';
        const subCatPercolumn = (headerData && !isEmpty(headerData.megaMenu)) ? Number(headerData.megaMenu[0].subcategoriesPerColumn) : 0;
        const maxDepth = (headerData && !isEmpty(headerData.megaMenu)) ? Number(headerData.megaMenu[0].maxDepth) : 0;
        const totalcolms = maxDepth * maxColumns;
        let showcolms = SHOW_TOTAL_CELLS / maxColumns;
        const maxRootCategoriesCount = headerData && headerData.megaMenu && headerData.megaMenu.length > 0 && headerData.megaMenu[0].maxRootCategoriesCount || 0;

        return (
            <Ul className={className}>
                {
                    !isEmpty(data) && data.l1Categories.length > 0 ? map(data.l1Categories, (item, index) => {
                        if (index <= maxRootCategoriesCount - 1) {
                            const catUrl = item.url || '';
                            const inputData = {
                                catId: catUrl.split('/').pop(),
                                catName: catUrl.split('/')[2],
                                pageName: 'CLP'
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
                            return <MenuItem
                                key={index}
                                id={item.id}
                                mouseOverOnSubcat={mouseOverOnSubcat}
                                mouseOutOnSubcat={mouseOutOnSubcat}
                                categoryLinkAjax={categoryLinkAjax}
                                name={item.name}
                                totalcolms={totalcolms}
                                l2subcategories={item['l2subcategories']}
                                imageUrl={item.imageUrl}
                                subCatPercolumn={subCatPercolumn}
                                showcolms={showcolms}
                                seeAllText={seeAllText}
                                href={href}
                                asInfo={asInfo}
                                subMenuHeight={subMenuHeight}
                                agentDetails={agentDetails}
                            />
                        }
                    }) : null

                }
            </Ul>
        )
    }
}

export default Menu;