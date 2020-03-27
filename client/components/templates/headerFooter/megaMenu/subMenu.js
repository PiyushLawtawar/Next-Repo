import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Link from '../../../atoms/Link/Link';
import Span from "../../../atoms/Span/Span";
import List from "../../../atoms/List/List";
import { GetLinkData } from '../../../../helpers/utilities/utility';
import Ul from '../../../atoms/Ul/Ul';
 
export default class extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            l2subcategories,
            totalcolms,
            subCatPercolumn,
            showcolms,
            index,
            categoryLinkAjax,
            seeAllText
        } = this.props;
        return (
            !isEmpty(l2subcategories) ? map(l2subcategories, (subCatItem, subKey) => {
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
                        <div className={"col-lg-" + showcolms} key={`${index}${subKey}`}  style={{ height: '574px' }}>
                            <Span className="a-menu-aim__item-categoryTitle">{subCatItem.name}</Span>
                            <Ul className="m-meun-aim__category">
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

                                            return <List key={`${index}${subKey}${deepSubKey}`}>
                                                <Link className="a-menu-aim__item-link" onClick={(e) => categoryLinkAjax(e, href, asInfo)} href="#" >{deepSubCatItem.name}</Link>
                                            </List>
                                        }
                                    }) : null
                                }
                                {
                                    !isEmpty(subCatItem.l3subcategories) && subCatItem.l3subcategories.length > subCatPercolumn ?
                                        <List key="more">
                                            <Link className="a-desktop__subcategoryMore" onClick={(e) => categoryLinkAjax(e, viewMoreLink.href, viewMoreLink.asInfo)} href="#">{`${seeAllText} +`}</Link>
                                        </List>
                                        : null
                                }
                            </Ul>
                        </div>
                    )
                }
            }) : null

        )
    }
}