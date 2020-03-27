//import './Span.styl';

export default ({spanText,spanClassname, ...props }) => {
    return (
      
            <span className={spanClassname} {...props }>
                 {props.children}
            </span>
       
    );
}