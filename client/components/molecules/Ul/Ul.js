//import './Ul.styl';
import List from '../../atoms/List/List';
export default (props) => {
    return (
        <ul className={props.className}>
           <List className={props.classname} text={props.text}/>
           <List className={props.classname} text={props.text}/>
           <List className={props.classname} text={props.text}/>
           <List className={props.classname} text={props.text}/>
        </ul>
    );
}