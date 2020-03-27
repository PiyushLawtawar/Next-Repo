import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import CategoryLeftNav from '../CategoryLeftNav/CategoryLeftNav';
import Ul from '../../atoms/Ul/Ul';

//import './LeftNavigationMenu.styl';

export default (props) => {

    const childCategories = props.navData.childCategories || []
    const { categoryL1, categoryL2, categoryNameCurrent = '' } = props.navCategoryInfo;
    const l1Name = categoryL1 && categoryL1.name || '';
    const l1Url = categoryL1 && categoryL1.url || '';
    const l2Name = categoryL2 && categoryL2.name || '';
    const l2Url = categoryL2 && categoryL2.url || '';

    return (
        <nav className="m-category_leftNavigation-menu">
            {l1Name && <CategoryLeftNav type="firstLevel" text={l1Name} navUrl={'/tienda' + l1Url} />}
            {l2Name && <CategoryLeftNav type="secondLevel" text={l2Name} navUrl={'/tienda' + l2Url} />}
            <Ul className="m-category__menuList">
                {
                    !isEmpty(childCategories) && map(childCategories, (item, index) => {
                        return (item.children) ?
                            <React.Fragment key={index}>
                                <CategoryLeftNav showPLP={item.showPLP} categoryName={categoryNameCurrent} type="subCategory" navUrl={'/tienda' + item.viewAllUrl} text={item.categoryName} classNameItem={(index == 0) ? "current" : ""}>
                                    <Ul className="m-subcategory__menuList">
                                        {
                                            map(item.children, (subItem, subIndex) => {
                                                return (subItem.children) ?
                                                    <React.Fragment>
                                                        <CategoryLeftNav showPLP={subItem.showPLP} categoryName={categoryNameCurrent} key={index + '-' + subIndex} type="subCategory" navUrl={'/tienda' + subItem.viewAllUrl} text={subItem.categoryName} classNameItem={(subIndex == 0) ? "current" : ""}>
                                                            <Ul className="m-subcategory__menuList">
                                                                {
                                                                    map(subItem.children, (deepItem, deepIndex) => {
                                                                        return <CategoryLeftNav showPLP={deepItem.showPLP} categoryName={categoryNameCurrent} key={index + '-' + subIndex + '-' + deepIndex} type="subCategory" navUrl={'/tienda' + deepItem.viewAllUrl} text={deepItem.categoryName} />
                                                                    })
                                                                }
                                                            </Ul>
                                                        </CategoryLeftNav>
                                                    </React.Fragment>
                                                    :
                                                    <CategoryLeftNav showPLP={subItem.showPLP} categoryName={categoryNameCurrent} key={index + '-' + subIndex} type="subCategory" navUrl={'/tienda' + subItem.viewAllUrl} text={subItem.categoryName} />
                                            })
                                        }
                                    </Ul>
                                </CategoryLeftNav>
                            </React.Fragment>
                            :
                            <CategoryLeftNav showPLP={item.showPLP} categoryName={categoryNameCurrent} key={index} type="subCategory" navUrl={'/tienda' + item.viewAllUrl} text={item.categoryName} />
                    })
                }
            </Ul>
        </nav>
    );
}
