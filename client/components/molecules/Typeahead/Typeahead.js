
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { CardTypeahead } from "../../molecules/Card/Card";
import SearchBarMobileModal from "../../molecules/SearchBarMobileModal/SearchBarMobileModal";
import { GetLinkData } from '../../../helpers/utilities/utility';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Ul from '../../atoms/Ul/Ul';
import { Anchorimage, Spanicon, Buttonicon, ButtonSpanIcon, AnchorSpan, AnchorStrongLabel, AnchorLabelStrong, AnchorStrongLabelSpan } from "../../molecules/MixinMolecules/MixinMolecules";
//import './Typeahead.styl';
import { MIN_TYPEHEAD_LENGTH } from '../../../../client/config/constants';
import Link from "../../atoms/Link/Link";
import { getFilteredString } from '../../../helpers/utilities/utility';

class Typehead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCardImg: false,
            typeheadResponse: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.typeheadResponse !== this.props.typeheadResponse) {
            // this.getPdpDetail(nextProps.typeheadResponse);
            this.setState({ showCardImg: false });
            this.setState({ typeheadResponse: nextProps.typeheadResponse }, () => {
                this.setState({ showCardImg: true });
            });
        }
    }

    getPdpDetail = (typeheadResponse) => {
        const { getPdpDetail } = this.props;
        const dimensionSearchGroups = get(typeheadResponse, 'contentItem.contents[0].autoSuggest[0].dimensionSearchGroups', {});
        let url = '';
        let count = 0;
        let data = {};
        let dimensionSearchValues = {};
        if (!isEmpty(dimensionSearchGroups) && Array.isArray(dimensionSearchGroups) && map(dimensionSearchGroups, (item) => {
            if (item.dimensionName === 'product.typeahead_prodTitle_prodId') {
                dimensionSearchValues = get(item, 'dimensionSearchValues', {});
                if (!isEmpty(dimensionSearchValues) && Array.isArray(dimensionSearchValues) && dimensionSearchValues.length === 1) {
                    count = 1;
                    const label = dimensionSearchValues[0].label;
                    const label_arr = label.split("|");
                    url = `/tienda/pdp/${label_arr[1].split(" ").join("-").toLowerCase()}/${label_arr[0]}?typeahead=yes`;
                    if (!isEmpty(label_arr[3]) && label_arr[3] !== '/sp/') {
                        url = `/tienda/${label_arr[3]}${label_arr[1].split(" ").join("-").toLowerCase()}/${label_arr[0]}?typeahead=yes`;
                    }
                    data = { 'url': url, 'count': count };
                }
            }
        }))
            getPdpDetail(data);
    }

    render() {
        const { typeheadResponse, searchTerm, onChangeSearchbar, handleTypeheadShow, handleTypeheadHide, onKeypress, redirectToUrl, clearSearchbar, GtmCall } = this.props;
        const contentItem = !isEmpty(typeheadResponse) ? get(typeheadResponse, 'contentItem', '') : '';
        const contents = !isEmpty(contentItem) ? get(contentItem, 'contents', '') : '';
        const autoSuggest = !isEmpty(contents) ? get(contents[0], 'autoSuggest', '') : '';
        const dimensionSearchGroups = !isEmpty(autoSuggest) ? get(autoSuggest[0], 'dimensionSearchGroups', '') : '';
        const { showCardImg } = this.state;
        return (
            <div className="m-typeahead">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-12 results">
                            <div className="row d-flex d-lg-none">
                                <SearchBarMobileModal clearSearchbar={clearSearchbar} onKeypress={onKeypress} handleTypeheadShow={handleTypeheadShow} handleTypeheadHide={handleTypeheadHide} onChangeSearchbar={onChangeSearchbar} searchTerm={searchTerm} />
                            </div>
                            {
                                searchTerm.length >= MIN_TYPEHEAD_LENGTH && showCardImg ?
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="m-header__searchLinkResult">
                                                <AnchorSpan typeaheadclass="a-header__typeaheadLink" onClick={(e) => redirectToUrl(e, `/tienda/twoColumnCategoryPage?s=${searchTerm}`, `/tienda?s=${searchTerm}`)} href="#" anchorText={`${searchTerm} en`} spanText="Todos los Departamentos" />
                                                {
                                                    !isEmpty(dimensionSearchGroups) && Array.isArray(dimensionSearchGroups) ? map(dimensionSearchGroups, (items, index) => {
                                                        if (items.dimensionName === 'product.category') {
                                                            return !isEmpty(items.dimensionSearchValues) && Array.isArray(items.dimensionSearchValues) ? map(items.dimensionSearchValues, (item, key) => {
                                                                const label = item.label;
                                                                const ancestorsCount = get(item, 'properties.ancestorsCount', '0');
                                                                const labelId = get(item, 'properties.labelId', '');
                                                                let asInfo = `/tienda/${label.split(" ").join("-").toLowerCase()}/${item.properties['category.repositoryId']}`;
                                                                let href = `/tienda/twoColumnCategoryPage?categoryId=${item.properties['category.repositoryId']}`;
                                                                if (!isEmpty(ancestorsCount) && ancestorsCount >= 5 && !isEmpty(labelId)) {
                                                                    asInfo = `/tienda/${label.split(" ").join("-").toLowerCase()}/${labelId}`;
                                                                    href = `/tienda/twoColumnCategoryPage?label=${labelId}`;
                                                                }
                                                                if (isEmpty(item.ancestors)) {
                                                                    const text = getLabel(searchTerm, label, item.properties['category.displayName']);
                                                                    const new_text = <div dangerouslySetInnerHTML={{ __html: text }} />
                                                                    return <Link onClick={(e) => redirectToUrl(e, href, asInfo)} href="#" className="a-header__typeaheadLink typeahead-link" key="noAncestor">{new_text}</Link>
                                                                }
                                                                return !isEmpty(item.ancestors) ? map(item.ancestors, (subItem, subkey) => {
                                                                    const text = getLabel(searchTerm, label, subItem.label);
                                                                    const new_text = <div dangerouslySetInnerHTML={{ __html: text }} />
                                                                    return (
                                                                        // <AnchorSpan href={href} key={`${index}${key}${subkey}`} typeaheadclass="a-header__typeaheadLink" anchorText={`${label} en`} spanText={subItem.label} />
                                                                        <Link onClick={(e) => redirectToUrl(e, href, asInfo)} href="#" className="a-header__typeaheadLink typeahead-link" key={`${index}${key}${subkey}`}>{new_text}</Link>
                                                                        //  <AnchorStrongLabelSpan onClick={(e) => redirectToUrl(e, href, asInfo)} href="#" key={`${index}${key}${subkey}`} typeaheadclass="a-header__typeaheadLink typeahead-link" strongText={label} text="en" spanText={subItem.label} />
                                                                    )
                                                                }) : null
                                                            }) : null
                                                        }
                                                    }) : null
                                                }

                                                {/* <AnchorStrongLabel typeaheadclass="a-header__typeaheadLink" strongText="xbox" text="360" />
                                    <AnchorLabelStrong typeaheadclass="a-header__typeaheadLink" text="consola" strongText="xbox" />
                                    <AnchorStrongLabelSpan typeaheadclass= "a-header__typeaheadLink" strongText="XBOX" text="en" spanText="consola"/> */}
                                            </div>
                                        </div>
                                    </div> : null
                            }
                        </div>
                        {
                            searchTerm.length >= MIN_TYPEHEAD_LENGTH && showCardImg ?
                                <div className="col-lg-8 col-12">
                                    <div className="row">
                                        <div className="col-12 pt-3 pb-3">
                                            <Paragraph className="a-typeahead-title">Lo más buscado</Paragraph>
                                        </div>
                                    </div>
                                    <Ul className="row p-2">
                                        {
                                            !isEmpty(dimensionSearchGroups) && Array.isArray(dimensionSearchGroups) ? map(dimensionSearchGroups, (items, index) => {
                                                if (items.dimensionName === 'product.typeahead_prodTitle_prodId') {
                                                    return !isEmpty(items.dimensionSearchValues) && Array.isArray(items.dimensionSearchValues) ? map(items.dimensionSearchValues, (item, key) => {
                                                        const label = item.label;
                                                        const label_arr = label.split("|");
                                                        // let url = `/tienda/pdp/${label_arr[1].split(" ").join("-").toLowerCase()}/${label_arr[0]}?typeahead=yes`;
                                                        let inputData = {
                                                            productId: label_arr[0],
                                                            productName: getFilteredString(label_arr[1].split(" ").join("-")),
                                                            pageName: 'productDetails',
                                                            pdpTypeForSPA: 'default',
                                                            typeahead: 'yes'
                                                        }
                                                        if (!isEmpty(label_arr[3]) && label_arr[3] !== '/sp/') {
                                                            // url = `/tienda/${label_arr[3]}${label_arr[1].split(" ").join("-").toLowerCase()}/${label_arr[0]}?typeahead=yes`;
                                                            let tmpLable = label_arr[3];
                                                            inputData.pageUrl = tmpLable;
                                                            if (tmpLable.indexOf('pdp/hp') > -1) {
                                                                inputData.pdpTypeForSPA = 'hybrid';
                                                            } else if (tmpLable.indexOf('group/') > -1) {
                                                                inputData.pdpTypeForSPA = 'collection';
                                                            }
                                                        }


                                                        const { href, asInfo } = GetLinkData(inputData);

                                                        return <CardTypeahead key={`${index}${key}`}
                                                            className="a-search-suggestion-title"
                                                            imgAlt={label_arr[1]}
                                                            imgPath={label_arr[2]}
                                                            title={label_arr[1]}
                                                            href={href}
                                                            asInfo={asInfo}
                                                            searchTerm={searchTerm}
                                                            clearSearchbar={clearSearchbar}
                                                            handleTypeheadHide={handleTypeheadHide}
                                                            pdpTypeForSPA={inputData.pdpTypeForSPA}
                                                            onClick={GtmCall}
                                                        />
                                                    }) : null
                                                }
                                            }) : null
                                        }
                                    </Ul>
                                </div> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Typehead;

const getLabel = (searchTerm, title, spanText) => {
    let str = title;
    title = title.toLowerCase();
    searchTerm = searchTerm.toLowerCase();
    if (title.indexOf(searchTerm) !== -1) {
        const startIndex = title.indexOf(searchTerm);
        const len = searchTerm.length;
        const lastIndex = startIndex + len;
        str = str.replace(str.substring(startIndex, lastIndex), `</label><strong class="showWhiteSpace">${str.substring(startIndex, lastIndex)}</strong><label class="showWhiteSpace">`);
        return `<label class="showWhiteSpace">${str}</label><label class="showWhiteSpace"> en </label><span class="showWhiteSpace">${spanText}</span>`;
    }
    return `<strong class="showWhiteSpace">${title}</strong><label class="showWhiteSpace"> en </label><span class="showWhiteSpace">${spanText}</span>`;
}
