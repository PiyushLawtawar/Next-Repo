import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Icons from '../../atoms/Icons/Icons';

export default (props) => {
  const { listView, changeGridView } = props.viewModeDetails;
  const { plpListView } = props;
  return (
      <div className="a-list__grid">
        <Link className={"a-grid-link" + (plpListView?' show':'')} href="javascript:void(0);" id="a-view-grid" onClick={changeGridView}>
          <Span id="a-view-list e">{(plpListView)?"Mosaico":"Lista"}</Span>
          <Icons className="icon-vistalista r"></Icons>
        </Link>
      </div>
  );
}