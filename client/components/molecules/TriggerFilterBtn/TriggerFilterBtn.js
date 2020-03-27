import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';

export default (props) => {
return(
 <Link className="a-btn__filters" href="#" onClick={() => props.openModal(props.dataType)} data-toggle="modal" data-target="#filters-storeLocator" id="3d">Filtrar
                     <Icons className="icon-filtro" />
</Link>
);
}