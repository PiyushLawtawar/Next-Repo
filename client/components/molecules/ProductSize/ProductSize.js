//import './ProductSize.styl'
import React from 'react';
/*include ../../atoms/Paragraph/atom-paragraph.pug
include ../../atoms/Buttons/atom-buttons.pug*/
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Button from "../../atoms/Button/Button";
import Ul from "../../atoms/Ul/Ul";
import List from "../../atoms/List/List";
import Link from "../../atoms/Link/Link";
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

export default class ProductSize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMoreText: false,
            classnamesize:'p-0 m-0 m-product__size dBlock -noScroll' //defect id 23855 
        }
    }

    componentDidMount() {
        const elem = document.getElementById('size-list-container');
        if (!isEmpty(elem)) {
            const hasHorizontalScrollbar = elem.scrollWidth > elem.clientWidth;
            if (hasHorizontalScrollbar || window.outerWidth < 992) { //defect id 23855 
                 this.setState({ classnamesize: 'p-0 m-0 m-product__size' }); //defect id 23855 
                this.setState({ showMoreText: true });
            }
        }
    }
    render() {
        const sizeList = this.props.finalSortedSize || [];
        const colorCount = sizeList.length || 0;
        const staticLabels = this.props.staticLabels || {};
        const showMoreInfo = {
            showMoreTxt: staticLabels &&  staticLabels['pdpPage.color.show.more.label'] || 'pdpPage.color.show.more.label', // 'Mostrar todo',
            showLessTxt: staticLabels && staticLabels['pdpPage.color.show.less.label'] || 'pdpPage.color.show.less.label', // 'Mostrar menos',
            colorCount
        }
        const { showMoreText,classnamesize } = this.state;
        return (
            <div className="m-product__size -optic mt-4 mb-4"> {/* added mt-4 for bug id 23540 */}

                <React.Fragment>
                    <div className="row">
                        <div className="col-12">
                            <Paragraph className={this.props.size}>{this.props.text}:</Paragraph>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Ul className={classnamesize} id="size-list-container"> {/* added dBlock class for bug id 23540 */}
                                {
                                    map(this.props.finalSortedSize, (item, index) => {
                                        const isActive = parseInt(this.props.activeSizeIndex) === index
                                        return (
                                            <List key={'size' + index}>
                                                <Button
                                                    className={(item.disable) ? this.props.btnDissable : (isActive ? this.props.btnActive : this.props.btn)}
                                                    ripple=""
                                                    data-skuid={item.sizeid}
                                                    handleClick={(e) => this.props.getMaterialsBySize(index, item)}> {item.size} </Button>
                                            </List>
                                        )
                                    }
                                    )
                                }
                            </Ul>
                        </div>
                    </div>
                    {
                        showMoreText && colorCount > 4 &&
                        <div className="row m-product__sizeShow">
                            <div className="col-12">
                                <Link className="a-product__anchorSizes" href="#" id="size-show-more" onClick={() => { toggleShowMoreSize(showMoreInfo) }}>
                                    {`${showMoreInfo.showMoreTxt} (${showMoreInfo.colorCount})`}
                                </Link>
                            </div>
                        </div>
                    }
                </React.Fragment>
            </div>
        );
    }
}

const toggleShowMoreSize = (showMoreInfo) => {

    try {
        const sizeList = document.getElementById('size-list-container') || {};
        const sizeClassNames = sizeList.className || '';

        if (sizeClassNames.indexOf('dBlock') > -1) {

            const toggleShowSizeText = `${showMoreInfo.showMoreTxt} (${showMoreInfo.colorCount})`;
            document.getElementById('size-list-container').classList.remove('dBlock');
            document.getElementById('size-show-more').innerHTML = toggleShowSizeText;
        } else {

            document.getElementById('size-list-container').classList.add('dBlock');
            document.getElementById('size-show-more').innerHTML = showMoreInfo.showLessTxt;
        }
    } catch (e) { console.error("Toggle show size error: ", e); }
}
