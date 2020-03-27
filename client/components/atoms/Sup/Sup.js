//import './Sup.styl';

 export default ({supText,supClassname, ...props }) => {
    return (
        <sup className={`${supClassname}`} {...props } >
            {props.children}
        </sup>
    );
}