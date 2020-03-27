import Link from '../../atoms/Link/Link';
import List from '../../atoms/List/List';
import isEmpty from 'lodash/isEmpty';

export default (props) => {
    const { classItem, text, categoryName, showPLP } = props;
    let { navUrl } = props;
    const categoryId = !isEmpty(navUrl) ? navUrl.split('/').reverse()[0] : '';
    let param = `categoryId=${categoryId}`;
    if (categoryId.indexOf('N-') !== -1) {
        param = `label=${categoryId}`;
    }
    let href = `/tienda/twoColumnCategoryPage?${param}`;
    if(typeof showPLP !== 'undefined' && showPLP) {
        href = `${href}&always=plp`;
    }
    if (isEmpty(navUrl) || navUrl === '#') {
        return (
            <List className={"a-category__title " + classItem}>
                <Link href={navUrl} className={categoryName === text ? 'a-category__listElement active' : 'a-category__listElement'}>{text}</Link>
                {props.children}
            </List>

        );
    } else {
        if(typeof showPLP !== 'undefined' && showPLP) {
            navUrl = `${navUrl}?showPLP`;
        }
        return (
            <List className={"a-category__title " + classItem}>
                <Link href={href} asInfo={navUrl} classNameAnchor={categoryName === text ? 'a-category__listElement active' : 'a-category__listElement'}>{text}</Link>
                {props.children}
            </List>

        );
    }
}
