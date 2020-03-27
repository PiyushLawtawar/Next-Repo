import React from 'react';
import Link from '../../../atoms/Link/Link';
import Span from "../../../atoms/Span/Span";
import List from "../../../atoms/List/List";
import Icons from "../../../atoms/Icons/Icons";
import SubMenu from './subMenu';

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            index,
            mouseOverOnSubcat,
            mouseOutOnSubcat,
            id,
            categoryLinkAjax,
            name,
            l2subcategories,
            totalcolms,
            imageUrl,
            subCatPercolumn,
            showcolms,
            seeAllText,
            href,
            asInfo,
            subMenuHeight,
            agentDetails
        } = this.props;
        const { isIpad } = agentDetails || {};
        return (
            <List className="menu-aim__item" key={index} data-submenu-id={id}>
                <Link className="menu-aim__item-name" onClick={(e) => categoryLinkAjax(e, href, asInfo)} href="#">
                    <Span className="a-menu-aim__item-text">{name}</Span>
                    <Icons className="a-menu-aim__item-icon icon-arrow_right" />
                </Link>
                <div className="menu-aim__item-submenu" id={id}>
                    <div className="container">
                        <div className="col-12 p-0">
                            <Link className="a-menu-aim__item-title" onClick={(e) => categoryLinkAjax(e, href, asInfo)} href="#">
                                <span>{name}</span>
                            </Link>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-xl-8">
                                <div className="row">
                                    <SubMenu
                                        l2subcategories={l2subcategories}
                                        totalcolms={totalcolms}
                                        subCatPercolumn={subCatPercolumn}
                                        showcolms={showcolms}
                                        index={index}
                                        categoryLinkAjax={categoryLinkAjax}
                                        seeAllText={seeAllText}
                                    />
                                </div>
                                {
                                    l2subcategories.length >= totalcolms ?
                                        <div className="row">
                                            <div className="col-12">
                                                <Link className="a-menu-aim__item-all" href="#" onClick={() => categoryLinkAjax(item.url)}>Ver todas las secciones</Link>
                                            </div>
                                        </div>
                                        : null
                                }
                            </div>
                            <div className="col-lg-4 align-self-end">
                                <div className="row" style={subMenuHeight}>
                                    <div className="col-12 text-right" dangerouslySetInnerHTML={{ __html: imageUrl }}>
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
            </List>
        )
    }
}
