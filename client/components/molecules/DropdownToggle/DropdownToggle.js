import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import isEmpty from 'lodash/isEmpty';

export default (props) => {
  const {dropdownText,menuID, classNameAnchor, classNameIcon, onDropdownToggle, sortSelected} = props;
  return (
      <Link href="#" className={classNameAnchor} id={menuID} onClick={onDropdownToggle}> {/*role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"*/}
        {!isEmpty(sortSelected) ? sortSelected: dropdownText}
        <Icons className={classNameIcon} />
      </Link>
  );
}