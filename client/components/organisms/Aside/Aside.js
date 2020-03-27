import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import LeftNavigationMenu from '../../molecules/LeftNavigationMenu/LeftNavigationMenu';
import FilerSelection from '../../molecules/FilterSelection/FilterSelection';
import FilterPlp from '../../molecules/FilterPlp/FilterPlp';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Strong from '../../atoms/Strong/Strong';

export default (props) => {

    // const data = props.bodyContent.contentItem && props.bodyContent.contentItem.contents && props.bodyContent.contentItem.contents[0] && props.bodyContent.contentItem.contents[0]['secondaryContent'] && props.bodyContent.contentItem.contents[0]['secondaryContent'][1] && props.bodyContent.contentItem.contents[0]['secondaryContent'][1]["navigation"] || [];
    // const data = props.navigations;    /* production observation#158 */
    const { navigations, removeAllFilters, navCategoryInfo, searchTerm,termFromService, totalNumRecords, adjustedSearch, filterIds } = props;
    let navData = {};
    !isEmpty(navigations) && map(navigations, (item) => {
        const dimensionName = item.dimensionName || '';
        if (dimensionName == 'product.category') {
            navData = item;
        }
    })
    const navLength = navData.childCategories && navData.childCategories.length || 0;
    const isButtonEnabled = !isEmpty(termFromService) ? filterIds.length > 0 ? true : false : filterIds.length > 1 ? true : false; /* production observation#158 */

    return (
        <div className="o-aside">
            {
                !isEmpty(termFromService) && !isEmpty(adjustedSearch) && !isEmpty(adjustedSearch[0]) ? /* production observation#158 */
                    <H1 headLineClass="a-headline__typeahed" headLineText="Tu búsqueda de" haveChildren><Strong> {`"${termFromService}"`} </Strong>se ajusta a<Strong>{`  "${adjustedSearch[0]['adjustedTerms']}"`}</Strong></H1>
                    : null
            }
            { /* production observation#158 */
                !isEmpty(termFromService) ? <H1 headLineClass="a-headline__typeahed" headLineText="Tu Búsqueda" haveChildren><Strong> {!isEmpty(adjustedSearch[0]) ? `"${adjustedSearch[0]['adjustedTerms']}"` : `"${termFromService}"`} </Strong>arrojó <Strong>{totalNumRecords} </Strong>resultados</H1>
                    : null
            }
            {navLength > 0 &&
                <LeftNavigationMenu navData={navData} navCategoryInfo={navCategoryInfo} />
            }
            <FilerSelection linkClassName={!isButtonEnabled? '-btn__cleanDisabled': ''} removeAllFilters={removeAllFilters} />
            <FilterPlp {...props} />
        </div>

    );
}