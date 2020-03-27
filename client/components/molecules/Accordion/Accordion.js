import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { GetLinkData } from '../../../helpers/utilities/utility';
import Link from '../../atoms/Link/Link';
import List from '../../atoms/List/List';
import Icons from '../../atoms/Icons/Icons';
import Ul from '../../atoms/Ul/Ul';
import { H3 } from '../../atoms/HeadLines/Headlines';

//import './Accordion.styl';

class Accordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accordionData: JSON.parse(JSON.stringify(props.accordionData))
        };
    }
    handleAccordion(index, childCategories) {
        if (!isEmpty(childCategories)) {
            const { accordionData } = this.state;
            accordionData[index].isOpen = !accordionData[index].isOpen;
            this.setState({
                accordionData: accordionData
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.accordionData !== this.props.accordionData) {
            this.setState({ accordionData: JSON.parse(JSON.stringify(nextProps.accordionData)) });
        }
     }
    render() {
        const { categoryName } = this.props;
        const { accordionData } = this.state;
        return (
            <nav className="o-nav-sideBar-blpClp">
                {
                    !isEmpty(accordionData) ? map(accordionData, (items, index) => {
                        return <div className="card nav-item" key={index}>


                            {/* <div className={items.isOpen ? 'card-header' : 'card-header collapsed'} data-toggle="collapse" data-target={`#target${index}`} aria-expanded={items.isOpen} aria-controls={`target${index}`} id={`object${index}`} onClick={this.handleAccordion.bind(this, index, items.children)}>*/}


                            <div className="card-header d-flex justify-content-between align-items-center" data-target={`#target${index}`} aria-expanded={items.isOpen} aria-controls={`target${index}`} id={`object${index}`} onClick={this.handleAccordion.bind(this, index, items.children)}>
                                <H3 headLineClass={categoryName === items.categoryName ? 'labelClassname active' : 'labelClassname'} headLineText={items.categoryName} />
                                <Icons className="icon-arrow_down" />
                            </div>



                            {
                                !isEmpty(items.children) ?
                                    <div className={items.isOpen ? 'show-accord' : 'hide-accord'} aria-labelledby={`object${index}`} id={`target${index}`}>
                                        <div className="card-body pt-0 pb-lg-0">
                                            <Ul className="m-0">
                                                {
                                                    !isEmpty(items.children) ? map(items.children, (item, key) => {

                                                        const catUrl = item.viewAllUrl || '';
                                                        const inputData = {
                                                            catId: catUrl.split('/').pop(),
                                                            catName: catUrl.split('/')[1],
                                                            pageName: 'CLP',
                                                            always: typeof item.showPLP !== 'undefined' && item.showPLP? 'plp': ''
                                                        }
                                                        const { href, asInfo } = GetLinkData(inputData);
                                                        return (
                                                            <List key={`${index}${key}`} className={!isEmpty(item.children) ? 'p-0 removeBorder': 'p-0'}>
                                                                <Link classNameAnchor={categoryName === item.categoryName ? 'nav-link active' : 'nav-link'} href={href} asInfo={asInfo}> {/* href={"/tienda" + item.viewAllUrl} */}
                                                                    {item.categoryName}
                                                                </Link>
                                                                {
                                                                    !isEmpty(item.children) ?
                                                                        <Ul className="nav-sub-options">
                                                                            {
                                                                                map(item.children, (subItem, subKey) => {
                                                                                    const subCatUrl = subItem.viewAllUrl || '';
                                                                                    const subInputData = {
                                                                                        catId: subCatUrl.split('/').pop(),
                                                                                        catName: subCatUrl.split('/')[1],
                                                                                        pageName: 'CLP',
                                                                                        always: typeof subItem.showPLP !== 'undefined' && subItem.showPLP? 'plp': ''
                                                                                    }
                                                                                    const subLinkData = GetLinkData(subInputData);
                                                                                    const subHref = subLinkData.href;
                                                                                    const subAsInfo = subLinkData.asInfo;                            
                                                                                    return <List key={`${index}${key}${subKey}`} className="nav-sub-link">
                                                                                        <Link classNameAnchor={categoryName === subItem.categoryName ? 'nav-link active' : 'nav-link'} href={subHref} asInfo={subAsInfo}> {/* href={"/tienda" + item.viewAllUrl} */}
                                                                                            {subItem.categoryName}
                                                                                        </Link>
                                                                                    </List>
                                                                                })
                                                                            }
                                                                        </Ul>
                                                                        : null
                                                                }
                                                            </List>
                                                        )
                                                    }) : null
                                                }
                                            </Ul>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>

                    }) : null
                }
            </nav>
        )
    }
}

export default Accordion;