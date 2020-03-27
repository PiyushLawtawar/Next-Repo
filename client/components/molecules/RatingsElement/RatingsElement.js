import List from '../../atoms/List/List'
import Icons from '../../atoms/Icons/Icons'

export default (props) => {
    return (
        <List><Icons className={props.classNameIcon}></Icons></List>
    );
}