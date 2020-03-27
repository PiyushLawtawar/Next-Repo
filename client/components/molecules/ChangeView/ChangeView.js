import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';

export default (props) => {
  const {classAnchor, idAnchor, clickFunction, classIcon} = props;
  return (
      <Link href="#" className={classAnchor} id={idAnchor} onClick={clickFunction}>
        <Icons className={classIcon} />
      </Link>
  );
}