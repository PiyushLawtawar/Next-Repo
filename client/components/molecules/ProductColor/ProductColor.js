import Paragraph from "../../atoms/Paragraph/Paragraph";
import Span from "../../atoms/Span/Span";
import Link from "../../atoms/Link/Link";
import Image from "../../atoms/Tagimage/Image";
import Ul from "../../atoms/Ul/Ul";
import List from "../../atoms/List/List";
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { logError } from '../../../helpers/utilities/utility';


export default class ProductColor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMoreText: false
        }
    }

    componentDidMount() {
        const elem = document.getElementById('color-list-mobile');
        if (!isEmpty(elem)) {
            const hasHorizontalScrollbar = elem.scrollWidth > elem.clientWidth;
            if (hasHorizontalScrollbar || window.outerWidth < 992) {
                this.setState({ showMoreText: true });
            }
        }
    }



    render() {
        let colorLink = []
        const { showMoreText } = this.state;
        const { uniqueColorList } = this.props.collectionColorList || this.props;
        !isEmpty(uniqueColorList) && map(Object.keys(uniqueColorList), (colorName, objKey) => {
            const arr = uniqueColorList[colorName].split('|');
            let smooshSrc = '';
            const color_id = arr[0];
            if(arr.length > 1) {
                smooshSrc = arr[1];
                const skuId = arr[2];
                if(!isEmpty(arr[1]) && arr[1] !== 'empty') {
                    const colorStyle = { backgroundColor: color_id || "" };                    
                    colorLink.push(<List key={'color' + objKey} className={(Number(this.props.activeColorIndex) === objKey) ? this.props.colorCircleactive : this.props.colorcircle}>
                        <Link className={this.props.anchor} href="#" data-name="color0" style={colorStyle} onClick={(e) => {e.preventDefault(); this.props.getVariantsByColor(e, colorName, objKey, color_id, skuId)}}>                        
                            <Image src={smooshSrc} nonClickable="true" showLoader="true" id={skuId} className="maccolorsh" />                    
                        </Link>
                    </List>)
                } else {
                    colorLink.push(<List key={'color' + objKey} className={(Number(this.props.activeColorIndex) === objKey) ? this.props.colorCircleactive : this.props.colorcircle}>
                        <Link data-skuid={skuId} className={this.props.anchor + ' @@ ' + objKey + ':_:' + this.props.activeColorIndex} href="#" data-name="color0" style={{ backgroundColor: color_id }} onMouseOver={() => this.props.onColorHover && this.props.onColorHover(colorName)} onMouseLeave={() => this.props.onColorHover && this.props.onColorHover("")} onClick={(e) => {e.preventDefault(); this.props.getVariantsByColor(e, colorName, objKey, color_id, skuId)}}></Link>
                    </List>)
                }
            }
        })        
        // if (this.props.groupType != "" && this.props.groupType == "MAC") {
        //     for (const [index, [colorName, colorHexaCode]] of Object.entries(Object.entries(this.props.uniqueColorList))) {
        //         let smooshSrc = '', smooshSkuId = '';

        //         if (!isEmpty(colorHexaCode)) {
        //             let colorCodeArr = colorHexaCode.split("|");
        //             if (colorCodeArr.length > 2) {
        //                 smooshSrc = colorCodeArr[2] + '_sm';
        //                 smooshSkuId = 'maccolorsh_' + colorCodeArr[2];
        //             }
        //         }
        //         let colorStyle = { backgroundColor: colorHexaCode && colorHexaCode != null && colorHexaCode.split("|")[0] || "" };
        //         colorLink.push(<List key={'color' + index} className={(Number(this.props.activeColorIndex) === Number(index)) ? this.props.colorCircleactive : this.props.colorcircle}>
        //             <Link className={this.props.anchor} href="#" data-name="color0" style={colorStyle} onClick={(e) => this.props.getVariantsByColor(e, colorName, index, colorHexaCode.split("|")[0], colorHexaCode.split("|")[2]
        //             )}>
        //                 {smooshSrc !== '' &&
        //                     <Image src={this.props.carouselRecords && this.props.carouselRecords[smooshSrc] || ''} nonClickable="true" showLoader="true" id={smooshSkuId} className="maccolorsh" />
        //                 }
        //             </Link>


        //         </List>)
        //     }
        // }
        // else {
        //     let colorIndexArr = !isEmpty(this.props.uniqueColorList) && Object.keys(this.props.uniqueColorList) || [];
        //     !isEmpty(this.props.uniqueColorList) && map(this.props.uniqueColorList, (item, indexColorName) => {
        //         try {
        //             const itemArr = !isEmpty(item) && item.split('|') || [];
        //             const hexaColorCode = itemArr[0] || '';
        //             const colorId = itemArr[2] || '';
        //             const colorIndex = colorIndexArr.indexOf(indexColorName);
        //             colorLink.push(<List key={'color' + colorIndex} className={(Number(this.props.activeColorIndex) === Number(colorIndex)) ? this.props.colorCircleactive : this.props.colorcircle}>
        //                 <Link data-skuid={colorId} className={this.props.anchor + ' @@ ' + colorIndex + ':_:' + this.props.activeColorIndex} href="#" data-name="color0" style={{ backgroundColor: hexaColorCode }} onMouseOver={() => this.props.onColorHover && this.props.onColorHover(indexColorName)} onMouseLeave={() => this.props.onColorHover && this.props.onColorHover("")} onClick={(e) => this.props.getVariantsByColor(e, indexColorName, colorIndex, hexaColorCode, colorId)}></Link>
        //             </List>)

        //         } catch (e) {
        //             logError("Color error: ", e);
        //         }
        //     })
        // }

        let showAllClass = ' visible';
        const colorCount = colorLink.length || 0;
        const staticLabels = this.props.staticLabels || {};
        const showMoreInfo = {
            showMoreTxt: staticLabels && staticLabels['pdpPage.color.show.more.label'] || 'pdpPage.color.show.more.label', // 'Mostrar todo',
            showLessTxt: staticLabels && staticLabels['pdpPage.color.show.less.label'] || 'pdpPage.color.show.less.label', // 'Mostrar menos',
            colorCount
        }

        return (

            <div className={this.props.productColor}>
                <div className="row">
                    <div className="col-12">
                        <Paragraph className={this.props.productParaColor}>
                            {this.props.spanText}: <Span className={this.props.Productspancolor}>{this.props.hoverColorText != '' ? this.props.hoverColorText : this.props.colorText}</Span>
                        </Paragraph>
                    </div>
                </div>
                <div className="row">
                    < div className="col-12 pr-0" >
                        <div className={this.props.procolor}>
                            <Ul className="p-0 m-0" id="color-list-mobile">
                                {colorLink}
                            </Ul>
                        </div>
                    </div>
                </div>
                {
                    showMoreText && colorCount >= 5 &&
                    <div className="row">
                        <div className="col-12">
                            <Link className={this.props.anchorcolor + showAllClass} href="#" id="color-show-more" onClick={() => { toggleShowMoreColor(showMoreInfo); }}>
                                {`${showMoreInfo.showMoreTxt} (${showMoreInfo.colorCount})`}
                            </Link>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const toggleShowMoreColor = (showMoreInfo) => {

    try {
        const colorList = document.getElementById('color-list-mobile') || {};
        const colorClassNames = colorList.className || '';

        if (colorClassNames.indexOf('dBlock') > -1) {

            const toggleShowColorText = `${showMoreInfo.showMoreTxt} (${showMoreInfo.colorCount})`;
            document.getElementById('color-list-mobile').classList.remove('dBlock');
            document.getElementById('color-show-more').innerHTML = toggleShowColorText;
        } else {

            document.getElementById('color-list-mobile').classList.add('dBlock');
            document.getElementById('color-show-more').innerHTML = showMoreInfo.showLessTxt;
        }
    } catch (e) { logError("Toggle show color error: ", e); }
}
