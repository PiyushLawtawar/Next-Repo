import Paragraph from '../../atoms/Paragraph/Paragraph';
import Link from '../../atoms/Link/Link';

export default (props) => (
    <div className="plp-head-filter">
        <Paragraph >Filtros</Paragraph>
        <Link href="#" className={props.linkClassName} onClick={(e) => props.removeAllFilters(e)}>Limpiar Filtros</Link>
    </div>
)