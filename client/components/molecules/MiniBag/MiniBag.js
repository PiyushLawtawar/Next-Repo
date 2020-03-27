//import './MiniBag.styl';

import Link from '../../atoms/Link/Link';
import Icon from '../../atoms/Icon/Icon';

export default (props) => {
    return (
        <Link href="/" className="m-miniBag">
            <Icon name="icon-miniBag" />
            <span className="m-miniBag__itemCount">10</span>
        </Link>
    );
}