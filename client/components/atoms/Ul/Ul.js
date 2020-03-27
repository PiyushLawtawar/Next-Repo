//import './Ul.styl';
export default (props) => {
    return (
        <ul className={props.className} {...props}>
            {props.children}
        </ul>
    );
}