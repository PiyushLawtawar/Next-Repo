import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import isEmpty from 'lodash/isEmpty';

export default (props) => {
    const { classNameLink, text, type, showPLP } = props || {};
    let { navUrl } = props || {};
    const categoryId = !isEmpty(navUrl) ? navUrl.split('/').reverse()[0] : '';
    let param = `categoryId=${categoryId}`;
    if(categoryId.indexOf('N-') !== -1) {
        param = `label=${categoryId}`;
    }
    let href = `/tienda/twoColumnCategoryPage?${param}`;
    if(typeof showPLP !== 'undefined' && showPLP) {
        href = `${href}&always=plp`;
    }
    if(isEmpty(navUrl) || navUrl === '#') {
        return (
            <div className={classNameLink}>
                <Link href={navUrl} className="a-category__link">
                    {type !== 'secondLevel' && <Icons className="icon-arrow_left" />}
                    {text}
                </Link>
            </div>
        );
    } else {
        if(typeof showPLP !== 'undefined' && showPLP) {
            navUrl = `${navUrl}?showPLP`;
        }
        return (
            <div className={classNameLink}>
                <Link href={href} asInfo={navUrl} classNameAnchor="a-category__link">
                    {type !== 'secondLevel' && <Icons className="icon-arrow_left" />}
                    {text}
                </Link>
            </div>
        );
    }    
}
